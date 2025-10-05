import { Card, CardContent, CardFooter } from './ui/card'

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl card-premium border-0">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="aspect-square bg-gallery-stone skeleton" />
        
        <div className="p-5">
          {/* Artist and origin skeleton */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="h-3 w-24 bg-gallery-stone skeleton rounded" />
            <div className="h-5 w-20 bg-gallery-stone skeleton rounded-full" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-2 mb-1.5">
            <div className="h-5 bg-gallery-stone skeleton rounded w-full" />
            <div className="h-5 bg-gallery-stone skeleton rounded w-3/4" />
          </div>

          {/* Art form skeleton */}
          <div className="h-4 w-32 bg-gallery-stone skeleton rounded mb-2.5" />

          {/* Rating skeleton */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-3.5 h-3.5 bg-gallery-stone skeleton rounded" />
              ))}
            </div>
            <div className="h-3 w-8 bg-gallery-stone skeleton rounded" />
          </div>

          {/* Price skeleton */}
          <div className="flex items-baseline justify-between mb-3">
            <div className="h-7 w-24 bg-gallery-stone skeleton rounded" />
            <div className="h-6 w-20 bg-gallery-stone skeleton rounded-full" />
          </div>

          {/* Details skeleton */}
          <div className="space-y-1.5 border-t border-gallery-stone pt-3">
            <div className="h-3 bg-gallery-stone skeleton rounded w-3/4" />
            <div className="h-3 bg-gallery-stone skeleton rounded w-2/3" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <div className="w-full h-12 bg-gallery-stone skeleton rounded-lg" />
      </CardFooter>
    </Card>
  )
}

// Grid skeleton for loading states
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
