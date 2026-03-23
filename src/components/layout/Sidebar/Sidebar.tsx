import type { StoredUser } from '../../../features/auth/authStorage'
import type { LanguageMode } from '../../../features/settings/settingsStorage'
import { getSidebarLabel, t } from '../../../features/settings/translations'
import type { AppView } from './navigation'
import { sidebarItems } from './navigation'
import './Sidebar.module.scss'

type SidebarProps = {
  activeView: AppView
  onNavigate: (view: AppView) => void
  onLogout: () => void
  currentUser: StoredUser | null
  currentLanguage: LanguageMode
  isOpen: boolean
  onClose: () => void
}

function ProfileAvatar({
  letter,
  avatarUrl,
}: {
  letter: string
  avatarUrl?: string | null
}) {
  return (
    <div className="sidebar__avatar" aria-hidden="true">
      {avatarUrl ? (
        <div
          className="sidebar__avatar-image"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
      ) : (
        <div className="sidebar__avatar-core">{letter}</div>
      )}
    </div>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3 3h6v6H3zM11 3h6v4h-6zM11 9h6v8h-6zM3 11h6v6H3z" />
    </svg>
  )
}

function VitalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5c1.5 0 2.7 1.2 2.7 2.7 0 1.1-.6 2-1.5 2.4l.7 5.5H8.1l.7-5.5A2.7 2.7 0 0 1 10 2.5ZM10 14.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MyTaskIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6 8h4M6 11h6M6 5.5h2.5M11.5 6.2l1.3 1.3 2.6-2.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CategoriesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.5 5H16M6.5 10H16M6.5 15H16M3.5 4.3l1.4 1.4M3.5 9.3l1.4 1.4M3.5 14.3l1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 4.2 11.5 3l2 1 .1 1.9a5.8 5.8 0 0 1 1.2.7l1.8-.6 1 2-1.2 1.3c.1.4.1.8.1 1.2s0 .8-.1 1.2l1.2 1.3-1 2-1.8-.6c-.4.3-.8.5-1.2.7L13.5 17l-2 1-1.5-1.2c-.5.1-1 .1-1.5 0L7 18l-2-1-.1-1.9a5.7 5.7 0 0 1-1.2-.7l-1.8.6-1-2 1.2-1.3a7.7 7.7 0 0 1 0-2.4L.9 8l1-2 1.8.6c.4-.3.8-.5 1.2-.7L5 4l2-1 1.5 1.2c.5-.1 1-.1 1.5 0Z"
        fill="currentColor"
      />
      <circle cx="10" cy="10" r="2.4" fill="#050505" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="currentColor" />
      <path
        d="M8.4 7.5a1.8 1.8 0 1 1 3 1.4c-.7.5-1.1.9-1.1 1.8M10 13.8h.1"
        stroke="#050505"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M8 3.5H5A1.5 1.5 0 0 0 3.5 5v10A1.5 1.5 0 0 0 5 16.5h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 6.5 15 10l-4 3.5M15 10H7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SidebarIcon({ view }: { view: AppView }) {
  if (view === 'dashboard') return <DashboardIcon />
  if (view === 'vital-task') return <VitalIcon />
  if (view === 'my-task') return <MyTaskIcon />
  if (view === 'task-categories') return <CategoriesIcon />
  if (view === 'settings') return <SettingsIcon />

  return <HelpIcon />
}

const Sidebar = ({
  activeView,
  onNavigate,
  onLogout,
  currentUser,
  currentLanguage,
  isOpen,
  onClose,
}: SidebarProps) => {
  const displayName = currentUser?.username ?? t(currentLanguage, 'common.guest')
  const displayEmail = currentUser?.email ?? t(currentLanguage, 'settings.noEmail')
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'G'
  const avatarUrl = currentUser?.avatarUrl

  return (
    <aside className={`sidebar${isOpen ? ' is-open' : ''}`} id="app-sidebar">
      <div className="sidebar__mobile-head">
        <span className="sidebar__mobile-title">{t(currentLanguage, 'sidebar.menu')}</span>
        <button
          aria-label={t(currentLanguage, 'sidebar.closeMenu')}
          className="sidebar__close"
          type="button"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="sidebar__profile">
        <ProfileAvatar avatarUrl={avatarUrl} letter={avatarLetter} />
        <div className="sidebar__name">{displayName}</div>
        <div className="sidebar__email">{displayEmail}</div>
      </div>

      <nav className="sidebar__nav" aria-label={t(currentLanguage, 'sidebar.navigation')}>
        {sidebarItems.map((item) => (
          <button
            key={item.view}
            className={`sidebar__item${activeView === item.view ? ' is-active' : ''}`}
            type="button"
            onClick={() => {
              onNavigate(item.view)
            }}
          >
            <span className="sidebar__item-icon">
              <SidebarIcon view={item.view} />
            </span>
            <span>{getSidebarLabel(currentLanguage, item.view)}</span>
          </button>
        ))}
      </nav>

      <button className="sidebar__logout" type="button" onClick={onLogout}>
        <span className="sidebar__item-icon">
          <LogoutIcon />
        </span>
        <span>{t(currentLanguage, 'sidebar.logout')}</span>
      </button>
    </aside>
  )
}

export default Sidebar
