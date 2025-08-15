'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { type EmblaOptionsType } from 'embla-carousel'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CarouselApi = ReturnType<typeof useEmblaCarousel>[1]
type CarouselOptions = EmblaOptionsType

interface CarouselProps {
  opts?: CarouselOptions
  plugins?: any[]
  className?: string
  children: React.ReactNode
}

interface CarouselContextProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(({ opts, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  const onInit = useCallback((api: CarouselApi) => {
    if (!api) {
      return
    }
    setScrollSnaps(api.scrollSnapList())
  }, [])

  const scrollPrev = useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  useEffect(() => {
    if (!api) {
      return
    }

    onInit(api)
    onSelect(api)
    api.on('reInit', onInit)
    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api?.off('select', onSelect)
      api?.off('reInit', onInit)
      api?.off('reInit', onSelect)
    }
  }, [api, onInit, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
        selectedIndex,
        scrollSnaps,
        scrollTo,
      }}
    >
      <div
        ref={ref}
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        <div className="overflow-visible" onKeyDownCapture={handleKeyDown}>
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = 'Carousel'

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-visible">
      <div
        ref={ref}
        className={cn('flex', className)}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
      {...props}
    />
  )
})
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { canScrollPrev, scrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-10 w-10 rounded-full -left-5 top-1/2 -translate-y-1/2 z-10',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
  const { canScrollNext, scrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        'absolute h-10 w-10 rounded-full -right-5 top-1/2 -translate-y-1/2 z-10',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = 'CarouselNext'

const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn('flex justify-center gap-2 pt-4', className)}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          className={cn(
            'h-2 w-2 rounded-full transition-all duration-200',
            index === selectedIndex
              ? 'bg-primary w-6'
              : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
          )}
          onClick={() => scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
})
CarouselDots.displayName = 'CarouselDots'

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
}