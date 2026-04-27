Vreau sa creez o aplicatie pentru web, android si ios pentru a genera asigurari
Primul tip de asigurari pe care ne vom concentra este RCA
Celelante tipuri sunt: (pe care trebuie sa le avem in minte cand cream modelele pentru baza de date pentru a fi usor reutilizate)
- CASCO
- Locuinta
- Sanatate
- Calatorie
- Viata
Ajuta-ma sa planuiesc technologiile pe care sa le folosesc.
Mai jos sunt 5 exemple de flow-uri de la:
- Emag
- Insurex
- easy.insure
- pretul meu
- asig365
Analizeaza-le pe toate in asa fel incat UI/UX pe care il vom crea sa fie corect legislativ, simplu dar extrem de editabil acoperind toate flow-urile posibile.
Interfata vreau sa fie curata, moderna, validata la onblur.
Vreau sa existe posibilitatea sa fie incarcat talonul si cartea de identitate pentru a le processa si extrage datele automat dar si posibilitatea de introducere manuala.
Vreau sa existe un api accesibil din internet pentru a integra mai tarziu un bot de WhatsApp.
Pregateste un plan extrem de detaliat pe care sa il folosesti in claude design pentru a genera interfata aplicatiei.
Pune intrebari unde nu e clar ce technologii vreau sa folosesti pentru db, auth, backend, ui etc.

Stack TypeScript end-to-end orpc: Next.js + Neon + Expo + Google Document AI. Mai am câteva întrebări critice.
Strategie aplicație mobilă (Expo)? Native screens
Cum gestionăm fluxul OCR (talon + CI prin Google Document AI)? Sincron în request handler
Pentru autentificare si management utilizatori (web + mobile + API) folosim Clerk
ORM/query builder pe Neon Postgres folosim Drizzle ORM
Integram asiguratorii pentru cotatii RCA folosind ca agregator Safety Broker mocked la inceput pana primim access la documentatia api.
Sursă date externe RCA (BAAR risc ridicat, CEDAM bonus-malus, decodor VIN)? Mocked + integrări separate ulterior
Plata politelor + abonamente NETOPIA Payments (RO)
Plată NETOPIA: cum tratam confirmarea și emisia poliței? Webhook NETOPIA → emitere automată
Organizam codul (web + mobile + shared) folosind Monorepo Turborepo + pnpm workspaces
Stack UI + validare formulare (vrei "curat, modern, validat onblur") shadcn/ui + RHF + Zod
Stocam documente uploadate (talon, CI, polite PDF) pe hetzner s3
Platforma hosting Vercel + EAS + Neon
Cine emite polițele în aplicație? Răspunsul determină modelul de date (multi-tenant, agent dashboard, comisioane). B2C direct
Limbi suportate la lansare? RO + EN de la început
Cum lansăm API-ul public pentru bot WhatsApp și alte integrări externe? oRPC cu OpenAPI plugin

#EXEMPLU EMAG

Secțiunea 1: Contract de Leasing
Întrebare: Autovehiculul este obiectul unui contract de leasing în derulare?
Opțiuni: Nu (Selectat), Da

Secțiunea 2: Detalii proprietar
Tip persoană: Persoană fizică (Selectat), Persoană juridică
Declarație: (Bifat) "Declar pe propria răspundere că sunt persoana fizică și am în proprietate acest autovehicul sau am drept legal de utilizare pentru acest autovehicul*"
Nume*: Blajiu
Prenume*: Filip
CNP*: 1960418080017
An obținere permis*: 2016
Act de identitate: BI / CI (Selectat), Pașaport
Serie BI / CI*: zv
Număr BI / CI*: 369226

Secțiunea 3: Adresa trecută în talon
Județ*: Brasov
Localitate*: Rasnov
Cod poștal: 505400
Stradă*: Vanatori
Număr*: 51
Bloc: (Necompletat)
Scara: (Necompletat)
Etaj: (Necompletat)
Apartament: (Necompletat)
Secțiunea 4: Conducător auto
Întrebare: Proprietarul mașinii este același cu conducătorul?
Opțiuni: Da (Selectat), Nu
Listă conducători: Conducător auto 1: Blajiu Filip - 1960418080017
Opțiune suplimentară: Adaugă încă un conducător
Secțiunea 5: Declarație de renunțare la consultanță
Câmp bifat: "Declar că optez pentru renunțarea la acordarea consultanței, conform prevederilor legale aplicabile comercializării electronice a produselor de asigurare*"
Notă informativă: "Atenție! Ca urmare a opțiunii tale de renunțare la consultanță, te informăm că nu vom evalua în ce măsură contractul de asigurare, pe care urmează să-l închei, corespunde cerințelor și necesităților tale. Te rugăm să completezi cu atenție datele și informațiile ce îți vor fi solicitate în vederea încheierii asigurării dorite."

Navigare
Progres: 1 din 4
Buton: Pasul următor →

Date despre autovehicul
Pentru inmatriculare?: Nu (selectat) / Da
*Numar inmatriculare : bv18bfg
*Numar identificare (serie sasiu) : WDB9066131S155032
*Tip auto : Autoutilitara
*Brand : Mercedes-Benz
*Model : Alt model (sprinter 209 cdi)
*Anul productiei : 2007
*Tip combustibil : Motorina
*Masa maxima : 2800
*Cilindree : 2148
*Putere (kw) : 65
*Numar locuri : 2
*Seria CIV : r261666

Elemente de interfață:
Indicator progres: 2 din 4
Buton: Pasul urmator →

Secțiunea Principală: Selectează data de început a poliței
Alege data de intrare în vigoare:
Data selectată în calendar: 24 Martie 2026 (Marți).
Mesaj confirmare: ÎNCEPÂND CU DATA 24 Martie 2026, Marți.
Notă informativă: "Pentru a putea face o calculație trebuie sa revii cu cel mult 59 de zile înainte de expirare."

Legendă:
Bulină verde: Ziua începerii noii asigurări (24).
Bulină gri: Ziua curentă (22).
Panoul lateral (Rezumat vehicul și proprietar)
Vehicul: Mercedes-Benz sprinter 209 ...
Număr înmatriculare: bv18bfg
Proprietar: Blajiu Filip
Conducători auto: Blajiu Filip
Link suplimentar: Date din talon - Vezi Detalii

Elemente de interfață
Indicator progres: 3 din 4
Buton: Vezi oferte RCA


Tipul de produs
Tipul de asigurare RCA - Livrare electronică imediată prin email (Selectat)

Termeni și Condiții
Text introductiv: "Prezentele Termene și Condiții stabilesc regulile de prestare a Serviciilor precum și regulile privind încheierea Contractelor de Asigurare prin intermediul Site-ului."
1. Prestarea Serviciilor
1.1 Serviciile sunt prestate de societatea Dante International S.A în calitate de asistent în brokeraj al SC. Safety Broker de Asigurare SA denumită în continuare "Safety Broker de Asigurare", care este broker de asigurare și deține toate autorizațiile necesare desfășurării acestei activități.
1.2 Safety Broker de Asigurare este înregistrată în Comisia de Supraveghere a Asigurărilor sub numărul RBK-293.
1.3 Datele de identificare S.C. Safety Broker de Asigurare SA:
SC Safety Broker de Asigurare SA
sediu social: Str. Calea Giulești, nr. 8D, Sector 6, București
înregistrată la registrul comerțului cu numărul J40/6184/2005

Declarație finală și confirmare
Text declarație: "Prin continuare declar pe propria răspundere că sunt persoana fizică și am în proprietate acest autovehicul sau reprezentat legal / împuternicit de către persoana juridică care este proprietar al autovehiculului."

Buton de acțiune: [✓] Sunt de acord

Titlu și Opțiuni Generale
Titlu: Ofertele asiguratorilor

Subtitlu: Alege asigurarea potrivită (Ai mai multă flexibilitate în a alege valabilitatea dorită)

Tip decontare: Fără decontare directă (Selectat) | Cu decontare directă

Notă: "Află cum îți poți repara mai simplu mașina folosind asigurarea RCA proprie (vezi detalii)."

Asigurator,Tarif pe 6 luni,Tarif pe 12 luni,Informații suplimentare
Asirom,"1.415,20 Lei","1.782,26 Lei","Plată integrală online, Clasă B6"
OMNIASIG,"3.254,33 Lei","3.499,28 Lei","Plată integrală online, Clasă B6"
GENERALI,"1.473,00 Lei","1.593,00 Lei","Plată integrală online, Clasă B6"
eazy.insure,"1.079,48 Lei","1.439,12 Lei","Plată integrală online, Clasă B6"
Groupama,"2.140,46 Lei","2.671,40 Lei","Plată integrală online, Clasă B6"
HELLAS DIRECT,"3.659,88 Lei","5.147,79 Lei","Plată integrală online, Clasă B6"
Notă comună: Pentru toate ofertele, plata se face integral doar cu cardul online, iar noua clasă de asigurare este B6.

Sumar Date Vehicul și Proprietar (Dreapta)
Vehicul: Mercedes-Benz sprinter 209 ...
Nr. Înmatriculare: bv18bfg
Data începere poliță: 24 Martie 2026
Proprietar: Blajiu Filip
Conducători auto: Blajiu Filip
Date din talon: Vezi Detalii

Subsol
Link verificare tarife: Pentru verificarea tarifelor de referință puteți accesa adresa https://www.baar.ro/asigurati-cu-risc-ridicat/


#EXEMPLU INSUREX

HERO Section
Mesaj Principal
Text: "Vezi instant toate ofertele RCA, fără drumuri inutile."
Câmpuri și Opțiuni
Câmp de introducere: Scrie numărul de înmatriculare
Valoare introdusă: BV18bfg
Comutator (Toggle): "Vreau pentru înmatriculare" (Stare: Dezactivat)
Acțiune
Buton: Obține cotație RCA

Titlu și Progres
Titlu: Asigurare RCA în 3 pași simpli

Subtitlu: Procesul durează doar 2-3 minute

Etape: Autovehicul (Etapa curentă), Proprietar, Oferte

Detalii autovehicul
Stare vehicul (Opțiuni):

Autovehicul înmatriculat (Selectat)

În vederea înmatriculării

Notă informativă: „Vom completa automat datele mașinii pe baza seriei de șasiu (VIN).”

Câmpuri Formular
Număr înmatriculare*: BV18BFG
Serie Șasiu (VIN)*: (Necompletat)
Marcă*: (Listă derulantă - Necompletat)
Model*: (Necompletat)
Categorie*: (Listă derulantă - Necompletat)
Subcategorie*: (Listă derulantă - Necompletat)
Mod utilizare*: (Listă derulantă - Necompletat)
Combustibil*: (Listă derulantă - Necompletat)
An fabricație*: (Necompletat)
Masă maximă*: (Necompletat)
Capacitate cilindrică*: (Necompletat)
Putere (kW)*: (Necompletat)
Număr locuri*: (Necompletat)
Prima înmatriculare (DD/MM/AAAA)*: (Necompletat)
Serie CIV: (Exemplu: R000000 - Necompletat)
Kilometraj: (Necompletat)
Declarații și Acțiune
Casetă bifare 1: „Declar că datele introduse despre acest vehicul sunt reale și corespund documentelor acestuia.” (Nebifată)
Casetă bifare 2: „Confirm că sunt proprietarul vehiculului sau că am acordul proprietarului pentru emiterea ofertelor/polițelor.” (Nebifată)
Buton: Pasul următor

Titlu și Progres
Titlu: Asigurare RCA în 3 pași simpli

Subtitlu: Procesul durează doar 2-3 minute

Etape: Autovehicul (finalizat), Proprietar (Etapa curentă), Oferte

Iată extragerea completă a textului și a datelor din această imagine, care prezintă etapa „Detalii autovehicul” pentru un vehicul în vederea înmatriculării:

Titlu și Progres
Titlu: Asigurare RCA în 3 pași simpli
Subtitlu: Procesul durează doar 2-3 minute
Etape: Autovehicul (Etapa curentă), Proprietar, Oferte
Detalii autovehicul
Stare vehicul: Autovehicul înmatriculat | În vederea înmatriculării (Selectat)
Întrebare: Vehicul achiziționat de nou sau adus din străinătate?
Opțiuni: Nu (Selectat), Da
Notă: „Vom completa automat datele mașinii pe baza seriei de șasiu (VIN).”
Date Vehicul (Completate)
Număr înmatriculare: În vederea înmatriculării (Blocat)
Serie Șasiu (VIN)*: WDB9066131S155032
Marcă*: MERCEDES-BENZ
Model*: SPRINTER 209 CDI
Categorie*: Autoutilitare și camioane [N]
Subcategorie*: Autoutilitare [N1] (=<3.5t)
Mod utilizare*: Privat / Personal
Combustibil*: Motorina
An fabricație*: 2007
Masă maximă*: 2800
Capacitate cilindrică*: 2148
Putere (kW)*: 65
Număr locuri*: 2
Prima înmatriculare (DD/MM/AAAA)*: 02/02/2007
Serie CIV: (Necompletat)
Kilometraj: (Necompletat)
Declarații și Acțiune
Casetă bifare 1: „Declar că datele introduse sunt reale și corecte.” (Nebifată)
Casetă bifare 2: „Confirm că sunt proprietarul vehiculului sau că am acordul proprietarului pentru emiterea ofertelor/polițelor.” (Nebifată)
Casetă bifare 3: „Declar că dețin vehiculul identificat prin datele de mai sus și că am documentele care atestă proprietatea (contract de vânzare-cumpărare vizat fiscal, factura sau alte acte ale vehiculului).” (Nebifată)

Buton: Pasul următor

##Detalii proprietar
Tip persoană: Persoană fizică (Selectat), Persoană juridică

Câmpuri de contact și identificare:
Email*: (Necompletat)
Telefon*: (Necompletat)
Nume*: (Necompletat)
Prenume*: (Necompletat)
CNP*: (Necompletat)
Serie CI*: (Necompletat)
Număr CI*: (Necompletat)

Adresă
Județ*: (Listă derulantă - Necompletat)
Localitate*: (Listă derulantă - Necompletat)
Tip stradă*: (Listă derulantă - Necompletat)
Stradă*: (Necompletat)
Număr*: (Necompletat)
Bloc: (Necompletat)
Scară: (Necompletat)
Etaj: (Listă derulantă - Necompletat)
Apartament: (Necompletat)
Cod poștal*: (Necompletat)
Consimțământ și Confirmare
Casetă bifare 1: „Am citit și sunt de acord cu prelucrarea datelor cu caracter personal și cu termenii și condițiile de utilizare ale site-ului.” (Nebifată)
Casetă bifare 2: „Confirm că datele proprietarului și adresa sunt corecte.” (Nebifată)

Acțiuni
Buton principal: Pasul următor
Buton secundar: Înapoi

##Persoana juridica
Titlu și Progres
Titlu: Asigurare RCA în 3 pași simpli
Subtitlu: Procesul durează doar 2-3 minute
Etape: Autovehicul (finalizat), Proprietar (Etapa curentă), Oferte

Detalii proprietar (Persoană juridică)
Tip persoană: Persoană fizică, Persoană juridică (Selectat)

Secțiunea: Companie
Email companie*: (Necompletat)
Telefon*: (Necompletat)
CUI*: (Necompletat)
Nr înregistrare: (Necompletat)
Cod CAEN*: (Necompletat)
Tip societate*: (Listă derulantă - Necompletat)
Nume companie*: (Necompletat)

Secțiunea: Reprezentant
Nume*: (Necompletat)
Prenume*: (Necompletat)
Calitate*: (Listă derulantă - Necompletat)
Secțiunea: Detalii șofer
Casetă bifare: Același cu administratorul (Nebifată)
Nume*: (Necompletat)
Prenume*: (Necompletat)
CNP*: (Necompletat)
Serie CI*: (Necompletat)
Număr CI*: (Necompletat)

Secțiunea: Adresa
Județ sediu*: (Listă derulantă - Necompletat)
Localitate sediu*: (Listă derulantă - Necompletat)
Tip stradă*: (Listă derulantă - Necompletat)
Stradă*: (Necompletat)
Număr*: (Necompletat)
Bloc: (Necompletat)
Scară: (Necompletat)
Etaj: (Listă derulantă - Necompletat)
Apartament: (Necompletat)
Cod poștal*: (Necompletat)
Consimțământ și Acțiuni
Casetă bifare 1: „Am citit și sunt de acord cu prelucrarea datelor cu caracter personal și cu termenii și condițiile de utilizare ale site-ului.” (Nebifată)
Casetă bifare 2: „Confirm că datele companiei, reprezentantului, șoferului și adresa sunt corecte.” (Nebifată)

Buton principal: Pasul următor
Buton secundar: Înapoi


Iată extragerea detaliată a tuturor câmpurilor și informațiilor din această imagine, care reprezintă pasul final înainte de afișarea ofertelor:
Titlu și Progres
Titlu: Asigurare RCA în 3 pași simpli
Subtitlu: Procesul durează doar 2-3 minute
Etape: Autovehicul (finalizat), Proprietar (finalizat), Oferte (Etapa curentă)
Configurare Data Începerii
Secțiune: DATA ÎNCEPERII RCA
Regulă: Maxim 60 de zile de la data curentă
Câmp dată: 28.04.2026
Confirmare: „Începând cu data de: Marți, 28 Aprilie 2026. Intră în vigoare de la ora 00:00”
Rezumat Ofertă
Autovehicul: BV18BFG
Proprietar: Blajiu Filip
Data de început: Marți, 28 Aprilie 2026
Selecție Durată Poliță
Opțiuni disponibile:
1 lună
3 luni
6 luni
12 luni (Selectat)
Acțiune Finală
Buton: Vezi ofertele

Iată extragerea completă a ofertelor disponibile din imaginea furnizată:

Titlu
OFERTE DISPONIBILE

Tabel Oferte Active
Asigurător	Preț standard (RON)	Preț decontare directă (RON)	Acțiuni
eazy.insure	1.383,79 (Selectat)	1.525,13	Info
GENERALI	1.496,00 (Selectat)	1.746,00	Info
Asirom	1.782,26 (Selectat)	2.022,26	Info
GRAWE	2.281,76 (Selectat)	2.380,76	Info
Groupama	2.671,40 (Selectat)	2.923,50	Info
OMNIASIG	3.499,28 (Selectat)	3.919,28	Info
HELLAS DIRECT	5.147,79 (Selectat)	5.352,15	Info
Oferte Indisponibile
Asigurător	Preț standard	Preț decontare directă	Status
axeria	0,00 RON	Fără ofertă	Află de ce...
Allianz Tiriac	0,00 RON	Fără ofertă	Află de ce...
Detalii suplimentare
Toate ofertele active prezintă două opțiuni de tarifare: Preț standard (cel selectat implicit în imagine) și Preț cu decontare directă.

Butoanele verzi indică posibilitatea de a finaliza achiziția (Alege oferta), în timp ce butoanele roșii de la final solicită consultarea motivelor pentru care oferta nu a putut fi generată.

Iată extragerea completă a textului și a datelor din imaginea ce reprezintă Rezumatul ofertei:

Titlu
Rezumat ofertă
Detalii Identificare
Asigurat: Blajiu Filip
Autovehicul: BV18BFG
E-mail: filipblajiu@gmail.com
Detalii Poliță
Asigurator: Eazy_Insure
Produs / Perioadă: RCA / 12 Luni
Începând cu: Marți, 28 Aprilie 2026
Decontare directă: NU
Clasa bonus-malus: B6
Țări excluse carte verde: AZ | BY | IR | RUS | UA
Detalii Financiare
Prima netă: 1.314,60 RON
Comision broker: 5,00% (69,19 RON)
Cod ofertă: 21408046
Total de plată: 1.383,79 RON
Documente și Confirmări
Buton: [📄] Consultați documentele (Meniu derulant)
Casetă bifată: [✓] Confirm că am primit și am citit documentele produsului și sunt de acord cu emiterea poliței de asigurare RCA.
Acțiuni
Buton principal: Continuă
Buton secundar: Înapoi


Iată extragerea detaliată a textului și a câmpurilor din această pagină de plată (NETOPIA Payments):
1. Platformă și Comerciant
Procesator de plată: NETOPIA PAYMENTS
Comerciant: DEXASIG BROKER DE ASIGURARE SRL
Site web: www.insurex.ro
Tip serviciu: Asig. RCA(EAZY ASIGURARI S.A.) #21408045
2. Sumă de Plată
SUMA: 1383.79 RON
3. Metode de Plată Instant
Buton G Pay: Afișează un card Mastercard cu ultimele cifre 9820.
Buton Apple Pay: Opțiune de plată rapidă.
4. Secțiunea Click to Pay (Verificare)
Identificare: +40******763 (Opțiune: Nu ești tu?)
Mesaj: „Click to Pay a găsit cardurile tale. Completează codul Mastercard trimis către +40******763 pentru a confirma că tu încerci să te conectezi.”
Câmpuri de introducere: 6 căsuțe pentru codul de verificare.
Opțiuni retrimitere cod: Mobil | Email.
Casetă bifare: „Salvează-mi datele în acest browser” (Nebifată).
Buton: CONTINUĂ (Inactiv/Bleu deschis).
5. Opțiune Manuală
Link: Completează manual datele cardului.
6. Secțiunea mobilPay Wallet (Dreapta)
Titlu: PLĂTEȘTE MAI UȘOR
Instrucțiune: „Scanează cu aplicația mobilPay Wallet și plătești instant!”
Element central: Cod QR pentru scanare.
Magazine aplicații: Pictograme pentru Apple App Store, Google Play și Huawei AppGallery.
7. Note legale și Subsol
Logouri siguranță: Mastercard, VISA, PCI DSS.
Text legal: „Prin introducerea datelor solicitate în această pagină și continuarea plății, sunteți de acord cu Termenii și condițiile NETOPIA Payments. În Nota de informare GDPR veți regăsi toate informațiile despre modalitatea în care sunt prelucrate datele personale.”
Copyright: © 2007 - 2026 NETOPIA Payments.

#EXEMPLU easy.insure

Iată extragerea detaliată a textului și elementelor din această imagine de introducere:
Titlu și Introducere
Titlu: RCA online în 3 minute
Subtitlu: documente necesare și informații:
talonul mașinii
cartea de identitate
plata se face doar cu cardul
Consimțământ și Opțiuni
Casetă bifare 1: "Sunt de acord cu Termenii și Condițiile precum și declar că am citit și înțeles Nota de informare privind prelucrarea datelor cu caracter personal" (Nebifată)
Casetă bifare 2: "Vreau să văd și oferta de preț eazy CASCO Start (dacă mă calific)." (Nebifată)
Acțiuni și Linkuri
Buton principal: începe acum → (Inactiv în imagine)
Secțiune BAAR: Emitere RCA Risc Ridicat [→]
Secțiune Suport: "dacă ai nevoie de consultanță pentru încheierea contractului RCA, scrie-ne la rca@eazyinsure.ro"

Iată extragerea detaliată a tuturor câmpurilor și textelor din această imagine, care indică o eroare la scanarea documentului:
Meniu Pași (Navigare Stânga)
Pasul 1 — curent: date vehicul
Pasul 2: date proprietar
Pasul 3: confirmare
Pasul 4: tarife și emitere
Pasul 5: date contact
Secțiunea: Informații despre autovehicul
Buton: ← înapoi
Titlu: informații despre autovehicul
Întrebare: autovehiculul este: *
Opțiuni:
înmatriculat (Selectat)
în curs de (re)înmatriculare
Mesaj de Eroare (Scanare)
Status: „talonul auto nu a putut fi scanat, încearcă din nou”
Notă de subsol: „asigură-te că fotografia este clară și toate elementele din document sunt ușor de citit”
Buton de acțiune: [📷] încarcă altă fotografie

#EXEMPLU PRETUL MEU
Modal la incarcare pagina cu consimtamant date caracter personal
Iată extragerea completă a textului și a informațiilor din documentul „Informare Privind Prelucrarea Datelor Cu Caracter Personal”:
Titlu Document
Informare Privind Prelucrarea Datelor Cu Caracter Personal
1. Introducere și Baza Legală
Formularul este întocmit în baza Regulamentului UE 2016/679 (GDPR).
Scop: Informarea utilizatorului cu privire la scopurile, temeiul juridic, durata prelucrării și drepturile legate de datele personale.
2. Identitatea Operatorului
Operator: Safety Broker de Asigurare SA („Societatea”).
Sediu social: București, Calea Giulești, Nr. 8D, et. 2, Sect. 6.
Contact: * Telefon: 021.745.62.70
E-mail: office@safetybroker.ro
Date înregistrare: ONRC J40/6184/2005, CUI 17437817, cod RBK 293/2005.
Calitate: Operator asociat împreună cu Societățile de Asigurare partenere.
Informații suplimentare: www.safetybroker.ro/operatori-asociati.
3. Categorii de date prelucrate
Date de identificare: Nume, Prenume, Adresă, CNP, Cetățenie, număr de telefon, e-mail, starea civilă, seria și numărul actului de identitate/pașaportului/permisului, semnătura (olografă sau electronică), date biometrice.
Date privind obiectul asigurării: Informații despre bunuri sau persoane, istoricul de daune, funcția/ocupația, hobby-uri, documente de proprietate.
Date financiare: Cont bancar, venituri, facilități fiscale, obligații fiscale.
Date privind sănătatea: Starea de sănătate fizică și psihică, afecțiuni medicale din chestionare, analize medicale, date de la furnizori medicali pentru decontări sau daune.
Informații digitale și audio-video: Locație, imagini de la camere de supraveghere (în sedii), înregistrări audio (call-center), adresa IP.
4. Scopurile prelucrării
(i) Scop ofertare/emitere contract asigurări: cotații, managementul riscului, emitere polițe.
(ii) Scop administrare polițe, asistență daune și consultanță: informări scadențe, reînnoiri, instrumentare daune, recuperare creanțe.
(iii) Scop Comunicări Comerciale: promoții, produse și servicii oferite de Societate.
(iv) Securitate: supraveghere audio-video pentru măsuri de securitate.
(v) Obligații legale: îndeplinirea cerințelor ASF sau ale altor autorități.
5. Declarație și Confirmare
Text declarație: „Prin continuare declar că am fost informat și sunt de acord cu prelucrarea datelor cu caracter personal și cu prevederile acordului de precontractual.”
Buton de acțiune: Continuă și acceptă »


Iată extragerea completă a textului și a câmpurilor din această variantă a paginii de start:
Navigare Pași (Sus)
Instrucțiune: Apăsați pe unul dintre butoanele de mai jos pentru a vă întoarce la un pas anterior și modifica datele.
1. Date înmatriculare (Activ - Roz)
2. Date vehicul
3. Date tehnice
4. Date proprietar
5. Date poliță
6. Oferte
Secțiunea: Ce opțiune trebuie să aleg?
Definiții:
Înmatriculat - vehiculul este înmatriculat în România iar eu sunt proprietarul curent, trecut în talonul mașinii;
În vederea înmatriculării - când cumperi un autovehicul nou sau rulat pentru a-l înmatricula;
Înregistrat - vehicul special care nu necesită înmatriculare la poliție, doar la autoritățile locale.
Selecție tip vehicul:
Vehicul înmatriculat (Selectat)
În vederea înmatriculării/transcrierii
Vehicul înregistrat la Primărie
Secțiune Laterală (Banner)
Titlu: Nou! Plata RCA în rate prin TBI Bank
Mesaj: Puteți selecta plata în rate la ultimul pas de la finalizarea comenzii.
Automatizare (Căsuța albastră)
Text: Putem completa automat datele autovehiculului și proprietarului. Pentru aceasta, avem nevoie de poze ale cărții de identitate a proprietarului și ale certificatului de înmatriculare al vehiculului.
Buton: Încarcă talon și buletin
Câmpuri Formular
Număr înmatriculare *: (Placeholder: EX TM12ABC *)
Serie șasiu (E) *: (Placeholder: EX WABCD123456E78901 *)

Am identificat vehiculul pe baza seriei de șasiu introduse și am completat datele automat. Puteți revizui și actualiza aceste informații în pașii următori.
Marca: MERCEDES-BENZ
Model: Sprinter 209 Cdi

Acorduri
Bifă 1 (Selectat): Am luat la cunoștință despre Informarea Precontractuală *
Bifă 2 (Selectat): Am citit și sunt de acord ca datele mele personale să fie prelucrate în scopul ofertării conform politicii privind prelucrarea datelor cu caracter personal și accept Termenii și condițiile Safety Broker. *
Bifă 3 (Neselectat): Declar că optez pentru renunțarea la acordarea consultanței, conform prevederilor legale aplicabile comercializării electronice a produselor de asigurare. *
Acțiune
Pentru a continua trebuie să fiți de acord cu renunțarea la acordarea de consultanță.

Ca urmare a opțiunii tale de renunțare la consultanță, te informăm că nu vom evalua în ce măsură contractul de asigurare, pe care urmează să-l închei, corespunde cerințelor și necesităților tale. Te rugăm să completezi cu atenție datele și informațiile ce îți vor fi solicitate în vederea încheierii asigurării dorite.

Buton: Pasul următor

Iată extragerea centralizată a informațiilor din cele trei imagini. Am păstrat secțiunile comune și am detaliat diferențele specifice fiecărei sub-opțiuni selectate.
1. Secțiuni Comune (Identice în toate cele 3 imagini)
Navigare Pași (Sus):
1. Date înmatriculare (Activ - Roz)
2. Date vehicul, 3. Date tehnice, 4. Date proprietar, 5. Date poliță, 6. Oferte.
Secțiunea: Ce opțiune trebuie să aleg?
Toate cele trei imagini au selectată opțiunea principală: În vederea înmatriculării/transcrierii.
Banner lateral: Promoție pentru plata în rate prin TBI Bank.
Notă Informativă (Căsuța Galbenă):
"Polița se emite fără număr de înmatriculare, doar în baza seriei VIN. După înmatricularea vehiculului, ne puteți contacta pentru a ne transmite numărul de înmatriculare."
Câmpuri de Input și Încărcare:
Documente justificative (selecție multiplă) *: Buton "Choose files" (Formate acceptate: JPG, PNG, BMP, PDF, DOC, DOCX. Max 5Mb).
Serie șasiu (E) *: Câmp pentru introducerea codului VIN.
Acorduri (Final de pagină):
Bifă 1: Luat la cunoștință Informarea Precontractuală.
Bifă 2: Acord prelucrare date și Termeni și Condiții Safety Broker.
Bifă 3 (Opțională): Renunțare la consultanță.
Buton: Pasul următor.
2. Diferențe specifice (în funcție de tipul de înmatriculare)
Fiecare imagine prezintă o listă diferită de documente pe care utilizatorul declară pe proprie răspundere că le deține:
A. Mașină second hand cumpărată din România (Imaginea 1 - f36853)
Documente declarate:
Documentul de dobândire a proprietății asupra vehiculului de către asigurat;
Contract de vânzare/cumpărare, factură, etc. cu viza agenției fiscale care atestă luarea în evidență fiscală pe numele noului proprietar.
B. Mașină second hand sau nouă cumpărată din străinătate (Imaginea 2 - f36834)
Documente declarate:
Contract de vânzare/cumpărare sau factură;
Dovadă programare la DRPCIV pentru obținere autorizație numere provizorii;
Buletinul sau cartea de identitate a persoanei pe numele căreia se încheie polița.
C. Mașină nouă cumpărată de la dealer din România (Imaginea 3 - f36817)
Documente declarate:
CIV (cartea de identitate a vehiculului);
Factură (proformă) de la dealer;
Dovada înregistrării fiscale a vehiculului în România;
Buletinul sau cartea de identitate a persoanei pe numele căreia se încheie polița.


Iată extragerea completă a textului și a câmpurilor din această variantă a paginii, unde este selectată opțiunea pentru vehicule înregistrate local:
Navigare Pași (Sus)
1. Date înmatriculare (Pas curent - Roz)
2. Date vehicul, 3. Date tehnice, 4. Date proprietar, 5. Date poliță, 6. Oferte (Pași următori).
Secțiunea: Ce opțiune trebuie să aleg?
Definiții:
Înmatriculat - vehiculul este înmatriculat în România iar eu sunt proprietarul curent, trecut în talonul mașinii;
În vederea înmatriculării - când cumperi un autovehicul nou sau rulat pentru a-l înmatricula;
Înregistrat - vehicul special care nu necesită înmatriculare la poliție, doar la autoritățile locale.
Selecție tip vehicul:
Vehicul înmatriculat (Neselectat)
În vederea înmatriculării/transcrierii (Neselectat)
Vehicul înregistrat la Primărie (Selectat - marcat cu albastru)
Secțiune Laterală (Banner)
Titlu: Nou! Plata RCA în rate prin TBI Bank
Mesaj: Puteți selecta plata în rate la ultimul pas de la finalizarea comenzii.
Câmpuri Formular
Număr înmatriculare *: (Placeholder: EX TM12ABC *)
Serie șasiu (E) *: (Placeholder: EX WABCD123456E78901 *)
Acorduri
Bifă 1 (Selectat): Am luat la cunoștință despre Informarea Precontractuală *
Bifă 2 (Selectat): Am citit și sunt de acord ca datele mele personale să fie prelucrate în scopul ofertării conform politicii privind prelucrarea datelor cu caracter personal și accept Termenii și condițiile Safety Broker. *
Bifă 3 (Neselectat): Declar că optez pentru renunțarea la acordarea consultanței, conform prevederilor legale aplicabile comercializării electronice a produselor de asigurare. *
Acțiune
Buton: Pasul următor (Roz)


Iată extragerea completă a textului și a câmpurilor din imaginea aferentă pasului 2, integrând și opțiunile din codul HTML furnizat:
Navigare Pași (Sus)
1. Date înmatriculare (Finalizat)
2. Date vehicul (Pas curent - Roz)
3. Date tehnice
4. Date proprietar
5. Date poliță
6. Oferte
Date Vehicul
Tip vehicul (J) *: Autoutilitară ușoară (N1) (Listă derulantă)
Marca (D.1) *: MERCEDES-BENZ (Listă derulantă)
Model (rubrica D.3) *: sprinter 209 cdi (Câmp text)
Utilizare *: selectați tipul de utilizare... (Listă derulantă)
Opțiuni disponibile (conform HTML):
Taxi
Rent-a-Car
Școală de șoferi
Firmă distribuție
Firmă de securitate și protecție
Privat / Personal
Curierat
Transport național persoane
Transport marfă
Transport internațional marfă
Transport internațional persoane
Data expirare ITP *: Zi / Lună / An (Liste derulante + Pictogramă Calendar)
Notă: „Opțional pentru obținerea cotației de la Generali”
Opțiuni suplimentare și Acțiuni
Casetă bifare: „Voi călători cu mașina în state non-UE (nu influențează prețul).” (Nebifată)
Buton secundar: Pasul anterior
Buton principal: Pasul următor (Roz)


Iată extragerea completă a textului și a câmpurilor din imaginea aferentă pasului 3 (Date tehnice):
Navigare Pași (Sus)
1. Date înmatriculare (Finalizat)
2. Date vehicul (Finalizat)
3. Date tehnice (Pas curent - Roz)
4. Date proprietar
5. Date poliță
6. Oferte
Date Tehnice Vehicul
An fabricație *: 2007
Data primei înmatriculări (B) *: 2 / Februarie / 2007 (Liste derulante + Pictogramă Calendar)
Tip combustibil (P.3) *: Diesel (Listă derulantă)
Capacitate cilindrică (P1) *: 2148
Putere (KW) (P2) *: 65
Masa maximă (F1) *: 2800
Număr locuri (S1) *: 2
Număr kilometri: 190000
Notă: „Opțional pentru obținerea cotației de la Grawe. Nu influențează prețul.”
Serie CIV și Identificare
Seria CIV (X sau Y în talon) *: (Câmp necompletat - Placeholder: EX X123456 *)
Notă informativă: „În taloanele noi este posibil să nu mai apară seria CIV. O găsești în cartea de identitate a vehiculului.”
Casetă bifare: „Nu am sau nu știu seria CIV a vehiculului” (Nebifată)
Acțiuni
Buton secundar: Pasul anterior
Buton principal: Pasul următor (Roz)

Iată extragerea completă a textului și a câmpurilor din imaginea aferentă pasului 4 (Date proprietar):
Navigare Pași (Sus)
1. Date înmatriculare (Finalizat)
2. Date vehicul (Finalizat)
3. Date tehnice (Finalizat)
4. Date proprietar (Pas curent - Roz)
5. Date poliță
6. Oferte
Date proprietar/utilizator
Vehiculul este în leasing? Nu (Selectat), Da
Tip proprietar *: Persoana fizica (Selectat), Persoana juridica
Casetă bifare: „Declar pe propria raspundere ca sunt persoana fizică și am în proprietate acest autovehicul sau am drept legal de utilizare pentru acest autovehicul. *” (Nebifată)
Nume *: (Placeholder: ex Popescu)
Prenume *: (Placeholder: ex Ion)
Email: (Placeholder: ex Popescu)
Telefon: (Placeholder: ex 0721123123)
Serie CI *: (Placeholder: EX B)
Număr CI *: (Placeholder: ex 123456)
CNP *: (Placeholder: ex 1201001224466)
Anul obținerii permisului *: (Placeholder: ex 2000)
Casetă bifare: Fară permis (Bifată)
Adresă domiciliu proprietar
Județ *: Brasov (Selectat)
Localitate *: localitate... (Listă derulantă)
Strada *: (Necompletat)
Nr. *: (Necompletat)
Bloc: (Necompletat)
Scara: (Necompletat)
Etaj: P
Ap.: (Necompletat)
Cod poștal *: (Necompletat)
Link: Caută codul poștal
Șoferi adiționali
Text informativ: Pentru șofer diferit de proprietar sau mai mulți șoferi.
Atenționare: „Atenție! Adăugarea de șoferi suplimentari poate cauza modificarea prețului poliței.”
Informații legale:
Legislația nu limitează valabilitatea poliței dacă o altă persoană conduce autoturismul.
În caz de daună, asiguratorul poate recalcula prima dacă a condus altă persoană.
Mențiune Legea 132/2017 (Legea RCA) privind furnizarea datelor reale.
Mențiune colectare date de către BAAR pentru calculul clasei bonus/malus.
Posibilitatea adăugării de noi conducători ulterior prin e-mail la suport@pretulmeu.ro.
Buton: + Adaugă șofer
Acțiuni
Buton secundar: Pasul anterior
Buton principal: Pasul următor (Roz)

Iată extragerea completă a textului și a câmpurilor din imaginea aferentă pasului 5 (Date poliță):
Navigare Pași (Sus)
1. Date înmatriculare, 2. Date vehicul, 3. Date tehnice, 4. Date proprietar (Toate finalizate).
5. Date poliță (Pas curent - Roz).
6. Oferte (Pasul final).
Date poliță
Data început poliță (B) *: 21 / Iunie / 2026 (Liste derulante + Pictogramă Calendar).
Informații: „Maxim 60 de zile în avans.”
Link: Setează pe mâine.
Caseta ATENȚIE!:
„Data de început a noii polițe se trece din ziua următoare a datei de expirare de pe polița curentă.”
„Suprapunerea datei cu o poliță valabilă existentă sau lipsa de continuitate cu data de expirare a poliței curente nu e acceptată de unele companii de asigurări.”
Link: Puteți consulta data valabilității poliței aici.
Durata *
Opțiuni:
1 lună (Neselectat)
6 luni (Neselectat)
12 luni (Selectat - marcat cu albastru)
Notă: „Pentru oferte pe alte perioade decât cele menționate mai sus, vă rugăm să ne contactați telefonic, Whatsapp sau email.”
Date utilizator/contact
Text informativ: „Conform legislației în vigoare (art. 44 și 45 din Norma 22/2021), este obligatoriu să vă confirmați identitatea prin verificarea accesului la adresa de email înainte de obținerea ofertelor.”
Casetă bifare: „Am deja un cont creat pe PrețulMeu.ro” (Nebifată).
Email *: filipblajiu@gmail.com
„(asigură-te că e corect, ofertele le vei primi pe mail)”
Număr telefon *: +40727012763
„(asigură-te că e corect, posibil să primești un cod de confirmare)”
Casetă bifare: „Doresc să setez o parolă” (Nebifată).
Acord (Obligatoriu): [✓] „Am citit și sunt de acord cu termenii și condițiile de utilizare ale PrețulMeu.ro. *” (Bifată).
Acțiuni
Buton principal: Verificare identitate & Afișare oferte (Roz).
Buton secundar: Pasul anterior.

Iată extragerea completă a textului și a ofertelor din ultima imagine, care reprezintă pasul final (Oferte) din procesul de pe PrețulMeu.ro:
Navigare Pași (Sus)
1 - 5 (Date înmatriculare -> Date poliță): Pași finalizați (marcat cu negru).
6. Oferte: Pas curent (marcat cu roz).
Contact și Suport
WhatsApp: Chat on WhatsApp
Telefon: +40 771 062 669
Email: suport@pretulmeu.ro
Ofertele tale RCA
Instrucțiune: Pentru a selecta oferta și trece la plată, apăsați pe butonul cu preț. Pentru decontare directă, bifați căsuța corespunzătoare sub preț.
Tabel de Oferte Active (Durată 12 luni)
Asigurator,Preț Standard,Opțiune Decontare Directă,Info
eazy.insure,1383.79 lei,+141.34 lei,Clasa B6
Asirom,1782.26 lei,+240 lei,Clasa B6
Allianz Tiriac,2182 lei,+168 lei,Clasa B6
GRAWE,2281.76 lei,+99 lei,Clasa B6
OMNIASIG,3499.28 lei,+420 lei,Clasa B6
HELLAS DIRECT,5147.79 lei,+204.36 lei,Clasa B6
Oferte Indisponibile (detalii la click)
Anytime
Generali
Groupama
Axeria Iard
Informații Risc Ridicat (BAAR)
Tarif de referință: 1152.2 RON.
Notificare: "Conform metodei de evaluare BAAR, vă încadrați la categoria 'asiguraților cu risc ridicat'. Astfel, puteți solicita la BAAR alocarea unui asigurator RCA."
Link: Click pentru detalii și instrucțiuni
Secțiunea: Re-generare oferte
Data început poliță: 21 / Iunie / 2026.
Durată selectată: 12 luni.
Notă ITP/Valabilitate: Atenționare privind continuitatea poliței și evitarea suprapunerii.
Acțiuni (Subsol)
Actualizați ofertele (Roz)
Pasul anterior
Cerere nouă
Banner Lateral
TBI Bank: "Nou! Plata RCA în rate prin TBI Bank. Puteți selecta plata în rate la ultimul pas."

#EXEMPLU ASIG365
La incarcare pagina apare modal Informare Privind Prelucrarea Datelor Cu Caracter Personal cu buton Continua si accepta

Pe baza imaginii furnizate, iată o extragere structurată a elementelor interfeței de utilizator (UI). Formularul pare a fi primul pas dintr-un proces de asigurare auto (RCA) în România.
Structura Formularului: Pasul 1 - Proprietar
1. Indicator de Progres (Stepper)
Formularul este împărțit în 5 etape:
1. Proprietar (Activ)
Vehicul
Valabilitate poliță
Asigurători
Oferte
2. Opțiuni Generale
Checkbox: Vehiculul este parte a unui contract de leasing în derulare.
Tip persoană (Radio): Persoană fizică (selectat) / Persoană juridică.
Căutare: Câmp pentru căutarea unei persoane salvate după CNP sau nume.
3. Datele Proprietarului
Câmpuri de text pentru informații personale:
CNP (Cod Numeric Personal)
Nume
Prenume
Numărul de telefon
Adresa de email
Data obținerii permisului auto (Format: DD/MM/YYYY)
Declarație pe propria răspundere: Un checkbox prin care utilizatorul confirmă calitatea de proprietar sau dreptul legal de utilizare.
4. Act de Identitate
Tip act identitate: Dropdown (setat pe "Carte de Identitate").
Serie: Câmp text.
Număr: Câmp text.
Data expirării: Selector de dată (DD/MM/YYYY).
5. Adresă
Sectiune pentru domiciliul proprietarului:
Țara: Dropdown (setat pe "Romania").
Județ: Dropdown.
Localitate: Dropdown.
Stradă: Câmp text/căutare.
Număr Stradă: Câmp text.
Cod Poștal: Câmp text.
6. Setări Suplimentare și Navigare
Checkbox: "Șoferul principal este diferit de proprietar" (opțiune pentru a adăuga datele unui alt conducător auto).
Butoane de acțiune:
Precedentul (Dezactivat/Gri)
Următorul (Activ/Albastru)
Pictogramă Coș de gunoi: În colțul din dreapta sus pentru ștergerea datelor introduse.

Se pare că am trecut la profilul de Persoană juridică. Față de imaginea anterioară, câmpurile s-au adaptat pentru a colecta date fiscale și informații despre reprezentantul legal.
Iată extragerea datelor din această nouă variantă a interfeței:
Structura Formularului: Proprietar (Persoană Juridică)
1. Selecție Tip Entitate
Tip persoană: Selectat Persoană juridică.
Checkbox Leasing: Rămâne neschimbat la începutul formularului.
2. Datele Proprietarului (Companie)
Câmpurile sunt acum specifice pentru firme:
CUI: (Cod Unic de Înregistrare) - Câmp gol.
Numele companiei: Completat cu Lazuli Technologies S.R.L.
Tipul companiei: Dropdown (necompletat).
Numărul de înregistrare: Completat cu J063242022.
Codul CAEN: Selectat 7311.
Numărul de telefon: Câmp gol.
Adresa de email: Câmp gol.
3. Adresă Sediu Social
Țara: Romania.
Județ & Localitate: Dropdown-uri de selecție.
Stradă & Număr: Câmpuri de text.
Cod Poștal: Completat cu 420179.
4. Datele Șoferului / Reprezentantului
Această secțiune a apărut pentru a identifica persoana fizică ce reprezintă firma sau care conduce vehiculul:
Nume & Prenume: Câmpuri de text.
Telefon: Câmp de text.
CNP: Câmp de text.
Tip act identitate: Dropdown (setat implicit pe "Carte de identitate").
Serie & Număr: > Notă tehnică: Aceste câmpuri afișează erori de localizare (placeholder-e de tip programare): forms.rca_policy.placeholders.enter_serial și ...enter_number.
5. Validări și Navigare
Declarație pe propria răspundere: Text adaptat pentru "reprezentant legal / împuternicit".
Checkbox Șofer Diferit: Rămâne la finalul listei de date.
Butoane: Precedentul (inactiv) și Următorul (activ).

Această a treia imagine prezintă secțiunea adițională care se activează atunci când bifezi opțiunea „Șoferul principal este diferit de proprietar”. Aceasta este esențială pentru calculul corect al riscului în polițele RCA, deoarece istoricul de daune (Bonus-Malus) și experiența șoferului influențează prețul final.
Iată extragerea datelor pentru această secțiune:
Secțiune: Datele șoferului principal
1. Starea Selectorului
Checkbox: Bifat (activ).
Text informativ: „Selectați această opțiune dacă șoferul principal al vehiculului este diferit de proprietar.”
2. Informații de Identificare
Toate câmpurile de mai jos sunt goale (placeholdere active):
Nume *
Prenume *
Telefon (Opțional, conform lipsei asteriscului)
CNP * (Cod Numeric Personal)
3. Documente și Istoric Conducere
Dată obținere permis auto: Selector de dată (Format: dd.mm.yyyy).
Tip act identitate *: Dropdown (setat implicit pe „Carte de Identitate”).
Serie *: Câmp text pentru seria buletinului.
Număr *: Câmp text pentru numărul buletinului.
Dată expirare: Selector de dată (Format: dd.mm.yyyy) pentru validitatea actului de identitate.
4. Navigare
Precedentul: Buton inactiv (gri).
Următorul: Buton activ (albastru), gata pentru trecerea la pasul următor (Vehicul).
Observație tehnică:
Spre deosebire de imaginea anterioară (cea pentru Persoană Juridică), aici placeholderele pentru Serie și Număr sunt corect localizate în limba română („Introduceți seria...”, „Introduceți numărul...”), indicând faptul că erorile de tip text-string observate anterior au fost rezolvate sau nu apar în acest context de „Șofer principal”.


Această imagine prezintă starea activă a secțiunii de leasing, care apare atunci când utilizatorul bifează opțiunea de la începutul formularului. În contextul unei polițe RCA, acest lucru indică faptul că proprietarul din acte este compania de leasing, iar utilizatorul (persoana fizică sau juridică) este utilizatorul vehiculului.
Iată extragerea elementelor UI din acest fragment:
Secțiune: Detalii Leasing
Checkbox: Bifat (Activ).
Etichetă principală: „Vehiculul este parte a unui contract de leasing în derulare”.
Sub-text informativ: „Selectați această opțiune dacă vehiculul este achiziționat printr-un contract de leasing.”
Câmp nou apărut (Obligatoriu):
Etichetă: „Companie de leasing *” (Asteriscul indică un câmp obligatoriu).
Tip control: Dropdown / Câmp de căutare (Searchable select).
Placeholder: „Căutați și selectați compania de leasing...”.
Logică de interfață
Apariția acestui câmp este un exemplu de logică condițională:
Implicit: Câmpul „Companie de leasing” este ascuns.
Trigger: Bifarea checkbox-ului de leasing.
Rezultat: Câmpul devine vizibil și obligatoriu pentru a putea trece la pasul următor.
Această selecție va influența probabil modul în care sunt completate datele de proprietar în pasul curent, deoarece entitatea de leasing va apărea ca proprietar principal în poliță.

Am trecut la Pasul 2: Vehicul. Această secțiune este dedicată detaliilor tehnice ale autoturismului pentru care se încheie polița. Interfața oferă opțiunea de a precompleta datele dacă vehiculul este deja salvat în cont.
Iată extragerea datelor din această etapă:
Structura Formularului: Pasul 2 - Vehicul
1. Selecție Rapidă
Alegeți un vehicul salvat: Dropdown pentru utilizatorii care au mai emis polițe pentru același vehicul.
2. Identificare Vehicul
Câmpuri esențiale pentru identificarea unică în baza de date CEDAM/DRPCIV:
Număr de înmatriculare: Câmp text.
VIN * (Serie șasiu): Câmp text obligatoriu.
Notă informativă: „Caută date despre vehicul după VIN-ul acestuia” (sugerează o funcționalitate de auto-completare prin integrare API).
3. Date Tehnice (Specificații)
O listă densă de câmpuri, majoritatea fiind obligatorii:
Câmp,Tip Control
Categorie *,Dropdown
Subcategorie *,Dropdown
Marcă *,Dropdown
Model *,Câmp text
Stare înmatriculare *,Dropdown
Date primei înmatriculări *,Selector Dată
Tipul de activitate *,"Dropdown (ex: personal, taxi, ridesharing)"
Anul producției *,Câmp text (numeric)
Masa maximă *,Câmp text (numeric)
Capacitate cilindrică *,Câmp text (numeric)
Tip combustibil *,Dropdown
Număr locuri *,Câmp text (numeric)
Seria CIV *,Câmp text (Seria Cărții de Identitate a Vehiculului)
Putere motor *,Câmp text (în kW)
Număr kilometri *,Câmp text
Data expirării ITP *,Selector Dată
4. Navigare
Precedentul: Buton acum activ (permite întoarcerea la datele proprietarului).
Următorul: Buton activ pentru trecerea la „Valabilitate poliță”.
Această secțiune este critică; o singură cifră greșită în seria CIV sau VIN poate duce la invalidarea poliței sau la un preț calculat eronat. Observ că unitatea de măsură pentru putere este cerută explicit în kW, nu în Cai Putere (CP).



Am ajuns la Pasul 3: Valabilitate poliță. Această etapă definește cadrul temporal al asigurării și este crucială pentru calculul prețului, deoarece tarifele variază semnificativ între o poliță pe o lună și una pe un an.
Iată extragerea datelor din această secțiune:
Structura Formularului: Pasul 3 - Valabilitate poliță
1. Selectează data de început *
Sectiunea din stânga conține un calendar interactiv:
Luna/Anul curent: Aprilie 2026.
Data selectată: 27 aprilie 2026 (încercuită).
Restricții vizibile: Zilele anterioare datei de 27 sunt dezactivate (gri), sugerând că polița nu poate fi emisă retroactiv.
2. Perioada de valabilitate *
Secțiunea din dreapta permite selectarea duratei asigurării:
Instrucțiune: „Selectați 1 sau 2 perioade de valabilitate” (util pentru a compara prețurile, de exemplu, între 6 și 12 luni).
Contor selecție: Selectate: 0/2.
Opțiuni disponibile: Butoane de tip "toggle" de la 1 lună până la 12 luni.
3. Mesaj de Avertizare (Info Banner)
Un text de tip "Important" apare sub selecții pentru a ghida utilizatorul:
IMPORTANT! Maxim 60 de zile în avans. Introduceți data cu atenție. Suprapunerea datei cu o poliță valabilă existentă sau lipsa de continuitate cu data de expirare a poliței curente nu e acceptată de unele companii de asigurări.
4. Navigare
Precedentul: Activ (pentru întoarcere la datele vehiculului).
Următorul: Activ (pentru trecerea la selecția asigurătorilor).
Observație de UX:
Interfața este foarte curată și previne erorile comune (cum ar fi încercarea de a emite o poliță cu mai mult de 60 de zile în avans) prin limitarea opțiunilor din calendar. Faptul că poți alege două perioade simultan sugerează că pasul următor (Oferte) va prezenta o matrice de prețuri comparativă.


Am ajuns la Pasul 4: Asigurători. Această etapă este una de confirmare și conformitate legală înainte de afișarea ofertelor finale de preț. Aici utilizatorul vede companiile care pot genera cotații și trebuie să bifeze acordurile legale obligatorii.
Iată extragerea datelor din această secțiune:
Structura Formularului: Pasul 4 - Asigurători
1. Asigurători disponibili
Este prezentată o grilă cu logo-urile companiilor de asigurări partenere care vor interoga baza de date pentru a oferi un preț:
Grawe (Grawe RO Asigurare S.A.)
eazy.insure (Eazy Asigurari S.A.)
Hellas Direct (Hellas_HD Insur Ldt)
Omniasig (Omniasig VIG SA)
Generali (Generali Ro Asig.Reasig.S.A.)
Groupama (Groupama Asigurari SA)
Asirom (Asirom VIG SA)
Axeria (Axeria Iard SA Suc.Bucuresti)
Allianz Țiriac (Allianz Tiriac Asigurari SA)
2. Întrebări conform normei 22/2021
Această secțiune conține declarații legale obligatorii pentru vânzarea polițelor de asigurare online. Toate sunt de tip checkbox:
Renunțarea la consultanță *: Utilizatorul declară că optează pentru achiziția fără consultanță directă (specific comerțului electronic).
Vârsta și acuratețea datelor *: Confirmarea că utilizatorul are peste 18 ani și datele sunt reale.
GDPR *: Acordul pentru stocarea și prelucrarea datelor de către Insuretech SRL (brokerul/platforma). Include link către „Politica de prelucrare a datelor personale”.
Informarea Precontractuală *: Confirmarea luării la cunoștință a condițiilor. Include link document.
Călătorii non-UE: O întrebare specifică pentru cartea verde (menționează că nu influențează prețul).
3. Navigare
Precedentul: Activ (pentru a modifica data sau durata poliței).
Următorul: Activ (va debloca ofertele de preț odată ce bifele obligatorii sunt selectate).
Notă de conformitate:
Câmpurile marcate cu asterisc roșu (*) sunt critice. Fără bifarea acestora, procesul de ofertare nu poate continua legal, deoarece platforma trebuie să demonstreze că a informat consumatorul conform reglementărilor ASF (Autoritatea de Supraveghere Financiară).

Am ajuns la ultimul pas, Pasul 5: Oferte. Această pagină reprezintă ecranul de interfață dintre colectarea datelor și afișarea rezultatelor financiare. În acest moment, sistemul a interogat asigurătorii și este gata să prezinte cotațiile.
Iată extragerea datelor din acest ecran final:
Structura Formularului: Pasul 5 - Oferte
1. Mesaje de Status
Sunt prezente două bannere de notificare care confirmă succesul procesării:
Informare (Albastru): „Ofertele au fost găsite pe baza informațiilor completate.”
Succes (Verde): „9 produse încărcate cu succes” (corespunde celor 9 asigurători selectați la pasul anterior).
2. Rezumatul datelor formularului
O secțiune de tip "review" care sintetizează alegerile utilizatorului înainte de a vedea prețurile:
Data de început a poliței: Nu este setat (Se pare că există o discrepanță aici față de selecția din calendar de la pasul 3).
Perioada (luni): Câmp gol.
Șoferul principal diferit: Nu.
Produse disponibile: 9.
3. Acțiune Principală
Buton Central: Caută oferte (însoțit de o pictogramă cu lupă). Acest buton declanșează probabil afișarea listei detaliate cu prețurile de la fiecare asigurător.
4. Navigare
Precedentul: Activ (pentru a reveni la pașii anteriori în cazul în care rezumatul arată date eronate).
Pictogramă Coș: Rămâne prezentă în colțul din dreapta sus.
Observație importantă:
Deși în pasul 3 am văzut data de 27 aprilie 2026 selectată în calendar, rezumatul de aici afișează „Nu este setat”. Acest lucru ar putea indica:
O eroare de flux (datele nu s-au salvat în stare/state-ul aplicației).
Utilizatorul a revenit înapoi și a deselectat data înainte de a ajunge din nou aici.
Un placeholder care se actualizează doar după apăsarea butonului de căutare.
Acesta a fost parcursul complet al fluxului de emitere RCA. Ai dori să analizăm o anumită secțiune mai în detaliu sau să facem o comparație între stările „Persoană Fizică” vs „Persoană Juridică”?
