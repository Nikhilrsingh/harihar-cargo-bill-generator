import React from 'react';
import leftLogo from '../../assets/logo-left.png';
import rightLogo from '../../assets/right-logo.png';
import signImg from '../../assets/sign.png';

export default function BiltyPrint({ data }) {
  if (!data) return null;

  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      padding: '12mm',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: '11px',
      color: '#000000',
      boxSizing: 'border-box',
      border: '1px solid #ccc',
      margin: '0 auto',
      position: 'relative'
    }}>
      
      {/* Top Small Header */}
      <div style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold', color: '#dc2626', textAlign: 'center', marginBottom: '2px' }}>
        SUBJECT TO NAGPUR JURISDICTION ONLY
      </div>

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '4px' }}>
        <div style={{ width: '85px', textAlign: 'center' }}>
          <img src={leftLogo} alt="HCC Logo" style={{ width: '75px', height: 'auto', display: 'block', margin: '0 auto' }} />
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '23px', fontWeight: '900', color: '#dc2626', letterSpacing: '0.5px' }}>
            HARIHAR CARGO CARRIERS
          </h1>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#dc2626', marginTop: '1px' }}>
            FLEET OWNER & TRANSPORT CONTRACTOR
          </div>
          <div style={{ fontSize: '8.5px', color: '#334155', marginTop: '3px' }}>
            H.O: PLOT NO.19, SHIVSHAKTI NAGAR, OPP WADI POLICE STATION AMRAVATI ROAD NAGPUR 440023
          </div>
          <div style={{ fontSize: '8.5px', color: '#1e40af' }}>
            MOB NO. <span style={{ fontWeight: 'bold' }}>9372693389, 7972409656</span> EMAIL: <span style={{ textDecoration: 'underline' }}>HARIHARCARCARRIER@GMAIL.COM</span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#dc2626', marginTop: '2px' }}>
            GST No: 27AWOPR8730N2ZI
          </div>
        </div>

        <div style={{ width: '95px', textAlign: 'center' }}>
          <img src={rightLogo} alt="Truck Trailer" style={{ width: '85px', height: 'auto', display: 'block', margin: '0 auto' }} />
        </div>
      </div>

      {/* Branches Bar */}
      <div style={{
        border: '1.5px solid #000',
        padding: '3px 6px',
        fontSize: '7.5px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '2px',
        marginBottom: '6px',
        lineHeight: '1.2'
      }}>
        BRANCHES: PUNE, GURGAON, BANGLORE, CHENNAI, GOA, MUMBAI, JABALPUR, RAIPUR, BHOPAL, INDORE, CHANDIGARH, LUDHIANA, COCHIN, AHMEDABAD, JAIPUR, KOLKATA, LUCKNOW, BHUBANESWAR, HYDERABAD.
      </div>

      {/* Consignor / Consignee */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1.5px solid #000' }}>
        <div style={{ padding: '6px', borderRight: '1.5px solid #000', minHeight: '55px' }}>
          <strong style={{ textDecoration: 'underline' }}>CONSIGNOR</strong><br />
          <strong>NAME:</strong> {data.consignorName || data.partyName || ''}<br />
          <strong>ADDRESS:</strong> {data.consignorAddress || data.fromLocation || ''}
        </div>
        <div style={{ padding: '6px', minHeight: '55px' }}>
          <strong style={{ textDecoration: 'underline' }}>CONSIGNEE</strong><br />
          <strong>NAME:</strong> {data.consigneeName || data.partyName || ''}<br />
          <strong>ADDRESS:</strong> {data.consigneeAddress || data.toLocation || ''}
        </div>
      </div>

      {/* LR Metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', border: '1.5px solid #000', borderTop: 'none', backgroundColor: '#ffffff' }}>
        <div style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>
          <strong>LR NO:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{data.lrNumber || '5491'}</span>
        </div>
        <div style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>
          <strong>DATE:</strong> {data.date || new Date().toISOString().split('T')[0]}
        </div>
        <div style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>
          <strong>FROM:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{data.fromLocation || ''}</span>
        </div>
        <div style={{ padding: '4px 6px' }}>
          <strong>TO:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{data.toLocation || ''}</span>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.3fr 1fr', border: '1.5px solid #000', borderTop: 'none' }}>
        
        {/* Left Cargo Section */}
        <div style={{ borderRight: '1.5px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #000' }}>
                <th style={{ padding: '4px 6px', borderRight: '1.5px solid #000', width: '15%', textAlign: 'center' }}>No of Pkg</th>
                <th style={{ padding: '4px 6px', borderRight: '1.5px solid #000', width: '65%', textAlign: 'center' }}>DESCRIPTION (SAID TO CONTAIN)</th>
                <th style={{ padding: '4px 6px', textAlign: 'center', width: '20%' }}>ACTUAL WT.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px 6px', borderRight: '1.5px solid #000', verticalAlign: 'top', textAlign: 'center', height: '140px' }}>
                  {data.packageCount || '1'}
                </td>
                <td style={{ padding: '8px 8px', borderRight: '1.5px solid #000', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '12px' }}>
                    {data.carName || data.description || ''}
                  </div>
                  
                  <div style={{ fontSize: '10px', marginBottom: '16px' }}>
                    <strong>CHASSIS/VIN:</strong> <span style={{ fontWeight: 'bold' }}>{data.chassisNumber || data.carNumber || ''}</span>
                  </div>

                  <div style={{
                    display: 'inline-block',
                    border: '1.5px solid #000',
                    padding: '3px 8px',
                    fontWeight: 'bold',
                    fontSize: '10px'
                  }}>
                    LORRY NO: <span style={{ color: '#1d4ed8' }}>{data.lorryNumber || data.carNumber || ''}</span>
                  </div>
                </td>
                <td style={{ padding: '8px 6px', textAlign: 'center', verticalAlign: 'top' }}>
                  -
                </td>
              </tr>
            </tbody>
          </table>

          {/* Declared Value Section */}
          <div style={{ borderTop: '1.5px solid #000', padding: '6px 8px', fontSize: '9.5px' }}>
            <div>
              <strong>DECLARED VALUE OF GOODS:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{data.carValue || data.declaredValue || ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
              <span><strong>INSURANCE:</strong></span>
              <span>By Party</span>
            </div>
          </div>
        </div>

        {/* Right Charges Breakdown */}
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #000' }}>
                <th style={{ padding: '4px 6px', textAlign: 'left', borderRight: '1.5px solid #000' }}>CHARGES</th>
                <th style={{ padding: '4px 6px', textAlign: 'right' }}>AMOUNT RS</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>FREIGHT</td>
                <td style={{ padding: '4px 6px', textAlign: 'right', fontWeight: 'bold' }}>{data.freightAmount || 'Fixed'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>HANDLING CHARGES</td>
                <td style={{ padding: '4px 6px', textAlign: 'right' }}>{data.handlingCharges || ''}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>DOOR COLLECTION</td>
                <td style={{ padding: '4px 6px', textAlign: 'right' }}>{data.doorCollection || ''}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>DOOR DELIVERY</td>
                <td style={{ padding: '4px 6px', textAlign: 'right' }}>{data.doorDelivery || ''}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <td style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>STATICAL CHARGES</td>
                <td style={{ padding: '4px 6px', textAlign: 'right' }}>{data.statisticalCharges || ''}</td>
              </tr>
              <tr style={{ borderBottom: '1.5px solid #000' }}>
                <td style={{ padding: '4px 6px', borderRight: '1.5px solid #000' }}>GST</td>
                <td style={{ padding: '4px 6px', textAlign: 'right' }}>{data.gstAmount || ''}</td>
              </tr>
              <tr style={{ fontWeight: 'bold' }}>
                <td style={{ padding: '5px 6px', borderRight: '1.5px solid #000' }}>TOTAL</td>
                <td style={{ padding: '5px 6px', textAlign: 'right' }}>{data.totalAmount || 'To Be Billed'}</td>
              </tr>
            </tbody>
          </table>

          {/* Basis of Booking */}
          <div style={{ borderTop: '1.5px solid #000', padding: '5px', fontSize: '8.5px', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>BASIC OF BOOKING:</div>
            <div>[ ] TO PAY &nbsp; [ ] PAID &nbsp; [X] TO BE BILLED</div>
          </div>
        </div>

      </div>

      {/* Statutory Clause */}
      <div style={{ border: '1.5px solid #000', borderTop: 'none', padding: '3px 6px', fontSize: '7.5px', textAlign: 'center', fontStyle: 'italic' }}>
        We are registered for GST under the category of Goods Transport Agency vide Reverse Charge Mechanism and thus the recipient of our service is liable to pay GST on goods transport service vide Not. No. 13/2017 Dd. 28.06.2017
      </div>

      {/* Signatures & Stamp */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '25px', padding: '0 10px' }}>
        
        <div style={{ textAlign: 'center', width: '220px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>{data.consignorName || data.partyName || ''}</div>
          <div style={{ borderBottom: '1px solid #000', width: '100%', marginBottom: '4px' }}></div>
          <strong style={{ fontSize: '8.5px' }}>NAME OF CONSIGNOR</strong>
        </div>

        <div style={{ textAlign: 'center', width: '280px', position: 'relative' }}>
          
          {/* Blue Rectangle Stamp */}
          <div style={{
            position: 'absolute',
            top: '-45px',
            right: '25px',
            border: '2px solid #2563eb',
            borderRadius: '4px',
            padding: '3px 8px',
            color: '#2563eb',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            transform: 'rotate(-6deg)',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 0 0 1px #2563eb inset',
            zIndex: 2,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px' }}>HARIHAR CARGO</div>
            <div style={{ fontSize: '8px', fontWeight: 'bold' }}>CARRIERS</div>
            <div style={{ fontSize: '6.5px', fontWeight: '700' }}>★ ALL INDIA ★</div>
            <div style={{ fontSize: '6.5px', fontStyle: 'italic' }}>AUTHORIZED</div>
          </div>

          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2px' }}>
            <img src={signImg} alt="Signature" style={{ height: '35px', width: 'auto', display: 'block', margin: '0 auto' }} />
            <div style={{ fontSize: '10px', color: '#64748b' }}>Rajesh Singh</div>
          </div>

          <div style={{ borderTop: '1px solid #000', paddingTop: '3px' }}>
            <strong style={{ fontSize: '8.5px' }}>NAME & SIGNATURE OF BOOKING OFFICIAL</strong>
          </div>
        </div>

      </div>

    </div>
  );
}