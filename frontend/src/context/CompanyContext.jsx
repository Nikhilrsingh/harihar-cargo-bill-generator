import React, { createContext, useContext, useState } from 'react';

export const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  // Current user with default permissions matching your Sidebar keys
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-1',
    name: 'Nikhil Singh',
    role: 'super_admin', // 'super_admin', 'manager', or 'staff'
    email: 'nikhil@hariharcargo.com',
    permissions: {
      showDashboard: true,
      showBookings: true,
      showQuotations: true,
      showPickups: true,
      showBilties: true,
      showLoading: true,
      showInvoices: true,
      showCustomers: true,
      showVehicles: true,
      showTrailers: true,
      showDrivers: true,
      showCompany: true,
      showUsers: true,
      showPayments: true,
      showReports: true,
      showSettings: true
    }
  });

  const [pickups, setPickups] = useState([]);
  const [bilties, setBilties] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Permission Checker Helper
  const hasPermission = (permissionKey) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin' || currentUser.role === 'Super Admin') return true;
    return !!currentUser?.permissions?.[permissionKey];
  };

  const logout = () => {
    console.log('User logged out');
  };

  const savePickup = (pickupData) => {
    setPickups(prev => {
      const exists = prev.find(p => p.id === pickupData.id);
      if (exists) return prev.map(p => p.id === pickupData.id ? pickupData : p);
      return [pickupData, ...prev];
    });
  };

  const deletePickup = (id) => {
    setPickups(prev => prev.filter(p => p.id !== id));
  };

  return (
    <CompanyContext.Provider value={{
      currentUser,
      setCurrentUser,
      hasPermission,
      logout,
      pickups,
      savePickup,
      deletePickup,
      bilties,
      setBilties,
      loadings,
      setLoadings,
      invoices,
      setInvoices
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => useContext(CompanyContext);