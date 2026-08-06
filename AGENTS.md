# PURPOSE

Reusable technical foundation for client landing pages.

# REPOSITORY MAP

- Technical core: `lib/`, `components/ui/`, `components/forms/`, `app/api/`
- Client/design layer: `app/page.tsx`, `components/layout/`, `components/sections/`, `app/globals.css`
- Configuration: `lib/site-config.ts`, CSS variables in `app/globals.css`
- Integrations: `lib/contact/`, `lib/analytics.ts`
- Documentation: `docs/`

# RULES

- Preserve reusable technical infrastructure.
- Prefer existing primitives before creating new ones.
- Do not introduce database, CMS, authentication, CRM, ecommerce or backend services unless explicitly requested.
- Do not add dependencies without concrete benefit.
- Keep client-specific UI mainly in the client/design layer.
- Treat supplied Figma/screenshots as the visual source of truth for client-specific UI.
- Preserve responsive behavior, accessibility and performance.
- Read `docs/ARCHITECTURE.md` for architectural context and `docs/DESIGN-HANDOFF.md` for a new client design.

# VALIDATION

```bash
pnpm lint
pnpm typecheck
pnpm build
```
