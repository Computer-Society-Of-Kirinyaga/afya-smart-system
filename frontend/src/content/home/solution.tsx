import { CheckCircle, Cpu, TrendingUp } from 'lucide-react'

export function Solution(): JSX.Element {
  return (
    <section className="w-full relative z-10 bg-slate-50 border-b border-slate-100 overflow-hidden py-24">
      <div className="px-6 lg:px-[6%] max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Unified Data</h4>
              <p className="text-sm text-slate-600 mt-2">Centralized patient records</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
              <Cpu className="w-8 h-8 text-blue-500 mb-4" />
              <h4 className="font-semibold text-slate-900">AI-Powered</h4>
              <p className="text-sm text-slate-600 mt-2">Intelligent predictions</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm lg:col-span-2">
              <TrendingUp className="w-8 h-8 text-teal-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Real-Time Monitoring</h4>
              <p className="text-sm text-slate-600 mt-2">Continuous health tracking</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Our Intelligent Solution
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              VITALIS combines cutting-edge IoT sensors, machine learning algorithms, and cloud infrastructure to deliver proactive, data-driven healthcare.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Integrated Platform</h3>
                  <p className="text-slate-600 text-sm">All patient data in one secure place</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Predictive Analytics</h3>
                  <p className="text-slate-600 text-sm">Early warning systems and risk assessment</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Proactive Interventions</h3>
                  <p className="text-slate-600 text-sm">Prevent complications before they occur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
