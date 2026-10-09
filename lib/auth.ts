import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET);
export async function createSession(userId: string, role: string) {
  const token = await new SignJWT({ role }).setSubject(userId).setExpirationTime("30d").setProtectedHeader({ alg: "HS256" }).sign(secret());
  cookies().set("session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}
export async function getSession(): Promise<{ id: string; role: string } | null> {
  const t = cookies().get("session")?.value;
  if (!t) return null;
  try { const { payload } = await jwtVerify(t, secret()); return { id: payload.sub!, role: payload.role as string }; } catch { return null; }
}
export const requireAdmin = async () => { const s = await getSession(); return s?.role === "admin" ? s : null; };
