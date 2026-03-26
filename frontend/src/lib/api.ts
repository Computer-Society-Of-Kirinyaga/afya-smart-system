// API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface ApiErrorResponse {
  message: string
  statusCode: number
  error?: string
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: ApiErrorResponse,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const data = (await response.json()) as T | ApiErrorResponse

    if (!response.ok) {
      const errorData = data as ApiErrorResponse
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData,
      )
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'Unknown error occurred',
    )
  }
}

// Helper methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    apiCall<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) => apiCall<T>(endpoint, { method: 'DELETE' }),
}
