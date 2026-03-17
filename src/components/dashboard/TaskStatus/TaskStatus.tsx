import './TaskStatus.module.scss'

type StatusItem = {
  label: string
  value: number
  color: string
}

const statusItems: StatusItem[] = [
  { label: 'Completed', value: 84, color: '#57AE35' },
  { label: 'In Progress', value: 46, color: '#4A47F5' },
  { label: 'Not Started', value: 13, color: '#E04B3F' },
]

function StatusPanelIcon() {
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
      <path d="M16 11v7" />
      <path d="M19 14v4" />
      <path d="M13 15.5v2.5" />
    </svg>
  )
}

const TaskStatus = () => {
  return (
    <section className="dashboard-panel status-panel">
      <div className="panel-head">
        <div className="panel-title">
          <StatusPanelIcon />
          <h2>Task Status</h2>
        </div>
      </div>

      <div className="status-grid">
        {statusItems.map((item) => (
          <div className="status-card" key={item.label}>
            <div
              className="status-ring"
              aria-label={`${item.label}: ${item.value}%`}
              role="img"
              style={{
                background: `conic-gradient(${item.color} ${item.value}%, #E2E6EE ${item.value}% 100%)`,
              }}
            >
              <div className="status-ring__center">{item.value}%</div>
            </div>

            <div className="status-card__label">
              <span
                className="status-card__dot"
                aria-hidden="true"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TaskStatus
