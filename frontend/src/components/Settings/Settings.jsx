import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="settings-container fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="text-gray-600">Manage your application preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            <div>
              <h3>Appearance</h3>
              <p>Customize the look and feel of the application</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Theme Mode</label>
                <p className="setting-description">
                  Switch between light and dark theme
                </p>
              </div>
              <div className="theme-toggle">
                <button
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => theme === 'dark' && toggleTheme()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  Light
                </button>
                <button
                  className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => theme === 'light' && toggleTheme()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h3>Account Information</h3>
              <p>Your profile details</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Username</label>
                <p className="setting-value">{user?.username}</p>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Email</label>
                <p className="setting-value">{user?.email}</p>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">Role</label>
                <p className="setting-value">
                  <span className={`badge badge-${user?.role?.toLowerCase()}`}>
                    {user?.role}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        {isAdmin() && (
          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <h3>System Information</h3>
                <p>Application details</p>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Application Name</label>
                  <p className="setting-value">UltraShip TMS</p>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Version</label>
                  <p className="setting-value">1.0.0</p>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <label className="setting-label">Environment</label>
                  <p className="setting-value">Development</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
