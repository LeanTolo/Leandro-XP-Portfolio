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
Sonidos y silencio global; diálogos clásicos; "Propiedades"; persistencia de posición de ventanas; navegación por teclado completa en menús.
