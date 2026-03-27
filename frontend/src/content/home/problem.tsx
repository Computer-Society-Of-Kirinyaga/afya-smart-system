import { Activity, Shield, Zap } from 'lucide-react'

export function Problem(): JSX.Element {
  return (
    <section className="w-full relative z-10 bg-white border-b border-slate-100 overflow-hidden py-24">
      <div className="px-4 max-w-6xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              The Wearable Data Problem
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Your wearable devices generate hundreds of data points every day. But without intelligent interpretation, this data tells you nothing about your health risks. You see numbers without context, trends without meaning.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">×</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Passive Data Only
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Raw metrics without interpretation or context
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">×</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    No Early Warnings
                  </h3>
                  <p className="text-slate-600 text-sm">
                    You discover problems when it's already too late
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">×</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Doctor Doesn't See It
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Your wearable insights stay on your phone
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <Activity className="w-8 h-8 text-red-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Reactive Care</h4>
              <p className="text-sm text-slate-600 mt-2">
                Responding to crises instead of preventing them
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <Zap className="w-8 h-8 text-yellow-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Anxiety</h4>
              <p className="text-sm text-slate-600 mt-2">
                Uncertainty about what your data means
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 lg:col-span-2">
              <Shield className="w-8 h-8 text-orange-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Health Gaps</h4>
              <p className="text-sm text-slate-600 mt-2">
                No connection between your wearables and your healthcare provider
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
