import { apiClient } from './apiClient'
import type {
  ApiTask,
  CreateTaskPayload,
  ListTasksParams,
  UpdateTaskPayload,
} from './types'

function buildQuery(params?: ListTasksParams) {
  const searchParams = new URLSearchParams()

  if (!params) {
    return ''
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function getTasks(params?: ListTasksParams) {
  return apiClient<{ tasks: ApiTask[] }>(`/tasks${buildQuery(params)}`)
}

export function getTask(taskId: string) {
  return apiClient<{ task: ApiTask }>(`/tasks/${taskId}`)
}

export function createTask(payload: CreateTaskPayload) {
  return apiClient<{ task: ApiTask }>('/tasks', {
    method: 'POST',
    body: payload,
  })
}

export function updateTask(taskId: string, payload: UpdateTaskPayload) {
  return apiClient<{ task: ApiTask }>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteTask(taskId: string) {
  return apiClient<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}
