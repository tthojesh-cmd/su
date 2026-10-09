import { siteConfig } from "@/config/siteConfig";
import { getLang, tr } from "@/lib/i18n";
export function Footer() {
  return (<footer className="mt-16 border-t bg-leaf-50 px-4 py-8 pb-24 text-sm text-gray-600 md:pb-8"><div className="mx-auto max-w-6xl">
    <p className="font-semibold">{siteConfig.logo} {siteConfig.name}</p>
    <p className="mt-2">{tr(getLang(), "footer.disclaimer")}</p>
    <p className="mt-2">{siteConfig.contact.email}</p></div></footer>);
}
