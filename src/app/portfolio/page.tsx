import { Suspense } from 'react'
import { PortfolioGrid } from '@/components/portfolio/portfolio-grid'
import { PortfolioFilters } from '@/components/portfolio/portfolio-filters'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
            Vårt{' '}
            <span className="text-primary">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Utforska våra projekt, från enkla webbsidor till avancerade case studies. 
            Varje projekt berättar en historia om innovation och problemlösning.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <Suspense fallback={<div>Loading filters...</div>}>
            <PortfolioFilters />
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