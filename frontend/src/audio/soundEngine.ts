import { sounds, type SoundName } from './sounds.ts'

const VOLUME = 0.5

/**
 * Los sonidos arrancan ACTIVADOS en cada carga; el botón del parlante los silencia solo
 * durante la sesión (no se persiste: un mute viejo no debe dejar la página muda al volver).
 * Los navegadores exigen una interacción previa para reproducir audio, y todos los sonidos
 * nacen de un clic o toque del usuario, así que no hace falta una activación aparte.
 */
let enabled = true
const listeners = new Set<() => void>()

// Contrato de useSyncExternalStore: subscribe + snapshot.
export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function isSoundEnabled(): boolean {
  return enabled
}

export function setSoundEnabled(value: boolean): void {
  if (enabled === value) return
  enabled = value
  listeners.forEach((l) => l())
  if (value) play('ding')
}

export function play(name: SoundName): void {
  if (!enabled) return
  try {
    // Un Audio nuevo por reproducción permite que se superpongan; el navegador cachea el archivo.
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/${sounds[name]}`)
    audio.volume = VOLUME
    audio.play().catch(() => {
      /* autoplay bloqueado o archivo no disponible: la UI sigue funcionando en silencio */
    })
  } catch {
    /* entorno sin Audio */
  }
}
