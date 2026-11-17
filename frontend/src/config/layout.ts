export const TASKBAR_HEIGHT = 30
export const MIN_WINDOW_WIDTH = 240
export const MIN_WINDOW_HEIGHT = 140

/** Área disponible para ventanas: el viewport menos la barra de tareas. */
export function getDesktopArea() {
  return { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT }
}
