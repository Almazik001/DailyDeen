import type { InputHTMLAttributes } from 'react'
import classes from './Input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = ({ type = 'text', ...props }: InputProps) => {
  return <input className={classes.myInput} {...props} type={type} />
}

export default Input
