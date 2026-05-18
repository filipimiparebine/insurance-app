# Politica de Confidențialitate

> **Versiune**: 1.0 · **Data**: 2026-05-17
> **Platformă**: blaj.io (aplicatie.ta)
> **Operator**: Laz Romania [SRL]
> **DPO**: Filip Blajiu — privacy@aplicatie.ta
> **Conform**: GDPR (Regulamentul UE 2016/679), Norma 22/2021 ASF, Legea 132/2017, Legea 506/2004

---

## 1. Cine suntem

Laz Romania [SRL] este operatorul platformei **blaj.io** (aplicatie.ta), un broker de asigurări digital care compară oferte RCA și intermediază emiterea polițelor.

Această Politică de Confidențialitate explică:
- Ce date colectăm
- De ce le colectăm
- Cum le protejăm
- Cu cine le împărtășim
- Ce drepturi ai
- Cât timp le păstrăm

---

## 2. Ce date colectăm

### 2.1. Date necesare pentru ofertare și emitere RCA

| Dată | De ce o colectăm | Temei legal |
|---|---|---|
| **CNP** (Cod Numeric Personal) | Identificare unică, verificare bonus-malus în CEDAM/BAAR, emitere poliță | Obligație legală (Norma 22/2021, Legea 132/2017) |
| **Nume și prenume** | Identificare pe poliță | Obligație legală |
| **Adresă completă** (județ, localitate, stradă, număr, cod poștal) | Necesară pe polița RCA. Determină tariful (zona geografică) | Obligație legală |
| **Email** | Verificare identitate (Norma 22/2021), comunicare oferte și poliță, notificări reînnoire | Consimțământ + obligație legală |
| **Telefon** | Contact în caz de daună, notificări reînnoire (opțional) | Consimțământ |
| **Serie și număr CI/BI** | Verificare identitate la emitere poliță | Obligație legală |
| **Date vehicul** (VIN, marcă, model, an, capacitate, putere, masă, combustibil, număr locuri, număr înmatriculare, serie CIV, ITP, kilometraj) | Calculul primei RCA, emitere poliță | Obligație legală |

### 2.2. Date colectate automat

| Dată | Scop | Temei legal |
|---|---|---|
| **Adresă IP** | Securitate, prevenire fraudă, diagnosticare erori | Interes legitim |
| **Tip browser și sistem de operare** | Optimizare experiență, diagnosticare | Interes legitim |
| **Paginile vizitate și acțiunile** (dacă ai acceptat cookies analytics) | Analiza utilizării pentru îmbunătățirea produsului | Consimțământ |
| **Evenimente de eroare** (Sentry) | Diagnosticare și reparare bug-uri | Interes legitim |

### 2.3. Date pe care NU le colectăm

- **Datele cardului bancar** — sunt procesate direct de Stripe. Noi nu le vedem și nu le stocăm.
- **Date de sănătate** (v1) — nu sunt relevante pentru RCA.
- **Date de localizare precisă** (GPS) — nu urmărim locația.
- **Date despre minori** — Platforma nu este destinată persoanelor sub 18 ani.

---

## 3. Cum protejăm datele tale

Securitatea datelor tale este prioritatea noastră zero. Folosim securitate de nivel medical (conform standardelor internaționale):

### 3.1. Criptare în straturi

- **Datele cele mai sensibile** (CNP, CI, IBAN) sunt criptate cu **envelope encryption** folosind Google Cloud KMS (Hardware Security Module). Chiar dacă cineva ar fura baza de date, datele ar fi ilizibile fără cheile criptografice care nu părăsesc niciodată hardware-ul securizat.
- **Datele personale** (nume, adresă, email, telefon) sunt criptate la nivel de coloană în baza de date (pgcrypto).
- **Datele în tranzit** sunt protejate prin TLS 1.3 (același standard folosit de bănci).

### 3.2. Izolarea datelor

- Fiecare utilizator poate accesa **doar propriile date**. La nivelul bazei de date, un utilizator nu poate vedea datele altui utilizator, chiar și în cazul unei erori de programare (Row-Level Security).
- Toate accesările datelor sensibile sunt **înregistrate într-un jurnal imutabil** (audit log) care nu poate fi șters sau modificat.

### 3.3. Certificări și audituri

- **Stripe** este certificat PCI DSS Level 1 (cel mai înalt standard pentru procesarea plăților).
- **Google Cloud** este certificat ISO 27001, SOC 2, și GDPR-compliant.
- Planificăm **audit ISO 27001** în primul an de operare și **teste de penetrare** externe.

Pentru detalii tehnice complete, vizitează pagina noastră de [Securitate](/securitate).

---

## 4. Cu cine împărtășim datele

Datele tale sunt împărtășite doar atunci când este strict necesar și cu parteneri atent selecționați:

| Destinatar | Ce date primește | De ce |
|---|---|---|
| **Asigurătorii RCA** | CNP, nume, adresă, date vehicul, perioadă | Pentru a genera oferta și a emite polița |
| **Stripe** | Email, sumă de plată | Pentru procesarea plății (Stripe nu primește CNP-ul tău) |
| **Clerk** | Email, nume | Pentru autentificare și verificare email |
| **Resend** | Email, nume | Pentru trimiterea email-urilor tranzacționale (poliță, confirmări) |
| **Google Document AI** | Imagini talon + CI (temporar, doar dacă încarci documente) | Pentru auto-completarea datelor prin OCR |
| **PostHog** | Date de navigare anonimizate (doar dacă accepți cookies analytics) | Pentru analiza utilizării platformei |
| **Sentry** | Date tehnice (IP, browser) + erori | Pentru diagnosticarea problemelor tehnice |

**Nu vindem datele tale. Nu le folosim în scopuri publicitare fără consimțământ explicit.**

Toți partenerii noștri sunt obligați contractual (DPA — Data Processing Agreement) să protejeze datele la același nivel ca noi.

---

## 5. Transferul internațional al datelor

Toate datele tale sunt stocate și procesate **în Uniunea Europeană** (Frankfurt, Germania, pentru serverele principale).

Unii parteneri tehnici (Stripe, Clerk, Google) au sediul în SUA. Pentru aceștia, transferul de date se face în baza **Clauzelor Contractuale Standard (SCC)** aprobate de Comisia Europeană, care asigură un nivel adecvat de protecție.

---

## 6. Cât timp păstrăm datele

| Categorie | Perioadă de păstrare |
|---|---|
| Date poliță activă | Pe toată durata poliței |
| Date cont activ | Pe toată durata contului |
| Date cont după ultima activitate | 1 an de la ultima poliță, apoi anonimizare |
| Date necesare legal (fiscal) | 10 ani (conform Codului Fiscal) |
| Cookie-uri analytics (dacă acceptate) | 2 ani |
| Imagini OCR (talon, CI) | Procesate și șterse imediat. Nu sunt stocate permanent. |

După expirarea perioadei de păstrare, datele sunt **anonimizate** (ireversibil) sau șterse definitiv.

---

## 7. Drepturile tale

Conform GDPR, ai următoarele drepturi:

### 7.1. Dreptul de acces (Art. 15)
Poți solicita o copie a datelor tale personale pe care le deținem. Le poți vedea oricând în contul tău (secțiunea Profil).

### 7.2. Dreptul la rectificare (Art. 16)
Poți corecta datele incorecte direct din contul tău sau contactându-ne.

### 7.3. Dreptul la ștergere (Art. 17 — "dreptul de a fi uitat")
Poți solicita ștergerea contului și a datelor asociate. Excepții: datele a căror păstrare este obligatorie legal (ex. date fiscale — 10 ani).

### 7.4. Dreptul la restricționare (Art. 18)
Poți solicita limitarea prelucrării în anumite situații.

### 7.5. Dreptul la portabilitate (Art. 20)
Poți solicita exportul datelor tale într-un format structurat (JSON).

### 7.6. Dreptul la opoziție (Art. 21)
Te poți opune prelucrării datelor în scopuri de marketing direct sau bazate pe interes legitim.

### 7.7. Dreptul de a retrage consimțământul (Art. 7)
Pentru prelucrările bazate pe consimțământ (ex. cookies analytics, SMS notifications), îți poți retrage consimțământul oricând.

### Cum îți exerciți drepturile

- **Din cont**: Setări → Profil → Confidențialitate
- **Prin email**: privacy@aplicatie.ta
- **Timp de răspuns**: În termen de 30 de zile calendaristice

Dacă nu ești mulțumit de răspunsul nostru, ai dreptul să depui o plângere la **ANSPDCP** (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal) — www.dataprotection.ro.

---

## 8. Cookie-uri

Pentru detalii complete despre cookie-urile utilizate, vezi [Politica de Cookie-uri](/cookies).

Pe scurt:
- **Cookie-uri necesare**: Esențiale pentru funcționarea platformei (autentificare, securitate). Nu pot fi dezactivate.
- **Cookie-uri funcționale**: Preferințe de limbă, formulare pre-completate. Opționale.
- **Cookie-uri analytics** (PostHog): Ne ajută să înțelegem cum e folosită platforma pentru a o îmbunătăți. Opționale.
- **Cookie-uri marketing** (Google Ads, Meta Pixel): Pentru măsurarea eficienței publicității. Opționale.

Poți gestiona preferințele oricând din banner-ul de cookie-uri sau din setările browser-ului.

---

## 9. Securitatea datelor în caz de incident

În cazul improbabil al unui incident de securitate care implică datele tale personale:

1. Vom notifica **ANSPDCP** în termen de 72 de ore (conform Art. 33 GDPR).
2. Te vom notifica **direct** dacă incidentul prezintă un risc ridicat pentru drepturile și libertățile tale (Art. 34 GDPR).
3. Vom lua măsuri imediate pentru a limita impactul și a preveni repetarea.

Chiar și în cazul unui furt al bazei de date, datele tale cele mai sensibile (CNP, CI) sunt criptate și ilizibile fără cheile criptografice păstrate în hardware-uri securizate separate.

---

## 10. Modificări ale acestei Politici

Această Politică poate fi actualizată periodic. Te vom notifica prin email cu cel puțin 30 de zile înainte de orice modificare semnificativă. Versiunile anterioare sunt disponibile la cerere.

---

## 11. Contact

Pentru orice întrebări sau solicitări legate de confidențialitate:

- **DPO (Data Protection Officer)**: Filip Blajiu
- **Email DPO**: privacy@aplicatie.ta
- **Email general**: support@aplicatie.ta
- **Adresă poștală**: Laz Romania [SRL], [adresă sediu social], România

---

**Ultima actualizare**: 2026-05-17
