import React, { useState, useEffect } from 'react';
import { generateNextBiltyNo } from '../../utils/erpEngine';
import SourceImportSelector from '../../components/SourceImportSelector';

// Assets imported directly from src/assets
import logoLeft from '../../assets/logo-left.png';
import logoRight from '../../assets/right-logo.png';
import signImg from '../../assets/sign.png';

export default function Bilties() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  
  // Pickups List from localStorage for selection option
  const [pickupsList, setPickupsList] = useState(() => {
    const saved = localStorage.getItem('hcc_pickups_list');
    return saved ? JSON.parse(saved) : [];
  });

  // Bilties List stored in localStorage
  const [biltiesList, setBiltiesList] = useState(() => {
    const saved = localStorage.getItem('hcc_bilties_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [biltyData, setBiltyData] = useState({
    id: Date.now(),
    lrNo: generateNextBiltyNo(),
    date: new Date().toLocaleDateString('en-GB'),
    consignorName: '',
    consignorAddress: '',
    consigneeName: '',
    consigneeAddress: '',
    fromLocation: '',
    toLocation: '',
    noOfPkg: '1',
    carName: '',
    carNumber: '',
    lorryNo: '',
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

  // Auto-sync with localStorage
  useEffect(() => {
    localStorage.setItem('hcc_current_bilty', JSON.stringify(biltyData));
  }, [biltyData]);

  useEffect(() => {
    localStorage.setItem('hcc_bilties_list', JSON.stringify(biltiesList));
  }, [biltiesList]);

  const autoFillFromPickup = (p) => {
    const newData = {
      ...biltyData,
      id: Date.now(),
      lrNo: generateNextBiltyNo(),
      consignorName: p.clientName || p.partyName || p.consignorName || biltyData.consignorName,
      consignorAddress: p.address || p.fromLocation || p.consignorAddress || biltyData.consignorAddress,
      consigneeName: p.consigneeName || p.clientName || biltyData.consigneeName,
      consigneeAddress: p.toLocation || p.consigneeAddress || biltyData.consigneeAddress,
      fromLocation: p.fromLocation || biltyData.fromLocation,
      toLocation: p.toLocation || biltyData.toLocation,
      carName: p.vehicleModel || p.carName || biltyData.carName,
      carNumber: p.vehicleNumber || p.carNumber || biltyData.carNumber,
      noOfPkg: '1',
      packerName: p.packerName || biltyData.packerName,
      declaredValue: p.estimatedCost || p.carValue || biltyData.declaredValue,
      freight: p.estimatedCost || biltyData.freight
    };
    setBiltyData(newData);
  };

  const handleSelectPickup = (pickupId) => {
    const selected = pickupsList.find(p => String(p.id) === String(pickupId));
    if (selected) {
      autoFillFromPickup(selected);
    }
  };

  const handleImportSelected = (importedData) => {
    if (importedData) {
      autoFillFromPickup(importedData);
    } else {
      handleCreateNewBilty();
    }
    setIsDrawerOpen(true);
  };

  const handleSaveBilty = () => {
    setBiltiesList(prev => {
      const exists = prev.some(b => b.id === biltyData.id);
      if (exists) {
        return prev.map(b => b.id === biltyData.id ? biltyData : b);
      }
      return [biltyData, ...prev];
    });
    alert(`✅ Bilty / LR #${biltyData.lrNo} saved successfully!`);
    setIsDrawerOpen(false);
  };

  const handleLoadSavedBilty = (b) => {
    setBiltyData(b);
    setIsDrawerOpen(true);
  };

  const handleDeleteBilty = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this saved Bilty?")) {
      setBiltiesList(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleCreateNewBilty = () => {
    const nextLr = generateNextBiltyNo();
    const newB = {
      id: Date.now(),
      lrNo: nextLr,
      date: new Date().toLocaleDateString('en-GB'),
      consignorName: '', consignorAddress: '', consigneeName: '', consigneeAddress: '',
      fromLocation: '', toLocation: '', noOfPkg: '1', carName: '', carNumber: '',
      lorryNo: '', declaredValue: '', insuranceBy: 'By Party',
      freight: 'Fixed', handlingCharges: '', doorCollection: '', doorDelivery: '',
      staticalCharges: '', gst: '', total: 'To Be Billed', bookingType: 'TO BE BILLED',
      packerName: '', officialSign: 'Rajesh Singh'
    };
    setBiltyData(newB);
  };

  const handleShareWhatsApp = () => {
    const text = `🚚 *HARIHAR CARGO CARRIERS - BILTY DETAILS*\n\n` +
      `*LR No:* ${biltyData.lrNo} | *Date:* ${biltyData.date}\n` +
      `*From:* ${biltyData.fromLocation} -> *To:* ${biltyData.toLocation}\n` +
      `-----------------------------\n` +
      `*Consignor:* ${biltyData.consignorName} (${biltyData.consignorAddress})\n` +
      `*Consignee:* ${biltyData.consigneeName} (${biltyData.consigneeAddress})\n` +
      `-----------------------------\n` +
      `*Vehicle:* ${biltyData.carName} (${biltyData.carNumber})\n` +
      `*Lorry No:* ${biltyData.lorryNo}\n` +
      `*Booking:* ${biltyData.bookingType} | *Total:* ${biltyData.total}\n\n` +
      `For queries contact: 9372693389 / 7972409656`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f1f5f9', minHeight: '100vh', position: 'relative' }}>
      
      {/* FULL-PAGE PRINT OVERRIDES WITH SHIFTED DOWN MARGIN */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          .printable-bilty-sheet, .printable-bilty-sheet * {
            visibility: visible !important;
          }
          .printable-bilty-sheet {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 18mm 10mm 10mm 10mm !important; /* Shifts block down */
            box-sizing: border-box !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            z-index: 999999 !important;
          }
        }
      `}</style>

      {/* Top Header Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} className="no-print">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>📄 Consignment Note (Bilty)</h1>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Harihar Cargo Carriers - Saved Bilties: {biltiesList.length}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleShareWhatsApp} 
            style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📲 Share / WhatsApp
          </button>
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            ✏️ Edit / Select
          </button>
          <button 
            onClick={() => setIsSelectorOpen(true)} 
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}
          >
            + New Bilty
          </button>
          <button 
            onClick={() => window.print()} 
            style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            📥 Print / Download PDF
          </button>
        </div>
      </div>

      {/* PRINT-READY FULL-PAGE A4 LANDSCAPE SHEET */}
      <div className="printable-bilty-sheet" style={{
        width: '282mm',
        height: '198mm',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        padding: '14px 16px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between'
      }}>
        
        <div>
          {/* Top Jurisdiction Header */}
          <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>
            SUBJECT TO NAGPUR JURISDICTION ONLY
          </div>

          {/* Branding Block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            
            {/* Left Logo */}
            <div style={{ width: '135px', textAlign: 'center' }}>
              <img 
                src={logoLeft} 
                alt="Harihar Cargo Carriers Logo" 
                style={{ width: '125px', height: 'auto', objectFit: 'contain' }} 
              />
            </div>

            {/* Business Details */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: '38px', fontWeight: '900', color: '#b91c1c', letterSpacing: '1px' }}>
                HARIHAR CARGO CARRIERS
              </h1>
              <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '14px', margin: '2px 0' }}>
                FLEET OWNER & TRANSPORT CONTRACTOR
              </div>
              <div style={{ fontSize: '11.5px', color: '#1e293b', fontWeight: '700' }}>
                H.O: PLOT NO.19, SHIVSHAKTI NAGAR, OPP WADI POLICE STATION AMRAVATI ROAD NAGPUR 440023
              </div>
              <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', margin: '3px 0' }}>
                MOB NO. <span style={{ color: '#2563eb' }}>9372693389, 7972409656</span> EMAIL: <span style={{ textDecoration: 'underline' }}>HARIHARCARCARRIER@GMAIL.COM</span>
              </div>
              
              {/* GST Badge */}
              <div style={{ display: 'inline-block', border: '1.5px solid #000', padding: '2px 18px', marginTop: '2px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '900', color: '#b91c1c' }}>GST No: 27AWOPR8730N2ZI</span>
              </div>
            </div>

            {/* Right Logo */}
            <div style={{ width: '160px', textAlign: 'right' }}>
              <img 
                src={logoRight} 
                alt="Car Transport Trailer" 
                style={{ width: '155px', height: 'auto', objectFit: 'contain' }} 
              />
            </div>
          </div>

          {/* Outer Table Grid */}
          <div style={{ border: '2px solid #000' }}>
            
            {/* Branches List */}
            <div style={{ borderBottom: '1.5px solid #000', padding: '4px 8px', fontSize: '10px', fontWeight: 'bold', lineHeight: '1.2' }}>
              BRANCHES: PUNE, GURGAON, BANGLORE, CHENNAI, GOA, MUMBAI, JABALPUR, RAIPUR, BHOPAL, INDORE, CHANDIGARH, LUDHIANA, COCHIN, AHMEDABAD, JAIPUR, KOLKATA, LUCKNOW, BHUBANESWAR, HYDERABAD.
            </div>

            {/* Consignor / Consignee split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1.5px solid #000' }}>
              <div style={{ padding: '8px 12px', borderRight: '1.5px solid #000', minHeight: '60px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline', marginBottom: '4px' }}>CONSIGNOR</div>
                <div style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                  <strong>NAME:</strong> <span style={{ fontWeight: '900', fontSize: '13px' }}>{biltyData.consignorName}</span><br />
                  <strong>ADDRESS:</strong> {biltyData.consignorAddress}
                </div>
              </div>
              <div style={{ padding: '8px 12px', minHeight: '60px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline', marginBottom: '4px' }}>CONSIGNEE</div>
                <div style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                  <strong>NAME:</strong> <span style={{ fontWeight: '900', fontSize: '13px' }}>{biltyData.consigneeName}</span><br />
                  <strong>ADDRESS:</strong> {biltyData.consigneeAddress}
                </div>
              </div>
            </div>

            {/* LR NO / DATE / FROM / TO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', borderBottom: '1.5px solid #000', fontSize: '13px', fontWeight: 'bold' }}>
              <div style={{ padding: '6px 12px', borderRight: '1.5px solid #000' }}>
                LR NO: <span style={{ color: '#b91c1c', fontSize: '14px', fontWeight: '900' }}>{biltyData.lrNo}</span>
              </div>
              <div style={{ padding: '6px 12px', borderRight: '1.5px solid #000' }}>
                DATE: <span style={{ fontSize: '13px' }}>{biltyData.date}</span>
              </div>
              <div style={{ padding: '6px 12px', borderRight: '1.5px solid #000' }}>
                FROM: <span style={{ color: '#b91c1c', fontSize: '13.5px', fontWeight: 'bold' }}>{biltyData.fromLocation}</span>
              </div>
              <div style={{ padding: '6px 12px' }}>
                TO: <span style={{ color: '#b91c1c', fontSize: '13.5px', fontWeight: 'bold' }}>{biltyData.toLocation}</span>
              </div>
            </div>

            {/* Table Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 320px', borderBottom: '1.5px solid #000', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
              <div style={{ padding: '6px', borderRight: '1.5px solid #000' }}>No of Pkg</div>
              <div style={{ padding: '6px', borderRight: '1.5px solid #000' }}>DESCRIPTION (SAID TO CONTAIN)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ borderRight: '1.5px solid #000', padding: '6px' }}>CHARGES</div>
                <div style={{ padding: '6px' }}>AMOUNT RS</div>
              </div>
            </div>

            {/* Description Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 320px', minHeight: '230px', fontSize: '12px' }}>
              
              {/* No of Pkg */}
              <div style={{ padding: '12px', borderRight: '1.5px solid #000', textAlign: 'center', fontWeight: '900', fontSize: '14px' }}>
                {biltyData.noOfPkg || '1'}
              </div>

              {/* Car Name & Car Number */}
              <div style={{ padding: '14px 18px', borderRight: '1.5px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '15px', marginBottom: '8px', color: '#0f172a' }}>
                    Car Name: <span style={{ textTransform: 'uppercase' }}>{biltyData.carName}</span>
                  </div>
                  
                  <div style={{ fontSize: '14px', fontWeight: '800', margin: '6px 0', color: '#1e293b' }}>
                    Car Number: <span style={{ textTransform: 'uppercase' }}>{biltyData.carNumber}</span>
                  </div>
                </div>

                {/* Lorry No Box */}
                <div style={{ margin: '10px 0' }}>
                  <span style={{ border: '2px solid #2563eb', padding: '6px 16px', fontWeight: '900', color: '#1e3a8a', fontSize: '13px', borderRadius: '3px' }}>
                    LORRY NO: {biltyData.lorryNo}
                  </span>
                </div>
              </div>

              {/* Charges Column + Basic of Booking Block */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '11px' }}>
                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 8px', fontWeight: 'bold' }}>FREIGHT</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '5px 8px', textAlign: 'right', fontWeight: 'bold' }}>{biltyData.freight}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 8px', fontWeight: 'bold' }}>HANDLING CHARGES</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '5px 8px', textAlign: 'right' }}>{biltyData.handlingCharges}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 8px', fontWeight: 'bold' }}>DOOR COLLECTION</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '5px 8px', textAlign: 'right' }}>{biltyData.doorCollection}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 8px', fontWeight: 'bold' }}>DOOR DELIVERY</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '5px 8px', textAlign: 'right' }}>{biltyData.doorDelivery}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 8px', fontWeight: 'bold' }}>STATICAL CHARGES</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '5px 8px', textAlign: 'right' }}>{biltyData.staticalCharges}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 8px', fontWeight: 'bold' }}>GST</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '5px 8px', textAlign: 'right' }}>{biltyData.gst}</div>

                  <div style={{ borderRight: '1px solid #000', borderBottom: '1px solid #000', padding: '5px 8px', fontWeight: '900', fontSize: '12px' }}>TOTAL</div>
                  <div style={{ borderBottom: '1px solid #000', padding: '5px 8px', textAlign: 'right', fontWeight: '900', fontSize: '12px' }}>{biltyData.total}</div>
                </div>

                {/* BASIC OF BOOKING shifted directly under TOTAL */}
                <div style={{ padding: '6px 8px', fontSize: '10.5px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                  <div style={{ textDecoration: 'underline', marginBottom: '4px', fontSize: '11px' }}>BASIC OF BOOKING:</div>
                  [{biltyData.bookingType === 'TO PAY' ? 'X' : ' '}] TO PAY &nbsp; 
                  [{biltyData.bookingType === 'PAID' ? 'X' : ' '}] PAID <br />
                  [{biltyData.bookingType === 'TO BE BILLED' ? 'X' : ' '}] TO BE BILLED
                </div>
              </div>

            </div>

            {/* Declared Value */}
            <div style={{ borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <div>
                <strong>DECLARED VALUE OF GOODS:</strong> <span style={{ color: '#b91c1c', fontWeight: '900', fontSize: '13px' }}>{biltyData.declaredValue}</span><br />
                <span>INSURANCE:</span>
              </div>
              <div style={{ alignSelf: 'flex-end', fontWeight: 'bold', fontSize: '12px' }}>
                {biltyData.insuranceBy}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ padding: '4px 12px', fontSize: '9px', borderBottom: '1px solid #000' }}>
              We are registered for GST under the category of Goods Transport Agency vide Reverse Charge Mechanism and thus the recipient of our service is liable to pay GST on goods transport service vide Not. No. 13/2017 Dd. 28.06.2017
            </div>

            {/* Signatures & Stamp Footer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '24px 50px 10px 50px', alignItems: 'end' }}>
              
              {/* Packer Name / Consignor */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {biltyData.packerName}
                </div>
                <div style={{ borderTop: '1px solid #000', width: '70%', margin: '0 auto', paddingTop: '3px', fontSize: '10px', fontWeight: 'bold' }}>
                  NAME OF CONSIGNOR
                </div>
              </div>

              {/* Official Signature with Stamp on Top */}
              <div style={{ textAlign: 'center', position: 'relative' }}>
                
                {/* Signature Image Behind Stamp */}
                <div style={{ position: 'absolute', right: '60px', bottom: '12px', zIndex: 1 }}>
                  <img src={signImg} alt="Authorized Signature" style={{ width: '130px', height: 'auto', mixBlendMode: 'multiply' }} />
                </div>

                {/* Blue Authorized Stamp Overlay On Top */}
                <div style={{ 
                  position: 'absolute', 
                  right: '20px', 
                  bottom: '6px', 
                  border: '2.5px solid #1e40af', 
                  color: '#1e40af', 
                  padding: '6px 14px', 
                  borderRadius: '4px', 
                  transform: 'rotate(-5deg)',
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  fontWeight: '900',
                  fontSize: '11.5px',
                  textAlign: 'center',
                  lineHeight: '1.25',
                  zIndex: 2,
                  boxShadow: '0 0 4px rgba(30,64,175,0.1)'
                }}>
                  HARIHAR CARGO CARRIERS<br />
                  <span style={{ fontSize: '10px', letterSpacing: '0.5px' }}>★ AUTHORIZED ★</span>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                  {biltyData.officialSign}
                </div>
                <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '3px', fontSize: '10px', fontWeight: 'bold' }}>
                  NAME & SIGNATURE OF BOOKING OFFICIAL
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Edit & Pickups Drawer Modal */}
      {isDrawerOpen && (
        <div onClick={() => setIsDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 999 }} className="no-print" />
      )}

      <div className="no-print" style={{
        position: 'fixed',
        top: 0,
        right: isDrawerOpen ? 0 : '-500px',
        width: '450px',
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
        zIndex: 1000,
        transition: 'right 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Edit Bilty & Select Pickup</h2>
          <button onClick={() => setIsDrawerOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>

        <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* OPTION TO AUTO-FILL FROM PICKUPS */}
          <div style={{ backgroundColor: '#eff6ff', padding: '10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e40af', display: 'block', marginBottom: '4px' }}>
              📌 Select From Saved Pickups:
            </label>
            <select 
              onChange={e => handleSelectPickup(e.target.value)} 
              defaultValue=""
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #93c5fd', fontSize: '0.85rem' }}
            >
              <option value="" disabled>-- Select a Pickup to Auto-fill --</option>
              {pickupsList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.clientName || p.partyName || p.consignorName || 'Pickup'} ({p.vehicleModel || p.carName} - {p.vehicleNumber || p.carNumber})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>LR NO</label>
              <input type="text" value={biltyData.lrNo} onChange={e => setBiltyData({...biltyData, lrNo: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>DATE</label>
              <input type="text" value={biltyData.date} onChange={e => setBiltyData({...biltyData, date: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>FROM</label>
              <input type="text" value={biltyData.fromLocation} onChange={e => setBiltyData({...biltyData, fromLocation: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>TO</label>
              <input type="text" value={biltyData.toLocation} onChange={e => setBiltyData({...biltyData, toLocation: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Consignor Name & Address</label>
            <input type="text" placeholder="Name" value={biltyData.consignorName} onChange={e => setBiltyData({...biltyData, consignorName: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '4px' }} />
            <input type="text" placeholder="Address" value={biltyData.consignorAddress} onChange={e => setBiltyData({...biltyData, consignorAddress: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Consignee Name & Address</label>
            <input type="text" placeholder="Name" value={biltyData.consigneeName} onChange={e => setBiltyData({...biltyData, consigneeName: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '4px' }} />
            <input type="text" placeholder="Address" value={biltyData.consigneeAddress} onChange={e => setBiltyData({...biltyData, consigneeAddress: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>No of Pkg</label>
              <input type="text" placeholder="Defaults to 1" value={biltyData.noOfPkg} onChange={e => setBiltyData({...biltyData, noOfPkg: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Lorry No</label>
              <input type="text" value={biltyData.lorryNo} onChange={e => setBiltyData({...biltyData, lorryNo: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Car Name</label>
              <input type="text" value={biltyData.carName} onChange={e => setBiltyData({...biltyData, carName: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Car Number</label>
              <input type="text" value={biltyData.carNumber} onChange={e => setBiltyData({...biltyData, carNumber: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Packer Name</label>
              <input type="text" value={biltyData.packerName} onChange={e => setBiltyData({...biltyData, packerName: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Declared Value</label>
              <input type="text" value={biltyData.declaredValue} onChange={e => setBiltyData({...biltyData, declaredValue: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Booking Type</label>
            <select value={biltyData.bookingType} onChange={e => setBiltyData({...biltyData, bookingType: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="TO BE BILLED">TO BE BILLED</option>
              <option value="TO PAY">TO PAY</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          {/* LIST OF SAVED BILTIES */}
          {biltiesList.length > 0 && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                📁 Saved Bilties History ({biltiesList.length}):
              </label>
              <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {biltiesList.map((b) => (
                  <div 
                    key={b.id} 
                    onClick={() => handleLoadSavedBilty(b)}
                    style={{ 
                      padding: '8px 10px', 
                      backgroundColor: b.id === biltyData.id ? '#f0f9ff' : '#f8fafc', 
                      border: b.id === biltyData.id ? '1px solid #0284c7' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>LR #{b.lrNo}</strong> - <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{b.carName} ({b.carNumber})</span>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteBilty(b.id, e)} 
                      style={{ border: 'none', background: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button 
              type="button" 
              onClick={handleSaveBilty} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              💾 Save Bilty
            </button>
          </div>

        </div>
      </div>

      <SourceImportSelector isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} onImportSelected={handleImportSelected} />

    </div>
  );
}