import { useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '../../api/apiClient'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../api/categories.api'
import {
  createPriority,
  deletePriority,
  getPriorities,
  updatePriority,
} from '../../api/priorities.api'
import {
  createStatus,
  deleteStatus,
  getStatuses,
  updateStatus,
} from '../../api/statuses.api'
import type { LookupItem } from '../../api/types'
import TaskCategoriesTable, {
  type LookupRow,
} from '../../components/dashboard/TaskCategoriesTable/TaskCategoriesTable'
import { clearTaskLookupsCache } from '../../features/tasks/taskLookups'
import TaskStatusModal from '../../features/task-status/TaskStatusModal/TaskStatusModal'
import styles from './TaskCategoriesPage.module.scss'

type LookupEntity = 'category' | 'status' | 'priority'

type CategoryModalState =
  | { entity: null; mode: 'create'; item: null }
  | { entity: LookupEntity; mode: 'create' | 'edit'; item: LookupItem | null }

const emptyModalState: CategoryModalState = {
  entity: null,
  mode: 'create',
  item: null,
}

const TaskCategoriesPage = () => {
  const [modalState, setModalState] = useState<CategoryModalState>(emptyModalState)
  const [categories, setCategories] = useState<LookupItem[]>([])
  const [statuses, setStatuses] = useState<LookupItem[]>([])
  const [priorities, setPriorities] = useState<LookupItem[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [categoriesResponse, statusesResponse, prioritiesResponse] =
          await Promise.all([getCategories(), getStatuses(), getPriorities()])

        setCategories(categoriesResponse.categories)
        setStatuses(statusesResponse.statuses)
        setPriorities(prioritiesResponse.priorities)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, 'Unable to load lookup data'))
      }
    }

    void loadLookups()
  }, [])

  const modalConfig = useMemo(() => {
    if (!modalState.entity) {
      return null
    }

    if (modalState.entity === 'category') {
      return {
        title: modalState.mode === 'edit' ? 'Edit Category' : 'Add Category',
        inputLabel: 'Category Name',
        placeholder: 'Enter category name',
      }
    }

    if (modalState.entity === 'status') {
      return {
        title: modalState.mode === 'edit' ? 'Edit Task Status' : 'Add Task Status',
        inputLabel: 'Task Status Name',
        placeholder: 'Enter task status',
      }
    }

    return {
      title: modalState.mode === 'edit' ? 'Edit Task Priority' : 'Add Task Priority',
      inputLabel: 'Task Priority Name',
      placeholder: 'Enter task priority',
    }
  }, [modalState.entity, modalState.mode])

  const openModal = (
    entity: LookupEntity,
    mode: 'create' | 'edit',
    item: LookupItem | null = null,
  ) => {
    setErrorMessage('')
    setModalState({ entity, mode, item })
  }

  const closeModal = () => {
    setModalState(emptyModalState)
  }

  const handleSubmit = async (value: string) => {
    try {
      if (modalState.entity === 'category') {
        if (modalState.mode === 'create') {
          const { category } = await createCategory(value)
          setCategories((current) => [...current, category])
        } else if (modalState.item) {
          const { category } = await updateCategory(modalState.item.id, value)
          setCategories((current) =>
            current.map((item) => (item.id === category.id ? category : item)),
          )
        }
      }

      if (modalState.entity === 'status') {
        if (modalState.mode === 'create') {
          const { status } = await createStatus(value)
          setStatuses((current) => [...current, status])
        } else if (modalState.item) {
          const { status } = await updateStatus(modalState.item.id, value)
          setStatuses((current) =>
            current.map((item) => (item.id === status.id ? status : item)),
          )
        }
      }

      if (modalState.entity === 'priority') {
        if (modalState.mode === 'create') {
          const { priority } = await createPriority(value)
          setPriorities((current) => [...current, priority])
        } else if (modalState.item) {
          const { priority } = await updatePriority(modalState.item.id, value)
          setPriorities((current) =>
            current.map((item) => (item.id === priority.id ? priority : item)),
          )
        }
      }

      clearTaskLookupsCache()
      closeModal()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to save lookup item'))
    }
  }

  const handleDelete = async (entity: LookupEntity, itemId: string) => {
    try {
      if (entity === 'category') {
        await deleteCategory(itemId)
        setCategories((current) => current.filter((item) => item.id !== itemId))
      }

      if (entity === 'status') {
        await deleteStatus(itemId)
        setStatuses((current) => current.filter((item) => item.id !== itemId))
      }

      if (entity === 'priority') {
        await deletePriority(itemId)
        setPriorities((current) => current.filter((item) => item.id !== itemId))
      }

      clearTaskLookupsCache()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to delete lookup item'))
    }
  }

  const toRows = (items: LookupItem[]): LookupRow[] =>
    items.map((item) => ({
      id: item.id,
      name: item.name,
    }))

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

        {errorMessage ? <p className={styles.subtitle}>{errorMessage}</p> : null}

        <div className={styles.tables}>
          <TaskCategoriesTable
            addLabel="+ Add Category"
            columnLabel="Task Category"
            rows={toRows(categories)}
            title="Task Categories"
            onAdd={() => {
              openModal('category', 'create')
            }}
            onEdit={(row) => {
              const item = categories.find((category) => category.id === row.id) ?? null
              openModal('category', 'edit', item)
            }}
            onDelete={(rowId) => {
              void handleDelete('category', rowId)
            }}
          />

          <TaskCategoriesTable
            addLabel="+ Add Status"
            columnLabel="Task Status"
            rows={toRows(statuses)}
            title="Task Status"
            onAdd={() => {
              openModal('status', 'create')
            }}
            onEdit={(row) => {
              const item = statuses.find((status) => status.id === row.id) ?? null
              openModal('status', 'edit', item)
            }}
            onDelete={(rowId) => {
              void handleDelete('status', rowId)
            }}
          />

          <TaskCategoriesTable
            addLabel="+ Add Priority"
            columnLabel="Task Priority"
            rows={toRows(priorities)}
            title="Task Priority"
            onAdd={() => {
              openModal('priority', 'create')
            }}
            onEdit={(row) => {
              const item = priorities.find((priority) => priority.id === row.id) ?? null
              openModal('priority', 'edit', item)
            }}
            onDelete={(rowId) => {
              void handleDelete('priority', rowId)
            }}
          />
        </div>
      </section>

      <TaskStatusModal
        isOpen={Boolean(modalState.entity && modalConfig)}
        title={modalConfig?.title ?? 'Edit'}
        inputLabel={modalConfig?.inputLabel ?? 'Name'}
        placeholder={modalConfig?.placeholder ?? 'Enter value'}
        mode={modalState.mode}
        initialValue={modalState.item?.name ?? ''}
        onClose={closeModal}
        onSubmit={(value) => {
          void handleSubmit(value)
        }}
      />
    </div>
  )
}

export default TaskCategoriesPage
