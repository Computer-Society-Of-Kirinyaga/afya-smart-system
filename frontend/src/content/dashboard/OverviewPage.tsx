import { useAlerts, useCurrentVitals } from '@/hooks/useVitals'
import { useAuthStore } from '@/store/auth'
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react'

function OverviewPage() {
  const { user } = useAuthStore()
  const { data: currentVitals, isLoading: vitalsLoading } = useCurrentVitals()
  const { data: alerts, isLoading: alertsLoading } = useAlerts()

  const recentAlerts = alerts?.slice(0, 5) || []
  const criticalAlerts = alerts?.filter((a) => a.severity === 'critical') || []
  const riskScore = criticalAlerts.length > 0 ? 75 : 35

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">{user?.name}</h1>
        <p className="text-teal-100 mt-2">
          Last vitals updated:{' '}
          {currentVitals?.heartRate.timestamp.toLocaleTimeString() ||
            'Loading...'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Risk Score</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {riskScore}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {riskScore > 60
                  ? 'High risk'
                  : riskScore > 30
                    ? 'Moderate risk'
                    : 'Low risk'}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                riskScore > 60
                  ? 'bg-red-100'
                  : riskScore > 30
                    ? 'bg-yellow-100'
                    : 'bg-green-100'
              }`}
            >
              <TrendingUp
                className={`w-6 h-6 ${
                  riskScore > 60
                    ? 'text-red-600'
                    : riskScore > 30
                      ? 'text-yellow-600'
                      : 'text-green-600'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Active Alerts Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                Active Alerts
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {alerts?.length || 0}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {criticalAlerts.length} critical
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Heart Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {vitalsLoading ? '—' : currentVitals?.heartRate.value}{' '}
                {currentVitals?.heartRate.unit}
              </p>
              <p className="text-xs text-slate-500 mt-1">Normal range</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Alerts</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {alertsLoading ? (
            <div className="p-6 text-center text-slate-500">
              Loading alerts...
            </div>
          ) : recentAlerts.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No recent alerts
            </div>
          ) : (
            recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-6 hover:bg-slate-50 transition duration-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.severity === 'critical'
                        ? 'bg-red-100'
                        : alert.severity === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        alert.severity === 'critical'
                          ? 'text-red-600'
                          : alert.severity === 'warning'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {alert.vital}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {alert.message}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          alert.severity === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : alert.severity === 'warning'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Vital Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentVitals && (
          <>
            {/* Blood Pressure */}
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-slate-600 text-sm font-medium">
                Blood Pressure
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {currentVitals.bloodPressure.systolic}/
                {currentVitals.bloodPressure.diastolic}{' '}
                {currentVitals.bloodPressure.unit}
              </p>
              <p className="text-xs text-slate-500 mt-1">Normal</p>
            </div>

            {/* SpO2 */}
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-slate-600 text-sm font-medium">
                Oxygen Saturation
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {currentVitals.spo2.value}% {currentVitals.spo2.unit}
              </p>
              <p className="text-xs text-slate-500 mt-1">Normal</p>
            </div>

            {/* Temperature */}
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-slate-600 text-sm font-medium">Temperature</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {currentVitals.temperature.value}{' '}
                {currentVitals.temperature.unit}
              </p>
              <p className="text-xs text-slate-500 mt-1">Normal</p>
            </div>

            {/* Glucose */}
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-slate-600 text-sm font-medium">
                Blood Glucose
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {currentVitals.glucose.value} {currentVitals.glucose.unit}
              </p>
              <p className="text-xs text-slate-500 mt-1">Normal</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OverviewPage
