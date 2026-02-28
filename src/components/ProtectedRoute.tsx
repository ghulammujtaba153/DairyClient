import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../context/useAuthContext';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
