# UltraShip TMS - Transportation Management System

A modern, full-stack transportation management application built with React, Node.js, and GraphQL.

## Features

### Frontend Features
- **Beautiful Modern UI** - Gradient backgrounds, smooth animations, and a polished design
- **Dual View Modes** - Switch between grid and tile views for shipment data
- **Hamburger Menu** - Responsive navigation with one-level deep submenus
- **Horizontal Navigation** - Desktop-optimized menu with dropdown submenus
- **Advanced Filtering** - Search, filter by status, carrier, and flagged items
- **Sorting** - Click column headers to sort shipments
- **Detail View** - Beautiful modal with comprehensive shipment information
- **Action Menus** - Three-dot menus for edit, flag, and delete operations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Role-Based UI** - Different views for Admin and Employee roles
- **Authentication** - Secure login with JWT tokens

### Backend Features
- **GraphQL API** - Efficient, flexible data querying
- **Authentication & Authorization** - JWT-based with role-based access control (RBAC)
- **Pagination** - Both offset-based and cursor-based pagination
- **Filtering & Sorting** - Server-side data filtering and sorting
- **Performance Optimizations** - Caching, code splitting, and DataLoader patterns
- **Type Safety** - Comprehensive GraphQL schema with validation

### Role-Based Access Control
- **Admin**: Full access to all features (create, update, delete shipments)
- **Employee**: Limited access (can update status and notes only, view all data)

## Tech Stack

### Frontend
- React 18
- Apollo Client (GraphQL)
- React Router v6
- CSS3 with CSS Variables
- Vite (Build tool)

### Backend
- Node.js
- Apollo Server v4
- GraphQL
- Express
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
ultrashiptms/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── auth.js          # Authentication utilities
│   │   ├── models/
│   │   │   └── data.js          # In-memory data store
│   │   ├── resolvers/
│   │   │   └── index.js         # GraphQL resolvers
│   │   ├── schema/
│   │   │   └── typeDefs.js      # GraphQL schema
│   │   └── index.js             # Server entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── apollo/
    │   │   ├── client.js        # Apollo Client setup
    │   │   └── queries.js       # GraphQL queries/mutations
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx    # Login component
    │   │   │   └── Login.css
    │   │   ├── Dashboard/
    │   │   │   ├── Dashboard.jsx
    │   │   │   └── Dashboard.css
    │   │   ├── Layout/
    │   │   │   ├── Header.jsx   # Navigation header
    │   │   │   └── Header.css
    │   │   └── Shipments/
    │   │       ├── ShipmentsList.jsx
    │   │       ├── ShipmentsList.css
    │   │       ├── ShipmentFilters.jsx
    │   │       ├── ShipmentFilters.css
    │   │       ├── ShipmentDetail.jsx
    │   │       └── ShipmentDetail.css
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication context
    │   ├── styles/
    │   │   └── global.css       # Global styles
    │   ├── App.jsx              # Main app component
    │   └── main.jsx             # Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd ultrashiptms
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You'll need two terminal windows - one for the backend and one for the frontend.

#### Terminal 1: Start the Backend Server
```bash
cd backend
npm run dev
```
The GraphQL server will start at `http://localhost:4000/graphql`

#### Terminal 2: Start the Frontend
```bash
cd frontend
npm run dev
```
The React app will start at `http://localhost:3000`

### Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Employee Account:**
- Username: `employee`
- Password: `employee123`

## Usage Guide

### Dashboard
- View key statistics (Total, Pending, In Transit, Delivered, Flagged shipments)
- Click stat cards to navigate to filtered shipment views
- View recent shipments with quick access

### Shipments Page
- **Toggle Views**: Switch between Grid and Tile views using the view toggle buttons
- **Search**: Use the search box to find shipments by tracking number, customer, location, or carrier
- **Filter**: Apply filters for status, carrier, and flagged items
- **Sort**: Click column headers in grid view to sort data
- **Actions**: Use the three-dot menu on each shipment to:
  - View detailed information
  - Flag/unflag shipments
  - Delete shipments (Admin only)

### Shipment Detail View
- Click any shipment to open the detailed modal view
- View complete shipment information with visual route display
- Edit shipment details (permissions based on role)
- Navigate back to the list view

### Navigation
- **Desktop**: Use the horizontal menu with dropdown submenus
- **Mobile**: Access the hamburger menu for full navigation
- **User Menu**: View your role and logout from the top-right corner

## Performance Optimizations

### Frontend
1. **Code Splitting**: Vendor and Apollo libraries are split into separate bundles
2. **Memoization**: React.memo() used for frequently re-rendered components
3. **Apollo Cache**: Configured cache policies for optimal query performance
4. **CSS**: CSS variables for consistent theming and minimal repaints

### Backend
1. **GraphQL**: Efficient data fetching - request only what you need
2. **Caching**: Apollo Server bounded cache enabled
3. **Pagination**: Implemented for large datasets
4. **Query Optimization**: Filtering and sorting done server-side

## GraphQL API

### Available Queries
```graphql
# Get all shipments with filters
shipments(
  filter: ShipmentFilterInput
  sort: SortInput
  limit: Int
  offset: Int
): [Shipment!]!

# Get paginated shipments (cursor-based)
shipmentsPaginated(
  first: Int
  after: String
  filter: ShipmentFilterInput
  sort: SortInput
): ShipmentConnection!

# Get single shipment
shipment(id: ID!): Shipment

# Get current user
me: User
```

### Available Mutations
```graphql
# Authentication
login(username: String!, password: String!): AuthPayload!
register(username: String!, password: String!, email: String!, role: UserRole): AuthPayload!

# Shipments
createShipment(input: ShipmentInput!): Shipment!      # Admin only
updateShipment(id: ID!, input: ShipmentInput!): Shipment!
deleteShipment(id: ID!): Boolean!                      # Admin only
toggleShipmentFlag(id: ID!): Shipment!
```

## Customization

### Adding New Users
Edit `backend/src/models/data.js` in the `initializeUsers()` function.

### Modifying Sample Data
Edit `backend/src/models/data.js` in the `initializeShipments()` function.

### Changing Theme Colors
Update CSS variables in `frontend/src/styles/global.css`:
```css
:root {
  --primary: #2563eb;
  --secondary: #7c3aed;
  /* ... etc */
}
```

### Adding New Routes
1. Add route in `frontend/src/App.jsx`
2. Create component in `frontend/src/components/`
3. Add navigation item in `frontend/src/components/Layout/Header.jsx`

## Environment Variables

### Backend (.env)
```
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The production build will be in `frontend/dist/`

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements
- Real database integration (PostgreSQL/MongoDB)
- Real-time updates with GraphQL subscriptions
- PDF invoice generation
- Email notifications
- Advanced analytics and charts
- File uploads for shipping documents
- Multi-language support
- Dark mode

## License
MIT

## Support
For issues or questions, please open an issue in the project repository.

---

Built with ❤️ using React, Node.js, and GraphQL
