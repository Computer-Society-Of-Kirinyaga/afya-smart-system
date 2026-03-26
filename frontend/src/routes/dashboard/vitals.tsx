import VitalsPage from '@/content/dashboard/VitalsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/vitals')({
  component: VitalsPage,
})
