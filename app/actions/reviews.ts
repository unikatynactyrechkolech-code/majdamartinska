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
// STATIC SEED DATA — auto-inserted into DB if missing
// ============================================================

const SEED_REVIEWS = [
  { name: 'Pavla K.', type: 'Portrétní focení', text: 'Požádala jsem Majdu o fotografie pro web, který prezentuje mé konzultace. Přestože jsem přátelské a komunikativní povahy, nejsem typ člověka, který se potřebuje předvést před objektivem při každé příležitosti. Proto je pro mě cílené pózování před fotoaparátem výstup z komfortní zóny. Ale s Majdou šlo celé focení jako po másle. Z našeho setkání se stala nenucená procházka přírodou, kdy se člověk má prostor nejen nadechnout, ale také uvolnit. Takže nějaké to cvaknutí fotoaparátu už jej pak ani nerozhodí. Navíc je Majda velmi empatická, trpělivá a má neotřelé nápady na místa i způsoby, jak si člověka postavit. Člověk se tak nemusí cítit jako nějaká loutka nebo umělá figurína. Když mi přišel výsledek, byla jsem jedním slovem dojatá. Z vlastních fotek na mě dýchla taková pohoda, jakou jsem při focení cítila a také chci přes můj web předávat mým klientům. Přestože od focení s Majdou uplynul již nějaký čas, stále se na fotky dívám s velkou vděčností a ráda na to naše společné focení vzpomínám.', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/277,0,944,667,760,760,1/0-0-0/4c99907e-5e3e-47b8-ae54-7369b064686e/1/2/10M.jpg?fjkss=exp=2090919623~hmac=ce3e7c6dd1fa9b550f440089a22b44a4210343750b92c05df5c708d09df35a75', sort_order: 1 },
  { name: 'Anna B. (Prolhaná Anna)', type: 'Ateliérové focení', text: 'S Majdou spolupracuji už přes 10 let. Kromě fotek ateliérových, v exteriéru i svatebních, nyní rozšířila svou nabídku o natáčení videí. Kromě svatby jsem vyzkoušela všechny služby a můžu jen doporučit. Majda má neskutečný cit pro atmosféru a specifickou náladu fotky. Je plná nápadů, umí fotkou či videem vystihnout osobnost foceného. Nikdy se mi nestalo, že by mě štelovala do nepřirozených pozic nebo aranžovaných póz. Focení s ní je zábava a zároveň je velký profesionál — umí to jak s dětmi, tak se stydlivými dospělými. Také mám ráda její volnou tvorbu — velmi nápadité až snové fotky.', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/115,0,777,661,760,760,1/0-0-0/edbbb663-2ba2-42f7-b5c4-44890793798c/1/2/gina27.jpg?fjkss=exp=2090919623~hmac=4b155c06d14a539f3798ba4806f6db6cfa584b9746cda7045fd6b5c651173292', sort_order: 2 },
  { name: 'Katka K.', type: 'Rodinné focení', text: 'Spolupracovat s Majdou je úžasné. Mám tu čest z obou stran. Z profesionálního hlediska se jí nedá naprosto nic vytknout. Její práce je dokonalá. Jako člověk je poklad. Neustále úsměvavá, plná nápadů. Vlastní úžasný ateliér, ve kterém se cítíte jak v pohádce a tak vypadá i její spolupráce s vámi.', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/137,39,690,592,760,760,1/0-0-0/349ae2e3-df92-4681-a030-2aa2bca00875/1/2/DSC_9060.jpg?fjkss=exp=2090919623~hmac=30e7bbdd3afa847acee024891b0caf630b35045200f2e4aff9580310f8cfd82a', sort_order: 3 },
  { name: 'Pavlína N.', type: 'Rodinné focení', text: 'Majda nás fotila jednou v ateliéru a jednou za námi na focení přijela domů. Majda má talent, zachytit správný okamžik, během focení byla velmi přátelská a uvolněná nálada. O pár fotkách jsme měli představu předem, zbytek jsme nechali na Majdě, která měla spoustu skvělých nápadů na fotky. Fotky jsme obdrželi brzy 🙂', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/134,0,796,661,760,760,1/0-0-0/1c9eb9e5-b985-473c-99fe-a6bcfdd88523/1/2/laura16-DeNoiseAI-standard.jpg?fjkss=exp=2090919623~hmac=286b183a663af0e945dac29cf41f496c9ec26c09b01710120641e9ba68b9ac39', sort_order: 4 },
  { name: 'Jana H.', type: 'Rodinné focení', text: 'Kdo zná Majdu, moc dobře ví, že vyniká v mnoha oblastech a fotografie je rozhodně jednou z nich. Každá fotka má duši a nápad. Majdu znám velmi dlouho a její práce je opravdu dokonalá! Doporučuji všemi deseti!!!', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,599,599,760,760,1/0-0-0/ac0b5ade-1d3c-4658-8072-8bfd2196cc66/1/2/1403156454_large_dsc_0052.jpg?fjkss=exp=2090919623~hmac=aa94796293b2a7b2f23db17e0296e8634f467879968dea20a5f32713cee0d750', sort_order: 5 },
  { name: 'Michal L.', type: 'Rodinné focení', text: 'Velice příjemné focení a krásně strávený čas. Příjemné jednání a bezproblémová domluva. Paní fotografka má vytipovaných pár míst, které jsou moc hezké na fotky. Paní fotografka již v den focení zaslala náhled fotografií ze kterých si je možné následně vybrat. Upravené fotografie byly dodány ani ne za týden. Mohu jen doporučit.', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/296,0,1296,999,760,760,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2090919623~hmac=305b309b1a3b66c9e0d00ed67a35d052ee226576826fd079a83b0a596c3d29f6', sort_order: 6 },
  { name: 'Bára M.', type: 'Newborn focení', text: 'Naše spolupráce s Majdou byla naprosto úžasná. S naším 14 denním synem zacházela více než mateřsky. Celé focení bylo zcela v její režii a my si s partnerem mohli vypít v klidu kávu a popovídat. ☺️ Paní Majdu Martinskou mohu zcela doporučit, nejen díky úžasnému přístupu k synovi, ale hlavně fotografie od ní jsou plné něhy, lásky a profesionality. Ještě jednou mockrát děkujeme za krásné odpoledne a úžasné vzpomínky ve formě nádherných fotografií. Marešová', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/341,0,1341,999,760,760,1/0-0-0/465305c9-f66c-4175-b352-2218472c9b79/1/2/_FFF7991-SharpenAI-Softness.jpg?fjkss=exp=2090919623~hmac=05f012f47194b07c6b2e984bff30bbead52c8c6c423e9cc02f6109f6a5208fe9', sort_order: 7 },
  { name: 'Alice C.', type: 'Rodinné focení', text: 'Doporučuji všem!!!! Skvělá fotografka, fotky, které vznikají v naprosto pohodové atmosféře. Potřebovala bych pro hodnocení více hvězdiček, 5 * je za mě v tomto případě málo :o)', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/6307f6b1-d040-46e9-a09b-e1d7f0b123b4/1/2/_FFF3016+%282%29.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8', sort_order: 8 },
  { name: 'Petra M.', type: 'Rodinné focení', text: 'Chtěla bych napsat jen pár řádků, jestli bylo vše v pořádku, no tak tedy od začátku, nevyprávím vám pohádku, v domluvenou dobu denní, razili jsem na focení, počáteční naše tréma, hned nám byla rozprášena, samý úsměv, skvělá karma, to ti dají zcela zdarma, uvolníš se během chvíle, potom přijde spousta píle, celou dobu samý smích, všechno v profi kolejích, závěrem jsou fotky krásné, z kterých jen každý žasne, nemusíš pak vybrat lišku, ani spořitelní knížku, když dáš fotky na sítě, nával laiků, svalí tě. Můžeme jen doporučit 🤗. Majdí, díky za vše, jdem se chlubit.', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/a096d9ab-e562-48eb-988b-ea0246dddcf6/1/2/_FFF5743b.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8', sort_order: 9 },
  { name: 'Iveta V.', type: 'Newborn focení', text: 'Newborn focení u Majdy byla naprostá paráda, moc jsem si to užila a to i přes to, že jsem z něj předem měla velké obavy kvůli vzdorovitému období mé tříleté záškoďačky, která se prostě fotit „nechce a nebude", nicméně od Majdy se dokonce nechala přemluvit i na společné fotky se svojí dvoutýdenní sestřičkou. Byl to nesmírně příjemně strávený čas plný pohody a klidu, za který jsem obrovsky vděčná a díky kterému budeme mít již navždycky nádhernou vzpomínku. Budu se moc těšit na příští setkání (snad nás ještě Majda přijme, až třeba tu záškoďačku vzdor přejde) při dalším focení, kterého určitě velmi ráda při nejbližší možné příležitosti u Majdy využiji. Veliké díky za vše, fotky jsou překrásné...', profile_image: 'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1000,760,760,1/0-0-0/c5a007bb-a1a1-43e4-8df5-22c25afef071/1/2/429929096_737922395110204_1352912403146508007_n.jpg?fjkss=exp=2090919623~hmac=83506d2537607b825b52448dcae491926d90a43b3feee4156829a670c0d502c8', sort_order: 10 },
];

// ============================================================
// GET ALL (auto-seeds if DB has fewer than 10 reviews)
// ============================================================

export async function getReviews(onlyVisible = false): Promise<Review[]> {
  try {
    if (!isSupabaseConfigured()) return [];

    const projectId = getProjectId();
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    // Check count — if fewer than seed count, auto-seed missing ones
    const { count } = await supabase
      .from('reviews')
      .select('name', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (count !== null && count < SEED_REVIEWS.length) {
      // Get existing names to avoid duplicates
      const { data: existing } = await supabase
        .from('reviews')
        .select('name')
        .eq('project_id', projectId);
      const existingNames = new Set((existing ?? []).map((r: { name: string }) => r.name));
      const toInsert = SEED_REVIEWS
        .filter((s) => !existingNames.has(s.name))
        .map((s) => ({ ...s, project_id: projectId, stars: 5, visible: true }));
      if (toInsert.length > 0) {
        await supabase.from('reviews').insert(toInsert);
      }
    }

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
