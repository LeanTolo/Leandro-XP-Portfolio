import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { IconName } from '../components/Icon.tsx'

export interface AppComponentProps {
  appId: string
}

export interface AppDefinition {
  id: string
  title: string
  icon: IconName
  defaultSize: { width: number; height: number }
  /** Se carga bajo demanda: cada app futura pesa solo cuando se abre. */
  component: LazyExoticComponent<ComponentType<AppComponentProps>>
  showOnDesktop: boolean
  /** Aparece en la columna izquierda (true) o derecha ('places') del menú Inicio. */
  startMenu: 'main' | 'places'
}

const Placeholder = lazy(() => import('../applications/PlaceholderApp.tsx'))

/**
 * Registro central de aplicaciones. Agregar una app = una entrada acá
 * (+ su componente). Las fases siguientes reemplazan `Placeholder`
 * por la implementación real sin tocar el escritorio.
 */
export const apps: AppDefinition[] = [
  { id: 'my-documents', title: 'Mis documentos', icon: 'folder', defaultSize: { width: 640, height: 440 }, component: Placeholder, showOnDesktop: true, startMenu: 'places' },
  { id: 'my-computer', title: 'Mi PC', icon: 'computer', defaultSize: { width: 620, height: 420 }, component: Placeholder, showOnDesktop: true, startMenu: 'places' },
  { id: 'internet-explorer', title: 'Internet Explorer', icon: 'browser', defaultSize: { width: 720, height: 520 }, component: Placeholder, showOnDesktop: true, startMenu: 'main' },
  { id: 'terminal', title: 'Terminal', icon: 'terminal', defaultSize: { width: 640, height: 400 }, component: Placeholder, showOnDesktop: true, startMenu: 'main' },
  { id: 'ai-lab', title: 'AI Lab', icon: 'lab', defaultSize: { width: 680, height: 460 }, component: Placeholder, showOnDesktop: true, startMenu: 'main' },
  { id: 'games', title: 'Juegos', icon: 'games', defaultSize: { width: 520, height: 400 }, component: Placeholder, showOnDesktop: true, startMenu: 'main' },
  { id: 'recycle-bin', title: 'Papelera de reciclaje', icon: 'recycle', defaultSize: { width: 520, height: 360 }, component: Placeholder, showOnDesktop: true, startMenu: 'places' },
]

export const appsById: Record<string, AppDefinition> = Object.fromEntries(apps.map((a) => [a.id, a]))
