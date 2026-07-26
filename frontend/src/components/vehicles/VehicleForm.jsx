import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Input from '../common/Input';
import Button from '../common/Button';

export default function VehicleForm({ onClose, initialData }) {
  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    type: 'Owned', // Default fallback option picker settings
    status: 'Available'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.plateNumber) tempErrors.plateNumber = "Vehicle registration index license plate layout identifier is required.";
    if (!formData.model) tempErrors.model = "Carrier chassis description or engine configuration brand required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        plateNumber: formData.plateNumber.toUpperCase(), // Clean normalization index formatting 
        model: formData.model,
        type: formData.type,
        status: formData.status,
        updatedAt: serverTimestamp()
      };

      if (initialData) {
        const docRef = doc(db, 'vehicles', initialData.id);
        await updateDoc(docRef, payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'vehicles'), payload);
      }
      onClose();
    } catch (err) {
      console.error("Fleet tracking data commit failure:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="License Number Plate Indicia (e.g. MH-12-HE-XXXX)" 
        value={formData.plateNumber} 
        onChange={e => setFormData({ ...formData, plateNumber: e.target.value })} 
        error={errors.plateNumber} 
      />
      <Input 
        label="Truck Specification Details (e.g. Tata Prima / 10-Car Trailer)" 
        value={formData.model} 
        onChange={e => setFormData({ ...formData, model: e.target.value })} 
        error={errors.model} 
      />
      
      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fleet Assignment Category</label>
        <select 
          value={formData.type} 
          onChange={e => setFormData({ ...formData, type: e.target.value })}
          className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-sm border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
        >
          <option value="Owned">Company Owned Asset</option>
          <option value="Attached">Market Vendor Attached Vehicle</option>
        </select>
      </div>

      <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Deployment Allocation Availability Status</label>
        <select 
          value={formData.status} 
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          className="w-full border rounded-lg p-2.5 bg-white dark:bg-slate-800 text-sm border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
        >
          <option value="Available">Available (Docked at Yard)</option>
          <option value="In Transit">In Transit (Active Logistics Loop)</option>
          <option value="Maintenance">Maintenance Workshop Layover</option>
        </select>
      </div>

      <Button type="submit" variant="primary" className="w-full py-3 text-sm font-semibold tracking-wide shadow-sm mt-4">
        {initialData ? 'Save System Profiling Parameters' : 'Register Vehicle Profile'}
      </Button>
    </form>
  );
}