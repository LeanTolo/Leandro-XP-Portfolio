export type WindowState = 'normal' | 'minimized' | 'maximized'

export interface WindowInstance {
  id: string
  appId: string
  title: string
  /** Bounds en estado "normal". Maximizar no los pisa, así restaurar es trivial. */
  x: number
  y: number
  width: number
  height: number
  state: WindowState
  /** Si estaba maximizada antes de minimizarse, al restaurar vuelve maximizada. */
  wasMaximized: boolean
  z: number
}

export interface WindowManagerState {
  windows: WindowInstance[]
  activeId: string | null
  zCounter: number
  idCounter: number
}

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export type WindowAction =
  | { type: 'open'; appId: string; title: string; width: number; height: number; viewport: { width: number; height: number } }
  | { type: 'close'; id: string }
  | { type: 'focus'; id: string }
  | { type: 'minimize'; id: string }
  | { type: 'maximize'; id: string }
  | { type: 'restore'; id: string }
  | { type: 'toggleMaximize'; id: string }
  | { type: 'setBounds'; id: string; bounds: Bounds }
