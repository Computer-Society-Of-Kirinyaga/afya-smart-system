# TanStack Query Integration - Common Patterns & Examples

## Pattern 1: Simple Data Fetching

### Basic Query
```typescript
import { useHealthReadings } from '@/hooks/useHealthReadingsApi'

export function HealthReadingsList() {
  const { data: readings, isLoading, error } = useHealthReadings(userId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {readings?.map(reading => (
        <li key={reading.id}>
          Heart Rate: {reading.heart_rate} bpm
        </li>
      ))}
    </ul>
  )
}
```

### With Skeleton Loading
```typescript
import { Skeleton } from '@/components/ui/skeleton'

export function HealthReadingsWithSkeleton() {
  const { data, isLoading, error } = useHealthReadings(userId)

  if (error) return <ErrorBoundary error={error} />

  return (
    <div className="space-y-2">
      {isLoading ? (
        <>
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </>
      ) : (
        data?.map(item => <ReadingCard key={item.id} reading={item} />)
      )}
    </div>
  )
}
```

## Pattern 2: Form Submission with Mutation

### Basic Form
```typescript
import { useCreateHealthReading } from '@/hooks/useHealthReadingsApi'

export function AddHealthReadingForm() {
  const mutation = useCreateHealthReading()
  const [formData, setFormData] = useState({
    heart_rate: '',
    systolic_bp: '',
    diastolic_bp: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await mutation.mutateAsync({
        user_id: userId,
        ...formData,
      })
      setFormData({ heart_rate: '', systolic_bp: '', diastolic_bp: '' })
    } catch (error) {
      console.error('Failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.heart_rate}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          heart_rate: e.target.value
        }))}
        placeholder="Heart Rate"
      />

      <button
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Submitting...' : 'Add Reading'}
      </button>

      {mutation.isError && (
        <div className="text-red-500">
          Error: {mutation.error?.message}
        </div>
      )}
      {mutation.isSuccess && (
        <div className="text-green-500">
          Reading added successfully!
        </div>
      )}
    </form>
  )
}
```

### With React Hook Form
```typescript
import { useForm } from 'react-hook-form'
import { useCreateHealthReading } from '@/hooks/useHealthReadingsApi'

export function AddReadingWithRHF() {
  const { register, handleSubmit, reset } = useForm()
  const mutation = useCreateHealthReading()

  const onSubmit = async (data: CreateHealthReadingInput) => {
    try {
      await mutation.mutateAsync({
        ...data,
        user_id: userId,
      })
      reset()
    } catch (error) {
      console.error('Failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('heart_rate', { valueAsNumber: true })}
        placeholder="Heart Rate"
      />
      <input
        {...register('systolic_bp', { valueAsNumber: true })}
        placeholder="Systolic BP"
      />
      <input
        {...register('diastolic_bp', { valueAsNumber: true })}
        placeholder="Diastolic BP"
      />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

## Pattern 3: Dependent Queries

### Query depends on another query
```typescript
export function UserDashboard({ userId }: { userId: string }) {
  // First query - get user
  const { data: user, isLoading: userLoading } = useUser(userId)

  // Second query - depends on first query's data
  const { data: readings, isLoading: readingsLoading } = useHealthReadings(
    user?.id || ''
  )

  if (userLoading) return <Skeleton />
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h1>{user.first_name}</h1>

      {readingsLoading ? (
        <Skeleton />
      ) : (
        <ReadingsList readings={readings} />
      )}
    </div>
  )
}
```

## Pattern 4: Optimistic Updates

### Immediately update UI before server response
```typescript
import { useQueryClient } from '@tanstack/react-query'
import { useCreateHealthReading } from '@/hooks/useHealthReadingsApi'

export function OptimisticReadingForm() {
  const queryClient = useQueryClient()
  const mutation = useCreateHealthReading({
    onMutate: async (newReading) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['health-readings', 'all', userId]
      })

      // Get previous data
      const previousReadings = queryClient.getQueryData(
        ['health-readings', 'all', userId]
      )

      // Optimistically update cache with new reading
      queryClient.setQueryData(
        ['health-readings', 'all', userId],
        (old: HealthReading[] | undefined) => [
          ...(old || []),
          {
            id: Math.random().toString(), // Temp ID
            ...newReading,
            timestamp: new Date().toISOString(),
          }
        ]
      )

      return { previousReadings }
    },
    onError: (err, newReading, context) => {
      // Revert on error
      queryClient.setQueryData(
        ['health-readings', 'all', userId],
        context?.previousReadings
      )
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      mutation.mutate({
        user_id: userId,
        heart_rate: 72,
      })
    }}>
      <button type="submit">Add Reading</button>
    </form>
  )
}
```

## Pattern 5: Manual Cache Management

### Invalidate and Refetch
```typescript
export function RefreshButton() {
  const queryClient = useQueryClient()

  const handleRefresh = async () => {
    // Invalidate all health-readings queries
    await queryClient.invalidateQueries({
      queryKey: ['health-readings'],
    })
    // Component automatically refetches
  }

  return <button onClick={handleRefresh}>Refresh Data</button>
}
```

### Set Cache Data Manually
```typescript
export function UpdateCacheExample() {
  const queryClient = useQueryClient()
  const mutation = useCreateHealthReading()

  const handleAddWithCache = async (newReading: CreateHealthReadingInput) => {
    const response = await mutation.mutateAsync(newReading)

    // Manually add to cache instead of invalidating
    queryClient.setQueryData(
      ['health-readings', 'latest', newReading.user_id],
      response
    )
  }

  return <button onClick={() => handleAddWithCache(data)}>Add</button>
}
```

## Pattern 6: Multiple Mutations

### Sequential mutations
```typescript
export function RegisterAndAddReading() {
  const registerMutation = useRegisterUser()
  const createReadingMutation = useCreateHealthReading()

  const handleRegisterAndAdd = async () => {
    // First: Register user
    const newUser = await registerMutation.mutateAsync({
      email: 'user@example.com',
      first_name: 'John',
    })

    // Then: Create reading for that user
    await createReadingMutation.mutateAsync({
      user_id: newUser.id,
      heart_rate: 72,
    })
  }

  return <button onClick={handleRegisterAndAdd}>
    Register & Add Reading
  </button>
}
```

## Pattern 7: Error Boundaries with Queries

### Centralized error handling
```typescript
interface QueryErrorBoundaryProps {
  error: Error | null
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function QueryErrorBoundary({
  error,
  isLoading,
  children,
  fallback,
}: QueryErrorBoundaryProps) {
  if (isLoading) {
    return <Skeleton />
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-700 text-sm">{error.message}</p>
        {fallback}
      </div>
    )
  }

  return <>{children}</>
}

// Usage:
export function MyComponent() {
  const query = useHealthReadings(userId)

  return (
    <QueryErrorBoundary
      error={query.error}
      isLoading={query.isLoading}
      fallback={<RetryButton />}
    >
      <ReadingsList readings={query.data} />
    </QueryErrorBoundary>
  )
}
```

## Pattern 8: Polling/Auto-Refetch

### Automatic updates
```typescript
export function LiveHealthReading() {
  const { data } = useQuery({
    queryKey: ['health-readings', 'latest', userId],
    queryFn: () => api.get(`/health-readings/latest-health/${userId}`),
    // Auto-refetch every 5 seconds for live updates
    refetchInterval: 5000,
    // Stop auto-refresh when window is hidden
    refetchIntervalInBackground: false,
  })

  return <div>Heart Rate: {data?.heart_rate} bpm</div>
}
```

## Pattern 9: Pagination

### Load more pattern
```typescript
export function InfiniteReadingsList() {
  const [page, setPage] = useState(1)
  const { data: allReadings } = useQuery({
    queryKey: ['health-readings', 'page', page],
    queryFn: () => api.get(`/health-readings/health-reading/${userId}?page=${page}`),
  })

  return (
    <div>
      <ReadingsList readings={allReadings} />
      <button onClick={() => setPage(p => p + 1)}>
        Load More
      </button>
    </div>
  )
}
```

## Pattern 10: Query Status Display

### Show different UI based on query state
```typescript
export function QueryStatusExample() {
  const query = useHealthReadings(userId)

  return (
    <div>
      {query.isLoading && <LoadingSpinner />}

      {query.isPending && <div>Fetching data...</div>}

      {query.isError && (
        <div className="text-red-500">
          Failed: {query.error?.message}
        </div>
      )}

      {query.isSuccess && (
        <div>
          {query.data?.length === 0 ? (
            <EmptyState />
          ) : (
            <ReadingsList readings={query.data} />
          )}
        </div>
      )}

      {query.isPaused && (
        <div className="text-yellow-600">
          Network error - paused
        </div>
      )}

      {query.isFetching && query.isSuccess && (
        <div className="text-blue-500 text-sm">
          Updating in background...
        </div>
      )}
    </div>
  )
}
```

## Quick Reference Table

| Pattern | Use Case | Example |
|---------|----------|---------|
| Simple Query | Fetch & display data | `useHealthReadings()` |
| Mutation | Create/update data | `useCreateHealthReading()` |
| Dependent Query | Query depends on another | Wait for user before fetching readings |
| Optimistic Update | Instant UI update | Update list before API response |
| Manual Cache | Direct cache manipulation | Pre-fetch or set data |
| Error Handling | Handle failures gracefully | `QueryErrorBoundary` |
| Auto-Refetch | Keep data fresh | `refetchInterval: 5000` |
| Pagination | Load data in chunks | Set/increment page state |
| Status Display | Show loading/error/success | Check `isLoading`, `isError`, `isSuccess` |
| Multiple Mutations | Sequential operations | Register then add reading |

---

**Pro Tips:**
1. Always enable queries conditionally with `enabled` prop
2. Use query keys to organize and manage cache
3. Leverage `staleTime` to reduce unnecessary requests
4. Use `gcTime` to keep data in memory after unmount
5. Check React Query DevTools in dev mode for debugging

For more info, see `TANSTACK_QUERY_SETUP.md`
