-- First, disable RLS temporarily to allow setup
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Check if admin exists in auth.users
DO $$
DECLARE
    admin_exists boolean;
    admin_id uuid;
BEGIN
    -- Check if admin exists in auth.users
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'tuitionrider1@gmail.com'
    ) INTO admin_exists;

    IF NOT admin_exists THEN
        RAISE NOTICE 'Admin user does not exist in auth.users. Please create it through the Supabase dashboard.';
    ELSE
        -- Get the admin user ID
        SELECT id INTO admin_id
        FROM auth.users
        WHERE email = 'tuitionrider1@gmail.com';

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
        VALUES (
            admin_id,
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
        )
        ON CONFLICT (id) DO UPDATE
        SET
            role = 'ADMIN',
            registration_number = 'ADM00191',
            updated_at = NOW(),
            security_level = 'ADMIN',
            failed_attempts = 0,
            locked_until = NULL;

        RAISE NOTICE 'Admin profile updated successfully';
    END IF;
END $$;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Grant auth schema permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA auth TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated; 