import {
  useEffect,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'

type ModalProps = PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
  header?: ReactNode
  className?: string
}>

const Modal = ({
  isOpen,
  onClose,
  header,
  className = '',
  children,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !document.body) {
    return null
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const panelClassName = className
    ? `${styles.panel} ${className}`
    : styles.panel

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={panelClassName} role="dialog" aria-modal="true">
        {header ? <div className={styles.header}>{header}</div> : null}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
