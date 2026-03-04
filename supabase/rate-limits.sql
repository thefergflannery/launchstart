-- IP-based rate limiting for unauthenticated scan requests

CREATE TABLE public.rate_limits (
  ip_hash    TEXT    NOT NULL,
  endpoint   TEXT    NOT NULL,
  scan_date  DATE    NOT NULL DEFAULT CURRENT_DATE,
  count      INT     NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, endpoint, scan_date)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies: only accessible via SECURITY DEFINER function below

-- ── Rate limit check + increment (atomic) ─────────────
-- Returns TRUE if the request is allowed, FALSE if limit exceeded
CREATE OR REPLACE FUNCTION public.check_and_increment_rate_limit(
  p_ip_hash    TEXT,
  p_endpoint   TEXT,
  p_max_per_day INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  INSERT INTO rate_limits (ip_hash, endpoint, scan_date, count)
    VALUES (p_ip_hash, p_endpoint, CURRENT_DATE, 1)
  ON CONFLICT (ip_hash, endpoint, scan_date)
    DO UPDATE SET count = rate_limits.count + 1
  RETURNING count INTO v_count;

  RETURN v_count <= p_max_per_day;
END;
$$;

-- Grant execute to anon role so API routes using anon key can call it
GRANT EXECUTE ON FUNCTION public.check_and_increment_rate_limit TO anon;

-- ── Add user_id to scans (optional, for dashboard history) ─────
ALTER TABLE public.scans
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users ON DELETE SET NULL;

-- Authenticated users can view their own scans
CREATE POLICY "Users can view own scans"
  ON public.scans FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);
