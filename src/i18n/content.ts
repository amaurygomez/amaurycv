export type Lang = "en" | "es";

export type Skill = { name: string; level: number };
export type SkillGroup = { title: string; skills: Skill[] };
export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
};
export type Education = { school: string; degree: string; period: string };
export type Pillar = { iconKey: "Layers" | "Rocket" | "Brain" | "Shield"; title: string; text: string };
export type Stat = { label: string; value: number; suffix: string };

export type Content = {
  ui: {
    availableBadge: string;
    iAmA: string;
    contactBtn: string;
    githubBtn: string;
    exploreBtn: string;
    seeMore: string;
    sections: {
      about: { eyebrow: string; title: string; description: string };
      experience: { eyebrow: string; title: string; description: string };
      skills: { eyebrow: string; title: string; description: string };
      stack: { eyebrow: string; title: string; description: string };
      education: { eyebrow: string; title: string; description: string };
    };
    educationLabel: string;
    certificationsLabel: string;
    cta: {
      headline1: string;
      headlineAccent: string;
      headline2: string;
      sub: string;
    };
    footerNote: string;
    nav: { about: string; experience: string; skills: string; stack: string; education: string };
  };
  profile: {
    summary: string;
    positioning: string;
    roles: string[];
  };
  stats: Stat[];
  pillars: Pillar[];
  skillGroups: SkillGroup[];
  experience: Experience[];
  techStack: Record<string, readonly string[]>;
  education: Education[];
  certifications: string[];
};

const sharedProfile = {
  name: "Amaury Emmanuel Gómez Rodríguez",
  shortName: "Amaury Gómez",
  initials: "AG",
  location: "Santo Domingo, Dominican Republic",
  locationEs: "Santo Domingo, República Dominicana",
  email: "aegrdz@outlook.com",
  github: "https://github.com/amaurygomez",
  githubHandle: "amaurygomez",
  cvPath: "/cv",
};

export const profile = sharedProfile;

export const marquee = [
  "C# · .NET",
  "ASP.NET Core",
  "Blazor",
  "React · TypeScript",
  "Java",
  "Oracle · SQL Server",
  "Leaflet · Google Maps",
  "SignalR · Redis",
  "REST APIs · JWT",
  "GitLab · CI/CD · Docker",
  "JasperReports · Crystal Reports",
  "Java ME · Verifone · Android POS",
  "AI Operations · n8n · Qdrant",
  "Local LLM Routing · LiteLLM · Ollama",
  "Legacy Modernization",
  "Auditability · Traceability",
];

export const content: Record<Lang, Content> = {
  en: {
    ui: {
      availableBadge: "Available for senior engineering & architecture roles",
      iAmA: "",
      contactBtn: "Contact",
      githubBtn: "GitHub",
      exploreBtn: "Explore my journey",
      seeMore: "Learn more",
      sections: {
        about: {
          eyebrow: "About",
          title: "Engineering systems that power real operations",
          description:
            "Enterprise software engineer focused on modernization, scalable operational systems, AI-assisted engineering workflows, secure platforms, and long-term maintainability.",
        },
        experience: {
          eyebrow: "Experience",
          title: "A timeline of building enterprise platforms",
          description:
            "From banking and transactional systems to modern, AI-augmented enterprise architecture.",
        },
        skills: {
          eyebrow: "Core Expertise",
          title: "Skills across the full enterprise stack",
          description:
            "Deep specialization in .NET 10 and modern frontend, paired with architecture thinking and AI-assisted engineering.",
        },
        stack: {
          eyebrow: "Technology Stack",
          title: "The tools I ship with",
          description:
            "Battle-tested across telecommunications, public-sector, financial, and operational platforms.",
        },
        education: {
          eyebrow: "Education & Certifications",
          title: "Continuous learning, applied",
          description:
            "Formal computer science education combined with continuous certifications in cloud-native, DevOps, and modern engineering.",
        },
      },
      educationLabel: "Education",
      certificationsLabel: "Certifications",
      cta: {
        headline1: "Let's build something",
        headlineAccent: "resilient",
        headline2: ".",
        sub: "Open to senior engineering, architecture, and modernization roles. Reach out and let's talk.",
      },
      footerNote: "Built with React, TypeScript, Tailwind CSS & Motion.",
      nav: {
        about: "About",
        experience: "Experience",
        skills: "Skills",
        stack: "Stack",
        education: "Education",
      },
    },
    profile: {
      summary:
        "Senior software engineer from Santo Domingo, Dominican Republic, with 13+ years connected to technology and 9+ years professionally building, modernizing, and maintaining enterprise platforms in real operational environments. Experience spans telecommunications (coverage maps, CRM-embedded geospatial tools, voice recording and live monitoring), banking (loan workflows, JasperReports, .bat automation), confidential public-sector platforms (identity, audit, live operational maps, statistical dashboards), and transactional/POS systems (Android POS, Verifone, Java ME, sockets, legacy ASP.NET/WinForms). Specialized in .NET, React, Java, Oracle, SQL Server, geospatial libraries, APIs, legacy modernization, and AI-assisted engineering with human review.",
      positioning:
        "I build and modernize enterprise systems that have to work in real operations, not just in demos.",
      roles: [
        "Senior Software Engineer",
        "Enterprise Systems Architect",
        "AI Operations · Local-first",
        "Santo Domingo, DR · Bilingual ES/EN",
      ],
    },
    stats: [
      { label: "Years connected to technology", value: 13, suffix: "+" },
      { label: "Years professional", value: 9, suffix: "+" },
      { label: "Sectors", value: 4, suffix: "" },
      { label: "Production uptime", value: 24, suffix: "/7" },
    ],
    pillars: [
      {
        iconKey: "Layers",
        title: "Enterprise & operational systems",
        text: "Telecom, banking, public-sector, and transactional platforms built for daily use — not demos.",
      },
      {
        iconKey: "Rocket",
        title: "Legacy modernization",
        text: "Evolving .NET Framework, WinForms, Crystal Reports, and JSF stacks without breaking what works in production.",
      },
      {
        iconKey: "Brain",
        title: "AI-augmented engineering",
        text: "AI-assisted workflows with human review at every step. AI is leverage, not autopilot.",
      },
      {
        iconKey: "Shield",
        title: "Auditability & confidentiality",
        text: "Identity, permissions, audit trails, and discretion around institutional/security work.",
      },
    ],
    skillGroups: [
      {
        title: "Backend & Enterprise Systems",
        skills: [
          { name: "C# · .NET Framework · .NET Core · ASP.NET", level: 95 },
          { name: "ASP.NET Core · Blazor", level: 93 },
          { name: "Java · REST APIs", level: 85 },
          { name: "SignalR · Real-time", level: 82 },
          { name: "Authentication · JWT · Identity", level: 90 },
          { name: "Audit logging · Background services", level: 88 },
        ],
      },
      {
        title: "Frontend & UI",
        skills: [
          { name: "React · TypeScript · JavaScript", level: 92 },
          { name: "Angular", level: 80 },
          { name: "Blazor UI", level: 85 },
          { name: "Tailwind CSS · Bootstrap · jQuery", level: 90 },
          { name: "Responsive UI · Mobile-friendly", level: 90 },
          { name: "Enterprise dashboards", level: 92 },
        ],
      },
      {
        title: "Databases & Data",
        skills: [
          { name: "SQL Server · Oracle", level: 92 },
          { name: "LINQ · LINQ DB · EF Core", level: 90 },
          { name: "Query optimization", level: 88 },
          { name: "Reporting · Data integrity", level: 90 },
          { name: "Enterprise data models", level: 90 },
        ],
      },
      {
        title: "Maps, Real-Time & Operations",
        skills: [
          { name: "Leaflet · Google Maps", level: 90 },
          { name: "Live coverage / statistical maps", level: 92 },
          { name: "SignalR · Redis", level: 82 },
          { name: "Real-time monitoring", level: 90 },
          { name: "Operational dashboards", level: 92 },
        ],
      },
      {
        title: "DevOps & Delivery",
        skills: [
          { name: "GitLab · GitHub", level: 90 },
          { name: "CI/CD · Deployment automation", level: 88 },
          { name: "Docker · IIS", level: 85 },
          { name: "Vercel", level: 85 },
          { name: "Production troubleshooting", level: 93 },
        ],
      },
      {
        title: "Reporting & Legacy Systems",
        skills: [
          { name: "JasperReports · Crystal Reports", level: 85 },
          { name: "Windows Server · .bat automation", level: 85 },
          { name: "WinForms · Java ME · Verifone", level: 82 },
          { name: "Legacy .NET modernization", level: 92 },
        ],
      },
      {
        title: "AI Operations Lab",
        skills: [
          { name: "Local AI infra · LiteLLM + Ollama routing", level: 92 },
          { name: "Automation workflows · n8n + integrations", level: 90 },
          { name: "Vector memory · Qdrant + RAG retrieval", level: 90 },
          { name: "Agent pipeline · Codex / Claude CLI wrappers", level: 90 },
          { name: "Observability · Langfuse + eval harness", level: 88 },
          { name: "Human-in-the-loop approval · draft + sign-off", level: 92 },
        ],
      },
    ],
    experience: [
      {
        role: "Senior Software Engineer · Telecommunications",
        company: "Telecommunications carrier (name withheld for confidentiality)",
        period: "Extended tenure · 24/7 operations",
        summary:
          "Build and maintain internal enterprise software supporting sales, support, network planning, and quality monitoring teams. Focus on coverage-aware CRM tooling, geospatial planning, voice/screen recording, and live monitoring of representative–customer interactions.",
        highlights: [
          "HFC, fiber, 2G/3G/4G/5G coverage map embedded into CRM so sales and support know what can be offered by zone.",
          "Geospatial tool to draw, calculate, and quote network sections (tramos) by antenna and urban zone.",
          "Screen and voice recording platform for representatives with live monitoring and per-agent traceability.",
          "IVR/Asterisk options registration module for phone-attention flows.",
          "Legacy modernization preserving 24/7 operational continuity; CI/CD on GitLab; Dockerized services.",
        ],
        tags: [
          ".NET Core",
          "ASP.NET",
          "Blazor",
          "Java",
          "Oracle",
          "SQL Server",
          "Leaflet",
          "Google Maps",
          "SignalR",
          "Docker",
        ],
      },
      {
        role: "Developer / Consultant · Confidential Public Sector",
        company: "State institution (generalized for confidentiality)",
        period: "Extended tenure · confidential environment",
        summary:
          "Develop and modernize operational platforms in a secure institutional environment. Specific systems, infrastructure, endpoints, and procedures are intentionally generalized due to the sensitive nature of the work.",
        highlights: [
          "Backend integrations with multiple institutional APIs and external services.",
          "Identity, per-profile permissions, audit trails, and traceability over sensitive data.",
          "Live operational maps and statistical maps by province, municipality, and sector.",
          "Decision dashboards, admin modules, and internal HR tooling.",
          "Progressive modernization without breaking availability or critical operational behavior.",
        ],
        tags: [
          ".NET Core",
          "ASP.NET Core",
          "Blazor",
          "React",
          "Angular",
          "SQL Server",
          "Oracle",
          "Redis",
          "SignalR",
          "JWT · Identity",
          "Audit",
        ],
      },
      {
        role: "Java Developer · Banking",
        company: "Regulated financial institution (name withheld)",
        period: "Multi-year chapter",
        summary:
          "Internal banking software with enterprise Java and operational automation.",
        highlights: [
          "Built and maintained end-to-end loan workflows.",
          "Modified and maintained JasperReports used daily across banking operations.",
          "Windows .bat automation to resolve user collisions over shared network files.",
          "Integrations with internal services and support over transactional data.",
        ],
        tags: ["Java", "JSF", "PrimeFaces", "JasperReports", "Windows Server", ".bat", "SQL Server"],
      },
      {
        role: "Full-Stack Developer · POS & Transactional",
        company: "Software & network-operations company (name withheld)",
        period: "First professional chapter",
        summary:
          "First formal job at a small software and network-operations company building transactional systems, mobile POS, payment terminal integrations, and legacy enterprise apps.",
        highlights: [
          "Android POS systems and Verifone payment terminal integrations using Java ME.",
          "Mobile recharge and lottery transactional flows.",
          "Java socket communication and internal Java APIs.",
          "Crystal Reports reporting plus legacy ASP.NET / WinForms apps on .NET Framework 3.5.",
        ],
        tags: [
          "Java",
          "Java ME",
          "Android",
          "Verifone",
          "Sockets",
          "ASP.NET",
          "WinForms",
          ".NET Framework 3.5",
          "Crystal Reports",
        ],
      },
    ],
    techStack: {
      "Backend & Enterprise": [
        "C#",
        ".NET Framework",
        ".NET Core",
        "ASP.NET",
        "ASP.NET Core",
        "Blazor",
        "Java",
        "REST APIs",
        "SignalR",
        "JWT · Identity",
        "Audit logging",
      ],
      "Frontend & UI": [
        "React",
        "TypeScript",
        "JavaScript",
        "Angular",
        "Blazor UI",
        "Tailwind CSS",
        "Bootstrap",
        "jQuery",
      ],
      "Databases & Data": [
        "SQL Server",
        "Oracle",
        "LINQ",
        "LINQ DB",
        "EF Core",
        "Query optimization",
      ],
      "Maps, Real-Time & Operations": [
        "Leaflet",
        "Google Maps",
        "SignalR",
        "Redis",
        "Live ops dashboards",
        "Statistical maps",
      ],
      "DevOps & Delivery": ["GitLab", "GitHub", "CI/CD", "Docker", "IIS", "Vercel"],
      "Reporting & Legacy": [
        "JasperReports",
        "Crystal Reports",
        "Windows Server",
        ".bat automation",
        "WinForms",
        "Java ME",
        "Verifone",
        ".NET Framework 3.5",
      ],
      "AI Operations Lab": [
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
    education: [
      {
        school: "University program (institution withheld)",
        degree: "Engineering in Computer Science",
        period: "Ongoing studies",
      },
      {
        school: "Technical institute (institution withheld)",
        degree: "Software Development Technologist path",
        period: "Early technical training",
      },
    ],
    certifications: [
      "DevOps, Cloud, and Agile Foundations",
      "Application Development using Microservices and Serverless",
      "Container & Kubernetes Essentials",
      "Git and GitHub Essentials",
      "DevOps Essentials",
      "Cloud Computing Foundations",
      "Linux Commands & Shell Scripting Essentials",
    ],
  },
  es: {
    ui: {
      availableBadge: "Disponible para roles senior de ingeniería y arquitectura",
      iAmA: "",
      contactBtn: "Contacto",
      githubBtn: "GitHub",
      exploreBtn: "Explora mi trayectoria",
      seeMore: "Ver más",
      sections: {
        about: {
          eyebrow: "Acerca de mí",
          title: "Sistemas de ingeniería que sostienen operaciones reales",
          description:
            "Ingeniero de software empresarial enfocado en modernización, sistemas operativos escalables, flujos de ingeniería asistida por IA, plataformas seguras y mantenibilidad a largo plazo.",
        },
        experience: {
          eyebrow: "Experiencia",
          title: "Una trayectoria construyendo plataformas empresariales",
          description:
            "Desde sistemas bancarios y transaccionales hasta arquitectura empresarial moderna potenciada por IA.",
        },
        skills: {
          eyebrow: "Especialidades",
          title: "Habilidades en todo el stack empresarial",
          description:
            "Profunda especialización en .NET 10 y frontend moderno, combinada con pensamiento de arquitectura e ingeniería asistida por IA.",
        },
        stack: {
          eyebrow: "Stack Tecnológico",
          title: "Las herramientas con las que entrego",
          description:
            "Probado en producción en telecomunicaciones, sector público, financiero y plataformas operativas.",
        },
        education: {
          eyebrow: "Educación y Certificaciones",
          title: "Aprendizaje continuo, aplicado",
          description:
            "Educación formal en ciencias de la computación combinada con certificaciones continuas en cloud-native, DevOps e ingeniería moderna.",
        },
      },
      educationLabel: "Educación",
      certificationsLabel: "Certificaciones",
      cta: {
        headline1: "Construyamos algo",
        headlineAccent: "resiliente",
        headline2: ".",
        sub: "Abierto a roles senior de ingeniería, arquitectura y modernización. Escríbeme y conversemos.",
      },
      footerNote: "Construido con React, TypeScript, Tailwind CSS y Motion.",
      nav: {
        about: "Acerca",
        experience: "Experiencia",
        skills: "Habilidades",
        stack: "Stack",
        education: "Educación",
      },
    },
    profile: {
      summary:
        "Ingeniero de software senior basado en Santo Domingo, República Dominicana, con 13+ años conectado a la tecnología y 9+ años profesionales construyendo, modernizando y manteniendo plataformas empresariales en entornos operativos reales. La experiencia abarca telecomunicaciones (mapas de cobertura, herramientas geoespaciales integradas al CRM, grabación de voz y monitoreo en vivo), banca (flujos de préstamos, JasperReports, automatización .bat), plataformas confidenciales del sector público (identidad, auditoría, mapas operativos en vivo, dashboards estadísticos), y sistemas transaccionales/POS (POS Android, Verifone, Java ME, sockets, ASP.NET/WinForms legados). Especialista en .NET, React, Java, Oracle, SQL Server, librerías geoespaciales, APIs, modernización de sistemas legados e ingeniería asistida por IA con revisión humana.",
      positioning:
        "Construyo y modernizo sistemas empresariales que tienen que funcionar en operación real, no solo en demos.",
      roles: [
        "Ingeniero de Software Senior",
        "Arquitecto de Sistemas Empresariales",
        "Operaciones con IA · Local-first",
        "Santo Domingo, RD · Bilingüe ES/EN",
      ],
    },
    stats: [
      { label: "Años conectado a la tecnología", value: 13, suffix: "+" },
      { label: "Años profesionales", value: 9, suffix: "+" },
      { label: "Sectores", value: 4, suffix: "" },
      { label: "Disponibilidad en producción", value: 24, suffix: "/7" },
    ],
    pillars: [
      {
        iconKey: "Layers",
        title: "Sistemas empresariales y operativos",
        text: "Plataformas de telecom, banca, sector público y transaccionales construidas para uso diario — no para demos.",
      },
      {
        iconKey: "Rocket",
        title: "Modernización de sistemas legados",
        text: "Evolución de .NET Framework, WinForms, Crystal Reports y JSF sin romper lo que funciona en producción.",
      },
      {
        iconKey: "Brain",
        title: "Ingeniería aumentada con IA",
        text: "Flujos asistidos por IA con revisión humana en cada paso. La IA es palanca, no autopiloto.",
      },
      {
        iconKey: "Shield",
        title: "Auditoría y confidencialidad",
        text: "Identidad, permisos, trazabilidad y discreción en torno a trabajo institucional/sensible.",
      },
    ],
    skillGroups: [
      {
        title: "Backend y Sistemas Empresariales",
        skills: [
          { name: "C# · .NET Framework · .NET Core · ASP.NET", level: 95 },
          { name: "ASP.NET Core · Blazor", level: 93 },
          { name: "Java · APIs REST", level: 85 },
          { name: "SignalR · tiempo real", level: 82 },
          { name: "Autenticación · JWT · Identity", level: 90 },
          { name: "Auditoría · servicios en background", level: 88 },
        ],
      },
      {
        title: "Frontend y UI",
        skills: [
          { name: "React · TypeScript · JavaScript", level: 92 },
          { name: "Angular", level: 80 },
          { name: "Blazor UI", level: 85 },
          { name: "Tailwind CSS · Bootstrap · jQuery", level: 90 },
          { name: "UI responsiva · mobile-friendly", level: 90 },
          { name: "Dashboards empresariales", level: 92 },
        ],
      },
      {
        title: "Bases de Datos y Datos",
        skills: [
          { name: "SQL Server · Oracle", level: 92 },
          { name: "LINQ · LINQ DB · EF Core", level: 90 },
          { name: "Optimización de consultas", level: 88 },
          { name: "Reportería · integridad de datos", level: 90 },
          { name: "Modelos de datos empresariales", level: 90 },
        ],
      },
      {
        title: "Mapas, Tiempo Real y Operaciones",
        skills: [
          { name: "Leaflet · Google Maps", level: 90 },
          { name: "Mapas de cobertura y estadísticos en vivo", level: 92 },
          { name: "SignalR · Redis", level: 82 },
          { name: "Monitoreo en tiempo real", level: 90 },
          { name: "Dashboards operativos", level: 92 },
        ],
      },
      {
        title: "DevOps y Entrega",
        skills: [
          { name: "GitLab · GitHub", level: 90 },
          { name: "CI/CD · automatización de despliegues", level: 88 },
          { name: "Docker · IIS", level: 85 },
          { name: "Vercel", level: 85 },
          { name: "Soporte de producción", level: 93 },
        ],
      },
      {
        title: "Reportería y Sistemas Legados",
        skills: [
          { name: "JasperReports · Crystal Reports", level: 85 },
          { name: "Windows Server · automatización .bat", level: 85 },
          { name: "WinForms · Java ME · Verifone", level: 82 },
          { name: "Modernización de .NET legado", level: 92 },
        ],
      },
      {
        title: "Laboratorio de Operaciones con IA",
        skills: [
          { name: "Infra de IA local · enrutamiento LiteLLM + Ollama", level: 92 },
          { name: "Flujos de automatización · n8n + integraciones", level: 90 },
          { name: "Memoria vectorial · Qdrant + retrieval RAG", level: 90 },
          { name: "Pipeline de agentes · wrappers Codex / Claude CLI", level: 90 },
          { name: "Observabilidad · Langfuse + eval harness", level: 88 },
          { name: "Humano en el loop · borrador + aprobación", level: 92 },
        ],
      },
    ],
    experience: [
      {
        role: "Ingeniero de Software Senior · Telecomunicaciones",
        company: "Operadora de telecomunicaciones (nombre reservado por confidencialidad)",
        period: "Etapa extensa · operación 24/7",
        summary:
          "Construyo y mantengo software interno que sostiene a los equipos de venta, soporte, planificación de red y monitoreo de calidad. Foco en herramientas de CRM con cobertura, planificación geoespacial, grabación de voz/pantalla y monitoreo en vivo de interacciones representante–cliente.",
        highlights: [
          "Mapa de cobertura HFC, fibra, 2G/3G/4G/5G integrado al CRM para que venta y soporte sepan qué ofrecer por zona.",
          "Herramienta geoespacial para dibujar, calcular y cotizar tramos de red por antena y zona urbana.",
          "Plataforma de grabación de pantalla y voz con monitoreo en vivo y trazabilidad por agente.",
          "Módulo de registro de opciones IVR/Asterisk para flujos de atención telefónica.",
          "Modernización de sistemas legados preservando continuidad operativa 24/7; CI/CD en GitLab; servicios Dockerizados.",
        ],
        tags: [
          ".NET Core",
          "ASP.NET",
          "Blazor",
          "Java",
          "Oracle",
          "SQL Server",
          "Leaflet",
          "Google Maps",
          "SignalR",
          "Docker",
        ],
      },
      {
        role: "Desarrollador / Consultor · Sector Público Confidencial",
        company: "Institución estatal (generalizado por confidencialidad)",
        period: "Etapa extensa · entorno confidencial",
        summary:
          "Desarrollo y modernizo plataformas operativas en un entorno institucional seguro. Sistemas específicos, infraestructura, endpoints y procedimientos se mantienen generalizados intencionalmente por la naturaleza sensible del trabajo.",
        highlights: [
          "Integraciones backend con múltiples APIs institucionales y servicios externos.",
          "Identidad, permisos por perfil, auditoría y trazabilidad sobre datos sensibles.",
          "Mapas operativos en vivo y mapas estadísticos por provincia, municipio y sector.",
          "Dashboards de decisión, módulos administrativos y herramientas internas de RRHH.",
          "Modernización progresiva sin romper disponibilidad ni comportamiento operativo crítico.",
        ],
        tags: [
          ".NET Core",
          "ASP.NET Core",
          "Blazor",
          "React",
          "Angular",
          "SQL Server",
          "Oracle",
          "Redis",
          "SignalR",
          "JWT · Identity",
          "Auditoría",
        ],
      },
      {
        role: "Desarrollador Java · Banca",
        company: "Entidad financiera regulada (nombre reservado)",
        period: "Etapa de varios años",
        summary:
          "Banca interna sobre Java empresarial y automatización operativa.",
        highlights: [
          "Construí y mantuve flujos completos de préstamos.",
          "Modifiqué y mantuve reportes JasperReports usados diariamente en operación bancaria.",
          "Automatización Windows con scripts .bat para resolver colisiones de usuarios sobre archivos compartidos.",
          "Integraciones con servicios internos y soporte sobre datos transaccionales.",
        ],
        tags: ["Java", "JSF", "PrimeFaces", "JasperReports", "Windows Server", ".bat", "SQL Server"],
      },
      {
        role: "Full-Stack · POS y Transaccional",
        company: "Casa de software y operaciones de red (nombre reservado)",
        period: "Primer capítulo profesional",
        summary:
          "Primer trabajo formal en una compañía pequeña de software y operaciones de red, construyendo sistemas transaccionales, POS móvil, integraciones con terminales de pago y apps empresariales legadas.",
        highlights: [
          "Sistemas POS Android e integraciones de terminales de pago Verifone con Java ME.",
          "Flujos transaccionales para recargas móviles y lotería.",
          "Comunicación por sockets en Java y APIs Java internas.",
          "Reportería en Crystal Reports y apps legadas ASP.NET / WinForms sobre .NET Framework 3.5.",
        ],
        tags: [
          "Java",
          "Java ME",
          "Android",
          "Verifone",
          "Sockets",
          "ASP.NET",
          "WinForms",
          ".NET Framework 3.5",
          "Crystal Reports",
        ],
      },
    ],
    techStack: {
      "Backend y Empresarial": [
        "C#",
        ".NET Framework",
        ".NET Core",
        "ASP.NET",
        "ASP.NET Core",
        "Blazor",
        "Java",
        "APIs REST",
        "SignalR",
        "JWT · Identity",
        "Auditoría",
      ],
      "Frontend y UI": [
        "React",
        "TypeScript",
        "JavaScript",
        "Angular",
        "Blazor UI",
        "Tailwind CSS",
        "Bootstrap",
        "jQuery",
      ],
      "Bases de Datos y Datos": [
        "SQL Server",
        "Oracle",
        "LINQ",
        "LINQ DB",
        "EF Core",
        "Optimización de consultas",
      ],
      "Mapas, Tiempo Real y Operaciones": [
        "Leaflet",
        "Google Maps",
        "SignalR",
        "Redis",
        "Dashboards en vivo",
        "Mapas estadísticos",
      ],
      "DevOps y Entrega": ["GitLab", "GitHub", "CI/CD", "Docker", "IIS", "Vercel"],
      "Reportería y Legacy": [
        "JasperReports",
        "Crystal Reports",
        "Windows Server",
        "Automatización .bat",
        "WinForms",
        "Java ME",
        "Verifone",
        ".NET Framework 3.5",
      ],
      "Laboratorio de Operaciones con IA": [
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
    education: [
      {
        school: "Programa universitario (institución reservada)",
        degree: "Ingeniería en Ciencias de la Computación",
        period: "Estudios en curso",
      },
      {
        school: "Instituto técnico (institución reservada)",
        degree: "Tecnología en Desarrollo de Software",
        period: "Formación técnica temprana",
      },
    ],
    certifications: [
      "Fundamentos de DevOps, Cloud y Agile",
      "Desarrollo de Aplicaciones con Microservicios y Serverless",
      "Esenciales de Contenedores y Kubernetes",
      "Esenciales de Git y GitHub",
      "Esenciales de DevOps",
      "Fundamentos de Computación en la Nube",
      "Esenciales de Comandos Linux y Scripting Shell",
    ],
  },
};
