'use server';

import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

// ============================================================
// UNIVERZÁLNÍ SERVER ACTIONS PRO SPRÁVU OBRÁZKŮ
// Cloudinary (fyzické úložiště) + Supabase (metadata)
//
// Podporuje dynamický zápis do libovolné tabulky:
//   table_name  – do které Supabase tabulky zapsat
//   row_id      – ID řádku (hodnota pro sloupec "id")
//   column_name – název sloupce, kam se uloží image_url
//
// Původní page_images tabulka funguje dál jako fallback
// pro starší EditableImage komponentu (section_id režim).
// ============================================================

// ---------- CLOUDINARY FOLDER ----------
// Veškeré obrázky se ukládají do této složky
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

// Whitelist tabulek, do kterých je povoleno zapisovat (bezpečnost)
const ALLOWED_TABLES = ['page_images', 'page_content'];

function validateTableName(name: string): boolean {
  // Povolíme pouze whitelistované tabulky
  // Přidej sem další, pokud budeš potřebovat
  return ALLOWED_TABLES.includes(name);
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
// UNIVERZÁLNÍ UPLOAD
// ============================================================

/**
 * Upload obrázku do Cloudinary → uložení URL do Supabase.
 *
 * FormData musí obsahovat:
 *   file         – soubor (File)
 *   table_name   – název tabulky v Supabase (default: "page_images")
 *   row_id       – ID řádku (pro page_images = section_id, pro jiné = numeric id)
 *   column_name  – sloupec pro URL (default: "image_url")
 *
 * Pro zpětnou kompatibilitu podporuje i starý formát:
 *   sectionId    – section_id pro page_images tabulku
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File | null;

    // Nový univerzální formát
    const tableName = (formData.get('table_name') as string) || 'page_images';
    const rowId = (formData.get('row_id') as string) || (formData.get('sectionId') as string);
    const columnName = (formData.get('column_name') as string) || 'image_url';

    if (!file) {
      return { success: false, error: 'Chybí soubor.' };
    }
    if (!rowId) {
      return { success: false, error: 'Chybí row_id (identifikátor záznamu).' };
    }
    if (!validateTableName(tableName)) {
      return { success: false, error: `Tabulka "${tableName}" není povolena.` };
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

    // Upload do Cloudinary — vždy do složky "majda_martinska"
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_FOLDER,
      resource_type: 'image',
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;
    const width = uploadResult.width;
    const height = uploadResult.height;

    // Uložení do Supabase
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      if (tableName === 'page_images') {
        // Speciální logika pro page_images (section_id režim)
        const projectId = getProjectId();
        const { error: dbError } = await supabase.from('page_images').upsert(
          {
            project_id: projectId,
            section_id: rowId,
            image_url: imageUrl,
            cloudinary_public_id: publicId,
            width,
            height,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'project_id,section_id' }
        );

        if (dbError) {
          console.error('Supabase save error (page_images):', dbError);
          return {
            success: true,
            imageUrl, publicId, width, height,
            error: `Nahrán do Cloudinary, ale DB selhalo: ${dbError.message}`,
          };
        }
      } else {
        // Univerzální zápis do libovolné tabulky
        const { error: dbError } = await supabase
          .from(tableName)
          .update({ [columnName]: imageUrl })
          .eq('id', rowId);

        if (dbError) {
          console.error(`Supabase save error (${tableName}):`, dbError);
          return {
            success: true,
            imageUrl, publicId, width, height,
            error: `Nahrán do Cloudinary, ale DB selhalo: ${dbError.message}`,
          };
        }
      }
    }

    // Revalidate all pages so they pick up the new image
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
// UNIVERZÁLNÍ DELETE
// ============================================================

/**
 * Smazání obrázku z Cloudinary + vyčištění záznamu v Supabase.
 *
 * Parametry:
 *   cloudinaryPublicId – public_id obrázku v Cloudinary (povinné pro fyzické smazání)
 *   table_name         – tabulka v Supabase
 *   row_id             – ID řádku
 *   column_name        – sloupec s URL (nastaví se na null)
 *
 * Pro zpětnou kompatibilitu: pokud se předá jen sectionId,
 * smaže z page_images + Cloudinary.
 */
export async function deleteImage(params: {
  cloudinaryPublicId?: string;
  tableName?: string;
  rowId: string;
  columnName?: string;
} | string): Promise<DeleteResult> {
  try {
    // Zpětná kompatibilita — starý formát: deleteImage("section.id")
    let cloudinaryPublicId: string | undefined;
    let tableName: string;
    let rowId: string;
    let columnName: string;

    if (typeof params === 'string') {
      // Starý formát — section_id
      tableName = 'page_images';
      rowId = params;
      columnName = 'image_url';
    } else {
      cloudinaryPublicId = params.cloudinaryPublicId;
      tableName = params.tableName || 'page_images';
      rowId = params.rowId;
      columnName = params.columnName || 'image_url';
    }

    if (!rowId) {
      return { success: false, error: 'Chybí rowId.' };
    }
    if (!validateTableName(tableName)) {
      return { success: false, error: `Tabulka "${tableName}" není povolena.` };
    }

    const projectId = getProjectId();

    // 1) Najít cloudinary_public_id pokud nebyl předán
    if (!cloudinaryPublicId && isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      if (tableName === 'page_images') {
        const { data } = await supabase
          .from('page_images')
          .select('cloudinary_public_id')
          .eq('project_id', projectId)
          .eq('section_id', rowId)
          .single();
        cloudinaryPublicId = data?.cloudinary_public_id ?? undefined;
      }
      // Pro ostatní tabulky potřebujeme public_id z props
    }

    // 2) Smazat z Cloudinary
    if (cloudinaryPublicId && isCloudinaryConfigured()) {
      configureCloudinary();
      const destroyResult = await cloudinary.uploader.destroy(cloudinaryPublicId);
      if (destroyResult.result !== 'ok' && destroyResult.result !== 'not found') {
        console.error('Cloudinary destroy failed:', destroyResult);
        return { success: false, error: 'Smazání z Cloudinary selhalo.' };
      }
    }

    // 3) Smazat/vyčistit záznam v Supabase
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      if (tableName === 'page_images') {
        // Pro page_images smažeme celý řádek
        const { error: deleteError } = await supabase
          .from('page_images')
          .delete()
          .eq('project_id', projectId)
          .eq('section_id', rowId);

        if (deleteError) {
          console.error('Supabase delete error:', deleteError);
          return { success: false, error: `DB smazání selhalo: ${deleteError.message}` };
        }
      } else {
        // Pro ostatní tabulky nastavíme sloupec na null
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ [columnName]: null })
          .eq('id', rowId);

        if (updateError) {
          console.error('Supabase update error:', updateError);
          return { success: false, error: `DB update selhalo: ${updateError.message}` };
        }
      }
    }

    // Revalidate all pages so they pick up the removed image
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
// READ – čtení obrázků z page_images (pro EditableImage)
// ============================================================

export async function getImage(sectionId: string): Promise<ImageRecord | null> {
  try {
    const projectId = getProjectId();
    if (!isSupabaseConfigured()) return null;

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('page_images')
      .select('image_url, cloudinary_public_id, width, height')
      .eq('project_id', projectId)
      .eq('section_id', sectionId)
      .single();

    if (error || !data) return null;
    return data as ImageRecord;
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
      .from('page_images')
      .select('section_id, image_url, cloudinary_public_id, width, height')
      .eq('project_id', projectId);

    if (error || !data) return {};

    const result: Record<string, ImageRecord> = {};
    for (const row of data) {
      result[row.section_id] = {
        image_url: row.image_url,
        cloudinary_public_id: row.cloudinary_public_id,
        width: row.width,
        height: row.height,
      };
    }
    return result;
  } catch {
    return {};
  }
}
