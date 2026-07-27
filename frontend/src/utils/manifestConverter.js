/**
 * Utility to extract and format selected vehicles from Pickups
 */

// 1. Formats selected cars for Loading Form
export const formatCarsForLoading = (selectedCars = []) => {
  return selectedCars.map(car => ({
    carName: car.carName || '',
    carNumber: car.carNumber || '',
    partyName: car.partyName || '',
    partyNumber: car.partyNumber || '',
    packerName: car.packerName || '',
    fromLocation: car.fromLocation || 'NAGPUR',
    toLocation: car.toLocation || '',
    pincode: car.pincode || '',
    carValue: car.carValue || ''
  }));
};

// 2. Formats selected cars for Invoice Form
export const formatCarsForInvoice = (selectedCars = []) => {
  return selectedCars.map(car => ({
    description: `Transport Charge: ${car.carName || 'Vehicle'} (${car.carNumber || 'N/A'}) [${car.fromLocation || 'NAGPUR'} -> ${car.toLocation || ''}]`,
    carNumber: car.carNumber || '',
    partyName: car.partyName || '',
    partyNumber: car.partyNumber || '',
    amount: car.carValue ? Math.round(Number(car.carValue) * 0.01) : 0
  }));
};