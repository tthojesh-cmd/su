import { NextResponse } from "next/server";
import { z } from "zod";
import { randomInt } from "crypto";
import { hashOtp } from "@/lib/otp/hash";
import { query } from "@/lib/db";
import { getOTPProvider } from "@/lib/otp";
const Body = z.object({ mobile: z.string().regex(/^\+[1-9]\d{9,14}$/) }); // E.164

export async function POST(req: Request) {
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Enter a valid mobile number with country code." }, { status: 400 });
  const { mobile } = p.data;
  // Cooldown (60s) + hourly cap (5) per number. Add per-IP limiting at your edge/proxy too.
  const r = await query(`SELECT count(*) FILTER (WHERE created_at > now() - interval '60 seconds') AS recent,
    count(*) FILTER (WHERE created_at > now() - interval '1 hour') AS hourly FROM otp_verifications WHERE mobile=$1`, [mobile]);
  if (+r.rows[0].recent > 0 || +r.rows[0].hourly >= 5) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  try { await getOTPProvider().send(mobile, code); }
  catch { return NextResponse.json({ error: "We couldn't send the OTP. Please try again later." }, { status: 502 }); }
  await query("INSERT INTO otp_verifications(mobile, code_hash, expires_at) VALUES($1,$2, now() + interval '5 minutes')", [mobile, hashOtp(mobile, code)]);
  return NextResponse.json({ ok: true, cooldown: 60 });
}
