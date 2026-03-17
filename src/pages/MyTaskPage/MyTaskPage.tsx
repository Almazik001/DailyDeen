import { useState } from 'react'

type MyTaskItem = {
  id: string
  title: string
  shortDescription: string
  priority: string
  priorityColor: string
  status: string
  statusColor: string
  createdAt: string
  thumbnail: string
  taskTitle: string
  objective: string
  taskDescription: string[]
  additionalNotes: string[]
  deadline: string
}

const myTasks: MyTaskItem[] = [
  {
    id: 'submit-documents',
    title: 'Submit Documents',
    shortDescription: 'Make sure to submit all the necessary documents on time.',
    priority: 'Extreme',
    priorityColor: '#FF6B61',
    status: 'Not Started',
    statusColor: '#FF5B5B',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02)), radial-gradient(circle at 62% 28%, #dceac9 0 11%, transparent 12%), linear-gradient(135deg, #a7b18e 0%, #e8eef5 48%, #c3d3e4 100%)',
    taskTitle: 'Document Submission.',
    objective:
      'To submit required documents for something important.',
    taskDescription: [
      'Review the list of documents required for submission and ensure all necessary documents are ready.',
      'Organize the documents accordingly and scan them if physical copies need to be submitted digitally.',
      'Rename the scanned files appropriately for easy identification and verify the accepted file formats.',
      'Upload the documents securely to the designated platform, double-check for accuracy, and obtain confirmation of successful submission.',
      'Follow up if necessary to ensure proper processing.',
    ],
    additionalNotes: [
      'Ensure that the documents are authentic and up-to-date.',
      'Maintain confidentiality and security of sensitive information during the submission process.',
      'If there are specific guidelines or deadlines for submission, adhere to them diligently.',
    ],
    deadline: 'End of Day',
  },
  {
    id: 'complete-assignments',
    title: 'Complete assignments',
    shortDescription: 'The assignments must be completed to pass final year exams.',
    priority: 'Moderate',
    priorityColor: '#7CB3FF',
    status: 'In Progress',
    statusColor: '#4A5CFF',
    createdAt: '20/06/2023',
    thumbnail:
      'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03)), radial-gradient(circle at 50% 26%, #eff7ff 0 12%, transparent 13%), linear-gradient(135deg, #dfe7e6 0%, #f8fbff 44%, #8a9a9b 100%)',
    taskTitle: 'Assignment Completion.',
    objective:
      'To finish pending assignments before the submission window closes.',
    taskDescription: [
      'List all remaining assignments and estimate the time required for each one.',
      'Focus on high-priority work first and break the rest into smaller checkpoints.',
      'Review feedback from previous submissions to avoid repeating the same mistakes.',
      'Submit each assignment and keep proof of successful upload.',
    ],
    additionalNotes: [
      'Check plagiarism and formatting requirements before final submission.',
      'Ask for clarification early if any task instructions are unclear.',
    ],
    deadline: 'Before final year review',
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

const MyTaskPage = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(myTasks[0].id)
  const selectedTask =
    myTasks.find((task) => task.id === selectedTaskId) ?? myTasks[0]

  return (
    <div className="my-task-layout">
      <section className="dashboard-panel my-task-panel my-task-list-panel">
        <h2 className="section-title">My Tasks</h2>

        <div className="my-task-list">
          {myTasks.map((task) => (
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
          <p>
            <strong>Task Title:</strong> {selectedTask.taskTitle}
          </p>
          <p>
            <strong>Objective:</strong> {selectedTask.objective}
          </p>
          <div>
            <p>
              <strong>Task Description:</strong>
            </p>
            <div className="my-task-detail__paragraphs">
              {selectedTask.taskDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <p>
              <strong>Additional Notes:</strong>
            </p>
            <ul className="my-task-detail__notes">
              {selectedTask.additionalNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <p>
            <strong>Deadline for Submission:</strong> {selectedTask.deadline}
          </p>
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

export default MyTaskPage
