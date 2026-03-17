import type { FormEvent, ReactNode } from 'react'
import Button from '../../ui/Button/Button'
import Checkbox from '../../ui/Checkbox/Checkbox'
import Input from '../../ui/Input/Input'
import SocialLogin from '../SocialLogin/SocialLogin'
import styles from './AuthForm.module.scss'

type AuthField = {
  name: string
  type?: 'text' | 'email' | 'password'
  placeholder: string
  icon: 'user' | 'email' | 'lock'
}

type AuthFormProps = {
  fields: AuthField[]
  values: Record<string, string>
  onChange: (name: string, value: string) => void
  onSubmit?: () => void
  errorMessage?: string
  checkboxLabel: string
  checkboxChecked: boolean
  onCheckboxChange: (checked: boolean) => void
  submitLabel: string
  footerText: string
  footerLinkLabel: string
  footerLinkHash: string
  socialLoginTitle?: string
  showSocialLogin?: boolean
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z" />
      <path d="M4.8 19.2a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 6.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7.8a4 4 0 1 1 8 0V10" />
    </svg>
  )
}

const iconMap = {
  user: <UserIcon />,
  email: <EmailIcon />,
  lock: <LockIcon />,
} satisfies Record<AuthField['icon'], ReactNode>

const AuthForm = ({
  fields,
  values,
  onChange,
  onSubmit,
  errorMessage,
  checkboxLabel,
  checkboxChecked,
  onCheckboxChange,
  submitLabel,
  footerText,
  footerLinkLabel,
  footerLinkHash,
  socialLoginTitle,
  showSocialLogin = false,
}: AuthFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        {fields.map((field) => (
          <label className={styles.field} key={field.name}>
            <span className={styles.icon}>{iconMap[field.icon]}</span>
            <Input
              className={styles.input}
              name={field.name}
              placeholder={field.placeholder}
              type={field.type ?? 'text'}
              value={values[field.name] ?? ''}
              onChange={(event) => {
                onChange(field.name, event.target.value)
              }}
            />
          </label>
        ))}
      </div>

      <Checkbox
        checked={checkboxChecked}
        className={styles.checkbox}
        label={checkboxLabel}
        onChange={(event) => {
          onCheckboxChange(event.target.checked)
        }}
      />

      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

      <Button className={styles.submitButton} type="submit">
        {submitLabel}
      </Button>

      {showSocialLogin ? <SocialLogin title={socialLoginTitle} /> : null}

      <p className={styles.footer}>
        <span>{footerText} </span>
        <a href={footerLinkHash}>{footerLinkLabel}</a>
      </p>
    </form>
  )
}

export type { AuthField }
export default AuthForm
