# AI Agency Niche Evaluator

A standalone tool for scoring AI agency niches using the 7-point framework from Luke Pierce (Boom Automations).

---

## Changelog

| CR    | Version | Date                    | Files Changed                                        | Summary                                                                     |
|-------|---------|-------------------------|------------------------------------------------------|-----------------------------------------------------------------------------|
| CR001 | v1.0    | 2026-06-06 @ 20:00 EST  | index-v1.html, analyze.js, netlify.toml              | Initial build — 7-point scorer, AI analysis via Netlify Function            |
| CR002 | v2.0    | 2026-06-06 @ 21:00 EST  | index-v2.html, analyze.js, netlify.toml              | PDF export, mobile/tablet responsive layout, version headers added          |
| CR003 | v3.0    | 2026-06-06 @ 22:55 EST  | index-v2.html (header), analyze.js (header), netlify.toml, README | Naming convention docs, EST timestamps, correct zip structure, PDF dependency note |

---

## File Naming Convention

### HTML / CSS / JS assets
Version suffix goes in the **filename**:
```
index-v1.html       ← CR001 initial build
index-v2.html       ← CR002 PDF export + mobile responsive
```

### Netlify Functions
Netlify resolves functions by **filename only** — there is no native config to alias or redirect individual function names. The deployed filename must always match the frontend fetch path.

```
Frontend calls:   /.netlify/functions/analyze
Deployed file:    netlify/functions/analyze.js   ← must always be this name
```

Version tracking for functions lives **inside the file header**, not in the filename:
```js
/*
  FILE:        analyze.js
  VERSIONED:   analyze-v3.js     ← logical version alias
  DEPLOYED_AS: analyze.js        ← what Netlify sees
  VERSION:     3.0
  ...
*/
```

This convention is also documented in `netlify.toml` under the `[functions]` section.

---

## Project Structure
```
niche-scorer/
├── index-v2.html                   ← frontend (current: v2)
├── netlify.toml                    ← build + function config
├── README.md
└── netlify/
    └── functions/
        └── analyze.js              ← Anthropic API proxy (versioned: v3)
```

---

## Deploy to Netlify

### 1. Extract zip (structure is pre-set)
The zip extracts to the correct folder structure — no manual moving needed.

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "CR003 — naming convention, timestamps, zip structure"
git remote add origin https://github.com/YOUR_USER/niche-scorer.git
git push -u origin main
```

### 3. Connect in Netlify
- New site → Import from GitHub → select repo
- Build command: *(leave blank)*
- Publish directory: `.`

### 4. Add environment variable
In Netlify → Site settings → Environment variables:
```
ANTHROPIC_API_KEY = sk-ant-...
```

### 5. Deploy
Trigger a redeploy. The AI analysis button calls `/.netlify/functions/analyze`.

---

## Local dev
```bash
npm install -g netlify-cli
netlify dev
```
Set `ANTHROPIC_API_KEY` in a `.env` file locally.
