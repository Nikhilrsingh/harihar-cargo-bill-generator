// src/utils/erpEngine.js

const getTodayDDMMYY = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
};

/**
 * Finds the next available number, filling missing gaps before advancing.
 */
export function getNextSequenceNumber(existingNums, startFrom) {
  if (!existingNums || existingNums.length === 0) return startFrom;

  const sorted = [...new Set(existingNums)].sort((a, b) => a - b);
  
  // 1. Check for gap between startFrom and lowest number
  if (sorted[0] > startFrom) return startFrom;

  // 2. Check for internal missing gaps
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] >= startFrom && sorted[i + 1] - sorted[i] > 1) {
      return sorted[i] + 1;
    }
  }

  // 3. Take highest number + 1
  const maxNum = Math.max(...sorted);
  return maxNum < startFrom ? startFrom : maxNum + 1;
}

// Module Specific Sequence Generators
export function generateNextPickupId() {
  const list = JSON.parse(localStorage.getItem('hcc_pickups_list') || '[]');
  const ids = list.map(item => parseInt(item.pickupId || item.id, 10)).filter(n => !isNaN(n));
  return getNextSequenceNumber(ids, 1);
}

export function generateNextBiltyNo() {
  const list = JSON.parse(localStorage.getItem('hcc_bilties_list') || '[]');
  const nos = list.map(item => parseInt(item.lrNo, 10)).filter(n => !isNaN(n));
  return getNextSequenceNumber(nos, 5492);
}

export function generateNextBillNo() {
  const list = JSON.parse(localStorage.getItem('hcc_invoices_list') || '[]');
  const nos = list.map(item => parseInt(item.billNo, 10)).filter(n => !isNaN(n));
  return getNextSequenceNumber(nos, 7896);
}

export function generateNextLoadingSlipNo() {
  const list = JSON.parse(localStorage.getItem('hcc_loading_slips') || '[]');
  const todayStr = getTodayDDMMYY();
  const prefix = `HCC-${todayStr}-`;

  const nos = list
    .map(item => {
      if (item.slipNo && item.slipNo.includes('-')) {
        const parts = item.slipNo.split('-');
        return parseInt(parts[parts.length - 1], 10);
      }
      return null;
    })
    .filter(n => n !== null && !isNaN(n));

  const nextSeq = getNextSequenceNumber(nos, 78);
  return `${prefix}${String(nextSeq).padStart(3, '0')}`;
}

/**
 * Universal Data Importer to transfer data across forms
 */
export function importDataFromSource(sourceType, sourceId) {
  if (sourceType === 'pickup') {
    const list = JSON.parse(localStorage.getItem('hcc_pickups_list') || '[]');
    const pickup = list.find(p => String(p.id) === String(sourceId) || String(p.pickupId) === String(sourceId));
    if (!pickup) return null;

    return {
      consignorName: pickup.clientName || '',
      consignorAddress: pickup.address || '',
      consignorPhone: pickup.phone || '',
      fromLocation: pickup.fromLocation || '',
      toLocation: pickup.toLocation || '',
      carName: pickup.vehicleModel || '',
      carNumber: pickup.vehicleNumber || '',
      declaredValue: pickup.estimatedCost || '',
      clientName: pickup.clientName || '',
      clientAddress: pickup.address || ''
    };
  }

  if (sourceType === 'bilty') {
    const list = JSON.parse(localStorage.getItem('hcc_bilties_list') || '[]');
    const bilty = list.find(b => String(b.lrNo) === String(sourceId) || String(b.id) === String(sourceId));
    if (!bilty) return null;

    return {
      lrNo: bilty.lrNo || '',
      lrDate: bilty.date || new Date().toLocaleDateString('en-GB'),
      consignorName: bilty.consignorName || '',
      consigneeName: bilty.consigneeName || '',
      clientName: bilty.consignorName || bilty.consigneeName || '',
      clientAddress: bilty.consignorAddress || bilty.consigneeAddress || '',
      fromLocation: bilty.fromLocation || '',
      toLocation: bilty.toLocation || '',
      carName: bilty.carName || '',
      lorryNo: bilty.lorryNo || bilty.carNumber || '',
      amount: bilty.declaredValue || ''
    };
  }

  return null;
}