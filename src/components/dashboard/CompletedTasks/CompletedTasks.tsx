import type { ApiTask } from '../../../api/types'
import { getCompletedAgoLabel } from '../../../features/tasks/dashboardData'
import { toTaskImage } from '../../../features/tasks/taskUi'
import './CompletedTasks.module.scss'

type CompletedTasksProps = {
  tasks: ApiTask[]
}

function CompletedPanelIcon() {
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
      <rect x="5" y="4" width="14" height="16" rx="2.5" />
      <path d="M8.5 4h7v3h-7z" />
      <path d="m9 12 2 2 4-5" />
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

const CompletedTasks = ({ tasks }: CompletedTasksProps) => {
  return (
    <section className="dashboard-panel completed-panel">
      <div className="panel-head">
        <div className="panel-title">
          <CompletedPanelIcon />
          <h2>Completed Task</h2>
        </div>
      </div>

      <div className="completed-list">
        {tasks.map((task) => (
          <article className="task-card task-card--compact" key={task.id}>
            <OverflowIcon />
            <div className="task-card__content">
              <div className="task-card__title-row">
                <span
                  className="task-card__indicator"
                  aria-hidden="true"
                  style={{ borderColor: '#57AE35' }}
                />
                <div>
                  <h3 className="task-card__title">{task.title}</h3>
                  <p className="task-card__description">{task.description}</p>
                </div>
              </div>

              <p className="task-card__status-note">
                Status: <strong style={{ color: '#57AE35' }}>Completed</strong>
              </p>
              <p className="task-card__completed-note">{getCompletedAgoLabel(task)}</p>
            </div>

            <div
              className="task-card__thumb"
              aria-hidden="true"
              style={{
                background: task.imageUrl
                  ? `center / cover no-repeat url(${task.imageUrl})`
                  : toTaskImage(task),
              }}
            />
          </article>
        ))}
      </div>
    </section>
  )
}

export default CompletedTasks
