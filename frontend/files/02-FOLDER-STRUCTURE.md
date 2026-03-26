# 02 — Folder Structure

## Complete `src/` Directory Tree

```
src/
├── main.tsx                        # App entry point
├── App.tsx                         # Router provider + QueryClient + Zustand
│
├── routes/
│   ├── __root.tsx                  # Root layout route (sidebar + topbar shell)
│   ├── index.tsx                   # Redirects to /dashboard/overview
│   ├── dashboard/
│   │   ├── overview.tsx            # Route: /dashboard/overview
│   │   ├── vitals.tsx              # Route: /dashboard/vitals
│   │   ├── alerts.tsx              # Route: /dashboard/alerts
│   │   ├── analytics.tsx           # Route: /dashboard/analytics
│   │   └── settings.tsx            # Route: /dashboard/settings
│
├── content/
│   ├── layout/
│   │   ├── DashboardShell.tsx      # Outer shell: sidebar + main content area
│   │   ├── Sidebar.tsx             # Left nav with VITALIS logo + nav links
│   │   ├── Topbar.tsx              # Top bar: page title + alert bell + avatar
│   │   └── MobileNav.tsx           # Bottom nav for mobile
│   │
│   ├── overview/
│   │   ├── WelcomeBanner.tsx       # Greeting + patient name + date
│   │   ├── VitalsSummaryGrid.tsx   # 5 vital cards in a grid
│   │   ├── RiskScoreCard.tsx       # Overall risk level card
│   │   ├── RecentAlertsList.tsx    # Last 5 alerts inline
│   │   └── QuickStatsRow.tsx       # Today's avg HR, steps, SpO2 summary
│   │
│   ├── vitals/
│   │   ├── VitalsHeader.tsx        # Page title + live indicator badge
│   │   ├── VitalDetailCard.tsx     # Large card: current value + sparkline
│   │   ├── VitalsChartPanel.tsx    # Full 24h trend chart for selected vital
│   │   ├── VitalSelector.tsx       # Tab/button strip to switch between vitals
│   │   └── VitalsDataTable.tsx     # Hourly readings table
│   │
│   ├── alerts/
│   │   ├── AlertsHeader.tsx        # Page title + unread count badge
│   │   ├── AlertsFilterBar.tsx     # Filter by severity / vital / date range
│   │   ├── AlertsTable.tsx         # Full alert history table
│   │   ├── AlertDetailSheet.tsx    # Side sheet: full alert detail
│   │   └── SMSLogPanel.tsx         # Log of SMS notifications sent
│   │
│   ├── analytics/
│   │   ├── AnalyticsHeader.tsx     # Page title + date range picker
│   │   ├── WeeklyTrendChart.tsx    # 7-day line chart per vital
│   │   ├── VitalStatsTable.tsx     # Avg / min / max table per vital
│   │   ├── RiskTrendCard.tsx       # Risk score over time
│   │   └── PopulationBenchmark.tsx # How patient compares to avg (mock)
│   │
│   └── settings/
│       ├── SettingsHeader.tsx      # Page title
│       ├── ContactSettings.tsx     # Patient phone + Doctor phone inputs
│       ├── ThresholdSettings.tsx   # Per-vital min/max threshold config
│       ├── NotificationSettings.tsx # SMS on/off toggles per alert type
│       └── ProfileSettings.tsx     # Patient name, age, condition tags
│
├── components/
│   ├── ui/                         # shadcn/ui auto-generated (do not edit)
│   │
│   ├── shared/
│   │   ├── VitalCard.tsx           # Reusable vital metric card
│   │   ├── StatusBadge.tsx         # normal / warning / critical badge
│   │   ├── TrendSparkline.tsx      # Mini inline Recharts line
│   │   ├── SectionHeader.tsx       # Consistent h2 + subtitle pattern
│   │   ├── EmptyState.tsx          # Empty list/table placeholder
│   │   ├── LoadingSpinner.tsx      # Centered spinner with teal color
│   │   ├── ErrorBoundary.tsx       # Query error fallback
│   │   └── LiveIndicator.tsx       # Pulsing green dot "LIVE" badge
│   │
│   └── charts/
│       ├── VitalsLineChart.tsx     # Recharts LineChart wrapper
│       ├── VitalsAreaChart.tsx     # Recharts AreaChart wrapper
│       └── RiskGaugeChart.tsx      # Recharts RadialBarChart for risk score
│
├── hooks/
│   ├── useVitalsQuery.ts           # TanStack Query: live vitals
│   ├── useAlertsQuery.ts           # TanStack Query: alert history
│   ├── useAnalyticsQuery.ts        # TanStack Query: 7-day analytics
│   ├── useAlertEngine.ts           # Threshold checking + toast dispatch
│   └── useSmsNotification.ts       # Africa's Talking SMS caller
│
├── stores/
│   ├── useAlertStore.ts            # Zustand: active alerts, unread count
│   ├── useSettingsStore.ts         # Zustand: thresholds, phone numbers, toggles
│   └── usePatientStore.ts          # Zustand: current patient profile
│
├── lib/
│   ├── mockData.ts                 # All mock data generators
│   ├── thresholds.ts               # Default clinical threshold constants
│   ├── smsService.ts               # Africa's Talking API wrapper
│   ├── formatters.ts               # Date, number, unit formatters
│   └── queryClient.ts              # TanStack QueryClient singleton
│
└── types/
    ├── vitals.ts                   # Vital reading interfaces
    ├── alerts.ts                   # Alert interfaces + enums
    ├── patient.ts                  # Patient profile interface
    ├── analytics.ts                # Analytics summary interfaces
    └── settings.ts                 # Settings/threshold interfaces
```

---

## Key Naming Conventions

| Pattern | Example |
|---------|---------|
| Route files — routing only, no JSX | `overview.tsx` imports `OverviewPage` |
| Content files — page sections | `WelcomeBanner.tsx` in `content/overview/` |
| Shared components — reusable primitives | `VitalCard.tsx` in `components/shared/` |
| Hooks — `use` prefix, descriptive | `useVitalsQuery.ts` |
| Stores — `use` prefix + `Store` suffix | `useAlertStore.ts` |
| Types — noun interfaces, PascalCase | `VitalReading`, `AlertEvent` |
| Mock data functions — `generate` prefix | `generateMockVitals()` |

---

## Rules

1. Route files (`src/routes/`) import one component and return it — nothing else.
2. All page composition happens in `content/<page>/` files.
3. `components/shared/` holds only truly reusable, stateless (or lightly stateful) primitives.
4. `components/ui/` is shadcn territory — never manually edit these files.
5. All stores live in `stores/` — never define Zustand state inside components.
6. All types live in `types/` — never define interfaces inline in component files.
