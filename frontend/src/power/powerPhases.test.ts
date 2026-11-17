import { describe, expect, it } from 'vitest'
import { AUTO_NEXT, ENTER_SOUND, requestLogIn, requestRestart, type PowerPhase } from './powerPhases.ts'

/** Recorre las transiciones automáticas desde una fase hasta que se detienen. */
function autoPath(from: PowerPhase): PowerPhase[] {
  const path: PowerPhase[] = [from]
  let next = AUTO_NEXT[from]
  while (next && path.length < 20) {
    path.push(next.to)
    next = AUTO_NEXT[next.to]
  }
  return path
}

describe('ciclo de energía', () => {
  it('reiniciar solo funciona con el equipo encendido', () => {
    expect(requestRestart('running')).toBe('shuttingDown')
    for (const p of ['shuttingDown', 'off', 'booting', 'welcome', 'loggingIn'] as const) {
      expect(requestRestart(p)).toBe(p)
    }
  })

  it('iniciar sesión solo funciona desde la bienvenida', () => {
    expect(requestLogIn('welcome')).toBe('loggingIn')
    for (const p of ['running', 'shuttingDown', 'off', 'booting', 'loggingIn'] as const) {
      expect(requestLogIn(p)).toBe(p)
    }
  })

  it('apagado → negro → arranque → bienvenida, y ahí espera al usuario', () => {
    expect(autoPath('shuttingDown')).toEqual(['shuttingDown', 'off', 'booting', 'welcome'])
    expect(AUTO_NEXT.welcome).toBeUndefined()
  })

  it('al iniciar sesión carga la configuración y vuelve al escritorio', () => {
    expect(autoPath('loggingIn')).toEqual(['loggingIn', 'running'])
  })

  it('un ciclo completo regresa a running sin quedar trabado', () => {
    const phases = [...autoPath(requestRestart('running')), ...autoPath(requestLogIn('welcome'))]
    expect(phases.at(-1)).toBe('running')
  })

  it('el equipo encendido no avanza solo, así no hay timers corriendo en el escritorio', () => {
    expect(AUTO_NEXT.running).toBeUndefined()
  })

  it('apagado, bienvenida y escritorio tienen sonido de entrada; la pantalla negra y el arranque no', () => {
    expect(ENTER_SOUND).toEqual({ shuttingDown: 'shutdown', welcome: 'startup', running: 'logon' })
  })
})
