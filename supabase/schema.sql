-- Run this in the Supabase SQL editor to set up the scans table

CREATE TABLE public.scans (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  url         TEXT        NOT NULL,
  summary     TEXT        NOT NULL,          -- e.g. "14/17 checks passed"
  results     JSONB       NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reports (shareable links work without auth)
CREATE POLICY "Scans are publicly readable"
  ON public.scans FOR SELECT
  USING (true);

-- Allow anonymous inserts (the API route uses the anon key)
CREATE POLICY "Anyone can insert a scan"
  ON public.scans FOR INSERT
  WITH CHECK (true);
