const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seedPortfolio() {
  console.log('🌱 Skapar portfolio testdata...')

  try {
    // Rensa befintlig data
    console.log('🧹 Rensar befintlig data...')
    await supabase.from('portfolio_gallery').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('portfolio_item_tags').delete().neq('portfolio_item_id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('portfolio_item_categories').delete().neq('portfolio_item_id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('portfolio_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Ta bort testdata kategorier och taggar
    await supabase.from('portfolio_categories').delete().in('name', ['Webbutveckling', 'Mobilappar', 'Design', 'E-handel', 'Konsulting', 'Automation'])
    await supabase.from('tags').delete().in('name', ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Figma', 'UI/UX', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'API', 'E-handel', 'SaaS', 'MVP', 'Startup', 'Konsulting', 'Automation', 'AI/ML', 'DevOps'])

    // Hämta admin användare
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1)

    if (adminError || !adminUsers || adminUsers.length === 0) {
      console.error('❌ Kunde inte hitta admin användare:', adminError)
      return
    }

    const adminUserId = adminUsers[0].id

    // 1. Skapa kategorier
    console.log('📁 Skapar kategorier...')
    const { data: categories, error: catError } = await supabase
      .from('portfolio_categories')
      .insert([
        { name: 'Webbutveckling', slug: 'webbutveckling', description: 'Moderna webbapplikationer och hemsidor' },
        { name: 'Mobilappar', slug: 'mobilappar', description: 'iOS och Android applikationer' },
        { name: 'Design', slug: 'design', description: 'UI/UX design och grafisk design' },
        { name: 'E-handel', slug: 'e-handel', description: 'E-handelsplattformar och online-butiker' },
        { name: 'Konsulting', slug: 'konsulting', description: 'Teknisk rådgivning och strategisk planering' },
        { name: 'Automation', slug: 'automation', description: 'Processorautomation och verktyg' }
      ])
      .select()

    if (catError) {
      console.error('❌ Fel vid skapande av kategorier:', catError)
      return
    }

    // 2. Skapa taggar
    console.log('🏷️ Skapar taggar...')
    const { data: tags, error: tagError } = await supabase
      .from('tags')
      .insert([
        { name: 'React', slug: 'react', color: '#61DAFB' },
        { name: 'Next.js', slug: 'nextjs', color: '#000000' },
        { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
        { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
        { name: 'Node.js', slug: 'nodejs', color: '#339933' },
        { name: 'Python', slug: 'python', color: '#3776AB' },
        { name: 'Figma', slug: 'figma', color: '#F24E1E' },
        { name: 'UI/UX', slug: 'ui-ux', color: '#FF6B6B' },
        { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' },
        { name: 'Supabase', slug: 'supabase', color: '#3ECF8E' },
        { name: 'Tailwind CSS', slug: 'tailwind-css', color: '#06B6D4' },
        { name: 'API', slug: 'api', color: '#FF9500' },
        { name: 'E-handel', slug: 'e-handel', color: '#E44D26' },
        { name: 'SaaS', slug: 'saas', color: '#4A90E2' },
        { name: 'MVP', slug: 'mvp', color: '#8E44AD' },
        { name: 'Startup', slug: 'startup', color: '#E67E22' },
        { name: 'Konsulting', slug: 'konsulting', color: '#2ECC71' },
        { name: 'Automation', slug: 'automation', color: '#34495E' },
        { name: 'AI/ML', slug: 'ai-ml', color: '#9B59B6' },
        { name: 'DevOps', slug: 'devops', color: '#16A085' }
      ])
      .select()

    if (tagError) {
      console.error('❌ Fel vid skapande av taggar:', tagError)
      return
    }

    // 3. Skapa portfolio items
    console.log('💼 Skapar portfolio items...')
    const { data: portfolioItems, error: portfolioError } = await supabase
      .from('portfolio_items')
      .insert([
        {
          title: 'Modern E-handelsplattform för Mode',
          slug: 'ehandelsplattform-mode',
          project_type: 'case_study',
          excerpt: 'En fullständig e-handelsupplevelse med modern design och smidig användarupplevelse för modeföretag.',
          description: '<p>Vi utvecklade en komplett e-handelsplattform för ett växande modeföretag som behövde en modern, skalbar lösning för sin online-försäljning.</p>',
          case_study_content: '<h3>Utmaning</h3><p>Kunden hade en gammal WooCommerce-sajt som var långsam och svår att underhålla. De behövde en modern lösning som kunde hantera stora produktkataloger och hög trafik.</p><h3>Lösning</h3><p>Vi byggde en headless e-handelsplattform med Next.js frontend och Supabase backend. Plattformen inkluderar avancerad produktfiltrering, kundvagn, orderhantering och admin-panel.</p><h3>Resultat</h3><p>40% förbättring av laddningstider, 60% ökning av konverteringsgrad och betydligt enklare produkthantering för kunden.</p>',
          client_name: 'StyleHub Fashion',
          project_url: 'https://stylehub-demo.bearbetar.se',
          completion_date: '2024-03-15',
          featured_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
          published: true,
          author_id: adminUserId,
          technologies_used: 'Next.js, React, TypeScript, Supabase, Tailwind CSS, Stripe'
        },
        {
          title: 'Analytisk Dashboard för SaaS-företag',
          slug: 'saas-dashboard-analytics',
          project_type: 'case_study',
          excerpt: 'Ett kraftfullt dashboard för att visualisera användardata och affärsmetriker i realtid.',
          description: '<p>Vi skapade en omfattande analytics-lösning för ett SaaS-företag som behövde bättre insikt i sina användardata och affärsmetriker.</p>',
          client_name: 'TechMetrics AB',
          completion_date: '2024-02-28',
          featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
          published: true,
          author_id: adminUserId,
          technologies_used: 'React, TypeScript, D3.js, Node.js, PostgreSQL'
        },
        {
          title: 'Fitness Tracking App Design',
          slug: 'fitness-app-design',
          project_type: 'simple',
          excerpt: 'Modern UI/UX design för en fitness-app med fokus på användarupplevelse och motivation.',
          description: '<p>Designade en intuitiv och motiverande användarupplevelse för en fitness-app som hjälper användare att nå sina hälsomål.</p>',
          client_name: 'FitLife Studios',
          completion_date: '2024-01-20',
          featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
          published: true,
          author_id: adminUserId,
          technologies_used: 'Figma, Adobe XD, Prototyping'
        },
        {
          title: 'AI-driven Processautomation',
          slug: 'ai-processautomation',
          project_type: 'case_study',
          excerpt: 'Automatiserade manuella processer med AI och maskininlärning för att öka effektiviteten.',
          description: '<p>Utvecklade en AI-driven lösning som automatiserar repetitiva arbetsuppgifter och förbättrar arbetsflödet för ett konsultföretag.</p>',
          case_study_content: '<h3>Problemet</h3><p>Kunden spenderade 15+ timmar i veckan på manuell databearbetning och rapportgenerering.</p><h3>Lösningen</h3><p>Vi byggde ett AI-system som automatiskt bearbetar inkommande data, genererar rapporter och skickar ut dem till rätt mottagare.</p><h3>Resultat</h3><p>90% minskning av manuellt arbete och 300% snabbare rapportgenerering.</p>',
          client_name: 'Consulting Pro AB',
          completion_date: '2024-04-10',
          featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
          published: true,
          author_id: adminUserId,
          technologies_used: 'Python, TensorFlow, FastAPI, Docker, PostgreSQL'
        },
        {
          title: 'MVP för EdTech Startup',
          slug: 'edtech-startup-mvp',
          project_type: 'case_study',
          excerpt: 'Snabb utveckling av MVP för att validera affärsidé inom utbildningsteknologi.',
          description: '<p>Hjälpte en startup att snabbt lansera sin första version för att testa marknaden och samla användarfeedback.</p>',
          client_name: 'EduNext Startup',
          completion_date: '2024-03-30',
          featured_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
          published: true,
          author_id: adminUserId,
          technologies_used: 'React, Next.js, Supabase, Tailwind CSS'
        },
        {
          title: 'Professionell Företagshemsida',
          slug: 'foretagshemsida-advokatbyra',
          project_type: 'simple',
          excerpt: 'Modern och professionell hemsida för advokatbyrå med fokus på trovärdighet och användarvänlighet.',
          description: '<p>Skapade en elegant och professionell webb-närvaro för en etablerad advokatbyrå med fokus på att bygga förtroende hos potentiella kunder.</p>',
          client_name: 'Lindqvist Advokatbyrå',
          project_url: 'https://lindqvist-advokatbyra.se',
          completion_date: '2024-02-15',
          featured_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
          published: true,
          author_id: adminUserId,
          technologies_used: 'Next.js, React, Tailwind CSS, CMS'
        }
      ])
      .select()

    if (portfolioError) {
      console.error('❌ Fel vid skapande av portfolio items:', portfolioError)
      return
    }

    console.log('🔗 Kopplar kategorier och taggar...')

    // Hitta kategori och tag IDs för kopplingar
    const webdevCat = categories.find(c => c.slug === 'webbutveckling')
    const designCat = categories.find(c => c.slug === 'design')
    const ehandeCat = categories.find(c => c.slug === 'e-handel')
    const konsultingCat = categories.find(c => c.slug === 'konsulting')
    const automationCat = categories.find(c => c.slug === 'automation')
    const mobileCat = categories.find(c => c.slug === 'mobilappar')

    const reactTag = tags.find(t => t.slug === 'react')
    const nextjsTag = tags.find(t => t.slug === 'nextjs')
    const typescriptTag = tags.find(t => t.slug === 'typescript')
    const figmaTag = tags.find(t => t.slug === 'figma')
    const uiuxTag = tags.find(t => t.slug === 'ui-ux')
    const nodejsTag = tags.find(t => t.slug === 'nodejs')
    const postgresqlTag = tags.find(t => t.slug === 'postgresql')
    const supabaseTag = tags.find(t => t.slug === 'supabase')
    const tailwindTag = tags.find(t => t.slug === 'tailwind-css')
    const ehandelTag = tags.find(t => t.slug === 'e-handel')
    const saasTag = tags.find(t => t.slug === 'saas')
    const mvpTag = tags.find(t => t.slug === 'mvp')
    const startupTag = tags.find(t => t.slug === 'startup')
    const pythonTag = tags.find(t => t.slug === 'python')
    const aimlTag = tags.find(t => t.slug === 'ai-ml')
    const automationTag = tags.find(t => t.slug === 'automation')
    const konsultingTag = tags.find(t => t.slug === 'konsulting')

    // Koppla kategorier
    await supabase.from('portfolio_item_categories').insert([
      { portfolio_item_id: portfolioItems[0].id, portfolio_category_id: ehandeCat.id },
      { portfolio_item_id: portfolioItems[0].id, portfolio_category_id: webdevCat.id },
      { portfolio_item_id: portfolioItems[1].id, portfolio_category_id: webdevCat.id },
      { portfolio_item_id: portfolioItems[2].id, portfolio_category_id: designCat.id },
      { portfolio_item_id: portfolioItems[2].id, portfolio_category_id: mobileCat.id },
      { portfolio_item_id: portfolioItems[3].id, portfolio_category_id: automationCat.id },
      { portfolio_item_id: portfolioItems[3].id, portfolio_category_id: konsultingCat.id },
      { portfolio_item_id: portfolioItems[4].id, portfolio_category_id: webdevCat.id },
      { portfolio_item_id: portfolioItems[5].id, portfolio_category_id: webdevCat.id }
    ])

    // Koppla taggar
    await supabase.from('portfolio_item_tags').insert([
      // E-handelsplattform
      { portfolio_item_id: portfolioItems[0].id, tag_id: reactTag.id },
      { portfolio_item_id: portfolioItems[0].id, tag_id: nextjsTag.id },
      { portfolio_item_id: portfolioItems[0].id, tag_id: typescriptTag.id },
      { portfolio_item_id: portfolioItems[0].id, tag_id: supabaseTag.id },
      { portfolio_item_id: portfolioItems[0].id, tag_id: tailwindTag.id },
      { portfolio_item_id: portfolioItems[0].id, tag_id: ehandelTag.id },
      
      // SaaS Dashboard
      { portfolio_item_id: portfolioItems[1].id, tag_id: reactTag.id },
      { portfolio_item_id: portfolioItems[1].id, tag_id: typescriptTag.id },
      { portfolio_item_id: portfolioItems[1].id, tag_id: nodejsTag.id },
      { portfolio_item_id: portfolioItems[1].id, tag_id: postgresqlTag.id },
      { portfolio_item_id: portfolioItems[1].id, tag_id: saasTag.id },
      
      // Fitness App Design
      { portfolio_item_id: portfolioItems[2].id, tag_id: figmaTag.id },
      { portfolio_item_id: portfolioItems[2].id, tag_id: uiuxTag.id },
      
      // AI Automation
      { portfolio_item_id: portfolioItems[3].id, tag_id: pythonTag.id },
      { portfolio_item_id: portfolioItems[3].id, tag_id: aimlTag.id },
      { portfolio_item_id: portfolioItems[3].id, tag_id: automationTag.id },
      
      // EdTech MVP
      { portfolio_item_id: portfolioItems[4].id, tag_id: reactTag.id },
      { portfolio_item_id: portfolioItems[4].id, tag_id: nextjsTag.id },
      { portfolio_item_id: portfolioItems[4].id, tag_id: supabaseTag.id },
      { portfolio_item_id: portfolioItems[4].id, tag_id: mvpTag.id },
      { portfolio_item_id: portfolioItems[4].id, tag_id: startupTag.id },
      
      // Företagshemsida
      { portfolio_item_id: portfolioItems[5].id, tag_id: nextjsTag.id },
      { portfolio_item_id: portfolioItems[5].id, tag_id: reactTag.id },
      { portfolio_item_id: portfolioItems[5].id, tag_id: tailwindTag.id }
    ])

    console.log('🖼️ Skapar galleribilder...')
    
    // Lägg till galleribilder för case studies
    await supabase.from('portfolio_gallery').insert([
      // E-handelsplattform galleris
      { portfolio_item_id: portfolioItems[0].id, image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', caption: 'Produktkatalog med avancerad filtrering', sort_order: 1 },
      { portfolio_item_id: portfolioItems[0].id, image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop', caption: 'Responsiv design på mobil och desktop', sort_order: 2 },
      { portfolio_item_id: portfolioItems[0].id, image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', caption: 'Smidig checkout-process', sort_order: 3 },
      
      // SaaS Dashboard galleri
      { portfolio_item_id: portfolioItems[1].id, image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop', caption: 'Huvuddashboard med realtidsdata', sort_order: 1 },
      { portfolio_item_id: portfolioItems[1].id, image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', caption: 'Detaljerade analytics och rapporter', sort_order: 2 }
    ])

    console.log('✅ Portfolio testdata har skapats framgångsrikt!')
    console.log(`📊 Skapade:`)
    console.log(`  - ${categories.length} kategorier`)
    console.log(`  - ${tags.length} taggar`) 
    console.log(`  - ${portfolioItems.length} portfolio items`)
    console.log(`  - Kopplingar mellan kategorier, taggar och projekt`)
    console.log(`  - Galleribilder för case studies`)
    console.log('')
    console.log('🌐 Besök http://localhost:3002/portfolio för att se resultatet!')

  } catch (error) {
    console.error('❌ Fel vid skapande av portfolio data:', error)
  }
}

// Kör scriptet
seedPortfolio()