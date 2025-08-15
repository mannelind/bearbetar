import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeroSection } from '@/components/ui/hero-section'
import { AnimatedSection, AnimatedGrid, PageWrapper } from '@/components/ui/page-animations'
import { createServerComponentClient } from '@/lib/supabase'
import { 
  Globe, 
  Smartphone, 
  Code, 
  Coffee,
  ArrowRight,
  CheckCircle,
  Heart,
  Zap 
} from 'lucide-react'

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
      short_description: 'Snygga och snabba webbplatser',
      description: 'Vi byggger moderna webbsidor som ser bra ut och laddar snabbt. Inga krångliga CMS eller konstiga administratörsverktyg - bara en sida som funkar.',
      icon: 'Globe',
      price_info: 'Månadsabonnemang från 399 kr/mån'
    },
    {
      id: '2', 
      title: 'Mobilappar',
      short_description: 'Appar för iOS och Android',
      description: 'Behöver du en app? Vi kan både native och hybrid-appar som funkar på alla telefoner. Vi hjälper dig hela vägen från idé till App Store.',
      icon: 'Smartphone',
      price_info: 'Från 50 000 kr för enkel app'
    },
    {
      id: '3',
      title: 'Skräddarsydd utveckling', 
      short_description: 'När standardlösningar inte räcker',
      description: 'Har du något specifikt du vill bygga? Vi kan utveckla allt från enkla verktyg till komplexa system. Säg vad du behöver så fixar vi det.',
      icon: 'Code',
      price_info: 'Från 1 200 kr/timme'
    },
    {
      id: '4',
      title: 'Konsultation & rådgivning',
      short_description: 'När du bara behöver prata',
      description: 'Ibland behöver man bara bolla idéer med någon som förstår teknik. Vi hjälper dig att tänka igenom vad som är smart att satsa på.',
      icon: 'Coffee', 
      price_info: 'Första timmen gratis, sedan 800 kr/h'
    }
  ]

  const displayServices = services && services.length > 0 ? services : defaultServices

  const getIcon = (iconName: string) => {
    const icons = {
      Globe,
      Smartphone, 
      Code,
      Coffee
    }
    return icons[iconName as keyof typeof icons] || Code
  }

  return (
    <PageWrapper>
      <HeroSection>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          Vad vi kan{' '}
          <span className="text-primary">
            hjälpa dig med
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
          Från enkla webbsidor till komplicerade system - vi bygger det du behöver 
          och hjälper dig att få det att funka.
        </p>
      </HeroSection>


      {/* Services Grid */}
      <AnimatedSection animation="scale-in">
        <section className="container py-16">
          <AnimatedGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {displayServices.map((service: any) => {
              const IconComponent = getIcon(service.icon || 'Target')
              return (
                <Card key={service.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        {service.short_description && (
                          <CardDescription className="mt-1">
                            {service.short_description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                    
                    {service.price_info && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="font-semibold text-primary">
                          {service.price_info}
                        </span>
                        <Button size="sm">
                          Kontakta oss
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </AnimatedGrid>
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
              Hör av dig så tar vi en kaffe och pratar om vad vi kan hjälpa dig med. Första timmen kostar inget.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg">
                Hör av dig
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