import { memo } from 'react'
import styles from './DateWidget.module.scss'

type DateWidgetProps = {
  weekday: string
  date: string
}

const DateWidget = ({ weekday, date }: DateWidgetProps) => {
  return (
    <div className={styles.dateWidget} aria-live="polite">
      <p className={styles.weekday}>{weekday}</p>
      <span className={styles.date}>{date}</span>
    </div>
  )
}

export default memo(DateWidget)
