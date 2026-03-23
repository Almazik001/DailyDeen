import { getCategories } from '../../api/categories.api'
import { getPriorities } from '../../api/priorities.api'
import { getStatuses } from '../../api/statuses.api'
import type { LookupItem } from '../../api/types'

export type TaskLookups = {
  categories: LookupItem[]
  statuses: LookupItem[]
  priorities: LookupItem[]
}

let taskLookupsCache: TaskLookups | null = null

export async function loadTaskLookups(force = false) {
  if (taskLookupsCache && !force) {
    return taskLookupsCache
  }

  const [{ categories }, { statuses }, { priorities }] = await Promise.all([
    getCategories(),
    getStatuses(),
    getPriorities(),
  ])

  taskLookupsCache = {
    categories,
    statuses,
    priorities,
  }

  return taskLookupsCache
}

export function clearTaskLookupsCache() {
  taskLookupsCache = null
}

export function findLookupByName(items: LookupItem[], name: string) {
  return items.find((item) => item.name.toLowerCase() === name.toLowerCase()) ?? null
}
