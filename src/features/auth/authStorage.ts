type StoredUser = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  contactNumber?: string
  position?: string
  avatarUrl?: string
}

type AuthSession = {
  username: string
  rememberMe: boolean
}

type LoginFailureKey = 'auth.registerFirst' | 'auth.invalidCredentials'

const AUTH_USER_KEY = 'dailydeen.auth.user'
const AUTH_SESSION_KEY = 'dailydeen.auth.session'

function isBrowser() {
  return typeof window !== 'undefined'
}

function safeRead<T>(key: string): T | null {
  if (!isBrowser()) {
    return null
  }

  const rawValue = window.localStorage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getStoredUser() {
  return safeRead<StoredUser>(AUTH_USER_KEY)
}

export function registerUser(user: StoredUser) {
  safeWrite(AUTH_USER_KEY, user)
}

export function getSession() {
  return safeRead<AuthSession>(AUTH_SESSION_KEY)
}

export function getAuthenticatedUser() {
  const session = getSession()
  const storedUser = getStoredUser()

  if (!session || !storedUser) {
    return null
  }

  if (session.username !== storedUser.username) {
    return null
  }

  return storedUser
}

export function loginUser(
  username: string,
  password: string,
  rememberMe: boolean,
) {
  const storedUser = getStoredUser()

  if (!storedUser) {
    return {
      success: false as const,
      messageKey: 'auth.registerFirst' as LoginFailureKey,
    }
  }

  const isUsernameValid = storedUser.username === username.trim()
  const isPasswordValid = storedUser.password === password

  if (!isUsernameValid || !isPasswordValid) {
    return {
      success: false as const,
      messageKey: 'auth.invalidCredentials' as LoginFailureKey,
    }
  }

  safeWrite(AUTH_SESSION_KEY, {
    username: storedUser.username,
    rememberMe,
  })

  return {
    success: true as const,
    user: storedUser,
  }
}

export function updateStoredUserProfile(profile: Partial<StoredUser>) {
  const storedUser = getStoredUser()

  if (!storedUser) {
    return null
  }

  const updatedUser = {
    ...storedUser,
    ...profile,
  }

  safeWrite(AUTH_USER_KEY, updatedUser)

  const session = getSession()

  if (session && session.username !== updatedUser.username) {
    safeWrite(AUTH_SESSION_KEY, {
      ...session,
      username: updatedUser.username,
    })
  }

  return updatedUser
}

export function logoutUser() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY)
}

export function isAuthenticated() {
  return Boolean(getSession())
}

export type { StoredUser, AuthSession, LoginFailureKey }

