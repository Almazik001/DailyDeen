import { useEffect, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

type PriorityKey = 'Extreme' | 'Moderate' | 'Low'

type TodoTask = {
  title: string
  description: string
  priority: PriorityKey
  priorityColor: string
  status: string
  statusColor: string
  createdAt: string
  thumbnail: string
}

type TaskFormState = {
  title: string
  date: string
  priority: PriorityKey
  description: string
  imagePreview: string
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
    title: "Attend Nischal's Birthday Party",
    description:
      'Buy gifts on the way and pick up cake from the bakery. (6 PM, Fresh Elements)',
    priority: 'Moderate',
    priorityColor: priorityMeta.Moderate.textColor,
    status: 'Not Started',
    statusColor: '#FF5B5B',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 68% 24%, #ffd873 0 14%, transparent 15%), linear-gradient(135deg, #5f3d32 0%, #2d2f3f 45%, #c47c53 100%)',
  },
  {
    title: 'Landing Page Design for TravelDays',
    description:
      'Get the work done by EOD and discuss with client before leaving. (4 PM | Meeting Room)',
    priority: 'Moderate',
    priorityColor: priorityMeta.Moderate.textColor,
    status: 'In Progress',
    statusColor: '#4A5CFF',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 28% 28%, #f0a8ff 0 13%, transparent 14%), linear-gradient(135deg, #2d3a58 0%, #111827 52%, #4672a8 100%)',
  },
  {
    title: 'Presentation on Final Product',
    description:
      'Make sure everything is functioning and all the necessities are properly met. Prepare the documents ready for review.',
    priority: 'Moderate',
    priorityColor: priorityMeta.Moderate.textColor,
    status: 'In Progress',
    statusColor: '#4A5CFF',
    createdAt: '19/06/2023',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 72% 24%, #ffe9bd 0 14%, transparent 15%), linear-gradient(140deg, #6d5847 0%, #a67d58 30%, #2f3748 80%, #151821 100%)',
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

function UploadPlaceholderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="task-modal__upload-icon"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="8" width="26" height="18" rx="5" />
      <path d="m11 24 6.5-6.5a3 3 0 0 1 4.2 0l3.4 3.4" />
      <path d="m23 23 2.2-2.2a3 3 0 0 1 4.2 0L37 28" />
      <circle cx="17" cy="15.5" r="3" />
      <path d="M36 33v10" />
      <path d="m31.5 37.5 4.5-4.5 4.5 4.5" />
    </svg>
  )
}

function formatDate(value: string) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date()
  return new Intl.DateTimeFormat('en-GB').format(date)
}

const TodoSelect = () => {
  const [tasks, setTasks] = useState<TodoTask[]>(initialTodoTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formState, setFormState] = useState<TaskFormState>(initialFormState)

  useEffect(() => {
    if (!isModalOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
        setFormState(initialFormState)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isModalOpen])

  const closeModal = () => {
    setIsModalOpen(false)
    setFormState(initialFormState)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const updatePreviewFromFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const preview = typeof reader.result === 'string' ? reader.result : ''

      setFormState((current) => ({
        ...current,
        imagePreview: preview,
        imageName: file.name,
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target

    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    updatePreviewFromFile(file)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()

    const file = event.dataTransfer.files?.[0]

    if (!file) {
      return
    }

    updatePreviewFromFile(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newTask: TodoTask = {
      title: formState.title.trim(),
      description:
        formState.description.trim() || 'Task description will be added later.',
      priority: formState.priority,
      priorityColor: priorityMeta[formState.priority].textColor,
      status: 'Not Started',
      statusColor: '#FF5B5B',
      createdAt: formatDate(formState.date),
      thumbnail:
        formState.imagePreview || priorityMeta[formState.priority].thumbnail,
    }

    setTasks((current) => [newTask, ...current])
    closeModal()
  }

  const modalContent = isModalOpen ? (
    <div
      className="task-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeModal()
        }
      }}
    >
      <div
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="task-modal__header">
          <h3 className="task-modal__title" id="task-modal-title">
            Add New Task
          </h3>
          <span className="task-modal__ornament" aria-hidden="true" />
          <button className="task-modal__back" type="button" onClick={closeModal}>
            Go Back
          </button>
        </div>

        <form className="task-modal__form" onSubmit={handleSubmit}>
          <div className="task-modal__frame">
            <label className="task-modal__field">
              <span className="task-modal__label">Title</span>
              <input
                className="task-modal__input"
                name="title"
                value={formState.title}
                onChange={handleFieldChange}
                placeholder="Enter task title"
                required
              />
            </label>

            <label className="task-modal__field">
              <span className="task-modal__label">Date</span>
              <input
                className="task-modal__input task-modal__input--date"
                name="date"
                type="date"
                value={formState.date}
                onChange={handleFieldChange}
                required
              />
            </label>

            <fieldset className="task-modal__priority">
              <legend className="task-modal__label">Priority</legend>

              <div className="task-modal__priority-list">
                {(Object.keys(priorityMeta) as PriorityKey[]).map((priority) => (
                  <label
                    key={priority}
                    className={`task-modal__priority-option${formState.priority === priority ? ' is-selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formState.priority === priority}
                      onChange={handleFieldChange}
                    />
                    <span
                      className="task-modal__priority-dot"
                      aria-hidden="true"
                      style={{ backgroundColor: priorityMeta[priority].dotColor }}
                    />
                    <span>{priority}</span>
                    <span
                      className="task-modal__priority-check"
                      aria-hidden="true"
                      style={{
                        borderColor:
                          formState.priority === priority
                            ? priorityMeta[priority].dotColor
                            : '#c8cfdb',
                        backgroundColor:
                          formState.priority === priority
                            ? priorityMeta[priority].dotColor
                            : 'transparent',
                      }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="task-modal__content-grid">
              <label className="task-modal__field">
                <span className="task-modal__label">Task Description</span>
                <textarea
                  className="task-modal__textarea"
                  name="description"
                  value={formState.description}
                  onChange={handleFieldChange}
                  placeholder="Start writing here...."
                />
              </label>

              <div className="task-modal__field">
                <span className="task-modal__label">Upload Image</span>

                <input
                  className="task-modal__file-input"
                  id="todo-task-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <label
                  className={`task-modal__upload${formState.imagePreview ? ' has-preview' : ''}`}
                  htmlFor="todo-task-image"
                  onDragOver={(event) => {
                    event.preventDefault()
                  }}
                  onDrop={handleDrop}
                >
                  {formState.imagePreview ? (
                    <div
                      className="task-modal__upload-preview"
                      aria-hidden="true"
                      style={{ backgroundImage: `url(${formState.imagePreview})` }}
                    />
                  ) : (
                    <UploadPlaceholderIcon />
                  )}

                  <span className="task-modal__upload-text">
                    {formState.imageName || 'Drag & Drop files here'}
                  </span>
                  <span className="task-modal__upload-subtext">
                    {formState.imagePreview ? 'Click to replace image' : 'or'}
                  </span>
                  <span className="task-modal__browse">Browse</span>
                </label>
              </div>
            </div>
          </div>

          <div className="task-modal__actions">
            <button className="task-modal__submit" type="submit">
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null

  return (
    <>
      <section className="dashboard-panel todo-panel">
        <div className="panel-head">
          <div className="panel-title">
            <TodoPanelIcon />
            <h2>To-Do</h2>
          </div>
          <button className="panel-action" type="button" onClick={openModal}>
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
                <OverflowIcon />
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

      {modalContent && document.body ? createPortal(modalContent, document.body) : null}
    </>
  )
}

export default TodoSelect
