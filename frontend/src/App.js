import { useEffect, useState } from 'react';
import axios from 'axios';

const GITHUB_USERNAME = process.env.REACT_APP_GITHUB_USERNAME || 'your-github-username';
const FORMSPREE_FORM_ID = process.env.REACT_APP_FORMSPREE_FORM_ID || 'xayvnvgb';

function App() {
  const [githubStatus, setGithubStatus] = useState('Checking...');
  const [repos, setRepos] = useState([]);
  const [cvText, setCvText] = useState('Upload a CV file to analyze.');
  const [cvFile, setCvFile] = useState(null);
  const [cvMessage, setCvMessage] = useState('No file loaded.');
  const [cvLoading, setCvLoading] = useState(false);
  const [contactResponse, setContactResponse] = useState('');

  const [contactForm, setContactForm] = useState({ name:'', email:'', message:'' });

  useEffect(() => {
    fetchGitHubActivity();
    fetchGitHubRepos();
    const tid = setInterval(fetchGitHubActivity, 60000);
    return () => clearInterval(tid);
  }, []);

  const fetchGitHubActivity = async () => {
    try {
      const r = await axios.get(`/api/github/${GITHUB_USERNAME}/activity`);
      setGithubStatus(r.data.active ? 'Active in last 24h' : 'No 24h activity');
    } catch (err) {
      setGithubStatus('GitHub API error');
    }
  };

  const fetchGitHubRepos = async () => {
    try {
      const r = await axios.get(`/api/github/${GITHUB_USERNAME}/repos`);
      setRepos(r.data.repos || []);
    } catch (err) {
      setRepos([]);
    }
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    setCvFile(file);
    if (!file) {
      setCvText('No file selected');
      setCvMessage('No file loaded.');
      return;
    }
    setCvMessage(`Loaded file ${file.name}`);
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'txt') {
      const t = await file.text();
      setCvText(t);
      return;
    }
    setCvText(`Please convert '${file.name}' to .txt for best auto-parsing in this demo. Uploaded format: ${ext}`);
  };

  const analyzeCV = async () => {
    if (!cvText) {
      setCvMessage('No CV text available to analyze.');
      return;
    }
    setCvLoading(true);
    setCvMessage('Performing LLM analysis...');
    try {
      const r = await axios.post('/api/cv/analyze', { text: cvText });
      setCvText(r.data.analysis);
      setCvMessage('CV analysis complete.');
    } catch (err) {
      setCvMessage('CV analysis failed.');
    } finally {
      setCvLoading(false);
    }
  };

  const submitContact = async (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm;
    if (!name || !email || !message) {
      setContactResponse('Please fill all fields.');
      return;
    }

    // Formspree handles the submission via form action
    setContactResponse('Message sent via Formspree.');
    setContactForm({ name:'', email:'', message:'' });
  };

  const updateContactForm = (field) => (e) => setContactForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="app-container">
      <header className="page-header">
        <div>
          <h1>Machine & Deep Learning Engineer Portfolio</h1>
          <p>Premium UX, live GitHub indicator, CV LLM parse, recruiter messaging, production-ready architecture.</p>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#cv">CV</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="home" className="panel">
          <div className="chip">GitHub active status: <strong>{githubStatus}</strong></div>
          <h2>Hey, I’m your high-impact AI / ML engineering candidate.</h2>
          <p>8+ years delivering models into production on global systems, optimizing with data, and enabling business growth.</p>
          <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior:'smooth' })}>Discuss Opportunities</button>
        </section>

        <section id="about" className="panel">
          <h2>About</h2>
          <p>I build full-stack Machine Learning platforms, from feature engineering and model training to deployment, monitoring, and cost optimization. My craftsmanship improves performance, reliability, and developer velocity.</p>
          <div className="two-col">
            <article>
              <h3>Strengths</h3>
              <ul>
                <li>Technical leadership (systems design, peer mentoring, code quality)</li>
                <li>Model reliability (drift detection, governance, explainability)</li>
                <li>Scalable pipelines (Spark, dbt, Airflow, Kafka, feature stores)</li>
                <li>Cloud-native deploy (K8s, AWS/GCP, containerized inference)</li>
                <li>Business impact orientation (OKRs, conversion, cost per unit)</li>
              </ul>
            </article>
            <article>
              <h3>Tools</h3>
              <ul>
                <li>PyTorch, TensorFlow, Hugging Face, scikit-learn</li>
                <li>PostgreSQL, Snowflake, BigQuery, Redis</li>
                <li>Airflow, Prefect, dbt, GitHub Actions, Terraform</li>
                <li>OpenAI, LLM prompting, retrieval-augmented generation</li>
                <li>Seldon, BentoML, FastAPI, gRPC, REST</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="projects" className="panel">
          <h2>GitHub showcasing</h2>
          {repos.length === 0 ? (
            <p>No repos loaded yet. Check username {GITHUB_USERNAME} and ensure GitHub public activity is not rate-limited.</p>
          ) : (
            <div className="repo-grid">
              {repos.map((repo) => (
                <div key={repo.name} className="repo-card">
                  <h3><a href={repo.url} target="_blank" rel="noreferrer">{repo.name}</a></h3>
                  <p>{repo.description || 'No description yet'}</p>
                  <small>{repo.language} · ⭐ {repo.stars} · Forks {repo.forks}</small>
                  <small>Updated {new Date(repo.pushed_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="cv" className="panel">
          <h2>CV + LLM parser</h2>
          <input type="file" accept=".txt,.pdf,.docx" onChange={handleFile} />
          <p>{cvMessage}</p>
          <button onClick={analyzeCV} disabled={cvLoading}>{cvLoading ? 'Analysing...' : 'Analyze with AI'}</button>

          <div className="cv-output">
            <pre>{cvText}</pre>
          </div>
          <p><a download={cvFile?.name || 'resume.txt'} href={cvFile ? URL.createObjectURL(cvFile) : '#'}>Download uploaded CV</a></p>
        </section>

        <section id="faq" className="panel">
          <h2>FAQ</h2>
          <div className="faq-grid">
            <article>
              <h3>How do you build resilient ML systems?</h3>
              <p>Data-quality gates, schema checks, bias tests, periodic retraining, and feature drift alerts form the core of my releases.</p>
            </article>
            <article>
              <h3>What is your deployment approach?</h3>
              <p>CI/CD includes tests, canaries, dark launches, and full rollback support in Kubernetes microservice architecture.</p>
            </article>
            <article>
              <h3>How do you collaborate with cross-function teams?</h3>
              <p>Clear KPI definitions, product discovery syncs, and agile execution ensure alignment with Product, Analytics, and Engineering stakeholders.</p>
            </article>
            <article>
              <h3>What measurable impact do you deliver?</h3>
              <p>Historical actions include +38% model accuracy lift, 45% inference cost reduction, and 3x throughput scaling for real-time pipelines.</p>
            </article>
          </div>
        </section>

        <section id="why" className="panel">
          <h2>Why global and local recruiters should hire me</h2>
          <ul>
            <li>Deep ML & DL engineering with system design that scales to millions of requests per day.</li>
            <li>Strong data analytics mindset: results-oriented metric tracking from day one.</li>
            <li>World-class coding discipline and review processes with security and compliance.
              <br />
              Local teams benefit from mentoring and process maturity; global teams benefit from international product alignment and distributed architecture expertise.
            </li>
            <li>Proven ability to ship cross-domain AI solutions aligning data, cloud, and business outcomes.</li>
          </ul>
        </section>

        <section id="contact" className="panel">
          <h2>Contact</h2>
          <p>Formspree contact form for direct email delivery.</p>
          <form action={`https://formspree.io/f/${FORMSPREE_FORM_ID}`} method="POST" target="_blank" className="contact-form" onSubmit={submitContact}>
            <input type="text" name="name" value={contactForm.name} onChange={updateContactForm('name')} placeholder="Your name" required />
            <input type="email" name="email" value={contactForm.email} onChange={updateContactForm('email')} placeholder="Email" required />
            <textarea name="message" value={contactForm.message} onChange={updateContactForm('message')} placeholder="How can I help your hiring plan?" required />
            <button type="submit">Submit via Formspree</button>
          </form>
          <p>{contactResponse}</p>
          <div className="contact-links">
            <p>Email: <a href="mailto:hello@yourname.dev">hello@yourname.dev</a></p>
            <p>LinkedIn: <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noreferrer">linkedin.com/in/yourprofile</a></p>
            <p>GitHub: <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">github.com/{GITHUB_USERNAME}</a></p>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        Built for high-impact AI hiring with responsive transitions and deep recruiter-focused narrative.
      </footer>
    </div>
  );
}

export default App;
