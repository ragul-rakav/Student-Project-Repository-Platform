import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icons';

const roleMeta = {
  Student: { icon: 'bulb', line: 'Submit projects, publish ideas, and climb the leaderboard.' },
  Faculty: { icon: 'book', line: 'Review submissions, accept guide requests, award credits.' },
  Administrator: { icon: 'shield', line: 'Oversee the repository, users, and platform analytics.' },
};

export default function LoginPage() {
  const [loginRole, setLoginRole] = useState('Student');
  const [email, setEmail] = useState('alex@university.edu');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleRoleChange = (r) => {
    setLoginRole(r);
    if (r === 'Faculty') setEmail('sarah.smith@university.edu');
    else if (r === 'Administrator') setEmail('admin@university.edu');
    else setEmail('alex@university.edu');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password, loginRole);
      showToast(`Welcome back, ${data.user.name} (${data.user.role})`);
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-side">
        <div className="top">
          <div className="brand-mark" style={{ background: '#1f3d8f' }}>
            <Icon name="book" size={18} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '17px' }}>ProjectHub</span>
        </div>
        <div>
          <h2>Showcase your work. Get verified. Earn recognition.</h2>
          <p>One login, three experiences — students submit and collaborate, faculty review and guide, admins keep the repository healthy.</p>
        </div>
        <div className="quote">"Built for academic excellence" — used across Computer Science, IT, Electronics & Mechanical departments.</div>
      </div>

      <div className="login-form-wrap">
        <div className="login-card">
          <h1>Sign in</h1>
          <p className="sub">Choose your role and enter your credentials to continue.</p>

          <div className="role-toggle">
            {Object.keys(roleMeta).map((r) => (
              <div
                key={r}
                className={`r ${loginRole === r ? 'active' : ''}`}
                onClick={() => handleRoleChange(r)}
              >
                <Icon name={roleMeta[r].icon} size={15} />
                <span>{r}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '-12px 0 18px' }}>
            {roleMeta[loginRole].line}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="login-actions-row">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)' }}>
                <input type="checkbox" style={{ width: 'auto' }} defaultChecked /> Remember me
              </label>
              <a onClick={() => showToast('Password reset link sent to ' + email)}>Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
              {loading ? 'Authenticating...' : `Continue as ${loginRole}`} <Icon name="arrow" size={15} />
            </button>
          </form>

          <div className="demo-hint">
            <Icon name="shield" size={14} /> Direct JWT authentication enabled — select any role above to sign in.
          </div>

          <div className="login-switch">
            New to ProjectHub? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
