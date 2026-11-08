# TweetMiner

**Last updated:** November 7, 2026
**Status:** Live ‹CHECK — README.md, ROADMAP.md and PROJECTS.md all say it's live at tweetminer.nolimitjones.com; nobody actually visited the URL to confirm the deploy is current›
**Lives at:** tweetminer.nolimitjones.com ‹CHECK — taken from docs, not verified live›

> **Truth rule:** every line below must be verifiable in this project's own files.
> Anything inferred, assumed, or remembered gets marked **‹CHECK›** so Danny can
> confirm or kill it. A doc that guesses silently is worse than no doc.

---

## 1. What it is

A password-gated web tool that takes any social post (Twitter/X, Reddit, LinkedIn, Hacker News, YouTube, or anything else pasted in) and runs it through Claude to break it down three ways: how to exploit the opportunity, how it actually works in plain English, and how to turn it into a product. A Chrome extension and a universal bookmarklet let you grab a post straight from the page instead of copy-pasting.

## 2. Who it's for and what problem it solves

- **User:** Danny, personally — this is one of his own tools, gated behind a shared password. ‹CHECK — inferred from the single hardcoded `SITE_PASSWORD` gate and "nolimitjones" branding; no multi-user accounts exist in the code›
- **Problem:** ‹CHECK — inferred, not stated anywhere in the repo› Scrolling social media surfaces interesting ideas/opportunities that get lost. This tool turns a pasted post into a structured analysis instead of a fleeting thought.
- **The bet:** ‹CHECK — inferred› A generic AI chat isn't tailored to Danny's specific skills/goals/constraints. This tool injects a saved profile into every prompt so the analysis is personalized instead of generic advice.

## 3. Goals

Sourced from `ROADMAP.md`, which lists these as completed ("Goal 1" through "Goal 10"):

1. User profile system — define who you are and what you're looking for; profile persists and shapes every prompt.
2. Universal content support — works with more than just tweets (Reddit, LinkedIn, HN, YouTube, Other).
3. Multi-platform Chrome extension — one-click capture with a right-click context menu on all supported platforms.
4. Universal bookmarklet — same capture, no extension install required, falls back to selected text on unsupported sites.
5. Analysis history — auto-saves the last 50 analyses, reloadable, deletable.
6. Export options — copy result as plain text or export as markdown with metadata.
7. UX polish — keyboard shortcuts (Cmd/Ctrl+Enter to analyze, Escape to close modals).

## 4. The mental model

Paste (or extension-capture) a post → pick a platform → pick one of three analysis modes → optionally paste replies/comments for extra context → Claude does the analysis using a system prompt built from your saved profile → result shows on screen, auto-saved to history, copyable or exportable as markdown.

If replies are included, there's a hidden pre-step: Haiku cheaply summarizes them first, and that summary (not the raw replies) is what gets fed to Sonnet for the real analysis. This keeps the expensive model's input short even for long comment threads.

## 5. Feature list — what exists today

### Access
- Password gate (`SITE_PASSWORD` env var) with a token stored in `localStorage`, checked on every load via a `/api/verify` call.
- Auto-login on `localhost` for local dev (`IS_DEV` check bypasses the password screen entirely).

### Profile
- First-time setup flow (name, role, focus, goals, skills, constraints, response style) — required before the analyzer is usable.
- Editable any time via a "Profile" button/modal in the analyzer header.
- Persists in `localStorage`, injected into every AI prompt.

### Content capture
- Manual paste of content + optional replies/comments, with a platform picker (Twitter/X, Reddit, LinkedIn, Hacker News, YouTube, Other).
- URL query params (`?tweet=&replies=&source=&platform=`) let the Chrome extension or bookmarklet hand off captured content directly into the analyzer.
- Chrome extension (Manifest V3): right-click context menu + popup on Twitter/X, Reddit (new + old), LinkedIn, Hacker News, YouTube.
- Bookmarklet at `/bookmarklet.html`: drag-to-install, auto-detects platform, falls back to selected text on unsupported sites.

### Analysis
- Three modes: **Exploit** (opportunities), **Explain** (how it works, non-coder friendly), **Productize** (monetization angles).
- Two-stage AI pipeline: Haiku 5.5 summarizes replies/comments (if provided, thinking off), Sonnet 5.5 performs the actual analysis (thinking on, medium effort, 16k answer limit, auto-fallback model if a safety check declines), both using prompts dynamically built from the saved profile and platform context.
- Keyboard shortcut: Cmd/Ctrl+Enter runs Exploit mode on the current content; Escape closes open modals.

### History & export
- Every successful analysis auto-saves to `localStorage` (max 50, oldest dropped).
- History modal: browse, click to reload past content + result, delete individual entries, clear all.
- Copy result as plain text, or export as markdown (includes date, platform, original content, replies, analysis).
- "Send to DJ Loop" button (Productize mode only) — posts the result to an external tool via `/api/send-to-loop`. ‹CHECK — "DJ Loop" is not part of this repo; this only works if `DJ_LOOP_URL` and `DJ_LOOP_INGEST_KEY` are configured elsewhere and that service is reachable›

### Mine Replies + Leads (added 2026-11-07)
- 4th button **Mine Replies**: Sonnet 5.5 sorts every reply into compliment / frustration / better idea, scores each 1-5 for sellable value, and names the quick fix, which of DJ's existing apps fits (list in `api/_portfolio.js`), who pays, and a draft reply.
- Only replies scoring 4-5 are saved, to the `tweetminer_leads` table in the shared Supabase project (ftcdqmrjjooluihysuyc). Locked: RLS on, no policies, only TweetMiner's server can read or write. Same reply on the same thread is never saved twice.
- **Leads** button (header): list of saved leads with status (Found → I replied → They answered → Sold / Dead end), copy reply, open thread, delete.
- Both server routes (`api/mine.js`, `api/leads.js`) check the login token.
- Needs `SUPABASE_URL` (set) and `SUPABASE_SERVICE_ROLE_KEY` (not yet set — DJ pastes it) in Vercel. Without the key, mining still works but nothing is saved.
- Bookmarklet now keeps each X reply's @handle (the extension already did).

### Multi-tool dashboard
- A dashboard/landing page (`src/Dashboard.jsx`) with a project-switcher dropdown, styled as a portal for multiple personal tools.
- Currently the project registry (`src/projects.js`) lists only TweetMiner itself — the "portal" shell exists but nothing else has been plugged into it yet.

## 6. How it works underneath

- **Stack:** React 18 + Vite, React Router 7 (client-side routing between dashboard and `/tweetminer`), Vercel serverless functions for the backend, Anthropic Claude API for the AI work. Chrome extension is vanilla JS, Manifest V3.
- **Where data lives:**
  - `localStorage` keys: `nolimitjones_auth` (login token), `nolimitjones_profile` (profile JSON), `tweetminer_history` (array of up to 50 analyses).
  - The app auto-migrates from older key names (`tweetminer_auth`, `tweetminer_profile`) on load, so anyone with the pre-rename version won't lose data.
  - No database — everything is browser-local. Nothing is synced across devices.
- **The key mechanism:** `api/analyze.js` builds three different system prompts per request from the user's profile (name, role, focus, goals, skills, constraints, style) plus platform context. If replies were pasted, Haiku 5.5 summarizes them first (cheap/fast); Sonnet 5.5 then runs the actual mode-specific analysis against the original content + that summary.
- **External services:**
  - Anthropic API — key name `ANTHROPIC_API_KEY`, used only inside `api/analyze.js`, never sent to the browser.
  - Password gate — key name `SITE_PASSWORD`, used in `api/login.js` and `api/verify.js`.
  - "DJ Loop" webhook (optional) — key names `DJ_LOOP_URL`, `DJ_LOOP_INGEST_KEY`, used only in `api/send-to-loop.js`.
- **File map:**
  - `src/App.jsx` — everything: auth screens, profile setup/edit, the analyzer UI, history, routing glue. This is a large single file.
  - `src/Dashboard.jsx` — the multi-tool landing page.
  - `src/projects.js` / `src/ProjectSwitcher.jsx` — the project registry and the dropdown that reads it.
  - `api/analyze.js` — prompt generation + both Claude API calls.
  - `api/login.js`, `api/verify.js` — password check and token verification.
  - `api/send-to-loop.js` — forwards a Productize result to the external DJ Loop service.
  - `extension/` — Chrome extension (`manifest.json`, `background.js`, `content.js`, `popup.html`/`popup.js`, icons).
  - `bookmarklet/bookmarklet.js`, `public/bookmarklet.html` — the bookmarklet source and its install page.
  - `vercel.json` — routes `/api/*` to the functions, everything else to the SPA.

## 7. Rules of the house

No build-log entry exists for this project (checked `build-logs/logs/` — nothing found), so nothing here comes from a documented past decision. These are inferred from the code itself — confirm or override:

1. **API keys stay server-side, always.** `ANTHROPIC_API_KEY`, `SITE_PASSWORD`, and `DJ_LOOP_INGEST_KEY` only ever appear inside `api/*.js` files (Vercel functions), never in `src/`. Matches the Projects-folder-wide standard. ‹CHECK — treating this as a rule, though it's really just "the standard is followed here," not a project-specific decision›
2. **Cheap model summarizes, expensive model analyzes.** Replies/comments always go through Haiku first; only the summary (not raw text) reaches Sonnet. ‹CHECK — inferred from `api/analyze.js` structure and its own comment "cheap, fast"; never stated as a rule to protect anywhere in the docs›

## 8. Known gaps / not built yet

- **`/api/analyze` has no login check** (found 2026-11-07): anyone who finds the address can run analyses on DJ's AI bill. The new Mine/Leads routes do check.
- **Auth is not real security.** The login token is `base64(timestamp-password)`, and `api/verify.js` just checks that the decoded string ends with `-${SITE_PASSWORD}`. The code itself says "in production, use JWT or similar" — this is a password *speed bump*, not a lock. Fine for a personal tool, worth knowing before treating it as sensitive-data-safe.
- **"DJ Loop" is an undocumented external dependency.** `api/send-to-loop.js` posts to it, but nothing in this repo explains what DJ Loop is, where it lives, or what happens on the other end. ‹CHECK with Danny — is this still active?›
- **The multi-tool "dashboard" only has one tool in it.** The portal/project-switcher UI is built for multiple apps, but `src/projects.js` currently registers just TweetMiner. Either more tools are meant to land here later, or this is leftover scaffolding.
- **No tests found anywhere in the project.**
- **No `TASKS.md`, no `tasks/` folder, and no build log existed before this session** — nothing was being tracked.
- **A stray file sits in the project root:** `OpenClaw use case for THE CLOSER sales bot concept.txt` — reads like a saved TweetMiner "Exploit" analysis output about a different concept (OpenClaw / a sales bot idea) that got left in the repo instead of being exported and deleted. Not code, doesn't affect the app, but it's noise in the folder and was flagged as surprising.
- **All state is browser-local, single device.** Profile and history live only in that browser's `localStorage` — clearing browser data or switching devices loses everything. Not necessarily a bug, but worth knowing.

## 9. Deeper history

No entry currently exists at `../build-logs/logs/tweetminer.md` — checked, nothing found. If Danny remembers decisions or rejected approaches for this project, they aren't recorded anywhere yet.
Reusable parts extracted from here: `../CAPABILITIES.md`
