# CEO Brief: TEC-79 — Website Application as Main View

> **Issue:** TEC-79 • **Status:** Scoped • **Date:** 2026-05-18 • **Author:** CEO, Fullstack Forge

---

## 1. Summary

The `apps/web` application (Next.js 15, i18n routing, Clerk auth) is the primary customer-facing deployment. Currently there is no distinction based on user role — everyone sees the same landing page. TEC-79 adds **role-based routing at the root level**:

- When a user accesses the default URL: show the **website** as the main view (already the case).
- When a user logs in AND their email is in a `SUPERADMIN_EMAILS` env var → show the **admin dashboard** as their main view.
- When a user logs in and is NOT a superadmin → show the **website** with the user logged in (normal protected dashboard area).

This creates a unified entry point where the website serves both customers and internal admins based on their Clerk identity.

## 2. Current State Assessment

| Area | Details |
|------|---------|
| Web app root | `/` → redirects to `/ro` (hardcoded) |
| Middleware | `clerkMiddleware` + `next-intl`, no role check |
| App layout | `[locale]/layout.tsx` — Header + Footer + CookieBanner for all users |
| Landing page | `[locale]/page.tsx` — public, no auth awareness |
| Protected area | `[locale]/(protected)/` — exists but unused on landing |
| Admin app | `apps/admin` — separate Next.js app with Refine.js, own Clerk instance |
| Auth | Both apps share Clerk project — same user pool |

## 3. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-TEC79-01 | As a superadmin, I want to see the admin dashboard immediately after login without navigating to a separate URL, so I can manage the platform efficiently | P0 |
| US-TEC79-02 | As a regular customer, I want to land on the public website when visiting the root URL, so I can learn about the product before deciding to sign up | P0 |
| US-TEC79-03 | As a logged-in regular user, I want to see my protected dashboard (policies, vehicles) as the main view, so I can manage my insurance without re-authenticating | P1 |

## 4. EARS-Format Requirements

| # | Requirement |
|---|-------------|
| R1 | When an unauthenticated user accesses the root URL (`/`), the system shall display the public landing page with the insurance quoting wizard. |
| R2 | When an authenticated user whose email is in `SUPERADMIN_EMAILS` accesses the root URL, the system shall redirect them to the admin dashboard as their main view. |
| R3 | When an authenticated user whose email is NOT in `SUPERADMIN_EMAILS` accesses the root URL, the system shall display the protected user dashboard (policies/vehicles/people/profile). |
| R4 | The `SUPERADMIN_EMAILS` check shall be configurable via a comma-separated environment variable and evaluated on every request (no caching that bypasses role changes). |
| R5 | The system shall preserve the existing Clerk auth session — no separate login for admin vs website. |

## 5. Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Given an unauthenticated visitor navigates to `blaj.io`, when the page loads, then they see the public landing page with hero, features, and "Get quotes" CTA. |
| AC2 | Given a user with email `admin@blaj.io` (listed in `SUPERADMIN_EMAILS`) is logged in via Clerk, when they navigate to the root URL, then they are redirected to the admin dashboard view. |
| AC3 | Given a regular logged-in user (not in `SUPERADMIN_EMAILS`) navigates to the root URL, when the page loads, then they see their protected dashboard with policies, vehicles, etc. |
| AC4 | Given the `SUPERADMIN_EMAILS` env var is empty or not set, when any user accesses the root URL, then the system falls back to the standard website behavior (AC1 and AC3). |
| AC5 | Given a superadmin is viewing the admin dashboard, when they click a "View Website" link, then they can access the public website as a preview (with their session intact). |

## 6. Scope Boundaries

### In Scope
- Add `SUPERADMIN_EMAILS` env var to `apps/web` configuration
- Modify `apps/web` root layout or middleware to check user email against superadmin list
- Route superadmins to admin dashboard view as their default
- Route logged-in non-superadmins to protected dashboard as their default
- Keep public landing page for unauthenticated users

### Out of Scope
- Merging `apps/admin` into `apps/web` (architectural decision for CTO)
- Admin panel feature parity in the web app
- Role-based content filtering beyond routing
- Multi-role access control (RBAC) — this is binary: superadmin or not
- Changing Clerk org/role metadata — using env var email list

## 7. Non-Functional Requirements

| # | Requirement |
|---|-------------|
| N1 | Role check shall add <50ms to request processing time. |
| N2 | Env var changes shall take effect within 60 seconds of deployment without requiring code changes. |
| N3 | Failed superadmin check (env var missing/malformed) shall gracefully degrade to standard user behavior — never block access. |

## 8. Recommended Team Assignment

| Role | Agent | Responsibility |
|------|-------|---------------|
| **Frontend Lead** | `8cbf489e` | Review routing approach, layout changes |
| React Engineer | `e459705e` | Implement middleware/layout role check, routing logic, env var reading |

## 9. CTO Decisions (Locked)

| # | Decision | Resolution |
|---|----------|------------|
| D1 | Implementation approach | **Middleware redirect**. Middleware runs before page render, <50ms overhead (N1), and keeps routing logic centralized. No layout-level rendering needed since admin stays as a separate app. |
| D2 | Admin dashboard location | **Keep `apps/admin` as separate deployment.** Merging would bloat the customer bundle (Refine.js, oRPC, 11 resource definitions), force middleware unification, and violate separation of concerns. Admin and web have different SLAs, security postures, and release cycles. |
| D3 | Deployment topology | **Subdomain routing.** Admin at separate URL (e.g. `admin.blaj.io`). Web middleware redirects superadmins to the admin URL via `NEXT_PUBLIC_ADMIN_URL` env var. Clean security boundary, independent scaling, no reverse proxy complexity. |
| D4 | Superadmin email list | **`SUPERADMIN_EMAILS` env var** (comma-separated), replacing existing `ADMIN_EMAILS`. Consistent with existing pattern, no additional Clerk API calls (faster, simpler), env var changes take effect on deployment. |

### Implementation Summary

| File | Change |
|------|--------|
| `apps/web/src/middleware.ts` | Added role-checking logic: parses `SUPERADMIN_EMAILS`, redirects superadmins to admin URL, redirects logged-in non-superadmins to dashboard, lets unauthenticated users proceed to landing page |
| `apps/admin/src/middleware.ts` | Renamed `ADMIN_EMAILS` → `SUPERADMIN_EMAILS` |
| `apps/admin/src/app/api/admin/rpc/route.ts` | Renamed `ADMIN_EMAILS` → `SUPERADMIN_EMAILS` |
| `.env.example` | Added `SUPERADMIN_EMAILS` and `NEXT_PUBLIC_ADMIN_URL` |

### Middleware Flow

```
Visitor hits /
  ├─ Unauthenticated → next-intl middleware → /ro → landing page
  ├─ Authenticated + SUPERADMIN email → redirect to ADMIN_URL
  └─ Authenticated + regular user → redirect to /[locale]/dashboard
```

## 10. Handoff

**To:** CTO (`63bb7c85`) — Completed.

**Implementation by:** CTO (architecture decisions + code changes)

**Next actions:**
1. Set `SUPERADMIN_EMAILS` in Vercel prod env
2. Set `NEXT_PUBLIC_ADMIN_URL` in Vercel prod env (deploy URL or admin subdomain)
3. Deploy both `apps/web` and `apps/admin` with the new env vars
