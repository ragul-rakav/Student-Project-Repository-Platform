import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icons';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-mark" style={{ background: 'var(--accent-grad)' }}>
            <Icon name="book" size={18} />
          </div>
          <span className="brand" style={{ fontSize: '18px', fontWeight: 700 }}>ProjectHub</span>
        </div>
        <nav className="landing-nav">
          <a onClick={() => navigate('/login')}>Features</a>
          <a onClick={() => navigate('/login')}>Workflow</a>
          <a onClick={() => navigate('/login')}>Leaderboard</a>
        </nav>
        <div className="landing-actions">
          <a className="signin" onClick={() => navigate('/login')}>Sign in</a>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow"><Icon name="bulb" size={14} /> Built for academic excellence</div>
          <h1>Showcase your projects.<br />Earn recognition.</h1>
          <p className="lead">The all-in-one platform for students to submit academic and external projects, publish ideas, collaborate with peers, and build a verified portfolio — all while earning credit points.</p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Explore Dashboard <Icon name="arrow" size={15} /></button>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Browse Projects</button>
          </div>
          <div className="hero-check">
            <span><Icon name="check" size={15} /> Faculty verified</span>
            <span><Icon name="check" size={15} /> Credit points</span>
            <span><Icon name="check" size={15} /> Collaboration ready</span>
          </div>
        </div>
        <div className="hero-art">
          <svg viewBox="0 0 200 150" width="80%" height="80%">
            <rect x="10" y="20" width="46" height="30" rx="4" fill="#24346f" />
            <rect x="66" y="10" width="46" height="30" rx="4" fill="#2c3e82" />
            <rect x="122" y="30" width="46" height="30" rx="4" fill="#24346f" />
            <circle cx="150" cy="90" r="14" fill="#c9a94b" />
            <rect x="20" y="90" width="34" height="46" rx="4" fill="#2c3e82" />
            <rect x="70" y="70" width="34" height="66" rx="4" fill="#24346f" />
          </svg>
        </div>
      </section>

      <div className="stats-strip">
        <div className="stats-inner">
          <div><div className="num">1,240+</div><div className="lab">Projects Submitted</div></div>
          <div><div className="num">86</div><div class="lab">Faculty Reviewers</div></div>
          <div><div className="num">5,200+</div><div className="lab">Student Users</div></div>
          <div><div className="num">98%</div><div className="lab">Approval Rate</div></div>
        </div>
      </div>

      <section className="feat-section">
        <h2>Everything you need to manage student projects</h2>
        <p>From submission to showcase, every workflow is designed to keep quality high and collaboration flowing.</p>
        <div className="feat-grid">
          {[
            ['folder', 'Project Repositories', 'Separate spaces for internal academic projects, external showcases, and raw project ideas.'],
            ['shield', 'Faculty Verification', 'Automatic reviewer assignment for internal projects and guided approval for external work.'],
            ['award', 'Credit Point System', 'Earn points for approved projects, published ideas, and collaboration — then unlock repository access.'],
            ['users', 'Collaboration', 'Request access to existing projects, propose enhancements, and share credit with contributors.'],
            ['trophy', 'Leaderboards', 'Rankings by total credit points, approved projects, department, and academic year.'],
            ['search2', 'Smart Discovery', 'Search and filter projects by title, domain, technology, department, and popularity.'],
          ].map(([ic, t, d], i) => (
            <div key={i} className="card feat-card"><div className="icon"><Icon name={ic} size={18} /></div><h3>{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </section>

      <section className="how-section">
        <h2>How it works</h2>
        <div className="how-grid">
          {[
            ['Submit or publish', 'Share an academic project, an external build, or a raw idea in minutes.'],
            ['Get verified', 'Faculty reviewers check internal work; ideas go live instantly for peer feedback.'],
            ['Earn credits', 'Approved projects and published ideas earn credit points automatically.'],
            ['Unlock & rank', 'Spend credits to unlock repository tiers and climb the department leaderboard.'],
          ].map(([t, d], i) => (
            <div key={i} className="how-step"><div className="n">STEP {i + 1}</div><h4>{t}</h4><p>{d}</p></div>
          ))}
        </div>
      </section>

      <section className="cta-final">
        <h2>Ready to build your verified portfolio?</h2>
        <p>Join thousands of students already earning recognition for their work.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Get Started for free <Icon name="arrow" size={15} /></button>
      </section>

      <footer className="landing-footer">&copy; 2026 ProjectHub. Built for academic excellence.</footer>
    </div>
  );
}
