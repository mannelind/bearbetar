import Link from 'next/link'
import { APP_NAME, PUBLIC_ROUTES } from '@/lib/constants'

const navigation = {
  main: [
    { name: 'Hem', href: PUBLIC_ROUTES.home },
    { name: 'Tjänster', href: PUBLIC_ROUTES.services },
    { name: 'Blogg', href: PUBLIC_ROUTES.blog },
  ],
  legal: [
    { name: 'Integritetspolicy', href: '/privacy' },
    { name: 'Användarvillkor', href: '/terms' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <span className="font-bold text-xl">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto md:mx-0">
              Vi hjälper företag att utvecklas och växa genom strategisk rådgivning, 
              affärsutveckling och professionella konsulttjänster.
            </p>
            <p className="text-sm text-muted-foreground">
              Kontakta oss för att diskutera hur vi kan hjälpa ditt företag.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Juridiskt</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {APP_NAME}. Alla rättigheter förbehållna.
            </p>
            <p className="text-sm text-muted-foreground">
              Byggd med ❤️ för svensk affärsutveckling
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}