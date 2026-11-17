import type { WindowAction, WindowInstance, WindowManagerState } from './types.ts'

export const initialState: WindowManagerState = {
  windows: [],
  activeId: null,
  zCounter: 0,
  idCounter: 0,
}

const CASCADE_STEP = 28

/** Ventana visible con mayor z, o null. Sirve para elegir quién toma el foco al minimizar/cerrar. */
function topVisibleId(windows: WindowInstance[], excludeId?: string): string | null {
  let best: WindowInstance | null = null
  for (const w of windows) {
    if (w.id === excludeId || w.state === 'minimized') continue
    if (!best || w.z > best.z) best = w
  }
  return best?.id ?? null
}

function patch(state: WindowManagerState, id: string, fn: (w: WindowInstance) => WindowInstance): WindowManagerState {
  return { ...state, windows: state.windows.map((w) => (w.id === id ? fn(w) : w)) }
}

/** Trae una ventana al frente (z más alto) y la marca activa. Si estaba minimizada, la restaura. */
function bringToFront(state: WindowManagerState, id: string): WindowManagerState {
  const target = state.windows.find((w) => w.id === id)
  if (!target) return state
  const z = state.zCounter + 1
  const next = patch(state, id, (w) => ({
    ...w,
    z,
    state: w.state === 'minimized' ? (w.wasMaximized ? 'maximized' : 'normal') : w.state,
    wasMaximized: false,
  }))
  return { ...next, zCounter: z, activeId: id }
}

export function windowReducer(state: WindowManagerState, action: WindowAction): WindowManagerState {
  switch (action.type) {
    case 'open': {
      // Una instancia por aplicación (Fase 1): reabrir enfoca la existente.
      const existing = state.windows.find((w) => w.appId === action.appId)
      if (existing) return bringToFront(state, existing.id)

      const { viewport } = action
      const width = Math.min(action.width, viewport.width)
      const height = Math.min(action.height, viewport.height)
      const offset = (state.windows.length % 8) * CASCADE_STEP
      const x = Math.max(0, Math.min(60 + offset, viewport.width - width))
      const y = Math.max(0, Math.min(40 + offset, viewport.height - height))
      const z = state.zCounter + 1
      const id = `win-${state.idCounter + 1}`
      const win: WindowInstance = {
        id,
        appId: action.appId,
        title: action.title,
        x,
        y,
        width,
        height,
        state: 'normal',
        wasMaximized: false,
        z,
      }
      return {
        windows: [...state.windows, win],
        activeId: id,
        zCounter: z,
        idCounter: state.idCounter + 1,
      }
    }

    case 'close': {
      const windows = state.windows.filter((w) => w.id !== action.id)
      const activeId = state.activeId === action.id ? topVisibleId(windows) : state.activeId
      return { ...state, windows, activeId }
    }

    case 'focus':
      return bringToFront(state, action.id)

    case 'minimize': {
      const target = state.windows.find((w) => w.id === action.id)
      if (!target || target.state === 'minimized') return state
      const next = patch(state, action.id, (w) => ({
        ...w,
        wasMaximized: w.state === 'maximized',
        state: 'minimized',
      }))
      const activeId = state.activeId === action.id ? topVisibleId(next.windows, action.id) : state.activeId
      return { ...next, activeId }
    }

    case 'maximize': {
      const next = patch(state, action.id, (w) => ({ ...w, state: 'maximized', wasMaximized: false }))
      return bringToFront(next, action.id)
    }

    case 'restore': {
      const target = state.windows.find((w) => w.id === action.id)
      if (!target) return state
      if (target.state === 'minimized') return bringToFront(state, action.id)
      const next = patch(state, action.id, (w) => ({ ...w, state: 'normal' }))
      return bringToFront(next, action.id)
    }

    case 'toggleMaximize': {
      const target = state.windows.find((w) => w.id === action.id)
      if (!target) return state
      return windowReducer(state, { type: target.state === 'maximized' ? 'restore' : 'maximize', id: action.id })
    }

    case 'setBounds':
      return patch(state, action.id, (w) => ({ ...w, ...action.bounds }))
  }
}
