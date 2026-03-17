import styles from './DashboardPage.module.scss'
import DashboardHome from '../../components/dashboard/DashboardHome/DashboardHome'

const DashboardPage = () => {
  return (
    <section className={styles.page}>
      <DashboardHome />
    </section>
  )
}

export default DashboardPage
