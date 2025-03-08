const { createClient } = require('@supabase/supabase-js');

// Hardcoded values for reliability
const supabaseUrl = "https://amcqnrbsdqrjihuxmtfn.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3FucmJzZHFyamlodXhtdGZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDkxMTg3MSwiZXhwIjoyMDU2NDg3ODcxfQ.TcEhgoBewcp6C6YcLEMVa2SDb_bCq4CpvoaksKqoCAo";
const adminEmail = 'tuitionrider1@gmail.com';
const adminPassword = 'Admin91912';
const adminRegNo = 'ADM00191';

async function setupAdmin() {
  console.log('Starting admin setup with hardcoded values...');
  console.log('URL:', supabaseUrl);
  console.log('Admin Email:', adminEmail);
  console.log('Admin Reg No:', adminRegNo);

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Try to sign in first to check if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    let adminUser;

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      // User doesn't exist, create new admin user
      console.log('\nCreating new admin user...');
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
      });

      if (createError) {
        throw new Error('Failed to create admin user: ' + createError.message);
      }
      adminUser = user;
    } else if (signInData?.user) {
      // User exists, update password
      console.log('\nUpdating existing admin user...');
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        signInData.user.id,
        {
          password: adminPassword,
          email_confirm: true
        }
      );

      if (updateError) {
        throw new Error('Failed to update admin user: ' + updateError.message);
      }
      adminUser = signInData.user;
    }

    if (!adminUser) {
      throw new Error('Failed to create or update admin user');
    }

    console.log('Admin user ID:', adminUser.id);

    // Create or update admin profile
    console.log('\nCreating/updating admin profile...');
    const profileData = {
      id: adminUser.id,
      email: adminEmail,
      full_name: 'Admin User',
      role: 'ADMIN',
      registration_number: adminRegNo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null,
      login_count: 0,
      failed_attempts: 0,
      security_level: 'ADMIN',
      phone: '1234567890'
    };

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileData);

    if (upsertError) {
      throw new Error('Failed to create/update admin profile: ' + upsertError.message);
    }

    console.log('\nAdmin setup completed successfully!');
    console.log('\nYou can now login with:');
    console.log(`Registration Number: ${adminRegNo}`);
    console.log(`Password: ${adminPassword}`);

  } catch (error) {
    console.error('\nAdmin setup failed:', error.message);
    process.exit(1);
  }
}

setupAdmin(); 