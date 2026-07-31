import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/common/Icons';
import { EmptyState } from '../components/common/Toast';

export default function GuidesPage() {
  const { showToast } = useApp();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <h1>Guide Requests</h1>
          <p>Students requesting your mentorship on external projects.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        {loading ? (
          <div style={{ color: 'var(--muted)', padding: '30px' }}>Loading guide requests...</div>
        ) : requests.length ? (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Project</th>
                <th>Requested</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((g) => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}><span className="clickable-name">{g.student}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{g.project}</td>
                  <td style={{ color: 'var(--muted)' }}>{g.requested}</td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleGuideAction(g.id, true)}>Accept</button>
                    <button className="btn btn-danger-outline btn-sm" onClick={() => handleGuideAction(g.id, false)}>Decline</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState msg="No pending guide requests." ic="chat" />
        )}
      </div>
    </div>
  );
}
