import React, { useState, useEffect } from 'react';

// Assets
import logoLeft from '../../assets/logo-left.png';
import logoRight from '../../assets/right-logo.png';

// Components & Constants
import SignatureStampBlock from '../../components/SignatureStampBlock';
import { SearchableDropdown, Toast } from '../../components/CommonUI';
import { CITY_DATA, MASTER_CITIES, MASTER_CARS, getMRUItems, recordMRUItem } from '../../utils/constants';

const INVOICE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxP8y0fZ3XWgVEFHXxHfdKPJWGHlTcO7MJ-NWJb9kkaupfpUF7OistkG-Nd5JGICYs9fw/exec";

export default function Invoices() {
  const [invoicesList, setInvoicesList] = useState(() => {
    try {
      const saved = localStorage.getItem('hcc_invoices_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareInvoice, setActiveShareInvoice] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // Import Modal States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSourceTab, setImportSourceTab] = useState('pickups'); // 'pickups' | 'bilties'
  const [importSearch, setImportSearch] = useState('');
  const [importItems, setImportItems] = useState([]);
  const [selectedImportKey, setSelectedImportKey] = useState(null);

  // Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [cityOptions, setCityOptions] = useState([]);
  const [carOptions, setCarOptions] = useState([]);

  // Strict Date Formatting to DD-MM-YYYY
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

  // Indian Currency Number to Words Converter (Fixed algorithm)
  const convertNumberToWords = (amt) => {
    if (!amt) return '';
    const cleanAmt = String(amt).replace(/[^0-9]/g, '');
    const num = parseInt(cleanAmt, 10);
    if (isNaN(num) || num === 0) return '';

    const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
    const b = ['', '', 'TWENTY ', 'THIRTY ', 'FORTY ', 'FIFTY ', 'SIXTY ', 'SEVENTY ', 'EIGHTY ', 'NINETY '];

    const inWords = (n) => {
      const numStr = n.toString();
      if (numStr.length > 9) return '';
      let n_array = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n_array) return '';

      let str = '';
      str += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + a[n_array[1][1]]) + 'CRORE ' : '';
      str += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + a[n_array[2][1]]) + 'LAKH ' : '';
      str += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + a[n_array[3][1]]) + 'THOUSAND ' : '';
      str += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + a[n_array[4][1]]) + 'HUNDRED ' : '';
      str += (n_array[5] != 0) ? ((str != '') ? 'AND ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + a[n_array[5][1]]) : '';

      return str;
    };

    const words = inWords(num);
    return words ? `${words.trim()} RUPEES ONLY` : '';
  };

  // Gap-Filling Sequential Bill No Generator starting at 7896
  const generateNextBillNo = (currentList = invoicesList) => {
    const startNum = 7896;
    const existingNums = (currentList || [])
      .map(item => parseInt(item.billNo, 10))
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

  // Location lookup helper
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

  // Form State
  const defaultFromLookup = processLocationLookup('NAGPUR');
  const [invoiceData, setInvoiceData] = useState({
    id: Date.now(),
    billNo: generateNextBillNo(),
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    clientPhone: '',
    clientAddress: 'NAGPUR',
    clientState: defaultFromLookup.state,
    clientPincode: defaultFromLookup.pincode,
    lrNo: '',
    lrDate: new Date().toISOString().split('T')[0],
    carName: '',
    carNumber: '',
    carDetails: '',
    lorryNo: 'Part Load',
    fromLocation: 'NAGPUR',
    toLocation: '',
    amount: '',
    gstRate: '0%',
    gstPayer: 'By Party',
    amountInWords: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const handleBillNoChange = (val) => {
    const exists = invoicesList.some(item => 
      String(item.billNo).trim() === String(val).trim() && item.id !== invoiceData.id
    );
    setIsDuplicate(exists);
    setInvoiceData(prev => ({ ...prev, billNo: val }));
  };

  // FROM Location change handler - updates M/s address, city, state, and pincode dynamically
  const handleFromCityChange = (cityName) => {
    const uppercaseCity = typeof cityName === 'string' ? cityName.toUpperCase() : cityName;
    const { state, pincode } = processLocationLookup(uppercaseCity);

    setInvoiceData(prev => ({
      ...prev,
      fromLocation: uppercaseCity,
      clientAddress: uppercaseCity,
      clientState: state,
      clientPincode: pincode
    }));
  };

  // TO Location change handler
  const handleToCityChange = (cityName) => {
    const uppercaseCity = typeof cityName === 'string' ? cityName.toUpperCase() : cityName;
    setInvoiceData(prev => ({
      ...prev,
      toLocation: uppercaseCity
    }));
  };

  const handleCarFieldsChange = (field, value) => {
    const upperVal = typeof value === 'string' ? value.toUpperCase() : value;
    setInvoiceData(prev => {
      const updated = { ...prev, [field]: upperVal };
      const combined = [updated.carName, updated.carNumber].filter(Boolean).join(' - ');
      return { ...updated, carDetails: combined };
    });
  };

  const handleAmountChange = (val) => {
    setInvoiceData(prev => ({
      ...prev,
      amount: val,
      amountInWords: convertNumberToWords(val)
    }));
  };

  const syncWithSheetSilent = (dataToSync) => {
    if (!INVOICE_SHEETS_SCRIPT_URL) return;
    fetch(INVOICE_SHEETS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync', sheetName: 'Invoice Details', data: dataToSync })
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

    if (INVOICE_SHEETS_SCRIPT_URL) {
      fetch(`${INVOICE_SHEETS_SCRIPT_URL}?sheet=Invoice%20Details`)
        .then(res => res.json())
        .then(remoteData => {
          if (Array.isArray(remoteData) && remoteData.length > 0) {
            setInvoicesList(prevList => {
              // Deduplicate strictly by billNo
              const mergedMap = new Map();
              remoteData.forEach(item => {
                if (item && item.billNo) mergedMap.set(String(item.billNo).trim(), item);
              });
              prevList.forEach(localItem => {
                if (localItem && localItem.billNo && !mergedMap.has(String(localItem.billNo).trim())) {
                  mergedMap.set(String(localItem.billNo).trim(), localItem);
                }
              });
              const merged = Array.from(mergedMap.values());
              localStorage.setItem('hcc_invoices_list', JSON.stringify(merged));
              return merged;
            });
          }
        })
        .catch(err => console.error("Sheets sync load error:", err));
    }
  }, []);

  const updateStateAndSync = (newList) => {
    // Unique list filter by billNo to eliminate duplication bugs
    const uniqueMap = new Map();
    newList.forEach(item => {
      if (item && item.billNo) uniqueMap.set(String(item.billNo).trim(), item);
    });
    const cleanList = Array.from(uniqueMap.values());

    setInvoicesList(cleanList);
    localStorage.setItem('hcc_invoices_list', JSON.stringify(cleanList));
    syncWithSheetSilent(cleanList);
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

  const handleOpenImportModal = (tab = 'pickups') => {
    setImportSourceTab(tab);
    setSelectedImportKey(null);
    setImportSearch('');

    const flattened = [];
    if (tab === 'pickups') {
      const savedPickups = JSON.parse(localStorage.getItem('hcc_pickups_list') || '[]');
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

          flattened.push({
            type: 'pickup',
            parentKey: pBatch.pickupId,
            uniqueKey: `pickup_${pBatch.pickupId}_${cIdx}`,
            date: pBatch.pickupDate,
            clientName: car.partyName || pBatch.whoPicked || '',
            clientPhone: car.partyNumber || '',
            clientAddress: fromCity,
            clientState: extractedState || fromLookup.state || '',
            clientPincode: extractedPin || fromLookup.pincode || '',
            lrNo: '',
            lrDate: pBatch.pickupDate,
            carName: car.carName || '',
            carNumber: car.carNumber || '',
            lorryNo: 'Part Load',
            fromLocation: fromCity,
            toLocation: toCity,
            amount: car.carValue ? car.carValue : ''
          });
        });
      });
    } else {
      const savedBilties = JSON.parse(localStorage.getItem('hcc_bilties_list') || '[]');
      savedBilties.forEach(b => {
        const fromCity = (b.fromLocation || 'NAGPUR').toUpperCase();
        const fromLookup = processLocationLookup(fromCity);

        flattened.push({
          type: 'bilty',
          parentKey: `LR #${b.lrNo}`,
          uniqueKey: `bilty_${b.lrNo}_${b.id}`,
          date: b.date,
          clientName: b.consignorName || b.consigneeName || '',
          clientPhone: b.consignorPhone || b.consigneePhone || '',
          clientAddress: b.consignorAddress || fromCity,
          clientState: b.consignorState || fromLookup.state || '',
          clientPincode: b.consignorPincode || fromLookup.pincode || '',
          lrNo: b.lrNo || '',
          lrDate: b.date || '',
          carName: b.carName || '',
          carNumber: b.carNumber || '',
          lorryNo: b.lorryNo || 'Part Load',
          fromLocation: fromCity,
          toLocation: (b.toLocation || '').toUpperCase(),
          amount: b.total !== 'To Be Billed' ? b.total : ''
        });
      });
    }

    setImportItems(flattened);
    setIsImportModalOpen(true);
  };

  const handleApplyImportedData = () => {
    if (!selectedImportKey) {
      showToast("Select an item to import", "error");
      return;
    }

    const selected = importItems.find(i => i.uniqueKey === selectedImportKey);
    if (!selected) return;

    const carName = selected.carName || '';
    const carNumber = selected.carNumber || '';
    const combinedCar = [carName, carNumber].filter(Boolean).join(' - ');
    const amt = selected.amount ? String(selected.amount) : '';

    setInvoiceData(prev => ({
      ...prev,
      clientName: selected.clientName || prev.clientName,
      clientPhone: selected.clientPhone || prev.clientPhone,
      clientAddress: selected.clientAddress || selected.fromLocation || 'NAGPUR',
      clientState: selected.clientState || '',
      clientPincode: selected.clientPincode || '',
      lrNo: selected.lrNo || prev.lrNo,
      lrDate: selected.lrDate || prev.lrDate,
      carName: carName || prev.carName,
      carNumber: carNumber || prev.carNumber,
      carDetails: combinedCar || prev.carDetails,
      lorryNo: selected.lorryNo || prev.lorryNo,
      fromLocation: selected.fromLocation || 'NAGPUR',
      toLocation: selected.toLocation || '',
      amount: amt,
      amountInWords: amt ? convertNumberToWords(amt) : prev.amountInWords
    }));

    showToast(`Imported details from ${selected.type.toUpperCase()}`);
    setIsImportModalOpen(false);
    setIsDrawerOpen(true);
  };

  const handleCreateNewInvoice = () => {
    const nextBill = generateNextBillNo();
    const defaultLookup = processLocationLookup('NAGPUR');

    setInvoiceData({
      id: Date.now(),
      billNo: nextBill,
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      clientPhone: '',
      clientAddress: 'NAGPUR',
      clientState: defaultLookup.state,
      clientPincode: defaultLookup.pincode,
      lrNo: '',
      lrDate: new Date().toISOString().split('T')[0],
      carName: '',
      carNumber: '',
      carDetails: '',
      lorryNo: 'Part Load',
      fromLocation: 'NAGPUR',
      toLocation: '',
      amount: '',
      gstRate: '0%',
      gstPayer: 'By Party',
      amountInWords: ''
    });
    setIsDuplicate(false);
    setIsDrawerOpen(true);
  };

  const handleSaveInvoice = () => {
    if (isDuplicate) {
      showToast("Duplicate Bill Number exists! Change Bill Number to save.", "error");
      return;
    }

    if (invoiceData.carName) recordMRUItem('mru_cars', invoiceData.carName);
    if (invoiceData.toLocation) recordMRUItem('mru_cities', invoiceData.toLocation);
    if (invoiceData.fromLocation) recordMRUItem('mru_cities', invoiceData.fromLocation);

    setCityOptions(getMRUItems('mru_cities', MASTER_CITIES));
    setCarOptions(getMRUItems('mru_cars', MASTER_CARS));

    const finalInvoice = {
      ...invoiceData,
      amountInWords: invoiceData.amountInWords || convertNumberToWords(invoiceData.amount)
    };

    const existingIndex = invoicesList.findIndex(i => i.id === finalInvoice.id || String(i.billNo).trim() === String(finalInvoice.billNo).trim());
    let updated;
    if (existingIndex !== -1) {
      updated = [...invoicesList];
      updated[existingIndex] = finalInvoice;
    } else {
      updated = [finalInvoice, ...invoicesList];
    }

    updateStateAndSync(updated);
    showToast(`Saved Freight Bill #${finalInvoice.billNo}`);
    setIsDrawerOpen(false);

    setActiveShareInvoice(finalInvoice);
    setIsShareModalOpen(true);
  };

  const confirmDeleteInvoice = () => {
    if (!deleteModalId) return;
    const updated = invoicesList.filter(i => i.id !== deleteModalId && String(i.billNo).trim() !== String(deleteModalId).trim());
    updateStateAndSync(updated);
    showToast(`Freight Bill deleted`, 'info');
    setDeleteModalId(null);
  };

  const processPDF = async (actionType) => {
    const element = document.getElementById('printable-invoice-sheet');
    if (!element || !window.html2pdf) {
      window.print();
      setIsShareModalOpen(false);
      return;
    }

    const target = activeShareInvoice || invoiceData;
    const billNo = target.billNo || '7896';
    const clientName = target.clientName || 'Client';
    const dynamicFileName = `Bill_${billNo}_${clientName}.pdf`;

    const opt = {
      margin: [2, 2, 2, 2],
      filename: dynamicFileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      const worker = window.html2pdf().set(opt).from(element);

      if (actionType === 'share') {
        const pdfBlob = await worker.output('blob');
        const pdfFile = new File([pdfBlob], dynamicFileName, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
          await navigator.share({
            title: `Harihar Cargo Invoice - Bill #${billNo}`,
            text: `Freight Bill #${billNo} for ${clientName}`,
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

  const filteredInvoices = (invoicesList || [])
    .filter((item) => {
      if (!item) return false;
      const billStr = String(item.billNo || '').toLowerCase();
      const clientStr = String(item.clientName || '').toLowerCase();
      const lrStr = String(item.lrNo || '').toLowerCase();
      const carStr = String(item.carDetails || item.carName || '').toLowerCase();
      const queryStr = String(searchQuery || '').toLowerCase();

      const matchesSearch = billStr.includes(queryStr) || clientStr.includes(queryStr) || lrStr.includes(queryStr) || carStr.includes(queryStr);

      let matchesDateRange = true;
      if (fromDate && item.date < fromDate) matchesDateRange = false;
      if (toDate && item.date > toDate) matchesDateRange = false;

      return matchesSearch && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortOrder === 'latest') return (b.id || 0) - (a.id || 0);
      return (a.id || 0) - (b.id || 0);
    });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const currentItems = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filteredImportItems = importItems.filter(item => {
    const q = importSearch.toLowerCase();
    return (
      String(item.clientName || '').toLowerCase().includes(q) ||
      String(item.carName || '').toLowerCase().includes(q) ||
      String(item.carNumber || '').toLowerCase().includes(q) ||
      String(item.parentKey || '').toLowerCase().includes(q) ||
      String(item.toLocation || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0 !important; padding: 0 !important; background-color: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          #printable-invoice-sheet {
            position: fixed !important; left: 0 !important; top: 0 !important; width: 210mm !important; height: 297mm !important; margin: 0 !important; padding: 10mm 12mm !important; box-sizing: border-box !important; border: none !important; box-shadow: none !important; background: #ffffff !important; z-index: 999999 !important;
          }
        }
      `}</style>

      {/* Main Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            🧾 FREIGHT BILL / INVOICE
          </h1>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>
            HARIHAR CARGO CARRIERS • LIVE BILL PREVIEW & MANAGEMENT
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setActiveShareInvoice(invoiceData); setIsShareModalOpen(true); }} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>
            📲 SHARE / PDF
          </button>
          <button onClick={handleCreateNewInvoice} style={{ backgroundColor: '#b91c1c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(185,28,28,0.25)' }}>
            + NEW FREIGHT BILL
          </button>
        </div>
      </div>

      {/* Filter and History Bar */}
      <div className="no-print" style={{ backgroundColor: '#fff', padding: '14px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
          <input 
            type="text" 
            placeholder="🔍 Search Bill No, Client Name, LR No, Vehicle..." 
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
              📁 ALL SAVED FREIGHT BILLS ({filteredInvoices.length}) — Page {currentPage} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#e2e8f0' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>◀ Prev</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#e2e8f0' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>Next ▶</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {currentItems.length > 0 ? (
              currentItems.map((inv) => (
                <div 
                  key={inv.id || inv.billNo} 
                  onClick={() => { setInvoiceData(inv); setIsDuplicate(false); }}
                  style={{ 
                    backgroundColor: inv.id === invoiceData.id ? '#fef2f2' : '#f8fafc', 
                    border: inv.id === invoiceData.id ? '1.5px solid #b91c1c' : '1.5px solid #e2e8f0', 
                    borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', minWidth: '220px', flexShrink: 0 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#b91c1c' }}>BILL #{inv.billNo}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={(e) => { e.stopPropagation(); setInvoiceData(inv); setIsDrawerOpen(true); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }} title="Edit">✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteModalId(inv.billNo); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }} title="Delete">🗑️</button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginTop: '4px' }}>
                    {inv.clientName || 'CLIENT'}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>
                    {inv.fromLocation} → {inv.toLocation} | ₹{inv.amount || '0'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '8px 0', fontWeight: 700 }}>No Invoice records match your filters.</div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Sheet */}
      <div id="printable-invoice-sheet" style={{
        width: '210mm',
        minHeight: '285mm',
        margin: '0 auto 24px auto',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        padding: '16px 20px',
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
          <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
            SUBJECT TO NAGPUR JURISDICTION ONLY
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ width: '110px', textAlign: 'center' }}>
              <img src={logoLeft} alt="Harihar Cargo Carriers Logo" style={{ width: '110px', height: 'auto', objectFit: 'contain' }} />
            </div>

            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: '#b91c1c', letterSpacing: '1px' }}>
                HARIHAR CARGO CARRIERS
              </h1>
              <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '11.5px', margin: '1px 0' }}>
                FLEET OWNER & TRANSPORT CONTRACTOR
              </div>
              <div style={{ fontSize: '10px', color: '#1e293b', fontWeight: '700' }}>
                H.O: PLOT NO.19, SHIVSHAKTI NAGAR, OPP WADI POLICE STATION AMRAVATI ROAD NAGPUR 440023
              </div>
              <div style={{ fontSize: '10.5px', color: '#2563eb', fontWeight: 'bold', margin: '2px 0' }}>
                MOB NO. 9372693389, 7972409656 EMAIL: <span style={{ textDecoration: 'underline' }}>HARIHARCARCARRIER@GMAIL.COM</span>
              </div>
              <div style={{ display: 'inline-block', border: '1.5px solid #000', padding: '1px 14px', marginTop: '1px' }}>
                <span style={{ fontSize: '11px', fontWeight: '900', color: '#b91c1c' }}>GST No: 27AWOPR8730N2ZI</span>
              </div>
            </div>

            <div style={{ width: '110px', textAlign: 'right' }}>
              <img src={logoRight} alt="Trailer Transport" style={{ width: '110px', height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Bill No & Strict DD-MM-YYYY Date */}
          <div style={{ border: '1.5px solid #000', display: 'flex', justifyContent: 'space-between', padding: '6px 12px', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px', backgroundColor: '#f8fafc' }}>
            <div>BILL NO: <span style={{ color: '#b91c1c', fontSize: '15px', fontWeight: '900' }}>#{invoiceData.billNo}</span></div>
            <div>DATE: <span style={{ color: '#b91c1c', fontSize: '14px', fontWeight: '900' }}>{formatDateDisplay(invoiceData.date)}</span></div>
          </div>

          {/* Client Details Block (M/s Consignor & Address Line based on FROM Details) */}
          <div style={{ border: '1.5px solid #000', padding: '10px 14px', marginBottom: '12px', minHeight: '60px' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 'bold' }}>
              M/S: <span style={{ fontSize: '15px', fontWeight: '900' }}>{invoiceData.clientName || '-'}</span>
              {invoiceData.clientPhone && <span style={{ marginLeft: '12px', fontSize: '12px', color: '#1e3a8a' }}>MOB: {invoiceData.clientPhone}</span>}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>
              Address: {formatFullAddress(invoiceData.clientAddress, invoiceData.fromLocation, invoiceData.clientState, invoiceData.clientPincode) || '-'}
            </div>
          </div>

          {/* Extended Table Grid */}
          <div style={{ border: '1.5px solid #000' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1.6fr 1.1fr 1fr 1fr 1.2fr', borderBottom: '1.5px solid #000', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ padding: '8px 4px', borderRight: '1px solid #000' }}>LR NO.</div>
              <div style={{ padding: '8px 4px', borderRight: '1px solid #000' }}>Date</div>
              <div style={{ padding: '8px 4px', borderRight: '1px solid #000' }}>CAR DETAILS</div>
              <div style={{ padding: '8px 4px', borderRight: '1px solid #000' }}>LORRY NO.</div>
              <div style={{ padding: '8px 4px', borderRight: '1px solid #000' }}>FROM</div>
              <div style={{ padding: '8px 4px', borderRight: '1px solid #000' }}>TO</div>
              <div style={{ padding: '8px 4px' }}>AMOUNT</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1.6fr 1.1fr 1fr 1fr 1.2fr', minHeight: '480px', fontSize: '12px', textAlign: 'center' }}>
              <div style={{ padding: '16px 4px', borderRight: '1px solid #000', fontWeight: '900', color: '#b91c1c' }}>{invoiceData.lrNo || '-'}</div>
              <div style={{ padding: '16px 4px', borderRight: '1px solid #000', fontWeight: 'bold', color: '#b91c1c' }}>{formatDateDisplay(invoiceData.lrDate)}</div>
              <div style={{ padding: '16px 6px', borderRight: '1px solid #000', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>{invoiceData.carDetails || '-'}</div>
              <div style={{ padding: '16px 4px', borderRight: '1px solid #000', fontWeight: '800' }}>{invoiceData.lorryNo || '-'}</div>
              <div style={{ padding: '16px 4px', borderRight: '1px solid #000', fontWeight: 'bold' }}>{invoiceData.fromLocation || 'NAGPUR'}</div>
              <div style={{ padding: '16px 4px', borderRight: '1px solid #000', fontWeight: 'bold' }}>{invoiceData.toLocation || '-'}</div>
              <div style={{ padding: '16px 8px', textAlign: 'right', fontWeight: '900', fontSize: '14px' }}>{invoiceData.amount ? `₹ ${invoiceData.amount}` : ''}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', borderTop: '1.5px solid #000', borderBottom: '1px solid #000', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
              <div style={{ padding: '8px 12px', borderRight: '1px solid #000' }}>GST @ {invoiceData.gstRate}</div>
              <div style={{ padding: '8px 12px', textAlign: 'right' }}>{invoiceData.gstPayer}</div>
            </div>

            {/* Total in Words */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', borderBottom: '1.5px solid #000', padding: '10px 12px', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                Total Rs In Words: <span style={{ fontSize: '13px', fontWeight: '900', color: '#b91c1c' }}>{convertNumberToWords(invoiceData.amount) || '-'}</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '15px', fontWeight: '900', color: '#b91c1c' }}>
                TOTAL: {invoiceData.amount ? `₹ ${invoiceData.amount}` : ''}
              </div>
            </div>
          </div>

          <div style={{ padding: '6px 10px', fontSize: '8.5px', lineHeight: '1.3', border: '1px solid #000', marginTop: '12px', backgroundColor: '#fafafa' }}>
            We are registered for GST under the category of Goods Transport Agency vide Reverse Charge Mechanism and thus the recipient of our service is liable to pay GST on goods transport service vide Not. No. 13/2017 Dd. 28.06.2017
          </div>
        </div>

        {/* Signature Block */}
        <div style={{ padding: '12px 10px 0 10px' }}>
          <SignatureStampBlock />
        </div>
      </div>

      {/* Share / PDF Modal */}
      {isShareModalOpen && activeShareInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '480px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 900 }}>💬 Share Freight Bill #{activeShareInvoice.billNo}</h3>
            <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.88rem' }}>
              Client: <strong>{activeShareInvoice.clientName || 'N/A'}</strong> | Vehicle: <strong>{activeShareInvoice.carDetails || 'N/A'}</strong>
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

      {/* Delete Modal */}
      {deleteModalId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900 }}>Delete Freight Bill?</h3>
            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem' }}>Are you sure you want to delete Bill #{deleteModalId}?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={confirmDeleteInvoice} style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>YES, DELETE</button>
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
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Freight Bill Form</h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => handleOpenImportModal('pickups')} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem' }}>
              📦 FROM PICKUP
            </button>
            <button onClick={() => handleOpenImportModal('bilties')} style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem' }}>
              📄 FROM BILTY
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          
          {/* Bill Details */}
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800' }}>Bill & Route Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>BILL NO:</label>
                <input 
                  type="text" 
                  value={invoiceData.billNo} 
                  onChange={e => handleBillNoChange(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: isDuplicate ? '2px solid #ef4444' : '1px solid #ccc', fontWeight: 'bold', boxSizing: 'border-box' }} 
                />
                {isDuplicate && (
                  <span style={{ color: '#ef4444', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '2px', display: 'block' }}>⚠️ Bill #{invoiceData.billNo} already exists!</span>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>BILL DATE:</label>
                <input 
                  type="date" 
                  value={invoiceData.date} 
                  onChange={e => setInvoiceData({...invoiceData, date: e.target.value})} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />
              </div>

              <SearchableDropdown
                placeholder="FROM LOCATION"
                value={invoiceData.fromLocation}
                options={cityOptions}
                onChange={(val) => handleFromCityChange(val)}
              />

              <SearchableDropdown
                placeholder="TO LOCATION"
                value={invoiceData.toLocation}
                options={cityOptions}
                onChange={(val) => handleToCityChange(val)}
              />
            </div>
          </div>

          {/* Client Details */}
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#b91c1c' }}>Client / M/S Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="CLIENT NAME" value={invoiceData.clientName} onChange={e => setInvoiceData({...invoiceData, clientName: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="PHONE NUMBER" value={invoiceData.clientPhone} onChange={e => setInvoiceData({...invoiceData, clientPhone: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="text" placeholder="CLIENT ADDRESS" value={invoiceData.clientAddress} onChange={e => setInvoiceData({...invoiceData, clientAddress: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase', gridColumn: 'span 2' }} />
              <input type="text" placeholder="STATE" value={invoiceData.clientState} onChange={e => setInvoiceData({...invoiceData, clientState: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="PINCODE" value={invoiceData.clientPincode} onChange={e => setInvoiceData({...invoiceData, clientPincode: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          {/* LR & Vehicle Details */}
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>LR & Vehicle Info</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="LR NO." value={invoiceData.lrNo} onChange={e => setInvoiceData({...invoiceData, lrNo: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="date" value={invoiceData.lrDate} onChange={e => setInvoiceData({...invoiceData, lrDate: e.target.value})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px' }} />
              
              <SearchableDropdown
                placeholder="CAR NAME (E.G. CRETA)"
                value={invoiceData.carName}
                options={carOptions}
                onChange={(val) => handleCarFieldsChange('carName', val)}
              />

              <input type="text" placeholder="CAR NO. (MH31AB1234)" value={invoiceData.carNumber} onChange={e => handleCarFieldsChange('carNumber', e.target.value)} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} />
              <input type="text" placeholder="LORRY NO." value={invoiceData.lorryNo} onChange={e => setInvoiceData({...invoiceData, lorryNo: e.target.value.toUpperCase()})} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', gridColumn: 'span 2', textTransform: 'uppercase' }} />
            </div>
          </div>

          {/* Amount Details */}
          <div style={{ backgroundColor: '#fff', border: '1.5px solid #cbd5e1', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', fontWeight: '800', color: '#b91c1c' }}>Freight Charges (₹)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="AMOUNT (₹)" value={invoiceData.amount} onChange={e => handleAmountChange(e.target.value)} style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', fontWeight: 'bold' }} />
              <input type="text" placeholder="AMOUNT IN WORDS (AUTO)" value={convertNumberToWords(invoiceData.amount)} readOnly style={{ padding: '8px', fontSize: '0.82rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f8fafc', fontWeight: 'bold', color: '#b91c1c', gridColumn: 'span 2' }} />
            </div>
          </div>

        </div>

        <button 
          onClick={handleSaveInvoice} 
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
          {isDuplicate ? '⚠️ CANNOT SAVE DUPLICATE BILL' : '💾 SAVE & INSTANT SYNC INVOICE'}
        </button>
      </div>

      {/* Source Import Modal */}
      {isImportModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>📦 Import Details into Freight Bill</h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => handleOpenImportModal('pickups')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: importSourceTab === 'pickups' ? '#b91c1c' : '#e2e8f0', color: importSourceTab === 'pickups' ? '#fff' : '#475569', fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem' }}>PICKUPS</button>
                <button onClick={() => handleOpenImportModal('bilties')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: importSourceTab === 'bilties' ? '#b91c1c' : '#e2e8f0', color: importSourceTab === 'bilties' ? '#fff' : '#475569', fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem' }}>BILTIES</button>
              </div>
            </div>

            <input 
              type="text" 
              placeholder={`🔍 Search ${importSourceTab === 'pickups' ? 'car, party, pickup ID...' : 'LR No, client, car...'}`} 
              value={importSearch} 
              onChange={e => setImportSearch(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', marginBottom: '12px', boxSizing: 'border-box' }}
            />

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredImportItems.length > 0 ? (
                filteredImportItems.map((item) => {
                  const isSelected = selectedImportKey === item.uniqueKey;

                  return (
                    <label 
                      key={item.uniqueKey} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '6px', 
                        backgroundColor: isSelected ? '#f0f9ff' : '#f8fafc', 
                        border: isSelected ? '1px solid #38bdf8' : '1px solid #e2e8f0', 
                        cursor: 'pointer', fontSize: '0.88rem'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="importSelection"
                        checked={isSelected} 
                        onChange={() => setSelectedImportKey(item.uniqueKey)} 
                      />
                      <div style={{ flex: 1, textTransform: 'uppercase' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.carName || 'CAR'} ({item.carNumber || 'NO NUMBER'})</span>
                          <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 800 }}>{item.parentKey}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          Client: {item.clientName || '-'} | Route: {item.fromLocation || 'NAGPUR'} → {item.toLocation || '-'}
                        </div>
                      </div>
                    </label>
                  );
                })
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>No entries found matching search.</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleApplyImportedData} style={{ flex: 1, padding: '12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                ✅ IMPORT SELECTED ITEM
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