# TweetMiner — Tasks

**Last updated:** November 7, 2026

Read `PROJECT.md` before adding anything here. Tasks that break a "Rule of the
house" don't belong on this list.

## Next up
- [x] **Web address was stuck on a Dec 16, 2025 version — FIXED 2026-11-08** (pointed at newest deploy with DJ's OK). Root cause: the address was never attached to the project, only pinned by hand. Attached it to the project 2026-11-08 so pushes to master go live automatically. tweetminer.nolimitjones.com is pinned to an old deployment, so no push since then has reached it. Fix: point the address at the newest deployment (`vercel alias set <newest-deployment-url> tweetminer.nolimitjones.com`), then check Vercel's Domains settings so future pushes move it automatically. Undo: alias back to tweetminer-jz4tjdl5v.
- [x] New Anthropic key works (tested 2026-11-07: analysis 18s, Mine Replies found 3 of 6 test replies, noise skipped). Database saving not yet confirmed live.
- [x] **Paste the database key into Vercel** (done by DJ 2026-11-07) (`SUPABASE_SERVICE_ROLE_KEY`, from Supabase → Project Settings → API Keys → "Publishable and secret API keys" tab → Secret key. The new sb_secret_ key is preferred; legacy service_role keys are being retired by end of 2026, and both work). Until then Mine Replies works but saves nothing.
- [x] **First real Mine Replies test** (passed live 2026-11-08: 2 leads saved, noise skipped, Leads list shows them; test rows deleted) once the AI key and database key are in: one busy X thread, check the Leads list fills with 4-5 scored replies only.
- [ ] Add the login check to `/api/analyze` (currently open to anyone with the address).
- [x] **Replace the dead Anthropic API key in Vercel (found 2026-11-07, done by DJ).** The key stored in Vercel is rejected by Anthropic as invalid, so analysis fails until a fresh key is added. Then test one analysis and push the Sonnet 5.5 change live (must be live before Nov 30, 2026, when Sonnet 4.5 shuts off).
- [ ] **Auto-scroll reply collector (sketch, awaiting DJ's OK, 2026-11-07).** Today the X capture only reads replies already loaded on screen, and X drops replies as you scroll past them. Plan: on click, the extension scrolls the thread itself, saves each reply as it shows up (no duplicates), and stops at 50 replies, the end of the thread, or ~15 seconds. It shows a live "Collecting replies… 23" counter, then jumps back to the top and opens the analyzer. Open question: the reply cap (50 recommended, since the cheap model already summarizes them). Done = on a busy tweet it captures far more than a no-scroll grab does.

## Doing now
- [ ] …

## Done
- [x] Fixed: right-clicking a tweet opened TweetMiner with empty boxes (page read the handoff too late). Verified live 2026-11-08.
- [x] Moved main analysis to Sonnet 5.5 and summaries to Haiku 5.5; raised answer limit; answer-reading fixed for thinking models (2026-11-07, saved locally, not yet live or tested end-to-end)

## Someday / maybe
- ~~Work leads inside X, no extra tab~~ — KILLED by DJ 2026-11-08: "that's just a reply function" (Quiply already replies).
- **Three-bucket reply mining — BUILT 2026-11-07 (see PROJECT.md 'Mine Replies + Leads'; untested with real AI until the key is fixed).** DJ: replies come in three kinds (compliments, frustrations, better ideas), and all three should be mined for things to build fast and sell. Today the reply summary already notes pains and ideas, but nothing turns them into sellable fixes. Plan: sort every reply into Praise (proof people want it), Frustrations (gaps to fill), Better ideas (upgrades). For each bucket's top items, output: the quick thing to build (or which existing DJ app already fixes it), who'd pay, and a reply to send that person. Merges with Find Buyers below. Done = one real thread produces at least 3 sellable fixes with names attached. **Tracking (DJ, 2026-11-07):** every item must keep the person's handle, their exact words, its group, the thread link, and a status (found → replied → they answered → sold). Gaps found: the X extension keeps handles but the bookmarklet drops them, and the summary step strips names before the main analysis. Leads need a real database (recommend the shared Supabase project), not the browser's 50-item history.
- **Find Buyers mode (DJ: "Love the idea!", 2026-11-07).** A 4th button that names repliers whose complaint one of DJ's finished apps or a dannyjones.ai custom build fixes, with a draft reply each. Run the no-code test first: 10 real threads by hand, send the 10 best replies. Kill it if fewer than 3 threads match or zero replies get a response. Full card: idea-digger skill folder, rig/runs/2026-11-07-tweetminer-find-buyers.md
Ideas that aren't committed. Parking them here keeps them out of "Next up."
From `ROADMAP.md`'s "Future Considerations" (never started, just brainstormed):
- Team features — share analyses with others, shared profiles/templates
- Public API for power users, webhooks for automation
- Mobile share-sheet integration / PWA support
- Custom analysis modes, batch analysis, RSS/webhook integrations

Gaps found while documenting this project (see `PROJECT.md` section 8) — worth a decision, not started:
- Replace the base64 login token with something that can't be trivially decoded
- Confirm whether the "DJ Loop" integration is still active; document what it is if so
- Decide whether the multi-tool dashboard/project-switcher is getting more tools, or should be simplified back to a single-app view
- Clean up the stray "OpenClaw use case..." text file sitting in the project root
