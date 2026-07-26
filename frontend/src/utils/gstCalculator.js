export const computeTaxLedgerMatrix = (baseFreight, taxState = 'intra') => {
  const freight = Number(baseFreight) || 0;
  
  if (taxState === 'intra') {
    const cgst = freight * 0.045; // 4.5% CGST
    const sgst = freight * 0.045; // 4.5% SGST
    return {
      cgst, sgst, igst: 0,
      subTotal: freight,
      grandTotal: freight + cgst + sgst
    };
  } else {
    const igst = freight * 0.09; // 9% IGST Unified
    return {
      cgst: 0, sgst: 0, igst,
      subTotal: freight,
      grandTotal: freight + igst
    };
  }
};
export default computeTaxLedgerMatrix;