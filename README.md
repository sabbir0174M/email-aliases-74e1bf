# AliasKit

A private, browser-based email alias generator. Choose Gmail, Outlook/Hotmail, Proton Mail, iCloud Mail, Fastmail, or a custom domain with plus addressing. Generate 1–50,000 aliases, browse the results, copy the entire list, or download a newline-separated `.txt` file.

Gmail offers plus tags, dot variations, and combined variations. Dot-only batches are limited by the number of available combinations. Other providers use plus tags; custom domains require provider support. This tool creates address variations, not mailboxes, provider-managed aliases, or new accounts.

## Technology

TanStack Start, React 19, TypeScript, Vite, Tailwind CSS, and Lucide icons, deployed on Netlify. Generation and exports run in the browser; email addresses and generated lists are not persisted or sent to an API.

## Local development

Use Node 22.13 or newer and pnpm:

```sh
pnpm install
netlify dev --port 8889
```

The Netlify deployment pipeline handles production builds. The application needs no database, authentication, or environment variables.

## Structure

- `src/routes/index.tsx`: generator form, paginated results, clipboard, downloads, and FAQs.
- `src/lib/aliases.ts`: platform definitions, validation, and deterministic alias generation.
- `src/styles.css`: responsive sage-and-cream workspace design.
- `src/routes/__root.tsx`: page metadata and application shell.

## Provider behavior

Personal Gmail ignores dots; Google Workspace does not. Plus tags must be supported by the existing mailbox. Some sites reject aliases, and provider behavior or administrator settings can vary. Yahoo disposable addresses require setup with Yahoo and are intentionally excluded. Existing plus tags are replaced by the generated tag; Gmail dots are normalized before generation. Tags follow `+alias00001` by default and have a customizable prefix.

## Verification

Source files were reviewed for the generation boundaries, provider matching, export flow, and responsive layout. Local build and test commands were not run; deployment validation is handled by the platform.
