import OverviewPage from '@/content/dashboard/OverviewPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/overview')({
  component: OverviewPage,
})
