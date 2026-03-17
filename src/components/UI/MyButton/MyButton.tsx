import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import classes from './MyButton.module.scss'

type MyButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

const MyButton = ({
  children,
  className = '',
  type = 'button',
  ...props
}: MyButtonProps) => {
  const buttonClassName = className
    ? `${classes.myButton} ${className}`
    : classes.myButton

  return (
    <button className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  )
}

export default MyButton
