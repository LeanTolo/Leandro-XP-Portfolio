# Guía de estudio — Leandro OS

Material para **entender** lo que se implementa, no un changelog. Cada sección: qué, por qué, conceptos, repaso. Se actualiza en cada fase.

---

## Fase 1 — Escritorio Windows XP

### 1. Mapa mental

```
App
└─ WindowManagerProvider   ← estado global de ventanas (useReducer + Context)
   └─ Desktop              ← orquesta: iconos, ventanas, menús
      ├─ Wallpaper (SVG)
      ├─ DesktopIcon × N   ← vienen de config/apps.ts
      ├─ Window × N        ← una por ventana abierta (drag/resize/controles)
      │    └─ <App/>       ← componente de la app, cargado con React.lazy
      ├─ StartMenu
      ├─ Taskbar (+ Clock)
      └─ ContextMenu
```

### 2. El corazón: el reducer de ventanas (`windowManager/reducer.ts`)

**Qué es.** Una función pura `(estado, acción) → nuevo estado`. Toda la lógica de "qué pasa cuando abro/cierro/minimizo/enfoco" vive ahí, sin React ni DOM.

**Por qué reducer y no un `useState` por ventana ni una librería (Redux/Zustand):**
- Las acciones están acopladas entre sí (cerrar la activa ⇒ elegir otra; minimizar ⇒ pasar el foco). Un reducer concentra esas reglas en un solo lugar.
- Al ser puro se **testea sin navegador** (10 tests en `reducer.test.ts`).
- Cero dependencias nuevas. Si el estado creciera mucho o hubiera rendimiento crítico, Zustand sería el siguiente paso (alternativa descartada *por ahora*, no por principio).

**Ideas clave del estado:**
- `z` con **contador creciente** (`zCounter`): enfocar = darle a la ventana el siguiente número. No se reordena un array ni se renumera nada; ganar foco es O(1).
- `activeId` separado de `z`: "la de arriba" y "la activa" casi siempre coinciden, pero al minimizar la activa hay que *calcular* quién hereda el foco (`topVisibleId`).
- **Bounds `x/y/width/height` solo describen el estado normal.** Maximizar no los pisa; maximizada es un *estado* que el CSS resuelve con `inset: 0`. Restaurar es gratis: cambia la bandera y los bounds originales siguen ahí.
- `wasMaximized`: si minimizás una ventana maximizada y la restaurás, vuelve maximizada (como en Windows). Es un dato derivado del *historial*, por eso se guarda.
- Una instancia por app (`open` de una app abierta = enfocar/restaurar). Decisión de Fase 1: simple y evita ventanas duplicadas; cambiarla implica permitir varios `id` por `appId`.

**Conceptos para repasar:** inmutabilidad (`{...state}`), funciones puras, state machine (normal ⇄ maximized ⇄ minimized), derivar estado vs. almacenarlo.

### 3. Context + Provider (`WindowManagerContext.tsx`)
El reducer vive en un `Provider`; los componentes consumen con `useWindowManager()`. El hook lanza un error si se usa fuera del provider (falla rápido). El objeto de API se memoiza con `useMemo` para no re-renderizar consumidores sin motivo.

### 4. Registro de aplicaciones (`config/apps.ts`)
```ts
{ id: 'terminal', title: 'Terminal', icon: 'terminal',
  defaultSize: { width: 640, height: 400 },
  component: lazy(() => import('...')),   // carga diferida
  showOnDesktop: true, startMenu: 'main' }
```
- **Inversión de dependencias en pequeño:** el escritorio no conoce ninguna app concreta; solo itera el registro. Agregar una app = una entrada + un componente. Es el punto de extensión de las Fases 2–5.
- **`React.lazy`** divide el bundle: cada app es un chunk que se descarga al abrirla (se ve en el build: `PlaceholderApp-*.js` aparte). Importa para el rendimiento en hosting gratuito.
- Las apps hoy son *placeholders honestos*: dicen que no están implementadas y en qué fase llegan. No simulan funcionalidad.

### 5. Arrastrar y redimensionar (`Window.tsx`)
- **Pointer Events** (`pointerdown/move/up`) en vez de `mouse*`: una sola API para mouse, touch y lápiz.
- Los listeners de `move`/`up` se registran en `window` durante el gesto, no en la barra de título: así el arrastre no se corta si el puntero sale rápido del elemento.
- Se **acota** la posición: la ventana nunca puede perderse del todo (queda `KEEP_VISIBLE = 80px` visibles y la barra de título dentro del área).
- `touch-action: none` en la barra evita que el navegador interprete el gesto como scroll.
- Doble clic en el título = maximizar/restaurar.
- Trade-off conocido: cada `pointermove` hace `dispatch` ⇒ re-render. A esta escala es fluido; si hubiera apps pesadas, se movería la ventana con `transform` vía ref y se haría commit al soltar.

### 6. Minimizar sin desmontar
La ventana minimizada **sigue montada** (se oculta con CSS `visibility:hidden` + animación). Así el estado interno de la app (un formulario, un chat) sobrevive. Detalles de accesibilidad: `aria-hidden` + `inert` para que no reciba foco ni lectura de pantalla mientras está oculta.

### 7. Estilo "Luna" (CSS Modules + tokens en cada módulo)
- **CSS Modules**: estilos con alcance local por componente (clases con hash), sin librería. Elegido sobre CSS-in-JS por costo cero en runtime.
- El look XP sale de **gradientes multi-parada** (barra de título, taskbar, botón Inicio), bordes redondeados superiores, sombras y botones con radial-gradient. Inactiva vs. activa cambia el gradiente (azul saturado ↔ desaturado).
- **Wallpaper SVG original** (no la foto Bliss de Microsoft, que tiene copyright). Ventaja: vectorial, pesa KB, escala a cualquier pantalla con `preserveAspectRatio="xMidYMid slice"`.
- **Iconos SVG propios** con gradientes; `useId()` garantiza ids únicos por instancia (si no, los `<linearGradient id>` de iconos repetidos colisionan).

### 8. Responsive
Breakpoint `max-width: 767px`:
- Ventanas → pantalla completa (`inset: 0`), sin drag/resize, sin botón maximizar.
- Un toque en un icono abre la app (el doble clic no es cómodo en táctil).
- Taskbar compacta (solo iconos), menú Inicio a ancho completo.
- `useIsMobile` usa `useSyncExternalStore` + `matchMedia`: la forma correcta de leer un store externo del navegador sin tearing.
- `prefers-reduced-motion` desactiva animaciones.

### 9. Accesibilidad básica (implementado)
Iconos y botones son `<button>` reales (foco por Tab, Enter abre); ventanas con `role="dialog"` + `aria-labelledby`; Esc cierra menús/ventana; `:focus-visible` con contorno punteado estilo XP; menús con `role="menu"/"menuitem"`. Pendiente: navegación con flechas en menús y foco gestionado al abrir/cerrar ventanas.

### 10. Cómo se verificó
`npm run build` (tsc + vite) sin errores; `npm test` (10 tests del reducer); prueba de interacción automatizada con un navegador headless (abrir con doble clic, arrastrar, z-index, maximizar, minimizar, Inicio, menú contextual, vista móvil) + revisión visual de capturas.

### Preguntas de repaso
1. ¿Por qué `z` es un contador creciente y no el índice en el array?
2. ¿Qué pasa con el estado de una app al minimizar su ventana? ¿Y al cerrarla?
3. ¿Por qué los listeners de arrastre van en `window` y no en la barra de título?
4. ¿Qué cambiarías en el modelo para permitir varias ventanas de la misma app?
5. ¿Qué ventaja da que el escritorio itere `apps` sin conocer cada app? ¿Qué costo tiene?
6. ¿Cuándo dejaría de bastar `useReducer + Context` y pasarías a otra solución?

### Pendiente / límites actuales
Diálogos clásicos; "Propiedades"; persistencia de posición de ventanas; navegación por teclado completa en menús.

---

## Sonidos y silencio global (implementado)

### Qué es
Sonidos del sistema de Windows XP reproducidos con `HTMLAudioElement`, más un botón de parlante en la bandeja que los activa/silencia. Arrancan **activados** en cada carga; el parlante los silencia solo durante la sesión (no se persiste).

| Acción | Sonido |
|---|---|
| Activar el parlante | `ding` |
| Abrir el menú Inicio (no al cerrarlo) | `start` |
| Doble clic en un icono del escritorio | `start` |
| Elegir ítem de menú (Inicio / contextual) | `menuCommand` |
| Minimizar | `minimize` |
| Restaurar / maximizar | `restore` |
| Reiniciar: pantalla de cierre | `shutdown` |
| Reiniciar: pantalla de bienvenida | `startup` |
| Reiniciar: al llegar al escritorio | `logon` |

Abrir y cerrar ventanas es silencioso (igual que en XP). En `public/sounds/` hay 39 mp3 de la colección; solo 8 están conectados, el resto espera a su función (error, papelera…).

Archivos: `src/audio/sounds.ts` (mapa nombre→archivo), `soundEngine.ts` (estado + reproducción), `useSound.ts` (hook), `audio.test.ts`.

### Por qué así (alternativas descartadas)
- **Sintetizar los sonidos con Web Audio (A / A+):** se probó dos veces (tonos puros, luego pads + FM + reverb). Sin importar el refinamiento, no se parecían a XP: el timbre original viene de instrumentos y producción que no se imitan con osciladores. Se descartó y se revirtió.
- **Sonidos CC0 de otros bancos:** más seguros legalmente pero no suenan a XP.
- **Archivos originales de XP (elegido):** máxima fidelidad. **Trade-off asumido:** tienen copyright de Microsoft. Es una decisión del dueño, registrada como excepción en `CLAUDE.md` y con aviso en el README. Mitigaciones: uso sin fines de lucro, nota de origen y compromiso de retirarlos si lo piden.
- **Cambio de criterio:** primero arrancaban apagados y persistidos (pensando en una oficina); en la práctica obligaba a mutear/desmutear en cada carga para que sonara, así que ahora arrancan activados y sin persistencia. **Lecciones:** (1) probar una hipótesis barata antes de invertir (la síntesis); (2) cuando una restricción del proyecto choca con un objetivo, se documenta la excepción en vez de ignorarla en silencio.

### Conceptos
**1. Política de autoplay.** Los navegadores bloquean audio hasta que el usuario interactúa. Todos los sonidos nacen de un clic o toque (doble clic, menú, botón), que es la interacción que el navegador exige, así que pueden arrancar activados. El `ding` confirma que se reactivó el sonido. `audio.play()` devuelve una Promise que puede rechazarse; se captura para no romper la UI.

**2. Nombre lógico vs. archivo.** La UI pide `play('minimize')`; el mapa decide el archivo. Cambiar un sonido es tocar una línea.
```ts
export const sounds = { minimize: 'windows-xp-minimize.mp3', /* ... */ } as const
export type SoundName = keyof typeof sounds   // el tipo sale del mapa: no se puede pedir un sonido inexistente
```
**3. Estado fuera de React + `useSyncExternalStore`.** El motor es un módulo con un flag y listeners; `play()` se llama desde cualquier lado sin Provider. El hook se suscribe con `useSyncExternalStore(subscribe, getSnapshot)`.

**4. Efectos fuera del reducer.** `play()` se invoca en `WindowManagerContext`, no en `windowReducer`, que sigue siendo puro.

**5. `import.meta.env.BASE_URL`.** Las rutas a `public/` se arman con la base de Vite, así no se rompen si el sitio se publica bajo un subpath.

### Trade-offs y límites
- Un `Audio` nuevo por reproducción permite superponer sonidos y el navegador cachea el archivo; costo: un objeto por sonido (despreciable acá).
- `toggleMaximize` no sabe si maximiza o restaura (lo decide el reducer): usa el mismo sonido para ambos.
- El singleton de módulo es global; en tests hay que reimportarlo (`vi.resetModules()`).
- 596 KB extra en el build; se cargan solo al reproducirse.

### Cómo se verificó
`npm run build` y `npm test` (36 tests en total; los de audio son 8: cada sonido del mapa apunta a un archivo real, activado por defecto, silenciar/reactivar, y tolerancia a un `play()` rechazado). **No se escuchó en un navegador real**: falta probarlo a oído.

### Preguntas de repaso
1. ¿Por qué pueden arrancar activados si el navegador bloquea el autoplay? ¿Y por qué no se persiste el mute?
2. ¿Qué pasa si `audio.play()` es rechazado y por qué se captura?
3. ¿Qué ventaja da derivar `SoundName` de las claves del mapa?
4. ¿Por qué `play()` no está dentro del reducer?
5. ¿Qué riesgo asume usar los sonidos originales y cómo se mitiga?

---

## Ciclo de energía: reiniciar como en XP (implementado)

### Qué es
El botón **Reiniciar** del menú Inicio ya no recarga la página: recorre las pantallas de un reinicio de XP, con sus sonidos.

```
running → shuttingDown → off → booting → welcome → loggingIn → running
 (escritorio) (azul, sonido  (negro)  (barra de   (espera tu   (carga)   (sonido
              de apagado)             progreso)   clic; startup)          logon)
```
Las pantallas son **originales** (wordmark "Leandro OS", colores azul/negro): no usan el logo ni los textos de Microsoft. Solo los sonidos son de XP (ver excepción en `CLAUDE.md`).

Archivos: `src/power/powerPhases.ts` (máquina de estados pura), `usePower.ts` (hook que la ejecuta), `PowerScreen.tsx` + `.module.css` (pantallas).

### Por qué así (alternativas descartadas)
- **`window.location.reload()` (lo anterior):** simple, pero no permite pantallas intermedias ni sonidos y pierde la página entera.
- **Estado de energía dentro del reducer de ventanas:** mezcla dos responsabilidades. El ciclo de energía es *más grande* que las ventanas: las contiene.
- **Un Context de energía:** hoy solo `App` y el botón del Inicio lo usan; pasar `onRestart` por dos niveles de props es más simple que un Provider (YAGNI).
- **Elegida:** máquina de estados pura + hook. La lógica de transiciones se testea sin timers ni DOM.

### Conceptos
**1. Máquina de estados.** Las transiciones válidas son datos, no `if` desparramados. `requestRestart` solo avanza desde `running`; `requestLogIn` solo desde `welcome`. Pedidos inválidos devuelven la misma fase (se ignoran).
```ts
export const AUTO_NEXT = { shuttingDown: { to: 'off', afterMs: 3500 }, /* ... */ }
```
**2. Fases automáticas vs. esperar al usuario.** `welcome` no está en `AUTO_NEXT`: espera el clic, como XP. Eso además cumple la política de autoplay.

**3. Efecto con timer y limpieza.** `usePower` programa un `setTimeout` por fase y lo cancela en el cleanup del `useEffect`; así no quedan timers colgados.

**4. Reset por desmontaje.** Fuera de `running`, `App` no renderiza el escritorio. Al volver, el `useReducer` de ventanas arranca desde `initialState`: todas las ventanas se cierran sin código extra.

**5. Sonidos en la transición, no en un efecto.** `go(to)` hace `setPhase` + `play(ENTER_SOUND[to])`. Un `useEffect` sobre `phase` se ejecuta dos veces en StrictMode y duplicaría el sonido. Además, la carga inicial en `running` no es una transición: no suena nada.

### Trade-offs y límites
- Un reinicio completo dura ~11 s (+ el tiempo hasta tu clic en la bienvenida): fiel a XP, pero largo. Es una acción explícita del usuario; si molesta, se acortan los tiempos en `AUTO_NEXT`.
- Los tiempos están ajustados a la duración de los mp3 (apagado ~6,5 s, arranque ~10 s, logon ~4,3 s). Si el sonido está silenciado, el flujo es idéntico pero mudo.
- Si el usuario no hace clic en la bienvenida, se queda ahí: es el comportamiento original.
- No hay botón "Apagar" ni "Cerrar sesión" (no tendría sentido apagar una página web).

### Cómo se verificó
`npm run build` y `npm test` (37 tests): la máquina de estados (transiciones válidas/ignoradas, ciclo completo, sonidos de entrada) y el render de cada pantalla (`renderToString`). **No se vio en un navegador real**: falta probar a ojo y oído el flujo completo y ajustar tiempos/estilos.

### Preguntas de repaso
1. ¿Por qué la lógica de transiciones es una función pura y los timers viven en un hook?
2. ¿Por qué `welcome` espera un clic en vez de avanzar sola?
3. ¿Cómo se consigue que reiniciar cierre todas las ventanas sin tocar el reducer?
4. ¿Por qué el sonido se dispara en `go()` y no en un `useEffect` sobre `phase`?
5. ¿Qué cambia si más adelante hay que sumar "Cerrar sesión"?
