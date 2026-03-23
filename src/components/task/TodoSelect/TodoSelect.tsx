import { useEffect, useMemo, useState } from 'react'
import type { ApiTask } from '../../../api/types'
import { getApiErrorMessage } from '../../../api/apiClient'
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
  getPriorityVisual,
  getStatusColor,
  priorityMeta,
  toTaskFormState,
  toTaskImage,
} from '../../../features/tasks/taskUi'
import './TodoSelect.module.scss'

const initialFormState: TaskFormState = {
  title: '',
  date: '',
  priority: 'Moderate',
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

function getCurrentDayLabel() {
  const date = new Date()

  return {
    day: new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
    }).format(date),
    caption: 'Today',
  }
}

const TodoSelect = () => {
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
        setErrorMessage(getApiErrorMessage(error, 'Unable to load tasks'))
      }
    }

    void loadTodoTasks()
  }, [])

  const closeModal = () => {
    setIsTaskFormOpen(false)
    setEditingTaskId(null)
  }

  const openCreateModal = () => {
    setModalMode('create')
    setEditingTaskId(null)
    setIsTaskFormOpen(true)
  }

  const openEditModal = (taskId: string) => {
    setModalMode('edit')
    setEditingTaskId(taskId)
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
      setErrorMessage(getApiErrorMessage(error, 'Unable to save task'))
    }
  }

  const currentDate = getCurrentDayLabel()

  return (
    <>
      <section className="dashboard-panel todo-panel">
        <div className="panel-head">
          <div className="panel-title">
            <TodoPanelIcon />
            <h2>To-Do</h2>
          </div>
          <button className="panel-action" type="button" onClick={openCreateModal}>
            <span>+</span>
            Add task
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
            <article className="task-card task-card--todo" key={task.id}>
              <button
                className="task-card__menu-button"
                type="button"
                aria-label={`Edit ${task.title}`}
                onClick={() => {
                  openEditModal(task.id)
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
                    {task.status.name}
                  </span>
                  <span
                    className="task-card__badge task-card__badge--priority"
                    style={{
                      backgroundColor: `${getPriorityVisual(task.priority.name).textColor}18`,
                      color: getPriorityVisual(task.priority.name).textColor,
                    }}
                  >
                    {task.priority.name} priority
                  </span>
                </div>

                <h3 className="task-card__title">{task.title}</h3>
                <p className="task-card__meta">Created {formatDisplayDate(task.createdAt)}</p>
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
        priorityMeta={priorityMeta}
        onClose={closeModal}
        onSubmit={handleTaskFormSubmit}
      />
    </>
  )
}

export default TodoSelect
