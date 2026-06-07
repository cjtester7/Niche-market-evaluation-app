# AI Agency Niche Evaluator

A standalone tool for scoring AI agency niches using the 7-point framework from Luke Pierce (Boom Automations).

---

## Changelog

| CR     | Version | Date       | Files Changed                              | Summary                                                   |
|--------|---------|------------|--------------------------------------------|-----------------------------------------------------------|
| CR001  | v1.0    | 2026-06-06 | index-v1.html, analyze-v1.js, netlify.toml | Initial build — 7-point scorer, AI analysis via Netlify Function |
| CR002  | v2.0    | 2026-06-06 | index-v2.html, analyze-v2.js, netlify.toml | PDF export, mobile/tablet responsive layout, version headers |

---

## Stack

- `index-v2.html` — single-file frontend, no build step
- `netlify/functions/analyze-v2.js` — Netlify Function proxy to Anthropic API
- `netlify.toml` — Netlify config

---

## Deploy to Netlify

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "CR002 — v2.0 PDF export and mobile responsive"
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
Trigger a deploy. The AI analysis button calls `/.netlify/functions/analyze-v2`.

---

## File Naming Convention

```
index-v1.html          ← CR001 initial
index-v2.html          ← CR002 PDF + mobile
analyze-v1.js          ← CR001 initial
analyze-v2.js          ← CR002 version header update
```

---

## Local dev
```bash
npm install -g netlify-cli
netlify dev
```
Set `ANTHROPIC_API_KEY` in a `.env` file locally.
