import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const adminEmail = process.env.ADMIN_EMAIL || 'admin@tuitionrider.com'
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin91912'
const adminRegNo = process.env.ADMIN_REG_NO || 'ADM00191'

async function setupAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('Starting admin setup...')

    // First check if admin exists in auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    const existingAdmin = users?.find(user => user.email === adminEmail)

    if (listError) {
      throw listError
    }

    let userId: string

    if (existingAdmin) {
      // Update existing admin
      userId = existingAdmin.id
      console.log('Updating existing admin user...')

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        {
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: {
            role: 'ADMIN',
            registration_number: adminRegNo
          },
          app_metadata: {
            role: 'ADMIN',
            registration_number: adminRegNo
          }
        }
      )

      if (updateError) throw updateError
    } else {
      // Create new admin user
      console.log('Creating new admin user...')
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          role: 'ADMIN',
          registration_number: adminRegNo
        },
        app_metadata: {
          role: 'ADMIN',
          registration_number: adminRegNo
        }
      })

      if (createError || !user) {
        throw createError || new Error('Failed to create admin user')
      }

      userId = user.id
    }

    // Check if admin profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('registration_number', adminRegNo)
      .single()

    if (profileCheckError && !profileCheckError.message.includes('not found')) {
      throw profileCheckError
    }

    if (!existingProfile) {
      // Create admin profile
      console.log('Creating admin profile...')
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: adminEmail,
          full_name: 'Admin User',
          role: 'ADMIN',
          registration_number: adminRegNo,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: null,
          login_count: 0,
          failed_attempts: 0,
          security_level: 'ADMIN'
        })

      if (profileError) {
        throw profileError
      }
    }

    console.log('Admin setup completed successfully!')
    console.log('You can now login with:')
    console.log(`Registration Number: ${adminRegNo}`)
    console.log(`Password: ${adminPassword}`)
  } catch (error) {
    console.error('Admin setup failed:', error)
    process.exit(1)
  }
}

setupAdmin() 