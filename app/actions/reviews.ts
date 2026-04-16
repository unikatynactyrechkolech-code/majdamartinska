'use server';

import { revalidatePath } from 'next/cache';

// ============================================================
// SERVER ACTIONS PRO RECENZE
// CRUD operace nad tabulkou reviews v Supabase
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

// ---------- types ----------

export interface Review {
  id: string;
  name: string;
  name_en: string | null;
  type: string;
  type_en: string | null;
  text: string;
  text_en: string | null;
  profile_image: string | null;
  stars: number;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaveReviewInput {
  id?: string;
  name: string;
  name_en?: string | null;
  type: string;
  type_en?: string | null;
  text: string;
  text_en?: string | null;
  profile_image?: string | null;
  stars?: number;
  sort_order?: number;
  visible?: boolean;
}

export interface SaveResult {
  success: boolean;
  review?: Review;
  error?: string;
}

// ============================================================
// GET ALL
// ============================================================

export async function getReviews(onlyVisible = false): Promise<Review[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    let query = supabase
      .from('reviews')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (onlyVisible) {
      query = query.eq('visible', true);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as Review[];
  } catch {
    return [];
  }
}

// ============================================================
// SAVE (upsert)
// ============================================================

export async function saveReview(input: SaveReviewInput): Promise<SaveResult> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase není nakonfigurováno.' };
    }

    if (!input.name?.trim()) return { success: false, error: 'Jméno je povinné.' };
    if (!input.text?.trim()) return { success: false, error: 'Text recenze je povinný.' };
    if (!input.type?.trim()) return { success: false, error: 'Typ focení je povinný.' };

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const now = new Date().toISOString();

    const payload = {
      project_id: projectId,
      name: input.name.trim(),
      name_en: input.name_en?.trim() || null,
      type: input.type.trim(),
      type_en: input.type_en?.trim() || null,
      text: input.text.trim(),
      text_en: input.text_en?.trim() || null,
      profile_image: input.profile_image || null,
      stars: input.stars ?? 5,
      sort_order: input.sort_order ?? 999,
      visible: input.visible ?? true,
      updated_at: now,
    };

    let result;

    if (input.id) {
      const { data, error } = await supabase
        .from('reviews')
        .update(payload)
        .eq('id', input.id)
        .eq('project_id', projectId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      result = data;
    } else {
      const { data, error } = await supabase
        .from('reviews')
        .insert(payload)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      result = data;
    }

    revalidatePath('/recenze');
    return { success: true, review: result as Review };
  } catch (err) {
    console.error('saveReview error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba.',
    };
  }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteReview(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase není nakonfigurováno.' };
    }

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      .eq('project_id', projectId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/recenze');
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba.',
    };
  }
}

// ============================================================
// UPLOAD PROFILE IMAGE
// ============================================================

export async function uploadReviewImage(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get('file') as File | null;
    if (!file) return { success: false, error: 'Chybí soubor.' };

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Nepovolený formát (JPG, PNG, WebP, AVIF).' };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Max 5 MB.' };
    }

    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'majda_martinska/reviews',
      resource_type: 'image',
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    return { success: true, url: result.secure_url };
  } catch (err) {
    console.error('uploadReviewImage error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Chyba při nahrávání.',
    };
  }
}
