import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { user, logout, isAdmin } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      name: 'Shipments',
      path: '/shipments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      submenu: [
        { name: 'All Shipments', path: '/shipments' },
        { name: 'In Transit', path: '/shipments?status=IN_TRANSIT' },
        { name: 'Flagged', path: '/shipments?flagged=true' },
      ],
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      submenu: isAdmin()
        ? [
            { name: 'Overview', path: '/reports/overview' },
            { name: 'Performance', path: '/reports/performance' },
            { name: 'Analytics', path: '/reports/analytics' },
          ]
        : [{ name: 'Overview', path: '/reports/overview' }],
    },
  ];

  if (isAdmin()) {
    menuItems.push({
      name: 'Settings',
      path: '/settings',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
        </svg>
      ),
    });
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill="url(#headerGradient)" />
            <path
              d="M14 18L24 12L34 18V30L24 36L14 30V18Z"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 18L24 24L34 18"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M24 24V36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="headerGradient" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#05a5fb" />
                <stop offset="1" stopColor="#0071c6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">UltraShipTMS</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {menuItems.map((item) => (
            <div key={item.name} className="nav-item-wrapper">
              {item.submenu ? (
                <div className="nav-item-dropdown">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="dropdown-icon">
                      <path d="M6 8L2 4h8l-4 4z" />
                    </svg>
                  </NavLink>
                  <div className="submenu">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={subItem.path}
                        className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User Menu */}
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button onClick={logout} className="btn-icon logout-btn" title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>

          {/* Hamburger Menu Button */}
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {menuItems.map((item) => (
            <div key={item.name} className="mobile-nav-item">
              {item.submenu ? (
                <>
                  <button
                    className={`mobile-nav-link ${activeSubmenu === item.name ? 'active' : ''}`}
                    onClick={() => toggleSubmenu(item.name)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      className={`dropdown-icon ${activeSubmenu === item.name ? 'rotated' : ''}`}
                    >
                      <path d="M6 8L2 4h8l-4 4z" />
                    </svg>
                  </button>
                  {activeSubmenu === item.name && (
                    <div className="mobile-submenu">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          className="mobile-submenu-item"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </header>
  );
};

export default Header;
