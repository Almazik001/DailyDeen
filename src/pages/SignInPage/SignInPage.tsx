import { useState } from 'react'
import type { LanguageMode, ThemeMode } from '../../features/settings/settingsStorage'
import { t } from '../../features/settings/translations'
import { loginUser } from '../../features/auth/authStorage'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm/AuthForm'
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout'
import signInIllustration from '../../assets/images/sign-in-illustration.svg'
import styles from './SignInPage.module.scss'

type SignInPageProps = {
  currentTheme: ThemeMode
  onLoginSuccess: () => void
  onThemeChange: (theme: ThemeMode) => void
  language: LanguageMode
}

const SignInPage = ({
  currentTheme,
  onLoginSuccess,
  onThemeChange,
  language,
}: SignInPageProps) => {
  const signInFields: AuthField[] = [
    {
      name: 'username',
      placeholder: t(language, 'auth.usernamePlaceholder'),
      icon: 'user',
    },
    {
      name: 'password',
      placeholder: t(language, 'auth.passwordPlaceholder'),
      type: 'password',
      icon: 'lock',
    },
  ]

  const [values, setValues] = useState<Record<string, string>>({
    username: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    const username = values.username.trim()
    const password = values.password

    if (!username || !password) {
      setErrorMessage(t(language, 'auth.fillCredentials'))
      return
    }

    const result = await loginUser(username, password, rememberMe)

    if (!result.success) {
      setErrorMessage(result.message)
      return
    }

    setErrorMessage('')
    onLoginSuccess()
  }

  return (
    <div className={styles.page}>
      <AuthLayout
        currentTheme={currentTheme}
        darkLabel={t(language, 'theme.soft-dark')}
        illustrationAlt="Mobile app sign in illustration"
        illustrationSide="right"
        illustrationSrc={signInIllustration}
        lightLabel={t(language, 'theme.light')}
        onThemeChange={onThemeChange}
        title={t(language, 'auth.signIn')}
      >
        <AuthForm
          checkboxChecked={rememberMe}
          checkboxLabel={t(language, 'auth.rememberMe')}
          errorMessage={errorMessage}
          fields={signInFields}
          footerLinkHash="#sign-up"
          footerLinkLabel={t(language, 'auth.createOne')}
          footerText={t(language, 'auth.noAccount')}
          showSocialLogin
          socialLoginTitle={t(language, 'auth.orLoginWith')}
          submitLabel={t(language, 'auth.login')}
          values={values}
          onChange={(name, value) => {
            setErrorMessage('')
            setValues((current) => ({
              ...current,
              [name]: value,
            }))
          }}
          onCheckboxChange={setRememberMe}
          onSubmit={handleSubmit}
        />
      </AuthLayout>
    </div>
  )
}

export default SignInPage
