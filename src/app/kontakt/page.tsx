import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { AnimatedSection, PageWrapper } from '@/components/ui/page-animations'
import { ContactForm } from '@/components/forms/contact-form'
import { Mail, Phone, MapPin, Clock, Coffee } from 'lucide-react'

export default function ContactPage() {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Logo */}
            <AnimatedSection animation="slide-in-left">
              <div className="flex justify-center lg:justify-center">
                <div className="text-center lg:text-left">
                  <ThemeLogo 
                    alt="Bearbetar logotyp"
                    width={400}
                    height={160}
                    className="w-auto h-24 md:h-32 lg:h-40"
                    type="full"
                  />
                </div>
              </div>
            </AnimatedSection>
            
            {/* Right side - Text content */}
            <AnimatedSection animation="slide-up-delayed">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                  Hör av{' '}
                  <span className="text-primary">
                    dig!
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl lg:max-w-none">
                  Har du ett projekt i åtanke? Vill du bara prata om en idé? Vi älskar att höra från folk som vill bygga coola grejer.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Form */}
          <AnimatedSection animation="scale-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Skicka ett meddelande</CardTitle>
                <CardDescription>
                  Berätta vad du tänker på så hör vi av oss snart. Första timmen kostar inget!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact Info & Details */}
          <AnimatedSection animation="slide-up-delayed">
            <div className="space-y-8">
              
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-primary" />
                    Snabb kontakt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:hej@bearbetar.se" className="text-sm text-muted-foreground hover:text-foreground">
                        hej@bearbetar.se
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Telefon</p>
                      <a href="tel:+46123456789" className="text-sm text-muted-foreground hover:text-foreground">
                        +46 12 345 67 89
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Plats</p>
                      <p className="text-sm text-muted-foreground">
                        Stockholm, Sverige (men jobbar remote)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Svarstid</p>
                      <p className="text-sm text-muted-foreground">
                        Vanligtvis inom 24 timmar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What to expect */}
              <Card>
                <CardHeader>
                  <CardTitle>Vad händer sen?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Vi hör av oss</p>
                      <p className="text-sm text-muted-foreground">Vanligtvis samma dag du hör av dig</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Vi pratar</p>
                      <p className="text-sm text-muted-foreground">Ett samtal eller möte för att förstå vad du vill ha</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Vi börjar bygga</p>
                      <p className="text-sm text-muted-foreground">Om det känns bra för båda, sätter vi igång</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Vill du träffas på riktigt?</h3>
                    <p className="text-sm text-muted-foreground">
                      Vi gillar att träffa folk över en kaffe och prata om projekt. Första timmen kostar inget!
                    </p>
                    <Button asChild>
                      <Link href="/tjanster">
                        Se våra tjänster
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </AnimatedSection>
          
        </div>
      </div>
    </PageWrapper>
  )
}