// KrishiMitra AI - API Client
import { API_CONFIG } from './constants';
import type {
  AuthResponse,
  FarmerProfile,
  VoiceQueryResponse,
  SupportedLanguagesResponse,
  IrrigationScheduleResponse,
  MoistureData,
  IrrigationAlert,
  YieldPredictionResponse,
  PricePredictionResponse,
  CropPlanResponse,
  CropPlanRequest,
  ClimateRecommendationsResponse,
  ClimateRiskAssessmentResponse,
  DashboardStats,
  LoginRequest,
  VerifyRequest,
} from '@/types';

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============== Auth API ==============
export const authApi = {
  login: (data: LoginRequest) =>
    fetchApi<{ message: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verify: (data: VerifyRequest) =>
    fetchApi<AuthResponse>('/api/v1/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: (token: string) =>
    fetchApi<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// ============== Farmer API ==============
export const farmerApi = {
  getProfile: () =>
    fetchApi<FarmerProfile>('/api/v1/farmers/profile'),

  updateProfile: (data: Partial<FarmerProfile>) =>
    fetchApi<FarmerProfile>('/api/v1/farmers/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ============== Voice API ==============
export const voiceApi = {
  getLanguages: () =>
    fetchApi<SupportedLanguagesResponse>('/api/v1/voice/languages'),

  query: (data: { audio_url?: string; text?: string; language_hint?: string; return_audio?: boolean }) =>
    fetchApi<VoiceQueryResponse>('/api/v1/voice/query', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  transcribe: (data: FormData) =>
    fetchApi<{ text: string; confidence: number }>('/api/v1/voice/transcribe', {
      method: 'POST',
      body: data,
    }),

  synthesize: (data: { text: string; language: string }) =>
    fetchApi<{ audio_url: string }>('/api/v1/voice/synthesize', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============== Irrigation API ==============
export const irrigationApi = {
  getSchedule: (district: string, crop: string, params: Record<string, string | number>) =>
    fetchApi<IrrigationScheduleResponse>(
      `/api/v1/irrigation/schedule/${district}/${crop}?${new URLSearchParams(params as any).toString()}`
    ),

  getMoisture: (district: string, days: number = 7) =>
    fetchApi<MoistureData>(
      `/api/v1/irrigation/moisture/${district}?days=${days}`
    ),

  getAlerts: (district: string, severity?: string) =>
    fetchApi<{ alerts: IrrigationAlert[] }>(
      `/api/v1/irrigation/alerts/${district}${severity ? `?severity=${severity}` : ''}`
    ),

  getWaterBudget: (district: string, crop: string, area: number, days: number) =>
    fetchApi<{ total_water_liters: number; cost_inr: number }>(
      `/api/v1/irrigation/water-budget/${district}/${crop}?area_acres=${area}&growth_period_days=${days}`
    ),
};

// ============== Predictions API ==============
export const predictionsApi = {
  getYield: (crop: string, district: string, season: string, area: number, variety?: string) =>
    fetchApi<YieldPredictionResponse>(
      `/api/v1/predictions/yield/${crop}/${district}/${season}?area_acres=${area}${variety ? `&variety=${variety}` : ''}`
    ),

  getPrice: (commodity: string, market: string, days: number = 30) =>
    fetchApi<PricePredictionResponse>(
      `/api/v1/predictions/price/${commodity}/${market}?days=${days}`
    ),

  comparePrices: (commodity: string, markets: string[]) =>
    fetchApi<{ comparisons: PricePredictionResponse[] }>(
      `/api/v1/predictions/price/comparison/${commodity}?markets=${markets.join(',')}`
    ),

  getCropPlan: (data: CropPlanRequest) =>
    fetchApi<CropPlanResponse>('/api/v1/predictions/crop-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTrends: (district: string) =>
    fetchApi<{
      yield_trends: { year: number; yield: number }[];
      price_trends: { date: string; price: number }[];
    }>(`/api/v1/predictions/trends/${district}`),
};

// ============== Climate API ==============
export const climateApi = {
  getRecommendations: (district: string, season: string, riskType: string) =>
    fetchApi<ClimateRecommendationsResponse>(
      `/api/v1/climate/crop-recommendations?district=${district}&season=${season}&risk_type=${riskType}`
    ),

  getRiskAssessment: (district: string, crop: string) =>
    fetchApi<ClimateRiskAssessmentResponse>(
      `/api/v1/climate/risk-assessment?district=${district}&crop=${crop}`
    ),

  getVarietyDatabase: (crop?: string, trait?: string) =>
    fetchApi<{ varieties: any[] }>(
      `/api/v1/climate/variety-database?${new URLSearchParams({ crop: crop || '', trait: trait || '' })}`
    ),
};

// ============== Dashboard API ==============
export const dashboardApi = {
  getStats: () =>
    fetchApi<DashboardStats>('/api/v1/dashboard/stats'),

  getRecentActivity: () =>
    fetchApi<{ activities: any[] }>('/api/v1/dashboard/recent-activity'),
};

// ============== Geospatial API ==============
export const geospatialApi = {
  getCreditZones: (district?: string) =>
    fetchApi<{ zones: any[] }>(
      `/api/v1/geospatial/credit-zones${district ? `?district=${district}` : ''}`
    ),

  getNearby: (type: string, lat: number, lng: number, radius: number = 10) =>
    fetchApi<{ resources: any[] }>(
      `/api/v1/geospatial/nearby/${type}?lat=${lat}&lng=${lng}&radius_km=${radius}`
    ),

  analyzeLand: (lat: number, lng: number, area: number) =>
    fetchApi<{ analysis: any }>('/api/v1/geospatial/analyze-land', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, area_acres: area }),
    }),
};

export default {
  auth: authApi,
  farmer: farmerApi,
  voice: voiceApi,
  irrigation: irrigationApi,
  predictions: predictionsApi,
  climate: climateApi,
  dashboard: dashboardApi,
  geospatial: geospatialApi,
};