import { use24HourHistory, useCurrentVitals } from '@/hooks/useVitals'
import { useHealthStream } from '@/hooks/useHealthStream'
import { useAuthStore } from '#/store/auth'
import type { VitalType } from '@/types/dashboard'
import { TrendingDown, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'

// Maps VitalType (camelCase) → API snake_case key used by the stream
const VITAL_TO_API_KEY: Record<VitalType, string> = {
  heartRate: 'heart_rate',
  spo2: 'spo2',
  temperature: 'temperature',
  glucose: 'glucose',
}

const ROWS_PER_PAGE = 10

const VITAL_TYPES: { key: VitalType; label: string; unit: string }[] = [
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm' },
  { key: 'spo2', label: 'Oxygen Saturation', unit: '%' },
  { key: 'temperature', label: 'Temperature', unit: '°C' },
  { key: 'glucose', label: 'Blood Glucose', unit: 'mg/dL' },
]

function VitalsPage() {
  const [activeTab, setActiveTab] = useState<VitalType>('heartRate')
  const [page, setPage] = useState(1)
  const { user } = useAuthStore()

  // Fetch from backend stream
  const { data: streamData, isConnected, error: streamError } = useHealthStream(user?.id || null)

  // Fallback to API polling if stream is not available
  const { data: currentVitals } = useCurrentVitals()
  const { data: history } = use24HourHistory(activeTab)

  // Use stream data if available, otherwise use API data
  const currentValue = streamData
    ? (streamData[VITAL_TO_API_KEY[activeTab] as keyof typeof streamData] as number) ?? 0
    : activeTab === 'heartRate'
      ? currentVitals?.heartRate
      : activeTab === 'spo2'
        ? currentVitals?.spO2
        : activeTab === 'temperature'
          ? currentVitals?.temperature
          : (currentVitals as any)?.glucose ?? 0

  // Reverse so most recent reading appears first in the table
  const reversedHistory = useMemo(
    () => (history ? [...history].reverse() : []),
    [history],
  )

  const historyValues = reversedHistory.map((h) => h.value)
  const min = historyValues.length > 0 ? Math.min(...historyValues) : 0
  const max = historyValues.length > 0 ? Math.max(...historyValues) : 0
  const avg =
    historyValues.length > 0
      ? Math.round(
          (historyValues.reduce((a, b) => a + b, 0) / historyValues.length) * 10,
        ) / 10
      : 0

  // Pagination
  const totalPages = Math.max(1, Math.ceil(reversedHistory.length / ROWS_PER_PAGE))
  const paginatedHistory = reversedHistory.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  )

  const handleTabChange = (key: VitalType) => {
    setActiveTab(key)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {VITAL_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
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

      {/* Stream status indicator */}
      {streamError && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded px-4 py-2">
          Live stream unavailable — showing polled data. ({streamError})
        </div>
      )}

      {/* Current Value Card */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-8 text-white shadow-lg">
        <p className="text-teal-100 text-sm font-medium">Current</p>
        <p className="text-5xl font-bold mt-2">
          {currentValue}
          <span className="text-2xl ml-2">
            {VITAL_TYPES.find((v) => v.key === activeTab)?.unit}
          </span>
        </p>
        <p className="text-teal-100 mt-2">
          {isConnected ? 'Live' : 'Last updated just now'}
        </p>
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

      {/* Chart — chronological order (oldest → newest, left → right) */}
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
        <div className="border-b border-slate-200 p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Hourly History</h3>
          <span className="text-sm text-slate-500">{reversedHistory.length} readings</span>
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
              {paginatedHistory.map((point, idx) => {
                const globalIdx = (page - 1) * ROWS_PER_PAGE + idx
                // Compare against the next item in reversed list (i.e. the previous reading)
                const prevValue =
                  globalIdx < reversedHistory.length - 1
                    ? reversedHistory[globalIdx + 1].value
                    : point.value
                const trend =
                  point.value > prevValue
                    ? 'up'
                    : point.value < prevValue
                      ? 'down'
                      : 'stable'

                // timestamp is a Date object (set by use24HourHistory)
                const timeLabel =
                  point.timestamp instanceof Date
                    ? point.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : String(point.timestamp)

                return (
                  <tr key={globalIdx} className="hover:bg-slate-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-slate-900">{timeLabel}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {point.value} {VITAL_TYPES.find((v) => v.key === activeTab)?.unit}
                    </td>
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

        {/* Pagination */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Page {page} of {totalPages} · {reversedHistory.length} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition ${
                      page === p
                        ? 'bg-teal-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VitalsPage
