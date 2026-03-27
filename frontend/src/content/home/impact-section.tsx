import { useEffect } from 'react'
export function ImpactSection() {
  useEffect(() => {
    // Initialize Chart
    setTimeout(() => {
      const canvas = document.getElementById('recoveryChart') as HTMLCanvasElement
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const gradient = ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'rgba(20, 184, 166, 0.15)')
      gradient.addColorStop(1, 'rgba(20, 184, 166, 0)')

      // @ts-ignore
      new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [
            {
              label: 'HealthRisk AI',
              data: [65, 78, 82, 85, 88, 92],
              borderColor: '#14b8a6',
              backgroundColor: gradient,
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: '#ffffff',
              pointBorderColor: '#14b8a6',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              fill: true,
            },
            {
              label: 'Industry Avg',
              data: [45, 48, 52, 51, 54, 56],
              borderColor: '#cbd5e1',
              borderWidth: 2,
              borderDash: [6, 6],
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 12,
              titleFont: { family: 'Inter', size: 12, weight: 600 },
              bodyFont: { family: 'Inter', size: 12 },
              cornerRadius: 4,
              displayColors: false,
              callbacks: {
                label: function (context: any) {
                  return context.dataset.label + ': ' + context.parsed.y + '%'
                },
              },
            },
          },
          scales: {
            y: {
              display: true,
              beginAtZero: true,
              max: 100,
              grid: { color: '#f1f5f9', drawBorder: false },
              ticks: {
                font: { family: 'Inter', size: 10 },
                color: '#94a3b8',
                padding: 10,
              },
            },
            x: {
              display: true,
              grid: { display: false },
              ticks: {
                font: { family: 'Inter', size: 10 },
                color: '#94a3b8',
                padding: 10,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart',
          },
        },
      })
    }, 100)
  }, [])

  return (
    <section id="impact" className="w-full relative z-10 bg-white border-b border-slate-100 overflow-hidden">
      <div className="lg:px-[6%] lg:py-32 max-w-[1600px] mr-auto ml-auto pt-24 pr-6 pb-24 pl-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="relative z-10 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              AI-Powered Insights
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.05] mb-6">
              Early detection saves
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                {' '}lives.
              </span>
            </h2>
            <p className="text-lg text-slate-500 font-light leading-relaxed mb-10 max-w-lg">
              HealthRisk AI continuously analyzes your wearable data to detect health risks before they become emergencies. Prevent interventions save time, reduce hospitalizations, and ultimately save lives.
            </p>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              <div className="group cursor-default">
                <div className="text-4xl font-semibold text-slate-900 tracking-tight mb-2 group-hover:text-teal-600 transition-colors">
                  92%
                </div>
                <div className="h-0.5 w-12 bg-slate-200 mb-3 group-hover:w-full group-hover:bg-teal-500 transition-all duration-700 ease-out"></div>
                <p className="text-sm text-slate-500 leading-snug">
                  Early risk detection accuracy
                </p>
              </div>
              <div className="group cursor-default">
                <div className="text-4xl font-semibold text-slate-900 tracking-tight mb-2 group-hover:text-teal-600 transition-colors">
                  48h
                </div>
                <div className="h-0.5 w-12 bg-slate-200 mb-3 group-hover:w-full group-hover:bg-teal-500 transition-all duration-700 ease-out"></div>
                <p className="text-sm text-slate-500 leading-snug">
                  Average alert time before critical events
                </p>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="relative group scroll-reveal delay-200">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
            <div className="relative bg-white border border-slate-200 rounded-sm p-6 lg:p-8 shadow-sm transition-all duration-500 hover:shadow-lg hover:border-teal-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    Risk Detection Accuracy
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest">
                    % Accuracy Over Time
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider uppercase">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <span className="text-slate-600">HealthRisk AI</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    <span className="text-slate-400">Industry Avg</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-[320px]">
                <canvas
                  height="640"
                  id="recoveryChart"
                  style={{
                    display: 'block',
                    boxSizing: 'border-box',
                    height: '320px',
                    width: '100%',
                  }}
                  width="961"
                ></canvas>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                    <span className="iconify w-4 h-4" data-icon="solar:graph-up-linear"></span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-slate-900 block leading-tight">
                      12% Increase
                    </span>
                    <span className="text-slate-500 text-xs font-normal">
                      in patient throughput
                    </span>
                  </div>
                </div>
                <button className="group/btn flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider hover:text-teal-700 transition-colors">
                  View Report
                  <span
                    className="iconify w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform"
                    data-icon="solar:arrow-right-linear"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
