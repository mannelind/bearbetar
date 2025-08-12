import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { ADMIN_ROUTES } from '@/lib/constants'
import { ArticleForm } from '@/components/forms/article-form'
import AdminPageWrapper from '@/components/auth/admin-page-wrapper'

export default function NewArticlePage() {
  return (
    <AdminPageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={ADMIN_ROUTES.articles}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till artiklar
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ny Artikel</h1>
          <p className="text-muted-foreground">
            Skapa en ny bloggpost eller artikel
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Artikeldetaljer</CardTitle>
          </CardHeader>
          <CardContent>
            <ArticleForm />
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  )
}