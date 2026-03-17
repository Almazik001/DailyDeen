import { useState } from 'react'
import InviteMembersModal from '../../../features/invite-members/InviteMembersModal'
import CompletedTasks from '../CompletedTasks/CompletedTasks'
import TaskStatus from '../TaskStatus/TaskStatus'
import TodoSection from '../TodoSection/TodoSection'
import './DashboardHome.module.scss'

type TeamMember = {
  label: string
  background: string
}

const teamMembers: TeamMember[] = [
  {
    label: 'AN',
    background:
      'linear-gradient(135deg, #4d2f1e 0%, #8d5632 45%, #1d222d 100%)',
  },
  {
    label: 'JA',
    background:
      'linear-gradient(135deg, #b99059 0%, #f0d4ae 42%, #6a503b 100%)',
  },
  {
    label: 'MK',
    background:
      'linear-gradient(135deg, #181b22 0%, #394254 48%, #90a4c5 100%)',
  },
  {
    label: 'TI',
    background:
      'linear-gradient(135deg, #9d8c70 0%, #d6cfbf 48%, #58514a 100%)',
  },
  {
    label: '+4',
    background:
      'linear-gradient(135deg, #34353c 0%, #5c5f67 50%, #17181c 100%)',
  },
]

function InviteIcon() {
  return (
    <svg
      aria-hidden="true"
      className="invite-button__icon"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.2 9.2a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
      <path d="M2.8 14.5c.7-1.7 2.1-2.6 4.1-2.6s3.4.9 4.1 2.6" />
      <path d="M13.2 7.1h4.1" />
      <path d="M15.25 5v4.1" />
    </svg>
  )
}

function WaveIcon() {
  return (
    <svg
      aria-hidden="true"
      className="welcome-bar__wave"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.8 3.7c-.4 0-.8.3-.8.8v6" />
      <path d="M15.6 5.5c-.4 0-.8.3-.8.8v4.4" />
      <path d="M18.4 7.6c-.4 0-.8.3-.8.8v3.1" />
      <path d="M10 2.8c-.4 0-.8.3-.8.8v7.1l-1.7-1.5a1.5 1.5 0 0 0-2.1.1c-.5.6-.5 1.5.1 2.1l4.8 5.3a3.8 3.8 0 0 0 2.8 1.2h2.2c2.4 0 4.4-2 4.4-4.4v-3.3" />
    </svg>
  )
}

const DashboardHome = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  return (
    <>
      <div className="welcome-bar">
        <h1 className="welcome-bar__title">
          Welcome back, amanuel
          <WaveIcon />
        </h1>

        <div className="team-strip">
          <div className="team-strip__avatars" aria-hidden="true">
            {teamMembers.map((member) => (
              <div
                key={member.label}
                className={`team-strip__avatar${member.label.startsWith('+') ? ' is-count' : ''}`}
                style={{ background: member.background }}
              >
                {member.label}
              </div>
            ))}
          </div>

          <button
            className="invite-button"
            type="button"
            onClick={() => {
              setIsInviteOpen(true)
            }}
          >
            <InviteIcon />
            Invite
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <TodoSection />

        <div className="dashboard-sidebar">
          <TaskStatus />
          <CompletedTasks />
        </div>
      </div>

      {isInviteOpen ? (
        <InviteMembersModal
          onClose={() => {
            setIsInviteOpen(false)
          }}
        />
      ) : null}
    </>
  )
}

export default DashboardHome
