-- Fix join_requests cross-device tracking: ensure anon can insert/select
-- Idempotent migration — safe to run even if previous migration applied

-- Ensure table exists (if prior migration missed)
CREATE TABLE IF NOT EXISTS public.join_requests (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    department TEXT NOT NULL,
    year_of_study TEXT NOT NULL,
    roles TEXT[] DEFAULT '{}',
    skills TEXT NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    experience TEXT,
    why_join TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Drop legacy policies (if any) to avoid duplicates/conflicts
DROP POLICY IF EXISTS "Allow public insert to join_requests" ON public.join_requests;
DROP POLICY IF EXISTS "Allow public select for tracking by id" ON public.join_requests;
DROP POLICY IF EXISTS "Allow admin full access to join_requests" ON public.join_requests;
DROP POLICY IF EXISTS "Allow anon insert" ON public.join_requests;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.join_requests;
DROP POLICY IF EXISTS "Allow anon select" ON public.join_requests;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.join_requests;
DROP POLICY IF EXISTS "Allow admin all" ON public.join_requests;

-- Public (anon + authenticated) can INSERT for new applications (cross-device submit)
CREATE POLICY "Allow anon insert" ON public.join_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON public.join_requests FOR INSERT TO authenticated WITH CHECK (true);

-- Public can SELECT for tracking by ID/email (cross-device status check)
CREATE POLICY "Allow anon select" ON public.join_requests FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated select" ON public.join_requests FOR SELECT TO authenticated USING (true);

-- Admin can do everything (status updates, deletes)
CREATE POLICY "Allow admin all" ON public.join_requests FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Optional: index for case-insensitive email lookup performance
CREATE INDEX IF NOT EXISTS idx_join_requests_email_lower ON public.join_requests (lower(email));
CREATE INDEX IF NOT EXISTS idx_join_requests_id_lower ON public.join_requests (lower(id));
