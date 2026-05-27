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

## Deploy via GitHub Repository (Netlify)

This project is ready for **GitHub-connected deployment** (recommended), not manual Drag & Drop.

1. Push this repository to GitHub.
2. In Netlify: **Add new site** -> **Import an existing project** -> pick this repo.
3. Build settings (Netlify should auto-detect from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add required environment variables in Netlify Site settings:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
5. Trigger first deploy.

After this, every push to the connected branch auto-deploys.

### Homepage forex news (bilingual summaries)

Netlify **only runs** `npm run build`; it does **not** call DeepLX. Chinese/English summaries are produced in GitHub Actions (`.github/workflows/daily-forex-news.yml`) and committed to `src/data/forex-news.json`.

After the first GitHub deploy, run the workflow once manually:

1. GitHub repo → **Actions** → **Daily Forex News Update** → **Run workflow**
2. Wait for the job to finish and push `chore: update daily forex news`
3. Netlify will redeploy automatically from that commit

If `summaryZh` and `summaryEn` in `forex-news.json` are identical English text, the workflow has not run successfully yet (or DeepLX was unavailable).

## Routes

| Path | Tool |
|------|------|
| `/` | Home |
| `/tools/mailcraft/` | MailCraft |
| `/tools/mt4tp/` | MT4 TP slippage |
| `/tools/mt5tp/` | MT5 TP slippage |
| `/tools/mucredit/` | MU Credit calculator |
| `/tools/gmcalc/` | CN margin & position calculator |
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
