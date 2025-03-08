-- SQL script to fix permissions for the resources table

-- First, drop all existing policies on the resources table
DO $$
DECLARE
    pol_record RECORD;
BEGIN
    FOR pol_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'resources' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.resources', pol_record.policyname);
        RAISE NOTICE 'Dropped policy: %', pol_record.policyname;
    END LOOP;
END
$$;

-- Make sure RLS is enabled
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all authenticated users to SELECT
CREATE POLICY "Allow select for all authenticated users" ON public.resources
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Create a policy that allows admins to do everything
CREATE POLICY "Allow all for admins" ON public.resources
    FOR ALL
    TO authenticated
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
    WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- Also grant direct permissions to the anon and authenticated roles
GRANT SELECT ON public.resources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.resources TO authenticated;

-- Grant usage on the sequence (if any)
DO $$
DECLARE
    seq_name text;
BEGIN
    SELECT pg_get_serial_sequence('public.resources', 'id') INTO seq_name;
    IF seq_name IS NOT NULL THEN
        EXECUTE 'GRANT USAGE ON SEQUENCE ' || seq_name || ' TO authenticated';
    END IF;
END
$$;

-- Verify everything (with simplified output to avoid type errors)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE 'All policies for resources table:';
    FOR policy_record IN 
        SELECT policyname, cmd
        FROM pg_policies 
        WHERE tablename = 'resources' AND schemaname = 'public'
    LOOP
        RAISE NOTICE 'Policy: % (for %)', 
            policy_record.policyname,
            policy_record.cmd;
    END LOOP;
END
$$; 