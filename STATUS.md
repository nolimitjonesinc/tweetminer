# TweetMiner — Status
_Auto-updated by Status Brain on every push. Last change: Added local device history storage and markdown copy feature for recent analyses._

**Status:** In progress  
**What it is:** A web app that analyzes tweets and saves recent analyses locally on your device.  
**Stack:** Node.js, React (Vite), JavaScript/JSX, Vercel.

## What works right now
- React frontend with App.jsx component and Vite build setup
- Three API endpoints: login, verify, and analyze
- Local history storage (history.js) that keeps recent analyses on the device
- Copy-as-markdown export feature for saved analyses
- HTML template, CSS styling, and Vite configuration
- Vercel deployment setup
- Status Brain automation (auto-generates this file on every push via status-brain.mjs and GitHub workflow)
- Task tracking structure (CLAUDE.md and tasks/ folder for roadmap)
- History checking script (check-history.mjs)

## Recent changes (newest first)
- 2026-11-14 — Added local device history storage and markdown copy functionality for recent analyses
- 2026-07-20 — Hardened Status Brain retry-with-rebase on push
- 2026-07-20 — Set up Status Brain workflow and script for auto-generating project status
- 2026-01-29 — Added HQ task tracking setup (CLAUDE.md + tasks folder)
- 2025-12-10 — Fixed README formatting (added newline)
- 2025-12-09 — Initial files uploaded

## Reusable parts (for other projects)
- **Status Brain** — Auto-generates plain-English project status from git history and file structure on every commit — status-brain.mjs and .github/workflows/status-brain.yml

## Not done / next
- Tweet analysis engine (analyze.js is still a stub—no actual analysis logic)
- Login and user authentication (endpoints exist but no backend implementation)
- Database or persistent user data storage (beyond local device history)
- Integration between frontend and API endpoints not complete
- Package.json dependencies not yet fully defined or locked
- Task tracking exists but core features from tasks/01-core-features.md not yet built
