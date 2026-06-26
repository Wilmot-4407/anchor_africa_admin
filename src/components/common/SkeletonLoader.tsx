// SkeletonLoader.tsx — ANCHOR brand-styled loaders

// ── Brand Spinner ──────────────────────────────────────────────────────────
export function BrandSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims  = size === "sm" ? "w-5 h-5"   : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const clr   = size === "sm" ? "bg-current" : "bg-accent-blue";
  const clrBg = size === "sm" ? "bg-current" : "bg-accent-blue/80";
  return (
    <span role="status" className={`relative inline-flex ${dims} flex-shrink-0`}>
      <span className={`animate-ping absolute inset-0 rounded-full ${clr} opacity-75`} />
      <span className={`animate-ping absolute inset-0 rounded-full ${clr} opacity-50 [animation-delay:200ms]`} />
      <span className={`absolute inset-0 rounded-full ${clrBg}`} />
      <span className="sr-only">Loading…</span>
    </span>
  );
}

// ── Full-page loading overlay ──────────────────────────────────────────────
export function PageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-24 gap-5">
      <BrandSpinner size="lg" />
      <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">
        {label}
      </p>
    </div>
  );
}

// ── Skeleton shimmer helper ────────────────────────────────────────────────
function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] rounded ${className}`}
      style={{ animation: "shimmer 1.5s infinite linear" }}
    />
  );
}

// ── Table row skeleton ─────────────────────────────────────────────────────
export function TableSkeletonLoader({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-3 flex-1 rounded-full" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, ri) => (
          <div key={ri} className="px-5 py-4 flex items-center gap-4">
            <Shimmer className="h-4 w-4 rounded" />
            <Shimmer className="h-4 flex-1 max-w-[240px]" />
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-4 w-16" />
            <Shimmer className="h-6 w-28 ml-auto rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Card skeleton (kept for backward compat) ───────────────────────────────
export function CardSkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 animate-pulse"
        >
          <Shimmer className="h-4 w-24 rounded-full" />
          <Shimmer className="h-5 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-4 w-1/2" />
          <div className="flex gap-2 pt-2">
            <Shimmer className="h-8 flex-1 rounded-lg" />
            <Shimmer className="h-8 flex-1 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
