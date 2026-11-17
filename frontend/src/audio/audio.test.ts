import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sounds } from './sounds.ts'

describe('mapa de sonidos', () => {
  // Solo se usan las claves del glob (rutas); las funciones de carga nunca se invocan.
  const files = Object.keys(import.meta.glob('../../public/sounds/*.mp3')).map((p) => p.split('/').pop())

  it.each(Object.entries(sounds))('%s apunta a un archivo que existe en public/sounds', (_name, file) => {
    expect(files).toContain(file)
  })
})

describe('motor de sonido', () => {
  // El motor guarda estado de módulo (flag de silencio): se reimporta en cada test para aislarlos.
  let play: typeof import('./soundEngine.ts').play
  let setSoundEnabled: typeof import('./soundEngine.ts').setSoundEnabled
  const played = vi.fn<(src: string) => void>()

  beforeEach(async () => {
    vi.resetModules()
    played.mockClear()
    class FakeAudio {
      volume = 1
      src: string
      constructor(src: string) {
        this.src = src
      }
      play() {
        played(this.src)
        return Promise.resolve()
      }
    }
    vi.stubGlobal('Audio', FakeAudio)
    ;({ play, setSoundEnabled } = await import('./soundEngine.ts'))
  })

  it('está activado por defecto: reproduce sin activar nada antes', () => {
    play('minimize')
    expect(played).toHaveBeenCalledWith(expect.stringContaining(sounds.minimize))
  })

  it('al silenciar calla; al volver a activar suena el ding', () => {
    setSoundEnabled(false)
    played.mockClear()
    play('minimize')
    expect(played).not.toHaveBeenCalled()

    setSoundEnabled(true)
    expect(played).toHaveBeenCalledTimes(1)
    expect(played).toHaveBeenCalledWith(expect.stringContaining(sounds.ding))
  })

  it('si el navegador rechaza la reproducción no lanza error', () => {
    class RejectingAudio {
      volume = 1
      play() {
        return Promise.reject(new Error('NotAllowedError'))
      }
    }
    vi.stubGlobal('Audio', RejectingAudio)
    expect(() => play('start')).not.toThrow()
  })
})
