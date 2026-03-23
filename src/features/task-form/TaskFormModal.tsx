import { useEffect, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { LanguageMode } from '../settings/settingsStorage'
import { t } from '../settings/translations'
import './TaskFormModal.module.scss'

export type PriorityKey = 'Extreme' | 'Moderate' | 'Low'
export type StatusKey = 'Not Started' | 'In Progress' | 'Completed'

export type TaskFormState = {
  title: string
  date: string
  priority: PriorityKey
  status: StatusKey
  description: string
  imagePreview: string
  imageName: string
}

type PriorityMeta = Record<
  PriorityKey,
  { textColor: string; dotColor: string; thumbnail: string }
>

type StatusMeta = Record<
  StatusKey,
  { textColor: string; dotColor: string }
>

type TaskFormModalProps = {
  isOpen: boolean
  language: LanguageMode
  mode: 'create' | 'edit'
  initialState: TaskFormState
  priorityMeta: PriorityMeta
  statusMeta: StatusMeta
  onClose: () => void
  onSubmit: (formState: TaskFormState) => void
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

const TaskFormModal = ({
  isOpen,
  language,
  mode,
  initialState,
  priorityMeta,
  statusMeta,
  onClose,
  onSubmit,
}: TaskFormModalProps) => {
  const [formState, setFormState] = useState<TaskFormState>(initialState)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setFormState(initialState)
  }, [initialState, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
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
    onSubmit(formState)
  }

  const modalTitle =
    mode === 'edit'
      ? t(language, 'taskForm.editTitle')
      : t(language, 'taskForm.createTitle')
  const fileInputId = `task-form-image-${mode}`

  const modal = (
    <div
      className="task-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
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
            {modalTitle}
          </h3>
          <span className="task-modal__ornament" aria-hidden="true" />
          <button className="task-modal__back" type="button" onClick={onClose}>
            {t(language, 'common.goBack')}
          </button>
        </div>

        <form className="task-modal__form" onSubmit={handleSubmit}>
          <div className="task-modal__frame">
            <label className="task-modal__field">
              <span className="task-modal__label">{t(language, 'taskForm.title')}</span>
              <input
                className="task-modal__input"
                name="title"
                value={formState.title}
                onChange={handleFieldChange}
                placeholder={t(language, 'taskForm.titlePlaceholder')}
                required
              />
            </label>

            <label className="task-modal__field">
              <span className="task-modal__label">{t(language, 'taskForm.date')}</span>
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
              <legend className="task-modal__label">{t(language, 'taskForm.priority')}</legend>

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
                    <span>{t(language, `task.priority.${priority.toLowerCase()}`)}</span>
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

            {mode === 'edit' ? (
              <fieldset className="task-modal__priority">
                <legend className="task-modal__label">{t(language, 'taskForm.status')}</legend>

                <div className="task-modal__priority-list">
                  {(Object.keys(statusMeta) as StatusKey[]).map((status) => (
                    <label
                      key={status}
                      className={`task-modal__priority-option${formState.status === status ? ' is-selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formState.status === status}
                        onChange={handleFieldChange}
                      />
                      <span
                        className="task-modal__priority-dot"
                        aria-hidden="true"
                        style={{ backgroundColor: statusMeta[status].dotColor }}
                      />
                      <span>
                        {status === 'Completed'
                          ? t(language, 'task.status.completed')
                          : status === 'In Progress'
                            ? t(language, 'task.status.inProgress')
                            : t(language, 'task.status.notStarted')}
                      </span>
                      <span
                        className="task-modal__priority-check"
                        aria-hidden="true"
                        style={{
                          borderColor:
                            formState.status === status
                              ? statusMeta[status].dotColor
                              : '#c8cfdb',
                          backgroundColor:
                            formState.status === status
                              ? statusMeta[status].dotColor
                              : 'transparent',
                        }}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <div className="task-modal__content-grid">
              <label className="task-modal__field">
                <span className="task-modal__label">
                  {t(language, 'taskForm.description')}
                </span>
                <textarea
                  className="task-modal__textarea"
                  name="description"
                  value={formState.description}
                  onChange={handleFieldChange}
                  placeholder={t(language, 'taskForm.descriptionPlaceholder')}
                />
              </label>

              <div className="task-modal__field">
                <span className="task-modal__label">
                  {t(language, 'taskForm.uploadImage')}
                </span>

                <input
                  className="task-modal__file-input"
                  id={fileInputId}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <label
                  className={`task-modal__upload${formState.imagePreview ? ' has-preview' : ''}`}
                  htmlFor={fileInputId}
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
                    {formState.imageName || t(language, 'taskForm.dropFiles')}
                  </span>
                  <span className="task-modal__upload-subtext">
                    {formState.imagePreview
                      ? t(language, 'taskForm.replaceImage')
                      : t(language, 'taskForm.or')}
                  </span>
                  <span className="task-modal__browse">{t(language, 'taskForm.browse')}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="task-modal__actions">
            <button className="task-modal__submit" type="submit">
              {t(language, 'common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return document.body ? createPortal(modal, document.body) : null
}

export default TaskFormModal
