import { useMemo, useState } from 'react'
import Button from '../../components/ui/Button/Button'
import TaskCategoriesTable, {
  type CategoryRow,
} from '../../components/dashboard/TaskCategoriesTable/TaskCategoriesTable'
import TaskPriorityTable from '../../components/dashboard/TaskPriorityTable/TaskPriorityTable'
import TaskPriorityModal from '../../features/task-priority/TaskPriorityModal/TaskPriorityModal'
import TaskStatusModal from '../../features/task-status/TaskStatusModal/TaskStatusModal'
import styles from './TaskCategoriesPage.module.scss'

type CategoryModalState =
  | { entity: null; mode: 'create' }
  | { entity: 'status' | 'priority'; mode: 'create' | 'edit'; itemId?: string }

const initialStatuses: CategoryRow[] = [
  { id: 'status-1', label: 'Completed' },
  { id: 'status-2', label: 'In Progress' },
  { id: 'status-3', label: 'Not Started' },
]

const initialPriorities: CategoryRow[] = [
  { id: 'priority-1', label: 'Extreme' },
  { id: 'priority-2', label: 'Moderate' },
  { id: 'priority-3', label: 'Low' },
]

const TaskCategoriesPage = () => {
  const [modalState, setModalState] = useState<CategoryModalState>({
    entity: null,
    mode: 'create',
  })
  const [statuses, setStatuses] = useState<CategoryRow[]>(initialStatuses)
  const [priorities, setPriorities] = useState<CategoryRow[]>(initialPriorities)

  const currentStatusItem = useMemo(() => {
    if (modalState.entity !== 'status' || modalState.mode !== 'edit') {
      return null
    }

    return statuses.find((item) => item.id === modalState.itemId) ?? null
  }, [modalState, statuses])

  const currentPriorityItem = useMemo(() => {
    if (modalState.entity !== 'priority' || modalState.mode !== 'edit') {
      return null
    }

    return priorities.find((item) => item.id === modalState.itemId) ?? null
  }, [modalState, priorities])

  const openStatusModal = (
    mode: 'create' | 'edit',
    item?: CategoryRow,
  ) => {
    setModalState({
      entity: 'status',
      mode,
      itemId: item?.id,
    })
  }

  const openPriorityModal = (
    mode: 'create' | 'edit',
    item?: CategoryRow,
  ) => {
    setModalState({
      entity: 'priority',
      mode,
      itemId: item?.id,
    })
  }

  const closeModal = () => {
    setModalState({ entity: null, mode: 'create' })
  }

  const handleDelete = (entity: 'status' | 'priority', itemId: string) => {
    if (entity === 'status') {
      setStatuses((current) => current.filter((item) => item.id !== itemId))
      return
    }

    setPriorities((current) => current.filter((item) => item.id !== itemId))
  }

  const handleStatusSubmit = (value: string) => {
    if (modalState.entity !== 'status') {
      return
    }

    if (modalState.mode === 'create') {
      setStatuses((current) => [
        ...current,
        { id: `status-${Date.now()}`, label: value },
      ])
    } else if (modalState.itemId) {
      setStatuses((current) =>
        current.map((item) =>
          item.id === modalState.itemId ? { ...item, label: value } : item,
        ),
      )
    }

    closeModal()
  }

  const handlePrioritySubmit = (value: string) => {
    if (modalState.entity !== 'priority') {
      return
    }

    if (modalState.mode === 'create') {
      setPriorities((current) => [
        ...current,
        { id: `priority-${Date.now()}`, label: value },
      ])
    } else if (modalState.itemId) {
      setPriorities((current) =>
        current.map((item) =>
          item.id === modalState.itemId ? { ...item, label: value } : item,
        ),
      )
    }

    closeModal()
  }

  return (
    <div className={styles.page}>
      <section className={`dashboard-panel ${styles.panel}`}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Task Categories</h2>
          </div>
          <button
            className={styles.backButton}
            type="button"
            onClick={() => {
              window.location.hash = 'dashboard'
            }}
          >
            Go Back
          </button>
        </div>

        <div className={styles.toolbar}>
          <Button
            className={styles.primaryButton}
            onClick={() => {
              openStatusModal('create')
            }}
          >
            Add Category
          </Button>
        </div>

        <div className={styles.tables}>
          <TaskCategoriesTable
            rows={statuses}
            onEdit={(row) => {
              openStatusModal('edit', row)
            }}
            onDelete={(rowId) => {
              handleDelete('status', rowId)
            }}
          />

          <div className={styles.inlineAction}>
            <button
              className={styles.textAction}
              type="button"
              onClick={() => {
                openPriorityModal('create')
              }}
            >
              <span>+</span>
              Add Task Priority
            </button>
          </div>

          <TaskPriorityTable
            rows={priorities}
            onEdit={(row) => {
              openPriorityModal('edit', row)
            }}
            onDelete={(rowId) => {
              handleDelete('priority', rowId)
            }}
          />
        </div>
      </section>

      <TaskStatusModal
        isOpen={modalState.entity === 'status'}
        mode={modalState.mode}
        initialValue={currentStatusItem?.label ?? ''}
        onClose={closeModal}
        onSubmit={handleStatusSubmit}
      />

      <TaskPriorityModal
        isOpen={modalState.entity === 'priority'}
        mode={modalState.mode}
        initialValue={currentPriorityItem?.label ?? ''}
        onClose={closeModal}
        onSubmit={handlePrioritySubmit}
      />
    </div>
  )
}

export default TaskCategoriesPage
