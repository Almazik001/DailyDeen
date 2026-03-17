import type { AppView } from '../../components/layout/Sidebar/navigation'
import type { LanguageMode } from '../../features/settings/settingsStorage'
import { getSidebarLabel, t } from '../../features/settings/translations'

type PlaceholderPageProps = {
  language: LanguageMode
  view: AppView
}

const PlaceholderPage = ({ language, view }: PlaceholderPageProps) => {
  return (
    <div className="placeholder-view">
      <section className="dashboard-panel placeholder-card">
        <span className="placeholder-card__eyebrow">
          {getSidebarLabel(language, view)}
        </span>
        <h2 className="placeholder-card__title">
          {getSidebarLabel(language, view)}
        </h2>
        <p className="placeholder-card__description">
          {t(language, `placeholder.${view}`)}
        </p>
      </section>
    </div>
  )
}

export default PlaceholderPage

