# TweetMiner — Tasks

**Last updated:** November 7, 2026

Read `PROJECT.md` before adding anything here. Tasks that break a "Rule of the
house" don't belong on this list.

## Next up
- [ ] **Replace the dead Anthropic API key in Vercel (found 2026-11-07).** The key stored in Vercel is rejected by Anthropic as invalid, so analysis fails until a fresh key is added. Then test one analysis and push the Sonnet 5.5 change live (must be live before Nov 30, 2026, when Sonnet 4.5 shuts off).
- [ ] **Auto-scroll reply collector (sketch, awaiting DJ's OK, 2026-11-07).** Today the X capture only reads replies already loaded on screen, and X drops replies as you scroll past them. Plan: on click, the extension scrolls the thread itself, saves each reply as it shows up (no duplicates), and stops at 50 replies, the end of the thread, or ~15 seconds. It shows a live "Collecting replies… 23" counter, then jumps back to the top and opens the analyzer. Open question: the reply cap (50 recommended, since the cheap model already summarizes them). Done = on a busy tweet it captures far more than a no-scroll grab does.

## Doing now
- [ ] …

## Done
- [x] Moved main analysis to Sonnet 5.5 and summaries to Haiku 5.5; raised answer limit; answer-reading fixed for thinking models (2026-11-07, saved locally, not yet live or tested end-to-end)

## Someday / maybe
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
