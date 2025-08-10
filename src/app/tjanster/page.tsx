import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createServerComponentClient } from '@/lib/supabase'
import { 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3,
  ArrowRight,
  CheckCircle 
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
      title: 'Affärsutveckling',
      short_description: 'Strategier för tillväxt och expansion',
      description: 'Vi hjälper företag att identifiera tillväxtmöjligheter och utveckla strategier för hållbar expansion.',
      icon: 'TrendingUp',
      price_info: 'Från 15 000 kr/månad'
    },
    {
      id: '2', 
      title: 'Ledarskapsutveckling',
      short_description: 'Stärk din organisations ledarskap',
      description: 'Utveckla ledarskapsförmågor hos dina medarbetare genom våra skräddarsydda program.',
      icon: 'Users',
      price_info: 'Från 25 000 kr/program'
    },
    {
      id: '3',
      title: 'Strategisk Rådgivning', 
      short_description: 'Experthjälp för strategiska beslut',
      description: 'Få tillgång till vår expertis för att fatta rätt strategiska beslut för ditt företag.',
      icon: 'Target',
      price_info: 'Från 2 500 kr/timme'
    },
    {
      id: '4',
      title: 'Dataanalys & Insikter',
      short_description: 'Datadriven beslutsfattning',
      description: 'Analysera dina data och få insikter som driver ditt företag framåt.',
      icon: 'BarChart3', 
      price_info: 'Från 20 000 kr/projekt'
    }
  ]

  const displayServices = services && services.length > 0 ? services : defaultServices

  const getIcon = (iconName: string) => {
    const icons = {
      TrendingUp,
      Users, 
      Target,
      BarChart3
    }
    return icons[iconName as keyof typeof icons] || Target
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-8">
            <Image 
              src="/images/logga.svg"
              alt="Bearbetar logotyp"
              width={200}
              height={80}
              className="w-auto h-16 md:h-20"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Våra{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Tjänster
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Vi erbjuder professionella konsulttjänster som hjälper ditt företag 
            att växa, utvecklas och nå sina mål.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
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
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Varför välja Bearbetar?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Vi kombinerar djup expertis med praktisk erfarenhet för att leverera resultat
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Beprövad Metodik</h3>
              <p className="mt-2 text-muted-foreground">
                Våra metoder är testade i hundratals projekt och har visat påvisbar framgång.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Erfaret Team</h3>
              <p className="mt-2 text-muted-foreground">
                Vårt team har över 50 års samlad erfarenhet av affärsutveckling och konsulting.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Fokus på Resultat</h3>
              <p className="mt-2 text-muted-foreground">
                Vi arbetar alltid målorienterat och mäter framgång genom konkreta resultat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Redo att börja?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Kontakta oss idag för en kostnadsfri konsultation och se hur vi kan hjälpa ditt företag.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg">
              Boka konsultation
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">
                Läs våra insikter
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}