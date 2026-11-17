import { Icon } from '../components/Icon.tsx'
import { USER_NAME } from '../config/user.ts'
import styles from './PowerScreen.module.css'
import type { PowerPhase } from './powerPhases.ts'

interface Props {
  /** Cualquier fase menos `running` (el escritorio lo renderiza App). */
  phase: Exclude<PowerPhase, 'running'>
  onLogIn: () => void
}

/** Wordmark propio (no el logo de Microsoft). */
function Brand() {
  return (
    <div className={styles.brand} aria-hidden="true">
      <span className={styles.brandName}>Leandro</span>
      <span className={styles.brandOs}>OS</span>
    </div>
  )
}

/** Pantallas del ciclo de energía: cierre, negro, arranque, bienvenida y carga de sesión. */
export function PowerScreen({ phase, onLogIn }: Props) {
  switch (phase) {
    case 'shuttingDown':
      return (
        <div className={`${styles.screen} ${styles.shutdown}`}>
          <Brand />
          <p className={styles.message} role="status">
            Guardando tu configuración…
          </p>
        </div>
      )

    case 'off':
      return <div className={`${styles.screen} ${styles.off}`} role="status" aria-label="Equipo apagado" />

    case 'booting':
      return (
        <div className={`${styles.screen} ${styles.boot}`} role="status" aria-label="Iniciando el sistema">
          <Brand />
          <div className={styles.bar} aria-hidden="true">
            <div className={styles.chunks} />
          </div>
          <small className={styles.copyright}>© Leandro Toloza</small>
        </div>
      )

    case 'welcome':
    case 'loggingIn': {
      const loggingIn = phase === 'loggingIn'
      return (
        <div className={`${styles.screen} ${styles.welcome}`}>
          <div className={styles.topBand} />
          <div className={styles.middle}>
            <div className={styles.left}>
              <Brand />
              <p className={styles.hint}>{loggingIn ? '' : 'Para comenzar, hacé clic en tu nombre de usuario'}</p>
            </div>
            <div className={styles.right}>
              <button type="button" className={styles.user} onClick={onLogIn} disabled={loggingIn} autoFocus>
                <span className={styles.avatar}>
                  <Icon name="user" size={44} />
                </span>
                <span className={styles.userText}>
                  <strong>{USER_NAME}</strong>
                  {loggingIn && <em role="status">Cargando tu configuración personal…</em>}
                </span>
              </button>
            </div>
          </div>
          <div className={styles.bottomBand}>
            <span>Presioná Enter o hacé clic para iniciar sesión</span>
          </div>
        </div>
      )
    }
  }
}
