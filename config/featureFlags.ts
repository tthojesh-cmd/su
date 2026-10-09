// Code defaults. Admin can override any flag at runtime via the feature_flags table.
// Turning a flag off hides the feature from navbar, home, dashboard and mobile menu.
export const defaultFlags = {
  AI_CHAT: true, CROP_DOCTOR: true, CROP_DATABASE: true, ARTICLES: true,
  FAQ: true, FERTILIZERS: true, PESTS: true, WEATHER: false, MARKET_PRICES: false,
} as const;
export type FlagKey = keyof typeof defaultFlags;
