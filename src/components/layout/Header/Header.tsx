import { useEffect, useRef, useState } from 'react'
import Button from '../../ui/Button/Button'
import Input from '../../ui/Input/Input'
import BellIcon from '../../../assets/icons/bell-icon.svg'
import Calendar from '../../../assets/icons/calendar-icon.svg'
import Search from '../../../assets/icons/search-icon.svg'
import type { AppView } from '../Sidebar/navigation'
import { headerBrandMap } from '../Sidebar/navigation'
import './Header.module.scss'

type HeaderProps = {
  currentView: AppView
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

const Header = ({ currentView }: HeaderProps) => {
  const brand = headerBrandMap[currentView]
  const [openPopover, setOpenPopover] = useState<HeaderPopover>(null)
  const toolsRef = useRef<HTMLDivElement | null>(null)

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
    <header className="header container">
      <div className="header-logo" aria-label={currentView}>
        <span>{brand.accent}</span>
        {brand.rest}
      </div>

      <form
        className="header-form"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <Input placeholder="Search your task here..." />
        <Button aria-label="Search">
          <img src={Search} alt="search icon" style={{ width: 14, height: 14 }} />
        </Button>
      </form>

      <div className="header-tools" ref={toolsRef}>
        <div className="header-button">
          <div className="header-popover">
            <Button
              aria-expanded={openPopover === 'notifications'}
              aria-haspopup="dialog"
              aria-label="Notifications"
              className={openPopover === 'notifications' ? 'header-icon-trigger is-active' : 'header-icon-trigger'}
              onClick={() => {
                togglePopover('notifications')
              }}
            >
              <img src={BellIcon} alt="bell icon" style={{ width: 14, height: 14 }} />
            </Button>

            {openPopover === 'notifications' ? (
              <div className="header-card header-card--notifications" role="dialog" aria-label="Notifications">
                <div className="header-card__top">
                  <div>
                    <h3 className="header-card__title">Notifications</h3>
                    <p className="header-card__subtitle">Today</p>
                  </div>
                  <button
                    className="header-card__back"
                    type="button"
                    aria-label="Close notifications"
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
              aria-label="Calendar"
              className={openPopover === 'calendar' ? 'header-icon-trigger is-active' : 'header-icon-trigger'}
              onClick={() => {
                togglePopover('calendar')
              }}
            >
              <img src={Calendar} alt="calendar icon" style={{ width: 14, height: 14 }} />
            </Button>

            {openPopover === 'calendar' ? (
              <div className="header-card header-card--calendar" role="dialog" aria-label="Calendar">
                <div className="header-card__top header-card__top--calendar">
                  <h3 className="header-card__title">Calendar</h3>
                  <button
                    className="header-card__back"
                    type="button"
                    aria-label="Close calendar"
                    onClick={() => {
                      setOpenPopover(null)
                    }}
                  >
                    <BackArrowIcon />
                  </button>
                </div>

                <div className="calendar-card__head">
                  <button className="calendar-card__date" type="button">
                    June 6, 2023
                  </button>
                  <button className="calendar-card__close" type="button" onClick={() => setOpenPopover(null)}>
                    x
                  </button>
                </div>

                <div className="calendar-card__month">
                  <button className="calendar-card__nav" type="button" aria-label="Previous month">
                    <BackArrowIcon />
                  </button>
                  <span>June 2023</span>
                  <button className="calendar-card__nav is-next" type="button" aria-label="Next month">
                    <BackArrowIcon />
                  </button>
                </div>

                <div className="calendar-card__weekdays">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
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

        <div className="header-data">
          <p>Tuesday</p>
          <span>20/06/2023</span>
        </div>
      </div>
    </header>
  )
}

export default Header
