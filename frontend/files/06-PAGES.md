# 06 — Pages

## All 5 Dashboard Pages

---

## Page 1: Overview (`/dashboard/overview`)

**Purpose:** At-a-glance health snapshot — the patient's daily health homescreen.

### Layout
```
WelcomeBanner          (full width)
QuickStatsRow          (full width — 3 stat chips)
VitalsSummaryGrid      (full width — 5 vital cards)
─────── 2-col grid ────────────────────────────────
RecentAlertsList       (col-span-2)    │ RiskScoreCard (col-span-1)
```

### Sections

**`WelcomeBanner`**
- "Good morning, Jane 👋" greeting (time-based)
- Current date in full: "Friday, 27 March 2026"
- Sub-text: "Your vitals are being monitored continuously."
- Right side: `LiveIndicator` badge

**`QuickStatsRow`**
- 3 mini stat chips in a horizontal row:
  - Today's Average Heart Rate: `72 bpm`
  - Current SpO2: `98%`
  - Last Reading: `2 mins ago`
- Style: `rounded-full border border-slate-100 bg-white px-4 py-2 text-sm`

**`VitalsSummaryGrid`**
- 5 `VitalCard` components in a responsive grid
- Each card shows: icon + name + current value + unit + `StatusBadge` + mini sparkline
- Cards are teal-bordered when normal, orange when warning, red when critical

**`RiskScoreCard`**
- Large card with `RiskGaugeChart` (radial bar)
- Risk level: Low / Moderate / High / Critical
- Risk score: 0–100 number
- Description text: "Based on your last 24h vitals"
- Color reflects risk level

**`RecentAlertsList`**
- Title: "Recent Alerts"
- Last 5 alert events as rows
- Each row: severity dot + vital name + value + timestamp + "View" button
- "View all alerts →" link at bottom

---

## Page 2: Vitals (`/dashboard/vitals`)

**Purpose:** Deep-dive into each vital — current reading, full 24h chart, hourly table.

### Layout
```
VitalsHeader           (full width — title + live badge)
VitalSelector          (full width — tab strip)
─────── 2-col grid ────────────────────────────────────
VitalDetailCard        (col-span-1)  │ VitalsChartPanel (col-span-2)
VitalsDataTable        (full width)
```

### Sections

**`VitalsHeader`**
- Title: "Vitals Monitor"
- Subtitle: "Real-time readings updated every 5 seconds"
- `LiveIndicator` badge (right-aligned)

**`VitalSelector`**
- shadcn `<Tabs>` strip with 5 tabs:
  - `❤️ Heart Rate` | `🩸 Blood Pressure` | `💧 SpO2` | `🌡️ Temperature` | `🩸 Glucose`
- Selected tab drives which vital is shown below
- Store selected vital in local `useState` (not Zustand — it's page-local)

**`VitalDetailCard`**
- Large current reading display
- Vital name + icon (colored per vital)
- Big metric value (`text-4xl font-semibold`) + unit
- `StatusBadge`
- Threshold range display: "Normal: 60–100 bpm"
- Trend arrow (↑ ↓ →) with color based on direction

**`VitalsChartPanel`**
- Title: "24-Hour Trend"
- `VitalsAreaChart` (Recharts) — full width, h-64
- X-axis: hours (00:00 → now)
- Y-axis: vital value
- Threshold lines: `<ReferenceLine>` for min/max normal range
- Color: teal-600 line, teal-50 area fill

**`VitalsDataTable`**
- Title: "Hourly Readings"
- shadcn `<Table>` — columns: Time | Value | Status | Trend
- Last 24 rows (one per hour)
- Status column uses `StatusBadge`
- Alternating row bg: `even:bg-slate-50`

---

## Page 3: Alerts (`/dashboard/alerts`)

**Purpose:** Complete alert history with severity filtering and SMS log.

### Layout
```
AlertsHeader           (full width)
AlertsFilterBar        (full width)
─────── 2-col grid ────────────────────────────────────
AlertsTable            (col-span-2)  │ SMSLogPanel (col-span-1)
AlertDetailSheet       (slide-in — triggered by row click)
```

### Sections

**`AlertsHeader`**
- Title: "Alerts & Risk Flags"
- Unread count badge: `[3 unread]`
- "Mark all as read" button (secondary style)

**`AlertsFilterBar`**
- shadcn `<Select>` — Filter by Severity: All / Critical / Warning / Info
- shadcn `<Select>` — Filter by Vital: All / Heart Rate / BP / SpO2 / Temp / Glucose
- shadcn `<Button>` — "Clear filters" (ghost)

**`AlertsTable`**
- shadcn `<Table>` — columns:
  - Severity (colored dot + label)
  - Vital
  - Value (at time of alert)
  - Threshold breached
  - Date/Time
  - SMS Sent (✓ or ✗)
  - Actions (View details button)
- Clicking "View details" opens `AlertDetailSheet`
- Empty state: `EmptyState` component

**`AlertDetailSheet`**
- shadcn `<Sheet>` (side panel, right)
- Full alert detail: vital readings at time, threshold, description
- "SMS sent to: +254 7XX XXX XXX" if SMS was fired
- "Dismiss alert" button

**`SMSLogPanel`**
- Title: "SMS Notifications"
- List of SMS events: timestamp + recipient + message preview
- Status indicator: Delivered / Failed
- "Test SMS" button (sends a test to saved numbers)

---

## Page 4: Analytics (`/dashboard/analytics`)

**Purpose:** 7-day trends, aggregated stats, population benchmarks.

### Layout
```
AnalyticsHeader        (full width — title + date range picker)
─────── stats row ─────────────────────────────────────────
VitalStatsTable        (full width — avg/min/max for all vitals)
─────── 2-col grid ────────────────────────────────────────
WeeklyTrendChart       (col-span-2)  │ RiskTrendCard (col-span-1)
PopulationBenchmark    (full width)
```

### Sections

**`AnalyticsHeader`**
- Title: "Health Analytics"
- Subtitle: "Your 7-day health summary"
- shadcn `<Select>` date range: Last 7 days / Last 14 days / Last 30 days

**`VitalStatsTable`**
- shadcn `<Table>` — rows per vital:
  - Vital | Average | Min | Max | Trend (↑↓→) | Status
- Color-coded status per vital
- Compact row height

**`WeeklyTrendChart`**
- shadcn `<Tabs>` to switch between vitals
- `VitalsLineChart` (Recharts) — 7 data points (daily averages)
- X-axis: day labels (Mon, Tue … Sun)
- Multiple series option: show all 5 vitals as separate lines

**`RiskTrendCard`**
- Risk score per day for last 7 days
- Small `VitalsLineChart` — red/orange/green zones
- Current risk level badge

**`PopulationBenchmark`**
- Title: "How You Compare"
- 5 horizontal progress bars — one per vital
- Each bar: patient value vs population average
- Label: "Your HR is in the top 30% for your age group"
- shadcn `<Progress>` component

---

## Page 5: Settings (`/dashboard/settings`)

**Purpose:** Configure contacts, thresholds, and notification preferences.

### Layout
```
SettingsHeader         (full width)
─────── 2-col grid ────────────────────────────────────────
ContactSettings        (left col)   │ NotificationSettings (right col)
ThresholdSettings      (full width)
ProfileSettings        (full width)
```

### Sections

**`SettingsHeader`**
- Title: "Settings"
- Subtitle: "Manage your monitoring preferences"
- "Save all changes" button (primary)

**`ContactSettings`**
- Card title: "Alert Contacts"
- Patient phone number input
- Doctor phone number input
- Doctor name input
- shadcn `<Input>` components
- "Save contacts" button → updates `useSettingsStore`

**`NotificationSettings`**
- Card title: "Notification Preferences"
- 3 shadcn `<Switch>` toggles:
  - Send SMS for Critical alerts
  - Send SMS for Warning alerts
  - Show on-screen toasts for all alerts
- Updates `useSettingsStore`

**`ThresholdSettings`**
- Card title: "Alert Thresholds"
- Per-vital min/max inputs (10 inputs total):
  - Heart Rate: Min `[60]` Max `[100]` bpm
  - Blood Pressure Systolic: Min `[90]` Max `[140]` mmHg
  - Blood Pressure Diastolic: Min `[60]` Max `[90]` mmHg
  - SpO2: Min `[95]` Max `[100]` %
  - Temperature: Min `[36.1]` Max `[37.2]` °C
  - Blood Glucose: Min `[4.0]` Max `[7.8]` mmol/L
- "Reset to clinical defaults" button (ghost)
- Updates `useSettingsStore`

**`ProfileSettings`**
- Card title: "Patient Profile"
- Name, age, gender inputs
- Condition tags (multi-select): Hypertension / Diabetes / Cardiac / None
- shadcn `<Badge>` pills for selected conditions
- Updates `usePatientStore`
