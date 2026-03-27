import { useUIStore } from '#/store/ui'
import { Menu, X } from 'lucide-react'

export default function Header(): JSX.Element {
  const { mobileMenuOpen, toggleMobileMenu, toggleTheme } = useUIStore()

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-60 bg-white/95 backdrop-blur-xl flex flex-col pt-32 px-8 border-b border-slate-100 transition-all duration-400 ${
          mobileMenuOpen
            ? 'visible-menu translate-y-0 opacity-100'
            : 'hidden-menu -translate-y-5 opacity-0 pointer-events-none'
        }`}
        id="mobile-menu"
      >
        <button
          className="absolute top-8 right-6 text-slate-500 hover:text-slate-900"
          id="close-menu"
          onClick={() => toggleMobileMenu()}
        >
          <X size={24} />
        </button>
        <nav className="flex flex-col gap-8 text-2xl font-medium tracking-tight">
          <a href="/" className="text-slate-900 hover:text-sky-600 transition">
            Home
          </a>
          <a
            href="#features"
            className="text-slate-900 hover:text-sky-600 transition"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-slate-900 hover:text-sky-600 transition"
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="text-slate-900 hover:text-sky-600 transition"
          >
            FAQ
          </a>
        </nav>
        <div className="mt-auto mb-12">
          <button
            onClick={() => toggleTheme()}
            className="px-6 py-3 rounded-full bg-sky-600 text-white font-semibold hover:bg-sky-700 transition w-full"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="z-50 w-full h-20 lg:h-25 flex items-center justify-between px-4 border-b border-slate-100 bg-white/70 backdrop-blur-md animate-reveal sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-lg font-bold text-slate-900 hidden sm:inline">
            VITALIS
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          <a
            href="/"
            className="text-slate-700 hover:text-slate-900 transition text-sm"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-slate-700 hover:text-slate-900 transition text-sm"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-slate-700 hover:text-slate-900 transition text-sm"
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="text-slate-700 hover:text-slate-900 transition text-sm"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleTheme()}
            className="hidden sm:inline-block px-6 py-2 rounded-full bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => toggleMobileMenu()}
            className="lg:hidden text-slate-900"
            id="menu-toggle"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>
    </>
  )
}
