import { apiClient } from './apiClient'
import type { LookupItem } from './types'

export function getStatuses() {
  return apiClient<{ statuses: LookupItem[] }>('/statuses')
}

export function createStatus(name: string) {
  return apiClient<{ status: LookupItem }>('/statuses', {
    method: 'POST',
    body: { name },
  })
}

export function updateStatus(statusId: string, name: string) {
  return apiClient<{ status: LookupItem }>(`/statuses/${statusId}`, {
    method: 'PATCH',
    body: { name },
  })
}

export function deleteStatus(statusId: string) {
  return apiClient<void>(`/statuses/${statusId}`, {
    method: 'DELETE',
  })
}
