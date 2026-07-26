import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';

// Predefined suggestion lists
const CAR_SUGGESTIONS = [
  'Maruti Swift', 'Maruti Swift Dzire', 'Maruti Baleno', 'Hyundai Creta',
  'Hyundai i20', 'Tata Nexon', 'Tata Punch', 'Mahindra Thar',
  'Mahindra XUV700', 'Toyota Fortuner', 'Kia Seltos', 'Honda City'
];

const LOCATION_SUGGESTIONS = [
  { city: 'Nagpur', pincode: '440001' },
  { city: 'Mumbai', pincode: '400001' },
  { city: 'Pune', pincode: '411001' },
  { city: 'Delhi', pincode: '110001' },
  { city: 'Bangalore', pincode: '560001' },
  { city: 'Hyderabad', pincode: '500001' },
  { city: 'Ahmedabad', pincode: '380001' },
  { city: 'Kolkata', pincode: '700001' },
  { city: 'Indore', pincode: '452001' },
  { city: 'Jaipur', pincode: '302001' }
];

export default function PickupDrawer({ isOpen, onClose, pickupData }) {
  const { savePickup } = useCompany();

  const [formData, setFormData] = useState({
    id: '',
    pickupNumber: '',
    date: new Date().toISOString().split('T')[0],
    partyName: '',
    partyNumber: '',
    packerName: '',
    carName: '',
    carNumber: '',
    fromLocation: '',
    toLocation: '',
    pincode: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (pickupData) {
      setFormData(pickupData);
    } else {
      setFormData({
        id: `PKP-${Date.now().toString().slice(-5)}`,
        pickupNumber: `PKP-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        partyName: '',
        partyNumber: '',
        packerName: '',
        carName: '',
        carNumber: '',
        fromLocation: '',
        toLocation: '',
        pincode: '',
        status: 'Pending'
      });
    }
  }, [pickupData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-fill pincode when 'To' location changes
  const handleToChange = (e) => {
    const selectedCity = e.target.value;
    const match = LOCATION_SUGGESTIONS.find(
      loc => loc.city.toLowerCase() === selectedCity.trim().toLowerCase()
    );

    setFormData(prev => ({
      ...prev,
      toLocation: selectedCity,
      pincode: match ? match.pincode : prev.pincode
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    savePickup(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '480px',
      height: '100vh',
      backgroundColor: '#ffffff',
      boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
          {pickupData ? 'Edit Pickup Order' : 'Create New Pickup'}
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Pickup Number</label>
          <input type="text" name="pickupNumber" value={formData.pickupNumber} onChange={handleChange} readOnly style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc' }} />
        </div>

        {/* Party Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Party Name *</label>
            <input type="text" name="partyName" value={formData.partyName} onChange={handleChange} required placeholder="Party Name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Party Number *</label>
            <input type="tel" name="partyNumber" value={formData.partyNumber} onChange={handleChange} required placeholder="Mobile No." style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Packer Name</label>
          <input type="text" name="packerName" value={formData.packerName} onChange={handleChange} placeholder="Packer Name" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
        </div>

        {/* Car Details with Auto-complete */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Car Name *</label>
            <input 
              type="text" 
              name="carName" 
              list="car-suggestions" 
              value={formData.carName} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Swift Dzire" 
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
            />
            <datalist id="car-suggestions">
              {CAR_SUGGESTIONS.map((car, index) => (
                <option key={index} value={car} />
              ))}
            </datalist>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Car Number *</label>
            <input type="text" name="carNumber" value={formData.carNumber} onChange={handleChange} required placeholder="MH 31 AB 1234" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
        </div>

        {/* From & To with Location Suggestions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>From *</label>
            <input 
              type="text" 
              name="fromLocation" 
              list="location-suggestions" 
              value={formData.fromLocation} 
              onChange={handleChange} 
              required 
              placeholder="Pickup City" 
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>To *</label>
            <input 
              type="text" 
              name="toLocation" 
              list="location-suggestions" 
              value={formData.toLocation} 
              onChange={handleToChange} 
              required 
              placeholder="Destination City" 
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
            />
          </div>
        </div>

        {/* Shared Datalist for From & To Locations */}
        <datalist id="location-suggestions">
          {LOCATION_SUGGESTIONS.map((loc, index) => (
            <option key={index} value={loc.city} />
          ))}
        </datalist>

        {/* Pincode & Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Pincode (Auto)</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', gap: '12px' }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button type="submit" style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', backgroundColor: '#dc2626', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}>Save Pickup</button>
        </div>

      </form>
    </div>
  );
}