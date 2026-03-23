import { useState } from 'react'
import type { LanguageMode, ThemeMode } from '../../features/settings/settingsStorage'
import { t } from '../../features/settings/translations'
import { registerUser } from '../../features/auth/authStorage'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm/AuthForm'
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout'
import signUpIllustration from '../../assets/images/sign-up-illustration.svg'
import styles from './SignUpPage.module.scss'

type SignUpPageProps = {
  currentTheme: ThemeMode
  onRegisterSuccess: () => void
  onThemeChange: (theme: ThemeMode) => void
  language: LanguageMode
}

const SignUpPage = ({
  currentTheme,
  onRegisterSuccess,
  onThemeChange,
  language,
}: SignUpPageProps) => {
  const signUpFields: AuthField[] = [
    {
      name: 'firstName',
      placeholder: t(language, 'auth.firstNamePlaceholder'),
      icon: 'user',
    },
    {
      name: 'lastName',
      placeholder: t(language, 'auth.lastNamePlaceholder'),
      icon: 'user',
    },
    {
      name: 'username',
      placeholder: t(language, 'auth.usernamePlaceholder'),
      icon: 'user',
    },
    {
      name: 'email',
      placeholder: t(language, 'auth.emailPlaceholder'),
      type: 'email',
      icon: 'email',
    },
    {
      name: 'password',
      placeholder: t(language, 'auth.passwordPlaceholder'),
      type: 'password',
      icon: 'lock',
    },
    {
      name: 'confirmPassword',
      placeholder: t(language, 'auth.confirmPasswordPlaceholder'),
      type: 'password',
      icon: 'lock',
    },
  ]

  const [values, setValues] = useState<Record<string, string>>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async () => {
    const requiredFields = [
      values.firstName,
      values.lastName,
      values.username,
      values.email,
      values.password,
      values.confirmPassword,
    ]

    if (requiredFields.some((field) => !field.trim())) {
      setErrorMessage(t(language, 'auth.fillRegistration'))
      return
    }

    if (!agreedToTerms) {
      setErrorMessage(t(language, 'auth.acceptTerms'))
      return
    }

    if (values.password !== values.confirmPassword) {
      setErrorMessage(t(language, 'auth.passwordMismatch'))
      return
    }

    const result = await registerUser({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password,
    })

    if (!result.success) {
      setErrorMessage(result.message)
      return
    }

    setErrorMessage('')
    onRegisterSuccess()
  }

  return (
    <div className={styles.page}>
      <AuthLayout
        currentTheme={currentTheme}
        darkLabel={t(language, 'theme.soft-dark')}
        illustrationAlt="Registration illustration"
        illustrationSide="left"
        illustrationSrc={signUpIllustration}
        lightLabel={t(language, 'theme.light')}
        onThemeChange={onThemeChange}
        title={t(language, 'auth.signUp')}
      >
        <AuthForm
          checkboxChecked={agreedToTerms}
          checkboxLabel={t(language, 'auth.agreeTerms')}
          errorMessage={errorMessage}
          fields={signUpFields}
          footerLinkHash="#sign-in"
          footerLinkLabel={t(language, 'auth.signInLink')}
          footerText={t(language, 'auth.haveAccount')}
          submitLabel={t(language, 'auth.register')}
          values={values}
          onChange={(name, value) => {
            setErrorMessage('')
            setValues((current) => ({
              ...current,
              [name]: value,
            }))
          }}
          onCheckboxChange={(checked) => {
            setErrorMessage('')
            setAgreedToTerms(checked)
          }}
          onSubmit={handleSubmit}
        />
      </AuthLayout>
    </div>
  )
}

export default SignUpPage
