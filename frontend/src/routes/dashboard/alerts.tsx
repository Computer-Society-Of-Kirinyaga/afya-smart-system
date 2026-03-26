import AlertsPage from '@/content/dashboard/AlertsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/alerts')({
  component: AlertsPage,
})
