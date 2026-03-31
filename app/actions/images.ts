'use server';

import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

// ============================================================
// SERVER ACTIONS PRO SPRÁVU OBRÁZKŮ
// Cloudinary (fyzické úložiště) + Supabase page_content (metadata)
//
// Obrázky se ukládají do sloupce "image_url" v tabulce page_content,
// identifikované přes section_id (stejně jako texty).
// Cloudinary public_id se parsuje z URL — nepotřebujeme extra sloupec.
// ============================================================

const CLOUDINARY_FOLDER = 'majda_martinska';

// ---------- helpers ----------

function getProjectId(): string {
  const id = process.env.NEXT_PUBLIC_PROJECT_ID;
  if (!id) throw new Error('NEXT_PUBLIC_PROJECT_ID is not set in .env.local');
  return id;
}

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://TVOJE-ID.supabase.co'
  );
}

function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
}

/**
 * Extrahuje Cloudinary public_id z URL.
 * Př: "https://res.cloudinary.com/xxx/image/upload/v123/majda_martinska/abc.jpg"
 *  → "majda_martinska/abc"
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (match) return match[1];
    return null;
  } catch {
    return null;
  }
}

// ---------- types ----------

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface ImageRecord {
  image_url: string;
  cloudinary_public_id: string;
  width: number | null;
  height: number | null;
}

// ============================================================
// UPLOAD — nahraje do Cloudinary, uloží URL do page_content
// ============================================================

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null;
    const sectionId = (formData.get('sectionId') as string) ||
                      (formData.get('row_id') as string);

    if (!file) {
      return { success: false, error: 'Chybí soubor.' };
    }
    if (!sectionId) {
      return { success: false, error: 'Chybí sectionId.' };
    }

    // Validace typu souboru
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Nepovolený formát. Povoleny: JPG, PNG, WebP, AVIF, GIF.' };
    }

    // Validace velikosti (max 10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'Soubor je příliš velký. Max 10 MB.' };
    }

    if (!isCloudinaryConfigured()) {
      return { success: false, error: 'Cloudinary není nakonfigurováno. Zkontrolujte ENV proměnné.' };
    }

    configureCloudinary();

    // Převod File → base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload do Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_FOLDER,
      resource_type: 'image',
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;
    const width = uploadResult.width;
    const height = uploadResult.height;

    // Uložení URL do page_content tabulky
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();
      const projectId = getProjectId();

      const { error: dbError } = await supabase.from('page_content').upsert(
        {
          project_id: projectId,
          section_id: sectionId,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'project_id,section_id' }
      );

      if (dbError) {
        console.error('Supabase save error:', dbError);
        return {
          success: true,
          imageUrl, publicId, width, height,
          error: `Nahrán do Cloudinary, ale DB selhalo: ${dbError.message}`,
        };
      }
    } else {
      console.warn('Supabase není nakonfigurováno — obrázek uložen pouze v Cloudinary.');
    }

    // Revalidate all pages
    revalidatePath('/', 'layout');

    return { success: true, imageUrl, publicId, width, height };
  } catch (err) {
    console.error('uploadImage error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba při nahrávání.',
    };
  }
}

// ============================================================
// DELETE — smaže z Cloudinary + vyčistí image_url v page_content
// ============================================================

export async function deleteImage(sectionId: string): Promise<DeleteResult> {
  try {
    if (!sectionId) {
      return { success: false, error: 'Chybí sectionId.' };
    }

    const projectId = getProjectId();
    let cloudinaryPublicId: string | null = null;

    // 1) Najít URL v DB, parsovat public_id
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const { data } = await supabase
        .from('page_content')
        .select('image_url')
        .eq('project_id', projectId)
        .eq('section_id', sectionId)
        .single();

      if (data?.image_url) {
        cloudinaryPublicId = extractPublicIdFromUrl(data.image_url);
      }
    }

    // 2) Smazat z Cloudinary
    if (cloudinaryPublicId && isCloudinaryConfigured()) {
      configureCloudinary();
      const destroyResult = await cloudinary.uploader.destroy(cloudinaryPublicId);
      if (destroyResult.result !== 'ok' && destroyResult.result !== 'not found') {
        console.error('Cloudinary destroy failed:', destroyResult);
        // Pokračujeme — aspoň smažeme z DB
      }
    }

    // 3) Vyčistit image_url v page_content
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const { error: updateError } = await supabase
        .from('page_content')
        .update({
          image_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('project_id', projectId)
        .eq('section_id', sectionId);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return { success: false, error: `DB update selhalo: ${updateError.message}` };
      }
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('deleteImage error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba při mazání.',
    };
  }
}

// ============================================================
// READ — čtení obrázku z page_content
// ============================================================

export async function getImage(sectionId: string): Promise<ImageRecord | null> {
  try {
    const projectId = getProjectId();
    if (!isSupabaseConfigured()) return null;

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('page_content')
      .select('image_url')
      .eq('project_id', projectId)
      .eq('section_id', sectionId)
      .single();

    if (error || !data || !data.image_url) return null;

    const publicId = extractPublicIdFromUrl(data.image_url);

    return {
      image_url: data.image_url,
      cloudinary_public_id: publicId || '',
      width: null,
      height: null,
    };
  } catch {
    return null;
  }
}

export async function getAllImages(): Promise<Record<string, ImageRecord>> {
  try {
    const projectId = getProjectId();
    if (!isSupabaseConfigured()) return {};

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('page_content')
      .select('section_id, image_url')
      .eq('project_id', projectId)
      .not('image_url', 'is', null);

    if (error || !data) return {};

    const result: Record<string, ImageRecord> = {};
    for (const row of data) {
      if (row.image_url) {
        const publicId = extractPublicIdFromUrl(row.image_url);
        result[row.section_id] = {
          image_url: row.image_url,
          cloudinary_public_id: publicId || '',
          width: null,
          height: null,
        };
      }
    }
    return result;
  } catch {
    return {};
  }
}

// ============================================================
// PORTFOLIO — get all portfolio gallery images by prefix
// ============================================================

export interface PortfolioImageRecord {
  sectionId: string;
  imageUrl: string;
  category: string;
}

export async function getPortfolioImages(): Promise<PortfolioImageRecord[]> {
  try {
    const projectId = getProjectId();
    if (!isSupabaseConfigured()) return [];

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('page_content')
      .select('section_id, image_url')
      .eq('project_id', projectId)
      .like('section_id', 'portfolio.gallery.%')
      .not('image_url', 'is', null)
      .order('section_id');

    if (error || !data) return [];

    return data
      .filter(row => row.image_url)
      .map(row => {
        // section_id format: portfolio.gallery.{category}.{index}
        const parts = row.section_id.split('.');
        const category = parts[2] || 'rodinna';
        return {
          sectionId: row.section_id,
          imageUrl: row.image_url,
          category,
        };
      });
  } catch {
    return [];
  }
}

export async function deletePortfolioImage(sectionId: string): Promise<DeleteResult> {
  return deleteImage(sectionId);
}

// ============================================================
// MARK DELETED — write tombstone to DB for static portfolio images
// so deletion persists across page refresh
// ============================================================

export async function markImageDeleted(sectionId: string): Promise<DeleteResult> {
  try {
    if (!sectionId) {
      return { success: false, error: 'Chybí sectionId.' };
    }

    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase není nakonfigurováno.' };
    }

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { error: dbError } = await supabase.from('page_content').upsert(
      {
        project_id: projectId,
        section_id: sectionId,
        image_url: '__deleted__',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id,section_id' }
    );

    if (dbError) {
      console.error('markImageDeleted error:', dbError);
      return { success: false, error: dbError.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err) {
    console.error('markImageDeleted error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba.',
    };
  }
}
