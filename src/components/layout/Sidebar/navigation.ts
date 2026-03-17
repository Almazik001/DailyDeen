export type AppView =
  | 'dashboard'
  | 'vital-task'
  | 'my-task'
  | 'task-categories'
  | 'settings'
  | 'help'

export type SidebarItem = {
  view: AppView
  label: string
}

export const sidebarItems: SidebarItem[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'vital-task', label: 'Vital Task' },
  { view: 'my-task', label: 'My Task' },
  { view: 'task-categories', label: 'Task Categories' },
  { view: 'settings', label: 'Settings' },
  { view: 'help', label: 'Help' },
]

export const viewLabelMap: Record<AppView, string> = {
  dashboard: 'Dashboard',
  'vital-task': 'Vital Task',
  'my-task': 'My Task',
  'task-categories': 'Task Categories',
  settings: 'Settings',
  help: 'Help',
}

export const headerBrandMap: Record<AppView, { accent: string; rest: string }> = {
  dashboard: { accent: 'Dash', rest: 'board' },
  'vital-task': { accent: 'To', rest: '-Do' },
  'my-task': { accent: 'To', rest: '-Do' },
  'task-categories': { accent: 'To', rest: '-Do' },
  settings: { accent: 'Set', rest: 'tings' },
  help: { accent: 'He', rest: 'lp' },
}
