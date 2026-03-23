import { apiClient } from './apiClient'
import type { ApiUser, UpdateCurrentUserPayload } from './types'

export function updateCurrentUser(payload: UpdateCurrentUserPayload) {
  return apiClient<{ user: ApiUser }>('/users/me', {
    method: 'PATCH',
    body: payload,
  })
}
