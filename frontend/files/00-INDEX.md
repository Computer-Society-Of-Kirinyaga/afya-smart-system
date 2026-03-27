# VITALIS Dashboard — Specification Index

> AI-powered healthcare monitoring system for Kenya and Africa  
> Version: 1.0.0 | Primary User: Patient

---

## Spec Files

| # | File | Description |
|---|------|-------------|
| 01 | `01-PROJECT-OVERVIEW.md` | Goals, user stories, functional requirements |
| 02 | `02-FOLDER-STRUCTURE.md` | Complete src/ directory tree |
| 03 | `03-ROUTING.md` | TanStack Router — all routes, layouts, guards |
| 04 | `04-THEME.md` | VITALIS design tokens, Tailwind classes, patterns |
| 05 | `05-LAYOUT.md` | Dashboard shell, sidebar, topbar, page grid |
| 06 | `06-PAGES.md` | All 5 pages — sections, components, purpose |
| 07 | `07-COMPONENTS.md` | Every reusable component — props, shadcn mapping |
| 08 | `08-DATA-MOCK.md` | Mock data shapes, types, generators |
| 09 | `09-TANSTACK-QUERY.md` | All query keys, hooks, loading/error patterns |
| 10 | `10-ZUSTAND.md` | All stores — shape, actions, usage |
| 11 | `11-ALERTS-SMS.md` | Alert engine, threshold rules, Africa's Talking SMS |
| 12 | `12-TYPES.md` | All TypeScript interfaces and enums |
| 13 | `13-SHADCN-USAGE.md` | Exact shadcn components per page/section |
| 14 | `14-CHARTS.md` | Recharts config per vital — axes, colors, mock data |
| 15 | `15-DEVELOPMENT-ORDER.md` | Step-by-step build sequence |

---

## Quick Reference

- **Stack:** React + TypeScript + TanStack Router + TanStack Query + Zustand + shadcn/ui + Tailwind
- **Pages:** Overview · Vitals · Alerts · Analytics · Settings
- **Vitals:** Heart Rate · Blood Pressure · SpO2 · Temperature · Blood Glucose
- **Alerts:** Threshold-based triggers → toast UI + Africa's Talking SMS (API-ready)
- **Data:** Mock real-time simulation via `setInterval` wrapped in TanStack Query
- **Theme:** VITALIS light theme — white bg, teal-600 primary, slate-900 text
