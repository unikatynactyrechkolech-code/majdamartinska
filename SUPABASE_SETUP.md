# 🗄️ Jak zprovoznit databázi pro web (Supabase)

> **Pro koho je tento návod?**
> Pro tebe – i když nejsi programátor. Projdi to krok za krokem a bude to fungovat.
> Každý krok má vysvětlení co to dělá a proč.

---

## 💡 Co je Supabase a proč ho používáme?

**Supabase** = online databáze zdarma. Představ si to jako **Google Tabulku v cloudu**,
do které se automaticky ukládají všechny texty, které na webu upravíš přes admin panel.

**Proč zrovna Supabase?**
- Je **zdarma** (pro naše účely bohatě stačí free plán)
- Data jsou **online** – přístupná odkudkoli
- Má **zabezpečení** – nikdo cizí nemůže data měnit

**Klíčová výhoda:** Jednu Supabase databázi můžeš použít pro **víc různých webů**.
Třeba web pro Majdu, web pro jiného fotografa, web pro firmu – všechno jede z jednoho
účtu, ale data se navzájem nevidí díky `project_id` (vysvětlím dál).

---

## 🔧 KROK 1 – Založ si Supabase účet

1. Jdi na **[supabase.com](https://supabase.com)** → klikni **Start your project** (zelené tlačítko)
2. Přihlas se přes **GitHub** účet (nebo si ho založ na github.com – je to zdarma)
3. Klikni **New Project**
4. Vyplň:
   - **Name**: `majda-web` (nebo jak chceš)
   - **Database Password**: vymysli si heslo a **zapiš si ho** (budeš ho potřebovat)
   - **Region**: `Central EU (Frankfurt)` – nejbližší k ČR
5. Klikni **Create new project** a počkej ~2 minuty než se to vytvoří

---

## 🔑 KROK 2 – Najdi si své klíče (API Keys)

Klíče = hesla, díky kterým se tvůj web připojí k databázi.

1. V Supabase Dashboardu (tam kde jsi) klikni vlevo na **⚙️ Settings** (ozubené kolo)
2. Pak klikni na **API** (v levém menu pod Settings)
3. Uvidíš dvě důležité věci:

| Co vidíš na stránce | Co to je | Jak se to jmenuje v kódu |
|---|---|---|
| **Project URL** | Adresa tvojí databáze | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon / public** key (pod "Project API keys") | Veřejný klíč pro čtení | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

4. **Obě hodnoty si zkopíruj** – budeš je potřebovat v dalším kroku.

> 🔒 **Je to bezpečné?** Ano. „anon" klíč je veřejný – slouží jen ke čtení dat.
> Nikdo s ním nemůže nic smazat ani upravit (to zajistíme v kroku 5).

---

## 📝 KROK 3 – Vytvoř soubor `.env.local`

Tento soubor říká tvému webu: „Tady je tvoje databáze, tady je tvůj klíč."

1. Otevři složku `majda-web` ve VS Code
2. Vytvoř nový soubor s názvem přesně **`.env.local`** (pozor, začíná tečkou!)
3. Vlož do něj toto a doplň svoje hodnoty:

```env
# ==========================================
# IDENTITA PROJEKTU
# ==========================================
# Tohle říká: "Tento web se jmenuje majdamartinska."
# Pokud v budoucnu uděláš další web, dáš tam jiné jméno
# (třeba "jannovak" nebo "firemni-web") a data se nepomíchají.
NEXT_PUBLIC_PROJECT_ID=majdamartinska

# ==========================================
# PŘIPOJENÍ K DATABÁZI (Supabase)
# ==========================================
# Tvoje hodnoty (už vyplněné!):
NEXT_PUBLIC_SUPABASE_URL=https://dcmzlmbiclwsgqslnupt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_63mwtb2Akx3Wi93cyyuGDg__GOCx2Mx
```

> ⚠️ **DŮLEŽITÉ:** Soubor `.env.local` se NIKDY nenahrává na internet (je v `.gitignore`).
> Tvoje klíče jsou v bezpečí.

### Co je to `NEXT_PUBLIC_PROJECT_ID`?

Představ si to jako **štítek na šanonu**:
- V jedné skříni (= Supabase) máš víc šanonů (= webů)
- Každý šanon má štítek: `majdamartinska`, `jinyFotograf`, `firemni-web`...
- Když web ukládá text, vždy přilepí svůj štítek → data se nikdy nepomíchají
- **Tohle je ta "multi-tenant" architektura** – jen to znamená "víc nájemníků v jednom domě"

---

## 🗃️ KROK 4 – Vytvoř tabulku v databázi

Tabulka = místo kde se ukládají tvoje texty. Jako tabulka v Excelu.

1. V Supabase Dashboardu klikni vlevo na **SQL Editor** (ikona `<>`)
2. Klikni **New query** (nový dotaz)
3. **Zkopíruj a vlož** celý tento kód — je to čistý SQL, kopíruj VŠECHNO v rámečku:

```sql
CREATE TABLE IF NOT EXISTS page_content (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id      TEXT NOT NULL,
  section_id      TEXT NOT NULL,
  draft_text      TEXT,
  published_text  TEXT,
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  published_at    TIMESTAMPTZ,
  UNIQUE (project_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_page_content_project_section
  ON page_content (project_id, section_id);
```

4. Klikni **Run** (zelené tlačítko vpravo nahoře)
5. Uvidíš: **Success. No rows returned** – to je správně ✅

---

## 🔒 KROK 5 – Zabezpečení (kdo smí co)

Tohle nastaví pravidla:
- **Vidět texty** = může kdokoli (návštěvníci webu)
- **Měnit texty** = může jen přihlášený admin

Opět: **New query** → vlož → **Run**:

```sql
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kdokoli muze cist" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Admin muze pridavat" ON page_content
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin muze upravovat" ON page_content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin muze mazat" ON page_content
  FOR DELETE TO authenticated USING (true);
```

Po kliknutí na **Run** uvidíš: **Success** ✅

---

## 📄 KROK 5.5 – Nahraj texty webu do databáze

Tohle vezme všechny texty z webu a uloží je do databáze.
Pak je budeš moct měnit přes admin panel.

**New query** → vlož → **Run**:

```sql
INSERT INTO page_content (project_id, section_id, draft_text, published_text) VALUES
('majdamartinska', 'home.hero.label', 'RODINNÉ · SVATEBNÍ · NEWBORN FOCENÍ', 'RODINNÉ · SVATEBNÍ · NEWBORN FOCENÍ'),
('majdamartinska', 'home.hero.line1', 'Vaše', 'Vaše'),
('majdamartinska', 'home.hero.line2', 'příběhy', 'příběhy'),
('majdamartinska', 'home.hero.line3', 'zachycené navždy', 'zachycené navždy'),
('majdamartinska', 'home.promise.label', 'SLIBUJI VÁM', 'SLIBUJI VÁM'),
('majdamartinska', 'home.promise.title', 'Že focení bude přirozené & v pohodě', 'Že focení bude přirozené & v pohodě'),
('majdamartinska', 'home.promise.text', 'Hledáte fotografku a zároveň pohodářku? Chcete si focení užít a neprotrpět? Jste na správném místě. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi při focení záleží.', 'Hledáte fotografku a zároveň pohodářku? Chcete si focení užít a neprotrpět? Jste na správném místě. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi při focení záleží.'),
('majdamartinska', 'home.services.label', 'MOJE SLUŽBY', 'MOJE SLUŽBY'),
('majdamartinska', 'home.services.title', 'Moje <em>práce</em>', 'Moje <em>práce</em>'),
('majdamartinska', 'home.service1.name', 'Rodinné a portrétní', 'Rodinné a portrétní'),
('majdamartinska', 'home.service2.name', 'Newborn — miminka', 'Newborn — miminka'),
('majdamartinska', 'home.service3.name', 'Svatby', 'Svatby'),
('majdamartinska', 'home.about.label', 'KDO STOJÍ ZA OBJEKTIVEM?', 'KDO STOJÍ ZA OBJEKTIVEM?'),
('majdamartinska', 'home.about.title', 'Ahoj,<br />jsem <em>Majda</em>', 'Ahoj,<br />jsem <em>Majda</em>'),
('majdamartinska', 'home.about.text', 'Focení mě lákalo od dětství. Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nebude :)', 'Focení mě lákalo od dětství. Mám ráda humor a to se objevuje i v mých fotografiích. Dobrá nálada, otevřenost, přirozenost a žádná křeč — to je to, na čem mi záleží. Taky jsem dost upovídaná, takže kdo se bojí trapného ticha, nebude :)'),
('majdamartinska', 'home.more1.title', 'Psí kamarádi', 'Psí kamarádi'),
('majdamartinska', 'home.more1.text', 'Máš doma mazlíka? Chceš ho mít na fotkách? Tož to tady jsi správně.', 'Máš doma mazlíka? Chceš ho mít na fotkách? Tož to tady jsi správně.'),
('majdamartinska', 'home.more2.title', 'Těhotenské focení', 'Těhotenské focení'),
('majdamartinska', 'home.more2.text', 'Krásné období, které si zaslouží zachytit na fotografiích.', 'Krásné období, které si zaslouží zachytit na fotografiích.'),
('majdamartinska', 'home.more3.title', 'Portréty', 'Portréty'),
('majdamartinska', 'home.more3.text', 'Profesionální portrétní fotografie pro vaši prezentaci i osobní účely.', 'Profesionální portrétní fotografie pro vaši prezentaci i osobní účely.'),
('majdamartinska', 'home.testimonials.label', 'MILÁ SLOVA', 'MILÁ SLOVA'),
('majdamartinska', 'home.testimonial.text', '„Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality."', '„Spolupracovat s Majdou byla naprostá paráda. S naším 14denním synem zacházela více než mateřsky. Fotografie jsou plné něhy, lásky a profesionality."'),
('majdamartinska', 'home.testimonial.name', 'Bára M.', 'Bára M.'),
('majdamartinska', 'home.testimonial.type', 'Newborn focení', 'Newborn focení'),
('majdamartinska', 'home.studio.label', 'ATELIÉR', 'ATELIÉR'),
('majdamartinska', 'home.studio.title', 'Ateliér <em>Praha Suchdol</em>', 'Ateliér <em>Praha Suchdol</em>'),
('majdamartinska', 'home.studio.text', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol.', 'Disponuji velkým a dobře vybaveným ateliérem v klidné části Praha — Suchdol.'),
('majdamartinska', 'home.cta.label', 'JSME NA PODOBNÉ VLNĚ?', 'JSME NA PODOBNÉ VLNĚ?'),
('majdamartinska', 'home.cta.title', 'Pojďme <em>do toho</em>', 'Pojďme <em>do toho</em>')
ON CONFLICT (project_id, section_id) DO UPDATE SET
  draft_text = EXCLUDED.draft_text,
  published_text = EXCLUDED.published_text,
  updated_at = now();
```

Po **Run** uvidíš: **Success. 27 rows affected** ✅

> Tenhle SQL můžeš spustit i opakovaně – nic se nerozbije, data se přepíšou.

---

## 📦 KROK 6 – Nainstaluj potřebné balíčky

Vrať se do **VS Code** a do terminálu (dole v editoru) napiš:

```bash
cd majda-web
npm install @supabase/supabase-js @supabase/ssr
```

> 💬 **Co to dělá?** Stáhne do projektu knihovny, které umí komunikovat s databází.
> Jako bys si stáhl aplikaci, která umí mluvit se Supabase.

---

## ✅ KROK 7 – Hotovo! Vyzkoušej to

1. Spusť web:
   ```bash
   npm run dev
   ```
2. Otevři v prohlížeči **http://localhost:3000**
3. Klikni na **ikonu zámku** (vpravo dole) → zadej heslo **majda2026**
4. Teď jsi v admin módu – klikni na jakýkoli text a uprav ho
5. Klikni **Publikovat** v horní liště

Texty se teď ukládají do Supabase! 🎉

---

## 🌍 Jak přidat DALŠÍ web na stejnou databázi?

Tohle je ta výhoda. Máš jednu Supabase databázi a můžeš z ní krmit 10 různých webů:

### Příklad:

| Web | `.env.local` nastavení | Co se stane |
|---|---|---|
| Majda Martinská | `NEXT_PUBLIC_PROJECT_ID=majdamartinska` | Texty se ukládají se štítkem `majdamartinska` |
| Jan Novák foto | `NEXT_PUBLIC_PROJECT_ID=jannovak` | Texty se ukládají se štítkem `jannovak` |
| Firemní web | `NEXT_PUBLIC_PROJECT_ID=firemni-web` | Texty se ukládají se štítkem `firemni-web` |

Všechny weby sdílí **stejnou** Supabase URL a klíč. Liší se **pouze** `NEXT_PUBLIC_PROJECT_ID`.
Data se nikdy nepomíchají – každý web vidí jen "svoje" řádky.

```
┌─────────────────────────────────────────────────────┐
│                SUPABASE DATABÁZE                    │
│                (jedna pro všechny)                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │            Tabulka: page_content              │  │
│  ├─────────────────┬─────────────┬───────────────┤  │
│  │ project_id      │ section_id  │ text          │  │
│  ├─────────────────┼─────────────┼───────────────┤  │
│  │ majdamartinska  │ hero.title  │ "Momentky..." │  │
│  │ majdamartinska  │ hero.text   │ "Fotím s..."  │  │
│  │ jannovak        │ hero.title  │ "Svatby..."   │  │
│  │ jannovak        │ hero.text   │ "Jsem Jan..." │  │
│  │ firemni-web     │ hero.title  │ "Naše firma"  │  │
│  └─────────────────┴─────────────┴───────────────┘  │
│                                                     │
│  Web "majdamartinska" vidí jen SVOJE 2 řádky        │
│  Web "jannovak" vidí jen SVOJE 2 řádky              │
│  Nikdy se nepomíchají! ✅                           │
└─────────────────────────────────────────────────────┘
```

### Postup pro nový web:
1. Zkopíruj složku `majda-web` → přejmenuj na `jannovak-web` (nebo cokoli)
2. V nové složce uprav `.env.local`:
   ```env
   NEXT_PUBLIC_PROJECT_ID=jannovak          ← ZMĚŇ TOHLE
   NEXT_PUBLIC_SUPABASE_URL=...             ← STEJNÉ jako u Majdy
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...        ← STEJNÉ jako u Majdy
   ```
3. Spusť `npm run dev` a máš druhý web s vlastním obsahem!

**Není potřeba nic dalšího** – žádné nové tabulky, žádné nové SQL.
Stačí jiný `NEXT_PUBLIC_PROJECT_ID`.

---

## 🔄 Migrace (jen pokud už máš starší verzi tabulky)

> Toto potřebuješ **jen pokud** jsi tabulku `page_content` vytvářel/a dříve
> BEZ sloupce `project_id`. Pokud ji teprve vytváříš, **přeskoč tento krok**.

```sql
-- Přidá sloupec "project_id" do existující tabulky
ALTER TABLE page_content ADD COLUMN project_id TEXT;

-- Všem existujícím řádkům přiřadí projekt "majdamartinska"
UPDATE page_content SET project_id = 'majdamartinska' WHERE project_id IS NULL;

-- Nastaví, že project_id nesmí být prázdný
ALTER TABLE page_content ALTER COLUMN project_id SET NOT NULL;

-- Odstraní staré omezení (jen section_id musel být unikátní)
ALTER TABLE page_content DROP CONSTRAINT IF EXISTS page_content_section_id_key;

-- Přidá nové omezení (unikátní musí být KOMBINACE project_id + section_id)
ALTER TABLE page_content ADD CONSTRAINT page_content_project_section_unique UNIQUE (project_id, section_id);

-- Přidá rychlostní index
CREATE INDEX IF NOT EXISTS idx_page_content_project_section ON page_content (project_id, section_id);
```

---

## ❓ Slovníček pojmů

| Pojem | Co to znamená jednoduše |
|---|---|
| **Supabase** | Online databáze zdarma (jako Google Tabulky, ale pro weby) |
| **Tabulka (table)** | Místo kde se ukládají data – jako list v Excelu |
| **Řádek (row)** | Jeden záznam v tabulce – třeba jeden nadpis na webu |
| **Sloupec (column)** | Typ informace – třeba "text nadpisu" nebo "datum změny" |
| **SQL** | Jazyk kterým se mluví s databází – ty ho jen kopíruješ, nemusíš umět |
| **RLS (Row Level Security)** | Pravidla kdo smí číst/měnit data |
| **API Key (klíč)** | Heslo pro připojení webu k databázi |
| **`.env.local`** | Tajný soubor s hesly, který se nenahrává na internet |
| **`project_id`** | Štítek/jmenovka projektu – odlišuje data různých webů v jedné databázi |
| **Multi-tenant** | "Víc nájemníků v jednom domě" – víc webů na jedné databázi |
| **Draft (koncept)** | Rozpracovaná verze textu – vidíš jen ty v admin módu |
| **Published (publikováno)** | Ostrá verze – tohle vidí návštěvníci webu |
| **UUID** | Automaticky vygenerované unikátní ID (jako rodné číslo pro řádek) |
| **Index** | Rejstřík pro rychlejší vyhledávání (jako rejstřík v knize) |
| **npm** | Správce balíčků – stahuje potřebné knihovny pro projekt |
| **Authenticated** | Přihlášený uživatel |

---

## 🆘 Něco nefunguje?

| Problém | Řešení |
|---|---|
| Web se nespustí | Zkontroluj jestli máš soubor `.env.local` ve složce `majda-web` |
| Texty se neukládají | Zkontroluj jestli jsi správně zkopíroval/a klíče z Supabase |
| Chyba "NEXT_PUBLIC_PROJECT_ID is not set" | V `.env.local` chybí řádek s `NEXT_PUBLIC_PROJECT_ID` |
| Chyba při SQL | Zkopíruj SQL znovu – nejspíš se neschoval celý kód |
| Tabulka se nezobrazuje | V Supabase Dashboardu klikni vlevo na **Table Editor** a měla by tam být |
| Admin mód nejde zapnout | Klikni na zámek (vpravo dole) a zadej heslo `majda2026` |
