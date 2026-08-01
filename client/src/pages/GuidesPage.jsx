import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/common/Icons';
import { EmptyState } from '../components/common/Toast';

export default function GuidesPage() {
  const { showToast } = useApp();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectGuide, setInspectGuide] = useState(null);

  useEffect(() => {
    fetchGuideRequests();
  }, []);

  const fetchGuideRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/guides');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Fetch guide requests error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuideAction = async (id, accept) => {
    try {
      const res = await api.post('/guides/action', { id, accept });
      if (res.data.success) {
        showToast(res.data.message);
        setInspectGuide(null);
        fetchGuideRequests();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Faculty Guide & Mentorship Requests</h1>
          <p>Inspect project proposals and accept or decline mentorship requests from students.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        {loading ? (
          <div style={{ color: 'var(--muted)', padding: '30px' }}>Loading guide requests...</div>
        ) : requests.length ? (
          <table>
            <thead>
              <tr>
                <th>Student Requester</th>
                <th>External Project Title</th>
                <th>Date Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((g) => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}><span className="clickable-name">{g.student}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{g.project}</td>
                  <td style={{ color: 'var(--muted)' }}>{g.requested}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setInspectGuide(g)}>
                      <Icon name="eye" size={14} /> Inspect Details
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleGuideAction(g.id, true)}>
                      <Icon name="check" size={14} /> Accept Guide Request
                    </button>
                    <button className="btn btn-danger-outline btn-sm" onClick={() => handleGuideAction(g.id, false)}>
                      <Icon name="x" size={14} /> Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState msg="No pending guide requests assigned to you." ic="chat" />
        )}
      </div>

      {/* INSPECTION MODAL BEFORE ACCEPTING/DECLINING GUIDE REQUEST */}
      {inspectGuide && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setInspectGuide(null)}>
          <div className="modal" style={{ width: '560px', maxWidth: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Project Proposal: {inspectGuide.project}</h3>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
                  Mentorship Request from Student: <b style={{ color: '#fff' }}>{inspectGuide.student}</b>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setInspectGuide(null)}><Icon name="x" size={18} /></button>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '13px', lineHeight: 1.6, color: '#e2e8f0' }}>
              <b style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>External Project Abstract & Goals:</b>
              {inspectGuide.abstract || inspectGuide.details || 'The student has requested your academic faculty mentorship and guide supervision for this external research project.'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px', fontSize: '12.5px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <b style={{ color: 'var(--muted)', display: 'block' }}>Submission Date:</b>
                <span style={{ color: '#fff', fontWeight: 600 }}>{inspectGuide.requested}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <b style={{ color: 'var(--muted)', display: 'block' }}>Project Classification:</b>
                <span className="badge badge-gray" style={{ marginTop: '2px' }}>External Academic Project</span>
              </div>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
              <button className="btn btn-outline" onClick={() => setInspectGuide(null)}>Close</button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-danger-outline" onClick={() => handleGuideAction(inspectGuide.id, false)}>
                  <Icon name="x" size={14} /> Decline Mentorship
                </button>
                <button className="btn btn-primary" onClick={() => handleGuideAction(inspectGuide.id, true)}>
                  <Icon name="check" size={14} /> Accept as Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
