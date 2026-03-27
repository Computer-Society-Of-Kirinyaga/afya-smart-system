import { HomePage } from '#/content/home'
import { useAuthStore } from '@/store/auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { isAuthenticated } = useAuthStore()

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard/overview" />
  }

  return <HomePage />
}
