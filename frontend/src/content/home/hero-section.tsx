'use client'

import { useEffect } from 'react'

export function HeroSection() {
  useEffect(() => {
    // Scroll animation observer
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section className="flex flex-col lg:block lg:h-[calc(100vh-100px)] z-10 w-full relative">
      {/* Hero Text */}
      <div className="order-1 flex flex-col lg:py-0 lg:absolute lg:top-0 lg:right-[38%] lg:bottom-[6%] lg:left-[28%] lg:pr-12 lg:pl-12 z-20 pointer-events-none pt-20 pr-12 pb-12 pl-12 relative justify-center">
        <h1 className="sm:text-6xl md:text-7xl lg:text-[3.5rem] xl:text-[4.5rem] leading-[1] lg:leading-[0.95] lg:text-left text-5xl font-semibold text-slate-900 tracking-tight text-center">
          <span className="block animate-reveal delay-100">Precision</span>
          <span className="block text-slate-400 lg:ml-[0.5em] animate-reveal delay-200">Focused</span>
          <span className="block text-teal-600 animate-reveal delay-300">Healthcare</span>
        </h1>
        <div className="flex animate-reveal delay-500 lg:justify-start lg:pl-2 lg:mt-12 pointer-events-auto mt-12 pl-2 gap-x-6 gap-y-6 items-center justify-center">
          <button className="group flex items-center gap-3 pl-6 pr-2 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all shadow-sm">
            <span className="text-sm font-medium text-slate-700">Find a specialist</span>
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
              <span className="iconify w-4 h-4" data-icon="solar:arrow-right-linear"></span>
            </div>
          </button>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Emergency Wait Time</span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-500 font-mono">12 MIN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Area (Insurance Partners) */}
      <div className="relative order-2 w-full px-6 py-12 border-y border-slate-100 lg:border-y-0 lg:border-r lg:absolute lg:left-[6%] lg:top-0 lg:bottom-[6%] lg:w-[22%] lg:px-0 lg:py-0 flex flex-col bg-slate-50/50 lg:bg-transparent">
        <div className="lg:pt-12 lg:pr-8 lg:absolute lg:top-0 lg:h-[62%] lg:w-full animate-reveal delay-200">
          <p className="leading-relaxed lg:text-left lg:mx-0 text-base font-normal text-slate-500 text-center max-w-md mx-auto">
            VITALIS combines advanced diagnostics with compassionate care to create a new standard for medical excellence.
          </p>
        </div>
        <div className="mt-12 lg:mt-0 lg:absolute lg:top-[62%] lg:bottom-0 lg:left-0 lg:right-0 lg:border-t border-slate-100 lg:pt-6 flex flex-col justify-between animate-reveal delay-300 items-center lg:items-start">
          <div className="hidden lg:block marker -top-[2.5px] -left-[2.5px]"></div>
          <div className="hidden lg:block marker -top-[2.5px] -right-[2.5px]"></div>
          <div className="absolute top-[-1px] left-0 right-0 h-[1px] overflow-hidden hidden lg:block">
            <div className="beam-h" style={{ animation: 'beam-h 5s infinite' }}></div>
          </div>
          <div className="lg:text-left text-center w-full overflow-hidden">
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-6 pl-1">
              In Network With
            </p>
            <div className="relative w-full max-w-[320px] lg:max-w-[360px] mx-auto lg:mx-0 h-[40px] flex items-center mask-linear-fade">
              <div className="flex gap-12 items-center w-max animate-marquee will-change-transform">
                <div className="text-slate-400 font-semibold text-lg flex items-center gap-2">
                  <span className="iconify w-6 h-6" data-icon="solar:shield-check-linear"></span>
                  AETNA
                </div>
                <div className="text-slate-400 font-semibold text-lg flex items-center gap-2">
                  <span className="iconify w-6 h-6" data-icon="solar:heart-pulse-linear"></span>
                  CIGNA
                </div>
                <div className="text-slate-400 font-semibold text-lg flex items-center gap-2">
                  <span className="iconify w-6 h-6" data-icon="solar:add-square-linear"></span>
                  BLUECROSS
                </div>
                <div className="text-slate-400 font-semibold text-lg flex items-center gap-2">
                  <span className="iconify w-6 h-6" data-icon="solar:graph-up-linear"></span>
                  UNITED
                </div>
                <div className="text-slate-400 font-semibold text-lg flex items-center gap-2">
                  <span className="iconify w-6 h-6" data-icon="solar:shield-check-linear"></span>
                  AETNA
                </div>
              </div>
            </div>
          </div>
          <div className="pb-1 mt-6 lg:mt-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-500">Clinics Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Grid Cell */}
      <div className="relative order-3 w-full h-64 sm:h-80 lg:absolute lg:left-[62%] lg:right-[6%] lg:top-0 lg:h-[62%] lg:border-l lg:w-auto border-slate-100 overflow-hidden group animate-reveal delay-200">
        <div className="absolute top-0 bottom-0 left-[-1px] w-[1px] overflow-hidden z-20 hidden lg:block">
          <div className="beam-v" style={{ animation: 'beam-v 4s infinite' }}></div>
        </div>
        <div className="hidden lg:block marker -top-[2.5px] -left-[2.5px]"></div>
        <div className="hidden lg:block marker -top-[2.5px] -right-[2.5px]"></div>
        <img
          alt="Medical Lab"
          className="group-hover:scale-105 transition-transform duration-1000 ease-out w-full h-full object-cover"
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/9f023d8e-7464-4eea-9789-18f1b0227cc8_1600w.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
        <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur border border-slate-200 p-3 rounded shadow-sm">
          <span className="iconify w-6 h-6 text-slate-700" data-icon="solar:test-tube-linear"></span>
        </div>
      </div>

      {/* Interactive Card */}
      <div className="relative order-4 p-6 flex items-center justify-center animate-reveal delay-300 lg:p-0 lg:absolute lg:right-[6%] lg:top-[62%] lg:bottom-[6%] lg:border-l lg:border-t lg:border-slate-100 lg:left-[62%]">
        <div className="absolute top-[-1px] left-0 right-0 h-[1px] overflow-hidden z-20 hidden lg:block">
          <div className="beam-h" style={{ animation: 'beam-h 6s infinite reverse' }}></div>
        </div>
        <div className="absolute top-0 bottom-0 left-[-1px] w-[1px] overflow-hidden z-20 hidden lg:block">
          <div className="beam-v" style={{ animation: 'beam-v 6s infinite 2s' }}></div>
        </div>
        <div
          className="flex flex-col bg-white w-full h-full lg:rounded-none rounded-sm pt-8 pr-8 pb-8 pl-8 relative shadow-lg shadow-slate-200/50 justify-between transition-all duration-500 border border-slate-100 lg:border-none"
          id="card-wrapper"
        >
          <div className="flex items-start justify-between relative z-10 min-h-[60px]">
            <div className="transition-all duration-300 ease-out">
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <span className="iconify w-4 h-4" data-icon="solar:user-check-linear"></span>
                <span className="text-[10px] font-semibold uppercase tracking-widest">Portal</span>
              </div>
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-slate-900">
                Upcoming Visit
              </h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
              <span className="iconify w-6 h-6" data-icon="solar:calendar-add-linear"></span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col justify-end flex-1 mt-6">
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 border-l-2 border-teal-100 pl-3">
              Dr. Sarah Jenkins
              <span className="text-slate-400 font-normal"> Cardiology • Tomorrow, 10:00 AM</span>
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <div className="flex -space-x-2">
                <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              </div>
              <button className="text-xs font-semibold uppercase tracking-wide text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1">
                Details
                <span className="iconify w-3.5 h-3.5" data-icon="solar:arrow-right-linear"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
