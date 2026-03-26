import { ArrowRight } from 'lucide-react'


export function Hero(): JSX.Element {
  return (
    <section className="flex flex-col lg:block lg:h-[calc(100vh-100px)] z-10 w-full relative">
      <div className="relative w-full h-full overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 lg:w-[900px] h-96 lg:h-[900px] bg-sky-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 lg:w-[700px] h-80 lg:h-[700px] bg-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 lg:px-[6%] py-20 lg:py-0">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Advanced Medical Care at Your Fingertips
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl">
              Revolutionize patient monitoring with intelligent, real-time health tracking. From chronic disease management to preventive care, VITALIS empowers healthcare providers with actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 rounded-full bg-sky-600 text-white font-semibold hover:bg-sky-700 transition flex items-center justify-center gap-2">
                Get Started <ArrowRight size={20} />
              </button>
              <button className="px-8 py-3 rounded-full border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-slate-200">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">10K+</div>
              <div className="text-sm text-slate-600">Active Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">99.9%</div>
              <div className="text-sm text-slate-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">50K+</div>
              <div className="text-sm text-slate-600">Data Points Daily</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
