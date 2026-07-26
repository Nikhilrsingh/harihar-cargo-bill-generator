 import React, { useState, useEffect } from 'react';

import logoLeft from '../../assets/logo-left.png';
import logoRight from '../../assets/right-logo.png';
import signImg from '../../assets/sign.png';

import { CITY_DATA, MASTER_CITIES, MASTER_CARS, getMRUItems, recordMRUItem } from '../../utils/constants';
import { getCompanyStampDataURL } from '../../utils/stampGenerator';
import { SearchableDropdown, Toast } from '../../components/CommonUI';

const LOADING_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx3wKMgn66nnIYT6DmvU8g-xcctE5_2HmNCQjap-0Vox55DAm_1QihPTsCQif8NZi2gZw/exec";

export default function Loading() {
  const stampImg = getCompanyStampDataURL();

  const [loadingList, setLoadingList] = useState(() => {
    const saved = localStorage.getItem('hcc_loading_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [expandedLoadingId, setExpandedLoadingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareLoading, setActiveShareLoading] = useState(null);
  const [selectedCarIndices, setSelectedCarIndices] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const [deleteModalId, setDeleteModalId] = useState(null);

  const [cityOptions, setCityOptions] = useState([]);
  const [carOptions, setCarOptions] = useState([]);

  const [trailerData, setTrailerData] = useState({
    loadingId: '',
    loadingDate: new Date().toLocaleDateString('en-CA'),
    trailerNo: '',
    transportName: 'TRANS INDIA',
    driverMobile: '',
    cars: [
      { carName: '', carNumber: '', partyName: '', partyNumber: '', packerName: '', fromLocation: 'NAGPUR', toLocation: '', pincode: '440023 (MAHARASHTRA)', carValue: '' }
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
        if (parts[0].length === 4) {
          return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
        }
        return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
      }
    }

    if (!isNaN(str) && str.length >= 10) {
      const dObj = new Date(Number(str));
      if (!isNaN(dObj.getTime())) {
        const d = String(dObj.getDate()).padStart(2, '0');
        const m = String(dObj.getMonth() + 1).padStart(2, '0');
        const y = dObj.getFullYear();
        return `${d}-${m}-${y}`;
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
    if (!LOADING_SHEETS_SCRIPT_URL) return;
    fetch(LOADING_SHEETS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync', data: dataToSync })
    }).catch(err => console.error('Silent sync failed:', err));
  };

  useEffect(() => {
    setCityOptions(getMRUItems('mru_cities', MASTER_CITIES));
    setCarOptions(getMRUItems('mru_cars', MASTER_CARS));

    if (LOADING_SHEETS_SCRIPT_URL) {
      fetch(LOADING_SHEETS_SCRIPT_URL)
        .then(res => res.json())
        .then(remoteData => {
          if (Array.isArray(remoteData)) {
            setLoadingList(remoteData);
            localStorage.setItem('hcc_loading_list', JSON.stringify(remoteData));
          }
        })
        .catch(err => console.error("Auto fetch error:", err));
    }
  }, []);

  const updateStateAndSync = (newList) => {
    setLoadingList(newList);
    localStorage.setItem('hcc_loading_list', JSON.stringify(newList));
    syncWithSheetSilent(newList);
  };

  const generateLoadingId = () => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = String(today.getFullYear()).slice(-2);
    const count = String(loadingList.length + 1).padStart(3, '0');
    return `HCC-${d}${m}${y}-${count}`;
  };

  const handleOpenNewLoading = () => {
    setTrailerData({
      loadingId: generateLoadingId(),
      loadingDate: new Date().toLocaleDateString('en-CA'),
      trailerNo: '',
      transportName: 'TRANS INDIA',
      driverMobile: '',
      cars: [
        { carName: '', carNumber: '', partyName: '', partyNumber: '', packerName: '', fromLocation: 'NAGPUR', toLocation: '', pincode: '', carValue: '' }
      ]
    });
    setIsDrawerOpen(true);
  };

  const handleAddCarSlot = () => {
    setTrailerData(prev => ({
      ...prev,
      cars: [
        ...prev.cars,
        { carName: '', carNumber: '', partyName: '', partyNumber: '', packerName: '', fromLocation: 'NAGPUR', toLocation: '', pincode: '', carValue: '' }
      ]
    }));
  };

  const handleRemoveCarSlot = (index) => {
    if (trailerData.cars.length === 1) {
      showToast("At least 1 car must be loaded.", "error");
      return;
    }
    setTrailerData(prev => ({
      ...prev,
      cars: prev.cars.filter((_, idx) => idx !== index)
    }));
  };

  const handleCarChange = (index, field, value) => {
    const upperVal = typeof value === 'string' ? value.toUpperCase() : value;
    setTrailerData(prev => {
      const updatedCars = [...prev.cars];
      updatedCars[index][field] = upperVal;

      if (field === 'toLocation') {
        const cityKey = Object.keys(CITY_DATA).find(c => c.toUpperCase() === upperVal);
        if (cityKey && CITY_DATA[cityKey]) {
          const info = CITY_DATA[cityKey];
          updatedCars[index].pincode = `${info.pincode} (${info.state.toUpperCase()})`;
        }
      }
      return { ...prev, cars: updatedCars };
    });
  };

  const handleSaveLoading = () => {
    trailerData.cars.forEach(car => {
      if (car.carName) recordMRUItem('mru_cars', car.carName);
      if (car.toLocation) recordMRUItem('mru_cities', car.toLocation);
      if (car.fromLocation) recordMRUItem('mru_cities', car.fromLocation);
    });

    setCityOptions(getMRUItems('mru_cities', MASTER_CITIES));
    setCarOptions(getMRUItems('mru_cars', MASTER_CARS));

    const exists = loadingList.some(l => l.loadingId === trailerData.loadingId);
    let updated;
    if (exists) {
      updated = loadingList.map(l => l.loadingId === trailerData.loadingId ? trailerData : l);
    } else {
      updated = [trailerData, ...loadingList];
    }

    updateStateAndSync(updated);
    showToast(`Saved Loading Manifest for Trailer ${trailerData.trailerNo}`);
    setIsDrawerOpen(false);
  };

  const confirmDeleteManifest = () => {
    if (!deleteModalId) return;
    const updated = loadingList.filter(l => l.loadingId !== deleteModalId);
    updateStateAndSync(updated);
    showToast(`Manifest deleted`, 'info');
    setDeleteModalId(null);
  };

  const handleOpenShareModal = (loadingItem) => {
    setActiveShareLoading(loadingItem);
    setSelectedCarIndices(loadingItem.cars.map((_, idx) => idx));
    setIsShareModalOpen(true);
  };

  const toggleCarShareSelection = (idx) => {
    setSelectedCarIndices(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const processPDF = async (actionType) => {
    if (selectedCarIndices.length === 0) {
      showToast("Select at least one car", "error");
      return;
    }

    const element = document.getElementById('loading-manifest-pdf');
    if (!element || !window.html2pdf) {
      window.print();
      setIsShareModalOpen(false);
      return;
    }

    const formattedDate = formatDateDisplay(activeShareLoading.loadingDate);
    const transporter = activeShareLoading.transportName || 'Transporter';
    const trailerNo = activeShareLoading.trailerNo || 'Trailer';
    const totalCarsCount = selectedCarIndices.length;

    const dynamicFileName = `${formattedDate} ${transporter} ${trailerNo} Total Car=${totalCarsCount}.pdf`;

    const opt = {
      margin: [4, 4, 4, 4],
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
            title: `Harihar Cargo Loading - ${trailerNo}`,
            text: `Loading details for Trailer ${trailerNo}`,
            files: [pdfFile]
          });
          showToast("Share menu opened!");
        } else {
          await worker.save();
          showToast("Sharing not supported on this browser. Downloaded PDF instead.");
        }
      } else {
        await worker.save();
        showToast("PDF Downloaded successfully!");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("PDF action error:", err);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            🚛 TRAILER LOADING MANIFESTS
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
            HARIHAR CARGO CARRIERS • MULTI-CAR RELATIONAL SYSTEM
          </p>
        </div>
        <button onClick={handleOpenNewLoading} style={{ backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(185,28,28,0.25)' }}>
          + NEW TRAILER LOADING
        </button>
      </div>

      {/* Main Table View */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#b91c1c', color: '#fff', fontWeight: '800', letterSpacing: '0.05em' }}>
              <th style={{ padding: '16px' }}>DATE</th>
              <th style={{ padding: '16px' }}>TRAILER NO.</th>
              <th style={{ padding: '16px' }}>TRANSPORTER</th>
              <th style={{ padding: '16px' }}>DRIVER NO.</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>LOADED CARS</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loadingList.length > 0 ? (
              loadingList.map((item) => {
                const isExpanded = expandedLoadingId === item.loadingId;
                return (
                  <React.Fragment key={item.loadingId}>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: isExpanded ? '#fef2f2' : '#fff' }}>
                      <td style={{ padding: '16px', fontWeight: '800', color: '#b91c1c' }}>{formatDateDisplay(item.loadingDate)}</td>
                      <td style={{ padding: '16px', fontWeight: '900', color: '#0f172a' }}>{item.trailerNo || '-'}</td>
                      <td style={{ padding: '16px', textTransform: 'uppercase', fontWeight: '700' }}>{item.transportName || '-'}</td>
                      <td style={{ padding: '16px', fontWeight: '600' }}>{item.driverMobile || '-'}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => setExpandedLoadingId(isExpanded ? null : item.loadingId)}
                          style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 14px', borderRadius: '20px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          🚘 {item.cars ? item.cars.length : 0} Cars {isExpanded ? '▲ Hide' : '▼ View'}
                        </button>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => handleOpenShareModal(item)} style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', marginRight: '6px' }}>
                          💬 SHARE
                        </button>
                        <button onClick={() => { setTrailerData(item); setIsDrawerOpen(true); }} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', marginRight: '6px' }}>
                          ✏️ EDIT
                        </button>
                        <button onClick={() => setDeleteModalId(item.loadingId)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>
                          🗑️ DELETE
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Car Table */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="6" style={{ backgroundColor: '#f1f5f9', padding: '16px 28px' }}>
                          <div style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: '800' }}>
                              CARS LOADED IN TRAILER {item.trailerNo}:
                            </h4>
                            <table style={{ width: '100%', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#e2e8f0', textAlign: 'center', fontWeight: '800', color: '#334155' }}>
                                  <th style={{ padding: '8px' }}>#</th>
                                  <th style={{ padding: '8px' }}>CAR NAME & NO.</th>
                                  <th style={{ padding: '8px' }}>PARTY DETAILS</th>
                                  <th style={{ padding: '8px' }}>ROUTE (FROM → TO)</th>
                                  <th style={{ padding: '8px' }}>PINCODE & STATE</th>
                                  <th style={{ padding: '8px' }}>VALUE (₹)</th>
                                  <th style={{ padding: '8px' }}>PACKER NAME</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.cars && item.cars.map((car, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                                    <td style={{ padding: '8px', fontWeight: '800' }}>#{idx + 1}</td>
                                    <td style={{ padding: '8px', fontWeight: '800', textTransform: 'uppercase' }}>{car.carName} ({car.carNumber})</td>
                                    <td style={{ padding: '8px', textTransform: 'uppercase' }}>{car.partyName || '-'} ({car.partyNumber || '-'})</td>
                                    <td style={{ padding: '8px', fontWeight: '700', textTransform: 'uppercase' }}>{car.fromLocation} → {car.toLocation}</td>
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
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontWeight: '700' }}>
                  No trailer loadings recorded yet. Click "+ NEW TRAILER LOADING" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Delete Manifest?</h3>
            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem' }}>
              Are you sure you want to delete this trailer loading entry? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={confirmDeleteManifest} style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                YES, DELETE
              </button>
              <button onClick={() => setDeleteModalId(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && activeShareLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '520px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 900 }}>💬 Select Cars for PDF Manifest</h3>
            <p style={{ margin: '0 0 14px 0', color: '#64748b', fontSize: '0.88rem' }}>
              Trailer: <strong>{activeShareLoading.trailerNo}</strong>
            </p>

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeShareLoading.cars.map((car, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '6px', backgroundColor: selectedCarIndices.includes(idx) ? '#fef2f2' : '#f8fafc', border: selectedCarIndices.includes(idx) ? '1px solid #fca5a5' : '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={selectedCarIndices.includes(idx)} onChange={() => toggleCarShareSelection(idx)} />
                  <div style={{ flex: 1, textTransform: 'uppercase' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>CAR #{idx + 1}: {car.carName} ({car.carNumber}) → {car.toLocation}</div>
                    <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700, marginTop: '2px' }}>PACKER: {car.packerName || '-'}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => processPDF('share')} style={{ flex: 1, padding: '12px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  📲 SHARE TO APPS
                </button>
                <button onClick={() => processPDF('download')} style={{ flex: 1, padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  📥 DOWNLOAD PDF
                </button>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} style={{ width: '100%', padding: '10px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Container for PDF Rendering */}
      {activeShareLoading && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div id="loading-manifest-pdf" style={{ width: '280mm', minHeight: '190mm', padding: '12px 16px', backgroundColor: '#fff', fontFamily: 'Arial, sans-serif', color: '#000', border: '2px solid #000', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>
                SUBJECT TO NAGPUR JURISDICTION ONLY
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <img src={logoLeft} alt="Logo" style={{ width: '90px' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#b91c1c' }}>HARIHAR CARGO CARRIERS</h1>
                  <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '11px' }}>FLEET OWNER & TRANSPORT CONTRACTOR</div>
                  <div style={{ fontSize: '10px', fontWeight: '700' }}>Plot No.19, Shivshakti Nagar, Opp Wadi Police Station, Amravati Road Nagpur 440023</div>
                  <div style={{ fontSize: '10.5px', color: '#2563eb', fontWeight: 'bold' }}>Mob: 9372693389, 7972409656</div>
                </div>
                <img src={logoRight} alt="Logo" style={{ width: '95px' }} />
              </div>

              {/* Header Info Block */}
              <div style={{ border: '1.5px solid #000', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr 1fr' }}>
                <div>DATE: {formatDateDisplay(activeShareLoading.loadingDate)}</div>
                <div>TRAILER NO.: <span style={{ color: '#b91c1c' }}>{activeShareLoading.trailerNo}</span></div>
                <div>TRANSPORTER: {activeShareLoading.transportName}</div>
                <div>DRIVER NO.: {activeShareLoading.driverMobile}</div>
              </div>

              {/* Cars Grid */}
              <div style={{ border: '1.5px solid #000' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '40px 1.2fr 110px 1.2fr 110px 85px 85px 80px 1fr', borderBottom: '1.5px solid #000', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff', height: '28px', alignItems: 'center' }}>
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

                {activeShareLoading.cars
                  .filter((_, idx) => selectedCarIndices.includes(idx))
                  .map((car, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '40px 1.2fr 110px 1.2fr 110px 85px 85px 80px 1fr', borderBottom: '1px solid #000', fontSize: '10px', textAlign: 'center', height: '28px', alignItems: 'center', textTransform: 'uppercase' }}>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold' }}>#{idx + 1}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold' }}>{car.carName}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.carNumber || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.partyName || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.partyNumber || '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000', fontWeight: 'bold' }}>{car.carValue ? `₹${car.carValue}` : '-'}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.fromLocation}</div>
                      <div style={{ borderRight: '1.5px solid #000' }}>{car.toLocation}</div>
                      <div>{car.packerName || '-'}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* Signature & Stamp Area */}
<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: '12px' }}>
  <div style={{ textAlign: 'center', position: 'relative', width: '270px', minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    
    {/* Company Header */}
    <div style={{ 
      fontSize: '11px', 
      fontWeight: '900', 
      color: '#b91c1c', 
      letterSpacing: '0.02em',
      position: 'relative',
      zIndex: 1
    }}>
      FOR HARIHAR CARGO CARRIERS
    </div>

    {/* Blue Rubber Stamp Layer (Centered and Layered On Top) */}
    <img 
      src={stampImg} 
      alt="Stamp" 
      style={{ 
        width: '160px', 
        position: 'absolute', 
        left: '50%',
        top: '18px',
        transform: 'translateX(-50%)',
        mixBlendMode: 'multiply', 
        opacity: 0.92, 
        zIndex: 999 
      }} 
    />

    {/* Hand Signature Overlay */}
    <img 
      src={signImg} 
      alt="Signature" 
      style={{ 
        width: '110px', 
        position: 'absolute', 
        right: '85px', 
        bottom: '42px', 
        mixBlendMode: 'multiply', 
        zIndex: 3 
      }} 
    />

    {/* Authorized Signatory Base Line */}
    <div style={{ 
      borderTop: '1.5px solid #000', 
      paddingTop: '4px', 
      fontSize: '9.5px', 
      fontWeight: 'bold', 
      position: 'relative', 
      zIndex: 1,
      marginTop: '70px'
    }}>
      Authorized Signatory
    </div>

  </div>
</div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <div onClick={() => setIsDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }} />
      )}

      <div style={{
        position: 'fixed', top: 0, right: isDrawerOpen ? 0 : '-580px', width: '540px', height: '100vh',
        backgroundColor: '#fff', boxShadow: '-4px 0 25px rgba(0,0,0,0.2)', zIndex: 999, transition: 'right 0.3s ease',
        display: 'flex', flexDirection: 'column', padding: '24px', boxSizing: 'border-box'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.3rem', fontWeight: 900 }}>Trailer Loading Form</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800' }}>Trailer Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                LOADING DATE:
                <input type="date" value={trailerData.loadingDate} onChange={e => setTrailerData({...trailerData, loadingDate: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                TRAILER NO:
                <input type="text" placeholder="NL01AB3252" value={trailerData.trailerNo} onChange={e => setTrailerData({...trailerData, trailerNo: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }} />
              </label>
              <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                TRANSPORTER:
                <input type="text" value={trailerData.transportName} onChange={e => setTrailerData({...trailerData, transportName: e.target.value.toUpperCase()})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }} />
              </label>
              <label style={{ fontSize: '0.78rem', fontWeight: 800 }}>
                DRIVER NO.:
                <input type="text" value={trailerData.driverMobile} onChange={e => setTrailerData({...trailerData, driverMobile: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#0f172a' }}>LOADED CARS ({trailerData.cars.length})</h4>
            <button onClick={handleAddCarSlot} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}>
              + ADD ANOTHER CAR
            </button>
          </div>

          {trailerData.cars.map((car, idx) => (
            <div key={idx} style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#b91c1c' }}>🚘 CAR #{idx + 1}</span>
                {trailerData.cars.length > 1 && (
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

        <button onClick={handleSaveLoading} style={{ padding: '14px', backgroundColor: '#b91c1c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 900, marginTop: '12px', cursor: 'pointer', fontSize: '0.95rem' }}>
          💾 SAVE & INSTANT SYNC MANIFEST
        </button>
      </div>

    </div>
  );
}