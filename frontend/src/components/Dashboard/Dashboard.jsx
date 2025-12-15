import { useQuery } from '@apollo/client';
import { GET_SHIPMENTS } from '../../apollo/queries';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data, loading } = useQuery(GET_SHIPMENTS, {
    variables: { limit: 100 },
  });

  const shipments = data?.shipments || [];

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === 'PENDING').length,
    inTransit: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
    delivered: shipments.filter((s) => s.status === 'DELIVERED').length,
    cancelled: shipments.filter((s) => s.status === 'CANCELLED').length,
  };

  const chartData = [
    { status: 'Pending', count: stats.pending, color: '#ffc96f' },
    { status: 'In Transit', count: stats.inTransit, color: '#daa1ff' },
    { status: 'Delivered', count: stats.delivered, color: '#71ffd0' },
    { status: 'Cancelled', count: stats.cancelled, color: '#ff7d7d' },
  ];

  const recentShipments = shipments.slice(0, 6);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleTrackShipment = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/shipments?search=${trackingNumber}`);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your shipments and track deliveries in real-time</p>
      </div>

      {!loading && (
        <div className="stats-row">
          <div className="stat-card primary" onClick={() => navigate('/shipments')}>
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Shipments</div>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>

          <div className="stat-card warning" onClick={() => navigate('/shipments?status=PENDING')}>
            <div className="stat-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
          </div>

          <div className="stat-card info" onClick={() => navigate('/shipments?status=IN_TRANSIT')}>
            <div className="stat-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <path d="M16 8h6l3 3v5h-2" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">In Transit</div>
              <div className="stat-value">{stats.inTransit}</div>
            </div>
          </div>

          <div className="stat-card success" onClick={() => navigate('/shipments?status=DELIVERED')}>
            <div className="stat-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Delivered</div>
              <div className="stat-value">{stats.delivered}</div>
            </div>
          </div>

          <div className="stat-card danger" onClick={() => navigate('/shipments?status=CANCELLED')}>
            <div className="stat-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Cancelled</div>
              <div className="stat-value">{stats.cancelled}</div>
            </div>
          </div>
        </div>
      )}

      {/* Middle Section - Map & Chart */}
      <div className="dashboard-grid">
        {/* Shipment Tracking Map */}
        <div className="map-container">
          <div className="container-header">
            <h3>Live Shipment Tracking</h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="map-wrapper">
            <svg viewBox="0 0 600 350" className="tracking-map">
              {/* Map Background */}
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: theme === 'dark' ? '#0f172a' : '#e9f5ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: theme === 'dark' ? '#1e293b' : '#ffffff', stopOpacity: 1 }} />
                </linearGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <rect width="600" height="350" fill="url(#mapGradient)" />

              <g opacity={theme === 'dark' ? '0.1' : '0.2'} stroke={theme === 'dark' ? '#3bb8ff' : '#05a5fb'} strokeWidth="0.5">
                {[...Array(12)].map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 30} x2="600" y2={i * 30} />
                ))}
                {[...Array(20)].map((_, i) => (
                  <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="350" />
                ))}
              </g>

              <g className="routes">
                <path
                  d="M 100 150 Q 250 100, 400 180"
                  stroke="#05a5fb"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8 4"
                  className="route-line animated"
                />

                <path
                  d="M 120 250 Q 300 280, 480 200"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8 4"
                  className="route-line animated"
                  style={{ animationDelay: '1s' }}
                />

                <path
                  d="M 200 100 Q 300 200, 500 120"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="8 4"
                  className="route-line animated"
                  style={{ animationDelay: '2s' }}
                />
              </g>

              <g className="markers">
                <circle cx="100" cy="150" r="8" fill="#10b981" className="marker pulse" />
                <circle cx="100" cy="150" r="5" fill="#fff" />

                <circle cx="250" cy="140" r="8" fill="#05a5fb" className="marker pulse" style={{ animationDelay: '0.5s' }} />
                <circle cx="250" cy="140" r="5" fill="#fff" />

                <circle cx="400" cy="180" r="8" fill="#ef4444" className="marker pulse" style={{ animationDelay: '1s' }} />
                <circle cx="400" cy="180" r="5" fill="#fff" />

                <circle cx="120" cy="250" r="8" fill="#10b981" className="marker pulse" style={{ animationDelay: '1.5s' }} />
                <circle cx="120" cy="250" r="5" fill="#fff" />

                <circle cx="480" cy="200" r="8" fill="#f59e0b" className="marker pulse" style={{ animationDelay: '2s' }} />
                <circle cx="480" cy="200" r="5" fill="#fff" />
              </g>

              <g className="trucks">
                <g className="truck" transform="translate(0, 0)">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="100 150"
                    to="400 180"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                  <rect x="-8" y="-6" width="16" height="12" fill="#05a5fb" rx="2" />
                  <rect x="4" y="-4" width="4" height="8" fill="#0071c6" />
                </g>

                <g className="truck" transform="translate(0, 0)">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="120 250"
                    to="480 200"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                  <rect x="-8" y="-6" width="16" height="12" fill="#10b981" rx="2" />
                  <rect x="4" y="-4" width="4" height="8" fill="#059669" />
                </g>
              </g>
            </svg>

            <div className="map-stats">
              <div className="map-stat-item">
                <div className="map-stat-dot" style={{ background: '#10b981' }}></div>
                <span>Origin Points</span>
              </div>
              <div className="map-stat-item">
                <div className="map-stat-dot" style={{ background: '#05a5fb' }}></div>
                <span>In Transit</span>
              </div>
              <div className="map-stat-item">
                <div className="map-stat-dot" style={{ background: '#ef4444' }}></div>
                <span>Destinations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="container-header">
            <h3>Shipment Status Distribution</h3>
          </div>
          <div className="pie-chart-wrapper">
            <div className="pie-chart-svg-wrapper">
              <svg viewBox="0 0 200 200" className="pie-chart">
                {chartData.map((item, index) => {
                  const total = chartData.reduce((sum, d) => sum + d.count, 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  const startAngle = chartData
                    .slice(0, index)
                    .reduce((sum, d) => sum + (total > 0 ? (d.count / total) * 360 : 0), 0);
                  const endAngle = startAngle + (percentage / 100) * 360;

                  if (item.count === 0) return null;

                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);
                  const x1 = 100 + 70 * Math.cos(startRad);
                  const y1 = 100 + 70 * Math.sin(startRad);
                  const x2 = 100 + 70 * Math.cos(endRad);
                  const y2 = 100 + 70 * Math.sin(endRad);
                  const largeArc = percentage > 50 ? 1 : 0;

                  return (
                    <g key={item.status}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        opacity={hoveredSlice === index ? 1 : 0.85}
                        className="pie-slice"
                        onMouseEnter={() => setHoveredSlice(index)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        style={{
                          cursor: 'pointer',
                          transform: hoveredSlice === index ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: '100px 100px',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {hoveredSlice !== null && (
                <div className="pie-tooltip">
                  <div className="tooltip-header" style={{ background: chartData[hoveredSlice].color }}>
                    {chartData[hoveredSlice].status}
                  </div>
                  <div className="tooltip-body">
                    <div className="tooltip-stat">
                      <span className="tooltip-label">Shipments:</span>
                      <span className="tooltip-value">{chartData[hoveredSlice].count}</span>
                    </div>
                    <div className="tooltip-stat">
                      <span className="tooltip-label">Percentage:</span>
                      <span className="tooltip-value">
                        {(
                          (chartData[hoveredSlice].count /
                            chartData.reduce((sum, d) => sum + d.count, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="chart-legend">
              {chartData.map((item) => (
                <div key={item.status} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }}></span>
                  <span className="legend-label">{item.status}</span>
                  <span className="legend-value">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="recent-shipments-section">
        <div className="container-header">
          <h3>Recent Shipments</h3>
          <button onClick={() => navigate('/shipments')} className="btn-secondary btn-sm">
            View All →
          </button>
        </div>

        <div className="shipments-table-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Route</th>
                  <th>Customer</th>
                  <th>Delivery Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} onClick={() => navigate('/shipments')}>
                    <td>
                      <span className="tracking-code">{shipment.trackingNumber}</span>
                    </td>
                    <td>
                      <div className="route-cell">
                        <span className="origin">{shipment.origin}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        <span className="destination">{shipment.destination}</span>
                      </div>
                    </td>
                    <td>{shipment.customerName}</td>
                    <td>{formatDate(shipment.estimatedDelivery)}</td>
                    <td>
                      <span className={`badge badge-${shipment.status.toLowerCase().replace('_', '-')}`}>
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
