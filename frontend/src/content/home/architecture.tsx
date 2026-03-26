export function Architecture(): JSX.Element {
  return (
    <section className="w-full relative z-10 bg-white border-b border-slate-100 overflow-hidden py-24">
      <div className="px-6 lg:px-[6%] max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Enterprise Architecture
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Built on a scalable, secure cloud infrastructure with world-class
            data protection
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* IoT Layer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">📱</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">IoT Devices</h3>
            <p className="text-sm text-slate-600">Wearables & Sensors</p>
            <p className="text-xs text-slate-500 mt-2">
              ECG, BP, SpO2, Glucose
            </p>
          </div>

          {/* Data Collection */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">☁️</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Data Pipeline</h3>
            <p className="text-sm text-slate-600">Cloud Ingestion</p>
            <p className="text-xs text-slate-500 mt-2">Real-time processing</p>
          </div>

          {/* Analytics */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🧠</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">AI Engine</h3>
            <p className="text-sm text-slate-600">Machine Learning</p>
            <p className="text-xs text-slate-500 mt-2">Predictive models</p>
          </div>

          {/* Insights */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Insights</h3>
            <p className="text-sm text-slate-600">Dashboard & Alerts</p>
            <p className="text-xs text-slate-500 mt-2">Actionable insights</p>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-16 bg-slate-50 border border-slate-200 rounded-lg p-8">
          <h3 className="font-semibold text-slate-900 mb-6 text-center">
            Enterprise Security
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            <div>
              <div className="font-semibold text-slate-900 mb-2">
                🔐 HIPAA Compliant
              </div>
              <p className="text-sm text-slate-600">
                Full HIPAA compliance with audit trails
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">
                🔒 End-to-End Encryption
              </div>
              <p className="text-sm text-slate-600">
                256-bit AES encryption in transit and at rest
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">
                ✅ SOC 2 Certified
              </div>
              <p className="text-sm text-slate-600">
                Type II certification with continuous monitoring
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
