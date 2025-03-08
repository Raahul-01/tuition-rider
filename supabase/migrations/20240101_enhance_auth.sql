-- Enable pgcrypto extension for better password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enhance profiles table
DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_login') THEN
        ALTER TABLE profiles ADD COLUMN last_login TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'login_count') THEN
        ALTER TABLE profiles ADD COLUMN login_count INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'failed_attempts') THEN
        ALTER TABLE profiles ADD COLUMN failed_attempts INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'locked_until') THEN
        ALTER TABLE profiles ADD COLUMN locked_until TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'password_changed_at') THEN
        ALTER TABLE profiles ADD COLUMN password_changed_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'require_password_change') THEN
        ALTER TABLE profiles ADD COLUMN require_password_change BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'security_level') THEN
        ALTER TABLE profiles ADD COLUMN security_level VARCHAR(10) DEFAULT 'STANDARD';
    END IF;

    -- Add constraints if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_security_level') THEN
        ALTER TABLE profiles ADD CONSTRAINT valid_security_level CHECK (security_level IN ('STANDARD', 'HIGH', 'ADMIN'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_registration_number_key') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_registration_number_key UNIQUE (registration_number);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_failed_attempts') THEN
        ALTER TABLE profiles ADD CONSTRAINT check_failed_attempts CHECK (failed_attempts >= 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_login_count') THEN
        ALTER TABLE profiles ADD CONSTRAINT check_login_count CHECK (login_count >= 0);
    END IF;
END $$;

-- Create authentication audit log if it doesn't exist
CREATE TABLE IF NOT EXISTS auth_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    event_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    details JSONB,
    CONSTRAINT valid_event_type CHECK (event_type IN (
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'LOGOUT',
        'PASSWORD_CHANGE',
        'PASSWORD_RESET_REQUEST',
        'EMAIL_CHANGE',
        'PROFILE_UPDATE',
        'ACCOUNT_LOCKED',
        'ACCOUNT_UNLOCKED'
    ))
);

-- Create or replace functions and triggers
CREATE OR REPLACE FUNCTION log_auth_event(
    p_user_id UUID,
    p_event_type VARCHAR(50),
    p_ip_address VARCHAR(45),
    p_user_agent TEXT,
    p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO auth_audit_log (
        user_id,
        event_type,
        ip_address,
        user_agent,
        details
    ) VALUES (
        p_user_id,
        p_event_type,
        p_ip_address,
        p_user_agent,
        p_details
    ) RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_failed_login() RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        failed_attempts = failed_attempts + 1,
        locked_until = CASE 
            WHEN failed_attempts >= 5 THEN NOW() + INTERVAL '30 minutes'
            ELSE locked_until
        END
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create it
DROP TRIGGER IF EXISTS on_failed_login ON auth_audit_log;
CREATE TRIGGER on_failed_login
    AFTER INSERT ON auth_audit_log
    FOR EACH ROW
    WHEN (NEW.event_type = 'LOGIN_FAILED')
    EXECUTE FUNCTION handle_failed_login();

CREATE OR REPLACE FUNCTION reset_failed_attempts() RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        failed_attempts = 0,
        locked_until = NULL
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create it
DROP TRIGGER IF EXISTS on_successful_login ON auth_audit_log;
CREATE TRIGGER on_successful_login
    AFTER INSERT ON auth_audit_log
    FOR EACH ROW
    WHEN (NEW.event_type = 'LOGIN_SUCCESS')
    EXECUTE FUNCTION reset_failed_attempts();

-- Add RLS policies
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own audit logs" ON auth_audit_log;
DROP POLICY IF EXISTS "Admins can view all audit logs" ON auth_audit_log;

-- Create new policies
CREATE POLICY "Users can view their own audit logs"
    ON auth_audit_log
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs"
    ON auth_audit_log
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'ADMIN'
        )
    );

-- Grant necessary permissions
GRANT SELECT ON auth_audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION log_auth_event TO authenticated;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_auth_audit_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_event_type ON auth_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created_at ON auth_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_security ON profiles(security_level);
CREATE INDEX IF NOT EXISTS idx_profiles_locked_until ON profiles(locked_until);

-- Drop existing admin_login function first
DROP FUNCTION IF EXISTS admin_login(text, text);

-- Create admin login function
CREATE OR REPLACE FUNCTION admin_login(
    p_registration_number TEXT,
    p_password TEXT
) RETURNS SETOF public.profiles AS $$
DECLARE
    v_user_id UUID;
    v_locked_until TIMESTAMPTZ;
    v_failed_attempts INTEGER;
    v_profile public.profiles%ROWTYPE;
    v_user_email TEXT;
    v_debug_info JSONB;
BEGIN
    -- Debug info
    v_debug_info := jsonb_build_object(
        'registration_number', p_registration_number,
        'timestamp', now()
    );

    -- Check if admin profile exists with proper table alias
    SELECT p.id, p.locked_until, p.failed_attempts, p.email
    INTO v_user_id, v_locked_until, v_failed_attempts, v_user_email
    FROM public.profiles p
    WHERE p.registration_number = p_registration_number
    AND p.role = 'ADMIN';

    -- Update debug info
    v_debug_info := v_debug_info || jsonb_build_object(
        'profile_found', v_user_id IS NOT NULL,
        'email', v_user_email
    );

    IF v_user_id IS NULL THEN
        -- Log failed attempt with debug info
        INSERT INTO auth_audit_log (
            event_type,
            details
        ) VALUES (
            'LOGIN_FAILED',
            v_debug_info || jsonb_build_object(
                'error', 'Profile not found',
                'method', 'admin_login'
            )
        );
        RAISE EXCEPTION 'Invalid admin credentials: profile not found';
    END IF;

    -- Check if account is locked
    IF v_locked_until IS NOT NULL AND v_locked_until > NOW() THEN
        RAISE EXCEPTION 'Account is temporarily locked. Please try again later.';
    END IF;

    -- Verify password with proper table alias
    IF NOT EXISTS (
        SELECT 1 FROM auth.users u
        WHERE u.id = v_user_id
        AND u.encrypted_password = crypt(p_password, u.encrypted_password)
    ) THEN
        -- Update debug info
        v_debug_info := v_debug_info || jsonb_build_object(
            'error', 'Password mismatch',
            'user_id', v_user_id
        );

        -- Log failed attempt
        INSERT INTO auth_audit_log (
            user_id,
            event_type,
            details
        ) VALUES (
            v_user_id,
            'LOGIN_FAILED',
            v_debug_info
        );

        -- Increment failed attempts
        UPDATE public.profiles p
        SET 
            failed_attempts = COALESCE(p.failed_attempts, 0) + 1,
            locked_until = CASE 
                WHEN COALESCE(p.failed_attempts, 0) >= 2 THEN NOW() + INTERVAL '1 hour'
                ELSE NULL
            END
        WHERE p.id = v_user_id;

        RAISE EXCEPTION 'Invalid admin credentials: password mismatch';
    END IF;

    -- Reset failed attempts and update login info
    UPDATE public.profiles p
    SET 
        failed_attempts = 0,
        locked_until = NULL,
        last_login = NOW(),
        login_count = COALESCE(p.login_count, 0) + 1
    WHERE p.id = v_user_id
    RETURNING p.* INTO v_profile;

    -- Update debug info for success
    v_debug_info := v_debug_info || jsonb_build_object(
        'login_success', true,
        'login_time', now()
    );

    -- Log successful login
    INSERT INTO auth_audit_log (
        user_id,
        event_type,
        details
    ) VALUES (
        v_user_id,
        'LOGIN_SUCCESS',
        v_debug_info
    );

    -- Return the profile
    RETURN NEXT v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_login TO authenticated;

-- Create helper function to verify admin credentials
CREATE OR REPLACE FUNCTION verify_admin_credentials(
    p_registration_number TEXT,
    p_password TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_password_matches BOOLEAN;
BEGIN
    SELECT u.id, u.encrypted_password = crypt(p_password, u.encrypted_password)
    INTO v_user_id, v_password_matches
    FROM auth.users u
    JOIN public.profiles p ON p.id = u.id
    WHERE p.registration_number = p_registration_number
    AND p.role = 'ADMIN';

    RETURN v_user_id IS NOT NULL AND v_password_matches;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update admin login information
CREATE OR REPLACE FUNCTION update_admin_login(
    p_admin_id UUID,
    p_last_login TIMESTAMP WITH TIME ZONE
) RETURNS JSON
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE profiles
    SET
        failed_attempts = 0,
        locked_until = NULL,
        last_login = p_last_login,
        login_count = login_count + 1
    WHERE id = p_admin_id
    AND role = 'ADMIN'
    RETURNING *;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Admin login updated successfully'
    );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION update_admin_login TO authenticated;
GRANT EXECUTE ON FUNCTION update_admin_login TO anon; 