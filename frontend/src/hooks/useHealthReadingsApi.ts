import { api } from '@/lib/api';
import type { CreateHealthReadingInput, HealthReading } from '@/lib/api.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const HEALTH_READINGS_QUERY_KEY = 'health-readings';

// Fetch latest health reading for a user
export function useLatestHealthReading(userId: string) {
  return useQuery({
    queryKey: [HEALTH_READINGS_QUERY_KEY, 'latest', userId],
    queryFn: () => api.get<HealthReading>(`/health-readings/latest-health/${userId}`),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Fetch all health readings for a user
export function useHealthReadings(userId: string) {
  return useQuery({
    queryKey: [HEALTH_READINGS_QUERY_KEY, 'all', userId],
    queryFn: () => api.get<HealthReading[]>(`/health-readings/health-reading/${userId}`),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch aggregated readings for a user
export function useAggregatedHealthReadings(userId: string) {
  return useQuery({
    queryKey: [HEALTH_READINGS_QUERY_KEY, 'aggregated', userId],
    queryFn: () => api.get<Record<string, unknown>>(`/health-readings/latest-health/${userId}`),
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Create a new health reading
export function useCreateHealthReading() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHealthReadingInput) =>
      api.post<HealthReading>('/health-readings', data),
    onSuccess: (newReading) => {
      // Invalidate all health reading queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: [HEALTH_READINGS_QUERY_KEY],
      });

      // Optionally update the cache immediately
      queryClient.setQueryData(
        [HEALTH_READINGS_QUERY_KEY, 'latest', newReading.user_id],
        newReading
      );
    },
  });
}
