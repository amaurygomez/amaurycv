import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = join(root, ".vercel", "output");
const staticDir = join(output, "static");
const outputConfig = join(output, "config.json");
const reportHeader = "content-security-policy-report-only";

const project = JSON.parse(await readFile(join(root, "vercel.json"), "utf8"));
const enforced = project.headers
  .flatMap(({ headers }) => headers)
  .find(({ key }) => key.toLowerCase() === "content-security-policy")?.value;
if (!enforced) throw new Error("No enforced CSP found in vercel.json");

const config = JSON.parse(await readFile(outputConfig, "utf8"));
const notFound = config.routes.find(({ dest, status }) => dest === "/404.html" && status === 404);
if (!notFound) throw new Error("Vercel build output has no 404 fallback route");

const pages = (await readdir(staticDir, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => join(entry.parentPath, entry.name).slice(staticDir.length + 1))
  .sort();
if (!pages.includes("index.html") || !pages.includes("404.html")) {
  throw new Error("Vercel build output is missing an HTML entry point or 404 document");
}

const pageHeaders = await Promise.all(
  pages.map(async (file) => {
    const html = await readFile(join(staticDir, file), "utf8");
    const policy = reportOnlyPolicy(enforced, scriptHashes(parse(html)));
    return { file, headers: { [reportHeader]: policy } };
  }),
);

notFound.headers = {
  ...notFound.headers,
  ...pageHeaders.find(({ file }) => file === "404.html").headers,
};
const existingRoutes = config.routes.filter(
  (route) => !(route.continue && route.headers?.[reportHeader]),
);
config.routes = [
  ...pageHeaders.map(({ file, headers }) => ({ src: routePattern(file), headers, continue: true })),
  ...existingRoutes,
];
await writeFile(outputConfig, `${JSON.stringify(config, null, 2)}\n`);

function scriptHashes(document) {
  const hashes = new Set();
  function visit(node) {
    if (node.tagName === "script" && !node.attrs.some(({ name }) => name === "src")) {
      const text = node.childNodes.map(({ value }) => value).join("");
      if (text) hashes.add(`'sha256-${createHash("sha256").update(text).digest("base64")}'`);
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(document);
  return [...hashes];
}

function reportOnlyPolicy(policy, hashes) {
  const directives = new Map(
    policy
      .split(";")
      .map((directive) => directive.trim())
      .filter(Boolean)
      .map((directive) => {
        const [name, ...sources] = directive.split(/\s+/);
        return [name, sources];
      }),
  );
  const scripts = directives.get("script-src");
  if (!scripts) throw new Error("The enforced CSP has no script-src directive");
  directives.set("script-src", [
    ...scripts.filter((source) => source !== "'unsafe-inline'"),
    ...hashes,
  ]);
  directives.set("script-src-attr", ["'none'"]);
  // The browser ignores this directive in a report-only policy. It stays in the enforced policy.
  directives.delete("upgrade-insecure-requests");
  return [...directives].map(([name, sources]) => [name, ...sources].join(" ")).join("; ") + ";";
}

function routePattern(file) {
  const html = `/${file.split(sep).join("/")}`;
  const clean = html.replace(/\.html$/, "");
  const path = clean.replace(/\/index$/, "");
  const aliases = new Set([html, clean, path || "/", `${path}/`]);
  const patterns = [...aliases].map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return `^(?:${patterns.join("|")})$`;
}
