// Fallback content. Admin edits (site_settings table) override these values.
export const siteConfig = {
  name: "Organic Farming AI Assistant",
  logo: "🌿",
  contact: { email: "contact@example.com" },
  // Single registry drives desktop nav, mobile nav, home cards and dashboard.
  // To add a module: add one entry here + a folder under app/.
  modules: [
    { href: "/organic-farming", key: "nav.organic", flag: null, mobile: false },
    { href: "/crops", key: "nav.crops", flag: "CROP_DATABASE", mobile: true },
    { href: "/crop-doctor", key: "nav.doctor", flag: "CROP_DOCTOR", mobile: true },
    { href: "/ai-assistant", key: "nav.ai", flag: "AI_CHAT", mobile: true },
    { href: "/articles", key: "nav.articles", flag: "ARTICLES", mobile: false },
    { href: "/about", key: "nav.about", flag: null, mobile: false },
  ],
} as const;
