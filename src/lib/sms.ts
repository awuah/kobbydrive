/**
 * Arkesel SMS Gateway Integration
 * Sender ID: KOBBYMP
 */

const DEFAULT_ARKESEL_KEY = "OmpKdHhGSDdoTkVDclpseHg=";

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return "";
  // Remove all non-digits except leading +
  let cleaned = phone.replace(/[^\d+]/g, "").trim();
  
  // Format Ghanaian numbers: 024XXXXXXX -> 23324XXXXXXX or keep 024XXXXXXX (Arkesel handles both)
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

export async function sendArkeselSMS(
  recipient: string,
  message: string,
  customApiKey?: string
): Promise<{ success: boolean; error?: string; response?: any }> {
  try {
    const apiKey =
      customApiKey ||
      process.env.ARKESEL_API_KEY ||
      DEFAULT_ARKESEL_KEY;

    const formattedRecipient = sanitizePhoneNumber(recipient);

    if (!formattedRecipient) {
      console.warn("Arkesel SMS: Empty or invalid recipient number.");
      return { success: false, error: "Invalid recipient phone number" };
    }

    const url = new URL("https://sms.arkesel.com/sms/api");
    url.searchParams.set("action", "send-sms");
    url.searchParams.set("api_key", apiKey.trim());
    url.searchParams.set("to", formattedRecipient);
    url.searchParams.set("from", "KOBBYMP");
    url.searchParams.set("sms", message);

    console.log(`[SMS] Sending via KOBBYMP to: ${formattedRecipient}...`);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`[SMS] Arkesel HTTP Failed (${response.status}):`, responseText);
      return { success: false, error: `HTTP ${response.status}: ${responseText}` };
    }

    console.log(`[SMS] Arkesel response:`, responseText);
    return { success: true, response: responseText };
  } catch (err: any) {
    console.error("[SMS] Arkesel SMS error:", err);
    return { success: false, error: err.message || "Network error" };
  }
}

/**
 * Sends immediate confirmation SMS to applicant upon submission
 */
export async function sendApplicationReceivedSMS(applicant: {
  title?: string;
  surname: string;
  last_name: string;
  phone_number: string;
  application_number: string;
}) {
  const name = applicant.title
    ? `${applicant.title} ${applicant.surname}`
    : `${applicant.surname} ${applicant.last_name}`;

  const message = `Dear ${name}, your application for the Kobby Free Driving School program has been received (Ref: ${applicant.application_number}). You will be updated on the status soon. Thank you!`;

  return await sendArkeselSMS(applicant.phone_number, message);
}

/**
 * Sends approval notification SMS to applicant when status is approved
 */
export async function sendApplicationApprovedSMS(applicant: {
  title?: string;
  surname: string;
  last_name: string;
  phone_number: string;
  application_number: string;
}) {
  const name = applicant.title
    ? `${applicant.title} ${applicant.surname}`
    : `${applicant.surname} ${applicant.last_name}`;

  const message = `Congratulations ${name}! Your application for the Kobby Free Driving School program (Ref: ${applicant.application_number}) has been APPROVED. You will be contacted with your training schedule and orientation details. Thank you!`;

  return await sendArkeselSMS(applicant.phone_number, message);
}

/**
 * Sends congratulations SMS when an applicant passes the Ghana Drivers Guide Theory Examination (>= 80%)
 */
export async function sendTheoryTestPassedSMS(applicant: {
  name: string;
  phone_number: string;
  application_number: string;
  scorePercentage: number;
}) {
  const message = `Congratulations ${applicant.name}! You scored ${applicant.scorePercentage}% in the Kobby Free Driving School Theory Exam (Pass Mark: 80%). Please be on alert for an upcoming SMS with your scheduled date and time for SIMULATOR TRAINING at our center. The simulator training will help you build muscle memory for steering, pedal control, and vehicle handling before your on-road car training. Keep your phone on. Thank you!`;

  return await sendArkeselSMS(applicant.phone_number, message);
}

/**
 * Sends an invitation SMS to an applicant or cohort inviting them to take the theory test
 */
export async function sendTheoryTestInvitationSMS(applicant: {
  name: string;
  phone_number: string;
  application_number: string;
  testUrl: string;
}) {
  const message = `Hello ${applicant.name}, you have been selected and invited to take the Kobby Free Driving School Theory Exam. Please click this link to take your test: ${applicant.testUrl} (Pass mark is 80%). You can re-take the test if needed. Good luck!`;

  return await sendArkeselSMS(applicant.phone_number, message);
}

