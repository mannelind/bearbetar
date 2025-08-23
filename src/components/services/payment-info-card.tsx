'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, CheckCircle, Heart, FileText, Handshake, Banknote } from 'lucide-react'

export function PaymentInfoCard() {
  return (
    <Card className="payment-info-card col-span-full bg-gradient-to-br from-muted/50 via-background to-muted/30 border-2 border-primary/20">
      <CardHeader className="text-center pb-4 sm:pb-6">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
            <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl text-primary">Betalning & Villkor</CardTitle>
        <p className="text-sm sm:text-base text-muted-foreground px-2 sm:px-0">Information om våra betalningsvillkor och process</p>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Betalningsprocess */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold">Betalningsprocess</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vi inleder alltid ett projekt med avtalsskrivning för att säkerställa att alla parter är trygga och vet vad som gäller. 
              Betalning sker med en förskottsbetalning vid projektstart och slutbetalning vid leverans.
            </p>
            <div className="flex items-start sm:items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Tydliga avtal för allas trygghet</span>
            </div>
          </div>

          {/* Avbetalningsplaner */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold">Avbetalningsplaner</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vi är öppna för att sätta upp avbetalningsplaner som passar ditt företags kassaflöde. 
              Kontakta oss så diskuterar vi en lösning som fungerar för alla parter.
            </p>
            <div className="flex items-start sm:items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>Flexibla betalningslösningar</span>
            </div>
          </div>
        </div>

        {/* Pro bono-projekt */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="space-y-2 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold">
                Pro bono-projekt
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Har du en riktigt bra idé eller ett projekt i tankarna för en bra sak men har svårt att finansiera detta själv? 
                Vi tar med jämna mellanrum emot projekt som vi utför gratis, i mån av tid. Om ditt projekt kan göra skillnad 
                och bidra till något positivt i samhället, hör gärna av dig så tittar vi på möjligheterna.
              </p>
            </div>
          </div>
        </div>

        {/* Process steps */}
        <div className="pt-4 border-t">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Handshake className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            Vår process
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-2 text-center">
            {['Kontakt', 'Avtal', 'Förskottsbetalning', 'Projektstart', 'Leverans', 'Slutbetalning'].map((step, index) => (
              <div key={step} className="flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground leading-tight text-center">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}