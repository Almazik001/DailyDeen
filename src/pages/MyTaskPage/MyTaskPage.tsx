import { useEffect, useMemo, useState } from 'react'
import type { ApiTask } from '../../api/types'
import { getApiErrorMessage } from '../../api/apiClient'
import type { LanguageMode } from '../../features/settings/settingsStorage'
import { t } from '../../features/settings/translations'
import TaskFormModal, {
  type TaskFormState,
} from '../../features/task-form/TaskFormModal'
import {
  deleteTaskById,
  getTasksByCategory,
  updateTaskStatus,
  updateTaskFromForm,
} from '../../features/tasks/taskData'
import {
  formatDisplayDate,
  getPriorityLabel,
  getPriorityVisual,
  getStatusLabel,
  getStatusColor,
  getTaskDescriptionText,
  priorityMeta,
  statusMeta,
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m5.5 10.2 2.7 2.7 6.3-6.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type MyTaskPageProps = {
  language: LanguageMode
}

const MyTaskPage = ({ language }: MyTaskPageProps) => {
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const nextTasks = await getTasksByCategory('My Tasks')
        setTasks(nextTasks)
        setSelectedTaskId(nextTasks[0]?.id ?? null)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, t(language, 'task.loadError')))
      }
    }

    void loadTasks()
  }, [language])

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks],
  )
  const isSelectedTaskCompleted = selectedTask?.status.name === 'Completed'
  const isCompletingSelectedTask =
    selectedTask !== null && completingTaskId === selectedTask.id

  const handleEditTask = (task: ApiTask) => {
    if (import.meta.env.DEV) {
      console.log('[MyTaskPage] edit task click', task)
    }

    setSelectedTaskId(task.id)
    setIsEditModalOpen(true)
  }

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
      setErrorMessage(getApiErrorMessage(error, t(language, 'task.updateError')))
    }
  }

  const handleCompleteTask = async () => {
    if (!selectedTask || isSelectedTaskCompleted) {
      return
    }

    setCompletingTaskId(selectedTask.id)
    setErrorMessage('')

    try {
      const updatedTask = await updateTaskStatus(selectedTask, 'Completed')

      setTasks((current) =>
        current.map((task) => (task.id === selectedTask.id ? updatedTask : task)),
      )
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t(language, 'task.completeError')))
    } finally {
      setCompletingTaskId(null)
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
      setErrorMessage(getApiErrorMessage(error, t(language, 'task.deleteError')))
    }
  }

  if (!selectedTask) {
    return (
      <div className="my-task-layout">
        <section className="dashboard-panel my-task-panel my-task-list-panel">
          <h2 className="section-title">{t(language, 'sidebar.my-task')}</h2>
          <p>{errorMessage || t(language, 'task.noTasksCategory')}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="my-task-layout">
      <section className="dashboard-panel my-task-panel my-task-list-panel">
        <h2 className="section-title">{t(language, 'sidebar.my-task')}</h2>

        {errorMessage ? <p>{errorMessage}</p> : null}

        <div className="my-task-list">
          {tasks.map((task) => (
            <button
              key={task.id}
              className={`my-task-card${selectedTask.id === task.id ? ' is-active' : ''}`}
              type="button"
              onClick={() => {
                handleEditTask(task)
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
                    <p className="my-task-card__description">
                      {getTaskDescriptionText(task.description, language)}
                    </p>
                  </div>
                </div>

                <div className="my-task-card__footer">
                  <span>
                    {t(language, 'task.priority')}: {' '}
                    <strong style={{ color: getPriorityVisual(task.priority.name).textColor }}>
                      {getPriorityLabel(task.priority.name, language)}
                    </strong>
                  </span>
                  <span>
                    {t(language, 'task.status')}: {' '}
                    <strong style={{ color: getStatusColor(task.status.name) }}>
                      {getStatusLabel(task.status.name, language)}
                    </strong>
                  </span>
                  <span>
                    {t(language, 'task.createdOn')}: {formatDisplayDate(task.createdAt, language)}
                  </span>
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
              {t(language, 'task.priority')}: {' '}
              <strong style={{ color: getPriorityVisual(selectedTask.priority.name).textColor }}>
                {getPriorityLabel(selectedTask.priority.name, language)}
              </strong>
            </p>
            <p>
              {t(language, 'task.status')}: {' '}
              <strong style={{ color: getStatusColor(selectedTask.status.name) }}>
                {getStatusLabel(selectedTask.status.name, language)}
              </strong>
            </p>
            <span>
              {t(language, 'task.createdOn')}: {formatDisplayDate(selectedTask.createdAt, language)}
            </span>
          </div>
        </div>

        <div className="my-task-detail__body">
          <p>
            <strong>{t(language, 'task.title')}:</strong> {selectedTask.title}.
          </p>
          <p>
            <strong>{t(language, 'task.objective')}:</strong>{' '}
            {getTaskDescriptionText(selectedTask.description, language)}
          </p>
          <div>
            <p>
              <strong>{t(language, 'task.description')}:</strong>
            </p>
            <div className="my-task-detail__paragraphs">
              <p>{getTaskDescriptionText(selectedTask.description, language)}</p>
            </div>
          </div>
          <div>
            <p>
              <strong>{t(language, 'task.additionalNotes')}:</strong>
            </p>
            <ul className="my-task-detail__notes">
              <li>{t(language, 'task.category')}: {selectedTask.category.name}</li>
              <li>
                {t(language, 'task.priority')}: {getPriorityLabel(selectedTask.priority.name, language)}
              </li>
              <li>
                {t(language, 'task.deadline')}: {formatDisplayDate(selectedTask.dueDate, language)}
              </li>
            </ul>
          </div>
          <p>
            <strong>{t(language, 'task.deadlineSubmission')}:</strong>{' '}
            {formatDisplayDate(selectedTask.dueDate, language)}
          </p>
        </div>

        <div className="my-task-detail__actions">
          <button
            className={`my-task-detail__action my-task-detail__action--complete${
              isSelectedTaskCompleted ? ' is-disabled' : ''
            }`}
            type="button"
            disabled={isSelectedTaskCompleted || isCompletingSelectedTask}
            onClick={() => {
              void handleCompleteTask()
            }}
          >
            <CheckIcon />
            <span className="my-task-detail__action-label">
              {isSelectedTaskCompleted
                ? t(language, 'task.completed')
                : isCompletingSelectedTask
                  ? t(language, 'task.completing')
                  : t(language, 'task.markCompleted')}
            </span>
          </button>
          <button
            className="my-task-detail__action my-task-detail__action--icon my-task-detail__action--danger"
            type="button"
            aria-label={t(language, 'task.deleteTask')}
            disabled={isCompletingSelectedTask}
            onClick={() => {
              void handleDeleteTask()
            }}
          >
            <TrashIcon />
          </button>
          <button
            className="my-task-detail__action my-task-detail__action--icon"
            type="button"
            aria-label={t(language, 'task.editTask')}
            disabled={isCompletingSelectedTask}
            onClick={() => {
              handleEditTask(selectedTask)
            }}
          >
            <EditIcon />
          </button>
        </div>
      </section>

      {isEditModalOpen && selectedTask ? (
        <TaskFormModal
          isOpen={isEditModalOpen}
          language={language}
          mode="edit"
          initialState={toTaskFormState(selectedTask)}
          priorityMeta={priorityMeta}
          statusMeta={statusMeta}
          onClose={() => {
            setIsEditModalOpen(false)
          }}
          onSubmit={handleEditSubmit}
        />
      ) : null}
    </div>
  )
}

export default MyTaskPage
