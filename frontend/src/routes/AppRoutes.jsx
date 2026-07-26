import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Core Page Imports
import Dashboard from '../pages/Dashboard/Dashboard';
import Bookings from '../pages/Bookings/Bookings';
import Pickups from '../pages/Pickups/Pickups';
import Bilties from '../pages/Bilties/Bilties';
import Customers from '../pages/Customers/Customers';
import Payments from '../pages/Payments/Payments';
import Quotations from '../pages/Quotations/Quotations';
import Trailers from '../pages/Trailers/Trailers';
import Drivers from '../pages/Drivers/Drivers';
import Vehicles from '../pages/Vehicles/Vehicles';
import Invoices from '../pages/Invoices/Invoices';
import Reports from '../pages/Reports/Reports';
import Company from '../pages/Company/Company';
import Users from '../pages/Users/Users';
import UsersPanel from '../pages/Users/UsersPanel';
import Login from '../pages/Login/Login';
import Loading from '../pages/Loading/Loading';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<MainLayout />}>
        
        <Route element={<ProtectedRoute permissionKey="showDashboard" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showQuotations" />}>
          <Route path="/quotations" element={<Quotations />} />
        </Route>

        <Route element={<ProtectedRoute permissionKey="showBookings" />}>
          <Route path="/bookings" element={<Bookings />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showPickups" />}>
          <Route path="/pickups" element={<Pickups />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showLoading" />}>
          <Route path="/loading" element={<Loading />} />
        </Route>

        <Route element={<ProtectedRoute permissionKey="showBilties" />}>
          <Route path="/bilties" element={<Bilties />} />
        </Route>

        <Route element={<ProtectedRoute permissionKey="showInvoices" />}>
          <Route path="/invoices" element={<Invoices />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showCustomers" />}>
          <Route path="/customers" element={<Customers />} />
        </Route>

        <Route element={<ProtectedRoute permissionKey="showVehicles" />}>
          <Route path="/vehicles" element={<Vehicles />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showTrailers" />}>
          <Route path="/trailers" element={<Trailers />} />
        </Route>

        <Route element={<ProtectedRoute permissionKey="showDrivers" />}>
          <Route path="/drivers" element={<Drivers />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showCompany" />}>
          <Route path="/company" element={<Company />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showPayments" />}>
          <Route path="/payments" element={<Payments />} />
        </Route>
        
        <Route element={<ProtectedRoute permissionKey="showReports" />}>
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route element={<ProtectedRoute permissionKey="showUsers" />}>
          <Route path="/users" element={<Users />} />
        </Route>

        {/* Access Control & Permissions Panel moved to Settings */}
        <Route element={<ProtectedRoute permissionKey="showSettings" />}>
          <Route path="/settings" element={<UsersPanel />} />
        </Route>

      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}