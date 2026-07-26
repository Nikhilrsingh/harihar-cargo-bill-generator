import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';

export default function Sidebar({ isOpen }) {
  const { currentUser, logout } = useCompany();
  const location = useLocation();

  // Role match handles both formats
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'Super Admin';

  // State to manage collapsible dropdown sections
  const [dropdownStates, setDropdownStates] = useState({
    operations: true,
    management: true,
    finance: true
  });

  const toggleDropdown = (groupKey) => {
    setDropdownStates(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const menuConfig = [
    {
      groupTitle: "MAIN",
      isDropdown: false,
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', key: 'showDashboard' }
      ]
    },
    {
      groupTitle: "OPERATIONS",
      isDropdown: true,
      groupKey: 'operations',
      items: [
        { path: '/bookings', label: 'Bookings', icon: '📋', key: 'showBookings' },
        { path: '/quotations', label: 'Quotations', icon: '📄', key: 'showQuotations' },
        { path: '/pickups', label: 'Pickups', icon: '🛻', key: 'showPickups' },
        { path: '/bilties', label: 'Bilties', icon: '📝', key: 'showBilties' },
        { path: '/loading', label: 'Loading', icon: '📦', key: 'showLoading' },
        { path: '/invoices', label: 'Invoices', icon: '🧾', key: 'showInvoices' }
      ]
    },
    {
      groupTitle: "MANAGEMENT",
      isDropdown: true,
      groupKey: 'management',
      items: [
        { path: '/customers', label: 'Customers', icon: '👥', key: 'showCustomers' },
        { path: '/vehicles', label: 'Vehicles', icon: '🚗', key: 'showVehicles' },
        { path: '/trailers', label: 'Trailers', icon: '🚛', key: 'showTrailers' },
        { path: '/drivers', label: 'Drivers', icon: '👤', key: 'showDrivers' },
        { path: '/company', label: 'Company', icon: '🏢', key: 'showCompany' },
        { path: '/users', label: 'Users Directory', icon: '👤', key: 'showUsers' }
      ]
    },
    {
      groupTitle: "FINANCE",
      isDropdown: true,
      groupKey: 'finance',
      items: [
        { path: '/payments', label: 'Payments', icon: '💵', key: 'showPayments' },
        { path: '/reports', label: 'Reports', icon: '📈', key: 'showReports' }
      ]
    }
  ];

  return (
    <div style={{
      width: isOpen ? '260px' : '0px',
      minWidth: isOpen ? '260px' : '0px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#111827',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20
    }}>
      
      {/* Brand Title */}
      <div style={{ padding: '24px 24px 16px 24px', whiteSpace: 'nowrap' }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          CarTransport
        </h2>
        <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '3px', marginTop: '2px' }}>
          PRO
        </div>
      </div>

      {/* Main Nav Items List Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {menuConfig.map((section, idx) => {
          const allowedItems = section.items.filter(item => isAdmin || currentUser?.permissions?.[item.key]);
          if (allowedItems.length === 0) return null;

          if (!section.isDropdown) {
            return (
              <div key={idx}>
                <div style={{ color: '#4b5563', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>
                  {section.groupTitle}
                </div>
                {allowedItems.map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} style={{
                      display: 'flex', alignItems: 'center', padding: '10px 12px',
                      color: isActive ? '#fff' : '#9ca3af', backgroundColor: isActive ? '#dc2626' : 'transparent',
                      borderRadius: '8px', textDecoration: 'none', fontWeight: 500, marginBottom: '4px'
                    }}>
                      <span style={{ marginRight: '14px', fontSize: '1.1rem' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          }

          const isGroupOpen = dropdownStates[section.groupKey];

          return (
            <div key={idx}>
              <div 
                onClick={() => toggleDropdown(section.groupKey)}
                style={{ 
                  color: '#4b5563', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', 
                  marginBottom: '8px', paddingLeft: '8px', display: 'flex', justifyContent: 'space-between', 
                  alignItems: 'center', cursor: 'pointer', userSelect: 'none' 
                }}
              >
                <span>{section.groupTitle}</span>
                <span style={{ fontSize: '0.6rem', transform: isGroupOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
              </div>

              <div style={{ 
                height: isGroupOpen ? 'auto' : '0px', overflow: 'hidden', 
                display: 'flex', flexDirection: 'column', gap: '2px', transition: 'all 0.2s ease' 
              }}>
                {allowedItems.map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} style={{
                      display: 'flex', alignItems: 'center', padding: '10px 12px',
                      color: isActive ? '#fff' : '#9ca3af', backgroundColor: isActive ? '#dc2626' : 'transparent',
                      borderRadius: '8px', textDecoration: 'none', fontWeight: 500
                    }}>
                      <span style={{ marginRight: '14px', fontSize: '1.1rem' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Fixed Actions Block: Settings & Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {(isAdmin || currentUser?.permissions?.showSettings) && (
          <Link to="/settings" style={{
            display: 'flex', alignItems: 'center', padding: '10px 12px',
            color: location.pathname === '/settings' ? '#fff' : '#9ca3af',
            backgroundColor: location.pathname === '/settings' ? '#dc2626' : 'transparent',
            borderRadius: '8px', textDecoration: 'none', fontWeight: 500
          }}>
            <span style={{ marginRight: '14px', fontSize: '1.1rem' }}>⚙️</span>
            <span>Access Control</span>
          </Link>
        )}
        
        <button 
          onClick={logout || (() => console.log('Logout clicked'))}
          style={{
            display: 'flex', alignItems: 'center', padding: '10px 12px', width: '100%',
            color: '#ef4444', background: 'none', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 500, textAlign: 'left'
          }}
        >
          <span style={{ marginRight: '14px', fontSize: '1.1rem' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}