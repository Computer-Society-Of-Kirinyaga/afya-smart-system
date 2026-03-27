'use client'

export function TestimonialsNew() {
  return (
    <section className="overflow-hidden lg:py-32 w-full z-20 pt-24 pb-24 relative bg-white">
      <div className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block">
        <div className="grid-line-v" style={{ left: '6%' }}></div>
        <div className="grid-line-v" style={{ left: '28%' }}></div>
        <div className="grid-line-v" style={{ left: '62%' }}></div>
        <div className="grid-line-v" style={{ right: '6%' }}></div>
        <div className="grid-line-h" style={{ top: '0' }}></div>
        <div className="grid-line-h" style={{ bottom: '0' }}></div>
      </div>
      <div className="lg:px-[6%] max-w-[1600px] z-10 mr-auto ml-auto pr-6 pl-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 mb-8">
          {/* Left: Header + Image */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="border border-slate-100 bg-slate-50/50 rounded-sm p-10 lg:p-12 relative flex flex-col justify-center min-h-[240px]">
              <h2 className="leading-[0.95] lg:text-5xl text-4xl font-semibold text-slate-900 tracking-tight z-10 mb-2 relative">
                Care that puts
                <span className="text-slate-300"> you first. </span>
              </h2>
            </div>
            <div className="lg:h-[500px] overflow-hidden group h-[420px] border-slate-200 border rounded-sm relative shadow-sm">
              <img
                alt="Doctor patient consultation"
                className="transition-transform duration-1000 group-hover:scale-105 w-full h-full object-cover absolute top-0 left-0"
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/7d3d7aa0-9b80-49e5-94f8-4b8527c42263_1600w.jpg"
              />
              <div className="absolute bottom-10 right-10 text-right bg-white/90 backdrop-blur-sm p-4 rounded shadow-lg">
                <span className="block text-4xl font-bold text-slate-900 tracking-tight">98%</span>
                <span className="block text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">
                  Patient Satisfaction
                </span>
              </div>
            </div>
          </div>

          {/* Right: Reviews */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Review 1 */}
            <div className="bg-white p-10 rounded-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="iconify w-5 h-5" data-icon="solar:star-bold"></span>
                  ))}
                </div>
                <p className="text-lg font-light leading-relaxed mb-8 text-slate-600">
                  {'"'}The level of attention to detail at VITALIS is unmatched. I never felt rushed, and Dr. Emily actually listened to my concerns. The app makes scheduling a breeze.{'"'}
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5d0296a8-c467-44ef-9d51-ce4ee3a2c3c6_320w.webp"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">Michael Ross</h4>
                  <span className="text-xs text-slate-400">Patient since 2022</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300">
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="iconify w-[18px] h-[18px]" data-icon="solar:star-bold"></span>
                ))}
              </div>
              <p className="text-base font-normal leading-relaxed mb-6 text-slate-600">
                {'"'}The facility is spotless and modern. Having the lab on-site saved me a separate trip. Highly recommended.{'"'}
              </p>
              <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                  <img
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c6ec4622-d827-4c9e-9744-0c24c81f9515_320w.webp"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">Sarah Jay</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-900 rounded-sm p-8 lg:px-12 lg:py-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/50 to-transparent pointer-events-none"></div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-medium text-white tracking-tight mb-2">
              Ready to prioritize your health?
            </h3>
            <p className="text-slate-400 text-base font-light">
              Join over 10,000 patients trusting VITALIS.
            </p>
          </div>
          <button className="relative z-10 bg-white text-slate-900 pl-8 pr-6 py-4 rounded font-semibold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-4 group/btn shadow-lg">
            Schedule Visit
            <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover/btn:scale-110 transition-transform">
              <span className="iconify w-3.5 h-3.5" data-icon="solar:arrow-right-linear"></span>
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
