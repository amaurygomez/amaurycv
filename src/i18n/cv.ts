import type { Lang } from "./content";

export const cvLangs: Lang[] = ["es", "en"];

export type CvRole = {
  title: string;
  context: string;
  tenure: string;
  scope: string;
  highlights: string[];
  stack: string[];
};

export type CvProject = { name: string; text: string; href?: string };

export type CvContent = {
  headline: string;
  focus: string;
  availability: string;
  lede: [string, string];
  facts: string[];
  location: string;
  profile: string;
  experienceNote: string;
  footnote: string;
  experience: CvRole[];
  skills: { group: string; items: string[] }[];
  projects: CvProject[];
  education: { degree: string; detail: string }[];
  certifications: string[];
  certificationsNote: string;
  languages: string[];
};

export type CvSectionKey = "profile" | "experience" | "skills" | "projects" | "education";

export type CvSection = {
  key: CvSectionKey;
  index: string;
  id: Record<Lang, string>;
  label: Record<Lang, string>;
};

export const cvSections: CvSection[] = [
  {
    key: "profile",
    index: "01",
    id: { es: "perfil", en: "profile" },
    label: { es: "Perfil", en: "Profile" },
  },
  {
    key: "experience",
    index: "02",
    id: { es: "experiencia", en: "experience" },
    label: { es: "Experiencia", en: "Experience" },
  },
  {
    key: "skills",
    index: "03",
    id: { es: "habilidades", en: "skills" },
    label: { es: "Habilidades", en: "Skills" },
  },
  {
    key: "projects",
    index: "04",
    id: { es: "proyectos", en: "projects" },
    label: { es: "Proyectos", en: "Projects" },
  },
  {
    key: "education",
    index: "05",
    id: { es: "formacion", en: "education" },
    label: { es: "Formación", en: "Education" },
  },
];

export const sourceUrl = "https://github.com/amaurygomez/amaurycv";

export const cv: Record<Lang, CvContent> = {
  en: {
    headline: "Senior Full Stack Engineer",
    focus: ".NET / React / SQL Server",
    availability: "Open to senior remote roles · US / Canada · contractor or EOR",
    lede: [
      "I own features end to end:",
      "SQL schema and stored procedures, the .NET API, the React or Angular front end, and deployment.",
    ],
    facts: [
      "11+ years in production",
      "Telecom · Government · Banking",
      "Remote, UTC-4",
      "ES / EN",
    ],
    location: "Santo Domingo, DR",
    profile:
      "Full stack engineer with 11+ years building and maintaining production systems for telecommunications, government and banking. My main stack is C#/.NET, React/TypeScript and Microsoft SQL Server, with Oracle and Angular on long-running systems. Most of my work supports daily operations: integrations with third-party and government APIs, internal tools for sales, support and operations teams, and automation that replaces manual steps. Much of that happens inside legacy systems that cannot be taken offline.",
    experienceNote:
      "The two longest roles ran in parallel. Organization names and exact dates are in the full CV.",
    footnote:
      "The two longest roles ran in parallel. Organization and school names and exact dates are in the full CV, available on request at amaurygomez.dev/cv.",
    experience: [
      {
        title: "Senior Software Developer",
        context: "Telecommunications carrier",
        tenure: "8+ years",
        scope:
          "Modernized legacy applications without interrupting 24/7 operations, using GitLab CI/CD and Dockerized services.",
        highlights: [
          "Built the coverage map for fixed and mobile services embedded in the CRM so sales and support know what can be offered in each zone. It pulls zone data from the network vendor’s platform API, keeps geospatial data in Oracle behind a .NET Core API, and renders it in Angular with Google Maps.",
          "Reduced Google Maps API cost by optimizing how the map runs searches and handles user interactions.",
          "Built a geospatial tool (Leaflet, Google Maps) to draw, calculate and quote network sections by antenna and urban zone.",
          "Built the quality department’s monitoring platform: screen and voice capture (FFmpeg), a REST API, and live per-agent traceability.",
          "Delivered internal apps across several departments: process automation, workflows, surveys, auctions and audio/video streaming, plus the Asterisk IVR options-registration module.",
        ],
        stack: [
          "C#",
          ".NET / .NET Core",
          "ASP.NET",
          "Angular",
          "React",
          "Oracle (ODP.NET)",
          "SQL Server",
          "SignalR",
          "Google Maps API",
          "Docker",
          "GitLab CI/CD",
        ],
      },
      {
        title: "Full Stack Developer (Contractor)",
        context: "Government agency · concurrent contract",
        tenure: "8+ years",
        scope:
          "Developed and maintained the background-check platform and related internal systems, running in a restricted environment over sensitive data.",
        highlights: [
          "Built the middleware that fronts other institutions’ identity and fingerprint APIs, with a local cache that keeps the platform answering when those services are down.",
          "Implemented authentication and per-profile permissions (ASP.NET Core Identity, JWT) so every read of a sensitive record is attributable and auditable.",
          "Designed SQL Server schemas, stored procedures, triggers, views and functions, and optimized queries; used Redis for caching and SignalR for real-time updates.",
          "Built React and Angular front ends: admin modules, case-status dashboards, internal HR tools, and live operational and statistical maps by province, municipality and sector.",
        ],
        stack: [
          "C#",
          "ASP.NET Core",
          "ASP.NET Core Identity",
          "JWT",
          "LINQ",
          "AutoMapper",
          "Swagger / OpenAPI",
          "React",
          "Angular",
          "TypeScript",
          "SQL Server (T-SQL)",
          "Redis",
          "SignalR",
          "Jira",
          "Bitbucket",
        ],
      },
      {
        title: "Java Developer",
        context: "Regulated financial institution",
        tenure: "2 years",
        scope:
          "Built and maintained the mortgage CRM and loan management system end to end, taking loan applications off paper and automating earnings estimates.",
        highlights: [
          "Built a loan-calculator application and APIs for external clients.",
          "Built the daily JasperReports reporting for bank operations and the Windows batch automation that replaced manual processes and resolved user collisions on shared network files.",
        ],
        stack: [
          "Java EE",
          "JSF",
          "PrimeFaces",
          "Hibernate",
          "GlassFish",
          "JasperReports",
          "SQL Server",
          "Windows batch",
        ],
      },
      {
        title: "Full Stack Developer",
        context: "POS and transaction software company",
        tenure: "1 year",
        scope:
          "Built mobile top-up and lottery transaction flows, including a Java ME app for Verifone and Android POS terminals.",
        highlights: [
          "Optimized the Java socket service that POS terminals called on every transaction, so response times held under peak load.",
          "Built an ASP.NET CRM with a SOAP API for clients and supervisors and an admin panel, on .NET Framework 3.5 with WinForms tools and Crystal Reports.",
        ],
        stack: [
          "Java",
          "Java ME",
          "Android",
          "Verifone",
          "Sockets",
          "ASP.NET",
          "SOAP",
          "WinForms",
          ".NET Framework 3.5",
          "SQL Server",
          "Crystal Reports",
        ],
      },
    ],
    skills: [
      {
        group: "Programming languages",
        items: ["C#", "TypeScript", "JavaScript", "SQL (T-SQL)", "Java", "Python"],
      },
      {
        group: "Backend",
        items: [
          ".NET / .NET Core",
          "ASP.NET Core Web API",
          "Entity Framework Core",
          "LINQ",
          "SignalR",
          "AutoMapper",
          "REST",
          "SOAP",
          "Java EE",
        ],
      },
      {
        group: "Frontend",
        items: ["React", "Angular", "Blazor", "Tailwind CSS", "Leaflet", "Google Maps API"],
      },
      {
        group: "Data",
        items: [
          "Microsoft SQL Server (schema design, stored procedures, triggers, query tuning)",
          "Oracle (ODP.NET)",
          "Redis",
          "MySQL",
          "Azure SQL",
        ],
      },
      {
        group: "APIs & security",
        items: [
          "Third-party and government REST/SOAP APIs",
          "Middleware services",
          "ASP.NET Core Identity",
          "JWT",
          "Per-profile permissions",
          "Audit trails",
          "Swagger / OpenAPI",
        ],
      },
      {
        group: "Practices",
        items: [
          "Code review",
          "Unit and end-to-end testing",
          "Scrum / Kanban",
          "Technical documentation",
        ],
      },
      {
        group: "DevOps & cloud",
        items: [
          "Docker",
          "GitLab CI/CD",
          "Azure DevOps",
          "Git",
          "GitHub",
          "Bitbucket",
          "IIS",
          "Windows Server",
          "Linux",
          "AWS (EC2, S3, Amplify)",
          "Azure",
          "Firebase",
        ],
      },
    ],
    projects: [
      {
        name: "AG World",
        href: sourceUrl,
        text: "This site: Astro with React islands, an isometric world in PixiJS, a CV page that prints its own PDF, and full-CV delivery through an encrypted serverless endpoint.",
      },
      {
        name: "Self-hosted LLM stack",
        text: "Models served by Ollama behind LiteLLM routing, with Qdrant retrieval, Langfuse tracing and n8n automations.",
      },
    ],
    education: [
      {
        degree: "Associate degree in Software Development",
        detail: "Dominican Republic · Completed",
      },
      {
        degree: "Computer Science Engineering",
        detail: "Dominican Republic · In progress",
      },
    ],
    certifications: [
      "Application Development using Microservices and Serverless · IBM · 2024",
      "Container & Kubernetes Essentials · IBM · 2024",
    ],
    certificationsNote: "Full list, verifiable on Credly:",
    languages: ["Spanish (native)", "English (professional working proficiency)"],
  },
  es: {
    headline: "Desarrollador Full Stack Senior",
    focus: ".NET / React / SQL Server",
    availability: "Abierto a roles senior remotos · EE. UU. / Canadá · por contrato o EOR",
    lede: [
      "Me encargo de cada funcionalidad de punta a punta:",
      "esquema y procedimientos almacenados en SQL, API en .NET, frontend en React o Angular y despliegue.",
    ],
    facts: ["+11 años en producción", "Telecom · Gobierno · Banca", "Remoto, UTC-4", "ES / EN"],
    location: "Santo Domingo, RD",
    profile:
      "Desarrollador full stack con más de 11 años construyendo y manteniendo sistemas en producción para telecomunicaciones, gobierno y banca. Mi stack principal es C#/.NET, React/TypeScript y Microsoft SQL Server, además de Oracle y Angular en sistemas con muchos años en producción. Casi todo mi trabajo sostiene la operación diaria: integraciones con APIs de terceros y del Estado, herramientas internas para ventas, soporte y operaciones, y automatizaciones que eliminan pasos manuales. Buena parte ocurre dentro de sistemas legados que no se pueden detener.",
    experienceNote:
      "Las dos posiciones más largas fueron simultáneas. Los nombres de las organizaciones y las fechas exactas están en el CV completo.",
    footnote:
      "Las dos posiciones más largas fueron simultáneas. Los nombres de organizaciones e instituciones y las fechas exactas están en el CV completo, disponible a solicitud en amaurygomez.dev/cv.",
    experience: [
      {
        title: "Desarrollador de Software Senior",
        context: "Operadora de telecomunicaciones",
        tenure: "+8 años",
        scope:
          "Modernicé aplicaciones legadas sin interrumpir la operación 24/7, con GitLab CI/CD y servicios en Docker.",
        highlights: [
          "Construí el mapa de cobertura de servicios fijos y móviles integrado al CRM para que ventas y soporte sepan qué ofrecer en cada zona. Consume por zona los datos de la API de la plataforma del proveedor de red, guarda lo geoespacial en Oracle detrás de una API en .NET Core y lo muestra en Angular con Google Maps.",
          "Reduje el costo de la API de Google Maps optimizando cómo el mapa ejecuta búsquedas y maneja las interacciones.",
          "Construí una herramienta geoespacial (Leaflet, Google Maps) para dibujar, calcular y cotizar tramos de red por antena y zona urbana.",
          "Construí la plataforma de monitoreo del departamento de calidad: captura de pantalla y voz (FFmpeg), API REST y trazabilidad en vivo por agente.",
          "Entregué aplicaciones internas para varios departamentos: automatización de procesos, flujos de trabajo, encuestas, subastas y streaming de audio y video, además del módulo de registro de opciones del IVR en Asterisk.",
        ],
        stack: [
          "C#",
          ".NET / .NET Core",
          "ASP.NET",
          "Angular",
          "React",
          "Oracle (ODP.NET)",
          "SQL Server",
          "SignalR",
          "Google Maps API",
          "Docker",
          "GitLab CI/CD",
        ],
      },
      {
        title: "Desarrollador Full Stack (por contrato)",
        context: "Institución gubernamental · contrato en paralelo",
        tenure: "+8 años",
        scope:
          "Desarrollé y mantuve la plataforma de consulta de antecedentes y sus sistemas internos relacionados, en un entorno restringido con datos sensibles.",
        highlights: [
          "Construí el middleware que consume las APIs de identidad y huellas de otras instituciones, con caché local que mantiene la plataforma respondiendo cuando esos servicios se caen.",
          "Implementé autenticación y permisos por perfil (ASP.NET Core Identity, JWT) para que toda lectura de un registro sensible quede atribuida y auditable.",
          "Diseñé esquemas en SQL Server, procedimientos almacenados, triggers, vistas y funciones, y optimicé consultas; usé Redis para caché y SignalR para actualizaciones en tiempo real.",
          "Desarrollé frontends en React y Angular: módulos administrativos, dashboards de estado de casos, herramientas internas de RR. HH. y mapas operativos en vivo y estadísticos por provincia, municipio y sector.",
        ],
        stack: [
          "C#",
          "ASP.NET Core",
          "ASP.NET Core Identity",
          "JWT",
          "LINQ",
          "AutoMapper",
          "Swagger / OpenAPI",
          "React",
          "Angular",
          "TypeScript",
          "SQL Server (T-SQL)",
          "Redis",
          "SignalR",
          "Jira",
          "Bitbucket",
        ],
      },
      {
        title: "Desarrollador Java",
        context: "Entidad financiera regulada",
        tenure: "2 años",
        scope:
          "Construí y mantuve de punta a punta el CRM hipotecario y el sistema de gestión de préstamos, eliminando el papel en las solicitudes y automatizando la estimación de ganancias.",
        highlights: [
          "Desarrollé una calculadora de préstamos y APIs para clientes externos.",
          "Desarrollé los reportes diarios en JasperReports para la operación del banco y scripts batch de Windows que reemplazaron procesos manuales y resolvieron colisiones de usuarios sobre archivos compartidos en red.",
        ],
        stack: [
          "Java EE",
          "JSF",
          "PrimeFaces",
          "Hibernate",
          "GlassFish",
          "JasperReports",
          "SQL Server",
          "Windows batch",
        ],
      },
      {
        title: "Desarrollador Full Stack",
        context: "Empresa de software transaccional y POS",
        tenure: "1 año",
        scope:
          "Construí los flujos transaccionales de recargas móviles y lotería, incluida una app en Java ME para terminales POS Verifone y Android.",
        highlights: [
          "Optimicé el servicio de sockets en Java que las terminales POS consumían en cada transacción, para sostener los tiempos de respuesta en las horas pico.",
          "Desarrollé un CRM en ASP.NET con API SOAP para clientes y supervisores y un panel administrativo, sobre .NET Framework 3.5 con herramientas en WinForms y reportes en Crystal Reports.",
        ],
        stack: [
          "Java",
          "Java ME",
          "Android",
          "Verifone",
          "Sockets",
          "ASP.NET",
          "SOAP",
          "WinForms",
          ".NET Framework 3.5",
          "SQL Server",
          "Crystal Reports",
        ],
      },
    ],
    skills: [
      {
        group: "Lenguajes",
        items: ["C#", "TypeScript", "JavaScript", "SQL (T-SQL)", "Java", "Python"],
      },
      {
        group: "Backend",
        items: [
          ".NET / .NET Core",
          "ASP.NET Core Web API",
          "Entity Framework Core",
          "LINQ",
          "SignalR",
          "AutoMapper",
          "REST",
          "SOAP",
          "Java EE",
        ],
      },
      {
        group: "Frontend",
        items: ["React", "Angular", "Blazor", "Tailwind CSS", "Leaflet", "Google Maps API"],
      },
      {
        group: "Datos",
        items: [
          "Microsoft SQL Server (modelado, procedimientos almacenados, triggers, optimización de consultas)",
          "Oracle (ODP.NET)",
          "Redis",
          "MySQL",
          "Azure SQL",
        ],
      },
      {
        group: "APIs y seguridad",
        items: [
          "APIs REST/SOAP de terceros y del Estado",
          "Servicios middleware",
          "ASP.NET Core Identity",
          "JWT",
          "Permisos por perfil",
          "Auditoría y trazabilidad",
          "Swagger / OpenAPI",
        ],
      },
      {
        group: "Prácticas",
        items: [
          "Revisión de código",
          "Pruebas unitarias y end-to-end",
          "Scrum / Kanban",
          "Documentación técnica",
        ],
      },
      {
        group: "DevOps y nube",
        items: [
          "Docker",
          "GitLab CI/CD",
          "Azure DevOps",
          "Git",
          "GitHub",
          "Bitbucket",
          "IIS",
          "Windows Server",
          "Linux",
          "AWS (EC2, S3, Amplify)",
          "Azure",
          "Firebase",
        ],
      },
    ],
    projects: [
      {
        name: "AG World",
        href: sourceUrl,
        text: "Este sitio: Astro con islas de React, un mundo isométrico en PixiJS, una página de CV que imprime su propio PDF y entrega del CV completo mediante un endpoint serverless cifrado.",
      },
      {
        name: "Stack de LLM autoalojado",
        text: "Modelos servidos con Ollama detrás de un enrutador LiteLLM, con búsqueda en Qdrant, trazas en Langfuse y automatizaciones en n8n.",
      },
    ],
    education: [
      {
        degree: "Tecnólogo en Desarrollo de Software",
        detail: "República Dominicana · Completado",
      },
      {
        degree: "Ingeniería en Ciencias de la Computación",
        detail: "República Dominicana · En curso",
      },
    ],
    certifications: [
      "Application Development using Microservices and Serverless · IBM · 2024",
      "Container & Kubernetes Essentials · IBM · 2024",
    ],
    certificationsNote: "Lista completa y verificable en Credly:",
    languages: ["Español (nativo)", "Inglés (dominio profesional)"],
  },
};

export const cvUi = {
  title: "Amaury Gómez · CV",
  skip: { es: "Saltar al contenido", en: "Skip to content" },
  sectionsNav: { es: "Secciones", en: "Sections" },
  language: { es: "Idioma", en: "Language" },
  document: { es: "Documento", en: "Document" },
  paperView: { es: "Vista papel", en: "Paper view" },
  download: { es: "Descargar PDF", en: "Download PDF" },
  downloadMeta: { es: "ES · 2 págs", en: "EN · 2 pp" },
  downloadLabel: { es: "Descargar PDF en español", en: "Download PDF in English" },
  request: { es: "Solicitar CV completo", en: "Request full CV" },
  certifications: { es: "Certificaciones", en: "Certifications" },
  languages: { es: "Idiomas", en: "Languages" },
  requestSection: {
    eyebrow: { es: "CV completo", en: "Full CV" },
    title: {
      es: "Nombres de empleadores y fechas, por email.",
      en: "Employer names and dates, by email.",
    },
    text: {
      es: "Te llega como PDF en unos minutos, en el idioma que estás leyendo.",
      en: "It arrives as a PDF within minutes, in the language you are reading.",
    },
  },
  colophon: {
    es: "Esta página es el CV: el PDF se imprime desde este mismo HTML con Chromium.",
    en: "This page is the CV: the PDF is printed from this same HTML with Chromium.",
  },
  source: { es: "Código", en: "Source" },
  dialog: {
    title: { es: "Solicitar CV completo", en: "Request the full CV" },
    description: {
      es: "La versión completa incluye nombres de empleadores y fechas. Te llega por email en unos minutos.",
      en: "The full version includes employer names and dates. It reaches your inbox within minutes.",
    },
    name: { es: "Nombre", en: "Name" },
    company: { es: "Empresa", en: "Company" },
    email: { es: "Email de trabajo", en: "Work email" },
    role: { es: "Posición que evalúas", en: "Role you are hiring for" },
    privacy: {
      es: "Uso estos datos solo para enviarte el CV y saber quién lo pidió.",
      en: "I use these details only to send you the CV and to know who asked for it.",
    },
    cancel: { es: "Cancelar", en: "Cancel" },
    close: { es: "Cerrar", en: "Close" },
    sentTitle: { es: "Listo. Revisa", en: "Done. Check" },
    sentText: {
      es: "Si no llega en 10 minutos, revisa spam o escríbeme a",
      en: "If it doesn’t arrive in 10 minutes, check spam or email",
    },
    another: { es: "Enviar a otro email", en: "Send to another email" },
    unavailable: {
      es: "El formulario no está disponible ahora. Escríbeme a",
      en: "The form is unavailable right now. Email",
    },
  },
};

export type RequestCopy = {
  verifying: string;
  send: string;
  sending: string;
  invalid: Record<"name" | "company" | "email" | "role", string>;
  links: string;
  failed: string;
  captcha: string;
  rateLimited: string;
};

// {email} becomes a mailto link and {n} the formatted wait.
export const requestCopy: Record<Lang, RequestCopy> = {
  es: {
    verifying: "Verificando…",
    send: "Enviar solicitud",
    sending: "Enviando…",
    invalid: {
      name: "Escribe tu nombre.",
      company: "Escribe la empresa.",
      email: "Email no válido.",
      role: "Indica la posición.",
    },
    links: "Quita los enlaces de este campo.",
    failed: "No pude enviarlo. Intenta de nuevo o escríbeme a {email}.",
    captcha: "La verificación falló. Inténtalo otra vez.",
    rateLimited: "Recibí varias solicitudes desde esta red. Intenta en {n} o escríbeme a {email}.",
  },
  en: {
    verifying: "Verifying…",
    send: "Send request",
    sending: "Sending…",
    invalid: {
      name: "Enter your name.",
      company: "Enter the company.",
      email: "Enter a valid email.",
      role: "Enter the role.",
    },
    links: "Remove the links from this field.",
    failed: "Couldn’t send it. Try again or email {email}.",
    captcha: "Verification failed. Please try again.",
    rateLimited: "Too many requests from this network. Try again in {n} or email {email}.",
  },
};
