# 08 — Mock Data

## `src/lib/mockData.ts`

All mock data generators used by TanStack Query hooks.

---

## Vital Ranges (for realistic generation)

```ts
export const VITAL_RANGES = {
  heartRate: { min: 58, max: 105, unit: 'bpm', decimals: 0 },
  systolic:  { min: 105, max: 145, unit: 'mmHg', decimals: 0 },
  diastolic: { min: 65, max: 95,  unit: 'mmHg', decimals: 0 },
  spo2:      { min: 93, max: 100, unit: '%', decimals: 1 },
  temperature: { min: 35.8, max: 38.2, unit: '°C', decimals: 1 },
  glucose:   { min: 3.8, max: 9.5, unit: 'mmol/L', decimals: 1 },
} as const
```

---

## Current Vitals Generator

```ts
// Returns a single snapshot of all current vitals
export function generateCurrentVitals(): CurrentVitals {
  return {
    heartRate: {
      value: randomBetween(60, 100),
      unit: 'bpm',
      timestamp: new Date(),
    },
    bloodPressure: {
      systolic: randomBetween(110, 135),
      diastolic: randomBetween(70, 88),
      unit: 'mmHg',
      timestamp: new Date(),
    },
    spo2: {
      value: randomBetween(95, 100, 1),
      unit: '%',
      timestamp: new Date(),
    },
    temperature: {
      value: randomBetween(36.1, 37.5, 1),
      unit: '°C',
      timestamp: new Date(),
    },
    glucose: {
      value: randomBetween(4.2, 7.2, 1),
      unit: 'mmol/L',
      timestamp: new Date(),
    },
  }
}

function randomBetween(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min
  return parseFloat(val.toFixed(decimals))
}
```

---

## 24-Hour History Generator

```ts
// Generates 24 hourly data points ending at now
export function generate24HourHistory(
  vitalKey: keyof typeof VITAL_RANGES
): VitalDataPoint[] {
  const now = new Date()
  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
    const range = VITAL_RANGES[vitalKey]
    return {
      time: time.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
      value: randomBetween(range.min, range.max, range.decimals),
      timestamp: time,
    }
  })
}
```

---

## 7-Day Analytics Generator

```ts
export function generate7DayAnalytics(): WeeklyAnalytics {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return {
    heartRate: days.map(day => ({
      day,
      avg: randomBetween(65, 85),
      min: randomBetween(55, 65),
      max: randomBetween(90, 110),
    })),
    spo2: days.map(day => ({
      day,
      avg: randomBetween(96, 99, 1),
      min: randomBetween(94, 96, 1),
      max: randomBetween(99, 100, 1),
    })),
    temperature: days.map(day => ({
      day,
      avg: randomBetween(36.4, 37.1, 1),
      min: randomBetween(36.0, 36.4, 1),
      max: randomBetween(37.1, 37.8, 1),
    })),
    glucose: days.map(day => ({
      day,
      avg: randomBetween(4.5, 6.5, 1),
      min: randomBetween(3.8, 4.5, 1),
      max: randomBetween(6.5, 8.5, 1),
    })),
  }
}
```

---

## Alert History Generator

```ts
const ALERT_TEMPLATES: AlertTemplate[] = [
  { vital: 'heartRate', message: 'Heart rate elevated', threshold: 100, unit: 'bpm' },
  { vital: 'heartRate', message: 'Heart rate too low', threshold: 60, unit: 'bpm' },
  { vital: 'spo2',      message: 'Oxygen saturation low', threshold: 95, unit: '%' },
  { vital: 'temperature', message: 'Fever detected', threshold: 37.5, unit: '°C' },
  { vital: 'glucose',   message: 'Blood glucose high', threshold: 7.8, unit: 'mmol/L' },
  { vital: 'bloodPressure', message: 'Blood pressure elevated', threshold: 140, unit: 'mmHg' },
]

export function generateAlertHistory(count = 20): AlertEvent[] {
  return Array.from({ length: count }, (_, i) => {
    const template = ALERT_TEMPLATES[i % ALERT_TEMPLATES.length]
    const hoursAgo = i * 3 + randomBetween(0, 2)
    return {
      id: `alert-${i}`,
      vital: template.vital,
      message: template.message,
      value: `${template.threshold + randomBetween(-5, 10)} ${template.unit}`,
      severity: i % 5 === 0 ? 'critical' : i % 2 === 0 ? 'warning' : 'info',
      timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
      isRead: i > 2,
      smsSent: i % 3 !== 0,
      smsRecipients: ['+254700000001', '+254700000002'],
    }
  })
}
```

---

## Patient Profile Mock

```ts
export const MOCK_PATIENT: Patient = {
  id: 'patient-001',
  name: 'Jane Wanjiku',
  age: 42,
  gender: 'Female',
  phone: '+254712345678',
  doctorName: 'Dr. Kamau Njoroge',
  doctorPhone: '+254722987654',
  conditions: ['Hypertension', 'Type 2 Diabetes'],
  enrolledAt: new Date('2025-01-15'),
}
```

---

## Risk Score Generator

```ts
export function calculateRiskScore(vitals: CurrentVitals): RiskScore {
  let score = 0
  // HR outside 60–100 → +20 each
  if (vitals.heartRate.value > 100 || vitals.heartRate.value < 60) score += 20
  // SpO2 < 95 → +30
  if (vitals.spo2.value < 95) score += 30
  // Temp > 37.5 → +15
  if (vitals.temperature.value > 37.5) score += 15
  // Glucose > 7.8 → +20
  if (vitals.glucose.value > 7.8) score += 20
  // BP systolic > 140 → +15
  if (vitals.bloodPressure.systolic > 140) score += 15

  return {
    score: Math.min(score, 100),
    level: score >= 60 ? 'critical' : score >= 30 ? 'high' : score >= 15 ? 'moderate' : 'low',
  }
}
```

---

## SMS Log Mock

```ts
export function generateSmsLog(count = 10): SmsLogEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `sms-${i}`,
    recipient: i % 2 === 0 ? '+254712345678' : '+254722987654',
    recipientLabel: i % 2 === 0 ? 'Patient (Jane)' : 'Doctor (Dr. Kamau)',
    message: `VITALIS ALERT: Heart rate reading of 108 bpm exceeds safe threshold. Please review immediately.`,
    sentAt: new Date(Date.now() - i * 4 * 60 * 60 * 1000),
    status: i === 1 ? 'failed' : 'delivered',
  }))
}
```
