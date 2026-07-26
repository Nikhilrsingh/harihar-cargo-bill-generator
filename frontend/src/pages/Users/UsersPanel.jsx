import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';

// Mock database of users to demonstrate full system control
const INITIAL_USERS = [
  {
    uid: "user_rahul_123",
    name: "Rahul Sharma",
    role: "Manager",
    permissions: {
      showDashboard: true,
      showBookings: true,
      showBilties: true,
      showPayments: false,
      showUsersPanel: false,
      showRevenueCards: false
    }
  },
  {
    uid: "user_amit_456",
    name: "Amit Patel",
    role: "Staff / Operator",
    permissions: {
      showDashboard: true,
      showBookings: true,
      showBilties: false,
      showPayments: false,
      showUsersPanel: false,
      showRevenueCards: false
    }
  }
];

export default function UsersPanel() {
  const { currentUser, setCurrentUser } = useCompany();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedUserId, setSelectedUserId] = useState('');

  // Toggle permission for a managed user
  const handleTogglePermission = (userId, permissionKey) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.uid === userId) {
          return {
            ...user,
            permissions: {
              ...user.permissions,
              [permissionKey]: !user.permissions[permissionKey]
            }
          };
        }
        return user;
      })
    );
  };

  // Live Testing Simulator: Swap active session profile to test instant UI hiding
  const simulateImpersonation = (user) => {
    setCurrentUser({
      ...user,
      role: user.role.toLowerCase().replace(/ /g, '_')
    });
    alert(`Switched session to ${user.name}. Your dashboard will now dynamically adapt to their permissions!`);
  };

  // Reset session back to Super Admin mode
  const resetToAdmin = () => {
    setCurrentUser({
      uid: "admin_nikhil",
      name: "Nikhil Singh",
      role: "super_admin",
      permissions: {
        showDashboard: true,
        showBookings: true,
        showBilties: true,
        showPayments: true,
        showUsersPanel: true,
        showRevenueCards: true
      }
    });
    alert("Reverted back to Super Admin mode with full system visibility.");
  };

  return (
    <div style={{ padding: '24px', color: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Access Control Center</h2>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Manage structural feature visibilities and granular permissions.</p>
        </div>
        {currentUser?.uid !== "admin_nikhil" && (
          <button 
            onClick={resetToAdmin}
            style={{ padding: '10px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
          >
            ← Back to Admin Mode
          </button>
        )}
      </div>

      {/* User Selection Header Dropdown */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <label style={{ fontWeight: 600, color: '#f8fafc' }}>
          Select User to Quick Filter:
        </label>

        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #475569',
            backgroundColor: '#0f172a',
            color: '#fff',
            fontWeight: 500
          }}
        >
          <option value="">-- All Users --</option>
          {users.map((user) => (
            <option key={user.uid} value={user.uid}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      {/* Permissions Table */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '12px' }}>User Details</th>
              <th style={{ padding: '12px' }}>Dashboard</th>
              <th style={{ padding: '12px' }}>Bookings</th>
              <th style={{ padding: '12px' }}>Bilty Gen</th>
              <th style={{ padding: '12px' }}>Accounts</th>
              <th style={{ padding: '12px' }}>Rev Cards</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(user => !selectedUserId || user.uid === selectedUserId)
              .map((user) => (
                <tr key={user.uid} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.role}</div>
                  </td>
                  {Object.keys(user.permissions).map((key) => {
                    if (key === 'showUsersPanel') return null;
                    return (
                      <td key={key} style={{ padding: '16px 12px' }}>
                        <input 
                          type="checkbox" 
                          checked={user.permissions[key]}
                          onChange={() => handleTogglePermission(user.uid, key)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ef4444' }}
                        />
                      </td>
                    );
                  })}
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <button 
                      onClick={() => simulateImpersonation(user)}
                      style={{ padding: '6px 12px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Simulate View
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}