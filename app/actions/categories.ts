'use server';

import { revalidatePath } from 'next/cache';

// ============================================================
// SERVER ACTIONS PRO GALLERY CATEGORIES
// (dynamicke subkategorie pro /portfolio, /art, ...)
// ============================================================

function getProjectId(): string {
  const id = process.env.NEXT_PUBLIC_PROJECT_ID;
  if (!id) throw new Error('NEXT_PUBLIC_PROJECT_ID is not set');
  return id;
}

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://TVOJE-ID.supabase.co'
  );
}

export interface GalleryCategory {
  id: string;
  page: string;
  key: string;
  label: string;
  label_en: string | null;
  sort_order: number;
  visible: boolean;
}

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50);
}

// ============================================================
// LIST
// ============================================================

export async function getCategories(page: string): Promise<GalleryCategory[]> {
  try {
    if (!isSupabaseConfigured()) return [];
    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('gallery_categories')
      .select('*')
      .eq('project_id', projectId)
      .eq('page', page)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data as GalleryCategory[];
  } catch {
    return [];
  }
}

// ============================================================
// CREATE
// ============================================================

export interface CreateInput {
  page: string;
  key?: string;       // pokud chybi, generuje se z label
  label: string;
  label_en?: string;
}

export async function createCategory(
  input: CreateInput
): Promise<{ success: boolean; category?: GalleryCategory; error?: string }> {
  try {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase neni nakonfigurovano.' };
    if (!input.label?.trim()) return { success: false, error: 'Nazev je povinny.' };
    if (!input.page?.trim()) return { success: false, error: 'Stranka je povinna.' };

    const key = (input.key?.trim() ? toSlug(input.key) : toSlug(input.label));
    if (!key) return { success: false, error: 'Neplatny slug.' };

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    // Compute next sort_order
    const { data: existing } = await supabase
      .from('gallery_categories')
      .select('sort_order')
      .eq('project_id', projectId)
      .eq('page', input.page)
      .order('sort_order', { ascending: false })
      .limit(1);
    const nextSort = (existing?.[0]?.sort_order || 0) + 10;

    const { data, error } = await supabase
      .from('gallery_categories')
      .insert({
        project_id: projectId,
        page: input.page,
        key,
        label: input.label.trim(),
        label_en: input.label_en?.trim() || null,
        sort_order: nextSort,
        visible: true,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/portfolio');
    revalidatePath('/art');
    return { success: true, category: data as GalleryCategory };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Neznama chyba.' };
  }
}

// ============================================================
// UPDATE
// ============================================================

export interface UpdateInput {
  id: string;
  key?: string;
  label?: string;
  label_en?: string | null;
  visible?: boolean;
}

export async function updateCategory(
  input: UpdateInput
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase neni nakonfigurovano.' };
    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const patch: Record<string, unknown> = {};
    if (input.key !== undefined) {
      const k = toSlug(input.key);
      if (!k) return { success: false, error: 'Neplatny slug.' };
      patch.key = k;
    }
    if (input.label !== undefined) {
      if (!input.label.trim()) return { success: false, error: 'Nazev nesmi byt prazdny.' };
      patch.label = input.label.trim();
    }
    if (input.label_en !== undefined) patch.label_en = input.label_en?.trim() || null;
    if (input.visible !== undefined) patch.visible = input.visible;

    const { error } = await supabase
      .from('gallery_categories')
      .update(patch)
      .eq('id', input.id)
      .eq('project_id', projectId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/portfolio');
    revalidatePath('/art');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Neznama chyba.' };
  }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase neni nakonfigurovano.' };
    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { error } = await supabase
      .from('gallery_categories')
      .delete()
      .eq('id', id)
      .eq('project_id', projectId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/portfolio');
    revalidatePath('/art');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Neznama chyba.' };
  }
}

// ============================================================
// REORDER
// ============================================================

export async function reorderCategories(
  page: string,
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase neni nakonfigurovano.' };
    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const updates = orderedIds.map((id, index) =>
      supabase
        .from('gallery_categories')
        .update({ sort_order: (index + 1) * 10 })
        .eq('id', id)
        .eq('project_id', projectId)
        .eq('page', page)
    );

    const results = await Promise.all(updates);
    const firstError = results.find((r) => r.error)?.error;
    if (firstError) return { success: false, error: firstError.message };

    revalidatePath('/portfolio');
    revalidatePath('/art');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Neznama chyba.' };
  }
}
