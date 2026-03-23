import type { InputHTMLAttributes } from 'react'
import classes from './Input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = ({ className = '', type = 'text', ...props }: InputProps) => {
  const inputClassName = className
    ? `${classes.myInput} ${className}`
    : classes.myInput

  return <input className={inputClassName} {...props} type={type} />
}

export default Input
