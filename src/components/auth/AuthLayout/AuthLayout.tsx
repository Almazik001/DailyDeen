import type { ReactNode } from 'react'
import type { ThemeMode } from '../../../features/settings/settingsStorage'
import styles from './AuthLayout.module.scss'

type AuthLayoutProps = {
  title: string
  illustrationSrc: string
  illustrationAlt: string
  illustrationSide: 'left' | 'right'
  currentTheme: ThemeMode
  lightLabel: string
  darkLabel: string
  onThemeChange: (theme: ThemeMode) => void
  children: ReactNode
}

const AuthLayout = ({
  title,
  illustrationSrc,
  illustrationAlt,
  illustrationSide,
  currentTheme,
  lightLabel,
  darkLabel,
  onThemeChange,
  children,
}: AuthLayoutProps) => {
  const shellClassName =
    illustrationSide === 'left'
      ? `${styles.shell} ${styles.reverse}`
      : styles.shell

  return (
    <section className={styles.page}>
      <div className={styles.pattern} aria-hidden="true" />

      <div className={shellClassName}>
        <div className={styles.formColumn}>
          <div className={styles.formCard}>
            <div className={styles.themeSwitch}>
              <button
                className={`${styles.themeButton}${currentTheme !== 'soft-dark' ? ` ${styles.themeButtonActive}` : ''}`}
                type="button"
                onClick={() => {
                  onThemeChange('light')
                }}
              >
                {lightLabel}
              </button>
              <button
                className={`${styles.themeButton}${currentTheme === 'soft-dark' ? ` ${styles.themeButtonActive}` : ''}`}
                type="button"
                onClick={() => {
                  onThemeChange('soft-dark')
                }}
              >
                {darkLabel}
              </button>
            </div>
            <h1 className={styles.title}>{title}</h1>
            {children}
          </div>
        </div>

        <div className={styles.artColumn}>
          <div className={styles.artCard}>
            <img
              alt={illustrationAlt}
              className={styles.illustration}
              src={illustrationSrc}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AuthLayout
