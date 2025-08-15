import { Suspense } from 'react'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'
import { ContentFilters } from '@/components/ui/content-filters'
import { HeroSection } from '@/components/ui/hero-section'

export default function PortfolioPage() {
  return (
    <div className="flex flex-col">
      <HeroSection className="mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl mb-6">
            Vårt{' '}
            <span className="text-primary">
              Portfolio
            </span>
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
            Här kommer vi visa projekt vi jobbar på. Än så länge är det tomt här, men det kommer fyllas på efterhand!
          </p>
        </HeroSection>

      {/* Filters */}
      <section className="container mb-8">
        <Suspense fallback={<div>Loading filters...</div>}>
          <ContentFilters
            config={{
              contentType: 'portfolio',
              enableSearch: true,
              enableCategories: true,
              enableTags: true,
              enableSort: true,
              enableViewToggle: true,
              categoryTable: 'portfolio_categories',
              searchPlaceholder: 'Sök i portfolio...',
              customFilters: [
                {
                  key: 'type',
                  label: 'Typ',
                  options: [
                    { value: 'simple', label: 'Portfolio' },
                    { value: 'case_study', label: 'Case Studies' }
                  ]
                }
              ]
            }}
          />
        </Suspense>
      </section>

      {/* Portfolio Grid */}
      <section className="container">
        <Suspense fallback={<div>Loading portfolio...</div>}>
          <PortfolioGrid />
        </Suspense>
      </section>
    </div>
  )
}