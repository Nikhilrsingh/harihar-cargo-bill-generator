import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import BookingForm from '../../components/bookings/BookingForm';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Connects a real-time data stream directly to your live Firebase collection[cite: 1]
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataRows = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(dataRows);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedBooking(null);
    setIsDrawerOpen(true);
  };

  const columns = [
    { header: 'Source Location', key: 'source' },
    { header: 'Destination', key: 'destination' },
    { header: 'Freight Price (₹)', key: 'totalCharges' },
    { header: 'Advance Received (₹)', key: 'advance' },
    { header: 'Outstanding Balance (₹)', key: 'balance' }
  ];

  if (loading) return <div className="p-6 text-center text-sm font-medium text-gray-500">Syncing database assets...</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Active Cargo Consignments</h1>
        <Button onClick={handleCreate} variant="primary">+ Create Booking Instance</Button>
      </div>

      <DataTable data={bookings} columns={columns} />

      {/* RIGHT SLIDING OVERLAY CONTAINER DRAWER LAYER[cite: 1] */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full p-6 shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedBooking ? 'Modify Cargo Manifest Details' : 'Register New Vehicle Freight Entry'}
              </h3>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
            </div>
            
            <BookingForm 
              initialData={selectedBooking} 
              onClose={() => setIsDrawerOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}