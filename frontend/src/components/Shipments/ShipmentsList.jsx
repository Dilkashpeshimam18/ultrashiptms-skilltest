import { useState, useMemo, memo, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SHIPMENTS, DELETE_SHIPMENT, TOGGLE_SHIPMENT_FLAG } from '../../apollo/queries';
import ShipmentDetail from './ShipmentDetail';
import ShipmentFilters from './ShipmentFilters';
import './ShipmentsList.css';

const ShipmentsList = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'tile'
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    carrier: '',
    flagged: '',
  });
  const [sort, setSort] = useState({
    field: 'createdAt',
    order: 'DESC',
  });
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const gridViewRef = useRef(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // GraphQL Query - fetch all shipments
  const { data, loading, error, refetch } = useQuery(GET_SHIPMENTS, {
    variables: {
      filter: {
        searchTerm: filters.searchTerm || undefined,
        status: filters.status || undefined,
        carrier: filters.carrier || undefined,
        flagged: filters.flagged ? filters.flagged === 'true' : undefined,
      },
      sort: {
        field: sort.field,
        order: sort.order,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [deleteShipment] = useMutation(DELETE_SHIPMENT, {
    onCompleted: () => {
      refetch();
      setSelectedShipment(null);
    },
  });

  const [toggleFlag] = useMutation(TOGGLE_SHIPMENT_FLAG, {
    onCompleted: () => {
      refetch();
    },
  });

  // Get all shipments and do client-side pagination
  const allShipments = data?.shipments || [];
  const totalCount = allShipments.length;
  const totalPages = Math.ceil(totalCount / limit);

  // Get shipments for current page
  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  const shipments = allShipments.slice(startIndex, endIndex);

  // Scroll to top when page changes
  useEffect(() => {
    if (gridViewRef.current) {
      gridViewRef.current.scrollTop = 0;
    }
  }, [page]);

  // Reset page when filters or sort change
  useEffect(() => {
    setPage(0);
  }, [filters, sort]);

  const handleSort = (field) => {
    setSort({
      field,
      order: sort.field === field && sort.order === 'ASC' ? 'DESC' : 'ASC',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      deleteShipment({ variables: { id } });
    }
  };

  const handleToggleFlag = (id) => {
    toggleFlag({ variables: { id } });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
            <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
          </svg>
          <h3>Error loading shipments</h3>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shipments-container fade-in">
      {/* Header */}
      <div className="shipments-header">
        <div>
          <h1>Shipments</h1>
          <p className="text-gray-600">
            Manage and track all your shipments in one place
          </p>
        </div>
      </div>

      {/* Filters */}
      <ShipmentFilters
        filters={filters}
        setFilters={setFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Loading State */}
      {loading && shipments.length === 0 && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading shipments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && shipments.length === 0 && (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2" />
          </svg>
          <h3>No shipments found</h3>
          <p>Try adjusting your filters or create a new shipment</p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && shipments.length > 0 && (
        <div className="grid-view" ref={gridViewRef}>
          <table className="shipments-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('trackingNumber')} className="sortable">
                  Tracking #
                  {sort.field === 'trackingNumber' && (
                    <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('origin')} className="sortable">
                  Origin
                  {sort.field === 'origin' && (
                    <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('destination')} className="sortable">
                  Destination
                  {sort.field === 'destination' && (
                    <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Status
                  {sort.field === 'status' && (
                    <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('carrier')} className="sortable">
                  Carrier
                  {sort.field === 'carrier' && (
                    <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th>Customer</th>
                <th>Weight (lbs)</th>
                <th onClick={() => handleSort('estimatedDelivery')} className="sortable">
                  Est. Delivery
                  {sort.field === 'estimatedDelivery' && (
                    <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('cost')} className="sortable">
                  Cost
                  {sort.field === 'cost' && (
                    <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  onClick={() => setSelectedShipment(shipment)}
                  className={shipment.flagged ? 'flagged-row' : ''}
                >
                  <td>
                    <span className="tracking-number">{shipment.trackingNumber}</span>
                    {shipment.flagged && <span className="flag-indicator">🚩</span>}
                  </td>
                  <td>{shipment.origin}</td>
                  <td>{shipment.destination}</td>
                  <td>
                    <span className={`badge badge-${shipment.status.toLowerCase().replace('_', '-')}`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{shipment.carrier}</td>
                  <td>{shipment.customerName}</td>
                  <td>{parseFloat(shipment.weight).toFixed(1)}</td>
                  <td>{formatDate(shipment.estimatedDelivery)}</td>
                  <td className="font-semibold">{formatCurrency(shipment.cost)}</td>
                  <td>
                    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        shipment={shipment}
                        onView={() => setSelectedShipment(shipment)}
                        onFlag={() => handleToggleFlag(shipment.id)}
                        onDelete={() => handleDelete(shipment.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tile View */}
      {viewMode === 'tile' && shipments.length > 0 && (
        <div className="tile-view">
          {shipments.map((shipment) => (
            <ShipmentTile
              key={shipment.id}
              shipment={shipment}
              onView={() => setSelectedShipment(shipment)}
              onFlag={() => handleToggleFlag(shipment.id)}
              onDelete={() => handleDelete(shipment.id)}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {shipments.length > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
          <button
            className="pagination-btn"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="pagination-info">
            <span className="page-number">
              Page {page + 1} of {totalPages}
            </span>
            <span className="page-count">
              ({shipments.length} of {totalCount} shipments)
            </span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            className="pagination-btn"
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedShipment && (
        <ShipmentDetail
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

// Memoized Tile Component for performance
const ShipmentTile = memo(({ shipment, onView, onFlag, onDelete, formatDate, formatCurrency }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="shipment-tile scale-in" onClick={onView}>
      <div className="tile-header">
        <div>
          <span className="tracking-number">{shipment.trackingNumber}</span>
          {shipment.flagged && <span className="flag-indicator">🚩</span>}
        </div>
        <div className="tile-menu-wrapper" onClick={(e) => e.stopPropagation()}>
          <button
            className="btn-icon tile-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="6" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="18" r="2" />
            </svg>
          </button>
          {showMenu && (
            <div className="tile-menu">
              <button onClick={() => { onView(); setShowMenu(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>
                View Details
              </button>
              <button onClick={() => { onFlag(); setShowMenu(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" strokeWidth="2" />
                  <line x1="4" y1="22" x2="4" y2="15" strokeWidth="2" />
                </svg>
                {shipment.flagged ? 'Unflag' : 'Flag'}
              </button>
              <button onClick={() => { onDelete(); setShowMenu(false); }} className="danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="3 6 5 6 21 6" strokeWidth="2" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="tile-body">
        <div className="tile-route">
          <div className="route-point">
            <div className="route-icon origin">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div>
              <span className="route-label">Origin</span>
              <span className="route-value">{shipment.origin}</span>
            </div>
          </div>
          <div className="route-line"></div>
          <div className="route-point">
            <div className="route-icon destination">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="route-label">Destination</span>
              <span className="route-value">{shipment.destination}</span>
            </div>
          </div>
        </div>

        <div className="tile-info">
          <div className="info-item">
            <span className="info-label">Status</span>
            <span className={`badge badge-${shipment.status.toLowerCase().replace('_', '-')}`}>
              {shipment.status.replace('_', ' ')}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Carrier</span>
            <span className="info-value">{shipment.carrier}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Customer</span>
            <span className="info-value">{shipment.customerName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Est. Delivery</span>
            <span className="info-value">{formatDate(shipment.estimatedDelivery)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Cost</span>
            <span className="info-value font-semibold">{formatCurrency(shipment.cost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ShipmentTile.displayName = 'ShipmentTile';

// Action Menu Component
const ActionMenu = memo(({ shipment, onView, onFlag, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="action-menu-wrapper">
      <button
        className="btn-icon"
        onClick={() => setShowMenu(!showMenu)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      </button>
      {showMenu && (
        <>
          <div className="menu-overlay" onClick={() => setShowMenu(false)}></div>
          <div className="action-dropdown">
            <button onClick={() => { onView(); setShowMenu(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
              </svg>
              View Details
            </button>
            <button onClick={() => { onFlag(); setShowMenu(false); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" strokeWidth="2" />
                <line x1="4" y1="22" x2="4" y2="15" strokeWidth="2" />
              </svg>
              {shipment.flagged ? 'Unflag' : 'Flag'}
            </button>
            <button onClick={() => { onDelete(); setShowMenu(false); }} className="danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6" strokeWidth="2" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
              </svg>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
});

ActionMenu.displayName = 'ActionMenu';

export default ShipmentsList;
