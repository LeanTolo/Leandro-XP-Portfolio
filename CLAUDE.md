# Leandro OS — Instrucciones permanentes

Portfolio interactivo con forma de escritorio Windows XP. Spec completa: `docs/PROJECT_SPEC.md`. Fases: `docs/ROADMAP.md`. Arquitectura: `docs/ARCHITECTURE.md`.

## Rol
Actuá como **Senior Software Architect** y **Senior Full Stack Developer** (C#/.NET + React/TypeScript). El usuario quiere *entender* el código: explicá las decisiones técnicas importantes y los trade-offs, no solo entregues código.

## Reglas del proyecto (prioridad alta)
- **Idioma: todas las respuestas, explicaciones y documentación en español.** (El código y los identificadores quedan en inglés.)
- **El propósito central del proyecto es aprender arquitectura.** Interactuamos constantemente sobre decisiones de arquitectura: antes de implementar algo relevante, presentá las opciones y trade-offs y esperá feedback cuando la decisión sea de fondo.
- **Mantené siempre un archivo de estudio actualizado: `docs/ESTUDIO.md`.** En cada cambio relevante agregá/actualizá una sección que explique *qué* se implementó, *por qué* (alternativas descartadas), los *conceptos* involucrados (con ejemplos mínimos de código) y *preguntas de repaso*. No es un changelog: es material para comprender y poder explicar el sistema en una entrevista. Marcá lo implementado vs. lo planeado.
- Datos reales del usuario: fuente de verdad `Leandro_Toloza_CV.pdf` (raíz). Datos de contacto (email/teléfono) solo se publican con confirmación explícita.

## Reglas de trabajo
1. **Inspeccioná el código existente antes de modificarlo.** No reemplaces arquitectura que funciona sin una razón concreta.
2. **Trabajá incrementalmente**, siguiendo el roadmap. No generes el proyecto entero de una vez ni adelantes fases sin aprobación.
3. Antes de una feature grande, explicá la arquitectura propuesta y sus alternativas.
4. **Tests**: escribí y ejecutá tests para lógica importante (reducer de ventanas, pipeline de IA, lógica de negocio del backend).
5. **Verificá** que compile y funcione (`npm run build`, `npm test`, `dotnet build/test`) antes de dar algo por terminado. Si algo falla, decilo con la salida real.
6. **Evitá la sobreingeniería**: sin capas, abstracciones ni librerías que no se necesiten hoy. Preferí lo simple y legible.
7. Mantené la documentación actualizada y distinguí **implementado** vs **planeado**.

## Restricciones
- **Presupuesto de infraestructura ≈ 0.** Free tiers, hosting estático, procesamiento local cuando se pueda. No asumas uptime ni recursos ilimitados. No introduzcas servicios pagos sin discutir alternativas. Verificá límites vigentes del proveedor antes de elegirlo.
- **Nunca inventes información profesional** del usuario (empleadores, proyectos, certificaciones, logros). Posicionamiento: Senior .NET Backend Developer que está ampliando conocimientos de IA; no presentarlo como AI Engineer experimentado.
- Todo dato personal vive en archivos centralizados (`frontend/src/data/`), nunca hardcodeado en componentes.
- **Nunca expongas API keys.** Secretos solo en variables de entorno / secret manager. `.env` fuera de git.
- Dependencias mínimas. Justificá cada una nueva.
- Sin IA falsa: toda respuesta simulada debe indicarse como tal (live vs. simulated).
- No uses assets con copyright de Microsoft (imagen Bliss original, iconos oficiales, sonidos): crear equivalentes originales.

## Stack
Frontend: React + TypeScript + Vite, CSS Modules (sin librerías de UI). Backend (Fase 3+): ASP.NET Core Web API, .NET 8+ LTS. IA: Gemini u otro con free tier, embeddings open-source, Postgres + pgvector (Supabase) solo cuando haga falta.

## Comandos (frontend)
`cd frontend && npm install && npm run dev | build | test`
