import { use24HourHistory, useCurrentVitals } from '@/hooks/useVitals'
import type { VitalType } from '@/types/dashboard'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const VITAL_TYPES: { key: VitalType; label: string; unit: string }[] = [
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
  { key: 'spo2', label: 'Oxygen Saturation', unit: '%' },
  { key: 'temperature', label: 'Temperature', unit: '°C' },
  { key: 'glucose', label: 'Blood Glucose', unit: 'mg/dL' },
]

function VitalsPage() {
  const [activeTab, setActiveTab] = useState<VitalType>('heartRate')
  const { data: currentVitals } = useCurrentVitals()
  const { data: history } = use24HourHistory(activeTab)

  const currentValue =
    activeTab === 'heartRate'
      ? currentVitals?.heartRate.value
      : activeTab === 'spo2'
        ? currentVitals?.spo2.value
        : activeTab === 'temperature'
          ? currentVitals?.temperature.value
          : currentVitals?.glucose.value

  const historyValues = history?.map((h) => h.value) || []
  const min = historyValues.length > 0 ? Math.min(...historyValues) : 0
  const max = historyValues.length > 0 ? Math.max(...historyValues) : 0
  const avg =
    historyValues.length > 0
      ? Math.round((historyValues.reduce((a, b) => a + b, 0) / historyValues.length) * 10) / 10
      : 0

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {VITAL_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 font-medium border-b-2 transition duration-200 ${
              activeTab === key
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Current Value Card */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-8 text-white shadow-lg">
        <p className="text-teal-100 text-sm font-medium">Current</p>
        <p className="text-5xl font-bold mt-2">
          {currentValue}
          <span className="text-2xl ml-2">
            {activeTab === 'heartRate'
              ? 'bpm'
              : activeTab === 'spo2'
                ? '%'
                : activeTab === 'temperature'
                  ? '°C'
                  : 'mg/dL'}
          </span>
        </p>
        <p className="text-teal-100 mt-2">Last updated just now</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Average (24h)</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{avg}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Minimum (24h)</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{min}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Maximum (24h)</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{max}</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">24-Hour Trend</h3>
        <div className="h-64 bg-gradient-to-b from-teal-50 to-slate-50 rounded flex items-end justify-around gap-1 p-4">
          {history?.map((point, idx) => {
            const normalized = ((point.value - min) / (max - min || 1)) * 100
            return (
              <div
                key={idx}
                className="flex-1 bg-teal-600 rounded-t hover:bg-teal-700 transition duration-200 group relative"
                style={{ height: `${Math.max(normalized, 5)}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition">
                  {point.value}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex justify-between text-xs text-slate-500">
          <span>12:00 AM</span>
          <span>6:00 AM</span>
          <span>12:00 PM</span>
          <span>6:00 PM</span>
          <span>Now</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900">Hourly History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {history?.map((point, idx) => {
                const prevValue = idx > 0 ? history[idx - 1].value : point.value
                const trend = point.value > prevValue ? 'up' : point.value < prevValue ? 'down' : 'stable'
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-slate-900">{point.time}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{point.value}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {trend === 'up' && (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-red-600">Increasing</span>
                          </>
                        )}
                        {trend === 'down' && (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Decreasing</span>
                          </>
                        )}
                        {trend === 'stable' && (
                          <span className="text-slate-600">Stable</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VitalsPage
