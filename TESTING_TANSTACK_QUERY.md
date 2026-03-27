# Testing TanStack Query Integration

## Prerequisites

Ensure both backend and frontend are running:

```bash
# Terminal 1: Backend
cd backend
npm run start:dev
# Output: Server is running on http://localhost:3001

# Terminal 2: Frontend
cd frontend
npm run dev
# Output: http://localhost:5173 (or 3000)
```

## Testing Checklist

### ✅ Backend API Verification

1. **Health Readings Endpoint**
   ```bash
   # Create a test user ID (UUID format)
   TEST_USER_ID="550e8400-e29b-41d4-a716-446655440000"

   # Test creating a reading
   curl -X POST http://localhost:3001/health-readings \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "'$TEST_USER_ID'",
       "heart_rate": 72,
       "systolic_bp": 120,
       "diastolic_bp": 80,
       "spo2": 98,
       "temperature": 36.5
     }'

   # Fetch latest reading
   curl http://localhost:3001/health-readings/latest-health/$TEST_USER_ID

   # Fetch all readings
   curl http://localhost:3001/health-readings/health-reading/$TEST_USER_ID
   ```

2. **Users Endpoint**
   ```bash
   # Register a user
   curl -X POST http://localhost:3001/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "first_name": "John",
       "last_name": "Doe"
     }'

   # Get user (replace ID with response from register)
   curl http://localhost:3001/users/$USER_ID
   ```

3. **CORS Headers Check**
   ```bash
   curl -i -X OPTIONS http://localhost:3001 \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET"

   # Should see: Access-Control-Allow-Origin: http://localhost:3000
   ```

### ✅ Frontend Integration Testing

1. **Visit Example Component**
   - Navigate to `http://localhost:5173/` (or the frontend URL)
   - Import and render `ApiIntegrationExample` component
   - The example component is at: `src/components/ApiIntegrationExample.tsx`

2. **Test Query Hooks**
   ```typescript
   // In browser console
   // These should work without errors:

   // Option 1: Use React Query DevTools (floating panel in dev mode)
   // Click on queries to see cached data and refetch

   // Option 2: Check Network tab in DevTools
   // Should see requests to http://localhost:3001/*
   ```

3. **Test Specific Functionality**

   **Create Health Reading:**
   - Fill in heart rate, systolic BP, diastolic BP
   - Click "Add Reading" button
   - Should see success message
   - Reading should appear in history

   **View User Data:**
   - User info should display if userId is set in auth store
   - Check that name/email matches registered user

   **Auto-refetch:**
   - Wait for stale time to expire (5 minutes default)
   - Page should automatically refetch data
   - Check Network tab to verify requests

### ✅ Error Handling Tests

1. **Invalid User ID**
   ```bash
   curl http://localhost:3001/users/invalid-uuid
   # Should return 400 or 404 with error message
   ```

2. **Backend Down**
   - Stop the backend server
   - Frontend should show loading/error state
   - Check browser console for errors
   - Error should be catchable via `error` in hook

3. **Invalid Request**
   ```bash
   curl -X POST http://localhost:3001/health-readings \
     -H "Content-Type: application/json" \
     -d '{"invalid": "data"}'
   # Should return validation error
   ```

### ✅ React Query DevTools

The devtools are automatically included when running dev mode.

1. **Access DevTools**
   - Look for floating button in bottom right
   - Shows active queries, mutations, cache status
   - Can trigger refetch/invalidate manually

2. **Monitor Queries**
   - See which queries are running
   - View cached data
   - Check stale/fresh status
   - View query timings

3. **Debugging Cache**
   - Click on query to expand details
   - See query key, stale time, cache time
   - Manually trigger refetch

## Performance Testing

### 1. Check Request Deduplication
```typescript
// Open two browser tabs with same URL
// Make same request on both tabs
// Network tab should show only ONE request
// (TanStack Query deduplicates)
```

### 2. Check Cache Effectiveness
```bash
# Method 1: Measure with DevTools
# Make request → Note timing
# Make same request again → Should be instant

# Method 2: Check Network tab
# First request: Shows full response time
# Second request (cached): Status 304 or instant from cache
```

### 3. Measure Refetch Performance
```typescript
// Configuration test:
// - staleTime: 1 * 60 * 1000 (1 minute)
// - gcTime: 5 * 60 * 1000 (5 minutes)
//
// Within 1 minute: should fetch from cache
// After 1 minute: should show "stale" badge
// Within 5 minutes: data persists in memory
// After 5 minutes: data is garbage collected
```

## Data Flow Testing

```
┌─────────────────────┐
│   React Component   │
│   (Dashboard)       │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Custom Hook        │
│  useHealthReadings()│
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  TanStack Query     │
│  - Cache           │
│  - Deduplication   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  API Client         │
│  api.get(endpoint)  │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  HTTP Request       │
│  fetch()            │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  Backend Server     │
│  http://localhost   │
│  :3001              │
└─────────────────────┘
```

## Test Scenarios

### Scenario 1: User Registration & First Reading
```
1. User registers via /users/register
2. Get user ID from response
3. Create health reading with that user ID
4. Fetch health readings
5. Verify data shows in UI
```

### Scenario 2: Real-time Updates
```
1. Open health readings list
2. In another tab/terminal: POST new reading
3. First tab should auto-refetch (based on refetchInterval)
4. New reading appears in list
```

### Scenario 3: Offline Behavior
```
1. Fetch data (should cache)
2. Go offline (DevTools → Network → Offline)
3. Component should still show cached data
4. Come back online
5. Query marked as stale → auto-refetch
6. Fresh data loads
```

## Debugging Commands

```typescript
// In browser console:

// 1. Check if QueryProvider is wrapping app
// (All pages should work without CORS errors)

// 2. Verify API URL
console.log(import.meta.env.VITE_API_URL)

// 3. Check if hook is enabled
// (Open DevTools, look for query status)

// 4. Test fetch directly
fetch('http://localhost:3001/users/test-id')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// 5. Check auth store
// (If using useAuth hook)
// import { useAuth } from '@/store/auth'
// const { userId } = useAuth()
// console.log('Current userId:', userId)
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS Error | Backend CORS not enabled | Verify `enableCors()` in backend/main.ts |
| 404 errors | Wrong endpoint URL | Check `src/lib/api.ts` API_BASE_URL |
| Network errors | Backend not running | Run `npm run start:dev` in backend folder |
| Stale data | Cache not invalidating | Use `queryClient.invalidateQueries()` |
| No data shown | userId not set | Check `useAuth().userId` is defined |
| Hooks not working | QueryProvider missing | Wrap app with `<QueryProvider>` |

## Continuous Testing

### Before Committing Code:
1. ✅ Backend starts without errors
2. ✅ Frontend connects to backend
3. ✅ Can create health reading
4. ✅ Can fetch health readings
5. ✅ Can register user
6. ✅ Can fetch user data
7. ✅ No console errors
8. ✅ Network requests show in DevTools

### Weekly Integration Tests:
1. Test all API endpoints
2. Verify error handling
3. Check cache behavior
4. Monitor performance metrics
5. Update API types if needed

---

**Testing Completed**: [Add date when complete]
**Tested By**: [Your name]
**Issues Found**: [List any bugs found and fixed]
