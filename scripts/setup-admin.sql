-- Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create or update admin profile
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    registration_number,
    created_at,
    updated_at,
    last_login,
    login_count,
    failed_attempts,
    security_level,
    phone
)
SELECT 
    id,
    'tuitionrider1@gmail.com',
    'Admin User',
    'ADMIN',
    'ADM00191',
    NOW(),
    NOW(),
    NULL,
    0,
    0,
    'ADMIN',
    '+1234567890'
FROM auth.users
WHERE email = 'tuitionrider1@gmail.com'
ON CONFLICT (id) DO UPDATE
SET
    role = 'ADMIN',
    registration_number = 'ADM00191',
    updated_at = NOW(),
    security_level = 'ADMIN',
    failed_attempts = 0,
    locked_until = NULL;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can access their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can check admin profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public read access to basic profile info" ON public.profiles;

-- Create simplified policies
CREATE POLICY "Public registration access"
    ON public.profiles
    FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Users can read their own profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR role = 'ADMIN');

CREATE POLICY "Users can update their own profiles"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Admins have full access"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 