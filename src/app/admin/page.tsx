import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ADMIN_ROUTES } from '@/lib/constants'
import AdminPageWrapper from '@/components/auth/admin-page-wrapper'
import { 
  FileText, 
  Settings, 
  Plus, 
  TrendingUp, 
  Users, 
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react'

// Mock stats for now - will be replaced with real data later
const mockStats = {
  totalArticles: 0,
  publishedArticles: 0,
  totalServices: 0,
  activeServices: 0,
  totalCategories: 0,
  totalTags: 0,
}

export default async function AdminDashboard() {
  
  const stats = mockStats // TODO: Replace with real database queries

  const statCards = [
    {
      title: 'Artiklar',
      value: stats.totalArticles,
      description: `${stats.publishedArticles} publicerade`,
      icon: FileText,
      href: ADMIN_ROUTES.articles,
    },
    {
      title: 'Tjänster',
      value: stats.totalServices,
      description: `${stats.activeServices} aktiva`,
      icon: Settings,
      href: ADMIN_ROUTES.services,
    },
    {
      title: 'Kategorier',
      value: stats.totalCategories,
      description: 'För organisering',
      icon: BarChart3,
      href: ADMIN_ROUTES.articles, // Will add categories page later
    },
    {
      title: 'Taggar',
      value: stats.totalTags,
      description: 'För sökbara etiketter',
      icon: Users,
      href: ADMIN_ROUTES.articles, // Will add tags page later
    },
  ]

  const quickActions = [
    {
      title: 'Ny Artikel',
      description: 'Skapa en ny bloggpost eller artikel',
      icon: FileText,
      href: ADMIN_ROUTES.newArticle,
    },
    {
      title: 'Ny Tjänst',
      description: 'Lägg till en ny tjänst till webbplatsen',
      icon: Settings,
      href: ADMIN_ROUTES.newService,
    },
  ]

  return (
    <AdminPageWrapper>
      <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Välkommen tillbaka!
          </h1>
          <p className="text-muted-foreground">
            Hantera ditt innehåll och inställningar
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Calendar className="mr-1 h-3 w-3" />
          {new Date().toLocaleDateString('sv-SE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <Link href={stat.href}>
                <Button variant="link" size="sm" className="p-0 mt-2 h-auto text-xs">
                  <Eye className="mr-1 h-3 w-3" />
                  Visa alla
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Snabbåtgärder
            </CardTitle>
            <CardDescription>
              Skapa nytt innehåll snabbt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-4"
                >
                  <action.icon className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Senaste aktivitet
            </CardTitle>
            <CardDescription>
              Nyliga ändringar och uppdateringar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">
                Inga aktiviteter än. Skapa ditt första innehåll för att komma igång!
              </p>
              <Link href={ADMIN_ROUTES.newArticle}>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Skapa första artikeln
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Help */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            🚀 Kom igång med Bearbetar Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 dark:text-blue-200">
          <div className="space-y-2 text-sm">
            <p>• <strong>Skapa artiklar:</strong> Dela insikter och expertis genom blogginlägg</p>
            <p>• <strong>Hantera tjänster:</strong> Visa upp era professionella tjänster</p>
            <p>• <strong>Organisera innehåll:</strong> Använd kategorier och taggar för bättre struktur</p>
            <p>• <strong>Publicera:</strong> Kontrollera vad som visas publikt på webbplatsen</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminPageWrapper>
  )
}