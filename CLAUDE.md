# Expert Launch Delivery Sustav — Projektni Brief

## 0\. Kontekst

Ovo je sustav AI agenata koji automatizira isporuku "Expert Launch" ponude klijentima (trenutno fokus: edukatori). Cilj: agenti odrađuju build-time zadatke (content strategija, skripte, landing page, CRM, oglasi...) koji su ranije rađeni ručno, kroz definirane, ponovljive korake — tako da isporuka postane skalabilna na 50+ klijenata mjesečno bez linearnog rasta operativnog opterećenja.

Princip: **"kamera i objektiv"** — jezgra (agent pipeline, dashboard, prompt struktura) je fiksna i identična za sve klijente. Ono što se mijenja po klijentu (niša, kanal akvizicije) su ulazni podaci koje agent prima, ne novi kod.

Referentni dokument ponude: `docs/Restrukturiranje_Delivery_Sustava.pdf` (dodati u repo).

---

## 1\. Repo struktura

```
/
├── CLAUDE.md                       # ovaj fajl — auto-loadan kontekst
├── agents/
│   ├── content-strategija/
│   │   ├── prompt.md               # trenutna verzija prompta (editabilna preko dashboarda)
│   │   ├── prompt_history/         # prethodne verzije, timestamped
│   │   ├── questionnaire.json      # definicija custom upitnika za ovaj agent
│   │   ├── steps/                  # definirani koraci (vidi sekciju 6.1)
│   │   ├── golden_examples/        # ručno napravljeni referentni outputi
│   │   └── run.ts                  # entry point / orkestracija koraka
│   ├── landing-page/
│   │   └── (ista struktura)
│   ├── crm-snapshot/               # placeholder, prazan skeleton za sada
│   ├── prodajne-skripte/           # placeholder
│   ├── ads-copy/                   # placeholder
│   ├── email-sekvenca/             # placeholder
│   ├── ... (ostatak liste iz sekcije 5, svi kao prazni skeletoni)
│   └── shared/
│       ├── google-drive-client.ts  # zajednička Drive API konekcija
│       ├── google-sheets-client.ts # zajednička Sheets API konekcija (status baza)
│       └── llm-client.ts           # zajednički Claude API wrapper
├── dashboard/                      # Next.js app
│   ├── app/
│   │   ├── clients/[id]/           # pogled statusa po klijentu
│   │   ├── agents/[slug]/          # pogled + editor prompta po agentu
│   │   └── agents/[slug]/history/  # verzije prompta, revert
│   └── lib/
├── docs/
│   └── Restrukturiranje_Delivery_Sustava.pdf
└── .env.local                      # Google service account ključ, Claude API ključ (NIKAD u git)
```

**Git strategija:** svaki agent se razvija u svom **git worktree-u** (izoliran direktorij, isti `.git`), tako da paralelne Claude Code sesije ne diraju iste fajlove. Prvi build fokus (sekcija 6\) ide u dva worktreea: `worktree/content-strategija` i `worktree/landing-page`.

---

## 2\. Tech stack

- **Dashboard:** Next.js (React), Tailwind — jednostavan, brz build u Claude Codeu  
- **Status baza (v1):** Google Sheets preko `googleapis` npm paketa — jedan red po klijentu, kolona po agentu (status: `čeka` / `u tijeku` / `gotovo` / `provjereno`)  
- **Skladište outputa:** Google Drive API — folder po klijentu, podfolder po agentu (`/Klijenti/{ime-klijenta}/{agent-slug}/output.md`)  
- **LLM:** Claude API (Sonnet za većinu koraka; razmotriti Haiku za jeftinije/jednostavnije pod-korake kad ih bude, npr. validacija formata)  
- **Autentikacija prema Google API-jima:** Service Account JSON ključ (ne OAuth) — agenti rade bez interakcije s korisnikom, pa treba server-to-server auth

### Checklist za Karla (izvan Claude Codea, prije prvog builda)

- [ ] U Google Cloud Console omogućiti **Drive API** i **Sheets API** u istom projektu  
- [ ] Kreirati **Service Account**, preuzeti JSON ključ, spremiti kao `service-account.json` (dodati u `.gitignore`, nikad committati)  
- [ ] Podijeliti ciljani Drive folder (root folder za sve klijente) sa service account emailom kao **Editor**  
- [ ] Kreirati prazan Google Sheet za status bazu, podijeliti isto sa service accountom, zalijepiti Sheet ID u `.env.local`  
- [ ] Kreirati prazan GitHub repo (privatni), dati mi URL da znam kamo pushati

---

## 3\. Dashboard — zahtjevi

1. **Pregled klijenata** — lista klijenata sa statusom po agentu (grid: redak \= klijent, stupac \= agent, ćelija \= status s bojom)  
2. **Pogled po klijentu** — klik na klijenta otvara detalje: koji upitnici popunjeni, koji agenti pokrenuti, linkovi na outpute u Drive-u  
3. **Prompt Manager (po agentu)** — ključan zahtjev:  
   - Ekran po agentu prikazuje trenutni `prompt.md`  
   - Gumb "Upload novi prompt" — korisnik ubaci `.md` fajl, on zamjenjuje trenutni  
   - Svaka promjena sprema se u `prompt_history/` s timestampom i (opcionalno) kratkom bilješkom zašto je promijenjen  
   - Prikaz liste prethodnih verzija s mogućnošću **revert** na stariju verziju  
   - Ovo omogućava da Karlo/kolega mijenjaju ponašanje agenta bez diranja koda  
4. **Ručno okidanje agenta** — gumb "Pokreni" na agent kartici za odabranog klijenta (za sada nema auto-trigger — vidi sekciju 8\)  
5. **Pregled outputa prije slanja** — output se prikazuje u dashboardu, čovjek klikne "Odobreno" (mijenja status u `provjereno`) prije nego se smatra finalnim

---

## 4\. Google Drive/Sheets shema (v1)

**Sheet "Status" — kolone:** `klijent_id | ime | niša | datum_starta | content_strategija | landing_page | crm | skripte | ads_copy | email | social | aplikacijska_forma | offer_stack | edu_punjenje | overall_status`

Svaka agent-kolona sadrži jednu od: `čeka`, `u tijeku`, `gotovo`, `provjereno`, `greška`.

**Drive struktura:**

```
/Klijenti/
  /{klijent-slug}/
    /upitnici/           # popunjeni custom upitnici po agentu
    /content-strategija/
      output.md
      run_log.json        # input, output, timestamp, tko je odobrio
    /landing-page/
      output.html (ili .md draft prije finalnog builda)
      run_log.json
    ...
```

---

## 5\. Puna lista agenata — kostur

### Build-time (jednom po klijentu, dio lanca)

| \# | Agent | Status u ovoj fazi |
| :---- | :---- | :---- |
| 1 | Content strategija \+ hookovi | **AKTIVNO GRADIMO** |
| 2 | Landing page copy/build | **AKTIVNO GRADIMO** |
| 3 | Upitnik generator (custom po agentu, ne jedan veliki) | skeleton, nizak prioritet za sad |
| 4 | Prodajne skripte (glavne \+ follow-up) | skeleton |
| 5 | Ad copy (5 FB/IG oglasa) | skeleton |
| 6 | CRM snapshot kloniranje \+ popuna varijabli | skeleton — čeka odluku GHL vs custom |
| 7 | Email sekvenca | skeleton |
| 8 | Social media optimizacija \+ story sekvenca | skeleton |
| 9 | Aplikacijska forma | skeleton |
| 10 | Offer stack (posebne ponude) | skeleton |
| 11 | Strategija punjenja edukacijskih programa | skeleton |

### Runtime (kontinuirano tijekom suradnje)

| \# | Agent | Status |
| :---- | :---- | :---- |
| 12 | AI roleplay agent za prigovore | nije u ovoj fazi |
| 13 | Support/WhatsApp triage agent | nije u ovoj fazi |
| 14 | Ads monitoring agent | nije u ovoj fazi |

### Ne-agent (SOP/ljudski rad)

- Fathom instalacija, FB tracking povezivanje, tjedni grupni poziv — izvan ovog sustava

**Napomena o CRM-u (\#6):** Karlo razmatra custom CRM umjesto GHL-a jer neki klijenti odbijaju GHL. Ovo se **ne rješava sada** — ostaje prazan skeleton dok se ne napravi zaseban brainstorming o arhitekturi (GHL snapshot vs custom build).

---

## 6\. Prioritet — 2 bottleneck agenta (grade se OVAJ TJEDAN)

Oba agenta prate isti obrazac s dijagrama: **research → avatar → struktura → full copy → provjera**. Svaki korak je zaseban, jasno definiran, s definiranim inputom/outputom — ne jedan veliki prompt koji radi sve odjednom.

### 6.1 Content strategija \+ hookovi

**Koraci (steps/):**

1. `01_research.ts` — agent čita: notes s poziva, web klijenta, social profile (URL-ovi iz custom upitnika za ovaj agent). Output: sažetak niše, tona, postojećeg contenta.  
2. `02_avatar.ts` — na temelju researcha, definira avatar/target publiku specifičnu za ovog klijenta. Output: kratki avatar profil (bolovi, želje, jezik kojim govore).  
3. `03_struktura.ts` — definira content pillars/kategorije i broj/tip hookova po kategoriji.  
4. `04_full_copy.ts` — piše finalne hookove \+ content strategiju u punom obliku.  
5. `05_qa_check.ts` — provjerava output naspram golden examplea (format, ton, kompletnost) — **u ovoj fazi flagira za ljudski review, ne auto-odobrava.**

**Golden example:** Karlo ima gotove primjere iz postojećih educator klijenata — staviti u `golden_examples/` prije pisanja prompta za korak 4, jer prompt treba eksplicitno referencirati standard ("output treba biti ove razine specifičnosti i tona, kao u primjeru X").

**Custom upitnik za ovaj agent:** kratak, ciljan — ime, niša, web/social URL-ovi, 3-5 pitanja specifična za content (npr. "koje teme klijent najčešće spominje", "postoji li content koji je već dobro prošao"). Ne veliki 100-pitanja upitnik.

### 6.2 Landing page

Ovaj agent traje duže za razviti (Karlo je to naglasio) jer izlaz nije tekst nego strukturirani build (HTML/GHL custom code element/Lovable output).

**Koraci:**

1. `01_research.ts` — isto kao content strategija, plus specifično: koje usluge/ponuda se prodaje na ovoj stranici (iz onboarding poziva/upitnika)  
2. `02_avatar.ts` — može ponovno koristiti avatar iz content strategije ako je isti klijent već prošao kroz taj agent (izbjeći dupliciranje rada — provjeriti Drive je li avatar već generiran za ovog klijenta prije nego se ponovno generira)  
3. `03_struktura.ts` — definira sekcije stranice (hero, problem/agitate, ponuda, dokazi, CTA, FAQ...) prije pisanja punog copyja  
4. `04_full_copy.ts` — piše copy po sekcijama  
5. `05_build.ts` — pretvara copy u finalni format (Karlo gradi u Claude Code/Lovable, ponekad webhook u GHL, ponekad GHL custom code element — ovaj korak treba dodatnu odluku o standardnom output formatu prije pisanja, vidi otvoreno pitanje ispod)  
6. `06_qa_check.ts` — ljudski review prije slanja/objave

**Otvoreno pitanje za Karla prije pisanja koraka 5:** Koji je DEFAULT format outputa kad agent radi za novog klijenta bez posebne upute — čist HTML/CSS fajl, ili Lovable prompt koji Karlo ručno pokreće, ili GHL custom code blok? Ovo određuje je li korak 5 "agent piše kod" ili "agent piše brief za sljedeći korak koji Karlo ručno pokreće u Lovable". Preporuka: početi s čistim HTML/CSS izlazom (najfleksibilniji, radi svugdje), dodati GHL/Lovable specifične izlazne formate kasnije kao opciju.

---

## 7\. Princip: custom upitnik po agentu (ne jedan veliki)

Umjesto jednog upitnika od 100+ pitanja (dokazano nizak completion rate — vidi primjer Sedmo nebo upitnika, \>60 od 158 pitanja prazno), svaki agent ima **svoj kratak, ciljan upitnik** (`questionnaire.json` u agent folderu) koji traži samo ono što TAJ agent stvarno treba. Ovo direktno povećava vjerojatnost potpunog popunjavanja i smanjuje količinu podataka koje agent mora nagađati.

Format `questionnaire.json`:

```json
{
  "agent": "content-strategija",
  "questions": [
    {"id": "web", "label": "Web stranica", "type": "url", "required": true},
    {"id": "social", "label": "Instagram/LinkedIn profil", "type": "url", "required": true},
    {"id": "teme", "label": "Koje teme najčešće spominješ u sadržaju?", "type": "text"},
    {"id": "vec_dobro", "label": "Postoji li sadržaj koji je već dobro prošao?", "type": "text"}
  ]
}
```

---

## 8\. Trigger model (za sada)

**Ručno okidanje.** Klijent popuni custom upitnik za dani agent → status u Sheetu se mijenja na `spremno_za_pokretanje` → Karlo/kolega klikne "Pokreni" na dashboardu za tog agenta i tog klijenta. **Automatski chain (agent 1 završi → agent 2 kreće sam) je faza 2,** ne gradi se sada — dodaje se tek kad su pojedinačni agenti dokazano pouzdani na 5-10 stvarnih klijenata.

---

## 9\. Metodologija razvoja agenata (primjenjuje se na SVAKI agent, uključujući buduće)

1. Prije pisanja prompta — ručno napraviti 2-3 "golden example" outputa kao referentni standard  
2. Prompt je verzioniran fajl (`prompt.md` \+ `prompt_history/`), svaka promjena ima razlog zabilježen  
3. Svaki run se logira (`run_log.json`): input, output, ljudska ocjena (dobro/treba doradu/loše) \+ zašto  
4. Nakon 15-20 runova po agentu — pregledati log za obrasce grešaka, popraviti prompt ciljano, ne nagađati  
5. Kad agent postigne konzistentan kvalitetan output na 5+ klijenata zaredom — prestati ga mijenjati osim ako se pojavi nova kategorija problema  
6. Ljudska provjera na build-time agentima opada postupno (spot-check nakon prvih 5-10 klijenata); runtime agenti (kad se grade) zadržavaju kontinuirani sample-review jer rade uživo s klijentima

---

## 10\. Redoslijed rada (build order za Claude Code sesije)

1. Setup repoa, `shared/` klijenti za Drive i Sheets, prazan Sheet sa shemom iz sekcije 4  
2. Dashboard skeleton — lista klijenata, prazan agent pogled (bez logike još)  
3. **Worktree A:** Content strategija agent — svih 5 koraka, testiran na 1 postojećem klijentu (koristeći golden example koji Karlo doda u `golden_examples/`)  
4. **Worktree B (paralelno):** Landing page agent — koraci 1-4 prvo (copy), korak 5 (build format) čeka Karlovu odluku iz sekcije 6.2  
5. Prompt Manager ekran na dashboardu (upload .md, history, revert)  
6. Nakon što oba bottleneck agenta rade pouzdano — dodavanje preostalih agenata iz sekcije 5, jedan po jedan, isti obrazac (steps/, golden\_examples/, run\_log)

---

## Napomena za Claude Code sesije koje rade na ovom repou

Ne mijenjaj strukturu foldera bez razloga navedenog u ovom fajlu. Ako radiš na jednom agentu, ostani u njegovom worktreeu — ne diraj `shared/` fajlove bez najave, jer ih druge paralelne sesije koriste. Svaka promjena prompta ide u `prompt_history/` prije prepisivanja `prompt.md`, nikad direktno brisanje stare verzije.
