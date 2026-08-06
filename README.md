# Landing Starter Kit

Production-ready reusable foundation for quickly building client landing pages with Next.js App Router, React, strict TypeScript, Tailwind CSS and pnpm. The included home page is intentionally neutral: replace its design layer with the client’s Figma direction.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
pnpm lint       # ESLint
pnpm typecheck  # TypeScript
pnpm build      # production build
pnpm start      # serve production build
```

## Configure a client

1. Update the single source of truth in `lib/site-config.ts`.
2. Replace CSS variables in `app/globals.css` for colors, spacing, radius and container width; add the client font strategy there or in `app/layout.tsx`.
3. Prepare assets under `public/` and use `next/image` for content images, giving the LCP image priority when appropriate.
4. Replace `app/page.tsx`, `components/layout/` and `components/sections/` with the client composition while preserving the core form and API.
5. Connect `ContactForm` with `successMode="inline"` or `successMode="redirect"`.
6. Run the validation commands and visually check mobile, tablet and desktop.

## Contact delivery

The client form validates in the browser and again in `app/api/contact/route.ts`. Delivery is independent of the form: Telegram Bot API and SMTP email adapters can each be enabled with `.env.local`. A request returns `200` when at least one enabled channel delivers successfully, including partial delivery when another active channel fails. If all channels are disabled, the API returns `503`; if all active channels fail, it returns `502`. Partial delivery is still success because the lead reached at least one destination; retries can duplicate it. Honeypot submissions are silently accepted with `200` and are not delivered. The honeypot is only basic zero-infrastructure spam protection, not a complete automated-abuse defense. Add persistent rate limiting or CAPTCHA separately for higher-risk sites.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/DESIGN-HANDOFF.md`](docs/DESIGN-HANDOFF.md) for the working model.
