-- Create join_requests table for candidate team applications
CREATE TABLE IF NOT EXISTS public.join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Allow public anyone to submit a join application
CREATE POLICY "Allow public insert to join_requests"
    ON public.join_requests
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow authenticated admins to view, review, and manage join requests
CREATE POLICY "Allow admin full access to join_requests"
    ON public.join_requests
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );
