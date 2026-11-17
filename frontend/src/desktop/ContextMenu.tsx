import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './ContextMenu.module.css'

export interface ContextMenuItem {
  label: string
  onSelect?: () => void
  bold?: boolean
  disabled?: boolean
  separator?: boolean
}

interface Props {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

export function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLUListElement>(null)
  const [pos, setPos] = useState({ left: x, top: y })

  // Mantiene el menú dentro del viewport.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({ left: Math.max(0, Math.min(x, window.innerWidth - r.width - 2)), top: Math.max(0, Math.min(y, window.innerHeight - r.height - 2)) })
    el.focus()
  }, [x, y])

  useEffect(() => {
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', away, true)
    document.addEventListener('keydown', key)
    window.addEventListener('blur', onClose)
    return () => {
      document.removeEventListener('pointerdown', away, true)
      document.removeEventListener('keydown', key)
      window.removeEventListener('blur', onClose)
    }
  }, [onClose])

  return (
    <ul ref={ref} className={styles.menu} style={pos} role="menu" tabIndex={-1}>
      {items.map((item, i) =>
        item.separator ? (
          <li key={i} className={styles.sep} role="separator" />
        ) : (
          <li key={i} role="none">
            <button
              type="button"
              role="menuitem"
              className={`${styles.item} ${item.bold ? styles.bold : ''}`}
              disabled={item.disabled}
              onClick={() => {
                item.onSelect?.()
                onClose()
              }}
            >
              {item.label}
            </button>
          </li>
        ),
      )}
    </ul>
  )
}
