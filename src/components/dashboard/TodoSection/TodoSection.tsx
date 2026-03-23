import type { LanguageMode } from '../../../features/settings/settingsStorage'
import TodoSelect from '../../task/TodoSelect/TodoSelect'
import './TodoSection.module.scss'

type TodoSectionProps = {
  language: LanguageMode
}

const TodoSection = ({ language }: TodoSectionProps) => {
  return <TodoSelect language={language} />
}

export default TodoSection
