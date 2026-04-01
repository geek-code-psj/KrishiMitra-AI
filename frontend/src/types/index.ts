// KrishiMitra AI - TypeScript Type Definitions

// ============== Auth Types ==============
export interface LoginRequest {
  phone: string;
}

export interface VerifyRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  farmer_id: string;
}

// ============== Farmer Types ==============
export interface Farmer {
  id: string;
  phone: string;
  name: string;
  district_code: string;
  preferred_language: string;
  farm_size_acres: number;
  created_at: string;
  last_active: string;
}

export interface Farm {
  id: string;
  farmer_id: string;
  name: string;
  location_lat: number;
  location_lng: number;
  soil_type: string;
  total_area: number;
  water_source: string;
}

export interface FarmerProfile {
  id: string;
  phone: string;
  name: string;
  district: string;
  language: string;
  farm_size: number;
}

// ============== Voice Types ==============
export interface LanguageInfo {
  code: string;
  name: string;
  quality_score: number;
  tts_available: boolean;
}

export interface VoiceQueryRequest {
  audio_url?: string;
  language_hint?: string;
  farmer_id?: string;
  location?: {
    lat: number;
    lng: number;
  };
  return_audio?: boolean;
}

export interface VoiceQueryResponse {
  success: boolean;
  transcribed_text: string;
  detected_language: string;
  confidence: number;
  intent: string;
  entities: Record<string, string>;
  response_text: string;
  response_audio_url?: string;
  actions: string[];
  processing_time_ms: number;
}

export interface SupportedLanguagesResponse {
  languages: LanguageInfo[];
}

// ============== Irrigation Types ==============
export interface MoistureData {
  district: string;
  current_moisture: number;
  current_level: string;
  historical: MoisturePoint[];
  forecast: MoisturePoint[];
  average_moisture: number;
  min_moisture: number;
  max_moisture: number;
  trend: string;
  data_source: string;
  last_updated: string;
}

export interface MoisturePoint {
  date: string;
  moisture: number;
}

export interface IrrigationScheduleRequest {
  district: string;
  crop: string;
  area_acres: number;
  soil_type: string;
  crop_stage: string;
  planting_date: string;
  farmer_id?: string;
  days: number;
  constraints?: IrrigationConstraints;
}

export interface IrrigationConstraints {
  water_availability_liters?: number;
  electricity_schedule?: string[];
  labor_available?: string[];
}

export interface IrrigationEvent {
  date: string;
  time: string;
  duration_minutes: number;
  water_liters: number;
  status: string;
}

export interface IrrigationScheduleResponse {
  district: string;
  crop: string;
  area_acres: number;
  soil_type: string;
  crop_stage: string;
  schedule: IrrigationEvent[];
  total_water_required_liters: number;
  estimated_cost_inr: number;
  water_saving_tips: string[];
  drought_risk: string;
  next_check_date: string;
  generated_at: string;
  model_version: string;
}

export interface IrrigationAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  district: string;
  created_at: string;
}

// ============== Predictions Types ==============
export interface YieldPredictionRequest {
  crop: string;
  district: string;
  season: string;
  area_acres: number;
  variety?: string;
  farmer_id?: string;
}

export interface YieldPredictionResponse {
  crop: string;
  district: string;
  season: string;
  area_acres: number;
  predicted_yield_quintals: number;
  yield_per_acre: number;
  confidence_interval: [number, number];
  confidence_level: string;
  factors: string[];
  historical_average: number;
  comparison_to_historical: string;
  model_version: string;
  prediction_date: string;
}

export interface PricePoint {
  date: string;
  price: number;
  confidence_lower?: number;
  confidence_upper?: number;
}

export interface PricePredictionResponse {
  commodity: string;
  market: string;
  current_price: number;
  forecast: PricePoint[];
  trend: string;
  trend_percentage: number;
  volatility: string;
  seasonal_factor: number;
  best_selling_window: string;
  historical: PricePoint[];
  model_version: string;
  prediction_date: string;
}

export interface CropPlanRequest {
  district: string;
  season: string;
  area_acres: number;
  soil_type: string;
  water_availability: string;
  budget: number;
  preferences?: string[];
  risk_tolerance: string;
}

export interface CropRecommendation {
  crop: string;
  variety: string;
  expected_yield_quintals: number;
  expected_price_per_quintal: number;
  expected_revenue: number;
  estimated_cost: number;
  expected_profit: number;
  roi_percentage: number;
  risk_level: string;
 理由: string;
}

export interface CropPlanResponse {
  district: string;
  season: string;
  area_acres: number;
  recommendations: CropRecommendation[];
  diversification_advice: string;
  market_insights: string;
  generated_at: string;
}

// ============== Climate Types ==============
export interface CropRecommendation {
  crop: string;
  variety: string;
  suitability_score: number;
  expected_yield: number;
  water_requirement: string;
  drought_tolerance: string;
  flood_tolerance: string;
  optimal_sowing_period: string;
}

export interface ClimateRecommendationsResponse {
  district: string;
  season: string;
  risk_type: string;
  recommendations: CropRecommendation[];
  generated_at: string;
}

export interface ClimateRisk {
  risk_type: string;
  probability: string;
  impact: string;
  mitigation: string;
}

export interface ClimateRiskAssessmentResponse {
  district: string;
  crop: string;
  risks: ClimateRisk[];
  overall_risk_level: string;
  adaptation_strategies: string[];
  generated_at: string;
}

export interface SeedVariety {
  variety: string;
  crop: string;
  maturity_days: number;
  yield_potential: number;
  traits: string[];
  suitable_regions: string[];
}

export interface VarietyDatabaseResponse {
  varieties: SeedVariety[];
  total_count: number;
}

// ============== Geospatial Types ==============
export interface CreditZone {
  district: string;
  state: string;
  credit_gap_crores: number;
  population: number;
  aif_schemes_available: number;
}

export interface NearbyResource {
  name: string;
  type: string;
  distance_km: number;
  lat: number;
  lng: number;
  address: string;
  contact?: string;
}

export interface LandAnalysis {
  lat: number;
  lng: number;
  area_acres: number;
  soil_type: string;
  soil_ph: number;
  suitable_crops: string[];
  recommendations: string[];
  soil_npk: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

// ============== Dashboard Types ==============
export interface DashboardStats {
  total_farms: number;
  total_area_acres: number;
  active_alerts: number;
  pending_irrigation: number;
}

export interface YieldTrend {
  year: number;
  yield: number;
}

export interface PriceTrend {
  date: string;
  price: number;
}

// ============== Sync Types ==============
export interface SyncPushRequest {
  device_id: string;
  last_sync_timestamp: string;
  changes: SyncChange[];
}

export interface SyncChange {
  entity_type: string;
  entity_id: string;
  operation: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface SyncPullResponse {
  changes: SyncChange[];
  server_timestamp: string;
}

// ============== API Response Types ==============
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
}

// ============== Utility Types ==============
export type SoilType = 'clay' | 'loam' | 'sandy' | 'silty';
export type CropStage = 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity';
export type Season = 'kharif' | 'rabi' | 'summer' | 'zaid';
export type RiskTolerance = 'low' | 'medium' | 'high';
export type AlertSeverity = 'low' | 'medium' | 'high';