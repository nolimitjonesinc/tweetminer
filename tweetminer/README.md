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

 

## Sign-in and costs

- The password is checked on the server, and every analysis request must carry a valid sign-in (it lasts 30 days). Calling the analysis endpoint directly without signing in is refused, so strangers can't run up the AI bill.
- Each request is capped at 12,000 characters of tweet + replies.
- The AI model can be changed with the `TWEETMINER_MODEL` env var (default `claude-sonnet-4-20250514`).

## What's left for Danny

- **After this update goes live, sign in once more.** Old saved sign-ins stop working on purpose (they contained the password).
- **Change `SITE_PASSWORD`** in Vercel (Settings → Environment Variables → edit → Redeploy). The old sign-in token in your browser could be decoded back into the password, so treat the current one as seen.
- **Check the model still works**: if analyses fail with a "model" error, set `TWEETMINER_MODEL` in Vercel to a current Claude model name and redeploy.
