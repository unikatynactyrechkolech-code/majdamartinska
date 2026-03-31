'use server';

import { revalidatePath } from 'next/cache';

// ============================================================
// SERVER ACTIONS PRO BLOG
// CRUD operace nad tabulkou blog_posts v Supabase
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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  content: string | null;
  excerpt: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface SaveBlogPostInput {
  id?: string;           // pokud existuje → update, jinak insert
  title: string;
  slug: string;
  cover_image?: string | null;
  content?: string | null;
  excerpt?: string | null;
  published?: boolean;
}

export interface SaveResult {
  success: boolean;
  post?: BlogPost;
  error?: string;
}

// ============================================================
// SAVE (upsert)
// ============================================================

export async function saveBlogPost(input: SaveBlogPostInput): Promise<SaveResult> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase není nakonfigurováno.' };
    }

    if (!input.title?.trim()) {
      return { success: false, error: 'Nadpis je povinný.' };
    }
    if (!input.slug?.trim()) {
      return { success: false, error: 'Slug je povinný.' };
    }

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const now = new Date().toISOString();
    const isPublishing = input.published === true;

    const payload = {
      project_id: projectId,
      title: input.title.trim(),
      slug: input.slug.trim(),
      cover_image: input.cover_image || null,
      content: input.content || null,
      excerpt: input.excerpt || null,
      published: input.published ?? false,
      updated_at: now,
      ...(isPublishing ? { published_at: now } : {}),
    };

    let result;

    if (input.id) {
      // Update
      const { data, error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', input.id)
        .eq('project_id', projectId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      result = data;
    } else {
      // Insert
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(payload)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      result = data;
    }

    revalidatePath('/blog');
    revalidatePath('/');
    return { success: true, post: result as BlogPost };
  } catch (err) {
    console.error('saveBlogPost error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba.',
    };
  }
}

// ============================================================
// GET ALL
// ============================================================

export async function getBlogPosts(onlyPublished = false): Promise<BlogPost[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (onlyPublished) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as BlogPost[];
  } catch {
    return [];
  }
}

// ============================================================
// GET BY SLUG
// ============================================================

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!isSupabaseConfigured()) return null;

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('project_id', projectId)
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}

// ============================================================
// GET BY ID
// ============================================================

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    if (!isSupabaseConfigured()) return null;

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('project_id', projectId)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase není nakonfigurováno.' };
    }

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('project_id', projectId);

    if (error) return { success: false, error: error.message };

    revalidatePath('/blog');
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba.',
    };
  }
}

// ============================================================
// Cloudinary upload for blog inline images
// (reuses existing Cloudinary config from images.ts)
// ============================================================

export async function uploadBlogImage(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get('file') as File | null;
    if (!file) return { success: false, error: 'Chybí soubor.' };

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Nepovolený formát.' };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Max 10 MB.' };
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
      folder: 'majda_martinska/blog',
      resource_type: 'image',
    });

    return { success: true, url: result.secure_url };
  } catch (err) {
    console.error('uploadBlogImage error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Chyba při nahrávání.',
    };
  }
}
