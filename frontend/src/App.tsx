import { Desktop } from './desktop/Desktop.tsx'
import { PowerScreen } from './power/PowerScreen.tsx'
import { usePower } from './power/usePower.ts'
import { WindowManagerProvider } from './windowManager/WindowManagerContext.tsx'

export default function App() {
  const { phase, restart, logIn } = usePower()

  // Fuera de `running` el escritorio se desmonta: al volver a montarse, el reducer de ventanas
  // arranca de cero. Reiniciar cierra todas las ventanas sin ningún código extra.
  if (phase !== 'running') return <PowerScreen phase={phase} onLogIn={logIn} />

  return (
    <WindowManagerProvider>
      <Desktop onRestart={restart} />
    </WindowManagerProvider>
  )
}
