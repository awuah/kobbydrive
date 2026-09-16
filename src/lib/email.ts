import nodemailer from "nodemailer";

const ADMIN_NOTIFICATION_EMAIL = "info@kobbydogood.org";

export interface ApplicationEmailData {
  application_number: string;
  title: string;
  surname: string;
  last_name: string;
  gender: string;
  id_type: string;
  id_number: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  phone_number: string;
  email: string;
  house_number: string;
  house_address: string;
  postal_address?: string | null;
  electoral_area: string;
  training_purpose: string;
  training_schedule?: string;
  passport_photo?: string;
  signature_data?: string;
  created_at: string;
}

/**
 * Creates a Nodemailer transport instance using available environment variables
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
}

/**
 * Sends a copy of the candidate application dossier to info@kobbydogood.org
 */
export async function sendApplicationEmailNotification(
  app: ApplicationEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullName = `${app.title} ${app.surname} ${app.last_name}`;
    const subject = `[New Application] ${app.application_number} - ${fullName} (${app.electoral_area || "Takoradi"})`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Candidate Application - Kobby Free Driving School</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
    .badge { display: inline-block; background: #059669; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
    .content { padding: 24px; }
    .photo-box { text-align: center; margin-bottom: 20px; }
    .photo-img { width: 120px; height: 150px; object-fit: cover; border-radius: 8px; border: 2px solid #cbd5e1; }
    .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    .table th, .table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: left; }
    .table th { background: #f8fafc; color: #64748b; font-weight: 600; width: 35%; }
    .table td { color: #0f172a; font-weight: 500; }
    .sig-box { margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; text-align: center; }
    .sig-img { max-height: 70px; max-width: 200px; }
    .footer { padding: 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">New Candidate Submission</div>
      <h2 style="margin: 0; font-size: 20px;">Kobby Free Driving School</h2>
      <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">Application Reference: <strong style="color: #34d399;">${app.application_number}</strong></p>
    </div>

    <div class="content">
      ${
        app.passport_photo
          ? `<div class="photo-box">
              <img src="${app.passport_photo}" alt="Passport Photo" class="photo-img" />
              <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Candidate Passport Photo</div>
            </div>`
          : ""
      }

      <table class="table">
        <tr><th>Application Number</th><td><strong style="color: #059669;">${app.application_number}</strong></td></tr>
        <tr><th>Full Name</th><td><strong>${fullName}</strong></td></tr>
        <tr><th>Gender & Title</th><td>${app.gender} (${app.title})</td></tr>
        <tr><th>ID Document</th><td>${app.id_type}: <strong>${app.id_number}</strong></td></tr>
        <tr><th>Date of Birth</th><td>${app.date_of_birth}</td></tr>
        <tr><th>Place of Birth</th><td>${app.place_of_birth}</td></tr>
        <tr><th>Nationality</th><td>${app.nationality}</td></tr>
        <tr><th>Phone Number</th><td><a href="tel:${app.phone_number}" style="color: #059669; text-decoration: none; font-weight: bold;">${app.phone_number}</a></td></tr>
        <tr><th>Email Address</th><td><a href="mailto:${app.email}" style="color: #0284c7; text-decoration: none;">${app.email}</a></td></tr>
        <tr><th>Takoradi Constituency Locality</th><td><strong style="color: #0f172a; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${app.electoral_area}</strong></td></tr>
        <tr><th>House No.</th><td><strong>${app.house_number}</strong></td></tr>
        <tr><th>House / Residential Address</th><td>${app.house_address}</td></tr>
        ${app.postal_address ? `<tr><th>Postal Address</th><td>${app.postal_address}</td></tr>` : ""}
        <tr><th>Driver Training Purpose</th><td><strong style="color: #047857;">${app.training_purpose}</strong></td></tr>
        <tr><th>Preferred Training Schedule</th><td><strong style="color: #0284c7;">${app.training_schedule || "Unscheduled"}</strong></td></tr>
        <tr><th>Submission Timestamp</th><td>${new Date(app.created_at).toLocaleString()}</td></tr>
      </table>

      ${
        app.signature_data
          ? `<div class="sig-box">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Applicant Digital Signature:</div>
              <img src="${app.signature_data}" alt="Digital Signature" class="sig-img" />
            </div>`
          : ""
      }
    </div>

    <div class="footer">
      This is an automated candidate record copy sent directly to ${ADMIN_NOTIFICATION_EMAIL}.<br>
      © ${new Date().getFullYear()} Kobby Free Driving School Initiative
    </div>
  </div>
</body>
</html>
`;

    // 1. Try Resend if RESEND_API_KEY is available
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Kobby Free Driving School <applications@kobbydogood.org>",
            to: [ADMIN_NOTIFICATION_EMAIL],
            subject,
            html: htmlContent,
          }),
        });

        if (resendRes.ok) {
          console.log(`[EMAIL] Copy successfully sent via Resend API to ${ADMIN_NOTIFICATION_EMAIL}`);
          return { success: true };
        } else {
          const errText = await resendRes.text();
          console.warn(`[EMAIL] Resend API error:`, errText);
        }
      } catch (rErr) {
        console.warn(`[EMAIL] Resend attempt failed:`, rErr);
      }
    }

    // 2. Try Nodemailer SMTP
    const transporter = createTransporter();
    if (transporter) {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || "applications@kobbydogood.org";
      await transporter.sendMail({
        from: `Kobby Free Driving School <${from}>`,
        to: ADMIN_NOTIFICATION_EMAIL,
        subject,
        html: htmlContent,
      });
      console.log(`[EMAIL] Copy successfully sent via SMTP to ${ADMIN_NOTIFICATION_EMAIL}`);
      return { success: true };
    }

    // 3. Fallback: Log payload info
    console.log(
      `[EMAIL NOTICE] New application submission ${app.application_number} for ${ADMIN_NOTIFICATION_EMAIL}. (Configure SMTP_HOST/USER/PASS or RESEND_API_KEY to deliver live outbound emails).`
    );
    return { success: true };
  } catch (err: any) {
    console.error("[EMAIL] Failed to send email copy:", err);
    return { success: false, error: err.message || "Email error" };
  }
}