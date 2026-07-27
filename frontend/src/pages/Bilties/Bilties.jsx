import React, { useState, useEffect } from 'react';

// Assets
import logoLeft from '../../assets/logo-left.png';
import logoRight from '../../assets/right-logo.png';

// Components & Constants
import SignatureStampBlock from '../../components/SignatureStampBlock';
import { SearchableDropdown, Toast } from '../../components/CommonUI';
import { CITY_DATA, MASTER_CITIES, MASTER_CARS, getMRUItems, recordMRUItem } from '../../utils/constants';

const BILTY_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxEmvZRzR-OMhikfpQymuaqkakYHxZteBc30bRuQ8102TOOgSGOSihubxxW54jqPlN6kg/exec";

export default function Bilties() {
  const [biltyList, setBiltyList] = useState(() => {
    try {
      const saved = localStorage.getItem('hcc_bilties_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareBilty, setActiveShareBilty] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Global Pickup Import Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [allPickupCars, setAllPickupCars] = useState([]);
  const [importSearch, setImportSearch] = useState('');
  const [selectedGlobalCarKeys, setSelectedGlobalCarKeys] = useState([]);

  // Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [cityOptions, setCityOptions] = useState([]);
  const [carOptions, setCarOptions] = useState([]);

  // Form State
  const [biltyData, setBiltyData] = useState({
    id: Date.now(),
    lrNo: '5504',
    date: new Date().toISOString().split('T')[0],
    consignorName: '',
    consignorPhone: '',
    consignorAddress: '',
    consignorState: '',
    consignorPincode: '',
    consigneeName: '',
    consigneePhone: '',
    consigneeAddress: '',
    consigneeState: '',
    consigneePincode: '',
    fromLocation: 'NAGPUR',
    toLocation: '',
    noOfPkg: '1',
    carName: '',
    carNumber: '',
    lorryNo: 'Part Load',
    declaredValue: '',
    insuranceBy: 'By Party',
    freight: 'Fixed',
    handlingCharges: '',
    doorCollection: '',
    doorDelivery: '',
    staticalCharges: '',
    gst: '',
    total: 'To Be Billed',
    bookingType: 'TO BE BILLED',
    packerName: '',
    officialSign: 'Rajesh Singh'
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const generateNextLrNo = (currentList = biltyList) => {
    const startNum = 5504;
    const existingNums = (currentList || [])
      .map(item => parseInt(item.lrNo, 10))
      .filter(num => !isNaN(num) && num >= startNum)
      .sort((a, b) => a - b);

    let nextNum = startNum;
    for (let i = 0; i < existingNums.length; i++) {
      if (existingNums[i] === nextNum) {
        nextNum++;
      } else if (existingNums[i] > nextNum) {
        break;
      }
    }
    return String(nextNum);
  };

  const handleLrNoChange = (val) => {
    const exists = biltyList.some(item => 
      String(item.lrNo).trim() === String(val).trim() && item.id !== biltyData.id
    );
    setIsDuplicate(exists);
    setBiltyData(prev => ({ ...prev, lrNo: val }));
  };

  // Case-insensitive CITY_DATA lookup helper
  const processLocationLookup = (cityName) => {
    if (!cityName || typeof cityName !== 'string') return { state: '', pincode: '' };
    const cleanCity = cityName.trim().toUpperCase();
    if (!cleanCity || !CITY_DATA) return { state: '', pincode: '' };

    if (CITY_DATA[cleanCity]) {
      return {
        state: CITY_DATA[cleanCity].state ? String(CITY_DATA[cleanCity].state).toUpperCase() : '',
        pincode: CITY_DATA[cleanCity].pincode ? String(CITY_DATA[cleanCity].pincode) : ''
      };
    }

    const cityKey = Object.keys(CITY_DATA).find(
      key => key.trim().toUpperCase() === cleanCity
    );

    if (cityKey && CITY_DATA[cityKey]) {
      return {
        state: CITY_DATA[cityKey].state ? String(CITY_DATA[cityKey].state).toUpperCase() : '',
        pincode: CITY_DATA[cityKey].pincode ? String(CITY_DATA[cityKey].pincode) : ''
      };
    }

    return { state: '', pincode: '' };
  };

  // FROM Location Selection & Auto-fill
  const handleFromCityChange = (cityName) => {
    const uppercaseCity = typeof cityName === 'string' ? cityName.toUpperCase() : cityName;
    const { state, pincode } = processLocationLookup(uppercaseCity);
    
    setBiltyData(prev => ({
      ...prev,
      fromLocation: uppercaseCity,
      consignorAddress: uppercaseCity,
      consignorState: state,
      consignorPincode: pincode
    }));
  };

  // TO Location Selection & Auto-fill
  const handleToCityChange = (cityName) => {
    const uppercaseCity = typeof cityName === 'string' ? cityName.toUpperCase() : cityName;
    const { state, pincode } = processLocationLookup(uppercaseCity);
    
    setBiltyData(prev => ({
      ...prev,
      toLocation: uppercaseCity,
      consigneeAddress: uppercaseCity,
      consigneeState: state,
      consigneePincode: pincode
    }));
  };

  const syncWithSheetSilent = (dataToSync) => {
    if (!BILTY_SHEETS_SCRIPT_URL) return;
    fetch(BILTY_SHEETS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync', sheetName: 'Bilty Details', data: dataToSync })
    }).catch(err => console.error('Silent sync failed:', err));
  };

  useEffect(() => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
    setCityOptions(getMRUItems('mru_cities', MASTER_CITIES));
    setCarOptions(getMRUItems('mru_cars', MASTER_CARS));

    if (BILTY_SHEETS_SCRIPT_URL) {
      fetch(`${BILTY_SHEETS_SCRIPT_URL}?sheet=Bilty%20Details`)
        .then(res => res.json())
        .then(remoteData => {
          if (Array.isArray(remoteData) && remoteData.length > 0) {
            setBiltyList(prevList => {
              const remoteMap = new Map(remoteData.map(item => [item.lrNo, item]));
              prevList.forEach(localItem => {
                if (localItem.lrNo && !remoteMap.has(localItem.lrNo)) {
                  remoteMap.set(localItem.lrNo, localItem);
                }
              });
              const merged = Array.from(remoteMap.values());
              localStorage.setItem('hcc_bilties_list', JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(err => console.error("Sheets sync load error:", err));
    }
  }, []);

  const updateStateAndSync = (newList) => {
    setBiltyList(newList);
    localStorage.setItem('hcc_bilties_list', JSON.stringify(newList));
    syncWithSheetSilent(newList);
  };

  const formatFullAddress = (address, city, state, pincode) => {
    let parts = [];
    if (address) parts.push(address);
    if (city && address !== city) parts.push(city);
    
    let statePin = "";
    if (state && pincode) {
      statePin = `${state} (${pincode})`;
    } else if (state) {
      statePin = state;
    } else if (pincode) {
      statePin = `(${pincode})`;
    }

    if (statePin) parts.push(statePin);
    return parts.join(", ");
  };

  // Flatten Pickups with parsing for State & Pincode
  const handleOpenImportModal = () => {
    try {
      const savedPickups = JSON.parse(localStorage.getItem('hcc_pickups_list') || '[]');
      const flattened = [];

      savedPickups.forEach(pBatch => {
        (pBatch.cars || []).forEach((car, cIdx) => {
          let extractedPin = "";
          let extractedState = "";
          if (car.pincode) {
            const match = String(car.pincode).match(/^(\d+)\s*\((.+)\)$/);
            if (match) {
              extractedPin = match[1].trim();
              extractedState = match[2].trim().toUpperCase();
            } else if (/^\d+$/.test(String(car.pincode).trim())) {
              extractedPin = String(car.pincode).trim();
            } else {
              extractedState = String(car.pincode).trim().toUpperCase();
            }
          }

          const fromCity = (car.fromLocation || 'NAGPUR').toUpperCase();
          const toCity = (car.toLocation || '').toUpperCase();
          const fromLookup = processLocationLookup(fromCity);
          const toLookup = processLocationLookup(toCity);

          flattened.push({
            ...car,
            parentPickupId: pBatch.pickupId,
            pickupDate: pBatch.pickupDate,
            whoPicked: pBatch.whoPicked,
            consignorName: car.partyName || pBatch.whoPicked || '',
            consignorPhone: car.partyNumber || '',
            consignorAddress: fromCity,
            consignorState: fromLookup.state || '',
            consignorPincode: fromLookup.pincode || '',
            consigneeName: car.partyName || '',
            consigneePhone: car.partyNumber || '',
            consigneeAddress: toCity,
            consigneeState: extractedState || toLookup.state || '',
            consigneePincode: extractedPin || toLookup.pincode || '',
            uniqueKey: `${pBatch.pickupId}_car_${cIdx}`
          });
        });
      });

      setAllPickupCars(flattened);
      setSelectedGlobalCarKeys([]);
      setImportSearch('');
      setIsImportModalOpen(true);
    } catch {
      showToast("Failed to load saved Pickups", "error");
    }
  };

  const toggleGlobalCarSelection = (key) => {
    setSelectedGlobalCarKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleApplyImportedCars = () => {
    if (selectedGlobalCarKeys.length === 0) {
      showToast("Select at least one vehicle to import", "error");
      return;
    }

    const selectedCar = allPickupCars.find(c => selectedGlobalCarKeys.includes(c.uniqueKey));
    if (!selectedCar) return;

    const fromCity = (selectedCar.fromLocation || 'NAGPUR').toUpperCase();
    const toCity = (selectedCar.toLocation || '').toUpperCase();
    const fromLookup = processLocationLookup(fromCity);
    const toLookup = processLocationLookup(toCity);

    setBiltyData(prev => ({
      ...prev,
      consignorName: selectedCar.consignorName || prev.consignorName,
      consignorPhone: selectedCar.consignorPhone || prev.consignorPhone,
      consignorAddress: fromCity,
      consignorState: selectedCar.consignorState || fromLookup.state || '',
      consignorPincode: selectedCar.consignorPincode || fromLookup.pincode || '',
      consigneeName: selectedCar.consigneeName || prev.consigneeName,
      consigneePhone: selectedCar.consigneePhone || prev.consigneePhone,
      consigneeAddress: toCity,
      consigneeState: selectedCar.consigneeState || toLookup.state || '',
      consigneePincode: selectedCar.consigneePincode || toLookup.pincode || '',
      fromLocation: fromCity,
      toLocation: toCity,
      carName: selectedCar.carName || prev.carName,
      carNumber: selectedCar.carNumber || prev.carNumber,
      declaredValue: selectedCar.carValue ? `₹${selectedCar.carValue}` : prev.declaredValue,
      packerName: selectedCar.packerName || prev.packerName
    }));

    showToast(`Auto-filled Bilty from Pickup (${selectedCar.carName || 'Vehicle'})`);
    setIsImportModalOpen(false);
    setIsDrawerOpen(true);
  };

  const handleCreateNewBilty = () => {
    const nextLr = generateNextLrNo();
    const defaultLookup = processLocationLookup('NAGPUR');

    setBiltyData({
      id: Date.now(),
      lrNo: nextLr,
      date: new Date().toISOString().split('T')[0],
      consignorName: '', consignorPhone: '', consignorAddress: 'NAGPUR', consignorState: defaultLookup.state, consignorPincode: defaultLookup.pincode,
      consigneeName: '', consigneePhone: '', consigneeAddress: '', consigneeState: '', consigneePincode: '',
      fromLocation: 'NAGPUR', toLocation: '', noOfPkg: '1', carName: '', carNumber: '',
      lorryNo: '', declaredValue: '', insuranceBy: 'By Party',
      freight: 'Fixed', handlingCharges: '', doorCollection: '', doorDelivery: '',
      staticalCharges: '', gst: '', total: 'To Be Billed', bookingType: 'TO BE BILLED',
      packerName: '', officialSign: 'Rajesh Singh'
    });
    setIsDuplicate(false);
    setIsDrawerOpen(true);
  };

  const handleSaveBilty = () => {
    if (isDuplicate) {
      showToast("Duplicate LR Number exists! Change LR Number to save.", "error");
      return;
    }

    if (biltyData.carName) recordMRUItem('mru_cars', biltyData.carName);
    if (biltyData.toLocation) recordMRUItem('mru_cities', biltyData.toLocation);
    if (biltyData.fromLocation) recordMRUItem('mru_cities', biltyData.fromLocation);

    setCityOptions(getMRUItems('mru_cities', MASTER_CITIES));
    setCarOptions(getMRUItems('mru_cars', MASTER_CARS));

    const existingIndex = biltyList.findIndex(b => b.id === biltyData.id || b.lrNo === biltyData.lrNo);
    let updated;
    if (existingIndex !== -1) {
      updated = [...biltyList];
      updated[existingIndex] = biltyData;
    } else {
      updated = [biltyData, ...biltyList];
    }

    updateStateAndSync(updated);
    showToast(`Saved Bilty / LR #${biltyData.lrNo}`);
    setIsDrawerOpen(false);
    
    setActiveShareBilty(biltyData);
    setIsShareModalOpen(true);
  };

  const confirmDeleteBilty = () => {
    if (!deleteModalId) return;
    const updated = biltyList.filter(b => b.id !== deleteModalId && b.lrNo !== deleteModalId);
    updateStateAndSync(updated);
    showToast(`Bilty deleted`, 'info');
    setDeleteModalId(null);
  };

  const processPDF = async (actionType) => {
    const element = document.getElementById('printable-bilty-sheet');
    if (!element || !window.html2pdf) {
      window.print();
      setIsShareModalOpen(false);
      return;
    }

    const targetBilty = activeShareBilty || biltyData;
    const lrNo = targetBilty.lrNo || '5504';
    const partyName = targetBilty.consignorName || 'Party';
    const packerName = targetBilty.packerName || 'Packer';
    const fromLoc = targetBilty.fromLocation || 'Nagpur';
    const toLoc = targetBilty.toLocation || 'Destination';

    const dynamicFileName = `LR_${lrNo}_${partyName}_${packerName}_${fromLoc}_To_${toLoc}.pdf`;

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
            title: `Harihar Cargo Bilty - LR #${lrNo}`,
            text: `Bilty Details for LR #${lrNo} (${partyName})`,
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
        console.error("PDF action error:", err);
        showToast("Failed to process PDF", "error");
      }
    } finally {
      setIsShareModalOpen(false);
    }
  };

  const filteredBilties = (biltyList || [])
    .filter((item) => {
      if (!item) return false;
      const lrStr = String(item.lrNo || '').toLowerCase();
      const consignorStr = String(item.consignorName || '').toLowerCase();
      const consigneeStr = String(item.consigneeName || '').toLowerCase();
      const carStr = String(item.carName || '').toLowerCase();
      const carNoStr = String(item.carNumber || '').toLowerCase();
      const packerStr = String(item.packerName || '').toLowerCase();
      const queryStr = String(searchQuery || '').toLowerCase();

      const matchesSearch = lrStr.includes(queryStr) || consignorStr.includes(queryStr) || consigneeStr.includes(queryStr) || carStr.includes(queryStr) || carNoStr.includes(queryStr) || packerStr.includes(queryStr);

      let matchesDateRange = true;
      if (fromDate && item.date < fromDate) matchesDateRange = false;
      if (toDate && item.date > toDate) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') return (b.id || 0) - (a.id || 0);
      return (a.id || 0) - (b.id || 0);
    });

  const totalPages = Math.ceil(filteredBilties.length / itemsPerPage) || 1;
  const currentItems = filteredBilties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filteredGlobalCars = allPickupCars.filter(car => {
    const q = importSearch.toLowerCase();
    return (
      String(car.carName || '').toLowerCase().includes(q) ||
      String(car.carNumber || '').toLowerCase().includes(q) ||
      String(car.partyName || '').toLowerCase().includes(q) ||
      String(car.parentPickupId || '').toLowerCase().includes(q) ||
      String(car.toLocation || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0 !important; padding: 0 !important; background-color: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          #printable-bilty-sheet {
            position: fixed !important; left: 0 !important; top: 0 !important; width: 280mm !important; height: 190mm !important; margin: 0 !important; padding: 6mm !important; box-sizing: border-box !important; border: none !important; box-shadow: none !important; background: #ffffff !important; z-index: 999999 !important;
          }
        }
      `}</style>

      {/* Main Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            📄 CONSIGNMENT NOTE (BILTY)
          </h1>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>
            HARIHAR CARGO CARRIERS • LIVE DOCUMENT PREVIEW & MANAGEMENT
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setActiveShareBilty(biltyData); setIsShareModalOpen(true); }} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
            📲 SHARE / PDF
          </button>
          <button onClick={handleCreateNewBilty} style={{ backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(185,28,28,0.25)' }}>
            + NEW BILTY ENTRY
          </button>
        </div>
      </div>

      {/* Filter and History Bar */}
      <div className="no-print" style={{ backgroundColor: '#fff', padding: '14px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
          <input 
            type="text" 
            placeholder="🔍 Search LR No, Consignor, Consignee, Vehicle, Packer..." 
            value={searchQuery} 
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
            From:
            <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setCurrentPage(1); }} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
            To:
            <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setCurrentPage(1); }} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#f8fafc' }}>
            <option value="latest">⬇️ Date: Latest First</option>
            <option value="oldest">⬆️ Date: Oldest First</option>
          </select>

          {(searchQuery || fromDate || toDate) && (
            <button 
              onClick={() => { setSearchQuery(''); setFromDate(''); setToDate(''); setCurrentPage(1); }} 
              style={{ padding: '8px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0f172a' }}>
              📁 ALL SAVED BILTIES ({filteredBilties.length}) — Page {currentPage} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#e2e8f0' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>◀ Prev</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#e2e8f0' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>Next ▶</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {currentItems.length > 0 ? (
              currentItems.map((b) => (
                <div 
                  key={b.id || b.lrNo} 
                  onClick={() => { setBiltyData(b); setIsDuplicate(false); }}
                  style={{ 
                    backgroundColor: b.id === biltyData.id ? '#fef2f2' : '#f8fafc', 
                    border: b.id === biltyData.id ? '1.5px solid #b91c1c' : '1.5px solid #e2e8f0', 
                    borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', minWidth: '220px', flexShrink: 0 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#b91c1c' }}>LR #{b.lrNo}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={(e) => { e.stopPropagation(); setBiltyData(b); setIsDrawerOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }} title="Edit">✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteModalId(b.lrNo); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }} title="Delete">🗑️</button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginTop: '4px' }}>
                    {b.carName || 'CAR'} ({b.carNumber || 'N/A'})
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                    {b.fromLocation} → {b.toLocation}
                  </div>

                  {b.packerName && (
                    <div style={{ marginTop: '6px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                      📦 PACKER: {b.packerName}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '8px 0', fontWeight: 700 }}>No Bilty records match your filters.</div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Sheet Preview */}
      <div id="printable-bilty-sheet" style={{
        width: '280mm',
        height: '190mm',
        margin: '0 auto 24px auto',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        padding: '8px 12px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.5px' }}>
            SUBJECT TO NAGPUR JURISDICTION ONLY
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '130px', textAlign: 'center' }}>
              <img src={logoLeft} alt="Harihar Cargo Carriers Logo" style={{ width: '130px', height: 'auto', objectFit: 'contain' }} />
            </div>

            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#b91c1c', letterSpacing: '1px' }}>
                HARIHAR CARGO CARRIERS
              </h1>
              <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '12px', margin: '1px 0' }}>
                FLEET OWNER & TRANSPORT CONTRACTOR
              </div>
              <div style={{ fontSize: '10.5px', color: '#1e293b', fontWeight: '700' }}>
                H.O: PLOT NO.19, SHIVSHAKTI NAGAR, OPP WADI POLICE STATION AMRAVATI ROAD NAGPUR 440023
              </div>
              <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold', margin: '2px 0' }}>
                MOB NO. 9372693389, 7972409656 EMAIL: <span style={{ textDecoration: 'underline' }}>HARIHARCARCARRIER@GMAIL.COM</span>
              </div>
              <div style={{ display: 'inline-block', border: '1.5px solid #000', padding: '1px 14px', marginTop: '1px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '900', color: '#b91c1c' }}>GST No: 27AWOPR8730N2ZI</span>
              </div>
            </div>

            <div style={{ width: '130px', textAlign: 'right' }}>
              <img src={logoRight} alt="Trailer Transport" style={{ width: '130px', height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>

          <div style={{ border: '1.5px solid #000' }}>
            <div style={{ borderBottom: '1px solid #000', padding: '3px 6px', fontSize: '9.5px', fontWeight: 'bold', lineHeight: '1.1' }}>
              BRANCHES: PUNE, GURGAON, BANGLORE, CHENNAI, GOA, MUMBAI, JABALPUR, RAIPUR, BHOPAL, INDORE, CHANDIGARH, LUDHIANA, COCHIN, AHMEDABAD, JAIPUR, KOLKATA, LUCKNOW, BHUBANESWAR, HYDERABAD.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #000' }}>
              <div style={{ padding: '6px 10px', borderRight: '1px solid #000', minHeight: '52px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '11.5px', textDecoration: 'underline', marginBottom: '2px' }}>CONSIGNOR</div>
                <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                  <strong>NAME:</strong> <span style={{ fontWeight: '900', fontSize: '11.5px' }}>{biltyData.consignorName || '-'}</span><br />
                  <strong>ADDRESS:</strong> {formatFullAddress(biltyData.consignorAddress, biltyData.fromLocation, biltyData.consignorState, biltyData.consignorPincode) || '-'}<br />
                  {biltyData.consignorPhone && <span><strong>MOB NO:</strong> <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{biltyData.consignorPhone}</span></span>}
                </div>
              </div>

              <div style={{ padding: '6px 10px', minHeight: '52px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '11.5px', textDecoration: 'underline', marginBottom: '2px' }}>CONSIGNEE</div>
                <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                  <strong>NAME:</strong> <span style={{ fontWeight: '900', fontSize: '11.5px' }}>{biltyData.consigneeName || '-'}</span><br />
                  <strong>ADDRESS:</strong> {formatFullAddress(biltyData.consigneeAddress, biltyData.toLocation, biltyData.consigneeState, biltyData.consigneePincode) || '-'}<br />
                  {biltyData.consigneePhone && <span><strong>MOB NO:</strong> <span style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{biltyData.consigneePhone}</span></span>}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', borderBottom: '1px solid #000', fontSize: '11.5px', fontWeight: 'bold' }}>
              <div style={{ padding: '4px 8px', borderRight: '1px solid #000' }}>
                LR NO: <span style={{ color: '#b91c1c', fontSize: '12.5px', fontWeight: '900' }}>{biltyData.lrNo}</span>
              </div>
              <div style={{ padding: '4px 8px', borderRight: '1px solid #000' }}>
                DATE: <span style={{ fontSize: '11.5px' }}>{biltyData.date}</span>
              </div>
              <div style={{ padding: '4px 8px', borderRight: '1px solid #000' }}>
                FROM: <span style={{ color: '#b91c1c', fontSize: '11.5px', fontWeight: 'bold' }}>{biltyData.fromLocation || 'NAGPUR'}</span>
              </div>
              <div style={{ padding: '4px 8px' }}>
                TO: <span style={{ color: '#b91c1c', fontSize: '11.5px', fontWeight: 'bold' }}>{biltyData.toLocation || '-'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 300px', borderBottom: '1px solid #000', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
              <div style={{ padding: '4px', borderRight: '1px solid #000' }}>No of Pkg</div>
              <div style={{ padding: '4px', borderRight: '1px solid #000' }}>DESCRIPTION (SAID TO CONTAIN)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ borderRight: '1px solid #000', padding: '4px' }}>CHARGES</div>
                <div style={{ padding: '4px' }}>AMOUNT RS</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 300px', minHeight: '150px', fontSize: '11.5px' }}>
              <div style={{ padding: '8px', borderRight: '1px solid #000', textAlign: 'center', fontWeight: '900', fontSize: '13px' }}>
                {biltyData.noOfPkg || '1'}
              </div>

              <div style={{ padding: '10px 14px', borderRight: '1px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '13.5px', marginBottom: '6px', color: '#0f172a' }}>
                    Car Name: <span style={{ textTransform: 'uppercase' }}>{biltyData.carName || '-'}</span>
                  </div>
                  
                  <div style={{ fontSize: '12.5px', fontWeight: '800', margin: '4px 0', color: '#1e293b' }}>
                    Car Number: <span style={{ textTransform: 'uppercase' }}>{biltyData.carNumber || '-'}</span>
                  </div>
                </div>

                <div style={{ margin: '6px 0' }}>
                  <span style={{ border: '1.5px solid #2563eb', padding: '4px 12px', fontWeight: '900', color: '#1e3a8a', fontSize: '11.5px', borderRadius: '3px' }}>
                    LORRY NO: {biltyData.lorryNo || 'Part Load'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '10.5px' }}>
                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>FREIGHT</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '3px 6px', textAlign: 'right', fontWeight: 'bold' }}>{biltyData.freight || 'Fixed'}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>HANDLING CHARGES</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{biltyData.handlingCharges || '-'}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>DOOR COLLECTION</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{biltyData.doorCollection || '-'}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>DOOR DELIVERY</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{biltyData.doorDelivery || '-'}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>STATICAL CHARGES</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{biltyData.staticalCharges || '-'}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '3px 6px', fontWeight: 'bold' }}>GST</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '3px 6px', textAlign: 'right' }}>{biltyData.gst || '-'}</div>

                  <div style={{ borderRight: '1px solid #000', padding: '3px 6px', fontWeight: '900', fontSize: '11px' }}>TOTAL</div>
                  <div style={{ padding: '3px 6px', textAlign: 'right', fontWeight: '900', fontSize: '11px' }}>{biltyData.total || 'To Be Billed'}</div>
                </div>

                <div style={{ padding: '4px 6px', fontSize: '10px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #000' }}>
                  <div style={{ textDecoration: 'underline', marginBottom: '2px', fontSize: '10.5px' }}>BASIC OF BOOKING:</div>
                  [{biltyData.bookingType === 'TO PAY' ? 'X' : ' '}] TO PAY &nbsp; 
                  [{biltyData.bookingType === 'PAID' ? 'X' : ' '}] PAID <br />
                  [{biltyData.bookingType === 'TO BE BILLED' ? 'X' : ' '}] TO BE BILLED
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div>
                <strong>DECLARED VALUE OF GOODS:</strong> <span style={{ color: '#b91c1c', fontWeight: '900', fontSize: '12px' }}>{biltyData.declaredValue || '-'}</span><br />
                <span>INSURANCE:</span>
              </div>
              <div style={{ alignSelf: 'flex-end', fontWeight: 'bold', fontSize: '11px' }}>
                {biltyData.insuranceBy || 'By Party'}
              </div>
            </div>

            <div style={{ padding: '3px 10px', fontSize: '8.5px', borderBottom: '1px solid #000', lineHeight: '1.2' }}>
              We are registered for GST under the category of Goods Transport Agency vide Reverse Charge Mechanism and thus the recipient of our service is liable to pay GST on goods transport service vide Not. No. 13/2017 Dd. 28.06.2017
            </div>

            <div style={{ padding: '6px 10px 0 10px' }}>
              <div style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '10.5px', marginBottom: '-12px' }}>
                PACKER NAME: <span style={{ textTransform: 'uppercase', color: '#b91c1c' }}>{biltyData.packerName || '-'}</span>
              </div>
              <SignatureStampBlock />
            </div>
          </div>
        </div>
      </div>

      {/* Share / PDF Modal */}
      {isShareModalOpen && activeShareBilty && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '480px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 900 }}>💬 Share Bilty / LR #{activeShareBilty.lrNo}</h3>
            <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.88rem' }}>
              Party: <strong>{activeShareBilty.consignorName || 'N/A'}</strong> | Vehicle: <strong>{activeShareBilty.carName} ({activeShareBilty.carNumber})</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => processPDF('share')} style={{ padding: '12px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
                📲 SHARE TO WHATSAPP / APPS
              </button>
              <button onClick={() => processPDF('download')} style={{ padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>
                📥 DOWNLOAD PDF
              </button>
              <button onClick={() => setIsShareModalOpen(false)} style={{ padding: '10px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900 }}>Delete Bilty Entry?</h3>
            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem' }}>Are you sure you want to delete LR #{deleteModalId}?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={confirmDeleteBilty} style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>YES, DELETE</button>
              <button onClick={() => setDeleteModalId(null)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer Form */}
      {isDrawerOpen && (
        <div onClick={() => setIsDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 }} />
      )}

      <div style={{
        position: 'fixed', top: 0, right: isDrawerOpen ? 0 : '-580px', width: '540px', height: '100vh',
        backgroundColor: '#fff', boxShadow: '-4px 0 25px rgba(0,0,0,0.2)', zIndex: 999, transition: 'right 0.3s ease',
        display: 'flex', flexDirection: 'column', padding: '24px', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Bilty Entry Form</h2>
          <button onClick={handleOpenImportModal} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}>
            📦 IMPORT FROM PICKUP
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          
          {/* Route Details */}
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800' }}>LR & Route Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>LR NO:</label>
                <input 
                  type="text" 
                  value={biltyData.lrNo} 
                  onChange={e => handleLrNoChange(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: isDuplicate ? '2px solid #ef4444' : '1px solid #ccc', fontWeight: 'bold', boxSizing: 'border-box' }} 
                />
                {isDuplicate && (
                  <span style={{ color: '#ef4444', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '2px', display: 'block' }}>⚠️ LR #{biltyData.lrNo} already exists!</span>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>DATE:</label>
                <input 
                  type="date" 
                  value={biltyData.date} 
                  onChange={e => setBiltyData({...biltyData, date: e.target.value})} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />
              </div>

              <SearchableDropdown
                placeholder="FROM LOCATION"
                value={biltyData.fromLocation}
                options={cityOptions}
                onChange={(val) => handleFromCityChange(val)}
              />

              <SearchableDropdown
                placeholder="TO LOCATION"
                value={biltyData.toLocation}
                options={cityOptions}
                onChange={(val) => handleToCityChange(val)}
              />
            </div>
          </div>

          {/* Consignor Details */}
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#b91c1c' }}>Consignor Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="CONSIGNOR NAME" value={biltyData.consignorName} onChange={e => setBiltyData({...biltyData, consignorName: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="PHONE NUMBER" value={biltyData.consignorPhone} onChange={e => setBiltyData({...biltyData, consignorPhone: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              
              <input 
                type="text" 
                placeholder="CONSIGNOR ADDRESS" 
                value={biltyData.consignorAddress} 
                onChange={e => setBiltyData({...biltyData, consignorAddress: e.target.value.toUpperCase()})} 
                style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase', gridColumn: 'span 2' }} 
              />
              <input type="text" placeholder="STATE" value={biltyData.consignorState} onChange={e => setBiltyData({...biltyData, consignorState: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="PINCODE" value={biltyData.consignorPincode} onChange={e => setBiltyData({...biltyData, consignorPincode: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Consignee Details */}
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#b91c1c' }}>Consignee Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="CONSIGNEE NAME" value={biltyData.consigneeName} onChange={e => setBiltyData({...biltyData, consigneeName: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="PHONE NUMBER" value={biltyData.consigneePhone} onChange={e => setBiltyData({...biltyData, consigneePhone: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              
              <input 
                type="text" 
                placeholder="CONSIGNEE ADDRESS" 
                value={biltyData.consigneeAddress} 
                onChange={e => setBiltyData({...biltyData, consigneeAddress: e.target.value.toUpperCase()})} 
                style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase', gridColumn: 'span 2' }} 
              />
              <input type="text" placeholder="STATE" value={biltyData.consigneeState} onChange={e => setBiltyData({...biltyData, consigneeState: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="PINCODE" value={biltyData.consigneePincode} onChange={e => setBiltyData({...biltyData, consigneePincode: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Vehicle & Freight Charges */}
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>Vehicle & Freight Charges</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <SearchableDropdown
                placeholder="CAR NAME (E.G. CRETA)"
                value={biltyData.carName}
                options={carOptions}
                onChange={(val) => setBiltyData({...biltyData, carName: val})}
              />

              <input type="text" placeholder="CAR NO. (MH31AB1234)" value={biltyData.carNumber} onChange={e => setBiltyData({...biltyData, carNumber: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="LORRY NO." value={biltyData.lorryNo} onChange={e => setBiltyData({...biltyData, lorryNo: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="DECLARED VALUE (₹)" value={biltyData.declaredValue} onChange={e => setBiltyData({...biltyData, declaredValue: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="text" placeholder="PACKER NAME" value={biltyData.packerName} onChange={e => setBiltyData({...biltyData, packerName: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="FREIGHT AMOUNT" value={biltyData.freight} onChange={e => setBiltyData({...biltyData, freight: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              
              <select value={biltyData.bookingType} onChange={e => setBiltyData({...biltyData, bookingType: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', gridColumn: 'span 2', fontWeight: 800 }}>
                <option value="TO BE BILLED">BOOKING: TO BE BILLED</option>
                <option value="TO PAY">BOOKING: TO PAY</option>
                <option value="PAID">BOOKING: PAID</option>
              </select>
            </div>
          </div>

        </div>

        <button 
          onClick={handleSaveBilty} 
          disabled={isDuplicate}
          style={{ 
            padding: '14px', 
            backgroundColor: isDuplicate ? '#94a3b8' : '#b91c1c', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: 900, 
            marginTop: '12px', 
            cursor: isDuplicate ? 'not-allowed' : 'pointer', 
            fontSize: '0.95rem' 
          }}
        >
          {isDuplicate ? '⚠️ CANNOT SAVE DUPLICATE LR' : '💾 SAVE & INSTANT SYNC BILTY'}
        </button>
      </div>

      {/* Pickup Import Modal */}
      {isImportModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 900 }}>📦 Select Vehicle From Pickups for Bilty</h3>
            <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '0.85rem' }}>Search and check off a vehicle across pickup batches to auto-fill this Bilty.</p>

            <input 
              type="text" 
              placeholder="🔍 Search car name, car number, pickup ID, party..." 
              value={importSearch} 
              onChange={e => setImportSearch(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', marginBottom: '12px', boxSizing: 'border-box' }}
            />

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredGlobalCars.length > 0 ? (
                filteredGlobalCars.map((car) => {
                  const isSelected = selectedGlobalCarKeys.includes(car.uniqueKey);

                  return (
                    <label 
                      key={car.uniqueKey} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '6px', 
                        backgroundColor: isSelected ? '#f0f9ff' : '#f8fafc', 
                        border: isSelected ? '1px solid #38bdf8' : '1px solid #e2e8f0', 
                        cursor: 'pointer', fontSize: '0.88rem'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        onChange={() => toggleGlobalCarSelection(car.uniqueKey)} 
                      />
                      <div style={{ flex: 1, textTransform: 'uppercase' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{car.carName || 'CAR'} ({car.carNumber || 'NO NUMBER'})</span>
                          <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 800 }}>{car.parentPickupId}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          Party: {car.consignorName || car.partyName || '-'} | Route: {car.fromLocation || 'NAGPUR'} → {car.toLocation || '-'}
                        </div>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>No vehicles found matching search.</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleApplyImportedCars} style={{ flex: 1, padding: '12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                ✅ IMPORT SELECTED VEHICLE
              </button>
              <button onClick={() => setIsImportModalOpen(false)} style={{ padding: '12px 20px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}