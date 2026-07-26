import React from 'react';
import signImg from '../assets/sign.png';
import { getCompanyStampDataURL } from '../utils/stampGenerator';

export default function SignatureStampBlock({ 
  companyName = "FOR HARIHAR CARGO CARRIERS",
  signatoryText = "Authorized Signatory",
  width = "270px",
  minHeight = "130px"
}) {
  const stampImg = getCompanyStampDataURL();

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: '12px' }}>
      <div style={{ 
        textAlign: 'center', 
        position: 'relative', 
        width: width, 
        minHeight: minHeight, 
        display: 'flex', 
        flexDirection: 'column', 
        justify: 'space-between' 
      }}>
        
        {/* Company Header */}
        <div style={{ 
          fontSize: '11px', 
          fontWeight: '900', 
          color: '#b91c1c', 
          letterSpacing: '0.02em',
          position: 'relative',
          zIndex: 1
        }}>
          {companyName}
        </div>

        {/* Blue Rubber Stamp Layer (Centered On Top) */}
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
  );
}













// {/* Signature & Stamp Area */}
// <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', paddingTop: '12px' }}>
//   <div style={{ textAlign: 'center', position: 'relative', width: '270px', minHeight: '130px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    
//     {/* Company Header */}
//     <div style={{ 
//       fontSize: '11px', 
//       fontWeight: '900', 
//       color: '#b91c1c', 
//       letterSpacing: '0.02em',
//       position: 'relative',
//       zIndex: 1
//     }}>
//       FOR HARIHAR CARGO CARRIERS
//     </div>

//     {/* Blue Rubber Stamp Layer (Centered and Layered On Top) */}
//     <img 
//       src={stampImg} 
//       alt="Stamp" 
//       style={{ 
//         width: '160px', 
//         position: 'absolute', 
//         left: '50%',
//         top: '18px',
//         transform: 'translateX(-50%)',
//         mixBlendMode: 'multiply', 
//         opacity: 0.92, 
//         zIndex: 999 
//       }} 
//     />

//     {/* Hand Signature Overlay */}
//     <img 
//       src={signImg} 
//       alt="Signature" 
//       style={{ 
//         width: '110px', 
//         position: 'absolute', 
//         right: '85px', 
//         bottom: '42px', 
//         mixBlendMode: 'multiply', 
//         zIndex: 3 
//       }} 
//     />

//     {/* Authorized Signatory Base Line */}
//     <div style={{ 
//       borderTop: '1.5px solid #000', 
//       paddingTop: '4px', 
//       fontSize: '9.5px', 
//       fontWeight: 'bold', 
//       position: 'relative', 
//       zIndex: 1,
//       marginTop: '70px'
//     }}>
//       Authorized Signatory
//     </div>

//   </div>
// </div>