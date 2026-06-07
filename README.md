# AI Agency Niche Evaluator

A standalone tool for scoring AI agency niches using the 7-point framework from Luke Pierce (Boom Automations).

## Stack
- `index.html` — single-file frontend, no build step
- `netlify/functions/analyze.js` — Netlify Function proxy to Anthropic API
- `netlify.toml` — Netlify config

## Deploy to Netlify

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/YOUR_USER/niche-scorer.git
git push -u origin main
```

### 2. Connect in Netlify
- New site → Import from GitHub → select repo
- Build command: *(leave blank)*
- Publish directory: `.`

### 3. Add environment variable
In Netlify → Site settings → Environment variables:
```
ANTHROPIC_API_KEY = sk-ant-...
```

### 4. Deploy
Trigger a deploy. The "Get AI analysis" button calls `/.netlify/functions/analyze`.

## Local dev
```bash
npm install -g netlify-cli
netlify dev
```
Set `ANTHROPIC_API_KEY` in a `.env` file locally.
