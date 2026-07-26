import React from 'react';

export default function BillPrint({ data }) {
  if (!data) return null;

  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '15mm',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#000000',
      boxSizing: 'border-box',
      border: '1px solid #ccc',
      margin: '0 auto'
    }}>
      <div style={{ fontSize: '10px', fontWeight: 'bold' }}>
        SUBJECT TO NAGPUR JURISDICTION ONLY[cite: 2]
      </div>

      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '8px', marginTop: '4px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900' }}>HARIHAR CARGO CARRIERS</h1>[cite: 2]
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>FLEET OWNER & TRANSPORT CONTRACTOR</div>[cite: 2]
        <div style={{ fontSize: '10px' }}>H.O: Plot No.19, Shivshakti Nagar, Opp Wadi Police Station, Amravati Road Nagpur 440023</div>[cite: 2]
        <div style={{ fontSize: '10px' }}>Mob: 9372693389, 7972409656 | Email: hariharcarcarrier@gmail.com</div>[cite: 2]
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>GST No: 27AWOPR8730N2ZI</div>[cite: 2]
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderBottom: '1px solid #000', paddingBottom: '8px' }}>
        <div>
          <strong>M/S:</strong> {data.partyName || ''}<br />[cite: 2]
          <strong>Address:</strong> {data.partyAddress || ''}[cite: 2]
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong>Bill No:</strong> {data.billNumber || '7896'}<br />[cite: 2]
          <strong>Date:</strong> {data.date || new Date().toISOString().split('T')[0]}[cite: 2]
        </div>
      </div>

      {/* Particulars Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', border: '1px solid #000' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #000' }}>
            <th style={{ padding: '6px', borderRight: '1px solid #000' }}>LR NO.</th>[cite: 2]
            <th style={{ padding: '6px', borderRight: '1px solid #000' }}>DATE</th>[cite: 2]
            <th style={{ padding: '6px', borderRight: '1px solid #000' }}>INVOICE NO.</th>[cite: 2]
            <th style={{ padding: '6px', borderRight: '1px solid #000' }}>LORRY NO.</th>[cite: 2]
            <th style={{ padding: '6px', borderRight: '1px solid #000' }}>FROM</th>[cite: 2]
            <th style={{ padding: '6px', borderRight: '1px solid #000' }}>TO</th>[cite: 2]
            <th style={{ padding: '6px', textAlign: 'right' }}>AMOUNT</th>[cite: 2]
          </tr>
        </thead>
        <tbody>
          <tr style={{ height: '180px', verticalAlign: 'top' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>{data.lrNumber || '-'}</td>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>{data.date || '-'}</td>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>{data.invoiceNo || '-'}</td>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>{data.carNumber || '-'}</td>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>{data.fromLocation || '-'}</td>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>{data.toLocation || '-'}</td>
            <td style={{ padding: '6px', textAlign: 'right' }}>₹ {data.amount || '0.00'}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #000', borderTop: 'none', padding: '8px' }}>
        <div>
          <div><strong>GST @ 0%</strong> (Reverse Charge Mechanism)</div>[cite: 2]
          <div style={{ marginTop: '8px' }}><strong>Total Rs In Words:</strong> {data.amountInWords || 'Nill'}</div>[cite: 2]
        </div>
        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
          TOTAL: ₹ {data.amount || '0.00'}[cite: 2]
        </div>
      </div>

      <p style={{ fontSize: '9px', marginTop: '10px' }}>
        We are registered for GST under the category of Goods Transport Agency vide Reverse Charge Mechanism and thus the recipient of our service is liable to pay GST on goods transport service vide Not. No. 13/2017 Dd. 28.06.2017[cite: 2]
      </p>

      {/* UPDATED STAMP & SIGNATURE SECTION */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
        <div style={{ textAlign: 'center', width: '240px' }}>
          <div style={{
            border: '2px dashed #1e3a8a',
            borderRadius: '50%',
            width: '85px',
            height: '85px',
            margin: '0 auto 4px auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#1e3a8a',
            fontSize: '8px',
            fontWeight: 'bold',
            transform: 'rotate(-5deg)'
          }}>
            <div>HARIHAR CARGO</div>[cite: 1]
            <div>CARRIERS</div>[cite: 1]
            <div style={{ fontSize: '7px', color: '#2563eb' }}>NAGPUR</div>
          </div>

          <div style={{ fontFamily: "'Brush Script MT', cursive, sans-serif", fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
            Rajesh Singh[cite: 1]
          </div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', borderTop: '1px solid #000', paddingTop: '2px', marginTop: '2px' }}>
            FOR HARIHAR CARGO CARRIERS[cite: 2]
          </div>
        </div>
      </div>
    </div>
  );
}