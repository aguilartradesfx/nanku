-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone_code  TEXT NOT NULL DEFAULT '+506',
  phone       TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TEXT NOT NULL,
  party_size  TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster status-based queries
CREATE INDEX IF NOT EXISTS idx_reservations_status
  ON public.reservations (status);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_reservations_date
  ON public.reservations (date);

-- Index for recent reservations (dashboard default sort)
CREATE INDEX IF NOT EXISTS idx_reservations_created_at
  ON public.reservations (created_at DESC);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert (public reservation form)
CREATE POLICY "Anyone can insert reservations"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: only authenticated users (admins) can read all reservations
CREATE POLICY "Authenticated users can read all reservations"
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: only authenticated users (admins) can update reservations
CREATE POLICY "Authenticated users can update reservations"
  ON public.reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: only authenticated users (admins) can delete reservations
CREATE POLICY "Authenticated users can delete reservations"
  ON public.reservations
  FOR DELETE
  TO authenticated
  USING (true);

-- Note: The API routes use the service role key for inserts and updates,
-- which bypasses RLS entirely. The policies above are applied when using
-- the anon or authenticated client keys directly.
