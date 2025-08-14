import { Suspense } from 'react'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'
import { ContentFilters } from '@/components/ui/content-filters'
import { ThemeLogo } from '@/components/ui/theme-logo'
import { AnimatedSection } from '@/components/ui/page-animations'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:grid lg:grid-cols-2 items-center text-center lg:text-left">
              {/* Left side - Logo */}
              <AnimatedSection animation="slide-in-left">
                <div className="flex justify-center">
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
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl mb-6">
                    Vårt{' '}
                    <span className="text-primary">
                      Portfolio
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground sm:text-xl max-w-xl mx-auto lg:mx-0 lg:max-w-none">
                    Utforska våra projekt, från enkla webbsidor till avancerade case studies. 
                    Varje projekt berättar en historia om innovation och problemlösning.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
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
        <section>
          <Suspense fallback={<div>Loading portfolio...</div>}>
            <PortfolioGrid />
          </Suspense>
        </section>
      </div>
    </div>
  )
}