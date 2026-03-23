import { apiClient } from './apiClient'
import type { LookupItem } from './types'

export function getPriorities() {
  return apiClient<{ priorities: LookupItem[] }>('/priorities')
}

export function createPriority(name: string) {
  return apiClient<{ priority: LookupItem }>('/priorities', {
    method: 'POST',
    body: { name },
  })
}

export function updatePriority(priorityId: string, name: string) {
  return apiClient<{ priority: LookupItem }>(`/priorities/${priorityId}`, {
    method: 'PATCH',
    body: { name },
  })
}

export function deletePriority(priorityId: string) {
  return apiClient<void>(`/priorities/${priorityId}`, {
    method: 'DELETE',
  })
}
