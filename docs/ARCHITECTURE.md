# Arquitectura

> Distingue **[Implementado]** de **[Planeado]**. Explicación didáctica en `docs/ESTUDIO.md`.

## Visión general
Monorepo. Hoy solo existe `frontend/`; `backend/` y `ai/` llegan en la Fase 3.

```
leandro-os/
├── frontend/   [Implementado] Vite + React + TS (SPA estática)
├── backend/    [Planeado, Fase 3] ASP.NET Core Web API (.NET 8+ LTS)
├── ai/         [Planeado, Fase 3] ingesta, embeddings (Python), prompts, evaluación
└── docs/
```

## Frontend [Implementado]
- **Stack:** React 19, TypeScript, Vite, CSS Modules, Vitest. Sin librerías de UI, sin Framer Motion, sin Lucide (iconos SVG propios).
- **Estado de ventanas:** `useReducer` + Context. Reducer puro en `windowManager/reducer.ts` (testeado).
- **Registro de apps:** `config/apps.ts` (`AppDefinition` + `React.lazy`). Punto de extensión para todas las fases.
- **Layout fijo:** `config/layout.ts` (alto de taskbar, mínimos de ventana).
- **Datos personales:** irán a `frontend/src/data/` (Fase 2), nunca en componentes.

Estructura: `desktop/` (Desktop, Window, Taskbar, StartMenu, DesktopIcon, ContextMenu, Clock, Wallpaper) · `windowManager/` · `applications/` · `components/Icon.tsx` · `config/` · `hooks/`.

## Backend e IA [Planeado]
- Backend como API principal y orquestador de IA; secretos solo en servidor.
- RAG: ingesta → chunking → embeddings (modelo open-source local, el **mismo** para indexar y consultar) → vector store → retrieval → prompt → LLM → citas.
- Vector store: empezar con JSON/embeddings precalculados; pgvector (Supabase) solo si hace falta.
- Modo demo explícito: toda respuesta indica si es *live* o *simulated*.

## Riesgos y límites de servicios gratuitos
| Tema | Riesgo | Mitigación |
|---|---|---|
| Proveedor LLM (Gemini u otro) | Cuotas/rate limits y políticas de uso de datos de free tier cambian; los datos enviados pueden usarse para mejorar modelos | **Verificar condiciones vigentes antes de elegir**; no enviar datos sensibles; modo demo; límites de tokens y rate limit propios |
| Supabase free | Proyectos inactivos se pausan; almacenamiento y conexiones limitados | Evitar BD hasta necesitarla; vectores estáticos como fallback |
| Cloudflare Pages/Workers | Límites de requests y de CPU por invocación | Frontend 100 % estático; lógica ligera en Workers |
| Hosting .NET gratis | Cold starts, suspensión por inactividad, sin SLA | Frontend funcional sin backend; mensajes de "servicio dormido"; reintentos |
| Embeddings locales | No se pueden generar en el free tier en caliente | Precalcular offline (Python) y versionar los vectores; el query-embedding necesita un modelo accesible: evaluar API de embeddings gratuita o inferencia en Worker (**decisión abierta**) |
| Abuso / costos | Un bot puede agotar la cuota | Rate limiting, límites de input, caché, CAPTCHA/Turnstile si hace falta |
| Copyright | Imágenes, iconos y sonidos de Microsoft | Assets originales (ya aplicado en Fase 1) |

### Problema técnico clave a resolver en Fase 3
El **embedding de la consulta** debe hacerse con el mismo modelo que indexó los documentos. Con hosting gratis sin GPU, hay que decidir dónde corre ese modelo (ONNX en el backend, Workers AI, API externa). Es la primera decisión de arquitectura de la Fase 3 y se discutirá antes de implementar.

## Decisiones tomadas
1. `useReducer + Context` en vez de Redux/Zustand (cero dependencias, lógica testeable).
2. Una ventana por app en Fase 1.
3. Wallpaper e iconos SVG originales (copyright, peso, escalabilidad).
4. Apps placeholder honestas, sin funcionalidad simulada.
5. Sonidos diferidos para no agregar estado sin uso.
