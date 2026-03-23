import type { ApiTask } from '../../../api/types'
import { getCompletedAgoLabel } from '../../../features/tasks/dashboardData'
import type { DashboardStatusItem } from '../../../features/tasks/dashboardData'
import './TaskStatus.module.scss'

type TaskStatusProps = {
  items: DashboardStatusItem[]
  totalTasks: number
  completedTasks: ApiTask[]
}

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

const TaskStatus = ({ items, totalTasks, completedTasks }: TaskStatusProps) => {
  const completedCount = items.find((item) => item.label === 'Completed')?.count ?? 0
  const summary =
    totalTasks === 0
      ? 'No tasks yet. Add your first task to track progress.'
      : `${completedCount} of ${totalTasks} tasks completed`

  return (
    <section className="dashboard-panel status-panel">
      <div className="panel-head panel-head--stacked">
        <div className="panel-title">
          <StatusPanelIcon />
          <h2>Task Status</h2>
        </div>
        <p className="status-panel__summary">{summary}</p>
      </div>

      <div className="status-list">
        {items.map((item) => (
          <div className="status-card" key={item.label}>
            <div className="status-card__head">
              <div className="status-card__label">
                <span
                  className="status-card__dot"
                  aria-hidden="true"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>

              <div className="status-card__value">
                <strong>{item.count}</strong>
                <span>{item.value}%</span>
              </div>
            </div>

            <div className="status-card__bar" aria-hidden="true">
              <span
                className="status-card__bar-fill"
                style={{
                  backgroundColor: item.color,
                  width: `${item.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="status-panel__recent">
        <div className="status-panel__recent-head">
          <h3 className="status-panel__recent-title">Recently completed</h3>
          {completedTasks.length ? (
            <span className="status-panel__recent-count">{completedTasks.length}</span>
          ) : null}
        </div>

        {completedTasks.length ? (
          <div className="status-panel__recent-list">
            {completedTasks.map((task) => (
              <article className="status-activity" key={task.id}>
                <div className="status-activity__body">
                  <h4 className="status-activity__title">{task.title}</h4>
                  <p className="status-activity__meta">{getCompletedAgoLabel(task)}</p>
                </div>
                <span className="status-activity__badge">Done</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="status-panel__empty">Completed tasks will show up here.</p>
        )}
      </div>
    </section>
  )
}

export default TaskStatus
