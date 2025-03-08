-- Clean up and create admin user
DO $$
DECLARE
    v_user_id uuid;
    v_count int;
    v_admin_email text := 'tuitionrider1@gmail.com';
    v_admin_password text := 'Admin91912';
    v_admin_reg_no text := 'ADM00191';
BEGIN
    -- First, clean up ALL admin users and profiles
    -- Get the IDs of admin users to be deleted
    WITH admin_users AS (
        SELECT id FROM auth.users
        WHERE LOWER(email) = LOWER(v_admin_email)
        OR (raw_app_meta_data->>'is_admin')::boolean = true
        OR raw_app_meta_data->>'role' = 'admin'
    )
    -- Delete related audit logs first
    DELETE FROM auth_audit_log
    WHERE user_id IN (SELECT id FROM admin_users);

    -- Delete all profiles with admin role or matching email/registration
    DELETE FROM public.profiles
    WHERE UPPER(role) = 'ADMIN'
    OR LOWER(email) = LOWER(v_admin_email)
    OR UPPER(registration_number) = UPPER(v_admin_reg_no);

    -- Now delete the admin users
    DELETE FROM auth.users
    WHERE LOWER(email) = LOWER(v_admin_email)
    OR (raw_app_meta_data->>'is_admin')::boolean = true
    OR raw_app_meta_data->>'role' = 'admin';

    -- Verify no admin users exist
    SELECT COUNT(*) INTO v_count
    FROM public.profiles
    WHERE UPPER(role) = 'ADMIN';

    IF v_count > 0 THEN
        RAISE EXCEPTION 'Failed to clean up existing admin users';
    END IF;

    -- Create new admin user
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        v_admin_email,
        crypt(v_admin_password, gen_salt('bf')),
        now(),
        now(),
        now(),
        jsonb_build_object(
            'provider', 'email',
            'providers', ARRAY['email'],
            'is_admin', true,
            'registration_number', v_admin_reg_no,
            'role', 'admin'
        ),
        jsonb_build_object(
            'full_name', 'Admin User',
            'phone', '+1234567890'
        ),
        now(),
        now(),
        encode(gen_random_bytes(32), 'hex'),
        encode(gen_random_bytes(32), 'hex'),
        encode(gen_random_bytes(32), 'hex')
    )
    RETURNING id INTO v_user_id;

    -- Create admin profile
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone,
        role,
        registration_number,
        registration_date,
        security_level,
        created_at,
        updated_at,
        failed_attempts,
        login_count,
        locked_until
    ) VALUES (
        v_user_id,
        'Admin User',
        v_admin_email,
        '+1234567890',
        'ADMIN',
        v_admin_reg_no,
        now(),
        'ADMIN',
        now(),
        now(),
        0,
        0,
        NULL
    );

    -- Verify exactly one admin user exists
    SELECT COUNT(*) INTO v_count
    FROM public.profiles
    WHERE UPPER(role) = 'ADMIN';

    IF v_count != 1 THEN
        RAISE EXCEPTION 'Expected exactly one admin user, found %', v_count;
    END IF;

    -- Verify admin user was created with correct credentials
    IF NOT EXISTS (
        SELECT 1 FROM auth.users u
        JOIN public.profiles p ON p.id = u.id
        WHERE LOWER(u.email) = LOWER(v_admin_email)
        AND UPPER(p.registration_number) = UPPER(v_admin_reg_no)
        AND UPPER(p.role) = 'ADMIN'
        AND u.encrypted_password = crypt(v_admin_password, u.encrypted_password)
    ) THEN
        RAISE EXCEPTION 'Failed to create admin user with correct credentials';
    END IF;

    -- Log admin creation with verification
    INSERT INTO auth_audit_log (
        user_id,
        event_type,
        details
    ) VALUES (
        v_user_id,
        'PROFILE_UPDATE',
        jsonb_build_object(
            'action', 'create_admin',
            'email', v_admin_email,
            'registration_number', v_admin_reg_no,
            'verification', 'success',
            'admin_count', v_count
        )
    );

    -- Output success message
    RAISE NOTICE 'Admin user created successfully with email % and registration number %. Total admin count: %', v_admin_email, v_admin_reg_no, v_count;
END $$; 