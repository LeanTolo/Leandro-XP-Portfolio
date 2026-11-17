import { useEffect } from 'react'
import { play } from '../audio/soundEngine.ts'
import { Icon } from '../components/Icon.tsx'
import { apps } from '../config/apps.ts'
import { USER_NAME } from '../config/user.ts'
import styles from './StartMenu.module.css'

interface Props {
  onOpenApp: (appId: string) => void
  onClose: () => void
  onRestart: () => void
}

export function StartMenu({ onOpenApp, onClose, onRestart }: Props) {
  // Cierra con clic fuera (excepto el botón Inicio, que alterna por su cuenta) o con Esc.
  useEffect(() => {
    const away = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-start-keep]')) onClose()
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', away)
      document.removeEventListener('keydown', key)
    }
  }, [onClose])

  const open = (id: string) => {
    play('menuCommand')
    onOpenApp(id)
    onClose()
  }
  const main = apps.filter((a) => a.startMenu === 'main')
  const places = apps.filter((a) => a.startMenu === 'places')

  return (
    <div className={styles.menu} data-start-keep role="menu" aria-label="Menú Inicio">
      <header className={styles.header}>
        <Icon name="user" size={42} />
        <strong>{USER_NAME}</strong>
      </header>

      <div className={styles.columns}>
        <ul className={styles.left}>
          {main.map((a) => (
            <li key={a.id}>
              <button type="button" role="menuitem" className={styles.leftItem} onClick={() => open(a.id)}>
                <Icon name={a.icon} size={32} />
                <span>{a.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <ul className={styles.right}>
          {places.map((a) => (
            <li key={a.id}>
              <button type="button" role="menuitem" className={styles.rightItem} onClick={() => open(a.id)}>
                <Icon name={a.icon} size={22} />
                <span>{a.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <footer className={styles.footer}>
        <button type="button" role="menuitem" className={styles.power} onClick={onRestart}>
          <Icon name="power" size={22} />
          <span>Reiniciar</span>
        </button>
      </footer>
    </div>
  )
}
