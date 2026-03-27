'use client'

import { useState } from 'react'

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
          className="absolute top-8 right-6 text-slate-500 hover:text-slate-900"
          onClick={toggleMenu}
        >
          <span className="iconify w-8 h-8" data-icon="solar:close-circle-linear"></span>
        </button>
        <nav className="flex flex-col gap-8 text-2xl font-medium tracking-tight">
          <a className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4" href="#">
            Services
          </a>
          <a className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4" href="#">
            Specialists
          </a>
          <a className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4" href="#">
            Research
          </a>
          <a className="hover:text-teal-600 transition-colors border-b border-slate-100 pb-4" href="#">
            Patients
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
          <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded flex items-center justify-center">
            <span className="iconify w-5 h-5" data-icon="solar:add-square-linear"></span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">VITALIS</span>
        </div>
        <div className="hidden md:flex text-sm font-medium text-slate-500 gap-x-8 items-center">
          <a className="hover:text-slate-900 transition-colors" href="#">
            Services
          </a>
          <a className="hover:text-slate-900 transition-colors" href="#">
            Specialists
          </a>
          <a className="hover:text-slate-900 transition-colors" href="#">
            Research
          </a>
          <a className="hover:text-slate-900 transition-colors" href="#">
            Patients
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white py-2.5 px-5 rounded hover:bg-slate-800 transition-all shadow-md shadow-slate-200 hover:shadow-lg"
            href="/signup"
          >
            Get start
          </a>
          <button className="md:hidden text-slate-600 hover:text-slate-900 transition-colors" onClick={toggleMenu}>
            <span className="iconify w-6 h-6" data-icon="solar:hamburger-menu-linear"></span>
          </button>
        </div>
      </nav>
    </>
  )
}
