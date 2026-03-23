import { useEffect, useMemo, useRef, useState } from 'react'
import type { StoredUser } from '../../../features/auth/authStorage'
import type { LanguageMode } from '../../../features/settings/settingsStorage'
import { t } from '../../../features/settings/translations'
import { useCurrentDate } from '../../../hooks/useCurrentDate'
import BellIcon from '../../../assets/icons/bell-icon.svg'
import Calendar from '../../../assets/icons/calendar-icon.svg'
import Search from '../../../assets/icons/search-icon.svg'
import DateWidget from '../DateWidget/DateWidget'
import Button from '../../ui/Button/Button'
import Input from '../../ui/Input/Input'
import type { AppView } from '../Sidebar/navigation'
import { headerBrandMap } from '../Sidebar/navigation'

type HeaderProps = {
  currentView: AppView
  currentLanguage: LanguageMode
  currentUser: StoredUser | null
  isSidebarOpen: boolean
  onSidebarToggle: () => void
}

type HeaderPopover = 'notifications' | 'calendar' | null

type NotificationItem = {
  id: number
  title: string
  priority: string
  time: string
  thumbnail: string
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Complete the UI design of Landing Page for FoodVentures.',
    priority: 'High',
    time: '2h',
    thumbnail:
      'linear-gradient(135deg, #889163 0%, #dbe2a8 44%, #7d7155 100%)',
  },
  {
    id: 2,
    title: 'Complete the UI design of Landing Page for Travel Days.',
    priority: 'High',
    time: '2h',
    thumbnail:
      'linear-gradient(135deg, #f0f3f8 0%, #ffffff 42%, #d3caea 100%)',
  },
  {
    id: 3,
    title: 'Complete the Mobile app design for Pet Warden.',
    priority: 'Extremely High',
    time: '2h',
    thumbnail:
      'linear-gradient(135deg, #f1f4fb 0%, #ffffff 40%, #c9d7f4 100%)',
  },
  {
    id: 4,
    title: 'Complete the entire design for Juice Slider.',
    priority: 'High',
    time: '2h',
    thumbnail:
      'linear-gradient(135deg, #d72a5b 0%, #f76f4c 46%, #f9d26e 100%)',
  },
]

const weekdayMap: Record<LanguageMode, string[]> = {
  english: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  russian: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
  kazakh: ['ДС', 'СС', 'СР', 'БС', 'ЖМ', 'СБ', 'ЖС'],
}

const localeMap: Record<LanguageMode, string> = {
  english: 'en-US',
  russian: 'ru-RU',
  kazakh: 'kk-KZ',
}

const calendarDays = Array.from({ length: 30 }, (_, index) => index + 1)

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m11.8 4.6-5.2 5.4 5.2 5.4M7 10h6.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 5h13M3.5 10h13M3.5 15h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function WaveIcon() {
  return (
    <svg
      aria-hidden="true"
      className="header-welcome__wave"
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

const menuLabelMap: Record<LanguageMode, string> = {
  english: 'Open menu',
  russian: 'Open menu',
  kazakh: 'Open menu',
}

const Header = ({
  currentView,
  currentLanguage,
  currentUser,
  isSidebarOpen,
  onSidebarToggle,
}: HeaderProps) => {
  const brand = headerBrandMap[currentView]
  const isDashboardView = currentView === 'dashboard'
  const [openPopover, setOpenPopover] = useState<HeaderPopover>(null)
  const toolsRef = useRef<HTMLDivElement | null>(null)
  const currentDate = useCurrentDate()
  const welcomeName = currentUser?.firstName?.trim() || currentUser?.username || 'guest'

  const formattedDate = useMemo(() => {
    const locale = localeMap[currentLanguage]

    return {
      longDate: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(currentDate),
      monthLabel: new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }).format(currentDate),
    }
  }, [currentDate, currentLanguage])

  const dashboardDate = useMemo(() => {
    return {
      weekday: new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(currentDate),
      shortDate: new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(currentDate),
    }
  }, [currentDate])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!toolsRef.current?.contains(event.target as Node)) {
        setOpenPopover(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPopover(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const togglePopover = (popover: Exclude<HeaderPopover, null>) => {
    setOpenPopover((current) => (current === popover ? null : popover))
  }

  return (
    <header className={`header container${isDashboardView ? ' header--dashboard' : ''}`}>
      <div className="header-brand-row">
        <button
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen}
          aria-label={menuLabelMap[currentLanguage]}
          className={`header-menu-toggle${isSidebarOpen ? ' is-active' : ''}`}
          type="button"
          onClick={onSidebarToggle}
        >
          <MenuIcon />
        </button>

        <div className="header-logo" aria-label={currentView}>
          <span>{brand.accent}</span>
          {brand.rest}
        </div>
      </div>

      {isDashboardView ? (
        <div className="header-welcome">
          <p className="header-welcome__eyebrow">{formattedDate.longDate}</p>
          <h1 className="header-welcome__title">
            {t(currentLanguage, 'dashboard.welcome', { name: welcomeName })}
            <WaveIcon />
          </h1>
        </div>
      ) : null}

      <form
        className="header-form"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <div className="header-search">
          <span className="header-search__icon" aria-hidden="true">
            <img src={Search} alt="" />
          </span>
          <Input
            className="header-search__input"
            placeholder={t(currentLanguage, 'header.search')}
            type="search"
          />
        </div>
      </form>

      <div className="header-tools" ref={toolsRef}>
        <div className="header-date">
          <DateWidget date={dashboardDate.shortDate} weekday={dashboardDate.weekday} />
        </div>

        <div className="header-button">
          <div className="header-popover">
            <Button
              aria-expanded={openPopover === 'notifications'}
              aria-haspopup="dialog"
              aria-label={t(currentLanguage, 'header.notifications')}
              className={
                openPopover === 'notifications'
                  ? 'header-icon-trigger is-active'
                  : 'header-icon-trigger'
              }
              onClick={() => {
                togglePopover('notifications')
              }}
            >
              <img src={BellIcon} alt="bell icon" style={{ width: 14, height: 14 }} />
            </Button>

            {openPopover === 'notifications' ? (
              <div
                className="header-card header-card--notifications"
                role="dialog"
                aria-label={t(currentLanguage, 'header.notifications')}
              >
                <div className="header-card__top">
                  <div>
                    <h3 className="header-card__title">
                      {t(currentLanguage, 'header.notifications')}
                    </h3>
                    <p className="header-card__subtitle">
                      {t(currentLanguage, 'common.today')}
                    </p>
                  </div>
                  <button
                    className="header-card__back"
                    type="button"
                    aria-label={t(currentLanguage, 'header.closeNotifications')}
                    onClick={() => {
                      setOpenPopover(null)
                    }}
                  >
                    <BackArrowIcon />
                  </button>
                </div>

                <div className="header-card__scroll">
                  {notifications.map((item) => (
                    <article className="notification-item" key={item.id}>
                      <div className="notification-item__content">
                        <p className="notification-item__title">{item.title}</p>
                        <p className="notification-item__meta">
                          Priority: <strong>{item.priority}</strong>
                          <span>{item.time}</span>
                        </p>
                      </div>
                      <div
                        className="notification-item__thumb"
                        aria-hidden="true"
                        style={{ background: item.thumbnail }}
                      />
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="header-popover">
            <Button
              aria-expanded={openPopover === 'calendar'}
              aria-haspopup="dialog"
              aria-label={t(currentLanguage, 'header.calendar')}
              className={
                openPopover === 'calendar'
                  ? 'header-icon-trigger is-active'
                  : 'header-icon-trigger'
              }
              onClick={() => {
                togglePopover('calendar')
              }}
            >
              <img
                src={Calendar}
                alt="calendar icon"
                style={{ width: 14, height: 14 }}
              />
            </Button>

            {openPopover === 'calendar' ? (
              <div
                className="header-card header-card--calendar"
                role="dialog"
                aria-label={t(currentLanguage, 'header.calendar')}
              >
                <div className="header-card__top header-card__top--calendar">
                  <h3 className="header-card__title">
                    {t(currentLanguage, 'header.calendar')}
                  </h3>
                  <button
                    className="header-card__back"
                    type="button"
                    aria-label={t(currentLanguage, 'header.closeCalendar')}
                    onClick={() => {
                      setOpenPopover(null)
                    }}
                  >
                    <BackArrowIcon />
                  </button>
                </div>

                <div className="calendar-card__head">
                  <button className="calendar-card__date" type="button">
                    {formattedDate.longDate}
                  </button>
                  <button
                    className="calendar-card__close"
                    type="button"
                    onClick={() => setOpenPopover(null)}
                  >
                    x
                  </button>
                </div>

                <div className="calendar-card__month">
                  <button
                    className="calendar-card__nav"
                    type="button"
                    aria-label="Previous month"
                  >
                    <BackArrowIcon />
                  </button>
                  <span>{formattedDate.monthLabel}</span>
                  <button
                    className="calendar-card__nav is-next"
                    type="button"
                    aria-label="Next month"
                  >
                    <BackArrowIcon />
                  </button>
                </div>

                <div className="calendar-card__weekdays">
                  {weekdayMap[currentLanguage].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="calendar-card__grid">
                  <span className="is-empty" />
                  <span className="is-empty" />
                  <span className="is-empty" />
                  <span className="is-empty" />
                  {calendarDays.map((day) => (
                    <button
                      key={day}
                      className={`calendar-card__day${day === 6 ? ' is-selected' : ''}`}
                      type="button"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
