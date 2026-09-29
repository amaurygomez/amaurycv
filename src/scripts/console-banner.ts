// Console note for people who open DevTools: brand, an invitation and a legal notice.
// Deterrence and courtesy only; the real protections are server-side (Turnstile, rate limits, CSP).

const AG = [
  "   █████╗  ██████╗ ",
  "  ██╔══██╗██╔════╝ ",
  "  ███████║██║  ███╗",
  "  ██╔══██║██║   ██║",
  "  ██║  ██║╚██████╔╝",
  "  ╚═╝  ╚═╝ ╚═════╝ ",
];

const mono = "font-family:ui-monospace,monospace;";

function banner() {
  const es = !document.documentElement.lang.startsWith("en");
  AG.forEach((line, i) =>
    console.log(`%c${line}`, `${mono}font-size:11px;line-height:1.35;color:${i < 3 ? "#1F4FE0" : "#6B8CFF"}`),
  );
  console.log(
    "%c Amaury Gómez · " + (es ? "Ingeniería de software" : "Software engineering") + " ",
    "font-size:13px;font-weight:700;letter-spacing:1px;padding:8px 12px;color:#FAFAF9;background:#0B0F19;border-left:3px solid #1F4FE0;",
  );
  console.log(
    "%c " + (es ? "/\\_/\\  ¿Curioseando? El código es abierto:" : "/\\_/\\  Curious? The code is open source:"),
    `${mono}font-size:12px;color:#6A3BD6;`,
  );
  console.log(
    "%c( o.o ) github.com/amaurygomez/amaurycv\n > ^ <  " + (es ? "¿Busca un ingeniero? " : "Hiring? ") + "hello@amaurygomez.dev",
    `${mono}font-size:12px;line-height:1.6;color:#434B5C;`,
  );
  console.log(
    "%c" + (es ? "AVISO LEGAL" : "LEGAL NOTICE"),
    "font-size:12px;font-weight:800;letter-spacing:1px;color:#B8352B;",
  );
  console.log(
    "%c" +
      (es
        ? "Este sitio es público, pero sus servicios (API, formularios e infraestructura) no lo son.\nEl acceso no autorizado, la interferencia con su funcionamiento o el uso automatizado abusivo\npueden constituir delitos según la Ley 53-07 sobre Crímenes y Delitos de Alta Tecnología\nde la República Dominicana y, según la jurisdicción, la Computer Fraud and Abuse Act\n(18 U.S.C. § 1030) de EE. UU. Los formularios aplican verificación anti-bots y límites de uso."
        : "This site is public, but its services (API, forms and infrastructure) are not.\nUnauthorized access, interference with their operation or abusive automated use\nmay be criminal offenses under Dominican Republic Law 53-07 on High Technology Crimes\nand, depending on jurisdiction, the U.S. Computer Fraud and Abuse Act (18 U.S.C. § 1030).\nForms apply bot verification and rate limits."),
    "font-size:11px;line-height:1.7;color:#5F6776;",
  );
}

try {
  banner();
} catch {
  // A console without %c styling support; the note is optional.
}
