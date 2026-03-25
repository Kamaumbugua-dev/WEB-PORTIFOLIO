const axios = require('axios');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const username = process.env.GITHUB_USERNAME || 'kamaumbugua-dev';
  const headers = { 'User-Agent': 'Portfolio-App' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;

  try {
    const { data: events } = await axios.get(
      `https://api.github.com/users/${username}/events/public`,
      { headers }
    );
    const active = events.some(e => (Date.now() - new Date(e.created_at)) < 86400000);
    res.status(200).json({ active, checkedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'GitHub activity error', details: err.message });
  }
};
