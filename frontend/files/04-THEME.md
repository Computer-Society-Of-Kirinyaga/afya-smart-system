# 04 — Theme

## VITALIS Design System — Dashboard Application

> Personality: Modern Medical Professionalism  
> Font: DM Sans  
> Base: Light (white backgrounds, deep slate text, teal accents)

---

## Color Tokens

| Token | Tailwind Class | Hex | Usage in Dashboard |
|-------|---------------|-----|-------------------|
| Primary | `teal-600` | `#0d9488` | Active nav, CTAs, focus rings, icons |
| Primary Light | `teal-50` | `#f0fdfa` | Active nav bg, badge bg, hover bg |
| Primary Border | `teal-100` | `#ccfbf1` | Card hover borders, active nav border |
| Secondary | `sky-50` | `#f0f9ff` | Ambient bg blurs |
| Accent | `emerald-500` | `#10b981` | Gradient text, positive trends, success |
| Text Primary | `slate-900` | `#0f172a` | Headings, labels, strong text |
| Text Secondary | `slate-500` | `#64748b` | Descriptions, muted labels, timestamps |
| Border | `slate-100` | `#f1f5f9` | Card borders, dividers, table rows |
| Background | `white` | `#ffffff` | Page bg, card bg, sidebar bg |
| Surface | `slate-50` | `#f8fafc` | Page content area bg, table row hover |
| Alert Critical | `red-500` | `#ef4444` | Critical vital badges, alert indicators |
| Alert Warning | `orange-500` | `#f97316` | Warning vital badges, caution flags |
| Alert Normal | `green-500` | `#22c55e` | Normal status indicators |
| Alert Info | `teal-600` | `#0d9488` | Info-level alerts |

---

## Typography

```
Font: DM Sans (import in index.html or globals.css)
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Element | Classes |
|---------|---------|
| Page Title (h1) | `text-2xl font-semibold tracking-tight text-slate-900` |
| Section Title (h2) | `text-xl font-semibold tracking-tight text-slate-900` |
| Card Title (h3) | `text-base font-semibold text-slate-900` |
| Body default | `text-sm text-slate-900 leading-relaxed` |
| Body muted | `text-sm text-slate-500` |
| Label | `text-xs font-bold uppercase tracking-widest text-slate-500` |
| Metric value | `text-3xl font-semibold text-slate-900 tabular-nums` |
| Metric unit | `text-sm text-slate-500` |

---

## Gradient Patterns

```tsx
// Gradient text (headings, metric highlights)
className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent"

// Gradient border card (featured cards)
className="bg-gradient-to-br from-teal-50 to-white border border-teal-100"

// Gradient icon background
className="bg-gradient-to-br from-teal-500 to-emerald-500"
```

---

## Ambient Background Effect

Apply to the root page wrapper:

```tsx
// Fixed ambient blurs — paste inside DashboardShell or page wrapper
<div className="pointer-events-none fixed inset-0 overflow-hidden">
  <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-sky-50 opacity-60 blur-[120px]" />
  <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-50 opacity-60 blur-[100px]" />
</div>
```

---

## Component Patterns

### Cards
```tsx
// Standard card
className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"

// Hoverable card
className="group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-teal-100 hover:shadow-md"

// Featured / accent card
className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm"

// Critical alert card
className="rounded-xl border border-red-100 bg-red-50 p-6"
```

### Badges / Pills
```tsx
// VITALIS brand badge
className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-700"

// Status: Normal
className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"

// Status: Warning
className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700"

// Status: Critical
className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600"
```

### Buttons
```tsx
// Primary button
className="rounded bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-md shadow-slate-200 transition-colors duration-300 hover:bg-slate-800"

// Secondary button
className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-slate-50"

// Teal CTA button
className="rounded bg-teal-600 px-6 py-3 text-sm font-medium text-white shadow-md shadow-teal-100 transition-colors duration-300 hover:bg-teal-700"
```

### Live Indicator
```tsx
// Pulsing live dot
<span className="flex items-center gap-x-1.5">
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
  </span>
  <span className="text-xs font-bold uppercase tracking-widest text-green-600">Live</span>
</span>
```

### Icon Containers
```tsx
// Teal icon bg (primary)
className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600"

// Slate icon bg (neutral)
className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600"

// Red icon bg (critical)
className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500"
```

---

## Sidebar Design

```
Width: w-64 (desktop) | hidden on mobile
Background: white
Border: border-r border-slate-100
Logo area: h-16, teal-600 bg logo mark + "VITALIS" text
Nav items: see 03-ROUTING.md for active styles
Bottom: Patient avatar + name + "View Profile" link
```

---

## Topbar Design

```
Height: h-16
Background: white/70 with backdrop-blur-md
Border: border-b border-slate-100
Left: Current page title (h2)
Right: LiveIndicator + Bell icon (with unread badge) + Avatar
```

---

## Spacing Scale

| Context | Classes |
|---------|---------|
| Page horizontal padding | `px-6 lg:px-[6%]` |
| Page vertical padding | `py-8` |
| Section gap | `gap-y-6` |
| Card internal padding | `p-6` |
| Grid column gap | `gap-x-6` |
| Grid row gap | `gap-y-4` |

---

## Animations

```css
/* In globals.css or tailwind config */

/* Reveal animation (fade + slide up) */
@keyframes reveal {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-reveal { animation: reveal 500ms ease forwards; }

/* Staggered children: add delay-[100ms], delay-[200ms] etc. */
```

All hover transitions use `transition-all duration-300`.  
All interactive elements use `focus-visible:ring-2 focus-visible:ring-teal-600`.
