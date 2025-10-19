
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}>
          <div>Loading...</div>
        </div>
    );
  }

  if (!currentUser || role !== 'admin') {
    return <Navigate to="/login?role=admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
