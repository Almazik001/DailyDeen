import { useEffect, useState } from 'react'
import type { ApiTask } from '../../../api/types'
import {
  loadDashboardData,
  type DashboardStatusItem,
} from '../../../features/tasks/dashboardData'
import type { LanguageMode } from '../../../features/settings/settingsStorage'
import { t } from '../../../features/settings/translations'
import InviteMembersModal from '../../../features/invite-members/InviteMembersModal'
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

type DashboardHomeProps = {
  language: LanguageMode
}

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

const DashboardHome = ({ language }: DashboardHomeProps) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [statusItems, setStatusItems] = useState<DashboardStatusItem[]>([
    { label: 'Completed', count: 0, value: 0, color: '#57AE35' },
    { label: 'In Progress', count: 0, value: 0, color: '#4A47F5' },
    { label: 'Not Started', count: 0, value: 0, color: '#E04B3F' },
  ])
  const [totalTasks, setTotalTasks] = useState(0)
  const [completedTasks, setCompletedTasks] = useState<ApiTask[]>([])

  useEffect(() => {
    const syncDashboardData = async () => {
      try {
        const data = await loadDashboardData()
        setStatusItems(data.statusSummary)
        setTotalTasks(data.totalTasks)
        setCompletedTasks(data.completedTasks)
      } catch {
        setStatusItems([
          { label: 'Completed', count: 0, value: 0, color: '#57AE35' },
          { label: 'In Progress', count: 0, value: 0, color: '#4A47F5' },
          { label: 'Not Started', count: 0, value: 0, color: '#E04B3F' },
        ])
        setTotalTasks(0)
        setCompletedTasks([])
      }
    }

    void syncDashboardData()
  }, [])

  return (
    <>
      <div className="dashboard-topbar">
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
            {t(language, 'dashboard.invite')}
          </button>
        </div>
      </div>

      <div className="dashboard-main">
        <TodoSection language={language} />
        <TaskStatus
          completedTasks={completedTasks}
          items={statusItems}
          language={language}
          totalTasks={totalTasks}
        />
      </div>

      {isInviteOpen ? (
        <InviteMembersModal
          language={language}
          onClose={() => {
            setIsInviteOpen(false)
          }}
        />
      ) : null}
    </>
  )
}

export default DashboardHome
