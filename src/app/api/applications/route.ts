import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { generateApplicationNumber, parseTrainingDetails } from "@/lib/utils";
import { sendApplicationReceivedSMS } from "@/lib/sms";
import { sendApplicationEmailNotification } from "@/lib/email";

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
      house_number,
      house_address,
      nationality,
      email,
      phone_number,
      electoral_area,
      training_purpose,
      training_schedule,
      is_employed,
      passport_photo,
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
      !house_number ||
      !house_address ||
      !email ||
      !phone_number ||
      !electoral_area ||
      !training_purpose ||
      !passport_photo ||
      !signature_data
    ) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided, including your passport photograph." },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const applicationNumber = generateApplicationNumber();

    const rawPurpose = training_purpose?.trim() || "Personal";
    const rawSchedule = training_schedule?.trim() || "unscheduled";
    const rawEmployed = is_employed?.trim() === "Yes" ? "Yes" : "No";
    const finalPurpose = `${rawPurpose} || Schedule: ${rawSchedule} || Employed: ${rawEmployed}`;

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
          house_number: house_number.trim(),
          house_address: house_address.trim(),
          nationality: nationality?.trim() || "Ghanaian",
          email: email.trim().toLowerCase(),
          phone_number: phone_number.trim(),
          electoral_area: electoral_area?.trim() || "Amanful West",
          training_purpose: finalPurpose,
          passport_photo,
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
        notes: `Candidate submitted public driving school application. Schedule: ${rawSchedule}.`,
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

    // Send copy of submission to info@kobbydogood.org
    try {
      const emailResult = await sendApplicationEmailNotification({
        application_number: data.application_number,
        title: title?.trim(),
        surname: surname.trim(),
        last_name: last_name.trim(),
        gender: gender.trim(),
        id_type: id_type.trim(),
        id_number: id_number.trim(),
        date_of_birth,
        place_of_birth: place_of_birth.trim(),
        nationality: nationality?.trim() || "Ghanaian",
        phone_number: phone_number.trim(),
        email: email.trim().toLowerCase(),
        house_number: house_number.trim(),
        house_address: house_address.trim(),
        postal_address: postal_address?.trim() || null,
        electoral_area: electoral_area?.trim() || "Amanful West",
        training_purpose: rawPurpose,
        training_schedule: rawSchedule,
        is_employed: rawEmployed,
        passport_photo,
        signature_data,
        created_at: data.created_at,
      });

      // Log Email notification status
      await supabase.from("kbdr_application_logs").insert([
        {
          application_id: data.id,
          action: "email_sent",
          notes: emailResult.success
            ? "Submission copy dispatched to info@kobbydogood.org."
            : `Email delivery attempt: ${emailResult.error || "Logged"}`,
          performed_by: "system",
        },
      ]);
    } catch (emailErr) {
      console.error("Email notification trigger failed:", emailErr);
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
      house_number,
      house_address,
      nationality,
      email,
      phone_number,
      electoral_area,
      training_purpose,
      passport_photo,
      status,
      created_at,
      updated_at
    `);

    if (ref) {
      query = query.ilike("application_number", ref.trim()).limit(1);
    } else if (phone) {
      query = query.ilike("phone_number", `%${phone.trim()}%`).limit(5);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const mappedData = (data || []).map((app) => {
      const { purpose, schedule } = parseTrainingDetails(app.training_purpose);
      return {
        ...app,
        training_purpose: purpose,
        training_schedule: schedule,
      };
    });

    return NextResponse.json({ success: true, data: mappedData }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
