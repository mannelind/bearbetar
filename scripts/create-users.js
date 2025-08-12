#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createUsers() {
  console.log('Creating admin users...')

  try {
    // Skapa Manne användare
    const { data: manneAuth, error: manneAuthError } = await supabase.auth.admin.createUser({
      email: 'manne@bearbetar.se',
      password: 'adminpass123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Manne',
      }
    })

    if (manneAuthError) {
      console.error('Error creating Manne auth user:', manneAuthError)
    } else {
      console.log('✅ Created auth user for Manne:', manneAuth.user.id)
      
      // Lägg till i admin_users tabellen
      const { data: manneAdmin, error: manneAdminError } = await supabase
        .from('admin_users')
        .insert([
          {
            id: manneAuth.user.id,
            email: 'manne@bearbetar.se',
            full_name: 'Manne',
            bio: 'Grundare och strateg med passion för affärsutveckling och innovation. Hjälper företag att växa genom strategisk rådgivning och praktiska lösningar.',
            profile_image: null
          }
        ])

      if (manneAdminError) {
        console.error('Error creating Manne admin user:', manneAdminError)
      } else {
        console.log('✅ Added Manne to admin_users table')
      }
    }

    // Skapa Adam användare  
    const { data: adamAuth, error: adamAuthError } = await supabase.auth.admin.createUser({
      email: 'adam@bearbetar.se',
      password: 'adminpass123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Adam',
      }
    })

    if (adamAuthError) {
      console.error('Error creating Adam auth user:', adamAuthError)
    } else {
      console.log('✅ Created auth user for Adam:', adamAuth.user.id)
      
      // Lägg till i admin_users tabellen
      const { data: adamAdmin, error: adamAdminError } = await supabase
        .from('admin_users')
        .insert([
          {
            id: adamAuth.user.id,
            email: 'adam@bearbetar.se',
            full_name: 'Adam',
            bio: 'Expert inom teknisk utveckling och digitalisering. Specialiserad på att transformera affärsprocesser genom teknik och automation.',
            profile_image: null
          }
        ])

      if (adamAdminError) {
        console.error('Error creating Adam admin user:', adamAdminError)
      } else {
        console.log('✅ Added Adam to admin_users table')
      }
    }

    console.log('\n🎉 All users created successfully!')
    console.log('Login credentials:')
    console.log('Manne: manne@bearbetar.se / adminpass123')
    console.log('Adam: adam@bearbetar.se / adminpass123')

  } catch (error) {
    console.error('Error creating users:', error)
  }
}

createUsers()