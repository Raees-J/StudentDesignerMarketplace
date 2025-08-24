import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (role !== 'admin') return <Navigate to="/admin-login" replace />;

  return <>{children}</>;
};

export default ProtectedAdminRoute;
