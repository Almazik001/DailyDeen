export type ThemeMode = 'light' | 'soft-dark' | 'system'
export type LanguageMode = 'english' | 'russian' | 'kazakh'

export type AppSettings = {
  theme: ThemeMode
  language: LanguageMode
  emailNotifications: boolean
  desktopAlerts: boolean
  weeklySummary: boolean
  timezone: string
}

const SETTINGS_KEY = 'dailydeen.app.settings'
const SETTINGS_EVENT = 'dailydeen:settings-change'

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'english',
  emailNotifications: true,
  desktopAlerts: false,
  weeklySummary: true,
  timezone:
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Qyzylorda'
      : 'Asia/Qyzylorda',
}

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getAppSettings() {
  if (!isBrowser()) {
    return defaultSettings
  }

  const rawValue = window.localStorage.getItem(SETTINGS_KEY)

  if (!rawValue) {
    return defaultSettings
  }

  try {
    return {
      ...defaultSettings,
      ...(JSON.parse(rawValue) as Partial<AppSettings>),
    }
  } catch {
    return defaultSettings
  }
}

export function saveAppSettings(settings: AppSettings) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  window.dispatchEvent(
    new CustomEvent<AppSettings>(SETTINGS_EVENT, {
      detail: settings,
    }),
  )
}

export function resolveTheme(theme: ThemeMode) {
  if (theme !== 'system' || !isBrowser() || !window.matchMedia) {
    return theme === 'system' ? 'light' : theme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'soft-dark'
    : 'light'
}

export function applyTheme(theme: ThemeMode) {
  if (!isBrowser()) {
    return
  }

  document.documentElement.dataset.theme = resolveTheme(theme)
}

export function subscribeToSettingsChange(
  listener: (settings: AppSettings) => void,
) {
  if (!isBrowser()) {
    return () => {}
  }

  const handleSettingsChange = (event: Event) => {
    const customEvent = event as CustomEvent<AppSettings>
    listener(customEvent.detail)
  }

  const handleSystemThemeChange = () => {
    listener(getAppSettings())
  }

  window.addEventListener(SETTINGS_EVENT, handleSettingsChange as EventListener)

  const mediaQuery =
    window.matchMedia?.('(prefers-color-scheme: dark)') ?? null

  mediaQuery?.addEventListener?.('change', handleSystemThemeChange)

  return () => {
    window.removeEventListener(
      SETTINGS_EVENT,
      handleSettingsChange as EventListener,
    )
    mediaQuery?.removeEventListener?.('change', handleSystemThemeChange)
  }
}

