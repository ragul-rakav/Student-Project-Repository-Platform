import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
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
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, toggleSidebar } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const role = currentUser ? currentUser.role : 'Student';

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
        ]
      }];
    }
    return [{
      section: 'Administration', items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'home' },
        { path: '/projects', label: 'Repository', icon: 'folder' },
        { path: '/analytics', label: 'Analytics', icon: 'chart' },
        { path: '/admin', label: 'Admin Center', icon: 'usercog' },
        { path: '/leaderboard', label: 'Leaderboard', icon: 'trophy' },
      ]
    }];
  };

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
          <div className="topbar-right">
            <span className="user-name">{currentUser?.name}</span>
            <div
              className="avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (currentUser?.role === 'Student') navigate('/profile');
              }}
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
