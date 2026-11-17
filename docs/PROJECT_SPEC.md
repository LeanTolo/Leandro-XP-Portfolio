# PROJECT: LEANDRO OS
## Interactive Developer Portfolio & AI Engineering Playground

> Especificación original aportada por el usuario (resumen fiel por secciones). Si hay conflicto entre este documento y una decisión posterior, manda la decisión registrada en `docs/ARCHITECTURE.md` / `docs/decisions/`.

## 1. Overview
Portfolio personal presentado como un sistema operativo interactivo inspirado en Windows XP. Debe verse y comportarse como un escritorio XP nostálgico, pero su propósito es mostrar experiencia profesional, habilidades, proyectos y conocimiento práctico de IA. **No** es un portfolio convencional con otro tema visual: es un entorno de escritorio web funcional con múltiples aplicaciones, herramientas, juegos y experiencias con IA. Debe ser distintivo, técnicamente sólido, performante, responsive y gratis (o casi) de hospedar y operar.

- **Nombre:** Leandro OS — **Tagline:** *Your personal developer operating system.*
- **Objetivos:** mostrar experiencia como Senior .NET Developer; demostrar conocimiento práctico de LLMs, RAG, embeddings, bases vectoriales, prompt engineering e integración de IA; destacar frente a portfolios convencionales; demostrar capacidad full-stack; explorar AI Engineering con implementaciones reales; costos de hosting y APIs lo más cerca posible de cero.

## 2. Professional profile
Desarrollador de software en Argentina. ~5 años de experiencia. Especialidad: C# y .NET / ASP.NET Core. Experiencia con Go, APIs REST, bases relacionales y NoSQL (PostgreSQL, SQL Server, MongoDB), EF Core, RabbitMQ, microservicios y sistemas distribuidos, Docker y Kubernetes, CI/CD, testing automatizado, cloud.

**Posicionamiento:** Senior .NET Backend Developer que está ampliando activamente su conocimiento de IA / AI Engineering. **No** presentarlo como AI Engineer experimentado si los proyectos no lo demuestran. Toda la información profesional debe ser editable desde archivos de datos centralizados. **No inventar** experiencia, empleadores, proyectos, certificaciones ni logros. Fuente de verdad de datos reales: `frontend/public/Leandro_Toloza_CV.pdf`.

## 3. Visual identity & UX
Todo simula un escritorio Windows XP (tema Luna, wallpaper Bliss-like, taskbar azul, botón Inicio, accesos directos, iconos de carpeta clásicos, Explorer, barras de título con minimizar/maximizar/cerrar, diálogos clásicos, sonidos opcionales). Nostálgico pero pulido, nunca una parodia de baja calidad.

**Requisitos del escritorio:** pantalla completa; wallpaper; iconos; ventanas arrastrables y redimensionables; minimizar/maximizar/restaurar/cerrar; foco y z-index; taskbar; menú Inicio; reloj; animaciones de apertura; menús contextuales en iconos; sonidos opcionales con silencio global; preferencias persistentes cuando corresponda. Funciona en desktop y mobile; en mobile las ventanas pasan a pantalla completa / paneles. Controles accesibles, navegación por teclado, layouts responsive.

**Aplicaciones sugeridas:**
- **My Documents:** CV, experiencia, educación, skills, contacto, PDF descargable.
- **My Computer:** stack técnico, diagramas de arquitectura, tecnologías, conceptos, documentación de proyectos.
- **Internet Explorer:** asistente de IA principal (RAG sobre el perfil profesional).
- **Terminal:** línea de comandos para explorar el portfolio.
- **AI Lab:** experimentos y demos de IA.
- **Games:** Buscaminas, Snake, otros opcionales.
- **Recycle Bin:** easter eggs y contenido oculto.

Las aplicaciones son módulos independientes cargados por un sistema central de ventanas.

## 4. Technology stack
- **Frontend:** React, TypeScript, Vite, CSS Modules (o sistema de estilos bien organizado), Lucide donde corresponda, Framer Motion solo si aporta. Componentes tipados, modulares, mantenibles. Sin dependencias innecesarias.
- **Backend:** C#, ASP.NET Core Web API, .NET 8+ LTS, EF Core donde haya persistencia, DI, separación de responsabilidades, logging estructurado, validación, manejo de errores, tests. Es la API principal y capa de orquestación de IA.
- **IA/ML:** integración con LLM (Gemini u otro con free tier), embeddings open-source, Python para embeddings offline o experimentos, búsqueda semántica, similitud vectorial, RAG, prompt engineering, salidas estructuradas, function calling, evaluación.
- **Base de datos:** PostgreSQL, Supabase free, pgvector. Para el prototipo, JSON estático y embeddings generados localmente son aceptables. No introducir BD si la feature no la requiere.
- **Infra:** GitHub, GitHub Actions, Cloudflare Pages (frontend estático), Cloudflare Workers donde corresponda, Supabase free, Docker para desarrollo local. Diseñar alrededor de los límites de los free tiers; no asumir uptime permanente ni recursos ilimitados.

## 5. AI features
Cada feature debe demostrar conceptos reales de ingeniería y tener documentación de arquitectura. Nada de IA superficial.

### A. AI Assistant con RAG (flagship, vía icono Internet Explorer)
Responde preguntas sobre el perfil profesional usando una base de conocimiento curada. Pipeline completo: ingesta → extracción de texto → limpieza → chunking → embeddings → almacenamiento vectorial → embedding de la consulta → búsqueda por similitud → recuperación de contexto → construcción del prompt → generación LLM → respuesta con citas. Mismo modelo de embeddings para indexar y consultar; el LLM recibe pregunta + contexto + instrucciones de sistema.

Requisitos: respuestas ancladas en documentos recuperados; declarar explícitamente cuando falta información; nunca inventar experiencia; mostrar fuentes; estado de carga; manejo de errores y rate limits; límite de tamaño de prompt/tokens; proteger credenciales; prevención básica de abuso. **Modo desarrollador** opcional: chunks recuperados, scores de similitud, contexto enviado al LLM, modelo, latencia, uso de tokens.

### B. AI Code Reviewer
Pegar código (inicialmente C#). Analiza: bugs, performance, concurrencia, malas prácticas, violaciones SOLID, manejo de excepciones, mal uso de async/await, gestión de recursos, refactors. Perfiles: Senior .NET, Security Reviewer, Performance Reviewer. Salida estructurada y categorizada (JSON estructurado donde se soporte), **validar la respuesta del LLM antes de mostrarla**, complementar con chequeos deterministas / análisis estático cuando sea posible.

### C. AI Lab
1. Semantic Search (embedding de la consulta, búsqueda en colección predefinida, scores).
2. RAG Playground (preguntas, chunks recuperados, contexto vs. respuesta).
3. Prompt Playground (system prompts, comparar instrucciones, temperatura/parámetros).
4. Token Counter (conteo aproximado, ventanas de contexto, por qué importa la longitud).
5. Hallucination Testing (preguntas sin respuesta en la KB; verificar que el modelo se niegue a inventar).
6. Agent Demo (tool calling con herramientas predefinidas y limitadas; acciones seguras; mostrar herramienta elegida y resultado; **sin acceso arbitrario** a SO, filesystem ni servicios externos).

## 6. AI architecture & cost optimization
Estrategia: Gemini u otro proveedor con free tier para LLM online; modelos open-source locales para embeddings; Supabase pgvector para vectores; Cloudflare Workers o ASP.NET Core como intermediarios seguros; contenido estático siempre que se pueda. **Nunca exponer API keys en el frontend**; secretos en variables de entorno o secret manager del hosting.

Implementar: límites de requests y de input, presupuestos de tokens, manejo de errores, timeouts, rate limiting básico, caché, respuestas de fallback. El portfolio debe seguir siendo explorable cuando el proveedor llegue a su cuota: **modo demo** con preguntas de ejemplo y respuestas predefinidas. **Nunca fingir** que una respuesta predefinida vino de un LLM en vivo: mostrar si es *live* o *simulated*. Antes de elegir proveedor, verificar límites vigentes del free tier, modelos disponibles, restricciones de API y políticas de datos.

## 7. Project structure
Monorepo con separación clara entre frontend, backend, IA y documentación:

```
leandro-os/
├── frontend/   (src/desktop, components, applications/{explorer,terminal,ai-assistant,code-reviewer,ai-lab,games}, hooks, services, config, data; public/)
├── backend/    (LeandroOS.Api, .Application, .Domain, .Infrastructure, .Tests)
├── ai/         (ingestion, embeddings, retrieval, prompts, evaluation)
├── docs/       (architecture.md, rag-pipeline.md, deployment.md, decisions/)
├── docker-compose.yml  README.md  .gitignore
```
Se puede ajustar si hay justificación, evitando abstracción y capas innecesarias.

## 8. Roadmap
1. **Fase 1 — Escritorio Windows XP** (crítica): layout, wallpaper, iconos, taskbar, menú Inicio, gestión de ventanas, drag, min/max/restore, responsive, registro básico de aplicaciones. Al final debe ser usable y visualmente convincente.
2. **Fase 2 — Portfolio profesional:** My Documents, CV, experiencia, skills, proyectos, contacto, resume descargable, Terminal. Datos desde configuración centralizada.
3. **Fase 3 — Asistente RAG:** KB, ingesta, chunking, embeddings, almacenamiento vectorial, retrieval, LLM, citas, errores, modo demo; documentar la arquitectura completa.
4. **Fase 4 — AI Lab:** los seis experimentos.
5. **Fase 5 — Code Reviewer:** entrada de código, perfiles, análisis estructurado, presentación, validación y errores.
6. **Fase 6 — Producción:** tests, CI/CD, hosting gratuito, configuración de entornos, SEO, performance, revisión de seguridad, documentación.

## 9. Engineering standards
Código limpio y legible, tipado fuerte, SOLID cuando corresponda, separación de responsabilidades, DI, arquitectura testeable, nombres significativos, manejo de errores consistente, logging, versionado de API si se justifica, validación de input, secretos seguros, responsive, accesibilidad. **Evitar:** sobreingeniería, librerías innecesarias, microservicios prematuros, infraestructura innecesaria, credenciales hardcodeadas, integraciones de IA falsas, abstracciones excesivas, duplicación. Priorizar software que funciona y se entiende. Tests automatizados para lógica de negocio importante y componentes del pipeline de IA.

## 10. Documentation & interview value
Cada feature de IA importante documenta: qué problema resuelve, cómo funciona, por qué esa arquitectura, alternativas consideradas, limitaciones, cómo escalaría, trade-offs. El RAG tiene un documento de arquitectura dedicado con diagramas y ejemplos. Debe poder explicarse con confianza en una entrevista Senior .NET o AI Engineer. La documentación distingue lo **implementado** de lo **planeado**.

## 11. Reglas de desarrollo para Claude
Ver `CLAUDE.md` (rol, trabajo incremental, explicar decisiones y conceptos de IA —embeddings, ventanas de contexto, retrieval, tokens, prompts, límites, evaluación—, no inventar datos del usuario, no exponer claves, considerar free tiers, tests, documentación al día, inspeccionar antes de modificar, no reemplazar arquitectura que funciona sin motivo, no introducir servicios pagos sin discutir alternativas, verificar compilación y tests).

## 12. Primera tarea
Fase 1: proponer arquitectura frontend, sistema de ventanas, jerarquía de componentes, registro/apertura de apps, estrategia de estilos XP, estrategia responsive y dependencias mínimas; luego implementar el escritorio inicial (taskbar, Inicio, iconos, ventanas arrastrables) sin IA.

*Principio final: construir algo memorable, que funcione de forma confiable y demuestre ingeniería real.*
