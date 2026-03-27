import { use24HourHistory, useCurrentVitals } from '@/hooks/useVitals'
import { useHealthStream } from '@/hooks/useHealthStream'
import { useAuthStore } from '#/store/auth'
import type { VitalType } from '@/types/dashboard'
import { TrendingDown, TrendingUp, ChevronLeft, ChevronRight, WifiOff } from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

// Smoothly counts to new value on change, pulses the card on update
function AnimatedValue({ value }: { value: number | undefined }) {
  const [display, setDisplay] = useState(value ?? 0)
  const [flash, setFlash] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (value === undefined || value === prev.current) return
    prev.current = value
    setFlash(true)
    const start = display
    const end = value
    const duration = 600
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round((start + (end - start) * eased) * 10) / 10)
      if (progress < 1) requestAnimationFrame(tick)
      else setDisplay(end)
    }
    requestAnimationFrame(tick)
    setTimeout(() => setFlash(false), 800)
  }, [value])

  return (
    <motion.span
      animate={flash ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 0.4 }}
      className="tabular-nums"
    >
      {display}
    </motion.span>
  )
}

function VitalsPage() {
  const [activeTab, setActiveTab] = useState<VitalType>('heartRate')
  const [page, setPage] = useState(1)
  const { user } = useAuthStore()

  const { data: streamData, isConnected, error: streamError } = useHealthStream(user?.id || null)
  const { data: currentVitals } = useCurrentVitals()
  const { data: history, dataUpdatedAt } = use24HourHistory(activeTab)
  console.log("streamData",streamData)

  const prevStreamRef = useRef<number | undefined>()
  const [pulse, setPulse] = useState(false)

  const currentValue = streamData
    ? (streamData[VITAL_TO_API_KEY[activeTab] as keyof typeof streamData] as number) ?? 0
    : activeTab === 'heartRate'
      ? currentVitals?.heartRate
      : activeTab === 'spo2'
        ? currentVitals?.spo2
        : activeTab === 'temperature'
          ? currentVitals?.temperature
          : (currentVitals as any)?.glucose ?? 0

  useEffect(() => {
    if (currentValue !== prevStreamRef.current) {
      prevStreamRef.current = currentValue as number
      setPulse(true)
      setTimeout(() => setPulse(false), 700)
    }
  }, [currentValue,streamData])

  // Reverse so newest is always at top; re-derive when data or timestamp changes
  const reversedHistory = useMemo(
    () => (history ? [...history].reverse() : []),
    [history, dataUpdatedAt],
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
      <div className="relative flex gap-0 border-b border-slate-200 overflow-x-auto">
        {VITAL_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`relative px-5 py-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
              activeTab === key ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {label}
            {activeTab === key && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Stream error banner */}
      <AnimatePresence>
        {streamError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 overflow-hidden"
          >
            <WifiOff className="w-4 h-4 shrink-0" />
            Live stream unavailable — showing polled data. ({streamError})
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Value Card */}
      <motion.div
        animate={
          pulse
            ? {
                boxShadow: [
                  '0 0 0 0px rgba(20,184,166,0)',
                  '0 0 0 10px rgba(20,184,166,0.2)',
                  '0 0 0 0px rgba(20,184,166,0)',
                ],
              }
            : {}
        }
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-start justify-between">
          <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest">
            Current Reading
          </p>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              isConnected ? 'bg-white/15 text-white' : 'bg-white/10 text-teal-200'
            }`}
          >
            {isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-200 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Live
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                Polled
              </>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-6xl font-bold tracking-tight leading-none">
            <AnimatedValue value={currentValue as number} />
          </span>
          <span className="text-2xl text-teal-200 mb-1">
            {VITAL_TYPES.find((v) => v.key === activeTab)?.unit}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Average', value: avg },
          { label: 'Minimum', value: min },
          { label: 'Maximum', value: max },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label} · 24h</p>
            <p className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
              {value}
              <span className="text-sm font-normal text-slate-400 ml-1">
                {VITAL_TYPES.find((v) => v.key === activeTab)?.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">24-Hour Trend</h3>
        <div className="h-44 bg-gradient-to-b from-teal-50/50 to-white rounded-lg flex items-end gap-px p-3">
          {history?.map((point, idx) => {
            const normalized = ((point.value - min) / (max - min || 1)) * 100
            return (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(normalized, 3)}%` }}
                transition={{ duration: 0.6, delay: idx * 0.004, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 bg-teal-500/80 hover:bg-teal-500 rounded-t cursor-pointer group relative transition-colors"
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                  {point.value}
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-3 flex justify-between text-xs text-slate-400">
          <span>12:00 AM</span>
          <span>6:00 AM</span>
          <span>12:00 PM</span>
          <span>6:00 PM</span>
          <span>Now</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Hourly History</h3>
          <span className="text-xs text-slate-400 tabular-nums bg-slate-50 px-2 py-1 rounded-md">
            {reversedHistory.length} readings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/70">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence initial={false} mode="popLayout">
                {paginatedHistory.map((point, idx) => {
                  const globalIdx = (page - 1) * ROWS_PER_PAGE + idx
                  const prevValue =
                    globalIdx < reversedHistory.length - 1
                      ? reversedHistory[globalIdx + 1].value
                      : point.value
                  const trend =
                    point.value > prevValue ? 'up' : point.value < prevValue ? 'down' : 'stable'

                  const timeLabel =
                    point.timestamp instanceof Date
                      ? point.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : String(point.timestamp)

                  return (
                    <motion.tr
                      key={`${activeTab}-${point.timestamp instanceof Date ? point.timestamp.getTime() : point.timestamp}`}
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 tabular-nums">{timeLabel}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 tabular-nums">
                        {point.value}
                        <span className="text-slate-400 font-normal ml-1 text-xs">
                          {VITAL_TYPES.find((v) => v.key === activeTab)?.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          {trend === 'up' && (
                            <>
                              <TrendingUp className="w-4 h-4 text-red-500" />
                              <span className="text-red-500 font-medium text-xs">Increasing</span>
                            </>
                          )}
                          {trend === 'down' && (
                            <>
                              <TrendingDown className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-500 font-medium text-xs">Decreasing</span>
                            </>
                          )}
                          {trend === 'stable' && (
                            <span className="text-slate-400 text-xs">Stable</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Page {page} of {totalPages} · {reversedHistory.length} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
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
                  <span key={`ellipsis-${i}`} className="px-1.5 text-slate-300 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                      page === p
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
