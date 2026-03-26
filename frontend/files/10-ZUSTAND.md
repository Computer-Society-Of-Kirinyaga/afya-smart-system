# 10 — Zustand Stores

## Rules

- All stores live in `src/stores/`
- All stores are fully typed — no `any`
- Stores hold **UI state** and **user preferences** only
- Server/async data lives in TanStack Query, NOT Zustand

---

## Store 1: `useAlertStore.ts`

Manages active alerts, unread counts, and alert notifications.

```ts
import { create } from 'zustand'
import type { AlertEvent } from '@/types/alerts'

interface AlertStore {
  // State
  activeAlerts: AlertEvent[]
  unreadCount: number

  // Actions
  addAlert: (alert: AlertEvent) => void
  markAsRead: (alertId: string) => void
  markAllAsRead: () => void
  clearAlert: (alertId: string) => void
  clearAll: () => void
}

export const useAlertStore = create<AlertStore>((set, get) => ({
  activeAlerts: [],
  unreadCount: 0,

  addAlert: (alert) =>
    set((state) => ({
      activeAlerts: [alert, ...state.activeAlerts].slice(0, 100), // keep max 100
      unreadCount: state.unreadCount + 1,
    })),

  markAsRead: (alertId) =>
    set((state) => {
      const updated = state.activeAlerts.map((a) =>
        a.id === alertId ? { ...a, isRead: true } : a,
      )
      const unread = updated.filter((a) => !a.isRead).length
      return { activeAlerts: updated, unreadCount: unread }
    }),

  markAllAsRead: () =>
    set((state) => ({
      activeAlerts: state.activeAlerts.map((a) => ({ ...a, isRead: true })),
      unreadCount: 0,
    })),

  clearAlert: (alertId) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((a) => a.id !== alertId),
      unreadCount: state.activeAlerts.filter(
        (a) => a.id !== alertId && !a.isRead,
      ).length,
    })),

  clearAll: () => set({ activeAlerts: [], unreadCount: 0 }),
}))
```

**Usage:**

```tsx
// Topbar — bell badge
const unreadCount = useAlertStore((state) => state.unreadCount)

// Sidebar — alert nav badge
const { unreadCount } = useAlertStore()

// AlertsPage — mark all read
const { markAllAsRead } = useAlertStore()
```

---

## Store 2: `useSettingsStore.ts`

Manages user preferences: contacts, thresholds, notification toggles.
Persists to `localStorage` via Zustand middleware.

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_THRESHOLDS } from '@/lib/thresholds'
import type { Thresholds, ContactInfo, SmsToggles } from '@/types/settings'

interface SettingsStore {
  // State
  contacts: ContactInfo
  thresholds: Thresholds
  smsEnabled: SmsToggles
  toastsEnabled: boolean

  // Actions
  updateContacts: (contacts: Partial<ContactInfo>) => void
  updateThreshold: (
    vital: keyof Thresholds,
    value: Partial<Thresholds[keyof Thresholds]>,
  ) => void
  resetThresholds: () => void
  toggleSms: (severity: keyof SmsToggles) => void
  setToastsEnabled: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      contacts: {
        patientName: 'Jane Wanjiku',
        patientPhone: '+254712345678',
        doctorName: 'Dr. Kamau Njoroge',
        doctorPhone: '+254722987654',
      },
      thresholds: DEFAULT_THRESHOLDS,
      smsEnabled: {
        critical: true,
        warning: true,
        info: false,
      },
      toastsEnabled: true,

      updateContacts: (contacts) =>
        set((state) => ({ contacts: { ...state.contacts, ...contacts } })),

      updateThreshold: (vital, value) =>
        set((state) => ({
          thresholds: {
            ...state.thresholds,
            [vital]: { ...state.thresholds[vital], ...value },
          },
        })),

      resetThresholds: () => set({ thresholds: DEFAULT_THRESHOLDS }),

      toggleSms: (severity) =>
        set((state) => ({
          smsEnabled: {
            ...state.smsEnabled,
            [severity]: !state.smsEnabled[severity],
          },
        })),

      setToastsEnabled: (enabled) => set({ toastsEnabled: enabled }),
    }),
    {
      name: 'vitalis-settings', // localStorage key
    },
  ),
)
```

---

## Store 3: `usePatientStore.ts`

Manages the current patient's profile data.

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_PATIENT } from '@/lib/mockData'
import type { Patient } from '@/types/patient'

interface PatientStore {
  // State
  patient: Patient

  // Actions
  updatePatient: (updates: Partial<Patient>) => void
  addCondition: (condition: string) => void
  removeCondition: (condition: string) => void
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      patient: MOCK_PATIENT,

      updatePatient: (updates) =>
        set((state) => ({ patient: { ...state.patient, ...updates } })),

      addCondition: (condition) =>
        set((state) => ({
          patient: {
            ...state.patient,
            conditions: [...state.patient.conditions, condition],
          },
        })),

      removeCondition: (condition) =>
        set((state) => ({
          patient: {
            ...state.patient,
            conditions: state.patient.conditions.filter((c) => c !== condition),
          },
        })),
    }),
    {
      name: 'vitalis-patient',
    },
  ),
)
```

---

## Store Usage Summary

| Store              | Used in                                          | Purpose                          |
| ------------------ | ------------------------------------------------ | -------------------------------- |
| `useAlertStore`    | Topbar, Sidebar, AlertsPage, DashboardShell      | Alert count badge, alert list    |
| `useSettingsStore` | SettingsPage, useAlertEngine, useSmsNotification | Thresholds, contacts, toggles    |
| `usePatientStore`  | Sidebar, Topbar, ProfileSettings, WelcomeBanner  | Patient name, avatar, conditions |

---

## Anti-Patterns to Avoid

```ts
// ❌ WRONG — storing server data in Zustand
const useVitalsStore = create(() => ({
  vitals: null,
  fetchVitals: async () => {},
}))

// ✅ RIGHT — server data in TanStack Query
const { data: vitals } = useCurrentVitals()

// ❌ WRONG — defining state inside a component
const [alerts, setAlerts] = useState<AlertEvent[]>([])

// ✅ RIGHT — shared state in Zustand store
const { activeAlerts } = useAlertStore()

// ❌ WRONG — calling useAlertStore() without selector (causes full re-renders)
const store = useAlertStore()

// ✅ RIGHT — use selector to subscribe to only what you need
const unreadCount = useAlertStore((state) => state.unreadCount)
```
