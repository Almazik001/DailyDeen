import styles from './TaskCategoriesTable.module.scss'

export type LookupRow = {
  id: string
  name: string
}

type TaskCategoriesTableProps = {
  title: string
  columnLabel: string
  rows: LookupRow[]
  addLabel: string
  serialLabel: string
  actionLabel: string
  editLabel: string
  deleteLabel: string
  emptyLabel: string
  onAdd: () => void
  onEdit: (row: LookupRow) => void
  onDelete: (rowId: string) => void
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m4 13.7 8.9-8.9a1.8 1.8 0 0 1 2.5 0l.8.8a1.8 1.8 0 0 1 0 2.5L7.3 17H4v-3.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 6.2 14 8.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5.5 6.5v7.8c0 .9.7 1.7 1.7 1.7h5.6c.9 0 1.7-.8 1.7-1.7V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 5h12M7.5 5V3.8c0-.4.3-.8.8-.8h3.4c.4 0 .8.4.8.8V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 9v4M11.5 9v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

const TaskCategoriesTable = ({
  title,
  columnLabel,
  rows,
  addLabel,
  serialLabel,
  actionLabel,
  editLabel,
  deleteLabel,
  emptyLabel,
  onAdd,
  onEdit,
  onDelete,
}: TaskCategoriesTableProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <button
          className={`${styles.actionButton} ${styles.headerButton}`}
          type="button"
          onClick={onAdd}
        >
          {addLabel}
        </button>
      </div>

      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{serialLabel}</th>
              <th scope="col">{columnLabel}</th>
              <th scope="col">{actionLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={row.id}>
                  <td data-label={serialLabel}>{index + 1}</td>
                  <td data-label={columnLabel}>{row.name}</td>
                  <td className={styles.actionCell} data-label={actionLabel}>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.rowButton}`}
                        type="button"
                        onClick={() => {
                          onEdit(row)
                        }}
                      >
                        <EditIcon />
                        {editLabel}
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.rowButton} ${styles.deleteButton}`}
                        type="button"
                        onClick={() => {
                          onDelete(row.id)
                        }}
                      >
                        <DeleteIcon />
                        {deleteLabel}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className={styles.emptyRow}>
                <td className={styles.emptyCell} colSpan={3}>
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TaskCategoriesTable
