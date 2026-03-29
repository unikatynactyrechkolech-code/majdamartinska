'use server';

import { v2 as cloudinary } from 'cloudinary';

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

// ---------- types ----------

interface UploadResult {
  success: boolean;
  imageUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  error?: string;
}

interface DeleteResult {
  success: boolean;
  error?: string;
}

interface ImageRecord {
  section_id: string;
  image_url: string;
  cloudinary_public_id: string;
  width: number | null;
  height: number | null;
}

// ---------- upload ----------

/**
 * Upload an image to Cloudinary via Server Action (secure — API secret never leaves the server).
 * Then save the returned URL + public_id into Supabase `page_images`.
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null;
    const sectionId = formData.get('sectionId') as string | null;

    if (!file || !sectionId) {
      return { success: false, error: 'Chybí soubor nebo sectionId.' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Nepovolený formát. Povoleny: JPG, PNG, WebP, AVIF, GIF.' };
    }

    // Validate file size (max 10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'Soubor je příliš velký. Max 10 MB.' };
    }

    if (!isCloudinaryConfigured()) {
      return { success: false, error: 'Cloudinary není nakonfigurováno. Zkontrolujte ENV proměnné.' };
    }

    configureCloudinary();
    const projectId = getProjectId();

    // Convert File to base64 data URI for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: `majda-web/${projectId}`,
      resource_type: 'image',
      // Automatic quality & format optimization
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;
    const width = uploadResult.width;
    const height = uploadResult.height;

    // Save to Supabase
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const { error: dbError } = await supabase.from('page_images').upsert(
        {
          project_id: projectId,
          section_id: sectionId,
          image_url: imageUrl,
          cloudinary_public_id: publicId,
          width,
          height,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'project_id,section_id' }
      );

      if (dbError) {
        console.error('Supabase save error:', dbError);
        // Image is uploaded to Cloudinary but DB failed — still return success with a warning
        return {
          success: true,
          imageUrl,
          publicId,
          width,
          height,
          error: `Obrázek nahrán do Cloudinary, ale DB uložení selhalo: ${dbError.message}`,
        };
      }
    } else {
      console.log(`[CMS][${projectId}] Image uploaded (no Supabase):`, sectionId, imageUrl);
    }

    return { success: true, imageUrl, publicId, width, height };
  } catch (err) {
    console.error('uploadImage error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba při nahrávání.',
    };
  }
}

// ---------- delete ----------

/**
 * Delete image from Cloudinary AND remove from Supabase `page_images`.
 */
export async function deleteImage(sectionId: string): Promise<DeleteResult> {
  try {
    if (!sectionId) {
      return { success: false, error: 'Chybí sectionId.' };
    }

    const projectId = getProjectId();

    // 1) Find the record in Supabase to get cloudinary_public_id
    let publicId: string | null = null;

    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const { data, error: fetchError } = await supabase
        .from('page_images')
        .select('cloudinary_public_id')
        .eq('project_id', projectId)
        .eq('section_id', sectionId)
        .single();

      if (fetchError) {
        console.error('Fetch image record error:', fetchError);
        return { success: false, error: `Záznam nenalezen: ${fetchError.message}` };
      }

      publicId = data?.cloudinary_public_id ?? null;
    }

    // 2) Delete from Cloudinary
    if (publicId && isCloudinaryConfigured()) {
      configureCloudinary();
      const destroyResult = await cloudinary.uploader.destroy(publicId);
      if (destroyResult.result !== 'ok' && destroyResult.result !== 'not found') {
        console.error('Cloudinary destroy failed:', destroyResult);
        return { success: false, error: 'Smazání z Cloudinary selhalo.' };
      }
    }

    // 3) Delete record from Supabase
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const { error: deleteError } = await supabase
        .from('page_images')
        .delete()
        .eq('project_id', projectId)
        .eq('section_id', sectionId);

      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
        return { success: false, error: `DB smazání selhalo: ${deleteError.message}` };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('deleteImage error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Neznámá chyba při mazání.',
    };
  }
}

// ---------- read ----------

/**
 * Get image data for a specific section.
 */
export async function getImage(sectionId: string): Promise<ImageRecord | null> {
  try {
    const projectId = getProjectId();

    if (!isSupabaseConfigured()) return null;

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('page_images')
      .select('section_id, image_url, cloudinary_public_id, width, height')
      .eq('project_id', projectId)
      .eq('section_id', sectionId)
      .single();

    if (error || !data) return null;

    return data as ImageRecord;
  } catch {
    return null;
  }
}

/**
 * Get all images for the project (for hydration).
 */
export async function getAllImages(): Promise<Record<string, ImageRecord>> {
  try {
    const projectId = getProjectId();

    if (!isSupabaseConfigured()) return {};

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('page_images')
      .select('section_id, image_url, cloudinary_public_id, width, height')
      .eq('project_id', projectId);

    if (error || !data) return {};

    const result: Record<string, ImageRecord> = {};
    for (const row of data) {
      result[row.section_id] = row as ImageRecord;
    }
    return result;
  } catch {
    return {};
  }
}
