import { useEffect, useState } from 'react'

export interface HealthStreamData {
  id?: number
  heart_rate?: number
  spo2?: number
  temperature?: number
  glucose?: number
  systolic_bp?: number
  diastolic_bp?: number
  risk_level?: string
  timestamp?: string
  message?: string
}

export function useHealthStream(userId: string | null) {
  const [data, setData] = useState<HealthStreamData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setIsConnected(false)
      return
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('access_token')

    const eventSource = new EventSource(
      `${API_BASE_URL}/stream/${userId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      } as EventSourceInit,
    )

    const handleMessage = (event: MessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data) as HealthStreamData
        setData(parsedData)
        setError(null)
      } catch (err) {
        console.error('Failed to parse stream data:', err)
        setError('Failed to parse health data')
      }
    }

    const handleError = () => {
      setIsConnected(false)
      setError('Connection lost to health stream')
      eventSource.close()
    }

    const handleOpen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.addEventListener('open', handleOpen)
    eventSource.addEventListener('message', handleMessage)
    eventSource.addEventListener('error', handleError)

    return () => {
      eventSource.removeEventListener('open', handleOpen)
      eventSource.removeEventListener('message', handleMessage)
      eventSource.removeEventListener('error', handleError)
      eventSource.close()
    }
  }, [userId])

  return { data, isConnected, error }
}

// Hook for test stream endpoint
export function useHealthTestStream() {
  const [data, setData] = useState<HealthStreamData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

    const eventSource = new EventSource(
      `${API_BASE_URL}/stream/health-test`,
    )

    const handleMessage = (event: MessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data) as HealthStreamData
        setData(parsedData)
        setError(null)
      } catch (err) {
        console.error('Failed to parse stream data:', err)
        setError('Failed to parse health data')
      }
    }

    const handleError = () => {
      setIsConnected(false)
      setError('Connection lost to health stream')
      eventSource.close()
    }

    const handleOpen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.addEventListener('open', handleOpen)
    eventSource.addEventListener('message', handleMessage)
    eventSource.addEventListener('error', handleError)

    return () => {
      eventSource.removeEventListener('open', handleOpen)
      eventSource.removeEventListener('message', handleMessage)
      eventSource.removeEventListener('error', handleError)
      eventSource.close()
    }
  }, [])

  return { data, isConnected, error }
}
