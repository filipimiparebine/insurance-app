# DPIA — Data Protection Impact Assessment (Evaluarea Impactului asupra Protecției Datelor)

> **Versiune**: 1.0 · **Data**: 2026-05-17 · **Autor**: Laz Romania (DPO self-appointed: Filip Blajiu)
> **Conform**: GDPR Art. 35, Norma 22/2021 ASF, Legea 132/2017
> **Status**: Simplificat (v1). Full DPIA v2 la adăugarea datelor de sănătate (Art. 9 GDPR).

---

## 1. Introducere

### 1.1. Operatorul de date

| Câmp | Valoare |
|---|---|
| **Denumire** | Laz Romania sau entitatea legală SRL |
| **Reprezentant legal** | Filip Blajiu |
| **DPO** | Filip Blajiu (self-appointed v1) |
| **Email DPO** | privacy@aplicatie.ta |
| **Sediu** | România |
| **Autoritate supraveghere** | ANSPDCP (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal) |
| **Registrul comerțului** | TBD (SRL details) |

### 1.2. Scopul DPIA

Această DPIA evaluează riscurile asociate prelucrării datelor cu caracter personal în cadrul platformei **blaj.io** (aplicatie.ta), o platformă digitală de brokeraj în asigurări RCA conform Legii 132/2017, operată de un broker autorizat ASF.

Platforma colectează, procesează și stochează date personale (inclusiv date sensibile precum CNP, serie CI, adresă, date vehicul) pentru:
1. Generarea de oferte RCA de la asigurători autorizați
2. Emiterea polițelor de asigurare RCA
3. Gestionarea conturilor de utilizator
4. Trimiterea de notificări de reînnoire
5. Procesarea plăților prin Stripe
6. Îndeplinirea obligațiilor legale (Norma 22/2021 ASF, Legea 132/2017)

### 1.3. Necesitatea DPIA

DPIA este necesară conform Art. 35(1) GDPR deoarece:
- Prelucrarea implică date cu caracter personal **la scară largă** (publicul din România)
- Sunt prelucrate **categorii speciale de date** (CNP — identificator național unic)
- Se utilizează **tehnologii noi** (OCR, GCP KMS, envelope encryption)
- Prelucrarea poate afecta un număr mare de persoane

---

## 2. Descrierea prelucrării

### 2.1. Datele colectate — clasificare pe tier-uri

#### Tier 1 — Date critice (catastrofale la leak)
| Dată | Sursă | Bază legală | Perioadă retenție |
|---|---|---|---|
| CNP (Cod Numeric Personal) | Introdus manual sau extras OCR din CI | Consimțământ + obligație legală (Norma 22/2021) | 5 ani după ultima poliță activă, apoi anonimizat |
| CUI (Cod Unic de Înregistrare — PJ) | Introdus manual | Consimțământ + obligație legală | 5 ani, apoi anonimizat |
| IBAN | Introdus manual (rambursări) | Consimțământ | Până la procesarea rambursării + 90 zile |
| Serie + număr CI/BI | Introdus manual sau OCR | Obligație legală (Norma 22/2021) | 5 ani, apoi anonimizat |
| Stripe customer token | Generat de Stripe | Contract (executare plată) | Durata contului + 90 zile |

#### Tier 2 — Date sensibile (dăunătoare la leak)
| Dată | Sursă | Bază legală | Perioadă retenție |
|---|---|---|---|
| Nume + prenume | Introdus manual sau OCR | Consimțământ + contract | Durata contului + 1 an |
| Adresă completă (județ, localitate, stradă, număr, cod poștal) | Introdus manual sau extras din talon/CI | Obligație legală (polița RCA) | 5 ani |
| Telefon | Introdus manual | Consimțământ + contract | Durata contului |
| Email | Introdus manual + verificat OTP | Consimțământ + obligație legală (Norma 22/2021 art. 44-45) | Durata contului |
| Dată naștere (derivată din CNP) | Calculat din CNP | Obligație legală (asigurare) | 5 ani |

#### Tier 3 — Date operaționale
| Dată | Sursă | Bază legală | Perioadă retenție |
|---|---|---|---|
| VIN (serie șasiu) | Introdus manual / OCR talon / VIN lookup | Obligație legală (RCA) | 5 ani |
| Marcă, model vehicul | VIN lookup / OCR talon / manual | Obligație legală (RCA) | 5 ani |
| Număr înmatriculare | Introdus manual / OCR talon | Obligație legală (RCA) | 5 ani |
| Date tehnice vehicul (capacitate, putere, masă, combustibil, locuri) | VIN lookup / talon | Obligație legală (RCA) | 5 ani |
| Preț poliță, perioadă | Calculat de platformă | Contract + obligație legală | 10 ani (fiscal) |
| Cookie preferences | Selectat de utilizator | Consimțământ | Până la schimbare |
| Date navigare (PostHog) | Automat (dacă cookies analytics acceptate) | Consimțământ | 2 ani |

### 2.2. Fluxul datelor

```
User → Landing (VIN/nr. înmatriculare)
     → Pas 1 Vehicul (date vehicul + OCR opțional)
     → Pas 2 Proprietar (CNP, nume, adresă, email, telefon)
     → Email OTP verificare (Clerk)
     → Pas 3 Configurare poliță (dată început, durată)
     → Pas 4 Oferte (agregator asigurători — date transmise criptat)
     → Checkout + Plată (Stripe — tokenizare card, fără stocare card)
     → Emitere poliță (date transmise asigurătorului pentru emitere)
```

### 2.3. Destinatarii datelor

| Destinatar | Date transmise | Temei legal | Transfer internațional |
|---|---|---|---|
| **Asigurători** (9 asigurători RCA RO) | CNP, nume, adresă, date vehicul, perioadă | Obligație legală (Norma 22/2021, Legea 132/2017) | NU (toți în RO/EU) |
| **Stripe** (procesator plăți) | Email, sumă, token card (nu card complet) | Contract (executare plată) | Da (Stripe Inc., SUA) — SCC-uri în vigoare |
| **Clerk** (autentificare) | Email, nume | Contract (funcționare serviciu) | Da (Clerk Inc., SUA) — SCC-uri, EU region selectat |
| **Resend** (email tranzacțional) | Email, nume, conținut email | Contract (funcționare serviciu) | Nu (EU region) |
| **Twilio** (SMS opțional) | Număr telefon, conținut SMS | Consimțământ | Nu (EU region) |
| **Google Document AI** (OCR) | Imagini talon + CI (temporar, procesare sincron) | Consimțământ | Da (Google LLC, SUA) — SCC-uri, europe-west3 region |
| **PostHog** (analytics) | Date navigare anonimizate | Consimțământ (cookies analytics) | Nu (EU cloud) |
| **Neon** (bază de date Postgres) | Toate datele, criptate la stocare | Contract (funcționare serviciu) | Nu (eu-central-1, Frankfurt) |
| **GCP Cloud KMS** (criptare) | Chei criptografice, nu date personale | Contract | Nu (europe multi-region) |
| **Hetzner S3** (stocare documente) | Talon, CI, polițe PDF, IPID | Obligație legală | Nu (Falkenstein, DE) |
| **Sentry** (error tracking) | Date tehnice (IP, user agent) + erori aplicație | Interes legitim (diagnoză) | Nu (EU region) |

### 2.4. Tehnologii utilizate

- **Platformă**: Next.js 15 + Expo (mobile)
- **Bază de date**: Neon Postgres (serverless, eu-central-1)
- **Criptare**: Envelope encryption (GCP KMS + XChaCha20-Poly1305) pentru Tier 1; pgcrypto pentru Tier 2; plaintext criptat at-rest prin AES-256 Neon pentru Tier 3
- **Autentificare**: Clerk (Email OTP, EU region)
- **OCR**: Google Document AI (europe-west3, procesare sincron, fără stocare permanentă)
- **Plăți**: Stripe Elements (tokenizare, fără stocare date card pe serverele proprii)
- **Analytics**: PostHog (EU cloud, anonimizare IP)
- **Logging**: Axiom (EU region), Sentry (EU region)

---

## 3. Evaluarea necesității și proporționalității

### 3.1. Necesitatea fiecărei categorii de date

| Dată | Necesară? | Justificare | Alternativă? |
|---|---|---|---|
| CNP | **Da** | Obligatoriu pentru emitere RCA (Norma 22/2021). Identificare unică în sistemul BAAR/CEDAM pentru bonus-malus. | Nu există — CNP e obligatoriu legal |
| Serie + număr CI | **Da** | Obligatoriu pentru verificare identitate la emitere poliță | Nu |
| Adresă completă | **Da** | Obligatoriu pe polița RCA. Determină tariful RCA (județ/zona) | Nu |
| Email | **Da** | Obligatoriu pentru verificare identitate conform Norma 22/2021 art. 44-45 | Nu |
| Telefon | **Da** | Asigurătorul îl tipărește pe poliță. Necesar pentru contact în caz de daună | Nu (apare pe poliță) |
| Date vehicul complete | **Da** | Obligatoriu pentru calculul primei RCA conform Legii 132/2017 | Nu |
| Cookie preferences | **Da** | Obligatoriu conform GDPR + ePrivacy Directive | Nu |

### 3.2. Proporționalitatea măsurilor de securitate

| Măsură | Justificare proporționalitate |
|---|---|
| Envelope encryption + KMS HSM pentru Tier 1 | CNP + CI leak = furt de identitate. Costul criptării justificat de risc. |
| Column-level pgcrypto pentru Tier 2 | Echilibru securitate vs performanță. Căutare după email via HMAC indexat. |
| Plaintext pentru Tier 3 | Date non-PII. Backup-uri Neon deja criptate AES-256 at-rest. |
| RLS (Row-Level Security) | Izolare utilizator la nivel DB — prevenire bug acces cross-user. |
| Audit log append-only | Detectare acces neautorizat + trasabilitate GDPR (Art. 30). |
| Eliminare date card de pe server | Stripe tokenizează — nu stocăm carduri. Conform PCI DSS. |

---

## 4. Evaluarea riscurilor

### 4.1. Riscuri identificate

| # | Risc | Probabilitate | Impact | Risc net |
|---|---|---|---|---|
| R1 | **DB dump leak** (Neon compromise) | Scăzută | Foarte mare | **Mediu** |
| R2 | **Access neautorizat la date Tier 1** (atacator obține acces la aplicație) | Scăzută | Foarte mare | **Mediu** |
| R3 | **Interceptare date în tranzit** | Foarte scăzută | Mare | **Scăzut** |
| R4 | **Eroare software — leak cross-user** (bug în API) | Medie | Mare | **Mediu** |
| R5 | **Insider threat** (admin Neon / Vercel) | Foarte scăzută | Foarte mare | **Scăzut** |
| R6 | **Partajare excesivă date către third-party** (asigurători, Stripe, etc.) | Medie | Medie | **Mediu** |
| R7 | **Non-conformitate cookie consent** (consimțământ invalid) | Medie | Medie | **Mediu** |
| R8 | **Data retention excesiv** (date păstrate peste necesar) | Scăzută | Medie | **Scăzut** |
| R9 | **Google Document AI — procesare date în afara EU** | Scăzută | Medie | **Scăzut** |
| R10 | **Neon PITR snapshot leak** (point-in-time recovery) | Foarte scăzută | Foarte mare | **Scăzut** |

### 4.2. Măsuri de mitigare existente

#### R1 — DB dump leak
- **Criptare Tier 1**: Envelope encryption cu GCP KMS HSM. DEK wrapped, KEK nu părăsește HSM-ul hardware.
- **Criptare Tier 2**: pgcrypto cu cheie rotabilă.
- **Rezultat**: Chiar dacă DB-ul e compromis, datele Tier 1 sunt ciphertext fără cheie. Atacatorul ar trebui să compromită simultan Neon + GCP IAM pentru a decripta.

#### R2 — Access neautorizat la date Tier 1
- **RLS Postgres**: Fiecare conexiune setată cu `app.current_user_id`. User A nu poate vedea datele user B.
- **Audit log**: Fiecare acces la date Tier 1 logat append-only. Alertare la volum anormal.
- **Rate limiting**: Upstash Redis rate-limit pentru endpoint-urile care decriptează.
- **KMS usage limits**: GCP KMS quota per minut — previne brute-force decriptare.

#### R3 — Interceptare date în tranzit
- **TLS 1.3** peste tot (Vercel, Neon, Stripe, Clerk, etc.).
- **HSTS** activat.
- **Certificate pinning** pe mobile (Expo).

#### R4 — Eroare software leak cross-user
- **RLS** la nivel DB — ultima linie de apărare.
- **Zod validation** pe toate input-urile.
- **oRPC type-safety** end-to-end — previne type confusion.
- **Playwright E2E** teste pe flow-uri critice.

#### R5 — Insider threat
- **Separation of duties**: Neon admin ≠ Vercel admin ≠ GCP admin.
- **MFA** pe toate conturile de producție.
- **Audit log** imutabil.
- **DPO self-appointed** cu responsabilitate de monitorizare.

#### R6 — Partajare excesivă date third-party
- **Date minimizate** per destinatar: asigurătorii primesc doar câmpurile necesare emiterii (CNP, nume, adresă, date vehicul — nu date de card, nu cookie preferences).
- **Contracte DPA** cu toți procesatorii (Stripe, Clerk, Google, Resend, Twilio, PostHog, Sentry).
- **SCC-uri** pentru transferurile internaționale (Stripe US, Clerk US, Google US).

#### R7 — Non-conformitate cookie consent
- **Cookie banner custom** cu 4 categorii (necesare, funcționale, analytics, marketing).
- **Opt-in strict**: nimic înainte de consimțământ explicit.
- **Persistare** în `consents_log` cu versionare.
- **Re-prompt** la schimbare T&C.
- **Bilingual** RO + EN.

#### R8 — Data retention excesiv
- **Politică de retenție** definită per categorie de date (vezi 2.1).
- **Anonimizare automată** după expirare: `anonymized_at` timestamp, datele Tier 1-3 șterse/anonimizate.
- **Soft delete**: `deleted_at` cu păstrare 30 zile pentru recuperare, apoi ștergere definitivă.
- **GDPR delete request**: endpoint pentru ștergere cont + date asociate (Art. 17).

#### R9 — Google Document AI procesare date non-EU
- **Region lock**: `europe-west3` (Frankfurt) — datele nu părăsesc EU.
- **Procesare sincronă**: datele nu sunt stocate de Google după procesare.
- **SCC-uri** în vigoare pentru transferul tehnic necesar funcționării API-ului.

#### R10 — Neon PITR snapshot leak
- **Criptare at-rest AES-256** pe toate snapshot-urile Neon.
- **Versioning + object lock** pe Hetzner S3 pentru backup exports.
- **Backup-urile conțin date deja criptate** (Tier 1 ciphertext + DEK wrapped).

---

## 5. Procesul de consultare

### 5.1. Părți consultate

| Parte | Rol | Status |
|---|---|---|
| **DPO** (Filip Blajiu, self-appointed) | Coordonare DPIA, evaluare riscuri | Realizat |
| **CTO / dezvoltator** | Implementare măsuri tehnice de securitate | Realizat |
| **ANSPDCP** | Autoritatea de supraveghere | Necesar consultare prealabilă dacă riscul net rămâne ridicat după mitigare |
| **Persoane vizate** | Feedback asupra prelucrării (opțional) | Nu este cazul la scară MVP |

### 5.2. Concluzia consultării

Riscurile reziduale după aplicarea măsurilor de mitigare sunt **scăzute spre medii** pentru majoritatea riscurilor. Nu a fost identificat niciun risc net **ridicat** care să necesite consultare prealabilă ANSPDCP conform Art. 36 GDPR.

---

## 6. Concluzii și plan de acțiune

### 6.1. Evaluare generală

Prelucrarea datelor cu caracter personal în platforma **blaj.io** (aplicatie.ta) este:
- **Necesară** pentru furnizarea serviciului de brokeraj RCA
- **Proporțională** — datele colectate sunt minimul necesar legal și operațional
- **Securizată adecvat** — envelope encryption cu KMS HSM pentru date critice (CNP, CI), pgcrypto pentru date sensibile, RLS pentru izolare, audit log pentru trasabilitate
- **Conformă GDPR** — temeiuri legale clare, consimțământ granular, drepturi persoane vizate implementate, notificări transparente, DPO desemnat, DPIA realizată

### 6.2. Plan de acțiune și îmbunătățiri continue

| # | Acțiune | Responsabil | Termen |
|---|---|---|---|
| 1 | Finalizare ROPA (Records of Processing Activities) — Art. 30 GDPR | DPO | Pre-lansare |
| 2 | Publicare Politică de Confidențialitate (RO + EN) pe site | DPO + CTO | Pre-lansare |
| 3 | Publicare Termeni și Condiții + Politică Cookies | DPO + CTO | Pre-lansare |
| 4 | Implementare endpoint ștergere date (Art. 17 GDPR) | CTO | Pre-lansare |
| 5 | Implementare endpoint export date (Art. 20 GDPR) | CTO | Luna 1 post-lansare |
| 6 | Pen-test extern (Bit Sentinel sau similar) | CTO + DPO | Luna 6-12 |
| 7 | Upgrade DPIA la versiune full când se adaugă asigurări de sănătate (Art. 9 GDPR) | DPO extern (Phase 2) | Înainte de v2 lansare |
| 8 | ISO 27001 audit | DPO extern + auditor certificat | Luna 12 |
| 9 | Angajare DPO extern / fracțional când volumul justifică | CEO | Luna 6-12 (Phase 2) |
| 10 | Revizuire anuală DPIA | DPO | Anual |

### 6.3. Aprobare

| Rol | Nume | Data |
|---|---|---|
| **DPO** | Filip Blajiu | 2026-05-17 |
| **Reprezentant legal** | Filip Blajiu | 2026-05-17 |

---

## Anexa A — Tabel sumar măsuri tehnice și organizatorice

| Categorie | Măsură | Status |
|---|---|---|
| **Criptare stocare** | Envelope encryption Tier 1 (GCP KMS + XChaCha20-Poly1305) | Implementat |
| **Criptare stocare** | Column-level pgcrypto Tier 2 | Implementat |
| **Criptare stocare** | AES-256 at-rest Neon Tier 3 | Implementat de Neon |
| **Criptare tranzit** | TLS 1.3 peste tot | Implementat |
| **Control acces** | RLS Postgres per utilizator | Implementat |
| **Control acces** | Clerk auth cu Email OTP | Implementat |
| **Control acces** | Admin panel Refine.dev cu email allowlist | Implementat |
| **Audit** | Audit log append-only pentru acces PII | Implementat |
| **Audit** | Jurnalizare acces date Tier 1 | Implementat |
| **Minimizare date** | Date transmise asigurătorilor minimizate | Implementat |
| **Tokenizare plăți** | Stripe Elements — fără stocare card pe server | Implementat |
| **Consimțământ** | Cookie banner granular 4 categorii, opt-in strict | Implementat |
| **Drepturi persoane** | Endpoint ștergere date (Art. 17) | Pre-lansare |
| **Drepturi persoane** | Endpoint portabilitate date (Art. 20) | Luna 1 |
| **Notificare breach** | Procedură definită, notificare ANSPDCP în 72h | Implementat |
| **Backup** | PITR Neon (point-in-time recovery) + export S3 | Implementat |
| **DR** | RTO 4h / RPO 1h (plan disaster recovery) | Implementat |
| **Monitorizare** | Sentry + Axiom + Uptime Kuma | Implementat |
| **Pen-test** | Extern (Bit Sentinel), pre-ISO 27001 | Planificat luna 6-12 |
| **Formare** | Training GDPR pentru toți angajații/colaboratorii | Planificat pre-lansare |
