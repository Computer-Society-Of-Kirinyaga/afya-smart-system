# 03 — Routing

## Router: TanStack Router (File-based)

All routes use TanStack Router's `createFileRoute` or `createRootRoute` pattern.

---

## Route Tree

```
/ (root layout — DashboardShell)
└── /dashboard
    ├── /overview          ← default landing
    ├── /vitals
    ├── /alerts
    ├── /analytics
    └── /settings
```

---

## File Implementations

### `src/routes/__root.tsx`
```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { DashboardShell } from '@/content/layout/DashboardShell'

export const Route = createRootRoute({
  component: () => (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  ),
})
```

### `src/routes/index.tsx`
```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/overview' })
  },
})
```

### `src/routes/dashboard/overview.tsx`
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { OverviewPage } from '@/content/overview/OverviewPage'

export const Route = createFileRoute('/dashboard/overview')({
  component: OverviewPage,
})
```

### `src/routes/dashboard/vitals.tsx`
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { VitalsPage } from '@/content/vitals/VitalsPage'

export const Route = createFileRoute('/dashboard/vitals')({
  component: VitalsPage,
})
```

### `src/routes/dashboard/alerts.tsx`
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { AlertsPage } from '@/content/alerts/AlertsPage'

export const Route = createFileRoute('/dashboard/alerts')({
  component: AlertsPage,
})
```

### `src/routes/dashboard/analytics.tsx`
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '@/content/analytics/AnalyticsPage'

export const Route = createFileRoute('/dashboard/analytics')({
  component: AnalyticsPage,
})
```

### `src/routes/dashboard/settings.tsx`
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/content/settings/SettingsPage'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})
```

---

## Page Composition Pattern

Each `content/<page>/` folder exports one **Page** component that composes all sections:

```tsx
// content/overview/OverviewPage.tsx
import { WelcomeBanner } from './WelcomeBanner'
import { VitalsSummaryGrid } from './VitalsSummaryGrid'
import { RiskScoreCard } from './RiskScoreCard'
import { RecentAlertsList } from './RecentAlertsList'
import { QuickStatsRow } from './QuickStatsRow'

export function OverviewPage() {
  return (
    <div className="flex flex-col gap-y-6 px-6 py-8 lg:px-[6%]">
      <WelcomeBanner />
      <QuickStatsRow />
      <VitalsSummaryGrid />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAlertsList />
        </div>
        <RiskScoreCard />
      </div>
    </div>
  )
}
```

---

## Navigation Links (used in Sidebar)

```ts
export const NAV_LINKS = [
  { label: 'Overview',   to: '/dashboard/overview',   icon: 'LayoutDashboard' },
  { label: 'Vitals',     to: '/dashboard/vitals',     icon: 'Activity' },
  { label: 'Alerts',     to: '/dashboard/alerts',     icon: 'Bell' },
  { label: 'Analytics',  to: '/dashboard/analytics',  icon: 'BarChart3' },
  { label: 'Settings',   to: '/dashboard/settings',   icon: 'Settings' },
] as const
```

---

## Active Link Styling

Use TanStack Router's `<Link>` with `activeProps`:

```tsx
<Link
  to={link.to}
  className="flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors duration-300 hover:bg-teal-50 hover:text-teal-600"
  activeProps={{
    className: 'bg-teal-50 text-teal-600 border-l-2 border-teal-600',
  }}
>
```

---

## App Bootstrap (`src/main.tsx`)

```tsx
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

const router = createRouter({ routeTree })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
```
