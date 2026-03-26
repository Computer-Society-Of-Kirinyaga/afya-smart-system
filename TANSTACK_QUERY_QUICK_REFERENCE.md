# TanStack Query + Backend Integration - Quick Reference

## 🚀 Getting Started

### 1. Start Backend
```bash
cd backend
npm install
npm run start:dev
# Runs on http://localhost:3001
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 or 3000
```

### 3. Check Integration
The backend is configured with CORS enabled. Test with:
```bash
curl http://localhost:3001/users/test-user-id
```

## 📂 File Structure

```
frontend/src/
├── lib/
│   ├── api.ts              # API client & HTTP utilities
│   └── api.types.ts        # TypeScript types for API
├── hooks/
│   ├── useHealthReadingsApi.ts  # Health readings queries/mutations
│   ├── useUsersApi.ts            # User queries/mutations
│   └── useVitals.ts              # Updated to use real API
├── components/
│   └── ApiIntegrationExample.tsx # Example component
└── providers/
    └── QueryProvider.tsx    # TanStack Query setup

backend/src/
├── health-readings/
│   ├── health-readings.controller.ts
│   └── health-readings.service.ts
├── users/
│   ├── users.controller.ts
│   └── users.service.ts
└── main.ts  # CORS configured here
```

## 🔗 API Endpoints

### Health Readings
- `POST /health-readings` - Create reading
- `GET /health-readings/latest-health/:id` - Get latest reading
- `GET /health-readings/health-reading/:id` - Get all readings

### Users
- `POST /users/register` - Create user
- `GET /users/:id` - Get user
- `PATCH /users/:id/doctor` - Update doctor info
- `PATCH /users/:id/preferences` - Update alert preferences

## 💾 Hooks Usage

### Queries (Read)
```typescript
import { useHealthReadings, useLatestHealthReading } from '@/hooks/useHealthReadingsApi'
import { useUser } from '@/hooks/useUsersApi'

const { data, isLoading, error } = useHealthReadings(userId)
const { data: reading } = useLatestHealthReading(userId)
const { data: user } = useUser(userId)
```

### Mutations (Write)
```typescript
import { useCreateHealthReading } from '@/hooks/useHealthReadingsApi'
import { useRegisterUser } from '@/hooks/useUsersApi'

const createReading = useCreateHealthReading()
await createReading.mutateAsync({ user_id, heart_rate: 72 })

const register = useRegisterUser()
await register.mutateAsync({ email: 'user@example.com' })
```

## ⚙️ Configuration

### Environment Variables
**Frontend (.env.local)**
```env
VITE_API_URL=http://localhost:3001
```

**Backend (.env)**
```env
PORT=3001
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## 🐛 Debugging

### React Query DevTools
Available in dev mode - look for floating panel
```typescript
// Already imported in QueryProvider
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

### Check API Calls
```bash
# Browser DevTools → Network tab
# Look for requests to http://localhost:3001/*
```

### Test Endpoints
```bash
# Health readings
curl http://localhost:3001/health-readings/latest-health/{userId}

# User info
curl http://localhost:3001/users/{userId}
```

## 📝 Common Patterns

### Fetching data in component
```typescript
export function MyComponent() {
  const { data, isLoading, error } = useHealthReadings(userId)

  if (isLoading) return <Skeleton />
  if (error) return <ErrorAlert error={error} />

  return <DataDisplay data={data} />
}
```

### Form submission with mutation
```typescript
const mutation = useCreateHealthReading()

const handleSubmit = async (values) => {
  try {
    await mutation.mutateAsync(values)
    showSuccess('Reading added!')
  } catch (error) {
    showError(error.message)
  }
}
```

### Cache invalidation
```typescript
const queryClient = useQueryClient()

queryClient.invalidateQueries({
  queryKey: ['health-readings']
})
```

## 🔄 Real-time Updates

### Auto-refetch
```typescript
useLatestHealthReading(userId)
// Already configured to refetch every 5 minutes
// Set refetchInterval in hook config
```

### WebSocket (Future)
See backend `stream` module for WebSocket support

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Check backend CORS config, ensure port 3001 |
| 404 Not Found | Verify endpoint exists, check URL in api.ts |
| Stale Data | Adjust staleTime, use `invalidateQueries()` |
| Slow Requests | Check Network tab, verify backend performance |
| Type Errors | Ensure types match in api.types.ts |

## 📚 Next Steps

1. Add authentication/JWT tokens
2. Create more API endpoints as needed
3. Implement streaming for real-time data
4. Add error boundaries
5. Set up CI/CD for backend & frontend

---

**Last Updated**: March 2026
**Status**: ✅ Ready for Development
