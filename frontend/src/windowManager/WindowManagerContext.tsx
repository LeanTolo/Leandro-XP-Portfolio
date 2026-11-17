import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { play } from '../audio/soundEngine.ts'
import { appsById } from '../config/apps.ts'
import { initialState, windowReducer } from './reducer.ts'
import type { Bounds, WindowManagerState } from './types.ts'

interface WindowManagerApi {
  state: WindowManagerState
  /** `area` = tamaño del área de escritorio (viewport menos taskbar), para posicionar la ventana nueva. */
  openApp: (appId: string, area: { width: number; height: number }) => void
  close: (id: string) => void
  focus: (id: string) => void
  minimize: (id: string) => void
  toggleMaximize: (id: string) => void
  restore: (id: string) => void
  setBounds: (id: string, bounds: Bounds) => void
}

const Ctx = createContext<WindowManagerApi | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, initialState)

  const openApp = useCallback((appId: string, area: { width: number; height: number }) => {
    const app = appsById[appId]
    if (!app) return
    dispatch({ type: 'open', appId, title: app.title, ...app.defaultSize, viewport: area })
  }, [])

  const api = useMemo<WindowManagerApi>(
    () => ({
      state,
      openApp,
      close: (id) => dispatch({ type: 'close', id }),
      focus: (id) => dispatch({ type: 'focus', id }),
      // Los sonidos son efectos secundarios: viven acá y no en el reducer, que se mantiene puro.
      // Como en XP, abrir y cerrar ventanas es silencioso.
      minimize: (id) => {
        dispatch({ type: 'minimize', id })
        play('minimize')
      },
      toggleMaximize: (id) => {
        dispatch({ type: 'toggleMaximize', id })
        play('restore')
      },
      restore: (id) => {
        dispatch({ type: 'restore', id })
        play('restore')
      },
      setBounds: (id, bounds) => dispatch({ type: 'setBounds', id, bounds }),
    }),
    [state, openApp],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useWindowManager(): WindowManagerApi {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWindowManager must be used inside WindowManagerProvider')
  return ctx
}
