import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../../apollo/queries';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.token, data.login.user);
      navigate('/dashboard');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    loginMutation({
      variables: formData,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleDemoLogin = (role) => {
    const credentials = role === 'admin'
      ? { username: 'admin', password: 'admin123' }
      : { username: 'employee', password: 'employee123' };

    setFormData(credentials);
    loginMutation({ variables: credentials });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>

        <div className="login-branding">
          <div className="brand-logo">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="20" fill="rgba(255, 255, 255, 0.2)" />
              <path d="M24 30L40 20L56 30V50L40 60L24 50V30Z" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 30L40 40L56 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 40V60" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="brand-title">UltraShip TMS</h2>
          <p className="brand-subtitle">Streamline your logistics operations with our powerful transportation management system</p>

          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Real-Time Tracking</h3>
                <p>Monitor shipments in real-time with live updates</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Advanced Analytics</h3>
                <p>Make data-driven decisions with powerful insights</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Secure & Reliable</h3>
                <p>Enterprise-grade security for your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#loginGradient)" />
              <path d="M14 18L24 12L34 18V30L24 36L14 30V18Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 18L24 24L34 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 24V36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="loginGradient" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#05a5fb" />
                  <stop offset="1" stopColor="#0071c6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>UltraShip TMS</h1>
          <p>Transportation Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message fade-in">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4h2v5H7V4zm0 6h2v2H7v-2z" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or try demo accounts</span>
        </div>

        <div className="demo-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleDemoLogin('admin')}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.5 14a.5.5 0 00.5-.5c0-2.5-2-4.5-4.5-4.5h-1C5 9 3 11 3 13.5a.5.5 0 00.5.5h9z"/>
            </svg>
            Admin Demo
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleDemoLogin('employee')}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.5 14a.5.5 0 00.5-.5c0-2.5-2-4.5-4.5-4.5h-1C5 9 3 11 3 13.5a.5.5 0 00.5.5h9z"/>
            </svg>
            Employee Demo
          </button>
        </div>

        <div className="login-footer">
          <p className="text-sm text-gray-500">
            Admin: full access • Employee: limited permissions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
