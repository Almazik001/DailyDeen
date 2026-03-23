export type LookupItem = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type ApiUser = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  birthDate?: string | null
  contactNumber: string | null
  position: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export type ApiTask = {
  id: string
  title: string
  description: string
  dueDate: string | null
  imageUrl: string | null
  userId: string
  createdAt: string
  updatedAt: string
  category: LookupItem
  status: LookupItem
  priority: LookupItem
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export type LoginPayload = {
  username: string
  password: string
}

export type AuthResponse = {
  user: ApiUser
  token: string
}

export type UpdateCurrentUserPayload = {
  firstName?: string
  lastName?: string
  email?: string
  birthDate?: string | null
  contactNumber?: string | null
  position?: string | null
  avatarUrl?: string | null
}

export type CreateTaskPayload = {
  title: string
  description: string
  categoryId: string
  statusId: string
  priorityId: string
  dueDate?: string | null
  imageUrl?: string | null
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>

export type ListTasksParams = {
  categoryId?: string
  categoryName?: string
  statusId?: string
  priorityId?: string
}
