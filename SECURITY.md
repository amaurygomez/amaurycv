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

- No secret is committed. Server credentials live only in the deployment environment and are
  declared in `astro.config.mjs` so a missing value fails the build rather than the request.
- The full CV is stored encrypted (`sealed/*.enc`, AES-256-GCM). The key exists only on the
  deployment; the ciphertext is inert without it.
- API routes are protected by Cloudflare Turnstile and Upstash rate limits, and the keepalive
  cron requires a bearer secret.
- Dependencies are updated by Dependabot and audited in CI; the `main` branch is protected and
  only changes through reviewed pull requests with green checks.
