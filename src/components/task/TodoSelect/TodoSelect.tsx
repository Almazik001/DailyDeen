import { useEffect, useMemo, useState } from 'react'
import type { ApiTask } from '../../../api/types'
import { getApiErrorMessage } from '../../../api/apiClient'
import type { LanguageMode } from '../../../features/settings/settingsStorage'
import { t } from '../../../features/settings/translations'
import TaskFormModal, {
  type TaskFormState,
} from '../../../features/task-form/TaskFormModal'
import {
  createTaskForCategory,
  getTasksByCategory,
  updateTaskFromForm,
} from '../../../features/tasks/taskData'
import {
  formatDisplayDate,
  getPriorityLabel,
  getStatusLabel,
  getPriorityVisual,
  getStatusColor,
  priorityMeta,
  statusMeta,
  toTaskFormState,
  toTaskImage,
} from '../../../features/tasks/taskUi'
import './TodoSelect.module.scss'

const initialFormState: TaskFormState = {
  title: '',
  date: '',
  priority: 'Moderate',
  status: 'Not Started',
  description: '',
  imagePreview: '',
  imageName: '',
}

function TodoPanelIcon() {
  return (
    <svg
      aria-hidden="true"
      className="panel-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 4.5h8" />
      <path d="M8.5 3h3a1.5 1.5 0 0 1 1.5 1.5V6H7V4.5A1.5 1.5 0 0 1 8.5 3Z" />
      <path d="M7 6H5.5A1.5 1.5 0 0 0 4 7.5v11A1.5 1.5 0 0 0 5.5 20H14" />
      <path d="M13 6h1.5A1.5 1.5 0 0 1 16 7.5V11" />
      <path d="m15 16 2 2 4-5" />
    </svg>
  )
}

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

function getCurrentDayLabel(language: LanguageMode) {
  const date = new Date()
  const locale = language === 'russian' ? 'ru-RU' : language === 'kazakh' ? 'kk-KZ' : 'en-GB'

  return {
    day: new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
    }).format(date),
    caption: t(language, 'common.today'),
  }
}

type TodoSelectProps = {
  language: LanguageMode
}

const TodoSelect = ({ language }: TodoSelectProps) => {
  const [tasks, setTasks] = useState<ApiTask[]>([])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadTodoTasks = async () => {
      try {
        setTasks(await getTasksByCategory('To-Do'))
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, t(language, 'task.loadError')))
      }
    }

    void loadTodoTasks()
  }, [language])

  const closeModal = () => {
    setIsTaskFormOpen(false)
    setEditingTaskId(null)
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingTaskId(null)
    setIsTaskFormOpen(true)
  }

  const handleEditTask = (task: ApiTask) => {
    if (import.meta.env.DEV) {
      console.log('[TodoSelect] edit task click', task)
    }

    setModalMode('edit')
    setEditingTaskId(task.id)
    setIsTaskFormOpen(true)
  }

  const editingTask =
    tasks.find((task) => task.id === editingTaskId) ?? null

  const initialModalState = useMemo(
    () =>
      modalMode === 'edit' && editingTask
        ? toTaskFormState(editingTask)
        : initialFormState,
    [editingTask, modalMode],
  )

  const handleTaskFormSubmit = async (formState: TaskFormState) => {
    try {
      if (modalMode === 'edit' && editingTask) {
        const updatedTask = await updateTaskFromForm(editingTask, formState)

        setTasks((current) =>
          current.map((task) => (task.id === editingTask.id ? updatedTask : task)),
        )
        closeModal()
        return
      }

      const newTask = await createTaskForCategory('To-Do', formState)
      setTasks((current) => [newTask, ...current])
      closeModal()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t(language, 'task.saveError')))
    }
  }

  const currentDate = getCurrentDayLabel(language)

  return (
    <>
      <section className="dashboard-panel todo-panel">
        <div className="panel-head">
          <div className="panel-title">
            <TodoPanelIcon />
            <h2>{t(language, 'dashboard.todoTitle')}</h2>
          </div>
          <button className="panel-action" type="button" onClick={openCreateModal}>
            <span>+</span>
            {t(language, 'dashboard.addTask')}
          </button>
        </div>

        <div className="panel-date">
          <strong>{currentDate.day}</strong>
          <span className="panel-date__divider" />
          <span>{currentDate.caption}</span>
        </div>

        {errorMessage ? <p>{errorMessage}</p> : null}

        <div className="todo-list">
          {tasks.map((task) => (
            <article
              className="task-card task-card--todo"
              key={task.id}
              role="button"
              tabIndex={0}
              aria-label={`${t(language, 'task.editTask')}: ${task.title}`}
              onClick={() => {
                handleEditTask(task)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleEditTask(task)
                }
              }}
            >
              <button
                className="task-card__menu-button"
                type="button"
                aria-label={`${t(language, 'task.editTask')}: ${task.title}`}
                onClick={(event) => {
                  event.stopPropagation()
                  handleEditTask(task)
                }}
              >
                <OverflowIcon />
              </button>

              <div className="task-card__content">
                <div className="task-card__eyebrow">
                  <span
                    className="task-card__badge"
                    style={{
                      backgroundColor: `${getStatusColor(task.status.name)}18`,
                      color: getStatusColor(task.status.name),
                    }}
                  >
                    {getStatusLabel(task.status.name, language)}
                  </span>
                  <span
                    className="task-card__badge task-card__badge--priority"
                    style={{
                      backgroundColor: `${getPriorityVisual(task.priority.name).textColor}18`,
                      color: getPriorityVisual(task.priority.name).textColor,
                    }}
                  >
                    {t(language, 'task.priorityBadge', {
                      priority: getPriorityLabel(task.priority.name, language),
                    })}
                  </span>
                </div>

                <h3 className="task-card__title">{task.title}</h3>
                <p className="task-card__meta">
                  {t(language, 'task.created', {
                    date: formatDisplayDate(task.createdAt, language),
                  })}
                </p>
              </div>

              <div
                className="task-card__thumb"
                aria-hidden="true"
                style={{
                  background: task.imageUrl
                    ? `center / cover no-repeat url(${task.imageUrl})`
                    : toTaskImage(task),
                }}
              />
            </article>
          ))}
        </div>
      </section>

      <TaskFormModal
        isOpen={isTaskFormOpen}
        mode={modalMode}
        initialState={initialModalState}
        language={language}
        priorityMeta={priorityMeta}
        statusMeta={statusMeta}
        onClose={closeModal}
        onSubmit={handleTaskFormSubmit}
      />
    </>
  )
}

export default TodoSelect
