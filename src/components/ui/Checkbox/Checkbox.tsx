import type { InputHTMLAttributes } from 'react'
import styles from './Checkbox.module.scss'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
}

const Checkbox = ({
  className = '',
  label,
  id,
  checked,
  ...props
}: CheckboxProps) => {
  const inputId = id ?? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`
  const rootClassName = className
    ? `${styles.checkbox} ${className}`
    : styles.checkbox

  return (
    <label className={rootClassName} htmlFor={inputId}>
      <input
        {...props}
        checked={checked}
        className={styles.input}
        id={inputId}
        type="checkbox"
      />
      <span className={styles.box} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </label>
  )
}

export default Checkbox
