import type { StoredUser } from '../auth/authStorage'
import { formatCalendarValue, parseCalendarValue, startOfCalendarDay } from '../calendar/calendarUtils'

const DISMISS_KEY_PREFIX = 'dailydeen.birthday-greeting.dismissed'

export function isBirthdayCalendarDate(
  birthDateValue: string | null | undefined,
  date: Date,
  exactYear = false,
) {
  if (!birthDateValue) {
    return false
  }

  const birthDate = parseCalendarValue(birthDateValue)

  if (!birthDate) {
    return false
  }

  if (exactYear) {
    return (
      birthDate.getFullYear() === date.getFullYear() &&
      birthDate.getMonth() === date.getMonth() &&
      birthDate.getDate() === date.getDate()
    )
  }

  return (
    birthDate.getMonth() === date.getMonth() &&
    birthDate.getDate() === date.getDate()
  )
}

export function isBirthdayToday(user: StoredUser | null, now = new Date()) {
  return isBirthdayCalendarDate(user?.birthDate, now)
}

function getDismissKey(userId: string, now = new Date()) {
  const dayStamp = formatCalendarValue(startOfCalendarDay(now))

  return `${DISMISS_KEY_PREFIX}.${userId}.${dayStamp}`
}

export function isBirthdayGreetingDismissed(userId: string, now = new Date()) {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(getDismissKey(userId, now)) === '1'
}

export function dismissBirthdayGreeting(userId: string, now = new Date()) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(getDismissKey(userId, now), '1')
}
