-- =============================================
-- DOPLNĚNÍ EXISTUJÍCÍCH OBRÁZKŮ DO DATABÁZE
-- =============================================
-- Tímto SQL příkazem vložíte do tabulky page_content URL adresy
-- existujících obrázků, aby je bylo možné spravovat přes CMS
-- (nahradit jiným obrázkem přes admin panel).
--
-- POZNÁMKA: Tyto obrázky jsou na format.creatorcdn.com (původní web),
-- NE na Cloudinary. Přes CMS je nelze "smazat" z původního serveru,
-- ale můžete je nahradit novým obrázkem přes upload.
-- Po uploadu nového obrázku se starý URL nahradí Cloudinary URL.
-- =============================================

-- Homepage: promise image
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.promise.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/287,0,1287,1000,580,580,1/0-0-0/abd0b8bc-40a7-4cba-a769-cbc568d41c13/1/2/_FFF5931.jpg?fjkss=exp=2088681039~hmac=22be9649398a9ea56ec377944dcd6bd02254347ecc8e43027ed7075709fe618c',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

-- Homepage: about preview image (profilová fotka)
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.about.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

-- Homepage: service cards
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.service1.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/06e2efcf-a3e9-465e-8ee2-1ffbfe3bda48/1/1/gina19.jpg?fjkss=exp=2090601184~hmac=f6e09f32babc81d97fb5dc6eeb4b8d8efcc0d358fc9a5b4ed84b9b6fb94be3d6',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.service2.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1500,1000,1600,1000/0-0-0/f18d0f78-d3a2-4eef-b2c1-1c88d24f62de/1/1/_FFF0538.jpg?fjkss=exp=2090601184~hmac=2a9bb2a77d2e8a6a2df8aa2c1cc8e42ba99e4eda9d56c8f8e42a6f7a1e44c2bd',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.service3.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/37,0,773,580,580,580,1/0-0-0/62e61db2-b7f2-4b7e-b9d3-ec2f2f51b506/1/2/svatba106.jpg?fjkss=exp=2090601184~hmac=aeb0fef7e36f66d5f7a80afe14d0b7c7e5a2d8f1c4b7e0d3a6c9b2e5f8d1a4c7',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

-- Homepage: more services (psí kamarádi, těhotenské, portréty)
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.more1.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,1000,1500,2500,1500/0-0-0/77a14f0b-d0aa-426b-9aa6-13318fb554aa/1/1/_FFF4817.jpg?fjkss=exp=2090606586~hmac=6d18ef0957232c473f0b7f06217a567cebd6320d8a1ad99e71700cb7762b65b1',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.more2.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'home.more3.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,800,1200,2500,1200/0-0-0/e73300d8-5661-4b60-8039-bd421a04ddfa/1/1/_FFF9854.jpg?fjkss=exp=2090606529~hmac=f08c05fa2ea1085f4bec130434e26a7aea32ecfea9dd8c5e22e555cf333f2d83',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

-- O mně: profilová fotka
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'omne.intro.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,999,999,1520,1520,1/0-0-0/c11ca67d-b1da-42ba-b398-a4483cfafa6e/1/2/mandarinkab.jpg?fjkss=exp=2088927692~hmac=4057268ac7beb84ef3e15484149ef0a30d91712645ea49bc32d3aca6b40f9f7d',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

-- Služby: všechny obrázky služeb
INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.rodinna.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/337,0,1337,1000,580,580,1/0-0-0/2b1abef9-f657-4d4d-af2d-f2ea0305c275/1/2/_FFF5852.jpg?fjkss=exp=2088926255~hmac=0e915221ac8400e348f232f2aaeb08aa4d77091d2dd68ad90e89e16f5a339864',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.newborn.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/105,0,1105,1000,580,580,1/0-0-0/e31af609-ffc4-4df0-9dd0-55164c01ae9c/1/2/beranci420.jpg?fjkss=exp=2088926256~hmac=f068764e9720bd72e5c31b1778dc5b3c9757133c8222f974f4fbd7a2070d2581',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.svatby.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/242,0,1242,1000,580,580,1/0-0-0/6a22c40a-2331-4783-8eda-c50263a4e231/1/2/_FFF6358-DeNoiseAI-standard.jpg?fjkss=exp=2088926256~hmac=048edc5062605e1fa227333279bc4d80d6f5dc521a10449af549312b0ba64723',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.psi.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/91,0,1091,1000,580,580,1/0-0-0/df099d74-dc42-4b6c-b83e-fb2200b54189/1/2/_FFF6743.jpg?fjkss=exp=2088926255~hmac=69a228dbb31ba452684c67584e88c7e9291798244e448bc468b9c8071a5c924a',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.tehotenske.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/0,0,2424,3650,1600,3650/0-0-0/72605f59-07d5-4cf7-a4dc-1102fb905c51/1/1/_DSC0107cb.jpg?fjkss=exp=2088681074~hmac=7ad23ece9e93b148e5817708a8f579689fc67819a6dd60cb67bdbc90bd35b52c',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

INSERT INTO page_content (project_id, section_id, image_url, updated_at)
VALUES ('majdamartinska', 'sluzby.portret.img',
  'https://format.creatorcdn.com/2ed32043-b515-4455-bb49-399bc9dcb3bf/0/0/0/269,0,1269,1000,580,580,1/0-0-0/03b7bbe1-7c1f-4167-adab-849497e1d2e2/1/2/_FFF0819.jpg?fjkss=exp=2088681039~hmac=b5673dbf2b60511a55402901e21d21c70b0de494fa1a65298258688c498e2a6e',
  NOW())
ON CONFLICT (project_id, section_id)
DO UPDATE SET image_url = EXCLUDED.image_url, updated_at = NOW();

-- =============================================
-- HOTOVO! Po spuštění tohoto SQL v Supabase SQL Editoru
-- budou všechny obrázky viditelné v admin panelu.
-- Přes admin (dvojklik na obrázek) je můžete nahradit
-- novým obrázkem uploadnutým do Cloudinary.
-- =============================================
