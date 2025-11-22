<!-- .github/copilot-instructions.md -->

Purpose: Help AI coding agents become productive quickly in this repository.

1. Project overview

- Framework: Next.js (App Router) with `src/app` as the root for pages/layouts.
- Runtime: TypeScript, React 19, Next 15. Project uses `output: "standalone"` in `next.config.ts` and contains a custom `server.js` used for cPanel-style deployments.
- Auth/DB: Supabase SSR integration. There are explicit server and client factories in `src/supabase/server.ts` and `src/supabase/client.ts`.

2. Key integration points & files (refer to these when making changes)

- `src/app/layout.tsx`: global layout, loads global CSS, scripts (via `next/script`) and site chrome (Topbar, Navbar, Footer).
- `src/app/page.tsx`: main landing page (renders `InitialSpinner`).
- `src/supabase/server.ts` & `src/supabase/client.ts`: factory helpers for server/client Supabase clients. Use these rather than creating clients inline.
- `src/supabase/middleware.ts`: session middleware — contains `updateSession(request)` used by `src/middleware.ts`. This file defines `protectedRoutes` and `publicRoutes` and contains important cookie/header handling.
- `src/middleware.ts`: registers the Next middleware and `matcher` pattern; be conservative when editing the matcher or middleware logic.
- `server.js`: custom server bootstrap (used in some deployments); it expects Next to run in standalone mode.
- `package.json`: scripts: `dev` (next dev), `build` (`next build --turbopack`), `start` (`next start`). Use these for local development and deployment.

3. Conventions & patterns

- App Router: Add pages/components into `src/app` and `src/components`. Use `"use client"` at the top of files that are client components (examples: `src/components/Navbar/index.tsx`).
- Styling: Global styles in `src/scss/globals.scss`. Components use CSS modules (e.g. `header.module.scss`). The public folder contains legacy CSS/JS (`public/css`, `public/js`, `public/lib`) and is loaded from `layout.tsx`.
- Third-party scripts: Many legacy libs (jQuery, owl carousel, waypoints) are loaded via `next/script` with `strategy="beforeInteractive"`. Keep that loading order when changing scripts.
- Path alias: `@/*` resolves to `./src/*` (see `tsconfig.json`) — use it for imports.

4. Supabase & middleware gotchas (must-read before editing auth)

- Always use `createServerClient` / `createBrowserClient` from `@supabase/ssr` helpers in `src/supabase/*` to ensure cookie handling is correct.
- In `src/supabase/middleware.ts` there is an explicit warning: avoid inserting logic between `createServerClient` and `supabase.auth.getUser()` — doing so can cause intermittent logout issues.
- If you create custom responses (redirects/rewrite) inside middleware, copy Supabase headers from the original `supabaseResponse` to your new response (the existing code does this with `supabaseResponse.headers.forEach(...)`). Failing to do so breaks session behavior.

5. Development / debug workflow

- Run locally: `npm run dev` (Next dev server at http://localhost:3000).
- Build: `npm run build`. Note the repo uses `--turbopack` currently in `package.json`.
- Start (production): `npm start`. For cPanel or custom deployments see `server.js` which starts a standalone HTTP server.
- There are no automated tests in the repo. Use `next dev` and the browser console / server logs for iterative debugging.

6. File & component patterns to mirror in PRs

- Small, focused changes: update one component or one supabase helper per PR.
- When changing middleware/auth behavior, include manual test steps: unauthenticated access to `protectedRoutes`, authenticated redirect behavior on `publicRoutes`, and cookie/header preservation validation.
- Preserve ordering of legacy scripts imported in `layout.tsx` and keep `id`/`strategy` attributes consistent.

7. Helpful examples (copy/paste safe)

- Use the server client factory:
  - `import { createClient } from '@/supabase/server';` (server components / middleware)
- Middleware redirect pattern (see `src/supabase/middleware.ts`):
  - `const response = NextResponse.redirect(url); supabaseResponse.headers.forEach((v,k)=>response.headers.set(k,v)); return response;`

8. When in doubt

- Search `src/supabase` and `src/app` for how similar changes were implemented.
- Avoid touching cookie/header copying logic unless you fully test session flows.

If anything important is missing or unclear, tell me which area you'd like expanded (deployment, auth flows, component patterns, or build pipeline) and I'll iterate.
