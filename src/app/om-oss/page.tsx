import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeroSection } from '@/components/ui/hero-section'
import { AnimatedSection, AnimatedGrid, PageWrapper } from '@/components/ui/page-animations'
import { User, Mail, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  // Statisk data för teammedlemmar
  const teamMembers = [
    {
      id: '1',
      full_name: 'Manne',
      email: 'manne@bearbetar.se',
      bio: 'Grundare och strateg med passion för affärsutveckling och innovation. Hjälper företag att växa genom strategisk rådgivning och praktiska lösningar.',
      profile_image: null,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      full_name: 'Adam',
      email: 'adam@bearbetar.se', 
      bio: 'Expert inom teknisk utveckling och digitalisering. Specialiserad på att transformera affärsprocesser genom teknik och automation.',
      profile_image: null,
      created_at: new Date().toISOString()
    }
  ]

  const companyDescription = 'Vi på Bearbetar hjälper företag att växa och utvecklas genom strategisk rådgivning och praktiska lösningar.'

  return (
    <PageWrapper>
      <HeroSection>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          Vilka är{' '}
          <span className="text-primary">
            vi egentligen?
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
          Vi är bara två killar som gillar att bygga saker och hjälpa andra att få sina idéer till verklighet.
        </p>
      </HeroSection>

      {/* Company Description */}
      <AnimatedSection animation="scale-in">
        <section className="container py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Vad vi håller på med</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {companyDescription}
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Team Members */}
      {teamMembers.length > 0 && (
        <AnimatedSection animation="slide-up">
          <section className="container py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Vi två</h2>
              <p className="text-muted-foreground mt-4">
                Manne och Adam - utvecklare, företagare och människor som gillar att lösa problem
              </p>
            </div>
            
            <AnimatedGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
              {teamMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      {member.profile_image ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
                          <Image
                            src={member.profile_image}
                            alt={member.full_name || member.email}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="w-10 h-10 text-primary" />
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl">
                      {member.full_name || 'Team Member'}
                    </CardTitle>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                    
                    <Badge variant="secondary" className="mx-auto w-fit">
                      Utvecklare & företagare
                    </Badge>
                  </CardHeader>
                  
                  {member.bio && (
                    <CardContent>
                      <CardDescription className="text-center text-base leading-relaxed">
                        {member.bio}
                      </CardDescription>
                    </CardContent>
                  )}
                </Card>
              ))}
            </AnimatedGrid>
          </section>
        </AnimatedSection>
      )}

      {/* Values Section */}
      <AnimatedSection animation="scale-in-delayed">
        <section className="bg-muted/50 py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Vad som driver oss</h2>
            </div>
            
            <AnimatedGrid className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Enkelhet</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Komplicerade saker ska göras enkla. Enkla saker ska hållas enkla.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Ärlighet</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Vi säger som det är. Om något är dåligt säger vi det. Om det är bra säger vi det också.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">Lärande</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Vi lär oss ständigt nya saker och delar med oss av det vi lärt oss.
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimatedGrid>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection animation="slide-up">
        <section className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter">
              Vill du hänga med oss?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hör av dig om du har ett projekt, en idé, eller bara vill prata teknik över en kaffe.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/tjanster">
                  Vad vi kan hjälpa dig med
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">
                  Läs vad vi skriver
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </PageWrapper>
  )
}