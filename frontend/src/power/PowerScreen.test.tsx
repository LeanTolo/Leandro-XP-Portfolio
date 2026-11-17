import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PowerScreen } from './PowerScreen.tsx'

const noop = () => {}

describe('PowerScreen', () => {
  it.each(['shuttingDown', 'off', 'booting', 'welcome', 'loggingIn'] as const)('renderiza la fase %s', (phase) => {
    expect(renderToString(<PowerScreen phase={phase} onLogIn={noop} />)).not.toBe('')
  })

  it('el cierre muestra el mensaje de guardado', () => {
    expect(renderToString(<PowerScreen phase="shuttingDown" onLogIn={noop} />)).toContain('Guardando tu configuración')
  })

  it('la bienvenida ofrece un botón con el nombre de usuario, habilitado', () => {
    const html = renderToString(<PowerScreen phase="welcome" onLogIn={noop} />)
    expect(html).toContain('Leandro')
    expect(html).toMatch(/<button[^>]*>/)
    expect(html).not.toMatch(/<button[^>]*disabled/)
  })

  it('mientras carga la sesión el botón se deshabilita y se informa el progreso', () => {
    const html = renderToString(<PowerScreen phase="loggingIn" onLogIn={noop} />)
    expect(html).toMatch(/<button[^>]*disabled/)
    expect(html).toContain('Cargando tu configuración personal')
  })
})
