import { useCallback, useEffect, useState } from 'react'
import { play } from '../audio/soundEngine.ts'
import { AUTO_NEXT, ENTER_SOUND, requestLogIn, requestRestart, type PowerPhase } from './powerPhases.ts'

/**
 * Ejecuta la máquina de `powerPhases`: guarda la fase, programa los avances automáticos
 * y dispara el sonido de cada transición. Se abre en `running`: un visitante del portfolio
 * ve el escritorio de inmediato, sin pasar por el arranque.
 */
export function usePower() {
  const [phase, setPhase] = useState<PowerPhase>('running')

  // Los sonidos se disparan al transicionar (no en un efecto sobre `phase`): así no se duplican con StrictMode.
  const go = useCallback((to: PowerPhase) => {
    setPhase(to)
    const sound = ENTER_SOUND[to]
    if (sound) play(sound)
  }, [])

  useEffect(() => {
    const next = AUTO_NEXT[phase]
    if (!next) return
    const id = setTimeout(() => go(next.to), next.afterMs)
    return () => clearTimeout(id)
  }, [phase, go])

  const restart = useCallback(() => {
    const to = requestRestart(phase)
    if (to !== phase) go(to)
  }, [phase, go])

  const logIn = useCallback(() => {
    const to = requestLogIn(phase)
    if (to !== phase) go(to)
  }, [phase, go])

  return { phase, restart, logIn }
}
