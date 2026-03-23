import { apiClient } from './apiClient'
import type { LookupItem } from './types'

export function getCategories() {
  return apiClient<{ categories: LookupItem[] }>('/categories')
}

export function createCategory(name: string) {
  return apiClient<{ category: LookupItem }>('/categories', {
    method: 'POST',
    body: { name },
  })
}

export function updateCategory(categoryId: string, name: string) {
  return apiClient<{ category: LookupItem }>(`/categories/${categoryId}`, {
    method: 'PATCH',
    body: { name },
  })
}

export function deleteCategory(categoryId: string) {
  return apiClient<void>(`/categories/${categoryId}`, {
    method: 'DELETE',
  })
}
