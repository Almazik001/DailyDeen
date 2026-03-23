import { getAuthToken } from './session'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api').replace(
  /\/$/,
  '',
)

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | null | object
}

export class ApiClientError extends Error {
  readonly status: number
  readonly details?: unknown

  constructor(
    status: number,
    message: string,
    details?: unknown,
  ) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.details = details
  }
}

function buildHeaders(options?: HeadersInit, hasJsonBody?: boolean) {
  const headers = new Headers(options)
  const token = getAuthToken()

  if (hasJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return headers
}

function serializeBody(body: RequestOptions['body']) {
  if (!body || body instanceof FormData || typeof body === 'string') {
    return body ?? null
  }

  return JSON.stringify(body)
}

export async function apiClient<T>(path: string, options: RequestOptions = {}) {
  const hasJsonBody =
    options.body !== undefined &&
    !(options.body instanceof FormData) &&
    typeof options.body !== 'string'

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.headers, hasJsonBody),
    body: serializeBody(options.body),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : 'Request failed'

    throw new ApiClientError(response.status, message, payload)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return payload as T
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
) {
  if (error instanceof ApiClientError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
