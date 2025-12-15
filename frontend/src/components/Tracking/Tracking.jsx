import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import './Tracking.css';

const GET_SHIPMENTS = gql`
  query GetShipments {
    shipments {
      id
      trackingNumber
      origin
      destination
      status
      weight
      dimensions
      estimatedDelivery
      actualDelivery
      carrier
      notes
      flagged
      createdAt
      updatedAt
    }
  }
`;

const Tracking = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [carrierFilter, setCarrierFilter] = useState([]);
  const [activeTab, setActiveTab] = useState('shipping');

  const { data, loading, error } = useQuery(GET_SHIPMENTS);

  const shipments = data?.shipments || [];

  const carriers = [...new Set(shipments.map(s => s.carrier).filter(Boolean))];

  const filteredShipments = shipments.filter(shipment => {
    const statusMatch = statusFilter === 'all' ||
                       (statusFilter === 'active' && ['pending', 'in_transit'].includes(shipment.status)) ||
                       (statusFilter === 'inactive' && ['delivered', 'cancelled'].includes(shipment.status));

    const carrierMatch = carrierFilter.length === 0 || carrierFilter.includes(shipment.carrier);

    return statusMatch && carrierMatch;
  });

  const toggleCarrierFilter = (carrier) => {
    setCarrierFilter(prev =>
      prev.includes(carrier)
        ? prev.filter(c => c !== carrier)
        : [...prev, carrier]
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      in_transit: 'info',
      delivered: 'success',
      delayed: 'warning',
      cancelled: 'error',
    };
    return colors[status] || 'info';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      in_transit: '🚚',
      delivered: '✅',
      delayed: '⚠️',
      cancelled: '❌',
    };
    return icons[status] || '📦';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateProgress = (status) => {
    const progress = {
      pending: 25,
      in_transit: 60,
      delivered: 100,
      delayed: 45,
      cancelled: 0,
    };
    return progress[status] || 0;
  };

  return (
    <div className="tracking-page">
      <div className="tracking-main">
        <div className="tracking-list-panel">
          <div className="tracking-header">
            <div className="tracking-header-top">
              <div>
                <h1 className="tracking-title">Tracking</h1>
                <p className="tracking-subtitle">Filter by Carriers</p>
              </div>
              <button className="tracking-search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>

            <div className="tracking-filters">
              {carriers.slice(0, 6).map((carrier, idx) => (
                <button
                  key={carrier || idx}
                  className={`filter-chip ${carrierFilter.includes(carrier) ? 'active' : ''}`}
                  onClick={() => toggleCarrierFilter(carrier)}
                >
                  {carrier || 'Unknown'}
                  <span className="chip-count">
                    {shipments.filter(s => s.carrier === carrier).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="tracking-show-filter">
              <span className="show-label">Show:</span>
              <div className="show-options">
                <button
                  className={`show-chip ${statusFilter === 'active' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('active')}
                >
                  Active
                  <span className="chip-count">
                    {shipments.filter(s => ['pending', 'in_transit'].includes(s.status)).length}
                  </span>
                </button>
                <button
                  className={`show-chip ${statusFilter === 'inactive' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('inactive')}
                >
                  Inactive
                  <span className="chip-count">
                    {shipments.filter(s => ['delivered', 'cancelled'].includes(s.status)).length}
                  </span>
                </button>
                <button
                  className={`show-chip ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                  <span className="chip-count">{shipments.length}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="tracking-grid">
            {loading && (
              <div className="tracking-loading">
                <div className="tracking-spinner"></div>
                <p>Loading shipments...</p>
              </div>
            )}

            {error && (
              <div className="tracking-error-msg">
                <p>Error loading shipments</p>
              </div>
            )}

            {!loading && !error && filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className={`tracking-card ${selectedShipment?.id === shipment.id ? 'selected' : ''} status-${getStatusColor(shipment.status)}`}
                onClick={() => setSelectedShipment(shipment)}
              >
                <div className="tracking-card-header">
                  <div className="tracking-card-id">{shipment.trackingNumber}</div>
                  <div className={`tracking-card-status status-${getStatusColor(shipment.status)}`}>
                    <span className="status-dot"></span>
                    {shipment.status === 'in_transit' ? 'On Route' : shipment.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="tracking-card-time">
                  <div className="time-display">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {formatDate(shipment.createdAt)}
                  </div>
                </div>

                <div className="tracking-card-details">
                  <div className="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                    <span>{shipment.origin}</span>
                  </div>
                  <div className="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                    <span>{shipment.destination}</span>
                  </div>
                  <div className="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    <span>{shipment.weight} kg</span>
                  </div>
                  <div className="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <span>{shipment.carrier || 'N/A'}</span>
                  </div>
                </div>

                <div className="tracking-card-visual">
                  <svg width="100%" height="80" viewBox="0 0 200 80" fill="none">
                    <rect x="20" y="25" width="120" height="40" rx="4" fill="var(--gray-200)" stroke="var(--gray-400)" strokeWidth="2"/>
                    <rect x="140" y="35" width="30" height="20" rx="2" fill="var(--gray-300)" stroke="var(--gray-400)" strokeWidth="2"/>
                    <circle cx="45" cy="68" r="8" fill="var(--gray-700)" stroke="var(--gray-900)" strokeWidth="2"/>
                    <circle cx="115" cy="68" r="8" fill="var(--gray-700)" stroke="var(--gray-900)" strokeWidth="2"/>
                    <circle cx="155" cy="68" r="6" fill="var(--gray-700)" stroke="var(--gray-900)" strokeWidth="2"/>
                    <path d="M20 45 L10 35 L10 55 Z" fill="var(--gray-300)"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Details */}
        <div className="tracking-detail-panel">
          {selectedShipment ? (
            <>
              {/* Tabs */}
              <div className="detail-tabs">
                <button
                  className={`detail-tab ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping Info
                </button>
                <button
                  className={`detail-tab ${activeTab === 'vehicle' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vehicle')}
                >
                  Vehicle Info
                </button>
                <button
                  className={`detail-tab ${activeTab === 'documents' ? 'active' : ''}`}
                  onClick={() => setActiveTab('documents')}
                >
                  Documents
                </button>
                <button
                  className={`detail-tab ${activeTab === 'company' ? 'active' : ''}`}
                  onClick={() => setActiveTab('company')}
                >
                  Company
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'shipping' && (
                <>
                  {/* Capacity/Progress */}
                  <div className="capacity-section">
                    <h3 className="section-title">Shipment Progress</h3>
                    <div className="capacity-visual">
                      <div className="capacity-truck">
                        <div className="capacity-bar">
                          <div className="capacity-fill" style={{ width: `${calculateProgress(selectedShipment.status)}%` }}>
                            <span className="capacity-percent">{calculateProgress(selectedShipment.status)}%</span>
                          </div>
                        </div>
                        <svg width="200" height="100" viewBox="0 0 200 100" className="truck-illustration">
                          <rect x="10" y="30" width="140" height="50" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2"/>
                          <rect x="150" y="45" width="35" height="25" rx="3" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2"/>
                          <circle cx="40" cy="85" r="10" fill="#374151" stroke="#1F2937" strokeWidth="2"/>
                          <circle cx="120" cy="85" r="10" fill="#374151" stroke="#1F2937" strokeWidth="2"/>
                          <circle cx="165" cy="85" r="8" fill="#374151" stroke="#1F2937" strokeWidth="2"/>
                          <rect x="20" y="40" width="40" height="30" rx="2" fill="white" opacity="0.7"/>
                          <rect x="70" y="40" width="40" height="30" rx="2" fill="white" opacity="0.7"/>
                          <rect x="120" y="40" width="20" height="30" rx="2" fill="white" opacity="0.7"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="route-section">
                    <div className="route-header">
                      <h3 className="section-title">Route</h3>
                      <div className="route-time">
                        <span className="time-remaining">{formatDate(selectedShipment.estimatedDelivery)}</span>
                        <button className="change-route-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          View Route
                        </button>
                      </div>
                    </div>

                    <div className="route-map-placeholder">
                      <div className="map-content">
                        <div className="route-path">
                          <div className="route-point start">
                            <div className="point-marker"></div>
                            <span>{selectedShipment.origin}</span>
                          </div>
                          <div className="route-line"></div>
                          <div className="route-point end">
                            <div className="point-marker"></div>
                            <span>{selectedShipment.destination}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div className="shipment-details-section">
                    <h3 className="section-title">Shipment Details</h3>
                    <div className="details-grid">
                      <div className="detail-row">
                        <span className="detail-label">Tracking Number</span>
                        <span className="detail-value">{selectedShipment.trackingNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status</span>
                        <span className={`detail-value status-badge status-${getStatusColor(selectedShipment.status)}`}>
                          {getStatusIcon(selectedShipment.status)} {selectedShipment.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Weight</span>
                        <span className="detail-value">{selectedShipment.weight} kg</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Dimensions</span>
                        <span className="detail-value">{selectedShipment.dimensions}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Carrier</span>
                        <span className="detail-value">{selectedShipment.carrier || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Est. Delivery</span>
                        <span className="detail-value">{formatDate(selectedShipment.estimatedDelivery)}</span>
                      </div>
                    </div>

                    {selectedShipment.notes && (
                      <div className="notes-section">
                        <h4 className="notes-title">Notes</h4>
                        <p className="notes-content">{selectedShipment.notes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'vehicle' && (
                <>
                  {/* Vehicle Information */}
                  <div className="vehicle-info-section">
                    <h3 className="section-title">Vehicle Details</h3>
                    <div className="vehicle-visual">
                      <svg width="100%" height="200" viewBox="0 0 400 200" className="vehicle-illustration">
                        <rect x="50" y="60" width="240" height="90" rx="8" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="3"/>
                        <rect x="290" y="85" width="60" height="50" rx="5" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3"/>
                        <rect x="70" y="75" width="70" height="50" rx="4" fill="white" opacity="0.8" stroke="#9CA3AF" strokeWidth="2"/>
                        <rect x="150" y="75" width="70" height="50" rx="4" fill="white" opacity="0.8" stroke="#9CA3AF" strokeWidth="2"/>
                        <rect x="230" y="75" width="40" height="50" rx="4" fill="white" opacity="0.8" stroke="#9CA3AF" strokeWidth="2"/>
                        <circle cx="100" cy="155" r="18" fill="#374151" stroke="#1F2937" strokeWidth="3"/>
                        <circle cx="100" cy="155" r="10" fill="#6B7280" stroke="#1F2937" strokeWidth="2"/>
                        <circle cx="220" cy="155" r="18" fill="#374151" stroke="#1F2937" strokeWidth="3"/>
                        <circle cx="220" cy="155" r="10" fill="#6B7280" stroke="#1F2937" strokeWidth="2"/>
                        <circle cx="310" cy="155" r="14" fill="#374151" stroke="#1F2937" strokeWidth="3"/>
                        <circle cx="310" cy="155" r="8" fill="#6B7280" stroke="#1F2937" strokeWidth="2"/>
                        <path d="M50 100 L40 85 L40 115 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2"/>
                        <rect x="300" y="100" width="35" height="30" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                        <text x="317" y="120" fontSize="20" fill="#F59E0B" fontWeight="bold" textAnchor="middle">!</text>
                      </svg>
                    </div>

                    <div className="details-grid">
                      <div className="detail-row">
                        <span className="detail-label">Vehicle Type</span>
                        <span className="detail-value">18-Wheeler Truck</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">License Plate</span>
                        <span className="detail-value">ABC-{selectedShipment.id.slice(0, 4).toUpperCase()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Driver Name</span>
                        <span className="detail-value">John Smith</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Driver Contact</span>
                        <span className="detail-value">+1 (555) 123-4567</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Vehicle Capacity</span>
                        <span className="detail-value">40,000 lbs</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Current Load</span>
                        <span className="detail-value">{selectedShipment.weight} kg ({Math.round((selectedShipment.weight / 18143.7) * 100)}%)</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Fuel Level</span>
                        <span className="detail-value">
                          <span className="fuel-indicator">
                            <span className="fuel-bar" style={{ width: '75%' }}></span>
                          </span>
                          75%
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Last Maintenance</span>
                        <span className="detail-value">Dec 1, 2025</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Stats */}
                  <div className="vehicle-stats-section">
                    <h3 className="section-title">Vehicle Statistics</h3>
                    <div className="stats-cards">
                      <div className="stat-item">
                        <div className="stat-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                          </svg>
                        </div>
                        <div className="stat-content">
                          <span className="stat-label">Avg Speed</span>
                          <span className="stat-value1">65 mph</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                        </div>
                        <div className="stat-content">
                          <span className="stat-label">Distance Covered</span>
                          <span className="stat-value1">450 miles</span>
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                        </div>
                        <div className="stat-content">
                          <span className="stat-label">Drive Time</span>
                          <span className="stat-value1">8.5 hrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'documents' && (
                <>
                  {/* Documents Section */}
                  <div className="documents-section">
                    <h3 className="section-title">Shipment Documents</h3>

                    <div className="document-list">
                      <div className="document-item">
                        <div className="document-icon pdf">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <path d="M10 12h4M10 16h4"/>
                          </svg>
                        </div>
                        <div className="document-info">
                          <h4 className="document-name">Bill of Lading</h4>
                          <p className="document-meta">PDF • 245 KB • {formatDate(selectedShipment.createdAt)}</p>
                        </div>
                        <div className="document-actions">
                          <button className="doc-btn view">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button className="doc-btn download">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="document-item">
                        <div className="document-icon pdf">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <path d="M10 12h4M10 16h4"/>
                          </svg>
                        </div>
                        <div className="document-info">
                          <h4 className="document-name">Commercial Invoice</h4>
                          <p className="document-meta">PDF • 189 KB • {formatDate(selectedShipment.createdAt)}</p>
                        </div>
                        <div className="document-actions">
                          <button className="doc-btn view">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button className="doc-btn download">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="document-item">
                        <div className="document-icon pdf">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <path d="M10 12h4M10 16h4"/>
                          </svg>
                        </div>
                        <div className="document-info">
                          <h4 className="document-name">Packing List</h4>
                          <p className="document-meta">PDF • 156 KB • {formatDate(selectedShipment.createdAt)}</p>
                        </div>
                        <div className="document-actions">
                          <button className="doc-btn view">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button className="doc-btn download">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="document-item">
                        <div className="document-icon image">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <div className="document-info">
                          <h4 className="document-name">Cargo Photo</h4>
                          <p className="document-meta">JPG • 2.3 MB • {formatDate(selectedShipment.updatedAt)}</p>
                        </div>
                        <div className="document-actions">
                          <button className="doc-btn view">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button className="doc-btn download">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button className="upload-document-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload New Document
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'company' && (
                <>
                  {/* Company Information */}
                  <div className="company-info-section">
                    <h3 className="section-title">Carrier Company</h3>

                    <div className="company-header">
                      <div className="company-logo">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <rect width="64" height="64" rx="12" fill="url(#companyGradient)"/>
                          <path d="M18 26L32 18L46 26V44L32 52L18 44V26Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18 26L32 34L46 26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M32 34V52" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          <defs>
                            <linearGradient id="companyGradient" x1="0" y1="0" x2="64" y2="64">
                              <stop stopColor="#05a5fb"/>
                              <stop offset="1" stopColor="#0071c6"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <div className="company-details">
                        <h2 className="company-name">{selectedShipment.carrier || 'Express Logistics Inc.'}</h2>
                        <p className="company-tagline">Reliable Transport Solutions</p>
                      </div>
                    </div>

                    <div className="details-grid">
                      <div className="detail-row">
                        <span className="detail-label">Company ID</span>
                        <span className="detail-value">COMP-{selectedShipment.id.slice(0, 6).toUpperCase()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Contact Person</span>
                        <span className="detail-value">Sarah Johnson</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">+1 (555) 987-6543</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">contact@expresslogistics.com</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">1234 Logistics Way, Transport City, TC 12345</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Rating</span>
                        <span className="detail-value">
                          <span className="rating-stars">
                            ⭐⭐⭐⭐⭐ <span style={{color: 'var(--gray-600)'}}>4.8/5.0</span>
                          </span>
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Years in Service</span>
                        <span className="detail-value">15 Years</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Fleet Size</span>
                        <span className="detail-value">250+ Vehicles</span>
                      </div>
                    </div>
                  </div>

                  {/* Company Performance */}
                  <div className="company-performance-section">
                    <h3 className="section-title">Performance Metrics</h3>
                    <div className="performance-grid">
                      <div className="performance-card">
                        <div className="performance-icon success">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <div className="performance-details">
                          <span className="performance-value">98.5%</span>
                          <span className="performance-label">On-Time Delivery</span>
                        </div>
                      </div>
                      <div className="performance-card">
                        <div className="performance-icon info">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                          </svg>
                        </div>
                        <div className="performance-details">
                          <span className="performance-value">15,234</span>
                          <span className="performance-label">Total Deliveries</span>
                        </div>
                      </div>
                      <div className="performance-card">
                        <div className="performance-icon warning">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        </div>
                        <div className="performance-details">
                          <span className="performance-value">0.3%</span>
                          <span className="performance-label">Damage Rate</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="certifications-section">
                    <h3 className="section-title">Certifications & Compliance</h3>
                    <div className="certification-badges">
                      <div className="cert-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                        ISO 9001 Certified
                      </div>
                      <div className="cert-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                        DOT Compliant
                      </div>
                      <div className="cert-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                        Eco-Friendly Fleet
                      </div>
                      <div className="cert-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <path d="m9 12 2 2 4-4"/>
                        </svg>
                        HAZMAT Certified
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>Select a Shipment</h3>
              <p>Click on a shipment card to view detailed tracking information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
