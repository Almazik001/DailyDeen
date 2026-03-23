import { useEffect, useState, type FormEvent } from 'react'
import Button from '../../../components/ui/Button/Button'
import Input from '../../../components/ui/Input/Input'
import Modal from '../../../components/ui/Modal/Modal'
import styles from './TaskStatusModal.module.scss'

type TaskStatusModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  title: string
  inputLabel: string
  placeholder: string
  initialValue: string
  onClose: () => void
  onSubmit: (value: string) => void
}

const TaskStatusModal = ({
  isOpen,
  mode,
  title,
  inputLabel,
  placeholder,
  initialValue,
  onClose,
  onSubmit,
}: TaskStatusModalProps) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue)
    }
  }, [initialValue, isOpen])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextValue = value.trim()

    if (!nextValue) {
      return
    }

    onSubmit(nextValue)
  }

  const submitLabel = mode === 'edit' ? 'Update' : 'Create'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.backButton} type="button" onClick={onClose}>
            Go Back
          </button>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.frame}>
          <label className={styles.field}>
            <span className={styles.label}>{inputLabel}</span>
            <Input
              className={styles.input}
              placeholder={placeholder}
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
              }}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <Button className={styles.actionButton} type="submit">
            {submitLabel}
          </Button>
          <Button
            className={`${styles.actionButton} ${styles.cancelButton}`}
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default TaskStatusModal
