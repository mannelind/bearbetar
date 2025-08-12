const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkTables() {
  console.log('🔍 Kollar vilka tabeller som finns...')

  try {
    // Testa olika tabeller
    const tablesToCheck = [
      'admin_users',
      'articles', 
      'categories',
      'tags',
      'portfolio_categories',
      'portfolio_items',
      'portfolio_item_categories',
      'portfolio_item_tags',
      'portfolio_gallery'
    ]

    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
          
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: OK (${data.length} records found)`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }

  } catch (error) {
    console.error('❌ Fel vid kontroll:', error)
  }
}

checkTables()