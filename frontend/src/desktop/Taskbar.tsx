import { useSoundEnabled } from '../audio/useSound.ts'
import { Icon } from '../components/Icon.tsx'
import { appsById } from '../config/apps.ts'
import { useWindowManager } from '../windowManager/WindowManagerContext.tsx'
import { Clock } from './Clock.tsx'
import styles from './Taskbar.module.css'

interface Props {
  startOpen: boolean
  onToggleStart: () => void
}

export function Taskbar({ startOpen, onToggleStart }: Props) {
  const { state, focus, minimize, restore } = useWindowManager()
  const [soundOn, setSoundOn] = useSoundEnabled()

  return (
    <footer className={styles.taskbar}>
      <button type="button" className={`${styles.start} ${startOpen ? styles.startOpen : ''}`} data-start-keep aria-haspopup="menu" aria-expanded={startOpen} onClick={onToggleStart}>
        <Icon name="logo" size={22} />
        <span>inicio</span>
      </button>

      <div className={styles.tasks} role="toolbar" aria-label="Ventanas abiertas">
        {state.windows.map((w) => {
          const isActive = state.activeId === w.id && w.state !== 'minimized'
          return (
            <button
              key={w.id}
              type="button"
              className={`${styles.task} ${isActive ? styles.taskActive : ''}`}
              aria-pressed={isActive}
              title={w.title}
              onClick={() => {
                if (w.state === 'minimized') restore(w.id)
                else if (isActive) minimize(w.id)
                else focus(w.id)
              }}
            >
              <Icon name={appsById[w.appId].icon} size={16} />
              <span>{w.title}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.tray}>
        <button
          type="button"
          className={styles.sound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
          title={soundOn ? 'Sonido activado (click para silenciar)' : 'Sonido silenciado (click para activar)'}
          onClick={() => setSoundOn(!soundOn)}
        >
          <Icon name={soundOn ? 'speaker' : 'speakerOff'} size={18} />
        </button>
        <Clock />
      </div>
    </footer>
  )
}
