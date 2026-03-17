import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { IMaskInput } from 'react-imask'
import Button from '../../components/ui/Button/Button'
import Checkbox from '../../components/ui/Checkbox/Checkbox'
import Input from '../../components/ui/Input/Input'
import inputStyles from '../../components/ui/Input/Input.module.scss'
import type { StoredUser } from '../../features/auth/authStorage'
import { updateStoredUserProfile } from '../../features/auth/authStorage'
import {
  applyTheme,
  getAppSettings,
  saveAppSettings,
  type AppSettings,
  type LanguageMode,
  type ThemeMode,
} from '../../features/settings/settingsStorage'
import { t } from '../../features/settings/translations'
import styles from './SettingsPage.module.scss'

type SettingsPageProps = {
  currentUser: StoredUser | null
  language: LanguageMode
  onUserUpdate: (user: StoredUser) => void
}

type AccountFormState = {
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  position: string
  avatarUrl: string
}

const createFormState = (user: StoredUser | null): AccountFormState => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  email: user?.email ?? '',
  contactNumber: user?.contactNumber ?? '',
  position: user?.position ?? 'Product Manager',
  avatarUrl: user?.avatarUrl ?? '',
})

const SettingsPage = ({
  currentUser,
  language,
  onUserUpdate,
}: SettingsPageProps) => {
  const themeOptions: { value: ThemeMode; label: string; description: string }[] = [
    {
      value: 'light',
      label: t(language, 'theme.light'),
      description: t(language, 'theme.lightDescription'),
    },
    {
      value: 'soft-dark',
      label: t(language, 'theme.soft-dark'),
      description: t(language, 'theme.soft-darkDescription'),
    },
    {
      value: 'system',
      label: t(language, 'theme.system'),
      description: t(language, 'theme.systemDescription'),
    },
  ]

  const languageOptions: { value: LanguageMode; label: string }[] = [
    { value: 'english', label: t(language, 'language.english') },
    { value: 'russian', label: t(language, 'language.russian') },
    { value: 'kazakh', label: t(language, 'language.kazakh') },
  ]

  const [accountForm, setAccountForm] = useState<AccountFormState>(() =>
    createFormState(currentUser),
  )
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings())
  const [accountMessage, setAccountMessage] = useState('')
  const [preferencesMessage, setPreferencesMessage] = useState('')

  useEffect(() => {
    setAccountForm(createFormState(currentUser))
  }, [currentUser])

  useEffect(() => {
    setSettings(getAppSettings())
  }, [language])

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  const displayName = useMemo(() => {
    if (!currentUser) {
      return t(language, 'common.guest')
    }

    const fullName = `${accountForm.firstName} ${accountForm.lastName}`.trim()
    return fullName || currentUser.username
  }, [accountForm.firstName, accountForm.lastName, currentUser, language])

  const handleAccountFieldChange = (name: keyof AccountFormState, value: string) => {
    setAccountMessage('')
    setAccountForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file || !file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const preview = typeof reader.result === 'string' ? reader.result : ''

      setAccountMessage('')
      setAccountForm((current) => ({
        ...current,
        avatarUrl: preview,
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleAccountSave = () => {
    if (!currentUser) {
      return
    }

    const updatedUser = updateStoredUserProfile({
      firstName: accountForm.firstName.trim(),
      lastName: accountForm.lastName.trim(),
      email: accountForm.email.trim(),
      contactNumber: accountForm.contactNumber.trim(),
      position: accountForm.position.trim(),
      avatarUrl: accountForm.avatarUrl,
    })

    if (!updatedUser) {
      setAccountMessage(t(language, 'settings.accountUpdateFailed'))
      return
    }

    onUserUpdate(updatedUser)
    setAccountMessage(t(language, 'settings.accountUpdated'))
  }

  const handlePreferencesSave = () => {
    saveAppSettings(settings)
    applyTheme(settings.theme)
    setPreferencesMessage(t(language, 'settings.preferencesSaved'))
  }

  const avatarLetter = (currentUser?.username?.charAt(0) ?? 'G').toUpperCase()
  const activeAvatar = accountForm.avatarUrl || currentUser?.avatarUrl || ''

  return (
    <div className={styles.page}>
      <section className={`dashboard-panel ${styles.panel}`}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{t(language, 'settings.title')}</h2>
            <p className={styles.subtitle}>{t(language, 'settings.subtitle')}</p>
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
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {activeAvatar ? (
                <div
                  className={styles.avatarImage}
                  style={{ backgroundImage: `url(${activeAvatar})` }}
                />
              ) : (
                avatarLetter
              )}
            </div>

            <div className={styles.profileMeta}>
              <h3>{displayName}</h3>
              <p>{accountForm.email || currentUser?.email || t(language, 'settings.noEmail')}</p>
            </div>

            <div className={styles.badges}>
              <span className={styles.badge}>
                {t(language, 'settings.primaryAccount')}
              </span>
              <span className={styles.badgeMuted}>
                {
                  languageOptions.find((option) => option.value === settings.language)
                    ?.label
                }
              </span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div>
              <span className={styles.summaryLabel}>
                {t(language, 'settings.workspaceTheme')}
              </span>
              <strong className={styles.summaryValue}>
                {themeOptions.find((option) => option.value === settings.theme)?.label}
              </strong>
            </div>
            <div>
              <span className={styles.summaryLabel}>
                {t(language, 'settings.timezone')}
              </span>
              <strong className={styles.summaryValue}>{settings.timezone}</strong>
            </div>
            <div>
              <span className={styles.summaryLabel}>{t(language, 'settings.alerts')}</span>
              <strong className={styles.summaryValue}>
                {settings.emailNotifications || settings.desktopAlerts
                  ? t(language, 'settings.enabled')
                  : t(language, 'settings.minimal')}
              </strong>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{t(language, 'settings.profileDetails')}</h3>
              <p>{t(language, 'settings.profileDescription')}</p>
            </div>

            <div className={styles.formGrid}>
              <label className={`${styles.field} ${styles.fullWidth}`}>
                <span>{t(language, 'settings.avatar')}</span>
                <div className={styles.avatarField}>
                  <div className={styles.avatarPreview}>
                    {activeAvatar ? (
                      <div
                        className={styles.avatarPreviewImage}
                        style={{ backgroundImage: `url(${activeAvatar})` }}
                      />
                    ) : (
                      <span>{avatarLetter}</span>
                    )}
                  </div>

                  <div className={styles.avatarControls}>
                    <input
                      className={styles.fileInput}
                      id="settings-avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <label className={styles.uploadButton} htmlFor="settings-avatar">
                      {t(language, 'settings.avatarUpload')}
                    </label>
                    <p className={styles.avatarHint}>
                      {t(language, 'settings.avatarHint')}
                    </p>
                  </div>
                </div>
              </label>

              <label className={styles.field}>
                <span>{t(language, 'settings.firstName')}</span>
                <Input
                  className={styles.input}
                  value={accountForm.firstName}
                  onChange={(event) => {
                    handleAccountFieldChange('firstName', event.target.value)
                  }}
                />
              </label>

              <label className={styles.field}>
                <span>{t(language, 'settings.lastName')}</span>
                <Input
                  className={styles.input}
                  value={accountForm.lastName}
                  onChange={(event) => {
                    handleAccountFieldChange('lastName', event.target.value)
                  }}
                />
              </label>

              <label className={`${styles.field} ${styles.fullWidth}`}>
                <span>{t(language, 'settings.email')}</span>
                <Input
                  className={styles.input}
                  type="email"
                  value={accountForm.email}
                  onChange={(event) => {
                    handleAccountFieldChange('email', event.target.value)
                  }}
                />
              </label>

              <label className={styles.field}>
                <span>{t(language, 'settings.contactNumber')}</span>
                <IMaskInput
                  mask="+{7} (000) 000-00-00"
                  lazy={false}
                  overwrite
                  className={`${inputStyles.myInput} ${styles.input}`}
                  value={accountForm.contactNumber}
                  onAccept={(value) => {
                    handleAccountFieldChange('contactNumber', String(value))
                  }}
                />
              </label>

              <label className={styles.field}>
                <span>{t(language, 'settings.position')}</span>
                <Input
                  className={styles.input}
                  value={accountForm.position}
                  onChange={(event) => {
                    handleAccountFieldChange('position', event.target.value)
                  }}
                />
              </label>
            </div>

            <div className={styles.actions}>
              <Button className={styles.primaryButton} onClick={handleAccountSave}>
                {t(language, 'settings.updateInfo')}
              </Button>
              <Button
                className={`${styles.primaryButton} ${styles.secondaryButton}`}
                onClick={() => {
                  setAccountMessage(t(language, 'settings.passwordFlow'))
                }}
              >
                {t(language, 'settings.changePassword')}
              </Button>
            </div>

            {accountMessage ? <p className={styles.message}>{accountMessage}</p> : null}
          </section>

          <div className={styles.rightColumn}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{t(language, 'settings.appearance')}</h3>
                <p>{t(language, 'settings.appearanceDescription')}</p>
              </div>

              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>{t(language, 'settings.theme')}</span>
                <div className={styles.segmentRow}>
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.segmentButton}${settings.theme === option.value ? ` ${styles.segmentButtonActive}` : ''}`}
                      type="button"
                      onClick={() => {
                        setPreferencesMessage('')
                        setSettings((current) => ({
                          ...current,
                          theme: option.value,
                        }))
                      }}
                    >
                      <strong>{option.label}</strong>
                      <span>{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>
                  {t(language, 'settings.language')}
                </span>
                <div className={styles.languageRow}>
                  {languageOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.languageButton}${settings.language === option.value ? ` ${styles.languageButtonActive}` : ''}`}
                      type="button"
                      onClick={() => {
                        setPreferencesMessage('')
                        setSettings((current) => ({
                          ...current,
                          language: option.value,
                        }))
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className={styles.field}>
                <span>{t(language, 'settings.timezone')}</span>
                <Input
                  className={styles.input}
                  value={settings.timezone}
                  onChange={(event) => {
                    setPreferencesMessage('')
                    setSettings((current) => ({
                      ...current,
                      timezone: event.target.value,
                    }))
                  }}
                />
              </label>

              <Button className={styles.primaryButton} onClick={handlePreferencesSave}>
                {t(language, 'settings.savePreferences')}
              </Button>

              {preferencesMessage ? (
                <p className={styles.message}>{preferencesMessage}</p>
              ) : null}
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{t(language, 'settings.notifications')}</h3>
                <p>{t(language, 'settings.notificationsDescription')}</p>
              </div>

              <div className={styles.checkboxList}>
                <Checkbox
                  checked={settings.emailNotifications}
                  label={t(language, 'settings.emailReminders')}
                  onChange={(event) => {
                    setPreferencesMessage('')
                    setSettings((current) => ({
                      ...current,
                      emailNotifications: event.target.checked,
                    }))
                  }}
                />
                <Checkbox
                  checked={settings.desktopAlerts}
                  label={t(language, 'settings.desktopAlerts')}
                  onChange={(event) => {
                    setPreferencesMessage('')
                    setSettings((current) => ({
                      ...current,
                      desktopAlerts: event.target.checked,
                    }))
                  }}
                />
                <Checkbox
                  checked={settings.weeklySummary}
                  label={t(language, 'settings.weeklySummary')}
                  onChange={(event) => {
                    setPreferencesMessage('')
                    setSettings((current) => ({
                      ...current,
                      weeklySummary: event.target.checked,
                    }))
                  }}
                />
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{t(language, 'settings.workspaceDetails')}</h3>
                <p>{t(language, 'settings.workspaceDetailsDescription')}</p>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span>{t(language, 'settings.username')}</span>
                  <strong>{currentUser?.username ?? t(language, 'common.guest')}</strong>
                </div>
                <div className={styles.infoItem}>
                  <span>{t(language, 'settings.role')}</span>
                  <strong>{accountForm.position || t(language, 'settings.teamMember')}</strong>
                </div>
                <div className={styles.infoItem}>
                  <span>{t(language, 'settings.activeLanguage')}</span>
                  <strong>
                    {
                      languageOptions.find((option) => option.value === settings.language)
                        ?.label
                    }
                  </strong>
                </div>
                <div className={styles.infoItem}>
                  <span>{t(language, 'settings.securityStatus')}</span>
                  <strong>{t(language, 'settings.protected')}</strong>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
