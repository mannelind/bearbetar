import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Sidan hittades inte</h2>
          <p className="text-muted-foreground">
            Tyvärr kunde vi inte hitta sidan du letade efter.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    </div>
  )
}