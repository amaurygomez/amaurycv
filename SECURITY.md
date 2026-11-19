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
- The full CV is stored encrypted (`sealed/*.enc`, AES-256-GCM). Keep its key in a private
  secret store for sealing. The active request flow sends a notice to the owner for manual review.
- The contact and CV request routes validate same-origin browser submissions, accept up to 16 KiB
  of JSON, and verify the exact hostname and form action with Cloudflare Turnstile. The actions
  are `contact` and `cv-request`. Both routes require a decision from Upstash before sending mail.
  The keepalive cron requires a bearer secret. API responses use `Cache-Control: no-store`.
- Allow the production and any preview hostnames used in Cloudflare Turnstile. The API accepts the
  configured Astro site, its `www` name, and exact Vercel deployment names from system variables.
- Dependabot groups monthly npm updates with a 7-day release cooldown. CI audits production and
  development dependencies. Eligible npm minor, patch and security updates can merge after CI.
  Review major npm upgrades and GitHub Actions updates manually.

## Deployment checks and recovery

1. Set `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for each Vercel environment that
   serves forms. Authorize its exact hostnames in Cloudflare Turnstile. Use separate widget
   credentials for non-production environments.
2. Configure `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM`,
   and `CONTACT_TO`. Verify the sender domain with Resend. Use a separate Redis database and
   controlled recipient in Preview to keep testing out of production quotas and mailboxes.
3. Set `CRON_SECRET` in Production and check the scheduled `/api/cron/keepalive` run in Vercel.
   Review Vercel, Turnstile, Upstash, and Resend health if the forms report `503` or mail fails.
   Redeploy the affected environment after changing environment variables.
4. After deployment, confirm the intended commit is active and submit each form once from the
   browser with a clearly marked test message. Verify delivery to the configured inbox and verify
   that the full CV request starts manual review.
5. If a release breaks the forms, restore the most recent working Vercel deployment that includes
   the form security fixes. If a firewall change caused the problem, revert that rule in Vercel.
   Recheck both forms and the cron after recovery. Restrict obsolete deployments that predate
   manual review of full CV requests.

## Automated access to public pages

The public pages, redacted PDF downloads and source repository can be read and copied by visitors
and tools such as Craft Anything. `robots.txt` asks supported model-training crawlers to skip the
site. Vercel's firewall can apply traffic rules at the edge before requests reach the site.
Keep sensitive material outside public pages, downloads, browser bundles and the Git history.
