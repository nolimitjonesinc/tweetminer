# TweetMiner — Status
_Auto-updated by Status Brain on every push. Last change: Locked the analysis endpoint behind sign-in; tokens no longer contain the password._

**Status:** In progress  
**What it is:** A web app that analyzes tweets and mines data from them.  
**Stack:** Node.js, React (Vite), JavaScript/JSX, Vercel.

## What works right now
- Basic app structure with React frontend (App.jsx, main.jsx)
- Three API endpoints: login, verify, and analyze
- Authentication middleware (_auth.js) protecting endpoints
- Sign-in requirement for the analysis endpoint (recently hardened)
- Tokens no longer expose passwords (security fix applied)
- HTML template and CSS styling
- Vite build configuration
- Vercel deployment config
- Status Brain automation (self-documenting repo status via status-brain.mjs and GitHub workflow)
- Task tracking structure (CLAUDE.md and tasks/ folder for roadmap)

## Recent changes (newest first)
- 2026-11-14 — Locked the analysis endpoint behind sign-in; tokens no longer contain the password
- 2026-07-20 — Hardened Status Brain with retry-with-rebase on push
- 2026-07-20 — Added Status Brain workflow to auto-generate STATUS.md on every push
- 2026-07-20 — Added Status Brain script (status-brain.mjs)
- 2026-01-29 — Set up HQ task tracking with CLAUDE.md and tasks folder (core features roadmap)
- 2025-12-10 — Fixed README formatting (added newline)
- 2025-12-09 — Initial files uploaded

## Reusable parts (for other projects)
- **Status Brain** — Auto-generates plain-English project status from git history and file structure on every commit — status-brain.mjs and .github/workflows/status-brain.yml

## Not done / next
- Core tweet analysis features not yet implemented (analyze.js is a stub)
- Login/verify flow incomplete (endpoints exist but full backend logic unclear)
- No database connected or visible
- Password security still in progress (tokens hardened but broader auth system status unclear)
- Task tracking exists (tasks/01-core-features.md) but features not yet built
- Package dependencies not clearly visible in available data
