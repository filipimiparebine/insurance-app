# CEO Project Brief: blaj.io — Insurtech Platform

> **Issue:** TEC-1 • **Status:** Planning • **Reference Spec:** `aplicatie.md` (33 sections, 3878+ lines)
> **Date:** 2026-05-17 • **Author:** CEO, Fullstack Forge

---

## 1. Executive Summary

**blaj.io** is a Romanian digital insurance broker that lets consumers and businesses compare RCA (mandatory car insurance) quotes from 9 insurers instantly, purchase a policy in under 3 minutes with Stripe 1-click payment, and receive the policy PDF via email. The platform differentiates on OCR auto-fill (talon + CI via Google Document AI), medical-grade encryption (GCP KMS + envelope encryption), and a dual-period price comparator (always comparing 12 months vs a user-chosen secondary period).

**Target market:** Romania. B2C direct. Regulated by ASF (broker authorization RBK-XXX).

---

## 2. MVP Scope (v1)

### In Scope
- **RCA only** — one insurance type, with all edge cases:
  - Individual (PF) + Company (PJ) owners
  - 3 vehicle states: registered / pending registration / mayor-registered
  - Leasing support (searchable dropdown with top 25 leasing companies)
  - Up to 5 drivers per policy, CNP-unique validation
  - Direct settlement toggle (global, opt-in)
  - 4-step wizard: Landing → Vehicle → Owner+Driver → Config → Offers → Checkout
- **OCR-first data entry:** Drag-and-drop talon + CI on landing, auto-categorization, VIN-lookup fallback
- **Payment:** Stripe Elements with Apple Pay, Google Pay, Stripe Link, and card form
- **User account:** 5-tab dashboard (Home, Policies, Vehicles, People, Profile) with garage
- **Cancellations:** Self-service ≤14-day withdrawal (auto-refund); wizard with manual review for other cases
- **Reminders:** 60d email, 30d email, 7d SMS (opt-in defaults ON)
- **Languages:** RO + EN UI; legal docs in RO only
- **Mobile:** Full parity Expo app (iOS + Android)
- **Public API:** oRPC + OpenAPI for WhatsApp bot integration (v2)
- **Admin:** Refine.dev panel, email-allowlist gated
- **Security:** Tier-1 envelope encryption (CNP, CUI, IBAN, CI), Tier-2 pgcrypto, Tier-3 plaintext, RLS, append-only audit log
- **Hosting:** 100% EU (Frankfurt) for GDPR compliance

### Out of Scope (v2+)
- Modifying policies self-service (email support only in v1)
- BAAR high-risk — redirect to baar.ro, no automatic issuance
- WhatsApp bot (API prepared, bot in v2)
- Bulk CSV upload for PJ fleets (quick-add in v1, bulk in v2)
- Anonymous calculator (sign-up required)
- Installment payments (TBI Bank — v2)
- CASCO, Home, Health, Travel, Life insurance types (schema prepared, UI in v2+)
- Server-side Conversions API (pixel hardcoded in v1)
- ISO 27001 audit (planned month 6-12)

---

## 3. User Stories (High-Level)

| ID | Story | Priority |
|----|-------|----------|
| US-01 | As a car owner, I want to get an RCA quote by entering my VIN or license plate, so I don't have to manually type vehicle specs | P0 |
| US-02 | As a busy user, I want to drag-and-drop my talon and ID card to auto-fill all fields, so I can get quotes in seconds | P0 |
| US-03 | As a consumer, I want to see prices from all 9 insurers side-by-side for 2 time periods simultaneously, so I can pick the best value | P0 |
| US-04 | As a mobile user, I want to pay with Apple Pay or Google Pay in one tap | P0 |
| US-05 | As a policyholder, I want to receive my policy PDF by email instantly after payment | P0 |
| US-06 | As a company fleet manager, I want to manage multiple vehicles in a garage and issue RCA for each, so I don't retype owner data | P1 |
| US-07 | As a leasing customer, I want to select my leasing company from a list and issue RCA with them as beneficiary | P1 |
| US-08 | As a buyer of an unregistered vehicle, I want to get RCA based on VIN only with supporting documents | P1 |
| US-09 | As a returning customer, I want my vehicle and personal data saved so renewal is 1-click | P1 |
| US-10 | As a policyholder, I want to cancel my policy within 14 days and get a full refund automatically | P1 |
| US-11 | As a policyholder, I want email reminders 60/30 days before expiry and an SMS at 7 days | P2 |
| US-12 | As an admin, I want to review cancellation requests, manage insurers, and view the audit log | P2 |
| US-13 | As an integrator, I want to query quotes and issue policies via a public API | P2 |
| US-14 | As an expat, I want the UI in English (legal documents remain in Romanian as required by law) | P2 |

---

## 4. Acceptance Criteria Summary

See `aplicatie.md` Annex B for 120+ Given/When/Then criteria covering:
- B.1: Landing drag-and-drop OCR (10 criteria)
- B.2: Vehicle form (7 criteria)
- B.3: Owner form + Email OTP (10 criteria)
- B.4: Policy configuration (5 criteria)
- B.5: Offers display (10 criteria)
- B.6: Checkout (7 criteria)
- B.7: Thank-you / policy issuance hybrid sync+async (4 criteria)
- B.8: User account (5 criteria)
- B.9: Policy cancellation (4 criteria)
- B.10: Reminders (5 criteria)
- B.11: Cookie banner + GDPR (5 criteria)
- B.12: Public API (4 criteria)

---

## 5. Recommended Team Assignment

Based on Fullstack Forge org structure, the following departments and specialists are assigned:

### Core Web & Mobile Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| **Frontend Lead** | `8cbf489e` | Overall frontend direction, shadcn/ui + Tailwind design system, cross-platform coordination |
| React Engineer | `e459705e` | Next.js 15 App Router, form wizards (RHF + Zod), Stepper UI, landing page |
| Mobile Engineer | `54cdaad0` | Expo app with full parity, native camera upload, push notifications, deep links |

### Language & API Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| **Language Engineering Lead** | `7e812866` | TypeScript type safety, shared code across monorepo, cross-language integration |
| TypeScript Engineer | `f45e0d5d` | oRPC contracts + handlers, Zod schemas, RO validators (CNP, CUI, VIN, IBAN), ORP client |

### Backend & Data Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| **Backend Lead** | `87bcea0e` | Backend architecture, Stripe integration, email/SMS services, webhook orchestration |
| Node Backend Engineer | `4176de73` | NestJS/oRPC pattern, Stripe webhook handling, payment intent lifecycle, DB queries |

### Infrastructure & Database Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| **Infrastructure Lead** | `47db5140` | Infrastructure strategy, hosting decisions, backup/DR, environment configuration |
| Database Engineer | `12f828bb` | Neon Postgres schema, Drizzle ORM, migrations, RLS policies, PITR, performance tuning |
| Cloud Engineer | `6a3f8e88` | Vercel + Hetzner S3 + GCP KMS multi-region setup, EU region compliance |

### Security Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| **Security Lead** | `08308ec8` | Security architecture review, threat model, encryption tier design, penetration test prep |
| Security Engineer | `00ade255` | Envelope encryption implementation, KMS integration, audit log triggers, RLS policies |

### Architecture & Integration Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| **Architecture Lead** | `fc271d50` | Adapter pattern for insurers, monorepo structure, API design, public API + OpenAPI |
| API Engineer | `9e6c8411` | Insurer adapter implementations (mock → real), OpenAPI spec generation, rate limiting |
| Distributed Systems Engineer | `bc322daa` | Async policy emission, webhook orchestration, Redis caching, quote aggregation |

### Data & ML Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| AI Engineer | `ae44f5a8` | Google Document AI integration, OCR classification, field extraction, confidence thresholds |

### DevOps & Quality Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| **DevOps Lead** | `a98f6601` | CI/CD pipeline, GitHub Actions, Vercel deployment, EAS build/submit, environment management |
| DevOps Engineer | `2e1158fc` | Dockerfile for Uptime Kuma, CI workflows, Neon branching automation, schema drift checks |
| SRE Engineer | `f396077a` | PostHog + Sentry + Axiom observability, monitoring dashboards, incident response, runbook |
| **QA Lead** | `11075580` | Test strategy, QA coordination, cross-team quality reports |
| Test Engineer | `0418fc1e` | Vitest unit/integration tests, Playwright E2E on critical paths, Lighthouse CI |

### Admin & Platform Team
| Role | Agent | Responsibility |
|------|-------|----------------|
| React Engineer | `e459705e` (shared) | Refine.dev admin panel, data provider, PII decrypt workflow |
| Atlassian Engineer | `65e73417` | Jira project setup, Confluence documentation, sprint management |

### Not Assigned for v1
- Python Engineer, Go Engineer, Rust Engineer, Systems Language Engineer, JVM Engineer, Web Language Engineer — not needed for this TypeScript stack
- Vue Engineer, Angular Engineer — React chosen
- Python Backend Engineer, Enterprise Backend Engineer, Ruby Backend Engineer, PHP Backend Engineer — Node chosen
- Kubernetes Engineer — no K8s in v1 (serverless Vercel + Neon)
- ML Engineer — no model training in v1
- Salesforce Developer, E-Commerce Engineer — not applicable
- Legacy Modernization Specialist, Embedded Systems Engineer, Game Developer — not applicable

---

## 6. Key Decisions (47 Locked)

See `aplicatie.md` Annex A for the full lock table. Key highlights:

| # | Decision |
|---|----------|
| 1 | Stack: Next.js 15 + oRPC + Neon + Drizzle + Clerk + Stripe + Expo |
| 2 | Auth: Clerk Email OTP at step 2 (fulfills Norma 22/2021) |
| 3 | Payment: Stripe Elements (not NETOPIA) |
| 4 | OCR: Hybrid VIN search + drag-drop landing with auto-categorization |
| 5 | Duration: Always 12L fixed + secondary 1-11 editable |
| 6 | Offers: Hybrid cards desktop + table mobile; decontare directă as global toggle |
| 7 | Encryption: Tier-1 envelope + GCP KMS, Tier-2 pgcrypto, Tier-3 plain |
| 8 | Monorepo: Turborepo + pnpm workspaces (apps/web, apps/admin, apps/mobile, apps/docs + packages/) |
| 9 | Hosting: 100% EU (Frankfurt all) |
| 10 | CI/CD: GitHub Actions + Vercel + EAS + Vitest + Playwright + GitHub Flow |

---

## 7. Handoff

**To:** CTO (`63bb7c85`)

**Requested actions:**
1. Review the technical specification at `insurance-app/aplicatie.md`
2. Validate the technical approach and stack decisions
3. Route work to the 11 department leads recommended above
4. Lock the implementation order and sprint structure
5. Create child issues for the parallel workstreams

**Not my job:** The CTO owns the technical plan, implementation ordering, and code quality gates. This brief covers product scope, requirements, user stories, and team staffing.
