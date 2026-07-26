// Expanded City Master Data with States
export const CITY_DATA = {
  'Nagpur': { pincode: '440023', state: 'Maharashtra' },
  'Pune': { pincode: '411001', state: 'Maharashtra' },
  'Mumbai': { pincode: '400001', state: 'Maharashtra' },
  'Thane': { pincode: '400601', state: 'Maharashtra' },
  'Nashik': { pincode: '422001', state: 'Maharashtra' },
  'Aurangabad': { pincode: '431001', state: 'Maharashtra' },
  'Delhi': { pincode: '110001', state: 'Delhi' },
  'Gurgaon': { pincode: '122001', state: 'Haryana' },
  'Faridabad': { pincode: '121001', state: 'Haryana' },
  'Noida': { pincode: '201301', state: 'Uttar Pradesh' },
  'Ghaziabad': { pincode: '201001', state: 'Uttar Pradesh' },
  'Bangalore': { pincode: '560001', state: 'Karnataka' },
  'Chennai': { pincode: '600001', state: 'Tamil Nadu' },
  'Hyderabad': { pincode: '500001', state: 'Telangana' },
  'Kolkata': { pincode: '700001', state: 'West Bengal' },
  'Ahmedabad': { pincode: '380001', state: 'Gujarat' },
  'Surat': { pincode: '395001', state: 'Gujarat' },
  'Jaipur': { pincode: '302001', state: 'Rajasthan' },
  'Indore': { pincode: '452001', state: 'Madhya Pradesh' },
  'Bhopal': { pincode: '462001', state: 'Madhya Pradesh' },
  'Jabalpur': { pincode: '482001', state: 'Madhya Pradesh' },
  'Raipur': { pincode: '492001', state: 'Chhattisgarh' },
  'Chandigarh': { pincode: '160001', state: 'Chandigarh' },
  'Ludhiana': { pincode: '141001', state: 'Punjab' },
  'Lucknow': { pincode: '226001', state: 'Uttar Pradesh' },
  'Kanpur': { pincode: '208001', state: 'Uttar Pradesh' },
  'Patna': { pincode: '800001', state: 'Bihar' },
  'Bhubaneswar': { pincode: '751001', state: 'Odisha' },
  'Cochin': { pincode: '682001', state: 'Kerala' },
  'Goa': { pincode: '403001', state: 'Goa' }
};

export const MASTER_CITIES = Object.keys(CITY_DATA);

export const MASTER_CARS = [
  'Hyundai Creta', 'Hyundai i20', 'Hyundai Verna', 'Hyundai Venue',
  'Tata Safari', 'Tata Nexon', 'Tata Harrier', 'Tata Punch',
  'Honda City', 'Honda Amaze', 'Maruti Swift', 'Maruti Baleno',
  'Maruti Brezza', 'Maruti Dzire', 'Toyota Fortuner', 'Toyota Innova Crysta',
  'Mahindra Thar', 'Mahindra XUV700', 'Mahindra Scorpio', 'Kia Seltos',
  'Kia Sonet', 'Volkswagen Virtus', 'Skoda Slavia', 'MG Hector'
];

export const getMRUItems = (storageKey, defaultList) => {
  try {
    const mru = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const uniqueDefaults = defaultList.filter(item => !mru.includes(item));
    return [...mru, ...uniqueDefaults];
  } catch {
    return defaultList;
  }
};

export const recordMRUItem = (storageKey, value) => {
  if (!value || !value.trim()) return;
  const cleanVal = value.trim();
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updated = [cleanVal, ...existing.filter(item => item.toLowerCase() !== cleanVal.toLowerCase())].slice(0, 20);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (e) {
    console.error("MRU save error", e);
  }
};