const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 5000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ── GitHub: live activity dot ────────────────────────────────
app.get('/api/github/:username/activity', async (req, res) => {
  const { username } = req.params;
  try {
    const { data: events } = await axios.get(
      `https://api.github.com/users/${username}/events/public`,
      { headers: { 'User-Agent': 'Portfolio-App', ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }) } }
    );
    const active = events.some(e => (Date.now() - new Date(e.created_at)) < 86400000);
    res.json({ active, checkedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'GitHub activity error', details: err.message });
  }
});

// ── GitHub: repos ────────────────────────────────────────────
app.get('/api/github/:username/repos', async (req, res) => {
  const { username } = req.params;
  try {
    const { data } = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=9&sort=pushed`,
      { headers: { 'User-Agent': 'Portfolio-App', ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }) } }
    );
    const repos = data.map(r => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      url: r.html_url,
      pushed_at: r.pushed_at
    }));
    res.json({ repos });
  } catch (err) {
    res.status(500).json({ error: 'GitHub repos error', details: err.message });
  }
});

// ── CV analysis via Groq ─────────────────────────────────────
app.post('/api/cv/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim().length < 10) {
    return res.status(400).json({ error: 'CV text is too short or missing.' });
  }

  const systemPrompt = `You are a world-class AI/ML talent strategist and hiring advisor.
Your job is to analyze a candidate's CV and produce an honest, highly positive, and deeply insightful report
that helps recruiters understand exactly why this person is exceptional. Use natural, confident, energetic language.
Format using markdown with clear headings and bullet points.`;

  const userPrompt = `Analyze this CV and produce a structured report with these exact sections:

## Key Achievements
List 4–5 standout accomplishments with metrics or impact where available.

## Technical Strengths
Identify 5–6 technical skills or areas where this candidate clearly excels, with brief explanations of depth.

## Why Hire This Candidate
Write 3 compelling, confident positioning statements for ML Engineering, Deep Learning, and Data Analytics roles.

## Competitive Edge
Compared to the typical pool of ML/AI engineering candidates, what makes this person distinctly valuable?

## Interview Talking Points
Suggest 3–4 strong angles the candidate should lead with in interviews.

CV:
${text}`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.75,
      max_tokens: 1024
    });

    const analysis = completion.choices?.[0]?.message?.content || 'No analysis returned.';
    res.json({ analysis });
  } catch (err) {
    console.error('Groq CV analysis error:', err.message);
    res.status(500).json({ error: 'CV analysis failed.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  ✓ Portfolio backend running on http://localhost:${PORT}`);
  console.log(`  ✓ Groq model: llama-3.3-70b-versatile`);
  console.log(`  ✓ GitHub username: ${process.env.GITHUB_USERNAME || 'kamambugua-dev'}\n`);
});
