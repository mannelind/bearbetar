const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkArticles() {
  try {
    console.log('🔍 Checking articles in database...\n')

    // Check all articles
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) {
      console.error('❌ Error fetching all articles:', allError)
      return
    }

    console.log(`📰 Total articles in database: ${allArticles?.length || 0}`)
    
    if (allArticles && allArticles.length > 0) {
      console.log('\n📋 All articles:')
      allArticles.forEach((article, index) => {
        console.log(`${index + 1}. "${article.title}"`)
        console.log(`   - Slug: ${article.slug}`)
        console.log(`   - Published: ${article.published ? '✅' : '❌'}`)
        console.log(`   - Published at: ${article.published_at || 'Not set'}`)
        console.log(`   - Author ID: ${article.author_id}`)
        console.log('')
      })
    }

    // Check published articles only
    const { data: publishedArticles, error: publishedError } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (publishedError) {
      console.error('❌ Error fetching published articles:', publishedError)
      return
    }

    console.log(`✅ Published articles: ${publishedArticles?.length || 0}`)

    // Check admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')

    if (adminError) {
      console.error('❌ Error fetching admin users:', adminError)
      return
    }

    console.log(`👥 Admin users: ${adminUsers?.length || 0}`)
    if (adminUsers && adminUsers.length > 0) {
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.full_name || 'No name'})`)
      })
    }

    // Check tags
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*')

    if (tagsError) {
      console.error('❌ Error fetching tags:', tagsError)
      return
    }

    console.log(`🏷️  Total tags: ${tags?.length || 0}`)
    if (tags && tags.length > 0) {
      console.log('Tags:', tags.map(tag => tag.name).join(', '))
    }

    // Test the exact same query as the blog page
    const { data: blogArticles, error: blogError } = await supabase
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

    if (blogError) {
      console.error('❌ Error with blog page query:', blogError)
      return
    }

    console.log(`\n🌐 Blog page query result: ${blogArticles?.length || 0} articles`)
    if (blogArticles && blogArticles.length > 0) {
      blogArticles.forEach((article, index) => {
        console.log(`${index + 1}. "${article.title}" by ${article.admin_users?.full_name || article.admin_users?.email || 'Unknown'}`)
        const tags = article.article_tags?.map((at) => at.tags.name).join(', ') || 'No tags'
        console.log(`   - Tags: ${tags}`)
      })
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkArticles().then(() => {
  console.log('\n✨ Done!')
  process.exit(0)
}).catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})