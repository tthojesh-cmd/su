import { createHmac } from "crypto";
// Kept outside route files: Next.js route files may only export HTTP handlers.
export const hashOtp = (mobile: string, code: string) => createHmac("sha256", process.env.OTP_HASH_SECRET!).update(`${mobile}:${code}`).digest("hex");
