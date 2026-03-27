'use client'

import { useState } from 'react'

// Add smooth scrolling to HTML element
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth'
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col pt-32 px-8 border-b border-slate-100 ${
          isMenuOpen ? 'visible-menu' : 'hidden-menu'
        }`}
        id="mobile-menu"
      >
        <button
          className="absolute top-8 right-6 w-10 h-10 flex items-center justify-center"
          onClick={toggleMenu}
        >
          <span className="absolute w-6 h-0.5 bg-slate-800 rotate-45"></span>
          <span className="absolute w-6 h-0.5 bg-slate-800 -rotate-45"></span>
        </button>
        <nav className="flex flex-col gap-8 text-2xl font-medium tracking-tight">
          <a
            className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4"
            href="#features"
            onClick={toggleMenu}
          >
            Features
          </a>
          <a
            className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4"
            href="#impact"
            onClick={toggleMenu}
          >
            How It Works
          </a>
          <a
            className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4"
            href="#testimonials"
            onClick={toggleMenu}
          >
            Testimonials
          </a>
          <a
            className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4"
            href="#faq"
            onClick={toggleMenu}
          >
            FAQ
          </a>
        </nav>
        <div className="mt-auto mb-12">
          <a
            className="flex w-full items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider bg-slate-900 text-white py-4 rounded hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            href="/signup"
          >
            Get started
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full h-[80px] lg:h-[100px] flex items-center justify-between px-4 border-b border-slate-100 bg-white/70 backdrop-blur-md animate-reveal sticky top-0">
        <div className="flex items-center gap-3">

          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Afya Smart
          </span>
        </div>
        <div className="hidden md:flex text-sm font-medium text-slate-500 gap-x-8 items-center">
          <a
            className="hover:text-slate-900 transition-colors"
            href="#features"
          >
            Features
          </a>
          <a className="hover:text-slate-900 transition-colors" href="#impact">
            How It Works
          </a>
          <a
            className="hover:text-slate-900 transition-colors"
            href="#testimonials"
          >
            Testimonials
          </a>
          <a className="hover:text-slate-900 transition-colors" href="#faq">
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white py-2.5 px-5 rounded hover:bg-slate-800 transition-all shadow-md shadow-slate-200 hover:shadow-lg"
            href="/signup"
          >
            Get started
          </a>
      <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 group"
            onClick={toggleMenu}
          >
            <span className="block w-6 h-0.5 bg-slate-800 mb-1.5 transition-all"></span>
            <span className="block w-6 h-0.5 bg-slate-800 mb-1.5 transition-all"></span>
            <span className="block w-6 h-0.5 bg-slate-800 transition-all"></span>
          </button>
        </div>
      </nav>
    </>
  )
}
