import { Activity, Shield, Zap } from 'lucide-react'

export function Problem(): JSX.Element {
  return (
    <section className="w-full relative z-10 bg-white border-b border-slate-100 overflow-hidden py-24">
      <div className="px-6 lg:px-[6%] max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The Challenge in Modern Healthcare
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Healthcare providers struggle with fragmented patient data, delayed insights, and inefficient monitoring workflows. This leads to poor patient outcomes and increased operational costs.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">×</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Data Silos</h3>
                  <p className="text-slate-600 text-sm">Patient information scattered across multiple systems</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">×</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Manual Monitoring</h3>
                  <p className="text-slate-600 text-sm">Time-consuming manual checks and routine visits</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">×</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Delayed Insights</h3>
                  <p className="text-slate-600 text-sm">Critical health changes detected too late</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <Activity className="w-8 h-8 text-red-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Reactive Care</h4>
              <p className="text-sm text-slate-600 mt-2">Crisis management instead of prevention</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <Zap className="w-8 h-8 text-yellow-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Low Efficiency</h4>
              <p className="text-sm text-slate-600 mt-2">Wasted resources and time</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 lg:col-span-2">
              <Shield className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Compliance Risk</h4>
              <p className="text-sm text-slate-600 mt-2">Inadequate records and audit trails</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
