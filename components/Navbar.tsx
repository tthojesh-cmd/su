import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";
import { getFlags } from "@/lib/features";
import { getLang, tr } from "@/lib/i18n";
import { getSession } from "@/lib/auth";
import { LangSwitch } from "./LangSwitch";
/** Reads the module registry and hides anything whose feature flag is off. */
export async function Navbar() {
  const flags = await getFlags(), lang = getLang(), session = await getSession();
  const items = siteConfig.modules.filter((m) => !m.flag || flags[m.flag as keyof typeof flags]);
  return (<>
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-leaf-700">{siteConfig.logo} {siteConfig.name}</Link>
        <div className="hidden items-center gap-5 md:flex">
          {items.map((m) => <Link key={m.href} href={m.href} className="hover:text-leaf-600">{tr(lang, m.key)}</Link>)}
          <LangSwitch lang={lang} />
          <Link href={session ? "/dashboard" : "/login"} className="rounded-full bg-leaf-600 px-4 py-2 text-white">{session ? "👤" : tr(lang, "nav.login")}</Link>
        </div>
        <div className="md:hidden"><LangSwitch lang={lang} /></div>
      </nav>
    </header>
    <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t bg-white py-2 md:hidden">
      <Link href="/" className="p-2 text-sm">🏠</Link>
      {items.filter((m) => m.mobile).map((m) => <Link key={m.href} href={m.href} className="p-2 text-sm">{tr(lang, m.key)}</Link>)}
      <Link href={session ? "/dashboard" : "/login"} className="p-2 text-sm">👤</Link>
    </nav></>);
}
