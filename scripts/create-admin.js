const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...')

    const adminUser = {
      id: '12345678-1234-1234-1234-123456789012',
      email: 'admin@bearbetar.se',
      full_name: 'Admin User'
    }

    // Check if admin user already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', adminUser.id)
      .single()

    if (existing) {
      console.log('ℹ️  Admin user already exists')
      return
    }

    // Create admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert(adminUser)
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating admin user:', error)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminUser.email)
    console.log('🆔 ID:', adminUser.id)

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createAdminUser().then(() => {
  console.log('✨ Done!')
  process.exit(0)
}).catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})