import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useCompany } from '../context/CompanyContext';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser } = useCompany();

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
      
      {/* 1. SIDEBAR PANEL */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        
        {/* 3. RESTORED TOPBAR */}
        <header style={{
          height: '70px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          {/* Left Block: Hamburger & Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              style={{
                background: '#f1f5f9',
                border: 'none',
                fontSize: '1.4rem',
                cursor: 'pointer',
                color: '#334155',
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              ☰
            </button>
            
            {/* Red Company Icon Placeholder + Brand Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#ef4444',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                🏢
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '0.95rem', fontWeight: 700 }}>Harihar Cargo Carriers</h4>
                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Transport Management System</small>
              </div>
            </div>
          </div>

          {/* Right Block: User Profile Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>{currentUser?.name || "Nikhil Singh"}</div>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>Super Admin</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              NS
            </div>
          </div>
        </header>

        {/* 4. DYNAMIC VIEWPORT INJECTION CANVAS */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f1f5f9' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}