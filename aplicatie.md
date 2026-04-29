# aplicatie.md — Specificație implementare

> **Document de implementare** pentru aplicația de generare asigurări (RCA v1, restul tipurilor v2+).
> Sintetizează 47 decizii principale + ~120 sub-decizii rezolvate prin grilling pe `ultraplan.md`.
> Versiune: `1.0` · Data: `2026-04-28` · Autor: Filip Blajiu

---

## Cuprins

1. [Sumar executiv](#1-sumar-executiv)
2. [Scop și viziune](#2-scop-și-viziune)
3. [Scope MVP (v1)](#3-scope-mvp-v1)
4. [Stack tehnologic](#4-stack-tehnologic)
5. [Hosting și regiuni](#5-hosting-și-regiuni)
6. [Arhitectură de securitate](#6-arhitectură-de-securitate)
7. [Modelul de date (Drizzle + Postgres)](#7-modelul-de-date-drizzle--postgres)
8. [Flow user end-to-end](#8-flow-user-end-to-end)
9. [Pagina cont user](#9-pagina-cont-user)
10. [Anulare poliță](#10-anulare-poliță)
11. [Modificare poliță](#11-modificare-poliță)
12. [Integrare asigurători](#12-integrare-asigurători)
13. [Documente: talon, CI, polițe](#13-documente-talon-ci-polițe)
14. [Plată Stripe](#14-plată-stripe)
15. [Email + SMS](#15-email--sms)
16. [Cookies, GDPR și legal](#16-cookies-gdpr-și-legal)
17. [Validări și reguli RO](#17-validări-și-reguli-ro)
18. [Admin (Refine.dev)](#18-admin-refinedev)
19. [API public](#19-api-public)
20. [Mobile (Expo)](#20-mobile-expo)
21. [Internaționalizare (RO + EN)](#21-internaționalizare-ro--en)
22. [Marketing + SEO](#22-marketing--seo)
23. [Analytics + observability](#23-analytics--observability)
24. [Performance + accessibility](#24-performance--accessibility)
25. [Dev environments](#25-dev-environments)
26. [CI/CD](#26-cicd)
27. [Database migrations](#27-database-migrations)
28. [Backup + disaster recovery](#28-backup--disaster-recovery)
29. [A/B testing + feature flags](#29-ab-testing--feature-flags)
30. [Error / empty / loading states](#30-error--empty--loading-states)
31. [Roadmap v1 → v2 → v3](#31-roadmap-v1--v2--v3)
32. [KPI și evenimente analytics](#32-kpi-și-evenimente-analytics)
33. [Glosar termeni](#33-glosar-termeni)

---

## 1. Sumar executiv

Aplicația permite clienților din România să compare instant ofertele RCA de la 9 asigurători, să cumpere polița online cu plata în 1‑click prin Stripe, și să primească polița pe email în câteva minute. Diferentiatorul principal față de competiție (PrețulMeu, easy.insure, Insurex, ASIG365, EMAG) este combinația de:

- **OCR auto‑completare** (talon + carte de identitate) prin Google Document AI cu drag‑and‑drop pe landing page.
- **Securitate medical‑grade** (envelope encryption + GCP Cloud KMS + audit log append‑only + RLS Postgres).
- **Plată inline modernă** (Stripe Elements cu Apple Pay / Google Pay 1‑tap).
- **Comparator dual‑perioadă** (afișează simultan prețuri pentru 12 luni + alta perioada 1‑11 luni alese de user).
- **Cont reutilizabil** cu vehicule și persoane salvate (PJ flotă în "Garaj").
- **Aplicație mobilă nativă Expo** cu paritate completă față de web.

Produsul lansează în Română și Engleză, are autorizație ASF de broker de asigurări, și este conform GDPR, Norma 22/2021 ASF, Legea 132/2017 (Legea RCA), Legea 506/2004 și WCAG 2.2 AA.

Schema bazei de date este pregătită pentru extindere v2 către CASCO, locuință, sănătate, călătorie și viață fără refactor.

---

## 2. Scop și viziune

### 2.1. Misiune

Eliminarea fricțiunii din procesul de cumpărare a asigurărilor obligatorii și opționale în România, începând cu RCA, și construirea unui broker digital de încredere pe baza unei platforme tehnologic moderne și transparente.

### 2.2. Audiență țintă

- **Persoane fizice (PF)** — proprietari de mașini din toate categoriile, atât tineri tech‑savvy cât și șoferi tradiționali.
- **Persoane juridice (PJ)** — firme cu 1‑50 vehicule (taxi, curierat, distribuție, leasing operator).
- **Comunitatea expat** — interfața în engleză.
- **Useri high‑risk (BAAR)** — redirecționați transparent către BAAR cu instrucțiuni clare.

### 2.3. Diferențiatori cheie

| Diferențiator | Cum se manifestă | Avantaj |
|---|---|---|
| OCR primary path | Drag‑drop talon + CI pe landing | 80% câmpuri auto-completate |
| Securitate transparentă | Pagina `/securitate`, envelope encryption + KMS | Trust uplift, B2B procurement‑ready |
| Plată modern | Stripe Elements + Apple/Google Pay | 1‑tap mobile conversion |
| Comparator dual | 2 perioade simultan, mereu | User vede valoarea optimă fără să refacă căutare |
| Reminders inteligente | 60d email + 30d email + 7d SMS (cu opt‑in) | Loyalty + 10‑20% conversion uplift renewal |
| Cont reutilizabil | Garaj vehicule + persoane salvate | PJ flotă self‑service v1 |

---

## 3. Scope MVP (v1)

### 3.1. Inclus în v1

✅ Tip asigurare: **RCA exclusiv**.
✅ Tipuri proprietar: **Persoană fizică (PF) + Persoană juridică (PJ)**.
✅ Stări vehicul: **înmatriculat + în vederea înmatriculării (cu 3 sub‑cazuri) + înregistrat la Primărie**.
✅ Leasing activ: bifă + searchable select cu top 25‑30 companii leasing RO + opțiune custom.
✅ Șoferi multipli: până la 5 șoferi per poliță cu validare CNP unic.
✅ Decontare directă: toggle global la pas 4.
✅ Durată dual: 12 luni fix + a doua perioadă editabilă 1‑11 luni.
✅ Plată: Stripe Elements + Apple Pay + Google Pay + Stripe Link.
✅ Anulare: drept retragere ≤14 zile self‑service automat; restul cazuri prin wizard cu manual review.
✅ Cont user: 5 tabs (Acasă, Polițe, Vehicule, Persoane, Profil) + dashboard cards.
✅ Reminders: 60d email + 30d email + 7d SMS (opt‑in default ON, soft opt‑in legal).
✅ Cart abandoned: 1 email la 1h (transactional, mereu trimis).
✅ Limbi: RO + EN UI; documente legale în RO.
✅ Mobile: Expo native screens cu paritate completă.
✅ API public: oRPC + OpenAPI cu mutations limitate (creare quote + emitere + status).
✅ Admin: Refine.dev cu email allowlist gating.
✅ Securitate: envelope encryption Tier 1 + GCP KMS + audit log + RLS Postgres + WCAG 2.2 AA + DPIA simplificat + DPO self‑appointed.
✅ Hosting: 100% EU (Frankfurt all).

### 3.2. Out of scope v1 (planificat v2+)

❌ Modificare poliță self‑service (toate prin email support `support@aplicatie.ta`).
❌ BAAR risc ridicat — redirect static către `baar.ro`, fără emitere automată.
❌ Bot WhatsApp — API public pregătit v1, bot integration v2.
❌ Bulk CSV upload pentru flote PJ — quick‑add multi‑vehicle în "Garaj" v1, bulk v2.
❌ Calculator anonim fără sign‑up.
❌ Plata în rate (TBI Bank).
❌ Cross-sell CASCO/locuință/sănătate.
❌ Server‑side Conversions API (Meta CAPI, Google Enhanced Conversions) — pixel hardcoded v1.
❌ Help center dedicat — doar FAQ static + `/intrebari-frecvente`.
❌ Status page — Vercel/Neon/Stripe pages externe v1; Uptime Kuma self‑host adăugat luna 2‑3.
❌ ISO 27001 audit — planificat luna 6‑12.
❌ Cesiune poliță (transfer la nou proprietar) — manual prin support v1.

---

## 4. Stack tehnologic

| Strat | Tehnologie | Rol |
|---|---|---|
| **Frontend web** | Next.js 15 (App Router) + React 19 | SSR + RSC + edge functions |
| **Frontend mobile** | Expo SDK 53 + React Native | iOS + Android paritate |
| **UI library web** | shadcn/ui + Tailwind CSS | Accessible Radix primitives |
| **UI library mobile** | React Native primitives + Tamagui sau NativeBase | Native look |
| **Forms + validare** | React Hook Form + Zod | Schemas shared client+server |
| **Type-safe RPC** | oRPC | TS end-to-end + OpenAPI publishing |
| **Database** | Neon Postgres (eu-central-1) | Serverless Postgres + branching |
| **ORM** | Drizzle ORM + drizzle-kit | TS schema + migrations |
| **Auth** | Clerk (EU region) | Web + mobile + API + Email OTP |
| **Plăți** | Stripe (EU account, Stripe Frankfurt) | Elements inline + Link + Apple/Google Pay |
| **OCR** | Google Document AI (europe-west3) | Talon + CI extraction |
| **Email transactional** | Resend (EU region) + React Email | Templates component-based |
| **SMS** | Twilio (EU region) | Reminder 7d cu STOP keyword |
| **KMS** | GCP Cloud KMS (location: europe multi-region) | Envelope encryption Tier 1 |
| **Storage documente** | Hetzner S3 (Falkenstein, DE) | Talon + CI + polițe PDF + IPID |
| **Cache + rate limit** | Upstash Redis (eu-central-1) | Quote cache 5min + API rate limit |
| **Product analytics** | PostHog (EU cloud) | Funnels + sessions + feature flags + A/B |
| **Error tracking + APM** | Sentry (EU) + Vercel Analytics + Speed Insights | Errors + RUM + Web Vitals |
| **Logs structured** | Axiom (EU) | Server logs + Vercel log drain |
| **Status page** | Uptime Kuma self-host (Hetzner VPS €4/lună) | Monitor + public status |
| **Marketing analytics** | Pixel hardcoded: Google Ads + Meta Pixel | Ad conversion tracking |
| **Cookie consent** | Custom Next.js component | RO + EN, opt-in strict |
| **Monorepo** | Turborepo + pnpm workspaces | Apps web/admin/mobile + packages shared |
| **Hosting frontend** | Vercel Pro (region fra1 lock) | Edge + serverless functions |
| **Hosting mobile** | EAS (Expo Application Services) | Build + submit App Store / Play Store |
| **Hosting status page** | Hetzner Cloud VPS | Uptime Kuma Docker |
| **CI/CD** | GitHub Actions + Vercel + EAS | Lint + test + build + deploy |
| **Testing unit/integration** | Vitest | Schemas + business logic + API |
| **Testing E2E** | Playwright | Critical paths user flow |
| **Admin panel** | Refine.dev + shadcn/ui | CRUD + custom workflows |

### 4.1. Structură monorepo (Turborepo)

```
aplicatie/
├── apps/
│   ├── web/              # Next.js public app (aplicatie.ta)
│   ├── admin/            # Refine.dev admin (admin.aplicatie.ta)
│   ├── mobile/           # Expo app
│   └── docs/             # OpenAPI docs site (docs.aplicatie.ta)
├── packages/
│   ├── api/              # oRPC contracts + handlers
│   ├── db/               # Drizzle schema + migrations
│   ├── ui/               # Shared design system components
│   ├── insurers/         # Adapter pattern per asigurător
│   ├── email-templates/  # React Email templates
│   ├── encryption/       # Envelope encryption + HMAC + audit
│   ├── i18n/             # next-intl + expo-localization shared keys
│   ├── validation/       # Zod schemas + RO validators (CNP/CUI/VIN/IBAN)
│   ├── config/           # ESLint + tsconfig + tailwind preset
│   └── analytics/        # PostHog + Sentry SDK wrappers
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 5. Hosting și regiuni

100% EU pentru data residency strict + GDPR conform.

| Service | Region | Notă |
|---|---|---|
| Vercel functions | `fra1` (Frankfurt) | `vercel.json` regions lock |
| Neon Postgres | `eu-central-1` (Frankfurt) | Co-located cu Vercel |
| Hetzner S3 | Falkenstein, DE | Versioning enabled |
| GCP Cloud KMS | `europe` multi-region | Auto-replica `europe-west3` + `europe-west1` |
| Document AI | `europe-west3` | Frankfurt dedicat |
| Stripe | EU account | Settlement RON cont RO |
| Clerk | EU region | Verificat la setup |
| Resend | EU region opt-in | Multi-sender DKIM/SPF/DMARC |
| Twilio | EU region opt-in | Sender ID alphanumeric |
| PostHog | EU cloud | Self-host option viitor |
| Sentry | EU region | |
| Axiom | EU region | |
| Upstash Redis | `eu-central-1` | |

---

## 6. Arhitectură de securitate

### 6.1. Tier-uri date sensibile

**Tier 1 — Critice** (catastrofic la leak):
CNP, CUI, IBAN, serie + număr CI, parolă cont, Stripe customer token.

**Tier 2 — Sensibile** (rău la leak):
Adresă completă, telefon, email, nume + prenume, dată naștere derivată din CNP.

**Tier 3 — Operațional** (PII la limită):
VIN, marcă, model, preț, perioadă poliță.

### 6.2. Tehnici per tier

#### Tier 1 — Envelope encryption + searchable HMAC

```
GCP KMS (multi-region europe)
  │
  ├── KEK (Key Encryption Key) — niciodată părăsește hardware-ul
  │
  └── DEK (Data Encryption Key) — generat per record, 32 bytes random
       │
       └── XChaCha20-Poly1305 (libsodium) → ciphertext
            │
            └── stocat în Postgres ca:
                - cnp_encrypted (bytea)
                - cnp_dek_wrapped (bytea, DEK criptat cu KEK)
                - cnp_hmac (bytea, indexed) — HMAC-SHA256(CNP, salt)
                                              pentru lookup deterministic
```

**Workflow read:**

```typescript
// packages/encryption/src/tier1.ts
async function decryptTier1(record: { encrypted: Buffer; dekWrapped: Buffer }) {
  const dek = await kms.unwrap(record.dekWrapped);
  const plaintext = sodium.crypto_secretbox_open(record.encrypted, nonce, dek);
  sodium.memzero(dek); // wipe immediately
  return plaintext;
}
```

**Workflow lookup ("find user by CNP"):**

```typescript
const cnpHmac = hmacSha256(inputCnp, process.env.HMAC_SALT);
const user = await db.select().from(persons).where(eq(persons.cnp_hmac, cnpHmac));
```

#### Tier 2 — Column-level pgcrypto

```sql
INSERT INTO persons (email_encrypted) 
VALUES (pgp_sym_encrypt('user@example.com', current_setting('app.tier2_key')));

SELECT pgp_sym_decrypt(email_encrypted::bytea, current_setting('app.tier2_key'))::text AS email
FROM persons;
```

Cheia `tier2_key` rotabilă prin migration job (re-encrypt all rows).

#### Tier 3 — Plaintext

Backup-urile Neon sunt deja criptate at-rest cu AES-256.

### 6.3. Audit log append-only

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  actor_id UUID,         -- cine a accesat (user, admin, system)
  action TEXT NOT NULL,  -- read_pii / write_pii / decrypt / login / consent_change
  field_name TEXT,       -- cnp / cui / iban / etc.
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doar INSERT permis pentru orice rol
REVOKE UPDATE, DELETE ON audit_log FROM PUBLIC;
GRANT INSERT ON audit_log TO app_role;
```

Triggere automate pe coloanele Tier 1 din `persons`, `policies`:

```sql
CREATE OR REPLACE FUNCTION log_pii_access() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, actor_id, action, field_name, record_id)
  VALUES (NEW.user_id, current_setting('app.actor_id', TRUE)::uuid, 'read_pii', 'cnp', NEW.id);
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
```

### 6.4. Row-Level Security Postgres

```sql
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;

CREATE POLICY persons_user_isolation ON persons
  USING (user_id = current_setting('app.current_user_id')::uuid);

ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY policies_user_isolation ON policies
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

Aplicația setează `SET app.current_user_id = '<clerk_user_id>'` la fiecare conexiune. Userul A nu poate vedea date userul B chiar dacă bug în query.

### 6.5. Threat model

| Scenariu | Protecție |
|---|---|
| DB dump leak | Tier 1 ciphertext + DEK wrapped. KEK în KMS HSM. Atacator are cifrate fără chei. |
| DB dump + Vercel env leak | Atacator ar trebui și IAM credentials KMS. Două sisteme separate de compromis. |
| App code RCE | Mitigare: rate limit decrypt, audit log alert pe volum mare, KMS limită key usage. |
| SQL injection | RLS limitează la userul curent automat. |
| Insider DB admin | RLS bypass posibil cu admin role. Mitigare: separation of duties, MFA, audit log. |
| Snapshot Neon PITR leak | Identic cu DB dump. |

### 6.6. Pagina publică `/securitate`

Conținut detaliat customer-facing despre:

1. Criptare în straturi (transport, stocare, chei).
2. Plăți securizate Stripe (PCI DSS Level 1).
3. Acces controlat + audit log.
4. Drepturi GDPR.
5. Conformitate legală (ASF, Norma 22/2021, Legea 132/2017, Legea 506/2004).

Trust badges: ASF, GDPR, Stripe Verified, Google Cloud, ISO 27001 (planificat luna 6‑12), SSL EV.

### 6.7. DPO + DPIA + ROPA

- **DPO** v1: self‑appointed (Filip Blajiu). Contact `privacy@aplicatie.ta`.
- **DPIA** v1: simplificat 10‑15 pagini, template ANSPDCP completat (date, scopuri, riscuri, mitigare). Full DPIA v2 când adaugi sănătate (Art. 9 GDPR).
- **ROPA** v1: intern, nu publicat, audit ANSPDCP ready.

---

## 7. Modelul de date (Drizzle + Postgres)

### 7.1. Convenții

- Toate tabelele au `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- Toate tabelele PII au `user_id UUID NOT NULL REFERENCES users(id)`.
- Toate tabelele au `created_at TIMESTAMPTZ DEFAULT NOW()` și `updated_at TIMESTAMPTZ DEFAULT NOW()`.
- Soft delete: `deleted_at TIMESTAMPTZ` nullable.
- Anonimizare GDPR: `anonymized_at TIMESTAMPTZ` nullable.
- Câmpuri Tier 1 sunt `bytea` (encrypted) + `bytea` HMAC indexed.

### 7.2. Tabele core

#### `users` — identitate Clerk

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerk_user_id: text('clerk_user_id').unique().notNull(),
  email: text('email').notNull(),       // Tier 2 encrypted
  email_hmac: bytea('email_hmac').unique(),
  phone: text('phone'),                  // Tier 2 encrypted
  locale: text('locale').default('ro'),
  preferences: jsonb('preferences').$type<{
    email_reminders: boolean;
    sms_reminders: boolean;
    cookies_analytics: boolean;
    cookies_marketing: boolean;
  }>(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
```

#### `persons` — proprietari + șoferi salvați

```typescript
export const persons = pgTable('persons', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  type: pgEnum('person_type', ['individual', 'company'])('type').notNull(),
  
  // PF (encrypted Tier 1 + HMAC search)
  cnp_encrypted: bytea('cnp_encrypted'),
  cnp_dek_wrapped: bytea('cnp_dek_wrapped'),
  cnp_hmac: bytea('cnp_hmac'),
  first_name: text('first_name'),       // Tier 2
  last_name: text('last_name'),
  id_doc_type: pgEnum('id_doc_type', ['ci', 'bi', 'passport'])('id_doc_type'),
  id_doc_series_encrypted: bytea('id_doc_series_encrypted'),
  id_doc_number_encrypted: bytea('id_doc_number_encrypted'),
  id_doc_expires_at: date('id_doc_expires_at'),
  license_year: integer('license_year'),
  has_no_license: boolean('has_no_license').default(false),
  
  // PJ
  cui_encrypted: bytea('cui_encrypted'),
  cui_hmac: bytea('cui_hmac'),
  company_name: text('company_name'),
  company_type: text('company_type'),
  registration_number: text('registration_number'),
  caen_code: text('caen_code'),
  representative_first_name: text('representative_first_name'),
  representative_last_name: text('representative_last_name'),
  representative_role: text('representative_role'),
  
  // Comun (Tier 2 encrypted)
  email: text('email'),
  phone: text('phone'),
  address_county: text('address_county'),
  address_city: text('address_city'),
  address_street_type: text('address_street_type'),
  address_street: text('address_street'),
  address_number: text('address_number'),
  address_block: text('address_block'),
  address_apartment: text('address_apartment'),
  address_postal_code: text('address_postal_code'),
  
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
  anonymized_at: timestamp('anonymized_at'),
});
```

#### `vehicles` — vehicule salvate

```typescript
export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  
  registration_status: pgEnum('vehicle_registration_status', [
    'registered', 'pending_registration', 'mayor_registered'
  ])('registration_status').notNull(),
  
  registration_subtype: pgEnum('vehicle_registration_subtype', [
    'second_hand_ro', 'foreign', 'new_dealer_ro'
  ])('registration_subtype'),  // doar dacă pending_registration
  
  plate_number: text('plate_number'),
  vin: text('vin').notNull(),
  vin_hmac: bytea('vin_hmac'),
  
  make: text('make'),
  model: text('model'),
  vehicle_category: text('vehicle_category'),       // J din talon
  vehicle_subcategory: text('vehicle_subcategory'),
  usage_type: text('usage_type'),                    // taxi/curierat/personal/etc.
  fuel_type: text('fuel_type'),
  year_of_manufacture: integer('year_of_manufacture'),
  first_registration_date: date('first_registration_date'),
  max_mass_kg: integer('max_mass_kg'),
  engine_capacity_cc: integer('engine_capacity_cc'),
  engine_power_kw: numeric('engine_power_kw'),
  seats_count: integer('seats_count'),
  civ_series: text('civ_series'),
  civ_unknown: boolean('civ_unknown').default(false),
  mileage: integer('mileage'),
  itp_expires_at: date('itp_expires_at'),
  
  is_leasing: boolean('is_leasing').default(false),
  leasing_company_id: uuid('leasing_company_id').references(() => leasing_companies.id),
  
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
});
```

#### `leasing_companies` — lookup table

```typescript
export const leasing_companies = pgTable('leasing_companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  cui: text('cui'),
  active: boolean('active').default(true),
  is_user_added: boolean('is_user_added').default(false),
});
```

Seedat cu top 25-30 companii leasing RO: BCR Leasing, BT Leasing, ING Lease, UniCredit Leasing, ALD Automotive, Arval, LeasePlan, Raiffeisen Leasing, Porsche Leasing, BMW Group Financial Services, Mercedes-Benz Financial Services, etc.

#### `quote_searches` — request-uri pentru oferte

```typescript
export const quote_searches = pgTable('quote_searches', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  vehicle_id: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  owner_person_id: uuid('owner_person_id').references(() => persons.id).notNull(),
  drivers_person_ids: uuid('drivers_person_ids').array(),
  
  start_date: date('start_date').notNull(),
  duration_months_primary: integer('duration_months_primary').notNull(),  // 12 fix
  duration_months_secondary: integer('duration_months_secondary').notNull(),  // 1-11
  
  direct_settlement_requested: boolean('direct_settlement_requested').default(false),
  
  acknowledgments: jsonb('acknowledgments').$type<{
    gdpr_at: string;
    precontractual_at: string;
    no_consultancy_at: string;
  }>(),
  
  status: pgEnum('quote_status', [
    'pending', 'completed', 'failed', 'high_risk', 'expired'
  ])('status').default('pending'),
  
  created_at: timestamp('created_at').defaultNow(),
  completed_at: timestamp('completed_at'),
  expires_at: timestamp('expires_at'),  // cart 24h
});
```

#### `quote_offers` — răspunsuri agregator per asigurător

```typescript
export const quote_offers = pgTable('quote_offers', {
  id: uuid('id').primaryKey().defaultRandom(),
  quote_search_id: uuid('quote_search_id').references(() => quote_searches.id).notNull(),
  
  insurer_code: text('insurer_code').notNull(),  // eazy/asirom/generali/etc.
  duration_months: integer('duration_months').notNull(),  // 12 sau secondary
  
  premium_net: numeric('premium_net', { precision: 10, scale: 2 }),
  broker_commission: numeric('broker_commission', { precision: 10, scale: 2 }),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }),
  currency: text('currency').default('RON'),
  
  bonus_malus_class: text('bonus_malus_class'),
  direct_settlement_delta: numeric('direct_settlement_delta', { precision: 10, scale: 2 }),
  
  excluded_countries: text('excluded_countries').array(),
  external_offer_code: text('external_offer_code'),
  
  is_available: boolean('is_available').default(true),
  unavailable_reason: text('unavailable_reason'),
  documents_url: text('documents_url'),  // link IPID PDF
  
  raw_response: jsonb('raw_response'),  // audit
  created_at: timestamp('created_at').defaultNow(),
});
```

#### `policies` — base + detail tables (multi-tip ready)

```typescript
export const policy_type = pgEnum('policy_type', ['rca', 'casco', 'home', 'health', 'travel', 'life']);
export const policy_status = pgEnum('policy_status', ['active', 'cancelled', 'expired', 'pending', 'pending_cancellation']);

export const policies = pgTable('policies', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  policy_type: policy_type('policy_type').notNull(),
  policy_number: text('policy_number'),
  insurer_code: text('insurer_code').notNull(),
  
  subject_snapshot: jsonb('subject_snapshot'),   // vehicul / locuință / persoană
  owner_snapshot: jsonb('owner_snapshot'),
  
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  duration_months: integer('duration_months').notNull(),
  status: policy_status('status').default('active'),
  
  premium_net: numeric('premium_net', { precision: 10, scale: 2 }),
  broker_commission: numeric('broker_commission', { precision: 10, scale: 2 }),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }),
  currency: text('currency').default('RON'),
  
  payment_id: uuid('payment_id').references(() => payments.id),
  
  pdf_url: text('pdf_url'),
  pdf_hash: text('pdf_hash'),
  ipid_url: text('ipid_url'),
  
  cancelled_at: timestamp('cancelled_at'),
  cancellation_reason: text('cancellation_reason'),
  withdrawal_until: date('withdrawal_until'),  // 14 zile drept retragere
  
  issued_at: timestamp('issued_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  anonymized_at: timestamp('anonymized_at'),
});

export const rca_policy_details = pgTable('rca_policy_details', {
  policy_id: uuid('policy_id').primaryKey().references(() => policies.id),
  vehicle_id: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  drivers_snapshot: jsonb('drivers_snapshot'),
  leasing_snapshot: jsonb('leasing_snapshot'),
  bonus_malus_class: text('bonus_malus_class'),
  direct_settlement: boolean('direct_settlement').default(false),
  excluded_countries: text('excluded_countries').array(),
  baar_code: text('baar_code'),
});
```

Migrarea v2 — adăugare CASCO/locuință etc. = nouă tabelă `casco_policy_details`, zero impact pe RCA.

#### `payments` — tracking Stripe

```typescript
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  policy_id: uuid('policy_id').references(() => policies.id),  // null until success
  quote_offer_id: uuid('quote_offer_id').references(() => quote_offers.id).notNull(),
  
  stripe_payment_intent_id: text('stripe_payment_intent_id').unique().notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  currency: text('currency').default('RON'),
  status: pgEnum('payment_status', ['pending', 'succeeded', 'failed', 'refunded'])('status'),
  payment_method: pgEnum('payment_method', ['card', 'apple_pay', 'google_pay', 'link'])('payment_method'),
  failure_reason: text('failure_reason'),
  
  created_at: timestamp('created_at').defaultNow(),
  completed_at: timestamp('completed_at'),
});
```

#### Tabele auxiliare

```typescript
export const notifications_log = pgTable('notifications_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  policy_id: uuid('policy_id').references(() => policies.id),
  channel: pgEnum('notification_channel', ['email', 'sms', 'push'])('channel'),
  template_key: text('template_key'),
  recipient: text('recipient'),
  status: text('status'),
  sent_at: timestamp('sent_at'),
});

export const consents_log = pgTable('consents_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  consent_type: text('consent_type'),
  granted: boolean('granted'),
  source: text('source'),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  vehicle_id: uuid('vehicle_id').references(() => vehicles.id),
  person_id: uuid('person_id').references(() => persons.id),
  policy_id: uuid('policy_id').references(() => policies.id),
  type: text('type'),  // talon / ci / leasing_contract / invoice / civ / policy_pdf / ipid_pdf
  file_url: text('file_url'),
  mime_type: text('mime_type'),
  size_bytes: integer('size_bytes'),
  ocr_extracted: jsonb('ocr_extracted'),
  created_at: timestamp('created_at').defaultNow(),
});

export const webhook_events = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  source: text('source'),  // stripe / aggregator / asig_X
  event_id: text('event_id').unique(),
  payload: jsonb('payload'),
  processed_at: timestamp('processed_at'),
  error: text('error'),
});

export const insurers = pgTable('insurers', {
  code: text('code').primaryKey(),  // eazy / asirom / etc.
  name: text('name'),
  active: boolean('active').default(true),
  broker_commission_pct: numeric('broker_commission_pct', { precision: 5, scale: 2 }),
  api_endpoint: text('api_endpoint'),
  api_credentials_secret_id: text('api_credentials_secret_id'),  // ref la KMS
});

export const legal_documents = pgTable('legal_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type'),  // terms / privacy / cookies / precontractual
  version: integer('version'),
  content_url: text('content_url'),
  effective_date: date('effective_date'),
  created_at: timestamp('created_at').defaultNow(),
});

export const user_consents = pgTable('user_consents', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id),
  document_id: uuid('document_id').references(() => legal_documents.id),
  accepted_at: timestamp('accepted_at'),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
});

export const audit_log = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id'),
  actor_id: uuid('actor_id'),
  action: text('action'),
  field_name: text('field_name'),
  record_id: uuid('record_id'),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at').defaultNow(),
});

export const api_clients = pgTable('api_clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  api_key_hash: text('api_key_hash'),  // bcrypt
  rate_limit_per_min: integer('rate_limit_per_min').default(60),
  allowed_endpoints: text('allowed_endpoints').array(),
  active: boolean('active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  last_used_at: timestamp('last_used_at'),
  revoked_at: timestamp('revoked_at'),
});
```

### 7.3. Strategie GDPR delete + retention

**Soft delete + anonymization:**
- `deleted_at` pe `persons`, `vehicles`, `quote_searches` la cerere user.
- `anonymized_at` pe `policies` cu PII înlocuit "ANONYMIZED" (păstrat 5+ ani legal).
- Hard delete pe Clerk user, sesiuni, payment methods.
- Stripe customer = delete via API.

**Endpoint `/api/account/delete`:**
1. Confirm modal cu reasoning + parolă.
2. Hard delete: persons, vehicles, quote_searches, quote_offers.
3. Anonymize: polițe, payments metadata.
4. Hard delete: Clerk user.
5. Email confirmare ștergere.
6. Audit log: păstrat 7 ani anonimizat.

**Retention auto-delete (cron zilnic):**
- Polițe `status = 'expired' AND expires_at < now() - 5 years` → anonymize PII.
- Quote_searches `created_at < now() - 90 days AND status != 'completed'` → hard delete.
- Notifications_log `sent_at < now() - 2 years` → hard delete.
- Audit_log `created_at < now() - 7 years` → hard delete.

---

## 8. Flow user end-to-end

### 8.1. Landing page (`/`)

```
[ Header: Logo · RO/EN switch · Sign in · Sign up ]

═════════════════════════════════════════════════════════
[ HERO ]
H1: RCA în 3 minute. Compară 9 asigurători instant.
Subhead: Calculează prețul, alege oferta, primești 
         polița pe email. Plată securizată Stripe.

┌────────────────────────────────────────────────────────┐
│ [ Input: VIN sau nr. înmatriculare       ]             │
│ [ Buton: Caută ]   [ Buton: 📷 Încarcă documente ]    │
└────────────────────────────────────────────────────────┘
       ↑
       (toată zona landing = drop zone, hidden până la dragover)

🔒 Date criptate · 🛡️ Stripe · ✅ ASF · 🇪🇺 GDPR
═════════════════════════════════════════════════════════

[ CUM FUNCȚIONEAZĂ — 3 pași simpli ]
1. 📷 Introduci VIN sau încarci talonul
2. ⚖️ Compari 9 oferte instant
3. 💳 Plătești și primești polița pe email

═════════════════════════════════════════════════════════

[ DE CE NOI? — 4 piloni ]
✓ Compară 9 asigurători instant (transparență)
✓ Date criptate end-to-end (GDPR + KMS securitate)
✓ Plată Stripe (1-tap Apple/Google Pay)
✓ Reminder reînnoire automat (nu mai uiti)

═════════════════════════════════════════════════════════

[ TESTIMONIALE / TRUST ]
[Stats: X polițe · Y stele · Z familii / firme]

═════════════════════════════════════════════════════════

[ FAQ — 10-15 întrebări long-tail SEO ]

═════════════════════════════════════════════════════════

[ CTA FINAL ]
"Începe acum — Calculează prețul"

═════════════════════════════════════════════════════════

[ Footer ]
Aplicatie.ta — Broker autorizat ASF: RBK-XXX
Termeni · Confidențialitate · Cookies · DPO · Securitate · Accesibilitate
© 2026 Aplicatie.ta SRL — CUI: XXX | J40/XXX/2026
```

#### 8.1.1. Comportament drag-and-drop landing

**Default state** — input + 2 butoane vizibile.

**Dragover detect** (desktop, drag fișier peste pagină):
- Zona landing transformă: border dashed colorat, overlay "Eliberează aici talonul și/sau cartea de identitate".
- Butonul "Încarcă documente" → text mare "Drop here", stil emphasized.
- Animație subtilă (opacity / scale).

**Drop / file picker** acceptă **1 sau 2 fișiere**, JPG/PNG/PDF, max 10MB fiecare.
- >2 fișiere → toast "Maxim 2 documente: talon + carte de identitate".
- Format invalid → toast "Doar JPG, PNG sau PDF".

**Backend categorizare automată** (Google Document AI):
- Document AI processor classification: `talon` / `ci` / `unknown`.
- 2 fișiere de același tip → "Am detectat 2 documente la fel. Încarcă unul de fiecare tip."
- 1 fișier necunoscut → "N-am putut identifica documentul."

**Extracție:**
- Talon → date vehicul (VIN, marcă, model, an, masă, putere, combustibil, nr înmatriculare, adresă proprietar din talon).
- CI → date proprietar (nume, prenume, CNP, serie, număr, expirare, adresă domiciliu).
- Ambele → toate câmpurile pre-completate, sari direct la pas 1 cu form aproape complet.

**Conflict resolution** când user a și introdus VIN/nr ȘI a încărcat docs:
- **Docs win.** VIN/nr din talon e mai sigur decât typed.
- Dacă diferă → toast informativ: "Am folosit datele din talon (VIN: WDB...). Editezi la pas 1 dacă nu e corect."

**Mobile (no drag-drop):**
- Butonul "📷 Încarcă documente" → deschide native picker iOS/Android cu opțiuni "Cameră / Galerie / Fișiere".
- Document AI suportă poză directă cameră (auto-crop + deskew via processor).

**Sumar progres în timpul OCR:**
- Spinner + text "Citim talonul..." / "Citim cartea de identitate..." pe ecran tranzitoriu (~3-5 sec).
- Fail → "N-am putut citi clar [doc]. Reîncearcă sau completează manual." → buton retry + "Skip, completez manual".

**"Caută" button doar VIN/nr:**
- Backend VIN decoder + lookup nr înmatriculare în CEDAM mock (v1).
- Pre-completează ce poate (marcă, model, an, masă, putere, combustibil — fără date proprietar).
- Pas 2 (Proprietar) = manual obligatoriu.

### 8.2. Stepper progres (vizibil sus la pas 1‑4)

```
 ●━━━━━━━━━○━━━━━━━━━○━━━━━━━━━○
 1          2          3          4
 Vehicul   Proprietar  Configurare  Oferte
```

Click pe pas anterior = înapoi cu date păstrate. Click pe pas viitor = blocat până nu validezi current.

### 8.3. Pas 1 — Vehicul

```
─────────────────────────────────────────────────────────
PASUL 1 din 4 — Date vehicul

Stare vehicul: *
[● Înmatriculat (?)]  [○ În vederea înmatriculării (?)]  [○ Înregistrat la Primărie (?)]
                                                    ↑ tooltip cu definiție per chip

(starea selectată automat din landing input — auto-detect)

─── Câmpuri (pre-completate dacă a fost OCR) ───

Număr înmatriculare *: [BV18BFG]    (blocat dacă "în vederea înmatriculării")
Serie șasiu (VIN) *:   [WDB9066131S155032]
                       ✓ Auto-completat din talon

Marcă *:               [MERCEDES-BENZ]
Model *:               [Sprinter 209 CDI]
Categorie (J) *:       [Autoutilitare și camioane (N)]
Subcategorie *:        [Autoutilitară ușoară (N1)]
Mod utilizare *:       [▼ Personal]      (Personal/Taxi/Curierat/etc.)
Combustibil (P.3) *:   [Diesel]
An fabricație *:       [2007]
Prima înmatriculare (B) *: [02/02/2007]
Masă maximă (F1) *:    [2800 kg]
Capacitate (P1) *:     [2148 cc]
Putere (P2) *:         [65 kW]    (în kW, nu CP)
Număr locuri (S1) *:   [2]
Seria CIV *:           [_______]    ☐ Nu am sau nu știu
Data expirare ITP:     [DD/MM/YYYY]    (opțional pentru Generali)
Kilometraj:            [190000]        (opțional pentru Grawe)

☐ Voi călători cu mașina în state non-UE (carte verde, nu influențează prețul)

─── Acorduri (cerințe legale Norma 22/2021 + ASF) ───
☐ Am luat la cunoștință despre Informarea Precontractuală *
☐ Am citit și sunt de acord cu prelucrarea datelor pentru ofertare *
☐ Renunț la consultanță conform Normei 22/2021 *
   (necesar pentru continuare; explicație tooltip)

[← Înapoi]                              [Pasul următor →]
─────────────────────────────────────────────────────────
```

#### 8.3.1. Sub-cazuri "În vederea înmatriculării"

Click chip "În vederea înmatriculării" → apare sub-întrebare:

```
De unde vine vehiculul? *
[○ Mașină second-hand din România]
[○ Mașină din străinătate (UE / non-UE)]
[○ Mașină nouă de la dealer din România]
```

Per sub-tip apar documente justificative obligatorii:

| Sub-tip | Documente |
|---|---|
| Second-hand RO | Contract vânzare-cumpărare cu **viza fiscală** |
| Din străinătate | Contract/factură + dovadă programare DRPCIV pentru numere provizorii + BI/CI |
| Nou de la dealer RO | CIV + factură (proformă) dealer + dovadă înregistrare fiscală + BI/CI |

```
[📎 Upload documente justificative *]
   Format: JPG, PNG, PDF, DOC, DOCX. Max 5 fișiere, 5MB fiecare.

⚠️ Polița se emite fără număr de înmatriculare, doar în baza VIN.
   După înmatriculare, ne contactezi pentru a transmite numărul.
```

### 8.4. Pas 2 — Proprietar și șofer

```
─────────────────────────────────────────────────────────
PASUL 2 din 4 — Date proprietar și șofer

Tip persoană *: [● Persoană fizică]  [○ Persoană juridică]

☐ Vehiculul este în leasing
   ↓ (bifă)
   Companie de leasing *: [▼ Caută și selectează...]
                          (BCR Leasing, BT Leasing, ING Lease, ...)
                          [+ Adaugă altă companie] — input nume + CUI

──────────────────────────────────────────────────
Date proprietar (Persoană fizică)

Nume *:         [Blajiu]
Prenume *:      [Filip]
CNP *:          [1960418080017]
Email *:        [filip@example.ro]
Telefon *:      [+40727012763]
Tip act *:      [▼ CI]  (CI / BI / Pașaport)
Serie CI *:     [ZV]
Număr CI *:     [369226]
Expirare CI *:  [DD/MM/YYYY]
An permis *:    [2016]    ☐ Fără permis

Adresă (din talon):
Județ *:        [▼ Brașov]
Localitate *:   [▼ Râșnov]
Tip stradă *:   [▼ Stradă]
Stradă *:       [Vânători]
Număr *:        [51]
Bloc:           [_]
Scară:          [_]
Etaj:           [_]
Apartament:     [_]
Cod poștal *:   [505400]    [🔍 Caută cod poștal]

──────────────────────────────────────────────────
Șoferi auto

☑ Proprietarul este același cu șoferul principal
   (default bifat — secțiunea șofer separat ascunsă)

   ↓ (uncheck → apare bloc "Șofer principal")

Șoferi suplimentari (opțional):
[+ Adaugă alt șofer]   ← click expand bloc nou inline

⚠️ Atenție: adăugarea șoferilor suplimentari poate modifica prețul.
   Datele șoferilor sunt verificate cu BAAR pentru bonus-malus.
   (Legea 132/2017 RCA)

──────────────────────────────────────────────────
Acorduri:
☐ Am citit și sunt de acord cu prelucrarea datelor cu caracter personal,
  conform GDPR și Politicii de Confidențialitate. *
☐ Confirm că datele introduse sunt corecte și că am documentele care 
  atestă proprietatea sau dreptul de utilizare al vehiculului. *

[← Înapoi]                              [Pasul următor →]
─────────────────────────────────────────────────────────
```

#### 8.4.1. Email OTP la final pas 2

Click "Pasul următor" → modal Clerk Email OTP:

```
┌────────────────────────────────────────┐
│ Verifică email-ul                      │
│                                        │
│ Pentru a vedea ofertele, te rugăm să  │
│ confirmi că ai acces la adresa de mail│
│ introdusă (cerință legală Norma       │
│ 22/2021 ASF).                         │
│                                        │
│ Am trimis un cod la: filip@example.ro │
│                                        │
│ [_] [_] [_] [_] [_] [_]               │
│                                        │
│ N-ai primit codul? [Trimite din nou]  │
│                                        │
│ [Verifică]                             │
└────────────────────────────────────────┘
```

- Cod corect → cont Clerk creat sau autentificat → tranziție pas 3.
- Cont creat = primește welcome (post-plată) la finalizare.

#### 8.4.2. PJ — câmpuri condiționale

Toggle "Persoană juridică" → schema schimbă:

```
Date companie:
CUI *:                  [123456789]
Tip societate *:        [▼ SRL / SA / PFA / etc.]
Nume companie *:        [Lazuli Technologies S.R.L.]
Număr înregistrare *:   [J06/3242/2022]
Cod CAEN *:             [7311]
Email companie *:       [contact@example.com]
Telefon *:              [+40...]

Date reprezentant:
Nume *: [...]   Prenume *: [...]
Calitate *:    [▼ Administrator / Asociat / Manager / etc.]

Adresa sediu social:  [Județ/Localitate/Stradă/Nr/Cod poștal]

Date șofer principal:
☐ Șoferul este administratorul
   (uncheck → câmpuri șofer separat)
Nume *: [...]   Prenume *: [...]
CNP *:  [...]
Tip act / Serie / Număr / Expirare / An permis
```

### 8.5. Pas 3 — Configurare poliță

```
─────────────────────────────────────────────────────────
PASUL 3 din 4 — Configurare poliță

Data început poliță *:
[▼ Calendar — 28 Aprilie 2026 ]
ℹ️ Maxim 60 zile în avans. Dacă ai poliță activă, alege ziua 
   următoare expirării. [Verifică valabilitate poliță actuală]

──────────────────────────────────────────────────
Durata poliței *  (compari mereu 2 perioade)

┌──────────────────┐   ┌────────────────────────┐
│  12 luni  ✓      │   │  [▼ 6 ▼] luni  ✓       │
│  (fix)           │   │  (editabilă: 1-11)     │
└──────────────────┘   └────────────────────────┘

Polița 12 luni: expiră 28 aprilie 2027 (Miercuri)
Polița 6 luni:  expiră 28 octombrie 2026 (Miercuri)

ℹ️ Disponibilitatea poate varia: unii asigurători emit doar 1, 6 sau 12 luni.

──────────────────────────────────────────────────
Sumar pași anteriori:
Vehicul:   Mercedes-Benz Sprinter 209 CDI (BV18BFG) [Editează]
Proprietar: Blajiu Filip (CNP ****8017) [Editează]
Șoferi:    Blajiu Filip [Editează]

[← Înapoi]                          [Vezi ofertele →]
─────────────────────────────────────────────────────────
```

### 8.6. Pas 4 — Oferte

#### 8.6.1. Layout desktop

```
─────────────────────────────────────────────────────────
PASUL 4 din 4 — Ofertele tale

[9 oferte găsite pentru BV-18-BFG, începere 28.04.2026]

Filtre: [Sortare ▼ Cel mai mic preț 12L]
        ☐ Decontare directă (recomandat) (?)
           Cu decontare directă, asigurătorul plătește direct service-ul 
           la daună, fără să avansezi tu bani. Costă în plus ~5-15%.

┌──────────────┬──────────┬──────────┬──────────────┬──────────┐
│ Asigurător   │ 12 luni  │ 6 luni   │ Bonus-Malus  │ Acțiune  │
├──────────────┼──────────┼──────────┼──────────────┼──────────┤
│ [logo eazy]  │ 1.383,79 │   720,00 │ B6           │ ▼        │
│ eazy.insure  │ ≈ 115/lună│ ≈ 120/lună│             │ [Alege]  │
├──────────────┼──────────┼──────────┼──────────────┼──────────┤
│ [logo Gen.]  │ 1.496,00 │   800,00 │ B6           │ ▼        │
│ Generali     │           │          │              │ [Alege]  │
├──────────────┼──────────┼──────────┼──────────────┼──────────┤
│ [logo Asir]  │ 1.782,26 │  N/A 6L  │ B6           │ ▼        │
│ Asirom       │           │ ─        │              │ [Alege 12L]│
├──────────────┼──────────┼──────────┼──────────────┼──────────┤
│  ...                                                          │
└──────────────┴──────────┴──────────┴──────────────┴──────────┘

Cea mai bună valoare: eazy.insure 12L (≈ 115 RON/lună)

──────────────────────────────────────────────────
Indisponibile (2)  [▼ Vezi]
- Allianz Țiriac — "Nu emite RCA pentru această categorie" (Vezi de ce)
- Axeria — "Vehicul depășește limita de risc" (Vezi de ce)

──────────────────────────────────────────────────
[← Schimbă durata]   [Cerere nouă]
─────────────────────────────────────────────────────────
```

#### 8.6.2. Layout mobile

```
[Sticky top: filter dropdown + decontare toggle]

┌──────────────────────────┐
│ [logo eazy.insure]       │
│                          │
│ 12 luni       6 luni     │
│ 1.383 RON     720 RON    │
│ ≈ 115/lună    ≈ 120/lună │
│                          │
│ Clasa B6  ▼ Detalii      │
│                          │
│ [Alege 12L]  [Alege 6L]  │
└──────────────────────────┘

┌──────────────────────────┐
│ [logo Asirom]            │
│ 12 luni: 1.782 RON       │
│ 6 luni: nu se emite      │
│ [Alege 12L]              │
└──────────────────────────┘

[Indisponibile (2) ▼]
```

#### 8.6.3. Detalii expand pe rând/card

```
▼ Detalii eazy.insure (12 luni)

Prima asigurător:    1.314,60 RON
Comision broker:        69,19 RON
─────────────────────────────────
Total:                1.383,79 RON

Țări excluse carte verde: AZ, BY, IR, RUS, UA
Cod ofertă:               21408046
[📥 Descarcă IPID PDF]

[Alege oferta →]
```

### 8.7. Checkout (`/checkout/[oferta-id]`)

```
─────────────────────────────────────────────────────────
[Stepper: 1 ✓ — 2 ✓ — 3 ✓ — 4 ✓ — Plată]

CHECKOUT — Confirmare și plată

┌─── Rezumat ofertă ─────────────────────────────────┐
│ Asigurat: Blajiu Filip                             │
│ Vehicul: BV-18-BFG (Mercedes Sprinter 209 CDI)     │
│ Asigurător: eazy.insure                            │
│ Perioadă: 12 luni (28.04.2026 - 28.04.2027)        │
│ Decontare directă: NU                              │
│ Clasa: B6                                          │
│ Țări excluse: AZ, BY, IR, RUS, UA                  │
│                                                    │
│ TOTAL DE PLATĂ:    1.383,79 RON                    │
│                    ≈ 115,32 RON/lună               │
└────────────────────────────────────────────────────┘

☐ Confirm că am primit și am citit documentele produsului 
  (IPID + Termeni asigurător) și sunt de acord cu emiterea
  poliței de asigurare RCA. *

──────────────────────────────────────────────────
Plată

[Stripe Payment Element — embedded, customizat brand]

Express Checkout:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 🍏 Apple Pay    │  │ G  Google Pay   │  │ ⚡  Stripe Link  │
└─────────────────┘  └─────────────────┘  └─────────────────┘

  ─── sau plătește cu cardul ───

┌────────────────────────────────────────────────────┐
│ Număr card *  [____ ____ ____ ____]                │
│ Expirare *    [MM/YY]   CVV *  [___]               │
│ Nume titular *[____________________]                │
│ Cod poștal *  [______]                             │
└────────────────────────────────────────────────────┘

[Plătește 1.383,79 RON →]   ← buton primary, full width

🔒 Plată securizată prin Stripe · PCI DSS Level 1
   3D Secure activat. Datele cardului nu trec prin serverele noastre.
─────────────────────────────────────────────────────────
```

**Comportament:**
1. Bifa documente *= obligatorie* înainte de activare metode plată. Until bifat → toate butoanele plată disabled.
2. Apple Pay / Google Pay / Link detectate automat (user-agent + Stripe). Pe Safari iOS / Chrome Android apar primele.
3. Click metodă express → autentificare nativă (Touch/Face ID) → 3DS dacă cere bancă.
4. Card form → tokenizat direct de Stripe (zero PCI scope server-side).

### 8.8. `/thank-you?payment_intent={id}`

#### Hibrid sincron+async (timeout 10s)

```
┌────────────────────────────────────────────────────┐
│ ✓ Plată reușită!                                   │
│                                                    │
│ Cod tranzacție: 21408046                           │
└────────────────────────────────────────────────────┘

[Spinner] Emitem polița ta acum...
   (afișat 0-10 sec, polling status la 2s interval)

⬇ După emitere reușită (sub 10s):

✓ Poliță emisă: #21408046
   Asigurător: eazy.insure
   Vehicul: BV-18-BFG
   Perioadă: 28 apr 2026 - 28 apr 2027
   
   [📥 Descarcă poliță PDF]
   [📥 Descarcă IPID]
   
   Polița a fost trimisă și pe email la filip@example.ro
   
   [Înapoi la cont →]

⬇ Dacă timeout 10s (asigurător slow):

⏳ Polița se procesează la asigurător...
   Va sosi pe email în câteva minute.
   
   Te poți întoarce la cont — vom trimite o notificare 
   când e gata (push notif pe mobile dacă ești logat în app).
   
   [Mergi la cont →]
```

---

## 9. Pagina cont user

### 9.1. Layout (sidebar + dashboard hub)

```
┌──────────────────────────────────────────────────────┐
│ [Logo aplicatie.ta]    [Bună, Filip] [▼ Sign out]   │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│ 🏠 Acasă     │   ACASĂ (DASHBOARD)                   │
│ 📜 Polițe    │                                       │
│ 🚗 Vehicule  │   ┌─────────────────────────────────┐│
│ 👤 Persoane  │   │ Polița ta RCA expiră în 142 zile││
│ ⚙️ Profil    │   │ eazy.insure · BV-18-BFG          ││
│              │   │ [Vezi poliță]                    ││
│ ┌──────────┐ │   └─────────────────────────────────┘│
│ │ + RCA    │ │                                       │
│ │ nou      │ │   ┌─────────────────────────────────┐│
│ └──────────┘ │   │ Vehicule salvate (1)             ││
│              │   │ • BV-18-BFG (Sprinter 209)      ││
│              │   │ [Adaugă vehicul]                 ││
│              │   └─────────────────────────────────┘│
│              │                                       │
│              │   ┌─────────────────────────────────┐│
│              │   │ Acțiuni rapide                   ││
│              │   │ [+ RCA nou] [Reînnoiește] [Doc.]││
│              │   └─────────────────────────────────┘│
└──────────────┴───────────────────────────────────────┘
```

### 9.2. Tab Polițe

```
[Filtre: ✓ Activă · ☐ Expirată · ☐ Anulată · ☐ În curs]

┌────────────────────────────────────────────────┐
│ [logo eazy] Poliță #21408046                   │
│ Vehicul: BV-18-BFG (Sprinter 209)              │
│ Perioadă: 28 apr 2026 - 28 apr 2027            │
│ Status: ✅ Activă                              │
│ Total: 1.383,79 RON                            │
│                                                │
│ [📥 Poliță PDF] [📥 IPID] [⚙️ Modifică] [⚠️ Anulează]│
│                                                │
│ ℹ️ Mai ai 11 zile drept retragere fără motiv  │
└────────────────────────────────────────────────┘

(repeat per poliță, sortate descending după start_date)
```

### 9.3. Tab Vehicule (Garaj)

```
[+ Adaugă vehicul]

┌────────────────────────────────────────────────┐
│ 🚗 Mercedes-Benz Sprinter 209 CDI              │
│ Nr. înmatriculare: BV-18-BFG                   │
│ VIN: WDB9066131S155032                         │
│ Status: RCA activ până la 28 apr 2027          │
│                                                │
│ [Editează] [Șterge] [+ RCA nou pentru acest]   │
└────────────────────────────────────────────────┘

(quick-add multiple vehicles pentru PJ flotă)
```

### 9.4. Tab Persoane

```
[+ Adaugă persoană]

┌────────────────────────────────────────────────┐
│ 👤 Blajiu Filip (proprietar + șofer principal) │
│ CNP: ****8017                                  │
│ [Editează] [Șterge]                            │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ 🏢 Lazuli Technologies S.R.L. (PJ)             │
│ CUI: ****6789                                  │
│ Reprezentant: Blajiu Filip                     │
│ [Editează] [Șterge]                            │
└────────────────────────────────────────────────┘
```

### 9.5. Tab Profil

```
Date cont:
Email primary:     filip@example.ro [✓ Verificat]
Telefon:           +40727012763
Limbă:             [▼ Română]

──────────────────────────────────────────────
Notificări:
☑ Reminder email expirare (60d, 30d)
☑ Reminder SMS urgență (7d înainte expirare)
☐ Push notificări mobile (când ai app instalată)

──────────────────────────────────────────────
Securitate:
[Schimbă parola] (dacă ai setat)
[Activează 2FA]
[Sesiuni active: 2]

──────────────────────────────────────────────
Confidențialitate:
[Vezi datele mele] (export GDPR)
[Schimbă preferințe cookies]
[Șterge cont] ← right to be forgotten
```

---

## 10. Anulare poliță

### 10.1. Cazuri și refund

| Caz | Refund | Cerințe |
|-----|--------|---------|
| Drept retragere ≤14 zile | 100% prorata zile rămase | Doar declarație fără motiv |
| Vânzare vehicul | Prorata zile rămase | Contract vânzare-cumpărare |
| Vehicul declarat TOTAL | Prorata | Document constatator daună |
| Radierea înmatriculării | Prorata | Certificat radiere DRPCIV |
| Schimbare proprietar (cesiune) | Transfer poliță, nu refund | **Manual prin support v1** |
| Furtul mașinii | Prorata | Plângere poliție |

### 10.2. Wizard anulare

```
PASUL 1 — Motivul anulării

○ Drept retragere (în primele 14 zile)
   Anulezi fără motiv. Refund integral prorata.
   ✓ Disponibil — mai ai 11 zile

○ Vând vehiculul
   Contract vânzare-cumpărare necesar.
   Refund prorata (mai puțin comision broker).

○ Vehicul declarat TOTAL (daună)
   Document constatator necesar.

○ Radierea înmatriculării
   Certificat radiere DRPCIV necesar.

○ Furtul vehiculului
   Plângere poliție necesară.

○ Alt motiv
   Echipa noastră evaluează individual.

[Continuă →]
```

```
PASUL 2 — Calcul refund + documente

Refund estimat
─────────────────────────────
Total poliță:     1.383,79 RON
Zile folosite:    23 (din 365)
Zile rămase:      342

Refund estimat:   1.296,53 RON
Comision broker reținut:  69,19 RON*
                          (5% nereturnabil post-14d)

* Drept retragere ≤14 zile = 100% refund inclusiv comision.

Documente necesare:
[📎 Upload contract vânzare-cumpărare *]
   Format: JPG, PNG, PDF. Max 10MB.

[Trimite cerere anulare]
```

```
PASUL 3 — Confirmare

✓ Cererea ta a fost primită.

Numar referință: ANUL-2026-04-21-001

Pași următori:
1. Verificăm cererea în 24-48h.
2. Trimitem cererea la asigurător (eazy.insure).
3. Asigurătorul confirmă anularea în 5-10 zile lucrătoare.
4. Refund prin Stripe pe cardul folosit la plată.

Vei primi update-uri pe email la fiecare etapă.

[Înapoi la cont]
```

### 10.3. Drept retragere ≤14 zile flow simplificat

1. User selectează "Drept retragere".
2. Modal "Confirm anularea? Vei primi 100% refund."
3. Submit → automat:
   - `policy.status = 'pending_cancellation'`
   - API asigurător call automat
   - Stripe `payment_intent.refund` 100%
   - Email confirmare
4. Status în cont = "Anulată" + "Refund 1.383,79 RON pe cardul ****4242".

### 10.4. Backend authoritative refund calc

```typescript
// packages/api/src/refund.ts
function calculateProrataRefund(policy: Policy, today: Date) {
  const daysTotal = differenceInDays(policy.end_date, policy.start_date);
  const daysUsed = differenceInDays(today, policy.start_date);
  const daysRemaining = daysTotal - daysUsed;
  
  const isWithdrawal = differenceInDays(today, policy.start_date) <= 14;
  
  const premiumRefund = (policy.premium_net * daysRemaining) / daysTotal;
  const commissionRefund = isWithdrawal ? policy.broker_commission : 0;
  
  return premiumRefund + commissionRefund;
}
```

---

## 11. Modificare poliță

**Out of scope v1.** Toate modificările prin email support `support@aplicatie.ta`.

### 11.1. Cazuri tipice

- Adăugare nr. înmatriculare după DRPCIV (vehicul "în vederea înmatriculării").
- Schimbare adresă proprietar.
- Update telefon/email.
- Adăugare șofer suplimentar.
- Schimbare nume proprietar (CI nou).
- Cesiune poliță la nou proprietar.

### 11.2. Comunicare clară pe pagina poliței

```
ℹ️ Modificări poliță

Pentru a modifica datele poliței (adăugare nr înmatriculare, 
schimbare adresă, adăugare șofer, etc.), te rugăm să ne 
contactezi:

📧 support@aplicatie.ta
📱 WhatsApp: +40 7XX XXX XXX

Răspundem în 24h pe email, 4h pe WhatsApp în programul de 
lucru (Luni-Vineri 9:00-18:00).
```

### 11.3. Self-service v2 planificat

- Self-service simplu: nr înmatriculare, adresă, kilometraj, ITP, telefon.
- Cu review intern: adăugare șofer, schimbare nume, cesiune.

---

## 12. Integrare asigurători

### 12.1. Strategie

- **v1:** Safety Broker mocked (adapter pattern complet, mock dynamic per asigurător cu rules-engine real bazat pe input).
- **v2:** Safety Broker real (single integration cu agregator).
- **v3:** Direct API per top 3 asigurători (eazy.insure, Asirom, Generali) pentru optimizare comision.

### 12.2. Adapter pattern

```typescript
// packages/insurers/src/types.ts
export interface InsurerAdapter {
  code: string;
  name: string;
  isActive: boolean;
  
  fetchQuote(input: QuoteInput): Promise<QuoteResponse>;
  emitPolicy(input: EmitInput): Promise<PolicyResponse>;
  cancelPolicy(input: CancelInput): Promise<CancelResponse>;
  getPolicyDocument(policyId: string): Promise<{ pdf: Buffer; ipid?: Buffer }>;
}

// packages/insurers/src/eazy/adapter.ts
export class EazyAdapter implements InsurerAdapter {
  code = 'eazy';
  name = 'eazy.insure';
  isActive = true;
  
  async fetchQuote(input: QuoteInput): Promise<QuoteResponse> {
    if (process.env.NODE_ENV === 'production' && process.env.EAZY_API_KEY) {
      return this.fetchQuoteReal(input);
    }
    return this.fetchQuoteMock(input);
  }
  
  private async fetchQuoteMock(input: QuoteInput): Promise<QuoteResponse> {
    // Logic real bazat pe input: vehicul vechi → mai scump,
    // BAAR risc ridicat → unavailable, decontare directă +10%, etc.
    const basePrice = calculateBasePrice(input.vehicle, input.owner);
    const directSettlementDelta = basePrice * 0.1;
    
    return {
      premium_net: basePrice * 0.95,
      broker_commission: basePrice * 0.05,
      total_amount: basePrice,
      bonus_malus_class: 'B6',
      direct_settlement_delta: directSettlementDelta,
      excluded_countries: ['AZ', 'BY', 'IR', 'RUS', 'UA'],
      external_offer_code: nanoid(),
      is_available: true,
    };
  }
  
  private async fetchQuoteReal(input: QuoteInput): Promise<QuoteResponse> {
    // v2 real API call
    const response = await fetch('https://api.eazy.insure/quotes', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.EAZY_API_KEY}` },
      body: JSON.stringify(this.mapInputToEazyFormat(input)),
    });
    return this.mapEazyResponseToStandard(await response.json());
  }
}

// packages/insurers/src/registry.ts
export const insurers: Record<string, InsurerAdapter> = {
  eazy: new EazyAdapter(),
  asirom: new AsiromAdapter(),
  generali: new GeneraliAdapter(),
  grawe: new GraweAdapter(),
  groupama: new GroupamaAdapter(),
  hellas: new HellasDirectAdapter(),
  omniasig: new OmniasigAdapter(),
  axeria: new AxeriaAdapter(),
  allianz: new AllianzAdapter(),
};

// apps/web/api/quote.ts
export async function getQuotes(input: QuoteInput) {
  const cacheKey = hashQuoteInput(input);
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  const offers = await Promise.all(
    Object.values(insurers)
      .filter(i => i.isActive)
      .map(i => 
        Promise.all([12, input.duration_secondary].map(months =>
          i.fetchQuote({ ...input, months })
            .catch(err => ({ insurer: i.code, error: err.message }))
        ))
      )
  );
  
  await redis.set(cacheKey, JSON.stringify(offers), 'EX', 300);  // 5min cache
  return offers;
}
```

### 12.3. BAAR risc ridicat handling

```
Caz 1: 9 oferte returnate → flow normal pas 4.

Caz 2: 3-8 oferte → banner discret deasupra listei:
  "ℹ️ Ai mai puține oferte decât de obicei. Dacă ai istoric 
  de daune, e posibil să fii la categoria 'risc ridicat'.
  [Află mai mult la BAAR →]"

Caz 3: 1-2 oferte → banner mai vizibil + listă.

Caz 4: 0 oferte → ecran dedicat:
  ⚠️ Niciun asigurător nu a putut emite poliță pentru tine.
  Te încadrezi la categoria 'asiguraților cu risc ridicat'.
  Conform metodei BAAR, poți solicita alocarea unui asigurător 
  direct la BAAR.
  
  Tarif de referință BAAR: 1.152,20 RON
  
  [Mergi la BAAR →] (link extern baar.ro/asigurati-cu-risc-ridicat)
  
  Sau scrie-ne la suport@aplicatie.ta și te ghidăm.
```

Eveniment `high_risk_detected` în PostHog + lead salvat DB pentru follow-up.

---

## 13. Documente: talon, CI, polițe

### 13.1. Tipuri documente

| Tip | Source | Storage | Retention |
|---|---|---|---|
| Talon (foto) | Upload user via OCR landing | Hetzner S3 | 5 ani |
| CI / BI / Pașaport (foto) | Upload user via OCR | Hetzner S3 | 5 ani |
| Contract leasing | Upload pas 2 condițional | Hetzner S3 | 5 ani |
| Documente justificative ("în vederea înmatriculării") | Upload pas 1 condițional | Hetzner S3 | 5 ani |
| Poliță PDF | Primit de la asigurător prin API | Hetzner S3 | 7 ani (legal) |
| IPID PDF | Primit de la asigurător prin API | Hetzner S3 | 7 ani |
| Documente anulare | Upload user în wizard | Hetzner S3 | 7 ani |

### 13.2. Storage S3 (Hetzner)

```
hetzner-s3://aplicatie-documents/
├── users/
│   └── <user_id>/
│       ├── identity/
│       │   ├── ci-<timestamp>.jpg
│       │   └── passport-<timestamp>.pdf
│       ├── vehicles/
│       │   └── <vehicle_id>/
│       │       ├── talon-<timestamp>.jpg
│       │       └── leasing-contract-<timestamp>.pdf
│       └── policies/
│           └── <policy_id>/
│               ├── policy.pdf
│               ├── ipid.pdf
│               └── addendum-<n>.pdf

hetzner-s3://aplicatie-documents-versions/  (versioning enabled)
```

**Acces:** signed URLs cu expiry 5 min. Niciodată public direct access.

**Hash integritate:** SHA-256 al fiecărui fișier stocat în `documents.metadata`. Verificare la download.

### 13.3. Emitere poliță (hibrid sincron+async)

```typescript
async function emitPolicy(quoteOfferId: string) {
  const offer = await db.select().from(quote_offers).where(eq(quote_offers.id, quoteOfferId));
  const insurer = insurers[offer.insurer_code];
  
  // Pas 1: cere emitere
  const emitResult = await Promise.race([
    insurer.emitPolicy({ offerCode: offer.external_offer_code }),
    new Promise((_, reject) => setTimeout(() => reject('timeout'), 10000)),
  ]);
  
  if (emitResult === 'timeout') {
    // Async path: notify user "se procesează", continue în background
    await db.insert(policies).values({ ...offer, status: 'pending' });
    queueBackgroundEmission(quoteOfferId);
    return { status: 'pending', message: 'Polița se procesează la asigurător' };
  }
  
  // Sync path: pollte 10s reușit
  const pdfBuffer = await insurer.getPolicyDocument(emitResult.policyNumber);
  const pdfHash = sha256(pdfBuffer);
  const s3Url = await uploadToS3(pdfBuffer, `policies/${policyId}/policy.pdf`);
  
  await db.insert(policies).values({
    ...offer,
    policy_number: emitResult.policyNumber,
    pdf_url: s3Url,
    pdf_hash: pdfHash,
    status: 'active',
    issued_at: new Date(),
  });
  
  await sendEmail({ template: 'policy_issued', to: user.email, attachments: [pdfBuffer] });
  
  return { status: 'issued', policyId };
}
```

---

## 14. Plată Stripe

### 14.1. Metode acceptate v1

- Card (Visa / Mastercard / Maestro / American Express dacă acceptat).
- Apple Pay (iOS Safari / Mac Safari).
- Google Pay (Android Chrome / Desktop Chrome).
- Stripe Link (cont Stripe Link cu metode salvate cross-merchant).

### 14.2. Implementare

```typescript
// apps/web/api/payments/create-intent.ts
export async function POST(req: Request) {
  const { offerId } = await req.json();
  const userId = await getClerkUserId(req);
  
  const offer = await db.query.quote_offers.findFirst({
    where: eq(quote_offers.id, offerId),
  });
  
  const stripeCustomer = await getOrCreateStripeCustomer(userId);
  
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(parseFloat(offer.total_amount) * 100), // bani
    currency: 'ron',
    customer: stripeCustomer.id,
    automatic_payment_methods: { enabled: true },  // ApplePay/GPay/Link auto
    metadata: {
      user_id: userId,
      quote_offer_id: offerId,
      insurer_code: offer.insurer_code,
    },
  });
  
  await db.insert(payments).values({
    user_id: userId,
    quote_offer_id: offerId,
    stripe_payment_intent_id: intent.id,
    amount: offer.total_amount,
    status: 'pending',
  });
  
  return Response.json({ clientSecret: intent.client_secret });
}
```

```tsx
// apps/web/app/checkout/[offerId]/page.tsx
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function Checkout({ params }: { params: { offerId: string } }) {
  const [clientSecret, setClientSecret] = useState<string>();
  
  useEffect(() => {
    fetch(`/api/payments/create-intent`, {
      method: 'POST',
      body: JSON.stringify({ offerId: params.offerId }),
    })
      .then(r => r.json())
      .then(d => setClientSecret(d.clientSecret));
  }, []);
  
  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret, locale: 'ro' }}>
      <PaymentElement />
      <ConfirmButton clientSecret={clientSecret} />
    </Elements>
  ) : <Skeleton />;
}
```

### 14.3. Webhook handler

```typescript
// apps/web/api/webhooks/stripe.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  
  // Idempotency check
  const exists = await db.query.webhook_events.findFirst({
    where: eq(webhook_events.event_id, event.id),
  });
  if (exists) return new Response('OK', { status: 200 });
  
  await db.insert(webhook_events).values({
    source: 'stripe',
    event_id: event.id,
    payload: event,
  });
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
  }
  
  return new Response('OK', { status: 200 });
}

async function handlePaymentSuccess(intent: Stripe.PaymentIntent) {
  const payment = await db.update(payments)
    .set({ status: 'succeeded', completed_at: new Date(), payment_method: extractMethod(intent) })
    .where(eq(payments.stripe_payment_intent_id, intent.id))
    .returning();
  
  // Trigger emisie poliță
  const policy = await emitPolicy(payment[0].quote_offer_id);
  
  // Email user cu poliță atașată
  await sendPolicyIssuedEmail(payment[0].user_id, policy.id);
}
```

### 14.4. Refund flow

- **Drept retragere ≤14d:** auto la cerere user (descris pas 10.3).
- **Restul cazuri:** manual prin admin Refine, după aprobare asigurător.

```typescript
async function refundPayment(paymentId: string, amount: number) {
  const payment = await db.query.payments.findFirst({ where: eq(payments.id, paymentId) });
  
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripe_payment_intent_id,
    amount: Math.round(amount * 100),
  });
  
  await db.update(payments).set({ status: 'refunded' }).where(eq(payments.id, paymentId));
  
  await sendEmail({ template: 'refund_processed', to: user.email, data: { amount } });
}
```

---

## 15. Email + SMS

### 15.1. Resend — email transactional

**Sender domains setup (DKIM/SPF/DMARC root + senders):**
- `noreply@aplicatie.ta` — confirmări auto, OTP, system.
- `policy@aplicatie.ta` — emisii poliță, addendum, anulări.
- `reminder@aplicatie.ta` — reminders 60d/30d expirare.
- `support@aplicatie.ta` — răspunsuri suport (manual via Inbox dedicate).

### 15.2. React Email templates

```
packages/email-templates/src/
├── policy-issued.tsx          # post-emitere
├── otp-verification.tsx       # cod 6 cifre Email OTP Clerk
├── welcome.tsx                # post-prima poliță
├── reminder-60d.tsx           # 60 zile înainte expirare
├── reminder-30d.tsx           # 30 zile înainte
├── abandoned-cart-1h.tsx      # 1h după abandonare
├── refund-processed.tsx       # confirmare refund
├── cancellation-confirmation.tsx
├── account-deleted.tsx        # GDPR delete
└── consent-updated.tsx        # T&C re-consent prompt
```

Exemplu `policy-issued.tsx`:

```tsx
import { Html, Head, Body, Container, Heading, Text, Button, Section, Img } from '@react-email/components';

export default function PolicyIssued({ user, policy, vehicle, insurer, pdfUrl }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f6f9fc' }}>
        <Container>
          <Img src="https://aplicatie.ta/logo.png" alt="Aplicatie.ta" width="120" />
          <Heading>Polița ta RCA a fost emisă!</Heading>
          <Text>Salut {user.firstName},</Text>
          <Text>Polița ta RCA pentru {vehicle.plateNumber} a fost emisă cu succes la {insurer.name}.</Text>
          
          <Section>
            <Text><strong>Poliță #</strong> {policy.policyNumber}</Text>
            <Text><strong>Perioadă:</strong> {policy.startDate} - {policy.endDate}</Text>
            <Text><strong>Total plătit:</strong> {policy.totalAmount} RON</Text>
          </Section>
          
          <Button href={pdfUrl}>Descarcă poliță PDF</Button>
          <Button href={`https://aplicatie.ta/cont/polite/${policy.id}`}>Vezi în cont</Button>
          
          <Text>Polița este atașată acestui email și este disponibilă oricând în cont.</Text>
          <Text>Vom trimite reminder cu 60 zile înainte de expirare pentru reînnoire ușoară.</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### 15.3. Twilio — SMS reminder

```typescript
// packages/notifications/src/sms.ts
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export async function sendReminderSMS(user: User, policy: Policy) {
  if (!user.preferences.sms_reminders) return;
  
  const link = await generateShortLink(`/r/${policy.id}`);
  const body = `Polita RCA pentru ${policy.plateNumber} expira pe ${formatDate(policy.endDate)}.\nReinnoieste acum: ${link}\nSTOP la 7575 pentru oprire.`;
  
  await client.messages.create({
    from: 'AplicTaRCA',  // alphanumeric sender ID
    to: user.phone,
    body,
  });
  
  await db.insert(notifications_log).values({
    user_id: user.id,
    policy_id: policy.id,
    channel: 'sms',
    template_key: 'reminder_7d',
    recipient: user.phone,
    status: 'sent',
    sent_at: new Date(),
  });
}
```

### 15.4. Cron job reminders

```typescript
// apps/web/api/cron/send-reminders.ts (Vercel Cron, daily 08:00 RO)
export async function GET() {
  const today = new Date();
  
  // 60 zile email
  const policies60d = await db.select().from(policies).where(
    and(
      eq(differenceInDays(policies.end_date, today), 60),
      eq(policies.status, 'active'),
    )
  );
  for (const p of policies60d) {
    if (await alreadySent(p.id, 'reminder_60d')) continue;
    if (!user.preferences.email_reminders) continue;
    await sendReminderEmail(user, p, 'reminder_60d');
  }
  
  // 30 zile email
  const policies30d = await db.select().from(policies).where(...);
  for (const p of policies30d) {
    if (await isRenewed(p)) continue;  // skip dacă deja reînnoit
    if (await alreadySent(p.id, 'reminder_30d')) continue;
    await sendReminderEmail(user, p, 'reminder_30d');
  }
  
  // 7 zile SMS
  const policies7d = await db.select().from(policies).where(...);
  for (const p of policies7d) {
    if (await isRenewed(p)) continue;
    if (await alreadySent(p.id, 'reminder_7d')) continue;
    await sendReminderSMS(user, p);
  }
  
  // 1h abandoned cart email
  const abandonedCarts = await db.select().from(quote_searches).where(
    and(
      eq(quote_searches.status, 'pending'),
      eq(differenceInHours(today, quote_searches.created_at), 1),
    )
  );
  for (const cart of abandonedCarts) {
    if (await alreadySent(cart.id, 'abandoned_cart_1h')) continue;
    await sendAbandonedCartEmail(cart);
  }
}
```

---

## 16. Cookies, GDPR și legal

### 16.1. Cookie banner custom

**Default state — banner bottom (mobile sticky):**

```
┌─────────────────────────────────────────────────────┐
│ 🍪 Folosim cookies                                  │
│                                                     │
│ Cookies necesare pentru funcționare. Cu acordul    │
│ tău, folosim și cookies pentru analytics și        │
│ marketing pentru a îmbunătăți experiența.          │
│                                                     │
│ [Personalizează] [Refuză tot] [Accept toate ✓]     │
└─────────────────────────────────────────────────────┘
```

**Click "Personalizează" → modal:**

```
┌─── Preferințe cookies ─────────────────────────────┐
│                                                    │
│ ☑ Necesare (mereu active)                          │
│   Auth, sesiune, securitate. Nu pot fi dezactivate│
│                                                    │
│ ☐ Funcționale                                      │
│   Preferințe limbă, formuri pre-completate         │
│                                                    │
│ ☐ Analytics                                        │
│   PostHog — analizăm utilizarea pentru a           │
│   îmbunătăți produsul. Date anonimizate.           │
│                                                    │
│ ☐ Marketing                                        │
│   Google Ads, Meta Pixel — pentru a măsura         │
│   eficiența publicității.                          │
│                                                    │
│           [Salvează preferințe]  [Accept toate]   │
└────────────────────────────────────────────────────┘
```

**Implementare:**
- Persistare cookie `cookie_consent` cu jsonb (categorii bifate + version).
- `version` permite re-prompt la schimbare T&C.
- Logging în `consents_log` pentru GDPR proof.
- Footer link "Schimbă preferințe cookies" → re-deschide modal.
- Bilingual RO + EN auto din `next-intl`.

```typescript
// packages/ui/src/cookie-consent.tsx
type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

const consent = useCookieConsent();

useEffect(() => {
  if (consent.analytics) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
  
  if (consent.marketing) {
    loadGoogleAdsPixel();
    loadMetaPixel();
  }
}, [consent]);
```

### 16.2. Documente legale (versionate + re-consent)

| Document | Sursă | Schemă |
|---|---|---|
| Termeni și Condiții | Template ASF + adaptare | versionat |
| Politica de Confidențialitate | Template ANSPDCP + adaptare | versionat |
| Politica Cookies | Template standard | versionat |
| Informarea Precontractuală | Template oficial ASF | versionat |
| Renunțare la consultanță | Template ASF | versionat |

**Re-consent flow:**
- Schimbare materială T&C → versiune nouă în `legal_documents`.
- La next login user → modal "Termenii s-au actualizat. Citește și acceptă pentru a continua."
- Acceptare → record în `user_consents`.

**URL stabil + versionate:**
- `/termeni` → redirect 302 la versiunea curentă.
- `/termeni/v1`, `/termeni/v2` → istoric public.

### 16.3. Endpoint-uri GDPR

- `/api/account/export` — export complet date user (JSON + PDF).
- `/api/account/delete` — soft delete + anonymize + Clerk hard delete.
- `/api/account/preferences` — update preferințe notificări/cookies.
- `/api/account/consents` — istoric consimțăminte.

### 16.4. Footer obligatoriu

```
─────────────────────────────────────────────
Aplicatie.ta — Broker autorizat ASF: RBK-XXX

Termeni · Confidențialitate · Cookies · Accesibilitate · Securitate
DPO: privacy@aplicatie.ta · Contact: support@aplicatie.ta · Status

© 2026 Aplicatie.ta SRL — CUI: XXX | J40/XXX/2026
Sediu social: [Adresă] · Tel: +40 XXX XXX XXX
─────────────────────────────────────────────
```

---

## 17. Validări și reguli RO

### 17.1. Câmpuri specifice + algoritmi

```typescript
// packages/validation/src/ro.ts

export const cnpSchema = z.string().regex(/^\d{13}$/).refine((cnp) => {
  const digits = cnp.split('').map(Number);
  const constants = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  const sum = digits.slice(0, 12).reduce((acc, d, i) => acc + d * constants[i], 0);
  let checksum = sum % 11;
  if (checksum === 10) checksum = 1;
  return checksum === digits[12];
}, { message: 'CNP invalid (cifră de control greșită)' });

export const cuiSchema = z.string().transform(s => s.replace(/^RO/i, '')).pipe(
  z.string().regex(/^\d{2,10}$/).refine((cui) => {
    const digits = cui.split('').reverse().map(Number);
    const checksum = digits[0];
    const constants = [7, 5, 3, 2, 1, 7, 5, 3, 2];
    const sum = digits.slice(1).reduce((acc, d, i) => acc + d * constants[i], 0);
    let computed = sum * 10 % 11;
    if (computed === 10) computed = 0;
    return computed === checksum;
  }, { message: 'CUI invalid (cifră de control greșită)' })
);

export const ibanRoSchema = z.string().regex(/^RO\d{2}[A-Z]{4}[A-Z0-9]{16}$/).refine((iban) => {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, c => (c.charCodeAt(0) - 55).toString());
  return BigInt(numeric) % 97n === 1n;
}, { message: 'IBAN invalid' });

export const vinSchema = z.string().length(17).regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
  message: 'VIN invalid (17 caractere alfanumerice, fără I/O/Q)',
}).refine((vin) => {
  // VIN check digit position 9 (algoritm WMI)
  const transliteration: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9,
    '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
  };
  const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  const sum = vin.split('').reduce((acc, c, i) => acc + transliteration[c] * weights[i], 0);
  const expected = sum % 11;
  const checkChar = vin[8];
  const expectedChar = expected === 10 ? 'X' : expected.toString();
  return checkChar === expectedChar;
}, { message: 'VIN check digit invalid' });

export const platRoSchema = z.string().regex(
  /^(?:[A-Z]{1,2}\d{2,3}[A-Z]{3}|[A-Z]{2}\d{2,3}[A-Z]{3})$/,
  { message: 'Număr înmatriculare invalid (format RO: BV18BFG, B123ABC)' }
);

export const phoneRoSchema = z.string().regex(
  /^(\+40|0)(7\d{8}|2\d{8}|3\d{8})$/,
  { message: 'Telefon RO invalid' }
).transform(p => p.startsWith('0') ? `+40${p.slice(1)}` : p);

export const codPostalRoSchema = z.string().regex(/^[1-8]\d{5}$/);
```

### 17.2. Strategie validare

- **Validare client + server (Zod schemas shared via monorepo).**
- **onBlur** — feedback la pierderea focus-ului (decizia stack `validation onblur`).
- Excepție: format live pentru CNP/VIN (auto-spacing fără mesaje până onBlur).
- **Cross-field warnings** (non-blocking):
  - CNP → data nașterii → an permis ≥ data naștere + 18.
  - VIN → decoder → marca/model match cu ce a tipărit user (warning).
  - Data fabricație ≤ data primei înmatriculări.
  - Masă maximă vs categorie vehicul (N1 ≤ 3500 kg).

### 17.3. RHF + Zod integration

```tsx
const PersonForm = () => {
  const form = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
    mode: 'onBlur',
  });
  
  return (
    <Form {...form}>
      <FormField name="cnp" render={({ field }) => (
        <FormItem>
          <FormLabel>CNP *</FormLabel>
          <FormControl><Input {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      {/* ... */}
    </Form>
  );
};
```

---

## 18. Admin (Refine.dev)

### 18.1. App separat în monorepo

`apps/admin/` — Next.js + Refine.dev cu shadcn/ui adapter.

### 18.2. Auth gating

```typescript
// apps/admin/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') ?? [];

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();
  const email = sessionClaims?.email as string;
  
  if (!userId || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});
```

v1: email allowlist `ADMIN_EMAILS=filip@lazuli.tech`. v2: Clerk roles `admin/operator/read_only` la primul angajat.

### 18.3. Pagini Refine v1

- **Dashboard** — metrici cheie (polițe săpt/lună, refund pending, lead BAAR, conversion funnel, MRR).
- **Polițe** — listă cu filtre (status, asigurător, perioadă), CRUD limited (read full + edit limited + cancel workflow).
- **Cereri anulare** — listă pending review, detalii + documente uploaded, butoane Approve/Reject + comment + Stripe refund button.
- **Useri** — listă, search după CNP HMAC / email / nume, view detail (cu **Decrypt PII** gated cu reason input + audit log entry).
- **Plăți** — tracking Stripe payments, refund manual, link la Stripe Dashboard.
- **Leads BAAR** — risc ridicat detectați, follow-up status, contact email.
- **Asigurători** — config per asigurător (active/inactive, comision broker, API credentials secret IDs).
- **Companii leasing** — CRUD lookup table.
- **Audit log** — read-only, search per user/action/date/IP.
- **Documente legale** — versioning T&C + Privacy + Cookies, publish flow.
- **Setări** — flags business (modă mentenanță, max % comision, A/B feature flags status).

### 18.4. Data provider Refine custom

```typescript
// apps/admin/src/data-provider.ts
import { DataProvider } from '@refinedev/core';
import { client } from '@/lib/orpc-client';

export const orpcDataProvider: DataProvider = {
  async getList({ resource, pagination, filters, sorters }) {
    const result = await client.admin[resource].list.query({ pagination, filters, sorters });
    return { data: result.data, total: result.total };
  },
  async getOne({ resource, id }) {
    return await client.admin[resource].get.query({ id });
  },
  async update({ resource, id, variables }) {
    return await client.admin[resource].update.mutate({ id, ...variables });
  },
  // ...
};
```

### 18.5. Decrypt PII workflow

```tsx
// apps/admin/src/components/decrypt-pii-button.tsx
const DecryptButton = ({ field, recordId }: Props) => {
  const [reason, setReason] = useState('');
  const [decrypted, setDecrypted] = useState<string>();
  
  const handleDecrypt = async () => {
    if (!reason) return alert('Reason required');
    
    const result = await client.admin.persons.decryptField.mutate({
      recordId,
      field,
      reason,
    });
    
    // Server-side: log to audit_log + decrypt
    setDecrypted(result.value);
  };
  
  return decrypted ? (
    <span>{decrypted}</span>
  ) : (
    <Dialog>
      <DialogTrigger>Reveal</DialogTrigger>
      <DialogContent>
        <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Motivul accesării..." />
        <Button onClick={handleDecrypt}>Decrypt</Button>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 19. API public

### 19.1. Scope v1 — limited mutations

Endpoint-uri publice (pentru WhatsApp bot v2 + integrări 3rd-party future):

- `POST /api/v1/quotes` — creare quote search (cere date complete).
- `GET /api/v1/quotes/:id` — get oferte.
- `POST /api/v1/policies` — emite poliță dintr-o ofertă selectată.
- `GET /api/v1/policies/:id` — status poliță.

**NU public:**
- Anulare poliță, modificare poliță, ștergere cont (acestea via app principală).

### 19.2. Autentificare

**Bearer tokens v1:**

```typescript
// packages/api/src/auth.ts
export async function authenticateApiKey(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) throw new ORPCError('UNAUTHORIZED');
  
  const apiKey = auth.slice(7);
  const apiKeyHash = bcrypt.hashSync(apiKey, 10);
  
  const client = await db.query.api_clients.findFirst({
    where: and(
      eq(api_clients.api_key_hash, apiKeyHash),
      eq(api_clients.active, true),
      isNull(api_clients.revoked_at),
    ),
  });
  
  if (!client) throw new ORPCError('UNAUTHORIZED');
  
  await db.update(api_clients).set({ last_used_at: new Date() }).where(eq(api_clients.id, client.id));
  
  return client;
}
```

### 19.3. Rate limiting (Upstash)

```typescript
// packages/api/src/middleware/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  prefix: 'api:public',
});

export const ratelimitMiddleware = oc.middleware(async ({ ctx, next }) => {
  const apiClient = ctx.apiClient;
  const { success, limit, remaining, reset } = await ratelimit.limit(apiClient.id);
  
  if (!success) {
    throw new ORPCError('TOO_MANY_REQUESTS', {
      message: `Rate limit exceeded. Reset at ${new Date(reset).toISOString()}`,
    });
  }
  
  return next();
});
```

### 19.4. oRPC + OpenAPI export

```typescript
// packages/api/src/router.ts
import { oc } from '@orpc/server';
import { OpenAPIHandler } from '@orpc/openapi';

export const apiRouter = oc.router({
  quotes: {
    create: oc
      .use(ratelimitMiddleware)
      .input(QuoteInputSchema)
      .output(QuoteOutputSchema)
      .handler(async ({ input, ctx }) => {
        // ...
      }),
    get: oc.input(z.object({ id: z.string().uuid() })).output(QuoteOutputSchema).handler(...),
  },
  policies: {
    create: oc.input(EmitInputSchema).output(PolicyOutputSchema).handler(...),
    get: oc.input(z.object({ id: z.string().uuid() })).output(PolicyOutputSchema).handler(...),
  },
});

// OpenAPI generation pentru docs.aplicatie.ta
export const openapiHandler = new OpenAPIHandler(apiRouter, {
  info: { title: 'Aplicatie.ta API', version: '1.0.0' },
  servers: [{ url: 'https://aplicatie.ta/api/v1' }],
});
```

`apps/docs/` = Next.js cu Mintlify-style API docs auto-generated din OpenAPI spec.

### 19.5. Versionare

- URL prefix `/api/v1/`.
- Breaking changes → `/api/v2/`. v1 menținut min 12 luni.
- Documentat clar în `docs.aplicatie.ta/changelog`.

---

## 20. Mobile (Expo)

### 20.1. Paritate completă cu web

Toate flow-urile (emitere, cont, polițe, anulare ≤14d, modificare via support) disponibile în app.

### 20.2. Componente shared (monorepo)

- `packages/api/` — oRPC client + Zod schemas (same client web + mobile).
- `packages/validation/` — RO validators.
- `packages/i18n/` — translations RO + EN.
- `packages/insurers/` — adapter pattern (server-side only).

### 20.3. Componente specifice mobile

- **UI:** React Native primitives + Tamagui sau NativeBase (consistency cu shadcn/ui design tokens via shared `packages/config/tailwind.preset`).
- **File upload:** camera nativă + galerie (`expo-image-picker`).
- **Stripe:** `@stripe/stripe-react-native` cu Stripe PaymentSheet pentru native UX.
- **Deep links:** `aplicatie.ta://renew/[policy_id]` pentru reminder SMS link → deschide app dacă instalată.
- **Push notifications:** Expo Notifications + APNs/FCM.
- **Auth:** Clerk Expo SDK cu Email OTP.

### 20.4. Push notifications

Triggere:
- Poliță emisă async (post-checkout când asigurător returnează PDF).
- Plată reușită/eșuată.
- Reminder 30d, 7d (alternative la email/SMS dacă opt-in push).
- Cerere anulare aprobată.

```typescript
// apps/mobile/src/notifications.ts
import * as Notifications from 'expo-notifications';

export async function registerForPush() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;
  
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  await client.devices.register.mutate({
    expo_token: token,
    platform: Platform.OS,
  });
  
  return token;
}
```

### 20.5. Build + deploy

- **EAS Build** — automated build pentru iOS + Android via GitHub Actions trigger.
- **EAS Submit** — auto-submit la App Store Connect + Google Play Console.
- **OTA updates** — Expo Updates pentru hot fixes JS-only fără App Store re-review.

---

## 21. Internaționalizare (RO + EN)

### 21.1. Stack

- **Web:** `next-intl` (path-based routing `/ro/...`, `/en/...`).
- **Mobile:** `expo-localization` + `i18n-js` cu shared keys din `packages/i18n/`.

### 21.2. Detectare limbă

- Default: detect browser/device → fallback RO.
- Persistare în cookie `NEXT_LOCALE` + `user.preferences.locale` la cont.
- Switch în topbar (icon globe + dropdown RO/EN) + în profil.

### 21.3. Conținut tradus

✅ UI complet (buttons, labels, errors, empty states, FAQ).
✅ Email templates (RO + EN per template).
✅ Cookie banner.
✅ Pagini SEO (homepage, /securitate, /cum-functioneaza, /preturi, etc.).

❌ Documente legale (T&C, Privacy, IPID asigurători, polița PDF) = **doar RO**, conform Legea 132/2017. Disclaimer EN: "Documents are in Romanian as required by law."

---

## 22. Marketing + SEO

### 22.1. Strategie hibrid SEO + paid

- **SEO foundation** — landing pages targetate + sitemap + OG tags + JSON-LD din launch.
- **Paid acquisition** — Google Ads + Meta Ads pentru launch traction (3 luni budget concentrat).
- **Influencer / content** = v2 dacă conversion economy permite.

### 22.2. Landing pages v1

- `/` — homepage cu drag-drop OCR + 9 asigurători highlight.
- `/securitate` — narrative tehnologie (encryption, KMS, audit, GDPR).
- `/cum-functioneaza` — flow detaliat 4 pași + screenshots.
- `/preturi` — explicație preț, comision broker, transparență.
- `/baar-risc-ridicat` — info pentru cei refuzați (link extern baar.ro).
- `/leasing` — info pentru companii leasing (top 25 listate cu logos).
- `/persoane-juridice` — segment PJ dedicate cu Garaj flotă.
- `/asigurari/rca` — anchor pagină RCA.
- `/intrebari-frecvente` — FAQ extins long-tail SEO.
- `/contact` — formular suport + DPO + program program.
- `/accesibilitate` — declarație conformitate WCAG 2.2 AA + contact a11y.
- `/termeni`, `/confidentialitate`, `/cookies` — legal.
- `/sign-in`, `/sign-up` — auth Clerk.
- `/cont/*` — protected zone.
- `/checkout/[offerId]` — flow.
- `/thank-you` — post-plată.

### 22.3. SEO basics

- **next-sitemap** — auto-generate sitemap.xml + robots.txt.
- **Next.js metadata API** — OG tags + Twitter Cards per page.
- **JSON-LD structured data:**
  - FAQPage pentru `/intrebari-frecvente`.
  - Organization pentru homepage.
  - Article pentru blog (v2).
  - Product pentru `/asigurari/rca`.
- **Canonical URLs** pe toate pagini.
- **Multi-locale alternates** RO + EN.

### 22.4. Conversion tracking ads

**v1:**
- PostHog pentru product analytics + funnels.
- **Pixel hardcoded direct** în Next.js `<Script>`:
  - Google Ads conversion tag (`gtag.js`).
  - Meta Pixel (`fbq.js`).
- Trigger pe `purchase` event la `/thank-you`.

**v2:**
- Server-side **Meta CAPI** (Conversions API) — backend POST la Meta cu hashed user data, bypass ad-blockers.
- Server-side **Google Enhanced Conversions** — similar pentru Google Ads.
- More accurate, GDPR-friendly.

---

## 23. Analytics + observability

### 23.1. PostHog (product analytics)

- **Region:** EU cloud.
- **Capabilities:** events + funnels + sessions replay + feature flags + A/B testing.
- **Opt-in:** doar cu cookie `analytics: true` din banner.

**Events critical (vezi secțiune 32):**
- `landing_view`
- `vin_search_clicked`
- `documents_uploaded`
- `step_1_completed`
- `email_otp_sent`
- `email_otp_verified`
- `step_2_completed`
- `step_3_completed`
- `quote_offers_loaded`
- `offer_selected`
- `checkout_started`
- `payment_succeeded`
- `policy_issued`
- `cancellation_requested`
- `high_risk_detected`

### 23.2. Sentry (error tracking + APM)

- **Region:** EU.
- **Integrations:** Next.js plugin + Expo plugin + Drizzle.
- **Source maps** uploaded per deploy.
- **Replay user pe error** — vezi exact ce a făcut user-ul înainte de crash.
- **Alerts** Slack/Discord pentru critical errors în prod.

### 23.3. Vercel Analytics + Speed Insights

- **Web Vitals RUM** automat (LCP, INP, CLS, FCP, TTFB).
- **Real users** vs synthetic (Lighthouse CI).

### 23.4. Axiom (logs)

- **Vercel log drain** automat → Axiom EU.
- **Structured logs** server-side (Pino + structured JSON).
- **Search + alerts** pentru patterns suspecte (failed payments, encryption errors, etc.).

### 23.5. Uptime Kuma (status page)

- **Self-host pe Hetzner Cloud** (CX11 €4/lună).
- **Monitor:**
  - aplicatie.ta (web)
  - api.aplicatie.ta (oRPC)
  - admin.aplicatie.ta
  - Stripe webhook endpoint
  - Resend, Twilio, Document AI, Hetzner S3
- **Public status page:** `status.aplicatie.ta` (CNAME la VPS).
- **Alerts:** Discord, Slack, email native.

---

## 24. Performance + accessibility

### 24.1. Core Web Vitals targets (aspirational)

- **LCP** (Largest Contentful Paint): <1.5s (Excellent threshold).
- **INP** (Interaction to Next Paint): <100ms.
- **CLS** (Cumulative Layout Shift): <0.05.

**NOTĂ:** challenging cu Stripe Elements + analytics. Soluții:
- Code splitting agresiv (Stripe doar pe checkout).
- Lazy load PostHog post-paint.
- Defer GTM/pixel scripts.
- Skeleton screens reduce LCP perceput.

### 24.2. Bundle size budgets

- Homepage: <200KB JS gzipped.
- Restul pagini: <400KB JS gzipped.
- CSS: <50KB gzipped per page.

### 24.3. Lighthouse CI (synthetic tests în GHA)

```yaml
# .github/workflows/lighthouse.yml
- uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://${{ env.PREVIEW_URL }}
      https://${{ env.PREVIEW_URL }}/cum-functioneaza
      https://${{ env.PREVIEW_URL }}/intrebari-frecvente
    budgetPath: './lighthouse-budget.json'
    uploadArtifacts: true
```

**Targets:**
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

PR fail dacă score scade sub threshold.

### 24.4. Accessibility (WCAG 2.2 AA)

- **shadcn/ui** + Radix UI = a11y default (focus management, ARIA, keyboard nav).
- **React Native** = `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`.
- **Linting:** `eslint-plugin-jsx-a11y` + `react-native/a11y` rules.
- **E2E testing:** Playwright + axe-core scan pe critical pages.
- **Manual audit pre-launch:** VoiceOver (iOS), TalkBack (Android), NVDA (Windows).
- **Pagina `/accesibilitate`** — declarație conformitate + contact `accesibilitate@aplicatie.ta`.

### 24.5. Image optimization

- **Next.js `<Image>`** auto WebP/AVIF + responsive srcset.
- **SVG manual** pentru logo asigurători + iconițe.
- **Lazy loading** default.

---

## 25. Dev environments

### 25.1. 4 environments

1. **dev** local (`pnpm dev`) — laptop tău, hot reload.
2. **preview** — automat per PR via Vercel preview deployments. Folosește staging credentials.
3. **staging** — `staging.aplicatie.ta`, sticky deployment pe branch `staging`. Persistent state, real testing.
4. **prod** — `aplicatie.ta`, deploy on merge to `main`.

### 25.2. Credentials per environment

**Test/sandbox keys peste tot non-prod:**
- Stripe test mode (`sk_test_...`).
- Clerk dev environment (separate user pool).
- GCP KMS dev project (`aplicatie-staging-kms`).
- Resend test domain (`onresend.com`).
- Twilio test creds (no real SMS sent).
- Document AI staging processor.

**Production keys** doar pe prod, never staging.

### 25.3. Configurare Vercel

```
# .env.local (dev, gitignored)
NEXT_PUBLIC_STRIPE_PK=pk_test_...
STRIPE_SK=sk_test_...

# Vercel env vars (UI):
# Scope: Preview → test keys
# Scope: Production (staging.aplicatie.ta domain only) → test keys
# Scope: Production (aplicatie.ta domain only) → real keys
```

### 25.4. Neon branches

- **Killer feature Neon:** branch nou = 1 sec, copy-on-write.
- **Per PR** automat → DB branch ramificat din `main`.
- **Staging** → branch `staging` persistent.
- **Prod** → branch `main`.

### 25.5. Seed data staging

Script `pnpm seed:staging`:
- 50 useri Clerk de test.
- 100 polițe diverse (PJ, leasing, BAAR, anulări active, expired).
- Vehicule din toate categoriile.
- Cazuri edge: "în vederea înmatriculării", șoferi multipli, decontare directă.

---

## 26. CI/CD

### 26.1. GitHub Actions + Vercel + EAS

**Pipeline GHA pe push/PR:**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo test
      - run: pnpm turbo test:e2e

  build:
    runs-on: ubuntu-latest
    needs: [lint-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm audit --audit-level=high
      - uses: trufflesecurity/trufflehog@main
      - uses: google/osv-scanner-action@v1.7.4

  schema-drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:check  # drizzle-kit check
```

**Vercel** = auto preview pe PR + auto prod on merge.

**EAS** = trigger manual din UI sau `eas build --auto-submit` la release.

### 26.2. Branch strategy — GitHub Flow

- `main` = stable, production.
- Feature branches: `feat/landing-vin-search`, `fix/cnp-validator-bug`.
- Push → preview deploy automat.
- PR → CI green + 1 review (sau self-review v1).
- Merge to `main` → prod deploy + DB migration auto + Sentry release notify.

### 26.3. Tests pyramid

**Vitest unit/integration:**
- Zod schemas + RO validators: 90%+ coverage.
- Business logic (refund calc, durata calc, etc.): 80%+.
- API handlers (oRPC): 60%+.
- UI components: 40%+ (critical path priority).

**Playwright E2E pe critical paths:**
- Sign-up flow (Clerk OTP).
- Emit RCA happy path (dialog cu Stripe test mode).
- Anulare ≤14d auto.
- Mobile flow (Expo via Detox sau Maestro v2).

### 26.4. Database migrations workflow

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy production

on:
  push:
    branches: [main]

jobs:
  deploy-staging-first:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: vercel deploy --target=staging
      - run: pnpm db:migrate --neon-branch=staging

  deploy-prod:
    needs: deploy-staging-first
    runs-on: ubuntu-latest
    environment: production
    # MANUAL APPROVAL GATE prin GitHub Environments
    steps:
      - run: vercel deploy --prod
      - run: pnpm db:migrate --neon-branch=main
      - uses: getsentry/action-release@v1
```

---

## 27. Database migrations

### 27.1. Drizzle Kit workflow

```bash
# Local dev
pnpm db:generate    # creează migration din schema.ts changes
pnpm db:migrate     # aplică pe Neon dev branch
pnpm db:check       # verify schema drift

# Production via GHA cu approval gate
```

**Workflow concret:**
1. Modifici `packages/db/src/schema.ts`.
2. `pnpm db:generate` → creează `packages/db/drizzle/0042_add_users_phone.up.sql`.
3. **Review SQL** generat: index? rollback-able? safe?
4. **Scrie manual** `0042_add_users_phone.down.sql` pentru rollback.
5. Commit ambele fișiere SQL + schema.ts.
6. PR review.
7. Merge → GHA aplică pe staging → manual approval → prod.

### 27.2. Down migrations

Drizzle nu suportă nativ. Wrapper script custom:

```typescript
// scripts/db-rollback.ts
async function rollback(version: number) {
  const sql = await fs.readFile(`drizzle/${version}_*.down.sql`, 'utf-8');
  await db.execute(sql);
  await db.delete(drizzleMigrations).where(eq(drizzleMigrations.id, version));
}
```

**Disclaimer:** rollback în prod cu date noi = data loss potential. Use carefully.

### 27.3. Expand-contract pattern (zero downtime)

Pentru destructive ops (DROP COLUMN, RENAME):

```
Migration 1: ADD COLUMN phone_e164 TEXT  → deploy code reading both
Migration 2: backfill phone_e164 = phone (script TS)
Migration 3: code start writing only phone_e164
Migration 4: [soak 1 day]
Migration 5: code stop reading phone (only phone_e164)
Migration 6: DROP COLUMN phone
```

5 deploys, zero downtime.

### 27.4. Schema drift CI check

```yaml
- run: pnpm db:check
  # Fail dacă schema.ts ≠ migrations dir state
```

---

## 28. Backup + disaster recovery

### 28.1. Neon backup

- **Default Neon PITR** — point-in-time recovery 30 zile (paid plan).
- **Export periodic** — Vercel Cron daily 02:00 UTC → endpoint `/api/admin/backup`:
  - `pg_dump` Neon → upload encrypted la Hetzner S3.
  - Retention: 30 daily, 12 monthly, 7 yearly.

### 28.2. Hetzner S3 documents

- **Versioning enabled** — recovery accidental delete + ransomware mitigation.
- **Redundancy default** Hetzner (multi-zone).

### 28.3. KMS keys

- **Multi-region GCP keyring** — `location: europe` (auto-replica `europe-west3` + `europe-west1`).
- 1 region down → automatic failover.

### 28.4. RTO / RPO targets

- **RTO** (Recovery Time Objective): 4 ore.
- **RPO** (Recovery Point Objective): 1 oră.

### 28.5. Disaster scenarios + runbook

| Scenario | Mitigare |
|---|---|
| Neon prod down | PITR restore în <30 min, fallback S3 backup dacă Neon fail catastrofic |
| Hetzner S3 region down | Re-fetch documente de la asigurători (au copies) + S3 backup zonă alternativă |
| Vercel down | Status pe Twitter/email, redirect la `/maintenance` static |
| KMS region down | Auto-failover multi-region |
| Stripe down | Plățile pending → auto-retry după ce e back |
| Asigurător API down | UI marchează "Indisponibil temporar" + retry exponential backoff |
| Tu indisponibil/incident | Runbook documentat: avocat backup + contabil pentru plăți + DPO contact |

**`RUNBOOK.md`** în repo cu:
- Telefoane critice (DPO, avocat, contabil, dezvoltatori contractori).
- Credentials access (1Password vault shared cu trusted partners).
- Step-by-step recovery per scenario.
- Communication templates user-facing pentru incidents.

---

## 29. A/B testing + feature flags

### 29.1. PostHog feature flags

**Day 1 launch:** infrastructure ready, dar experimente decisional după baseline 1000 useri.

### 29.2. Feature flags pentru critical paths

Selective flagging:
- `payment_processor` — toggle Stripe vs alt vendor.
- `ocr_enabled` — disable OCR la failure rate mare.
- `insurer_<code>_enabled` — toggle per asigurător.
- `pricing_changes` — modificare preț/comision.

```typescript
// packages/analytics/src/flags.ts
import { useFeatureFlagEnabled } from 'posthog-js/react';

const ocrEnabled = useFeatureFlagEnabled('ocr_enabled');

return ocrEnabled ? <DragDropZone /> : <ManualForm />;
```

### 29.3. Kill switches

**v1: NU dedicated.** Manual rollback bazat pe Sentry alerts. Recovery time mai mare, accept-able pentru v1 simplu.

### 29.4. Experiments first batch (post 1000 useri)

- **Hero headline copy:** "3 minute" vs "compari 9 asigurători instant" vs "cele mai bune oferte RCA".
- **Durată default chip:** 12L primary vs 6L primary.

---

## 30. Error / empty / loading states

### 30.1. Error states (contextual)

| Eveniment | Mesaj |
|---|---|
| Network down | Toast "Conexiune pierdută" + retry button + offline banner top |
| Asigurător API down | "Asigurătorul X temporar indisponibil. Restul ofertelor sunt afișate." |
| Stripe payment fail | Mesaj specific din Stripe + retry + schimbă metodă |
| Document AI fail | "Nu am putut citi talonul. Reîncearcă sau completează manual." + retry / skip |
| Session expired | Redirect `/sign-in?return_url=...` |
| Quote expired (24h) | "Ofertele au expirat. [Recreează căutarea →]" |
| Email OTP fail | "Cod incorect. Mai încearcă o dată sau [Trimite cod nou]" |
| 0 oferte (BAAR) | Ecran dedicat cu link extern baar.ro |

### 30.2. Empty states (custom CTA)

| Pagină | Mesaj |
|---|---|
| Cont nou fără polițe | "Aici vor apărea polițele tale. [Calculează prima oră RCA →]" |
| Garaj fără vehicule | "Adaugă primul vehicul. [Adaugă →]" |
| Persoane goale | "Salvează date proprietar pentru reutilizare. [Adaugă →]" |
| Search history goală | "Începe căutarea ta. [Calculează RCA →]" |

### 30.3. Loading states

- **Skeleton screens** pe page load (form-uri, tabele oferte, dashboard cards).
- **Optimistic UI** pe small actions (toggle decontare directă, schimbă durată dropdown).
- **Spinner generic** doar pe acțiuni async cu unknown duration (>2s).

### 30.4. Maintenance mode

```typescript
// middleware.ts
if (process.env.MAINTENANCE_MODE === 'true' && !req.url.includes('/maintenance')) {
  return NextResponse.redirect(new URL('/maintenance', req.url));
}
```

Pagina `/maintenance` static cu:
- Mesaj clar "Aplicatie.ta este în mentenanță. Revenim curând."
- Estimat timp dacă cunoscut.
- Link `status.aplicatie.ta`.
- Contact `support@aplicatie.ta`.

---

## 31. Roadmap v1 → v2 → v3

### v1 (lansare, luna 0)

- ✅ Tot ce e în secțiunea 3.1 (scope MVP inclus).

### v2 (luna 3-6 post-launch)

- Bot WhatsApp integrat cu API public.
- Self-service modificare poliță (simple cases).
- CASCO (a doua tip asigurare).
- Plată în rate prin TBI Bank.
- Help center dedicat (`help.aplicatie.ta`).
- Server-side Conversions API (Meta CAPI + Google Enhanced).
- Bulk CSV upload pentru flote PJ.
- Email/SMS marketing campaigns (cu opt-in dedicat).
- ISO 27001 audit (start proces).
- Pen-test extern (Bit Sentinel sau similar).
- Status page custom Next.js sau Uptime Kuma migrate.
- Direct API top 3 asigurători (eazy.insure, Asirom, Generali).

### v3 (luna 6-12)

- Locuință asigurare.
- Sănătate asigurare (uplift securitate medical-grade complet, full DPIA, DPO extern).
- Călătorie asigurare.
- Viață asigurare.
- Cesiune poliță self-service (transfer la nou proprietar).
- Programmatic SEO pages (RCA per oraș, marcă mașină — dacă unique content posibil).
- Blog cu 50-100 articole long-tail SEO.
- Cross-sell intelligent (CASCO recommendation după RCA achiziție).
- Multi-policy bundling cu discount.
- Loyalty program / referral codes (dacă nu deja v1 — confirmat în Q28.3).
- Mobile app store ASO + features avansate offline mode.

---

## 32. KPI și evenimente analytics

### 32.1. KPIs business

| KPI | Definiție | Target Y1 |
|---|---|---|
| **Conversion landing → poliță emisă** | % useri ajunși la /thank-you / vizitatori unici | 3-5% |
| **CAC** (Customer Acquisition Cost) | Total ad spend / polițe emise via paid | <300 RON |
| **AOV** (Average Order Value) | Avg total per poliță | 1500 RON |
| **Comision broker net** | Σ broker_commission / luna | 5% × volum |
| **Renewal rate** | % polițe re-emise prin reminders | >40% |
| **Abandoned cart conversion** | % carts → 1h email click → emit | 15-25% |
| **NPS** | Net Promoter Score post-emisie | >40 |
| **Avg time to issue** | landing → /thank-you median | <5 min |

### 32.2. PostHog events critical path

```typescript
// packages/analytics/src/events.ts
export const events = {
  // Landing
  LANDING_VIEW: 'landing_view',
  VIN_INPUT_FOCUSED: 'vin_input_focused',
  VIN_SEARCH_CLICKED: 'vin_search_clicked',
  DOCUMENTS_DRAGGED: 'documents_dragged',
  DOCUMENTS_UPLOADED: 'documents_uploaded',  // properties: { count, types }
  OCR_STARTED: 'ocr_started',
  OCR_COMPLETED: 'ocr_completed',  // properties: { fields_extracted_count }
  OCR_FAILED: 'ocr_failed',
  
  // Pas 1
  STEP_1_STARTED: 'step_1_started',
  VEHICLE_STATUS_SELECTED: 'vehicle_status_selected',  // { status }
  STEP_1_COMPLETED: 'step_1_completed',  // { time_spent_sec }
  
  // Pas 2
  STEP_2_STARTED: 'step_2_started',
  PERSON_TYPE_TOGGLED: 'person_type_toggled',  // { type }
  LEASING_TOGGLED: 'leasing_toggled',
  DRIVER_ADDED: 'driver_added',
  EMAIL_OTP_SENT: 'email_otp_sent',
  EMAIL_OTP_VERIFIED: 'email_otp_verified',
  STEP_2_COMPLETED: 'step_2_completed',
  
  // Pas 3
  STEP_3_STARTED: 'step_3_started',
  DURATION_SECONDARY_CHANGED: 'duration_secondary_changed',  // { months }
  STEP_3_COMPLETED: 'step_3_completed',
  
  // Pas 4
  QUOTE_OFFERS_LOADED: 'quote_offers_loaded',  // { count_available, count_unavailable, time_ms }
  DIRECT_SETTLEMENT_TOGGLED: 'direct_settlement_toggled',
  OFFER_DETAILS_EXPANDED: 'offer_details_expanded',  // { insurer }
  OFFER_SELECTED: 'offer_selected',  // { insurer, duration_months, total_amount }
  HIGH_RISK_DETECTED: 'high_risk_detected',  // 0 oferte
  
  // Checkout
  CHECKOUT_STARTED: 'checkout_started',
  PAYMENT_METHOD_SELECTED: 'payment_method_selected',  // { method }
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_SUCCEEDED: 'payment_succeeded',  // { amount, method }
  PAYMENT_FAILED: 'payment_failed',  // { reason }
  POLICY_ISSUED_SYNC: 'policy_issued_sync',  // <10s
  POLICY_ISSUED_ASYNC: 'policy_issued_async',  // >10s timeout
  
  // Cont
  ACCOUNT_DASHBOARD_VIEWED: 'account_dashboard_viewed',
  POLICY_PDF_DOWNLOADED: 'policy_pdf_downloaded',
  
  // Anulare
  CANCELLATION_STARTED: 'cancellation_started',  // { reason }
  CANCELLATION_WITHDRAWAL_AUTO: 'cancellation_withdrawal_auto',  // ≤14d
  CANCELLATION_REQUEST_SUBMITTED: 'cancellation_request_submitted',
  
  // Reminders
  REMINDER_EMAIL_60D_SENT: 'reminder_email_60d_sent',
  REMINDER_EMAIL_30D_SENT: 'reminder_email_30d_sent',
  REMINDER_SMS_7D_SENT: 'reminder_sms_7d_sent',
  REMINDER_CLICKED: 'reminder_clicked',  // { template_key }
  POLICY_RENEWED: 'policy_renewed',  // { via_reminder, days_before_expiry }
  
  // Cart abandonment
  ABANDONED_CART_EMAIL_SENT: 'abandoned_cart_email_sent',
  ABANDONED_CART_RESUMED: 'abandoned_cart_resumed',
};
```

### 32.3. Funnels în PostHog

- **Conversion funnel:** Landing → Step 1 → Step 2 (OTP) → Step 3 → Step 4 → Payment → Policy Issued.
- **Renewal funnel:** Reminder Sent → Reminder Clicked → Step 4 (resume) → Payment → Renewed.
- **Cart abandonment:** Step X dropoff → 1h Email → Resumed → Completed.

---

## 33. Glosar termeni

| Termen | Definiție |
|---|---|
| **RCA** | Asigurarea de Răspundere Civilă Auto, obligatorie în RO conform Legii 132/2017. |
| **CASCO** | Asigurare opțională pentru daune proprii la vehicul. |
| **BAAR** | Biroul Asigurătorilor de Răspundere Auto — alocă forțat asigurător pentru useri risc ridicat. |
| **CEDAM** | Centrala Datelor de Asigurări Auto — registru bonus-malus. |
| **DRPCIV** | Direcția Regim Permise de Conducere și Înmatriculare a Vehiculelor. |
| **ASF** | Autoritatea de Supraveghere Financiară — reglementează asigurările RO. |
| **ANSPDCP** | Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal — DPA RO. |
| **CIV** | Cartea de Identitate a Vehiculului. |
| **IPID** | Insurance Product Information Document — sumar standardizat ASF. |
| **IBAN** | International Bank Account Number. |
| **CNP** | Cod Numeric Personal RO (13 cifre). |
| **CUI** | Cod Unic de Înregistrare (firme RO). |
| **VIN** | Vehicle Identification Number (17 caractere). |
| **GDPR** | Regulamentul UE 2016/679 — General Data Protection Regulation. |
| **DPO** | Data Protection Officer. |
| **DPIA** | Data Protection Impact Assessment. |
| **ROPA** | Records of Processing Activities (Art. 30 GDPR). |
| **KMS** | Key Management Service. |
| **KEK** | Key Encryption Key (master key în KMS). |
| **DEK** | Data Encryption Key (per-record, criptat cu KEK). |
| **HMAC** | Hash-based Message Authentication Code. |
| **HSM** | Hardware Security Module (tamper-resistant hardware). |
| **PCI DSS** | Payment Card Industry Data Security Standard. |
| **3DS** | 3D Secure (autentificare suplimentară plată). |
| **CAPI** | Conversions API (Meta server-side tracking). |
| **WCAG** | Web Content Accessibility Guidelines. |
| **WMI** | World Manufacturer Identifier (parte din VIN). |
| **PIT R** | Point-in-time recovery (Neon feature). |
| **RTO/RPO** | Recovery Time Objective / Recovery Point Objective. |
| **RLS** | Row-Level Security (Postgres). |
| **OTP** | One-Time Password. |
| **ASO** | App Store Optimization. |
| **CWV** | Core Web Vitals. |
| **LCP / INP / CLS** | Largest Contentful Paint / Interaction to Next Paint / Cumulative Layout Shift. |

---

## Anexa A — Decizii lockate (referință rapidă)

| # | Decizie | Lock |
|---|---|---|
| 1 | Scope v1 | RCA + PF + PJ + leasing + 3 stări vehicul; BAAR redirect; schema multi-tip pregătită |
| 2 | Pași flow | 4 pași + landing distinct + checkout separat |
| 3 | Auth strategy | Clerk Email OTP la pas 2; SMS doar plată dacă necesar (de fapt skip v1) |
| 4 | OCR strategy | Hybrid VIN search + drag-drop OCR landing; auto-categorize talon/CI; conflict = docs win |
| 5 | PF/PJ branch | Toggle la pas 2 cu Zod discriminated union |
| 6 | Comparator | Hybrid card desktop + table mobile; decontare global toggle |
| 7 | Durată | 12L fix + 1-11 dropdown; mereu 2 perioade afișate |
| 8 | Decontare directă | Global toggle pas 4, default OFF |
| 9 | Stare vehicul | Auto-detect + chips la pas 1, sub-cazuri "în vederea" |
| 10 | Leasing | Bifă pas 2 + searchable select |
| 11 | Șoferi | Listă explicită, max 5, validare CNP unic |
| 12 | Plată | Stripe Elements (NU NETOPIA) |
| 13 | BAAR | a+c combo: banner discret <3 oferte + ecran dedicat 0 oferte |
| 14 | Cont | 5 tabs + dashboard cards, post-plată CTA explicit |
| 15 | Reminders | 60d email + 30d email + 7d SMS opt-in (sau cart 1h transactional) |
| 16 | Limbi | RO + EN UI, RO docs legal |
| 17 | Mobile | Paritate completă Expo |
| 18 | Validări | Zod shared, onBlur, cross-field warnings |
| 19 | Encryption | Tier 1 envelope + GCP KMS + HMAC search; Tier 2 pgcrypto; Tier 3 plain; audit + RLS |
| 20 | Anulare | ≤14d auto + wizard review pentru restul + Stripe refund hibrid |
| 21 | Admin | Refine.dev + email allowlist v1 → Clerk roles v2 |
| 22 | Asigurători | SB mocked v1 → SB real v2 → direct top 3 v3; adapter pattern |
| 23 | Document poliță | Hibrid sync 10s + async fallback; S3 + hash + versioning |
| 24 | Email/SMS | Resend + React Email + multi-sender; Twilio EU |
| 25 | Analytics | PostHog EU + Sentry EU + Vercel Analytics + Axiom EU + Uptime Kuma self-host |
| 26 | Marketing | SEO+ads hibrid; landing pages targetate; PostHog + pixel hardcoded → CAPI v2 |
| 27 | Modificare poliță | Out v1 (support manual) |
| 28 | Pricing | Total only display; DB+API config; coupons+referrals (scope creep noted v1) |
| 29 | Public API | oRPC+OpenAPI; bearer; URL `/api/v1/`; Upstash Ratelimit |
| 30 | Support | Email + WhatsApp manual v1 |
| 31 | Cookies/GDPR | Custom Next.js banner; opt-in strict; DPIA simplificat; DPO self |
| 32 | Drafts | Local→DB hybrid; magic link 24h; cart 1h email transactional only |
| 33 | Anonim | NU (sign-up obligatoriu) |
| 34 | Fleet PJ | Garaj multi-vehicle v1 + bulk CSV v2 |
| 35 | (continue grilling) | — |
| 36 | Onboarding | Welcome email post-plată; empty states hints; singur email post-plată |
| 37 | Legal | Templates + adaptare manual; versionate + re-consent; footer simplu |
| 38 | Hosting | EU strict (Frankfurt all) |
| 39 | Dev envs | 4 envs + Neon branches + mock seed staging |
| 40 | CI/CD | GHA + Vercel + Vitest + Playwright + GitHub Flow + Drizzle migrations approval gate |
| 41 | Migrations | drizzle-kit generate + review + down migrations + expand-contract + drift check |
| 42 | Backup/DR | PITR + S3 export + KMS multi-region + RTO 4h/RPO 1h + runbook |
| 43 | Cookies i18n | RO+EN |
| 44 | Accessibility | WCAG 2.2 AA full + /accesibilitate |
| 45 | Performance | Aspirational CWV + Lighthouse CI gate |
| 46 | A/B testing | Day 1 infra + critical paths flags + no kill switches |
| 47 | UX states | Full SEO + contextual errors + empty CTAs + skeleton+optimistic + maintenance mode |

---

## Anexa B — Acceptance Criteria (Given / When / Then)

Criterii verificabile per feature. Fiecare poate fi convertit în test E2E Playwright sau test manual de QA.

### B.1. Landing — drag & drop OCR

**B.1.1.** Drag fișier valid pe landing
- **GIVEN** user pe `/` desktop, niciun fișier selectat
- **WHEN** user trage 1 fișier `.jpg` peste pagină
- **THEN** zona landing afișează border dashed + overlay "Eliberează aici talonul și/sau cartea de identitate"
- **AND** butonul "📷 Încarcă documente" schimbă text în "Drop here"

**B.1.2.** Drop 1 fișier talon
- **GIVEN** user pe `/`, drop zone activă
- **WHEN** user dă drop la 1 fișier `talon.jpg` (foto talon valid)
- **THEN** spinner cu text "Citim talonul..." apare ~3-5 sec
- **AND** Document AI clasifică ca `talon`
- **AND** redirect la `/quote/step-1` cu form pre-completat (VIN, marcă, model, an, masă, putere, combustibil, nr înmatriculare)
- **AND** câmpurile pre-completate au highlight subtil verde "auto-detectat din talon"

**B.1.3.** Drop 2 fișiere (talon + CI)
- **GIVEN** user pe `/`
- **WHEN** drop `talon.jpg` + `ci.jpg`
- **THEN** Document AI clasifică ambele
- **AND** datele vehicul + datele proprietar pre-completate
- **AND** user ajunge direct la pas 1 (vehicul) cu redirect ulterior pas 2 (proprietar) deja completat

**B.1.4.** Drop 3+ fișiere
- **WHEN** user dă drop la 3 fișiere
- **THEN** toast "Maxim 2 documente: talon + carte identitate"
- **AND** drop respins, niciun fișier upload

**B.1.5.** Drop 2 fișiere de același tip (2 taloane)
- **WHEN** Document AI returnează ambele clasificate ca `talon`
- **THEN** mesaj "Am detectat 2 documente la fel. Încarcă unul de fiecare tip."
- **AND** user revine la landing pentru retry

**B.1.6.** Drop fișier format invalid (`.docx`)
- **WHEN** user dă drop la fișier `.docx`
- **THEN** toast "Doar JPG, PNG sau PDF"
- **AND** drop respins

**B.1.7.** Conflict VIN tipărit + VIN din talon
- **GIVEN** user a tipărit `WAUZZZ` în input VIN
- **WHEN** dă drop la talon cu VIN `WDB9066131S155032`
- **THEN** docs win (VIN-ul din talon e folosit)
- **AND** toast informativ "Am folosit datele din talon (VIN: WDB...). Editezi la pas 1 dacă nu e corect."

**B.1.8.** OCR fail — imagine blurată
- **WHEN** Document AI returnează confidence <0.5 pe câmpuri esențiale
- **THEN** ecran "N-am putut citi clar talonul. Reîncearcă sau completează manual."
- **AND** 2 butoane: [Reîncearcă] [Skip, completez manual]
- **AND** after 2 retry → fallback automat la manual cu form gol pre-deschis

**B.1.9.** Mobile — buton "Încarcă documente"
- **GIVEN** user pe iOS Safari
- **WHEN** tap "📷 Încarcă documente"
- **THEN** picker nativ iOS apare cu opțiuni: Cameră / Galerie / Fișiere
- **AND** Document AI suportă poză directă cu auto-crop

**B.1.10.** VIN-only search (fără upload)
- **GIVEN** user introduce nr înmatriculare `BV18BFG`
- **WHEN** click "Caută"
- **THEN** backend VIN decoder + CEDAM lookup mock
- **AND** redirect la pas 1 cu pre-fill parțial (date vehicul, fără proprietar)

### B.2. Pas 1 — Vehicul

**B.2.1.** Auto-detect stare vehicul "înmatriculat"
- **GIVEN** landing input = nr înmatriculare valid `BV18BFG`
- **WHEN** ajunge la pas 1
- **THEN** chip `[● Înmatriculat]` pre-selectat

**B.2.2.** Auto-detect stare vehicul "în vederea înmatriculării"
- **GIVEN** landing input = doar VIN (17 caractere)
- **WHEN** ajunge la pas 1
- **THEN** chip `[● Înmatriculat]` pre-selectat (default), dar user poate switch
- **OR** dacă VIN e marcat în CEDAM ca "neînmatriculat" → chip `[● În vederea înmatriculării]` pre-selectat

**B.2.3.** Switch la "În vederea înmatriculării"
- **GIVEN** chip `[Înmatriculat]` selectat
- **WHEN** user click chip `[În vederea înmatriculării]`
- **THEN** apare sub-întrebare "De unde vine vehiculul?"
- **AND** câmpul "Nr înmatriculare" → blocat cu badge "Va fi emisă pe VIN"
- **AND** banner galben informativ apare

**B.2.4.** Sub-tip "Mașină din străinătate"
- **GIVEN** chip "În vederea înmatriculării" + sub-tip "Din străinătate"
- **WHEN** user încearcă submit fără upload documente
- **THEN** validare blocking: "Documente justificative obligatorii: contract, dovadă programare DRPCIV, BI/CI"

**B.2.5.** Acordurile legale obligatorii
- **GIVEN** form completat dar acord "Renunț la consultanță" nebifat
- **WHEN** click "Pasul următor"
- **THEN** mesaj "Pentru a continua trebuie să fii de acord cu renunțarea la consultanță"
- **AND** focus pe checkbox respectiv

**B.2.6.** Validare VIN check digit
- **GIVEN** user tipărește VIN `WDB9066131S155033` (check digit greșit)
- **WHEN** onBlur câmp VIN
- **THEN** mesaj eroare "VIN check digit invalid"
- **AND** câmp marcat roșu

**B.2.7.** "Nu am sau nu știu seria CIV"
- **WHEN** user bifează `☐ Nu am sau nu știu seria CIV`
- **THEN** câmpul "Seria CIV" devine disabled + opțional
- **AND** validare submit nu mai cere acest câmp

### B.3. Pas 2 — Proprietar + Email OTP

**B.3.1.** Toggle PF → PJ
- **GIVEN** form pas 2 completat parțial PF
- **WHEN** click toggle "Persoană juridică"
- **THEN** câmpurile PF dispar, apar câmpuri PJ (CUI, CAEN, J-nr, reprezentant)
- **AND** date introduse PF se păstrează în state (revert dacă re-toggle)

**B.3.2.** Bifă leasing → companie de leasing
- **GIVEN** bifă "Vehiculul este în leasing" nebifat
- **WHEN** user bifează
- **THEN** câmp "Companie de leasing *" apare obligatoriu
- **AND** searchable dropdown cu top 25 companii pre-populate
- **AND** opțiune "[+ Adaugă altă companie]" la final dropdown

**B.3.3.** Validare CNP cu cifră de control
- **GIVEN** user tipărește CNP `1960418080018` (cifră control greșită)
- **WHEN** onBlur câmp CNP
- **THEN** mesaj "CNP invalid (cifră de control greșită)"
- **AND** câmp marcat roșu

**B.3.4.** Cross-field warning: an permis vs CNP
- **GIVEN** CNP indică naștere 1996, an permis = 2010 (vârstă 14)
- **WHEN** onBlur câmp "An permis"
- **THEN** warning galben (non-blocking) "Datele par neobișnuite: vârsta la obținere permis sub 18 ani"
- **AND** user poate continua dacă insistă

**B.3.5.** Adăugare șofer suplimentar
- **GIVEN** secțiunea "Șoferi" deschisă
- **WHEN** click "+ Adaugă alt șofer"
- **THEN** modal sau inline expand cu câmpuri șofer (Nume, CNP, CI, permis)
- **WHEN** submit modal cu CNP valid
- **THEN** șofer apare în listă cu butoane [Editează] [Șterge]
- **AND** atenționare permanentă "Adăugarea șoferilor suplimentari poate modifica prețul"

**B.3.6.** Duplicate CNP șofer
- **GIVEN** șofer 1 are CNP `1960418080017`
- **WHEN** user încearcă să adauge șofer 2 cu același CNP
- **THEN** validare blocking "Acest CNP este deja folosit"

**B.3.7.** Limita maximă șoferi
- **GIVEN** 5 șoferi deja adăugați
- **WHEN** user click "+ Adaugă alt șofer"
- **THEN** mesaj "Maxim 5 șoferi. Pentru mai mulți, contactează support."
- **AND** buton disabled

**B.3.8.** Email OTP — primire cod
- **GIVEN** form pas 2 valid completat
- **WHEN** click "Pasul următor"
- **THEN** modal Clerk Email OTP apare
- **AND** email cu cod 6 cifre trimis în <30 sec
- **AND** template email branded cu logo aplicatie.ta

**B.3.9.** Email OTP — cod corect
- **GIVEN** modal OTP deschis
- **WHEN** user introduce cod corect
- **THEN** modal close + tranziție la pas 3
- **AND** cont Clerk creat (sau autentificat) cu email confirmat
- **AND** record `consents_log` (gdpr_at, precontractual_at, no_consultancy_at) inserted

**B.3.10.** Email OTP — cod incorect
- **GIVEN** modal OTP deschis
- **WHEN** user introduce cod greșit
- **THEN** mesaj "Cod incorect. Mai încearcă o dată sau [Trimite cod nou]"
- **AND** după 5 încercări → cont blocat 15 min

### B.4. Pas 3 — Configurare poliță

**B.4.1.** Calendar dată început — limit 60 zile
- **GIVEN** azi = 2026-04-29
- **WHEN** user încearcă să selecteze 2026-07-01 (>60 zile)
- **THEN** ziua disabled în calendar
- **AND** tooltip "Maxim 60 zile în avans"

**B.4.2.** Dată început — past disabled
- **WHEN** user încearcă să selecteze data de azi sau anterioară
- **THEN** ziua disabled
- **AND** earliest selectabilă = today + 1

**B.4.3.** Durată — 12L fix + secondary
- **GIVEN** pas 3 inițial
- **THEN** chip "12 luni" preselectat (fix, ne-deselectabil)
- **AND** dropdown secondary cu valoare default `6`
- **AND** sub butoane afișat:
  - "Polița 12 luni: expiră 28 aprilie 2027"
  - "Polița 6 luni: expiră 28 octombrie 2026"

**B.4.4.** Schimbare durată secondary
- **GIVEN** dropdown secondary = 6
- **WHEN** user schimbă la 8
- **THEN** chip secondary update la "8 luni"
- **AND** data expirare secondary recalculată live

**B.4.5.** Durată secondary out-of-range
- **GIVEN** dropdown
- **WHEN** user încearcă să introducă 13 (manual)
- **THEN** dropdown nu permite, max = 11

### B.5. Pas 4 — Oferte

**B.5.1.** Loading oferte
- **WHEN** user ajunge la pas 4
- **THEN** skeleton screens cu 9 rânduri/cards apare imediat
- **AND** request agregator (paralel × 9 asigurători × 2 perioade)
- **AND** cards populează individual cum vin response-urile

**B.5.2.** Display ofertă disponibilă
- **GIVEN** asigurător returnează ofertă pentru 12L + 6L
- **THEN** rând tabel desktop cu 2 coloane preț (12L + 6L) cu butoane "Alege" per coloană
- **AND** mobile = card cu 2 prețuri + 2 butoane

**B.5.3.** Display ofertă parțial disponibilă
- **GIVEN** asigurător suportă 12L dar refuză 6L
- **THEN** coloana 6L afișează "—" sau "N/A 6L"
- **AND** tooltip "Asirom nu emite pe 6 luni. Disponibil: 1L, 12L."
- **AND** doar buton [Alege 12L]

**B.5.4.** Display oferte indisponibile
- **GIVEN** asigurătorul refuză toate perioadele
- **THEN** ofertă în secțiunea "Indisponibile (N)" collapsed la final
- **AND** click expand → afișare motiv ("Vehicul depășește limita de risc", etc.)
- **AND** buton "Alege" disabled

**B.5.5.** Toggle decontare directă
- **GIVEN** toggle decontare directă OFF
- **WHEN** user click toggle ON
- **THEN** toate prețurile actualizate cu deltele decontării (client-side, datele vin în payload)
- **AND** label preț afișează "+143 RON decontare directă inclusă"

**B.5.6.** Sortare oferte
- **GIVEN** dropdown "Sortare ▼ Cel mai mic preț 12L" (default)
- **WHEN** user schimbă la "Cea mai bună valoare lunară"
- **THEN** lista re-sortată după preț/lună (total/durata)

**B.5.7.** Click "Alege" pe ofertă
- **GIVEN** ofertă disponibilă
- **WHEN** user click [Alege 12L]
- **THEN** redirect la `/checkout/[oferta-id]` cu offer_id + duration=12 în URL
- **AND** PostHog event `offer_selected`

**B.5.8.** 0 oferte returnate (BAAR)
- **GIVEN** toți asigurătorii refuză
- **THEN** ecran dedicat înlocuiește lista
- **AND** afișează tarif BAAR ref + link extern + email support

**B.5.9.** 1-2 oferte returnate (low offers)
- **THEN** banner discret deasupra listei "Ai mai puține oferte. Posibil risc ridicat. [Detalii BAAR]"
- **AND** lista normală cu cele 1-2 oferte

**B.5.10.** Re-fetch oferte la schimbare durată
- **GIVEN** user pe pas 4
- **WHEN** user click "Schimbă durata" → înapoi pas 3 → schimbă secondary la 8 → înapoi pas 4
- **THEN** request agregator re-rulează cu durata nouă
- **AND** cache key diferit, request fresh

### B.6. Checkout

**B.6.1.** Bifa documente blocking
- **GIVEN** checkout cu rezumat ofertă
- **WHEN** bifa "Confirm că am citit documentele" nebifată
- **THEN** toate butoanele plată disabled (gri + cursor not-allowed)

**B.6.2.** Apple Pay disponibil
- **GIVEN** user pe Safari iOS / Mac Safari + bifă da
- **THEN** buton Apple Pay vizibil, primary position

**B.6.3.** Click Apple Pay → Touch/Face ID
- **WHEN** click Apple Pay
- **THEN** Stripe Elements lansează autentificare nativă
- **AND** la succes → 3DS dacă cere bancă → success → redirect /thank-you

**B.6.4.** Card form fallback
- **GIVEN** Apple/GPay/Link nu disponibile (browser non-Safari/Chrome)
- **THEN** card form vizibil direct fără separator "─── sau ───"

**B.6.5.** Validare card
- **WHEN** user introduce card cu CVV invalid
- **THEN** Stripe Elements afișează inline error sub câmp
- **AND** buton "Plătește" disabled până validare ok

**B.6.6.** Plată failed
- **WHEN** Stripe returnează `payment_failed`
- **THEN** mesaj specific din Stripe (e.g., "Card refuzat de bancă")
- **AND** butoane [Încearcă din nou] [Schimbă metoda]
- **AND** quote_offer rămâne valabil 30 min pentru retry

**B.6.7.** Plată succeeded
- **WHEN** webhook `payment_intent.succeeded`
- **THEN** redirect /thank-you?payment_intent={id}
- **AND** backend începe emisia poliță

### B.7. Thank-you (hibrid sync/async)

**B.7.1.** Sync emit (sub 10s)
- **GIVEN** /thank-you afișat
- **WHEN** API asigurător returnează poliță în 5s
- **THEN** pagina afișează "✓ Poliță emisă: #21408046" cu butoane download
- **AND** email cu poliță atașată trimis user

**B.7.2.** Async timeout (>10s)
- **WHEN** API asigurător > 10s
- **THEN** pagina afișează "⏳ Polița se procesează la asigurător..."
- **AND** user poate naviga la cont; va primi email + push când e gata

**B.7.3.** Async eventual success
- **GIVEN** user pe /cont după timeout async
- **WHEN** webhook insurer arrives → policy emis în background
- **THEN** push notification mobile (dacă instalat)
- **AND** email cu poliță atașată
- **AND** dashboard cont actualizat cu poliță activă

**B.7.4.** Async eventual fail
- **GIVEN** background job fail după 24h retries
- **THEN** email "Întâmpinăm o problemă. Te-am contactat la support."
- **AND** lead în admin Refine pentru manual handling
- **AND** Stripe payment auto-refund (dacă neemis)

### B.8. Cont user

**B.8.1.** Dashboard primă vizită
- **GIVEN** user nou logat fără polițe
- **THEN** dashboard arată cards empty cu CTA-uri:
  - "Aici vor apărea polițele tale. [Calculează prima oră RCA →]"
  - "Adaugă primul vehicul. [Adaugă →]"

**B.8.2.** Polița active expiring 142 zile
- **GIVEN** user are 1 poliță cu end_date azi+142 zile
- **THEN** card top "Polița ta RCA expiră în 142 zile — eazy.insure"
- **AND** buton "Vezi poliță"

**B.8.3.** Tab Polițe — sortare
- **GIVEN** user are 5 polițe (3 active, 1 expirată, 1 anulată)
- **THEN** filter default "Activă" → arată 3
- **AND** sortare default = descending după start_date

**B.8.4.** Download PDF poliță
- **WHEN** user click "📥 Descarcă poliță PDF"
- **THEN** request signed URL S3 cu expiry 5 min
- **AND** download direct din browser
- **AND** audit log entry "policy_pdf_downloaded"

**B.8.5.** Garaj multi-vehicle PJ
- **GIVEN** PJ cu 5 vehicule salvate
- **THEN** Tab Vehicule afișează grid cu 5 cards
- **WHEN** click "+ RCA nou pentru acest" pe vehicul 3
- **THEN** redirect la pas 1 cu vehicul 3 pre-selectat (skip pas 1 către pas 2)

### B.9. Anulare poliță

**B.9.1.** Anulare drept retragere ≤14d
- **GIVEN** poliță emisă acum 5 zile
- **WHEN** user click "Anulează" → wizard pas 1 → "Drept retragere"
- **THEN** modal "Confirm anularea? Refund 100%."
- **WHEN** confirm
- **THEN** automat:
  - `policy.status = 'pending_cancellation'`
  - API asigurător cancel call
  - Stripe refund 100%
  - Email confirmare
- **AND** status în cont = "Anulată"
- **AND** total refund = 1.383,79 RON

**B.9.2.** Anulare după 14d "Vând vehiculul"
- **GIVEN** poliță emisă acum 23 zile
- **WHEN** user → wizard → "Vând vehiculul"
- **THEN** pas 2 cu calc refund afișat (1.296,53 RON, comision 69,19 reținut)
- **AND** câmp upload "Contract vânzare-cumpărare *" obligatoriu
- **WHEN** submit cu fișier valid
- **THEN** cerere status `pending_review` în admin
- **AND** email user "Cererea primită, ETA 24-48h review"
- **AND** notify admin Refine

**B.9.3.** Refund prorata calc
- **GIVEN** poliță 12 luni, premium 1.314,60, comision 69,19, total 1.383,79
- **AND** today = start_date + 23 zile, end_date - start_date = 365 zile
- **WHEN** calc refund non-withdrawal
- **THEN** premium_refund = 1.314,60 × 342 / 365 = 1.231,59
- **AND** total_refund = 1.231,59 (comision NU returnabil post-14d)

**B.9.4.** Refund Stripe
- **GIVEN** anulare aprobată asigurător
- **WHEN** admin click "Refund" în Refine
- **THEN** Stripe `refund.create` cu amount calculat
- **AND** webhook `charge.refunded` → status payment 'refunded'
- **AND** email user "Refund procesat: X RON pe cardul ****4242"

### B.10. Reminders

**B.10.1.** 60d email send
- **GIVEN** poliță cu end_date = today + 60 zile + status active
- **AND** user.preferences.email_reminders = true
- **WHEN** cron daily 08:00 RO
- **THEN** email send cu template `reminder_60d`
- **AND** entry `notifications_log` (channel=email, template_key=reminder_60d, sent_at=now)

**B.10.2.** 60d email skip dacă deja reînnoit
- **GIVEN** poliță cu end_date = today + 60 zile, dar policy_renewed pentru aceeași vehicul
- **WHEN** cron
- **THEN** skip silent, no email

**B.10.3.** 7d SMS opt-out
- **GIVEN** user.preferences.sms_reminders = false
- **WHEN** cron 7d
- **THEN** skip SMS, no Twilio call, no log

**B.10.4.** Reminder click → resume
- **WHEN** user click "Reînnoiește acum" în email 30d
- **THEN** magic link cu token unique → cont logat → redirect direct pas 4 (oferte)
- **AND** date pre-completate complet (vehicul + proprietar + șofer + adresă)
- **AND** start_date = end_date poliță existentă + 1 zi

**B.10.5.** SMS STOP keyword
- **GIVEN** user a primit SMS reminder
- **WHEN** user răspunde "STOP" la 7575
- **THEN** Twilio webhook → backend → `user.preferences.sms_reminders = false`
- **AND** flag `consents_log` audit entry

### B.11. Cookie banner + GDPR

**B.11.1.** Banner prim load
- **GIVEN** prim vizit user (no cookie set)
- **WHEN** load `/`
- **THEN** banner bottom apare după DOMContentLoaded
- **AND** PostHog NU trackuie până consent
- **AND** Google Ads pixel NU se încarcă

**B.11.2.** Click "Accept toate"
- **THEN** cookie `cookie_consent` set cu `{ analytics: true, marketing: true, functional: true, version: 1 }`
- **AND** PostHog `opt_in_capturing()` apelat
- **AND** GA + Meta pixel încărcate
- **AND** entry `consents_log` cu source='banner'

**B.11.3.** Click "Refuză tot"
- **THEN** cookie set cu `{ analytics: false, marketing: false, functional: false, version: 1 }`
- **AND** doar cookies necesare (auth Clerk, sesiune)

**B.11.4.** "Personalizează" → modal
- **WHEN** user bifează doar "Analytics"
- **AND** click "Salvează preferințe"
- **THEN** PostHog opt_in
- **AND** Meta pixel NU se încarcă

**B.11.5.** Re-prompt la versiune nouă T&C
- **GIVEN** user logat, T&C v2 publicat
- **WHEN** user load aplicatie
- **THEN** modal "Termenii s-au actualizat. Citește și acceptă."
- **AND** acceptare → record `user_consents` cu document_id v2

### B.12. Public API

**B.12.1.** Auth bearer token valid
- **GIVEN** API client cu key activ + endpoint `POST /api/v1/quotes`
- **WHEN** request cu header `Authorization: Bearer <key>`
- **THEN** 200 OK cu QuoteResponse

**B.12.2.** Auth bearer token revocat
- **GIVEN** key revocat (revoked_at SET)
- **WHEN** request
- **THEN** 401 Unauthorized

**B.12.3.** Rate limit
- **GIVEN** API key cu rate_limit 60/min
- **WHEN** 61-a cerere în aceeași minut
- **THEN** 429 Too Many Requests + header `Retry-After: 30`

**B.12.4.** OpenAPI spec
- **WHEN** GET `https://docs.aplicatie.ta/openapi.json`
- **THEN** spec OpenAPI 3.1 valid cu toate endpoint-uri + schemas

---

## Anexa C — Form Validation Rules (per câmp exhaustiv)

### C.1. Tabel master — toate câmpurile

| Câmp | Tip | Obligatoriu | Validare format | Validare semantică | Error message RO |
|------|-----|-------------|-----------------|--------------------|--------------------|
| **CNP** | string | Da (PF) | `/^\d{13}$/` | Algoritm checksum + dată naștere extrasă consistent | "CNP invalid (cifră de control greșită)" |
| **CUI** | string | Da (PJ) | `/^(?:RO)?\d{2,10}$/` (case-insensitive RO prefix) | Algoritm checksum | "CUI invalid (cifră de control greșită)" |
| **IBAN RO** | string | Nu (refund auto) | `/^RO\d{2}[A-Z]{4}[A-Z0-9]{16}$/` | mod 97 = 1 | "IBAN invalid" |
| **VIN** | string | Da | 17 caractere `/^[A-HJ-NPR-Z0-9]{17}$/` | Check digit position 9 (algoritm WMI) | "VIN invalid" / "VIN check digit invalid" |
| **Nr înmatriculare** | string | Da (dacă înmatriculat) | `/^[A-Z]{1,2}\d{2,3}[A-Z]{3}$/` (standard) sau `/^[A-Z]{2}\d{2,3}[A-Z]{3}$/` (București) | Format RO | "Nr înmatriculare RO invalid (ex: BV18BFG)" |
| **Telefon** | string | Da | `/^(\+40|0)(7\d{8}|2\d{8}|3\d{8})$/` | Mobile/fix valid | "Telefon RO invalid" |
| **Email** | string | Da | RFC 5322 | DNS check (server-side, opțional) | "Email invalid" |
| **Cod poștal** | string | Da | `/^[1-8]\d{5}$/` | Prima cifră județ valid | "Cod poștal invalid (6 cifre, prima 1-8)" |
| **Serie CI** | string | Da (PF) | `/^[A-Z]{2}$/` | 2 litere (varies per județ) | "Serie CI invalid" |
| **Număr CI** | string | Da (PF) | `/^\d{6}$/` | 6 cifre | "Număr CI invalid (6 cifre)" |
| **Data expirare CI** | date | Da (PF) | DD/MM/YYYY | > today | "CI-ul tău este expirat" |
| **An obținere permis** | int | Da (PF, dacă nu "fără permis") | 1960-current_year | ≥ data_naștere + 18 (warning) | "An permis invalid (1960-azi)" |
| **An fabricație vehicul** | int | Da | 1900-current_year | ≤ data_primă_înmatriculare | "An fabricație invalid" |
| **Data primei înmatriculări** | date | Da | DD/MM/YYYY | ≥ an fabricație | "Dată primei înmatriculări invalid" |
| **Capacitate (P1)** | int | Da | > 0 | 50-15000 cc plausible | "Capacitate cilindrică invalidă" |
| **Putere (P2)** | num | Da | > 0 | 1-1000 kW (NU CP!) | "Putere invalidă (în kW, nu CP)" |
| **Masă maximă (F1)** | int | Da | > 0 | 100-50000 kg | "Masă invalidă" |
| **Număr locuri (S1)** | int | Da | > 0 | 1-100 | "Număr locuri invalid" |
| **Seria CIV** | string | Condiționat | Format varies | Opțional dacă bifat "Nu am" | "Serie CIV invalidă" |
| **Kilometraj** | int | Nu (opțional) | ≥ 0 | < 9999999 | "Kilometraj invalid" |
| **Data expirare ITP** | date | Nu (opțional) | DD/MM/YYYY | ≥ today (warning dacă <today) | — |
| **Data început poliță** | date | Da | DD/MM/YYYY | today + 1 ≤ X ≤ today + 60 | "Data început: max 60 zile în avans" / "Data trecută" |
| **Durată primary** | int | Auto | = 12 | Fix | — |
| **Durată secondary** | int | Da | 1-11 integer | Default 6 | "Durată invalidă (1-11 luni)" |
| **Companie leasing** | uuid | Condiționat | UUID din `leasing_companies` sau custom | Obligatoriu dacă is_leasing=true | "Selectează companie leasing" |
| **Cod CAEN** | string | Da (PJ) | `/^\d{4}$/` | 4 cifre | "Cod CAEN invalid" |
| **Număr înregistrare** | string | Da (PJ) | `/^J\d{2}\/\d+\/\d{4}$/` | Format J__/____/____ | "Număr înregistrare invalid (ex: J40/1234/2026)" |
| **Tip act identitate** | enum | Da | 'CI' / 'BI' / 'pașaport' | — | — |
| **Tip vehicul (J)** | enum | Da | M1/M2/M3/N1/N2/N3/L/T/etc. | Match cu masă maximă (warning) | — |
| **Mod utilizare** | enum | Da | personal / taxi / curierat / etc. | — | — |
| **Combustibil (P.3)** | enum | Da | benzina/motorina/lpg/electric/hibrid | — | — |
| **Tip persoană** | enum | Da | individual / company | — | — |
| **Stare vehicul** | enum | Da | registered / pending / mayor_registered | — | — |
| **Sub-tip pending** | enum | Condiționat | second_hand_ro / foreign / new_dealer_ro | Obligatoriu dacă stare=pending | — |

### C.2. Cross-field warnings (non-blocking)

| Combinație câmpuri | Regulă | Warning message |
|---------------------|--------|-----------------|
| CNP + an permis | data_naștere(CNP) + 18 ≤ an permis | "Vârsta la obținere permis sub 18 ani — verifică datele" |
| VIN + marcă/model manual | VIN decoder result ≠ tipărit | "Marca din VIN ({decoded}) diferă de tipărit ({entered})" |
| An fabricație + Data primă înmatriculare | data_înmatriculare ≥ data_fabricație | "Data primă înmatriculare e înainte de an fabricație" |
| Masă maximă + categorie J | N1 ≤ 3500, M1 ≤ 3500, etc. | "Masa nu corespunde categoriei {J}" |
| ITP expirat + dată început poliță | itp_expires_at < start_date | "ITP expirat înainte de început poliță (Generali nu va emite)" |
| Capacitate + categorie | M1 < 50cc impossible | "Capacitate neobișnuită pentru categoria selectată" |
| Cod poștal + județ | mismatch | "Cod poștal nu se potrivește cu județul" |
| CNP + județ adresă | CNP județ digit (cif 8) ≠ adresă | "Județul din CNP diferă de adresă (acceptabil dacă te-ai mutat)" |

### C.3. Validări condiționale per stare vehicul

```typescript
// packages/validation/src/vehicle.ts
export const vehicleSchema = z.discriminatedUnion('registration_status', [
  z.object({
    registration_status: z.literal('registered'),
    plate_number: platRoSchema,  // OBLIGATORIU
    vin: vinSchema,
    // ... câmpuri standard
  }),
  z.object({
    registration_status: z.literal('pending_registration'),
    registration_subtype: z.enum(['second_hand_ro', 'foreign', 'new_dealer_ro']),
    plate_number: z.never().optional(),  // BLOCAT
    vin: vinSchema,
    justification_documents: z.array(z.string().url()).min(1, "Documente justificative obligatorii"),
    // ... câmpuri standard
  }),
  z.object({
    registration_status: z.literal('mayor_registered'),
    plate_number: z.string().regex(/^[A-Z]{2,3}\d+$/),  // format primărie
    vin: vinSchema,
    // ... câmpuri standard
  }),
]);
```

### C.4. Validări condiționale per tip persoană

```typescript
export const personSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('individual'),
    cnp: cnpSchema,
    first_name: z.string().min(1).max(50),
    last_name: z.string().min(1).max(50),
    id_doc_type: z.enum(['ci', 'bi', 'passport']),
    id_doc_series: z.string().min(2).max(10),
    id_doc_number: z.string().min(6).max(10),
    id_doc_expires_at: z.date().min(new Date(), "CI expirat"),
    license_year: z.number().int().min(1960).max(new Date().getFullYear()).optional(),
    has_no_license: z.boolean().default(false),
    email: z.string().email(),
    phone: phoneRoSchema,
    address: addressSchema,
  }),
  z.object({
    type: z.literal('company'),
    cui: cuiSchema,
    company_name: z.string().min(1).max(200),
    company_type: z.enum(['SRL', 'SA', 'PFA', 'II', 'SCS', 'SNC', 'other']),
    registration_number: z.string().regex(/^J\d{2}\/\d+\/\d{4}$/),
    caen_code: z.string().regex(/^\d{4}$/),
    representative: z.object({
      first_name: z.string(),
      last_name: z.string(),
      role: z.string(),
    }),
    driver: driverSchema.optional(),  // dacă diferit de reprezentant
    email: z.string().email(),
    phone: phoneRoSchema,
    address: addressSchema,
  }),
]).refine(
  data => {
    if (data.type === 'individual' && !data.has_no_license && !data.license_year) {
      return false;
    }
    return true;
  },
  { message: "An permis obligatoriu (sau bifează 'Fără permis')" }
);
```

### C.5. Address schema

```typescript
export const addressSchema = z.object({
  county: z.string().min(1, "Județ obligatoriu"),  // ex: "Brașov"
  city: z.string().min(1, "Localitate obligatorie"),
  street_type: z.enum(['stradă', 'bulevard', 'șosea', 'aleea', 'cale', 'piață', 'splai', 'intrare']),
  street: z.string().min(1, "Stradă obligatorie"),
  number: z.string().min(1, "Număr obligatoriu"),
  block: z.string().optional(),
  scara: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  postal_code: codPostalRoSchema,
});
```

### C.6. Acordurile pas 1 + pas 2

```typescript
export const acknowledgmentsStep1 = z.object({
  precontractual_informed: z.literal(true, {
    errorMap: () => ({ message: "Trebuie să confirmi luarea la cunoștință despre Informarea Precontractuală" })
  }),
  gdpr_processing: z.literal(true, {
    errorMap: () => ({ message: "Acord GDPR obligatoriu pentru ofertare" })
  }),
  no_consultancy_renunciation: z.literal(true, {
    errorMap: () => ({ message: "Pentru a continua trebuie să fii de acord cu renunțarea la acordarea de consultanță" })
  }),
});

export const acknowledgmentsStep2 = z.object({
  data_processing_personal: z.literal(true, {
    errorMap: () => ({ message: "Acord prelucrare date personale obligatoriu" })
  }),
  data_correctness: z.literal(true, {
    errorMap: () => ({ message: "Confirmă corectitudinea datelor" })
  }),
});
```

### C.7. Validări la upload fișiere

```typescript
export const fileUploadSchema = z.object({
  size: z.number().max(10 * 1024 * 1024, "Maxim 10MB"),
  type: z.enum(['image/jpeg', 'image/png', 'application/pdf'], {
    errorMap: () => ({ message: "Doar JPG, PNG sau PDF" })
  }),
  count: z.number().max(2, "Maxim 2 documente"),  // pentru landing OCR
});

export const documentJustificativeSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, "Maxim 5MB"),
  type: z.enum([
    'image/jpeg', 'image/png', 'image/bmp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ], {
    errorMap: () => ({ message: "Doar JPG, PNG, BMP, PDF, DOC, DOCX" })
  }),
});
```

### C.8. Algoritmi checksum complete

```typescript
// CNP — algoritm oficial RO
export function validateCnp(cnp: string): boolean {
  if (!/^\d{13}$/.test(cnp)) return false;
  const constants = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  const digits = cnp.split('').map(Number);
  const sum = digits.slice(0, 12).reduce((acc, d, i) => acc + d * constants[i], 0);
  let checksum = sum % 11;
  if (checksum === 10) checksum = 1;
  return checksum === digits[12];
}

// Extrage data nașterii din CNP
export function birthDateFromCnp(cnp: string): Date | null {
  if (!validateCnp(cnp)) return null;
  const sex = parseInt(cnp[0]);
  const yy = parseInt(cnp.slice(1, 3));
  const mm = parseInt(cnp.slice(3, 5));
  const dd = parseInt(cnp.slice(5, 7));
  let century: number;
  if (sex === 1 || sex === 2) century = 1900;
  else if (sex === 3 || sex === 4) century = 1800;
  else if (sex === 5 || sex === 6) century = 2000;
  else if (sex === 7 || sex === 8) century = 2000;  // rezidenți
  else return null;
  const year = century + yy;
  return new Date(year, mm - 1, dd);
}

// CUI — algoritm RO
export function validateCui(cui: string): boolean {
  const stripped = cui.replace(/^RO/i, '');
  if (!/^\d{2,10}$/.test(stripped)) return false;
  const digits = stripped.split('').reverse().map(Number);
  const checksum = digits[0];
  const constants = [7, 5, 3, 2, 1, 7, 5, 3, 2];
  const sum = digits.slice(1).reduce((acc, d, i) => acc + d * constants[i], 0);
  let computed = (sum * 10) % 11;
  if (computed === 10) computed = 0;
  return computed === checksum;
}

// IBAN RO — mod 97
export function validateIban(iban: string): boolean {
  if (!/^RO\d{2}[A-Z]{4}[A-Z0-9]{16}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, c => (c.charCodeAt(0) - 55).toString());
  return BigInt(numeric) % 97n === 1n;
}

// VIN — check digit position 9
export function validateVin(vin: string): boolean {
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return false;
  const transliteration: Record<string, number> = {
    A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9,
    '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
  };
  const weights = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  const sum = vin.split('').reduce((acc, c, i) => acc + transliteration[c] * weights[i], 0);
  const expected = sum % 11;
  const checkChar = vin[8];
  const expectedChar = expected === 10 ? 'X' : expected.toString();
  return checkChar === expectedChar;
}
```

---

## Anexa D — Error Messages Catalog

Toate erorile cu cod unic + RO + EN. Folosit pentru i18n + audit + analytics tracking.

### D.1. Form validation errors (1xxx)

| Cod | RO | EN |
|-----|-----|-----|
| `E1001` | CNP invalid (cifră de control greșită) | Invalid CNP (checksum failed) |
| `E1002` | CUI invalid (cifră de control greșită) | Invalid CUI (checksum failed) |
| `E1003` | IBAN invalid | Invalid IBAN |
| `E1004` | VIN invalid (17 caractere alfanumerice, fără I/O/Q) | Invalid VIN (17 alphanumeric chars, no I/O/Q) |
| `E1005` | VIN check digit invalid | Invalid VIN check digit |
| `E1006` | Număr înmatriculare RO invalid (ex: BV18BFG) | Invalid Romanian plate number |
| `E1007` | Telefon RO invalid | Invalid Romanian phone number |
| `E1008` | Email invalid | Invalid email |
| `E1009` | Cod poștal invalid (6 cifre, prima 1-8) | Invalid postal code |
| `E1010` | Serie CI invalidă | Invalid ID series |
| `E1011` | Număr CI invalid (6 cifre) | Invalid ID number |
| `E1012` | CI-ul tău este expirat | Your ID document has expired |
| `E1013` | An permis invalid (1960-azi) | Invalid license year |
| `E1014` | Capacitate cilindrică invalidă | Invalid engine capacity |
| `E1015` | Putere invalidă (în kW, nu CP) | Invalid engine power (kW, not HP) |
| `E1016` | Masă invalidă | Invalid mass |
| `E1017` | Cod CAEN invalid | Invalid CAEN code |
| `E1018` | Număr înregistrare invalid (ex: J40/1234/2026) | Invalid registration number |
| `E1019` | Data început: max 60 zile în avans | Start date: max 60 days in advance |
| `E1020` | Data trecută | Date in the past |
| `E1021` | Durată invalidă (1-11 luni) | Invalid duration (1-11 months) |
| `E1022` | An fabricație invalid | Invalid manufacture year |
| `E1023` | Dată primei înmatriculări invalid | Invalid first registration date |
| `E1024` | Documente justificative obligatorii | Justification documents required |
| `E1025` | Selectează companie leasing | Select leasing company |
| `E1026` | Acest CNP este deja folosit | This CNP is already used |
| `E1027` | An permis obligatoriu (sau bifează 'Fără permis') | License year required (or check 'No license') |
| `E1028` | Trebuie să confirmi luarea la cunoștință despre Informarea Precontractuală | You must acknowledge the Pre-contractual Information |
| `E1029` | Acord GDPR obligatoriu pentru ofertare | GDPR consent required for quoting |
| `E1030` | Pentru a continua trebuie să fii de acord cu renunțarea la acordarea de consultanță | You must agree to waive consultancy to continue |
| `E1031` | Acord prelucrare date personale obligatoriu | Personal data processing consent required |
| `E1032` | Confirmă corectitudinea datelor | Confirm data correctness |

### D.2. File upload errors (2xxx)

| Cod | RO | EN |
|-----|-----|-----|
| `E2001` | Maxim 2 documente: talon + carte de identitate | Max 2 documents: vehicle reg + ID |
| `E2002` | Doar JPG, PNG sau PDF | Only JPG, PNG or PDF |
| `E2003` | Maxim 10MB | Max 10MB |
| `E2004` | Doar JPG, PNG, BMP, PDF, DOC, DOCX | Only JPG, PNG, BMP, PDF, DOC, DOCX |
| `E2005` | N-am putut citi clar talonul. Reîncearcă sau completează manual. | Couldn't read vehicle reg clearly. Retry or fill manually. |
| `E2006` | N-am putut citi clar cartea de identitate. Reîncearcă sau completează manual. | Couldn't read ID clearly. Retry or fill manually. |
| `E2007` | Am detectat 2 documente la fel. Încarcă unul de fiecare tip. | Detected 2 same-type documents. Upload one of each. |
| `E2008` | N-am putut identifica documentul. Asigură-te că e talon sau CI. | Couldn't identify document. Ensure it's vehicle reg or ID. |
| `E2009` | Documente justificative: minim 1 fișier | Justification documents: at least 1 file |

### D.3. Auth + OTP errors (3xxx)

| Cod | RO | EN |
|-----|-----|-----|
| `E3001` | Cod incorect. Mai încearcă o dată sau [Trimite cod nou] | Incorrect code. Try again or [Resend] |
| `E3002` | Cod expirat. [Trimite cod nou] | Code expired. [Resend] |
| `E3003` | Prea multe încercări. Așteaptă 15 minute. | Too many attempts. Wait 15 minutes. |
| `E3004` | Sesiune expirată. Te rugăm să te autentifici din nou. | Session expired. Please sign in again. |
| `E3005` | Email-ul este deja folosit. [Autentifică-te →] | Email already in use. [Sign in →] |
| `E3006` | Eroare la trimitere cod. Încearcă din nou. | Error sending code. Try again. |

### D.4. Payment errors (4xxx)

| Cod | RO | EN |
|-----|-----|-----|
| `E4001` | Card refuzat de bancă. Încearcă altă metodă. | Card declined by bank. Try another method. |
| `E4002` | Fonduri insuficiente. | Insufficient funds. |
| `E4003` | Card expirat. | Card expired. |
| `E4004` | CVV invalid. | Invalid CVV. |
| `E4005` | Plată anulată de utilizator. | Payment canceled by user. |
| `E4006` | 3D Secure eșuat. | 3D Secure authentication failed. |
| `E4007` | Eroare la procesator. Încearcă din nou în câteva minute. | Processor error. Try again in a few minutes. |
| `E4008` | Sumă invalidă. | Invalid amount. |
| `E4009` | Apple Pay nu este disponibil pe acest device. | Apple Pay not available on this device. |
| `E4010` | Google Pay nu este configurat în browser. | Google Pay not configured in browser. |

### D.5. Insurance / quote errors (5xxx)

| Cod | RO | EN |
|-----|-----|-----|
| `E5001` | Asigurătorul {name} temporar indisponibil. Restul ofertelor sunt afișate. | Insurer {name} temporarily unavailable. Other offers shown. |
| `E5002` | Vehicul depășește limita de risc | Vehicle exceeds risk limit |
| `E5003` | Categorie neacceptată | Category not accepted |
| `E5004` | Nu emite RCA pentru această perioadă. Disponibil: {periods} | Doesn't issue RCA for this period. Available: {periods} |
| `E5005` | Ofertele au expirat. [Recreează căutarea →] | Offers expired. [Search again →] |
| `E5006` | Niciun asigurător nu a putut emite poliță. Te încadrezi la categoria 'risc ridicat'. [BAAR →] | No insurer could issue policy. You qualify as 'high risk'. [BAAR →] |
| `E5007` | Pentru {duration} luni, nicio ofertă. Schimbă perioada sau alege 12L. | No offers for {duration} months. Change period or choose 12M. |
| `E5008` | Polița se procesează la asigurător. Va sosi pe email în câteva minute. | Policy processing at insurer. Will arrive by email shortly. |
| `E5009` | Întâmpinăm o problemă cu asigurătorul. Te-am contactat la support. | Issue with insurer. We've reached out via support. |
| `E5010` | Anulare aprobată. Refund pe cardul {card}. ETA 5-10 zile lucrătoare. | Cancellation approved. Refund to card {card}. ETA 5-10 business days. |

### D.6. System / network errors (6xxx)

| Cod | RO | EN |
|-----|-----|-----|
| `E6001` | Conexiune pierdută. Reconectare... | Connection lost. Reconnecting... |
| `E6002` | Eroare server. Încearcă din nou. | Server error. Try again. |
| `E6003` | Cerere prea lungă. Conexiune lentă? | Request timeout. Slow connection? |
| `E6004` | 404 — Pagina nu există | 404 — Page not found |
| `E6005` | 500 — Eroare internă. Echipa a fost notificată. | 500 — Internal error. Team notified. |
| `E6006` | Aplicație în mentenanță. Revenim curând. | Application in maintenance. Back soon. |
| `E6007` | Prea multe cereri. Așteaptă {seconds} sec. | Too many requests. Wait {seconds}s. |
| `E6008` | Permisiune respinsă. | Permission denied. |

### D.7. GDPR / consent errors (7xxx)

| Cod | RO | EN |
|-----|-----|-----|
| `E7001` | Trebuie să accepți noii termeni pentru a continua. | You must accept new terms to continue. |
| `E7002` | Cookie-uri necesare blocate. Verifică setările browser-ului. | Required cookies blocked. Check browser settings. |
| `E7003` | Cont șters. Date anonimizate conform GDPR. | Account deleted. Data anonymized per GDPR. |
| `E7004` | Export date trimis pe email în max 24h. | Data export will be sent by email within 24h. |

---

## Anexa E — API Contracts complete

Toate endpoint-urile publice cu request + response Zod schemas + example payloads.

### E.1. POST `/api/v1/quotes`

**Scope:** creează cerere de oferte. Necesită Bearer token (api_clients) sau Clerk JWT (web app).

**Request schema:**

```typescript
import { z } from 'zod';

export const createQuoteRequestSchema = z.object({
  vehicle: z.discriminatedUnion('registration_status', [
    z.object({
      registration_status: z.literal('registered'),
      plate_number: platRoSchema,
      vin: vinSchema,
      make: z.string(),
      model: z.string(),
      vehicle_category: z.string(),
      vehicle_subcategory: z.string(),
      usage_type: z.enum(['personal', 'taxi', 'rideshare', 'delivery', 'school', 'transport_persons', 'transport_goods']),
      fuel_type: z.enum(['benzina', 'motorina', 'lpg', 'electric', 'hibrid']),
      year_of_manufacture: z.number().int().min(1900).max(new Date().getFullYear()),
      first_registration_date: z.string().date(),
      max_mass_kg: z.number().int().positive(),
      engine_capacity_cc: z.number().int().positive(),
      engine_power_kw: z.number().positive(),
      seats_count: z.number().int().positive(),
      civ_series: z.string().optional(),
      mileage: z.number().int().nonnegative().optional(),
      itp_expires_at: z.string().date().optional(),
    }),
    z.object({
      registration_status: z.literal('pending_registration'),
      registration_subtype: z.enum(['second_hand_ro', 'foreign', 'new_dealer_ro']),
      vin: vinSchema,
      // ... la fel ca registered, fără plate_number
      justification_document_ids: z.array(z.string().uuid()).min(1),
    }),
    z.object({
      registration_status: z.literal('mayor_registered'),
      plate_number: z.string(),
      vin: vinSchema,
      // ...
    }),
  ]),
  
  owner: personSchema,  // PF sau PJ (vezi C.4)
  
  drivers: z.array(driverSchema).max(5).default([]),
  
  is_leasing: z.boolean().default(false),
  leasing_company_id: z.string().uuid().optional(),
  
  start_date: z.string().date()
    .refine(d => new Date(d) > new Date(), "Data trebuie în viitor")
    .refine(d => differenceInDays(new Date(d), new Date()) <= 60, "Max 60 zile în avans"),
  
  duration_months_secondary: z.number().int().min(1).max(11),
  
  acknowledgments: z.object({
    precontractual_informed: z.literal(true),
    gdpr_processing: z.literal(true),
    no_consultancy_renunciation: z.literal(true),
    data_processing_personal: z.literal(true),
    data_correctness: z.literal(true),
  }),
});

export type CreateQuoteRequest = z.infer<typeof createQuoteRequestSchema>;
```

**Example request:**

```json
{
  "vehicle": {
    "registration_status": "registered",
    "plate_number": "BV18BFG",
    "vin": "WDB9066131S155032",
    "make": "MERCEDES-BENZ",
    "model": "Sprinter 209 CDI",
    "vehicle_category": "Autoutilitare și camioane (N)",
    "vehicle_subcategory": "Autoutilitare (N1)",
    "usage_type": "personal",
    "fuel_type": "motorina",
    "year_of_manufacture": 2007,
    "first_registration_date": "2007-02-02",
    "max_mass_kg": 2800,
    "engine_capacity_cc": 2148,
    "engine_power_kw": 65,
    "seats_count": 2,
    "civ_series": "R000123",
    "mileage": 190000,
    "itp_expires_at": "2026-12-15"
  },
  "owner": {
    "type": "individual",
    "cnp": "1960418080017",
    "first_name": "Filip",
    "last_name": "Blajiu",
    "id_doc_type": "ci",
    "id_doc_series": "ZV",
    "id_doc_number": "369226",
    "id_doc_expires_at": "2030-04-18",
    "license_year": 2016,
    "has_no_license": false,
    "email": "filip@example.ro",
    "phone": "+40727012763",
    "address": {
      "county": "Brașov",
      "city": "Râșnov",
      "street_type": "stradă",
      "street": "Vânători",
      "number": "51",
      "postal_code": "505400"
    }
  },
  "drivers": [],
  "is_leasing": false,
  "start_date": "2026-04-30",
  "duration_months_secondary": 6,
  "acknowledgments": {
    "precontractual_informed": true,
    "gdpr_processing": true,
    "no_consultancy_renunciation": true,
    "data_processing_personal": true,
    "data_correctness": true
  }
}
```

**Response schema:**

```typescript
export const createQuoteResponseSchema = z.object({
  quote_search_id: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'failed', 'high_risk']),
  expires_at: z.string().datetime(),
  offers: z.array(z.object({
    id: z.string().uuid(),
    insurer_code: z.string(),
    insurer_name: z.string(),
    insurer_logo_url: z.string().url(),
    duration_months: z.number().int(),
    premium_net: z.string(),  // decimal as string
    broker_commission: z.string(),
    total_amount: z.string(),
    currency: z.literal('RON'),
    bonus_malus_class: z.string(),
    direct_settlement_delta: z.string(),
    excluded_countries: z.array(z.string()),
    is_available: z.boolean(),
    unavailable_reason: z.string().nullable(),
    documents_url: z.string().url().nullable(),
  })),
  high_risk_info: z.object({
    is_high_risk: z.boolean(),
    baar_reference_tariff: z.string().nullable(),
    baar_link: z.string().url(),
  }).nullable(),
});
```

**Example response (success):**

```json
{
  "quote_search_id": "0193ed8c-9b2e-7f4a-b7c6-a8b0d5e2f1c3",
  "status": "completed",
  "expires_at": "2026-04-30T08:00:00Z",
  "offers": [
    {
      "id": "0193ed8c-9b30-72b4-9d8e-3f4c5a6b7e8d",
      "insurer_code": "eazy",
      "insurer_name": "eazy.insure",
      "insurer_logo_url": "https://aplicatie.ta/logos/eazy.svg",
      "duration_months": 12,
      "premium_net": "1314.60",
      "broker_commission": "69.19",
      "total_amount": "1383.79",
      "currency": "RON",
      "bonus_malus_class": "B6",
      "direct_settlement_delta": "141.34",
      "excluded_countries": ["AZ", "BY", "IR", "RUS", "UA"],
      "is_available": true,
      "unavailable_reason": null,
      "documents_url": "https://aplicatie.ta/ipid/eazy-12m.pdf"
    },
    {
      "id": "0193ed8c-9b31-7c52-8a4f-1b2e3c4d5e6f",
      "insurer_code": "eazy",
      "insurer_name": "eazy.insure",
      "insurer_logo_url": "https://aplicatie.ta/logos/eazy.svg",
      "duration_months": 6,
      "premium_net": "684.00",
      "broker_commission": "36.00",
      "total_amount": "720.00",
      "currency": "RON",
      "bonus_malus_class": "B6",
      "direct_settlement_delta": "70.50",
      "excluded_countries": ["AZ", "BY", "IR", "RUS", "UA"],
      "is_available": true,
      "unavailable_reason": null,
      "documents_url": "https://aplicatie.ta/ipid/eazy-6m.pdf"
    },
    {
      "id": "0193ed8c-9b32-7e8f-9d0a-4b5c6d7e8f9a",
      "insurer_code": "axeria",
      "insurer_name": "Axeria",
      "insurer_logo_url": "https://aplicatie.ta/logos/axeria.svg",
      "duration_months": 12,
      "premium_net": "0",
      "broker_commission": "0",
      "total_amount": "0",
      "currency": "RON",
      "bonus_malus_class": "B6",
      "direct_settlement_delta": "0",
      "excluded_countries": [],
      "is_available": false,
      "unavailable_reason": "Categorie neacceptată",
      "documents_url": null
    }
  ],
  "high_risk_info": null
}
```

**Example response (high risk):**

```json
{
  "quote_search_id": "0193ed8c-9b2e-7f4a-b7c6-a8b0d5e2f1c3",
  "status": "high_risk",
  "expires_at": "2026-04-30T08:00:00Z",
  "offers": [],
  "high_risk_info": {
    "is_high_risk": true,
    "baar_reference_tariff": "1152.20",
    "baar_link": "https://www.baar.ro/asigurati-cu-risc-ridicat/"
  }
}
```

**Error responses:**

```json
// 400 Bad Request — validation error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "path": ["owner", "cnp"], "code": "E1001", "message": "CNP invalid (cifră de control greșită)" }
    ]
  }
}

// 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired API key"
  }
}

// 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Reset at 2026-04-30T08:01:00Z",
    "retry_after_seconds": 30
  }
}
```

### E.2. GET `/api/v1/quotes/:id`

**Request:** `GET /api/v1/quotes/0193ed8c-9b2e-7f4a-b7c6-a8b0d5e2f1c3`

**Response:** identic cu createQuoteResponseSchema (returnează aceeași structură).

### E.3. POST `/api/v1/policies`

**Scope:** emite poliță dintr-o ofertă selectată.

**Request schema:**

```typescript
export const createPolicyRequestSchema = z.object({
  quote_offer_id: z.string().uuid(),
  direct_settlement: z.boolean().default(false),
  payment_method_id: z.string(),  // Stripe payment method ID
  acknowledgments: z.object({
    documents_received: z.literal(true),  // confirm IPID + T&C citite
  }),
});
```

**Example request:**

```json
{
  "quote_offer_id": "0193ed8c-9b30-72b4-9d8e-3f4c5a6b7e8d",
  "direct_settlement": false,
  "payment_method_id": "pm_1234567890",
  "acknowledgments": {
    "documents_received": true
  }
}
```

**Response schema:**

```typescript
export const createPolicyResponseSchema = z.object({
  policy_id: z.string().uuid(),
  status: z.enum(['active', 'pending']),
  policy_number: z.string().nullable(),
  pdf_url: z.string().url().nullable(),
  ipid_url: z.string().url().nullable(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  withdrawal_until: z.string().date(),
  total_amount: z.string(),
  payment_status: z.enum(['succeeded', 'pending', 'failed']),
});
```

**Example response (sync success):**

```json
{
  "policy_id": "0193ed8c-9b40-7e2a-b7c6-a8b0d5e2f1c3",
  "status": "active",
  "policy_number": "RCA-2026-0042-eazy",
  "pdf_url": "https://aplicatie.ta/api/policies/0193ed8c.../pdf?token=...",
  "ipid_url": "https://aplicatie.ta/api/policies/0193ed8c.../ipid?token=...",
  "start_date": "2026-04-30",
  "end_date": "2027-04-30",
  "withdrawal_until": "2026-05-14",
  "total_amount": "1383.79",
  "payment_status": "succeeded"
}
```

**Example response (async pending):**

```json
{
  "policy_id": "0193ed8c-9b40-7e2a-b7c6-a8b0d5e2f1c3",
  "status": "pending",
  "policy_number": null,
  "pdf_url": null,
  "ipid_url": null,
  "start_date": "2026-04-30",
  "end_date": "2027-04-30",
  "withdrawal_until": "2026-05-14",
  "total_amount": "1383.79",
  "payment_status": "succeeded"
}
```

User va trebui să poll-uiască `GET /api/v1/policies/:id` pentru a aștepta `status: 'active'`.

### E.4. GET `/api/v1/policies/:id`

**Response:** identic cu createPolicyResponseSchema.

### E.5. WhatsApp bot v2 example flow (folosind API)

```
User WhatsApp → "Vreau RCA pentru BV18BFG"

Bot → POST /api/v1/quotes (cu mock data minimal sau colectat conversațional)
   ← răspuns oferte
   
Bot → "Ai 9 oferte. Cea mai mică: eazy.insure 1.383,79 RON / 12L. Continui?"

User → "Da"

Bot → POST /api/v1/policies cu offer_id
   ← răspuns policy_id, plata redirect Stripe Checkout link
   
Bot → "Click aici pentru plată: stripe.com/c/pay/cs_..."

User → plătește

Webhook Stripe → backend → emit policy
   
Bot → "Polița ta e gata: PDF link"
```

---

## Anexa F — Stripe configuration detaliat

### F.1. Stripe account setup

**Cont business:**
- Tip cont: România business (LLC / SRL).
- Settlement: RON cont RO bancar.
- Activate: Card payments + Apple Pay + Google Pay + Stripe Link + SEPA Debit (v2).
- Verify business identity: ASF broker license + J nr + CUI.

**Configurare dashboard Stripe:**
1. Settings → Branding:
   - Logo brand (256×256 PNG).
   - Primary color match aplicatie.ta.
   - Icon for receipts.
2. Settings → Public details:
   - Business name: "Aplicatie.ta SRL".
   - Statement descriptor: "APLICATIE.TA RCA" (max 22 chars, apare pe extras card).
   - Support email + phone.
3. Settings → Customer emails:
   - Receipts auto-send: ON.
   - Custom email template cu logo + culori brand.

### F.2. Webhook endpoints

**Production:**
- URL: `https://aplicatie.ta/api/webhooks/stripe`
- Events to listen:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `payment_intent.canceled`
  - `charge.refunded`
  - `charge.dispute.created` (alert urgent)
  - `customer.created`
  - `customer.updated`
  - `customer.deleted`
- Webhook signing secret: stocat în Vercel env `STRIPE_WEBHOOK_SECRET`.

**Verificare semnătură:**

```typescript
const event = stripe.webhooks.constructEvent(
  body,                              // raw body string
  req.headers['stripe-signature']!,  // header signature
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

### F.3. Payment Element appearance API

```typescript
// apps/web/lib/stripe-appearance.ts
export const stripeAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSizeBase: '16px',
    colorPrimary: '#0066ff',         // brand primary
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorDanger: '#df1b41',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e5e5e5',
      boxShadow: 'none',
      padding: '12px',
    },
    '.Input:focus': {
      border: '1px solid #0066ff',
      boxShadow: '0 0 0 3px rgba(0, 102, 255, 0.1)',
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '4px',
    },
    '.Tab': {
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
      padding: '12px',
    },
    '.Tab--selected': {
      borderColor: '#0066ff',
      backgroundColor: 'rgba(0, 102, 255, 0.05)',
    },
  },
  labels: 'above',
};
```

### F.4. Payment Element options

```tsx
// apps/web/app/checkout/[offerId]/payment-element.tsx
import { Elements, PaymentElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutForm({ clientSecret, locale }: Props) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: stripeAppearance,
    locale: locale as 'ro' | 'en',  // i18n integration
    fonts: [{
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
    }],
  };
  
  return (
    <Elements stripe={stripePromise} options={options}>
      <ExpressCheckoutElement
        options={{
          buttonType: { applePay: 'buy', googlePay: 'buy' },
          buttonHeight: 48,
          paymentMethods: {
            applePay: 'auto',
            googlePay: 'auto',
            link: 'auto',
          },
        }}
        onConfirm={handleExpressConfirm}
      />
      
      <Separator>sau plătește cu cardul</Separator>
      
      <PaymentElement
        options={{
          layout: { type: 'tabs' },
          fields: {
            billingDetails: {
              name: 'auto',
              email: 'never',     // already collected pas 2
              phone: 'never',     // already collected pas 2
              address: {
                country: 'never', // hardcoded RO
                postalCode: 'auto',
                line1: 'never',
                line2: 'never',
                city: 'never',
                state: 'never',
              },
            },
          },
          terms: { card: 'never' },  // T&C-uri afișate separat
          wallets: { applePay: 'auto', googlePay: 'auto' },
        }}
      />
      
      <Button onClick={handleSubmit}>Plătește 1.383,79 RON →</Button>
    </Elements>
  );
}
```

### F.5. PaymentIntent creation

```typescript
// apps/web/app/api/payments/create-intent/route.ts
export async function POST(req: Request) {
  const { offerId } = await req.json();
  const userId = await getClerkUserId(req);
  
  const offer = await db.query.quote_offers.findFirst({
    where: eq(quote_offers.id, offerId),
    with: { quote_search: { with: { vehicle: true, owner: true } } },
  });
  
  if (!offer) throw new Error('Offer not found');
  if (offer.created_at < subMinutes(new Date(), 30)) throw new Error('Offer expired');
  
  // Get or create Stripe customer
  const stripeCustomer = await getOrCreateStripeCustomer(userId);
  
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(parseFloat(offer.total_amount) * 100), // bani
    currency: 'ron',
    customer: stripeCustomer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',  // no off-site, păstrăm UX inline
    },
    setup_future_usage: 'off_session',  // pentru renewal automat v2
    statement_descriptor_suffix: 'RCA',  // apare pe extras: APLICATIE.TA RCA
    description: `RCA ${offer.insurer_code} ${offer.duration_months}L pentru ${offer.quote_search.vehicle.plate_number}`,
    metadata: {
      user_id: userId,
      quote_offer_id: offerId,
      quote_search_id: offer.quote_search_id,
      insurer_code: offer.insurer_code,
      duration_months: String(offer.duration_months),
      vehicle_vin: offer.quote_search.vehicle.vin,
      vehicle_plate: offer.quote_search.vehicle.plate_number ?? '',
    },
    receipt_email: user.email,
  });
  
  await db.insert(payments).values({
    user_id: userId,
    quote_offer_id: offerId,
    stripe_payment_intent_id: intent.id,
    amount: offer.total_amount,
    currency: 'RON',
    status: 'pending',
  });
  
  return Response.json({
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
  });
}
```

### F.6. Webhook handler complet

```typescript
// apps/web/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const sig = (await headers()).get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });
  
  const body = await req.text();
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  // Idempotency
  const existing = await db.query.webhook_events.findFirst({
    where: eq(webhook_events.event_id, event.id),
  });
  if (existing) return Response.json({ received: true, idempotent: true });
  
  await db.insert(webhook_events).values({
    source: 'stripe',
    event_id: event.id,
    payload: event,
  });
  
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;
      
      case 'charge.dispute.created':
        await handleDisputeAlert(event.data.object as Stripe.Dispute);
        break;
      
      case 'customer.deleted':
        await handleCustomerDeleted(event.data.object as Stripe.Customer);
        break;
    }
    
    await db.update(webhook_events)
      .set({ processed_at: new Date() })
      .where(eq(webhook_events.event_id, event.id));
    
    return Response.json({ received: true });
  } catch (err) {
    await db.update(webhook_events)
      .set({ error: err.message })
      .where(eq(webhook_events.event_id, event.id));
    
    Sentry.captureException(err, { extra: { event_id: event.id, event_type: event.type } });
    
    return new Response(`Webhook handler error: ${err.message}`, { status: 500 });
  }
}

async function handlePaymentSuccess(intent: Stripe.PaymentIntent) {
  // 1. Update payment status
  const [payment] = await db.update(payments)
    .set({
      status: 'succeeded',
      completed_at: new Date(),
      payment_method: extractPaymentMethod(intent),
    })
    .where(eq(payments.stripe_payment_intent_id, intent.id))
    .returning();
  
  // 2. Trigger emisia poliță (sync hibrid)
  const policy = await emitPolicyHybrid(payment.quote_offer_id);
  
  // 3. Update payment cu policy_id
  await db.update(payments).set({ policy_id: policy.id }).where(eq(payments.id, payment.id));
  
  // 4. Email user cu poliță atașată
  if (policy.status === 'active') {
    await sendPolicyIssuedEmail(payment.user_id, policy.id);
  } else {
    // Async: email "se procesează"
    await sendPolicyProcessingEmail(payment.user_id, payment.quote_offer_id);
  }
  
  // 5. Push notification mobile (dacă device registered)
  await sendPushNotification(payment.user_id, {
    title: 'Plată reușită!',
    body: 'Polița ta se emite acum.',
    data: { policy_id: policy.id, screen: 'PolicyDetail' },
  });
  
  // 6. Track PostHog
  posthog.capture('payment_succeeded', {
    user_id: payment.user_id,
    payment_method: payment.payment_method,
    amount: payment.amount,
    insurer_code: intent.metadata.insurer_code,
  });
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  await db.update(payments)
    .set({
      status: 'failed',
      failure_reason: intent.last_payment_error?.message ?? 'Unknown',
    })
    .where(eq(payments.stripe_payment_intent_id, intent.id));
  
  // No automatic email — user-ul vede direct în UI errorul Stripe.
  // Doar dacă "soft fail" cu retry posibil → analytics event
  posthog.capture('payment_failed', {
    payment_intent_id: intent.id,
    reason: intent.last_payment_error?.code,
  });
}

async function handleRefund(charge: Stripe.Charge) {
  const refunded = charge.refunds?.data[0];
  if (!refunded) return;
  
  await db.update(payments)
    .set({ status: 'refunded' })
    .where(eq(payments.stripe_payment_intent_id, charge.payment_intent as string));
  
  await sendRefundProcessedEmail(payment.user_id, {
    amount: refunded.amount / 100,
    card_last4: charge.payment_method_details?.card?.last4,
  });
}

async function handleDisputeAlert(dispute: Stripe.Dispute) {
  // CRITIC: alert imediat la admin pentru chargeback
  await sendAdminAlert('Chargeback dispute opened', {
    dispute_id: dispute.id,
    payment_intent_id: dispute.payment_intent,
    amount: dispute.amount / 100,
    reason: dispute.reason,
    evidence_due_by: dispute.evidence_details?.due_by,
  });
  
  Sentry.captureMessage('Stripe chargeback dispute', { level: 'warning', extra: dispute });
}
```

### F.7. Refund operations

```typescript
// packages/api/src/refunds.ts
export async function refundPayment(opts: {
  paymentId: string;
  amountInBani: number;  // amount × 100
  reason: 'requested_by_customer' | 'duplicate' | 'fraudulent';
  metadata?: Record<string, string>;
}) {
  const payment = await db.query.payments.findFirst({
    where: eq(payments.id, opts.paymentId),
  });
  
  if (!payment) throw new Error('Payment not found');
  if (payment.status !== 'succeeded') throw new Error('Cannot refund non-succeeded payment');
  
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripe_payment_intent_id,
    amount: opts.amountInBani,
    reason: opts.reason,
    metadata: {
      user_id: payment.user_id,
      policy_id: payment.policy_id ?? '',
      ...opts.metadata,
    },
  });
  
  return refund;
}
```

### F.8. Stripe locale RO + EN

```typescript
// apps/web/lib/stripe-locale.ts
export function getStripeLocale(userLocale: string): Stripe.Locale {
  if (userLocale === 'ro') return 'ro';
  return 'en';
}
```

Pe Romanian locale, Stripe Elements afișează automat:
- "Numărul cardului" în loc de "Card number".
- "Data expirării" în loc de "Expiration date".
- "Cod de securitate" în loc de "CVC".
- Erori traduse RO automat.

### F.9. 3D Secure handling

Stripe gestionează 3DS automat când Payment Element confirmă plata:
- Dacă bancă cere 3DS → modal nativ Stripe deschide cu redirect către bancă.
- User completează SMS code / app push de la bancă.
- Returnare la `/checkout` cu state actualizat.
- `confirmPayment` returnează `error` sau success.

```typescript
const { error, paymentIntent } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: `${window.location.origin}/thank-you`,
  },
  redirect: 'if_required',  // doar dacă 3DS cere
});

if (error) {
  // E4001-E4010 mapping
  setErrorCode(mapStripeErrorToCode(error.code));
} else {
  // Success — webhook va trigger restul
  router.push('/thank-you?payment_intent=' + paymentIntent.id);
}
```

### F.10. Stripe Customer object — mapare

```typescript
// packages/api/src/stripe-customer.ts
export async function getOrCreateStripeCustomer(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new Error('User not found');
  
  // Check existing
  const existing = await stripe.customers.search({
    query: `metadata['user_id']:'${userId}'`,
    limit: 1,
  });
  if (existing.data.length > 0) return existing.data[0];
  
  // Create new
  return await stripe.customers.create({
    email: await decryptTier2(user.email_encrypted),
    phone: user.phone ? await decryptTier2(user.phone_encrypted) : undefined,
    metadata: { user_id: userId, clerk_user_id: user.clerk_user_id },
    preferred_locales: [user.locale],
  });
}
```

### F.11. Stripe Tax (v2)

Pentru v2 când vinzi servicii/produse cu TVA, activează Stripe Tax:
- Auto-calculează TVA pe baza adresă client.
- B2B reverse charge (PJ EU).
- Taxa diferită pe asigurare RCA (excepție TVA în RO).

V1: nu necesar — RCA are exception TVA (Cod fiscal art. 292).

### F.12. Stripe environment

| Env | Stripe key |
|-----|-----------|
| Local dev | `sk_test_...` (test mode) |
| Preview | `sk_test_...` (test mode) |
| Staging | `sk_test_...` (test mode) |
| Prod | `sk_live_...` (live mode) |

**Niciodată prod key în non-prod.** Webhook signing secrets diferite per env.

---

**FIN.**

Pentru orice ambiguitate apărută în timpul implementării, decide pe baza secțiunii relevante din acest document. Dacă o decizie nu e acoperită, consultă pattern-uri standard moderne pentru stack-ul TypeScript + Next.js + Expo + Drizzle + Stripe + Clerk.

Document mentenance: actualizează `MEMORY.md` cu pointeri la secțiunile relevante când iei decizii în implementare. Versiune nouă a documentului → bumpezi `Versiune` din header.
