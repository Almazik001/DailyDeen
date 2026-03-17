import type { InputHTMLAttributes } from 'react'
import classes from './MyInput.module.scss'

type MyInputProps = InputHTMLAttributes<HTMLInputElement>

const MyInput = ({ type = 'text', ...props }: MyInputProps) => {
  return <input className={classes.myInput} {...props} type={type} />
}

export default MyInput
