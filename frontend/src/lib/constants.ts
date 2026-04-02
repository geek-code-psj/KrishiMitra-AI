export const DISTRICTS = [
  'Patna',
  'Gaya',
  'Bhagalpur',
  'Muzaffarpur',
  'Purnia',
  'Darbhanga',
  'Katihar',
  'Arrah',
  'Begusarai',
  'Kishanganj'
];

export const CROPS = [
  'rice',
  'wheat',
  'maize',
  'pulses',
  'sugarcane',
  'cotton',
  'soybean',
  'mustard',
  'millet',
  'jute'
];

export const SEASONS = [
  { value: 'kharif', label: 'Kharif (Monsoon)' },
  { value: 'rabi', label: 'Rabi (Winter)' },
  { value: 'zaid', label: 'Zaid (Summer)' }
];

export const COMMODITIES = [
  'rice',
  'wheat',
  'tomato',
  'onion',
  'potato',
  'cotton',
  'soybean',
  'sugar'
];

export const SOIL_TYPES = [
  { value: 'alluvial', label: 'Alluvial Soil' },
  { value: 'black', label: 'Black Soil' },
  { value: 'red', label: 'Red & Yellow Soil' },
  { value: 'laterite', label: 'Laterite Soil' },
  { value: 'arid', label: 'Arid/Desert Soil' },
  { value: 'saline', label: 'Saline/Alkaline Soil' },
  { value: 'peaty', label: 'Peaty/Marshy Soil' }
];

export const CROP_STAGES = [
  { value: 'sowing', label: 'Sowing/Planting' },
  { value: 'vegetative', label: 'Vegetative Growth' },
  { value: 'flowering', label: 'Flowering/Reproduction' },
  { value: 'fruiting', label: 'Fruiting/Grain Formation' },
  { value: 'maturity', label: 'Maturity/Harvest' },
  { value: 'post_harvest', label: 'Post-Harvest' }
];

export const LANGUAGES = [
  { code: 'hi', name: 'Hindi / हिंदी' },
  { code: 'en', name: 'English' },
  { code: 'mr', name: 'Marathi / मराठी' },
  { code: 'ta', name: 'Tamil / தமிழ்' },
  { code: 'te', name: 'Telugu / తెలుగు' },
  { code: 'kn', name: 'Kannada / ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati / ગુજરાતી' },
  { code: 'bn', name: 'Bengali / বাংলা' },
  { code: 'pa', name: 'Punjabi / ਪੰਜਾਬੀ' }
];

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1',
};