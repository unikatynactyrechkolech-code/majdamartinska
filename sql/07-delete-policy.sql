-- Add DELETE policy for anon users (was missing from original RLS setup)
CREATE POLICY "Verejne mazani" ON page_content
  FOR DELETE TO anon USING (true);
