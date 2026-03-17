import type { StoredUser } from '../../features/auth/authStorage'
import type { LanguageMode } from '../../features/settings/settingsStorage'
import DashboardHome from '../../components/dashboard/DashboardHome/DashboardHome'
import styles from './DashboardPage.module.scss'

type DashboardPageProps = {
  currentUser: StoredUser | null
  language: LanguageMode
}

const DashboardPage = ({ currentUser, language }: DashboardPageProps) => {
  return (
    <section className={styles.page}>
      <DashboardHome currentUser={currentUser} language={language} />
    </section>
  )
}

export default DashboardPage
