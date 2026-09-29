// Home (/) interactions: ported from the approved prototype.
// Hero city (three.js), scroll reveals, count-ups, animated case diagrams, process rail, ES/EN and theme.
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initHero } from "./hero.js";
import { initProjects } from "./projects.js";


  /* ---------- utils ---------- */
  var root = document.documentElement;
  var REDUCED = false;
  try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* unavailable: keep the default */ }
  var hasGsap = true;
  var hasST = true;
  if (hasST) { try { gsap.registerPlugin(ScrollTrigger); } catch { hasST = false; } }
  var hasIO = 'IntersectionObserver' in window;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function hexRgb(h) {
    h = (h || '#000000').trim().replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mixHex(a, b, t) {
    var x = hexRgb(a), y = hexRgb(b);
    return 'rgb(' + Math.round(lerp(x[0], y[0], t)) + ',' + Math.round(lerp(x[1], y[1], t)) + ',' + Math.round(lerp(x[2], y[2], t)) + ')';
  }
  function rgba(h, a) { var c = hexRgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  /* ---------- theme (light by default; dark only by explicit choice) ---------- */
  function effectiveTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  try { var saved = localStorage.getItem('ag-theme'); if (saved === 'dark') root.setAttribute('data-theme', 'dark'); } catch { /* unavailable: keep the default */ }
  var themeListeners = [];
  function onTheme(fn) { themeListeners.push(fn); }
  function emitTheme() {
    var th = effectiveTheme();
    themeListeners.forEach(function (f) { try { f(th); } catch { /* unavailable: keep the default */ } });
  }
  function tokens() {
    var cs = getComputedStyle(root);
    var g = function (n) { return cs.getPropertyValue(n).trim(); };
    return {
      bg: g('--bg'), surface: g('--surface'), sunken: g('--sunken'), line: g('--line'), lineStrong: g('--line-strong'),
      ink: g('--ink'), ink2: g('--ink-2'), muted: g('--ink-muted'), primary: g('--primary'), accent: g('--accent'),
      success: g('--success'), isLight: effectiveTheme() === 'light'
    };
  }
  $('#theme-btn').addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    if (next === 'dark') root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    try { localStorage.setItem('ag-theme', next); } catch { /* unavailable: keep the default */ }
    emitTheme();
  });

  /* ---------- i18n ---------- */
  var I18N = {
    es: {
      'skip': 'Saltar al contenido',
      'brand.desc': 'Ingeniería de software', 'brand.aria': 'Amaury Gómez · Ingeniería de software',
      'nav.main': 'Principal', 'nav.lang': 'Idioma', 'nav.theme': 'Cambiar tema', 'nav.menu': 'Abrir menú', 'nav.menuClose': 'Cerrar menú',
      'nav.services': 'Servicios', 'nav.projects': 'Proyectos', 'nav.approach': 'Enfoque', 'nav.process': 'Proceso', 'nav.founder': 'Fundador', 'nav.contact': 'Contacto', 'nav.talk': 'Contactar',
      'hero.chip': 'Disponible para nuevos proyectos',
      'hero.h1': 'Ingeniería de software para operaciones que no pueden detenerse.',
      'hero.sub': 'Diseño, desarrollo y modernización de plataformas críticas para telecomunicaciones, gobierno y banca. Más de 11 años en producción continua con .NET, SQL Server y React.',
      'hero.cta1': 'Ver proyectos', 'hero.cta2': 'Solicitar currículum completo',
      'metrics.aria': 'Métricas',
      'm1': 'Años en producción', 'm2': 'Operación continua', 'm3': 'Sectores regulados', 'm4': 'Atención bilingüe',
      'svc.eyebrow': 'Servicios', 'svc.title': 'Servicios', 'svc.sub': 'Del diseño de la base de datos a la puesta en producción.',
      'svc1.h': 'Plataformas críticas', 'svc1.p': 'Sistemas que operan 24/7 con datos sensibles: diseño de arquitectura, API, interfaz y despliegue bajo una sola responsabilidad.',
      'svc2.h': 'Modernización de sistemas legados', 'svc2.p': 'Migración progresiva a .NET moderno y contenedores sin interrumpir la operación.',
      'svc3.h': 'Integraciones y APIs', 'svc3.p': 'Conexión con servicios de terceros e instituciones, con tolerancia a fallos, caché de contingencia y trazabilidad.',
      'svc4.h': 'Datos y rendimiento', 'svc4.p': 'Modelado en SQL Server y Oracle, procedimientos almacenados y optimización de consultas.',
      'proj.eyebrow': 'Proyectos', 'proj.title': 'Proyectos destacados', 'proj.note': 'Los nombres de los clientes se comparten bajo solicitud.',
      'p1.tag': 'Telecomunicaciones · CRM · Geoespacial', 'p1.h': 'Mapa de cobertura integrado en el CRM',
      'p1.p': 'Ventas y soporte consultan, desde el mismo CRM, qué servicios fijos y móviles están disponibles en cada zona. Integra la API del proveedor de red y datos geoespaciales en Oracle; además, redujo el costo de Google Maps mediante la optimización de búsquedas e interacciones.',
      'p2.tag': 'Gobierno · Identidad · Seguridad', 'p2.h': 'Servicio de identidad con continuidad ante fallos externos',
      'p2.p': 'Capa intermedia frente a las APIs de identidad y huellas dactilares de otras instituciones, con caché local de contingencia. Permisos por perfil con ASP.NET Core Identity y JWT, y auditoría de cada consulta a datos sensibles.',
      'p3.tag': 'Telecomunicaciones · Calidad · Tiempo real', 'p3.h': 'Monitoreo de calidad con trazabilidad por agente en tiempo real',
      'p3.p': 'Captura de pantalla y voz con FFmpeg, API REST y panel en tiempo real con SignalR para el área de calidad.',
      'd1.aria': 'Diagrama: mapa de cobertura por zonas', 'd1.fixed': 'Fijo', 'd1.mobile': 'Móvil', 'd1.zone': 'Zona', 'd1.title': 'Cobertura por zona', 'd1.both': 'Fijo · Móvil', 'd1.only': 'Solo móvil',
      'd2.aria': 'Diagrama: capa intermedia de identidad con caché de contingencia', 'd2.api1': 'API · Identidad', 'd2.api2': 'API · Huellas', 'd2.api3': 'API · Registros',
      'd2.mw': 'Capa intermedia', 'd2.auth1': 'Identity · JWT', 'd2.auth2': 'Auditoría', 'd2.cache': 'Caché local', 'd2.app': 'Aplicación', 'd2.down': 'Sin respuesta', 'd2.served': 'Servido desde caché',
      'd3.aria': 'Diagrama: panel de calidad en tiempo real', 'd3.rec': 'Grabando', 'd3.agent': 'Agente', 'd3.s1': 'En llamada', 'd3.s2': 'Disponible', 'd3.s3': 'En revisión', 'd3.s4': 'Pausa', 'd3.title': 'Panel de calidad · en vivo',
      'how.eyebrow': 'Enfoque', 'how.title': 'Enfoque',
      'how1.h': 'Responsabilidad de extremo a extremo', 'how1.p': 'Una sola persona responsable de cada funcionalidad: esquema, procedimientos, API, interfaz y despliegue.',
      'how2.h': 'Continuidad operativa', 'how2.p': 'Modernización de sistemas en producción sin detener la operación, con integración y despliegue continuos.',
      'how3.h': 'Seguridad y cumplimiento', 'how3.p': 'Permisos por perfil, auditoría y ambientes restringidos para datos de gobierno y banca.',
      'proc.eyebrow': 'Proceso', 'proc.title': 'Cómo trabajamos', 'proc.sub': 'Ocho pasos, de la solicitud al soporte. Cada uno con responsable y tiempo definidos.',
      'st1.h': 'Solicitud', 'st1.p': 'Formulario con el tipo de sistema, sector, estado del sistema, plazo y presupuesto estimado.', 'st1.m': 'Cliente · 5 min',
      'st2.h': 'Análisis asistido por IA', 'st2.p': 'Resumen, clasificación, complejidad estimada, riesgos y preguntas clave. La IA prepara; no decide.', 'st2.m': 'Automático · minutos',
      'st3.h': 'Revisión del fundador', 'st3.p': 'Cada solicitud se revisa personalmente antes de avanzar.', 'st3.m': 'Fundador · 24–48 h',
      'st4.h': 'Llamada inicial', 'st4.p': 'Conversación breve para confirmar necesidad, plazo y presupuesto. Agenda en horario de EE. UU.', 'st4.m': '20 min · sin costo',
      'st5.h': 'Diagnóstico y propuesta', 'st5.p': 'Análisis técnico bajo acuerdo de confidencialidad. Su costo depende de la magnitud y se acredita al proyecto si se contrata.', 'st5.m': 'Pagado · acreditable',
      'st6.h': 'Contrato y anticipo', 'st6.p': 'Firma digital del contrato, cesión de propiedad intelectual al pago y anticipo antes de iniciar.', 'st6.m': 'Firma digital',
      'st7.h': 'Ejecución', 'st7.p': 'Reunión diaria de 15 minutos o puntos de control semanales, demostraciones quincenales y tablero compartido.', 'st7.m': 'Iteraciones de 2 semanas',
      'st8.h': 'Entrega y soporte', 'st8.p': 'Despliegue, documentación y soporte mensual opcional.', 'st8.m': 'Continuo',
      'req.eyebrow': 'Paso 01', 'req.title': 'Iniciar un proyecto',
      'start.eyebrow': 'Paso 01', 'start.title': 'Iniciar un proyecto', 'start.p': 'Escriba al correo indicando el tipo de sistema, el sector, el estado del sistema, el plazo y el presupuesto estimado. Cada solicitud se revisa personalmente y recibe respuesta en 24 a 48 horas.',
      'f.name': 'Nombre', 'f.company': 'Empresa', 'f.email': 'Correo corporativo',
      'req.type': 'Tipo de proyecto', 'req.choose': 'Seleccione una opción',
      'req.t1': 'Nueva plataforma', 'req.t2': 'Modernización de sistema existente', 'req.t3': 'Integración o API', 'req.t4': 'Consultoría técnica',
      'req.sector': 'Sector', 'req.s1': 'Telecomunicaciones', 'req.s2': 'Gobierno', 'req.s3': 'Banca y finanzas', 'req.s4': 'Salud', 'req.s5': 'Comercio', 'req.s6': 'Otro',
      'req.term': 'Plazo', 'req.d1': 'Menos de 3 meses', 'req.d2': '3 a 6 meses', 'req.d3': 'Más de 6 meses', 'req.d4': 'Por definir',
      'req.budget': 'Presupuesto estimado', 'req.b1': 'Por definir', 'req.b2': 'Menos de USD 10 000', 'req.b3': 'USD 10 000 – 50 000', 'req.b4': 'Más de USD 50 000',
      'req.desc': 'Descripción', 'req.err': 'Complete todos los campos con un correo válido.', 'req.privacy': 'Prototipo: este formulario no envía información.', 'req.send': 'Enviar solicitud',
      'sim.tag': 'Simulación del proceso', 'sim.step': 'Paso 02 · Análisis asistido por IA', 'sim.title': 'Análisis preliminar', 'sim.reset': 'Nueva solicitud',
      'sim.type': 'Tipo', 'sim.sector': 'Sector', 'sim.cx': 'Complejidad estimada', 'sim.q': 'Preguntas clave', 'sim.low': 'Baja', 'sim.mid': 'Media', 'sim.high': 'Alta',
      'sim.status': 'En revisión del fundador · respuesta en 24–48 h',
      'q.new': '¿Qué procesos de negocio debe cubrir la primera versión?\n¿Qué volumen de usuarios y transacciones se espera en el primer año?\n¿Existen sistemas actuales con los que deba integrarse?',
      'q.mod': '¿Qué partes del sistema existente generan más incidentes o costo?\n¿Qué documentación y pruebas existen sobre el sistema existente?\n¿Qué ventanas de operación no pueden verse afectadas?',
      'q.int': '¿Qué servicios o instituciones se deben conectar y con qué protocolos?\n¿Qué comportamiento se espera cuando un servicio externo no responde?\n¿Qué datos deben quedar auditados?',
      'q.con': '¿Qué decisión técnica se busca respaldar con la consultoría?\n¿Quién toma las decisiones y en qué plazo?\n¿Qué información del sistema existente puede compartirse?',
      'cal.eyebrow': 'Paso 04', 'cal.title': 'Agendar una llamada', 'cal.tz': 'Hora del Este de EE. UU. (ET)', 'cal.daysAria': 'Días', 'cal.slotsAria': 'Franjas de 30 minutos',
      'cal.none': 'Seleccione una franja disponible.', 'cal.book': 'Reservar llamada', 'cal.note': 'La agenda real se conecta al calendario del fundador',
      'cal.ok': 'Reserva de prueba: {day} {time} ET. En el sitio real se confirma por correo.', 'cal.week': 'Semana del {from} al {to}', 'cal.selected': '{day} · {time} ET',
      'stack.aria': 'Tecnologías', 'stack.eyebrow': 'Tecnologías en producción',
      'ag.tag': 'Este sitio · Astro · React · Pixi · Código abierto', 'ag.h': 'Explore la trayectoria como una ciudad interactiva',
      'ag.p': 'El recorrido completo, en un mundo isométrico construido con Astro, React y Pixi. El currículum imprimible se genera desde el mismo código.',
      'ag.cta1': 'Explorar AG World', 'ag.cta2': 'Ver código fuente',
      'founder.tag': 'Fundador · Santo Domingo', 'founder.photo': '[Fotografía]', 'founder.eyebrow': 'Fundador', 'founder.sub': 'Fundador e ingeniero principal',
      'founder.bio': 'Ingeniero de software con más de 11 años construyendo y manteniendo sistemas en producción para telecomunicaciones, gobierno y banca. Su especialidad es C#/.NET, React/TypeScript y SQL Server, con experiencia en Oracle y Angular en sistemas de larga trayectoria. Ha liderado de extremo a extremo plataformas que sostienen la operación diaria de sus clientes.',
      'e1.r': 'Desarrollador de software sénior', 'e1.o': 'Operador de telecomunicaciones', 'e1.t': '8+ años',
      'e2.r': 'Desarrollador full stack (contrato)', 'e2.o': 'Agencia gubernamental · en paralelo', 'e2.t': '8+ años',
      'e3.r': 'Desarrollador Java', 'e3.o': 'Institución financiera regulada', 'e3.t': 'Dos años',
      'e4.r': 'Desarrollador full stack', 'e4.o': 'Software de punto de venta y transacciones', 'e4.t': '1 año',
      'founder.note': 'También disponible para posiciones sénior remotas (EE. UU. y Canadá).', 'founder.cv': 'Ver currículum',
      'cv.eyebrow': 'Currículum completo', 'cv.h': 'Nombres de empleadores y fechas, bajo solicitud.',
      'cv.p': 'Por confidencialidad con clientes de gobierno, banca y telecomunicaciones, cada solicitud se revisa personalmente antes de compartir el documento. Respuesta en 24 a 48 horas.',
      'cv.btn': 'Solicitar currículum completo',
      'dlg.h': 'Solicitar currículum completo', 'dlg.p': 'Indique quién es y qué posición o proyecto evalúa.', 'dlg.close': 'Cerrar diálogo',
      'f.role': 'Posición o proyecto', 'f.privacy': 'Estos datos se usan únicamente para revisar su solicitud y responderle.', 'f.send': 'Enviar solicitud', 'f.cancel': 'Cancelar',
      'f.err': 'Complete todos los campos con un correo válido.', 'f.ok': 'Solicitud recibida. La respuesta llegará a {email}.', 'f.closeBtn': 'Cerrar',
      'contact.eyebrow': 'Contacto', 'contact.h': '¿Tiene una plataforma crítica que construir o modernizar?',
      'contact.p': 'Escriba a este correo y recibirá respuesta en 24 a 48 horas.', 'contact.copy': 'Copiar', 'contact.copied': 'Copiado', 'contact.copyAria': 'Copiar correo',
      'footer.copy': '© Santo Domingo, República Dominicana', 'footer.line': 'Amaury Gómez · Ingeniería de software', 'footer.ag': 'Explorar AG World'
    },
    en: {
      'skip': 'Skip to content',
      'brand.desc': 'Software engineering', 'brand.aria': 'Amaury Gómez · Software engineering',
      'nav.main': 'Main', 'nav.lang': 'Language', 'nav.theme': 'Toggle theme', 'nav.menu': 'Open menu', 'nav.menuClose': 'Close menu',
      'nav.services': 'Services', 'nav.projects': 'Projects', 'nav.approach': 'Approach', 'nav.process': 'Process', 'nav.founder': 'Founder', 'nav.contact': 'Contact', 'nav.talk': 'Contact',
      'hero.chip': 'Available for new projects',
      'hero.h1': 'Software engineering for operations that cannot stop.',
      'hero.sub': 'Design, development and modernization of critical platforms for telecommunications, government and banking. More than 11 years in continuous production with .NET, SQL Server and React.',
      'hero.cta1': 'View projects', 'hero.cta2': 'Request full résumé',
      'metrics.aria': 'Metrics',
      'm1': 'Years in production', 'm2': 'Continuous operation', 'm3': 'Regulated sectors', 'm4': 'Bilingual service',
      'svc.eyebrow': 'Services', 'svc.title': 'Services', 'svc.sub': 'From database design to production release.',
      'svc1.h': 'Critical platforms', 'svc1.p': 'Systems that run 24/7 with sensitive data: architecture design, API, interface and deployment under a single responsibility.',
      'svc2.h': 'Legacy system modernization', 'svc2.p': 'Progressive migration to modern .NET and containers without interrupting operations.',
      'svc3.h': 'Integrations and APIs', 'svc3.p': 'Connection with third-party services and institutions, with fault tolerance, contingency caching and traceability.',
      'svc4.h': 'Data and performance', 'svc4.p': 'Data modeling in SQL Server and Oracle, stored procedures and query optimization.',
      'proj.eyebrow': 'Projects', 'proj.title': 'Featured projects', 'proj.note': 'Client names are shared on request.',
      'p1.tag': 'Telecommunications · CRM · Geospatial', 'p1.h': 'Coverage map integrated into the CRM',
      'p1.p': "Sales and support teams check, from the same CRM, which fixed and mobile services are available in each area. It integrates the network provider's API and geospatial data in Oracle; it also reduced Google Maps costs by optimizing searches and interactions.",
      'p2.tag': 'Government · Identity · Security', 'p2.h': 'Identity service with continuity under external failures',
      'p2.p': "Intermediate layer in front of other institutions' identity and fingerprint APIs, with a local contingency cache. Role-based permissions with ASP.NET Core Identity and JWT, and an audit trail of every query on sensitive data.",
      'p3.tag': 'Telecommunications · Quality · Real time', 'p3.h': 'Quality monitoring with real-time per-agent traceability',
      'p3.p': 'Screen and voice capture with FFmpeg, a REST API and a real-time dashboard with SignalR for the quality department.',
      'd1.aria': 'Diagram: coverage map by area', 'd1.fixed': 'Fixed', 'd1.mobile': 'Mobile', 'd1.zone': 'Area', 'd1.title': 'Coverage by area', 'd1.both': 'Fixed · Mobile', 'd1.only': 'Mobile only',
      'd2.aria': 'Diagram: identity middleware with contingency cache', 'd2.api1': 'API · Identity', 'd2.api2': 'API · Fingerprints', 'd2.api3': 'API · Records',
      'd2.mw': 'Middleware', 'd2.auth1': 'Identity · JWT', 'd2.auth2': 'Audit log', 'd2.cache': 'Local cache', 'd2.app': 'Application', 'd2.down': 'No response', 'd2.served': 'Served from cache',
      'd3.aria': 'Diagram: real-time quality dashboard', 'd3.rec': 'Recording', 'd3.agent': 'Agent', 'd3.s1': 'On call', 'd3.s2': 'Available', 'd3.s3': 'In review', 'd3.s4': 'Break', 'd3.title': 'Quality panel · live',
      'how.eyebrow': 'Approach', 'how.title': 'Approach',
      'how1.h': 'End-to-end responsibility', 'how1.p': 'A single person responsible for each feature: schema, stored procedures, API, interface and deployment.',
      'how2.h': 'Operational continuity', 'how2.p': 'Modernization of production systems without stopping operations, with continuous integration and deployment.',
      'how3.h': 'Security and compliance', 'how3.p': 'Role-based permissions, auditing and restricted environments for government and banking data.',
      'proc.eyebrow': 'Process', 'proc.title': 'How we work', 'proc.sub': 'Eight steps, from request to support. Each with a defined owner and timeframe.',
      'st1.h': 'Request', 'st1.p': 'Form with the type of system, sector, state of the system, timeline and estimated budget.', 'st1.m': 'Client · 5 min',
      'st2.h': 'AI-assisted analysis', 'st2.p': 'Summary, classification, estimated complexity, risks and key questions. AI prepares; it does not decide.', 'st2.m': 'Automatic · minutes',
      'st3.h': 'Founder review', 'st3.p': 'Every request is reviewed personally before moving forward.', 'st3.m': 'Founder · 24–48 h',
      'st4.h': 'Initial call', 'st4.p': 'A short conversation to confirm needs, timeline and budget. Scheduled in U.S. hours.', 'st4.m': '20 min · no cost',
      'st5.h': 'Assessment and proposal', 'st5.p': 'Technical assessment under a confidentiality agreement. Its fee depends on the scope and is credited to the project if it goes ahead.', 'st5.m': 'Paid · credited',
      'st6.h': 'Contract and deposit', 'st6.p': 'Digitally signed contract, intellectual property assigned upon payment and a deposit before work starts.', 'st6.m': 'Digital signature',
      'st7.h': 'Execution', 'st7.p': 'Daily 15-minute meeting or weekly checkpoints, biweekly demos and a shared board.', 'st7.m': '2-week iterations',
      'st8.h': 'Delivery and support', 'st8.p': 'Deployment, documentation and optional monthly support.', 'st8.m': 'Ongoing',
      'req.eyebrow': 'Step 01', 'req.title': 'Start a project',
      'start.eyebrow': 'Step 01', 'start.title': 'Start a project', 'start.p': 'Write to the address below with the type of system, the sector, the state of the system, the timeline and the estimated budget. Every request is reviewed personally and answered within 24 to 48 hours.',
      'f.name': 'Name', 'f.company': 'Company', 'f.email': 'Work email',
      'req.type': 'Project type', 'req.choose': 'Select an option',
      'req.t1': 'New platform', 'req.t2': 'Modernization of an existing system', 'req.t3': 'Integration or API', 'req.t4': 'Technical consulting',
      'req.sector': 'Sector', 'req.s1': 'Telecommunications', 'req.s2': 'Government', 'req.s3': 'Banking and finance', 'req.s4': 'Healthcare', 'req.s5': 'Retail', 'req.s6': 'Other',
      'req.term': 'Timeline', 'req.d1': 'Under 3 months', 'req.d2': '3 to 6 months', 'req.d3': 'Over 6 months', 'req.d4': 'To be defined',
      'req.budget': 'Estimated budget', 'req.b1': 'To be defined', 'req.b2': 'Under USD 10,000', 'req.b3': 'USD 10,000 – 50,000', 'req.b4': 'Over USD 50,000',
      'req.desc': 'Description', 'req.err': 'Fill in every field with a valid email.', 'req.privacy': 'Prototype: this form does not send any information.', 'req.send': 'Send request',
      'sim.tag': 'Process simulation', 'sim.step': 'Step 02 · AI-assisted analysis', 'sim.title': 'Preliminary analysis', 'sim.reset': 'New request',
      'sim.type': 'Type', 'sim.sector': 'Sector', 'sim.cx': 'Estimated complexity', 'sim.q': 'Key questions', 'sim.low': 'Low', 'sim.mid': 'Medium', 'sim.high': 'High',
      'sim.status': 'Under founder review · reply within 24–48 h',
      'q.new': 'Which business processes must the first version cover?\nWhat user and transaction volume is expected in the first year?\nAre there existing systems it must integrate with?',
      'q.mod': 'Which parts of the existing system generate the most incidents or cost?\nWhat documentation and tests exist for the existing system?\nWhich operating windows must not be affected?',
      'q.int': 'Which services or institutions must be connected, and with which protocols?\nWhat behavior is expected when an external service does not respond?\nWhich data must be audited?',
      'q.con': 'Which technical decision should the consulting support?\nWho makes the decisions and within what timeframe?\nWhat information about the existing system can be shared?',
      'cal.eyebrow': 'Step 04', 'cal.title': 'Schedule a call', 'cal.tz': 'U.S. Eastern Time (ET)', 'cal.daysAria': 'Days', 'cal.slotsAria': '30-minute slots',
      'cal.none': 'Select an available slot.', 'cal.book': 'Book a call', 'cal.note': "The live scheduler connects to the founder's calendar",
      'cal.ok': 'Test booking: {day} {time} ET. On the live site, confirmation is sent by email.', 'cal.week': 'Week of {from} to {to}', 'cal.selected': '{day} · {time} ET',
      'stack.aria': 'Technologies', 'stack.eyebrow': 'Technologies in production',
      'ag.tag': 'This site · Astro · React · Pixi · Open source', 'ag.h': 'Explore the track record as an interactive city',
      'ag.p': 'The full journey, in an isometric world built with Astro, React and Pixi. The printable résumé is generated from the same code.',
      'ag.cta1': 'Explore AG World', 'ag.cta2': 'View source code',
      'founder.tag': 'Founder · Santo Domingo', 'founder.photo': '[Photograph]', 'founder.eyebrow': 'Founder', 'founder.sub': 'Founder and principal engineer',
      'founder.bio': "Software engineer with more than 11 years building and maintaining production systems for telecommunications, government and banking. His specialty is C#/.NET, React/TypeScript and SQL Server, with experience in Oracle and Angular on long-running systems. He has led, end to end, platforms that sustain his clients' daily operations.",
      'e1.r': 'Senior Software Developer', 'e1.o': 'Telecommunications operator', 'e1.t': '8+ years',
      'e2.r': 'Full Stack Developer (contract)', 'e2.o': 'Government agency · in parallel', 'e2.t': '8+ years',
      'e3.r': 'Java Developer', 'e3.o': 'Regulated financial institution', 'e3.t': 'Two years',
      'e4.r': 'Full Stack Developer', 'e4.o': 'Point-of-sale and transaction software', 'e4.t': '1 year',
      'founder.note': 'Also available for senior remote positions (U.S. and Canada).', 'founder.cv': 'View résumé',
      'cv.eyebrow': 'Full résumé', 'cv.h': 'Employer names and dates, on request.',
      'cv.p': 'Out of confidentiality with government, banking and telecommunications clients, each request is reviewed personally before the document is shared. Reply within 24 to 48 hours.',
      'cv.btn': 'Request full résumé',
      'dlg.h': 'Request full résumé', 'dlg.p': 'Indicate who you are and which position or project you are evaluating.', 'dlg.close': 'Close dialog',
      'f.role': 'Position or project', 'f.privacy': 'This data is used solely to review your request and reply to you.', 'f.send': 'Send request', 'f.cancel': 'Cancel',
      'f.err': 'Fill in every field with a valid email.', 'f.ok': 'Request received. The reply will be sent to {email}.', 'f.closeBtn': 'Close',
      'contact.eyebrow': 'Contact', 'contact.h': 'Do you have a critical platform to build or modernize?',
      'contact.p': 'Write to this address and you will receive a reply within 24 to 48 hours.', 'contact.copy': 'Copy', 'contact.copied': 'Copied', 'contact.copyAria': 'Copy email',
      'footer.copy': '© Santo Domingo, Dominican Republic', 'footer.line': 'Amaury Gómez · Software engineering', 'footer.ag': 'Explore AG World'
    }
  };
  var LANG = 'es';
  function t(k) { var d = I18N[LANG]; return (d && d[k] != null) ? d[k] : (I18N.es[k] || ''); }
  var langListeners = [];
  function applyLang(l, animate) {
    LANG = I18N[l] ? l : 'es';
    root.setAttribute('lang', LANG);
    $$('[data-i]').forEach(function (el) { var v = t(el.getAttribute('data-i')); if (v) el.textContent = v; });
    $$('[data-i-aria]').forEach(function (el) { var v = t(el.getAttribute('data-i-aria')); if (v) el.setAttribute('aria-label', v); });
    $$('.lang-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === LANG)); });
    buildH1(animate);
    langListeners.forEach(function (f) { try { f(LANG); } catch { /* unavailable: keep the default */ } });
  }
  $$('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      if (l === LANG) return;
      try { localStorage.setItem('ag-lang', l); } catch { /* unavailable: keep the default */ }
      applyLang(l, true);
    });
  });

  /* ---------- hero copy entrance ---------- */
  var hero = $('#hero');
  var h1 = $('#hero-h1');
  function buildH1(rerun) {
    var words = t('hero.h1').split(' ');
    h1.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w';
      s.style.setProperty('--i', i);
      s.textContent = w;
      h1.appendChild(s);
      if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    if (REDUCED) return;
    if (rerun) { hero.classList.remove('anim'); void hero.offsetWidth; }
    hero.classList.add('anim');
  }
  var initialLang = 'es';
  try { var sl = localStorage.getItem('ag-lang'); if (sl === 'en' || sl === 'es') initialLang = sl; } catch { /* unavailable: keep the default */ }
  applyLang(initialLang, false);

  /* ---------- nav: scrolled state, mobile menu, scrollspy ---------- */
  var nav = $('#nav'), menuBtn = $('#menu-btn'), mobile = $('#mobile-menu');
  var spyLinks = $$('.nav-links a[data-spy]'), ind = $('#nav-ind'), spyCurrent = null;
  function spy() {
    var y = window.scrollY + window.innerHeight * 0.4, active = null;
    spyLinks.forEach(function (a) {
      var s = document.getElementById(a.getAttribute('data-spy'));
      if (s && s.getBoundingClientRect().top + window.scrollY <= y) active = a;
    });
    if (window.scrollY < 120) active = null;
    if (active === spyCurrent) return;
    spyCurrent = active;
    spyLinks.forEach(function (a) { a.classList.toggle('is-active', a === active); });
    if (active) { ind.style.left = active.offsetLeft + 'px'; ind.style.width = active.offsetWidth + 'px'; ind.classList.add('on'); }
    else ind.classList.remove('on');
  }
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 16); spy(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { spyCurrent = null; spy(); });
  langListeners.push(function () { spyCurrent = null; spy(); });
  onScroll();
  function setMenu(open) {
    mobile.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? t('nav.menuClose') : t('nav.menu'));
  }
  menuBtn.addEventListener('click', function () { setMenu(!mobile.classList.contains('is-open')); });
  $$('a', mobile).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mobile.classList.contains('is-open')) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000 && mobile.classList.contains('is-open')) setMenu(false); });

  /* ---------- scroll progress on the nav edge ---------- */
  (function () {
    var bar = $('#progress'); if (!bar || REDUCED) return;
    var ticking = false;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--p', max > 0 ? clamp(window.scrollY / max, 0, 1).toFixed(4) : '0');
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  })();

  /* ---------- cursor spotlight on cards ---------- */
  if (!REDUCED) document.addEventListener('pointermove', function (e) {
    var card = e.target && e.target.closest ? e.target.closest('.svc, .ag, .cv, .start') : null;
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- primary button cursor glow ---------- */
  if (!REDUCED) document.addEventListener('pointermove', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.btn-primary') : null;
    if (!b) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    b.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- reveal on scroll (visible by default) ---------- */
  var pendingReveal = [];
  (function () {
    var els = $$('.reveal');
    if (REDUCED) return;
    var vh = window.innerHeight;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > vh * 0.92) { el.classList.add('js-reveal'); pendingReveal.push(el); }
    });
    function show(el) {
      el.classList.add('is-in');
      var i = pendingReveal.indexOf(el);
      if (i > -1) pendingReveal.splice(i, 1);
    }
    if (hasIO) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      pendingReveal.forEach(function (el) { io.observe(el); });
    }
    var ticking = false;
    function check() {
      ticking = false;
      var h = window.innerHeight;
      pendingReveal.slice().forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < h * 0.95 && r.bottom > 0) show(el);
      });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    setTimeout(check, 400);
    setTimeout(function () { pendingReveal.slice().forEach(show); }, 12000);
  })();

  function onceInView(el, fn, threshold) {
    if (!hasIO || !el) { fn(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold || 0.2 });
    io.observe(el);
  }

  /* ---------- metrics count-up ---------- */
  (function () {
    var nums = $$('.metric .num').filter(function (el) { return !el.hasAttribute('data-static'); });
    nums.forEach(function (el) {
      el.textContent = (el.getAttribute('data-prefix') || '') + el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
    });
    if (REDUCED || !hasGsap) return;
    onceInView($('.metrics'), function () {
      nums.forEach(function (el, i) {
        var target = +el.getAttribute('data-target'), pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
        var o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.4, ease: 'power3.out', delay: i * 0.08, onUpdate: function () { el.textContent = pre + Math.round(o.v) + suf; } });
      });
    }, 0.4);
  })();

  /* ---------- shared ticker for 2D animations ---------- */
  var Ticker = (function () {
    var items = [], raf = 0, last = 0;
    function anyActive() { for (var i = 0; i < items.length; i++) if (items[i].active) return true; return false; }
    function loop(now) {
      raf = 0;
      var dt = Math.max(0, Math.min(0.05, (now - last) / 1000)) || 0;
      last = now;
      for (var i = 0; i < items.length; i++) if (items[i].active) { try { items[i].fn(dt, now / 1000); } catch { items[i].active = false; } }
      if (anyActive() && !document.hidden) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } }
    function add(el, fn) {
      var it = { fn: fn, active: false, once: function () { try { fn(0, performance.now() / 1000); } catch { /* unavailable: keep the default */ } } };
      items.push(it);
      if (REDUCED) { it.once(); return it; }
      if (hasIO) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { it.active = e.isIntersecting; if (it.active) kick(); });
        }, { rootMargin: '60px' }).observe(el);
      } else { it.active = true; kick(); }
      return it;
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
    return { add: add, kick: kick };
  })();

  /* ---------- 2D isometric city (AG World card + WebGL fallback) ---------- */
  function isoCity(canvas, cfg) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    var N = cfg.size, SP = 4;
    var rnd = mulberry32(cfg.seed || 3);
    var H = new Float32Array(N * N);
    var cx0 = N / 2, cz0 = N / 2;
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
      if (i % SP === 0 || j % SP === 0) continue;
      var d = Math.hypot(i - cx0, j - cz0) / (N * 0.6);
      var fall = Math.max(0, 1 - d);
      if (rnd() < 0.1) continue;
      H[i * N + j] = 0.3 + Math.pow(rnd(), 1.7) * (0.5 + 3.6 * fall);
    }
    var M = Math.floor((N - 1) / SP) + 1;
    var nodeI = new Float32Array(M * M);
    var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    function mkAgent(speed) {
      var d = DIRS[Math.floor(rnd() * 4)];
      return { a: 1 + Math.floor(rnd() * (M - 2)), b: 1 + Math.floor(rnd() * (M - 2)), di: d[0], dj: d[1], t: rnd(), speed: speed, hist: [] };
    }
    var pulses = [];
    for (var p = 0; p < (cfg.pulses || 6); p++) pulses.push(mkAgent(0.9 + rnd() * 0.9));
    var avatar = cfg.avatar ? mkAgent(0.42) : null;
    function stepAgent(ag, dt) {
      ag.t += ag.speed * dt;
      while (ag.t >= 1) {
        ag.t -= 1; ag.a += ag.di; ag.b += ag.dj;
        if (ag.a >= 0 && ag.a < M && ag.b >= 0 && ag.b < M) nodeI[ag.a * M + ag.b] = 1;
        var keep = rnd() < 0.5;
        var na = ag.a + ag.di, nb = ag.b + ag.dj;
        if (!keep || na < 0 || na >= M || nb < 0 || nb >= M) {
          var opts = DIRS.filter(function (d) {
            if (d[0] === -ag.di && d[1] === -ag.dj) return false;
            var x = ag.a + d[0], y = ag.b + d[1];
            return x >= 0 && x < M && y >= 0 && y < M;
          });
          if (!opts.length) opts = [[-ag.di, -ag.dj]];
          var pick = opts[Math.floor(rnd() * opts.length)];
          ag.di = pick[0]; ag.dj = pick[1];
        }
      }
      var x = (ag.a + ag.di * ag.t) * SP + 0.5, z = (ag.b + ag.dj * ag.t) * SP + 0.5;
      x += -ag.dj * 0.22; z += ag.di * 0.22;
      var last = ag.hist[ag.hist.length - 1];
      if (!last || Math.hypot(last[0] - x, last[1] - z) > 0.18) { ag.hist.push([x, z]); if (ag.hist.length > 14) ag.hist.shift(); }
      ag.x = x; ag.z = z;
    }
    var W = 0, Hh = 0, dpr = 1, tile = 10, ox = 0, oy = 0, C = null, staticLayer = null;
    function P(x, z, y) { return [ox + (x - z) * tile / 2, oy + (x + z) * tile / 4 - (y || 0) * tile * 0.5]; }
    function poly(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]); ctx.closePath(); }
    function colors() {
      var T = tokens();
      C = {
        panel: T.sunken, street: T.bg, block: T.isLight ? mixHex(T.sunken, T.line, 0.35) : mixHex(T.sunken, T.surface, 0.55),
        top: T.isLight ? mixHex(T.surface, T.line, 0.2) : mixHex(T.surface, T.lineStrong, 0.5),
        right: T.isLight ? mixHex(T.surface, T.lineStrong, 0.28) : T.surface, left: T.isLight ? mixHex(T.surface, T.lineStrong, 0.55) : mixHex(T.surface, T.sunken, 0.55),
        edge: T.isLight ? T.lineStrong : T.line, win: T.isLight ? mixHex(T.lineStrong, T.ink, 0.25) : mixHex(T.ink, T.primary, 0.4),
        curb: T.isLight ? T.lineStrong : mixHex(T.bg, T.line, 0.7), primary: T.primary, accent: T.accent, isLight: T.isLight
      };
    }
    function buildStatic() {
      staticLayer = document.createElement('canvas');
      staticLayer.width = Math.max(1, Math.round(W * dpr)); staticLayer.height = Math.max(1, Math.round(Hh * dpr));
      var sc = staticLayer.getContext('2d');
      var real = ctx; ctx = sc;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = C.panel; ctx.fillRect(0, 0, W, Hh);
      var s, i, j;
      for (s = 0; s <= 2 * N - 2; s++) for (i = 0; i < N; i++) {
        j = s - i; if (j < 0 || j >= N) continue;
        var street = (i % SP === 0 || j % SP === 0);
        poly([P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)]);
        ctx.fillStyle = street ? C.street : C.block; ctx.fill();
        if (street) { ctx.strokeStyle = C.curb; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
      for (s = 0; s <= 2 * N - 2; s++) for (i = 0; i < N; i++) {
        j = s - i; if (j < 0 || j >= N) continue;
        var h = H[i * N + j]; if (!h) continue;
        var m = 0.14, x0 = i + m, x1 = i + 1 - m, z0 = j + m, z1 = j + 1 - m;
        ctx.lineWidth = 0.75; ctx.strokeStyle = C.edge;
        poly([P(x1, z0, h), P(x1, z1, h), P(x1, z1, 0), P(x1, z0, 0)]); ctx.fillStyle = C.right; ctx.fill(); ctx.stroke();
        poly([P(x0, z1, h), P(x1, z1, h), P(x1, z1, 0), P(x0, z1, 0)]); ctx.fillStyle = C.left; ctx.fill(); ctx.stroke();
        poly([P(x0, z0, h), P(x1, z0, h), P(x1, z1, h), P(x0, z1, h)]); ctx.fillStyle = C.top; ctx.fill(); ctx.stroke();
        if (h > 1.1 && tile > 14) {
          ctx.fillStyle = C.win;
          var rows = Math.floor((h - 0.35) / 0.34);
          for (var r = 0; r < rows; r++) {
            var y = 0.25 + r * 0.34;
            for (var c = 0; c < 2; c++) {
              var f = (c + 1) / 3;
              var hsh = Math.sin((i * 7 + j * 13 + r * 3 + c * 5) * 12.9898) * 43758.5453; hsh = hsh - Math.floor(hsh);
              if (hsh > 0.62) { var q = P(x1, z0 + (z1 - z0) * f, y); ctx.fillRect(q[0] - 1, q[1] - 1.5, 2, 2.4); }
              hsh = Math.sin((i * 3 + j * 17 + r * 7 + c * 11) * 12.9898) * 43758.5453; hsh = hsh - Math.floor(hsh);
              if (hsh > 0.62) { var q2 = P(x0 + (x1 - x0) * f, z1, y); ctx.fillRect(q2[0] - 1, q2[1] - 1.5, 2, 2.4); }
            }
          }
        }
      }
      ctx = real;
    }
    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = Math.max(1, r.width); Hh = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(Hh * dpr);
      tile = Math.min(W * (cfg.fit || 1.25) / N, Hh * 2.1 / N);
      ox = W / 2 + (cfg.shiftX || 0) * W; oy = Hh / 2 - N * tile / 4 + tile * 0.7;
      if (!C) colors();
      buildStatic();
    }
    function drawDynamic(dt, time) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, Hh);
      ctx.drawImage(staticLayer, 0, 0, W, Hh);
      var k;
      for (k = 0; k < nodeI.length; k++) {
        nodeI[k] *= Math.exp(-dt * 1.8);
        var a = k / M | 0, b = k % M, q = P(a * SP + 0.5, b * SP + 0.5, 0.02);
        ctx.fillStyle = rgba(C.primary, 0.12 + nodeI[k] * 0.85);
        ctx.beginPath(); ctx.arc(q[0], q[1], 1.2 + nodeI[k] * 2.2, 0, Math.PI * 2); ctx.fill();
      }
      function drawAgent(ag, col, size, ring) {
        if (ag.hist.length > 1) {
          for (k = 1; k < ag.hist.length; k++) {
            var a0 = P(ag.hist[k - 1][0], ag.hist[k - 1][1], 0.06), a1 = P(ag.hist[k][0], ag.hist[k][1], 0.06);
            ctx.strokeStyle = rgba(col, 0.55 * k / ag.hist.length); ctx.lineWidth = size * 0.6 * k / ag.hist.length + 0.4;
            ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
          }
        }
        var q = P(ag.x, ag.z, 0.06);
        ctx.fillStyle = rgba(col, 0.22); ctx.beginPath(); ctx.arc(q[0], q[1], size * 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(q[0], q[1], size, 0, Math.PI * 2); ctx.fill();
        if (ring) { ctx.strokeStyle = rgba(col, 0.6); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(q[0], q[1], size * 2.4 + Math.sin(time * 3) * 0.8, 0, Math.PI * 2); ctx.stroke(); }
      }
      for (k = 0; k < pulses.length; k++) { stepAgent(pulses[k], dt); drawAgent(pulses[k], C.primary, 1.6, false); }
      if (avatar) { stepAgent(avatar, dt); drawAgent(avatar, C.accent, 2.4, true); }
    }
    if ('ResizeObserver' in window) { new ResizeObserver(function () { resize(); if (REDUCED) drawDynamic(0, 0); }).observe(canvas.parentElement); }
    else window.addEventListener('resize', function () { resize(); if (REDUCED) drawDynamic(0, 0); });
    resize();
    if (REDUCED) for (var w = 0; w < 30; w++) { for (var k2 = 0; k2 < pulses.length; k2++) stepAgent(pulses[k2], 0.05); if (avatar) stepAgent(avatar, 0.05); }
    var item = Ticker.add(canvas, drawDynamic);
    onTheme(function () { colors(); buildStatic(); if (REDUCED) item.once(); });
    return item;
  }

  function ctx() {
    return { THREE: THREE, gsap: gsap, $: $, $$: $$, clamp: clamp, lerp: lerp, mulberry32: mulberry32, rgba: rgba, mixHex: mixHex,
      tokens: tokens, onTheme: onTheme, t: t, langListeners: langListeners, REDUCED: REDUCED, hasGsap: hasGsap, hasST: hasST, hasIO: hasIO,
      Ticker: Ticker, isoCity: isoCity, onceInView: onceInView, hero: hero };
  }
  initHero(ctx());

  /* ---------- AG World mini scene ---------- */
  (function () {
    var c = $('#ag-canvas');
    if (c) isoCity(c, { size: 17, seed: 7, pulses: 5, avatar: true, fit: 1.3 });
  })();

  initProjects(ctx());

  /* ---------- process timeline: pulse travels the rail (scroll scrub + idle loop) ---------- */
  (function () {
    var list = $('#steps'); if (!list) return;
    var steps = $$('.step', list), n = steps.length;
    var P = 0, target = 0, lastScrollT = -10;
    function apply(p) {
      var active = clamp(Math.floor(p), 0, n - 1);
      for (var i = 0; i < n; i++) {
        var f = clamp(p - i, 0, 1);
        steps[i].style.setProperty('--f', f.toFixed(3));
        steps[i].classList.toggle('is-done', f >= 1);
        steps[i].classList.toggle('is-active', i === active && p >= 0);
        steps[i].classList.toggle('is-live', f > 0 && f < 1);
      }
    }
    if (REDUCED) { apply(2.55); return; }
    function fromScroll() {
      var r = list.getBoundingClientRect(), vh = window.innerHeight;
      target = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.45), 0, 1) * (n + 0.4);
    }
    window.addEventListener('scroll', function () { fromScroll(); lastScrollT = performance.now() / 1000; }, { passive: true });
    fromScroll(); P = target; apply(P);
    Ticker.add(list, function (dt, now) {
      if (now - lastScrollT < 1.8) P = lerp(P, target, 1 - Math.pow(0.002, dt));
      else { P += dt * 0.7; if (P > n + 0.6) P = -0.4; }
      apply(P);
    });
  })();

  /* ---------- copy email (every [data-copy] next to its [data-email]) ---------- */
  $$('[data-copy]').forEach(function (btn) {
    var row = btn.closest('.email-row'), emailEl = $('[data-email]', row), label = $('[data-copy-label]', btn), tId = 0;
    function done() {
      label.textContent = t('contact.copied'); btn.classList.add('is-done');
      clearTimeout(tId);
      tId = setTimeout(function () { label.textContent = t('contact.copy'); btn.classList.remove('is-done'); }, 1800);
    }
    function selectFallback() {
      try {
        var range = document.createRange(); range.selectNodeContents(emailEl);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        if (document.execCommand && document.execCommand('copy')) done();
      } catch { /* unavailable: keep the default */ }
    }
    btn.addEventListener('click', function () {
      var txt = emailEl.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(selectFallback);
        else selectFallback();
      } catch { selectFallback(); }
    });
  });
