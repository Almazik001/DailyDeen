import { useEffect, useMemo, useRef, useState } from 'react'
import { getApiErrorMessage } from '../../../api/apiClient'
import type { StoredUser } from '../../../features/auth/authStorage'
import {
  isBirthdayCalendarDate,
  isBirthdayToday,
} from '../../../features/birthday/birthdayGreeting'
import {
  loadTaskNotifications,
  type TaskNotificationItem,
} from '../../../features/notifications/taskNotifications'
import {
  buildCalendarCells,
  canNavigateCalendarMonth,
  formatCalendarLongDate,
  formatCalendarMonthLabel,
  shiftCalendarMonth,
  startOfCalendarMonth,
} from '../../../features/calendar/calendarUtils'
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

type HeaderProps = {
  currentView: AppView
  currentLanguage: LanguageMode
  currentUser: StoredUser | null
  isSidebarOpen: boolean
  onSidebarToggle: () => void
}

type HeaderPopover = 'notifications' | 'calendar' | null

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

const brandAccentLengthMap: Record<AppView, number> = {
  dashboard: 4,
  'vital-task': 4,
  'my-task': 3,
  'task-categories': 3,
  settings: 3,
  help: 3,
}

function getBrandParts(label: string, view: AppView) {
  const normalized = label.trim()
  const accentLength = Math.min(brandAccentLengthMap[view], normalized.length)

  return {
    accent: normalized.slice(0, accentLength),
    rest: normalized.slice(accentLength),
  }
}

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

const Header = ({
  currentView,
  currentLanguage,
  currentUser,
  isSidebarOpen,
  onSidebarToggle,
}: HeaderProps) => {
  const isDashboardView = currentView === 'dashboard'
  const [openPopover, setOpenPopover] = useState<HeaderPopover>(null)
  const [notificationItems, setNotificationItems] = useState<TaskNotificationItem[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationsError, setNotificationsError] = useState('')
  const [calendarViewDate, setCalendarViewDate] = useState(() =>
    startOfCalendarMonth(new Date()),
  )
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | null>(null)
  const toolsRef = useRef<HTMLDivElement | null>(null)
  const currentDate = useCurrentDate()
  const welcomeName =
    currentUser?.firstName?.trim() ||
    currentUser?.username ||
    t(currentLanguage, 'common.guest')
  const isBirthdayCelebration = isDashboardView && isBirthdayToday(currentUser, currentDate)

  const brand = useMemo(
    () => getBrandParts(t(currentLanguage, `sidebar.${currentView}`), currentView),
    [currentLanguage, currentView],
  )

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
    const locale = localeMap[currentLanguage]

    return {
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(currentDate),
      shortDate: new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(currentDate),
    }
  }, [currentDate, currentLanguage])

  const activeCalendarDate = calendarSelectedDate ?? currentDate
  const calendarMonthLabel = useMemo(
    () => formatCalendarMonthLabel(calendarViewDate, currentLanguage),
    [calendarViewDate, currentLanguage],
  )
  const calendarLongDate = useMemo(
    () => formatCalendarLongDate(activeCalendarDate, currentLanguage),
    [activeCalendarDate, currentLanguage],
  )
  const calendarCells = useMemo(
    () =>
      buildCalendarCells({
        viewDate: calendarViewDate,
        selectedDate: activeCalendarDate,
        currentDate,
      }),
    [activeCalendarDate, calendarViewDate, currentDate],
  )

  const hasNotifications = notificationItems.length > 0
  const canGoToPreviousCalendarMonth = useMemo(
    () => canNavigateCalendarMonth(calendarViewDate, -1),
    [calendarViewDate],
  )
  const canGoToNextCalendarMonth = useMemo(
    () => canNavigateCalendarMonth(calendarViewDate, 1),
    [calendarViewDate],
  )

  useEffect(() => {
    if (openPopover !== 'notifications' || !currentUser) {
      return
    }

    let isCancelled = false

    const fetchNotifications = async () => {
      setNotificationsLoading(true)
      setNotificationsError('')

      try {
        const items = await loadTaskNotifications(currentLanguage)

        if (isCancelled) {
          return
        }

        setNotificationItems(items)
      } catch (error) {
        if (isCancelled) {
          return
        }

        setNotificationsError(
          getApiErrorMessage(error, t(currentLanguage, 'header.notificationsError')),
        )
      } finally {
        if (!isCancelled) {
          setNotificationsLoading(false)
        }
      }
    }

    void fetchNotifications()

    return () => {
      isCancelled = true
    }
  }, [currentLanguage, currentUser, openPopover])

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

  const handleCalendarToggle = () => {
    if (openPopover === 'calendar') {
      setOpenPopover(null)
      return
    }

    setCalendarViewDate(startOfCalendarMonth(currentDate))
    setCalendarSelectedDate(null)
    setOpenPopover('calendar')
  }

  return (
    <header className={`header container${isDashboardView ? ' header--dashboard' : ''}`}>
      <div className="header-brand-row">
        <button
          aria-controls="app-sidebar"
          aria-expanded={isSidebarOpen}
          aria-label={t(currentLanguage, 'header.openMenu')}
          className={`header-menu-toggle${isSidebarOpen ? ' is-active' : ''}`}
          type="button"
          onClick={onSidebarToggle}
        >
          <MenuIcon />
        </button>

        <div className="header-logo" aria-label={t(currentLanguage, `sidebar.${currentView}`)}>
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
          <DateWidget
            date={dashboardDate.shortDate}
            weekday={dashboardDate.weekday}
            isBirthday={isBirthdayCelebration}
          />
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
              <img src={BellIcon} alt="" style={{ width: 14, height: 14 }} />
              {hasNotifications ? (
                <span className="header-icon-badge" aria-hidden="true">
                  {notificationItems.length > 9 ? '9+' : notificationItems.length}
                </span>
              ) : null}
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
                    {hasNotifications ? (
                      <p className="header-card__subtitle">
                        {t(currentLanguage, 'common.today')}
                      </p>
                    ) : null}
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
                  {hasNotifications ? (
                    notificationItems.map((item) => (
                      <article className="notification-item" key={item.id}>
                        <div className="notification-item__content">
                          <p className="notification-item__title">{item.title}</p>
                          <p className="notification-item__meta">
                            {t(currentLanguage, 'task.priority')}: <strong>{item.priority}</strong>
                            <span>{item.time}</span>
                          </p>
                        </div>
                        <div
                          className="notification-item__thumb"
                          aria-hidden="true"
                          style={{ background: item.thumbnail }}
                        />
                      </article>
                    ))
                  ) : notificationsLoading ? (
                    <p className="header-card__empty">
                      {t(currentLanguage, 'header.loadingNotifications')}
                    </p>
                  ) : notificationsError ? (
                    <p className="header-card__empty">{notificationsError}</p>
                  ) : (
                    <p className="header-card__empty">
                      {t(currentLanguage, 'header.noNotifications')}
                    </p>
                  )}
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
                handleCalendarToggle()
              }}
            >
              <img src={Calendar} alt="" style={{ width: 14, height: 14 }} />
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
                  <button
                    className="calendar-card__date"
                    type="button"
                    onClick={() => {
                      setCalendarViewDate(startOfCalendarMonth(currentDate))
                      setCalendarSelectedDate(null)
                    }}
                  >
                    {calendarLongDate}
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
                    aria-label={t(currentLanguage, 'header.previousMonth')}
                    disabled={!canGoToPreviousCalendarMonth}
                    onClick={() => {
                      setCalendarViewDate((current) => shiftCalendarMonth(current, -1))
                    }}
                  >
                    <BackArrowIcon />
                  </button>
                  <span>{calendarMonthLabel}</span>
                  <button
                    className="calendar-card__nav is-next"
                    type="button"
                    aria-label={t(currentLanguage, 'header.nextMonth')}
                    disabled={!canGoToNextCalendarMonth}
                    onClick={() => {
                      setCalendarViewDate((current) => shiftCalendarMonth(current, 1))
                    }}
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
                  {calendarCells.map((cell) => {
                    if (!cell.date) {
                      return <span key={cell.key} className="is-empty" />
                    }

                    const isBirthdayCell =
                      isDashboardView &&
                      isBirthdayCalendarDate(currentUser?.birthDate, cell.date)

                    return (
                      <button
                        key={cell.key}
                        className={`calendar-card__day${cell.isSelected ? ' is-selected' : ''}${
                          cell.isToday ? ' is-today' : ''
                        }${isBirthdayCell ? ' is-birthday' : ''}`}
                        data-birthday-label={
                          isBirthdayCell ? t(currentLanguage, 'header.birthdayHint') : undefined
                        }
                        type="button"
                        onClick={() => {
                          setCalendarSelectedDate(cell.date)
                        }}
                      >
                        {cell.dayNumber}
                      </button>
                    )
                  })}
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
