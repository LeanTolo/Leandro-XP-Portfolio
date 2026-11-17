import { useSyncExternalStore } from 'react'
import { isSoundEnabled, setSoundEnabled, subscribe } from './soundEngine.ts'

/** Estado del mute global. El motor vive fuera de React; el hook solo se suscribe a él. */
export function useSoundEnabled(): [boolean, (value: boolean) => void] {
  const enabled = useSyncExternalStore(subscribe, isSoundEnabled)
  return [enabled, setSoundEnabled]
}
