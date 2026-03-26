# 07 — Components

## Shared Reusable Components (`src/components/shared/`)

---

### `VitalCard.tsx`

The most-used component — displays a single vital metric.

```tsx
interface VitalCardProps {
  vital: VitalType // 'heartRate' | 'bloodPressure' | 'spo2' | 'temperature' | 'glucose'
  value: string // formatted value e.g. "72" or "120/80"
  unit: string // "bpm", "%", "°C", "mmol/L"
  status: VitalStatus // 'normal' | 'warning' | 'critical'
  trend: TrendDirection // 'up' | 'down' | 'stable'
  sparklineData: number[] // last 10 readings for mini chart
  lastUpdated: Date
  onClick?: () => void
}
```

**Visual structure:**

```
┌─────────────────────────────────┐
│ [Icon bg]  Heart Rate   [badge] │
│            72 bpm               │
│            ↑ +2 from last hr    │
│ [sparkline ──────────────────]  │
│ Last updated 2 min ago          │
└─────────────────────────────────┘
```

**Vital color mapping:**

```ts
const VITAL_COLORS: Record<VitalType, string> = {
  heartRate: 'text-red-500  bg-red-50',
  bloodPressure: 'text-purple-500 bg-purple-50',
  spo2: 'text-blue-500 bg-blue-50',
  temperature: 'text-orange-500 bg-orange-50',
  glucose: 'text-teal-600 bg-teal-50',
}
```

**Status border mapping:**

```ts
const STATUS_BORDER: Record<VitalStatus, string> = {
  normal: 'border-slate-100 hover:border-teal-100',
  warning: 'border-orange-200',
  critical: 'border-red-200 bg-red-50/30',
}
```

---

### `StatusBadge.tsx`

```tsx
interface StatusBadgeProps {
  status: VitalStatus
  size?: 'sm' | 'md'
}
```

```tsx
const STATUS_STYLES: Record<VitalStatus, string> = {
  normal: 'bg-green-50 text-green-700',
  warning: 'bg-orange-50 text-orange-700',
  critical: 'bg-red-50 text-red-600',
}

// Renders: rounded-full px-2.5 py-0.5 text-xs font-medium
// Label: "Normal" | "Warning" | "Critical"
```

---

### `TrendSparkline.tsx`

```tsx
interface TrendSparklineProps {
  data: number[] // array of values
  color?: string // tailwind hex — defaults to '#0d9488' (teal-600)
  height?: number // default 40
  showDot?: boolean // show last point as dot
}
```

- Uses Recharts `<LineChart>` with no axes, no grid
- `<Line>` with `dot={false}` (except last point if `showDot`)
- Responsive: `<ResponsiveContainer width="100%" height={height}>`

---

### `SectionHeader.tsx`

```tsx
interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode // optional right-side button/badge
  badge?: string // optional count badge
}
```

```
[Title]    [badge]         [action button]
[subtitle]
```

- Title: `text-xl font-semibold tracking-tight text-slate-900`
- Subtitle: `text-sm text-slate-500`
- Badge: teal pill `rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700`

---

### `EmptyState.tsx`

```tsx
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}
```

- Centered layout, icon in teal-50 bg circle
- Used in AlertsTable, SMSLogPanel when no data

---

### `LoadingSpinner.tsx`

```tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}
```

- Centered `div` with `animate-spin` circle in teal-600
- Optional label text below: `text-sm text-slate-500`

---

### `ErrorBoundary.tsx`

```tsx
interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}
```

- Red-50 card with error message
- "Retry" button → calls `reset()` (TanStack Query `refetch`)

---

### `LiveIndicator.tsx`

```tsx
interface LiveIndicatorProps {
  label?: string // default "Live"
}
```

- Pulsing ping animation (see 04-THEME.md)
- `animate-ping` on outer span, solid dot on inner span
- Green color: `bg-green-400` / `bg-green-500`

---

## Chart Components (`src/components/charts/`)

---

### `VitalsLineChart.tsx`

```tsx
interface VitalsLineChartProps {
  data: VitalDataPoint[] // { time: string; value: number }[]
  color?: string // hex, default teal-600 (#0d9488)
  minThreshold?: number
  maxThreshold?: number
  unit?: string
  height?: number // default 250
}
```

**Recharts setup:**

```tsx
<ResponsiveContainer width="100%" height={height}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
    <Tooltip
      contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9' }}
    />
    {minThreshold && (
      <ReferenceLine y={minThreshold} stroke="#f97316" strokeDasharray="4 4" />
    )}
    {maxThreshold && (
      <ReferenceLine y={maxThreshold} stroke="#ef4444" strokeDasharray="4 4" />
    )}
    <Line
      type="monotone"
      dataKey="value"
      stroke={color}
      strokeWidth={2}
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>
```

---

### `VitalsAreaChart.tsx`

Same props as `VitalsLineChart` — uses `<AreaChart>` with gradient fill:

```tsx
<defs>
  <linearGradient id="vitalsGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
  </linearGradient>
</defs>
<Area fill="url(#vitalsGradient)" stroke="#0d9488" strokeWidth={2} />
```

---

### `RiskGaugeChart.tsx`

```tsx
interface RiskGaugeChartProps {
  score: number // 0–100
  level: RiskLevel // 'low' | 'moderate' | 'high' | 'critical'
}
```

- Recharts `<RadialBarChart>` with single bar
- Color: green (0–30) / orange (31–60) / red (61–100)
- Center label: score number + level text
- `startAngle={180}` `endAngle={0}` — semicircle gauge

---

## lucide-react Icon Mapping

```ts
import {
  Activity, // Heart Rate
  Droplets, // SpO2 / Blood Pressure
  Thermometer, // Temperature
  FlaskConical, // Blood Glucose
  Bell, // Alerts / Notifications
  BarChart3, // Analytics
  LayoutDashboard, // Overview
  Settings, // Settings
  AlertTriangle, // Warning alerts
  AlertCircle, // Critical alerts
  CheckCircle2, // Normal status
  ArrowUp, // Trend up
  ArrowDown, // Trend down
  Minus, // Trend stable
  MessageSquare, // SMS
  User, // Patient
  Phone, // Contact
} from 'lucide-react'
```
