import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import classes from './Button.module.scss'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

const Button = ({
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  const buttonClassName = className
    ? `${classes.myButton} ${className}`
    : classes.myButton

  return (
    <button className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  )
}

export default Button
