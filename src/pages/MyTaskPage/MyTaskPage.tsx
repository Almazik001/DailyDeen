import { useEffect, useMemo, useState } from 'react'
import type { ApiTask } from '../../api/types'
import { getApiErrorMessage } from '../../api/apiClient'
import TaskFormModal, {
  type TaskFormState,
} from '../../features/task-form/TaskFormModal'
import {
  deleteTaskById,
  getTasksByCategory,
  updateTaskFromForm,
} from '../../features/tasks/taskData'
import {
  formatDisplayDate,
  getPriorityVisual,
  getStatusColor,
  priorityMeta,
  toTaskFormState,
  toTaskImage,
} from '../../features/tasks/taskUi'

function OverflowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="task-card__menu"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5.5 6.5v7.8c0 .9.7 1.7 1.7 1.7h5.6c.9 0 1.7-.8 1.7-1.7V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 5h12M7.5 5V3.8c0-.4.3-.8.8-.8h3.4c.4 0 .8.4.8.8V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 9v4M11.5 9v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m4 13.7 8.9-8.9a1.8 1.8 0 0 1 2.5 0l.8.8a1.8 1.8 0 0 1 0 2.5L7.3 17H4v-3.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 6.2 14 8.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

const emptyTaskFormState: TaskFormState = {
  title: '',
  date: '',
  priority: 'Moderate',
  description: '',
  imagePreview: '',
  imageName: '',
}

const MyTaskPage = () => {
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const nextTasks = await getTasksByCategory('My Tasks')
        setTasks(nextTasks)
        setSelectedTaskId(nextTasks[0]?.id ?? null)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, 'Unable to load tasks'))
      }
    }

    void loadTasks()
  }, [])

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks],
  )

  const handleEditSubmit = async (formState: TaskFormState) => {
    if (!selectedTask) {
      return
    }

    try {
      const updatedTask = await updateTaskFromForm(selectedTask, formState)

      setTasks((current) =>
        current.map((task) => (task.id === selectedTask.id ? updatedTask : task)),
      )

      setIsEditModalOpen(false)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to update task'))
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) {
      return
    }

    const currentIndex = tasks.findIndex((task) => task.id === selectedTask.id)

    try {
      await deleteTaskById(selectedTask.id)
      const remainingTasks = tasks.filter((task) => task.id !== selectedTask.id)
      const nextTask =
        remainingTasks[currentIndex] ??
        remainingTasks[currentIndex - 1] ??
        remainingTasks[0] ??
        null

      setTasks(remainingTasks)
      setSelectedTaskId(nextTask?.id ?? null)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to delete task'))
    }
  }

  if (!selectedTask) {
    return (
      <div className="my-task-layout">
        <section className="dashboard-panel my-task-panel my-task-list-panel">
          <h2 className="section-title">My Tasks</h2>
          <p>{errorMessage || 'No tasks yet in this category.'}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="my-task-layout">
      <section className="dashboard-panel my-task-panel my-task-list-panel">
        <h2 className="section-title">My Tasks</h2>

        {errorMessage ? <p>{errorMessage}</p> : null}

        <div className="my-task-list">
          {tasks.map((task) => (
            <button
              key={task.id}
              className={`my-task-card${selectedTask.id === task.id ? ' is-active' : ''}`}
              type="button"
              onClick={() => {
                setSelectedTaskId(task.id)
              }}
            >
              <OverflowIcon />
              <div className="my-task-card__content">
                <div className="my-task-card__title-row">
                  <span
                    className="task-card__indicator"
                    aria-hidden="true"
                    style={{ borderColor: getStatusColor(task.status.name) }}
                  />
                  <div>
                    <h3 className="my-task-card__title">{task.title}</h3>
                    <p className="my-task-card__description">{task.description}</p>
                  </div>
                </div>

                <div className="my-task-card__footer">
                  <span>
                    Priority:{' '}
                    <strong style={{ color: getPriorityVisual(task.priority.name).textColor }}>
                      {task.priority.name}
                    </strong>
                  </span>
                  <span>
                    Status:{' '}
                    <strong style={{ color: getStatusColor(task.status.name) }}>
                      {task.status.name}
                    </strong>
                  </span>
                  <span>Created on: {formatDisplayDate(task.createdAt)}</span>
                </div>
              </div>

              <div
                className="my-task-card__thumb"
                aria-hidden="true"
                style={{
                  background: task.imageUrl
                    ? `center / cover no-repeat url(${task.imageUrl})`
                    : toTaskImage(task),
                }}
              />
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-panel my-task-panel my-task-detail-panel">
        <div className="my-task-detail__hero">
          <div
            className="my-task-detail__image"
            aria-hidden="true"
            style={{
              background: selectedTask.imageUrl
                ? `center / cover no-repeat url(${selectedTask.imageUrl})`
                : toTaskImage(selectedTask),
            }}
          />

          <div className="my-task-detail__summary">
            <h2>{selectedTask.title}</h2>
            <p>
              Priority:{' '}
              <strong style={{ color: getPriorityVisual(selectedTask.priority.name).textColor }}>
                {selectedTask.priority.name}
              </strong>
            </p>
            <p>
              Status:{' '}
              <strong style={{ color: getStatusColor(selectedTask.status.name) }}>
                {selectedTask.status.name}
              </strong>
            </p>
            <span>Created on: {formatDisplayDate(selectedTask.createdAt)}</span>
          </div>
        </div>

        <div className="my-task-detail__body">
          <p>
            <strong>Task Title:</strong> {selectedTask.title}.
          </p>
          <p>
            <strong>Objective:</strong> {selectedTask.description}
          </p>
          <div>
            <p>
              <strong>Task Description:</strong>
            </p>
            <div className="my-task-detail__paragraphs">
              <p>{selectedTask.description}</p>
            </div>
          </div>
          <div>
            <p>
              <strong>Additional Notes:</strong>
            </p>
            <ul className="my-task-detail__notes">
              <li>Category: {selectedTask.category.name}</li>
              <li>Priority: {selectedTask.priority.name}</li>
              <li>Deadline: {formatDisplayDate(selectedTask.dueDate)}</li>
            </ul>
          </div>
          <p>
            <strong>Deadline for Submission:</strong> {formatDisplayDate(selectedTask.dueDate)}
          </p>
        </div>

        <div className="my-task-detail__actions">
          <button
            className="my-task-detail__action"
            type="button"
            aria-label="Delete task"
            onClick={() => {
              void handleDeleteTask()
            }}
          >
            <TrashIcon />
          </button>
          <button
            className="my-task-detail__action"
            type="button"
            aria-label="Edit task"
            onClick={() => {
              setIsEditModalOpen(true)
            }}
          >
            <EditIcon />
          </button>
        </div>
      </section>

      <TaskFormModal
        isOpen={isEditModalOpen}
        mode="edit"
        initialState={selectedTask ? toTaskFormState(selectedTask) : emptyTaskFormState}
        priorityMeta={priorityMeta}
        onClose={() => {
          setIsEditModalOpen(false)
        }}
        onSubmit={handleEditSubmit}
      />
    </div>
  )
}

export default MyTaskPage
