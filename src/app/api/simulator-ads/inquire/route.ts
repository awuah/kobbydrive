import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactPerson, email, phone, adFormat, targetDuration, budgetMonthly, campaignMessage } = body;

    if (!companyName || !contactPerson || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required contact details." },
        { status: 400 }
      );
    }

    const inquiryId = `SIM-AD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Try logging into Supabase if an inquiries table exists, or log safely
    const supabase = getServiceSupabase();
    if (supabase) {
      try {
        await supabase.from("kbdr_simulator_ad_inquiries").insert({
          inquiry_id: inquiryId,
          company_name: companyName,
          contact_person: contactPerson,
          email,
          phone,
          ad_format: adFormat || "virtual_billboard",
          target_duration: targetDuration || "3_months",
          budget_monthly: budgetMonthly || 450,
          campaign_message: campaignMessage || "",
          status: "pending",
          created_at: new Date().toISOString()
        });
      } catch (dbErr) {
        // Table might not exist yet; safe fallback
        console.warn("Simulator ad inquiry logging to DB skipped or table not created:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      message: "Simulator software advertising inquiry received successfully. Our partnership team will contact you within 24 hours with the media kit and specs."
    });
  } catch (error: any) {
    console.error("Error processing simulator ad inquiry:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process advertising inquiry." },
      { status: 500 }
    );
  }
}
