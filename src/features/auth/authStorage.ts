import { getApiErrorMessage } from '../../api/apiClient'
import { getCurrentUser as getCurrentUserRequest, login, register } from '../../api/auth.api'
import { getStoredSession, getStoredUserSnapshot, persistAuthSession, persistUserSnapshot, clearAuthSession, type AuthSession } from '../../api/session'
import type { ApiUser, RegisterPayload, UpdateCurrentUserPayload } from '../../api/types'
import { updateCurrentUser as updateCurrentUserRequest } from '../../api/users.api'

type StoredUser = ApiUser
type StoredUserProfilePayload = UpdateCurrentUserPayload

export function getStoredUser() {
  return getStoredUserSnapshot()
}

export async function registerUser(user: RegisterPayload) {
  try {
    const result = await register(user)

    return {
      success: true as const,
      user: result.user,
    }
  } catch (error) {
    return {
      success: false as const,
      message: getApiErrorMessage(error, 'Unable to create account'),
    }
  }
}

export function getSession() {
  return getStoredSession()
}

export function getAuthenticatedUser() {
  return getStoredUserSnapshot()
}

export async function loginUser(
  username: string,
  password: string,
  rememberMe: boolean,
) {
  try {
    const result = await login({
      username,
      password,
    })

    persistAuthSession(result.user, result.token, rememberMe)

    let nextUser = result.user

    try {
      const { user } = await getCurrentUserRequest()
      persistUserSnapshot(user)
      nextUser = getStoredUserSnapshot() ?? user
    } catch {
      nextUser = getStoredUserSnapshot() ?? result.user
    }

    return {
      success: true as const,
      user: nextUser,
    }
  } catch (error) {
    return {
      success: false as const,
      message: getApiErrorMessage(error, 'Unable to sign in'),
    }
  }
}

export async function hydrateAuthenticatedUser() {
  const session = getStoredSession()

  if (!session?.token) {
    return null
  }

  try {
    const { user } = await getCurrentUserRequest()
    persistUserSnapshot(user)
    return user
  } catch {
    clearAuthSession()
    return null
  }
}

export async function updateStoredUserProfile(profile: StoredUserProfilePayload) {
  try {
    const { user } = await updateCurrentUserRequest(profile)
    const nextUser = {
      ...user,
      birthDate:
        profile.birthDate !== undefined
          ? profile.birthDate
          : user.birthDate ?? getStoredUserSnapshot()?.birthDate ?? null,
    }

    persistUserSnapshot(nextUser)
    return nextUser
  } catch {
    return null
  }
}

export function logoutUser() {
  clearAuthSession()
}

export function isAuthenticated() {
  return Boolean(getStoredSession()?.token)
}

export type { StoredUser, AuthSession }
