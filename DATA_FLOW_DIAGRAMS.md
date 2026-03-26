# TanStack Query Integration - Visual Data Flow Guide

## 1. Query Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Component                              │
│                  (e.g., Dashboard)                              │
│                                                                 │
│  const { data, isLoading, error } = useHealthReadings(userId) │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │   Custom Hook Layer           │
         │ useHealthReadingsApi.ts       │
         │                               │
         │  • Query key generation      │
         │  • Stale time config         │
         │  • Error boundaries          │
         └───────────────┬───────────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │  TanStack Query Core          │
         │                               │
         │  1. Check cache first        │
         │  2. If stale: refetch       │
         │  3. Deduplicate requests    │
         │  4. Store in memory         │
         │  5. Trigger component update │
         └───────────────┬───────────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │    API Client Layer           │
         │   (src/lib/api.ts)           │
         │                               │
         │  fetch(URL, options)         │
         │  JSON.parse(response)        │
         │  Handle errors               │
         └───────────────┬───────────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │    Browser Fetch API          │
         │   (Network Request)           │
         │                               │
         │  GET /health-readings/...    │
         │  Headers: application/json   │
         └───────────────┬───────────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │   Backend Server              │
         │  (NestJS, port 3001)         │
         │                               │
         │  @Controller('health-...')  │
         │  @Get(':id')                │
         │  return service.findOne()   │
         └───────────────┬───────────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │   Service Layer               │
         │  healthReadings.service.ts  │
         │                               │
         │  Query database              │
         │  Transform data              │
         │  Return result               │
         └───────────────┬───────────────┘
                         │
                         ↓
         ┌───────────────────────────────┐
         │   Database                    │
         │  (TypeORM + PostgreSQL)      │
         │                               │
         │  SELECT * FROM               │
         │  health_readings ...         │
         └───────────────┬───────────────┘
```

## 2. Request-Response Cycle

### First Request (Network)
```
Time: 0ms
┌─ Component renders
│
└─ useHealthReadings(userId) called
   │
   ├─ Check cache: ❌ MISS
   │
   ├─ Check is stale: N/A (not in cache)
   │
   ├─ Set query state: isLoading = true
   │
   └─ Make HTTP request
      │
      ├─ GET http://localhost:3001/health-readings/health-reading/{userId}
      │
      ├─ Await response
      │
      ├─ Parse JSON
      │
      ├─ Store in cache
      │
      └─ Update query state: isLoading = false, data = [...]
         │
         └─ Component re-renders with data ✅
```

### Second Request (Cache Hit)
```
Time: 100ms (within staleTime)
┌─ Component renders
│
└─ useHealthReadings(userId) called
   │
   ├─ Check cache: ✅ HIT
   │
   ├─ Check is stale: NO (within 5 minutes)
   │
   └─ Return cached data immediately ⚡
      │
      └─ Component renders with cached data ✅
         (No network request!)
```

### Third Request (Stale but Cached)
```
Time: 400s (after staleTime = 5 minutes)
┌─ Component renders
│
└─ useHealthReadings(userId) called
   │
   ├─ Check cache: ✅ HIT
   │
   ├─ Check is stale: YES (5+ minutes old)
   │
   ├─ Return cached data immediately (marked as "stale")
   │
   └─ Background refetch triggered
      │
      ├─ Make HTTP request (in background)
      │
      ├─ New data arrives
      │
      ├─ Update cache
      │
      └─ Component re-renders with fresh data ✅
```

## 3. Mutation Data Flow

```
User Action: Click "Add Reading" button
        │
        ↓
┌───────────────────────────────┐
│   handleAddReading()          │
│   Called by form onSubmit     │
└───────────────┬───────────────┘
                │
                ↓
┌───────────────────────────────┐
│  mutation.mutateAsync(data)   │
│  (useCreateHealthReading)     │
└───────────────┬───────────────┘
                │
         ┌──────┴──────┐
         │             │
         ↓             ↓
   ┌──────────┐   ┌───────────────┐
   │onMutate  │   │Make HTTP POST │
   │(optional)│   │api.post()     │
   └──────────┘   │               │
                  │Get: /health-  │
                  │readings/...   │
                  └────────┬──────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ↓ (Success)           ↓ (Error)
         ┌──────────────┐      ┌────────────┐
         │onSuccess     │      │onError     │
         │ - Update     │      │ - Revert   │
         │   cache      │      │   cache    │
         │ - Invalidate │      │ - Show err │
         │   queries    │      └────────────┘
         │ - Show toast │
         └──────────────┘
                │
                ↓
         Component updates
         UI reflects new data
```

## 4. Cache Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CACHE LIFECYCLE                          │
└─────────────────────────────────────────────────────────────┘

Timeline (example with 5min staleTime, 10min gcTime):

0s:
┌──────────────────┐
│ Request made     │ ─── Network call made
│ Cache: EMPTY     │
└──────────────────┘

200ms:
┌──────────────────┐
│ Response arrives │ ─── Data stored in cache
│ Cache: FRESH     │ ─── isLoading = false
└──────────────────┘     Component renders

2.5 minutes:
┌──────────────────┐
│ New request made │ ─── Cache hit!
│ Cache: FRESH     │ ─── Data returned instantly
│                  │ ─── No network call
└──────────────────┘

5 minutes (staleTime expires):
┌──────────────────┐
│ New request made │ ─── Cache hit (but stale)
│ Cache: STALE     │ ─── Data returned (with warning)
│                  │ ─── Background refetch triggered
└──────────────────┘

5 minutes + 200ms:
┌──────────────────┐
│ Refetch done     │ ─── Cache updated
│ Cache: FRESH     │ ─── Component re-renders
└──────────────────┘

10 minutes (gcTime expires):
┌──────────────────┐
│ Unmount/Time out │ ─── Cache data deleted
│ Cache: EMPTY     │ ─── Memory freed
└──────────────────┘
```

## 5. Component Rendering Cycle

```
Initial Mount
        │
        ↓
┌───────────────────────────┐
│ useHealthReadings(userId) │
│ queryKey: ['health-',     │
│            'readings',    │
│            userId]        │
└────────────────┬──────────┘
                 │
                 ├─ Cache check: MISS
                 │
                 ├─ Start fetching
                 │
                 └─ Return: {
                      isLoading: true,
                      data: undefined,
                      error: null
                    }
                    │
                    ↓
          ┌─────────────────────┐
          │ Component renders:  │
          │ <Skeleton />        │
          │                     │
          │ "Loading..."        │
          └─────────────────────┘

After API response
        │
        ↓
┌───────────────────────────┐
│ Query state updated       │
│ Return: {                 │
│   isLoading: false,       │
│   data: [{...}, {...}],   │
│   error: null             │
│ }                         │
└────────────────┬──────────┘
                 │
                 ↓
         ┌──────────────────┐
         │ Component        │
         │ re-renders:      │
         │                  │
         │ {data?.map(r =>  │
         │  <Item />)}      │
         └──────────────────┘

If error occurs
        │
        ↓
┌───────────────────────────┐
│ Query state updated       │
│ Return: {                 │
│   isLoading: false,       │
│   data: undefined,        │
│   error: ApiError         │
│ }                         │
└────────────────┬──────────┘
                 │
                 ↓
         ┌──────────────────┐
         │ Component        │
         │ re-renders:      │
         │                  │
         │ <ErrorBoundary   │
         │  error={error}   │
         │ />               │
         └──────────────────┘
```

## 6. Parallel Request Deduplication

```
Scenario: Multiple components request same data

Component A              Component B              Component C
    │                        │                        │
    ├─ useHealthReadings()   │                        │
    │  at 100ms              ├─ useHealthReadings()   │
    │                        │  at 101ms              ├─ useHealthReadings()
    │                        │                        │  at 102ms
    │                        │                        │
    └─────────────┬──────────┴────────────┬───────────┘
                  │                       │
                  ↓                       ↓
        ┌──────────────────┐    ┌──────────────────┐
        │ TanStack Query   │    │ Deduplication:   │
        │ sees requests    │    │ ONLY 1 network   │
        │ to same key      │    │ call made!       │
        └──────────────────┘    └──────────────────┘
                  │
                  ↓
        ┌──────────────────┐
        │ Single request   │
        │ GET /health-...  │
        └────────────────┬─┘
                         │
                ┌────────┴────────┐
                │                 │
                ↓                 ↓
        Response shared to all 3 components
        Each component gets same data
        No redundant requests!
```

## 7. Error Handling Flow

```
User makes request
        │
        ↓
┌───────────────────┐
│  api.get()        │
│  fetch() call     │
└────────────┬──────┘
             │
      ┌──────┴──────┐
      │             │
      ↓             ↓
   Success       Failure
   (200-299)     (4xx, 5xx, network)
      │             │
      ↓             ↓
┌─────────────┐ ┌───────────────┐
│ Return data │ │ throw ApiError│
│ {id, ...}   │ │ {status: 404, │
└─────────────┘ │  message: ... │
                └────────┬──────┘
                         │
                         ↓
              ┌──────────────────┐
              │ Caught by Query  │
              │ Query.error =    │
              │ ApiError         │
              └────────┬─────────┘
                       │
                       ↓
              ┌──────────────────┐
              │ Component sees:  │
              │ {error: ApiError}│
              │                  │
              │ if (error) {     │
              │   <ErrorMsg />   │
              │ }                │
              └──────────────────┘
```

## 8. Browser Network Timeline

```
Time  Event                      Network Tab
────────────────────────────────────────────────────────────

0ms   useHealthReadings() called
      └─ Cache check: MISS

      ✓ POST health-readings
        Status: 201
        Time: 200ms
        Size: 2.5 KB

200ms Response received
      Data cached

300ms Component renders
      ✓ GET health-readings/...
        Status: 304 Not Modified
        Time: 5ms (from cache)
        Size: 0 bytes (from cache)

400ms ✓ GET health-readings/...
      Status: 304 Not Modified
      Time: 4ms (from cache)
      Size: 0 bytes (from cache)

5min  Stale time expires

5min  ✓ GET health-readings/...
      Status: 200 OK
      Time: 180ms (network)
      Size: 2.5 KB
      (Background refetch)

Total network requests: 3
- 1 POST (create)
- 1 GET (initial fetch)
- 1 GET (refetch after stale)

Cache hits: 2 (GET calls within staleTime)
Network time saved: ~500ms
```

## 9. Component Lifecycle with Queries

```
┌──────────────────────────────────────┐
│      Component Mounts                │
│  (e.g., Dashboard)                   │
└────────────────┬─────────────────────┘
                 │
                 ├─ useHealthReadings() called
                 │
                 ├─ Query created
                 │  - queryKey: ['health-readings', userId]
                 │  - Initial state: isLoading=true
                 │
                 └─ Component renders with loading state
                    │
                    ↓
         ┌──────────────────────┐
         │ Initial render       │
         │ <Skeleton />         │
         └──────────────────────┘

After API response
         │
         ├─ Query state updated
         │  - isLoading: false
         │  - data: [...]
         │
         └─ Component re-renders
            │
            ↓
         ┌──────────────────────┐
         │ Data render          │
         │ <DataList data={...} │
         │ />                   │
         └──────────────────────┘

Component stays mounted
(window focus, time passes)
         │
         ├─ Window gain focus?
         │  └─ Trigger refetch (if stale)
         │
         ├─ 5 minutes pass?
         │  └─ Data marked stale
         │  └─ Background refetch
         │
         ├─ User action?
         │  └─ Manual refetch
         │
         └─ Still rendering same data

┌──────────────────────────────────────┐
│      Component Unmounts              │
│  (e.g., navigate away)               │
└────────────────┬─────────────────────┘
                 │
                 ├─ Query listeners removed
                 │
                 ├─ Data stays in cache
                 │  (gcTime = 10 minutes)
                 │
                 ├─ After 10 minutes:
                 │  └─ Cache data deleted
                 │
                 └─ Cleanup complete
```

---

## Key Takeaways

1. **Data flows from component → hook → query → cache → API → backend**
2. **Cache checks FIRST before making network requests**
3. **Stale data keeps UI responsive while refetching in background**
4. **Request deduplication prevents multiple identical requests**
5. **Error handling is centralized in query layer**
6. **Component re-renders only when data/state changes**

For code examples, see `COMMON_PATTERNS.md`
For testing guide, see `TESTING_TANSTACK_QUERY.md`
