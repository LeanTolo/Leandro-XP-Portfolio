import { useCallback, useState } from 'react'
import { apps } from '../config/apps.ts'
import { getDesktopArea } from '../config/layout.ts'
import { useIsMobile } from '../hooks/useIsMobile.ts'
import { useWindowManager } from '../windowManager/WindowManagerContext.tsx'
import { ContextMenu, type ContextMenuItem } from './ContextMenu.tsx'
import styles from './Desktop.module.css'
import { DesktopIcon } from './DesktopIcon.tsx'
import { StartMenu } from './StartMenu.tsx'
import { Taskbar } from './Taskbar.tsx'
import { Wallpaper } from './Wallpaper.tsx'
import { Window } from './Window.tsx'

interface MenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

export function Desktop() {
  const { state, openApp } = useWindowManager()
  const isMobile = useIsMobile()
  const [startOpen, setStartOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [menu, setMenu] = useState<MenuState | null>(null)

  const open = useCallback((appId: string) => openApp(appId, getDesktopArea()), [openApp])
  const closeStart = useCallback(() => setStartOpen(false), [])
  const closeMenu = useCallback(() => setMenu(null), [])

  return (
    <div className={styles.desktop} onClick={() => setSelectedId(null)} onContextMenu={(e) => e.preventDefault()}>
      <Wallpaper />

      <nav className={styles.icons} aria-label="Escritorio">
        {apps
          .filter((a) => a.showOnDesktop)
          .map((app) => (
            <DesktopIcon
              key={app.id}
              app={app}
              selected={selectedId === app.id}
              isMobile={isMobile}
              onSelect={() => setSelectedId(app.id)}
              onOpen={() => open(app.id)}
              onContextMenu={(e) =>
                setMenu({
                  x: e.clientX,
                  y: e.clientY,
                  items: [
                    { label: 'Abrir', bold: true, onSelect: () => open(app.id) },
                    { separator: true, label: '' },
                    { label: 'Propiedades', disabled: true },
                  ],
                })
              }
            />
          ))}
      </nav>

      <main className={styles.windows}>
        {state.windows.map((w) => (
          <Window key={w.id} win={w} active={state.activeId === w.id} isMobile={isMobile} />
        ))}
      </main>

      {startOpen && <StartMenu onOpenApp={open} onClose={closeStart} />}
      <Taskbar startOpen={startOpen} onToggleStart={() => setStartOpen((v) => !v)} />
      {menu && <ContextMenu {...menu} onClose={closeMenu} />}
    </div>
  )
}
