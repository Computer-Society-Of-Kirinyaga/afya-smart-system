import type { AlertEvent } from '@/types/dashboard'
import { create } from 'zustand'

interface AlertStore {
  activeAlerts: AlertEvent[]
  unreadCount: number
  addAlert: (alert: AlertEvent) => void
  markAsRead: (alertId: string) => void
  markAllAsRead: () => void
  clearAlert: (alertId: string) => void
  clearAllAlerts: () => void
}

export const useAlertStore = create<AlertStore>((set) => ({
  activeAlerts: [],
  unreadCount: 0,

  addAlert: (alert: AlertEvent) => {
    set((state) => {
      const newAlerts = [alert, ...state.activeAlerts].slice(0, 100) // Keep max 100 alerts
      const unreadCount = newAlerts.filter((a) => !a.isRead).length

      return {
        activeAlerts: newAlerts,
        unreadCount,
      }
    })
  },

  markAsRead: (alertId: string) => {
    set((state) => {
      const newAlerts = state.activeAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert,
      )
      const unreadCount = newAlerts.filter((a) => !a.isRead).length

      return {
        activeAlerts: newAlerts,
        unreadCount,
      }
    })
  },

  markAllAsRead: () => {
    set((state) => ({
      activeAlerts: state.activeAlerts.map((alert) => ({
        ...alert,
        isRead: true,
      })),
      unreadCount: 0,
    }))
  },

  clearAlert: (alertId: string) => {
    set((state) => {
      const newAlerts = state.activeAlerts.filter(
        (alert) => alert.id !== alertId,
      )
      const unreadCount = newAlerts.filter((a) => !a.isRead).length

      return {
        activeAlerts: newAlerts,
        unreadCount,
      }
    })
  },

  clearAllAlerts: () => {
    set({
      activeAlerts: [],
      unreadCount: 0,
    })
  },
}))
