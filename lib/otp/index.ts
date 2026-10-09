// OTPProvider abstraction. Add a provider = implement `send` and register it below.
export interface OTPProvider { send(mobile: string, code: string): Promise<void>; }
const { SMS_API_KEY: KEY = "", SMS_API_SECRET: SECRET = "", SMS_SENDER_ID: SENDER = "" } = process.env;

const twilio: OTPProvider = { async send(mobile, code) {
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${KEY}/Messages.json`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: mobile, From: SENDER, Body: `Your Organic Farming AI OTP is ${code}. Valid for 5 minutes.` }),
  });
  if (!r.ok) throw new Error("twilio " + r.status);
}};
const msg91: OTPProvider = { async send(mobile, code) {
  const r = await fetch("https://control.msg91.com/api/v5/otp?" + new URLSearchParams({ template_id: SENDER, mobile: mobile.replace("+", ""), otp: code }), {
    method: "POST", headers: { authkey: KEY, "Content-Type": "application/json" } });
  if (!r.ok) throw new Error("msg91 " + r.status);
}};
const providers: Record<string, OTPProvider> = { twilio, msg91 };
export function getOTPProvider(): OTPProvider {
  const p = providers[process.env.SMS_PROVIDER ?? ""];
  if (!p) throw new Error("SMS_PROVIDER not configured");
  return p;
}
