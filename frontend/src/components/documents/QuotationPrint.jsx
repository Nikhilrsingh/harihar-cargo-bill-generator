import React from 'react';

export default function QuotationPrint({ data }) {
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
      <div style={{ fontSize: '10px', fontWeight: 'bold' }}>SUBJECT TO NAGPUR JURISDICTION ONLY</div>[cite: 3]

      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '8px', marginTop: '4px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900' }}>HARIHAR CARGO CARRIERS</h1>[cite: 3]
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>FLEET OWNER & TRANSPORT CONTRACTOR</div>[cite: 3]
        <div style={{ fontSize: '10px' }}>H.O: Plot No.19, Shivshakti Nagar, Opp Wadi Police Station, Amravati Road Nagpur 440023</div>[cite: 3]
        <div style={{ fontSize: '10px' }}>Mob: 9372693389, 7972409656 | Email: hariharcarcarrier@gmail.com</div>[cite: 3]
        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>GST No: 27AWOPR8730N2ZI</div>[cite: 3]
      </div>

      <div style={{ textAlign: 'center', margin: '12px 0', fontSize: '16px', fontWeight: 'bold', textDecoration: 'underline' }}>
        QUOTATION[cite: 3]
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <strong>M/S:</strong> {data.partyName || ''}<br />[cite: 3]
          <strong>FROM:</strong> {data.fromLocation || ''}<br />[cite: 3]
          <strong>TO:</strong> {data.toLocation || ''}[cite: 3]
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong>DATE:</strong> {data.date || new Date().toISOString().split('T')[0]}<br />[cite: 3]
          <strong>QUANTITY:</strong> {data.quantity || '1 Vehicle'}[cite: 3]
        </div>
      </div>

      <p style={{ fontSize: '11px' }}>
        We thank you for your inquiry for the Transportation of your Belongings. We have pleasure in quoting our charges as follows:[cite: 3]
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginTop: '8px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #000' }}>
            <th style={{ padding: '6px', borderRight: '1px solid #000', textAlign: 'left' }}>PARTICULARS</th>[cite: 3]
            <th style={{ padding: '6px', borderRight: '1px solid #000', textAlign: 'left' }}>DETAILS</th>[cite: 3]
            <th style={{ padding: '6px', textAlign: 'right' }}>AMOUNT</th>[cite: 3]
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>TRANSPORTATION CHARGES</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>Road Transport/Door to Door</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>{data.transportCharges || '-'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>PACKING CHARGES</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>With Packing Material</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>{data.packingCharges || '-'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>LOADING CHARGES</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>With Manpower</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>{data.loadingCharges || '-'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>UNLOADING CHARGES</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>With Manpower</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>{data.unloadingCharges || '-'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>STORAGE CHARGES</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>150/- Rs Per Day</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>{data.storageCharges || '-'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>OTHER CHARGES</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>Miscellaneous</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>{data.otherCharges || '-'}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>INSURANCE</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>3% on the value of goods</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>Nill</td>[cite: 3]
          </tr>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>SURCHARGE @10%</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>On Total Bill Amount</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>Nill</td>[cite: 3]
          </tr>
          <tr style={{ borderBottom: '1px solid #000' }}>
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>GST</td>[cite: 3]
            <td style={{ padding: '6px', borderRight: '1px solid #000' }}>0%</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>0</td>[cite: 3]
          </tr>
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>
            <td colSpan="2" style={{ padding: '6px', borderRight: '1px solid #000' }}>TOTAL CHARGES (100% Payment at Loading Point)</td>[cite: 3]
            <td style={{ padding: '6px', textAlign: 'right' }}>₹ {data.totalAmount || '0'}</td>[cite: 3]
          </tr>
        </tbody>
      </table>

      {/* UPDATED STAMP & SIGNATURE SECTION */}
      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div>YOURS FAITHFULLY</div>[cite: 3]
          <div style={{ fontWeight: 'bold' }}>HARIHAR CARGO CARRIERS</div>[cite: 3]
        </div>

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
            FOR HARIHAR CARGO CARRIERS[cite: 3]
          </div>
        </div>
      </div>
    </div>
  );
}