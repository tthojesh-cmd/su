"use client";
import { useRouter } from "next/navigation";
export function LangSwitch({ lang }: { lang: string }) {
  const r = useRouter();
  const set = (l: string) => { document.cookie = `lang=${l};path=/;max-age=31536000`; r.refresh(); };
  return (<div role="group" aria-label="Language" className="flex overflow-hidden rounded-full border text-sm">
    {[["en", "English"], ["te", "తెలుగు"]].map(([k, n]) => <button key={k} onClick={() => set(k)} aria-pressed={lang === k} className={`px-3 py-1 ${lang === k ? "bg-leaf-600 text-white" : ""}`}>{n}</button>)}
  </div>);
}
