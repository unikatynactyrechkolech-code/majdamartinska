'use server';

interface DraftInput {
  section_id: string;
  draft_text: string;
}

/**
 * Get the project_id for multi-tenant isolation.
 * Each website/project has its own unique ID.
 */
function getProjectId(): string {
  const id = process.env.NEXT_PUBLIC_PROJECT_ID;
  if (!id) throw new Error('NEXT_PUBLIC_PROJECT_ID is not set in .env.local');
  return id;
}

/**
 * Check if Supabase is configured
 */
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://TVOJE-ID.supabase.co'
  );
}

// In-memory store for local dev (no Supabase)
// Key format: "project_id::section_id"
const localStore: Record<string, { draft_text: string; published_text: string | null }> = {};

function localKey(sectionId: string): string {
  return `${getProjectId()}::${sectionId}`;
}

/**
 * Save one or more draft entries to the database.
 * Falls back to in-memory store if Supabase is not configured.
 */
export async function saveDrafts(entries: DraftInput[]) {
  const projectId = getProjectId();

  if (!isSupabaseConfigured()) {
    for (const e of entries) {
      const key = localKey(e.section_id);
      localStore[key] = {
        draft_text: e.draft_text,
        published_text: localStore[key]?.published_text ?? null,
      };
    }
    console.log(`[CMS][${projectId}] Draft uložen lokálně:`, entries.map(e => e.section_id));
    return { success: true };
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { error } = await supabase.from('page_content').upsert(
    entries.map((e) => ({
      project_id: projectId,
      section_id: e.section_id,
      draft_text: e.draft_text,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'project_id,section_id' }
  );

  if (error) {
    console.error('saveDrafts error:', error);
    throw new Error(`Failed to save drafts: ${error.message}`);
  }

  return { success: true };
}

/**
 * Publish: copy draft_text → published_text for given section IDs.
 */
export async function publishChanges(sectionIds: string[]) {
  const projectId = getProjectId();

  if (!isSupabaseConfigured()) {
    for (const id of sectionIds) {
      const key = localKey(id);
      if (localStore[key]) {
        localStore[key].published_text = localStore[key].draft_text;
      }
    }
    console.log(`[CMS][${projectId}] Publikováno lokálně:`, sectionIds);
    return { success: true };
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  for (const sectionId of sectionIds) {
    const { data, error: fetchError } = await supabase
      .from('page_content')
      .select('draft_text')
      .eq('project_id', projectId)
      .eq('section_id', sectionId)
      .single();

    if (fetchError) {
      console.error(`Fetch error for ${sectionId}:`, fetchError);
      throw new Error(`Failed to fetch draft for ${sectionId}`);
    }

    const { error: updateError } = await supabase
      .from('page_content')
      .update({
        published_text: data.draft_text,
        published_at: new Date().toISOString(),
      })
      .eq('project_id', projectId)
      .eq('section_id', sectionId);

    if (updateError) {
      console.error(`Update error for ${sectionId}:`, updateError);
      throw new Error(`Failed to publish ${sectionId}`);
    }
  }

  return { success: true };
}

/**
 * Load published content for given section IDs.
 */
export async function getPublishedContent(sectionIds: string[]) {
  const projectId = getProjectId();

  if (!isSupabaseConfigured()) {
    const result: Record<string, { published: string | null; draft: string | null }> = {};
    for (const id of sectionIds) {
      const key = localKey(id);
      if (localStore[key]) {
        result[id] = {
          published: localStore[key].published_text,
          draft: localStore[key].draft_text,
        };
      }
    }
    return result;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_content')
    .select('section_id, published_text, draft_text')
    .eq('project_id', projectId)
    .in('section_id', sectionIds);

  if (error) {
    console.error('getPublishedContent error:', error);
    return {};
  }

  const result: Record<string, { published: string | null; draft: string | null }> = {};
  for (const row of data ?? []) {
    result[row.section_id] = {
      published: row.published_text,
      draft: row.draft_text,
    };
  }
  return result;
}

/**
 * Load ALL published content for the entire project.
 * Called once on page load to hydrate all EditableText components.
 */
export async function getAllContent() {
  const projectId = getProjectId();

  if (!isSupabaseConfigured()) {
    const result: Record<string, { published: string | null; draft: string | null }> = {};
    for (const [compositeKey, val] of Object.entries(localStore)) {
      const sectionId = compositeKey.replace(`${projectId}::`, '');
      result[sectionId] = {
        published: val.published_text,
        draft: val.draft_text,
      };
    }
    return result;
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('page_content')
    .select('section_id, published_text, draft_text')
    .eq('project_id', projectId);

  if (error) {
    console.error('getAllContent error:', error);
    return {};
  }

  const result: Record<string, { published: string | null; draft: string | null }> = {};
  for (const row of data ?? []) {
    result[row.section_id] = {
      published: row.published_text,
      draft: row.draft_text,
    };
  }
  return result;
}

/**
 * Delete a content entry from DB so the code default takes effect again.
 */
export async function deleteContentEntry(sectionId: string) {
  'use server';
  const projectId = getProjectId();

  if (!isSupabaseConfigured()) {
    const key = `${projectId}::${sectionId}`;
    delete localStore[key];
    return { success: true };
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { error: delError } = await supabase
    .from('page_content')
    .delete()
    .eq('project_id', projectId)
    .eq('section_id', sectionId);

  if (delError) {
    console.error('deleteContentEntry error:', delError);
    return { success: false, error: delError.message };
  }

  return { success: true };
}
