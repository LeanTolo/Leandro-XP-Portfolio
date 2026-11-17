import type { SoundName } from '../audio/sounds.ts'

/**
 * Ciclo de energía del "equipo". Es una máquina de estados pura (sin React, sin timers):
 * el hook `usePower` la ejecuta; acá solo se define qué transiciones existen.
 *
 *   running → shuttingDown → off → booting → welcome → loggingIn → running
 *                (auto)      (auto)  (auto)   (clic)     (auto)
 */
export type PowerPhase = 'running' | 'shuttingDown' | 'off' | 'booting' | 'welcome' | 'loggingIn'

/** Fases que avanzan solas y a los cuántos ms. `welcome` no está: espera que el usuario inicie sesión. */
export const AUTO_NEXT: Partial<Record<PowerPhase, { to: PowerPhase; afterMs: number }>> = {
  shuttingDown: { to: 'off', afterMs: 3500 },
  off: { to: 'booting', afterMs: 2000 }, // el sonido de apagado (~6,5 s) casi termina sobre la pantalla negra
  booting: { to: 'welcome', afterMs: 4000 },
  loggingIn: { to: 'running', afterMs: 2000 },
}

/** Sonido que suena al ENTRAR a cada fase. Nunca se dispara en la carga inicial: no es una transición. */
export const ENTER_SOUND: Partial<Record<PowerPhase, SoundName>> = {
  shuttingDown: 'shutdown',
  welcome: 'startup',
  running: 'logon',
}

/** Solo se puede reiniciar un equipo encendido; en cualquier otra fase el pedido se ignora. */
export function requestRestart(phase: PowerPhase): PowerPhase {
  return phase === 'running' ? 'shuttingDown' : phase
}

/** Solo se puede iniciar sesión desde la pantalla de bienvenida. */
export function requestLogIn(phase: PowerPhase): PowerPhase {
  return phase === 'welcome' ? 'loggingIn' : phase
}
