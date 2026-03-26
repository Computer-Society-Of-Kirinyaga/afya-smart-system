# 15 — Development Order

## Guiding Principle
Build from the inside out — types → data → state → layout → pages → features.
Never build UI before the data shape is clear.

---

## Phase 1 — Foundation (Day 1)

### Step 1: Project Setup
```bash
npm create vite@latest vitalis-dashboard -- --template react-ts
cd vitalis-dashboard
npm install
```

### Step 2: Install all dependencies
```bash
# Core
npm install @tanstack/react-router @tanstack/react-query zustand

# UI
npm install recharts lucide-react

# shadcn setup
npx shadcn@latest init

# shadcn components
npx shadcn@latest add card badge button table tabs select input switch sheet avatar progress separator tooltip sonner skeleton
```

### Step 3: Configure paths
- Set up `@/` alias in `vite.config.ts` and `tsconfig.json`
- Add DM Sans font to `index.html`
- Set up `globals.css` with `@tailwind` directives + reveal animation keyframe

### Step 4: Types (`src/types/`)
Build ALL types first — this prevents rework later.
- `vitals.ts`
- `alerts.ts`
- `analytics.ts`
- `patient.ts`
- `settings.ts`
- `sms.ts`
- `index.ts` (re-exports)

**Checkpoint:** `tsc --noEmit` should pass with zero errors.

---

## Phase 2 — Data & State (Day 1–2)

### Step 5: Mock data (`src/lib/mockData.ts`)
- `generateCurrentVitals()`
- `generate24HourHistory()`
- `generate7DayAnalytics()`
- `generateAlertHistory()`
- `generateSmsLog()`
- `MOCK_PATIENT`
- `calculateRiskScore()`

### Step 6: Thresholds (`src/lib/thresholds.ts`)
- `DEFAULT_THRESHOLDS`
- `checkThresholds()`

### Step 7: Query client (`src/lib/queryClient.ts` + `src/lib/queryKeys.ts`)

### Step 8: Zustand stores (`src/stores/`)
- `useAlertStore.ts`
- `useSettingsStore.ts`
- `usePatientStore.ts`

### Step 9: TanStack Query hooks (`src/hooks/`)
- `useVitalsQuery.ts`
- `useAlertsQuery.ts`
- `useAnalyticsQuery.ts`
- `useSmsLogQuery.ts`

**Checkpoint:** Test hooks in a throwaway component — verify data returns correctly.

---

## Phase 3 — Layout Shell (Day 2)

### Step 10: Shared primitive components (`src/components/shared/`)
Build these before any pages — they're used everywhere:
1. `StatusBadge.tsx`
2. `LiveIndicator.tsx`
3. `LoadingSpinner.tsx`
4. `EmptyState.tsx`
5. `ErrorBoundary.tsx`
6. `SectionHeader.tsx`

### Step 11: Chart components (`src/components/charts/`)
1. `TrendSparkline.tsx` (simplest — used in VitalCard)
2. `VitalsAreaChart.tsx`
3. `VitalsLineChart.tsx`
4. `RiskGaugeChart.tsx`

### Step 12: Layout components (`src/content/layout/`)
1. `DashboardShell.tsx` (outer wrapper — mount `useAlertEngine` here)
2. `Sidebar.tsx`
3. `Topbar.tsx`
4. `MobileNav.tsx`

### Step 13: TanStack Router setup
1. `src/routes/__root.tsx`
2. `src/routes/index.tsx` (redirect)
3. All 5 dashboard route files (empty page components for now)
4. `src/main.tsx` — wire up router + query client

**Checkpoint:** App loads, sidebar shows, navigation between routes works.

---

## Phase 4 — Pages (Day 2–4)

Build pages in this order (simplest → most complex):

### Step 14: Settings Page (no charts, pure forms)
1. `SettingsHeader.tsx`
2. `ProfileSettings.tsx`
3. `ContactSettings.tsx`
4. `NotificationSettings.tsx`
5. `ThresholdSettings.tsx`
6. `SettingsPage.tsx` (compose)

**Checkpoint:** Settings save to Zustand + localStorage, survive page refresh.

### Step 15: Overview Page
1. `VitalCard.tsx` (shared — will be reused in Vitals page)
2. `WelcomeBanner.tsx`
3. `QuickStatsRow.tsx`
4. `VitalsSummaryGrid.tsx`
5. `RiskScoreCard.tsx`
6. `RecentAlertsList.tsx`
7. `OverviewPage.tsx`

**Checkpoint:** Vitals display correctly, update every 5s, status badges match values.

### Step 16: Vitals Page
1. `VitalsHeader.tsx`
2. `VitalSelector.tsx`
3. `VitalDetailCard.tsx`
4. `VitalsChartPanel.tsx`
5. `VitalsDataTable.tsx`
6. `VitalsPage.tsx`

**Checkpoint:** Switching tabs updates chart + detail card. Threshold lines visible.

### Step 17: Alerts Page
1. `AlertsHeader.tsx`
2. `AlertsFilterBar.tsx`
3. `AlertsTable.tsx`
4. `AlertDetailSheet.tsx`
5. `SMSLogPanel.tsx`
6. `AlertsPage.tsx`

**Checkpoint:** Filters work, sheet opens on row click, SMS log shows mock data.

### Step 18: Analytics Page
1. `AnalyticsHeader.tsx`
2. `VitalStatsTable.tsx`
3. `WeeklyTrendChart.tsx`
4. `RiskTrendCard.tsx`
5. `PopulationBenchmark.tsx`
6. `AnalyticsPage.tsx`

**Checkpoint:** 7-day charts render, progress bars show benchmarks.

---

## Phase 5 — Alert Engine & SMS (Day 4)

### Step 19: Alert engine
1. `src/hooks/useAlertEngine.ts`
2. Mount in `DashboardShell.tsx`
3. Wire up sonner `<Toaster>` in `App.tsx`

**Checkpoint:** Trigger a threshold breach by temporarily lowering thresholds in settings → toast appears, alert appears in store, bell badge updates.

### Step 20: SMS service
1. `src/lib/smsService.ts`
2. `src/hooks/useSmsNotification.ts`
3. Create `.env.local` with dummy keys
4. Test that SMS call is attempted (check network tab)

**Checkpoint:** With real Africa's Talking credentials, SMS sends. Without credentials, graceful fallback.

---

## Phase 6 — Polish (Day 5)

### Step 21: Loading states
- Add `<Skeleton>` placeholders to all cards and tables
- Verify all `isLoading` / `isError` branches render correctly

### Step 22: Responsive layout
- Test mobile layout (bottom nav, stacked cards)
- Test tablet (2-col layout)
- Test desktop (full sidebar, 3-col grids)

### Step 23: Animations
- Add `animate-reveal` to page section entries
- Verify `animate-ping` on LiveIndicator
- Verify hover transitions on cards and nav links

### Step 24: Final TypeScript audit
```bash
tsc --noEmit
```
- Fix all type errors
- Remove any unused imports
- Verify no `any` types anywhere

### Step 25: Final render check
- Navigate to every page
- Trigger an alert manually (lower a threshold)
- Check SMS log populates
- Check settings persist on refresh
- Check all charts display with correct vital colors

---

## Common Pitfalls to Avoid

| Pitfall | Prevention |
|---------|-----------|
| `any` types sneaking in | Run `tsc --noEmit` after each phase |
| Zustand re-renders | Always use selectors, not full store |
| Charts not responsive | Always use `<ResponsiveContainer>` |
| Alerts firing every 5s | Debounce with `lastAlertTime` ref |
| SMS called with missing credentials | Check env vars before calling API |
| Route files with JSX logic | Route files import one component only |
| Inline styles on components | All styling via Tailwind className only |
| Missing loading states | Every `useQuery` must handle `isLoading` |
