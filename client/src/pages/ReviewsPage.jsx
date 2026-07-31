import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/common/Icons';
import { BadgeType } from '../components/common/Badge';
import { EmptyState } from '../components/common/Toast';

export default function ReviewsPage() {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews');
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, approve) => {
    try {
      const res = await api.post('/reviews/action', { id, approve });
      if (res.data.success) {
        showToast(res.data.message);
        fetchReviews();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Reviews Queue</h1>
          <p>Approve or request changes on submitted academic projects and enhancements.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        {loading ? (
          <div style={{ color: 'var(--muted)', padding: '30px' }}>Loading review queue...</div>
        ) : reviews.length ? (
          <table>
            <thead>
              <tr>
                <th>Submission</th>
                <th>Author</th>
                <th>Type</th>
                <th>Category</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>
                    {r.isEnhancement ? `Enhancement: ${r.enhancementTitle} (${r.projectTitle || ''})` : r.title}
                  </td>
                  <td>{r.author}</td>
                  <td><BadgeType type={r.type} /></td>
                  <td style={{ color: 'var(--muted)' }}>{r.category}</td>
                  <td style={{ color: 'var(--muted)' }}>{r.submitted}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleAction(r.id, true)}>
                      <Icon name="check" size={14} /> Approve
                    </button>
                    <button className="btn btn-danger-outline btn-sm" onClick={() => handleAction(r.id, false)}>
                      <Icon name="x" size={14} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState msg="All caught up — no pending reviews." ic="check" />
        )}
      </div>
    </div>
  );
}
