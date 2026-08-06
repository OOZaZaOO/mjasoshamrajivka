# Design handoff workflow

Use the supplied Figma file or screenshots as the visual source of truth:

`Figma/screenshots → analyse design → identify fonts/colors/tokens → prepare assets/fonts → implement sections → implement Header/Footer → compose page → connect existing ContactForm/core → responsive implementation → visual verification → validation`

For each new client, Codex should:

1. Analyse the design and identify recurring visual patterns.
2. Set tokens in `app/globals.css` and configure typography.
3. Prepare optimized assets and fonts under `public/` or through `next/font`.
4. Implement sections in the client/design layer.
5. Rebuild Header/Footer visuals as needed.
6. Compose the page and connect the existing `ContactForm`.
7. Verify desktop, tablet and mobile layouts.
8. Check semantic HTML, keyboard focus, form errors, reduced motion, image sizing and LCP priority.
9. Run `pnpm lint`, `pnpm typecheck` and `pnpm build`.

Do not rewrite the technical core just because the design changed. Add a new primitive only when the design genuinely needs a reusable behavior not already covered by Container, Section, Button or Reveal.

The form schema is shared by client and server in `lib/contact/schema.ts`. To change fields for a client, update that schema and the small field definition/rendering in `components/forms/contact-form.tsx`; the API and delivery adapters continue to consume the normalized payload. Keep the delivery semantics documented in `docs/ARCHITECTURE.md` when changing the submission flow.
