# Leandro OS

Portfolio interactivo con forma de escritorio Windows XP. *Your personal developer operating system.*

## Estado
**Fase 1 completa** (escritorio XP). Ver `docs/ROADMAP.md`. Las apps del escritorio son placeholders hasta las Fases 2–5.

## Cómo ejecutarlo
Requisitos: Node 20+.

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
npm test         # tests del reducer de ventanas
```

## Qué incluye la Fase 1
Wallpaper estilo Bliss (SVG original), iconos, taskbar con reloj y botones por ventana, menú Inicio, ventanas arrastrables/redimensionables con minimizar/maximizar/restaurar/cerrar, foco y z-index, menú contextual, registro modular de aplicaciones y vista móvil a pantalla completa.

## Documentación
- `CLAUDE.md` — reglas del proyecto
- `docs/PROJECT_SPEC.md` · `docs/ROADMAP.md` · `docs/ARCHITECTURE.md`
- `docs/ESTUDIO.md` — guía de estudio de lo implementado

## Pendiente
Sonidos y silencio global, diálogos clásicos, Fases 2–6.
