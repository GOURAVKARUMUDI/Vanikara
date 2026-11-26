# VANIKARA V2 — System Architecture

## 1. Architectural Pattern
Vanikara V2 is implemented as a **modular monolith** on Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, and Supabase PostgreSQL. This architecture avoids premature microservice overhead while enforcing strict separation of concerns across public presentation, customer account self-service, internal administrative operations, and data persistence.

## 2. Layer Breakdown

### 2.1 Perimeter & Routing (`src/proxy.ts`)
Next.js 16 `proxy.ts` enforces pre-route authorization before handlers execute:
- `/admin/*` & `/api/admin/*`: Requires valid HMAC-SHA256 signed `vk_admin` cookie.
- `/account/*`: Requires valid HMAC-SHA256 signed `vk_user` cookie (isolated from admin sessions).
- `/admin/login` & `/login`: Redirects already-authenticated admins to `/admin`.
- `/account/login`: Redirects already-authenticated users to `/account`.
- `/dashboard/*`: Retired legacy path redirecting to `/admin`.

### 2.2 Design Foundation ("Vanikara Premium Enterprise")
- **Typography**: `Manrope` (display headings), `Inter` (body and console UI), `IBM Plex Mono` (technical metadata, CIN, status codes) via `next/font/google`.
- **Theme System**: Zero-FOUC inline `<script>` synchronizing `<meta name="color-scheme">` and `[data-theme]` across light (`#FFFFFF` / `#F5F5F7` / `#0F62FE`), dark (`#101C30` / `#152238` / `#78A9FF`), and system preference, with cross-tab `storage` sync.
- **Motion**: Removed continuous WebGL Liquid Silk canvas and dayparting color overrides. Replaced with 150–300ms CSS transitions, progressive `IntersectionObserver` reveals, and native `<details>`/`::details-content` accordions respecting `prefers-reduced-motion`.

### 2.3 Public Website & Dynamic CMS
- Content defaults live in `src/content/defaults.ts` and are overridden by `site_content` rows in Supabase.
- Cached via `unstable_cache` under tag `site-content` (10-minute safety TTL) and instantly invalidated via `revalidateTag` + `revalidatePath` upon saving in Website Studio.

### 2.4 Public Account Portal (`/account/*`)
Completely decoupled from staff authentication. Authenticated Google users view ONLY their own submitted applications, enquiries, and DPDP privacy requests scoped strictly by verified session email, with server-side block verification (`users.blocked`).

### 2.5 Vanikara Console (`/admin`)
Dedicated IBM-inspired enterprise application shell (public navbar and footer suppressed via `PublicChrome`) featuring collapsible sidebar, breadcrumbs, and 9 operational modules: Command Centre, Website Studio, CRM & Enquiries, Recruitment & Jobs, Products & Interest, User Management, Security & Audit, Privacy Centre, and System Health.
