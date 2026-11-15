import { getServiceSupabase } from "@/lib/supabase";

export interface TheoryTestAttempt {
  id: string;
  applicationId: string;
  applicationNumber: string;
  candidateName: string;
  phoneNumber: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  categoryBreakdown: Record<
    string,
    { correct: number; total: number; percentage: number }
  >;
  wrongAnswers: Array<{
    questionId: string;
    question: string;
    category: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
    guideReference: string;
  }>;
  completedAt: string;
}

export type TheoryTestResult = TheoryTestAttempt;

export interface TheoryInvitation {
  id: string;
  applicationId: string;
  applicationNumber: string;
  candidateName: string;
  phoneNumber: string;
  invitedAt: string;
  invitedBy: string;
  status: "invited" | "in_progress" | "passed" | "remedial";
  attemptsCount: number;
  bestScorePercentage: number;
  lastAttemptAt?: string;
  notes?: string;
}

const INVITATIONS_KEY = "theory_test_invitations_store";
const RESULTS_KEY = "theory_test_results_store";

// In-memory cache
let cachedInvitations: TheoryInvitation[] | null = null;
let cachedResults: TheoryTestAttempt[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 10000; // 10s

export function invalidateTheoryCache() {
  cachedInvitations = null;
  cachedResults = null;
  cacheTime = 0;
}

/**
 * Fetch all invitations
 */
export async function getTheoryInvitations(): Promise<TheoryInvitation[]> {
  const now = Date.now();
  if (cachedInvitations && now - cacheTime < CACHE_TTL) {
    return cachedInvitations;
  }

  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("kbdr_settings")
      .select("value")
      .eq("key", INVITATIONS_KEY)
      .maybeSingle();

    if (data && data.value) {
      cachedInvitations = JSON.parse(data.value);
      cacheTime = now;
      return cachedInvitations || [];
    }
  } catch (err) {
    console.error("Error reading theory invitations:", err);
  }

  cachedInvitations = [];
  return [];
}

/**
 * Save invitations array
 */
export async function saveTheoryInvitations(invitations: TheoryInvitation[]): Promise<void> {
  cachedInvitations = invitations;
  cacheTime = Date.now();
  try {
    const supabase = getServiceSupabase();
    await supabase.from("kbdr_settings").upsert(
      {
        key: INVITATIONS_KEY,
        value: JSON.stringify(invitations),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  } catch (err) {
    console.error("Error saving theory invitations:", err);
  }
}

/**
 * Fetch all test attempt results
 */
export async function getTheoryResults(): Promise<TheoryTestAttempt[]> {
  const now = Date.now();
  if (cachedResults && now - cacheTime < CACHE_TTL) {
    return cachedResults;
  }

  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("kbdr_settings")
      .select("value")
      .eq("key", RESULTS_KEY)
      .maybeSingle();

    if (data && data.value) {
      cachedResults = JSON.parse(data.value);
      cacheTime = now;
      return cachedResults || [];
    }
  } catch (err) {
    console.error("Error reading theory test results:", err);
  }

  cachedResults = [];
  return [];
}

/**
 * Save a new test result attempt
 */
export async function saveTheoryTestAttempt(attempt: TheoryTestAttempt): Promise<void> {
  const allResults = await getTheoryResults();
  allResults.unshift(attempt); // latest first
  cachedResults = allResults;
  cacheTime = Date.now();

  try {
    const supabase = getServiceSupabase();
    await supabase.from("kbdr_settings").upsert(
      {
        key: RESULTS_KEY,
        value: JSON.stringify(allResults.slice(0, 5000)), // retain up to 5,000 attempts
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  } catch (err) {
    console.error("Error saving theory test attempt:", err);
  }

  // Also update corresponding invitation status
  const invitations = await getTheoryInvitations();
  const targetInv = invitations.find((i) => i.applicationId === attempt.applicationId);
  if (targetInv) {
    targetInv.attemptsCount = (targetInv.attemptsCount || 0) + 1;
    targetInv.lastAttemptAt = attempt.completedAt;
    if (attempt.percentage > (targetInv.bestScorePercentage || 0)) {
      targetInv.bestScorePercentage = attempt.percentage;
    }
    targetInv.status = attempt.passed ? "passed" : "remedial";
    await saveTheoryInvitations(invitations);
  }
}

/**
 * Checks if an applicant is invited to take the theory test
 */
export async function checkApplicantInvitation(
  searchQuery: string
): Promise<{
  isInvited: boolean;
  invitation?: TheoryInvitation;
  applicant?: any;
  error?: string;
}> {
  const clean = searchQuery.trim().toLowerCase();
  if (!clean) {
    return { isInvited: false, error: "Please enter your Application Reference or Phone Number." };
  }

  const supabase = getServiceSupabase();

  // Find applicant in kbdr_applications
  const { data: applicant } = await supabase
    .from("kbdr_applications")
    .select("id, application_number, surname, last_name, title, phone_number, status, electoral_area, admin_notes")
    .or(`application_number.ilike.%${clean}%,phone_number.ilike.%${clean}%`)
    .limit(1)
    .maybeSingle();

  if (!applicant) {
    return {
      isInvited: false,
      error: "No applicant record found with this Reference or Phone Number. Please check and try again.",
    };
  }

  // Check invitation list
  const invitations = await getTheoryInvitations();
  const inv = invitations.find(
    (i) =>
      i.applicationId === applicant.id ||
      i.applicationNumber.toLowerCase() === applicant.application_number.toLowerCase() ||
      i.phoneNumber.replace(/[^\d]/g, "") === applicant.phone_number.replace(/[^\d]/g, "")
  );

  // Also check if admin tagged them in admin_notes or status
  const notesCheck = (applicant.admin_notes || "").toLowerCase().includes("theory_invited");

  if (!inv && !notesCheck) {
    return {
      isInvited: false,
      applicant,
      error:
        "You are registered, but your batch has not yet been scheduled for the Theory Examination. Your cohort administrator will notify you by SMS once your test window opens.",
    };
  }

  return {
    isInvited: true,
    invitation: inv || {
      id: "inv_" + applicant.id,
      applicationId: applicant.id,
      applicationNumber: applicant.application_number,
      candidateName: `${applicant.title ? applicant.title + " " : ""}${applicant.surname} ${applicant.last_name}`.trim(),
      phoneNumber: applicant.phone_number,
      invitedAt: new Date().toISOString(),
      invitedBy: "Admin",
      status: "invited",
      attemptsCount: 0,
      bestScorePercentage: 0,
    },
    applicant,
  };
}
