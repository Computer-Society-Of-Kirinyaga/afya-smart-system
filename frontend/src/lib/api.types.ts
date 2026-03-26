// Type definitions for API responses
export interface HealthReading {
  id: string;
  user_id: string;
  timestamp: string;
  heart_rate?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  spo2?: number;
  temperature?: number;
  steps?: number;
  sleep_hours?: number;
}

export interface CreateHealthReadingInput {
  user_id: string;
  timestamp?: string;
  heart_rate?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  spo2?: number;
  temperature?: number;
  steps?: number;
  sleep_hours?: number;
}

export interface User {
  id: string;
  email: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserInput {
  email: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
}

export interface RiskAssessment {
  id: string;
  user_id: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  assessment_date: string;
  details?: Record<string, unknown>;
}

export interface StreamData {
  id: string;
  user_id: string;
  data: unknown;
  timestamp: string;
}
