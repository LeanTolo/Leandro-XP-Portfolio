/**
 * Sonidos del sistema. Los archivos viven en `public/sounds/` (ver nota de origen en el README raíz).
 * Se separa "nombre lógico" de "archivo": la UI pide `minimize`, no un nombre de archivo,
 * y cambiar un sonido es tocar solo este mapa.
 */
export const sounds = {
  ding: 'windows-xp-ding.mp3', // al activar el parlante
  start: 'windows-xp-start.mp3', // abrir una aplicación con doble clic
  menuCommand: 'windows-xp-menu-command.mp3', // elegir un ítem de menú
  minimize: 'windows-xp-minimize.mp3',
  restore: 'windows-xp-restore.mp3', // restaurar y maximizar
  shutdown: 'windows-xp-shutdown.mp3', // pantalla de cierre al reiniciar
  startup: 'windows-xp-startup.mp3', // pantalla de bienvenida
  logon: 'windows-xp-logon-sound.mp3', // al llegar al escritorio tras iniciar sesión
} as const

export type SoundName = keyof typeof sounds
