export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-slate-300 rounded w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-300 rounded"></div>
        <div className="h-4 bg-slate-300 rounded w-5/6"></div>
        <div className="h-4 bg-slate-300 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function CardSkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-slate-200 rounded-lg p-6">
          <div className="h-40 bg-slate-300 rounded mb-4"></div>
          <div className="h-6 bg-slate-300 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-slate-300 rounded mb-2"></div>
          <div className="h-4 bg-slate-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="h-6 bg-slate-300 rounded"></div>
        <div className="h-6 bg-slate-300 rounded"></div>
        <div className="h-6 bg-slate-300 rounded"></div>
        <div className="h-6 bg-slate-300 rounded"></div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
