# TweetMiner Roadmap

## Current State (v1.2)
- Multi-platform Chrome extension (Twitter, Reddit, LinkedIn, HN, YouTube)
- Universal bookmarklet (no extension needed)
- Haiku 3.5 → Sonnet 4.5 pipeline
- Customizable user profiles
- Platform-aware analysis
- **NEW:** Analysis history (auto-save, reload, delete)
- **NEW:** Export to markdown
- **NEW:** Keyboard shortcuts (Cmd/Ctrl+Enter)
- Clean minimal UI
- Live at tweetminer.nolimitjones.com

---

## Completed

### Goal 1: User Profile System
- [x] Users can define who they are and what they're looking for
- [x] System prompts dynamically use their profile
- [x] Profile persists across sessions (localStorage)
- [x] Easy to update via settings modal
- [x] First-time setup flow

### Goal 2: Universal Content Support
- [x] Platform selector (Twitter, Reddit, LinkedIn, HN, YouTube, Other)
- [x] Generic field labels
- [x] Platform-aware summarization prompts

### Goal 3-6: Multi-Platform Extension
- [x] Twitter/X support
- [x] Reddit support (new + old Reddit)
- [x] LinkedIn support
- [x] Hacker News support
- [x] YouTube support
- [x] Right-click context menu on all platforms
- [x] Popup with content preview

### Goal 7: Universal Bookmarklet
- [x] One-click bookmarklet at /bookmarklet.html
- [x] Auto-detects platform
- [x] Falls back to selected text on unsupported sites
- [x] Drag-to-install UI

### Goal 8: Analysis History
- [x] Auto-save analyses to localStorage (max 50)
- [x] History modal with delete, clear all
- [x] Click to reload past content and results
- [x] Shows mode, platform, time, preview

### Goal 9: Export Options
- [x] Copy result (plain text)
- [x] Export as markdown with metadata
- [x] Includes date, platform, original content, analysis

### Goal 10: UX Polish
- [x] Keyboard shortcuts (Cmd/Ctrl+Enter to analyze, Escape to close)
- [x] Shortcut hint in footer
- [x] Link to bookmarklet in footer

---

## Future Considerations

### Team Features
- Share analyses with others
- Shared profiles/templates

### API Access
- Public API for power users
- Webhooks for automation

### Mobile Support
- Share sheet integration on iOS/Android
- PWA support

### Advanced Features
- Custom analysis modes
- Batch analysis
- RSS/webhook integrations

---

## Technical Notes

### Extension Structure
```
extension/
├── manifest.json      # v3, all platform permissions
├── background.js      # Context menu, message handling
├── content.js         # Platform detection + scrapers
├── popup.html/js      # Extension popup UI
└── icons/             # Extension icons
```

### Bookmarklet
```
public/bookmarklet.html  # Install page with drag-to-install
bookmarklet/bookmarklet.js  # Source (minified in HTML)
```

### API Pipeline
1. Haiku 3.5 summarizes replies (cheap, fast)
2. Sonnet 4.5 performs analysis (smart, personalized)
3. Profile data injected into system prompts
4. Platform context shapes summarization approach

### Data Storage
- `tweetminer_auth` - Auth token
- `tweetminer_profile` - User profile JSON
- `tweetminer_history` - Analysis history (max 50 items)
