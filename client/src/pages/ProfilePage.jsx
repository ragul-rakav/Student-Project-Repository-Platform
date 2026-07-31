import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/common/Icons';
import { BadgeType, BadgeStatus } from '../components/common/Badge';
import { EmptyState } from '../components/common/Toast';

export default function ProfilePage() {
  const { currentUser, updateProfileState } = useAuth();
  const { showToast } = useApp();

  const [domain, setDomain] = useState(currentUser?.domain_of_interest || '');
  const [skills, setSkills] = useState((currentUser?.skills || []).join(', '));
  const [portfolio, setPortfolio] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [currentUser]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      if (res.data.success) {
        setPortfolio(res.data.portfolio);
        setIdeas(res.data.ideas);
        setInReview(res.data.inReview);
        setDomain(res.data.user.domain_of_interest || '');
        setSkills((res.data.user.skills || []).join(', '));
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
      const res = await api.put('/profile', { domainOfInterest: domain, skills: skillsArray });
      if (res.data.success) {
        showToast(res.data.message);
        updateProfileState(res.data.user);
      }
    } catch (err) {
      showToast('Failed to update profile');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Student Profile</h1>
          <p>Manage your portfolio, skills, and academic interests.</p>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          <div className="card" style={{ padding: '22px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '17px', color: '#fff' }}>
              Portfolio Projects ({portfolio.length + ideas.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {portfolio.map((p) => (
                <div key={p.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14.5px', color: '#fff' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Category: {p.category}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <BadgeType type={p.type} />
                    <BadgeStatus status={p.status} />
                  </div>
                </div>
              ))}
              {ideas.map((p) => (
                <div key={p.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14.5px', color: '#fff' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Category: {p.category}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <BadgeType type={p.type} />
                  </div>
                </div>
              ))}
              {inReview.map((p) => (
                <div key={p.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderColor: 'var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14.5px', color: 'var(--muted)' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>Category: {p.category}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <BadgeType type={p.type} />
                    <BadgeStatus status={p.status} />
                  </div>
                </div>
              ))}
              {portfolio.length === 0 && ideas.length === 0 && inReview.length === 0 && (
                <EmptyState msg="No projects uploaded yet." ic="folder" />
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '17px', color: '#fff' }}>Edit Profile Details</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="field">
                <label>Department</label>
                <input type="text" disabled value={currentUser?.dept || ''} />
              </div>
              <div className="field">
                <label>Academic Year</label>
                <input type="text" disabled value={currentUser?.academic_year || ''} />
              </div>
              <div className="field">
                <label>Domain of Interest</label>
                <input
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Machine Learning, Web Dev"
                />
              </div>
              <div className="field">
                <label>Skills (comma separated)</label>
                <input
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Python, SQL"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Save Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
