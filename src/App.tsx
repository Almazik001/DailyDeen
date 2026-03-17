import { useEffect, useState } from 'react'
import Header from './components/layout/Header/Header'
import Sidebar from './components/layout/Sidebar/Sidebar'
import type { AppView } from './components/layout/Sidebar/navigation'
import {
  getAuthenticatedUser,
  isAuthenticated,
  logoutUser,
  type StoredUser,
} from './features/auth/authStorage'
import {
  applyTheme,
  getAppSettings,
  saveAppSettings,
  subscribeToSettingsChange,
  type AppSettings,
  type ThemeMode,
} from './features/settings/settingsStorage'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import MyTaskPage from './pages/MyTaskPage/MyTaskPage'
import PlaceholderPage from './pages/PlaceholderPage/PlaceholderPage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import SignInPage from './pages/SignInPage/SignInPage'
import SignUpPage from './pages/SignUpPage/SignUpPage'
import TaskCategoriesPage from './pages/TaskCategoriesPage/TaskCategoriesPage'
import VitalTaskPage from './pages/VitalTaskPage/VitalTaskPage'
import './styles/globals.scss'

type RouteView = AppView | 'sign-in' | 'sign-up'

const defaultView: RouteView = 'dashboard'

const supportedViews: RouteView[] = [
  'dashboard',
  'vital-task',
  'my-task',
  'task-categories',
  'settings',
  'help',
  'sign-in',
  'sign-up',
]

function getViewFromHash(hash: string): RouteView {
  const normalized = hash.replace('#', '') as RouteView

  return supportedViews.includes(normalized) ? normalized : defaultView
}

function App() {
  const [activeView, setActiveView] = useState<RouteView>(() => {
    if (typeof window === 'undefined') {
      return defaultView
    }

    return getViewFromHash(window.location.hash)
  })
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated())
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(() =>
    getAuthenticatedUser(),
  )
  const [appSettings, setAppSettings] = useState<AppSettings>(() =>
    getAppSettings(),
  )

  useEffect(() => {
    applyTheme(appSettings.theme)
  }, [appSettings.theme])

  useEffect(() => {
    const syncViewWithHash = () => {
      const nextView = getViewFromHash(window.location.hash)
      const nextAuthenticated = isAuthenticated()
      const nextUser = getAuthenticatedUser()

      setAuthenticated(nextAuthenticated)
      setCurrentUser(nextUser)

      if (!nextAuthenticated && nextView !== 'sign-in' && nextView !== 'sign-up') {
        window.history.replaceState(null, '', '#sign-in')
        setActiveView('sign-in')
        return
      }

      if (nextAuthenticated && (nextView === 'sign-in' || nextView === 'sign-up')) {
        window.history.replaceState(null, '', '#dashboard')
        setActiveView('dashboard')
        return
      }

      setActiveView(nextView)
    }

    if (!window.location.hash) {
      window.history.replaceState(
        null,
        '',
        isAuthenticated() ? '#dashboard' : '#sign-in',
      )
    }

    syncViewWithHash()
    window.addEventListener('hashchange', syncViewWithHash)

    const unsubscribeSettings = subscribeToSettingsChange((nextSettings) => {
      setAppSettings(nextSettings)
      applyTheme(nextSettings.theme)
    })

    return () => {
      window.removeEventListener('hashchange', syncViewWithHash)
      unsubscribeSettings()
    }
  }, [])

  const handleNavigate = (view: AppView) => {
    if (window.location.hash === `#${view}`) {
      setActiveView(view)
      return
    }

    window.location.hash = view
  }

  const handleLogout = () => {
    logoutUser()
    setAuthenticated(false)
    setCurrentUser(null)
    window.location.hash = 'sign-in'
  }

  const handleLoginSuccess = () => {
    setAuthenticated(true)
    setCurrentUser(getAuthenticatedUser())
    window.location.hash = 'dashboard'
  }

  const handleRegisterSuccess = () => {
    window.location.hash = 'sign-in'
  }

  const handleUserUpdate = (user: StoredUser) => {
    setCurrentUser(user)
  }

  const handleThemeChange = (theme: ThemeMode) => {
    const nextSettings = {
      ...appSettings,
      theme,
    }

    setAppSettings(nextSettings)
    saveAppSettings(nextSettings)
    applyTheme(theme)
  }

  const renderActiveView = () => {
    if (activeView === 'sign-in') {
      return (
        <SignInPage
          currentTheme={appSettings.theme}
          language={appSettings.language}
          onLoginSuccess={handleLoginSuccess}
          onThemeChange={handleThemeChange}
        />
      )
    }

    if (activeView === 'sign-up') {
      return (
        <SignUpPage
          currentTheme={appSettings.theme}
          language={appSettings.language}
          onRegisterSuccess={handleRegisterSuccess}
          onThemeChange={handleThemeChange}
        />
      )
    }

    if (activeView === 'dashboard') {
      return (
        <DashboardPage
          currentUser={currentUser}
          language={appSettings.language}
        />
      )
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

    if (activeView === 'settings') {
      return (
        <SettingsPage
          currentUser={currentUser}
          language={appSettings.language}
          onUserUpdate={handleUserUpdate}
        />
      )
    }

    return <PlaceholderPage language={appSettings.language} view={activeView} />
  }

  if (!authenticated || activeView === 'sign-in' || activeView === 'sign-up') {
    return <>{renderActiveView()}</>
  }

  return (
    <div className="page-shell">
      <Header
        currentLanguage={appSettings.language}
        currentView={activeView}
      />

      <main className="page-content container">
        <Sidebar
          activeView={activeView}
          currentLanguage={appSettings.language}
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <section className="content-area">{renderActiveView()}</section>
      </main>
    </div>
  )
}

export default App
