"use client";
import { useState } from "react";
type M = { role: "user" | "assistant"; content: string };
const SAMPLES = ["How can I grow tomatoes organically?", "How can I control aphids naturally?", "How do I prepare compost?"];
export function ChatBox({ labels }: { labels: { placeholder: string; send: string; new: string; copy: string } }) {
  const [msgs, setMsgs] = useState<M[]>([]); const [cid, setCid] = useState<string>(); const [text, setText] = useState("");
  const [lang, setLang] = useState("en"); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function send(message: string) {
    if (!message.trim() || busy) return;
    setErr(""); setBusy(true); setMsgs((m) => [...m, { role: "user", content: message }]); setText("");
    try {
      const r = await fetch("/api/ai/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message, conversationId: cid, language: lang }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCid(d.conversationId); setMsgs((m) => [...m, { role: "assistant", content: d.reply }]);
    } catch (e: any) { setErr(e.message || "Something went wrong."); } finally { setBusy(false); }
  }
  const regenerate = () => { const last = [...msgs].reverse().find((m) => m.role === "user"); if (last) send(last.content); };
  return (<div className="mx-auto flex max-w-3xl flex-col gap-3 p-4">
    <div className="flex items-center justify-between">
      <select aria-label="Answer language" value={lang} onChange={(e) => setLang(e.target.value)} className="rounded border p-2">
        <option value="en">English</option><option value="te">తెలుగు</option><option value="both">English + తెలుగు</option></select>
      <button onClick={() => { setMsgs([]); setCid(undefined); }} className="text-leaf-700 underline">{labels.new}</button></div>
    <div aria-live="polite" className="flex min-h-[50vh] flex-col gap-3">
      {!msgs.length && SAMPLES.map((s) => <button key={s} onClick={() => send(s)} className="rounded-xl border p-3 text-left hover:bg-leaf-50">{s}</button>)}
      {msgs.map((m, i) => (<div key={i} className={`max-w-[90%] whitespace-pre-wrap rounded-2xl p-3 ${m.role === "user" ? "self-end bg-leaf-600 text-white" : "self-start bg-gray-100"}`}>
        {m.content}{/* React escapes text -> XSS-safe */}
        {m.role === "assistant" && <div className="mt-2 flex gap-3 text-xs text-gray-500">
          <button onClick={() => navigator.clipboard.writeText(m.content)}>{labels.copy}</button>
          {i === msgs.length - 1 && <button onClick={regenerate}>↻</button>}</div>}</div>))}
      {busy && <div className="self-start animate-pulse rounded-2xl bg-gray-100 p-3">…</div>}
      {err && <p role="alert" className="text-red-600">{err}</p>}</div>
    <div className="flex gap-2"><input aria-label={labels.placeholder} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(text)}
      placeholder={labels.placeholder} className="flex-1 rounded-xl border p-3" />
      <button disabled={busy} onClick={() => send(text)} className="rounded-xl bg-leaf-600 px-5 text-white disabled:opacity-50">{labels.send}</button></div></div>);
}
