# Premium ML/DL Portfolio (React + Express + Render)

This repo contains a full-stack premium portfolio for a Machine Learning / Deep Learning engineer.

- Frontend: React (deploy to Netlify/Vercel)
- Backend: Node.js (Express) deployed on Render
- Contact handling: Formspree
- CV LLM extraction: OpenAI endpoint
- GitHub live activity dot + repo proof data

## Quick Start

### Backend (Render)

1. Install:
   - `cd backend`
   - `npm install`
2. Create `.env` from `.env.example` and set values:
   - `OPENAI_API_KEY=sk-...`
3. Deploy to Render:
   - Connect GitHub repo to Render
   - Set environment variables in Render dashboard
   - Deploy as Web Service (Node.js)

### Frontend

1. Install:
   - `cd frontend`
   - `npm install`
2. Start:
   - `npm start`
3. Open `http://localhost:3000`

## Notes
- Set `REACT_APP_GITHUB_USERNAME` in `frontend/.env` to your GitHub handle.
- For Formspree contact, replace `FORM_ID` in `src/components/ContactForm.js` with your form ID.
- To enable CV analysis, configure OpenAI key in backend on Render.
