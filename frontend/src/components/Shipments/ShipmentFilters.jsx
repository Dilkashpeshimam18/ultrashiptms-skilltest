import './ShipmentFilters.css';

const ShipmentFilters = ({ filters, setFilters, viewMode, setViewMode }) => {
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      status: '',
      carrier: '',
      flagged: '',
    });
  };

  const hasActiveFilters =
    filters.searchTerm || filters.status || filters.carrier || filters.flagged;

  return (
    <div className="shipment-filters">
      <div className="filters-row">
        {/* Search */}
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" />
          </svg>
          <input
            type="text"
            placeholder="Search shipments..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="search-input"
          />
          {filters.searchTerm && (
            <button
              onClick={() => handleFilterChange('searchTerm', '')}
              className="clear-search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
                <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
              </svg>
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="DELIVERED">Delivered</option>
          <option value="DELAYED">Delayed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Carrier Filter */}
        <select
          value={filters.carrier}
          onChange={(e) => handleFilterChange('carrier', e.target.value)}
          className="filter-select"
        >
          <option value="">All Carriers</option>
          <option value="FedEx">FedEx</option>
          <option value="UPS">UPS</option>
          <option value="DHL">DHL</option>
          <option value="USPS">USPS</option>
          <option value="XPO Logistics">XPO Logistics</option>
        </select>

        {/* Flagged Filter */}
        <select
          value={filters.flagged}
          onChange={(e) => handleFilterChange('flagged', e.target.value)}
          className="filter-select"
        >
          <option value="">All Items</option>
          <option value="true">Flagged Only</option>
          <option value="false">Not Flagged</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn btn-secondary clear-filters-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
            </svg>
            Clear
          </button>
        )}

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            className={`view-btn ${viewMode === 'tile' ? 'active' : ''}`}
            onClick={() => setViewMode('tile')}
            title="Tile View"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="7" strokeWidth="2" />
              <rect x="3" y="14" width="18" height="7" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentFilters;
