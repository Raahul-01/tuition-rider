-- Start transaction
BEGIN;

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Ensure schema exists and set proper permissions
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS auth;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;
GRANT USAGE, CREATE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow service role full access" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow insert with service role" ON profiles CASCADE;
DROP POLICY IF EXISTS "Allow admin full access" ON profiles CASCADE;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON profiles CASCADE;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles CASCADE;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles CASCADE;
DROP POLICY IF EXISTS "Enable delete for users based on id" ON profiles CASCADE;
DROP POLICY IF EXISTS "Enable full access for admin users" ON profiles CASCADE;

-- Create or update profiles table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Create profiles table with all necessary columns
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            role TEXT NOT NULL DEFAULT 'USER',
            registration_number TEXT UNIQUE,
            registration_date TIMESTAMPTZ DEFAULT NOW(),
            last_login TIMESTAMPTZ,
            failed_attempts INTEGER DEFAULT 0,
            login_count INTEGER DEFAULT 0,
            security_level TEXT DEFAULT 'STANDARD',
            locked_until TIMESTAMPTZ,
            password_changed_at TIMESTAMPTZ,
            require_password_change BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT valid_role CHECK (role IN ('USER', 'ADMIN')),
            CONSTRAINT valid_security_level CHECK (security_level IN ('STANDARD', 'HIGH', 'ADMIN'))
        );
    ELSE
        -- Add any missing columns to existing table
        BEGIN
            ALTER TABLE public.profiles 
                ADD COLUMN IF NOT EXISTS full_name TEXT,
                ADD COLUMN IF NOT EXISTS email TEXT,
                ADD COLUMN IF NOT EXISTS phone TEXT,
                ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'USER',
                ADD COLUMN IF NOT EXISTS registration_number TEXT,
                ADD COLUMN IF NOT EXISTS registration_date TIMESTAMPTZ DEFAULT NOW(),
                ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ,
                ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
                ADD COLUMN IF NOT EXISTS security_level TEXT DEFAULT 'STANDARD',
                ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ,
                ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ,
                ADD COLUMN IF NOT EXISTS require_password_change BOOLEAN DEFAULT false,
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
        EXCEPTION WHEN duplicate_column THEN
            -- Ignore duplicate column errors
        END;
    END IF;
END $$;

-- Add constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_role') THEN
        ALTER TABLE profiles ADD CONSTRAINT valid_role CHECK (role IN ('USER', 'ADMIN'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_security_level') THEN
        ALTER TABLE profiles ADD CONSTRAINT valid_security_level CHECK (security_level IN ('STANDARD', 'HIGH', 'ADMIN'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_registration_number_key') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_registration_number_key UNIQUE (registration_number);
    END IF;
EXCEPTION WHEN duplicate_object THEN
    -- Ignore duplicate constraint errors
END $$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Enable read access for all authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on id"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- Create policy for admin access
CREATE POLICY "Enable full access for admin users"
    ON public.profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = auth.users.id
            AND (auth.users.raw_app_meta_data->>'is_admin')::boolean = true
        )
    );

-- Grant basic permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;

-- Create indexes if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_email') THEN
        CREATE INDEX idx_profiles_email ON profiles(email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_full_name') THEN
        CREATE INDEX idx_profiles_full_name ON profiles(full_name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_role') THEN
        CREATE INDEX idx_profiles_role ON profiles(role);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_registration_number') THEN
        CREATE INDEX idx_profiles_registration_number ON profiles(registration_number);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_security') THEN
        CREATE INDEX idx_profiles_security ON profiles(security_level);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_locked_until') THEN
        CREATE INDEX idx_profiles_locked_until ON profiles(locked_until);
    END IF;
END $$;

-- Drop existing resources table if it exists
DROP TABLE IF EXISTS resources CASCADE;

-- Create resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    type TEXT NOT NULL,
    file_url TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size INT8,
    download_count INT4 DEFAULT 0,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for resources
CREATE POLICY "Allow read access for all authenticated users"
    ON resources FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admin to manage resources"
    ON resources FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE auth.uid() = profiles.id
            AND role = 'ADMIN'
        )
    );

-- Create indexes for resources
CREATE INDEX idx_resources_uploaded_by ON resources(uploaded_by);
CREATE INDEX idx_resources_subject ON resources(subject);
CREATE INDEX idx_resources_grade ON resources(grade);
CREATE INDEX idx_resources_type ON resources(type);

-- Re-enable triggers
SET session_replication_role = 'origin';

COMMIT; 