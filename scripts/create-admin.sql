-- First, ensure the user exists in auth.users
-- You need to create this user through the Supabase dashboard or auth.signUp first
-- Then run this script to create the admin profile

-- Create admin profile
INSERT INTO public.profiles (
  id,  -- This should match the UUID from auth.users
  email,
  full_name,
  role,
  registration_number,
  created_at,
  updated_at,
  last_login,
  login_count,
  failed_attempts,
  security_level
)
VALUES (
  '00000000-0000-0000-0000-000000000000',  -- Replace with actual UUID from auth.users
  'tuitionrider1@gmail.com',  -- Replace with your admin email
  'Admin User',
  'ADMIN',
  'ADM00191',
  NOW(),
  NOW(),
  NULL,
  0,
  0,
  'ADMIN'
)
ON CONFLICT (email) DO UPDATE
SET
  role = 'ADMIN',
  registration_number = 'ADM00191',
  updated_at = NOW(),
  security_level = 'ADMIN';

-- Grant necessary permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admins can access all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'ADMIN'
    )
  );

-- Create policy for users to access their own profiles
CREATE POLICY "Users can access their own profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id); 