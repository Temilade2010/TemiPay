import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export function AuthGuard() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
