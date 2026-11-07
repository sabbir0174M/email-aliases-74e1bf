# AliasKit development guide

AliasKit is a single-screen email alias generator built with TanStack Start, React 19, TypeScript, Vite, and Tailwind CSS. Netlify handles deployment. The product is complete without a backend: generation, clipboard writes, and Blob downloads are browser-only, and results exist only in transient React state.

## Architecture

- `src/routes/index.tsx`: `/` route, controlled inputs, generation and export interactions, pagination (100 rows per page), FAQs, error and success feedback.
- `src/lib/aliases.ts`: provider catalog, validation, and pure alias generator. Keep provider-specific behavior here.
- `src/styles.css`: Tailwind theme plus AliasKit-specific responsive styling and reduced-motion support.
- `src/routes/__root.tsx`: HTML shell, metadata, tooltip and toast providers.
- `src/components/ui`: reusable template components retained for future work.
- `netlify.toml` and `vite.config.ts`: deployment and framework configuration.

## Conventions and decisions

Use TypeScript and React state. Keep browser APIs in event handlers to preserve server rendering. Do not persist email addresses or generated lists. If persistence is explicitly requested later, use Netlify storage primitives and revise the privacy copy.

Plus-address batches contain 1–50,000 unique deterministic tags. Gmail dot mode uses nonzero insertion masks and validates the available combination count. Only personal Gmail supports dots here; custom domains use plus addressing. Do not claim these variations create new mailboxes, hide the base address, or support sending as aliases. Yahoo managed disposable addresses are excluded because generation alone does not activate them.

Results must remain paginated rather than mounting 50,000 DOM nodes. Copy and download always use the complete batch. Input changes clear stale results. Keep clipboard failure messaging with the download fallback and use accessible labels and visible focus states. Match the existing sage palette, restrained typography, and responsive single-column mobile layout.

The router generates `src/routeTree.gen.ts`; do not edit generated route files. Follow the current environment's validation instructions; the deployment pipeline performs build validation.
