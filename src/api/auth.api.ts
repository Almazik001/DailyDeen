import { apiClient } from './apiClient'
import type { AuthResponse, LoginPayload, RegisterPayload } from './types'

export function register(payload: RegisterPayload) {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function login(payload: LoginPayload) {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function getCurrentUser() {
  return apiClient<{ user: AuthResponse['user'] }>('/auth/me')
}
