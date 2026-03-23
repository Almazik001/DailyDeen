import type { LanguageMode } from '../../features/settings/settingsStorage'
import DashboardHome from '../../components/dashboard/DashboardHome/DashboardHome'
import styles from './DashboardPage.module.scss'

type DashboardPageProps = {
  language: LanguageMode
}

const DashboardPage = ({ language }: DashboardPageProps) => {
  return (
    <section className={styles.page}>
      <DashboardHome language={language} />
    </section>
  )
}

export default DashboardPage
