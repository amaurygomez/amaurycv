import type { ZoneId, ZoneMeta } from "@/world/types";

const COL_W = 8;
const ROW_H = 8;
const ZONE_W = 7;
const ZONE_H = 7;

export const WORLD_COLS = COL_W * 3;
export const WORLD_ROWS = ROW_H * 3;

export const ZONE_META: Record<ZoneId, ZoneMeta> = {
  telecom: {
    id: "telecom",
    titleEs: "Telecom · Cobertura y Operación",
    titleEn: "Telecom · Coverage & Operations",
    subtitleEs:
      "Operadora de telecomunicaciones · plataformas conectadas, tiempo real y geoespacial",
    subtitleEn: "Telecommunications carrier · connected platforms, real-time and geospatial",
    periodEs: "Red → cliente",
    periodEn: "Network → customer",
    scaleEs: "Operación 24/7",
    scaleEn: "24/7 operations",
    bodyEs:
      "Construí y mantuve software interno para una operadora de telecomunicaciones: mapas de cobertura integrados al CRM, herramientas geoespaciales para planificación de red, plataformas de grabación y monitoreo en vivo de interacciones representante–cliente, y módulos de configuración para flujos de voz. Es trabajo de servicio, red y atención al cliente en una misma operación. Los sistemas sostienen áreas operativas que no admiten caídas: la venta depende de saber qué servicio se puede ofrecer por zona, y la calidad depende de poder auditar lo que pasó en cada llamada.",
    bodyEn:
      "I built and maintained internal software for a telecom carrier: coverage maps embedded in CRM workflows, geospatial tools for network planning, recording and live-monitoring platforms for representative–customer interactions, and configuration modules for voice flows. It is service, network, and customer-care work inside one operation. The systems sustain operational areas that cannot afford downtime: sales depends on knowing which service is available by zone, and quality depends on being able to audit what happened in every call.",
    operationalValueEs:
      "Cada herramienta sostiene una decisión real: qué servicio ofrecer en cada zona, cómo cotizar un tramo de red, cómo auditar una llamada. Su éxito se mide en continuidad operativa.",
    operationalValueEn:
      "Each tool supports a real decision: which service to offer per zone, how to quote a network section, how to audit a call. Its success is measured in operational continuity.",
    proofEs:
      "Software que sostiene venta, soporte y operación 24/7 en una operadora de telecomunicaciones.",
    proofEn: "Software that sustains sales, support, and 24/7 operations at a telecom carrier.",
    sectorEs: "Telecomunicaciones",
    sectorEn: "Telecommunications",
    experiences: [
      {
        iconKey: "map-pin",
        titleEs: "Cobertura & CRM",
        titleEn: "Coverage & CRM",
        descEs:
          "Mapa de cobertura de servicios fijos y móviles embebido en el CRM para que venta y soporte sepan qué servicio se puede ofrecer por zona.",
        descEn:
          "Coverage map for fixed and mobile services embedded in the CRM so sales and support know which service is available per zone.",
      },
      {
        iconKey: "compass",
        titleEs: "Planificación de red",
        titleEn: "Network planning",
        descEs:
          "Herramienta geoespacial para dibujar, calcular y cotizar tramos de red por antena y zona urbana.",
        descEn:
          "Geospatial tool to draw, calculate, and quote network sections by antenna and urban zone.",
      },
      {
        iconKey: "activity",
        titleEs: "Grabación & monitoreo en vivo",
        titleEn: "Recording & live monitoring",
        descEs:
          "Plataforma de grabación de pantalla y voz con monitoreo en vivo y trazabilidad por agente.",
        descEn:
          "Screen and voice recording platform with live monitoring and per-agent traceability.",
      },
      {
        iconKey: "hash",
        titleEs: "IVR · Asterisk",
        titleEn: "IVR · Asterisk",
        descEs:
          "Registro y configuración de opciones IVR y comandos Asterisk para flujos de atención telefónica.",
        descEn: "IVR options and Asterisk command registration for phone-attention flows.",
      },
    ],
    category: "telecom",
    bounds: { x: 0, y: 0, w: ZONE_W, h: ZONE_H },
    floorColor: "#0F2027",
    accent: "#5EEAD4",
    glow: "#5EEAD4",
    pills: [
      "Java",
      ".NET Framework",
      ".NET Core",
      "ASP.NET",
      "Blazor",
      "Oracle",
      "SQL Server",
      "LINQ",
      "LINQ DB",
      "Leaflet",
      "Google Maps",
      "SignalR",
      "Docker",
      "GitLab CI/CD",
      "Tailwind",
      "Bootstrap",
      "jQuery",
    ],
  },
  "public-sector": {
    id: "public-sector",
    titleEs: "Sector Público · Plataformas Seguras",
    titleEn: "Public Sector · Secure Platforms",
    subtitleEs: "Institución estatal confidencial · identidad, auditoría y mapas en vivo",
    subtitleEn: "Confidential state institution · identity, audit, and live maps",
    periodEs: "Identidad → auditoría",
    periodEn: "Identity → audit",
    scaleEs: "Operación segura",
    scaleEn: "Secure operations",
    bodyEs:
      "Desarrollé y modernicé plataformas operativas para una institución estatal con requisitos estrictos de identidad, permisos por perfil, auditoría y disponibilidad. El trabajo cubre integraciones backend con múltiples APIs institucionales, mapas operativos en vivo, dashboards estadísticos por región y territorio, módulos administrativos y herramientas internas de RRHH. Los detalles específicos se mantienen generalizados intencionalmente por la naturaleza sensible del trabajo.",
    bodyEn:
      "I developed and modernized operational platforms for a state institution with strict requirements for identity, per-profile permissions, audit, and availability. The work covers backend integrations with multiple institutional APIs, live operational maps, statistical dashboards by region and territory, administrative modules, and internal HR tooling. Specific details are intentionally generalized due to the sensitive nature of the work.",
    operationalValueEs:
      "Las decisiones operativas dependen de identidad fiable, auditoría completa y mapas que reflejan lo que ocurre ahora mismo. La modernización es progresiva por diseño: cada cambio respeta disponibilidad, seguridad y trazabilidad institucional.",
    operationalValueEn:
      "Operational decisions depend on trustworthy identity, complete audit, and maps that reflect what is happening right now. Modernization is progressive by design: every change respects availability, security, and institutional traceability.",
    proofEs:
      "Plataforma operativa segura en producción institucional con identidad, auditoría y trazabilidad sobre datos sensibles.",
    proofEn:
      "Secure operational platform in institutional production with identity, audit, and traceability over sensitive data.",
    sectorEs: "Sector Público",
    sectorEn: "Public Sector",
    experiences: [
      {
        iconKey: "shield-check",
        titleEs: "Identidad & permisos",
        titleEn: "Identity & permissions",
        descEs:
          "Autenticación multi-perfil, autorización por rol y JWT para acceso controlado a datos sensibles.",
        descEn:
          "Multi-profile authentication, role-based authorization, and JWT for controlled access to sensitive data.",
      },
      {
        iconKey: "history",
        titleEs: "Auditoría & trazabilidad",
        titleEn: "Audit & traceability",
        descEs:
          "Logs de auditoría sobre flujos críticos. Cada acción queda asociada a quién, qué y cuándo.",
        descEn: "Audit logs over critical flows. Every action is tied to who, what, and when.",
      },
      {
        iconKey: "map",
        titleEs: "Mapas operativos en vivo",
        titleEn: "Live operational maps",
        descEs:
          "Eventos y operaciones renderizados en tiempo real para soporte de decisión institucional.",
        descEn: "Events and operations rendered in real time for institutional decision support.",
      },
      {
        iconKey: "bar-chart",
        titleEs: "Estadística geográfica",
        titleEn: "Geographic statistics",
        descEs: "Mapas estadísticos por región y territorio con desagregación operativa.",
        descEn: "Statistical maps by region and territory with operational breakdown.",
      },
      {
        iconKey: "server",
        titleEs: "APIs institucionales",
        titleEn: "Institutional APIs",
        descEs: "Integraciones backend con múltiples APIs del estado y servicios externos.",
        descEn: "Backend integrations with multiple state APIs and external services.",
      },
      {
        iconKey: "users",
        titleEs: "RRHH & módulos internos",
        titleEn: "HR & internal modules",
        descEs:
          "Herramientas internas administrativas y de recursos humanos sobre la plataforma institucional.",
        descEn: "Administrative and HR internal tooling on top of the institutional platform.",
      },
    ],
    details: [
      {
        label: { es: "Lo que sí puedo describir", en: "What can be said" },
        value: {
          es: "Tipo de trabajo (plataformas operativas seguras), categorías de capacidades (identidad, auditoría, mapas en vivo, integraciones API), stack técnico, y volumen aproximado del esfuerzo.",
          en: "Type of work (secure operational platforms), capability categories (identity, audit, live maps, API integrations), technical stack, and approximate scope.",
        },
      },
      {
        label: { es: "Lo que se mantiene reservado", en: "What is intentionally protected" },
        value: {
          es: "Nombre de la institución, sistemas específicos, infraestructura, endpoints, credenciales, procedimientos operativos y cualquier detalle que pueda comprometer la seguridad. Reservar estos datos es parte de trabajar en entornos sensibles.",
          en: "Institution name, specific systems, infrastructure, endpoints, credentials, operational procedures, and any detail that could compromise security. Keeping these private is part of working in sensitive environments.",
        },
      },
    ],
    category: "public-sector",
    bounds: { x: COL_W, y: 0, w: ZONE_W, h: ZONE_H },
    floorColor: "#13201F",
    accent: "#34D399",
    glow: "#34D399",
    pills: [
      ".NET Core",
      "ASP.NET Core",
      "Blazor",
      "React",
      "Angular",
      "Tailwind",
      "JavaScript",
      "jQuery",
      "SQL Server",
      "Oracle",
      "Redis",
      "SignalR",
      "REST APIs",
      "JWT · Identity",
      "Audit Logs",
      "Docker",
      "CI/CD",
    ],
  },
  banking: {
    id: "banking",
    titleEs: "Banca · Préstamos y Reportería",
    titleEn: "Banking · Loans & Reporting",
    subtitleEs: "Entidad financiera regulada · flujos de crédito y reportería operativa",
    subtitleEn: "Regulated financial institution · credit workflows and operational reporting",
    periodEs: "Crédito → reportería",
    periodEn: "Credit → reporting",
    scaleEs: "Flujos regulados",
    scaleEn: "Regulated workflows",
    bodyEs:
      "Una etapa en banca interna trabajando sobre Java empresarial y procesos sensibles. Construí y mantuve módulos de flujos de préstamos, modifiqué y mantuve reportes JasperReports usados en operación diaria, y automatización en Windows con scripts .bat para resolver colisiones de usuarios sobre archivos compartidos en carpetas de red. La banca enseña respeto por la integridad transaccional y por sistemas que no toleran improvisación.",
    bodyEn:
      "A chapter in internal banking working on enterprise Java and sensitive processes. I built and maintained loan-workflow modules, modified and maintained JasperReports used in daily operations, and wrote Windows .bat automation to resolve collisions between users over shared network files. Banking teaches respect for transactional integrity and systems that do not tolerate improvisation.",
    operationalValueEs:
      "Procesos bancarios donde la integridad transaccional no es opcional. Automatizar las colisiones de archivos compartidos quitó una fricción diaria real y devolvió tiempo a usuarios internos sin romper flujos legados.",
    operationalValueEn:
      "Banking processes where transactional integrity is non-negotiable. Automating shared-file collisions removed a real daily friction and gave time back to internal users without breaking legacy flows.",
    proofEs: "Software financiero mantenido y mejorado en producción bajo restricciones reales.",
    proofEn: "Financial software maintained and improved in production under real constraints.",
    sectorEs: "Banca",
    sectorEn: "Banking",
    experiences: [
      {
        iconKey: "car",
        titleEs: "Flujos de préstamos",
        titleEn: "Loan workflows",
        descEs: "Flujos completos de préstamos: cálculo, documentación y gestión.",
        descEn: "End-to-end loan workflows: calculation, documentation, and management.",
      },
      {
        iconKey: "file-text",
        titleEs: "JasperReports",
        titleEn: "JasperReports",
        descEs:
          "Modificación y mantenimiento de reportes JasperReports usados diariamente en operación bancaria.",
        descEn:
          "Modification and maintenance of JasperReports used daily across banking operations.",
      },
      {
        iconKey: "lock",
        titleEs: "Automatización shared files",
        titleEn: "Shared-file automation",
        descEs:
          "Scripts Windows .bat para resolver colisiones de usuarios sobre archivos compartidos en carpetas de red.",
        descEn: "Windows .bat scripts to resolve user collisions over shared network files.",
      },
      {
        iconKey: "landmark",
        titleEs: "Operación bancaria interna",
        titleEn: "Internal banking operations",
        descEs:
          "Integraciones con servicios internos, integridad transaccional y soporte sobre datos sensibles.",
        descEn:
          "Integrations with internal services, transactional integrity, and support over sensitive data.",
      },
    ],
    category: "finance",
    bounds: { x: COL_W * 2, y: 0, w: ZONE_W, h: ZONE_H },
    floorColor: "#211E16",
    accent: "#E8B96B",
    glow: "#E8B96B",
    pills: [
      "Java",
      "JSF",
      "PrimeFaces",
      "JasperReports",
      "Windows Server",
      ".bat Scripting",
      "SQL Server",
      "Oracle",
    ],
  },
  pos: {
    id: "pos",
    titleEs: "POS y Sistemas Transaccionales",
    titleEn: "POS & Transactional Systems",
    subtitleEs: "Casa de software y operaciones de red · primer capítulo profesional",
    subtitleEn: "Software & network-operations company · first professional chapter",
    periodEs: "Terminal → producción",
    periodEn: "Terminal → production",
    scaleEs: "Campo y terminales",
    scaleEn: "Field & terminals",
    bodyEs:
      "Primer trabajo formal en una compañía pequeña de software y operaciones de red. Construí sistemas transaccionales sobre POS Android, integraciones de pago en terminales Verifone con Java ME, flujos de recargas móviles, flujos transaccionales de lotería, comunicación por sockets en Java, APIs Java, reportes en Crystal Reports y aplicaciones legadas en ASP.NET y WinForms sobre .NET Framework 3.5. Aprendí cómo se ve software pegado a la operación: terminales, recibos, colas y estados que la gente usa bajo presión.",
    bodyEn:
      "First formal job at a small software and network-operations company. I built transactional systems on Android POS, payment integrations on Verifone terminals with Java ME, mobile recharge flows, lottery transactional flows, Java socket communication, Java APIs, Crystal Reports reporting, and legacy ASP.NET and WinForms applications on .NET Framework 3.5. I learned what software glued to operations looks like: terminals, receipts, queues, and states people use under pressure.",
    operationalValueEs:
      "Terminales y POS son entornos donde un bug se cobra al instante: la transacción no salió, el cliente está al frente. Esa exigencia formó criterio temprano sobre estado, errores y soporte real de campo.",
    operationalValueEn:
      "Terminals and POS are environments where a bug is paid for instantly: the transaction failed, the customer is in front of you. That demand forged early judgment about state, errors, and real field support.",
    proofEs:
      "Primer trabajo formal sobre sistemas transaccionales reales y base operativa de todo lo que vino después.",
    proofEn:
      "First formal job on real transactional systems, and the operational base for everything that came after.",
    sectorEs: "Software / Operaciones",
    sectorEn: "Software / Operations",
    experiences: [
      {
        iconKey: "smartphone",
        titleEs: "POS Android",
        titleEn: "Android POS",
        descEs:
          "Sistemas POS construidos sobre dispositivos Android para puntos de venta en campo.",
        descEn: "POS systems built on Android devices for field points of sale.",
      },
      {
        iconKey: "credit-card",
        titleEs: "Verifone · Java ME",
        titleEn: "Verifone · Java ME",
        descEs:
          "Integraciones con terminales de pago Verifone usando Java ME y workflows transaccionales.",
        descEn: "Verifone payment terminal integrations using Java ME and transactional workflows.",
      },
      {
        iconKey: "zap",
        titleEs: "Recargas & lotería",
        titleEn: "Recharge & lottery",
        descEs:
          "Flujos transaccionales para recargas móviles y operación de lotería en terminales.",
        descEn: "Transactional flows for mobile recharge and lottery operations on terminals.",
      },
      {
        iconKey: "network",
        titleEs: "Sockets Java · APIs",
        titleEn: "Java sockets · APIs",
        descEs: "Comunicación por sockets entre servicios y terminales; APIs Java internas.",
        descEn: "Socket communication between services and terminals; internal Java APIs.",
      },
      {
        iconKey: "file-bar-chart",
        titleEs: "Reportería & legacy .NET",
        titleEn: "Reporting & legacy .NET",
        descEs: "Crystal Reports + aplicaciones ASP.NET / WinForms sobre .NET Framework 3.5.",
        descEn: "Crystal Reports + ASP.NET / WinForms apps on .NET Framework 3.5.",
      },
    ],
    category: "software",
    bounds: { x: 0, y: ROW_H, w: ZONE_W, h: ZONE_H },
    floorColor: "#1B1530",
    accent: "#A78BFA",
    glow: "#A78BFA",
    pills: [
      "Java",
      "Java ME",
      "Android",
      "Verifone",
      "Java Sockets",
      "ASP.NET",
      "WinForms",
      ".NET Framework 3.5",
      "Crystal Reports",
    ],
  },
  "ai-lab": {
    id: "ai-lab",
    titleEs: "Laboratorio de Operaciones con IA",
    titleEn: "AI Operations Lab",
    subtitleEs: "Infraestructura personal de IA · local + automatización + RAG",
    subtitleEn: "Personal AI infrastructure · local + automation + RAG",
    periodEs: "Idea → operación",
    periodEn: "Idea → operations",
    scaleEs: "Stack personal",
    scaleEn: "Personal stack",
    bodyEs:
      "Infraestructura personal de IA para trabajo de ingeniería: modelos locales, automatización de flujos, memoria vectorial, observabilidad, evaluaciones y entrega asistida por agentes con aprobación humana. Lo opero yo mismo, con herramientas verificadas y límites explícitos sobre lo que cada agente puede hacer. Mantiene contexto vectorizado del trabajo y exige aprobación humana antes de actuar fuera del sandbox.",
    bodyEn:
      "Personal AI infrastructure for engineering work: local models, workflow automation, vector memory, observability, evals, and agent-assisted delivery with human approval. I run it myself, with verified tools and explicit limits on what each agent may do. It keeps vectorized work context and requires human approval before acting outside the sandbox.",
    operationalValueEs:
      "El stack me permite operar como un equipo pequeño con disciplina de uno grande: contexto siempre cargado, ejecución de agentes auditable, enrutamiento entre modelo local y externo según costo/riesgo, y una persona (yo) firmando cada salida que cruza al mundo real.",
    operationalValueEn:
      "The stack lets me operate as a small team with the discipline of a large one: context always loaded, agent execution auditable, routing between local and external models by cost/risk, and a person (me) signing off on every output that crosses into the real world.",
    proofEs:
      "La IA multiplica mi capacidad; el criterio de ingeniería sigue siendo mío. El código que entrego pasa por mi juicio antes que por cualquier modelo.",
    proofEn:
      "AI multiplies my output; the engineering judgment stays mine. Code I ship passes through my judgment before any model.",
    sectorEs: "Operaciones con IA",
    sectorEn: "AI Operations",
    experiences: [
      {
        iconKey: "compass",
        titleEs: "Enrutamiento de LLM local",
        titleEn: "Local LLM routing",
        descEs: "LiteLLM al frente y Ollama corriendo modelos locales para tareas del laboratorio.",
        descEn: "LiteLLM in front and Ollama running local models for lab tasks.",
      },
      {
        iconKey: "settings",
        titleEs: "Automatización de flujos",
        titleEn: "Workflow automation",
        descEs:
          "n8n como motor de flujos. Salidas pasan por borrador, revisión y aprobación antes de actuar.",
        descEn:
          "n8n as the workflow engine. Outputs go through draft, review, and approval before action.",
      },
      {
        iconKey: "book-open",
        titleEs: "Memoria vectorial / RAG",
        titleEn: "Vector memory / RAG",
        descEs:
          "Contexto del trabajo ingerido a Qdrant con embeddings; los agentes consultan retrieval antes de razonar.",
        descEn:
          "Work context ingested into Qdrant with embeddings; agents query retrieval before reasoning.",
      },
      {
        iconKey: "history",
        titleEs: "Pipeline de agentes",
        titleEn: "Agent pipeline",
        descEs:
          "Project command pipeline, wrappers Codex y Claude CLI, etapa de crítico antes de aplicar cambios reales.",
        descEn:
          "Project command pipeline, Codex and Claude CLI wrappers, critic stage before any real change is applied.",
      },
      {
        iconKey: "shield-check",
        titleEs: "Aprobación humana y seguridad",
        titleEn: "Human approval & safety",
        descEs:
          "Drafts revisables, contexto sanitizado y aprobación explícita antes de que una acción llegue al mundo real.",
        descEn:
          "Reviewable drafts, sanitized context, and explicit approval before any action reaches the real world.",
      },
      {
        iconKey: "activity",
        titleEs: "Observabilidad y evals",
        titleEn: "Observability & evals",
        descEs:
          "Trazas en Langfuse, eval harness para regresiones del asistente y health/ops console del stack.",
        descEn:
          "Langfuse traces, eval harness for assistant regressions, and a health/ops console for the stack.",
      },
    ],
    category: "ai-lab",
    bounds: { x: COL_W, y: ROW_H, w: ZONE_W, h: ZONE_H },
    floorColor: "#102026",
    accent: "#5EEAD4",
    glow: "#5EEAD4",
    pills: [
      "n8n",
      "Qdrant",
      "LiteLLM",
      "Ollama",
      "Open WebUI",
      "Langfuse",
      "Docker Compose",
      "SearXNG",
      "Codex CLI",
      "Claude Code CLI",
      "Evals",
    ],
  },
  discipline: {
    id: "discipline",
    titleEs: "Disciplina de Ingeniería",
    titleEn: "Engineering Discipline",
    subtitleEs: "Principios que sostienen sistemas en producción",
    subtitleEn: "Principles that sustain systems in production",
    periodEs: "Principio → práctica",
    periodEn: "Principle → practice",
    scaleEs: "Práctica de oficio",
    scaleEn: "Craft practice",
    bodyEs:
      "Los sistemas empresariales se sostienen con principios aplicados todos los días. Estos son los míos: trazabilidad y auditoría sobre todo flujo sensible, confidencialidad sobre datos institucionales, no romper comportamiento existente al modernizar, compatibilidad con sistemas legados, documentación legible para quien venga después, confiabilidad operativa frente a la mejora marginal, y modernización cuidadosa antes que reescritura espectacular. Fuera del código, cocinar y preparar BBQ refuerza ese mismo ritmo: paciencia, fuego correcto, tiempo y criterio.",
    bodyEn:
      "Enterprise systems stay healthy through principles applied every day. These are mine: traceability and audit on every sensitive flow, confidentiality over institutional data, never breaking existing behavior when modernizing, legacy compatibility, readable documentation for whoever comes next, operational reliability over marginal improvement, and careful modernization over spectacular rewrites. Outside code, cooking and BBQ reinforce the same rhythm: patience, proper heat, timing, and judgment.",
    operationalValueEs:
      "Estos principios son el motivo por el que sistemas críticos siguen funcionando años después: cada cambio respeta lo que vino antes, cada flujo es auditable, cada decisión se puede explicar.",
    operationalValueEn:
      "These principles are why critical systems keep working years later: every change respects what came before, every flow is auditable, every decision can be explained.",
    proofEs:
      "Disciplina aplicada que se traduce en software empresarial que funciona más allá del demo.",
    proofEn:
      "Applied discipline that translates into enterprise software that works beyond the demo.",
    sectorEs: "Principios",
    sectorEn: "Principles",
    experiences: [
      {
        iconKey: "history",
        titleEs: "Trazabilidad y auditoría",
        titleEn: "Traceability & audit",
        descEs:
          "Cada acción crítica queda asociada a usuario, momento y contexto. La auditoría se diseña desde el inicio.",
        descEn:
          "Every critical action is tied to user, timestamp, and context. Audit is designed in from the start.",
      },
      {
        iconKey: "shield",
        titleEs: "Confidencialidad institucional",
        titleEn: "Institutional confidentiality",
        descEs: "Discreción sobre datos sensibles y procedimientos como parte normal del oficio.",
        descEn: "Discretion over sensitive data and procedures as a normal part of the craft.",
      },
      {
        iconKey: "shield-check",
        titleEs: "Seguridad de producción",
        titleEn: "Production safety",
        descEs:
          "Cada cambio se mide contra el comportamiento existente. Mantener lo que funciona va antes que entregar más rápido.",
        descEn:
          "Every change is measured against existing behavior. Keeping what works intact comes before shipping faster.",
      },
      {
        iconKey: "layers",
        titleEs: "Compatibilidad con legado",
        titleEn: "Legacy compatibility",
        descEs:
          "Los sistemas legados sostienen operación real. Modernizar respetando interfaces y datos existentes.",
        descEn:
          "Legacy systems sustain real operation. Modernize respecting existing interfaces and data.",
      },
      {
        iconKey: "book-open",
        titleEs: "Documentación legible",
        titleEn: "Readable documentation",
        descEs:
          "README, runbooks y ADRs pensados para el próximo ingeniero. Lo que no se documenta, se rompe.",
        descEn:
          "READMEs, runbooks, and ADRs written for the next engineer. What is not documented gets broken.",
      },
      {
        iconKey: "settings",
        titleEs: "Modernización cuidadosa",
        titleEn: "Careful modernization",
        descEs:
          "Cambios por capas con rollback claro. La velocidad sin red de seguridad cuesta más adelante.",
        descEn:
          "Layered changes with clear rollback. Speed without safety net costs more downstream.",
      },
      {
        iconKey: "heart",
        titleEs: "Ritmo personal · cocina y BBQ",
        titleEn: "Personal rhythm · cooking & BBQ",
        descEs:
          "Fuera del código, disfruto cocinar, preparar BBQ y compartir buena comida. Paciencia, fuego correcto, tiempo y criterio también son disciplina.",
        descEn:
          "Outside of code, I enjoy BBQ, cooking, and sharing good food. Patience, timing, heat, and judgment matter there too.",
      },
    ],
    category: "discipline",
    bounds: { x: COL_W * 2, y: ROW_H, w: ZONE_W, h: ZONE_H },
    floorColor: "#241B1A",
    accent: "#F97316",
    glow: "#F97316",
    pills: [
      "Traceability",
      "Auditability",
      "Confidentiality",
      "Production Safety",
      "Legacy Compatibility",
      "Maintainability",
      "Operational Reliability",
      "Documentation",
      "Careful Modernization",
    ],
  },
  origin: {
    id: "origin",
    titleEs: "Origen · Antes del primer empleo",
    titleEn: "Origin · Before the first job",
    subtitleEs: "Curiosidad, libros, familia, becas y trabajo real · desde la infancia",
    subtitleEn: "Curiosity, books, family, scholarships, and real work · since childhood",
    periodEs: "Curiosidad → oficio",
    periodEn: "Curiosity → craft",
    scaleEs: "Historia personal",
    scaleEn: "Personal story",
    bodyEs:
      "Mi carrera en tecnología empezó mucho antes del primer empleo. Creció a partir de curiosidad, libros, influencia familiar, formación temprana, becas y trabajo real. Lo que ven los reclutadores en mi CV es la capa más reciente de una historia que empezó en la infancia.",
    bodyEn:
      "My technology career started long before my first job. It grew out of curiosity, books, family influence, early training, scholarships, and real work. What recruiters see in my CV is the latest layer of a story that began in childhood.",
    operationalValueEs:
      "Quien empezó a programar por curiosidad en la infancia llega al trabajo serio con un tipo de respeto distinto por el oficio. La carrera se construyó por capas, paso a paso.",
    operationalValueEn:
      "Someone who started programming out of childhood curiosity arrives at serious work with a different kind of respect for the craft. The career was built in layers, one step at a time.",
    proofEs:
      "Trayectoria continua desde la infancia: curiosidad temprana → formación → trabajo real.",
    proofEn:
      "A continuous trajectory since childhood: early curiosity → formal training → real work.",
    sectorEs: "Historia personal",
    sectorEn: "Personal history",
    timeline: [
      {
        kickerEs: "Primera PC",
        kickerEn: "First PC",
        step: "01",
        titleEs: "Primera PC en casa",
        titleEn: "First family PC",
        descEs:
          "Empecé a usar la computadora que mi madre recibió para sus cursos de ofimática. Por curiosidad, comencé a leer sus libros del curso.",
        descEn:
          "I started using the computer my mother received for her office-tools courses. Out of curiosity, I began reading her course books.",
      },
      {
        kickerEs: "Beca",
        kickerEn: "Scholarship",
        step: "02",
        titleEs: "Beca nacional de tecnología",
        titleEn: "National technology scholarship",
        descEs:
          "Una beca nacional me acercó más a la formación tecnológica. El camino de tecnólogo no era viable todavía, así que tomé cursos introductorios de computación e inglés.",
        descEn:
          "A national scholarship brought me closer to formal technology training. The technologist path was not yet possible, so I took introductory computing and English courses.",
      },
      {
        kickerEs: "Familia",
        kickerEn: "Family",
        step: "03",
        titleEs: "Mi tío · redes y sistemas",
        titleEn: "My uncle · networks & systems",
        descEs:
          "En paralelo, mi tío, desarrollador y profesional de redes, fue una influencia importante. Vi materiales de Linux y de los Windows de la época mientras ese mundo crecía a mi alrededor.",
        descEn:
          "At the same time, my uncle, a developer and network professional, became an important influence. I saw Linux material and the Windows of the era while that world was growing around me.",
      },
      {
        kickerEs: "Técnico",
        kickerEn: "Technical",
        step: "04",
        titleEs: "Tecnología en Desarrollo de Software",
        titleEn: "Software Development Technologist",
        descEs: "Inicié formalmente el camino técnico de Tecnología en Desarrollo de Software.",
        descEn: "I formally started the Software Development Technologist technical path.",
      },
      {
        kickerEs: "Java",
        kickerEn: "Java",
        step: "05",
        titleEs: "Ruta Java básico/intermedio/avanzado",
        titleEn: "Java basic / intermediate / advanced track",
        descEs:
          "En paralelo a la formación técnica, tomé la ruta de Java básico, intermedio y avanzado. Ahí se selló el rumbo: el software como oficio.",
        descEn:
          "Alongside the technical program, I went through Java basic, intermediate, and advanced. That sealed the direction: software as my craft.",
      },
      {
        kickerEs: "Reconocimiento",
        kickerEn: "Recognition",
        step: "06",
        titleEs: "Beca de excelencia académica",
        titleEn: "Academic-excellence scholarship",
        descEs:
          "Una beca de excelencia académica llegó como reconocimiento y abrió la puerta al primer empleo formal en tecnología.",
        descEn:
          "An academic-excellence scholarship arrived as recognition and opened the door to my first formal tech job.",
      },
      {
        kickerEs: "Primer empleo",
        kickerEn: "First job",
        step: "07",
        titleEs: "Primer entorno formal de producción",
        titleEn: "First formal production environment",
        descEs:
          "Mi primer entorno formal de producción llegó en una casa de software y operaciones de red. Desde ahí, el software ha sido mi medio de vida y línea continua.",
        descEn:
          "My first formal production environment arrived at a software and network-operations company. From there, software has been my livelihood and continuous line.",
      },
    ],
    category: "education",
    bounds: { x: COL_W, y: ROW_H * 2, w: ZONE_W, h: ZONE_H },
    floorColor: "#181B2A",
    accent: "#60A5FA",
    glow: "#60A5FA",
    pills: [
      "Primera PC",
      "Becas académicas",
      "Ruta Java",
      "Tecnólogo en Software",
      "Ciencias de la Computación",
      "Inglés técnico",
    ],
  },
};

export const ZONE_ORDER: ZoneId[] = [
  "telecom",
  "public-sector",
  "banking",
  "pos",
  "ai-lab",
  "discipline",
  "origin",
];
