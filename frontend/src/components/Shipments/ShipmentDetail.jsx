import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_SHIPMENT, DELETE_SHIPMENT } from '../../apollo/queries';
import { useAuth } from '../../context/AuthContext';
import './ShipmentDetail.css';

const ShipmentDetail = ({ shipment, onClose, onUpdate, onShipmentUpdate }) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentShipment, setCurrentShipment] = useState(shipment);
  const [formData, setFormData] = useState({
    ...shipment,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const modalBodyRef = useRef(null);

  // Update current shipment when prop changes
  useEffect(() => {
    setCurrentShipment(shipment);
    setFormData(shipment);
  }, [shipment]);

  // Scroll to top when entering edit mode
  useEffect(() => {
    if (isEditing && modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [isEditing]);

  const [updateShipment, { loading }] = useMutation(UPDATE_SHIPMENT, {
    onCompleted: (data) => {
      setIsEditing(false);
      // Update the current shipment with the returned data
      const updatedShipment = data.updateShipment;
      setCurrentShipment(updatedShipment);
      setFormData(updatedShipment);
      // Notify parent to refetch
      onUpdate();
      // Scroll to top to show updated details
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = 0;
      }
    },
  });

  const [deleteShipment, { loading: deleteLoading }] = useMutation(DELETE_SHIPMENT, {
    onCompleted: () => {
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowDeleteSuccess(false);
        onUpdate();
        onClose();
      }, 2000);
    },
    onError: (error) => {
      console.error('Delete error:', error);
      setShowDeleteConfirm(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateShipment({
      variables: {
        id: shipment.id,
        input: {
          trackingNumber: formData.trackingNumber,
          origin: formData.origin,
          destination: formData.destination,
          status: formData.status,
          carrier: formData.carrier,
          weight: parseFloat(formData.weight),
          dimensions: formData.dimensions,
          estimatedDelivery: formData.estimatedDelivery,
          actualDelivery: formData.actualDelivery || null,
          cost: parseFloat(formData.cost),
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          notes: formData.notes || null,
          flagged: formData.flagged,
        },
      },
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deleteShipment({
      variables: {
        id: shipment.id,
      },
    });
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="modal-overlay fade-in" onClick={onClose}>
        <div className="modal-container slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Shipment Details</h2>
            <p className="tracking-number-large">{currentShipment.trackingNumber}</p>
          </div>
          <button onClick={onClose} className="btn-icon close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" ref={modalBodyRef}>
          {!isEditing ? (
            <>
              {/* Status Banner */}
              <div className={`status-banner status-${currentShipment.status.toLowerCase()}`}>
                <div className="status-icon">
                  {currentShipment.status === 'DELIVERED' && '✓'}
                  {currentShipment.status === 'IN_TRANSIT' && '→'}
                  {currentShipment.status === 'PENDING' && '⏱'}
                  {currentShipment.status === 'DELAYED' && '⚠'}
                  {currentShipment.status === 'CANCELLED' && '✗'}
                </div>
                <div>
                  <div className="status-title">{currentShipment.status.replace('_', ' ')}</div>
                  {currentShipment.flagged && (
                    <div className="flagged-notice">
                      <span className="flag-indicator">🚩</span>
                      This shipment is flagged for review
                    </div>
                  )}
                </div>
              </div>

              {/* Route Visualization */}
              <div className="route-visual">
                <div className="route-step">
                  <div className="route-marker origin">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div className="route-details">
                    <span className="route-label">Origin</span>
                    <span className="route-location">{currentShipment.origin}</span>
                  </div>
                </div>
                <div className="route-connector">
                  <div className="connector-line"></div>
                  <div className="connector-label">{currentShipment.carrier}</div>
                </div>
                <div className="route-step">
                  <div className="route-marker destination">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="route-details">
                    <span className="route-label">Destination</span>
                    <span className="route-location">{currentShipment.destination}</span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="details-grid">
                <div className="detail-section">
                  <h3>Shipment Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Tracking Number</span>
                    <span className="detail-value">{currentShipment.trackingNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Carrier</span>
                    <span className="detail-value">{currentShipment.carrier}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Weight</span>
                    <span className="detail-value">{parseFloat(currentShipment.weight).toFixed(2)} lbs</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Dimensions</span>
                    <span className="detail-value">{currentShipment.dimensions} inches</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cost</span>
                    <span className="detail-value font-semibold text-primary">
                      {formatCurrency(currentShipment.cost)}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{currentShipment.customerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{currentShipment.customerEmail}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Timeline</h3>
                  <div className="detail-item">
                    <span className="detail-label">Created</span>
                    <span className="detail-value">{formatDate(currentShipment.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estimated Delivery</span>
                    <span className="detail-value">{formatDate(currentShipment.estimatedDelivery)}</span>
                  </div>
                  {currentShipment.actualDelivery && (
                    <div className="detail-item">
                      <span className="detail-label">Actual Delivery</span>
                      <span className="detail-value">{formatDate(currentShipment.actualDelivery)}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">{formatDate(currentShipment.updatedAt)}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Notes</h3>
                  <div className="notes-box">
                    {currentShipment.notes || 'No notes available'}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Tracking Number</label>
                  <input
                    type="text"
                    name="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={!isAdmin()}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Origin</label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={!isAdmin()}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={!isAdmin()}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Carrier</label>
                  <select
                    name="carrier"
                    value={formData.carrier}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={!isAdmin()}
                  >
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                    <option value="USPS">USPS</option>
                    <option value="XPO Logistics">XPO Logistics</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="form-input"
                    required
                    disabled={!isAdmin()}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!isEditing && (
          <div className="modal-footer">
            <div className="modal-footer-left">
              {isAdmin() && (
                <button onClick={handleDeleteClick} className="btn btn-danger">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Delete Shipment
                </button>
              )}
            </div>
            <div className="modal-footer-right">
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" />
                </svg>
                Edit Shipment
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay fade-in" onClick={handleDeleteCancel}>
          <div className="confirm-modal scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon danger">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="confirm-modal-title">Delete Shipment?</h3>
            <p className="confirm-modal-message">
              Are you sure you want to delete shipment <strong>{currentShipment.trackingNumber}</strong>?
              This action cannot be undone.
            </p>
            <div className="confirm-modal-actions">
              <button onClick={handleDeleteCancel} className="btn btn-secondary" disabled={deleteLoading}>
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger" disabled={deleteLoading}>
                {deleteLoading ? (
                  <>
                    <span className="spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete Shipment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccess && (
        <div className="modal-overlay fade-in">
          <div className="success-modal bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="success-modal-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="success-modal-title">Shipment Deleted!</h3>
            <p className="success-modal-message">
              Shipment has been successfully deleted.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ShipmentDetail;
