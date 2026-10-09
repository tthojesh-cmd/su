"use client";
import { useEffect, useState } from "react";
// Combined login/signup: first verified OTP creates the account. Extend with name/language fields for /signup.
export default function Login() {
  const [mobile, setMobile] = useState("+91"); const [code, setCode] = useState(""); const [sent, setSent] = useState(false);
  const [cd, setCd] = useState(0); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (cd > 0) { const t = setTimeout(() => setCd(cd - 1), 1000); return () => clearTimeout(t); } }, [cd]);
  async function call(url: string, body: object) {
    setErr(""); setBusy(true);
    const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok) { setErr(d.error || "Something went wrong."); return null; } return d;
  }
  const send = async () => { if (await call("/api/auth/send-otp", { mobile })) { setSent(true); setCd(60); } };
  const verify = async () => { if (await call("/api/auth/verify-otp", { mobile, code })) location.href = "/dashboard"; };
  return (<div className="mx-auto max-w-sm space-y-4 p-6">
    <h1 className="text-2xl font-bold">Login / Sign up</h1>
    <label className="block">Mobile number<input value={mobile} disabled={sent} onChange={(e) => setMobile(e.target.value)} inputMode="tel" className="mt-1 w-full rounded-xl border p-3" /></label>
    {sent && <label className="block">Enter the 6-digit OTP sent to your mobile number
      <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="mt-1 w-full rounded-xl border p-3 text-center text-2xl tracking-widest" /></label>}
    {err && <p role="alert" className="text-red-600">{err}</p>}
    {!sent ? <button onClick={send} disabled={busy} className="w-full rounded-xl bg-leaf-600 p-3 text-white disabled:opacity-50">{busy ? "…" : "Send OTP"}</button>
      : <><button onClick={verify} disabled={busy || code.length !== 6} className="w-full rounded-xl bg-leaf-600 p-3 text-white disabled:opacity-50">{busy ? "…" : "Verify OTP"}</button>
        <div className="flex justify-between text-sm"><button onClick={send} disabled={cd > 0 || busy} className="underline disabled:no-underline disabled:opacity-50">{cd > 0 ? `Resend in ${cd}s` : "Resend OTP"}</button>
          <button onClick={() => { setSent(false); setCode(""); }} className="underline">Change number</button></div></>}
  </div>);
}
