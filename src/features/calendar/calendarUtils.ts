import type { LanguageMode } from '../settings/settingsStorage'

export type CalendarCell = {
  key: string
  date: Date | null
  dayNumber: number | null
  isCurrentMonth: boolean
  isSelected: boolean
  isToday: boolean
  isDisabled: boolean
}

const localeMap: Record<LanguageMode, string> = {
  english: 'en-US',
  russian: 'ru-RU',
  kazakh: 'kk-KZ',
}

const weekdayMap: Record<LanguageMode, string[]> = {
  english: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  russian: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
  kazakh: ['ДС', 'СС', 'СР', 'БС', 'ЖМ', 'СБ', 'ЖС'],
}

export function startOfCalendarDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function startOfCalendarMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function shiftCalendarMonth(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function isSameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

export function parseCalendarValue(value?: string | null) {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('T')[0].split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

export function formatCalendarValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function formatCalendarLongDate(date: Date, language: LanguageMode) {
  return new Intl.DateTimeFormat(localeMap[language], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatCalendarMonthLabel(date: Date, language: LanguageMode) {
  return new Intl.DateTimeFormat(localeMap[language], {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function getCalendarMonthNames(language: LanguageMode) {
  return Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat(localeMap[language], {
      month: 'long',
    }).format(new Date(2026, month, 1)),
  )
}

export function getCalendarWeekdayLabels(language: LanguageMode) {
  return weekdayMap[language] ?? weekdayMap.english
}

function isDateBefore(left: Date, right: Date) {
  return startOfCalendarDay(left).getTime() < startOfCalendarDay(right).getTime()
}

function isDateAfter(left: Date, right: Date) {
  return startOfCalendarDay(left).getTime() > startOfCalendarDay(right).getTime()
}

export function canNavigateCalendarMonth(
  viewDate: Date,
  amount: number,
  minDate?: Date | null,
  maxDate?: Date | null,
) {
  const nextMonth = shiftCalendarMonth(viewDate, amount)

  if (minDate) {
    const minMonth = startOfCalendarMonth(minDate)

    if (nextMonth.getTime() < minMonth.getTime()) {
      return false
    }
  }

  if (maxDate) {
    const maxMonth = startOfCalendarMonth(maxDate)

    if (nextMonth.getTime() > maxMonth.getTime()) {
      return false
    }
  }

  return true
}

export function buildCalendarCells({
  viewDate,
  selectedDate,
  currentDate,
  minDate,
  maxDate,
}: {
  viewDate: Date
  selectedDate?: Date | null
  currentDate?: Date
  minDate?: Date | null
  maxDate?: Date | null
}) {
  const monthStart = startOfCalendarMonth(viewDate)
  const month = monthStart.getMonth()
  const year = monthStart.getFullYear()
  const firstWeekday = (monthStart.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const safeToday = currentDate ? startOfCalendarDay(currentDate) : null
  const safeSelectedDate = selectedDate ? startOfCalendarDay(selectedDate) : null
  const safeMinDate = minDate ? startOfCalendarDay(minDate) : null
  const safeMaxDate = maxDate ? startOfCalendarDay(maxDate) : null

  return Array.from({ length: totalCells }, (_, index): CalendarCell => {
    const dayNumber = index - firstWeekday + 1

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return {
        key: `empty-${year}-${month}-${index}`,
        date: null,
        dayNumber: null,
        isCurrentMonth: false,
        isSelected: false,
        isToday: false,
        isDisabled: true,
      }
    }

    const date = new Date(year, month, dayNumber)
    const isDisabled =
      (safeMinDate ? isDateBefore(date, safeMinDate) : false) ||
      (safeMaxDate ? isDateAfter(date, safeMaxDate) : false)

    return {
      key: formatCalendarValue(date),
      date,
      dayNumber,
      isCurrentMonth: true,
      isSelected: safeSelectedDate ? isSameCalendarDay(date, safeSelectedDate) : false,
      isToday: safeToday ? isSameCalendarDay(date, safeToday) : false,
      isDisabled,
    }
  })
}
