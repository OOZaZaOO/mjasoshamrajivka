# Landing Starter Kit

Production-ready reusable foundation for quickly building client landing pages with Next.js App Router, React, strict TypeScript, Tailwind CSS and pnpm. The included home page is intentionally neutral: replace its design layer with the client’s Figma direction.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Admin and Neon Postgres

The assortment admin is available at `/admin/assortment`. It uses Neon Postgres through `DATABASE_URL`; apply the SQL migrations with:

```bash
pnpm db:migrate
```

Admin access uses one password only. Generate a bcrypt hash without logging or saving the password:

```bash
pnpm admin:password-hash
```

Copy the printed hash into `ADMIN_PASSWORD_HASH` in `.env.local` and set a random `ADMIN_SESSION_SECRET` of at least 32 characters. The app stores only a signed, httpOnly session cookie. Failed sign-in attempts are temporarily rate-limited, and `/admin/*` plus admin assortment APIs require a valid session.

Because Next.js expands `$` in `.env` files, escape each bcrypt dollar sign when pasting it there (`$2b$...` becomes `\$2b\$...`).

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

The client form validates in the browser and again in `app/api/contact/route.ts`. Every valid application is delivered to Telegram through the Bot API. If `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` is missing, the API returns `503` instead of reporting success; Telegram failures return `502`. The form keeps a honeypot and has a small server-side IP rate limit.

To configure Telegram:

1. Open Telegram, find `@BotFather`, run `/newbot` and copy the bot token into `.env.local` as `TELEGRAM_BOT_TOKEN`.
2. Add the bot to the managers group and grant it permission to send messages.
3. Send a message in that group, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy the group `chat.id` into `.env.local` as `TELEGRAM_CHAT_ID` (group IDs commonly start with `-100`).
4. Restart the dev server after changing `.env.local`.

Never commit the token or chat ID. The Telegram token is used only on the server and is never sent to the browser.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/DESIGN-HANDOFF.md`](docs/DESIGN-HANDOFF.md) for the working model.
