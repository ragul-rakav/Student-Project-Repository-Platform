import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import Icon from '../components/common/Icons';

export default function AdminCenterPage() {
  const { showToast } = useApp();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'users';

  const [tab, setTab] = useState(initialTab);

  // Users state
  const [users, setUsers] = useState([]);
  const [addUserModal, setAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Student');

  // Departments state
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');

  // Tiers state
  const [tierIdea, setTierIdea] = useState(60);
  const [tierInternal, setTierInternal] = useState(100);
  const [tierExternal, setTierExternal] = useState(200);

  // Reports state
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (queryParams.get('tab')) {
      setTab(queryParams.get('tab'));
    }
  }, [location.search]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [uRes, dRes, tRes, repRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/departments'),
        api.get('/admin/tiers'),
        api.get('/admin/reports')
      ]);

      if (uRes.data.success) setUsers(uRes.data.users);
      if (dRes.data.success) setDepartments(dRes.data.departments);
      if (tRes.data.success) {
        const tiers = tRes.data.accessTiers;
        if (tiers[1]) setTierIdea(tiers[1].min);
        if (tiers[2]) setTierInternal(tiers[2].min);
        if (tiers[3]) setTierExternal(tiers[3].min);
      }
      if (repRes.data.success) setReports(repRes.data.reports);
    } catch (err) {
      console.error('Fetch admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', { name: newUserName, email: newUserEmail, role: newUserRole });
      if (res.data.success) {
        showToast(res.data.message);
        setAddUserModal(false);
        setNewUserName(''); setNewUserEmail('');
        fetchAdminData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleRemoveUser = async (id, name) => {
    if (window.confirm(`Remove ${name} from ProjectHub?`)) {
      try {
        const res = await api.delete(`/admin/users/${id}`);
        if (res.data.success) {
          showToast(res.data.message);
          fetchAdminData();
        }
      } catch (err) {
        showToast('Remove user failed');
      }
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    try {
      const res = await api.post('/admin/departments', { name: newDeptName });
      if (res.data.success) {
        showToast(res.data.message);
        setNewDeptName('');
        setDepartments(res.data.departments);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add department');
    }
  };

  const handleRemoveDepartment = async (name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" department?`)) {
      try {
        const res = await api.delete(`/admin/departments/${encodeURIComponent(name)}`);
        if (res.data.success) {
          showToast(res.data.message);
          setDepartments(res.data.departments);
        }
      } catch (err) {
        showToast('Remove department failed');
      }
    }
  };

  const handleSaveTiers = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/admin/tiers', { idea: tierIdea, internal: tierInternal, external: tierExternal });
      if (res.data.success) {
        showToast(res.data.message);
      }
    } catch (err) {
      showToast('Save tiers failed');
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      const res = await api.post('/admin/reports/resolve', { reportId, action });
      if (res.data.success) {
        showToast(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      showToast('Resolve report failed');
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--muted)', padding: '40px' }}>Loading Admin Center...</div>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Admin Center</h1>
          <p>Manage users, departments, repository tiers, and review project reports.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '22px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="sub-tabs">
          <div className={`sub-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users</div>
          <div className={`sub-tab ${tab === 'reports' ? 'active' : ''}`} onClick={() => setTab('reports')}>
            Project Reports {reports.filter(r => r.status === 'Pending').length > 0 && `(${reports.filter(r => r.status === 'Pending').length})`}
          </div>
          <div className={`sub-tab ${tab === 'departments' ? 'active' : ''}`} onClick={() => setTab('departments')}>Departments</div>
          <div className={`sub-tab ${tab === 'tiers' ? 'active' : ''}`} onClick={() => setTab('tiers')}>Repository Tiers</div>
        </div>

        {tab === 'users' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>All Registered Users</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setAddUserModal(true)}>
                <Icon name="plus" size={14} /> Add User
              </button>
            </div>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{u.name}</td>
                    <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                    <td><span className="badge badge-gray"><Icon name="shield" size={11} /> {u.role}</span></td>
                    <td><span className="badge badge-green">{u.status}</span></td>
                    <td><button className="btn btn-outline btn-sm" onClick={() => handleRemoveUser(u.id, u.name)}>Remove Account</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reports' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>Reported Projects Moderation Queue</h3>
            </div>
            {reports.length ? (
              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Reporter</th>
                    <th>Category</th>
                    <th>Reason / Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, color: '#fff' }}>{r.projectTitle}</td>
                      <td>{r.reporter}</td>
                      <td><span className="badge badge-gray">{r.category}</span></td>
                      <td style={{ color: '#cbd5e1', maxWidth: '280px', fontSize: '12.5px' }}>{r.reason}</td>
                      <td>
                        <span className={`badge ${r.status === 'Pending' ? 'badge-yellow' : 'badge-gray'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-danger-outline btn-sm" onClick={() => handleResolveReport(r.id, 'deleteProject')}>
                              Approve & Delete Project
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => handleResolveReport(r.id, 'reject')}>
                              Dismiss Report
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty" style={{ padding: '30px' }}><Icon name="check" size={30} /><div>No reported projects at this time.</div></div>
            )}
          </div>
        )}

        {tab === 'departments' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <form onSubmit={handleAddDepartment} style={{ display: 'flex', gap: '10px' }}>
                <input
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="search-input"
                  style={{ paddingLeft: '12px', width: '250px' }}
                  placeholder="e.g. Aerospace Engineering"
                />
                <button type="submit" className="btn btn-primary btn-sm">Add Department</button>
              </form>
            </div>
            <table>
              <thead>
                <tr><th>Department Name</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {departments.map((d, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{d}</td>
                    <td><button className="btn btn-danger-outline btn-sm" onClick={() => handleRemoveDepartment(d)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'tiers' && (
          <form onSubmit={handleSaveTiers} style={{ maxWidth: '400px', marginTop: '10px' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '18px' }}>
              Edit the credit point requirements for students to access repositories. Minimum approved projects count is always 3.
            </p>
            <div className="field">
              <label>Ideas Repository Access (Credits)</label>
              <input type="number" value={tierIdea} onChange={(e) => setTierIdea(e.target.value)} required />
            </div>
            <div className="field">
              <label>Internal Projects Access (Credits)</label>
              <input type="number" value={tierInternal} onChange={(e) => setTierInternal(e.target.value)} required />
            </div>
            <div className="field">
              <label>External Projects Access (Credits)</label>
              <input type="number" value={tierExternal} onChange={(e) => setTierExternal(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Tiers Settings</button>
          </form>
        )}
      </div>

      {/* MODAL: ADD USER */}
      {addUserModal && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setAddUserModal(false)}>
          <div className="modal">
            <h3>Add User</h3>
            <p className="hint">Invite a new student, faculty, or administrator account.</p>
            <form onSubmit={handleAddUser}>
              <div className="field"><label>Full name</label><input required value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="e.g. Meera Iyer" /></div>
              <div className="field"><label>Email</label><input required type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="name@university.edu" /></div>
              <div className="field">
                <label>Role</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} style={{ background: 'rgba(3,7,18,0.4)', color: '#fff' }}>
                  <option>Student</option>
                  <option>Faculty</option>
                  <option>Administrator</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setAddUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add user</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
