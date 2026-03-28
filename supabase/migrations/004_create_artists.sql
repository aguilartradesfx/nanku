-- ============================================================
-- Migration 004: Artists table + extended schedule columns
-- Run in Supabase SQL Editor BEFORE deploying the updated code.
-- ============================================================

-- 1. Create artists table
CREATE TABLE IF NOT EXISTS public.artists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  label       TEXT NOT NULL DEFAULT '',
  photo       TEXT NOT NULL DEFAULT '',
  bio         TEXT NOT NULL DEFAULT '',
  bio_es      TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique name so seed is idempotent
ALTER TABLE public.artists
  ADD CONSTRAINT artists_name_unique UNIQUE (name);

-- 2. Seed the 5 current artists
INSERT INTO public.artists (name, label, photo, bio, bio_es, sort_order, is_active) VALUES
  (
    'Andrés Rojas',
    'Rojas Blues',
    'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5e2304a4efae1be15c031.jpeg',
    'Costa Rican singer and guitarist blending rock, pop, and Latin classics. Lead vocalist of Curandera with over 20 years of experience. Influenced by Pink Floyd, Queen, Santana, and Maná.',
    'Cantante y guitarrista costarricense que mezcla rock, pop y clásicos latinos. Vocalista principal de Curandera con más de 20 años de experiencia. Influenciado por Pink Floyd, Queen, Santana y Maná.',
    0, true
  ),
  (
    'Esteban Calero',
    'Latin Loop Show',
    'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c611db69544cbe5cda9286.jpg',
    'Versatile musician known for his Latin sound and live loop pedal performances. Delivers full live arrangements in real time, adapting seamlessly to every atmosphere.',
    'Músico versátil conocido por su sonido latino y sus actuaciones en vivo con loop pedal. Entrega arreglos completamente en vivo en tiempo real, adaptándose a cada atmósfera.',
    1, true
  ),
  (
    'Chris Charía',
    'Rock & Trova',
    'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5e2305ebd49077774f391.jpeg',
    'Singer-songwriter with 31 years of national and international experience. Covers classic rock in Spanish and English, Latin music, trova, bolero, and reggae.',
    'Cantautor con 31 años de experiencia nacional e internacional. Interpreta rock clásico en español e inglés, música latina, trova, bolero y reggae.',
    2, true
  ),
  (
    'Bryan Villalobos',
    'Latin Loop Show',
    'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5e23081e6bcccfa756c06.jpeg',
    'Costa Rican musician blending Latin rhythms with global hits completely live. Performs at weddings, hotels, and private events across Costa Rica with original music on digital platforms.',
    'Músico costarricense que mezcla ritmos latinos con éxitos mundiales completamente en vivo. Actúa en bodas, hoteles y eventos privados en toda Costa Rica con música original en plataformas digitales.',
    3, true
  ),
  (
    'Nathan Bolívar',
    'Live Loop Artist',
    'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/69c5e2309619ac8584977e7d.jpeg',
    'Artist who builds songs in real time — layer by layer — merging rhythms, melodies, and voice. Influenced by funk, pop, and Latin sounds with a passion for music since age 12.',
    'Artista que construye canciones en tiempo real, capa a capa, fusionando ritmos, melodías y voz. Influenciado por el funk, pop y sonidos latinos con pasión por la música desde los 12 años.',
    4, true
  )
ON CONFLICT (name) DO NOTHING;

-- 3. Add artist_id FK and event_detail to live_music_schedule
ALTER TABLE public.live_music_schedule
  ADD COLUMN IF NOT EXISTS artist_id    UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS event_detail TEXT;

-- 4. Trigger for artists updated_at (set_updated_at() already exists from migration 001)
CREATE TRIGGER trg_artists_updated_at
  BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. RLS for artists
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read artists"
  ON public.artists FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage artists"
  ON public.artists FOR ALL TO authenticated USING (true) WITH CHECK (true);
