import { describe, expect, it } from 'vitest'
import { initialState, windowReducer } from './reducer.ts'
import type { WindowAction, WindowManagerState } from './types.ts'

const viewport = { width: 1280, height: 720 }

function open(state: WindowManagerState, appId: string): WindowManagerState {
  const action: WindowAction = { type: 'open', appId, title: appId, width: 400, height: 300, viewport }
  return windowReducer(state, action)
}

function byApp(state: WindowManagerState, appId: string) {
  const w = state.windows.find((x) => x.appId === appId)
  if (!w) throw new Error(`window ${appId} not found`)
  return w
}

describe('windowReducer', () => {
  it('abre una ventana y la enfoca', () => {
    const s = open(initialState, 'a')
    expect(s.windows).toHaveLength(1)
    expect(s.activeId).toBe(s.windows[0].id)
  })

  it('reabrir la misma app enfoca la existente sin duplicar', () => {
    let s = open(initialState, 'a')
    s = open(s, 'b')
    s = open(s, 'a')
    expect(s.windows).toHaveLength(2)
    expect(s.activeId).toBe(byApp(s, 'a').id)
    expect(byApp(s, 'a').z).toBeGreaterThan(byApp(s, 'b').z)
  })

  it('enfocar sube el z-index por encima de todas', () => {
    let s = open(initialState, 'a')
    s = open(s, 'b')
    s = windowReducer(s, { type: 'focus', id: byApp(s, 'a').id })
    expect(byApp(s, 'a').z).toBeGreaterThan(byApp(s, 'b').z)
  })

  it('minimizar pasa el foco a la siguiente ventana visible', () => {
    let s = open(initialState, 'a')
    s = open(s, 'b')
    s = windowReducer(s, { type: 'minimize', id: byApp(s, 'b').id })
    expect(byApp(s, 'b').state).toBe('minimized')
    expect(s.activeId).toBe(byApp(s, 'a').id)
  })

  it('minimizar la única ventana deja activeId en null', () => {
    let s = open(initialState, 'a')
    s = windowReducer(s, { type: 'minimize', id: s.windows[0].id })
    expect(s.activeId).toBeNull()
  })

  it('restaurar una ventana minimizada la enfoca', () => {
    let s = open(initialState, 'a')
    s = windowReducer(s, { type: 'minimize', id: s.windows[0].id })
    s = windowReducer(s, { type: 'restore', id: s.windows[0].id })
    expect(s.windows[0].state).toBe('normal')
    expect(s.activeId).toBe(s.windows[0].id)
  })

  it('maximizada -> minimizada -> restaurada vuelve maximizada', () => {
    let s = open(initialState, 'a')
    const id = s.windows[0].id
    s = windowReducer(s, { type: 'maximize', id })
    s = windowReducer(s, { type: 'minimize', id })
    s = windowReducer(s, { type: 'restore', id })
    expect(s.windows[0].state).toBe('maximized')
  })

  it('maximizar y restaurar conserva los bounds originales', () => {
    let s = open(initialState, 'a')
    const before = { ...s.windows[0] }
    s = windowReducer(s, { type: 'toggleMaximize', id: before.id })
    expect(s.windows[0].state).toBe('maximized')
    s = windowReducer(s, { type: 'toggleMaximize', id: before.id })
    const w = s.windows[0]
    expect([w.state, w.x, w.y, w.width, w.height]).toEqual(['normal', before.x, before.y, before.width, before.height])
  })

  it('cerrar la ventana activa enfoca la de mayor z restante', () => {
    let s = open(initialState, 'a')
    s = open(s, 'b')
    s = open(s, 'c')
    s = windowReducer(s, { type: 'close', id: byApp(s, 'c').id })
    expect(s.windows).toHaveLength(2)
    expect(s.activeId).toBe(byApp(s, 'b').id)
  })

  it('las ventanas nuevas se cascadean y respetan el viewport', () => {
    let s = open(initialState, 'a')
    s = open(s, 'b')
    expect(byApp(s, 'b').x).toBeGreaterThan(byApp(s, 'a').x)
    const tiny = windowReducer(initialState, { type: 'open', appId: 'x', title: 'x', width: 900, height: 900, viewport: { width: 300, height: 400 } })
    expect(tiny.windows[0].width).toBe(300)
    expect(tiny.windows[0].height).toBe(400)
  })
})
