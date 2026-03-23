-- =============================================
-- KROK 1: Smaž staré RLS politiky
-- =============================================
DROP POLICY IF EXISTS "Kdokoli muze cist" ON page_content;
DROP POLICY IF EXISTS "Admin muze pridavat" ON page_content;
DROP POLICY IF EXISTS "Admin muze upravovat" ON page_content;
DROP POLICY IF EXISTS "Admin muze mazat" ON page_content;

-- =============================================
-- KROK 2: Vytvoř nové politiky (anon = bez přihlášení)
-- Potřebujeme SELECT + INSERT + UPDATE pro anonymního uživatele,
-- protože naše aplikace používá anon key (ne authenticated).
-- =============================================
CREATE POLICY "Verejne cteni" ON page_content
  FOR SELECT TO anon USING (true);

CREATE POLICY "Verejny zapis" ON page_content
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Verejna uprava" ON page_content
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Hotovo! Teď můžeš ukládat a publikovat změny.
