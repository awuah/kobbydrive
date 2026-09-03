import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { generateApplicationNumber } from "@/lib/utils";
import { sendApplicationReceivedSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      surname,
      last_name,
      gender,
      title,
      id_type,
      id_number,
      date_of_birth,
      place_of_birth,
      postal_address,
      house_address,
      nationality,
      email,
      phone_number,
      electoral_area,
      training_purpose,
      signature_data,
    } = body;

    // Validate required fields
    if (
      !surname ||
      !last_name ||
      !gender ||
      !title ||
      !id_type ||
      !id_number ||
      !date_of_birth ||
      !place_of_birth ||
      !house_address ||
      !email ||
      !phone_number ||
      !electoral_area ||
      !training_purpose ||
      !signature_data
    ) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const applicationNumber = generateApplicationNumber();

    const { data, error } = await supabase
      .from("kbdr_applications")
      .insert([
        {
          application_number: applicationNumber,
          surname: surname.trim(),
          last_name: last_name.trim(),
          gender: gender.trim(),
          title: title.trim(),
          id_type: id_type.trim(),
          id_number: id_number.trim(),
          date_of_birth,
          place_of_birth: place_of_birth.trim(),
          postal_address: postal_address?.trim() || null,
          house_address: house_address.trim(),
          nationality: nationality?.trim() || "Ghanaian",
          email: email.trim().toLowerCase(),
          phone_number: phone_number.trim(),
          electoral_area: electoral_area?.trim() || "Amanful West",
          training_purpose: training_purpose?.trim() || "Personal",
          signature_data,
          status: "pending",
          admin_notes: "",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to record application." },
        { status: 500 }
      );
    }

    // Log the event
    await supabase.from("kbdr_application_logs").insert([
      {
        application_id: data.id,
        action: "application_submitted",
        new_status: "pending",
        notes: "Candidate submitted public driving school application.",
        performed_by: "applicant",
      },
    ]);

    // Send immediate SMS notification via Arkesel (Sender ID: KOBBYMP)
    try {
      const smsResult = await sendApplicationReceivedSMS({
        title: title?.trim(),
        surname: surname.trim(),
        last_name: last_name.trim(),
        phone_number: phone_number.trim(),
        application_number: data.application_number,
      });

      // Log SMS status
      await supabase.from("kbdr_application_logs").insert([
        {
          application_id: data.id,
          action: "sms_sent",
          notes: smsResult.success
            ? `Confirmation SMS sent to ${phone_number.trim()} via KOBBYMP.`
            : `Failed to send SMS: ${smsResult.error || "Unknown error"}`,
          performed_by: "system",
        },
      ]);
    } catch (smsErr) {
      console.error("SMS notification trigger failed:", smsErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: data.id,
          application_number: data.application_number,
          created_at: data.created_at,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    const phone = searchParams.get("phone");

    if (!ref && !phone) {
      return NextResponse.json(
        { success: false, error: "Please provide an Application Reference Number or Phone Number." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    let query = supabase.from("kbdr_applications").select(`
      id,
      application_number,
      surname,
      last_name,
      title,
      gender,
      id_type,
      id_number,
      date_of_birth,
      place_of_birth,
      house_address,
      nationality,
      email,
      phone_number,
      electoral_area,
      training_purpose,
      status,
      created_at,
      updated_at
    `);

    if (ref) {
      query = query.ilike("application_number", ref.trim());
    } else if (phone) {
      query = query.ilike("phone_number", `%${phone.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
