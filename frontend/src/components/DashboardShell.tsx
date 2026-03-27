import { Button } from '@/components/ui/button'
import { useAlertStore } from '@/store/alerts'
import { useAuthStore } from '@/store/auth'
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import {
  AlertCircle,
  BarChart3,
  Bell,
  Heart,
  LogOut,
  Menu,
  Settings,
  X,
} from 'lucide-react'
import { useState } from 'react'

export function DashboardShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuthStore()
  const { unreadCount } = useAlertStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const navigationItems = [
    { label: 'Overview', href: '/dashboard/overview', icon: Heart },
    { label: 'Vitals', href: '/dashboard/vitals', icon: BarChart3 },
    { label: 'Alerts', href: '/dashboard/alerts', icon: AlertCircle },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed lg:fixed lg:w-64 w-64 h-screen bg-slate-900 text-white shadow-lg z-40 transform transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-teal-400">AfyaSmart</h1>
          <p className="text-xs text-slate-400 mt-1">Smart Health Monitor</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems.map(({ label, href, icon: Icon }) => {
              const isActive = location.pathname === href
              return (
                <button
                  key={href}
                  onClick={() => {
                    navigate({ to: href })
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content — lg:ml-64 offsets the fixed 256px sidebar */}
      <main className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between p-6">
            <div className="pl-10 lg:pl-0">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome, {user?.name || 'Patient'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Alerts Bell */}
            <div className="relative">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition duration-200 relative">
                <Bell className="w-6 h-6 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
