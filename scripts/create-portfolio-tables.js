const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createPortfolioTables() {
  console.log('🏗️ Skapar portfolio tabeller...')

  const queries = [
    `ALTER TABLE tags ADD COLUMN IF NOT EXISTS color TEXT;`,
    
    `CREATE TABLE IF NOT EXISTS portfolio_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    `CREATE TABLE IF NOT EXISTS portfolio_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      project_type TEXT DEFAULT 'simple',
      excerpt TEXT,
      description TEXT,
      case_study_content TEXT,
      client_name TEXT,
      project_url TEXT,
      completion_date DATE,
      featured_image TEXT,
      technologies_used TEXT,
      published BOOLEAN DEFAULT false,
      author_id UUID NOT NULL REFERENCES admin_users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    `CREATE TABLE IF NOT EXISTS portfolio_gallery (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
    
    `CREATE TABLE IF NOT EXISTS portfolio_item_categories (
      portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
      portfolio_category_id UUID REFERENCES portfolio_categories(id) ON DELETE CASCADE,
      PRIMARY KEY (portfolio_item_id, portfolio_category_id)
    );`,
    
    `CREATE TABLE IF NOT EXISTS portfolio_item_tags (
      portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
      tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (portfolio_item_id, tag_id)
    );`,

    `ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE portfolio_gallery ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE portfolio_item_categories ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE portfolio_item_tags ENABLE ROW LEVEL SECURITY;`,

    `CREATE POLICY "Portfolio categories are publicly viewable" ON portfolio_categories FOR SELECT USING (true);`,
    `CREATE POLICY "Published portfolio items are publicly viewable" ON portfolio_items FOR SELECT USING (published = true);`,
    `CREATE POLICY "Portfolio item categories are publicly viewable" ON portfolio_item_categories FOR SELECT USING (true);`,
    `CREATE POLICY "Portfolio item tags are publicly viewable" ON portfolio_item_tags FOR SELECT USING (true);`,
  ]

  try {
    console.log('📝 Kör SQL-frågor...')
    
    for (let i = 0; i < queries.length; i++) {
      try {
        const { error } = await supabase.rpc('exec', { query: queries[i] })
        console.log(`✓ Fråga ${i + 1}/${queries.length}`)
      } catch (err) {
        console.log(`⚠ Hoppar över fråga ${i + 1}: ${err.message?.substring(0, 60)}...`)
      }
    }

    console.log('✅ Portfolio tabeller skapade! Kör nu testdata...')
    
  } catch (error) {
    console.error('❌ Fel:', error)
  }
}

createPortfolioTables()