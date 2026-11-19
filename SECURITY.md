# Security policy

## Reporting a vulnerability

Please do not open a public issue for security problems. Email **hello@amaurygomez.dev** with a
description of the issue, the steps to reproduce it and, if possible, the affected URL or file.
You will receive an acknowledgement within 72 hours and a fix or mitigation plan within 14 days
for confirmed issues.

## Scope

- The site at https://amaurygomez.dev and its API routes under `/api/*`.
- This repository's build, dependencies and deployment configuration.

Out of scope: third-party services the site talks to (Vercel, Cloudflare Turnstile, Upstash,
Resend); report those to their own programs.

## How secrets are handled

- Server credentials are declared in `astro.config.mjs` and read from the deployment environment.
  The site can build without them. Forms return `503` if a required service is unavailable.
- The full CV is stored encrypted (`sealed/*.enc`, AES-256-GCM). The key exists only on the
  deployment; the ciphertext is inert without it.
- The contact and CV request routes validate same-origin browser submissions, accept up to 16 KiB
  of JSON, and verify the exact hostname and form action with Cloudflare Turnstile. The actions
  are `contact` and `cv-request`. Both routes require a decision from Upstash before sending mail.
  The keepalive cron requires a bearer secret. API responses use `Cache-Control: no-store`.
- Allow the production and any preview hostnames used in Cloudflare Turnstile. The API accepts the
  configured Astro site, its `www` name, and exact Vercel deployment names from system variables.
- Dependencies are updated monthly by Dependabot (grouped, with a 7-day release cooldown) and
  audited in CI. Minor, patch and security updates merge on their own once CI is green; major
  upgrades wait for a manual review.

## Automated access to public pages

The public pages, redacted PDF downloads and source repository can be read and copied by visitors
and tools such as Craft Anything. `robots.txt` asks supported model-training crawlers to skip the
site. Vercel's firewall can apply traffic rules at the edge before requests reach the site.
Keep sensitive material outside public pages, downloads, browser bundles and the Git history.
