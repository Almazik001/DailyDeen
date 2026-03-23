import type { ApiTask } from '../../api/types'
import { getAllTasks } from './taskData'

export type DashboardStatusItem = {
  label: string
  count: number
  value: number
  color: string
}

const statusColors: Record<string, string> = {
  Completed: '#57AE35',
  'In Progress': '#4A47F5',
  'Not Started': '#E04B3F',
}

function calculateStatusPercentage(total: number, matching: number) {
  if (total === 0) {
    return 0
  }

  return Math.round((matching / total) * 100)
}

export async function loadDashboardData() {
  const { tasks } = await getAllTasks()
  const total = tasks.length

  const statusSummary: DashboardStatusItem[] = ['Completed', 'In Progress', 'Not Started'].map(
    (statusName) => {
      const count = tasks.filter((task) => task.status.name === statusName).length

      return {
        label: statusName,
        count,
        value: calculateStatusPercentage(total, count),
        color: statusColors[statusName],
      }
    },
  )

  const completedTasks = tasks
    .filter((task) => task.status.name === 'Completed')
    .slice(0, 2)

  return {
    completedTasks,
    statusSummary,
    totalTasks: total,
  }
}

export function getCompletedAgoLabel(task: ApiTask) {
  const date = new Date(task.updatedAt)

  if (Number.isNaN(date.getTime())) {
    return 'Completed recently.'
  }

  const diffInMs = Date.now() - date.getTime()
  const diffInDays = Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60 * 24)))

  if (diffInDays === 0) {
    return 'Completed today.'
  }

  if (diffInDays === 1) {
    return 'Completed 1 day ago.'
  }

  return `Completed ${diffInDays} days ago.`
}
