import { useEffect, useMemo, useState } from 'react'
import type { AppView } from '../../layout/Sidebar/navigation'
import type { LanguageMode } from '../../../features/settings/settingsStorage'
import styles from './UserHints.module.scss'

type HintContent = {
  badge: string
  title: string
  text: string
  action: string
}

type HintDictionary = Record<AppView, HintContent>

type UserHintsProps = {
  currentView: AppView
  language: LanguageMode
}

const hintCopy: Record<LanguageMode, HintDictionary> = {
  english: {
    dashboard: {
      badge: 'Tip',
      title: 'Keep the dashboard clean',
      text:
        'Update task status right after progress changes, so summary blocks and recent activity stay accurate.',
      action: 'Open Help',
    },
    'my-task': {
      badge: 'Tip',
      title: 'Edit directly from the card',
      text:
        'Click any task card to open the task editor faster. You can change title, priority, status and details there.',
      action: 'Open Help',
    },
    'vital-task': {
      badge: 'Tip',
      title: 'Use this page for urgent focus',
      text:
        'Keep only the most important work visible here so deadlines and critical tasks are easier to track.',
      action: 'Open Help',
    },
    'task-categories': {
      badge: 'Tip',
      title: 'Categories are for context',
      text:
        'Use categories to group related work, and keep priority only for urgency. It makes the board easier to scan.',
      action: 'Open Help',
    },
    settings: {
      badge: 'Tip',
      title: 'Save the setup you actually use',
      text:
        'Theme, language and timezone affect everyday comfort, so keep these settings aligned with your workflow.',
      action: 'Open Help',
    },
    help: {
      badge: 'Guide',
      title: 'Need a quick path?',
      text:
        'Use the links and answers on this page when you want a faster way back to tasks, settings or categories.',
      action: 'Go to Dashboard',
    },
  },
  russian: {
    dashboard: {
      badge: 'Подсказка',
      title: 'Держи дашборд в актуальном состоянии',
      text:
        'Обновляй статус задач сразу после изменений, чтобы сводка и недавняя активность оставались точными.',
      action: 'Открыть помощь',
    },
    'my-task': {
      badge: 'Подсказка',
      title: 'Редактируй прямо из карточки',
      text:
        'Нажми на любую карточку задачи, чтобы быстрее открыть окно редактирования. Там можно поменять название, приоритет, статус и детали.',
      action: 'Открыть помощь',
    },
    'vital-task': {
      badge: 'Подсказка',
      title: 'Оставляй здесь только важное',
      text:
        'Этот раздел лучше использовать для срочных и приоритетных задач, чтобы дедлайны и критичная работа всегда были на виду.',
      action: 'Открыть помощь',
    },
    'task-categories': {
      badge: 'Подсказка',
      title: 'Категории нужны для контекста',
      text:
        'Группируй работу по категориям, а приоритет оставляй только для срочности. Так список выглядит чище и читается быстрее.',
      action: 'Открыть помощь',
    },
    settings: {
      badge: 'Подсказка',
      title: 'Сохраняй настройки под свой ритм',
      text:
        'Тема, язык и часовой пояс влияют на ежедневный комфорт, поэтому лучше сразу подстроить их под свою работу.',
      action: 'Открыть помощь',
    },
    help: {
      badge: 'Гид',
      title: 'Нужен быстрый маршрут?',
      text:
        'Используй ссылки и ответы на этой странице, если хочешь быстрее вернуться к задачам, настройкам или категориям.',
      action: 'К дашборду',
    },
  },
  kazakh: {
    dashboard: {
      badge: 'Кеңес',
      title: 'Dashboard-ты өзекті күйде ұста',
      text:
        'Жұмыс өзгерген бойда тапсырма мәртебесін жаңарт, сонда қорытынды блоктар мен белсенділік дәл болып қалады.',
      action: 'Көмекті ашу',
    },
    'my-task': {
      badge: 'Кеңес',
      title: 'Картаның өзінен-ақ өңде',
      text:
        'Тапсырма картасын басып, өңдеу терезесін тез ашуға болады. Сол жерден атауды, басымдықты, мәртебені және мәліметтерді өзгертуге болады.',
      action: 'Көмекті ашу',
    },
    'vital-task': {
      badge: 'Кеңес',
      title: 'Мұнда тек маңыздысын қалдыр',
      text:
        'Бұл бөлім шұғыл және басым тапсырмаларға арналған, сондықтан дедлайн мен маңызды жұмыс әрдайым көз алдыңда болады.',
      action: 'Көмекті ашу',
    },
    'task-categories': {
      badge: 'Кеңес',
      title: 'Санат контекст үшін керек',
      text:
        'Жұмысты санаттар бойынша топта, ал басымдықты тек шұғылдыққа қалдыр. Сонда тізім таза әрі түсінікті болады.',
      action: 'Көмекті ашу',
    },
    settings: {
      badge: 'Кеңес',
      title: 'Өзіңе ыңғайлы баптауды сақта',
      text:
        'Тақырып, тіл және уақыт белдеуі күнделікті жайлылыққа әсер етеді, сондықтан оларды өз ырғағыңа сай реттеп қойған дұрыс.',
      action: 'Көмекті ашу',
    },
    help: {
      badge: 'Гид',
      title: 'Жылдам жол керек пе?',
      text:
        'Тапсырмаларға, баптауларға немесе санаттарға тез оралу үшін осы беттегі сілтемелер мен жауаптарды пайдалан.',
      action: 'Dashboard-қа өту',
    },
  },
}

function getCloseLabel(language: LanguageMode) {
  if (language === 'russian') {
    return 'Скрыть подсказку'
  }

  if (language === 'kazakh') {
    return 'Кеңесті жабу'
  }

  return 'Close hint'
}

function getReopenLabel(language: LanguageMode) {
  if (language === 'russian') {
    return 'Показать подсказку'
  }

  if (language === 'kazakh') {
    return 'Кеңесті қайта ашу'
  }

  return 'Show hint'
}

const UserHints = ({ currentView, language }: UserHintsProps) => {
  const [isHidden, setIsHidden] = useState(false)

  const copy = useMemo(() => {
    const dictionary = hintCopy[language] ?? hintCopy.english
    return dictionary[currentView]
  }, [currentView, language])

  useEffect(() => {
    setIsHidden(false)
  }, [currentView])

  const targetHash = currentView === 'help' ? 'dashboard' : 'help'
  const closeLabel = getCloseLabel(language)
  const reopenLabel = getReopenLabel(language)

  return (
    <>
      <aside
        aria-hidden={isHidden}
        aria-label={copy.title}
        className={`${styles.widget}${isHidden ? ` ${styles.widgetHidden}` : ''}`}
      >
        <button
          aria-label={closeLabel}
          className={styles.close}
          tabIndex={isHidden ? -1 : 0}
          type="button"
          onClick={() => {
            setIsHidden(true)
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <span className={styles.badge}>{copy.badge}</span>
        <h3 className={styles.title}>{copy.title}</h3>
        <p className={styles.text}>{copy.text}</p>
        <button
          className={styles.action}
          tabIndex={isHidden ? -1 : 0}
          type="button"
          onClick={() => {
            window.location.hash = targetHash
          }}
        >
          {copy.action}
        </button>
      </aside>

      <button
        aria-hidden={!isHidden}
        aria-label={reopenLabel}
        className={`${styles.reopen}${isHidden ? ` ${styles.reopenVisible}` : ''}`}
        tabIndex={isHidden ? 0 : -1}
        title={reopenLabel}
        type="button"
        onClick={() => {
          setIsHidden(false)
        }}
      >
        <span aria-hidden="true">?</span>
      </button>
    </>
  )
}

export default UserHints
