const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupDatabase() {
  console.log('🚀 Skapar databas-schema...')

  try {
    // Läs schema-filen
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📋 Kör databas-schema...')
    
    // Kör raw SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: schema })
    
    if (error) {
      console.error('❌ Kunde inte köra schema:', error)
      
      // Försök med ett alternativt sätt - dela upp i mindre bitar
      console.log('🔄 Försöker alternativ metod...')
      
      // Dela upp SQL i separata statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0)
        
      console.log(`📝 Kör ${statements.length} SQL-statements...`)
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i]
        if (stmt.startsWith('--') || stmt.length < 10) continue
        
        try {
          await supabase.rpc('exec_sql', { sql_query: stmt + ';' })
          console.log(`✓ Statement ${i + 1}/${statements.length}`)
        } catch (stmtError) {
          console.log(`⚠ Hoppar över statement ${i + 1}: ${stmtError.message?.substring(0, 100)}`)
        }
      }
    } else {
      console.log('✅ Databas-schema skapat!')
    }

  } catch (error) {
    console.error('❌ Fel vid setup av databas:', error)
  }
}

// Kör setup
setupDatabase()