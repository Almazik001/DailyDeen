import { useEffect, useState } from 'react'

function getMsUntilNextMinute(date: Date) {
  const seconds = date.getSeconds() * 1000
  const milliseconds = date.getMilliseconds()

  return 60_000 - seconds - milliseconds
}

function isSameMinute(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate() &&
    left.getHours() === right.getHours() &&
    left.getMinutes() === right.getMinutes()
  )
}

export function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    let intervalId: ReturnType<typeof window.setInterval> | null = null

    const syncCurrentDate = () => {
      setCurrentDate((previousDate) => {
        const nextDate = new Date()

        if (isSameMinute(previousDate, nextDate)) {
          return previousDate
        }

        return nextDate
      })
    }

    const timeoutId = window.setTimeout(() => {
      syncCurrentDate()

      intervalId = window.setInterval(() => {
        syncCurrentDate()
      }, 60_000)
    }, getMsUntilNextMinute(new Date()))

    return () => {
      window.clearTimeout(timeoutId)

      if (intervalId !== null) {
        window.clearInterval(intervalId)
      }
    }
  }, [])

  return currentDate
}
