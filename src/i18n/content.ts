export type Lang = "en" | "es";

export type SkillGroupId = "backend" | "frontend" | "data" | "maps" | "devops" | "legacy" | "ai";

type SkillGroup = {
  id: SkillGroupId;
  title: string;
  summary: string;
  skills: { name: string }[];
};

type Content = {
  capabilities: { eyebrow: string; title: string; subtitle: string };
  skillGroups: SkillGroup[];
};

export const profile = {
  name: "Amaury Emmanuel Gómez Rodríguez",
  shortName: "Amaury Gómez",
  email: "aegrdz@outlook.com",
  github: "https://github.com/amaurygomez",
  credly: "https://www.credly.com/users/aegrdz",
  cvPath: "/cv",
  cvPdf: { es: "/Amaury-Gomez-CV-ES.pdf", en: "/Amaury-Gomez-CV-EN.pdf" },
};

export const content: Record<Lang, Content> = {
  en: {
    capabilities: {
      eyebrow: "Technical stack",
      title: "7 capabilities backed by production work.",
      subtitle: "The stack, grouped by what I can do with it.",
    },
    skillGroups: [
      {
        id: "backend",
        title: "Backend & Enterprise Systems",
        summary: "The core: APIs, identity, audit, and background services in production.",
        skills: [
          { name: "C# · .NET Framework · .NET Core · ASP.NET" },
          { name: "ASP.NET Core · Blazor" },
          { name: "Java · REST APIs" },
          { name: "SignalR · Real-time" },
          { name: "Authentication · JWT · Identity" },
          { name: "Audit logging · Background services" },
        ],
      },
      {
        id: "frontend",
        title: "Frontend & UI",
        summary: "Enterprise dashboards and internal UIs that teams use every day.",
        skills: [
          { name: "React · TypeScript · JavaScript" },
          { name: "Angular" },
          { name: "Blazor UI" },
          { name: "Tailwind CSS · Bootstrap · jQuery" },
          { name: "Responsive UI · Mobile-friendly" },
          { name: "Enterprise dashboards" },
        ],
      },
      {
        id: "data",
        title: "Databases & Data",
        summary: "Enterprise data models, query optimization, and transactional integrity.",
        skills: [
          { name: "SQL Server · Oracle" },
          { name: "LINQ · LINQ DB · EF Core" },
          { name: "Query optimization" },
          { name: "Reporting · Data integrity" },
          { name: "Enterprise data models" },
        ],
      },
      {
        id: "maps",
        title: "Maps, Real-Time & Operations",
        summary: "Coverage, geographic statistics, and live monitoring over real operations.",
        skills: [
          { name: "Leaflet · Google Maps" },
          { name: "Live coverage / statistical maps" },
          { name: "SignalR · Redis" },
          { name: "Real-time monitoring" },
          { name: "Operational dashboards" },
        ],
      },
      {
        id: "devops",
        title: "DevOps & Delivery",
        summary: "Pipelines, deployments, and production troubleshooting.",
        skills: [
          { name: "GitLab · GitHub" },
          { name: "CI/CD · Deployment automation" },
          { name: "Docker · IIS" },
          { name: "Vercel" },
          { name: "Production troubleshooting" },
        ],
      },
      {
        id: "legacy",
        title: "Reporting & Legacy Systems",
        summary: "Legacy systems kept running, modernized in steps, and treated with care.",
        skills: [
          { name: "JasperReports · Crystal Reports" },
          { name: "Windows Server · .bat automation" },
          { name: "WinForms · Java ME · Verifone" },
          { name: "Legacy .NET modernization" },
        ],
      },
      {
        id: "ai",
        title: "AI Operations Lab",
        summary:
          "Personal AI infrastructure: local models, automation, vector memory, observability, and agents with human approval.",
        skills: [
          { name: "Local AI infra · LiteLLM + Ollama routing" },
          { name: "Automation workflows · n8n + integrations" },
          { name: "Vector memory · Qdrant + RAG retrieval" },
          { name: "Agent pipeline · Codex / Claude CLI wrappers" },
          { name: "Observability · Langfuse + eval harness" },
          { name: "Human-in-the-loop approval · draft + sign-off" },
        ],
      },
    ],
  },
  es: {
    capabilities: {
      eyebrow: "Stack técnico",
      title: "7 capacidades respaldadas por trabajo en producción.",
      subtitle: "El stack, agrupado por lo que sé hacer con él.",
    },
    skillGroups: [
      {
        id: "backend",
        title: "Backend y Sistemas Empresariales",
        summary: "El núcleo: APIs, identidad, auditoría y servicios de fondo en producción.",
        skills: [
          { name: "C# · .NET Framework · .NET Core · ASP.NET" },
          { name: "ASP.NET Core · Blazor" },
          { name: "Java · APIs REST" },
          { name: "SignalR · tiempo real" },
          { name: "Autenticación · JWT · Identity" },
          { name: "Auditoría · servicios en background" },
        ],
      },
      {
        id: "frontend",
        title: "Frontend y UI",
        summary: "Dashboards empresariales y UIs internas que los equipos usan todos los días.",
        skills: [
          { name: "React · TypeScript · JavaScript" },
          { name: "Angular" },
          { name: "Blazor UI" },
          { name: "Tailwind CSS · Bootstrap · jQuery" },
          { name: "UI responsiva · mobile-friendly" },
          { name: "Dashboards empresariales" },
        ],
      },
      {
        id: "data",
        title: "Bases de Datos y Datos",
        summary:
          "Modelos de datos empresariales, optimización de consultas e integridad transaccional.",
        skills: [
          { name: "SQL Server · Oracle" },
          { name: "LINQ · LINQ DB · EF Core" },
          { name: "Optimización de consultas" },
          { name: "Reportería · integridad de datos" },
          { name: "Modelos de datos empresariales" },
        ],
      },
      {
        id: "maps",
        title: "Mapas, Tiempo Real y Operaciones",
        summary: "Cobertura, estadística geográfica y monitoreo en vivo sobre operación real.",
        skills: [
          { name: "Leaflet · Google Maps" },
          { name: "Mapas de cobertura y estadísticos en vivo" },
          { name: "SignalR · Redis" },
          { name: "Monitoreo en tiempo real" },
          { name: "Dashboards operativos" },
        ],
      },
      {
        id: "devops",
        title: "DevOps y Entrega",
        summary: "Pipelines, despliegues y resolución de incidencias en producción.",
        skills: [
          { name: "GitLab · GitHub" },
          { name: "CI/CD · automatización de despliegues" },
          { name: "Docker · IIS" },
          { name: "Vercel" },
          { name: "Soporte de producción" },
        ],
      },
      {
        id: "legacy",
        title: "Reportería y Sistemas Legados",
        summary:
          "Sistemas legados que se mantienen en marcha, se modernizan por etapas y se tratan con cuidado.",
        skills: [
          { name: "JasperReports · Crystal Reports" },
          { name: "Windows Server · automatización .bat" },
          { name: "WinForms · Java ME · Verifone" },
          { name: "Modernización de .NET legado" },
        ],
      },
      {
        id: "ai",
        title: "Laboratorio de Operaciones con IA",
        summary:
          "Infraestructura personal de IA: modelos locales, automatización, memoria vectorial, observabilidad y agentes con aprobación humana.",
        skills: [
          { name: "Infra de IA local · enrutamiento LiteLLM + Ollama" },
          { name: "Flujos de automatización · n8n + integraciones" },
          { name: "Memoria vectorial · Qdrant + retrieval RAG" },
          { name: "Pipeline de agentes · wrappers Codex / Claude CLI" },
          { name: "Observabilidad · Langfuse + eval harness" },
          { name: "Humano en el loop · borrador + aprobación" },
        ],
      },
    ],
  },
};
