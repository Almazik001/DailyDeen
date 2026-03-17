import styles from './TaskCategoriesTable.module.scss'

export type CategoryRow = {
  id: string
  label: string
}

type TaskCategoriesTableProps = {
  rows: CategoryRow[]
  onEdit: (row: CategoryRow) => void
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
  rows,
  onEdit,
  onDelete,
}: TaskCategoriesTableProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Task Status</h3>
      </div>

      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SN</th>
              <th>Task Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.label}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      type="button"
                      onClick={() => {
                        onEdit(row)
                      }}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      type="button"
                      onClick={() => {
                        onDelete(row.id)
                      }}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TaskCategoriesTable
