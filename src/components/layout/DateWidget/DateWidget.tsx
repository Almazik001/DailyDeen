import { memo } from 'react'
import styles from './DateWidget.module.scss'

type DateWidgetProps = {
  weekday: string
  date: string
  isBirthday?: boolean
}

const DateWidget = ({ weekday, date, isBirthday = false }: DateWidgetProps) => {
  return (
    <div
      className={`${styles.dateWidget}${isBirthday ? ` ${styles.dateWidgetBirthday}` : ''}`}
      aria-live="polite"
    >
      {isBirthday ? (
        <>
          <span className={`${styles.burst} ${styles.burstLeft}`} aria-hidden="true" />
          <span className={`${styles.burst} ${styles.burstRight}`} aria-hidden="true" />
          <span className={styles.glow} aria-hidden="true" />
        </>
      ) : null}
      <p className={styles.weekday}>{weekday}</p>
      <span className={styles.date}>{date}</span>
    </div>
  )
}

export default memo(DateWidget)
