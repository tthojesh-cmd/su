import Link from "next/link";
import { getLang, tr } from "@/lib/i18n";
import { getFlags } from "@/lib/features";
import { query } from "@/lib/db";
export const dynamic = "force-dynamic";
// Hero text can be overridden from the site_settings table (key: "hero"), so admin edits need no code change.
async function hero(lang: string) {
  try { const r = await query("SELECT value FROM site_settings WHERE key='hero'"); return r.rows[0]?.value?.[lang] ?? null; } catch { return null; }
}
export default async function Home() {
  const lang = getLang(), flags = await getFlags(), h = await hero(lang);
  const cards = [
    { on: flags.CROP_DATABASE, icon: "🌾", href: "/crops", t: tr(lang, "nav.crops") },
    { on: flags.CROP_DOCTOR, icon: "🩺", href: "/crop-doctor", t: tr(lang, "nav.doctor") },
    { on: flags.AI_CHAT, icon: "🤖", href: "/ai-assistant", t: tr(lang, "nav.ai") },
    { on: flags.ARTICLES, icon: "📰", href: "/articles", t: tr(lang, "nav.articles") },
  ].filter((c) => c.on);
  return (<div className="mx-auto max-w-6xl px-4">
    <section className="py-16 text-center">
      <h1 className="text-3xl font-bold text-leaf-700 md:text-5xl">{h?.title ?? tr(lang, "home.title")}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">{h?.subtitle ?? tr(lang, "home.subtitle")}</p>
      <div className="mt-8 flex justify-center gap-3">
        {flags.AI_CHAT && <Link href="/ai-assistant" className="rounded-full bg-leaf-600 px-6 py-3 text-white">{tr(lang, "home.ask")}</Link>}
        <Link href="/login" className="rounded-full border border-leaf-600 px-6 py-3 text-leaf-700">{tr(lang, "home.start")}</Link></div></section>
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => <Link key={c.href} href={c.href} className="rounded-2xl border p-6 text-center shadow-sm hover:shadow-md"><div className="text-4xl">{c.icon}</div><div className="mt-2 font-medium">{c.t}</div></Link>)}</section></div>);
}
