# Meetiqo Frontend

## Stack

- **Next.js 14.2** App Router, React 18, TypeScript strict
- **Tailwind CSS** + shadcn/ui (Radix primitives)
- **@tanstack/react-query** + **axios** for data fetching
- **Zustand** (with persist) for client state: auth, notifications, AI drafts
- **react-hook-form** + **zod** for forms
- **socket.io-client** (websocket-only, lazy singleton, autoConnect: false)
- **next-themes** for dark mode (class-based)
- **sonner** for toasts, **framer-motion** for animations, **recharts** for charts

## Paths

| Alias | Target |
|-------|--------|
| `@/*` | `./src/*` |
| `@meetiqo/shared` | `../packages/shared/src` (not in repo) |

## Commands

```sh
npm run dev      # next dev
npm run build    # next build
npm run start    # next start
npm run lint     # next lint (eslint-config-next)
```

No test, typecheck, codegen, or pre-commit scripts configured.

## Route Groups

| Group | Purpose |
|-------|---------|
| `(marketing)` | Landing page, about, blog, contact, help, privacy, terms |
| `(auth)` | Login, Register (shared decorative layout) |
| `(dashboard)` | Authenticated app: admin, analytics, events, invitations, profile, settings, AI |
| `(main)` | Public event browsing (`/events/[slug]`) |

Middleware protects `/dashboard/*` — checks `token` cookie, redirects to `/login?redirect=...`.

## Auth

- JWT stored in `localStorage` (key: `token`) + cookie (set by backend on login)
- Zustand `auth-store` persisted as `meetiqo-auth` in localStorage
- `providers.tsx` AuthSync calls `GET /api/auth/me` on mount to validate token
- Axios interceptor attaches `Bearer` token from localStorage; 401 clears auth and redirects to `/login`
- Google OAuth supported (optional, via `NEXT_PUBLIC_GOOGLE_CLIENT_ID`)

## API

- Backend URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:5001`)
- Axios instance appends `/api` if missing, auto-handles auth headers and 401

## Theme

- `globals.css` defines CSS variables (slate palette) with `.dark` overrides
- Radix scroll-lock body padding fix is applied in CSS
- Custom float-keyframe animations in globals.css

## Noteworthy

- Socket singleton (`getSocket()`) uses websocket transport only, must call `.connect()` manually
- React Query: `staleTime: 60s`, retry once (except 429), `refetchOnWindowFocus: false`
- `cn()` utility (clsx + tailwind-merge) used everywhere for class merging
- `useIsMobile()` hook uses 768px breakpoint
