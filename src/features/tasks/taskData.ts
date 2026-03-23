import { deleteTask, getTasks, createTask, updateTask } from '../../api/tasks.api'
import type { ApiTask } from '../../api/types'
import type { TaskFormState } from '../task-form/TaskFormModal'
import { findLookupByName, loadTaskLookups } from './taskLookups'

export async function getTasksByCategory(categoryName: string) {
  const { tasks } = await getTasks({ categoryName })
  return tasks
}

function getTaskDescription(description: string) {
  const normalized = description.trim()
  return normalized || 'Task description will be added later.'
}

function getTaskImageUrl(imagePreview: string) {
  const normalized = imagePreview.trim()
  return normalized || null
}

export async function createTaskForCategory(
  categoryName: string,
  formState: TaskFormState,
) {
  const lookups = await loadTaskLookups()
  const category = findLookupByName(lookups.categories, categoryName)
  const status = findLookupByName(lookups.statuses, formState.status)
  const priority = findLookupByName(lookups.priorities, formState.priority)

  if (!category || !status || !priority) {
    throw new Error('Task lookups are not configured in the database')
  }

  const { task } = await createTask({
    title: formState.title.trim(),
    description: getTaskDescription(formState.description),
    categoryId: category.id,
    statusId: status.id,
    priorityId: priority.id,
    dueDate: formState.date || null,
    imageUrl: getTaskImageUrl(formState.imagePreview),
  })

  return task
}

export async function updateTaskFromForm(task: ApiTask, formState: TaskFormState) {
  const lookups = await loadTaskLookups()
  const priority = findLookupByName(lookups.priorities, formState.priority)
  const status = findLookupByName(lookups.statuses, formState.status)

  if (!priority || !status) {
    throw new Error('Task priorities or statuses are not configured in the database')
  }

  const { task: updatedTask } = await updateTask(task.id, {
    title: formState.title.trim(),
    description: getTaskDescription(formState.description),
    categoryId: task.category.id,
    statusId: status.id,
    priorityId: priority.id,
    dueDate: formState.date || null,
    imageUrl: getTaskImageUrl(formState.imagePreview),
  })

  return updatedTask
}

export async function updateTaskStatus(task: ApiTask, statusName: string) {
  const lookups = await loadTaskLookups()
  const status = findLookupByName(lookups.statuses, statusName)

  if (!status) {
    throw new Error('Task statuses are not configured in the database')
  }

  const { task: updatedTask } = await updateTask(task.id, {
    statusId: status.id,
  })

  return updatedTask
}

export function deleteTaskById(taskId: string) {
  return deleteTask(taskId)
}

export function getAllTasks() {
  return getTasks()
}

export function getTaskById(taskId: string) {
  return getTasks().then(({ tasks }) => tasks.find((task) => task.id === taskId) ?? null)
}
