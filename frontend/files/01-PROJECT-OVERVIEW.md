# 01 — Project Overview

## Purpose

The VITALIS Dashboard is the patient-facing interface of the Smart Health Monitoring System. It gives patients continuous visibility into their own vitals, surfaces alerts when readings become dangerous, and automatically notifies both the patient and their assigned doctor via SMS when thresholds are breached.

---

## Primary User

**Patient** — a person who has been fitted with health monitoring sensors and is enrolled in the VITALIS system. They may be:
- Managing a chronic illness (diabetes, hypertension, cardiac conditions)
- Post-discharge recovery monitoring
- Rural patients with limited clinic access

---

## Core User Stories

### Vitals Monitoring
- As a patient, I want to see my current heart rate, blood pressure, SpO2, temperature, and blood glucose at a glance so I know my health status right now.
- As a patient, I want to see how my vitals have trended over the last 24 hours so I can spot patterns.
- As a patient, I want each vital displayed with a status indicator (normal / warning / critical) so I can quickly understand if something is wrong.

### Alerts & Risk Flags
- As a patient, I want to be notified immediately (via on-screen toast) when any vital crosses a dangerous threshold.
- As a patient, I want to see a history of all past alerts so I can discuss them with my doctor.
- As a patient, I want my doctor to also receive an SMS when a critical alert fires so they can act even if I cannot.

### Analytics
- As a patient, I want to see aggregate stats for the past 7 days (averages, highs, lows) so I can understand my health trends.
- As a patient, I want a risk score summary that tells me my current overall health risk level.

### Settings
- As a patient, I want to configure my phone number and doctor's phone number for SMS alerts.
- As a patient, I want to set custom alert thresholds or accept the clinical defaults.
- As a patient, I want to toggle which alerts send an SMS vs. show only on screen.

---

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| F-01 | Display 5 vitals (HR, BP, SpO2, Temp, Glucose) with live mock data | HIGH |
| F-02 | Trend chart per vital (24h) with Recharts | HIGH |
| F-03 | Threshold-based alert engine | HIGH |
| F-04 | On-screen toast notification on alert | HIGH |
| F-05 | SMS to patient + doctor via Africa's Talking API | HIGH |
| F-06 | Alert history table with severity, time, vital, value | HIGH |
| F-07 | 7-day analytics summary (avg / min / max per vital) | MEDIUM |
| F-08 | Overall risk score card | MEDIUM |
| F-09 | Patient list table (for context / future doctor view) | MEDIUM |
| F-10 | Settings page — phone numbers + thresholds | MEDIUM |
| F-11 | Responsive layout (mobile + desktop) | HIGH |
| F-12 | TanStack Query for all async data | HIGH |
| F-13 | Zustand for global alert state + settings state | HIGH |

---

## Non-Functional Requirements

- All data is **mocked** — no real backend required
- Mock vitals update every **5 seconds** (simulated real-time)
- SMS calls are made to Africa's Talking API; credentials stored in `.env`
- Zero `any` types — strict TypeScript throughout
- No inline styles — Tailwind only
- Must compile and run without errors
