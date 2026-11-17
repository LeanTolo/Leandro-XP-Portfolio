import { Desktop } from './desktop/Desktop.tsx'
import { WindowManagerProvider } from './windowManager/WindowManagerContext.tsx'

export default function App() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  )
}
