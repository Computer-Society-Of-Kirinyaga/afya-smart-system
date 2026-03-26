import { useCreateHealthReading, useHealthReadings } from '@/hooks/useHealthReadingsApi'
import { useUser } from '@/hooks/useUsersApi'
import { useAuth } from '@/store/auth'
import { useState } from 'react'

/**
 * Example component demonstrating TanStack Query integration with backend API
 *
 * This component shows:
 * 1. Querying health readings
 * 2. Creating new health readings
 * 3. Handling loading and error states
 * 4. Optimistic updates
 */
export function ApiIntegrationExample() {
  const { userId } = useAuth()
  const [heartRate, setHeartRate] = useState('')
  const [systolicBp, setSystolicBp] = useState('')
  const [diastolicBp, setDiastolicBp] = useState('')

  // Query hooks
  const { data: readings, isLoading: readingsLoading, error: readingsError } = useHealthReadings(userId || '')
  const { data: user } = useUser(userId || '')

  // Mutation hook
  const createReadingMutation = useCreateHealthReading()

  const handleAddReading = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      alert('User ID is required')
      return
    }

    try {
      await createReadingMutation.mutateAsync({
        user_id: userId,
        heart_rate: heartRate ? parseInt(heartRate) : undefined,
        systolic_bp: systolicBp ? parseInt(systolicBp) : undefined,
        diastolic_bp: diastolicBp ? parseInt(diastolicBp) : undefined,
        timestamp: new Date().toISOString(),
      })

      // Reset form
      setHeartRate('')
      setSystolicBp('')
      setDiastolicBp('')
    } catch (error) {
      console.error('Failed to create reading:', error)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="rounded-lg border border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">API Integration Example</h2>

        {/* User Info */}
        {user && (
          <div className="mb-4 p-2 bg-blue-50 rounded">
            <p>
              <strong>User:</strong> {user.first_name || user.email}
            </p>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
          </div>
        )}

        {/* Add Reading Form */}
        <form onSubmit={handleAddReading} className="mb-6 space-y-4 border-b pb-6">
          <h3 className="font-semibold">Add Health Reading</h3>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Heart Rate (bpm)"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              className="px-3 py-2 border rounded"
              min="30"
              max="220"
            />
            <input
              type="number"
              placeholder="Systolic BP"
              value={systolicBp}
              onChange={(e) => setSystolicBp(e.target.value)}
              className="px-3 py-2 border rounded"
              min="70"
              max="200"
            />
            <input
              type="number"
              placeholder="Diastolic BP"
              value={diastolicBp}
              onChange={(e) => setDiastolicBp(e.target.value)}
              className="px-3 py-2 border rounded"
              min="40"
              max="120"
            />
          </div>

          <button
            type="submit"
            disabled={createReadingMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {createReadingMutation.isPending ? 'Adding...' : 'Add Reading'}
          </button>

          {createReadingMutation.isError && (
            <div className="p-2 bg-red-100 text-red-800 rounded">
              Error: {createReadingMutation.error?.message}
            </div>
          )}
          {createReadingMutation.isSuccess && (
            <div className="p-2 bg-green-100 text-green-800 rounded">
              Reading added successfully!
            </div>
          )}
        </form>

        {/* Readings List */}
        <div>
          <h3 className="font-semibold mb-4">Health Readings History</h3>

          {readingsLoading && <div>Loading readings...</div>}

          {readingsError && (
            <div className="p-3 bg-red-100 text-red-800 rounded">
              Error loading readings: {readingsError.message}
            </div>
          )}

          {readings && readings.length > 0 ? (
            <div className="space-y-2">
              {readings.map((reading) => (
                <div
                  key={reading.id}
                  className="p-3 border rounded bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="text-sm text-gray-600">
                    {new Date(reading.timestamp).toLocaleString()}
                  </div>
                  <div className="flex gap-4 mt-1 text-sm font-medium">
                    {reading.heart_rate && <span>❤️ {reading.heart_rate} bpm</span>}
                    {reading.systolic_bp && reading.diastolic_bp && (
                      <span>🩺 {reading.systolic_bp}/{reading.diastolic_bp}</span>
                    )}
                    {reading.spo2 && <span>O₂ {reading.spo2}%</span>}
                    {reading.temperature && (
                      <span>🌡️ {reading.temperature.toFixed(1)}°C</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No readings found. Add one to get started!</div>
          )}
        </div>
      </div>

      {/* API Status Info */}
      <div className="rounded-lg border border-gray-300 p-4 bg-gray-50 text-sm">
        <h4 className="font-semibold mb-2">API Integration Status</h4>
        <ul className="space-y-1 text-gray-700">
          <li>
            ✓ API Client: <code className="bg-gray-200 px-2 py-1 rounded">src/lib/api.ts</code>
          </li>
          <li>
            ✓ Health Readings Hooks:{' '}
            <code className="bg-gray-200 px-2 py-1 rounded">useHealthReadingsApi.ts</code>
          </li>
          <li>
            ✓ Users Hooks: <code className="bg-gray-200 px-2 py-1 rounded">useUsersApi.ts</code>
          </li>
          <li>✓ CORS Enabled on Backend</li>
          <li>✓ Environment: {import.meta.env.VITE_API_URL || 'http://localhost:3001'}</li>
        </ul>
      </div>
    </div>
  )
}

export default ApiIntegrationExample
