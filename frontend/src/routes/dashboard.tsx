import { DashboardShell } from '@/components/DashboardShell'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardShell,
})
