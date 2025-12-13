# TweetMiner Roadmap

## Current State
- Chrome extension for Twitter/X
- Haiku 3.5 → Sonnet 4.5 pipeline
- Hardcoded user profile (DJ-specific)
- Clean minimal UI
- Live at tweetminer.nolimitjones.com

---

## Goal 1: User Profile System
**Why:** Make the tool useful for anyone, not just DJ

### Objectives
- [ ] Users can define who they are and what they're looking for
- [ ] System prompts dynamically use their profile
- [ ] Profile persists across sessions
- [ ] Easy to update without re-authenticating

### Tasks
| # | Task | Effort |
|---|------|--------|
| 1.1 | Create profile settings UI (form with fields) | 30 min |
| 1.2 | Store profile in localStorage | 15 min |
| 1.3 | Create settings page/modal | 30 min |
| 1.4 | Update API to accept user profile in request | 15 min |
| 1.5 | Refactor system prompts to use dynamic profile | 30 min |
| 1.6 | Add "Edit Profile" button to main UI | 10 min |
| 1.7 | First-time setup flow (prompt on first visit) | 20 min |

### Profile Fields
```
- name: "What should we call you?"
- role: "What do you do? (founder, marketer, developer, creator, etc.)"
- focus: "What are you building or working on?"
- goals: "What opportunities are you looking for?"
- skills: "What are you good at?"
- constraints: "What are your limitations? (time, money, skills)"
- style: "How do you want insights delivered? (direct, detailed, casual)"
```

### PR #1: User Profile System
```
feat: Add customizable user profile for personalized analysis

- Settings modal with profile fields
- localStorage persistence
- Dynamic system prompt injection
- First-time setup flow
```

---

## Goal 2: Universal Content Support (Paste Anything)
**Why:** Reddit, LinkedIn, HN, YouTube, Discord all have valuable discussions

### Objectives
- [ ] Users can paste any text, not just Twitter content
- [ ] UI adapts labels based on content type
- [ ] No extension required for basic usage

### Tasks
| # | Task | Effort |
|---|------|--------|
| 2.1 | Rename "Tweet" field to "Content" or make it dynamic | 10 min |
| 2.2 | Rename "Replies" field to "Comments/Replies" | 5 min |
| 2.3 | Add platform selector (Twitter, Reddit, LinkedIn, Other) | 20 min |
| 2.4 | Adjust Haiku prompt based on platform context | 15 min |
| 2.5 | Update extension to show "also works with paste" hint | 10 min |

### PR #2: Universal Content Support
```
feat: Support any platform content via paste

- Generic field labels
- Platform selector for context
- Works without extension
```

---

## Goal 3: Reddit Support (Extension)
**Why:** Reddit has the deepest discussions and clearest pain points

### Objectives
- [ ] Extension works on reddit.com
- [ ] Scrapes post title, body, and top comments
- [ ] Handles nested comment threads

### Tasks
| # | Task | Effort |
|---|------|--------|
| 3.1 | Add reddit.com to extension manifest permissions | 5 min |
| 3.2 | Create reddit content script (scrape post + comments) | 45 min |
| 3.3 | Handle Reddit's nested comment structure | 30 min |
| 3.4 | Add Reddit to context menu (detect platform) | 20 min |
| 3.5 | Test on various subreddit formats | 20 min |

### PR #3: Reddit Extension Support
```
feat: Add Reddit support to browser extension

- Scrapes post + top comments
- Handles nested threads
- Right-click "Analyze with TweetMiner" on Reddit
```

---

## Goal 4: LinkedIn Support (Extension)
**Why:** B2B opportunities, professional network insights

### Objectives
- [ ] Extension works on linkedin.com
- [ ] Scrapes post and comments
- [ ] Handles LinkedIn's DOM structure

### Tasks
| # | Task | Effort |
|---|------|--------|
| 4.1 | Add linkedin.com to extension manifest | 5 min |
| 4.2 | Create LinkedIn content script | 45 min |
| 4.3 | Handle LinkedIn's dynamic loading | 30 min |
| 4.4 | Test on various post types | 20 min |

### PR #4: LinkedIn Extension Support
```
feat: Add LinkedIn support to browser extension

- Scrapes posts + comments
- Handles dynamic content loading
```

---

## Goal 5: Hacker News Support (Extension)
**Why:** Technical audience, startup ideas, honest feedback

### Objectives
- [ ] Extension works on news.ycombinator.com
- [ ] Scrapes post and comment threads

### Tasks
| # | Task | Effort |
|---|------|--------|
| 5.1 | Add news.ycombinator.com to manifest | 5 min |
| 5.2 | Create HN content script (simpler DOM than others) | 30 min |
| 5.3 | Handle HN's threaded comments | 20 min |

### PR #5: Hacker News Extension Support
```
feat: Add Hacker News support to browser extension
```

---

## Goal 6: YouTube Comments Support (Extension)
**Why:** Massive audience feedback, content gap identification

### Objectives
- [ ] Extension works on youtube.com
- [ ] Scrapes video title/description + comments

### Tasks
| # | Task | Effort |
|---|------|--------|
| 6.1 | Add youtube.com to manifest | 5 min |
| 6.2 | Create YouTube content script | 45 min |
| 6.3 | Handle YouTube's lazy-loaded comments | 30 min |
| 6.4 | Extract video title/description as main content | 15 min |

### PR #6: YouTube Extension Support
```
feat: Add YouTube support to browser extension

- Scrapes video info + comments
- Handles lazy-loaded comment sections
```

---

## Goal 7: Universal Bookmarklet (No Extension Needed)
**Why:** Works anywhere, no install required, shareable

### Objectives
- [ ] One-click bookmarklet that works on any page
- [ ] Extracts main content + visible comments
- [ ] Falls back to selected text if structure unclear

### Tasks
| # | Task | Effort |
|---|------|--------|
| 7.1 | Create bookmarklet JS that extracts page content | 45 min |
| 7.2 | Add platform detection heuristics | 30 min |
| 7.3 | Create "Get Bookmarklet" page with install instructions | 30 min |
| 7.4 | Handle selection-based extraction as fallback | 20 min |

### PR #7: Universal Bookmarklet
```
feat: Add bookmarklet for any-platform support

- Works without extension install
- Auto-detects platform
- Fallback to text selection
```

---

## Priority Order

| Priority | Goal | Impact | Effort |
|----------|------|--------|--------|
| 🔴 P0 | User Profile System | High - makes it usable | 2-3 hrs |
| 🔴 P0 | Universal Paste Support | High - instant multi-platform | 1 hr |
| 🟡 P1 | Reddit Extension | High - deep discussions | 2 hrs |
| 🟡 P1 | LinkedIn Extension | Medium - B2B value | 2 hrs |
| 🟢 P2 | Hacker News Extension | Medium - technical audience | 1 hr |
| 🟢 P2 | YouTube Extension | Medium - mass audience | 2 hrs |
| 🟢 P2 | Universal Bookmarklet | Medium - no-install option | 2 hrs |

---

## Execution Plan

### Sprint 1: Foundation (Today)
- [ ] PR #1: User Profile System
- [ ] PR #2: Universal Content Support

### Sprint 2: Major Platforms
- [ ] PR #3: Reddit Extension
- [ ] PR #4: LinkedIn Extension

### Sprint 3: Expansion
- [ ] PR #5: Hacker News Extension
- [ ] PR #6: YouTube Extension
- [ ] PR #7: Universal Bookmarklet

---

## Future Considerations
- **Saved analyses** - History of past analyses
- **Export options** - PDF, Notion, markdown
- **Team sharing** - Share analyses with others
- **API access** - Let power users integrate
- **Mobile app** - Share sheet integration on iOS/Android
