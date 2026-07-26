import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';

export default function ProtectedRoute({ permissionKey }) {
  const { currentUser } = useCompany();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 👑 ADMIN BYPASS RULE: If they are the super admin, let them see everything unconditionally
  if (currentUser.role === 'super_admin') {
    return <Outlet />;
  }

  // Feature-level check for standard staff accounts
  if (permissionKey && currentUser?.permissions && !currentUser.permissions[permissionKey]) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}