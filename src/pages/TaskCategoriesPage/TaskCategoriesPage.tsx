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
import type { LanguageMode } from '../../features/settings/settingsStorage'
import { t } from '../../features/settings/translations'
import TaskCategoriesTable, {
  type LookupRow,
} from '../../components/dashboard/TaskCategoriesTable/TaskCategoriesTable'
import { getPriorityLabel, getStatusLabel } from '../../features/tasks/taskUi'
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

type TaskCategoriesPageProps = {
  language: LanguageMode
}

const TaskCategoriesPage = ({ language }: TaskCategoriesPageProps) => {
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
        setErrorMessage(
          getApiErrorMessage(error, t(language, 'taskCategories.loadError')),
        )
      }
    }

    void loadLookups()
  }, [language])

  const modalConfig = useMemo(() => {
    if (!modalState.entity) {
      return null
    }

    if (modalState.entity === 'category') {
      return {
        title:
          modalState.mode === 'edit'
            ? t(language, 'taskCategories.editCategory')
            : t(language, 'taskCategories.createCategory'),
        inputLabel: t(language, 'taskCategories.categoryName'),
        placeholder: t(language, 'taskCategories.categoryPlaceholder'),
      }
    }

    if (modalState.entity === 'status') {
      return {
        title:
          modalState.mode === 'edit'
            ? t(language, 'taskCategories.editStatus')
            : t(language, 'taskCategories.createStatus'),
        inputLabel: t(language, 'taskCategories.statusName'),
        placeholder: t(language, 'taskCategories.statusPlaceholder'),
      }
    }

    return {
      title:
        modalState.mode === 'edit'
          ? t(language, 'taskCategories.editPriority')
          : t(language, 'taskCategories.createPriority'),
      inputLabel: t(language, 'taskCategories.priorityName'),
      placeholder: t(language, 'taskCategories.priorityPlaceholder'),
    }
  }, [language, modalState.entity, modalState.mode])

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
      setErrorMessage(
        getApiErrorMessage(error, t(language, 'taskCategories.saveError')),
      )
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
      setErrorMessage(
        getApiErrorMessage(error, t(language, 'taskCategories.deleteError')),
      )
    }
  }

  const toRows = (
    items: LookupItem[],
    entity: LookupEntity,
  ): LookupRow[] =>
    items.map((item) => ({
      id: item.id,
      name:
        entity === 'status'
          ? getStatusLabel(item.name, language)
          : entity === 'priority'
            ? getPriorityLabel(item.name, language)
            : item.name,
    }))

  return (
    <div className={styles.page}>
      <section className={`dashboard-panel ${styles.panel}`}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{t(language, 'taskCategories.pageTitle')}</h2>
          </div>
          <button
            className={styles.backButton}
            type="button"
            onClick={() => {
              window.location.hash = 'dashboard'
            }}
          >
            {t(language, 'common.goBack')}
          </button>
        </div>

        {errorMessage ? <p className={styles.subtitle}>{errorMessage}</p> : null}

        <div className={styles.tables}>
          <TaskCategoriesTable
            actionLabel={t(language, 'common.actions')}
            addLabel={t(language, 'taskCategories.addCategory')}
            columnLabel={t(language, 'taskCategories.categoryColumn')}
            deleteLabel={t(language, 'common.delete')}
            editLabel={t(language, 'common.edit')}
            emptyLabel={t(language, 'taskCategories.noItems')}
            rows={toRows(categories, 'category')}
            serialLabel={t(language, 'common.serial')}
            title={t(language, 'taskCategories.categoryTitle')}
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
            actionLabel={t(language, 'common.actions')}
            addLabel={t(language, 'taskCategories.addStatus')}
            columnLabel={t(language, 'taskCategories.statusColumn')}
            deleteLabel={t(language, 'common.delete')}
            editLabel={t(language, 'common.edit')}
            emptyLabel={t(language, 'taskCategories.noItems')}
            rows={toRows(statuses, 'status')}
            serialLabel={t(language, 'common.serial')}
            title={t(language, 'taskCategories.statusTitle')}
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
            actionLabel={t(language, 'common.actions')}
            addLabel={t(language, 'taskCategories.addPriority')}
            columnLabel={t(language, 'taskCategories.priorityColumn')}
            deleteLabel={t(language, 'common.delete')}
            editLabel={t(language, 'common.edit')}
            emptyLabel={t(language, 'taskCategories.noItems')}
            rows={toRows(priorities, 'priority')}
            serialLabel={t(language, 'common.serial')}
            title={t(language, 'taskCategories.priorityTitle')}
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
        inputLabel={modalConfig?.inputLabel ?? t(language, 'taskCategories.categoryName')}
        initialValue={modalState.item?.name ?? ''}
        isOpen={Boolean(modalState.entity && modalConfig)}
        language={language}
        mode={modalState.mode}
        placeholder={
          modalConfig?.placeholder ?? t(language, 'taskCategories.categoryPlaceholder')
        }
        title={modalConfig?.title ?? t(language, 'common.edit')}
        onClose={closeModal}
        onSubmit={(value) => {
          void handleSubmit(value)
        }}
      />
    </div>
  )
}

export default TaskCategoriesPage
