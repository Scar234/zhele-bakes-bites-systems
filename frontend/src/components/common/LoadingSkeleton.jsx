export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-4 border border-[#EEDCCB] shadow-xs flex flex-col justify-between">
      <div className="w-full aspect-square rounded-2xl bg-[#f2e2d2] animate-shimmer mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-[#f2e2d2] rounded-full w-3/4 animate-shimmer"></div>
        <div className="h-3 bg-[#f2e2d2] rounded-full w-1/2 animate-shimmer"></div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#f2e2d2]/60 flex items-center justify-between">
        <div className="h-5 bg-[#f2e2d2] rounded-full w-20 animate-shimmer"></div>
        <div className="h-8 bg-[#f2e2d2] rounded-full w-24 animate-shimmer"></div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
