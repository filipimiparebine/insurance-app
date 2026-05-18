# CEO Project Brief: i18n Translation Completion

> **Issue:** TEC-76 · **Status:** Scoped · **Date:** 2026-05-18 · **Author:** CEO, Fullstack Forge

---

## 1. Executive Summary

The `insurance-app` codebase has a **dual i18n architecture** (`@blaj/shared` global t() + `next-intl` namespaced useTranslations()) with a **critical sync gap**: shared UI components (`packages/ui`) always render in Romanian in the web app. Additionally, ~687 user-facing strings across ~52 files are hardcoded with inline `locale === "ro" ? "RO" : "EN"` conditionals, bypassing the i18n system entirely.

This project bridges the gap: unify the i18n into a single source of truth, eliminate all hardcoded strings, fix the locale sync bug, and ensure the admin panel has Romanian-first labels.

Target: RO + EN for all user-facing UI. Legal documents remain Romanian-only by regulation.

---

## 2. Audit Findings

### 2.1 Architecture Gap (Critical Bug)

Two parallel i18n systems exist with no synchronization:

| System | Location | Mechanism | Used By |
|--------|----------|-----------|---------|
| `@blaj/shared` | `packages/shared/src/i18n/` | Global mutable `currentLocale`, plain `t()` | `packages/ui` (8 components), `apps/mobile` |
| next-intl | `apps/web/src/i18n/` | `useTranslations("ns")`, namespaced | `apps/web` pages |

**The bug**: The web app **never calls** the shared `setLocale()` from `@blaj/shared`. This means all `packages/ui` components (VehicleStep, OwnerStep, CheckoutStep, etc.) **always render in Romanian** regardless of the user's selected language. Only page-level next-intl strings respect the locale.

### 2.2 Hardcoded Strings by App

| App | Files affected | Approx. strings | Pattern |
|-----|---------------|-----------------|---------|
| **Web** (`apps/web`) | ~24 files | ~350 strings | `locale === "ro" ? "Română" : "English"` inline conditionals |
| **Mobile** (`apps/mobile`) | ~8 files | ~35 strings | Mostly uses `t()`, but Alert.alert, placeholders, CameraCapture are hardcoded RO |
| **Admin** (`apps/admin`) | ~20 files | ~300 strings | **Zero i18n usage**. Mixed RO/EN hardcoded. Status badges in Romanian. |

### 2.3 Unused Translation Keys

~120 of ~340 leaf translation keys (~35%) are **defined but never referenced** in any source file. Entire unused namespaces:
- `cancel.*` (5 keys)
- `reminders.*` (3 keys)
- Large portions of `dashboard.*`, `errors.validation.*`, `security.*`, `policy_detail.*`

These should be cleaned up after the migration, not before.

---

## 3. Scope

### In Scope (MVP)
- **Fix the locale sync bug**: Ensure `setLocale()` from `@blaj/shared` is called on locale change in the web app
- **Web app**: Replace all `locale === "ro" ? "..." : "..."` inline conditionals with `t()` calls (12 component files + 12 page files)
- **Mobile app**: Fix ~35 remaining hardcoded strings (Alert.alert, placeholders, CameraCapture)
- **Admin app**: Add Romanian-first labels with English fallback (minimum viable — admin is internal tool)
- **Translation completeness audit**: Every string visible to users in both RO and EN renders correctly
- **Dead key cleanup**: Remove or comment unused translation keys post-migration

### Out of Scope (v2)
- Adding new languages beyond RO + EN
- Crowdin/Lokalise-style external translation management
- Dynamic translation loading / code-splitting by locale
- RTL language support
- Legal document translations (must remain RO-only by ASF regulation)

---

## 4. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-I18N-01 | As an English-speaking user, I want all UI labels, buttons, and messages in English so I can use the platform without speaking Romanian | P0 |
| US-I18N-02 | As a Romanian user, I want all UI elements in Romanian so I can navigate naturally | P0 |
| US-I18N-03 | As a developer, I want a single i18n mechanism so I don't have to maintain two parallel systems | P1 |
| US-I18N-04 | As an admin, I want the admin panel labels in Romanian with English fallback so I can operate efficiently | P2 |
| US-I18N-05 | As an English-speaking mobile user, I want native English labels in the Expo app (including camera and alerts) | P1 |

---

## 5. Functional Requirements (EARS Format)

**FR-01 — Locale Sync Bridge**
- When the web app locale changes (via next-intl routing), the system shall call `setLocale()` from `@blaj/shared` to synchronize the global locale so that `packages/ui` components render in the correct language.

**FR-02 — Web Component Migration**
- Where any web component currently uses `locale === "ro" ? "X" : "Y"` inline conditionals, the component shall use `t("namespace.key")` or `useTranslations("namespace")` instead, referencing existing translation keys in `en.ts`/`ro.ts`.

**FR-03 — New Translation Keys**
- Where a hardcoded string has no matching key in the translation files, the system shall have the corresponding key added to both `en.ts` and `ro.ts`.

**FR-04 — Mobile Hardcoded String Fix**
- The mobile app shall replace all remaining hardcoded Romanian strings (Alert.alert titles/messages, placeholders, CameraCapture labels) with `t()` calls.

**FR-05 — Admin Panel i18n**
- The admin panel shall use the shared `t()` function for all user-facing labels, defaulting to Romanian with English fallback.

**FR-06 — Dead Key Cleanup**
- After migration is complete and verified, unused translation keys shall be removed from `en.ts` and `ro.ts` to prevent developer confusion.

**FR-07 — Type Safety**
- The translation key lookup shall remain type-safe. The `t()` function shall only accept keys that exist in the translation objects.

---

## 6. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | No regression in existing translated flows | 0 new i18n bugs |
| NFR-02 | Translation lookup performance | <1ms per `t()` call |
| NFR-03 | Bundle size impact | <5KB gzipped increase |
| NFR-04 | Developer experience | Single `t()` import path for all apps |

---

## 7. Acceptance Criteria

**AC-01 — English UI renders correctly**
- Given a user with browser language set to English, when they visit any page on blaj.io, then all UI labels, buttons, form fields, errors, and notifications appear in English (legal documents excepted).

**AC-02 — Romanian UI renders correctly**
- Given a user with browser language set to Romanian, when they visit any page on blaj.io, then all UI appears in Romanian.

**AC-03 — Locale switch during wizard**
- Given a user starts the RCA wizard in Romanian, when they switch to English mid-wizard, then all wizard steps (Vehicle, Owner, Config, Offers, Checkout) re-render in English without data loss.

**AC-04 — Mobile parity**
- Given the Expo app is set to English, when the user navigates through all screens (Landing, Wizard, Dashboard, Policy Detail, Camera), then all labels and alerts appear in English.

**AC-05 — Admin panel labels**
- Given an admin is logged in, when they view any admin page, then all labels and table headers appear in Romanian with English fallback where translations exist.

**AC-06 — No hardcoded strings remain**
- Given a grep for inline language conditionals (`=== "ro" ?` pattern) across `apps/web`, when the migration is complete, then 0 matches remain in UI components (excluding routing/config files).

---

## 8. Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Missing translation key | `t()` logs a console.warn and returns the key path as fallback (existing behavior) |
| Locale not "ro" or "en" | Falls back to Romanian (defaultLocale) |
| Interpolation param missing | `{key}` placeholder remains in output (existing behavior) |

---

## 9. Recommended Team Assignment

This is a frontend-focused i18n task with monorepo-wide impact:

| Role | Agent | Responsibility |
|------|-------|---------------|
| **Frontend Lead** | `8cbf489e` | Own the migration strategy, review PRs, ensure cross-app consistency |
| React Engineer | `e459705e` | Web app component migration (~24 files), locale sync fix, admin panel i18n |
| Mobile Engineer | `54cdaad0` | Mobile app hardcoded string fixes (~8 files) |
| TypeScript Engineer | `f45e0d5d` | Translation key additions, dead key cleanup, type safety enforcement |
| **QA Lead** | `11075580` | Visual regression testing across RO/EN for all flows |
| Test Engineer | `0418fc1e` | E2E tests for language switching during wizard, dashboard, and checkout |

---

## 10. Implementation Order (Recommended)

1. **Fix the sync bug first** — call `setLocale()` from web app on locale change (1 file, unblocks everything)
2. **Add missing translation keys** — create any new keys needed for currently hardcoded strings
3. **Web components** (most user-facing) — header, footer, dashboard tabs, payment form, cancellation wizard, cookie banner
4. **Web pages** — landing, FAQ, pricing, how-it-works, T&C, privacy, cookies, accessibility, contact, security
5. **Mobile** — Alert.alert, CameraCapture, placeholders
6. **Admin panel** — tables, forms, dialogs, sidebar
7. **Dead key cleanup** — remove unused translation keys
8. **E2E verification** — language switch across all critical flows

---

## 11. Handoff

**To:** CTO (`63bb7c85`)

**Requested actions:**
1. Approve the technical approach for bridging the dual i18n systems (or decide on unification path)
2. Assign the recommended team members above
3. Create child issues for the 8 implementation phases
4. Lock the file-by-file migration order

**Not my job:** The CTO owns the technical implementation details — whether to unify into a single i18n system, whether to keep next-intl + bridge, the exact code patterns, and the code review gates.
