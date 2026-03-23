import type { ApiUser } from './types'

export type AuthSession = {
  token: string
  rememberMe: boolean
}

const SESSION_KEY = 'dailydeen.auth.session'
const USER_KEY = 'dailydeen.auth.user'

function isBrowser() {
  return typeof window !== 'undefined'
}

function readValue<T>(storage: Storage, key: string) {
  const rawValue = storage.getItem(key)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return null
  }
}

function getAvailableStorages() {
  if (!isBrowser()) {
    return [] as Storage[]
  }

  return [window.localStorage, window.sessionStorage]
}

function writeValue<T>(storage: Storage, key: string, value: T) {
  storage.setItem(key, JSON.stringify(value))
}

function removeKey(key: string) {
  getAvailableStorages().forEach((storage) => {
    storage.removeItem(key)
  })
}

function readFromAnyStorage<T>(key: string) {
  for (const storage of getAvailableStorages()) {
    const value = readValue<T>(storage, key)

    if (value) {
      return value
    }
  }

  return null
}

function getPreferredStorage(rememberMe: boolean) {
  if (!isBrowser()) {
    return null
  }

  return rememberMe ? window.localStorage : window.sessionStorage
}

export function getStoredSession() {
  return readFromAnyStorage<AuthSession>(SESSION_KEY)
}

export function getStoredUserSnapshot() {
  return readFromAnyStorage<ApiUser>(USER_KEY)
}

export function getAuthToken() {
  return getStoredSession()?.token ?? null
}

export function persistAuthSession(user: ApiUser, token: string, rememberMe: boolean) {
  const storage = getPreferredStorage(rememberMe)

  if (!storage) {
    return
  }

  removeKey(SESSION_KEY)
  removeKey(USER_KEY)

  writeValue(storage, SESSION_KEY, { token, rememberMe })
  writeValue(storage, USER_KEY, user)
}

export function persistUserSnapshot(user: ApiUser) {
  const session = getStoredSession()
  const storage = getPreferredStorage(session?.rememberMe ?? true)
  const currentUser = getStoredUserSnapshot()

  if (!storage) {
    return
  }

  removeKey(USER_KEY)
  writeValue(storage, USER_KEY, {
    ...currentUser,
    ...user,
    birthDate:
      user.birthDate !== undefined ? user.birthDate : currentUser?.birthDate ?? null,
  })
}

export function clearAuthSession() {
  removeKey(SESSION_KEY)
  removeKey(USER_KEY)
}
