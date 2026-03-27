import type { ContactInfo, SmsToggles, Thresholds } from '@/types/dashboard'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  contacts: ContactInfo
  thresholds: Thresholds
  smsEnabled: SmsToggles
  toastsEnabled: boolean
  updateContacts: (contacts: ContactInfo) => void
  updateThresholds: (thresholds: Thresholds) => void
  updateSmsToggles: (smsEnabled: SmsToggles) => void
  toggleToasts: () => void
}

// Default thresholds
const DEFAULT_THRESHOLDS: Thresholds = {
  heartRate: {
    min: 50,
    max: 120,
    critical: { below: 40, above: 140 },
    warning: { below: 50, above: 120 },
  },
  spo2: {
    min: 90,
    max: 100,
    critical: { below: 85, above: 100 },
    warning: { below: 90, above: 100 },
  },
  temperature: {
    min: 36.1,
    max: 37.5,
    critical: { below: 35, above: 39 },
    warning: { below: 36, above: 38.5 },
  },
  glucose: {
    min: 80,
    max: 140,
    critical: { below: 70, above: 200 },
    warning: { below: 80, above: 160 },
  },
  systolic: {
    min: 100,
    max: 140,
    critical: { below: 80, above: 180 },
    warning: { below: 90, above: 160 },
  },
  diastolic: {
    min: 60,
    max: 90,
    critical: { below: 50, above: 110 },
    warning: { below: 60, above: 100 },
  },
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      contacts: {
        primaryPhone: '+254712345678',
        secondaryPhone: '+254798765432',
        email: 'jane@vitalis.io',
        emergencyContact: 'John Doe',
      },
      thresholds: DEFAULT_THRESHOLDS,
      smsEnabled: {
        critical: true,
        warning: true,
        info: false,
      },
      toastsEnabled: true,

      updateContacts: (contacts: ContactInfo) => {
        set({ contacts })
      },

      updateThresholds: (thresholds: Thresholds) => {
        set({ thresholds })
      },

      updateSmsToggles: (smsEnabled: SmsToggles) => {
        set({ smsEnabled })
      },

      toggleToasts: () => {
        set((state) => ({
          toastsEnabled: !state.toastsEnabled,
        }))
      },
    }),
    {
      name: 'settings-store',
    },
  ),
)
