# TanStack Query Integration Guide

This guide explains how TanStack Query is connected to your backend API.

## Setup Overview

### 1. **API Client** (`src/lib/api.ts`)
- Centralized API communication layer
- Handles HTTP requests (GET, POST, PATCH, DELETE)
- Implements error handling with custom `ApiError` class
- Configurable base URL via `VITE_API_URL` environment variable

### 2. **Type Definitions** (`src/lib/api.types.ts`)
- TypeScript interfaces for all API entities
- Includes: `HealthReading`, `User`, `RiskAssessment`, `StreamData`

### 3. **API Hooks**

#### Health Readings (`src/hooks/useHealthReadingsApi.ts`)
```typescript
// Fetch latest reading for a user
useLatestHealthReading(userId)

// Fetch all readings for a user
useHealthReadings(userId)

// Fetch aggregated readings
useAggregatedHealthReadings(userId)

// Create a new reading (mutation)
useCreateHealthReading()
```

#### Users (`src/hooks/useUsersApi.ts`)
```typescript
// Fetch user data
useUser(userId)

// Register new user (mutation)
useRegisterUser()

// Update doctor info (mutation)
useUpdateUserDoctor(userId)

// Update alert preferences (mutation)
useUpdateUserPreferences(userId)
```

### 4. **Updated Vitals Hook** (`src/hooks/useVitals.ts`)
- Now uses real API calls where available
- Falls back to mock data if API fails
- Maintains backward compatibility

## Configuration

### Environment Variables
Create or update `.env.local`:
```env
VITE_API_URL=http://localhost:3001
```

### Backend CORS
The backend is configured to accept requests from:
- `http://localhost:3000` (frontend dev)
- `http://localhost:5173` (Vite dev)

Customize via `CORS_ORIGIN` environment variable on backend.

## Usage Examples

### Fetching Data in Components

```typescript
import { useHealthReadings } from '@/hooks/useHealthReadingsApi'
import { useAuth } from '@/store/auth'

export function HealthReadingsComponent() {
  const { userId } = useAuth()
  const { data, isLoading, error } = useHealthReadings(userId || '')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map((reading) => (
        <div key={reading.id}>{reading.heart_rate} bpm</div>
      ))}
    </div>
  )
}
```

### Creating/Mutating Data

```typescript
import { useCreateHealthReading } from '@/hooks/useHealthReadingsApi'
import { useAuth } from '@/store/auth'

export function AddReadingForm() {
  const { userId } = useAuth()
  const mutation = useCreateHealthReading()

  const handleSubmit = async (formData: CreateHealthReadingInput) => {
    await mutation.mutateAsync({
      ...formData,
      user_id: userId,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

## Key Features

1. **Query Key Management**: Organized query keys for easy cache invalidation
2. **Automatic Refetching**: Configured stale times and refetch intervals
3. **Error Handling**: Typed error responses with custom error class
4. **Optimistic Updates**: Mutations update cache immediately
5. **Request Deduplication**: TanStack Query automatically deduplicates identical requests
6. **DevTools**: React Query DevTools available in dev mode

## Adding New API Endpoints

### Step 1: Add Backend Endpoint
```typescript
// backend/src/example/example.controller.ts
@Get('path')
getExample() {
  return this.exampleService.get()
}
```

### Step 2: Add Type Definition
```typescript
// frontend/src/lib/api.types.ts
export interface Example {
  id: string
  name: string
  // ... other fields
}
```

### Step 3: Create Custom Hook
```typescript
// frontend/src/hooks/useExampleApi.ts
export function useExample() {
  return useQuery({
    queryKey: ['example'],
    queryFn: () => api.get<Example>('/example/path'),
    staleTime: 5 * 60 * 1000,
  })
}
```

## Testing API Calls

### Using curl
```bash
curl http://localhost:3001/health-readings/latest-health/{userId}
```

### Debugging with React Query DevTools
The devtools are included in the dev build. Look for the floating panel in dev mode.

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 3001
- Check `CORS_ORIGIN` environment variable
- Verify frontend is making requests to correct URL

### API Calls Failing
- Check `VITE_API_URL` in `.env.local`
- Verify backend endpoints exist
- Check browser Network tab for request/response details

### Stale Data
- Adjust `staleTime` and `gcTime` in query configuration
- Use `refetchInterval` for real-time updates
- Manually invalidate queries: `queryClient.invalidateQueries({ queryKey: ['example'] })`

## Next Steps

1. Update remaining components to use API hooks
2. Add more backend endpoints as needed
3. Implement authentication/JWT tokens
4. Add WebSocket support for real-time streaming
5. Add error boundaries for better error handling
