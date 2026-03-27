import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [phone_number, setPhoneNumber] = useState('+254712345678')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(phone_number, password)
      navigate({ to: '/dashboard/overview' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-emerald-50 to-cyan-100 px-4 py-10 sm:px-6 lg:px-8 grid place-content-center">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-emerald-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-5xl items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden rounded-3xl border border-white/40 bg-slate-900/90 p-8 text-slate-100 shadow-2xl backdrop-blur md:block lg:p-10">
          <p className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-200">
            Afya Smart Platform
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Clinical-grade monitoring designed for everyday care.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
            Sign in to track live health streams, identify risk patterns, and
            respond quickly with a unified dashboard.
          </p>

          <div className="mt-10 space-y-4 text-sm text-slate-200">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3">
              Secure access with role-based authentication.
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3">
              Real-time alerts and historical trend visibility.
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3">
              Purpose-built for clinicians, caregivers, and patients.
            </div>
          </div>
        </section>

        <div className="w-full rounded-3xl border border-emerald-100 bg-white/95 p-6 shadow-[0_20px_60px_-20px_rgba(13,148,136,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-medium tracking-wide text-emerald-700">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Sign In</h2>
            <p className="mt-2 text-sm text-slate-600">
              Continue to your Afya Smart workspace.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+254712345678"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            {/* Password Input */}
            <div>gradient
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full rounded-xl bg-slate-900 py-2.5 font-semibold text-white transition hover:bg-slate-800"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Login with registered phone number and password
            </p>
            <p className="text-xs leading-5 text-slate-700">
              Make sure your account is registered in the system with a valid
              phone number.
            </p>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate({ to: '/signup' })}
                className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="relative mx-auto mt-8 text-center text-xs text-slate-600">
        Part of the Afya Smart Health Monitoring System
      </p>
    </div>
  )
}
