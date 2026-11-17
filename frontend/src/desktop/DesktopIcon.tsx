import type { MouseEvent } from 'react'
import { Icon } from '../components/Icon.tsx'
import type { AppDefinition } from '../config/apps.ts'
import styles from './DesktopIcon.module.css'

interface Props {
  app: AppDefinition
  selected: boolean
  isMobile: boolean
  onSelect: () => void
  onOpen: () => void
  onContextMenu: (e: MouseEvent) => void
}

export function DesktopIcon({ app, selected, isMobile, onSelect, onOpen, onContextMenu }: Props) {
  return (
    <button
      type="button"
      className={`${styles.icon} ${selected ? styles.selected : ''}`}
      // En táctil un toque abre la app (no hay doble clic cómodo).
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
        if (isMobile) onOpen()
      }}
      onDoubleClick={onOpen}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onSelect()
        onContextMenu(e)
      }}
      onFocus={onSelect}
    >
      <span className={styles.glyph}>
        <Icon name={app.icon} size={40} />
      </span>
      <span className={styles.label}>{app.title}</span>
    </button>
  )
}
