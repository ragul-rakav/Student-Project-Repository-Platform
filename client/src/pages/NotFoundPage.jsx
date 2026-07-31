import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: '#fff', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '72px', margin: 0, background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '10px 0' }}>Page Not Found</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '400px', marginBottom: '24px' }}>
        The page or resource you are looking for does not exist or has been moved.
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </button>
    </div>
  );
}
