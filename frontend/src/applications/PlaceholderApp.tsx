import { appsById, type AppComponentProps } from '../config/apps.ts'
import { Icon } from '../components/Icon.tsx'
import styles from './PlaceholderApp.module.css'

const roadmap: Record<string, string> = {
  'my-documents': 'Fase 2 — CV, experiencia, educación y contacto.',
  'my-computer': 'Fase 2 — stack técnico y documentación de arquitectura.',
  'internet-explorer': 'Fase 3 — asistente con RAG.',
  terminal: 'Fase 2 — línea de comandos para explorar el portfolio.',
  'ai-lab': 'Fase 4 — experimentos de IA.',
  games: 'Fase 2+ — Buscaminas, Snake y otros.',
  'recycle-bin': 'Easter eggs y contenido oculto.',
}

/** Contenido provisional honesto: no muestra datos personales ni funcionalidad simulada. */
export default function PlaceholderApp({ appId }: AppComponentProps) {
  const app = appsById[appId]
  return (
    <div className={styles.root}>
      <Icon name={app.icon} size={64} />
      <h2>{app.title}</h2>
      <p>Esta aplicación todavía no está implementada.</p>
      <p className={styles.plan}>{roadmap[appId]}</p>
    </div>
  )
}
