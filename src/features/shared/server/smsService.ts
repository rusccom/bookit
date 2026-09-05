import { getEnv, isSmsConfigured } from "@/features/shared/server/env";

export async function sendOtpSms(input: { code: string; phone: string }) {
  if (!isSmsConfigured()) return previewResult(input.code);
  const env = getEnv();
  const body = new URLSearchParams({ Body: `Bookit verification code: ${input.code}`,
    From: env.TWILIO_FROM_NUMBER || "", To: input.phone });
  const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString("base64");
  const response = await fetch(twilioUrl(env.TWILIO_ACCOUNT_SID || ""), {
    body, headers: { Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded" }, method: "POST"
  });
  if (!response.ok) throw new Error("SMS delivery failed");
  return { delivered: true, preview: null };
}

function previewResult(code: string) {
  return { delivered: false,
    preview: `SMS provider is not configured. Verification code: ${code}` };
}

function twilioUrl(accountId: string) {
  return `https://api.twilio.com/2010-04-01/Accounts/${accountId}/Messages.json`;
}
