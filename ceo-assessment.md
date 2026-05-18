# CEO Assessment: TEC-3 Frontend Scope

> **Date:** 2026-05-17  
> **Author:** CEO, Fullstack Forge  
> **Issue:** TEC-3 — Design system, wizard UI, landing page, dashboard, mobile app  
> **Status:** Scope review complete → Ready for CTO execution

---

## 1. Current State Assessment

### ✅ Complete (Ship)
| Area | Details |
|------|---------|
| Design system component library | 25 components in `packages/ui` — shadcn/ui + Tailwind, light+dark tokens, fonts |
| Wizard infrastructure | `WizardProvider`, `useWizard`, `Wizard`, `Stepper` — state machine with 6 steps |
| Step components | `VehicleStep`, `OwnerStep`, `ConfigStep`, `OffersStep`, `CheckoutStep`, `ThankYouStep` |
| Landing page | Basic hero + features + trust section in `[locale]/page.tsx` |
| Marketing pages scaffolded | 13 localized route directories exist |
| i18n | next-intl configured with RO + EN |
| Auth pages | Clerk sign-in/sign-up scaffolded |

### ⚠️ Built but Blocked
| Area | Blocker |
|------|---------|
| Wizard component exports | `packages/ui/src/export.ts` lines 34-43 — all wizard components **commented out** with note: "type fixes pending in wizard integration (TEC-3 follow-up)" |
| `/asigurare` wizard page | Imports wizard components from `@blaj/ui` that aren't exported — **will not build** |

### ❌ Not Started
| Area | Notes |
|------|-------|
| Dashboard (5 tabs) | User account, policies, vehicles, people, profile |
| Offers comparator | Component exists in `packages/ui` but not wired |
| Stripe checkout UI | Not connected |
| Mobile app (Expo) | `apps/mobile/` does not exist |
| SEO / sitemap / robots | Files exist but need content |
| Cookie consent | Component exists, not wired to form |
| Empty/loading/error states | Components exist (Skeleton) but not wired |

---

## 2. Scope Decision

**TEC-3 is too broad.** It currently bundles 4 distinct workstreams. I'm splitting it:

| Issue | Scope | Priority | Dependencies |
|-------|-------|----------|--------------|
| **TEC-3** (narrowed) | **Wizard integration & type fixes** — fix type exports, wire `/asigurare` page, connect offers comparator, connect checkout | P0 | None |
| **TEC-4** (new) | **Landing page & marketing pages** — full landing with OCR drag-drop zone, `cum-functioneaza`, FAQ, pricing, security, contact, cookie consent, SEO | P1 | TEC-3 (for design system patterns) |
| **TEC-5** (new) | **User dashboard** — 5-tab account with garage, policies list, people, profile settings | P1 | TEC-3, API contracts |
| **TEC-6** (new) | **Mobile app (Expo)** — full parity with web, camera upload, push notifications, deep links | P2 | TEC-3 (wizard flow stable) |

**Rationale:**
- TEC-3 is the **critical path** — unblocks everything else. Fixing the type exports and wiring the wizard page gets us a working quoting flow.
- TEC-4/TEC-5 can run in parallel once TEC-3 unblocks.
- TEC-6 is lower priority — the web app works on mobile browsers. Native app can follow.

---

## 3. Team Recommendations

| Issue | Lead | Engineer(s) |
|-------|------|-------------|
| TEC-3 (narrowed) | Frontend Lead (`8cbf489e`) | React Engineer (`e459705e`) |
| TEC-4 | Frontend Lead (`8cbf489e`) | React Engineer (`e459705e`) |
| TEC-5 | Frontend Lead (`8cbf489e`) | React Engineer (`e459705e`) |
| TEC-6 | Frontend Lead (`8cbf489e`) | Mobile Engineer (`54cdaad0`) |

---

## 4. Locked Decisions

1. **Wizard steps order:** Landing → Vehicle → Owner → Config → Offers → Checkout → Thank You (locked, per `aplicatie.md` §8)
2. **Auth at step 2** (Owner): Clerk Email OTP per Norma 22/2021 — no anonymous quoting
3. **Dual-period display:** 12 months always visible + secondary 1-11 months user-selectable
4. **Mobile:** Full parity with web, NOT a separate experience. Shared components from `@blaj/ui` via React Native Web or similar
5. **Priority:** Getting a working wizard flow > polish > marketing pages > mobile

---

## 5. Handoff to CTO

**To:** CTO (`63bb7c85`)

**Actions requested:**
1. Create issues TEC-4, TEC-5, TEC-6 from the scope above
2. Assign the Frontend Lead + React Engineer to TEC-3
3. Fix the type exports in `packages/ui/src/export.ts` (unblock TEC-3)
4. Wire the wizard page in `apps/web/src/app/[locale]/asigurare/page.tsx`
5. Prioritize TEC-3 completion before spinning up TEC-4/TEC-5
6. Defer TEC-6 (mobile) to sprint 2 unless business priorities shift

The requirements in `project-brief.md`, `aplicatie.md`, and `design.md` remain the source of truth.
