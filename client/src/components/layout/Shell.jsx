import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import Icon from '../common/Icons';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Repository',
  '/ideas': 'Ideas',
  '/collaboration': 'Collaboration Center',
  '/leaderboard': 'Leaderboard',
  '/reviews': 'Reviews',
  '/guides': 'Guide Requests',
  '/analytics': 'Analytics',
  '/admin': 'Admin Center',
  '/profile': 'My Profile'
};

export default function Shell({ children }) {
  const { currentUser, logout } = useAuth();
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, toggleSidebar, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  const role = currentUser ? currentUser.role : 'Student';

  useEffect(() => {
    fetchNotifications();
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Fetch notifs error:', err);
    }
  };

  const handleNotifClick = async (n) => {
    try {
      await api.put(`/admin/notifications/${n.id}/read`);
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    } catch (err) {
      // ignore
    }
    setNotifOpen(false);
    if (n.route) {
      navigate(n.route);
    } else {
      navigate('/projects');
    }
  };

  const handleDeleteNotif = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`/admin/notifications/${id}`);
      if (res.data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        showToast('Notification cleared');
      }
    } catch (err) {
      showToast('Failed to delete notification');
    }
  };

  const getNavConfig = () => {
    if (role === 'Student') {
      return [{
        section: 'Student', items: [
          { path: '/dashboard', label: 'Dashboard', icon: 'home' },
          { path: '/projects', label: 'Projects', icon: 'folder' },
          { path: '/ideas', label: 'Ideas', icon: 'bulb' },
          { path: '/collaboration', label: 'Collaboration', icon: 'users' },
          { path: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
          { path: '/profile', label: 'My Profile', icon: 'user' },
        ]
      }];
    }
    if (role === 'Faculty') {
      return [{
        section: 'Faculty', items: [
          { path: '/dashboard', label: 'Dashboard', icon: 'home' },
          { path: '/projects', label: 'Repository', icon: 'folder' },
          { path: '/reviews', label: 'Reviews', icon: 'book' },
          { path: '/guides', label: 'Guide Requests', icon: 'chat' },
          { path: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
          { path: '/profile', label: 'My Profile', icon: 'user' },
        ]
      }];
    }
    // Administrator Super Access
    return [{
      section: 'Administration & Management', items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'home' },
        { path: '/admin', label: 'Admin Center', icon: 'usercog' },
        { path: '/projects', label: 'Repository', icon: 'folder' },
        { path: '/reviews', label: 'Reviews Queue', icon: 'book' },
        { path: '/guides', label: 'Guide Requests', icon: 'chat' },
        { path: '/ideas', label: 'Ideas', icon: 'bulb' },
        { path: '/collaboration', label: 'Collaboration', icon: 'users' },
        { path: '/analytics', label: 'Analytics', icon: 'chart' },
        { path: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
        { path: '/profile', label: 'My Profile', icon: 'user' },
      ]
    }];
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const sidebarClass = `sidebar${sidebarCollapsed ? ' collapsed' : ''}${mobileSidebarOpen ? ' mobile-open' : ''}`;

  return (
    <div className="app-shell">
      {mobileSidebarOpen && (
        <div className="scrim" onClick={() => setMobileSidebarOpen(false)}></div>
      )}
      <aside className={sidebarClass}>
        <div className="brand-row">
          <div className="brand-mark"><Icon name="book" size={18} /></div>
          <div className="brand-text">
            <div className="brand">ProjectHub</div>
            <div className="brand-sub">SHOWCASE PLATFORM</div>
          </div>
        </div>
        {getNavConfig().map((sec, idx) => (
          <div key={idx} className="nav-section">
            <div className="section-label">{sec.section}</div>
            {sec.items.map((it) => {
              const isActive = location.pathname === it.path;
              return (
                <a
                  key={it.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    navigate(it.path);
                    setMobileSidebarOpen(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  <Icon name={it.icon} size={17} />
                  <span className="nav-label">{it.label}</span>
                </a>
              );
            })}
          </div>
        ))}
        <div className="sidebar-spacer"></div>
        <a className="signout" onClick={logout}>
          <Icon name="logout" size={17} />
          <span className="signout-label">Sign out</span>
        </a>
      </aside>
      <div className="main-col">
        <div className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={toggleSidebar}>
              <Icon name="panel" size={18} />
            </button>
            <div className="crumb"><b>{pageTitles[location.pathname] || 'Dashboard'}</b></div>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Interactive Notification Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="icon-btn"
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Icon name="bell" size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px', background: '#f43f5e', color: '#fff',
                    borderRadius: '50%', width: '15px', height: '15px', fontSize: '10px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="card" style={{
                  position: 'absolute', right: 0, top: '40px', width: '320px', zIndex: 1000,
                  padding: '14px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <b style={{ fontSize: '14px', color: '#fff' }}>Notifications</b>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{notifications.length} total</span>
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.length ? notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                          padding: '10px', borderRadius: '8px', background: n.read ? 'transparent' : 'rgba(99,102,241,0.1)',
                          cursor: 'pointer', border: '1px solid rgba(255,255,255,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <Icon name={n.icon || 'bell'} size={15} />
                          <div>
                            <div style={{ fontSize: '12px', color: n.read ? 'var(--muted)' : '#fff', fontWeight: n.read ? 400 : 600 }}>{n.text}</div>
                            <div style={{ fontSize: '10px', color: 'var(--muted-2)', marginTop: '2px' }}>{n.time || 'Just now'}</div>
                          </div>
                        </div>
                        <button
                          className="icon-btn"
                          style={{ padding: '2px', background: 'transparent', border: 'none', color: 'var(--muted-2)' }}
                          onClick={(e) => handleDeleteNotif(e, n.id)}
                          title="Clear notification"
                        >
                          <Icon name="x" size={13} />
                        </button>
                      </div>
                    )) : (
                      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>No notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="user-name">{currentUser?.name}</span>
            <div
              className="avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              {currentUser?.initials || 'AJ'}
            </div>
          </div>
        </div>
        <div className="page">{children}</div>
      </div>
    </div>
  );
}
