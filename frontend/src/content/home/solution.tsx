import { CheckCircle, Cpu, TrendingUp } from 'lucide-react'

export function Solution(): JSX.Element {
  return (
    <section className="w-full relative z-10 bg-slate-50 border-b border-slate-100 overflow-hidden py-24">
      <div className="px-4 max-w-6xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
              <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Risk Prediction</h4>
              <p className="text-sm text-slate-600 mt-2">
                AI forecasts health risks early
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
              <Cpu className="w-8 h-8 text-blue-500 mb-4" />
              <h4 className="font-semibold text-slate-900">Real-Time Alerts</h4>
              <p className="text-sm text-slate-600 mt-2">
                Immediate notifications when risks detected
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm lg:col-span-2">
              <TrendingUp className="w-8 h-8 text-teal-500 mb-4" />
              <h4 className="font-semibold text-slate-900">
                Doctor Integration
              </h4>
              <p className="text-sm text-slate-600 mt-2">
                Share insights with your healthcare provider
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Predictive Health Intelligence
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              HealthRisk AI transforms your wearable data into actionable
              intelligence, forecasting health risks before they become
              emergencies and keeping your doctor in the loop in real-time.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Trend Analysis
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Understand patterns in your health data
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    SMS Notifications
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Get alerts even when the app is closed
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Privacy Protected
                  </h3>
                  <p className="text-slate-600 text-sm">
                    End-to-end encryption and anonymized processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
