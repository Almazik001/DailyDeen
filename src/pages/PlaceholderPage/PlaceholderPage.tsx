import type { AppView } from '../../components/layout/Sidebar/navigation'
import { viewLabelMap } from '../../components/layout/Sidebar/navigation'

type PlaceholderPageProps = {
  view: AppView
}

const descriptionMap: Record<AppView, string> = {
  dashboard: 'Overview of tasks and team activity.',
  'vital-task':
    'This section can be used for urgent work, top priorities and deadline-based task monitoring.',
  'my-task':
    'This section contains your personal task list and full task details.',
  'task-categories':
    'Group tasks by category, tags or workflow stage so they are easier to manage.',
  settings:
    'Profile, notification and workspace settings can live here.',
  help: 'Useful guides, FAQs and support resources can be shown here.',
}

const PlaceholderPage = ({ view }: PlaceholderPageProps) => {
  return (
    <div className="placeholder-view">
      <section className="dashboard-panel placeholder-card">
        <span className="placeholder-card__eyebrow">{viewLabelMap[view]}</span>
        <h2 className="placeholder-card__title">{viewLabelMap[view]}</h2>
        <p className="placeholder-card__description">{descriptionMap[view]}</p>
      </section>
    </div>
  )
}

export default PlaceholderPage
