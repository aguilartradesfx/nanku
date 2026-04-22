CREATE TABLE IF NOT EXISTS reschedule_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  proposed_times JSONB NOT NULL, -- Array: [{"time": "19:30", "table_ids": ["01SA"]}, ...]
  proposed_date DATE NOT NULL,
  original_date DATE NOT NULL,
  original_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'expired' | 'declined'
  accepted_time TEXT,
  accepted_table_ids JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reschedule_proposals_token ON reschedule_proposals(token);

ALTER TABLE reschedule_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read by token" ON reschedule_proposals
  FOR SELECT USING (true);

CREATE POLICY "Public update by token" ON reschedule_proposals
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated insert" ON reschedule_proposals
  FOR INSERT WITH CHECK (true);
