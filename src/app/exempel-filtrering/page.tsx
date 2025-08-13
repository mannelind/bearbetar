'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentFilters, FilterState } from '@/components/ui/content-filters'
import { AnimatedSection, PageWrapper } from '@/components/ui/page-animations'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { Search } from 'lucide-react'

// Example data för att visa hur systemet fungerar
const exampleContent = [
  {
    id: '1',
    title: 'React Hooks Guide',
    description: 'Lär dig allt om React Hooks',
    tags: ['React', 'JavaScript', 'Frontend'],
    category: 'tutorial',
    author: 'Manne',
    date: '2024-01-15',
    type: 'tutorial'
  },
  {
    id: '2', 
    title: 'Next.js Performance Tips',
    description: 'Optimera din Next.js app',
    tags: ['Next.js', 'Performance', 'React'],
    category: 'tips',
    author: 'Adam',
    date: '2024-01-10',
    type: 'article'
  },
  {
    id: '3',
    title: 'TypeScript Best Practices',
    description: 'Skriv bättre TypeScript kod',
    tags: ['TypeScript', 'Best Practices', 'JavaScript'],
    category: 'guide',
    author: 'Manne',
    date: '2024-01-05',
    type: 'guide'
  }
]

export default function ExempelFilteringPage() {
  const [filteredContent, setFilteredContent] = useState(exampleContent)
  
  const handleFiltersChange = (filters: FilterState) => {
    let filtered = [...exampleContent]
    
    // Search filter
    if (filters.search) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category)
    }
    
    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item => 
        filters.tags.some(tagId => item.tags.some(tag => tag.toLowerCase() === tagId.toLowerCase()))
      )
    }
    
    // Custom filters
    if (filters.customFilters.type && filters.customFilters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.customFilters.type)
    }
    
    // Author filter
    if (filters.author && filters.author !== 'all') {
      filtered = filtered.filter(item => item.author === filters.author)
    }
    
    // Date filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date(now)
      
      switch (filters.dateRange) {
        case 'last_week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'last_month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'last_year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(item => new Date(item.date) >= filterDate)
    }
    
    // Sort
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }
    
    setFilteredContent(filtered)
  }

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
            {/* Left side - Logo */}
            <AnimatedSection animation="slide-in-left">
              <div className="flex justify-center lg:justify-start">
                <ThemeLogo 
                  alt="Bearbetar logotyp"
                  width={400}
                  height={160}
                  className="w-auto h-24 md:h-32 lg:h-40"
                  type="full"
                />
              </div>
            </AnimatedSection>
            
            {/* Right side - Text content */}
            <AnimatedSection animation="slide-up-delayed">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                  Exempel på{' '}
                  <span className="text-primary">
                    Filtreringssystem
                  </span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
                  Detta är ett exempel på hur vårt enhetliga filtreringssystem kan användas
                  på olika typer av innehåll med anpassade filter för varje behov.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Filters */}
      <AnimatedSection animation="fade-in">
        <section className="container py-8">
          <ContentFilters
            config={{
              contentType: 'generic',
              enableSearch: true,
              enableCategories: true,
              enableTags: true,
              enableSort: true,
              enableViewToggle: true,
              enableDateFilter: true,
              enableAuthorFilter: true,
              categoryTable: 'article_categories', // Hypothetical table
              searchPlaceholder: 'Sök innehåll...',
              customFilters: [
                {
                  key: 'type',
                  label: 'Typ',
                  options: [
                    { value: 'tutorial', label: 'Tutorial' },
                    { value: 'article', label: 'Artikel' },
                    { value: 'guide', label: 'Guide' },
                    { value: 'video', label: 'Video' }
                  ]
                },
                {
                  key: 'difficulty',
                  label: 'Svårighetsgrad',
                  options: [
                    { value: 'beginner', label: 'Nybörjare' },
                    { value: 'intermediate', label: 'Medel' },
                    { value: 'advanced', label: 'Avancerad' }
                  ]
                }
              ],
              sortOptions: [
                { value: 'newest', label: 'Senaste' },
                { value: 'oldest', label: 'Äldsta' },
                { value: 'title', label: 'Titel A-Ö' },
                { value: 'popular', label: 'Populära' }
              ]
            }}
            onFiltersChange={handleFiltersChange}
          />
        </section>
      </AnimatedSection>

      {/* Content Grid */}
      <AnimatedSection animation="scale-in-delayed">
        <section className="container py-16">
          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Inget innehåll hittades</h3>
              <p className="text-muted-foreground">
                Prova att ändra dina filter för att hitta mer innehåll.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.author} • {new Date(item.date).toLocaleDateString('sv-SE')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </AnimatedSection>

      {/* Information Section */}
      <AnimatedSection animation="slide-up">
        <section className="bg-muted/50 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter">
                Så fungerar filtreringssystemet
              </h2>
              <p className="mt-4 text-muted-foreground">
                Vårt enhetliga filtreringssystem kan anpassas för olika typer av innehåll
              </p>
              
              <div className="mt-8 grid gap-6 md:grid-cols-2 text-left">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Konfigurerbart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Aktivera endast de filter du behöver för din specifika innehållstyp.
                      Sök, kategorier, taggar, datum, författare och anpassade filter.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Återanvändbart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Samma komponent kan användas för portfolio, blog, tjänster och
                      vilket innehåll som helst med konsekvent användarupplevelse.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </PageWrapper>
  )
}