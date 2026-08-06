# Architecture

This repository is a reusable technical core for client landing pages, not a universal application framework. Server Components are the default; the form, mobile menu and reveal interaction are client components because they need browser state or APIs.

## Boundaries

The reusable core lives in `lib/`, `components/ui/`, `components/forms/` and `app/api/`. The design layer is the page composition, sections, Header/Footer visual implementation, assets, typography, tokens and design-specific animation. Keep these boundaries clear so a new Figma design can replace the visual layer without rewriting infrastructure.

`lib/site-config.ts` is the centralized site configuration. CSS variables at the top of `app/globals.css` are the intentionally obvious token location. Tailwind maps a small set of those variables to utility names.

## Contact flow

`ContactForm` owns browser interaction only: fields, client validation, loading/success/error states and the honeypot. It does not know a delivery channel. `/api/contact` requires JSON, limits the body to 16 KiB, parses JSON and applies the same strict Zod schema server-side before calling `deliverContact`. The delivery coordinator independently invokes the Telegram Bot API adapter and SMTP/Nodemailer adapter based on environment flags. No database or server-side submission storage is used. Missing credentials produce a controlled API error when an integration is explicitly enabled; no enabled channels produces a controlled `503` rather than a false success.

Delivery semantics are explicit: `200` means at least one active channel delivered successfully, including partial delivery; `503` means all channels are disabled/unconfigured; `502` means every active channel failed. Partial delivery is success because the lead reached at least one destination, so a client retry may duplicate it. The API exposes no channel failure details to the user. Honeypot submissions return `200` without delivery to avoid revealing the spam check.

The honeypot is basic zero-infrastructure protection and is not a full defense against automated abuse. Sites with noticeable abuse should add persistent rate limiting or CAPTCHA separately; this kit intentionally does not fake an in-memory rate limiter.

## SEO and performance

`lib/seo.ts` centralizes Metadata API defaults, `metadataBase`, canonical URLs, Open Graph and Twitter metadata, plus the place where client-specific JSON-LD may be added. The starter intentionally emits no business structured data with placeholder values. `app/sitemap.ts` includes only public pages; `/thank-you` is explicitly noindex and excluded. The privacy page is marked as legal template content and must be adapted before use. Use `next/image` and `next/font` for client assets/fonts where appropriate, and prioritize the actual LCP image rather than applying a blanket rule.

Analytics is disabled by default. `lib/analytics.ts` is the provider-neutral integration point; no analytics package is installed.

## Safe to replace for a new client

- Sections and page composition
- Content, design tokens, typography and images/assets
- Header/Footer visual implementation
- Design-specific animations

## Normally preserve

- Contact API architecture and server-side validation
- Delivery adapters
- SEO foundation and configuration patterns
- Reusable UI primitives and accessibility patterns

## Environment and validation

Copy `.env.example` to `.env.local`. `NEXT_PUBLIC_SITE_URL` controls canonical URLs. `CONTACT_TELEGRAM_*` configures Telegram; `CONTACT_EMAIL_*` configures SMTP; `NEXT_PUBLIC_ANALYTICS_ENABLED` is a future provider toggle. Secrets are never read by client components.

Run `pnpm lint`, `pnpm typecheck` and `pnpm build`.
