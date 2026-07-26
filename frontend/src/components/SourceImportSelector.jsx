// src/components/SourceImportSelector.jsx
import React, { useState, useEffect } from 'react';
import { importDataFromSource } from '../utils/erpEngine';

export default function SourceImportSelector({ isOpen, onClose, onImportSelected }) {
  const [sourceType, setSourceType] = useState('none');
  const [selectedId, setSelectedId] = useState('');
  const [pickups, setPickups] = useState([]);
  const [bilties, setBilties] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setPickups(JSON.parse(localStorage.getItem('hcc_pickups_list') || '[]'));
      setBilties(JSON.parse(localStorage.getItem('hcc_bilties_list') || '[]'));
      setSourceType('none');
      setSelectedId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (sourceType === 'none') {
      onImportSelected(null);
    } else {
      const data = importDataFromSource(sourceType, selectedId);
      onImportSelected(data);
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontFamily: 'Arial, sans-serif' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>📥 Select Data Source</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>Where should this document import its details from?</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="radio" name="source" value="none" checked={sourceType === 'none'} onChange={() => setSourceType('none')} />
            <span><strong>Start Fresh</strong> (Blank Document)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="radio" name="source" value="pickup" checked={sourceType === 'pickup'} onChange={() => { setSourceType('pickup'); setSelectedId(''); }} />
            <span><strong>Import from Saved Pickup</strong></span>
          </label>

          {sourceType === 'pickup' && (
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', fontSize: '0.85rem' }}>
              <option value="">-- Select Saved Pickup --</option>
              {pickups.map(p => (
                <option key={p.id} value={p.id}>Pickup #{p.pickupId || p.id} - {p.clientName} ({p.vehicleModel})</option>
              ))}
            </select>
          )}

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input type="radio" name="source" value="bilty" checked={sourceType === 'bilty'} onChange={() => { setSourceType('bilty'); setSelectedId(''); }} />
            <span><strong>Import from Saved Bilty</strong></span>
          </label>

          {sourceType === 'bilty' && (
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', fontSize: '0.85rem' }}>
              <option value="">-- Select Saved Bilty --</option>
              {bilties.map(b => (
                <option key={b.id} value={b.lrNo}>Bilty / LR #{b.lrNo} - {b.consignorName || b.carName}</option>
              ))}
            </select>
          )}

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleApply} style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Apply & Continue</button>
        </div>
      </div>
    </div>
  );
}