import { Suspense, memo, useCallback, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { Icon } from '../components/Icon.tsx'
import { appsById } from '../config/apps.ts'
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH, getDesktopArea } from '../config/layout.ts'
import { useWindowManager } from '../windowManager/WindowManagerContext.tsx'
import type { Bounds, WindowInstance } from '../windowManager/types.ts'
import styles from './Window.module.css'

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const RESIZE_DIRS: ResizeDir[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
/** Cuánto de la ventana debe quedar visible al arrastrarla fuera del área. */
const KEEP_VISIBLE = 80

interface Props {
  win: WindowInstance
  active: boolean
  isMobile: boolean
}

function WindowImpl({ win, active, isMobile }: Props) {
  const { focus, close, minimize, toggleMaximize, setBounds } = useWindowManager()
  const app = appsById[win.appId]
  const App = app.component
  const maximized = win.state === 'maximized'
  const minimized = win.state === 'minimized'
  const titleId = `${win.id}-title`

  /** Arrastra el título. Gestos con Pointer Events: sirve igual con mouse, touch y lápiz. */
  const startDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 || isMobile || maximized) return
      if ((e.target as HTMLElement).closest('button')) return
      focus(win.id)
      const startX = e.clientX
      const startY = e.clientY
      const { x: ox, y: oy } = win
      const area = getDesktopArea()
      const move = (ev: PointerEvent) => {
        const x = Math.min(Math.max(ox + ev.clientX - startX, KEEP_VISIBLE - win.width), area.width - KEEP_VISIBLE)
        const y = Math.min(Math.max(oy + ev.clientY - startY, 0), area.height - 30)
        setBounds(win.id, { x, y, width: win.width, height: win.height })
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    },
    [focus, isMobile, maximized, setBounds, win],
  )

  const startResize = useCallback(
    (dir: ResizeDir) => (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 || isMobile || maximized) return
      e.stopPropagation()
      focus(win.id)
      const sx = e.clientX
      const sy = e.clientY
      const start: Bounds = { x: win.x, y: win.y, width: win.width, height: win.height }
      const area = getDesktopArea()
      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - sx
        const dy = ev.clientY - sy
        const b = { ...start }
        if (dir.includes('e')) b.width = Math.min(Math.max(start.width + dx, MIN_WINDOW_WIDTH), area.width - start.x)
        if (dir.includes('s')) b.height = Math.min(Math.max(start.height + dy, MIN_WINDOW_HEIGHT), area.height - start.y)
        if (dir.includes('w')) {
          const w = Math.max(start.width - dx, MIN_WINDOW_WIDTH)
          b.x = start.x + start.width - w
          b.width = w
        }
        if (dir.includes('n')) {
          const h = Math.max(start.height - dy, MIN_WINDOW_HEIGHT)
          b.y = Math.max(start.y + start.height - h, 0)
          b.height = start.y + start.height - b.y
        }
        setBounds(win.id, b)
      }
      const up = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    },
    [focus, isMobile, maximized, setBounds, win],
  )

  const style: CSSProperties = { zIndex: win.z }
  if (!isMobile) {
    style.left = win.x
    style.top = win.y
    style.width = win.width
    style.height = win.height
  }

  const cls = [
    styles.window,
    active ? styles.active : styles.inactive,
    maximized || isMobile ? styles.maximized : '',
    minimized ? styles.minimized : '',
  ].join(' ')

  return (
    <section
      className={cls}
      style={style}
      role="dialog"
      aria-labelledby={titleId}
      aria-hidden={minimized}
      inert={minimized}
      onPointerDown={() => !active && focus(win.id)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') close(win.id)
      }}
    >
      <div className={styles.titlebar} onPointerDown={startDrag} onDoubleClick={() => !isMobile && toggleMaximize(win.id)}>
        <Icon name={app.icon} size={16} />
        <span id={titleId} className={styles.title}>
          {win.title}
        </span>
        <div className={styles.controls}>
          <button type="button" className={styles.ctrl} aria-label="Minimizar" onClick={() => minimize(win.id)}>
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <rect x="1" y="7" width="5" height="2" fill="#fff" />
            </svg>
          </button>
          {!isMobile && (
            <button type="button" className={styles.ctrl} aria-label={maximized ? 'Restaurar' : 'Maximizar'} onClick={() => toggleMaximize(win.id)}>
              <svg viewBox="0 0 10 10" aria-hidden="true">
                {maximized ? (
                  <>
                    <rect x="3" y="1" width="6" height="6" fill="none" stroke="#fff" strokeWidth="1.4" />
                    <rect x="1" y="3" width="6" height="6" fill="#2a63e6" stroke="#fff" strokeWidth="1.4" />
                  </>
                ) : (
                  <rect x="1" y="1" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1.6" />
                )}
              </svg>
            </button>
          )}
          <button type="button" className={`${styles.ctrl} ${styles.close}`} aria-label="Cerrar" onClick={() => close(win.id)}>
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className={styles.body}>
        <Suspense fallback={<div className={styles.loading}>Cargando…</div>}>
          <App appId={win.appId} />
        </Suspense>
      </div>
      {!isMobile && !maximized && RESIZE_DIRS.map((d) => <div key={d} className={`${styles.handle} ${styles[`h-${d}`]}`} onPointerDown={startResize(d)} />)}
    </section>
  )
}

export const Window = memo(WindowImpl)
