import { useEffect, useState } from 'react'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import MyTaskPage from './pages/MyTaskPage/MyTaskPage'
import PlaceholderPage from './pages/PlaceholderPage/PlaceholderPage'
import TaskCategoriesPage from './pages/TaskCategoriesPage/TaskCategoriesPage'
import VitalTaskPage from './pages/VitalTaskPage/VitalTaskPage'
import Header from './components/layout/Header/Header'
import Sidebar from './components/layout/Sidebar/Sidebar'
import type { AppView } from './components/layout/Sidebar/navigation'
import './styles/globals.scss'

const defaultView: AppView = 'dashboard'

const supportedViews: AppView[] = [
  'dashboard',
  'vital-task',
  'my-task',
  'task-categories',
  'settings',
  'help',
]

function getViewFromHash(hash: string): AppView {
  const normalized = hash.replace('#', '') as AppView

  return supportedViews.includes(normalized) ? normalized : defaultView
}

function App() {
  const [activeView, setActiveView] = useState<AppView>(() => {
    if (typeof window === 'undefined') {
      return defaultView
    }

    return getViewFromHash(window.location.hash)
  })

  useEffect(() => {
    const syncViewWithHash = () => {
      setActiveView(getViewFromHash(window.location.hash))
    }

    if (!window.location.hash) {
      window.history.replaceState(null, '', `#${defaultView}`)
    }

    syncViewWithHash()
    window.addEventListener('hashchange', syncViewWithHash)

    return () => {
      window.removeEventListener('hashchange', syncViewWithHash)
    }
  }, [])

  const handleNavigate = (view: AppView) => {
    if (window.location.hash === `#${view}`) {
      setActiveView(view)
      return
    }

    window.location.hash = view
  }

  const renderActiveView = () => {
    if (activeView === 'dashboard') {
      return <DashboardPage />
    }

    if (activeView === 'my-task') {
      return <MyTaskPage />
    }

    if (activeView === 'vital-task') {
      return <VitalTaskPage />
    }

    if (activeView === 'task-categories') {
      return <TaskCategoriesPage />
    }

    return <PlaceholderPage view={activeView} />
  }

  return (
    <div className="page-shell">
      <Header currentView={activeView} />

      <main className="page-content container">
        <Sidebar activeView={activeView} onNavigate={handleNavigate} />

        <section className="content-area">{renderActiveView()}</section>
      </main>
    </div>
  )
}

export default App
