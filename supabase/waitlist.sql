-- Run in Supabase SQL editor after schema.sql

CREATE TABLE public.waitlist (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can join the waitlist)
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  WITH CHECK (true);

-- Only service role can read (no public read)
