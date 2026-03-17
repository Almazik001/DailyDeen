import styles from './SocialLogin.module.scss'

const socialItems = [
  { label: 'Facebook', short: 'f', tone: 'facebook' },
  { label: 'Google', short: 'G', tone: 'google' },
  { label: 'X', short: 'X', tone: 'x' },
] as const

type SocialLoginProps = {
  title?: string
}

const SocialLogin = ({ title = 'Or, Login with' }: SocialLoginProps) => {
  return (
    <div className={styles.block}>
      <p className={styles.title}>{title}</p>

      <div className={styles.icons}>
        {socialItems.map((item) => (
          <button
            key={item.label}
            aria-label={item.label}
            className={`${styles.iconButton} ${styles[item.tone]}`}
            type="button"
          >
            {item.short}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SocialLogin
