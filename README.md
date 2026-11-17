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
Diálogos clásicos, Fases 2–6.

## Créditos y avisos
- **Sonidos:** los archivos de `frontend/public/sounds/` son sonidos del sistema de Windows XP, obtenidos de la colección [archive.org/details/windowsxpstartup_201910](https://archive.org/details/windowsxpstartup_201910). **Son propiedad de Microsoft** y se incluyen solo con fines de homenaje/portfolio sin fines de lucro. Si sos titular de los derechos y querés que se retiren, abrí un issue y se eliminarán.
- Wallpaper e iconos son SVG originales de este proyecto.
- "Windows XP" y "Microsoft" son marcas de Microsoft Corporation; este proyecto no está afiliado ni respaldado por ella.
