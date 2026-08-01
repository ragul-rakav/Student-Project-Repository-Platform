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
  const [inspectItem, setInspectItem] = useState(null);

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
        setInspectItem(null);
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
                    <button className="btn btn-outline btn-sm" onClick={() => setInspectItem(r)}>
                      <Icon name="eye" size={14} /> Inspect Details
                    </button>
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

      {/* INSPECTION MODAL BEFORE APPROVAL */}
      {inspectItem && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setInspectItem(null)}>
          <div className="modal" style={{ width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <div style={{ marginBottom: '6px' }}>
                  <BadgeType type={inspectItem.type} />
                </div>
                <h3 style={{ margin: 0, fontSize: '20px' }}>
                  {inspectItem.isEnhancement ? `Enhancement: ${inspectItem.enhancementTitle}` : inspectItem.title}
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                  Submitted by <b>{inspectItem.author}</b> &middot; {inspectItem.category} &middot; {inspectItem.submitted}
                </div>
              </div>
              <button className="icon-btn" onClick={() => setInspectItem(null)}><Icon name="x" size={20} /></button>
            </div>

            <div style={{ fontSize: '13.5px', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '18px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <b style={{ color: '#fff' }}>Project Abstract & Full Description:</b><br />
              {inspectItem.abstract || inspectItem.details || inspectItem.description || 'Full project specification submitted for faculty evaluation.'}
            </div>

            {inspectItem.tech && inspectItem.tech.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <b>Technologies Used:</b>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {inspectItem.tech.map((t, idx) => (
                    <span key={idx} className="badge badge-gray">{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <b>Verified Repository & Link Materials:</b>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px', fontSize: '13px' }}>
                {inspectItem.github && <a href={inspectItem.github} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="folder" size={14} /> Source Code (GitHub)</a>}
                {inspectItem.doc && <a href={inspectItem.doc} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="book" size={14} /> Report & Documentation</a>}
                {inspectItem.ppt && <a href={inspectItem.ppt} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="award" size={14} /> Presentation (PPT)</a>}
                {inspectItem.codeLink && <a href={inspectItem.codeLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="folder" size={14} /> Pull Request Link</a>}
              </div>
            </div>

            {inspectItem.files && inspectItem.files.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <b>Uploaded Project Files:</b>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '12.5px' }}>
                  {inspectItem.files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)' }}>
                      <Icon name="folder" size={13} /> {f.fileName} ({f.fileType})
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '20px', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setInspectItem(null)}>Close</button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-danger-outline" onClick={() => handleAction(inspectItem.id, false)}>
                  <Icon name="x" size={14} /> Decline / Reject
                </button>
                <button className="btn btn-primary" onClick={() => handleAction(inspectItem.id, true)}>
                  <Icon name="check" size={14} /> Approve Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
