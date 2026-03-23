ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- POZOR: Tento soubor je starý a NEFUNKČNÍ.
-- Použij soubor 04-oprava-rls.sql místo něj!
-- Problém: Staré politiky povolují zápis jen pro "authenticated",
-- ale aplikace používá "anon" key.

-- Pokud jsi už spustil tento soubor dříve, spusť 04-oprava-rls.sql
-- který smaže staré politiky a vytvoří správné.
