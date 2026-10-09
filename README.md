# Organic Farming AI Assistant
1. `npm install`  2. copy `.env.example` → `.env.local`, fill values  3. `psql $DATABASE_URL -f database/schema.sql`  4. `npm run dev`
(Secure cookies need HTTPS; use `next dev --experimental-https` locally.)

## Extension points
- Feature on/off: `config/featureFlags.ts` (defaults) or `feature_flags` table (runtime).
- New module: add entry to `config/siteConfig.ts` modules + folder in `app/`.
- New language: add an object in `lib/i18n/messages.ts`.
- New SMS/AI provider: implement the interface in `lib/otp` / `lib/ai` and register it.
- Make admin: `INSERT INTO admin_users ...; UPDATE users SET role='admin' WHERE mobile='+91...'`.

## Not yet built (next steps)
Pages/APIs: signup extras, dashboard, profile, history, saved, crops, organic-farming, fertilizers, pests, crop-doctor (image analysis), articles, about, admin panel + `/api/admin/*`, sitemap/robots. Follow the patterns in `app/api/ai/chat` (auth + zod + ownership checks) and `lib/features.ts`.
