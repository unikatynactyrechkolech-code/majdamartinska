#!/usr/bin/env node
/**
 * One-time fix: Delete the hero button text from Supabase DB
 * so the code default "Chci fotky" takes effect.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dcmzlmbiclwsgqslnupt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_63mwtb2Akx3Wi93cyyuGDg__GOCx2Mx';
const PROJECT_ID = 'majdamartinska';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fix() {
  // RLS doesn't allow DELETE for anon, so UPDATE the value instead
  const { error: updateError } = await supabase
    .from('page_content')
    .update({
      draft_text: 'Chci fotky',
      published_text: 'Chci fotky',
    })
    .eq('project_id', PROJECT_ID)
    .eq('section_id', 'home.hero.btn');

  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('✅ Updated home.hero.btn to "Chci fotky" in DB.');
  }

  // Verify
  const { data, error: selectError } = await supabase
    .from('page_content')
    .select('*')
    .eq('project_id', PROJECT_ID)
    .eq('section_id', 'home.hero.btn');

  if (selectError) {
    console.error('Select error:', selectError);
  } else {
    console.log('Current value:', data);
  }
}

fix().catch(console.error);
