# CSToolsHub (ATCS Tools)

Internal tools hub built with **Astro + React islands**, deployed on **Netlify**, with **Supabase** for auth and quiz data (Phase 2).

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

Without Supabase variables, the app runs in **offline mode** (local quiz bank, no login gate).

## Build

```bash
npm run build
npm run preview
```

Netlify uses `netlify.toml` (`publish = dist`, `build = npm run build`).

## Routes

| Path | Tool |
|------|------|
| `/` | Home |
| `/tools/mailcraft/` | MailCraft |
| `/tools/mt4tp/` | MT4 TP slippage |
| `/tools/mt5tp/` | MT5 TP slippage |
| `/tools/mucredit/` | MU Credit calculator |
| `/tools/quiz/:slug/` | Knowledge quiz |
| `/tools/admin/quiz/` | Quiz DB import (editor/admin) |
| `/login/` | Supabase auth |

Legacy HTML files are archived under `archive/legacy/`.

## Supabase

Apply migrations:

```bash
supabase db push
```

Promote a user to `editor` or `admin` in `profiles.role`, then use **Admin Quiz** to import questions from `src/lib/tools/quiz/bank.ts`.

## Verify quiz bank

```bash
node scripts/verify-quiz-bank.mjs
```
