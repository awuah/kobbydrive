import { NextRequest, NextResponse } from "next/server";
import { GHANA_DRIVERS_GUIDE_QUESTIONS } from "@/lib/theory-questions";
import {
  checkApplicantInvitation,
  saveTheoryTestAttempt,
  TheoryTestAttempt,
} from "@/lib/theory-store";
import { sendTheoryTestPassedSMS } from "@/lib/sms";
import { getServiceSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("ref") || searchParams.get("phone") || searchParams.get("id") || "";

    if (!identifier.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter your Application Reference Number or Registered Phone Number to access the test.",
        },
        { status: 400 }
      );
    }

    const check = await checkApplicantInvitation(identifier);

    if (!check.isInvited) {
      return NextResponse.json(
        {
          success: false,
          isInvited: false,
          error: check.error || "You are not scheduled for this examination batch.",
          applicant: check.applicant ? { surname: check.applicant.surname, status: check.applicant.status } : null,
        },
        { status: 403 }
      );
    }

    // Return the question bank stripped of correct answer indexes for security
    const clientQuestions = GHANA_DRIVERS_GUIDE_QUESTIONS.map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
    }));

    return NextResponse.json({
      success: true,
      isInvited: true,
      applicant: {
        id: check.applicant.id,
        applicationNumber: check.applicant.application_number,
        fullName: `${check.applicant.title ? check.applicant.title + " " : ""}${check.applicant.surname} ${check.applicant.last_name}`.trim(),
        phoneNumber: check.applicant.phone_number,
        electoralArea: check.applicant.electoral_area,
      },
      invitation: check.invitation,
      questions: clientQuestions,
      totalQuestions: clientQuestions.length,
      passPercentage: 80,
    });
  } catch (err: any) {
    console.error("GET /api/theory/test error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { applicationId, applicationNumber, answers } = body;

    if (!applicationId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { success: false, error: "Application details and completed answers are required." },
        { status: 400 }
      );
    }

    const check = await checkApplicantInvitation(applicationNumber || applicationId);
    if (!check.isInvited || !check.applicant) {
      return NextResponse.json(
        { success: false, error: "Access expired or applicant is not authorized to submit." },
        { status: 403 }
      );
    }

    const candidate = check.applicant;
    const candidateName = `${candidate.title ? candidate.title + " " : ""}${candidate.surname} ${candidate.last_name}`.trim();

    // Grade the answers against official question bank
    let correctCount = 0;
    const totalQuestions = GHANA_DRIVERS_GUIDE_QUESTIONS.length;
    const wrongAnswers: TheoryTestAttempt["wrongAnswers"] = [];
    const categoryBreakdown: TheoryTestAttempt["categoryBreakdown"] = {};

    GHANA_DRIVERS_GUIDE_QUESTIONS.forEach((q) => {
      if (!categoryBreakdown[q.category]) {
        categoryBreakdown[q.category] = { correct: 0, total: 0, percentage: 0 };
      }
      categoryBreakdown[q.category].total++;

      const selectedIndex = answers[q.id];
      const isCorrect = typeof selectedIndex === "number" && selectedIndex === q.correctAnswerIndex;

      if (isCorrect) {
        correctCount++;
        categoryBreakdown[q.category].correct++;
      } else {
        const selectedText =
          typeof selectedIndex === "number" && q.options[selectedIndex]
            ? q.options[selectedIndex]
            : "No answer selected";
        wrongAnswers.push({
          questionId: q.id,
          question: q.question,
          category: q.category,
          selectedAnswer: selectedText,
          correctAnswer: q.options[q.correctAnswerIndex],
          explanation: q.explanation,
          guideReference: q.guideReference,
        });
      }
    });

    // Calculate percentage breakdown
    Object.keys(categoryBreakdown).forEach((cat) => {
      const item = categoryBreakdown[cat];
      item.percentage = Math.round((item.correct / item.total) * 100);
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 80;

    const attemptNumber = (check.invitation?.attemptsCount || 0) + 1;
    const completedAt = new Date().toISOString();

    const attemptRecord: TheoryTestAttempt = {
      id: `attempt_${candidate.id}_${Date.now()}`,
      applicationId: candidate.id,
      applicationNumber: candidate.application_number,
      candidateName,
      phoneNumber: candidate.phone_number,
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      attemptNumber,
      categoryBreakdown,
      wrongAnswers,
      completedAt,
    };

    // Save attempt record
    await saveTheoryTestAttempt(attemptRecord);

    // Record in database application logs
    try {
      const supabase = getServiceSupabase();
      await supabase.from("kbdr_application_logs").insert([
        {
          application_id: candidate.id,
          action: passed ? "THEORY_TEST_PASSED" : "THEORY_TEST_FAILED",
          notes: `Theory Exam Attempt #${attemptNumber}: Scored ${correctCount}/${totalQuestions} (${percentage}%). ${
            passed ? "PASSED (>=80%)" : "FAILED (<80% - Eligible for Retake)"
          }.`,
          performed_by: "system",
        },
      ]);
    } catch (dbErr) {
      console.warn("Could not write theory test log:", dbErr);
    }

    // Trigger SMS notification if student scored 80% or higher
    let smsDispatched = false;
    let smsError = null;

    if (passed && candidate.phone_number) {
      try {
        const smsRes = await sendTheoryTestPassedSMS({
          name: candidateName,
          phone_number: candidate.phone_number,
          application_number: candidate.application_number,
          scorePercentage: percentage,
        });
        smsDispatched = smsRes.success;
        if (!smsRes.success) smsError = smsRes.error;
      } catch (err: any) {
        console.error("SMS dispatch error for theory test passed:", err);
        smsError = err.message;
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        score: correctCount,
        totalQuestions,
        percentage,
        passed,
        attemptNumber,
        categoryBreakdown,
        wrongAnswers,
        completedAt,
        smsDispatched,
        smsError,
      },
    });
  } catch (err: any) {
    console.error("POST /api/theory/test error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
