import type { ApiTask } from '../../api/types'
import { parseCalendarValue } from '../calendar/calendarUtils'
import type { LanguageMode } from '../settings/settingsStorage'
import { t } from '../settings/translations'
import type {
  PriorityKey,
  StatusKey,
  TaskFormState,
} from '../task-form/TaskFormModal'

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

export const statusMeta: Record<
  StatusKey,
  { textColor: string; dotColor: string }
> = {
  Completed: {
    textColor: '#57AE35',
    dotColor: '#57AE35',
  },
  'In Progress': {
    textColor: '#4A5CFF',
    dotColor: '#4A5CFF',
  },
  'Not Started': {
    textColor: '#FF5B5B',
    dotColor: '#FF5B5B',
  },
}

const statusColorMap: Record<string, string> = {
  Completed: '#57AE35',
  'In Progress': '#4A5CFF',
  'Not Started': '#FF5B5B',
}

const localeMap: Record<LanguageMode, string> = {
  english: 'en-GB',
  russian: 'ru-RU',
  kazakh: 'kk-KZ',
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

export function getPriorityLabel(priorityName: string, language: LanguageMode) {
  const key = resolvePriorityKey(priorityName)

  if (key === 'Extreme') {
    return t(language, 'task.priority.extreme')
  }

  if (key === 'Low') {
    return t(language, 'task.priority.low')
  }

  return t(language, 'task.priority.moderate')
}

export function resolveStatusKey(value: string): StatusKey {
  if (value === 'Completed' || value === 'In Progress' || value === 'Not Started') {
    return value
  }

  return 'Not Started'
}

export function getStatusColor(statusName: string) {
  return statusColorMap[statusName] ?? '#FF5B5B'
}

export function getStatusLabel(statusName: string, language: LanguageMode) {
  const key = resolveStatusKey(statusName)

  if (key === 'Completed') {
    return t(language, 'task.status.completed')
  }

  if (key === 'In Progress') {
    return t(language, 'task.status.inProgress')
  }

  return t(language, 'task.status.notStarted')
}

const defaultTaskDescription = 'Task description will be added later.'

export function getTaskDescriptionText(
  description: string | null | undefined,
  language: LanguageMode,
) {
  const normalized = description?.trim() ?? ''

  if (!normalized || normalized === defaultTaskDescription) {
    return t(language, 'task.descriptionPending')
  }

  return normalized
}

export function formatDisplayDate(
  value?: string | null,
  language: LanguageMode = 'english',
) {
  if (!value) {
    return t(language, 'common.none')
  }

  const date = parseCalendarValue(value) ?? new Date(value)

  if (Number.isNaN(date.getTime())) {
    return t(language, 'common.none')
  }

  return new Intl.DateTimeFormat(localeMap[language]).format(date)
}

export function formatDateInput(value?: string | null) {
  if (!value) {
    return ''
  }

  const date = parseCalendarValue(value) ?? new Date(value)

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
    status: resolveStatusKey(task.status.name),
    description: task.description,
    imagePreview: task.imageUrl ?? '',
    imageName: '',
  }
}
