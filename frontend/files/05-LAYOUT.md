# 05 — Layout

## Dashboard Shell Architecture

The dashboard uses a classic **sidebar + main content** layout with a sticky topbar.

---

## Visual Structure

```
┌──────────────────────────────────────────────────────────┐
│  SIDEBAR (w-64, fixed)   │  TOPBAR (h-16, sticky)        │
│  ─────────────────────   │  ──────────────────────────── │
│  Logo: VITALIS           │  Page Title    🟢 LIVE  🔔  👤 │
│                          ├──────────────────────────────  │
│  ○ Overview              │                                │
│  ○ Vitals                │   PAGE CONTENT AREA            │
│  ○ Alerts  [3]           │   (scrollable)                 │
│  ○ Analytics             │                                │
│  ○ Settings              │   px-6 lg:px-[6%] py-8        │
│                          │                                │
│  ─────────────────────   │                                │
│  👤 Jane Doe             │                                │
│  View Profile →          │                                │
└──────────────────────────┴────────────────────────────────┘
```

---

## `DashboardShell.tsx`

```tsx
// content/layout/DashboardShell.tsx
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative min-h-screen bg-white font-sans">
      {/* Ambient background blurs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-sky-50 opacity-60 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-50 opacity-60 blur-[100px]" />
      </div>

      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar — desktop only */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-100 bg-white lg:flex lg:flex-col">
          <Sidebar />
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
```

---

## `Sidebar.tsx`

### Structure

```
┌─────────────────────────┐
│ [Logo mark] VITALIS     │  h-16, border-b border-slate-100
├─────────────────────────┤
│ NAVIGATION              │  text-[10px] font-bold uppercase tracking-widest text-slate-400
│   Overview              │  nav link
│   Vitals                │  nav link
│   Alerts        [3]     │  nav link + unread badge
│   Analytics             │  nav link
│   Settings              │  nav link
├─────────────────────────┤
│ [Avatar] Jane Doe       │  mt-auto, p-4
│ View Profile →          │
└─────────────────────────┘
```

### Key Implementation Notes

- Use `<Link>` from `@tanstack/react-router` with `activeProps`
- Unread alert count from `useAlertStore` — show only if > 0
- Logo mark: `h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center` with white "V" text
- Patient name from `usePatientStore`

---

## `Topbar.tsx`

### Structure

```
[Page Title]                          [LIVE badge] [Bell🔔 +badge] [Avatar]
```

### Key Implementation Notes

- Page title derived from current route path — map route to label
- `LiveIndicator` component (pulsing green dot) — always shown
- Bell icon: `lucide-react` `Bell` — wrap in shadcn `<Button variant="ghost" size="icon">`
- Alert badge on bell: red dot from `useAlertStore().unreadCount`
- Avatar: shadcn `<Avatar>` with patient initials fallback
- Background: `bg-white/70 backdrop-blur-md border-b border-slate-100`

---

## `MobileNav.tsx`

Bottom navigation bar — **mobile only** (`lg:hidden`)

```
┌──────────────────────────────────────────────────┐
│  🏠 Overview  💓 Vitals  🔔 Alerts  📊 Analytics │
└──────────────────────────────────────────────────┘
```

- Fixed to bottom: `fixed bottom-0 left-0 right-0 z-50`
- Background: `bg-white/90 backdrop-blur-md border-t border-slate-100`
- Active icon: `text-teal-600`, Inactive: `text-slate-400`
- Does NOT include Settings (accessible via avatar menu instead)

---

## Page Content Grid System

### Single column (most pages)

```tsx
<div className="flex flex-col gap-y-6 px-6 py-8 lg:px-[6%]">...sections</div>
```

### Two-column grid (overview, analytics)

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">...</div>
  <div>...</div>
</div>
```

### Vitals grid (5 cards)

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {/* 5 VitalCard components */}
</div>
```

---

## Z-Index Layers

| Layer      | z-index    | Element                     |
| ---------- | ---------- | --------------------------- |
| Ambient bg | fixed, z-0 | Background blur divs        |
| Sidebar    | z-30       | Desktop sidebar             |
| Topbar     | z-40       | Sticky topbar               |
| Mobile nav | z-50       | Bottom mobile nav           |
| Toasts     | z-[100]    | shadcn Toaster              |
| Sheets     | z-[200]    | shadcn Sheet (alert detail) |

---

## Responsive Breakpoints Summary

| Breakpoint          | Sidebar             | Content padding | Grid cols |
| ------------------- | ------------------- | --------------- | --------- |
| Mobile (<768px)     | Hidden (bottom nav) | px-4            | 1 col     |
| Tablet (768–1024px) | Hidden (bottom nav) | px-6            | 1–2 cols  |
| Desktop (>1024px)   | w-64 visible        | px-[6%]         | 2–3 cols  |
