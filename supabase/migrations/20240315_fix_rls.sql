-- Drop existing policies
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can access their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can check admin existence" ON public.profiles;
DROP POLICY IF EXISTS "Public read access to basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Temporarily disable RLS to allow initial setup
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Create policy for admin access (full access)
CREATE POLICY "Admins can access all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  );

-- Create policy for users to access their own profiles
CREATE POLICY "Users can access their own profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Create policy for public read access to admin profiles
CREATE POLICY "Public admin profile access"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (role = 'ADMIN');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Grant limited permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant read-only permissions to anonymous users
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.profiles TO anon;

-- Grant auth schema permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA auth TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verify admin exists and has correct permissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE registration_number = 'ADM00191' AND role = 'ADMIN'
  ) THEN
    RAISE NOTICE 'Warning: Admin user does not exist';
  END IF;
END $$; 