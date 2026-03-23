import { useEffect, useState } from 'react'
import Header from './components/layout/Header/Header'
import Sidebar from './components/layout/Sidebar/Sidebar'
import type { AppView } from './components/layout/Sidebar/navigation'
import UserHints from './components/help/UserHints/UserHints'
import {
  dismissBirthdayGreeting,
  isBirthdayGreetingDismissed,
  isBirthdayToday,
} from './features/birthday/birthdayGreeting'
import BirthdayGreetingModal from './features/birthday/BirthdayGreetingModal/BirthdayGreetingModal'
import {
  getAuthenticatedUser,
  hydrateAuthenticatedUser,
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
import { useCurrentDate } from './hooks/useCurrentDate'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import HelpPage from './pages/HelpPage/HelpPage'
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
  const [authReady, setAuthReady] = useState(false)
  const [appSettings, setAppSettings] = useState<AppSettings>(() =>
    getAppSettings(),
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false)
  const currentDate = useCurrentDate()

  useEffect(() => {
    applyTheme(appSettings.theme)
  }, [appSettings.theme])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsSidebarOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined
    }

    const body = document.body

    if (!body) {
      return undefined
    }

    const previousOverflow = body.style.overflow
    const sidebarOpenClass = 'is-mobile-sidebar-open'
    const shouldLockScroll =
      isSidebarOpen && window.matchMedia('(max-width: 767px)').matches

    if (shouldLockScroll) {
      body.style.overflow = 'hidden'
      body.classList.add(sidebarOpenClass)
    } else {
      body.classList.remove(sidebarOpenClass)
    }

    return () => {
      body.style.overflow = previousOverflow
      body.classList.remove(sidebarOpenClass)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    const syncViewWithHash = () => {
      const nextView = getViewFromHash(window.location.hash)
      const nextAuthenticated = isAuthenticated()
      const nextUser = getAuthenticatedUser()

      setIsSidebarOpen(false)
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

    const bootstrapAuth = async () => {
      if (isAuthenticated()) {
        const user = await hydrateAuthenticatedUser()
        setAuthenticated(Boolean(user))
        setCurrentUser(user)
      } else {
        setAuthenticated(false)
        setCurrentUser(null)
      }

      if (!window.location.hash) {
        window.history.replaceState(
          null,
          '',
          isAuthenticated() ? '#dashboard' : '#sign-in',
        )
      }

      syncViewWithHash()
      setAuthReady(true)
    }

    void bootstrapAuth()
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

  useEffect(() => {
    if (!authReady || !authenticated || !currentUser) {
      setIsBirthdayModalOpen(false)
      return
    }

    if (
      !isBirthdayToday(currentUser, currentDate) ||
      isBirthdayGreetingDismissed(currentUser.id, currentDate)
    ) {
      setIsBirthdayModalOpen(false)
      return
    }

    setIsBirthdayModalOpen(true)
  }, [authReady, authenticated, currentDate, currentUser])

  const handleNavigate = (view: AppView) => {
    setIsSidebarOpen(false)

    if (window.location.hash === `#${view}`) {
      setActiveView(view)
      return
    }

    window.location.hash = view
  }

  const handleLogout = () => {
    logoutUser()
    setIsSidebarOpen(false)
    setIsBirthdayModalOpen(false)
    setAuthenticated(false)
    setCurrentUser(null)
    window.location.hash = 'sign-in'
  }

  const handleLoginSuccess = () => {
    setIsSidebarOpen(false)
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

  const handleCloseBirthdayModal = () => {
    if (currentUser) {
      dismissBirthdayGreeting(currentUser.id, currentDate)
    }

    setIsBirthdayModalOpen(false)
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
      return <DashboardPage language={appSettings.language} />
    }

    if (activeView === 'my-task') {
      return <MyTaskPage language={appSettings.language} />
    }

    if (activeView === 'vital-task') {
      return <VitalTaskPage language={appSettings.language} />
    }

    if (activeView === 'task-categories') {
      return <TaskCategoriesPage language={appSettings.language} />
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

    if (activeView === 'help') {
      return <HelpPage language={appSettings.language} />
    }

    return <PlaceholderPage language={appSettings.language} view={activeView} />
  }

  if (!authReady) {
    return null
  }

  if (!authenticated || activeView === 'sign-in' || activeView === 'sign-up') {
    return <>{renderActiveView()}</>
  }

  return (
    <div className={`page-shell${isSidebarOpen ? ' is-sidebar-open' : ''}`}>
      <Header
        currentLanguage={appSettings.language}
        currentUser={currentUser}
        currentView={activeView}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => {
          setIsSidebarOpen((current) => !current)
        }}
      />

      <button
        aria-label="Close menu"
        className={`sidebar-backdrop${isSidebarOpen ? ' is-visible' : ''}`}
        type="button"
        onClick={() => {
          setIsSidebarOpen(false)
        }}
      />

      <main className="page-content container">
        <Sidebar
          activeView={activeView}
          currentLanguage={appSettings.language}
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onNavigate={handleNavigate}
          onClose={() => {
            setIsSidebarOpen(false)
          }}
          onLogout={handleLogout}
        />

        <section className="content-area">{renderActiveView()}</section>
      </main>

      <UserHints currentView={activeView} language={appSettings.language} />
      {currentUser ? (
        <BirthdayGreetingModal
          isOpen={isBirthdayModalOpen}
          language={appSettings.language}
          user={currentUser}
          onClose={handleCloseBirthdayModal}
        />
      ) : null}
    </div>
  )
}

export default App
