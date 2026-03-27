import { api } from '@/lib/api'
import type { CreateUserInput, User } from '@/lib/api.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const USERS_QUERY_KEY = 'users'

// Fetch a single user by ID
export function useUser(userId: string) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, userId],
    queryFn: () => api.get<User>(`/users/${userId}`),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create a new user
export function useRegisterUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserInput) =>
      api.post<User>('/users/register', data),
    onSuccess: (newUser) => {
      queryClient.setQueryData([USERS_QUERY_KEY, newUser.id], newUser)
    },
  })
}

// Update user doctor information
export function useUpdateUserDoctor(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { doctor_name: string; doctor_phone_number: string }) =>
      api.patch<User>(`/users/${userId}/doctor`, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([USERS_QUERY_KEY, userId], updatedUser)
    },
  })
}

// Update user alert preferences
export function useUpdateUserPreferences(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (preferences: Record<string, unknown>) =>
      api.patch<User>(`/users/${userId}/preferences`, preferences),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData([USERS_QUERY_KEY, userId], updatedUser)
    },
  })
}
