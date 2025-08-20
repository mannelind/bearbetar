const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleArticles = [
  {
    title: 'Digitalisering av företag - En praktisk guide',
    slug: 'digitalisering-av-foretag-praktisk-guide',
    excerpt: 'Lär dig hur ditt företag kan dra nytta av digitaliseringens möjligheter med praktiska tips och strategier.',
    content: `# Digitalisering av företag - En praktisk guide

Digitalisering är inte längre en luxury utan en nödvändighet för företag som vill vara konkurrenskraftiga. I denna guide går vi igenom de viktigaste stegen för att digitalisera ditt företag.

## Varför digitalisera?

Digitalisering erbjuder flera fördelar:
- Ökad effektivitet i arbetssätt
- Bättre kundupplevelse
- Tillgång till värdefull data
- Konkurrensfördelar

## Första stegen

1. **Kartlägg nuvarande processer** - Dokumentera hur arbetet fungerar idag
2. **Identifiera flaskhalsar** - Hitta områden som kan förbättras
3. **Prioritera förändringar** - Fokusera på det som ger störst effekt

## Tekniska lösningar

Några grundläggande verktyg att överväga:
- Molntjänster för lagring och samarbete
- CRM-system för kundhantering
- Automatiserade faktureringssystem
- E-handelslösningar

## Sammanfattning

Digitalisering behöver inte vara komplicerat. Börja smått, fokusera på användarnytta och bygg vidare steg för steg.`,
    published: true,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Digitalisering', 'Företag', 'Teknik']
  },
  {
    title: 'Säkerhetsrutiner för moderna webbapplikationer',
    slug: 'sakerhetsrutiner-moderna-webbapplikationer',
    excerpt: 'Grundläggande säkerhetsrutiner som alla utvecklare bör känna till för att skydda sina webbapplikationer.',
    content: `# Säkerhetsrutiner för moderna webbapplikationer

Säkerhet är avgörande för alla webbapplikationer. Här är de viktigaste rutinerna att implementera.

## Autentisering och auktorisering

- Använd starka lösenordskrav
- Implementera tvåfaktorautentisering
- Använd JWT-tokens på rätt sätt
- Begränsa API-åtkomst baserat på roller

## Datavalidering

All data från användare måste valideras:
- Sanitisera input data
- Använd prepared statements
- Validera på både frontend och backend
- Begränsa filuppladdningar

## HTTPS och kryptering

- Använd alltid HTTPS i produktion
- Implementera HSTS headers
- Kryptera känslig data i databasen
- Rotera nycklar regelbundet

## Övervakning och logging

- Logga alla säkerhetsrelaterade händelser
- Implementera intrångsdetektion
- Regelbundna säkerhetspenetrationstester
- Håll system och bibliotek uppdaterade

Säkerhet är en kontinuerlig process, inte ett engångsprojekt.`,
    published: true,
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Säkerhet', 'Webbutveckling', 'Best Practices']
  },
  {
    title: 'AI och maskininlärning i affärsprocesser',
    slug: 'ai-maskininlarning-affarsprocesser',
    excerpt: 'Upptäck hur artificiell intelligens och maskininlärning kan automatisera och förbättra dina affärsprocesser.',
    content: `# AI och maskininlärning i affärsprocesser

Artificiell intelligens (AI) och maskininlärning (ML) revolutionerar hur företag arbetar. Låt oss utforska praktiska tillämpningar.

## Vad är skillnaden?

- **AI**: Datorer som utför uppgifter som kräver mänsklig intelligens
- **ML**: Algoritmer som lär sig från data utan explicit programmering

## Praktiska tillämpningar

### Kundservice
- Chatbots för första linjens support
- Automatisk kategorisering av ärenden
- Sentimentanalys av kundåterföring

### Försäljning och marknadsföring
- Prediktiv analys för kundbeteende
- Personaliserad innehållsrekommendation
- Automatisk leadbedömning

### Operations
- Förutspåelse av underhållsbehov
- Optimering av lagerhantering
- Kvalitetskontroll genom bildanalys

## Implementationsstrategi

1. **Identifiera lämpliga use cases**
2. **Samla och rensa data**
3. **Starta med pilotprojekt**
4. **Mät resultat och iterera**
5. **Skala upp framgångsrika lösningar**

AI och ML är kraftfulla verktyg, men framgång kräver rätt strategi och genomförande.`,
    published: true,
    published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['AI', 'Maskininlärning', 'Innovation']
  },
  {
    title: 'Molnmigration - Planering och genomförande',
    slug: 'molnmigration-planering-genomforande',
    excerpt: 'En steg-för-steg guide till att migrera dina system till molnet på ett säkert och effektivt sätt.',
    content: `# Molnmigration - Planering och genomförande

Molnmigration kan vara en komplex process, men med rätt planering blir det mycket enklare.

## Förberedelser

### Nulägesanalys
- Inventera alla system och applikationer
- Dokumentera beroenden mellan system
- Identifiera kritiska affärsprocesser
- Bedöm nuvarande säkerhetsnivå

### Molnstrategi
Välj rätt approach:
- **Lift and Shift**: Flytta som det är
- **Refactoring**: Anpassa för molnet
- **Rebuild**: Bygg om från grunden
- **Hybrid**: Kombinera on-premise och moln

## Migrationsfaser

### Fas 1: Pilotprojekt
- Välj mindre kritiska system först
- Testa och lär av processen
- Dokumentera lärdomar

### Fas 2: Icke-kritiska system
- Migrera system med låg affärsimpakt
- Bygg upp expertis och rutiner
- Finslipa processer

### Fas 3: Kärnfunktioner
- Migrera kritiska affärssystem
- Implementera robusta backup-rutiner
- Säkerställ minimal driftstörning

En lyckad molnmigration kräver noggrann planering, men resultatet är ofta betydligt förbättrad skalbarhet och kostnadseffektivitet.`,
    published: true,
    published_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Molntjänster', 'DevOps', 'Infrastruktur']
  },
  {
    title: 'Agil utveckling för små team',
    slug: 'agil-utveckling-sma-team',
    excerpt: 'Hur små utvecklingsteam kan implementera agila metoder för att öka produktivitet och leveranskvalitet.',
    content: `# Agil utveckling för små team

Agila metoder är inte bara för stora företag. Små team kan dra stor nytta av rätt tillämpade agila principer.

## Grundprinciper för små team

### Keep it Simple
- Anpassa processer efter teamstorlek
- Fokusera på värde framför byråkrati  
- Använd enkla verktyg som fungerar

### Kommunikation först
- Täta avstämningar (daily standup)
- Transparent projekthantering
- Direkt feedback mellan teammedlemmar

## Praktisk implementering

### Sprint-planering (1-2 veckor)
1. **Backlog refinement** - Prioritera och estimera arbete
2. **Sprint planning** - Välj vad som ska göras denna sprint
3. **Daily standups** - Kort avstämning varje dag
4. **Sprint review** - Demo av slutfört arbete
5. **Retrospektiv** - Reflektera och förbättra

### Verktyg som fungerar
- **Projekthantering**: Trello, GitHub Projects, eller Notion
- **Kommunikation**: Slack eller Teams
- **Versionshantering**: Git med branch-strategi
- **CI/CD**: GitHub Actions eller GitLab CI

Agila metoder handlar om att leverera värde snabbt och regelbundet, samtidigt som man anpassar sig efter feedback och förändringar.`,
    published: false,
    published_at: null,
    tags: ['Agile', 'Teamarbete', 'Produktivitet']
  }
]

async function seedArticles() {
  try {
    console.log('🚀 Starting to seed articles...')
    
    // Check if we have any admin users
    const { data: adminUsers } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1)

    if (!adminUsers || adminUsers.length === 0) {
      console.log('❌ No admin users found. Please create an admin user first.')
      return
    }

    const authorId = adminUsers[0].id

    // Check if articles already exist
    const { data: existingArticles } = await supabase
      .from('articles')
      .select('id')
      .limit(1)

    if (existingArticles && existingArticles.length > 0) {
      console.log('ℹ️  Articles already exist in database')
      console.log('⚠️  Continuing will add more sample articles')
    }

    let createdCount = 0
    
    for (const article of sampleArticles) {
      // Check if article with this slug already exists
      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', article.slug)
        .single()

      if (existingArticle) {
        console.log(`⏭️  Skipping existing article: ${article.title}`)
        continue
      }

      // Create article
      const { data: newArticle, error: articleError } = await supabase
        .from('articles')
        .insert({
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          published: article.published,
          published_at: article.published_at,
          author_id: authorId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (articleError) {
        console.error(`❌ Error creating article "${article.title}":`, articleError)
        continue
      }
      
      console.log(`✅ Created article: "${article.title}"`)
      createdCount++
      
      // Create tags and link to article
      if (article.tags && article.tags.length > 0) {
        for (const tagName of article.tags) {
          // Try to find existing tag first
          let { data: tag } = await supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .single()
          
          // Create tag if it doesn't exist
          if (!tag) {
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .insert({
                name: tagName,
                slug: tagName.toLowerCase().replace(/\s+/g, '-').replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
              })
              .select()
              .single()
            
            if (tagError) {
              console.error(`Error creating tag "${tagName}":`, tagError)
              continue
            }
            tag = newTag
          }
          
          // Link tag to article
          const { error: relationError } = await supabase
            .from('article_tags')
            .insert({
              article_id: newArticle.id,
              tag_id: tag.id
            })

          if (relationError) {
            console.error(`Error linking tag "${tagName}" to article:`, relationError)
          }
        }
        
        console.log(`   🏷️  Added ${article.tags.length} tags: ${article.tags.join(', ')}`)
      }
    }
    
    console.log('🎉 Seeding completed successfully!')
    console.log(`📊 Created ${createdCount} new articles`)
  } catch (error) {
    console.error('❌ Error seeding articles:', error)
  }
}

// Run the seeding
seedArticles().then(() => {
  console.log('✨ Done!')
  process.exit(0)
}).catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
}) 