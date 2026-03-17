import { useState } from 'react'

type VitalTask = {
  id: string
  title: string
  shortDescription: string
  priority: string
  priorityColor: string
  status: string
  statusColor: string
  createdAt: string
  thumbnail: string
  detailSummary: string
  detailParagraphs: string[]
  tips: string[]
}

const vitalTasks: VitalTask[] = [
  {
    id: 'walk-the-dog',
    title: 'Walk the dog',
    shortDescription: 'Take the dog to the park and bring treats as well.....',
    priority: 'Extreme',
    priorityColor: '#FF6B61',
    status: 'Not Started',
    statusColor: '#FF5B5B',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)), radial-gradient(circle at 60% 28%, #fff0cb 0 12%, transparent 13%), linear-gradient(135deg, #7e532e 0%, #c89358 42%, #687c48 100%)',
    detailSummary: 'Take the dog to the park and bring treats as well.',
    detailParagraphs: [
      'Take Luffy and Jiro for a leisurely stroll around the neighborhood.',
      'Enjoy the fresh air and give them the exercise and mental stimulation they need for a happy and healthy day.',
      "Don't forget to bring along squeaky and fluffy for some extra fun along the way!",
    ],
    tips: [
      'Listen to a podcast or audiobook',
      'Practice mindfulness or meditation',
      'Take photos of interesting sights along the way',
      'Practice obedience training with your dog',
      'Chat with neighbors or other dog walkers',
      'Listen to music or an upbeat playlist',
    ],
  },
  {
    id: 'hospital',
    title: 'Take grandma to hospital',
    shortDescription: 'Go back home and take grandma to the hospital for a checkup....',
    priority: 'Moderate',
    priorityColor: '#7CB3FF',
    status: 'In Progress',
    statusColor: '#4A5CFF',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(145deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02)), radial-gradient(circle at 56% 24%, #f2fbff 0 11%, transparent 12%), linear-gradient(135deg, #f1f4f8 0%, #d2dde9 40%, #89a0b7 100%)',
    detailSummary: 'Accompany grandma to the hospital and make sure all check-in steps are completed.',
    detailParagraphs: [
      'Prepare her documents before leaving the house.',
      'Confirm the appointment slot and transport route in advance.',
      'Stay with her during registration and note down any doctor instructions.',
    ],
    tips: [
      'Carry water and snacks',
      'Keep emergency contact numbers available',
      'Double-check prescriptions before returning home',
    ],
  },
]

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

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5.5 6.5v7.8c0 .9.7 1.7 1.7 1.7h5.6c.9 0 1.7-.8 1.7-1.7V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 5h12M7.5 5V3.8c0-.4.3-.8.8-.8h3.4c.4 0 .8.4.8.8V5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 9v4M11.5 9v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m4 13.7 8.9-8.9a1.8 1.8 0 0 1 2.5 0l.8.8a1.8 1.8 0 0 1 0 2.5L7.3 17H4v-3.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 6.2 14 8.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

const VitalTaskPage = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(vitalTasks[0].id)
  const selectedTask =
    vitalTasks.find((task) => task.id === selectedTaskId) ?? vitalTasks[0]

  return (
    <div className="my-task-layout">
      <section className="dashboard-panel my-task-panel my-task-list-panel">
        <h2 className="section-title">Vital Tasks</h2>

        <div className="my-task-list">
          {vitalTasks.map((task) => (
            <button
              key={task.id}
              className={`my-task-card${selectedTask.id === task.id ? ' is-active' : ''}`}
              type="button"
              onClick={() => {
                setSelectedTaskId(task.id)
              }}
            >
              <OverflowIcon />
              <div className="my-task-card__content">
                <div className="my-task-card__title-row">
                  <span
                    className="task-card__indicator"
                    aria-hidden="true"
                    style={{ borderColor: task.statusColor }}
                  />
                  <div>
                    <h3 className="my-task-card__title">{task.title}</h3>
                    <p className="my-task-card__description">{task.shortDescription}</p>
                  </div>
                </div>

                <div className="my-task-card__footer">
                  <span>
                    Priority:{' '}
                    <strong style={{ color: task.priorityColor }}>{task.priority}</strong>
                  </span>
                  <span>
                    Status: <strong style={{ color: task.statusColor }}>{task.status}</strong>
                  </span>
                  <span>Created on: {task.createdAt}</span>
                </div>
              </div>

              <div
                className="my-task-card__thumb"
                aria-hidden="true"
                style={{ background: task.thumbnail }}
              />
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-panel my-task-panel my-task-detail-panel">
        <div className="my-task-detail__hero">
          <div
            className="my-task-detail__image"
            aria-hidden="true"
            style={{ background: selectedTask.thumbnail }}
          />

          <div className="my-task-detail__summary">
            <h2>{selectedTask.title}</h2>
            <p>
              Priority: <strong style={{ color: selectedTask.priorityColor }}>{selectedTask.priority}</strong>
            </p>
            <p>
              Status: <strong style={{ color: selectedTask.statusColor }}>{selectedTask.status}</strong>
            </p>
            <span>Created on: {selectedTask.createdAt}</span>
          </div>
        </div>

        <div className="my-task-detail__body">
          <p>{selectedTask.detailSummary}</p>
          <div className="my-task-detail__paragraphs">
            {selectedTask.detailParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ol className="my-task-detail__tips">
            {selectedTask.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ol>
        </div>

        <div className="my-task-detail__actions">
          <button className="my-task-detail__action" type="button" aria-label="Delete task">
            <TrashIcon />
          </button>
          <button className="my-task-detail__action" type="button" aria-label="Edit task">
            <EditIcon />
          </button>
        </div>
      </section>
    </div>
  )
}

export default VitalTaskPage
