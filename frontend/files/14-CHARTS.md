# 14 — Charts

## Library: Recharts

```bash
npm install recharts
```

All charts are wrapped in `<ResponsiveContainer>` and use VITALIS theme colors.

---

## Chart Color Map per Vital

```ts
export const VITAL_CHART_COLORS: Record<
  VitalType,
  { stroke: string; fill: string }
> = {
  heartRate: { stroke: '#ef4444', fill: '#fef2f2' }, // red-500 / red-50
  bloodPressure: { stroke: '#a855f7', fill: '#faf5ff' }, // purple-500 / purple-50
  spo2: { stroke: '#3b82f6', fill: '#eff6ff' }, // blue-500 / blue-50
  temperature: { stroke: '#f97316', fill: '#fff7ed' }, // orange-500 / orange-50
  glucose: { stroke: '#0d9488', fill: '#f0fdfa' }, // teal-600 / teal-50
}
```

---

## Chart 1: `VitalsAreaChart` — 24-Hour Trend

Used on: Vitals page (`VitalsChartPanel`)

```tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface Props {
  data: VitalDataPoint[]
  vitalType: VitalType
  minThreshold?: number
  maxThreshold?: number
  height?: number
}

export function VitalsAreaChart({
  data,
  vitalType,
  minThreshold,
  maxThreshold,
  height = 250,
}: Props) {
  const { stroke, fill } = VITAL_CHART_COLORS[vitalType]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id={`gradient-${vitalType}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={stroke} stopOpacity={0.15} />
            <stop offset="95%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />

        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          interval={3} // Show every 4th label to avoid crowding
        />

        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={40}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#64748b', marginBottom: '4px' }}
          itemStyle={{ color: '#0f172a' }}
        />

        {minThreshold && (
          <ReferenceLine
            y={minThreshold}
            stroke="#f97316"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: 'Min',
              position: 'insideTopLeft',
              fontSize: 10,
              fill: '#f97316',
            }}
          />
        )}
        {maxThreshold && (
          <ReferenceLine
            y={maxThreshold}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: 'Max',
              position: 'insideTopLeft',
              fontSize: 10,
              fill: '#ef4444',
            }}
          />
        )}

        <Area
          type="monotone"
          dataKey="value"
          stroke={stroke}
          strokeWidth={2}
          fill={`url(#gradient-${vitalType})`}
          dot={false}
          activeDot={{ r: 4, fill: stroke, strokeWidth: 2, stroke: '#ffffff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

---

## Chart 2: `VitalsLineChart` — 7-Day Trend

Used on: Analytics page (`WeeklyTrendChart`)

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Single vital 7-day view
export function VitalsLineChart({ data, vitalType, height = 220 }: Props) {
  const { stroke } = VITAL_CHART_COLORS[vitalType]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #f1f5f9',
            fontSize: '12px',
          }}
        />
        <Line
          type="monotone"
          dataKey="avg"
          stroke={stroke}
          strokeWidth={2}
          dot={{ r: 3, fill: stroke }}
        />
        <Line
          type="monotone"
          dataKey="max"
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
          opacity={0.5}
        />
        <Line
          type="monotone"
          dataKey="min"
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
          opacity={0.5}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

## Chart 3: `TrendSparkline` — Mini Inline Chart

Used on: VitalCard (overview + vitals pages)

```tsx
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export function TrendSparkline({
  data,
  color = '#0d9488',
  height = 40,
}: TrendSparklineProps) {
  const chartData = data.map((value, i) => ({ i, value }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={chartData}
        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
      >
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

## Chart 4: `RiskGaugeChart` — Semicircle Gauge

Used on: Overview (`RiskScoreCard`), Analytics (`RiskTrendCard`)

```tsx
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from 'recharts'

const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#22c55e', // green-500
  moderate: '#f97316', // orange-500
  high: '#ef4444', // red-500
  critical: '#dc2626', // red-600
}

export function RiskGaugeChart({ score, level }: RiskGaugeChartProps) {
  const color = RISK_COLORS[level]
  const data = [{ value: score, fill: color }]

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={160}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: '#f1f5f9' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Center label — absolutely positioned */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-3xl font-semibold tabular-nums text-slate-900">
          {score}
        </p>
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color }}
        >
          {level}
        </p>
      </div>
    </div>
  )
}
```

---

## Chart Loading Skeletons

While charts are loading, render a skeleton placeholder:

```tsx
// Chart loading skeleton
<div className="flex h-[250px] animate-pulse items-end gap-2 px-4">
  {Array.from({ length: 12 }).map((_, i) => (
    <div
      key={i}
      className="flex-1 rounded-t-sm bg-slate-100"
      style={{ height: `${20 + Math.random() * 60}%` }}
    />
  ))}
</div>
```

---

## General Chart Rules

1. **No inline styles** — use `style` prop on Recharts SVG elements only where Tailwind can't reach (e.g. SVG `stroke` color values). All layout uses Tailwind.
2. **Always wrap in `<ResponsiveContainer>`** — never set fixed pixel widths.
3. **Grid lines** — always `vertical={false}`, always `stroke="#f1f5f9"` (slate-100).
4. **Axes** — always `tickLine={false}` and `axisLine={false}` for clean look.
5. **Tooltips** — always use custom `contentStyle` matching VITALIS card style.
6. **Threshold lines** — orange dashed for min, red dashed for max.
