import { useMemo } from 'react'
import Button from '../../components/ui/Button/Button'
import type { LanguageMode } from '../../features/settings/settingsStorage'
import { t } from '../../features/settings/translations'
import styles from './HelpPage.module.scss'

type HelpPageProps = {
  language: LanguageMode
}

type HelpRoute = 'dashboard' | 'my-task' | 'vital-task' | 'task-categories' | 'settings'

type HelpResource = {
  title: string
  description: string
  action: string
  route: HelpRoute
}

type HelpCopy = {
  eyebrow: string
  title: string
  subtitle: string
  kicker: string
  focusLabel: string
  primaryAction: string
  secondaryAction: string
  spotlightTitle: string
  spotlightText: string
  spotlightItems: string[]
  faqTitle: string
  faqText: string
  faqItems: Array<{
    question: string
    answer: string
  }>
  resourcesTitle: string
  resourcesText: string
  resources: HelpResource[]
  checklistTitle: string
  checklistText: string
  checklist: string[]
  tipsTitle: string
  tipsText: string
  tips: string[]
  dashboardTitle: string
  dashboardText: string
  dashboardAction: string
}

const englishCopy: HelpCopy = {
  eyebrow: 'Support Center',
  title: 'Everything you need to move around DailyDeen faster.',
  subtitle:
    'This space brings together the most useful actions, short how-to notes and quick answers so you can get back to work without hunting through the dashboard.',
  kicker: 'DailyDeen Guide',
  focusLabel: 'Quick focus',
  primaryAction: 'Open My Tasks',
  secondaryAction: 'Workspace Settings',
  spotlightTitle: 'Most requested help',
  spotlightText:
    'If you only need the essentials, start with these three flows. They cover the most common questions in the workspace.',
  spotlightItems: [
    'Open a task card and update its priority or status in the editor.',
    'Switch between light, soft dark and system theme in Settings.',
    'Use Task Categories to keep work grouped by context and stage.',
  ],
  faqTitle: 'Quick answers',
  faqText:
    'Short explanations for the most common actions inside the workspace.',
  faqItems: [
    {
      question: 'How do I edit a task?',
      answer:
        'Open My Tasks or the dashboard list, click the task card, and the task editor will open. From there you can update the title, priority, status, date and description.',
    },
    {
      question: 'Where can I see urgent work first?',
      answer:
        'Use Vital Tasks when you want to focus on the items that need attention sooner. It is the fastest way to review high-priority work without scrolling through everything else.',
    },
    {
      question: 'How do I change theme or language?',
      answer:
        'Open Settings to switch theme, language, notifications and timezone. These preferences are saved locally so the workspace keeps your setup next time.',
    },
    {
      question: 'How do I organize tasks better?',
      answer:
        'Use Task Categories to group work by flow, type or context. This makes the dashboard cleaner and helps you find related tasks faster.',
    },
  ],
  resourcesTitle: 'Useful destinations',
  resourcesText:
    'Jump straight to the area that solves the problem you have right now.',
  resources: [
    {
      title: 'My Tasks',
      description:
        'Review personal tasks, open details, edit progress and keep your list under control.',
      action: 'Go to My Tasks',
      route: 'my-task',
    },
    {
      title: 'Vital Tasks',
      description:
        'Focus on the work that matters most when deadlines or priorities start stacking up.',
      action: 'Open Vital Tasks',
      route: 'vital-task',
    },
    {
      title: 'Task Categories',
      description:
        'Create and manage categories to keep the workspace tidy and easier to scan.',
      action: 'Manage Categories',
      route: 'task-categories',
    },
  ],
  checklistTitle: 'Start here',
  checklistText:
    'A simple flow for new sessions or when the workspace feels crowded.',
  checklist: [
    'Check Dashboard for today overview and the current task snapshot.',
    'Open My Tasks and update cards that changed priority or status.',
    'Review Vital Tasks so urgent work stays visible.',
    'Adjust Settings if you want a different theme, language or alerts.',
  ],
  tipsTitle: 'Small tips that help',
  tipsText:
    'These are tiny habits, but they make the interface feel cleaner and easier to use every day.',
  tips: [
    'Keep task titles short and specific so cards stay readable.',
    'Use categories for context, and priority only for urgency.',
    'Review completed and in-progress items regularly to keep status accurate.',
  ],
  dashboardTitle: 'Dashboard',
  dashboardText:
    'If you want a quick return to the day overview, open the main dashboard.',
  dashboardAction: 'Open Dashboard',
}

const russianCopy: HelpCopy = {
  eyebrow: 'Центр помощи',
  title: 'Всё нужное, чтобы быстрее ориентироваться в DailyDeen.',
  subtitle:
    'Здесь собраны самые полезные действия, короткие подсказки и быстрые ответы, чтобы можно было вернуться к работе без долгого поиска по интерфейсу.',
  kicker: 'Навигатор DailyDeen',
  focusLabel: 'Быстрый фокус',
  primaryAction: 'Открыть мои задачи',
  secondaryAction: 'Настройки пространства',
  spotlightTitle: 'Что ищут чаще всего',
  spotlightText:
    'Если нужен только самый важный минимум, начни с этих сценариев. Они закрывают самые частые вопросы в рабочем пространстве.',
  spotlightItems: [
    'Открывай карточку задачи и меняй приоритет или статус в окне редактирования.',
    'Переключай светлую, мягкую тёмную или системную тему в настройках.',
    'Используй категории задач, чтобы группировать работу по этапам и контексту.',
  ],
  faqTitle: 'Быстрые ответы',
  faqText:
    'Короткие пояснения для самых частых действий внутри рабочего пространства.',
  faqItems: [
    {
      question: 'Как отредактировать задачу?',
      answer:
        'Открой Мои задачи или список на дашборде, нажми на карточку задачи, и откроется окно редактирования. Там можно изменить название, приоритет, статус, дату и описание.',
    },
    {
      question: 'Где посмотреть самые срочные задачи?',
      answer:
        'Используй раздел Важные задачи, когда нужно быстро сфокусироваться на самом приоритетном. Так проще видеть критичную работу без лишнего скролла.',
    },
    {
      question: 'Где меняется тема или язык?',
      answer:
        'Открой Настройки. Там можно переключить тему, язык, уведомления и часовой пояс. Параметры сохраняются локально и остаются при следующем входе.',
    },
    {
      question: 'Как лучше организовать задачи?',
      answer:
        'Используй Категории задач, чтобы группировать работу по типу, потоку или контексту. Так дашборд выглядит чище, а нужные задачи находятся быстрее.',
    },
  ],
  resourcesTitle: 'Полезные разделы',
  resourcesText:
    'Переходи сразу в тот раздел, который решает текущую задачу.',
  resources: [
    {
      title: 'Мои задачи',
      description:
        'Смотри личный список задач, открывай детали, обновляй прогресс и держи работу под контролем.',
      action: 'Перейти в мои задачи',
      route: 'my-task',
    },
    {
      title: 'Важные задачи',
      description:
        'Фокусируйся на действительно важной работе, когда дедлайны и приоритеты начинают накапливаться.',
      action: 'Открыть важные задачи',
      route: 'vital-task',
    },
    {
      title: 'Категории задач',
      description:
        'Создавай и редактируй категории, чтобы рабочее пространство оставалось аккуратным и понятным.',
      action: 'Управлять категориями',
      route: 'task-categories',
    },
  ],
  checklistTitle: 'С чего начать',
  checklistText:
    'Простой сценарий для нового рабочего сеанса или когда интерфейс кажется перегруженным.',
  checklist: [
    'Посмотри дашборд, чтобы увидеть обзор на сегодня и текущее состояние задач.',
    'Открой Мои задачи и обнови карточки, у которых изменился приоритет или статус.',
    'Проверь Важные задачи, чтобы срочная работа оставалась на виду.',
    'Зайди в Настройки, если хочешь поменять тему, язык или уведомления.',
  ],
  tipsTitle: 'Небольшие советы',
  tipsText:
    'Это маленькие привычки, но они делают интерфейс чище и удобнее каждый день.',
  tips: [
    'Делай названия задач короткими и конкретными, чтобы карточки легче читались.',
    'Используй категории для контекста, а приоритет только для срочности.',
    'Регулярно обновляй статусы Выполнено и В процессе, чтобы сводка оставалась точной.',
  ],
  dashboardTitle: 'Дашборд',
  dashboardText:
    'Если нужно быстро вернуться к обзору дня, открой главную панель.',
  dashboardAction: 'Открыть дашборд',
}

const kazakhCopy: HelpCopy = {
  ...englishCopy,
  eyebrow: 'Көмек орталығы',
  title: 'DailyDeen ішінде жылдамырақ бағыт алу үшін керек нәрсенің бәрі.',
  subtitle:
    'Мұнда ең пайдалы әрекеттер, қысқа нұсқаулар және жиі қойылатын сұрақтарға жауаптар жиналған, сондықтан жұмысқа ұзақ іздемей-ақ қайта оралуға болады.',
  kicker: 'DailyDeen нұсқаулығы',
  focusLabel: 'Жылдам назар',
  primaryAction: 'Менің тапсырмаларым',
  secondaryAction: 'Жұмыс кеңістігі баптаулары',
  spotlightTitle: 'Ең жиі сұралатындар',
  spotlightText:
    'Егер саған тек негізгі бағыт керек болса, осы үш сценарийден баста. Олар жұмыс кеңістігіндегі ең жиі сұрақтарды жабады.',
  faqTitle: 'Жылдам жауаптар',
  faqText:
    'Жұмыс кеңістігіндегі ең жиі әрекеттерге арналған қысқа түсіндірмелер.',
  resourcesTitle: 'Пайдалы бөлімдер',
  resourcesText:
    'Қазір қандай мәселе шешу керек болса, сол бөлімге бірден өт.',
  checklistTitle: 'Осыдан баста',
  checklistText:
    'Жаңа жұмыс сессиясы үшін немесе интерфейс шамадан тыс көрінген кезде ыңғайлы қысқа жол.',
  tipsTitle: 'Кішкентай пайдалы кеңестер',
  tipsText:
    'Бұл шағын әдеттер ғана, бірақ интерфейсті күн сайын таза және ыңғайлы етеді.',
  dashboardTitle: 'Басқару панелі',
  dashboardText:
    'Күндік шолуға жылдам оралу керек болса, негізгі панельді аш.',
  dashboardAction: 'Dashboard ашу',
}

const helpCopy: Record<LanguageMode, HelpCopy> = {
  english: englishCopy,
  russian: russianCopy,
  kazakh: kazakhCopy,
}

function navigateTo(route: HelpRoute) {
  window.location.hash = route
}

const HelpPage = ({ language }: HelpPageProps) => {
  const copy = useMemo(() => helpCopy[language] ?? helpCopy.english, [language])

  return (
    <div className={styles.page}>
      <section className={`dashboard-panel ${styles.panel}`}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <h2 className={styles.title}>{copy.title}</h2>
            <p className={styles.subtitle}>{copy.subtitle}</p>
          </div>

          <button
            className={styles.backButton}
            type="button"
            onClick={() => {
              window.location.hash = 'dashboard'
            }}
          >
            {t(language, 'common.goBack')}
          </button>
        </div>

        <div className={styles.hero}>
          <section className={styles.heroCard}>
            <div className={styles.heroAccent} aria-hidden="true" />

            <div className={styles.heroBody}>
              <div className={styles.heroCopy}>
                <span className={styles.kicker}>{copy.kicker}</span>
                <h3>{copy.spotlightTitle}</h3>
                <p>{copy.spotlightText}</p>
              </div>

              <div className={styles.heroActions}>
                <Button
                  className={styles.primaryAction}
                  onClick={() => {
                    navigateTo('my-task')
                  }}
                >
                  {copy.primaryAction}
                </Button>
                <Button
                  className={`${styles.primaryAction} ${styles.secondaryAction}`}
                  onClick={() => {
                    navigateTo('settings')
                  }}
                >
                  {copy.secondaryAction}
                </Button>
              </div>
            </div>

            <div className={styles.heroHighlights}>
              {copy.spotlightItems.map((item) => (
                <div key={item} className={styles.heroHighlight}>
                  <span className={styles.heroHighlightDot} aria-hidden="true" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className={styles.spotlightCard}>
            <span className={styles.spotlightLabel}>{copy.focusLabel}</span>
            <h3>{copy.checklistTitle}</h3>
            <p>{copy.checklistText}</p>

            <ul className={styles.stepPreview}>
              {copy.checklist.slice(0, 3).map((item, index) => (
                <li key={item}>
                  <strong>{`0${index + 1}`}</strong>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{copy.faqTitle}</h3>
              <p>{copy.faqText}</p>
            </div>

            <div className={styles.faqList}>
              {copy.faqItems.map((item, index) => (
                <details
                  key={item.question}
                  className={styles.faqItem}
                  open={index === 0}
                >
                  <summary className={styles.faqSummary}>
                    <span>{item.question}</span>
                    <span className={styles.faqSummaryBadge}>
                      {`0${index + 1}`}
                    </span>
                  </summary>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className={styles.sideColumn}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{copy.resourcesTitle}</h3>
                <p>{copy.resourcesText}</p>
              </div>

              <div className={styles.resourceList}>
                {copy.resources.map((resource) => (
                  <button
                    key={resource.title}
                    className={styles.resourceCard}
                    type="button"
                    onClick={() => {
                      navigateTo(resource.route)
                    }}
                  >
                    <div className={styles.resourceTop}>
                      <span className={styles.resourceMarker} aria-hidden="true" />
                      <strong>{resource.title}</strong>
                    </div>
                    <p>{resource.description}</p>
                    <span className={styles.resourceAction}>{resource.action}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{copy.tipsTitle}</h3>
                <p>{copy.tipsText}</p>
              </div>

              <ul className={styles.tipList}>
                {copy.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className={`${styles.card} ${styles.homeCard}`}>
              <div className={styles.cardHeader}>
                <h3>{copy.dashboardTitle}</h3>
                <p>{copy.dashboardText}</p>
              </div>

              <Button
                className={`${styles.primaryAction} ${styles.homeAction}`}
                onClick={() => {
                  navigateTo('dashboard')
                }}
              >
                {copy.dashboardAction}
              </Button>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HelpPage
