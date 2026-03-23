import { getTasks } from '../../api/tasks.api'
import type { ApiTask } from '../../api/types'
import type { LanguageMode } from '../settings/settingsStorage'
import { t } from '../settings/translations'
import { getPriorityLabel, resolvePriorityKey, toTaskImage } from '../tasks/taskUi'

export type TaskNotificationItem = {
  id: string
  title: string
  priority: string
  time: string
  thumbnail: string
}

const MS_PER_DAY = 1000 * 60 * 60 * 24
const MAX_NOTIFICATIONS = 5

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getDayDiff(target: Date, base: Date) {
  const targetTime = toStartOfDay(target).getTime()
  const baseTime = toStartOfDay(base).getTime()

  return Math.round((targetTime - baseTime) / MS_PER_DAY)
}

function parseDate(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

function getNotificationTime(task: ApiTask, language: LanguageMode, now: Date) {
  const dueDate = parseDate(task.dueDate)

  if (dueDate) {
    const diff = getDayDiff(dueDate, now)

    if (diff < 0) {
      const days = String(Math.abs(diff))

      return Math.abs(diff) === 1
        ? t(language, 'notifications.overdueOneDay')
        : t(language, 'notifications.overdueDays', { days })
    }

    if (diff === 0) {
      return t(language, 'notifications.dueToday')
    }

    if (diff === 1) {
      return t(language, 'notifications.dueTomorrow')
    }

    return t(language, 'notifications.dueInDays', { days: String(diff) })
  }

  if (task.status.name === 'In Progress') {
    return t(language, 'notifications.inProgress')
  }

  if (resolvePriorityKey(task.priority.name) === 'Extreme') {
    return t(language, 'notifications.highPriority')
  }

  return t(language, 'notifications.notStarted')
}

function getNotificationScore(task: ApiTask, now: Date) {
  const dueDate = parseDate(task.dueDate)
  const priority = resolvePriorityKey(task.priority.name)
  let score = 100

  if (dueDate) {
    const diff = getDayDiff(dueDate, now)

    if (diff < 0) {
      score = Math.abs(diff)
    } else if (diff === 0) {
      score = 10
    } else if (diff === 1) {
      score = 20
    } else if (diff <= 3) {
      score = 30 + diff
    } else if (diff <= 7) {
      score = 40 + diff
    } else {
      score = 60 + diff
    }
  } else if (task.status.name === 'In Progress') {
    score = 52
  } else if (priority === 'Extreme') {
    score = 56
  } else if (priority === 'Moderate') {
    score = 70
  }

  if (priority === 'Extreme') {
    score -= 3
  }

  if (priority === 'Low') {
    score += 4
  }

  return score
}

function byUrgency(a: ApiTask, b: ApiTask, now: Date) {
  const scoreDiff = getNotificationScore(a, now) - getNotificationScore(b, now)

  if (scoreDiff !== 0) {
    return scoreDiff
  }

  const dueA = parseDate(a.dueDate)
  const dueB = parseDate(b.dueDate)

  if (dueA && dueB) {
    const dueDiff = dueA.getTime() - dueB.getTime()

    if (dueDiff !== 0) {
      return dueDiff
    }
  }

  if (dueA) {
    return -1
  }

  if (dueB) {
    return 1
  }

  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}

export function buildTaskNotifications(
  tasks: ApiTask[],
  language: LanguageMode,
  now = new Date(),
) {
  return tasks
    .filter((task) => task.status.name !== 'Completed')
    .sort((left, right) => byUrgency(left, right, now))
    .slice(0, MAX_NOTIFICATIONS)
    .map<TaskNotificationItem>((task) => ({
      id: task.id,
      title: task.title,
      priority: getPriorityLabel(task.priority.name, language),
      time: getNotificationTime(task, language, now),
      thumbnail: task.imageUrl
        ? `center / cover no-repeat url(${task.imageUrl})`
        : toTaskImage(task),
    }))
}

export async function loadTaskNotifications(language: LanguageMode) {
  const { tasks } = await getTasks()

  return buildTaskNotifications(tasks, language)
}
