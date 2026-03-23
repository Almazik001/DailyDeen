import { useMemo } from 'react'
import Button from '../../../components/ui/Button/Button'
import Modal from '../../../components/ui/Modal/Modal'
import type { StoredUser } from '../../auth/authStorage'
import type { LanguageMode } from '../../settings/settingsStorage'
import styles from './BirthdayGreetingModal.module.scss'

type BirthdayGreetingModalProps = {
  isOpen: boolean
  user: StoredUser
  language: LanguageMode
  onClose: () => void
}

type BirthdayCopy = {
  badge: string
  title: string
  subtitle: string
  quoteLabel: string
  wishes: string[]
  action: string
}

const birthdayCopy: Record<
  LanguageMode,
  BirthdayCopy & { quotes: string[] }
> = {
  english: {
    badge: 'Happy Birthday',
    title: 'Today is your day, {name}!',
    subtitle:
      'DailyDeen wishes you a bright year, kind people around you and enough energy for every goal that matters.',
    quoteLabel: 'Birthday quote',
    wishes: [
      'May this year bring calm confidence, strong health and beautiful progress.',
      'Let your plans become lighter, your wins become bigger and your joy become louder.',
    ],
    action: 'Thank you',
    quotes: [
      'Count your life by smiles, not tears. Count your age by friends, not years.',
      'The more you praise and celebrate your life, the more there is in life to celebrate.',
      'Every year is a new chapter. Make this one warm, brave and unforgettable.',
      'May today remind you how much light, strength and kindness you carry.',
      'Celebrate how far you have come and trust how beautifully you are still growing.',
    ],
  },
  russian: {
    badge: 'С днем рождения',
    title: 'Сегодня твой день, {name}!',
    subtitle:
      'DailyDeen поздравляет тебя и желает светлого года, добрых людей рядом и сил на всё действительно важное.',
    quoteLabel: 'Цитата дня',
    wishes: [
      'Пусть этот год принесёт спокойную уверенность, крепкое здоровье и красивые результаты.',
      'Пусть планы становятся легче, победы больше, а радость заметнее с каждым месяцем.',
    ],
    action: 'Спасибо',
    quotes: [
      'Пусть жизнь измеряется улыбками, а возраст только счастливыми воспоминаниями.',
      'Чем больше ты ценишь свою жизнь, тем больше поводов она дарит для радости.',
      'Каждый новый год жизни — это новая глава. Пусть она будет тёплой, смелой и счастливой.',
      'Пусть этот день напомнит тебе, сколько в тебе света, силы и доброты.',
      'Радуйся тому, как далеко ты уже прошёл, и верь в то, как красиво ты ещё вырастешь.',
    ],
  },
  kazakh: {
    badge: 'Туған күніңмен',
    title: 'Бүгін сенің күнің, {name}!',
    subtitle:
      'DailyDeen саған жарқын жыл, жаныңда жақсы адамдар және маңызды мақсаттарға жететін күш тілейді.',
    quoteLabel: 'Күннің сөзі',
    wishes: [
      'Бұл жыл саған сенімділік, мықты денсаулық және әдемі нәтижелер әкелсін.',
      'Жоспарларың жеңіл, жеңістерің үлкен, ал қуанышың айқын болсын.',
    ],
    action: 'Рақмет',
    quotes: [
      'Өмірді жылмен емес, қуаныш пен күлкімен өлше.',
      'Өміріңді қаншалық бағаласаң, ол саған соншалық қуаныш сыйлайды.',
      'Әр туған күн — жаңа тарау. Ол жылы, батыл және бақытты болсын.',
      'Бүгінгі күн сенің бойыңдағы жарық, күш пен мейірімді еске салсын.',
      'Қаншалық алысқа жеткеніңе қуанып, әлі де әдемі өсетініңе сен.',
    ],
  },
}

function interpolate(template: string, name: string) {
  return template.replace('{name}', name)
}

function getBirthdayName(user: StoredUser, language: LanguageMode) {
  const firstName = user.firstName?.trim()

  if (firstName) {
    return firstName
  }

  if (user.username?.trim()) {
    return user.username.trim()
  }

  if (language === 'russian') {
    return 'друг'
  }

  if (language === 'kazakh') {
    return 'досым'
  }

  return 'friend'
}

function getQuoteIndex(user: StoredUser, quoteCount: number) {
  const seed = `${user.id}:${user.birthDate ?? ''}:${new Date().getFullYear()}`

  const hash = Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0)

  return hash % quoteCount
}

const BirthdayGreetingModal = ({
  isOpen,
  user,
  language,
  onClose,
}: BirthdayGreetingModalProps) => {
  const copy = birthdayCopy[language] ?? birthdayCopy.english
  const name = getBirthdayName(user, language)

  const quote = useMemo(() => {
    const index = getQuoteIndex(user, copy.quotes.length)
    return copy.quotes[index]
  }, [copy.quotes, user])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={styles.modal}
      header={
        <div className={styles.header}>
          <div>
            <span className={styles.badge}>{copy.badge}</span>
            <h2 className={styles.title}>{interpolate(copy.title, name)}</h2>
          </div>
        </div>
      }
    >
      <div className={styles.hero}>
        <div className={styles.orb} aria-hidden="true" />
        <div className={styles.glow} aria-hidden="true" />
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </div>

      <div className={styles.quoteCard}>
        <span className={styles.quoteLabel}>{copy.quoteLabel}</span>
        <blockquote className={styles.quote}>{quote}</blockquote>
      </div>

      <div className={styles.wishes}>
        {copy.wishes.map((wish) => (
          <div className={styles.wish} key={wish}>
            <span className={styles.wishDot} aria-hidden="true" />
            <p>{wish}</p>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button className={styles.primaryAction} onClick={onClose}>
          {copy.action}
        </Button>
      </div>
    </Modal>
  )
}

export default BirthdayGreetingModal
