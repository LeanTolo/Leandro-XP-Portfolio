# Roadmap

Estado: ✅ hecho · 🔶 parcial · ⬜ pendiente. Cada fase se aprueba antes de empezar la siguiente.

## Fase 1 — Escritorio Windows XP ✅ (pendiente de tu revisión)
**Objetivo:** escritorio usable y visualmente convincente, base de todo el portfolio.
- ✅ Wallpaper estilo Bliss (SVG original), iconos SVG propios, taskbar, menú Inicio, reloj.
- ✅ Ventanas: drag, resize, minimizar/maximizar/restaurar/cerrar, foco y z-index.
- ✅ Registro de aplicaciones (`config/apps.ts`) con carga diferida; apps placeholder honestas.
- ✅ Menú contextual en iconos, teclado básico (Enter/Esc/foco visible), responsive móvil.
- ✅ Tests del reducer de ventanas (10).
- ⬜ Sonidos y preferencia de silencio global (decisión: se difiere; no se agrega estado sin uso).
- ⬜ Menú contextual "Propiedades" (deshabilitado), diálogos clásicos.

## Fase 2 — Portfolio profesional ⬜
My Documents (CV, experiencia, educación, skills, contacto, PDF descargable), My Computer, proyectos, Terminal. Datos en `frontend/src/data/` a partir de `Leandro_Toloza_CV.pdf`. **Decisión pendiente:** qué datos de contacto se publican.

## Fase 3 — Asistente RAG ⬜
KB curada, ingesta, chunking, embeddings locales, vector store (JSON → pgvector si hace falta), retrieval, LLM, citas, modo desarrollador, modo demo (live vs. simulated), `docs/rag-pipeline.md`. Primero: verificar free tier vigente del proveedor LLM. Aparece el backend .NET.

## Fase 4 — AI Lab ⬜
Semantic Search, RAG Playground, Prompt Playground, Token Counter, Hallucination Testing, Agent Demo.

## Fase 5 — Code Reviewer ⬜
Entrada de código C#, perfiles, análisis estructurado validado, chequeos deterministas complementarios.

## Fase 6 — Producción ⬜
Tests, CI/CD (GitHub Actions), Cloudflare Pages, entornos, SEO, performance, revisión de seguridad, documentación final.
