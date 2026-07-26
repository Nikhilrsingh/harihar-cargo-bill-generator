import React, { useState } from 'react';
import { useCompany } from '../../context/CompanyContext';

export default function Users() {
  // Pull users and state functions directly from CompanyContext!
  const { users, setUsers } = useCompany();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff / Operator', phone: '' });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created = {
      uid: `user_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone || 'N/A',
      permissions: {
        showDashboard: true,
        showBookings: true,
        showBilties: false,
        showPayments: false,
        showUsersPanel: false,
        showRevenueCards: false
      }
    };

    // Dynamically update central state
    setUsers(prev => [...(prev || []), created]);
    setNewUser({ name: '', email: '', role: 'Staff / Operator', phone: '' });
    setShowAddModal(false);
  };

  const handleDeleteUser = (uid) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      setUsers(prev => prev.filter(u => u.uid !== uid));
    }
  };

  return (
    <div style={{ padding: '24px', color: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>User Directory</h2>
          <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Add active system users and staff accounts.</p>
        </div>
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          style={{
            padding: '10px 18px',
            backgroundColor: '#ef4444',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          + Add New User
        </button>
      </div>

      {/* Dynamic Add User Form */}
      {showAddModal && (
        <form onSubmit={handleCreateUser} style={{
          backgroundColor: '#1e293b',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #334155',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Malhotra"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. vikram@harihar.com"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>Assign Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }}
            >
              <option value="Manager">Manager</option>
              <option value="Staff / Operator">Staff / Operator</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{ padding: '8px 16px', backgroundColor: '#475569', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >
              Save & Create Account
            </button>
          </div>
        </form>
      )}

      {/* Live Directory Table from Context */}
      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '12px' }}>Name & Email</th>
              <th style={{ padding: '12px' }}>System Role</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.uid || user.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{user.email || 'No email registered'}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: '#334155', borderRadius: '12px', fontSize: '0.85rem' }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>● Active</span>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteUser(user.uid || user.id)}
                      style={{ padding: '6px 12px', backgroundColor: '#ef4444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  No users added yet. Click "+ Add New User" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}