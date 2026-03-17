import './CompletedTasks.module.scss'

type CompletedTask = {
  title: string
  description: string
  completedAgo: string
  thumbnail: string
}

const completedTasks: CompletedTask[] = [
  {
    title: 'Walk the dog',
    description: 'Take the dog to the park and bring treats as well.',
    completedAgo: 'Completed 2 days ago.',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 70% 36%, #fff0cb 0 15%, transparent 16%), linear-gradient(135deg, #7a4a25 0%, #b77b42 38%, #6b8a4e 100%)',
  },
  {
    title: 'Conduct meeting',
    description: 'Meet with the client and finalize requirements.',
    completedAgo: 'Completed 2 days ago.',
    thumbnail:
      'linear-gradient(155deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.02)), radial-gradient(circle at 68% 22%, #fff4d7 0 15%, transparent 16%), linear-gradient(135deg, #6f5339 0%, #d0ad7d 45%, #384252 100%)',
  },
]

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

const CompletedTasks = () => {
  return (
    <section className="dashboard-panel completed-panel">
      <div className="panel-head">
        <div className="panel-title">
          <CompletedPanelIcon />
          <h2>Completed Task</h2>
        </div>
      </div>

      <div className="completed-list">
        {completedTasks.map((task) => (
          <article className="task-card task-card--compact" key={task.title}>
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
              <p className="task-card__completed-note">{task.completedAgo}</p>
            </div>

            <div
              className="task-card__thumb"
              aria-hidden="true"
              style={{ background: task.thumbnail }}
            />
          </article>
        ))}
      </div>
    </section>
  )
}

export default CompletedTasks
