-- SQL script to create the resources table if it doesn't exist

-- Check if the resources table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'resources'
    ) THEN
        -- Create the resources table
        CREATE TABLE public.resources (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            title text NOT NULL,
            description text,
            subject text NOT NULL,
            grade text NOT NULL,
            type text NOT NULL,
            file_url text NOT NULL,
            file_name text NOT NULL,
            file_type text NOT NULL,
            file_size bigint NOT NULL,
            download_count integer DEFAULT 0,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
            uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
        );

        -- Enable RLS
        ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

        -- Create policy for admins to do everything
        CREATE POLICY "Enable all access for admins" ON public.resources
            USING (
                (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN'
            )
            WITH CHECK (
                (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN'
            );

        -- Create policy for all users to view resources
        CREATE POLICY "Enable read access for all authenticated users" ON public.resources
            FOR SELECT
            TO authenticated
            USING (true);

        RAISE NOTICE 'Created resources table and policies';
    ELSE
        RAISE NOTICE 'Resources table already exists';
    END IF;
END
$$; 