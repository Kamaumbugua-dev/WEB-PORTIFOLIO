const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    res.status(200).json({ analysis });
  } catch (err) {
    console.error('Groq CV error:', err.message);
    res.status(500).json({ error: 'CV analysis failed.', details: err.message });
  }
};
