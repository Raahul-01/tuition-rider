-- Function to authenticate admin users
CREATE OR REPLACE FUNCTION authenticate_admin(
  p_registration_number TEXT,
  p_email TEXT,
  p_password TEXT
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile profiles;
  v_result jsonb;
BEGIN
  -- Check if admin profile exists
  SELECT *
  INTO v_profile
  FROM profiles
  WHERE registration_number = p_registration_number
    AND role = 'ADMIN'
    AND email = p_email;

  IF v_profile IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Admin profile not found'
    );
  END IF;

  -- Update profile with login attempt
  UPDATE profiles
  SET 
    last_login = NOW(),
    login_count = COALESCE(login_count, 0) + 1,
    updated_at = NOW()
  WHERE id = v_profile.id
  RETURNING *
  INTO v_profile;

  -- Return success with profile
  RETURN jsonb_build_object(
    'success', true,
    'profile', row_to_json(v_profile)
  );
END;
$$;

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION authenticate_admin TO authenticated;
GRANT EXECUTE ON FUNCTION authenticate_admin TO service_role; 