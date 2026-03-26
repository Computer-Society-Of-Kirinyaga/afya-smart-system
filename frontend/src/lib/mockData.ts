import type {
  AlertDirection,
  AlertEvent,
  AlertSeverity,
  CurrentVitals,
  DailyVitalSummary,
  VitalDataPoint,
  VitalType,
  WeeklyAnalytics,
} from '@/types/dashboard'

// Vital ranges for realistic data generation
const VITAL_RANGES = {
  heartRate: { min: 58, max: 105, unit: 'bpm', decimals: 0 },
  systolic: { min: 105, max: 145, unit: 'mmHg', decimals: 0 },
  diastolic: { min: 60, max: 95, unit: 'mmHg', decimals: 0 },
  spo2: { min: 95, max: 100, unit: '%', decimals: 1 },
  temperature: { min: 36.1, max: 37.5, unit: '°C', decimals: 1 },
  glucose: { min: 90, max: 130, unit: 'mg/dL', decimals: 0 },
}

// Utility function to generate random number between min and max
function randomBetween(min: number, max: number, decimals: number = 0): number {
  const value = Math.random() * (max - min) + min
  if (decimals === 0) return Math.round(value)
  return parseFloat(value.toFixed(decimals))
}

// Generate current vital reading
function generateVitalReading(
  vitalType: VitalType | 'systolic' | 'diastolic',
): number {
  const key = vitalType as keyof typeof VITAL_RANGES
  const range = VITAL_RANGES[key]
  if (!range) return 0
  return randomBetween(range.min, range.max, range.decimals)
}

// Generate current vitals snapshot
export function generateCurrentVitals(): CurrentVitals {
  const heartRate = generateVitalReading('heartRate')
  const systolic = generateVitalReading('systolic')
  const diastolic = generateVitalReading('diastolic')
  const spo2 = generateVitalReading('spo2')
  const temperature = generateVitalReading('temperature')
  const glucose = generateVitalReading('glucose')

  return {
    heartRate: { value: heartRate, unit: 'bpm', timestamp: new Date() },
    bloodPressure: { systolic, diastolic, unit: 'mmHg', timestamp: new Date() },
    spo2: { value: spo2, unit: '%', timestamp: new Date() },
    temperature: { value: temperature, unit: '°C', timestamp: new Date() },
    glucose: { value: glucose, unit: 'mg/dL', timestamp: new Date() },
  }
}

// Generate 24-hour history for a vital
export function generate24HourHistory(vitalType: VitalType): VitalDataPoint[] {
  const now = new Date()
  const dataPoints: VitalDataPoint[] = []

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    dataPoints.push({
      time: timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: generateVitalReading(vitalType),
      timestamp: timestamp,
    })
  }

  return dataPoints
}

// Generate 7-day analytics
export function generate7DayAnalytics(): WeeklyAnalytics {
  const now = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dailySummaries: DailyVitalSummary[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayIndex = date.getDay()

    dailySummaries.push({
      day: days[dayIndex],
      avg: randomBetween(75, 90),
      min: randomBetween(55, 70),
      max: randomBetween(95, 110),
    })
  }

  return {
    heartRate: dailySummaries,
    spo2: dailySummaries.map((d) => ({
      day: d.day,
      avg: randomBetween(97, 99),
      min: randomBetween(96, 98),
      max: randomBetween(99, 100),
    })),
    temperature: dailySummaries.map((d) => ({
      day: d.day,
      avg: randomBetween(36.5, 36.9, 1),
      min: randomBetween(36.1, 36.5, 1),
      max: randomBetween(36.8, 37.2, 1),
    })),
    glucose: dailySummaries.map((d) => ({
      day: d.day,
      avg: randomBetween(105, 120),
      min: randomBetween(85, 100),
      max: randomBetween(120, 140),
    })),
  }
}

// Generate alert events
export function generateAlertEvents(count: number = 5): AlertEvent[] {
  const severities: AlertSeverity[] = ['critical', 'warning', 'info']
  const vitals = [
    'Heart Rate',
    'Blood Pressure',
    'SpO2',
    'Temperature',
    'Glucose',
  ]
  const directions: AlertDirection[] = ['above', 'below']
  const alerts: AlertEvent[] = []

  const now = new Date()
  for (let i = 0; i < count; i++) {
    const minutesAgo = randomBetween(1, 1440) // Up to 24 hours ago
    const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000)
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const vital = vitals[Math.floor(Math.random() * vitals.length)]
    const direction = directions[Math.floor(Math.random() * directions.length)]
    const vitalType = vital.toLowerCase().replace(' ', '') as VitalType
    const value = generateVitalReading(vitalType)
    const threshold = severity === 'critical' ? 160 : 140

    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      vital,
      value,
      unit: VITAL_RANGES[vitalType as keyof typeof VITAL_RANGES].unit,
      threshold,
      direction,
      message: `${vital} is ${direction} threshold`,
      severity,
      timestamp,
      isRead: Math.random() > 0.5,
      smsSent: severity === 'critical',
      smsRecipients: severity === 'critical' ? ['+254712345678'] : [],
    })
  }

  return alerts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
}
