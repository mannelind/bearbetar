const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

console.log('Testing Supabase connections...\n')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET')
console.log('Service Key:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : 'NOT SET')

async function testConnections() {
  // Test with anon key (what the web app uses)
  console.log('\n🔑 Testing with ANON key...')
  try {
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await anonClient
      .from('articles')
      .select('count')
      .eq('published', true)

    if (error) {
      console.log('❌ Anon key error:', error.message)
    } else {
      console.log('✅ Anon key works! Articles found:', data?.length || 0)
    }
  } catch (err) {
    console.log('❌ Anon key exception:', err.message)
  }

  // Test with service role key (what the scripts use)
  console.log('\n🔐 Testing with SERVICE ROLE key...')
  try {
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data, error } = await serviceClient
      .from('articles')
      .select('*')
      .eq('published', true)

    if (error) {
      console.log('❌ Service key error:', error.message)
    } else {
      console.log('✅ Service key works! Articles found:', data?.length || 0)
    }
  } catch (err) {
    console.log('❌ Service key exception:', err.message)
  }

  // Test the exact query from blog page with anon key
  console.log('\n🌐 Testing blog page query with ANON key...')
  try {
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: articles, error } = await anonClient
      .from('articles')
      .select(`
        *,
        admin_users!articles_author_id_fkey (
          full_name,
          email
        ),
        article_tags (
          tags (
            name
          )
        )
      `)
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error) {
      console.log('❌ Blog query error:', error.message)
      console.log('   Details:', error)
    } else {
      console.log('✅ Blog query works! Articles:', articles?.length || 0)
      if (articles && articles.length > 0) {
        console.log('   First article:', articles[0].title)
      }
    }
  } catch (err) {
    console.log('❌ Blog query exception:', err.message)
  }
}

testConnections().then(() => {
  console.log('\n✨ Testing complete!')
  process.exit(0)
}).catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})