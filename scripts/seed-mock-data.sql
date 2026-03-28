-- ============================================================
-- Nanku Mock Data Seed
-- Run against your Supabase database (SQL Editor or psql)
-- to populate reservations for development / preview.
--
-- Safe to re-run: clears mock rows first.
-- TODAY = 2026-03-27 (adjust if needed)
-- ============================================================

-- 1. Ensure extended columns exist (added after initial migration)
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS zone         TEXT,
  ADD COLUMN IF NOT EXISTS table_ids    TEXT[],
  ADD COLUMN IF NOT EXISTS source       TEXT,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

-- 2. Remove previous mock rows (keyed by source = 'mock')
DELETE FROM public.reservations WHERE source = 'mock';

-- 3. Insert mock reservations
-- ──────────────────────────────────────────────────────────
-- TODAY 2026-03-27 · LUNCH
-- ──────────────────────────────────────────────────────────
INSERT INTO public.reservations
  (name, email, phone, date, time, party_size, status, notes,
   zone, table_ids, source, confirmed_at, created_at)
VALUES

  -- 12:00 Salón
  ('Familia Mora', 'mora.familia@gmail.com', '88001234',
   '2026-03-27', '12:00', '4', 'confirmed', 'Celebración familiar, ventana si es posible',
   'salon', ARRAY['01SA'], 'mock', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '6 hours'),

  -- 12:00 Terraza
  ('Café Digital S.A.', 'reservas@cafeDigital.cr', '22334455',
   '2026-03-27', '12:00', '6', 'confirmed', 'Almuerzo de equipo, factura a nombre de empresa',
   'terraza', ARRAY['03TE','04TE'], 'mock', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '5 hours'),

  -- 12:30 Salón
  ('Andrea Vindas', 'avindas@gmail.com', '70002345',
   '2026-03-27', '12:30', '2', 'pending', NULL,
   'salon', ARRAY['02SA'], 'mock', NULL, NOW() - INTERVAL '1 hour'),

  -- 13:00 Salón
  ('Grupo Hernández', 'hern.grupo@outlook.com', '83456789',
   '2026-03-27', '13:00', '7', 'confirmed', 'Reunión de negocios',
   'salon', ARRAY['04SA'], 'mock', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '8 hours'),

  -- 13:00 Terraza
  ('Carlos Quesada', 'cquesada@hotmail.com', '69871234',
   '2026-03-27', '13:00', '3', 'pending', 'Nos vemos en 10 min, venimos tarde',
   'terraza', ARRAY['07TE'], 'mock', NULL, NOW() - INTERVAL '30 minutes'),

  -- 13:30 Salón (combined tables)
  ('Cumpleaños Vargas', 'vargas.cumple@gmail.com', '88889999',
   '2026-03-27', '13:30', '12', 'confirmed', 'Festejo de cumpleaños, traen pastel propio',
   'salon', ARRAY['08SA','09SA','10SA'], 'mock', NOW() - INTERVAL '24 hours', NOW() - INTERVAL '30 hours'),

-- ──────────────────────────────────────────────────────────
-- TODAY 2026-03-27 · DINNER
-- ──────────────────────────────────────────────────────────

  -- 18:00 Terraza
  ('Aniversario Solano', 'jsolano@gmail.com', '77665544',
   '2026-03-27', '18:00', '4', 'confirmed', 'Aniversario de bodas, decoración romántica si es posible',
   'terraza', ARRAY['01TE','02TE'], 'mock', NOW() - INTERVAL '48 hours', NOW() - INTERVAL '72 hours'),

  -- 18:00 Salón
  ('Diego Arce', 'd.arce@proton.me', '62223333',
   '2026-03-27', '18:00', '4', 'pending', NULL,
   'salon', ARRAY['03SA'], 'mock', NULL, NOW() - INTERVAL '2 hours'),

  -- 18:30 Terraza
  ('María Castro', 'mcastro@gmail.com', '84445566',
   '2026-03-27', '18:30', '2', 'confirmed', 'Mesa con vista al jardín',
   'terraza', ARRAY['05TE'], 'mock', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '7 hours'),

  -- 19:00 Salón (06SA+07SA are one unit)
  ('Grupo López', 'gruplopez@empresa.cr', '22001100',
   '2026-03-27', '19:00', '8', 'confirmed', 'Cena corporativa, menú ejecutivo x8',
   'salon', ARRAY['06SA','07SA'], 'mock', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '18 hours'),

  -- 19:00 Terraza
  ('Roberto Jiménez', 'rjimenez@outlook.com', '71112222',
   '2026-03-27', '19:00', '4', 'pending', 'Viene con niños',
   'terraza', ARRAY['08TE'], 'mock', NULL, NOW() - INTERVAL '45 minutes'),

  -- 19:30 Salón
  ('Despedida Chaves', 'despedida.chaves@gmail.com', '85556677',
   '2026-03-27', '19:30', '6', 'confirmed', 'Despedida de soltero, sorpresa',
   'salon', ARRAY['05SA'], 'mock', NOW() - INTERVAL '36 hours', NOW() - INTERVAL '42 hours'),

  -- 19:30 Terraza (combined)
  ('Consultores CR', 'eventos@consultores.cr', '22998877',
   '2026-03-27', '19:30', '7', 'confirmed', 'Factura a empresa, menú sin gluten para 2 personas',
   'terraza', ARRAY['10TE','11TE'], 'mock', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '25 hours'),

  -- 20:00 Salón
  ('Pareja González', 'gonzalez.pareja@gmail.com', '68882222',
   '2026-03-27', '20:00', '2', 'confirmed', NULL,
   'salon', ARRAY['10SA'], 'mock', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '10 hours'),

  -- 20:00 Terraza
  ('Sofía Aguilar', 'sofi.aguilar@yahoo.com', '73331111',
   '2026-03-27', '20:00', '3', 'pending', 'Llega en taxi, avísenle si hay donde parquear',
   'terraza', ARRAY['12TE'], 'mock', NULL, NOW() - INTERVAL '15 minutes'),

  -- 20:30 Salón
  ('Jorge Rodríguez', 'jrodriguez@gmail.com', '86667788',
   '2026-03-27', '20:30', '5', 'confirmed', NULL,
   'salon', ARRAY['01SA'], 'mock', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '14 hours'),

  -- 21:00 Terraza
  ('Noche Ramírez', 'ramirez.n@gmail.com', '79990000',
   '2026-03-27', '21:00', '4', 'confirmed', 'Última mesa disponible',
   'terraza', ARRAY['06TE'], 'mock', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '5 hours'),

-- ──────────────────────────────────────────────────────────
-- YESTERDAY 2026-03-26
-- ──────────────────────────────────────────────────────────

  ('Familia Brenes', 'brenes@gmail.com', '88771122',
   '2026-03-26', '19:00', '4', 'cancelled', 'Cancelaron por enfermedad',
   'terraza', ARRAY['09TE','10TE'], 'mock', NULL, NOW() - INTERVAL '2 days'),

  ('Pedro Ulate', 'p.ulate@gmail.com', '71234000',
   '2026-03-26', '20:00', '2', 'no_show', NULL,
   'salon', ARRAY['09SA'], 'mock', NOW() - INTERVAL '28 hours', NOW() - INTERVAL '32 hours'),

  ('Grupo Torres', 'gtorres@hotmail.com', '83210001',
   '2026-03-26', '19:30', '6', 'confirmed', NULL,
   'terraza', ARRAY['01TE','02TE','03TE'], 'mock', NOW() - INTERVAL '50 hours', NOW() - INTERVAL '54 hours'),

  ('Valentina Mora', 'vmora@gmail.com', '60001234',
   '2026-03-26', '12:30', '3', 'confirmed', NULL,
   'salon', ARRAY['03SA'], 'mock', NOW() - INTERVAL '27 hours', NOW() - INTERVAL '28 hours'),

  ('Luis Salas', 'lsalas@yahoo.com', '84567890',
   '2026-03-26', '13:00', '2', 'no_show', 'No contestó el teléfono',
   'terraza', ARRAY['05TE'], 'mock', NULL, NOW() - INTERVAL '26 hours'),

-- ──────────────────────────────────────────────────────────
-- TOMORROW 2026-03-28
-- ──────────────────────────────────────────────────────────

  ('Cumpleaños Jiménez', 'jimfam@gmail.com', '88990011',
   '2026-03-28', '20:00', '8', 'confirmed', 'Cumpleaños 15 años, decoración incluida',
   'salon', ARRAY['04SA','05SA'], 'mock', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '4 hours'),

  ('Empresa ABC', 'eventos@abc.cr', '22114455',
   '2026-03-28', '19:00', '6', 'pending', 'Esperando confirmar asistentes',
   'terraza', ARRAY['07TE','08TE'], 'mock', NULL, NOW() - INTERVAL '2 hours'),

  ('Pareja Salazar', 'salazar.pareja@gmail.com', '75551234',
   '2026-03-28', '19:30', '2', 'confirmed', 'Cena romántica',
   'terraza', ARRAY['13TE'], 'mock', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '3 hours'),

  ('Almuerzos Rojas', 'rojas.co@gmail.com', '61234567',
   '2026-03-28', '12:00', '4', 'pending', NULL,
   'salon', ARRAY['02SA'], 'mock', NULL, NOW() - INTERVAL '1 hour'),

-- ──────────────────────────────────────────────────────────
-- WALK-INS & WHATSAPP (no table assigned, varied sources)
-- ──────────────────────────────────────────────────────────

  ('Walk-in Fernández', 'walk.in@nanku.com', '00000000',
   '2026-03-27', '19:00', '3', 'confirmed', 'Entraron sin reserva, se les ubicó',
   'terraza', NULL, 'mock', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),

  ('Reserva WhatsApp', 'whatsapp@nanku.com', '87654321',
   '2026-03-27', '20:00', '2', 'pending', 'Reservó por WhatsApp, sin confirmación de mesa',
   NULL, NULL, 'mock', NULL, NOW() - INTERVAL '20 minutes');

-- ──────────────────────────────────────────────────────────
-- Done!  Query to verify:
-- SELECT date, time, zone, table_ids, name, party_size, status
-- FROM public.reservations
-- WHERE source = 'mock'
-- ORDER BY date, time;
-- ──────────────────────────────────────────────────────────
