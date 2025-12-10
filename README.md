# TweetMiner

Turn tweets into opportunities. Password-protected tool for analyzing tweets through three lenses:
- **EXPLOIT** - How to capitalize on the idea
- **EXPLAIN** - How it actually works (non-coder friendly)
- **PRODUCTIZE** - How to make money from it

## Setup on Vercel

### 1. Push to GitHub
Upload all these files to your `nolimitjonesinc/Tweetminer` repo.

### 2. Add Environment Variables in Vercel
Go to your Vercel project → Settings → Environment Variables

Add these two:

| Name | Value |
|------|-------|
| `SITE_PASSWORD` | Your chosen password to access the site |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (starts with `sk-ant-`) |

### 3. Redeploy
After adding the environment variables, go to Deployments → click the three dots on the latest deployment → Redeploy.

## Local Development

```bash
npm install
npm run dev
```

Create a `.env` file (don't commit this):
```
SITE_PASSWORD=yourpassword
ANTHROPIC_API_KEY=sk-ant-your-key
```

## Tech Stack
- Vite + React
- Vercel Serverless Functions
- Anthropic Claude API
