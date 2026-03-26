// Vital types
export type VitalType =
  | 'heartRate'
  | 'bloodPressure'
  | 'spo2'
  | 'temperature'
  | 'glucose'

export type VitalStatus = 'normal' | 'warning' | 'critical'
export type TrendDirection = 'up' | 'down' | 'stable'

export interface SingleVital {
  value: number
  unit: string
  timestamp: Date
}

export interface BloodPressureVital {
  systolic: number
  diastolic: number
  unit: string
  timestamp: Date
}

export interface CurrentVitals {
  heartRate: SingleVital
  bloodPressure: BloodPressureVital
  spo2: SingleVital
  temperature: SingleVital
  glucose: SingleVital
}

export interface VitalDataPoint {
  time: string
  value: number
  timestamp: Date
}

export interface VitalDisplayConfig {
  key: VitalType
  label: string
  unit: string
  icon: string
  colorClass: string
  normalRange: { min: number; max: number }
  formatValue: (v: number) => string
}

// Alert types
export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertDirection = 'above' | 'below'

export interface AlertBreach {
  id: string
  vital: string
  value: number
  unit: string
  threshold: number
  direction: AlertDirection
  message: string
  severity: AlertSeverity
  timestamp: Date
  isRead: boolean
  smsSent: boolean
  smsRecipients: string[]
}

export type AlertEvent = AlertBreach

// Analytics types
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export interface RiskScore {
  score: number
  level: RiskLevel
}

export interface DailyVitalSummary {
  day: string
  avg: number
  min: number
  max: number
}

export interface WeeklyAnalytics {
  heartRate: DailyVitalSummary[]
  spo2: DailyVitalSummary[]
  temperature: DailyVitalSummary[]
  glucose: DailyVitalSummary[]
}

export interface VitalStatRow {
  vital: string
  avg: number
  min: number
  max: number
  trend: TrendDirection
  status: VitalStatus
  unit: string
}

// Patient types
export interface Patient {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  phone: string
  doctorName: string
  doctorPhone: string
  conditions: string[]
  enrolledAt: Date
}

// Settings types
export interface ThresholdRange {
  min: number
  max: number
  critical: {
    below: number
    above: number
  }
  warning: {
    below: number
    above: number
  }
}

export interface Thresholds {
  heartRate: ThresholdRange
  spo2: ThresholdRange
  temperature: ThresholdRange
  glucose: ThresholdRange
  systolic: ThresholdRange
  diastolic: ThresholdRange
}

export interface ContactInfo {
  primaryPhone: string
  secondaryPhone?: string
  email: string
  emergencyContact: string
}

export interface SmsToggles {
  critical: boolean
  warning: boolean
  info: boolean
}

export interface SettingsState {
  contacts: ContactInfo
  thresholds: Thresholds
  smsEnabled: SmsToggles
  toastsEnabled: boolean
}
