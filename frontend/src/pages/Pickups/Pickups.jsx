import React, { useState, useEffect } from 'react';

// Assets
import logoLeft from '../../assets/logo-left.png';
import logoRight from '../../assets/right-logo.png';

// Components & Constants
import SignatureStampBlock from '../../components/SignatureStampBlock';
import { SearchableDropdown, Toast } from '../../components/CommonUI';
import { CITY_DATA, MASTER_CITIES, MASTER_CARS, getMRUItems, recordMRUItem } from '../../utils/constants';

const PICKUP_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylTveh70crB2cvXQxCpgGc8x1aX6V0Qf9X9lwl31cc19XkDN1KsnvnGl_QtrrRXClk/exec"; 

export default function Pickups() {
  const [pickupsList, setPickupsList] = useState(() => {
    try {
      const saved = localStorage.getItem('hcc_pickups_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [expandedPickupId, setExpandedPickupId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeSharePickup, setActiveSharePickup] = useState(null);
  const [selectedCarIndices, setSelectedCarIndices] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteModalId, setDeleteModalId] = useState(null);

  // Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterPacker, setFilterPacker] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [cityOptions, setCityOptions] = useState([]);
  const [carOptions, setCarOptions] = useState([]);

  const [pickupBatchData, setPickupBatchData] = useState({
    pickupId: '',
    pickupDate: new Date().toLocaleDateString('en-CA'),
    whoPicked: '',
    cars: [
      { partyName: '', partyNumber: '', carName: '', carNumber: '', carValue: '', fromLocation: 'NAGPUR', toLocation: '', pincode: '', packerName: '' }
    ]
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const formatDateDisplay = (rawDate) => {
    if (!rawDate) return '-';
    const str = String(rawDate).trim();
    if (str.includes('T')) {
      const pure = str.split('T')[0];
      const [y, m, d] = pure.split('-');
      return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
    }
    if (str.includes('-')) {
      const parts = str.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
        return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
      }
    }
    return str;
  };

  useEffect(() => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const syncWithSheetSilent = (dataToSync) => {
    if (!PICKUP_SHEETS_SCRIPT_URL) return;
    fetch(PICKUP_SHEETS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync', data: dataToSync })
    }).catch(err => console.error('Silent sync failed:', err));
  };

  useEffect(() => {
    setCityOptions(getMRUItems('mru_cities', MASTER_CITIES));
    setCarOptions(getMRUItems('mru_cars', MASTER_CARS));

    if (PICKUP_SHEETS_SCRIPT_URL) {
      fetch(PICKUP_SHEETS_SCRIPT_URL)
        .then(res => res.json())
        .then(remoteData => {
          if (Array.isArray(remoteData)) {
            setPickupsList(prevList => {
              const remoteMap = new Map(remoteData.map(item => [item.pickupId, { ...item, cars: Array.isArray(item.cars) ? item.cars : [] }]));
              prevList.forEach(localItem => {
                if (localItem.pickupId && !remoteMap.has(localItem.pickupId)) {
                  remoteMap.set(localItem.pickupId, localItem);
                }
              });
              const merged = Array.from(remoteMap.values());
              localStorage.setItem('hcc_pickups_list', JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(err => console.error("Auto fetch error:", err));
    }
  }, []);

  const updateStateAndSync = (newList) => {
    setPickupsList(newList);
    localStorage.setItem('hcc_pickups_list', JSON.stringify(newList));
    syncWithSheetSilent(newList);
  };

  // Gap-Filling Sequential ID Generator: HCC-PickUp-ddmmyy-01
  const generateSequentialPickupId = (rawDateStr) => {
    const dObj = rawDateStr ? new Date(rawDateStr) : new Date();
    const d = String(dObj.getDate()).padStart(2, '0');
    const m = String(dObj.getMonth() + 1).padStart(2, '0');
    const y = String(dObj.getFullYear()).slice(-2);
    const dateCode = `${d}${m}${y}`;
    const prefix = `HCC-PickUp-${dateCode}-`;

    const existingNums = (pickupsList || [])
      .map(item => item.pickupId || '')
      .filter(id => id.startsWith(prefix))
      .map(id => parseInt(id.replace(prefix, ''), 10))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    let nextNum = 1;
    for (let i = 0; i < existingNums.length; i++) {
      if (existingNums[i] === nextNum) {
        nextNum++;
      } else if (existingNums[i] > nextNum) {
        break; 
      }
    }

    return `${prefix}${String(nextNum).padStart(2, '0')}`;
  };

  const filteredPickups = (pickupsList || [])
    .filter((item) => {
      if (!item) return false;
      const pickupIdStr = String(item.pickupId || '').toLowerCase();
      const whoPickedStr = String(item.whoPicked || '').toLowerCase();
      const queryStr = String(searchQuery || '').toLowerCase();

      const carMatch = Array.isArray(item.cars) && item.cars.some(car => 
        String(car.carName || '').toLowerCase().includes(queryStr) ||
        String(car.carNumber || '').toLowerCase().includes(queryStr) ||
        String(car.partyName || '').toLowerCase().includes(queryStr) ||
        String(car.partyNumber || '').includes(queryStr) ||
        String(car.packerName || '').toLowerCase().includes(queryStr)
      );

      const matchesSearch = pickupIdStr.includes(queryStr) || whoPickedStr.includes(queryStr) || carMatch;

      let matchesDateRange = true;
      if (fromDate && item.pickupDate < fromDate) matchesDateRange = false;
      if (toDate && item.pickupDate > toDate) matchesDateRange = false;

      const matchesPacker = filterPacker ? Array.isArray(item.cars) && item.cars.some(c => String(c.packerName || '').toLowerCase().includes(filterPacker.toLowerCase())) : true;

      return matchesSearch && matchesDateRange && matchesPacker;
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') return new Date(b.pickupDate || 0) - new Date(a.pickupDate || 0);
      return new Date(a.pickupDate || 0) - new Date(b.pickupDate || 0);
    });

  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage) || 1;
  const currentItems = filteredPickups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenNewPickup = () => {
    const today = new Date().toLocaleDateString('en-CA');
    setPickupBatchData({
      pickupId: generateSequentialPickupId(today),
      pickupDate: today,
      whoPicked: '',
      cars: [
        { partyName: '', partyNumber: '', carName: '', carNumber: '', carValue: '', fromLocation: 'NAGPUR', toLocation: '', pincode: '', packerName: '' }
      ]
    });
    setIsDrawerOpen(true);
  };

  const handleAddCarSlot = () => {
    setPickupBatchData(prev => ({
      ...prev,
      cars: [
        ...(prev.cars || []),
        { partyName: '', partyNumber: '', carName: '', carNumber: '', carValue: '', fromLocation: 'NAGPUR', toLocation: '', pincode: '', packerName: '' }
      ]
    }));
  };

  const handleRemoveCarSlot = (index) => {
    if (!pickupBatchData.cars || pickupBatchData.cars.length <= 1) {
      showToast("At least 1 vehicle required per pickup batch.", "error");
      return;
    }
    setPickupBatchData(prev => ({
      ...prev,
      cars: prev.cars.filter((_, idx) => idx !== index)
    }));
  };

  const handleCarChange = (index, field, value) => {
    const upperVal = typeof value === 'string' ? value.toUpperCase() : value;
    setPickupBatchData(prev => {
      const updatedCars = [...(prev.cars || [])];
      if (updatedCars[index]) {
        updatedCars[index][field] = upperVal;

        if (field === 'toLocation') {
          const cityKey = Object.keys(CITY_DATA).find(c => c.toUpperCase() === upperVal);
          if (cityKey && CITY_DATA[cityKey]) {
            const info = CITY_DATA[cityKey];
            updatedCars[index].pincode = `${info.pincode} (${info.state.toUpperCase()})`;
          }
        }
      }
      return { ...prev, cars: updatedCars };
    });
  };

  const handleSavePickup = () => {
    const finalData = {
      ...pickupBatchData,
      pickupId: pickupBatchData.pickupId || generateSequentialPickupId(pickupBatchData.pickupDate),
      cars: Array.isArray(pickupBatchData.cars) ? pickupBatchData.cars : []
    };

    finalData.cars.forEach(car => {
      if (car.carName) recordMRUItem('mru_cars', car.carName);
      if (car.toLocation) recordMRUItem('mru_cities', car.toLocation);
      if (car.fromLocation) recordMRUItem('mru_cities', car.fromLocation);
    });

    setCityOptions(getMRUItems('mru_cities', MASTER_CITIES));
    setCarOptions(getMRUItems('mru_cars', MASTER_CARS));

    const existingIndex = pickupsList.findIndex(p => p.pickupId === finalData.pickupId);
    let updated;
    if (existingIndex !== -1) {
      updated = [...pickupsList];
      updated[existingIndex] = finalData;
    } else {
      updated = [finalData, ...pickupsList];
    }

    updateStateAndSync(updated);
    showToast(`Saved Pickup Batch ${finalData.pickupId}`);
    setIsDrawerOpen(false);
  };

  const confirmDeletePickup = () => {
    if (!deleteModalId) return;
    const updated = pickupsList.filter(p => p.pickupId !== deleteModalId);
    updateStateAndSync(updated);
    showToast(`Pickup Batch deleted`, 'info');
    setDeleteModalId(null);
  };

  const handleOpenShareModal = (item) => {
    setActiveSharePickup(item);
    const carCount = item?.cars?.length || 0;
    setSelectedCarIndices(Array.from({ length: carCount }, (_, idx) => idx));
    setIsShareModalOpen(true);
  };

  const toggleCarShareSelection = (idx) => {
    setSelectedCarIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const processPDF = async (actionType) => {
    if (selectedCarIndices.length === 0) {
      showToast("Select at least one vehicle", "error");
      return;
    }

    const element = document.getElementById('pickup-manifest-pdf');
    if (!element || !window.html2pdf) {
      window.print();
      setIsShareModalOpen(false);
      return;
    }

    const formattedDate = formatDateDisplay(activeSharePickup?.pickupDate);
    const pickupId = activeSharePickup?.pickupId || 'PU-001';
    const totalCarsCount = selectedCarIndices.length;

    const dynamicFileName = `${formattedDate} Total Car = ${totalCarsCount} Pickup .pdf`;

    const opt = {
      margin: [2, 2, 2, 2],
      filename: dynamicFileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    try {
      const worker = window.html2pdf().set(opt).from(element);

      if (actionType === 'share') {
        const pdfBlob = await worker.output('blob');
        const pdfFile = new File([pdfBlob], dynamicFileName, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
          await navigator.share({
            title: `Harihar Cargo Pickup - ${pickupId}`,
            text: `Pickup details for Batch ${pickupId}`,
            files: [pdfFile]
          });
          showToast("Share menu opened!");
        } else {
          await worker.save();
          showToast("Downloaded PDF.");
        }
      } else {
        await worker.save();
        showToast("PDF Downloaded successfully!");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("PDF processing error:", err);
        showToast("Failed to process PDF", "error");
      }
    } finally {
      setIsShareModalOpen(false);
    }
  };

  return (
    <div style={{ padding: '28px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            🚚 DAILY PICKUPS MANIFEST
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            HARIHAR CARGO CARRIERS • MULTI-VEHICLE PICKUP BATCHES
          </p>
        </div>
        <button onClick={handleOpenNewPickup} style={{ backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(185,28,28,0.25)' }}>
          + NEW PICKUP BATCH
        </button>
      </div>

      {/* Toolbar Filters */}
      <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="🔍 Search Pickup ID, Who Picked, Car, Party..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
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
          <option value="latest">⬇️ Date: Latest First</option>
          <option value="oldest">⬆️ Date: Oldest First</option>
        </select>

        <input 
          type="text" 
          placeholder="Filter Packer" 
          value={filterPacker} 
          onChange={e => setFilterPacker(e.target.value)} 
          style={{ width: '130px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
        />

        {(searchQuery || fromDate || toDate || filterPacker) && (
          <button 
            onClick={() => { setSearchQuery(''); setFromDate(''); setToDate(''); setFilterPacker(''); }} 
            style={{ padding: '8px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Table View */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#b91c1c', color: '#fff', fontWeight: '800', letterSpacing: '0.05em' }}>
              <th style={{ padding: '16px' }}>PICKUP ID</th>
              <th style={{ padding: '16px' }}>PICKUP DATE</th>
              <th style={{ padding: '16px' }}>WHO PICKED?</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>PICKED VEHICLES</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, rowIdx) => {
                const uniqueRowKey = item.pickupId || `pickup-row-${rowIdx}`;
                const isExpanded = expandedPickupId === item.pickupId;
                const carList = Array.isArray(item.cars) ? item.cars : [];

                return (
                  <React.Fragment key={uniqueRowKey}>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: isExpanded ? '#fef2f2' : '#fff' }}>
                      <td style={{ padding: '16px', fontWeight: '900', color: '#0f172a' }}>{item.pickupId}</td>
                      <td style={{ padding: '16px', fontWeight: '800', color: '#b91c1c' }}>{formatDateDisplay(item.pickupDate)}</td>
                      <td style={{ padding: '16px', textTransform: 'uppercase', fontWeight: '700' }}>{item.whoPicked || '-'}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => setExpandedPickupId(isExpanded ? null : item.pickupId)}
                          style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 14px', borderRadius: '20px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          🚘 {carList.length} Cars {isExpanded ? '▲ Hide' : '▼ View'}
                        </button>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => handleOpenShareModal(item)} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', marginRight: '6px' }}>
                          💬 SHARE
                        </button>
                        <button onClick={() => { setPickupBatchData(item); setIsDrawerOpen(true); }} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', marginRight: '6px' }}>
                          ✏️ EDIT
                        </button>
                        <button onClick={() => setDeleteModalId(item.pickupId)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>
                          🗑️ DELETE
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Vehicles Sub-Table */}
                    {isExpanded && (
                      <tr key={`expanded-${uniqueRowKey}`}>
                        <td colSpan="5" style={{ backgroundColor: '#f1f5f9', padding: '16px 28px' }}>
                          <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: '800' }}>
                              VEHICLES PICKED IN BATCH {item.pickupId}:
                            </h4>
                            <table style={{ width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#e2e8f0', textAlign: 'center', fontWeight: '800', color: '#334155' }}>
                                  <th style={{ padding: '8px' }}>#</th>
                                  <th style={{ padding: '8px' }}>CAR NAME & NO.</th>
                                  <th style={{ padding: '8px' }}>PARTY DETAILS</th>
                                  <th style={{ padding: '8px' }}>ROUTE (FROM → TO)</th>
                                  <th style={{ padding: '8px' }}>PINCODE</th>
                                  <th style={{ padding: '8px' }}>VALUE (₹)</th>
                                  <th style={{ padding: '8px' }}>PACKER NAME</th>
                                </tr>
                              </thead>
                              <tbody>
                                {carList.map((car, carIdx) => (
                                  <tr key={`car-${uniqueRowKey}-${carIdx}`} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                                    <td style={{ padding: '8px', fontWeight: '800' }}>#{carIdx + 1}</td>
                                    <td style={{ padding: '8px', fontWeight: '800', textTransform: 'uppercase' }}>{car.carName || '-'} ({car.carNumber || '-'})</td>
                                    <td style={{ padding: '8px', textTransform: 'uppercase' }}>{car.partyName || '-'} ({car.partyNumber || '-'})</td>
                                    <td style={{ padding: '8px', fontWeight: '700', textTransform: 'uppercase' }}>{car.fromLocation || '-'} → {car.toLocation || '-'}</td>
                                    <td style={{ padding: '8px', fontWeight: '700', color: '#2563eb' }}>{car.pincode || '-'}</td>
                                    <td style={{ padding: '8px', fontWeight: '800' }}>{car.carValue ? `₹${car.carValue}` : '-'}</td>
                                    <td style={{ padding: '8px', textTransform: 'uppercase', fontWeight: '700', color: '#d97706' }}>{car.packerName || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontWeight: '700' }}>
                  No pickup entries found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
          Showing {filteredPickups.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredPickups.length)} of {filteredPickups.length} Pickups
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#e2e8f0' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 700 }}>◀ Previous</button>
          <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#e2e8f0' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 700 }}>Next ▶</button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900 }}>Delete Pickup Batch?</h3>
            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem' }}>Are you sure you want to delete this pickup record?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={confirmDeletePickup} style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>YES, DELETE</button>
              <button onClick={() => setDeleteModalId(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Share / PDF Modal */}
      {isShareModalOpen && activeSharePickup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '520px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 900 }}>💬 Select Vehicles for Pickup Manifest</h3>
            <p style={{ margin: '0 0 14px 0', color: '#64748b', fontSize: '0.88rem' }}>Batch: <strong>{activeSharePickup.pickupId}</strong></p>

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(activeSharePickup.cars || []).map((car, idx) => (
                <label key={`share-car-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '6px', backgroundColor: selectedCarIndices.includes(idx) ? '#fef2f2' : '#f8fafc', border: selectedCarIndices.includes(idx) ? '1px solid #fca5a5' : '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={selectedCarIndices.includes(idx)} onChange={() => toggleCarShareSelection(idx)} />
                  <div style={{ flex: 1, textTransform: 'uppercase' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>CAR #{idx + 1}: {car.carName || '-'} ({car.carNumber || '-'}) → {car.toLocation || '-'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700, marginTop: '2px' }}>PACKER: {car.packerName || '-'}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => processPDF('share')} style={{ flex: 1, padding: '12px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>📲 SHARE TO APPS</button>
                <button onClick={() => processPDF('download')} style={{ flex: 1, padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>📥 DOWNLOAD PDF</button>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} style={{ width: '100%', padding: '10px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Single-Page PDF Print Container */}
      {activeSharePickup && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div id="pickup-manifest-pdf" style={{ width: '280mm', height: '190mm', padding: '8px 12px', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif', color: '#000', border: '2px solid #000', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', marginBottom: '2px' }}>
                SUBJECT TO NAGPUR JURISDICTION ONLY
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <img src={logoLeft} alt="Logo" style={{ width: '80px' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#b91c1c' }}>HARIHAR CARGO CARRIERS</h1>
                  <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '10px' }}>FLEET OWNER & TRANSPORT CONTRACTOR</div>
                  <div style={{ fontSize: '9.5px', fontWeight: '700' }}>Plot No.19, Shivshakti Nagar, Opp Wadi Police Station, Amravati Road Nagpur 440023</div>
                  <div style={{ fontSize: '10px', color: '#2563eb', fontWeight: 'bold' }}>Mob: 9372693389, 7972409656</div>
                </div>
                <img src={logoRight} alt="Logo" style={{ width: '85px' }} />
              </div>

              {/* Header Info Block */}
              <div style={{ border: '1.5px solid #000', padding: '4px 10px', fontSize: '10px', fontWeight: 'bold', marginBottom: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div>PICKUP ID: <span style={{ color: '#b91c1c' }}>{activeSharePickup.pickupId}</span></div>
                <div>DATE: {formatDateDisplay(activeSharePickup.pickupDate)}</div>
                <div>WHO PICKED: {activeSharePickup.whoPicked || '-'}</div>
              </div>

              {/* Cars Grid */}
              <div style={{ border: '1.5px solid #000' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '35px 1.2fr 100px 1.2fr 100px 80px 80px 75px 1fr', borderBottom: '1.5px solid #000', fontSize: '9.5px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff', height: '26px', alignItems: 'center' }}>
                  <div style={{ borderRight: '1.5px solid #000' }}>SR</div>
                  <div style={{ borderRight: '1.5px solid #000' }}>CAR NAME</div>
                  <div style={{ borderRight: '1.5px solid #000' }}>CAR NO.</div>
                  <div style={{ borderRight: '1.5px solid #000' }}>PARTY NAME</div>
                  <div style={{ borderRight: '1.5px solid #000' }}>PARTY NO.</div>
                  <div style={{ borderRight: '1.5px solid #000' }}>VALUE (₹)</div>
                  <div style={{ borderRight: '1.5px solid #000' }}>FROM</div>
                  <div style={{ borderRight: '1.5px solid #000' }}>TO</div>
                  <div>PACKER NAME</div>
                </div>

                {(activeSharePickup.cars || [])
                  .filter((_, idx) => selectedCarIndices.includes(idx))
                  .map((car, idx) => (
                    <div key={`pdf-car-${idx}`} style={{ display: 'grid', gridTemplateColumns: '35px 1.2fr 100px 1.2fr 100px 80px 80px 75px 1fr', borderBottom: '1px solid #000', fontSize: '9.5px', textAlign: 'center', height: '24px', alignItems: 'center', textTransform: 'uppercase' }}>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold' }}>#{idx + 1}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold' }}>{car.carName || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.carNumber || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.partyName || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.partyNumber || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold' }}>{car.carValue ? `₹${car.carValue}` : '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.fromLocation || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.toLocation || '-'}</div>
                      <div>{car.packerName || '-'}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* Signature & Stamp Block */}
            <SignatureStampBlock />
          </div>
        </div>
      )}

      {/* Side Drawer */}
      {isDrawerOpen && (
        <div onClick={() => setIsDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }} />
      )}

      <div style={{
        position: 'fixed', top: 0, right: isDrawerOpen ? 0 : '-580px', width: '540px', height: '100vh',
        backgroundColor: '#fff', boxShadow: '-4px 0 25px rgba(0,0,0,0.2)', zIndex: 999, transition: 'right 0.3s ease',
        display: 'flex', flexDirection: 'column', padding: '24px', boxSizing: 'border-box'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', fontWeight: 900 }}>Pickup Batch Form</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800' }}>Batch Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                PICKUP DATE:
                <input 
                  type="date" 
                  value={pickupBatchData.pickupDate} 
                  onChange={e => {
                    const newDate = e.target.value;
                    setPickupBatchData({
                      ...pickupBatchData, 
                      pickupDate: newDate,
                      pickupId: generateSequentialPickupId(newDate)
                    });
                  }} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
              </label>
              <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                WHO PICKED?:
                <input type="text" placeholder="PERSON / DRIVER NAME" value={pickupBatchData.whoPicked} onChange={e => setPickupBatchData({...pickupBatchData, whoPicked: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }} />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#0f172a' }}>PICKED VEHICLES ({(pickupBatchData.cars || []).length})</h4>
            <button onClick={handleAddCarSlot} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}>
              + ADD ANOTHER VEHICLE
            </button>
          </div>

          {(pickupBatchData.cars || []).map((car, idx) => (
            <div key={`drawer-car-${idx}`} style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#b91c1c' }}>🚘 VEHICLE #{idx + 1}</span>
                {pickupBatchData.cars.length > 1 && (
                  <button onClick={() => handleRemoveCarSlot(idx)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    REMOVE
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <SearchableDropdown
                  placeholder="CAR NAME (E.G. CRETA)"
                  value={car.carName}
                  options={carOptions}
                  onChange={(val) => handleCarChange(idx, 'carName', val)}
                />

                <input 
                  type="text" 
                  placeholder="CAR NO. (MH31AB1234)" 
                  value={car.carNumber} 
                  onChange={e => handleCarChange(idx, 'carNumber', e.target.value)} 
                  style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} 
                />

                <input 
                  type="text" 
                  placeholder="PARTY NAME" 
                  value={car.partyName} 
                  onChange={e => handleCarChange(idx, 'partyName', e.target.value)} 
                  style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} 
                />

                <input 
                  type="text" 
                  placeholder="PARTY MOBILE" 
                  value={car.partyNumber} 
                  onChange={e => handleCarChange(idx, 'partyNumber', e.target.value)} 
                  style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} 
                />

                <SearchableDropdown
                  placeholder="FROM LOCATION"
                  value={car.fromLocation}
                  options={cityOptions}
                  onChange={(val) => handleCarChange(idx, 'fromLocation', val)}
                />

                <SearchableDropdown
                  placeholder="TO LOCATION"
                  value={car.toLocation}
                  options={cityOptions}
                  onChange={(val) => handleCarChange(idx, 'toLocation', val)}
                />

                <input 
                  type="text" 
                  placeholder="PINCODE (STATE)" 
                  value={car.pincode || ''} 
                  onChange={e => handleCarChange(idx, 'pincode', e.target.value)} 
                  style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f8fafc', fontWeight: 'bold' }} 
                />

                <input 
                  type="text" 
                  placeholder="CAR VALUE (₹)" 
                  value={car.carValue} 
                  onChange={e => handleCarChange(idx, 'carValue', e.target.value)} 
                  style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} 
                />

                <input 
                  type="text" 
                  placeholder="PACKER NAME" 
                  value={car.packerName} 
                  onChange={e => handleCarChange(idx, 'packerName', e.target.value)} 
                  style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', gridColumn: 'span 2', textTransform: 'uppercase' }} 
                />
              </div>
            </div>
          ))}

        </div>

        <button onClick={handleSavePickup} style={{ padding: '14px', backgroundColor: '#b91c1c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 900, marginTop: '12px', cursor: 'pointer', fontSize: '0.95rem' }}>
          💾 SAVE & INSTANT SYNC PICKUP BATCH
        </button>
      </div>

    </div>
  );
}