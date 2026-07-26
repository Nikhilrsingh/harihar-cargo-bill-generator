import React, { useState, useEffect } from 'react';
import { generateNextBillNo } from '../../utils/erpEngine';
import SourceImportSelector from '../../components/SourceImportSelector';

// Assets imported directly from src/assets
import logoLeft from '../../assets/logo-left.png';
import logoRight from '../../assets/right-logo.png';
import signImg from '../../assets/sign.png';

// City Suggestions List
const CITY_SUGGESTIONS = [
  'Nagpur', 'Pune', 'Mumbai', 'Delhi', 'Gurgaon', 'Bangalore', 'Chennai', 
  'Goa', 'Jabalpur', 'Raipur', 'Bhopal', 'Indore', 'Chandigarh', 'Ludhiana', 
  'Cochin', 'Ahmedabad', 'Jaipur', 'Kolkata', 'Lucknow', 'Bhubaneswar', 'Hyderabad'
];

// Popular Car Suggestions List
const CAR_SUGGESTIONS = [
  'Hyundai Creta', 'Maruti Swift', 'Tata Nexon', 'Mahindra Thar', 'Toyota Fortuner',
  'Kia Seltos', 'Honda City', 'BMW 3 Series', 'Mercedes-Benz C-Class', 'Audi A4',
  'Volkswagen Virtus', 'Skoda Slavia', 'MG Hector', 'Tata Harrier', 'Maruti Baleno'
];

export default function Invoices() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const [invoicesList, setInvoicesList] = useState(() => {
    const saved = localStorage.getItem('hcc_invoices_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [invoiceData, setInvoiceData] = useState({
    id: Date.now(),
    billNo: generateNextBillNo(),
    date: new Date().toLocaleDateString('en-GB'),
    clientName: '',
    clientAddress: '',
    lrNo: '',
    lrDate: new Date().toLocaleDateString('en-GB'),
    carName: '',
    carNumber: '',
    carDetails: '',
    lorryNo: '',
    fromLocation: '',
    toLocation: '',
    amount: '', // Starts completely empty
    gstRate: '0%',
    gstPayer: 'By Party',
    amountInWords: ''
  });

  useEffect(() => {
    localStorage.setItem('hcc_invoices_list', JSON.stringify(invoicesList));
  }, [invoicesList]);

  // Convert Number to Words Auto-calculator
  const convertNumberToWords = (amt) => {
    const num = parseInt(amt, 10);
    if (isNaN(num) || num === 0) return '';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
      let n_array = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n_array) return '';
      let str = '';
      str += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'Lakh ' : '';
      str += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'Thousand ' : '';
      str += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'Hundred ' : '';
      str += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + '' : '';
      str += (n_array[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) : '';
      return str;
    };
    const words = inWords(num);
    return words ? `${words.trim()} Rupees Only` : '';
  };

  const handleAmountChange = (val) => {
    setInvoiceData(prev => ({
      ...prev,
      amount: val,
      amountInWords: convertNumberToWords(val)
    }));
  };

  const handleCarFieldsChange = (field, value) => {
    setInvoiceData(prev => {
      const updated = { ...prev, [field]: value };
      const combined = [updated.carName, updated.carNumber].filter(Boolean).join(' - ');
      return { ...updated, carDetails: combined };
    });
  };

  const handleOpenNewInvoice = () => {
    setIsSelectorOpen(true);
  };

  const handleImportSelected = (importedData) => {
    const nextBill = generateNextBillNo();
    
    // Auto-extract Car Name & Car Number cleanly from any pickup or bilty object
    const name = importedData?.carName || importedData?.vehicleModel || importedData?.description || '';
    const number = importedData?.carNumber || importedData?.vehicleNumber || importedData?.carNo || importedData?.regNo || '';
    
    const combinedDetails = [name, number].filter(Boolean).join(' - ');

    const newInvoice = {
      id: Date.now(),
      billNo: nextBill,
      date: new Date().toLocaleDateString('en-GB'),
      clientName: importedData?.clientName || importedData?.consignorName || importedData?.partyName || '',
      clientAddress: importedData?.clientAddress || importedData?.consignorAddress || importedData?.address || '',
      lrNo: importedData?.lrNo || '',
      lrDate: importedData?.lrDate || importedData?.date || new Date().toLocaleDateString('en-GB'),
      carName: name,
      carNumber: number,
      carDetails: combinedDetails,
      lorryNo: importedData?.lorryNo || '',
      fromLocation: importedData?.fromLocation || '',
      toLocation: importedData?.toLocation || '',
      amount: '', // Left completely blank as requested
      gstRate: '0%',
      gstPayer: 'By Party',
      amountInWords: ''
    };
    setInvoiceData(newInvoice);
    setIsDrawerOpen(true);
  };

  const handleSaveInvoice = () => {
    setInvoicesList(prev => {
      const exists = prev.some(i => i.id === invoiceData.id);
      if (exists) {
        return prev.map(i => i.id === invoiceData.id ? invoiceData : i);
      }
      return [invoiceData, ...prev];
    });
    alert(`✅ Freight Bill #${invoiceData.billNo} Saved Successfully!`);
    setIsDrawerOpen(false);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f1f5f9', minHeight: '100vh', position: 'relative' }}>
      
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          body * { visibility: hidden !important; }
          .printable-bill-sheet, .printable-bill-sheet * { visibility: visible !important; }
          .printable-bill-sheet {
            position: fixed !important; left: 0 !important; top: 0 !important;
            width: 210mm !important; height: 297mm !important;
            margin: 0 !important; padding: 12mm 14mm !important; box-sizing: border-box !important;
            border: none !important; z-index: 99999 !important;
          }
        }
      `}</style>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }} className="no-print">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>🧾 Freight Bill / Invoice</h1>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>Harihar Cargo Carriers • Bill Sequence: #{invoiceData.billNo}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsDrawerOpen(true)} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            ✏️ Edit Bill Fields
          </button>
          <button onClick={handleOpenNewInvoice} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            + New Bill
          </button>
          <button onClick={() => window.print()} style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
            🖨️ Print Freight Bill
          </button>
        </div>
      </div>

      {/* A4 Portrait Printable Sheet */}
      <div className="printable-bill-sheet" style={{
        width: '210mm', minHeight: '285mm', margin: '0 auto', backgroundColor: '#ffffff',
        border: '2px solid #000', padding: '18px 22px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#000'
      }}>
        <div>
          <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
            SUBJECT TO NAGPUR JURISDICTION ONLY
          </div>

          {/* Business Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <img src={logoLeft} alt="Logo Left" style={{ width: '115px', height: 'auto' }} />
            <div style={{ textAlign: 'center', flex: 1, padding: '0 10px' }}>
              <h1 style={{ margin: 0, fontSize: '33px', fontWeight: '900', color: '#b91c1c' }}>HARIHAR CARGO CARRIERS</h1>
              <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '12.5px', margin: '2px 0' }}>FLEET OWNER & TRANSPORT CONTRACTOR</div>
              <div style={{ fontSize: '11px', color: '#1e293b', fontWeight: '700' }}>H.O: Plot No.19, Shivshakti Nagar, Opp Wadi Police Station, Amravati Road Nagpur 440023</div>
              <div style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: 'bold', margin: '2px 0' }}>Mob: 9372693389, 7972409656 Email: hariharcarcarrier@gmail.com</div>
              <div style={{ display: 'inline-block', border: '1.5px solid #000', padding: '2px 18px', marginTop: '3px' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#b91c1c' }}>GST No: 27AWOPR8730N2ZI</span>
              </div>
            </div>
            <img src={logoRight} alt="Logo Right" style={{ width: '120px', height: 'auto' }} />
          </div>

          {/* Bill No & Date (DATE IN RED) */}
          <div style={{ border: '2px solid #000', display: 'flex', justifyContent: 'space-between', padding: '8px 14px', fontSize: '14px', fontWeight: 'bold', marginBottom: '14px', backgroundColor: '#f8fafc' }}>
            <div>BILL NO: <span style={{ color: '#b91c1c', fontSize: '16px', fontWeight: '900' }}>#{invoiceData.billNo}</span></div>
            <div>DATE: <span style={{ color: '#b91c1c', fontSize: '15px', fontWeight: '900' }}>{invoiceData.date}</span></div>
          </div>

          {/* Client Details Block */}
          <div style={{ border: '2px solid #000', padding: '12px 16px', marginBottom: '16px', minHeight: '80px' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 'bold' }}>M/S: <span style={{ fontSize: '16px', fontWeight: '900' }}>{invoiceData.clientName}</span></div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Address: {invoiceData.clientAddress}</div>
          </div>

          {/* Table Grid */}
          <div style={{ border: '2px solid #000' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1.6fr 1.1fr 1fr 1fr 1.2fr', borderBottom: '2px solid #000', fontSize: '11.5px', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ padding: '10px 4px', borderRight: '1.5px solid #000' }}>LR NO.</div>
              <div style={{ padding: '10px 4px', borderRight: '1.5px solid #000' }}>Date</div>
              <div style={{ padding: '10px 4px', borderRight: '1.5px solid #000' }}>CAR DETAILS</div>
              <div style={{ padding: '10px 4px', borderRight: '1.5px solid #000' }}>LORRY NO.</div>
              <div style={{ padding: '10px 4px', borderRight: '1.5px solid #000' }}>FROM</div>
              <div style={{ padding: '10px 4px', borderRight: '1.5px solid #000' }}>TO</div>
              <div style={{ padding: '10px 4px' }}>AMOUNT</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1.6fr 1.1fr 1fr 1fr 1.2fr', minHeight: '460px', fontSize: '13px', textAlign: 'center' }}>
              <div style={{ padding: '20px 4px', borderRight: '1.5px solid #000', fontWeight: '900', color: '#b91c1c' }}>{invoiceData.lrNo}</div>
              <div style={{ padding: '20px 4px', borderRight: '1.5px solid #000', fontWeight: 'bold', color: '#b91c1c' }}>{invoiceData.lrDate}</div>
              <div style={{ padding: '20px 6px', borderRight: '1.5px solid #000', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>{invoiceData.carDetails}</div>
              <div style={{ padding: '20px 4px', borderRight: '1.5px solid #000', fontWeight: '800' }}>{invoiceData.lorryNo}</div>
              <div style={{ padding: '20px 4px', borderRight: '1.5px solid #000', fontWeight: 'bold' }}>{invoiceData.fromLocation}</div>
              <div style={{ padding: '20px 4px', borderRight: '1.5px solid #000', fontWeight: 'bold' }}>{invoiceData.toLocation}</div>
              <div style={{ padding: '20px 8px', textAlign: 'right', fontWeight: '900', fontSize: '15px' }}>{invoiceData.amount ? `₹ ${invoiceData.amount}` : ''}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', borderTop: '2px solid #000', borderBottom: '1.5px solid #000', fontSize: '13px', fontWeight: 'bold', backgroundColor: '#fafafa' }}>
              <div style={{ padding: '10px 14px', borderRight: '1.5px solid #000' }}>GST @ {invoiceData.gstRate}</div>
              <div style={{ padding: '10px 14px', textAlign: 'right' }}>{invoiceData.gstPayer}</div>
            </div>

            {/* TOTAL IN WORDS STYLED IN RED */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', borderBottom: '2px solid #000', padding: '12px 14px', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                Total Rs In Words: <span style={{ fontSize: '14px', fontWeight: '900', color: '#b91c1c' }}>{invoiceData.amountInWords}</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: '900', color: '#b91c1c' }}>
                TOTAL: {invoiceData.amount ? `₹ ${invoiceData.amount}` : ''}
              </div>
            </div>
          </div>

          <div style={{ padding: '8px 12px', fontSize: '9.5px', lineHeight: '1.4', border: '1px solid #000', marginTop: '16px', backgroundColor: '#fafafa' }}>
            We are registered for GST under the category of Goods Transport Agency vide Reverse Charge Mechanism and thus the recipient of our service is liable to pay GST on goods transport service vide Not. No. 13/2017 Dd. 28.06.2017
          </div>
        </div>

        {/* Footer with Signature and Stamp */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: '20px' }}>
          <div style={{ textAlign: 'center', position: 'relative', width: '260px' }}>
            <div style={{ position: 'absolute', right: '60px', bottom: '16px', zIndex: 1 }}>
              <img src={signImg} alt="Authorized Signature" style={{ width: '125px', height: 'auto', mixBlendMode: 'multiply' }} />
            </div>

            <div style={{ 
              position: 'absolute', 
              right: '25px', 
              bottom: '10px', 
              border: '2.5px solid #1e40af', 
              color: '#1e40af', 
              padding: '6px 14px', 
              borderRadius: '4px', 
              transform: 'rotate(-5deg)',
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              fontWeight: '900',
              fontSize: '11px',
              textAlign: 'center',
              lineHeight: '1.25',
              zIndex: 2,
              boxShadow: '0 0 4px rgba(30,64,175,0.1)'
            }}>
              HARIHAR CARGO CARRIERS<br />
              <span style={{ fontSize: '9.5px', letterSpacing: '0.5px' }}>★ AUTHORIZED ★</span>
            </div>

            <div style={{ fontSize: '12px', fontWeight: '900', color: '#b91c1c', marginBottom: '50px' }}>
              FOR HARIHAR CARGO CARRIERS
            </div>

            <div style={{ borderTop: '1.5px solid #000', paddingTop: '4px', fontSize: '11px', fontWeight: 'bold' }}>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>

      {/* Edit Drawer Modal */}
      {isDrawerOpen && (
        <div onClick={() => setIsDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 998 }} className="no-print" />
      )}

      <div className="no-print" style={{
        position: 'fixed', top: 0, right: isDrawerOpen ? 0 : '-460px', width: '420px', height: '100vh',
        backgroundColor: '#fff', boxShadow: '-4px 0 25px rgba(0,0,0,0.15)', zIndex: 999, transition: 'right 0.3s ease',
        display: 'flex', flexDirection: 'column', padding: '20px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800 }}>Edit Freight Bill Details</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Bill No: 
              <input type="text" value={invoiceData.billNo} onChange={e => setInvoiceData({...invoiceData, billNo: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Bill Date: 
              <input type="text" value={invoiceData.date} onChange={e => setInvoiceData({...invoiceData, date: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
          </div>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Client Name: 
            <input type="text" value={invoiceData.clientName} onChange={e => setInvoiceData({...invoiceData, clientName: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Client Address: 
            <input type="text" value={invoiceData.clientAddress} onChange={e => setInvoiceData({...invoiceData, clientAddress: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              LR No: 
              <input type="text" value={invoiceData.lrNo} onChange={e => setInvoiceData({...invoiceData, lrNo: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              LR Date: 
              <input type="text" value={invoiceData.lrDate} onChange={e => setInvoiceData({...invoiceData, lrDate: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </label>
          </div>

          {/* Car Name & Car Number Inputs with Scrollable Dropdown Suggestions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Car Name: 
              <input 
                list="car-suggestions-list"
                type="text" 
                placeholder="e.g. BMW" 
                value={invoiceData.carName} 
                onChange={e => handleCarFieldsChange('carName', e.target.value)} 
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
                value={invoiceData.carNumber} 
                onChange={e => handleCarFieldsChange('carNumber', e.target.value)} 
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
            </label>
          </div>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Lorry No: 
            <input type="text" value={invoiceData.lorryNo} onChange={e => setInvoiceData({...invoiceData, lorryNo: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          {/* Location Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              From Station:
              <input 
                list="from-cities-list" 
                value={invoiceData.fromLocation} 
                onChange={e => setInvoiceData({...invoiceData, fromLocation: e.target.value})} 
                placeholder="Select or Type"
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
              <datalist id="from-cities-list">
                {CITY_SUGGESTIONS.map(city => <option key={city} value={city} />)}
              </datalist>
            </label>

            <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              To Station:
              <input 
                list="to-cities-list" 
                value={invoiceData.toLocation} 
                onChange={e => setInvoiceData({...invoiceData, toLocation: e.target.value})} 
                placeholder="Select or Type"
                style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
              <datalist id="to-cities-list">
                {CITY_SUGGESTIONS.map(city => <option key={city} value={city} />)}
              </datalist>
            </label>
          </div>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Amount (₹): 
            <input type="text" placeholder="Enter amount..." value={invoiceData.amount} onChange={e => handleAmountChange(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
            Total in Words (Auto-filled): 
            <input type="text" value={invoiceData.amountInWords} onChange={e => setInvoiceData({...invoiceData, amountInWords: e.target.value})} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f8fafc', color: '#b91c1c', fontWeight: 'bold' }} />
          </label>

        </div>

        <button onClick={handleSaveInvoice} style={{ padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, marginTop: '10px', cursor: 'pointer' }}>
          💾 Save Freight Bill
        </button>
      </div>

      <SourceImportSelector isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} onImportSelected={handleImportSelected} />

    </div>
  );
}