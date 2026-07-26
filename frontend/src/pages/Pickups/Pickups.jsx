import React, { useState, useEffect } from 'react';
import { generateNextPickupId } from '../../utils/erpEngine';

// Assets imported directly from src/assets
import logoLeft from '../../assets/logo-left.png';
import logoRight from '../../assets/right-logo.png';
import signImg from '../../assets/sign.png';

// Google Apps Script Web App URL
const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylTveh70crB2cvXQxCpgGc8x1aX6V0Qf9X9lwl31cc19XkDN1KsnvnGl_QtrrRXClk/exec"; 

const CITY_SUGGESTIONS = [
  'Nagpur', 'Pune', 'Mumbai', 'Delhi', 'Gurgaon', 'Bangalore', 'Chennai', 
  'Goa', 'Jabalpur', 'Raipur', 'Bhopal', 'Indore', 'Chandigarh', 'Ludhiana', 
  'Cochin', 'Ahmedabad', 'Jaipur', 'Kolkata', 'Lucknow', 'Bhubaneswar', 'Hyderabad'
];

const CITY_PINCODES = {
  'Nagpur': '440023', 'Pune': '411001', 'Mumbai': '400001', 'Delhi': '110001',
  'Gurgaon': '122001', 'Bangalore': '560001', 'Chennai': '600001', 'Goa': '403001',
  'Jabalpur': '482001', 'Raipur': '492001', 'Bhopal': '462001', 'Indore': '452001',
  'Hyderabad': '500001'
};

const CAR_SUGGESTIONS = [
  'Hyundai Creta', 'Maruti Swift', 'Tata Nexon', 'Mahindra Thar', 'Toyota Fortuner',
  'Kia Seltos', 'Honda City', 'BMW 3 Series', 'Mercedes-Benz C-Class', 'Audi A4',
  'Volkswagen Virtus', 'Skoda Slavia', 'MG Hector', 'Tata Harrier', 'Maruti Baleno'
];

export default function Pickups() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSelectEditModalOpen, setIsSelectEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedShareIds, setSelectedShareIds] = useState([]);
  const itemsPerPage = 14;

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterPacker, setFilterPacker] = useState('');
  const [filterToStation, setFilterToStation] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  const [pickupsList, setPickupsList] = useState(() => {
    const saved = localStorage.getItem('hcc_pickups_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [pickupData, setPickupData] = useState({
    id: generateNextPickupId(),
    pickupDate: new Date().toLocaleDateString('en-CA'), // Formats cleanly as YYYY-MM-DD in local time
    partyName: '',
    partyNumber: '',
    packerName: '',
    carName: '',
    carNumber: '',
    carValue: '',
    fromLocation: '',
    toLocation: '',
    pincode: ''
  });

  // Dynamically load html2pdf.js
  useEffect(() => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Automatic Background Sync from Google Sheets on Mount
  useEffect(() => {
    if (GOOGLE_SHEETS_SCRIPT_URL) {
      fetch(GOOGLE_SHEETS_SCRIPT_URL)
        .then(res => res.json())
        .then(remoteData => {
          if (Array.isArray(remoteData)) {
            const reindexed = reindexPickups(remoteData);
            setPickupsList(reindexed);
            localStorage.setItem('hcc_pickups_list', JSON.stringify(reindexed));
          }
        })
        .catch(err => console.error("Auto Sheets Sync Error:", err));
    }
  }, []);

  const syncData = (newList) => {
    const reindexed = reindexPickups(newList);
    setPickupsList(reindexed);
    localStorage.setItem('hcc_pickups_list', JSON.stringify(reindexed));

    if (GOOGLE_SHEETS_SCRIPT_URL) {
      fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', data: reindexed })
      }).catch(err => console.error('Google Sheets Sync Error:', err));
    }
  };

const formatDateDisplay = (rawDate) => {
  if (!rawDate) return '-';
  
  const dateStr = String(rawDate).trim();

  // If it's an ISO string or includes time (e.g., 2026-07-23T00:00:00)
  if (dateStr.includes('T')) {
    const pureDate = dateStr.split('T')[0];
    const [y, m, d] = pureDate.split('-');
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  }

  // If it's already YYYY-MM-DD format from date input
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
  }

  // If it's already DD/MM/YYYY
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
  }

  // If it's a raw timestamp or numeric date object
  if (!isNaN(dateStr) && dateStr.length >= 10) {
    const dObj = new Date(Number(dateStr));
    if (!isNaN(dObj.getTime())) {
      const day = String(dObj.getDate()).padStart(2, '0');
      const month = String(dObj.getMonth() + 1).padStart(2, '0');
      const year = dObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  return dateStr;
};

  const reindexPickups = (list) => {
    return list.map((item, index) => ({
      ...item,
      id: index + 1
    }));
  };

  const filteredPickups = pickupsList
    .filter((item) => {
      const partyNameStr = String(item.partyName || '').toLowerCase();
      const carNumberStr = String(item.carNumber || '').toLowerCase();
      const partyNumberStr = String(item.partyNumber || '');
      const carNameStr = String(item.carName || '').toLowerCase();
      const idStr = String(item.id || '');
      const queryStr = String(searchQuery || '').toLowerCase();

      const matchesSearch = 
        partyNameStr.includes(queryStr) ||
        carNumberStr.includes(queryStr) ||
        partyNumberStr.includes(queryStr) ||
        carNameStr.includes(queryStr) ||
        idStr.includes(queryStr);

      let matchesDateRange = true;
      if (fromDate && item.pickupDate < fromDate) matchesDateRange = false;
      if (toDate && item.pickupDate > toDate) matchesDateRange = false;

      const matchesPacker = filterPacker ? String(item.packerName || '').toLowerCase().includes(filterPacker.toLowerCase()) : true;
      const matchesToStation = filterToStation ? String(item.toLocation || '') === filterToStation : true;

      return matchesSearch && matchesDateRange && matchesPacker && matchesToStation;
    })
    .sort((a, b) => sortOrder === 'latest' ? b.id - a.id : a.id - b.id);

  const handleToLocationChange = (val) => {
    const autoPin = CITY_PINCODES[val] || pickupData.pincode;
    setPickupData(prev => ({
      ...prev,
      toLocation: val,
      pincode: autoPin
    }));
  };

  const handleCreateNewPickup = () => {
    const nextId = pickupsList.length + 1;
    setPickupData({
      id: nextId,
      pickupDate: new Date().toLocaleDateString('en-CA'),
      partyName: '',
      partyNumber: '',
      packerName: '',
      carName: '',
      carNumber: '',
      carValue: '',
      fromLocation: '',
      toLocation: '',
      pincode: ''
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEditModal = () => {
    if (selectedRowId) {
      const selectedItem = pickupsList.find(p => p.id === selectedRowId);
      if (selectedItem) {
        setPickupData(selectedItem);
        setIsDrawerOpen(true);
        return;
      }
    }
    setIsSelectEditModalOpen(true);
  };

  const handleSavePickup = () => {
    const exists = pickupsList.some(p => String(p.id) === String(pickupData.id));
    let updated;
    if (exists) {
      updated = pickupsList.map(p => String(p.id) === String(pickupData.id) ? pickupData : p);
    } else {
      updated = [...pickupsList, pickupData];
    }
    syncData(updated);
    alert(`✅ Pickup Entry #${pickupData.id} Saved & Synced!`);
    setIsDrawerOpen(false);
  };

  const handleDeletePickup = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this Pickup entry? Remaining IDs will automatically re-index.")) {
      const filtered = pickupsList.filter(p => String(p.id) !== String(id));
      syncData(filtered);
      setIsDrawerOpen(false);
    }
  };

  const toggleShareSelection = (id) => {
    setSelectedShareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAllShare = () => {
    if (selectedShareIds.length === filteredPickups.length) {
      setSelectedShareIds([]);
    } else {
      setSelectedShareIds(filteredPickups.map(p => p.id));
    }
  };

  // Convert Manifest directly to PDF & Share / Download
  const handleExecuteSharePDF = async () => {
    const element = document.getElementById('manifest-pdf-container');
    
    if (window.html2pdf) {
      const opt = {
        margin:       [5, 5, 5, 5],
        filename:     `Pickup_Manifest_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      const worker = window.html2pdf().set(opt).from(element);
      
      if (navigator.canShare && navigator.canShare({ files: [new File([], 'test.pdf', { type: 'application/pdf' })] })) {
        try {
          const pdfBlob = await worker.output('blob');
          const pdfFile = new File([pdfBlob], `Pickup_Manifest_${new Date().toISOString().split('T')[0]}.pdf`, { type: 'application/pdf' });
          await navigator.share({
            title: 'Harihar Cargo Carriers - Daily Pickup Manifest',
            text: 'Please find attached the Pickup Manifest PDF.',
            files: [pdfFile]
          });
          setIsShareModalOpen(false);
          return;
        } catch (err) {
          console.log("Fallback to direct PDF download...", err);
        }
      }
      
      // Fallback: Direct File Download
      worker.save();
    } else {
      window.print();
    }
    setIsShareModalOpen(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPickups.slice(indexOfFirstItem, indexOfLastItem);

  const paddedItems = [...currentItems];
  while (paddedItems.length < itemsPerPage) {
    paddedItems.push(null);
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f1f5f9', minHeight: '100vh', position: 'relative' }}>
      
      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} className="no-print">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>🚚 Daily Pickups Manifest</h1>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Harihar Cargo Carriers • Auto Synced • Total Entries: {pickupsList.length}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setSelectedShareIds(filteredPickups.map(p => p.id)); setIsShareModalOpen(true); }} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            💬 Share / Export PDF
          </button>
          <button onClick={handleOpenEditModal} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            ✏️ Edit Entry
          </button>
          <button onClick={handleCreateNewPickup} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            + New Pickup
          </button>
        </div>
      </div>

      {/* Advanced Toolbar Filters */}
      <div className="no-print" style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="🔍 Search Party, Car No, Phone..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          style={{ flex: 1, minWidth: '180px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
          From:
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
          To:
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#f8fafc' }}>
          <option value="latest">⬇️ Order: Latest First (#3, #2...)</option>
          <option value="oldest">⬆️ Order: Oldest First (#1, #2...)</option>
        </select>

        <input 
          type="text" 
          placeholder="Filter Packer" 
          value={filterPacker} 
          onChange={e => setFilterPacker(e.target.value)} 
          style={{ width: '120px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
        />

        <select value={filterToStation} onChange={e => setFilterToStation(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
          <option value="">Filter By 'To' Station</option>
          {CITY_SUGGESTIONS.map(city => <option key={city} value={city}>{city}</option>)}
        </select>

        {(searchQuery || fromDate || toDate || filterPacker || filterToStation) && (
          <button 
            onClick={() => { setSearchQuery(''); setFromDate(''); setToDate(''); setFilterPacker(''); setFilterToStation(''); }} 
            style={{ padding: '8px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* LANDSCAPE MANIFEST SHEET CONTAINER (No Checkbox Column) */}
      <div id="manifest-pdf-container">
        <div style={{
          width: '280mm', minHeight: '190mm', margin: '0 auto', backgroundColor: '#ffffff',
          border: '2px solid #000', padding: '12px 16px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#000'
        }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>
              SUBJECT TO NAGPUR JURISDICTION ONLY
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <img src={logoLeft} alt="Logo Left" style={{ width: '90px', height: 'auto' }} />
              <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#b91c1c' }}>HARIHAR CARGO CARRIERS</h1>
                <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '11px', margin: '1px 0' }}>FLEET OWNER & TRANSPORT CONTRACTOR</div>
                <div style={{ fontSize: '10px', color: '#1e293b', fontWeight: '700' }}>Plot No.19, Shivshakti Nagar, Opp Wadi Police Station, Amravati Road Nagpur 440023</div>
                <div style={{ fontSize: '10.5px', color: '#2563eb', fontWeight: 'bold' }}>Mob: 9372693389, 7972409656</div>
              </div>
              <img src={logoRight} alt="Logo Right" style={{ width: '95px', height: 'auto' }} />
            </div>

            {/* Bar */}
            <div style={{ color:'white', border: '1.5px solid #000', display: 'flex', justifyContent: 'center', padding: '5px 10px', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', backgroundColor: '#ff0000' }}>
              <div>Pickup Details</div>

            </div>

            {/* Grid Table */}
            <div style={{ border: '1.5px solid #000', flex: 1, display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '45px 95px 1.4fr 110px 1.4fr 110px 90px 95px 95px 85px 1.1fr', borderBottom: '1.5px solid #000', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff', height: '32px', alignItems: 'center' }}>
                <div style={{ borderRight: '1.5px solid #000' }}>ID</div>
                <div style={{ borderRight: '1.5px solid #000' }}>DATE</div>
                <div style={{ borderRight: '1.5px solid #000' }}>PARTY NAME</div>
                <div style={{ borderRight: '1.5px solid #000' }}>PARTY NO.</div>
                <div style={{ borderRight: '1.5px solid #000' }}>CAR NAME</div>
                <div style={{ borderRight: '1.5px solid #000' }}>CAR NO.</div>
                <div style={{ borderRight: '1.5px solid #000' }}>VALUE (₹)</div>
                <div style={{ borderRight: '1.5px solid #000' }}>FROM</div>
                <div style={{ borderRight: '1.5px solid #000' }}>TO</div>
                <div style={{ borderRight: '1.5px solid #000' }}>PINCODE</div>
                <div>PACKER</div>
              </div>

              {/* Table Body */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {paddedItems.map((item, idx) => {
                  if (!item) {
                    return (
                      <div 
                        key={`empty-${idx}`} 
                        style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '45px 95px 1.4fr 110px 1.4fr 110px 90px 95px 95px 85px 1.1fr', 
                          borderBottom: idx === paddedItems.length - 1 ? 'none' : '1px solid #000', 
                          height: '32px',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ borderRight: '1.5px solid #000', height: '100%' }}></div>
                        <div style={{ height: '100%' }}></div>
                      </div>
                    );
                  }

                  const isSelected = selectedRowId === item.id;

                  return (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedRowId(item.id)}
                      onDoubleClick={() => { setPickupData(item); setIsDrawerOpen(true); }}
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '45px 95px 1.4fr 110px 1.4fr 110px 90px 95px 95px 85px 1.1fr', 
                        borderBottom: idx === paddedItems.length - 1 ? 'none' : '1px solid #000', 
                        fontSize: '10.5px', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        alignItems: 'center',
                        height: '32px',
                        backgroundColor: isSelected ? '#dbeafe' : 'transparent'
                      }}
                    >
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold', color: '#b91c1c', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>#{item.id}</div>
                      <div style={{ borderRight: '1.5px solid #000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{formatDateDisplay(item.pickupDate)}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold', padding: '0 4px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.partyName || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.partyNumber || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold', padding: '0 4px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.carName || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', textTransform: 'uppercase', fontWeight: 'bold', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.carNumber || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.carValue ? `₹${item.carValue}` : '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.fromLocation || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.toLocation || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.pincode || '-'}</div>
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.packerName || '-'}</div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Signature Block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}></div>
            <div style={{ textAlign: 'center', position: 'relative', width: '220px' }}>
              <img src={signImg} alt="Signature" style={{ width: '90px', position: 'absolute', right: '45px', bottom: '15px', mixBlendMode: 'multiply' }} />
              <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#b91c1c', marginBottom: '35px' }}>FOR HARIHAR CARGO CARRIERS</div>
              <div style={{ borderTop: '1.5px solid #000', paddingTop: '2px', fontSize: '9px', fontWeight: 'bold' }}>Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', maxWidth: '280mm', margin: '16px auto 0 auto' }}>
        <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
          Showing {filteredPickups.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredPickups.length)} of {filteredPickups.length} Pickups
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#e2e8f0' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 700 }}
          >
            ◀ Previous
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#e2e8f0' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 700 }}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* Share / PDF Export Selection Modal */}
      {isShareModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="no-print">
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '440px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800 }}>💬 Select Entries to Share / Export PDF</h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '12px' }}>
              Choose specific entries or export all to send via WhatsApp and other apps.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <button onClick={toggleSelectAllShare} style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                {selectedShareIds.length === filteredPickups.length ? 'Deselect All' : 'Select All Entries'}
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb' }}>
                {selectedShareIds.length} of {filteredPickups.length} Selected
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '6px', marginBottom: '16px' }}>
              {filteredPickups.map(item => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '4px', backgroundColor: selectedShareIds.includes(item.id) ? '#dbeafe' : '#f8fafc', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={selectedShareIds.includes(item.id)} onChange={() => toggleShareSelection(item.id)} />
                  <strong>#{item.id}</strong> - {item.partyName || 'No Party Name'} ({item.carName} {item.carNumber})
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleExecuteSharePDF} style={{ flex: 1, padding: '12px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                📲 Send / Download PDF
              </button>
              <button onClick={() => setIsShareModalOpen(false)} style={{ padding: '12px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Selector Modal */}
      {isSelectEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="no-print">
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', width: '380px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 800 }}>Which Entry Do You Want to Edit?</h3>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {pickupsList.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => { setPickupData(item); setIsSelectEditModalOpen(false); setIsDrawerOpen(true); }}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: '#f8fafc' }}
                >
                  <strong>#{item.id}</strong> - {item.partyName || 'No Name'} ({item.carName} {item.carNumber})
                </div>
              ))}
            </div>
            <button onClick={() => setIsSelectEditModalOpen(false)} style={{ padding: '8px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Side Drawer */}
      {isDrawerOpen && (
        <div onClick={() => setIsDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 998 }} className="no-print" />
      )}

      <div className="no-print" style={{
        position: 'fixed', top: 0, right: isDrawerOpen ? 0 : '-460px', width: '420px', height: '100vh',
        backgroundColor: '#fff', boxShadow: '-4px 0 25px rgba(0,0,0,0.15)', zIndex: 999, transition: 'right 0.3s ease',
        display: 'flex', flexDirection: 'column', padding: '20px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800 }}>Edit Pickup Details</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Entry ID: 
              <input type="text" disabled value={pickupData.id} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f1f5f9' }} />
            </label>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Pickup Date: 
              <input type="date" value={pickupData.pickupDate} onChange={e => setPickupData({...pickupData, pickupDate: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
          </div>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Party Name: 
            <input type="text" value={pickupData.partyName} onChange={e => setPickupData({...pickupData, partyName: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Party Phone Number: 
            <input type="text" value={pickupData.partyNumber} onChange={e => setPickupData({...pickupData, partyNumber: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Car Name: 
              <input 
                list="car-suggestions-list"
                type="text" 
                placeholder="Select or Type" 
                value={pickupData.carName} 
                onChange={e => setPickupData({...pickupData, carName: e.target.value})} 
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
              <datalist id="car-suggestions-list">
                {CAR_SUGGESTIONS.map(car => <option key={car} value={car} />)}
              </datalist>
            </label>

            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Car Number: 
              <input 
                type="text" 
                placeholder="e.g. MH 31 AB 1234" 
                value={pickupData.carNumber} 
                onChange={e => setPickupData({...pickupData, carNumber: e.target.value})} 
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
            </label>
          </div>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Car Declared Value (₹): 
            <input type="text" placeholder="e.g. 500000" value={pickupData.carValue} onChange={e => setPickupData({...pickupData, carValue: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              From Location:
              <input 
                list="from-cities-list" 
                value={pickupData.fromLocation} 
                onChange={e => setPickupData({...pickupData, fromLocation: e.target.value})} 
                placeholder="Select or Type"
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
              <datalist id="from-cities-list">
                {CITY_SUGGESTIONS.map(city => <option key={city} value={city} />)}
              </datalist>
            </label>

            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              To Location:
              <input 
                list="to-cities-list" 
                value={pickupData.toLocation} 
                onChange={e => handleToLocationChange(e.target.value)} 
                placeholder="Select or Type"
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
              <datalist id="to-cities-list">
                {CITY_SUGGESTIONS.map(city => <option key={city} value={city} />)}
              </datalist>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Pincode (Auto-filled): 
              <input type="text" value={pickupData.pincode} onChange={e => setPickupData({...pickupData, pincode: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f8fafc' }} />
            </label>

            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Packer Name: 
              <input type="text" value={pickupData.packerName} onChange={e => setPickupData({...pickupData, packerName: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
          </div>

          {pickupsList.some(p => String(p.id) === String(pickupData.id)) && (
            <button 
              onClick={(e) => handleDeletePickup(pickupData.id, e)}
              style={{ padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}
            >
              🗑️ Delete & Re-index Remaining
            </button>
          )}

        </div>

        <button onClick={handleSavePickup} style={{ padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, marginTop: '10px', cursor: 'pointer' }}>
          💾 Save & Sync Pickup Entry
        </button>
      </div>

    </div>
  );
}