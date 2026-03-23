import type { ApiTask } from '../../api/types'
import type { PriorityKey, TaskFormState } from '../task-form/TaskFormModal'

export const priorityMeta: Record<
  PriorityKey,
  { textColor: string; dotColor: string; thumbnail: string }
> = {
  Extreme: {
    textColor: '#FF6B61',
    dotColor: '#FF5B5B',
    thumbnail:
      'linear-gradient(145deg, #3a2d34 0%, #1b1d2d 52%, #b8724d 100%)',
  },
  Moderate: {
    textColor: '#7CB3FF',
    dotColor: '#7CB3FF',
    thumbnail:
      'linear-gradient(145deg, #20243a 0%, #101522 46%, #5873a5 100%)',
  },
  Low: {
    textColor: '#68B84B',
    dotColor: '#68B84B',
    thumbnail:
      'linear-gradient(145deg, #62543f 0%, #94805d 42%, #6f8d49 100%)',
  },
}

const statusColorMap: Record<string, string> = {
  Completed: '#57AE35',
  'In Progress': '#4A5CFF',
  'Not Started': '#FF5B5B',
}

export function resolvePriorityKey(value: string): PriorityKey {
  if (value === 'Extreme' || value === 'Moderate' || value === 'Low') {
    return value
  }

  return 'Moderate'
}

export function getPriorityVisual(priorityName: string) {
  return priorityMeta[resolvePriorityKey(priorityName)]
}

export function getStatusColor(statusName: string) {
  return statusColorMap[statusName] ?? '#FF5B5B'
}

export function formatDisplayDate(value?: string | null) {
  if (!value) {
    return 'Not set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat('en-GB').format(date)
}

export function formatDateInput(value?: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}

export function toTaskImage(task: ApiTask) {
  if (task.imageUrl) {
    return task.imageUrl
  }

  return getPriorityVisual(task.priority.name).thumbnail
}

export function toTaskFormState(task: ApiTask): TaskFormState {
  return {
    title: task.title,
    date: formatDateInput(task.dueDate),
    priority: resolvePriorityKey(task.priority.name),
    description: task.description,
    imagePreview: task.imageUrl ?? '',
    imageName: '',
  }
}
