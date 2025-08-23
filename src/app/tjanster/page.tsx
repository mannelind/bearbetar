import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/ui/hero-section'
import { AnimatedSection, AnimatedGrid, PageWrapper } from '@/components/ui/page-animations'
import { ServicesGrid } from '@/components/services/services-grid'
import { createServerComponentClient } from '@/lib/supabase'
import { 
  CheckCircle,
  Heart,
  Zap 
} from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = pageMetadata.services()

export default async function ServicesPage() {
  // Fetch active services from database
  const supabase = await createServerComponentClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  const defaultServices = [
    {
      id: '1',
      title: 'Webbsidor',
      short_description: 'Modern webbutveckling',
      description: `
        <div>
          <p>WordPress-sidor, React-appar och statiska siter. Månadsabonnemang för att göra professionell design tillgänglig för fler företag.</p>
          
          <h2>Vad vi erbjuder</h2>
          <p>Vi utvecklar moderna, responsiva webbsidor som fungerar perfekt på alla enheter. Från enkla WordPress-sidor till avancerade React-applikationer.</p>
          
          <h2>Teknologier vi använder</h2>
          <p>WordPress, React, Next.js, Node.js, och moderna CSS-ramverk som Tailwind CSS för optimal prestanda och design.</p>
          
          <h2>Månadsabonnemang</h2>
          <p>Genom vårt månadsabonnemang gör vi professionell webbutveckling tillgänglig för företag som tidigare inte haft råd med skräddarsydda lösningar.</p>
        </div>
      `,
      icon: 'Globe',
      price_info: 'Från 2,000 kr/mån',
      features: ['Responsiv design', 'SEO-optimering', 'Snabba laddningstider', 'Säkerhetsuppdateringar'],
      process_steps: ['Konsultation', 'Design', 'Utveckling', 'Lansering', 'Support']
    },
    {
      id: '2', 
      title: 'Mobilappar',
      short_description: 'Mobilappar och webbappar',
      description: `
        <div>
          <p>React Native för mobil och moderna webbappar. Vi hjälper från idé till färdig produkt - ingen app-butik-byråkrati om det inte behövs.</p>
          
          <h2>Mobilutveckling</h2>
          <p>Med React Native kan vi utveckla appar som fungerar på både iOS och Android med en gemensam kodbas, vilket sparar tid och kostnad.</p>
          
          <h2>Webbappar</h2>
          <p>Progressive Web Apps (PWA) ger app-liknande upplevelse direkt i webbläsaren utan installation från app-butiker.</p>
          
          <h2>Från idé till färdig produkt</h2>
          <p>Vi guidar dig genom hela processen från konceptualisering till lansering och underhåll av din mobilapp.</p>
        </div>
      `,
      icon: 'Smartphone',
      price_info: 'Projektbaserat',
      features: ['Cross-platform utveckling', 'Native prestanda', 'Push-notifikationer', 'Offline-funktionalitet'],
      process_steps: ['Idéutveckling', 'Prototyping', 'Utveckling', 'Testning', 'Lansering']
    },
    {
      id: '3',
      title: 'Skräddarsydd utveckling', 
      short_description: 'När standardlösningar inte räcker',
      description: `
        <div>
          <p>Har du något specifikt du vill bygga? Vi kan utveckla allt från enkla verktyg till komplexa system. Säg vad du behöver så fixar vi det.</p>
          
          <h2>Unika lösningar</h2>
          <p>Varje företag har unika behov. Vi utvecklar skräddarsydda system som passar exakt dina krav och arbetsprocesser.</p>
          
          <h2>Omfattande expertis</h2>
          <p>Från enkla automatiseringsverktyg till komplexa datahanteringssystem - vi har erfarenhet av att lösa många olika tekniska utmaningar.</p>
          
          <h2>Flexibel process</h2>
          <p>Vi anpassar vår utvecklingsprocess efter ditt projekt och dina önskemål för att leverera bästa möjliga resultat.</p>
        </div>
      `,
      icon: 'Code',
      price_info: 'Offereras per projekt',
      features: ['Skräddarsydd lösning', 'Skalbar arkitektur', 'Integrationer', 'Löpande support'],
      process_steps: ['Behovsanalys', 'Arkitektur', 'Utveckling', 'Testning', 'Lansering', 'Support']
    },
    {
      id: '4',
      title: 'Design & rådgivning',
      short_description: 'UX, grafisk design och teknikrådgivning',
      description: 'Kompetens inom pedagogik, UX-design och grafisk formgivning. Vi hjälper dig hitta rätt lösning och undvika dyra misstag.',
      icon: 'Coffee', 
      price_info: null
    },
    {
      id: '5',
      title: 'Betalning & Villkor',
      short_description: 'Information om betalningsvillkor och process',
      description: `
        <div>
          <p>Vi arbetar alltid med tydliga avtal för allas trygghet och transparens i våra affärsrelationer.</p>
          
          <h2>Betalningsprocess</h2>
          <p>Vi inleder alltid ett projekt med avtalsskrivning för att säkerställa att alla parter är trygga och vet vad som gäller. Betalning sker med en förskottsbetalning vid projektstart och slutbetalning vid leverans.</p>
          
          <h2>Avbetalningsplaner</h2>
          <p>Vi är öppna för att sätta upp avbetalningsplaner som passar ditt företags kassaflöde. Kontakta oss så diskuterar vi en lösning som fungerar för alla parter.</p>
          
          <h2>Pro bono-projekt</h2>
          <p>Har du en riktigt bra idé eller ett projekt i tankarna för en bra sak men har svårt att finansiera detta själv? Vi tar med jämna mellanrum emot projekt som vi utför gratis, i mån av tid. Om ditt projekt kan göra skillnad och bidra till något positivt i samhället, hör gärna av dig så tittar vi på möjligheterna.</p>
        </div>
      `,
      icon: 'CreditCard',
      price_info: 'Se projektspecifika offerter',
      features: ['Tydliga avtal', 'Flexibla betalningsplaner', 'Förskotts- och slutbetalning', 'Pro bono-möjligheter'],
      process_steps: ['Kontakt', 'Avtal', 'Förskottsbetalning', 'Projektstart', 'Leverans', 'Slutbetalning']
    }
  ]

  const displayServices = services && services.length > 0 ? services : defaultServices

  return (
    <PageWrapper>
      <HeroSection>
        <h1 className="text-4xl font-bold tracking-tighter leading-relaxed sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          Vad vi kan{' '}
          <span className="text-primary">
            hjälpa dig med
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
          Från enkla webbsidor till komplicerade system - vi tar emot kunder redan nu! 
          Hemsidan är under utveckling men verksamheten är igång.
          <br />
          <span className="text-sm text-muted-foreground/70">Allt innehåll på denna sida är exempel/mocktext för demonstrationsändamål.</span>
        </p>
      </HeroSection>


      {/* Services Grid */}
      <AnimatedSection animation="scale-in">
        <section className="container py-16">
          <ServicesGrid services={displayServices} />
        </section>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection animation="slide-up">
        <section className="bg-muted/50 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Varför jobba med oss?
              </h2>
              <p className="mt-4 text-muted-foreground">
                För att vi fattar vad det är du vill ha gjort och gör det utan krångel
              </p>
            </div>

            <AnimatedGrid className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Rakt på sak</h3>
                <p className="mt-2 text-muted-foreground">
                  Inga konstiga konsultsnack eller flummiga presentationer. Vi gör det du vill ha gjort, punkt.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Vi bryr oss</h3>
                <p className="mt-2 text-muted-foreground">
                  Ditt projekt är vårt projekt. Vi jobbar inte bara för att få betalt, utan för att du ska bli nöjd.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Snabbt & enkelt</h3>
                <p className="mt-2 text-muted-foreground">
                  Vi gillar inte byråkrati eller långa processer. Säg vad du vill ha så börjar vi jobba på det direkt.
                </p>
              </div>
            </AnimatedGrid>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection animation="scale-in-delayed">
        <section className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Låter det intressant?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hör av dig så tar vi en kaffe och pratar om vad vi kan hjälpa dig med. Vi tar emot kunder redan nu!
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/kontakt">
                  Hör av dig
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">
                  Läs vad vi skriver om
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </PageWrapper>
  )
}