import React, { useState, useEffect } from 'react';
import { 
  generateNextPickupId, 
  generateNextBiltyNo, 
  generateNextBillNo, 
  generateNextLoadingSlipNo 
} from '../../utils/erpEngine';

export default function Dashboard() {
  const [pickups, setPickups] = useState([]);
  const [bilties, setBilties] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingSlips, setLoadingSlips] = useState([]);

  // Sequence info state
  const [nextIds, setNextIds] = useState({
    pickup: 1,
    bilty: 5492,
    bill: 7896,
    loading: 'HCC-210726-078'
  });

  useEffect(() => {
    // Sync lists from localStorage
    const pList = JSON.parse(localStorage.getItem('hcc_pickups_list') || '[]');
    const bList = JSON.parse(localStorage.getItem('hcc_bilties_list') || '[]');
    const iList = JSON.parse(localStorage.getItem('hcc_invoices_list') || '[]');
    const lList = JSON.parse(localStorage.getItem('hcc_loading_slips') || '[]');

    setPickups(pList);
    setBilties(bList);
    setInvoices(iList);
    setLoadingSlips(lList);

    // Calculate next dynamic numbers with gap-checking
    setNextIds({
      pickup: generateNextPickupId(),
      bilty: generateNextBiltyNo(),
      bill: generateNextBillNo(),
      loading: generateNextLoadingSlipNo()
    });
  }, []);

  // Calculate total billed revenue
  const totalRevenue = invoices.reduce((acc, curr) => {
    const val = parseFloat(curr.amount) || 0;
    return acc + val;
  }, 0);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Top Banner */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>📊 ERP Control Dashboard</h1>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
          Harihar Cargo Carriers • Centralized Logistics Pipeline & Real-Time Tracking
        </p>
      </div>

      {/* 4 Key Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Pickups */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #2563eb', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pickups & Bookings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '6px 0' }}>{pickups.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>Next ID: #{nextIds.pickup}</div>
        </div>

        {/* Bilties */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #dc2626', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Consignment Bilties</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '6px 0' }}>{bilties.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 700 }}>Next Bilty / LR: #{nextIds.bilty}</div>
        </div>

        {/* Loading Slips */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #059669', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Dispatch Slips</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '6px 0' }}>{loadingSlips.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>Next Slip: {nextIds.loading}</div>
        </div>

        {/* Invoices */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #7c3aed', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Freight Invoices</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '6px 0' }}>₹ {totalRevenue.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700 }}>Next Bill: #{nextIds.bill} ({invoices.length} Bills)</div>
        </div>

      </div>

      {/* Connected Data Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Recent Bilties */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>📋 Recent Bilties</h3>
          {bilties.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bilties.slice(0, 5).map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ color: '#b91c1c' }}>LR #{b.lrNo}</strong> - {b.carName || 'Vehicle'}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{b.consignorName || 'Client'} • {b.fromLocation} ➔ {b.toLocation}</div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>₹ {b.declaredValue || '0'}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No bilties created yet.</p>
          )}
        </div>

        {/* Recent Invoices */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>🧾 Recent Invoices & Bills</h3>
          {invoices.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {invoices.slice(0, 5).map(inv => (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                  <div>
                    <strong style={{ color: '#1e40af' }}>Bill #{inv.billNo}</strong> - {inv.clientName || 'Client'}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>LR #{inv.lrNo || 'N/A'} • {inv.date}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#059669' }}>₹ {inv.amount || '0'}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>No invoices billed yet.</p>
          )}
        </div>

      </div>

    </div>
  );
}