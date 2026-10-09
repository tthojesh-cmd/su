import { NextResponse } from "next/server";
import { z } from "zod";
import { timingSafeEqual } from "crypto";
import { query } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashOtp } from "@/lib/otp/hash";
const Body = z.object({ mobile: z.string().regex(/^\+[1-9]\d{9,14}$/), code: z.string().regex(/^\d{6}$/),
  name: z.string().max(100).optional(), email: z.string().email().optional(), language: z.enum(["en", "te"]).optional(), location: z.string().max(150).optional() });

export async function POST(req: Request) {
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Please enter the correct OTP." }, { status: 400 });
  const { mobile, code, name, email, language, location } = p.data;
  const o = (await query("SELECT * FROM otp_verifications WHERE mobile=$1 AND verified=false ORDER BY created_at DESC LIMIT 1", [mobile])).rows[0];
  if (!o) return NextResponse.json({ error: "Please request a new OTP." }, { status: 400 });
  if (new Date(o.expires_at) < new Date()) return NextResponse.json({ error: "This OTP has expired. Please request a new OTP." }, { status: 400 });
  if (o.attempts >= 5) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  await query("UPDATE otp_verifications SET attempts = attempts + 1 WHERE id=$1", [o.id]);
  const a = Buffer.from(hashOtp(mobile, code)), b = Buffer.from(o.code_hash);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Please enter the correct OTP." }, { status: 400 });
  await query("UPDATE otp_verifications SET verified=true WHERE id=$1", [o.id]);
  // Login or signup in one step: create the user the first time a mobile is verified.
  const u = (await query(`INSERT INTO users(mobile, name, email) VALUES($1,$2,$3)
    ON CONFLICT (mobile) DO UPDATE SET name = COALESCE(users.name, EXCLUDED.name) RETURNING id, role, disabled`, [mobile, name ?? null, email ?? null])).rows[0];
  if (u.disabled) return NextResponse.json({ error: "This account is disabled." }, { status: 403 });
  await query("INSERT INTO profiles(user_id, language, location) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [u.id, language ?? "en", location ?? null]);
  await createSession(u.id, u.role);
  return NextResponse.json({ ok: true });
}
