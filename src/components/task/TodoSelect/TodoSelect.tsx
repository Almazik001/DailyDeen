import { useState } from 'react'
import TaskFormModal, {
  type PriorityKey,
  type TaskFormState,
} from '../../../features/task-form/TaskFormModal'
import './TodoSelect.module.scss'

type TodoTask = {
  id: string
  title: string
  description: string
  date: string
  priority: PriorityKey
  priorityColor: string
  status: string
  statusColor: string
  createdAt: string
  thumbnail: string
  imageName: string
}

const priorityMeta: Record<
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

const initialTodoTasks: TodoTask[] = [
  {
    id: 'todo-1',
    title: "Attend Nischal's Birthday Party",
    description:
      'Buy gifts on the way and pick up cake from the bakery. (6 PM, Fresh Elements)',
    date: '2023-06-20',
    priority: 'Moderate',
    priorityColor: priorityMeta.Moderate.textColor,
    status: 'Not Started',
    statusColor: '#FF5B5B',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 68% 24%, #ffd873 0 14%, transparent 15%), linear-gradient(135deg, #5f3d32 0%, #2d2f3f 45%, #c47c53 100%)',
    imageName: '',
  },
  {
    id: 'todo-2',
    title: 'Landing Page Design for TravelDays',
    description:
      'Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)',
    date: '2023-06-20',
    priority: 'Moderate',
    priorityColor: priorityMeta.Moderate.textColor,
    status: 'In Progress',
    statusColor: '#4A5CFF',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 28% 28%, #f0a8ff 0 13%, transparent 14%), linear-gradient(135deg, #2d3a58 0%, #111827 52%, #4672a8 100%)',
    imageName: '',
  },
  {
    id: 'todo-3',
    title: 'Presentation on Final Product',
    description:
      'Make sure everything is functioning and all the necessities are properly met. Prepare the documents ready for review.',
    date: '2023-06-19',
    priority: 'Moderate',
    priorityColor: priorityMeta.Moderate.textColor,
    status: 'In Progress',
    statusColor: '#4A5CFF',
    createdAt: '19/06/2023',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 72% 24%, #ffe9bd 0 14%, transparent 15%), linear-gradient(140deg, #6d5847 0%, #a67d58 30%, #2f3748 80%, #151821 100%)',
    imageName: '',
  },
]

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

function formatDate(value: string) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date()
  return new Intl.DateTimeFormat('en-GB').format(date)
}

function createTaskFromForm(
  formState: TaskFormState,
  currentTask?: TodoTask,
): TodoTask {
  return {
    id: currentTask?.id ?? `todo-${Date.now()}`,
    title: formState.title.trim(),
    description:
      formState.description.trim() || 'Task description will be added later.',
    date: formState.date,
    priority: formState.priority,
    priorityColor: priorityMeta[formState.priority].textColor,
    status: currentTask?.status ?? 'Not Started',
    statusColor: currentTask?.statusColor ?? '#FF5B5B',
    createdAt: formatDate(formState.date),
    thumbnail:
      formState.imagePreview || priorityMeta[formState.priority].thumbnail,
    imageName: formState.imageName,
  }
}

function getFormStateFromTask(task: TodoTask): TaskFormState {
  return {
    title: task.title,
    date: task.date,
    priority: task.priority,
    description: task.description,
    imagePreview: task.thumbnail.startsWith('data:') ? task.thumbnail : '',
    imageName: task.imageName,
  }
}

const TodoSelect = () => {
  const [tasks, setTasks] = useState<TodoTask[]>(initialTodoTasks)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

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

  const initialModalState =
    modalMode === 'edit' && editingTask
      ? getFormStateFromTask(editingTask)
      : initialFormState

  const handleTaskFormSubmit = (formState: TaskFormState) => {
    if (modalMode === 'edit' && editingTask) {
      const updatedTask = createTaskFromForm(formState, editingTask)

      setTasks((current) =>
        current.map((task) => (task.id === editingTask.id ? updatedTask : task)),
      )
      closeModal()
      return
    }

    const newTask = createTaskFromForm(formState)
    setTasks((current) => [newTask, ...current])
    closeModal()
  }

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
          <strong>20 June</strong>
          <span className="panel-date__divider" />
          <span>Today</span>
        </div>

        <div className="todo-list">
          {tasks.map((task, index) => (
            <div key={`${task.title}-${task.createdAt}-${index}`}>
              <article className="task-card">
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
                  <div className="task-card__title-row">
                    <span
                      className="task-card__indicator"
                      aria-hidden="true"
                      style={{ borderColor: task.statusColor }}
                    />
                    <div>
                      <h3 className="task-card__title">{task.title}</h3>
                      <p className="task-card__description">{task.description}</p>
                    </div>
                  </div>

                  <div className="task-card__footer">
                    <span>
                      Priority:{' '}
                      <strong style={{ color: task.priorityColor }}>{task.priority}</strong>
                    </span>
                    <span>
                      Status:{' '}
                      <strong style={{ color: task.statusColor }}>{task.status}</strong>
                    </span>
                    <span>Created on: {task.createdAt}</span>
                  </div>
                </div>

                <div
                  className="task-card__thumb"
                  aria-hidden="true"
                  style={{
                    background: task.thumbnail.startsWith('data:')
                      ? `center / cover no-repeat url(${task.thumbnail})`
                      : task.thumbnail,
                  }}
                />
              </article>

              {index === 1 && index < tasks.length - 1 ? (
                <div className="todo-list__divider" />
              ) : null}
            </div>
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
