import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ShipmentsList from './components/Shipments/ShipmentsList';
import Tracking from './components/Tracking/Tracking';
import Settings from './components/Settings/Settings';
import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipments"
          element={
            <PrivateRoute>
              <ShipmentsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/tracking"
          element={
            <PrivateRoute>
              <Tracking />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports/*"
          element={
            <PrivateRoute>
              <div className="dashboard-container">
                <div className="page-header">
                  <h1>Reports</h1>
                  <p>Reports section coming soon...</p>
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
};

export default App;
