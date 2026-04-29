# design.md — Specificație design high-fidelity blaj.io

> Document pentru Claude Design (sau alt designer/AI) ca să producă mock-up-uri Figma high-fidelity. Bazat pe `aplicatie.md`. Versiune: `1.0` · Data: `2026-04-29`.
>
> **Brand:** blaj.io · **Mood:** Wise + Stripe + Marshmallow · **Stack UI:** shadcn/ui + Tailwind + Framer Motion · **Tipografie:** Geist Sans + Inter · **Limbi:** RO + EN

---

## Cuprins

1. [Brand identity & positioning](#1-brand-identity--positioning)
2. [Brand voice + copy guidelines](#2-brand-voice--copy-guidelines)
3. [Logo system](#3-logo-system)
4. [Sistem culori (light + dark, auto-detect)](#4-sistem-culori)
5. [Tipografie](#5-tipografie)
6. [Spacing system](#6-spacing-system)
7. [Border radius scale](#7-border-radius-scale)
8. [Shadow scale](#8-shadow-scale)
9. [Motion tokens & principii animație](#9-motion-tokens)
10. [Iconografie](#10-iconografie)
11. [Illustration & imagery (cu Marshmallow-style portraits)](#11-illustration--imagery)
12. [Component library — fiecare componentă](#12-component-library)
13. [Layout patterns globali](#13-layout-patterns)
14. [Pagină cu pagină — wireframes hi-fi](#14-pagină-cu-pagină)
15. [Form steps detaliat — micro-interactions](#15-form-steps-detaliat)
16. [The 3 Wow Moments — specificație ceas](#16-the-3-wow-moments)
17. [Empty / Loading / Error states](#17-empty--loading--error-states)
18. [Mobile responsive breakpoints](#18-mobile-responsive)
19. [Accessibility specs concrete](#19-accessibility-specs)
20. [Dark mode — diferențe vs light](#20-dark-mode)
21. [Asset deliverables list](#21-asset-deliverables-list)

---

## 1. Brand identity & positioning

### 1.1. Brand essence

**blaj.io** = brokerul digital românesc de încredere care îți simplifică asigurările.

**Esență:** *"Asigurări fără labirint."*

**Personalitate brand:**
- **Calm, dar competent** — nu strigă, nu manipulează, nu exagerează. Spune lucrurile clar și pleacă.
- **Premium, dar accesibil** — design elegant care nu intimidează. Granny safe + tech-savvy approved.
- **Românesc, dar fără cliché** — fără steaguri, fără folclor, fără tricolor. Românism prin contextul și relevanța conținutului, nu prin estetică.
- **Modern, dar demn** — nu e Lemonade-style cartoon playful. E mai aproape de Wise sau Linear: rafinat, încrezător, ușor de folosit.

### 1.2. Position statement

> "blaj.io e brokerul digital care compară instant ofertele a 9 asigurători și emite polița în 3 minute, cu transparență totală asupra prețului și securitate de nivel bancar."

### 1.3. Audiență țintă (3 persone)

#### Persona 1 — "Andrei, 28, dezvoltator IT"
- Comportament: caută rapid, vrea cel mai bun preț, citește detaliat înainte de cumpărare.
- Așteaptă: Apple Pay, dark mode, design modern, fără friction.
- Decision driver: preț + reputație asigurător + UX.

#### Persona 2 — "Mihaela, 42, manager într-o firmă"
- Comportament: are 2 mașini personale + 3 mașini la firmă, vrea totul într-un loc.
- Așteaptă: cont reutilizabil, "Garaj" multi-vehicle, factură fiscală PJ corectă, suport rapid.
- Decision driver: timp salvat + transparență.

#### Persona 3 — "Ion, 64, pensionar"
- Comportament: prefer să sune dar e dispus să încerce online dacă e simplu.
- Așteaptă: text mare lizibil, butoane clare, fără termeni tehnici, opțiune să sune dacă se blochează.
- Decision driver: simplicitate + încredere + un buton mare la final.

**Designul trebuie să servească toate 3 simultan.** Asta înseamnă:
- Text mare și contrast ridicat (Persona 3) chiar dacă persona 1 ar accepta mai mic.
- Flow simplu liniar (Persona 3) chiar dacă persona 1 ar accepta multi-tab.
- Animații subtile (Persona 3 nu vrea distraction) cu wow moments controlate (Persona 1 le apreciază).
- Dark mode auto (Persona 1 are sistem pe dark) fără să-l forțeze (Persona 3 are sistem pe light).

---

## 2. Brand voice + copy guidelines

### 2.1. Tone of voice

**Profesional warm.** Adresare cu **"tu"** (informal RO) pentru că majoritatea ecommerce RO modern folosește tu, dar formularea e respectuoasă, nu pretențioasă-pe-pop.

### 2.2. Reguli copy

| ✅ Da | ❌ Nu |
|---|---|
| "Polița ta e gata." | "Polița dumneavoastră a fost emisă cu succes." |
| "Mulțumim!" | "Vă mulțumim pentru încrederea acordată." |
| "Compari 9 asigurători instant." | "Sistemul nostru va compara prețurile pentru tine." |
| "Plătești în 1 minut." | "Procesul de plată durează aproximativ un minut." |
| "Ai grijă! Polița ta expiră în 7 zile." | "ATENȚIE: Polița dumneavoastră urmează a expira în 7 zile." |
| "Niciun asigurător nu a putut emite poliță." | "Suntem în imposibilitatea de a furniza o ofertă." |

### 2.3. Reguli microcopy buttons

| Acțiune | Buton text |
|---|---|
| Continuă form | **"Pasul următor →"** (NU "Continue", NU "Next") |
| Înapoi | **"← Înapoi"** |
| Submit final cumpără | **"Plătește 1.383,79 RON →"** (cu suma vizibilă) |
| Anulare | **"Renunț"** sau **"Închide"** |
| Confirmare critică | **"Da, anulez polița"** (verb explicit, nu just "Confirm") |
| Vezi detalii | **"Vezi detalii ▼"** |
| Empty CTA | **"Calculează prima oră RCA →"** (cu emoji subtil în loc de doar "Începe") |

### 2.4. Numerale

- Format RO: `1.383,79 RON` (punct ca separator mii, virgulă ca separator zecimale).
- Date: `28 aprilie 2026` (zi, lună scrisă cu literă mică, an).
- Ore: `14:30` (24h).
- Telefon: `+40 727 012 763` (spații tip standard internațional).
- IBAN: `RO12 BTRL 1234 5678 9012 3456` (4 caractere grupate).

### 2.5. Mesaje de erori — format

**Pattern:** `[Ce e greșit]. [Cum se rezolvă].`

✅ "CNP-ul are 13 cifre. Verifică dacă ai introdus toate cifrele."
❌ "Eroare validare CNP."

✅ "Codul a expirat. Apasă [Trimite cod nou] pentru a primi unul valabil."
❌ "Cod invalid. Reîncearcă."

### 2.6. Mesaje de succes

**Pattern:** `[Verb activ trecut]. [Ce urmează].`

✅ "Plată reușită! Polița ta se emite acum."
✅ "Cont creat! Hai să-ți facem prima poliță."

---

## 3. Logo system

### 3.1. Construcție logo

**blaj.io** = wordmark cu un punct accent.

```
b l a j . i o
            ^
            punct accent — culoare orange #FF6B1A
```

**Construcție:**
- Tipografie: Geist Sans, weight 600 (Semibold), tracking -0.02em (slightly tight).
- Toate literele lowercase.
- Punctul `.` între "blaj" și "io" e **accent dot** colorat în portocaliu (`#FF6B1A`), 1.5× dimensiunea punctului standard (vizual proeminent).
- Spațiere normală între caractere, fără kerning manual.

### 3.2. Variante logo

| Variantă | Folosit pentru | Color |
|---|---|---|
| **Primary (light bg)** | header, footer, light backgrounds | Antracit `#0A0A0F` text + orange `#FF6B1A` dot |
| **Primary (dark bg)** | dark mode header, dark footer | Off-white `#FAFAFC` text + orange `#FF6B1A` dot |
| **Mono dark** | print, embossing, single-color contexts | Antracit `#0A0A0F` total, dot inclusiv |
| **Mono light** | watermark, embossing pe dark | Off-white `#FAFAFC` total |
| **Favicon** | browser tab, app icon | Doar litera **"b"** + dot `.` în orange. 32×32, 64×64, 192×192, 512×512 PNG + ICO. |
| **App icon iOS/Android** | mobile app | Pătrat 1024×1024 — fundal antracit + "b." center în orange. Rounded corners gestionate de OS. |

### 3.3. Spațiu de protecție (clear space)

Logo-ul are nevoie de un spațiu liber în jur egal cu **înălțimea literei "b"** pe toate cele 4 laturi. Nu plasa text/imagine în această zonă.

### 3.4. Dimensiuni minime

- Print: minim 20mm lățime.
- Digital: minim 80px lățime (sub asta = ilizibil).
- Favicon: minim 16px (forma simplificată cu doar "b.").

### 3.5. Folosiri interzise

- ❌ Nu rotește logo-ul.
- ❌ Nu schimba culorile (orange dot = mereu `#FF6B1A` în primary).
- ❌ Nu add bordură, shadow, outline.
- ❌ Nu schimba font (Geist 600 always).
- ❌ Nu skiu / italic.
- ❌ Nu plasa pe imagini complexe fără overlay (folosește varianta mono pe dark overlay).

---

## 4. Sistem culori

### 4.1. Filozofia paletei

Paleta blaj.io e construită în jurul a **3 culori cheie + neutrali warm-shifted**:

- **Antracit** (primary) — autoritate, premium, serios.
- **Albastru electric** (accent secundar) — trust, action, link.
- **Portocaliu vibrant** (accent primar) — wow moments, CTAs critice, accent pe logo.

Plus o gama de **neutrali ușor warm** (nu pure gray; ușor încalzit cu un tint maro foarte subtil pentru a evita "AI-generic blue-gray").

### 4.2. Light mode tokens

```css
/* === BRAND === */
--color-brand-primary:        #0A0A0F;   /* antracit, aproape negru cu tint albastru */
--color-brand-accent:         #FF6B1A;   /* orange vibrant, ușor mai cald decât pure orange */
--color-brand-accent-hover:   #E85A0F;   /* orange darker pentru hover */
--color-brand-accent-soft:    #FFF1E8;   /* orange foarte deschis pentru backgrounds subtile */

--color-electric:             #2563EB;   /* blue electric, pentru links + secondary actions */
--color-electric-hover:       #1D4ED8;
--color-electric-soft:        #EFF6FF;

/* === NEUTRALI (warm-shifted) === */
--color-neutral-50:           #FAFAFC;   /* off-white aproape pure, cu tint warm subtil */
--color-neutral-100:          #F4F4F7;
--color-neutral-200:          #E8E8ED;
--color-neutral-300:          #D4D4DC;
--color-neutral-400:          #9D9DA8;
--color-neutral-500:          #6B6B78;   /* mid gray, lizibil ca text secundar */
--color-neutral-600:          #4A4A55;
--color-neutral-700:          #2E2E37;
--color-neutral-800:          #1A1A22;
--color-neutral-900:          #0A0A0F;   /* same as brand-primary */

/* === SEMANTIC === */
--color-success:              #16A34A;   /* green-600 */
--color-success-soft:         #DCFCE7;
--color-warning:              #EA580C;   /* orange-600 (slightly different from brand orange) */
--color-warning-soft:         #FFEDD5;
--color-danger:               #DC2626;   /* red-600 */
--color-danger-soft:          #FEE2E2;
--color-info:                 #0284C7;   /* sky-600 */
--color-info-soft:            #E0F2FE;

/* === SURFACES === */
--color-bg:                   var(--color-neutral-50);     /* main background */
--color-surface:              #FFFFFF;                     /* cards, modals */
--color-surface-raised:       #FFFFFF;                     /* dropdowns, popovers */
--color-surface-overlay:      rgba(10, 10, 15, 0.6);       /* modal backdrop */

/* === TEXT === */
--color-text-primary:         var(--color-neutral-900);
--color-text-secondary:       var(--color-neutral-500);
--color-text-tertiary:        var(--color-neutral-400);
--color-text-on-brand:        #FFFFFF;                     /* text pe antracit */
--color-text-on-accent:       #FFFFFF;                     /* text pe orange */

/* === BORDERS === */
--color-border-subtle:        var(--color-neutral-200);
--color-border-default:       var(--color-neutral-300);
--color-border-strong:        var(--color-neutral-400);
--color-border-focus:         var(--color-electric);

/* === STATES === */
--color-hover-overlay:        rgba(10, 10, 15, 0.04);     /* hover background subtle */
--color-active-overlay:       rgba(10, 10, 15, 0.08);
--color-disabled-bg:          var(--color-neutral-100);
--color-disabled-text:        var(--color-neutral-400);
```

### 4.3. Dark mode tokens (auto-detect via `prefers-color-scheme`)

```css
@media (prefers-color-scheme: dark) {
  /* === BRAND === */
  --color-brand-primary:        #FAFAFC;   /* invert: off-white as primary surface for text */
  --color-brand-accent:         #FF7A2D;   /* slightly brighter orange for dark contrast */
  --color-brand-accent-hover:   #FF8C45;
  --color-brand-accent-soft:    #2A1B0F;   /* dark warm orange tint */
  
  --color-electric:             #3B82F6;   /* slightly brighter blue */
  --color-electric-hover:       #60A5FA;
  --color-electric-soft:        #0F1929;
  
  /* === NEUTRALI inversed === */
  --color-neutral-50:           #0A0A0F;   /* darkest, same as brand-primary light mode */
  --color-neutral-100:          #11111A;
  --color-neutral-200:          #1A1A22;
  --color-neutral-300:          #2E2E37;
  --color-neutral-400:          #4A4A55;
  --color-neutral-500:          #6B6B78;
  --color-neutral-600:          #9D9DA8;
  --color-neutral-700:          #D4D4DC;
  --color-neutral-800:          #E8E8ED;
  --color-neutral-900:          #FAFAFC;
  
  /* === SEMANTIC adjusted pentru dark === */
  --color-success:              #22C55E;
  --color-success-soft:         #052E16;
  --color-warning:              #FB923C;
  --color-warning-soft:         #2A1B0F;
  --color-danger:               #EF4444;
  --color-danger-soft:          #2A0A0A;
  --color-info:                 #38BDF8;
  --color-info-soft:            #0C1F2E;
  
  /* === SURFACES === */
  --color-bg:                   #0A0A0F;
  --color-surface:              #11111A;   /* cards o nuanță mai deschisă decât bg */
  --color-surface-raised:       #1A1A22;   /* dropdowns o nuanță în plus */
  --color-surface-overlay:      rgba(0, 0, 0, 0.7);
  
  /* === TEXT === */
  --color-text-primary:         #FAFAFC;
  --color-text-secondary:       #9D9DA8;
  --color-text-tertiary:        #6B6B78;
  --color-text-on-brand:        #0A0A0F;
  --color-text-on-accent:       #FFFFFF;
  
  /* === BORDERS === */
  --color-border-subtle:        #1A1A22;
  --color-border-default:       #2E2E37;
  --color-border-strong:        #4A4A55;
  --color-border-focus:         #3B82F6;
  
  /* === STATES === */
  --color-hover-overlay:        rgba(255, 255, 255, 0.05);
  --color-active-overlay:       rgba(255, 255, 255, 0.1);
  --color-disabled-bg:          #1A1A22;
  --color-disabled-text:        #4A4A55;
}
```

### 4.4. Reguli folosire culori

| Regulă | De ce |
|---|---|
| **Antracit** (primary) folosit doar pentru text + butoane primare critice. | Păstrează autoritatea ca să nu se dilueze. |
| **Orange** (accent) folosit ZGÂRCIT — doar logo dot, hero CTA, success animations, "Wow" emphasis. Niciodată pe form fields. | Orange peste tot = vizual zgomot, pierderea distinctivității. |
| **Blue electric** folosit pentru links text, secondary CTAs, focus rings, interactive states. | Trust + action signal universal recunoscut. |
| **Neutralii warm** baza pentru tot textul body + backgrounds + cards. | Calm, nu zgomot, evită "AI cold blue-gray" comun. |
| **Semantic colors** (success/warning/danger) folosiți **doar** pentru toast/banners/badge cu mesaj specific. | Nu pentru decor. |
| **Gradients** = folosite doar pentru 3 wow moments (vezi secțiunea 16) și hero background subtil. | Gradients sunt cliché în AI design — folosiți cu intenție. |

### 4.5. Contrast WCAG 2.2 AA verificat

| Combinație | Contrast | WCAG AA |
|---|---|---|
| Antracit `#0A0A0F` pe Off-white `#FAFAFC` | 19.8:1 | ✅✅ AAA |
| Neutral-500 `#6B6B78` pe Off-white | 5.2:1 | ✅ AA Large + AA Normal |
| Orange `#FF6B1A` pe Off-white | 3.4:1 | ✅ AA Large only |
| Orange `#FF6B1A` text pe Antracit | 5.6:1 | ✅ AA |
| Electric blue `#2563EB` pe Off-white | 5.0:1 | ✅ AA |
| White pe Antracit `#0A0A0F` | 19.8:1 | ✅✅ AAA |

**Reguli derivate:**
- Orange folosit ca text mare (>18px bold sau >24px regular) — **niciodată** ca body text.
- Orange folosit ca buton background cu text alb deasupra — OK.

---

## 5. Tipografie

### 5.1. Familie fonturi

**Display: Geist Sans** (Vercel, open source via Google Fonts).
- Folosit pentru: H1, H2, H3, hero text, butoane mari, numbers showcase.
- Caracter: geometric, modern, distinct, cu un slight tech edge.

**Body: Inter** (Google Fonts, open source).
- Folosit pentru: H4-H6, paragraphs, labels, inputs, captions, body text complet.
- Caracter: optimizat pentru lizibilitate digitală la toate mărimile, neutral, calm.

**Mono: Geist Mono** (când trebuie).
- Folosit pentru: cod (rareori), numere policy, IBAN, VIN display, audit log.

### 5.2. Type scale

| Token | Size (px) | Line height | Letter spacing | Weight | Folosit pentru |
|---|---|---|---|---|---|
| `text-display-2xl` | 80 / 5rem | 1.05 | -0.04em | Geist 600 | Hero H1 desktop |
| `text-display-xl` | 64 / 4rem | 1.05 | -0.04em | Geist 600 | Hero H1 mobile / large headlines |
| `text-display-lg` | 48 / 3rem | 1.1 | -0.03em | Geist 600 | Section H1 |
| `text-display-md` | 36 / 2.25rem | 1.15 | -0.02em | Geist 600 | Section H2 |
| `text-display-sm` | 28 / 1.75rem | 1.2 | -0.02em | Geist 600 | Card titles, subsection H2 |
| `text-xl` | 24 / 1.5rem | 1.35 | -0.01em | Geist 500 | H3, important labels |
| `text-lg` | 20 / 1.25rem | 1.4 | -0.01em | Inter 500 | H4, lead paragraph |
| `text-base` | 16 / 1rem | 1.5 | 0 | Inter 400 | Body text default |
| `text-sm` | 14 / 0.875rem | 1.5 | 0 | Inter 400 | Secondary text, labels |
| `text-xs` | 12 / 0.75rem | 1.5 | 0.01em | Inter 500 | Captions, badges, tiny labels |
| `text-tabular` | 16 / 1rem | 1.5 | 0 | Geist Mono 400 | Numere policy, IBAN |

### 5.3. Reguli typography

| Regulă | Detaliu |
|---|---|
| **Body min 16px** | Persona 3 (vârstnici) cere asta. Nu coborâ sub 14px nici pentru captions cu informație utilă. |
| **Line height generos** | Min 1.5 pentru body, 1.35 pentru titluri. Persona 3 citește mai lent — spațiu între linii ajută. |
| **Letter spacing negative pe display** | -0.02em până la -0.04em. Conferă sofisticare modernă (Stripe-style). |
| **Letter spacing 0 pe body** | Default Inter optim. |
| **Numerals tabular în tabele** | `font-feature-settings: 'tnum'` sau Geist Mono pentru tabele cu prețuri ca să se alinieze. |
| **Maxim 75 ch pe linie** | Citire confortabilă. Aplicat pe paragrafele lungi din `/securitate`, `/intrebari-frecvente`. |
| **Italic foarte rar** | Doar pentru citate. Nu pentru emphasis — folosește weight în loc. |
| **Allcaps doar pentru badge-uri foarte mici** | Cu letter-spacing 0.05em. Nu pentru titluri (Geist 600 e expressive enough). |

### 5.4. Asset list font

- Geist Sans: 400, 500, 600, 700 — woff2 self-hosted din Vercel package.
- Inter: 400, 500, 600 — Google Fonts (display=swap).
- Geist Mono: 400, 500 — self-hosted.

Self-host pentru CWV (LCP) — Google Fonts external = +50ms latency.

---

## 6. Spacing system

### 6.1. Filozofia

**Bazat pe 4px grid.** Toate spațierile multiplu de 4px.

**"Aerisit" = preferă valori mai mari decât te-ai aștepta.** Hero sections cu 96-128px padding vertical. Card padding 24-32px standard.

### 6.2. Scale

| Token | Value | Folosit pentru |
|---|---|---|
| `space-0` | 0 | reset |
| `space-1` | 4px | tighest gaps (icon adjacent text) |
| `space-2` | 8px | small gaps inside compact elements |
| `space-3` | 12px | gaps între form labels și inputs |
| `space-4` | 16px | base unit; padding small buttons, gaps standard |
| `space-5` | 20px | gap between form fields |
| `space-6` | 24px | card padding standard, section gap small |
| `space-8` | 32px | card padding large, section gap medium |
| `space-10` | 40px | section padding mobile |
| `space-12` | 48px | section gap desktop |
| `space-16` | 64px | hero section padding mobile |
| `space-20` | 80px | hero padding desktop standard |
| `space-24` | 96px | hero padding desktop spacious |
| `space-32` | 128px | mega hero (homepage only) |

### 6.3. Container widths

| Container | Max width | Folosit pentru |
|---|---|---|
| `container-narrow` | 640px | text-heavy pages (`/intrebari-frecvente`, articole, `/termeni`) |
| `container-default` | 1080px | most content pages, cont, form steps |
| `container-wide` | 1280px | dashboards, admin Refine, comparator oferte desktop |
| `container-full` | 100% | hero sections cu visual breakout |

Padding orizontal default: `clamp(16px, 4vw, 32px)` (responsive).

### 6.4. Reguli spaciere

| Regulă | Detaliu |
|---|---|
| **Section vertical padding** | `clamp(64px, 10vh, 128px)` — scalabil cu viewport |
| **Card padding** | 24px mobile, 32px desktop |
| **Form vertical gap** | 20px între câmpuri (suficient pentru breathing) |
| **Form horizontal gap** | 16px între coloane (la 2-col layouts) |
| **Button padding** | 12px vertical × 24px horizontal (sm), 16px × 32px (md), 20px × 40px (lg) |
| **Modal padding** | 32px desktop, 24px mobile |
| **Toast padding** | 16px × 20px |
| **Topbar height** | 72px desktop, 64px mobile |
| **Footer padding** | 64px vertical, 32px horizontal |

---

## 7. Border radius scale

```css
--radius-none:    0;
--radius-sm:      6px;     /* buttons small, badges, chips */
--radius-md:      10px;    /* inputs, buttons default */
--radius-lg:      14px;    /* cards, modals */
--radius-xl:      20px;    /* hero cards, image containers */
--radius-2xl:     28px;    /* drop zones, large cards featured */
--radius-full:    9999px;  /* pills, avatars */
```

### 7.1. Folosire

| Element | Radius |
|---|---|
| Buton standard | `--radius-md` (10px) |
| Buton large hero | `--radius-lg` (14px) |
| Input field | `--radius-md` (10px) |
| Card listing oferte | `--radius-lg` (14px) |
| Card hero (drop zone) | `--radius-2xl` (28px) — aerisit, soft |
| Modal | `--radius-lg` (14px) |
| Toast | `--radius-md` (10px) |
| Avatar | `--radius-full` |
| Chip filter | `--radius-full` |
| Logo asigurător container | `--radius-md` (10px) |
| Image preview | `--radius-lg` (14px) |

---

## 8. Shadow scale

Shadows sunt **subtile** — nu Material Design heavy. Stripe-style elegance.

```css
/* Light mode shadows */
--shadow-xs:  0 1px 2px 0 rgba(10, 10, 15, 0.04);
--shadow-sm:  0 1px 3px 0 rgba(10, 10, 15, 0.06), 0 1px 2px 0 rgba(10, 10, 15, 0.04);
--shadow-md:  0 4px 6px -1px rgba(10, 10, 15, 0.06), 0 2px 4px -2px rgba(10, 10, 15, 0.04);
--shadow-lg:  0 10px 15px -3px rgba(10, 10, 15, 0.08), 0 4px 6px -4px rgba(10, 10, 15, 0.04);
--shadow-xl:  0 20px 25px -5px rgba(10, 10, 15, 0.08), 0 8px 10px -6px rgba(10, 10, 15, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(10, 10, 15, 0.16);

/* Focus shadow (Apple-style) */
--shadow-focus: 0 0 0 4px rgba(37, 99, 235, 0.12);  /* electric blue subtle ring */

/* Wow moments — orange glow accent */
--shadow-glow-accent: 0 0 0 1px rgba(255, 107, 26, 0.3), 0 8px 32px -4px rgba(255, 107, 26, 0.4);
```

```css
/* Dark mode shadows mai prominent (eyes adaptează) */
@media (prefers-color-scheme: dark) {
  --shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
  --shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  --shadow-focus: 0 0 0 4px rgba(59, 130, 246, 0.3);
  --shadow-glow-accent: 0 0 0 1px rgba(255, 122, 45, 0.4), 0 8px 32px -4px rgba(255, 122, 45, 0.5);
}
```

### 8.1. Folosire

| Element | Shadow |
|---|---|
| Button default | `--shadow-xs` |
| Button hover | `--shadow-sm` |
| Card listing | `--shadow-sm` (rest), `--shadow-md` (hover) |
| Card hero featured | `--shadow-lg` |
| Modal | `--shadow-2xl` |
| Dropdown / popover | `--shadow-lg` |
| Toast | `--shadow-md` |
| Drop zone landing (active drop state) | `--shadow-glow-accent` (orange glow!) |
| Focus state pe input | `--shadow-focus` (blue ring subtil) |

---

## 9. Motion tokens

### 9.1. Filozofie animație

**3 principii non-negociabile:**

1. **Purposeful** — orice animație trebuie să comunice ceva (state change, hierarchy, feedback). Decorație pură = NU.
2. **Quick** — sub 300ms pentru micro-interactions, sub 600ms pentru tranziții majore. Persona 3 nu apreciază lent.
3. **Reduced motion respect** — toate animațiile dezactivate dacă `prefers-reduced-motion: reduce`.

### 9.2. Duration tokens

```css
--duration-instant:  0ms;
--duration-fast:     150ms;   /* hover, focus */
--duration-base:     200ms;   /* most transitions */
--duration-medium:   300ms;   /* modal open, drawer */
--duration-slow:     500ms;   /* page transitions, hero reveals */
--duration-slower:   700ms;   /* wow moments only */
```

### 9.3. Easing tokens

```css
--ease-linear:       cubic-bezier(0, 0, 1, 1);
--ease-in:           cubic-bezier(0.4, 0, 1, 1);
--ease-out:          cubic-bezier(0, 0, 0.2, 1);                /* default */
--ease-in-out:       cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1);          /* slight overshoot */
--ease-spring-soft:  cubic-bezier(0.16, 1, 0.3, 1);              /* smooth Apple-style */
```

### 9.4. Animation patterns folosite

| Pattern | Duration | Easing | Folosit pentru |
|---|---|---|---|
| **Fade in** | 200ms | `ease-out` | Toast appear, tooltip show |
| **Fade out** | 150ms | `ease-in` | Toast dismiss, tooltip hide |
| **Slide up + fade** | 300ms | `ease-spring-soft` | Modal open, drawer mobile |
| **Slide down + fade** | 200ms | `ease-in` | Modal close |
| **Scale + fade** | 250ms | `ease-spring-soft` | Dropdown, popover |
| **Translate Y -8px** | 200ms | `ease-out` | Card hover lift |
| **Translate Y 0** | 150ms | `ease-in` | Card hover release |
| **Skeleton shimmer** | 1500ms loop | `ease-in-out` | Loading skeletons |
| **Confetti burst** | 700ms | `ease-spring` | Checkout success (wow moment 3) |
| **Drag-drop reveal** | 500ms | `ease-spring-soft` | Drop zone activation (wow moment 1) |
| **Number counter** | 600ms | `ease-out` | Total preț recalculation, stats |
| **Stagger reveal** | 80ms delay per child + 400ms each | `ease-spring-soft` | Oferte cards reveal post-loading (wow moment 2) |

### 9.5. Stack tehnologic animație

- **Web:** Framer Motion (Motion v12). Pentru complex stuff (drag-drop, page transitions, layout animations).
- **Web simple:** Tailwind animate utilities + CSS transitions pentru hover/focus.
- **Mobile:** React Native Animated + Reanimated 3 (paritate cu Framer Motion).

### 9.6. Reduced motion override

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Plus în Framer Motion, folosește `useReducedMotion()` hook pentru a opta out manual de animații complexe (confetti, drag-drop reveal).

---

## 10. Iconografie

### 10.1. Set primary

**Lucide Icons** (default shadcn/ui set, open source, comprehensive).
- Stroke-based (1.5px stroke).
- Geometric, neutral, recognizable cross-cultural.
- 24×24 default, 16×16 small, 32×32 large.

### 10.2. Set secondary (custom)

Pentru iconițe specifice (asigurări, vehicule), creează o **mini-set custom** de 12-15 iconițe care match cu stilul Lucide:

- `icon-policy` (poliță) — document cu shield mic
- `icon-vehicle` (vehicul) — silhouette mașină simplificată
- `icon-leasing` — două săgeți circular + cheie
- `icon-driver` — persoană la volan
- `icon-direct-settlement` — handshake stilizat
- `icon-bonus-malus` — graf cu trend up/down
- `icon-baar` — building cu plus
- `icon-renew` — calendar + săgeată refresh
- `icon-cancel` — X în cerc soft
- `icon-otp` — telefon + check
- `icon-encryption` — lock cu shield
- `icon-stripe` — card cu fulger
- `icon-apple-pay`, `icon-google-pay` (logo-uri oficiale, nu redesign)

**Specificații custom:**
- Stroke 1.5px (match Lucide).
- Border radius interior 1px (sharp corners cu fillet minim).
- Stil "outline" (nu solid), cu accent fill ocazional în orange pentru emphasis (e.g. `icon-shield-active` cu interior orange subtle).

### 10.3. Logo asigurători

9 logo-uri ca SVG-uri optimized:
- Allianz, Asirom, Axeria, eazy.insure, Generali, Grawe, Groupama, Hellas Direct, Omniasig.
- Toate normalizate la **height 32px**, width auto-fit.
- Fundal alb cu padding 4px în card (acomodare pentru logos colored).
- Pe dark mode, dacă logo-ul nu are versiune dark adequate → background container alb-soft (`#FAFAFC` cu 4px padding) pentru a păstra brand asigurător intact.

### 10.4. Reguli folosire iconițe

| Regulă | Detaliu |
|---|---|
| **Touch targets minim 44×44px** | Clickable area, chiar dacă vizual icon e 24×24. Wrapper button cu padding. |
| **Icon + text combinations** | Icon stânga, text dreapta, gap 8px. Niciodată icon-only fără tooltip aria-label. |
| **Pair cu emoji?** | Doar în empty states și welcome messages, sub 5% per pagină. Niciodată în UI funcțional. |
| **Semantic icons consistent** | ✅ check pentru succes, ⚠ pentru warning, ⓘ pentru info, ✖ pentru error. Same pattern peste tot. |

---

## 11. Illustration & imagery

### 11.1. Approach Marshmallow-style — fețele reale

**Decizia critică:** la fel ca Marshmallow, brand-ul folosește **fotografii reale de oameni** pentru a transmite trust + warmth.

#### Strategia foto

- **3-4 fotografii hero key** comandate la un fotograf RO (sau cu modele drepturi licențiate, NU stock generic).
- **Stil:** portrait close-up, lumină naturală, fundal blurred neutral, expresie warm (zâmbet subtil, contact vizual cu camera).
- **Diversitate:** un bărbat tânăr (30s), o femeie middle-aged (40-50), o persoană mai în vârstă (60s), o persoană de etnie diversă (RO ≠ doar caucazian).
- **Setting:** spații reale, nu studio steril. Café, casă luminoasă, parc, lângă mașină personală.
- **No props inutile:** fără telefoane afișate, fără laptop cu logo, fără mașini brand-specific (BMW = elitism, Dacia = stereotip).

#### Folosire

- **Hero homepage:** 1 portrait larg dreapta cu user, citat scurt sub ("Mi-a luat 3 minute să compar 9 oferte. Am salvat 400 RON.")
- **Pagina `/securitate`:** 1 portrait engineer (poate Filip însuși) cu mesaj "Eu construiesc partea de securitate. Iată cum protejăm datele tale."
- **Pagina `/cum-functioneaza`:** 3 portraits diferiți, fiecare cu un quote despre ușurința procesului.
- **Pagina `/persoane-juridice`:** 1 portrait manager firmă cu citat despre fleet.

#### NO-GO

- ❌ Stock photos generice (oameni de afaceri în costum cu laptop pe albe pure — kill switch).
- ❌ Iluminare artificială flat (uniformă, fără shadows naturale).
- ❌ Modele cu zâmbet excesiv "perfect" (Vroomhuis vibe — fals).
- ❌ Photoshop heavy (skin smooth excesiv — neuman).

### 11.2. Illustrations

**Folosit zgârcit.** Fotografiile fac munca de "trust"; ilustrațiile completează doar pentru concepte abstracte (security, encryption, etc.) unde foto nu funcționează.

**Stil ilustrații:**
- **Outline-based + fill subtil** — line art cu fill semi-transparent în orange/blue accent.
- **Geometric, nu organic** — drepte și curburi clean, fără stil "hand-drawn wobbly".
- **Inspirație:** Stripe.com illustrations, Linear.app blog illustrations, Vercel docs illustrations.
- **Paletă:** doar antracit + accent orange + accent blue. Niciodată multi-color rainbow.

**Where used:**
- `/securitate` — diagrama envelope encryption stilizată.
- `/cum-functioneaza` — 4 ilustrații pentru cei 4 pași.
- Empty states — ilustrație mică (96×96px) pentru fiecare empty.

### 11.3. Visual elements abstracte

**Gradients:**
- Folosite **doar** în 3 locuri:
  1. Hero homepage background — gradient subtil radial de la antracit la antracit-cu-tint-electric-blue (5% adjust).
  2. Wow moment 3 (checkout success) — burst orange→white radial.
  3. Pagina `/securitate` — subtle vertical gradient pentru section breakouts.

**Patterns:**
- **Subtle dot pattern** (3px dots, 32px spacing, 2% opacity neutral-300) ca background pentru section dividers homepage. Foarte subtle, ca Stripe.

**Noise texture:**
- 1-2% noise overlay pe gradients (anti-banding + tactility). Folosit pe hero + secțiuni mari.

---

## 12. Component library

Toate componentele folosesc shadcn/ui ca bază, customizate cu tokens definite mai sus.

### 12.1. Button

```
Variants: primary, secondary, ghost, destructive, outline
Sizes: sm (32px), md (40px), lg (48px), xl (56px)
States: default, hover, active, focus, disabled, loading
```

#### Primary (CTA principal)

```
Background:     var(--color-brand-primary)        /* antracit */
Text:           var(--color-text-on-brand)         /* white */
Border:         none
Padding:        12px 24px (sm), 16px 32px (md), 20px 40px (lg)
Border radius:  10px (md), 14px (lg)
Font:           Inter 500, 14px (sm), 16px (md), 18px (lg)
Letter spacing: 0
Shadow:         var(--shadow-xs)

Hover:          background: lighten antracit 8%, shadow: var(--shadow-sm), translateY(-1px)
Active:         translateY(0), shadow: var(--shadow-xs)
Focus:          outline: 4px solid rgba(37, 99, 235, 0.12) (electric blue subtle ring)
Disabled:       background: var(--color-disabled-bg), text: var(--color-disabled-text), cursor: not-allowed
Loading:        inline spinner stânga, text rămâne dar opacity 0.6, no click
```

**Animation:**
- Hover transition: 150ms ease-out pe transform + shadow.
- Active: 80ms ease-in.

#### Primary CTA Hero (variant special — orange)

Folosit DOAR pentru CTA-ul cel mai important pe homepage (1 per pagină).

```
Background:     var(--color-brand-accent)          /* orange */
Text:           white
Same dimensions as Primary lg/xl.

Hover:          var(--color-brand-accent-hover) (darker orange)
Focus:          outline: 4px rgba(255, 107, 26, 0.2) (orange ring)
Plus magnetic effect: cursor proximity 100px → button scale 1.02 + slight tilt toward cursor (max 2deg)
```

#### Secondary

```
Background:     transparent
Text:           var(--color-brand-primary)
Border:         1px solid var(--color-border-default)
Same dimensions.

Hover:          background: var(--color-hover-overlay)
```

#### Ghost

```
Background:     transparent
Text:           var(--color-text-secondary)
Border:         none

Hover:          background: var(--color-hover-overlay), text: primary
```

#### Destructive

```
Background:     var(--color-danger)
Text:           white
Hover:          darker red 10%
```

### 12.2. Input field

```
Height:         44px (md), 52px (lg)
Padding:        12px 16px
Background:     var(--color-surface)
Border:         1px solid var(--color-border-default)
Border radius:  10px
Font:           Inter 400, 16px (NU 14px — zoom prevention pe iOS)
Color:          var(--color-text-primary)
Placeholder:    var(--color-text-tertiary)

Focus:          border: 1.5px solid var(--color-electric), shadow: var(--shadow-focus), background: var(--color-surface)
Hover (no focus): border: var(--color-border-strong)
Disabled:       background: var(--color-disabled-bg), border: var(--color-border-subtle), cursor: not-allowed
Error state:    border: 1.5px solid var(--color-danger), shadow: 0 0 0 4px rgba(220, 38, 38, 0.1)
Success state:  border: 1.5px solid var(--color-success) (checkmark icon dreapta)
```

**Label:**
- Poziție: deasupra input-ului, 8px gap.
- Font: Inter 500, 14px.
- Color: `var(--color-text-primary)`.
- Required asterisk: orange `*` cu 4px gap.

**Helper text** (sub input):
- Font: Inter 400, 13px.
- Color: `var(--color-text-secondary)`.
- 6px gap de la input.

**Error message** (sub input):
- Font: Inter 500, 13px.
- Color: `var(--color-danger)`.
- Icon ⚠ stânga, 4px gap.
- Animate in: slide down + fade, 150ms.

**Auto-completed (din OCR):**
- Border: 1px solid `var(--color-success)`.
- Subtle background tint: `rgba(22, 163, 74, 0.04)`.
- Mic badge "Auto-detectat" verde dreapta sus, 11px, eliminat când user editează manual.

### 12.3. Select / Dropdown

Bazat pe Radix Select.

```
Trigger:        identical cu Input field, dar cu chevron-down icon dreapta.
Content:        var(--color-surface-raised), shadow: var(--shadow-lg), radius: 10px
                max-height: 320px, overflow-y: auto
Item:           padding 12px 16px, hover: var(--color-hover-overlay)
                selected: background: var(--color-electric-soft), text: var(--color-electric)
Animation:      open: scale + fade (Radix default tweaked)
                duration: 200ms ease-spring-soft
```

### 12.4. Card

```
Background:     var(--color-surface)
Border:         1px solid var(--color-border-subtle)
Border radius:  14px (lg)
Padding:        24px (mobile), 32px (desktop)
Shadow:         var(--shadow-sm) at rest

Hover (interactive cards):
  Shadow:       var(--shadow-md)
  Transform:    translateY(-4px)
  Duration:     200ms ease-out
  Border:       var(--color-border-default)
```

#### Card variants

**Card listing oferte (pas 4):**
- Padding: 24px (mobile), 28px (desktop)
- Logo asigurător 40px height stânga sus
- Preț 12L afișat mare (display-md): 36px Geist 600
- Preț 6L afișat sub în Inter 500, 18px
- Buton "Alege" full width pe mobile, fixed width 160px pe desktop
- Hover: lift + shadow, plus subtle border tint în accent (`rgba(255, 107, 26, 0.2)`)

**Card hero homepage (drop zone):**
- Padding: 48px (mobile), 64px (desktop)
- Border radius: 28px (`--radius-2xl`)
- Background gradient subtil radial
- Border 1.5px dashed pe dragover (accent orange)

**Card cont dashboard:**
- Padding: 24px
- Header cu icon stânga + titlu
- Body cu informație principală
- Footer cu link-uri/butoane secundare

### 12.5. Modal / Dialog

Bazat pe Radix Dialog.

```
Backdrop:       rgba(10, 10, 15, 0.6) cu backdrop-blur(8px)
Animation:      fade-in 250ms ease-out

Container:      max-width 520px (sm), 720px (md), 960px (lg)
                background: var(--color-surface), radius: 14px
                shadow: var(--shadow-2xl)
                padding: 32px (desktop), 24px (mobile)
                
Animation:      scale 0.95 + translateY(8px) + fade → scale 1 + translateY(0) + fade
                duration: 300ms ease-spring-soft
                
Close button:   top-right, 32×32px, X icon Lucide, ghost button
Title:          Geist 600, 24px (display-sm), margin-bottom 8px
Description:    Inter 400, 16px, color secondary, margin-bottom 24px
Footer:         flex justify-end, gap 12px, margin-top 32px
                primary button right, secondary button left
```

#### Mobile fullscreen modal

Pentru wizard-uri lungi (anulare poliță, adăugare șofer):
- Mobile: fullscreen, no padding extern.
- Desktop: standard modal max-width.

### 12.6. Toast / Notification

Bazat pe Sonner (shadcn integration).

```
Position:       bottom-right desktop, bottom-center mobile
Container:      max-width 420px
Background:     var(--color-surface-raised)
Border:         1px solid var(--color-border-subtle)
Radius:         10px
Padding:        16px 20px
Shadow:         var(--shadow-md)

Animation in:   slide-up + fade, 300ms ease-spring-soft
Animation out:  slide-down + fade, 200ms ease-in
Duration:       3000ms (info), 5000ms (success), 6000ms (warning), persistent (error cu retry)

Variants:
  info:         icon ⓘ blue, accent line stânga 3px blue
  success:      icon ✓ green, accent line stânga 3px green
  warning:      icon ⚠ orange, accent line stânga 3px orange
  error:        icon ✖ red, accent line stânga 3px red
  
Title:          Inter 600, 14px
Description:    Inter 400, 13px, color secondary
Action button:  ghost button text-sm, primary color
Close X:        16px icon top-right, opacity 0.6, hover 1
```

### 12.7. Badge / Chip

```
Sizes:          sm (24px), md (28px), lg (32px) heights
Padding:        4px 10px (sm), 6px 12px (md), 8px 14px (lg)
Radius:         full (9999px)
Font:           Inter 500, 12px (sm), 13px (md), 14px (lg)

Variants:
  default:      background: var(--color-neutral-100), text: var(--color-text-primary)
  success:      background: var(--color-success-soft), text: var(--color-success)
  warning:      background: var(--color-warning-soft), text: var(--color-warning)
  danger:       background: var(--color-danger-soft), text: var(--color-danger)
  brand:        background: var(--color-brand-accent-soft), text: var(--color-brand-accent)
  electric:     background: var(--color-electric-soft), text: var(--color-electric)
  outline:      background: transparent, border: 1px solid var(--color-border-default), text: secondary
```

#### Filter chip (interactive, ca chips în pas 3)

```
Default:        outline variant
Selected:       background: var(--color-brand-primary), text: white, border: transparent
Hover:          background: var(--color-hover-overlay)

Animation:      background-color transition 150ms ease-out
```

### 12.8. Progress / Stepper

#### Linear stepper (pașii 1-4)

```
Container:      100% width, height 32px
Bar:            2px height, background: var(--color-neutral-200)
Filled:         2px height, background: var(--color-brand-primary)
                width: animată proporțional (25%, 50%, 75%, 100%)
                transition: 400ms ease-spring-soft

Step circles:   24px diameter, evenly spaced
  Inactive:     border 2px solid neutral-300, background white, number text neutral-500
  Active:       border 2px solid brand-primary, background white, number primary, scale 1.1, glow shadow subtle
  Completed:    background: brand-primary, border: brand-primary, ✓ icon white
  
Labels under:   Inter 500, 13px, color secondary (inactive), primary (active/completed)
                margin-top 8px

Animation step transition:
  - Filled bar grows 400ms
  - Old step circle scale 1.1 → 1, color transition 200ms
  - New step circle scale 1 → 1.1, glow appears 250ms
```

#### Circular progress (loading states)

```
Spinner SVG 24px (default), 32px (large)
Stroke 2px, color: var(--color-electric)
Animation: 1s linear infinite rotate, dasharray 75% revealed pulsing
```

### 12.9. Skeleton screens

```
Background:     var(--color-neutral-100)
Border radius:  match component (e.g. card skeleton = 14px)
Animation:      shimmer
                background: linear-gradient(90deg, neutral-100 0%, neutral-200 50%, neutral-100 100%)
                background-size: 200% 100%
                animation: shimmer 1500ms ease-in-out infinite
                @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
```

#### Skeleton variants

**Skeleton card oferte (pas 4 loading):**
- 9 cards stacked (mobile) sau grid 3-col (desktop).
- Each card: 200px height, padding similar real card.
- Shapes inside: logo placeholder 40px circle, preț placeholder 32px width 120px, text lines.

**Skeleton text:**
- Lines de text 14px height, randomized widths (60%-100%).
- 12px gap between lines.

### 12.10. Tabs

Bazat pe Radix Tabs.

```
TabsList:       border-bottom 1px var(--color-border-subtle), padding 0
TabsTrigger:    padding 12px 16px, font Inter 500 14px
                color: var(--color-text-secondary)
                position: relative
                
                ::after pseudo: 0 height, 2px on active, color brand-primary
                width transition 250ms ease-spring-soft
                
Active:         color: var(--color-text-primary)
                ::after height 2px, full width

TabsContent:    padding-top: 24px
                animation on switch: fade + slide-up 200ms
```

### 12.11. Accordion

Bazat pe Radix Accordion.

```
Item:           border-bottom 1px var(--color-border-subtle)
Trigger:        padding 20px 0, font Inter 500 16px, full width text-left
                chevron 16px icon dreapta
                
Open:           chevron rotate 180deg (200ms ease-out)
Content:        padding 0 0 20px 0
                animation: height auto + fade
                Radix variable for height transition
```

### 12.12. Drag and drop zone (landing-specific)

Vezi secțiune 16 (Wow Moment 1) pentru specificație animată.

Default state:
```
Container:      full width hero, padding 80px desktop, 48px mobile
Border:         2px dashed var(--color-border-default)
Border radius:  28px
Background:     var(--color-surface)
Cursor:         pointer

Inside:         Icon upload 48px center, text "Trage talonul și CI aici"
                + secondary text "sau apasă pentru a alege"
```

Active drop state: detaliat la secțiune 16.

---

## 13. Layout patterns globali

### 13.1. Header (topbar)

```
Height:         72px desktop, 64px mobile
Background:     var(--color-bg) cu backdrop-blur(12px) la scroll > 8px
Border-bottom:  1px solid var(--color-border-subtle) (apare doar la scroll)
Padding:        24px (desktop), 16px (mobile) horizontal

Left:           Logo blaj.io (clickable, → /)
Center desktop: Nav primary [ Cum funcționează · Securitate · Suport ] — Inter 500 14px
                gap 32px între item-uri
Right:          Sign in (ghost button) + Calculează RCA (primary button)
                pe sub auth: avatar + dropdown user menu

Mobile:         Logo stânga + Hamburger dreapta → drawer
```

#### Scroll behavior

- La scroll Y > 8px: subtle border-bottom apare cu fade 150ms.
- La scroll Y > 80px: header rămâne sticky cu backdrop-blur.
- Nu hide header la scroll down (Persona 3 are nevoie de access constant).

### 13.2. Footer

```
Background:     var(--color-neutral-900) (in light mode = dark footer pentru contrast premium)
Padding:        80px 32px (desktop), 48px 16px (mobile)
Color text:     light variants

Layout:
  Desktop:      4 coloane:
                  Col 1: Logo (variantă mono-light) + tagline scurt + small icon Twitter/LinkedIn
                  Col 2: Produs — Calculator RCA, Cum funcționează, Pentru firme
                  Col 3: Companie — Despre, Securitate, Cariere (v2), Contact
                  Col 4: Legal — Termeni, Confidențialitate, Cookies, Accesibilitate, DPO
  Mobile:       Stack vertical, col-uri colapsate cu accordion
  
Bottom row:     "© 2026 Aplicatie.ta SRL — CUI: XXX | J40/XXX/2026 — Broker autorizat ASF: RBK-XXX"
                Inter 400 13px color neutral-500
                margin-top 48px, border-top 1px neutral-800, padding-top 32px
```

### 13.3. Cont (auth zone) layout

```
Sidebar:        260px fixed left, full height
                background: var(--color-surface)
                border-right: 1px solid var(--color-border-subtle)
                padding: 24px 16px
                Logo top + nav items + bottom user card

Main:           padding 32px 48px desktop, 16px mobile
                max-width 1080px, centered if narrow content

Mobile:         Sidebar transformă în bottom tab bar (5 tabs cu icon + label)
                Topbar simplificat doar logo + user avatar
```

### 13.4. Marketing pages layout

```
Container:      max-width 1080px (default) sau 640px (text-heavy)
Padding:        clamp(64px, 10vh, 128px) vertical sections
Sections:       alternate background subtle (white / off-white) pentru hierarchy
```

### 13.5. Form steps (wizard) layout

```
Container:      max-width 720px centered
Padding:        24px (mobile), 48px (desktop) vertical

Sticky header:  Stepper component + back button stânga + brand center + sign-in dreapta
                background: bg cu backdrop-blur
                bottom border subtle
                height: 80px

Content:        padding-top 32px, padding-bottom 120px (loc pentru sticky footer)

Sticky footer:  fixed bottom, full width
                background: bg cu top border subtle
                padding 16px 24px
                contains: [← Înapoi] [Pasul următor →] flex justify-between
                shadow up: 0 -4px 12px rgba(0, 0, 0, 0.04)
```

---

## 14. Pagină cu pagină — wireframes hi-fi

### 14.1. Landing `/` (homepage)

Cea mai importantă pagină. Unde se decide conversion.

#### Section 1: Hero (above the fold)

```
Container:      max-width 1280px, padding 96px 32px (desktop), 64px 16px (mobile)
Background:     var(--color-bg) cu subtle radial gradient stânga-sus 
                  → from rgba(255, 107, 26, 0.03) to transparent (subtle accent glow)

Layout desktop: 2 columns, 60/40 split (text left, image right)
Layout mobile:  Stack vertical, image sub text

LEFT COLUMN (text):
  Eyebrow:       Inter 500 13px, color brand-accent (orange), uppercase, letter-spacing 0.05em
                 "RCA · CASCO (curând) · Locuință (curând)"
                 
  H1:            Geist 600, display-2xl (80px desktop, 56px mobile)
                 line-height 1.05, tracking -0.04em
                 "Asigurări fără labirint."
                 max-width 540px
                 
  Subhead:       Inter 400, 20px (desktop), 18px (mobile)
                 line-height 1.5, color text-secondary
                 max-width 480px, margin-top 24px
                 "Compară 9 asigurători RCA în 3 minute. Plătești cu Apple Pay sau card. 
                  Polița ajunge instant pe email."

  Drop zone CTA: vezi specificație detaliată secțiune 16 (Wow Moment 1)
                 margin-top 40px
                 width: 100%, max-width 540px

  Trust badges:  flex horizontal, gap 24px, margin-top 32px
                 ASF · GDPR · Stripe · ISO 27001 (planificat)
                 fiecare cu icon mic 16px + text Inter 500 13px
                 color text-tertiary

RIGHT COLUMN (Marshmallow-style portrait):
  Image:         portrait foto reală 1:1 ratio, max-width 480px
                 border-radius 28px (--radius-2xl)
                 aspect-ratio 5:6 (slightly portrait)
                 
  Floating quote card:  
                 absolute positioned bottom-right de imagine (overlap subtle)
                 background: var(--color-surface) cu shadow-xl
                 padding 20px 24px, radius 14px
                 max-width 320px
                 contains:
                   ⭐⭐⭐⭐⭐ (5 stele small)
                   Quote: Inter 500 16px italic
                   "Mi-a luat 3 minute să compar 9 oferte. Am salvat 400 RON."
                   Author: Inter 400 13px, color secondary
                   "Andrei P., Brașov · 28 ani"
                   
  Animation:    Quote card animation:
                  initial: opacity 0, translateY(20px)
                  reveal: 600ms delay + 500ms ease-spring-soft
                Image animation:
                  reveal: 200ms delay + 600ms fade-in
```

#### Section 2: Cum funcționează (4 pași)

```
Background:     var(--color-neutral-50) (off-white) — subtle alternation cu hero
Padding:        128px 32px desktop, 80px 16px mobile

Header center:
  Eyebrow:      "PROCESUL"
  H2:           "Trei pași simpli." (display-lg)
  Subhead:      "Mai mult timp decât trebuie să cauți cheile mașinii." (Inter 400 18px)

Steps:          flex grid 3 columns desktop (gap 32px), stack mobile (gap 48px)
                  fiecare step:
                    Number:   "01" Geist 600 64px display-xl color brand-accent (orange)
                    Title:    "Introduci VIN sau încarci talonul" (Inter 600 20px)
                    Body:     "OCR auto-completează datele vehiculului din talon. Sau cauți rapid după număr." (Inter 400 16px color secondary)
                    Icon:     custom illustration 80×80px (line art outline + accent fill)

Animation:      stagger reveal pe scroll (intersection observer)
                each step: opacity 0 + translateY(40px) → opacity 1 + translateY(0)
                stagger 100ms between steps
                duration 500ms ease-spring-soft per step
```

#### Section 3: Asigurători parteneri (logo wall)

```
Background:     var(--color-bg)
Padding:        96px 32px

Header:         Eyebrow: "PARTENERI"
                H2: "9 asigurători. O singură căutare." (display-md)
                Subhead: "Compari toate ofertele într-un loc. Tu alegi."

Logo grid:      max-width 1080px, gap 32px
                desktop: 3 rows × 3 cols
                mobile: 2 rows × 4-5 cols ratio adjusted
                
                each logo container:
                  background: var(--color-surface)
                  border: 1px solid var(--color-border-subtle)
                  radius: 14px
                  padding: 32px
                  height: 96px
                  flex center
                  
                  hover: shadow-md + lift -4px

Logos:          Allianz, Asirom, Axeria, eazy.insure, Generali, Grawe, Groupama, Hellas Direct, Omniasig
                grayscale 100% by default (subtle), saturate 100% on hover (color)
                transition 200ms ease-out
                
Stats below:    Row of 3 cards inline:
                  "9" asigurători comparați
                  "<3 minute" timpul mediu de emitere
                  "100%" date criptate end-to-end
                fiecare cu number Geist 600 56px + label Inter 500 14px secondary
```

#### Section 4: De ce blaj.io (4 piloni)

```
Background:     var(--color-neutral-900) (DARK section pentru contrast premium)
                folosind dark mode variants pentru toate componentele înăuntru
Padding:        128px 32px

H2:             "De ce blaj.io." (display-lg, white text)
                centered, max-width 640px

Pillars:        grid 2×2 desktop, stack mobile
                gap 32px
                
                each pillar (card):
                  background: rgba(255, 255, 255, 0.04) (subtle elevation pe dark)
                  border: 1px solid rgba(255, 255, 255, 0.08)
                  radius: 14px
                  padding: 40px
                  
                  Icon:     48px size, color brand-accent (orange)
                  H3:       Geist 600, 24px white
                  Body:     Inter 400, 16px, color rgba(255, 255, 255, 0.7)

Pilier 1:       🛡 Date criptate de nivel bancar
                "Folosim envelope encryption cu chei stocate în Google Cloud KMS. 
                 Chiar dacă cineva ar accesa baza noastră, datele tale rămân ilizibile."
                + link "Cum protejăm datele →" (color orange)

Pilier 2:       ⚡ 1-tap cu Apple Pay
                "Plătești cu Apple Pay, Google Pay sau card. Procesat de Stripe (PCI Level 1).
                 Datele cardului nu trec prin serverele noastre."

Pilier 3:       🔄 Reminder automat
                "Te anunțăm cu 60, 30 și 7 zile înainte de expirare. 
                 1-click reînnoire cu prețuri actualizate."

Pilier 4:       🏛 Reglementați ASF
                "Suntem broker autorizat ASF (RBK-XXX). 
                 Operăm conform GDPR, Norma 22/2021 și Legea 132/2017 RCA."
```

#### Section 5: Testimoniale (3 portrete + quote-uri)

```
Background:     var(--color-bg)
Padding:        128px 32px

H2:             "Cei care folosesc blaj.io."

Carousel desktop: 3 cards visible, scroll horizontal pe wider screens
Mobile:         carousel cu swipe, 1 visible

Each testimonial:
  Card:         background surface, padding 32px, radius 14px, shadow-sm
                width 360px, height 480px
  Content:
    Image top:  portrait 96×96 circle, border 4px white shadow-md
                margin-top -48px (overlap card top)
    Quote:      Inter 500 18px italic, ~3-4 lines
    Author:     Inter 600 14px nume + Inter 400 13px secondary (vârstă, oraș, ocupație)
    Stars:      5 stars top-right corner
```

3 testimoniale (real foto + quote autentic — comandate, NU AI-generated):
1. **Maria, 41, manager firmă, Cluj** — "Am 3 mașini la firmă. Pe blaj.io le țin pe toate într-un Garaj. Reînnoiesc tot dintr-un loc."
2. **Andrei, 28, dezvoltator IT, București** — "Mi-a luat 3 minute. Apple Pay și gata. Polița pe email înainte să apăs F5."
3. **Domnul Ion, 64, pensionar, Râșnov** — "M-a ajutat fiul să încerc prima oară. Mai simplu decât m-am așteptat. Acum o fac singur."

#### Section 6: FAQ

```
Background:     var(--color-neutral-50)
Padding:        128px 32px

H2:             "Întrebări frecvente."
Container:      max-width 720px, centered

Accordion:      10 most common questions
                items separate cu border-bottom
                
                Trigger Q:    Inter 500 18px, padding 24px 0
                Content A:    Inter 400 16px color secondary, padding 0 0 24px 0
                
                Click expand: smooth height transition + icon chevron rotate

Bottom CTA:     "Nu ai găsit răspunsul?"
                + buton Secondary "Vezi toate întrebările →" link to /intrebari-frecvente
```

#### Section 7: Final CTA

```
Background:     gradient subtle radial (orange tint top-left → transparent)
Padding:        160px 32px

Center:
  H2:           "Hai să-ți facem polița."
                Geist 600 display-xl
                max-width 720px
  
  Subhead:      "3 minute. 9 oferte. Plată securizată. Polița pe email."
                Inter 400 20px secondary
  
  Drop zone CTA mini: same as hero dar cu height 64px max-width 480px
                margin-top 40px
                
  Trust line below: "🔒 Datele criptate · Plată Stripe · Reglementat ASF"
                Inter 500 13px text-tertiary
```

#### Footer (vezi 13.2)

---

### 14.2. `/quote/step-1` (Vehicul)

```
Layout:         Form wizard (vezi 13.5)
Container:      max-width 720px

Sticky header:  Stepper showing step 1/4 active, brand logo center, sign-in right

Page title:     "Date despre vehicul" (Geist 600, display-md)
Subtitle:       "Completăm automat datele din talonul tău, sau le introduci tu." 
                (Inter 400 16px secondary)
                margin-bottom 32px

Section 1: Stare vehicul
  Label:        "Stare vehicul *" (Inter 500 14px)
  Chips:        3 chips horizontal flex (mobile: stack 2-col)
                  [● Înmatriculat]  [○ În vederea înmatriculării (?)]  [○ Înregistrat la Primărie (?)]
                each chip 48px height, padding 12px 20px, radius full
                tooltip "?" hover info popover
                
  Animation:    chip select: background transitions + scale pulse subtle 1 → 1.03 → 1 (200ms)

Section 2: Date vehicul
  Cards de field grouped, gap 20px între field-uri
  
  Row 1:        [Număr înmatriculare *]  [Serie șasiu (VIN) *]   (2-col desktop)
  Row 2:        [Marcă *]                [Model *]                
  Row 3:        [Categorie (J) *]        [Subcategorie *]         
  Row 4:        [Mod utilizare *]        [Combustibil *]          
  Row 5:        [An fabricație *]        [Prima înmatriculare (B) *]
  Row 6:        [Masă maximă (F1) *]     [Capacitate (P1) *]      
  Row 7:        [Putere (P2) - kW *]     [Număr locuri (S1) *]    
  Row 8:        [Seria CIV] + checkbox "Nu am sau nu știu"        
  Row 9:        [Data expirare ITP] (helper: opțional pentru Generali)
  Row 10:       [Kilometraj] (helper: opțional pentru Grawe, nu influențează prețul)
  
  Pre-completed (after OCR):
                fields cu border green subtle + badge "Auto-detectat din talon" right
                user editable, badge dispare dacă editează manual

Section 3: Carte verde
  Checkbox:     "Voi călători cu mașina în state non-UE (carte verde, nu influențează prețul)"

Section 4: Acorduri (Norma 22/2021)
  Group container cu border subtle + padding 24px + radius 14px
  Helper text top: "Conform Normei 22/2021 ASF, trebuie să confirmi:"
  
  3 checkboxes stacked, gap 16px:
    ☐ Am luat la cunoștință despre Informarea Precontractuală *
       link inline "Citește documentul →" (orange)
    ☐ Am citit și sunt de acord cu prelucrarea datelor pentru ofertare *
    ☐ Renunț la consultanță conform Normei 22/2021 *
       helper text below: "Necesar pentru continuare. [Ce înseamnă? →]"

Sticky footer:  [← Înapoi]                              [Pasul următor →]
```

#### Sub-cazuri "În vederea înmatriculării"

Click chip "În vederea înmatriculării" → animație:
1. Câmp "Număr înmatriculare" lock with subtle slate overlay + badge "Va fi emisă pe VIN".
2. Apare nouă secțiune între "Stare vehicul" și "Date vehicul":
   ```
   Animated reveal (height auto + fade, 300ms ease-spring-soft):
   
   Section: De unde vine vehiculul? *
     3 chips:
       [○ Mașină second-hand din România]
       [○ Mașină din străinătate (UE / non-UE)]
       [○ Mașină nouă de la dealer din România]
   
   Per chip select, expand:
   Documente justificative *
     [Drag-drop file uploader]
     Helper: "Format: JPG, PNG, PDF, DOC. Max 5 fișiere, 5MB fiecare."
   
   Banner galben:
     ⚠ Polița se emite fără număr de înmatriculare, doar pe baza VIN.
       După înmatriculare, ne trimiți numărul la support@blaj.io.
   ```

---

### 14.3. `/quote/step-2` (Proprietar + Șofer)

```
Page title:     "Cine ești tu?" (warm, friendly)
Subtitle:       "Datele introduse sunt criptate end-to-end. Nu le vede nici echipa noastră."

Section 1: Tip persoană
  Pill toggle:  large segmented control, 2 options
                [● Persoană fizică]  [○ Persoană juridică]
                height 56px, full width, radius full
                background neutral-100, selected: background brand-primary text white
                
  Animation:    selected indicator slides 250ms ease-spring-soft

Section 2: Leasing
  Toggle row:   left: "Vehiculul este în leasing"
                right: shadcn Switch component
                
  Conditional:  when ON, slide-down reveal (300ms):
                Searchable select "Companie de leasing *"
                Cu top 25-30 companii pre-populate.
                Footer dropdown: [+ Adaugă altă companie]

Section 3: Date proprietar (PF default)
  Card:         padding 32px, background surface, border subtle
                title: "Date proprietar" (Inter 600 18px)
                
  Layout:       grid responsive 2-col desktop
  
  Row 1:        [Nume *]          [Prenume *]
  Row 2:        [CNP *]           — full width
                  helper: "Validat instant cu algoritm RO. Criptat înainte de stocare."
  Row 3:        [Email *]         [Telefon *]
  Row 4:        [Tip act *]       [Serie CI *]   [Număr CI *]
  Row 5:        [Data expirare CI *] [An permis *] + ☐ Fără permis
  
  Address subgrouping cu titlu mic "Adresă (din talon):"
  Row 6:        [Județ *]         [Localitate *]
  Row 7:        [Tip stradă *]    [Stradă *]
  Row 8:        [Număr *]         [Bloc] [Scara] [Etaj] [Apartament]
  Row 9:        [Cod poștal *] + link "🔍 Caută cod poștal"

Section 4: Șoferi
  Card:         similar styling
                title: "Cine conduce?"
                
  Toggle row:   "Eu sunt șoferul principal" (default ON)
                shadcn Switch
                
  Conditional:  when OFF, expand bloc "Șofer principal" similar cu proprietar
  
  Subsection:   "Mai conduce și altcineva?"
                Lista șoferi adăugați (empty initially)
                + Buton secondary "Adaugă alt șofer" cu icon plus
                
                Card per șofer adăugat:
                  Avatar generic 40px + nume + CNP mascat
                  Buton ghost "Editează" + Buton ghost "Șterge"
  
  Warning text below cu icon ⚠:
                "Adăugarea șoferilor suplimentari poate modifica prețul.
                 Datele sunt verificate cu BAAR pentru bonus-malus (Legea 132/2017)."

Section 5: Acorduri pas 2
  Same pattern ca pas 1, 2 checkboxes:
    ☐ Sunt de acord cu prelucrarea datelor cu caracter personal *
    ☐ Confirm că datele introduse sunt corecte *

Sticky footer:  [← Înapoi]   [Pasul următor →]
                Click pasul următor → trigger Email OTP modal
```

#### Email OTP modal

```
Modal:          max-width 480px, centered
Header:         X close top-right, no title bar
Content:        padding 40px

  Icon top:     custom 64px icon (envelope cu shield), centered
  
  H2:           "Verifică email-ul" (display-sm, centered)
  
  Subtitle:     "Pentru a vedea ofertele, te rugăm să confirmi că ai acces la 
                adresa de email introdusă (cerință legală Norma 22/2021 ASF)."
                Inter 400 16px color secondary, max-width 360px, margin auto
  
  Email row:    "Am trimis un cod la:" + email truncat (e.g. f***@example.ro)
                Inter 500 15px text primary
  
  OTP input:    6 cifre, separate boxes 56×64px each, gap 12px
                Geist Mono 600 28px center
                auto-focus first box, auto-advance la următoarea
                paste 6 cifre = fill all
                error state: shake animation + border red
  
  Resend:       "N-ai primit codul?" + link Inter 500 14px "Trimite din nou"
                disabled 30s post-send, countdown live
  
  Bottom:       Inter 400 13px text-tertiary
                "🔒 Codul e valabil 10 minute. Verifică și folder Spam."

Animation:      modal open: fade backdrop + scale 0.95 → 1, 250ms ease-spring-soft
                OTP correct: green pulse + ✓ animate, 600ms, then close + advance
                OTP incorrect: shake horizontal 400ms (-8px / 8px / -8px / 8px / 0)
```

---

### 14.4. `/quote/step-3` (Configurare poliță)

```
Page title:     "Configurează polița ta."
Subtitle:       "Câteva opțiuni rapide și mergem la oferte."

Section 1: Data început
  Card:         padding 32px
  Label:        "Data început poliță *"
  Calendar:     shadcn Calendar component, full visible
                disabled days: trecute + >60 zile viitoare
                primary brand color pe selected
                
  Helper:       "Maxim 60 zile în avans. Dacă ai poliță activă, alege ziua 
                următoare expirării. [🔍 Verifică valabilitatea poliței actuale]"
                Inter 400 13px secondary

Section 2: Durată
  Card:         padding 32px
  Label:        "Durata poliței *"
  Subtitle:     "Compari mereu 2 perioade pentru a vedea cea mai bună valoare."
  
  2 chips horizontal (or stack mobile):
    Chip 1:     Fixed "12 luni ✓"
                background: brand-primary text white
                Helper sub: "Polița 12 luni: expiră 28 aprilie 2027 (Miercuri)"
                
    Chip 2:     Editable [▼ 6 ▼] luni ✓
                Dropdown opens with options 1-11
                same styling primary
                Helper sub: "Polița 6 luni: expiră 28 octombrie 2026 (Miercuri)"
                
  Info banner:  ℹ "Disponibilitatea poate varia: unii asigurători emit doar 1, 6 sau 12 luni."

Section 3: Sumar
  Card:         padding 24px, background neutral-100
                "Verifică datele înainte de oferte"
  
  3 rows:       Vehicul: Mercedes Sprinter (BV18BFG)        [Editează]
                Proprietar: Blajiu Filip (CNP ****8017)      [Editează]
                Șoferi: Blajiu Filip                          [Editează]
  
  fiecare row Inter 400 15px + Editează ghost button mic dreapta

Sticky footer:  [← Înapoi]   [Vezi ofertele →] (variant primary, larger)
```

---

### 14.5. `/quote/step-4` (Oferte)

#### Initial loading state (Wow Moment 2 — vezi secțiune 16)

```
Header:         "Caut ofertele tale..."
                Spinner 32px brand-primary
                Progress text: "9 asigurători verificați (3 / 9)"
                live counter incremental ca apar răspunsuri

Skeleton cards: 9 card skeletons grid 3-col desktop, stack mobile
                shimmer animation
                fiecare card has placeholder logo, prețuri, button
```

#### Loaded state

```
Header:         (sticky top)
  Title:        "Ofertele tale" (Geist 600 display-md)
  Subtitle:     "9 oferte găsite pentru BV-18-BFG, începere 28.04.2026"
  
  Filter row:   [Sortare ▼ Cel mai mic preț 12L]   ┃   [☐ Decontare directă (?)]
                Sticky on scroll cu backdrop blur

Best value badge: 
  Card top:     subtle banner "✨ Cea mai bună valoare: eazy.insure 12L (≈ 115 RON/lună)"
                background var(--color-brand-accent-soft), padding 12px 20px
                radius 10px

Cards grid:     desktop: 3 col gap 24px
                mobile: stack gap 16px

Each offer card (revealed cu stagger 80ms):
  Container:    background surface, border subtle, radius 14px, padding 28px
                shadow-sm at rest
                hover: shadow-md + lift -4px + border accent subtle (200ms)
  
  Header row:   Logo asigurător 48px height left + bonus-malus badge B6 right
  
  Prices section:
    Row dual:   "12 LUNI"           "6 LUNI"          (Inter 500 12px text-tertiary uppercase)
                1.383,79 RON         720,00 RON       (Geist 600 32px display-sm)
                ≈ 115 RON/lună       ≈ 120 RON/lună   (Inter 400 13px secondary)
                                                       
                gap 16px între cele 2 coloane
                pe mobile: stack vertical
  
  Action row:   2 buttons full-width sub prețuri
                [Alege 12L] (primary) + [Alege 6L] (secondary)
                gap 8px
                
                Dacă 6L unavailable:
                  buton 6L disabled grayed cu helper text "Nu emite pentru 6 luni"
  
  Expand details (click ▼ Detalii):
    Animation:  height auto + fade 250ms
    Content:    Inter 400 14px:
                  Prima asigurător: 1.314,60 RON
                  Comision broker: 69,19 RON
                  ─────────────────
                  Total: 1.383,79 RON
                  
                  Țări excluse carte verde: AZ, BY, IR, RUS, UA
                  Cod ofertă: 21408046
                  [📥 Descarcă IPID PDF] (link orange)

Indisponibile section:
  Below grid:   collapsed accordion
                Header: "Indisponibile (2) ▼"  Inter 500 14px secondary
                Click expand:
                  List of cards minimal:
                    Allianz Țiriac — "Nu emite RCA pentru această categorie" 
                                     [Vezi detalii →]
                    Axeria — "Vehicul depășește limita de risc" 
                             [Vezi detalii →]

Bottom toolbar:
  [← Schimbă durata]   [Actualizează ofertele]   [Cerere nouă]
```

#### Decontare directă toggle

Click toggle ON:
- Animation: numbers in all price columns counter-animate (Geist tabular numerals).
- Each card price increments la noul total cu deltele decontării (e.g. +143,xx RON).
- Color change subtle: background card cu hint accent orange `var(--color-brand-accent-soft)` la 4% opacity.
- Helper banner appears top: "Decontare directă activă pentru toate ofertele."

#### 0 oferte (BAAR risc ridicat)

Replace grid cu ecran dedicat:

```
Container:      max-width 640px centered
Padding:        80px 32px

Icon top:       large warning icon (custom 96×96, accent orange)
                centered

H2:             "N-am putut găsi oferte pentru tine."
                Geist 600 display-md, centered

Body:           Inter 400 18px secondary, max-width 480px center
                "Te încadrezi la categoria 'asiguraților cu risc ridicat'.
                 Conform metodei BAAR, poți solicita alocarea unui asigurător 
                 direct la BAAR."

Card sub:       background neutral-100, padding 24px, radius 14px
                "Tarif de referință BAAR: 1.152,20 RON"
                helper: "(poate diferi în funcție de vehicul)"

Steps list:     Inter 400 16px
                1. Accesează portalul BAAR
                2. Trimite cererea cu datele tale
                3. BAAR îți alocă un asigurător

CTA primary:    "Mergi la BAAR →" (large, link extern target=_blank rel=noopener)
                Plus secondary: "Sau scrie-ne la support@blaj.io"
```

---

### 14.6. `/checkout/[offerId]`

```
Stepper:        toate 4 pași marked complete + nou indicator "Plată"

Layout:         2-col desktop 60/40, stack mobile (rezumat top, plată sub)

LEFT (sumar 60%):
  Card:         padding 40px
  Title:        "Rezumatul comenzii" (Geist 600 display-sm)
  
  Logo asigurător: large 80px height, top-right
  
  Details grid: Inter 400 16px, label color secondary, value color primary
                Asigurat:           Blajiu Filip
                Vehicul:            BV-18-BFG (Mercedes Sprinter 209 CDI)
                Asigurător:         eazy.insure
                Perioadă:           12 luni (28.04.2026 - 28.04.2027)
                Decontare directă:  NU
                Clasa:              B6
                Țări excluse:       AZ, BY, IR, RUS, UA
  
  Divider:      1px subtle
  
  Total row:    flex justify-between, font-size 24px Geist 600
                "TOTAL DE PLATĂ"     "1.383,79 RON"
                helper: "≈ 115,32 RON/lună"
  
  Acord critical:
                ☐ Confirm că am primit și am citit documentele produsului 
                  (IPID + Termeni asigurător) și sunt de acord cu emiterea 
                  poliței de asigurare RCA. *
                  + 2 link-uri inline "[IPID PDF]" "[Termeni asigurător]"
                disabled until checked: blocked plata buttons

RIGHT (plată 40%):
  Card:         padding 40px, background surface, border subtle
  
  Title:        "Plată"
  
  Express checkout:
                Stripe Express Checkout Element renders here
                row of buttons sufficient: Apple Pay / Google Pay / Stripe Link
                each button height 48px, brand colors stripe
                
  Divider:      "── sau plătește cu cardul ──"
                Inter 500 13px text-tertiary, decorat cu lines stânga/dreapta
                margin: 24px 0
  
  Payment Element: Stripe inline form
                styled cu appearance API to match design tokens
                fields stack vertical
                primary input border match cu tokens
  
  Pay button:   Primary CTA Hero variant (orange)
                Full width, height 56px
                Text: "Plătește 1.383,79 RON →"
                disabled state when checkbox not ticked
                loading state when payment in progress
  
  Trust line:   Inter 500 13px text-tertiary, centered, margin-top 16px
                "🔒 Plată securizată prin Stripe · PCI DSS Level 1
                 3D Secure activat. Datele cardului nu trec prin serverele noastre."
  
  Logos row:    margin-top 16px, opacity 0.5
                Visa · Mastercard · American Express · Stripe verified · 3DS
```

---

### 14.7. `/thank-you?payment_intent={id}`

#### State 1: Plata reușită + emit sync (sub 10s)

Wow Moment 3 (vezi secțiune 16) — confetti subtil + checkmark animation.

```
Container:      max-width 640px center
Padding:        80px 32px

Hero block:
  Confetti:     Burst pe load (vezi secțiune 16.3)
  
  Icon center: large success checkmark, custom 96×96
                animat scale + draw 600ms
                
  H1:           "Plată reușită!" (Geist 600 display-lg)
                color brand-primary
                margin-top 32px
  
  Subtitle:     "Polița ta se emite acum..." (Inter 400 18px secondary)
                cu spinner subtle dreapta initially

After ~3-5s (sync ok):
  Subtitle update: "✓ Polița ta e gata!"
                spinner replaced cu success checkmark mic
                
  Card details:
                background surface, padding 32px, radius 14px, shadow-md
                margin-top 32px
                
                Detail rows:
                  Poliță:     #21408046    [📥 Descarcă PDF]
                  Asigurător: eazy.insure
                  Vehicul:    BV-18-BFG
                  Perioadă:   28 apr 2026 - 28 apr 2027
                
                Bottom row:
                  "Polița a fost trimisă și pe email la f***@example.ro"
                  Inter 400 14px secondary
  
  Buttons row:  [📥 Descarcă poliță PDF]   [📥 Descarcă IPID]   (secondary)
                [Înapoi la cont →] (primary)
                margin-top 32px

What's next card:
  margin-top 48px
  background neutral-100, padding 24px, radius 14px
  H3:           "Ce urmează?"
  3 list items cu icon stânga 20px:
    🔔 "Te anunțăm cu 60, 30 și 7 zile înainte de expirare. 
       Reînnoirea e 1-click."
    📱 "Polița e disponibilă oricând în cont sau pe email."
    💬 "Ai întrebări? Scrie-ne la support@blaj.io sau pe WhatsApp +40 7XX..."
```

#### State 2: Plata reușită + emit async (timeout 10s)

```
Hero block (different):
  Icon center: large hourglass cu animație rotate slow (4s loop)
                color brand-accent
  
  H1:           "Plata reușită! Polița se procesează..."
  
  Body:         Inter 400 18px secondary
                "Asigurătorul nostru pregătește polița ta. 
                 Va sosi pe email în câteva minute."

Card sub:       Background neutral-100, padding 24px
                "Te poți întoarce la cont — vom trimite o notificare 
                 când e gata. Pe mobile primești și push notification."

Button:         [Mergi la cont →] (primary)

Background polling: 
                Frontend polluiește /api/policy/[id]/status la 3s interval
                If returns 'active' → smooth transition to State 1 (no reload)
```

---

### 14.8. `/cont/dashboard` (homepage cont)

```
Layout:         Sidebar (260px) + main content max-width 1080px

Topbar mini:    Pagina title + acțiuni right
                Title: "Bună, Filip" (Geist 600 display-sm)
                Right: + RCA nou button (primary, accent orange)

Cards grid:     2 cols desktop, stack mobile, gap 24px

Card 1: Polița activă (full width emphasis)
  background:   var(--color-brand-accent-soft)  /* subtle accent bg */
  border:       1px solid rgba(255, 107, 26, 0.2)
  padding:      32px
  
  Header:       Logo eazy.insure 40px + Status badge "Activă" success
  Title:        "Polița ta RCA expiră în 142 de zile"
                Geist 600 24px
  Vehicle:      "Mercedes Sprinter (BV-18-BFG)"
  
  Action:       [Vezi poliță →]   [Reînnoiește acum] (orange CTA)

Card 2: Vehicule
  Header:       "🚗 Vehicule salvate (1)"
  List:         BV-18-BFG · Sprinter 209 CDI · RCA activ
  Action:       [+ Adaugă vehicul]   [Vezi toate →]

Card 3: Acțiuni rapide
  Header:       "⚡ Acțiuni rapide"
  Grid 2×2:
                + RCA nou           Reînnoiește
                Document fiscale    Suport

Card 4: Status securitate (educative)
  Header:       "🔒 Datele tale sunt în siguranță"
  Body:         "Datele tale sunt criptate end-to-end. 
                 Vezi cum protejăm informațiile tale."
  Link:         "Detalii securitate →"
```

---

### 14.9. `/cont/polite` (lista polițe)

```
Topbar:         Title "Polițele tale" + filter dropdown right
                + RCA nou button orange

Filter chips:   [Activă (1)] [Expirată (0)] [Anulată (0)] [În curs (0)]
                count în paranteze, selected primary background

Polite list:    cards stacked, gap 16px

Each policy card:
  padding 24px, radius 14px, border subtle
  
  Top row:      Logo asig 32px + Policy number Geist Mono 600 14px
                + Status badge (right)
  
  Middle:       Vehicul (Inter 600 16px) + plate
                Perioadă (Inter 400 14px secondary)
                Total (Geist Mono 500 14px tabular)
  
  Footer row:   buttons inline:
                [📥 Poliță PDF] [📥 IPID] [⚙️ Modifică] [⚠️ Anulează]
                ghost buttons, hover background subtle
  
  Withdrawal banner (if ≤14d):
                background success-soft, padding 8px 12px, radius 8px
                "ℹ Mai ai 11 zile drept retragere fără motiv"
                Inter 500 13px success color
```

---

### 14.10. `/cont/vehicule` (Garaj)

```
Topbar:         "Garajul tău" + button [+ Adaugă vehicul]

Empty state (if no vehicles):
  Centered, max-width 480px, padding 80px 32px
  Icon:         large car illustration 120×120 (custom outline)
  H2:           "Garajul tău e gol"
  Body:         "Adaugă primul vehicul ca să-l reutilizezi 
                 oricând la calculul polițelor."
  Button:       "Adaugă primul vehicul →" (primary)

Vehicles grid (if any):
  desktop 3 col, mobile stack, gap 24px
  
  Vehicle card:
    padding:    24px
    
    Top:        Vehicle icon 40px (custom)
                Status badge: "RCA activ până 28 apr 2027" (success-soft)
                                or "Fără RCA activ" (warning-soft)
    
    Middle:     Plate large: "BV-18-BFG" (Geist Mono 600 24px)
                Make/Model (Inter 500 16px)
                VIN truncat: "WDB...155032" (Mono 13px secondary)
    
    Footer buttons row:
                [Editează]  [Șterge]  [+ RCA nou pentru acest →] (primary)
```

---

### 14.11. `/cont/persoane`

```
Topbar:         "Persoane salvate" + [+ Adaugă persoană]

Tabs:           [Persoane fizice] [Companii]

Person cards stacked:
  padding 20px, radius 14px
  
  For PF:       Avatar generic 48px circle (initials)
                Nume (Inter 600 16px)
                CNP mascat: "****8017" (Mono 13px secondary)
                Tags: "Proprietar" + "Șofer principal" (chip-uri mici)
                Ghost buttons: [Editează] [Șterge]
  
  For PJ:       Building icon 48px
                Company name (Inter 600 16px)
                CUI: "RO****6789"
                Sub: "Reprezentant: Blajiu Filip"
                same buttons
```

---

### 14.12. `/cont/profil`

```
Tabs:           [Date cont] [Notificări] [Securitate] [Confidențialitate]

Tab 1: Date cont
  Card sections cu titluri:
    Identitate:     Email primary + Verificat badge
                    Telefon
                    Limbă (dropdown RO/EN)
    
  Each row:     label left + value middle + ghost edit button right

Tab 2: Notificări
  Toggle list (shadcn Switch):
    ☑ Reminder email expirare (60 zile)
    ☑ Reminder email expirare (30 zile)
    ☑ Reminder SMS urgență (7 zile)
    ☐ Push notificări mobile (când ai app instalată)
    ☐ Newsletter blaj.io (lunar, opt-in)

Tab 3: Securitate
  Sections:
    Parolă:           [Schimbă parola] (button if set)
    Two-factor:       toggle "Activează 2FA"
    Sesiuni active:   list with revoke buttons

Tab 4: Confidențialitate
  Buttons section:
    [Vezi datele mele] (export GDPR)
    [Schimbă preferințe cookies]
    [Șterge cont] (destructive button, confirmation modal)
```

---

### 14.13. Wizard anulare poliță

Modal fullscreen (mobile) sau centered (desktop max 720px).

#### Pas 1: Motiv

```
H2:             "De ce vrei să anulezi?"
Description:    "Alege motivul pentru a vedea ce documente sunt necesare."

Radio cards stacked:
  Each card:    padding 20px, border 1px subtle, radius 14px
                hover: border accent
                selected: border 2px brand-primary, background neutral-50
                
                Title: Inter 600 16px
                Description: Inter 400 14px secondary
                Tag (right): success badge if available
  
  Options:
    1. Drept retragere (în primele 14 zile)
       "Anulezi fără motiv. Refund integral prorata."
       ✓ Disponibil — mai ai 11 zile
    
    2. Vând vehiculul
       "Contract vânzare-cumpărare necesar. Refund prorata."
    
    3. Vehicul declarat TOTAL (daună)
       "Document constatator necesar. Refund prorata."
    
    4. Radierea înmatriculării
       "Certificat radiere DRPCIV necesar. Refund prorata."
    
    5. Furtul vehiculului
       "Plângere poliție necesară. Refund prorata."
    
    6. Alt motiv (custom)
       "Echipa noastră evaluează individual."

Footer:         [Renunț]   [Continuă →]
```

#### Pas 2: Calcul refund + documente

```
H2:             "Refund estimat"

Refund card:    background neutral-50, padding 32px, radius 14px
                
                Calculation row by row (Mono tabular):
                  Total poliță:           1.383,79 RON
                  Zile folosite:          23 (din 365)
                  Zile rămase:            342
                  ─────────────────────────────────
                  Premium prorata:        1.231,59 RON
                  Comision broker:           69,19 RON*
                  ─────────────────────────────────
                  REFUND ESTIMAT:         1.300,78 RON   (Geist 600 24px primary)
                
                Helper text:
                  * Drept retragere ≤14 zile = 100% refund inclusiv comision

Documents (per case selected):
  H3:           "Documente necesare"
  Drag-drop uploader cu instrucțiuni clare per caz.

Footer:         [← Înapoi]   [Trimite cerere anulare →] (destructive variant)
                Confirmation: "Ești sigur? Această acțiune nu poate fi anulată ușor."
```

#### Pas 3: Confirmare

```
Hero centered:
  Success icon 96×96 (custom)
  H1:           "Cererea ta a fost primită."
  
Reference:      Inter 500 16px, color secondary
                "Numar referință: ANUL-2026-04-21-001"

Steps card:     "Pași următori:"
                Numbered list 1-4:
                  1. Verificăm cererea în 24-48h
                  2. Trimitem la asigurător (eazy.insure)
                  3. Asigurătorul confirmă în 5-10 zile lucrătoare
                  4. Refund prin Stripe pe cardul ****4242

Helper:         "Vei primi update-uri pe email la fiecare etapă."

Button:         [Înapoi la cont →] (primary)
```

---

### 14.14. `/securitate`

Pagină critică pentru trust narrative.

```
Hero:           Background gradient subtle electric blue → transparent
                
                Eyebrow: "SECURITATE"
                H1: "Datele tale, în siguranță."
                Subhead: "Protejăm informațiile cu aceleași tehnologii folosite de bănci."
                
                Floating illustration right: encryption layers visualization
                (custom SVG cu lock + shield + flowing data lines)

Section 2: Cum funcționează
  3 cols (or stack mobile):
    Layer 1: TRANSPORT
      Icon TLS 64px
      "Toate conexiunile folosesc TLS 1.3, același standard ca băncile."
    Layer 2: STOCARE
      Icon database 64px
      "Fiecare câmp sensibil criptat individual cu chei unice (envelope encryption)."
    Layer 3: CHEI
      Icon key 64px
      "Cheile stocate în hardware Google Cloud KMS, fizic separat de baza de date."

Quote block:    Background neutral-900 (DARK section)
                Color text light
                Padding 80px 32px
                
                Geist 600 24px (italic)
                "În cazul puțin probabil al unei breșe la baza de date, 
                 datele tale ar rămâne complet ilizibile pentru atacatori 
                 — pentru că cheile de decriptare nu se află în același loc."

Section 3: Plăți Stripe
  Side-by-side: Stripe logo + paragraph
                "Nu vedem și nu stocăm niciodată numărul cardului tău. 
                 Datele cardului merg direct la Stripe (PCI DSS Level 1)."

Section 4: Drepturile tale GDPR
  4 column grid cu iconițe + text scurt:
    🔍 Vezi toate datele
    🗑 Șterge contul
    📤 Exportă datele
    ⛔ Limitează prelucrarea
  Centered link "Contact DPO: privacy@blaj.io"

Section 5: Conformitate
  Logo grid trust badges:
    ASF · GDPR · Norma 22/2021 · Legea 132/2017 · Stripe · ISO 27001 (planificat)

Final CTA:      [Citește politica completă] [Întreabă-ne despre securitate]
```

---

### 14.15. `/preturi`

```
Hero:           "Preț transparent."
                "Compari prețurile a 9 asigurători. Comisionul nostru e clar comunicat."

How it works:
  Container max-width 640px, padding generous
  
  Mock receipt-style breakdown:
                background neutral-50, padding 32px, radius 14px, font Geist Mono
                
                EXEMPLU OFERTĂ — Mercedes Sprinter 209 CDI, 12 luni
                ─────────────────────────────────────────────
                Prima asigurător (eazy.insure):    1.314,60 RON
                Comision broker (5%):                 69,19 RON
                ─────────────────────────────────────────────
                Total plătit:                      1.383,79 RON

FAQ section:
  Multiple Q&A's about pricing
  How is brokerage commission calculated
  What's not included
  Why does the price vary between insurers
  etc.
```

---

### 14.16. `/cum-functioneaza`

```
Hero:           "În 4 pași simpli."

4 step illustrations large (custom outline + accent fills):

Step 1: Introduci datele
  Image:        illustration of phone with car upload
  H3:           "Introduci VIN, nr înmatriculare sau încarci talonul."
  Body:         OCR auto-completează 80% din câmpuri. Restul îl completezi tu.

Step 2: Compari oferte
  Image:        illustration of stacked cards with prices
  H3:           "Compari 9 asigurători instant."
  Body:         Toate ofertele într-un loc. Sortezi după preț, perioadă, decontare.

Step 3: Plătești
  Image:        illustration of phone with Apple Pay button
  H3:           "Plătești în 1-tap."
  Body:         Apple Pay, Google Pay sau card. Procesat de Stripe.

Step 4: Primești polița
  Image:        illustration of email with attached PDF
  H3:           "Polița ajunge pe email."
  Body:         În câteva secunde după plată. Disponibilă oricând în cont.

CTA finall:     [Calculează prețul tău →]
```

---

### 14.17. `/intrebari-frecvente` (FAQ extended)

```
Container:      max-width 720px

Header:         "Întrebări frecvente"
Search:         Input search filter live questions, autofocus

Categories tabs: [Toate] [Înainte de cumpărare] [Plată] [După cumpărare] [Anulare] [Securitate]

Accordion:      30-50 Q&A items
                Hierarchical: category → question → answer
                Click expand smooth height transition
                
                Trigger Q: Inter 500 18px
                Content A: Inter 400 16px secondary, plus links inline
                
                Anchor links: each question has #id, share-able URL
```

---

### 14.18. `/contact`

```
Hero:           "Hai să vorbim."
                "Răspundem în 24h pe email, 4h pe WhatsApp în programul de lucru."

Methods grid (3 cols desktop, stack mobile):
  Card 1: Email
    icon 64px, "support@blaj.io" + button mailto
    
  Card 2: WhatsApp
    icon, "+40 7XX XXX XXX" + button click-to-chat
    
  Card 3: Suport DPO
    icon, "privacy@blaj.io" + descriptive

Form:           Inline contact form (optional alternative)
                Subject dropdown + Message textarea + Submit
```

---

### 14.19. `/maintenance` (modă mentenanță)

```
Container:      full viewport, vertical centered
Background:     neutral-50 cu subtle pattern dots

Logo top:       blaj.io centered
Icon:           large clock / wrench illustration custom 128px
H1:             "Suntem în mentenanță."
Body:           "Lucrăm la îmbunătățiri pentru tine. Revenim în câteva minute."
ETA:            (optional, se setează din admin) "Estimat: 30 minute"
Status link:    "Vezi status detaliat →" status.blaj.io
Contact:        "Urgent? support@blaj.io"
```

---

### 14.20. `/404` și `/500`

```
404:            Hero centered, custom illustration "lost car icon"
                H1: "Drumul ăsta nu duce nicăieri."
                Body: "Pagina pe care o cauți nu există."
                CTA: [Înapoi acasă →]

500:            Custom illustration "broken gear"
                H1: "Ceva nu a funcționat."
                Body: "Echipa noastră a fost notificată automat. Încearcă din nou în câteva minute."
                CTAs: [Reîncearcă] [Contact suport]
```

---

### 14.21. `/sign-in` și `/sign-up` (Clerk)

Use Clerk's built-in components but customize appearance to match design tokens.

```
Container:      centered, max-width 440px
Padding:        48px

Logo top:       blaj.io
H1:             "Bun venit înapoi" (sign-in) sau "Hai să creăm un cont" (sign-up)
Form:           Clerk styled to match design (shadcn-like)
                Email + buton "Trimite cod" → OTP screen
                
Footer:         "Continuând, ești de acord cu Termenii."
                Link "Politica de Confidențialitate"
```

---

## 15. Form steps detaliat — micro-interactions

### 15.1. Field state transitions

| State | Visual | Animation |
|---|---|---|
| **Empty** (default) | Border subtle, placeholder text-tertiary | — |
| **Focus** | Border 1.5px electric, shadow-focus blue ring 4px | 150ms ease-out |
| **Filled valid** | Border default, value primary text | — |
| **Filled OCR auto** | Border green subtle + badge "Auto-detectat" right | Fade in badge 200ms |
| **Filled error** | Border 1.5px danger + shake | 400ms shake, 200ms border |
| **Hover (no focus)** | Border medium | 100ms |
| **Disabled** | Background neutral-100, text tertiary, cursor not-allowed | — |
| **Loading** | Inline spinner 16px right | spinner 1s rotate |

### 15.2. Validation timing

- **onBlur:** validation complete (CNP checksum, VIN check digit, etc.).
- **onChange (typing):** doar format hints subtle (e.g. CNP auto-spacing visual: `196 0418 080017`).
- **No real-time validation errors** while typing (don't punish user before they're done).

### 15.3. Error message animation

```
Visibility:     hidden initially
Apariție:       slide-down 200ms ease-out
                  initial: opacity 0, transform: translateY(-4px), height 0
                  end:     opacity 1, transform: translateY(0), height auto
Disparition:    fade-out 150ms (height instant, fade gradual)
```

### 15.4. Auto-fill animation

Când OCR pre-completează un câmp:

```
Per field:
  1. Initial state: empty, normal styling
  2. Trigger: data arrives from OCR
  3. Sequence:
     a) Border briefly pulses green (200ms)
     b) Value types in cu typewriter effect (40ms per char, capped 800ms total)
     c) Badge "Auto-detectat" fade-in la final
  4. Total duration per field: ~1s
  5. Stagger: 80ms delay between fields → cascading effect
```

Visual: like a robot helpfully filling in your form.

### 15.5. Step transition

```
Click "Pasul următor →":
  1. Validate current step (Zod)
  2. If valid:
     a) Button morphs cu spinner (200ms)
     b) Page slides left (translateX -20px) + fade out (300ms)
     c) New page slides in from right (translateX +20px → 0) + fade in (400ms ease-spring-soft)
     d) Stepper animates: completed step circle to filled, next step pulses
  3. Total transition: ~700ms
```

### 15.6. Sticky footer button states

```
Disabled (form invalid):
  Background neutral-200
  Text: tertiary
  Cursor: not-allowed
  Tooltip on hover: "Completează câmpurile obligatorii"

Loading:
  Inline spinner left of text
  Text remains, opacity 0.6
  No click

Success (post-submit):
  Brief checkmark replace, 600ms
  Then proceed to next step
```

### 15.7. Field-specific micro-interactions

**CNP input:**
- Live formatting: groups of 3 digits visually `196 0418 080017` (display only, value stored without spaces).
- Birthday extracted preview below: "Născut/ă pe 18 aprilie 1996" (Inter 400 13px secondary, fade-in la 13 cifre complete).

**VIN input:**
- All-uppercase auto-transform (visual + value).
- Decoder live: pe valid VIN, fade-in badge below "Marca: Mercedes-Benz, Model: Sprinter" (with confirm button "Folosește datele auto-completate").

**Phone input:**
- Auto-format: `+40 727 012 763` (live as user types).
- Country flag stânga 24×16 (always RO 🇷🇴 default).

**Date pickers:**
- Calendar component (shadcn).
- Disabled days clearly grayed.
- Hovered range visible (when applicable).
- Today highlighted with subtle dot indicator.

**Checkbox group acorduri:**
- Click anywhere on row toggles (not just checkbox).
- Required items have orange `*`.
- Group container has subtle border + padding.
- "Renunț la consultanță" has tooltip explanation icon.

**Searchable select (e.g., companii leasing):**
- Auto-complete with debounce 200ms.
- "Recent" or "Popular" section at top of dropdown.
- "+ Adaugă altă companie" la bottom mereu vizibil.
- Selected pill cu X clearable.

---

## 16. The 3 Wow Moments

Animații intenționate cu impact maxim. Fiecare consumă "buget animation" controlat.

### 16.1. Wow Moment 1 — Drag & Drop OCR Reveal

**Locație:** Landing hero, drop zone.

**Goal:** când user trage primul fișier peste pagină, vrem WOW factor care să comunice "dropped → magic happens".

**Sequence:**

```
PHASE 1 — IDLE STATE (default):
  Zone:        2px dashed border subtle, padding 80px, radius 28px
  Inside:      
    Icon 56px upload (line art, color text-tertiary)
    H3 "Încarcă talonul și CI" (Geist 600 24px)
    Body "Sau introduce VIN-ul mai jos" (Inter 400 16px secondary)
    Mini illustration row: talon + CI thumbnails (illustrative)
  
  Idle anim:   Icon levitates subtle 4px up/down, 3s ease-in-out infinite
                Helps draw eye without being distracting

PHASE 2 — DRAGOVER GLOBAL DETECTED:
  Trigger:     `dragover` event on document, file in dataTransfer
  
  Animations parallel (300ms ease-spring-soft):
    Body backdrop: subtle gradient overlay fade in
                  radial-gradient from drop zone outward, accent orange 8% opacity
    
    Drop zone:   border transitions to 2.5px dashed brand-accent (orange)
                 background: var(--color-brand-accent-soft)
                 shadow: var(--shadow-glow-accent) (orange glow!)
                 scale 1.02
    
    Icon:        scale 1.2 + color → brand-accent
                 mini bounce: y: 0 → -8 → 0 over 600ms
    
    Headline:    text changes via fade swap to "Eliberează aici"
                 fade-out 150ms / fade-in 200ms cu new text
    
    Mini illustration: talon + CI items "alert" — slight tilt + glow

PHASE 3 — DRAG LEAVE (user dragged out without dropping):
  Reverse animations 200ms

PHASE 4 — DROP TRIGGERED:
  Sequence (1.2s total):
    
    a) Drop zone "absorbs" file:
       border briefly thickens 4px + bright orange glow flash 100ms
       file icon ghosts appear in zone center (as if files are now "inside")
    
    b) "Reading" animation 600ms:
       Document AI shimmer effect over zone
       text changes: "Citim documentele..."
       progress bar subtle 600ms left-to-right
       3 dots loading stilizat sub headline
    
    c) Success flash:
       100ms green pulse
       Checkmark large appears scale-in 200ms ease-spring
    
    d) Transition out:
       Whole zone scale down + fade
       Smooth navigation to /quote/step-1 with form pre-filled
       (route change animation overlap)

PHASE 5 — STEP 1 ARRIVAL:
  Form fields pre-fill cu cascading typewriter effect (15.4 above)
  User sees: "Magic — datele s-au completat singure."
```

**Implementation hints:**
- Framer Motion `<motion.div>` with `animate={dragState}`.
- Drag detection via `react-dropzone` with custom hooks for global dragover state.
- Document AI loading via `<Suspense>` + skeleton.

---

### 16.2. Wow Moment 2 — Oferte Loading + Stagger Reveal

**Locație:** `/quote/step-4` initial load.

**Goal:** transformă timpul de așteptare API (3-5s) într-un moment intentional + delight prin staggered reveal.

**Sequence:**

```
PHASE 1 — INITIAL LOADING (0-1s):
  Header:       Title "Caut ofertele tale..."
  Subtext:      "9 asigurători verificați (0 / 9)" — counter live
  
  Skeleton grid: 9 card skeletons render immediately
                each shimmer animation independent
                grid layout già finished

PHASE 2 — PROGRESSIVE REVEAL (responses come in):
  Per response received:
    Counter increments smoothly (number animate)
    Specific skeleton card morphs to real card:
    
      a) Skeleton fades out 200ms
      b) Real card content fades in cu specific animation:
         - Logo appears scale-in 250ms ease-spring
         - Prices count up from 0 to actual value (400ms tabular animation)
         - Bonus-malus badge slides in
         - Buttons appear last
      c) Total morph time: ~600ms per card
  
  Card-to-card stagger: 80-150ms delay between API responses
  Net effect: visually the cards "pop into existence" one by one
              like ofertele "arrive" în timp real

PHASE 3 — FULL LOAD (all 9 done):
  Counter:      "9 asigurători verificați (9 / 9)" + "✓ Complet"
                fade transition 300ms
  
  Best value banner appears top:
    Slide-down + fade 400ms ease-spring-soft
    Background brand-accent-soft + content
    
  Subtle confetti burst (mini, 12 particles) cu accent orange
    over best value card only
    300ms
  
  All cards now interactive: hover lift, click → checkout

PHASE 4 — INDISPONIBILE EXPAND (optional):
  Click "Indisponibile (2) ▼"
    accordion expand 250ms
    cards inside fade in stagger 50ms each
```

**Edge cases:**
- If 0 oferte: replace whole grid with BAAR screen (custom transition fade between states).
- If 1-2 oferte: full grid still rendered + banner at top "Posibil risc ridicat" + subtle red border on grid empty cards.

---

### 16.3. Wow Moment 3 — Checkout Success

**Locație:** `/thank-you?payment_intent={id}` la sosire imediată după plată reușită.

**Goal:** moment de celebrare proporționat — bucurie controlată, nu kitsch confetti party.

**Sequence:**

```
PHASE 1 — ARRIVAL (instant on route load):
  Page enters cu fade 400ms
  Background: subtle gradient radial accent orange center → transparent
              "warmth" feel
  
  Container empty initially

PHASE 2 — CHECKMARK DRAW (0-800ms):
  Large success icon center page
  Custom SVG 96×96
    1) Circle border draws stroke 0% → 100% (400ms ease-out)
    2) Checkmark inside path draws (300ms ease-spring after circle done)
    3) Brief scale pulse 1 → 1.1 → 1 (200ms)
  
  Color: green-500 (success) — NOT brand-accent
        (legitimate success signal, not just brand color)

PHASE 3 — TEXT REVEAL (700-1200ms):
  H1 "Plată reușită!" 
    fade-in + translateY -8 → 0, 300ms ease-out
  
  Subtitle "Polița ta se emite acum..."
    fade-in 200ms, 100ms delay after H1

PHASE 4 — CONFETTI BURST (800-1500ms):
  Trigger 100ms after checkmark complete
  
  Confetti particles:
    Count: 60 particles
    Origin: from checkmark center
    Spread: 360° radial outward
    Distance: 200-400px random per particle
    Duration: 700ms each, ease-out
    
    Particles styling:
      Mix of:
        - Small circles 6-8px (40% of particles): orange + electric blue + green-500
        - Small rectangles 4×8px (40%): same colors
        - Tiny stars 8px (20%): orange only (brand accent)
      Random rotation 0-360°, rotates over duration
      Random scale 0.5-1.2
      Gravity: subtle drop after 400ms (translateY +50px additional)
  
  Note: subtle, not overwhelming. ~60 particles, NOT 500. 
        Inspired by Stripe's confetti, NOT party app.

PHASE 5 — POLICY DETAILS REVEAL (1200ms+):
  After polling /api/policy/[id]/status returns 'active' (typically 3-5s post payment):
    
    a) Subtitle changes: "Polița ta e gata!"
       Crossfade 200ms
    
    b) Policy details card slides up from bottom + fades in
       400ms ease-spring-soft
    
    c) Action buttons row reveals stagger 80ms each
       [Descarcă PDF] [Descarcă IPID] [Înapoi la cont]

PHASE 6 — IDLE (post-reveal):
  Page calm, info accessible
  
  Subtle background animation:
    Background gradient slowly shifts angle 0deg → 360deg over 60s loop
    Very subtle, nu evident decât dacă privești fix
    Adaugă "alive" feel without being distracting
```

**Reduced motion fallback:**
- No confetti.
- Simple instant fade + scale.
- Checkmark static, no draw animation.
- Text appears instant.

---

## 17. Empty / Loading / Error states

### 17.1. Empty states catalog

| Location | Illustration | H3 | Body | CTA |
|---|---|---|---|---|
| Cont fără polițe | car + envelope outline | "Nicio poliță încă." | "Aici vor apărea polițele tale RCA." | "Calculează prima oră RCA →" |
| Garaj gol | car silhouette | "Garajul tău e gol." | "Adaugă vehicule pentru reutilizare la calcul." | "Adaugă primul vehicul →" |
| Persoane goale | person outline | "Nicio persoană salvată." | "Salvează date pentru reutilizare la polițe." | "Adaugă persoană →" |
| 0 oferte (BAAR) | warning shield | "N-am putut găsi oferte." | "Categoria 'risc ridicat' — direcționăm către BAAR." | "Mergi la BAAR →" |
| Notificări goale | bell outline | "Liniștite în jurul." | "Vom trimite reminder cu 60 zile înainte de expirare." | (no CTA) |
| Search results 0 | magnifying glass | "Nu am găsit nimic." | "Încearcă alte cuvinte cheie." | "Vezi toate întrebările" |

Each empty state styling:
- Centered, max-width 400px
- Padding 64px 32px
- Illustration 96-120px height (custom outline + accent fill)
- H3 Geist 600 24px, margin-top 24px
- Body Inter 400 16px secondary, margin-top 8px
- CTA button margin-top 32px

### 17.2. Loading states catalog

| Type | Visual | When |
|---|---|---|
| **Skeleton screens** | Shimmer placeholders matching final layout | Page initial load, fetching data |
| **Inline spinners** | 16-24px circular brand-primary | Button submitting, small async |
| **Full page loader** | Logo cu pulse + "Loading..." text | App init only |
| **Linear progress** | 2px height bar at top of page | Route transitions, multi-step ops |
| **Optimistic UI** | Action fires immediately, error rollback | Toggle decontare, durată change |
| **Polling indicator** | "Verificare..." cu dots animation | Thank-you page polling status |

### 17.3. Error states catalog

| Type | Visual | Position |
|---|---|---|
| **Inline field error** | Below input, red text + icon | Form fields |
| **Toast** | Sonner toast bottom-right | Network errors, async ops |
| **Banner** | Top of section, dismissable | Persistent warning (e.g. "Ofertă expirată") |
| **Full page error** | 500-style with illustration | Critical server errors |
| **Modal error** | Modal cu retry button | Payment failed, OCR retry |

### 17.4. Network offline state

```
Banner top sticky:
  Background: var(--color-warning-soft)
  Border-bottom: 1px var(--color-warning)
  Padding: 12px 16px
  Content: "📡 Conexiune pierdută. Reconectare automată..."
  Inter 500 14px color warning
  
  Auto-dismiss when reconnected with success toast.
```

---

## 18. Mobile responsive

### 18.1. Breakpoints

```
sm:    640px   /* tablet portrait */
md:    768px   /* tablet landscape */
lg:    1024px  /* desktop small */
xl:    1280px  /* desktop standard */
2xl:   1536px  /* desktop large */
```

### 18.2. Mobile-specific patterns

- **Bottom sticky CTAs:** All wizard footers fixed bottom on mobile.
- **Bottom nav bar:** Cont layout uses 5-tab bottom bar on mobile (vs sidebar desktop).
- **Drawer modals:** Mobile modals slide up from bottom (not center).
- **Touch targets minim 44×44px:** All interactive elements.
- **No hover states:** Replace with active/pressed states.
- **Drag-and-drop:** Replaced with native picker on mobile (file upload button).
- **Swipe gestures:** Tabs in carousel can be swiped on mobile.

### 18.3. Typography mobile adjustments

| Token | Desktop | Mobile |
|---|---|---|
| display-2xl | 80px | 48px |
| display-xl | 64px | 40px |
| display-lg | 48px | 32px |
| display-md | 36px | 28px |
| H3 | 24px | 20px |
| H4 | 20px | 18px |

### 18.4. Spacing mobile adjustments

- Hero padding: 80px desktop → 48px mobile.
- Section padding: 128px desktop → 64-80px mobile.
- Card padding: 32px desktop → 24px mobile.
- Container horizontal padding: 32px → 16px.

### 18.5. Image / illustration handling

- Hero portrait image: max-height 70vh on mobile (avoid pushing CTA below fold).
- Logo wall: 2-3 cols mobile (vs 3 desktop).
- Step illustrations: 80px mobile (vs 120px desktop).

---

## 19. Accessibility specs

### 19.1. WCAG 2.2 AA compliance checklist

✅ **Contrast ratios** all AA verified (vezi 4.5).
✅ **Focus states** visible on every interactive element (4px outline, 0.12 opacity electric blue).
✅ **Keyboard navigation** every interactive element reachable via Tab.
✅ **Skip to main content** link prim element în DOM, hidden until focused.
✅ **ARIA labels** on icon-only buttons.
✅ **ARIA live regions** for toasts + dynamic content.
✅ **Form labels** associated with all inputs (no placeholder-only labels).
✅ **Error identification** programmatic (aria-invalid, aria-describedby).
✅ **No information by color alone** (icons + text always together for status).
✅ **Reduced motion** respected for all animations.
✅ **Text resize 200%** without horizontal scroll.
✅ **Touch targets** minimum 44×44px (Persona 3 friendly).

### 19.2. Specific patterns

**Modal:**
- `role="dialog"`, `aria-modal="true"`.
- Focus trap inside modal.
- ESC key closes.
- Focus returns to trigger element on close.
- Focus on first focusable element on open (or close button if no other focusable).

**Form errors:**
- `aria-invalid="true"` on field with error.
- `aria-describedby="error-id"` linking to error message.
- Error message has `role="alert"` for screen reader announcement.

**Loading states:**
- Skeleton screens with `aria-busy="true"` on container.
- Spinner with `role="status"` + `aria-label="Loading"`.

**Toast notifications:**
- Container `aria-live="polite"` (info) or `aria-live="assertive"` (error).
- Auto-dismiss but with pause on focus (user reading).

**Stepper:**
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Each step has `aria-current="step"` on active.

### 19.3. Screen reader testing

Pre-launch manual testing on:
- VoiceOver (iOS Safari, Mac Safari).
- TalkBack (Android Chrome).
- NVDA (Windows Firefox + Chrome).
- JAWS (optional, less common).

Test priority pages:
1. Landing → form steps 1-4 → checkout → thank-you (entire happy path).
2. Cont dashboard.
3. Anulare wizard.
4. Cookie banner.
5. OTP modal.

### 19.4. Reduced motion specific

When `prefers-reduced-motion: reduce`:
- Wow Moment 1: Drop zone color change instant (no glow animation).
- Wow Moment 2: Cards appear instant, no stagger.
- Wow Moment 3: No confetti. Static success icon. Instant text reveal.
- All page transitions: instant.
- Hover lifts: instant.
- Skeleton shimmer: replace with subtle pulse.
- Carousel auto-play: disabled.

---

## 20. Dark mode — diferențe vs light

Auto-detect `prefers-color-scheme`. **No toggle button** (decizie locked Q6).

### 20.1. Visual differences

- All neutralii inversed (vezi 4.3).
- Surfaces folosesc lumination layered: bg darkest → surface 1 step lighter → raised 1 step lighter again.
- Shadows mai puternic (eyes adapt, need more contrast).
- Borders mai vizibile (lower opacity overlays insufficient).
- Brand accent ușor mai luminat (orange 122,45 vs 107,26).
- Photography images: keep same — natural lighting works în ambele moduri.
- Logos asigurători: container white background subtle pentru a păstra brand intact.

### 20.2. Specific component changes

**Cards:** background `var(--color-surface)` (pe dark = #11111A, slight elevation peste bg #0A0A0F).

**Inputs:** background `var(--color-surface)` (NOT pure black — slight elevation pentru distinguish).

**Hero gradient:** subtle orange/blue glows mai vizibile pe dark (background contrast).

**Modal:** backdrop `rgba(0, 0, 0, 0.7)` (vs 0.6 light) + backdrop-blur(8px).

**Skeleton shimmer:** colors adjusted: dark gradient between neutral-100 (#11111A) and neutral-200 (#1A1A22).

### 20.3. Edge cases

- Stripe Elements respect `appearance.theme: 'auto'` cu custom variables passed.
- Marshmallow-style portrait images: keep same in both modes (natural lighting).
- Cookie banner: respects mode.
- PDF documents and emails: light only (consistency cu email clients).

---

## 21. Asset deliverables list

### 21.1. Logo assets

- `logo-blajio-light.svg` (primary, antracit text + orange dot)
- `logo-blajio-dark.svg` (off-white text + orange dot)
- `logo-blajio-mono-dark.svg` (full antracit)
- `logo-blajio-mono-light.svg` (full off-white)
- `favicon.ico` (32×32)
- `favicon-16.png`, `favicon-32.png`, `favicon-192.png`, `favicon-512.png`
- `apple-touch-icon.png` (180×180)
- `app-icon-1024.png` (iOS + Android masters)
- `og-image.png` (1200×630, social sharing)
- `twitter-card.png` (1200×675)

### 21.2. Photography deliverables

3-4 portrait foto comandate la fotograf:
- `hero-portrait-1.jpg` (Andrei dezvoltator) — 2400×2880px
- `hero-portrait-2.jpg` (Mihaela manager) — same
- `hero-portrait-3.jpg` (Domnul Ion pensionar) — same
- `securitate-portrait.jpg` (engineer/founder) — 1600×2000px
- All in: optimized WebP + AVIF + fallback JPG.

### 21.3. Illustrations custom

Comandate sau create în Figma:
- 4× step illustrations homepage (80×80px, line art + accent fills)
- 6× empty state illustrations (96×96 - 120×120px)
- 1× large encryption diagram (`/securitate`, 480×360px)
- 1× drop zone subtle background pattern (SVG)
- 1× hero background gradient pattern with noise (SVG/PNG)
- 1× 404 illustration (lost car)
- 1× 500 illustration (broken gear)
- 1× maintenance illustration (clock/wrench)

### 21.4. Custom icons

Mini-set 12-15 custom icons (24×24 SVG):
- icon-policy, icon-vehicle, icon-leasing, icon-driver, icon-direct-settlement, icon-bonus-malus, icon-baar, icon-renew, icon-cancel, icon-otp, icon-encryption, icon-stripe.

### 21.5. Confetti graphics

- 5-7 SVG particles (circles, rectangles, stars) for Wow Moment 3.
- Color variants in tokens.

### 21.6. Insurer logos

9 SVG logos curate (or fetched from official sources):
- Allianz, Asirom, Axeria, eazy.insure, Generali, Grawe, Groupama, Hellas Direct, Omniasig.

### 21.7. Fonts hosting

- Geist Sans 400/500/600/700 — woff2 self-hosted (`/fonts/geist-*.woff2`).
- Inter 400/500/600 — woff2 self-hosted (`/fonts/inter-*.woff2`).
- Geist Mono 400/500 — woff2 self-hosted.
- Subset to Latin + Latin Extended (RO diacritice critical).

### 21.8. Figma deliverables

- Master design file `blajio-design-system.fig` cu:
  - Page: Tokens (colors, typography, spacing, etc.)
  - Page: Components (toate componentele cu variants + states)
  - Page: Marketing pages (hi-fi mockups)
  - Page: Form steps (4 steps)
  - Page: Checkout + thank-you
  - Page: Cont (dashboard, polițe, vehicule, persoane, profil)
  - Page: Wizards (anulare)
  - Page: Wow moments (storyboards animate)
  - Page: Empty/error states catalog
  - Page: Mobile responsive frames

Componente Figma cu Auto Layout proper, variants pentru states, design tokens linked via plugin (Tokens Studio sau Variables nativ).

---

## 22. Iterații și testing

### 22.1. Design review checklist

Înainte de hand-off către dezvoltare:

- [ ] Toate pagini design-ed în Figma (light + dark + mobile).
- [ ] Componente toate cu variants pentru toate states (default, hover, focus, active, disabled, loading, error, success).
- [ ] Typography scale aplicată consistent (no rogue font sizes).
- [ ] Color tokens folosiți peste tot (no rogue hex codes).
- [ ] Spacing tokens folosiți peste tot (no rogue px values).
- [ ] Touch targets minim 44×44 verified.
- [ ] Contrast WCAG AA verified pe toate text/bg combos.
- [ ] Wow moments storyboarded frame-by-frame.
- [ ] Reduced motion fallbacks documented.
- [ ] All copy in Romanian (no Lorem Ipsum) + English equivalent.
- [ ] Photography sourced (or at least placeholder representative).
- [ ] Illustrations sourced (or at least style guide for vendor).

### 22.2. User testing pre-launch

Recommended:
- 5 useri cu Persona 1 (tineri tech).
- 5 useri cu Persona 3 (vârstnici cu experiență digitală minimă).
- Task-based testing: emit RCA happy path + anulare + reînnoire.
- Measure: time to complete, errors per step, satisfaction (SUS scale).

Iterate based on findings before launch.

---

## 23. Brief final pentru designer / AI design tool

**Resumé pentru un colaborator design care primește acest doc:**

1. Citește `aplicatie.md` (specificație produs) prima oară.
2. Apoi citește acest `design.md` în întregime.
3. Începe cu sistemul de design (tokens, components, typography).
4. Apoi design pagini în ordinea: Landing → Form steps → Checkout → Thank-you → Cont (dashboard prima oară).
5. Storyboard wow moments separat (3 short animations).
6. Final: empty states, error states, mobile responsive, dark mode variants.
7. Hand-off în Figma cu naming convențional + auto layout proper.

**Repere de calitate (test):**
- Mock-up-urile NU trebuie să arate AI-generated:
  - ❌ No generic blue + white only.
  - ❌ No stock illustrations.
  - ❌ No Lorem Ipsum copy.
  - ❌ No placeholder logos.
- Mock-up-urile DA trebuie:
  - ✅ Real Romanian copy din specs.
  - ✅ Real photographs (Marshmallow-style portraits).
  - ✅ Real insurer logos.
  - ✅ Tokens folosiți consistent.
  - ✅ Spacing aerisit, premium feel.
  - ✅ Anthracite + electric blue + orange palette (NU just blue).
  - ✅ Geist + Inter fonts.

**Vibe check:**
- Stripe.com pentru UI organization + animation pace.
- Wise.com pentru scroll animations + typography hierarchy.
- Marshmallow.com pentru photography use + warmth.
- Linear.app pentru density + premium feel.

Dacă mock-up-ul tău arată ca **mediocre fintech / generic AI design** = redo. Dacă arată ca **rafinat, unic, distinctly blaj.io** = ship.

---

**FIN.**

Pentru orice ambiguitate apărută, decide în spiritul:
- "Mai aerisit decât te-ai aștepta."
- "Mai puțin animație decât crezi."
- "Tipografia face munca cea mai grea."
- "Fotografiile reale > orice illustration."
- "Designul deservește persona 3 (vârstnici) la fel de bine ca persona 1 (tineri)."

Versiune nouă: bumpează `Versiune` în header. Modificările materiale → re-deliver Figma cu changelog.
