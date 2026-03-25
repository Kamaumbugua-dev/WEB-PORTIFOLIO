const axios = require('axios');

const EVENT_META = {
  PushEvent:           { label: 'COMMIT',       color: '#00d4ff' },
  CreateEvent:         { label: 'CREATE',        color: '#00ffb3' },
  DeleteEvent:         { label: 'DELETE',        color: '#ff6b6b' },
  WatchEvent:          { label: 'STAR',          color: '#f0c040' },
  ForkEvent:           { label: 'FORK',          color: '#7b61ff' },
  PullRequestEvent:    { label: 'PULL REQUEST',  color: '#a78bfa' },
  IssuesEvent:         { label: 'ISSUE',         color: '#fb923c' },
  IssueCommentEvent:   { label: 'COMMENT',       color: '#94a3b8' },
  PublicEvent:         { label: 'PUBLISHED',     color: '#00ffb3' },
  MemberEvent:         { label: 'MEMBER',        color: '#94a3b8' },
  ReleaseEvent:        { label: 'RELEASE',       color: '#f0c040' },
};

function describe(event) {
  const p = event.payload;
  switch (event.type) {
    case 'PushEvent': {
      const commits = p.commits || [];
      const msg = commits.length > 0 ? commits[commits.length - 1].message : 'Pushed changes';
      const branch = (p.ref || '').replace('refs/heads/', '');
      return { summary: msg.split('\n')[0].slice(0, 80), detail: branch ? `on ${branch}` : '' };
    }
    case 'CreateEvent':
      return { summary: `Created ${p.ref_type}${p.ref ? ': ' + p.ref : ''}`, detail: p.description || '' };
    case 'DeleteEvent':
      return { summary: `Deleted ${p.ref_type}: ${p.ref}`, detail: '' };
    case 'WatchEvent':
      return { summary: 'Starred repository', detail: '' };
    case 'ForkEvent':
      return { summary: 'Forked repository', detail: p.forkee ? p.forkee.full_name : '' };
    case 'PullRequestEvent':
      return { summary: p.pull_request ? p.pull_request.title.slice(0, 80) : 'Pull request', detail: p.action || '' };
    case 'IssuesEvent':
      return { summary: p.issue ? p.issue.title.slice(0, 80) : 'Issue', detail: p.action || '' };
    case 'IssueCommentEvent':
      return { summary: p.comment ? p.comment.body.slice(0, 80) : 'Left a comment', detail: '' };
    case 'PublicEvent':
      return { summary: 'Made repository public', detail: '' };
    case 'ReleaseEvent':
      return { summary: p.release ? `Released ${p.release.tag_name}` : 'New release', detail: p.release ? p.release.name : '' };
    default:
      return { summary: event.type.replace('Event', ''), detail: '' };
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const username = process.env.GITHUB_USERNAME || 'kamaumbugua-dev';
  const headers = { 'User-Agent': 'Portfolio-App' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;

  try {
    const { data: raw } = await axios.get(
      `https://api.github.com/users/${username}/events/public?per_page=20`,
      { headers }
    );

    const now = Date.now();
    const events = raw.slice(0, 15).map(e => {
      const meta = EVENT_META[e.type] || { label: e.type.replace('Event',''), color: '#94a3b8' };
      const { summary, detail } = describe(e);
      const ts = new Date(e.created_at).getTime();
      const diffMs = now - ts;
      const diffMin = Math.floor(diffMs / 60000);
      const diffHr  = Math.floor(diffMs / 3600000);
      const diffDay = Math.floor(diffMs / 86400000);
      const timeAgo = diffMin < 60
        ? `${diffMin}m ago`
        : diffHr < 24
          ? `${diffHr}h ago`
          : `${diffDay}d ago`;
      const recent = diffMs < 86400000; // within 24h

      return {
        id: e.id,
        type: e.type,
        label: meta.label,
        color: meta.color,
        repo: e.repo.name,
        repoUrl: `https://github.com/${e.repo.name}`,
        summary,
        detail,
        timeAgo,
        recent,
        createdAt: e.created_at
      };
    });

    res.status(200).json({ events, username });
  } catch (err) {
    res.status(500).json({ error: 'GitHub events error', details: err.message });
  }
};
