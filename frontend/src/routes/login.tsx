import { LoginPage } from '@/content/auth/LoginPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
