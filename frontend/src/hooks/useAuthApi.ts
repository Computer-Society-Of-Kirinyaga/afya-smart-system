import { api } from '@/lib/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '@/lib/api.types'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      return api.post<LoginResponse>('/auth/login', data)
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return api.post<LoginResponse>('/auth/register', data)
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      return api.post<{ message: string }>('/auth/logout', {})
    },
  })
}
