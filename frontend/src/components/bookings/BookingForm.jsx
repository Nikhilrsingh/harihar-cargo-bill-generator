import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Input from '../common/Input';
import Button from '../common/Button';

export default function BookingForm({ onClose, initialData }) {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    totalCharges: 0,
    advance: 0,
    balance: 0
  });
  const [errors, setErrors] = useState({});

  // Feeds targeted cell arrays into local storage buffers when a record item is selected for edits
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.source) tempErrors.source = "Origin pickup dispatch city route field value is required.";
    if (!formData.destination) tempErrors.destination = "Destination drop-off location value required.";
    if (Number(formData.totalCharges) <= 0) tempErrors.totalCharges = "Base standard contract freight fees must be greater than zero.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Computes calculated math matrices instantly on state field modifications
  const calculateCharges = (charges, adv) => {
    const total = Number(charges) || 0;
    const paid = Number(adv) || 0;
    setFormData(prev => ({
      ...prev,
      totalCharges: total,
      advance: paid,
      balance: total - paid
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        source: formData.source,
        destination: formData.destination,
        totalCharges: Number(formData.totalCharges),
        advance: Number(formData.advance),
        balance: Number(formData.balance),
        updatedAt: serverTimestamp()
      };

      if (initialData) {
        // Runs an update process targeted strictly at the specific document data row reference index
        const docRef = doc(db, 'bookings', initialData.id);
        await updateDoc(docRef, payload);
      } else {
        // Adds a brand new data node into the base collection array path
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'bookings'), payload);
      }
      onClose(); // Instantly tells the sliding right-hand workspace layout box frame to dismiss smoothly
    } catch (err) {
      console.error("Database storage transactional failure:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Dispatch Loading Terminal City" 
        value={formData.source} 
        onChange={e => setFormData({ ...formData, source: e.target.value })} 
        error={errors.source} 
      />
      <Input 
        label="Consignment Receiving Drop-off City" 
        value={formData.destination} 
        onChange={e => setFormData({ ...formData, destination: e.target.value })} 
        error={errors.destination} 
      />
      <Input 
        label="Total Aggregated Contract Freight Value (₹)" 
        type="number"
        value={formData.totalCharges} 
        onChange={e => calculateCharges(e.target.value, formData.advance)} 
        error={errors.totalCharges} 
      />
      <Input 
        label="Partial Token Advance Payment Made (₹)" 
        type="number"
        value={formData.advance} 
        onChange={e => calculateCharges(formData.totalCharges, e.target.value)} 
      />
      
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center font-mono">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Net Remainder Balance Account Outstanding:</span>
        <span className="text-xl font-bold text-rose-600 dark:text-rose-400">₹{formData.balance}</span>
      </div>

      <Button type="submit" variant="primary" className="w-full py-3 text-sm font-semibold tracking-wide shadow-sm">
        {initialData ? 'Save Changes' : 'Commit New Order Manifest Record'}
      </Button>
    </form>
  );
}