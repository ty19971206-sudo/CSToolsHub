# CSToolsHub (ATCS Tools)

Internal tools hub built with **Astro + React islands**, deployed on **Netlify**, with **Supabase** for auth, quiz, mail templates, and product specs.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Environment

Copy `.env.example` to `.env` and set:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_AUTH_REQUIRED=true` — requires email/password login for all pages (except `/login`)

Without Supabase variables, calculators and quiz fall back to **bundled local data**; login gate still requires Supabase when auth is enabled.

## Build

```bash
npm run build
npm run preview
```

Netlify uses `netlify.toml` (`publish = dist`, `build = npm run build`).

## Deploy via GitHub Repository (Netlify)

1. Push this repository to GitHub.
2. In Netlify: import the repo; build `npm run build`, publish `dist`.
3. Set environment variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `PUBLIC_AUTH_REQUIRED=true`

### Homepage forex news

Summaries are updated by GitHub Actions (`.github/workflows/daily-forex-news.yml`) into `src/data/forex-news.json`.

## Routes

| Path | Tool |
|------|------|
| `/` | Home |
| `/login/` | Supabase sign-in (forgot password on same page) |
| `/auth/reset-password/` | Set new password from email reset link |
| `/tools/mailcraft/` | MailCraft (DB templates when configured) |
| `/tools/mt4tp/` | MT4 TP slippage |
| `/tools/mt5tp/` | MT5 TP slippage |
| `/tools/mucredit/` | MU Credit calculator |
| `/tools/gmcalc/` | CN margin & position calculator (DB product_specs) |
| `/tools/quiz/:slug/` | Knowledge quiz |
| `/tools/quiz/history/` | My quiz scores |
| `/tools/admin/` | Admin hub (editor/admin) |

## Supabase

Apply migrations:

```bash
supabase db push
```

1. Create users in Supabase Auth (email/password). Add your site URL and `/auth/reset-password/` to **Auth → URL Configuration → Redirect URLs** for password reset emails.
2. Signed-in users: header account menu → change password or sign out.
3. Set `profiles.role` to `editor` or `admin` for staff who manage content.
4. In **Admin** (`/tools/admin/`):
   - Import quiz from `bank.ts`
   - Seed mail templates from MailCraft built-ins
   - Seed GmCalc `product_specs` from `defaultProducts.ts`
5. **Admin user creation** (optional): set `SUPABASE_SERVICE_ROLE_KEY` in Netlify (not in client). Use **用户管理** tab or `npx netlify dev` locally.

Apply new migrations after pull:

```bash
supabase db push
```

## Verify quiz bank

```bash
node scripts/verify-quiz-bank.mjs
```
