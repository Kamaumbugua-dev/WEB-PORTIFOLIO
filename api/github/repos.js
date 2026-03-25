const axios = require('axios');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const username = process.env.GITHUB_USERNAME || 'kamaumbugua-dev';
  const headers = { 'User-Agent': 'Portfolio-App' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;

  try {
    const { data } = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=9&sort=pushed`,
      { headers }
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
    res.status(200).json({ repos });
  } catch (err) {
    res.status(500).json({ error: 'GitHub repos error', details: err.message });
  }
};
