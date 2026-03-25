# Steven Kamau Mbugua — ML & Deep Learning Engineer Portfolio

> **Production-grade personal portfolio** for a Machine Learning & Deep Learning Engineer and Founder of [Axon Lattice Labs](https://github.com/Kamaumbugua-dev). Built with a premium **liquid glass UI**, live GitHub integration, AI-powered CV analysis, and a public resume viewer — all deployed serverlessly on Vercel.

---

## Live Demo

🌐 **[https://web-portifolio.vercel.app](https://web-portifolio.vercel.app)**

---

## Screenshots

| Hero — Liquid Glass Card | Resume Viewer | CV AI Analysis |
|:---:|:---:|:---:|
| Animated neural-net canvas behind a frosted glass hero card | Embedded PDF with one-click download for recruiters | Groq LLaMA-3.3-70B extracts skills, achievements & talking points |

---

## Feature Highlights

### Design
- **Apple-inspired liquid glass UI** — `backdrop-filter: blur` panels with white specular highlights and layered depth across every card, nav, and modal
- **Warm tan-grey + burnt orange palette** — radial gradient background with orange-hue overlays, fully custom CSS design system
- **Animated neural-network canvas** — 65 nodes with warm-tone connections rendered in real time on the hero canvas
- **Scroll-reveal animations**, 3D tilt on hover, typewriter headline, animated stat counters

### Functionality
| Feature | Detail |
|---|---|
| 🔴 **Live GitHub status** | Real-time activity dot — green pulse if committed in last 24 h |
| 📁 **GitHub repos feed** | 9 most-recently-pushed repos with language, stars, forks, and AI insight |
| 📋 **GitHub activity feed** | Last 15 public events (commits, PRs, issues, releases) with colour-coded labels |
| 📄 **Public resume viewer** | PDF embedded via Google Docs viewer; one-click download for recruiters |
| 🤖 **AI CV analysis** | Upload any format → Groq LLaMA-3.3-70B extracts achievements, skills & interview angles |
| 💾 **CV localStorage store** | Analysis auto-saved; restored on every page reload — no re-upload needed |
| 🏷️ **CV skills showcase** | Detected tech tags + key highlights rendered from the AI analysis |
| 📬 **Contact form** | Formspree-powered with validation and success/error feedback |

### Universal CV Upload
Accepts **every common format** with client-side text extraction — no server round-trip required:

| Format | Parser |
|---|---|
| `.pdf` | PDF.js (page-by-page text extraction) |
| `.docx` / `.doc` | mammoth.js (raw text extraction) |
| `.txt` / `.md` / `.csv` | Native `File.text()` |
| `.rtf` | Text read + RTF control-code stripping |
| `.odt` / `.ods` | mammoth.js with ASCII fallback |
| Any other | Best-effort printable-ASCII extraction |

---

## Tech Stack

```
Frontend          Vanilla JS · HTML5 · CSS3 (no framework)
Serverless API    Vercel Functions (Node.js)
AI / LLM          Groq SDK — LLaMA-3.3-70b-versatile
GitHub data       GitHub REST API (activity, repos, events)
PDF rendering     PDF.js 3.11 (client) · Google Docs Viewer (embed)
DOCX parsing      mammoth.js 1.6
Contact           Formspree
Persistence       localStorage (CV store)
Deployment        Vercel (static + serverless)
```

---

## Project Structure

```
.
├── index.html              # Single-page portfolio (all HTML + CSS + JS)
├── vercel.json             # Vercel routing config
├── package.json            # Root dependencies (axios, groq-sdk)
│
├── api/                    # Vercel serverless functions
│   ├── cv/analyze.js       # POST /api/cv/analyze  — Groq LLM CV analysis
│   └── github/
│       ├── activity.js     # GET  /api/github/activity — 24-h active check
│       ├── repos.js        # GET  /api/github/repos    — recent repos
│       └── events.js       # GET  /api/github/events   — activity feed
│
├── backend/                # Optional standalone Express server (port 5000)
│   ├── server.js
│   └── package.json
│
└── frontend/               # Optional React alternative build
    ├── src/App.js
    └── public/index.html
```

---

## Deploy to Vercel in 3 Steps

### 1 · Fork & Import

```bash
# Clone locally
git clone https://github.com/Kamaumbugua-dev/WEB-PORTIFOLIO.git
cd WEB-PORTIFOLIO
```

Import the repo at **[vercel.com/new](https://vercel.com/new)** — framework preset: **Other**.

### 2 · Set Environment Variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Value | Required |
|---|---|---|
| `GROQ_API_KEY` | `gsk_...` from [console.groq.com](https://console.groq.com) | ✅ For CV analysis |
| `GITHUB_TOKEN` | Personal access token (public repo scope) | Optional — raises rate limit to 5 000 req/h |
| `GITHUB_USERNAME` | Your GitHub handle | Optional — defaults to `kamaumbugua-dev` |

### 3 · Personalise `CONFIG` in `index.html`

```js
const CONFIG = {
  githubUsername: 'your-github-username',
  email:          'your@email.com',
  linkedin:       'https://www.linkedin.com/in/your-profile',
  formspreeId:    'your-formspree-id',   // formspree.io/f/XXXXXX
  cvDownloadUrl:  '/your-resume.pdf',    // path or public URL to your PDF
};
```

Redeploy — done.

---

## Local Development

```bash
# Install root dependencies
npm install

# Run the optional Express backend (port 5000)
cd backend && npm install && npm run dev

# Open index.html directly in a browser
# Or use any static server:
npx serve .
```

> The Vercel serverless functions (`api/`) require deployment or the Vercel CLI (`npx vercel dev`) to run locally.

---

## API Reference

### `POST /api/cv/analyze`
Accepts CV text, returns a structured Groq LLM analysis.

```json
// Request
{ "text": "...CV content..." }

// Response
{ "analysis": "## Key Achievements\n..." }
```

### `GET /api/github/activity`
Returns whether the user committed in the last 24 hours.

```json
{ "active": true, "checkedAt": "2026-03-26T10:00:00Z" }
```

### `GET /api/github/repos`
Returns the 9 most recently pushed repositories.

### `GET /api/github/events`
Returns the last 15 public GitHub events with labels, colours, summaries, and recency flags.

---

## Customisation Guide

| What | Where |
|---|---|
| Name, title, bio | `index.html` — hero & about sections |
| Skills (name, %, tags) | `index.html` — `#skills` section |
| Timeline milestones | `index.html` — `.timeline` list |
| Why Hire Me cards | `index.html` — `#why` section |
| FAQ answers | `index.html` — `#faq` section |
| Contact links | `CONFIG.email`, `CONFIG.linkedin` |
| Resume PDF | Commit PDF to repo root, set `CONFIG.cvDownloadUrl` |
| Theme colours | CSS `:root` variables at top of `<style>` block |

---

## License

MIT © 2026 [Steven Kamau Mbugua](https://github.com/Kamaumbugua-dev) — Axon Lattice Labs
