// Skeleton that mirrors the exact layout of the AboutEditor form
export function AboutEditorSkeleton() {
  const pulse = "animate-pulse bg-slate-100 rounded-lg";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-7 space-y-2">
        <div className={`${pulse} h-6 w-40`} />
        <div className={`${pulse} h-4 w-72`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 pt-6 pb-4 space-y-0">
          {/* Title field */}
          <div className="space-y-1.5 mb-5">
            <div className={`${pulse} h-4 w-10`} />
            <div className={`${pulse} h-10 w-full`} />
          </div>

          {/* Description field */}
          <div className="space-y-1.5">
            <div className={`${pulse} h-4 w-20`} />
            <div className={`${pulse} h-24 w-full`} />
          </div>

          {/* MAIN IMAGE section */}
          <SectionDivider />
          <div className="space-y-1.5">
            <div className={`${pulse} h-4 w-24`} />
            <div className={`${pulse} h-44 w-full rounded-xl`} />
          </div>

          {/* FEATURE CHECKLIST section */}
          <SectionDivider />
          <div className={`${pulse} h-3 w-80 mb-3`} />
          <div className="space-y-1.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`${pulse} h-10 w-full`} />
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <div className={`${pulse} h-10 flex-1`} />
            <div className={`${pulse} h-10 w-20`} />
          </div>

          {/* OPEN HOURS section */}
          <SectionDivider />
          <div className={`${pulse} h-3 w-64 mb-3`} />
          <div className="rounded-lg border border-slate-100 overflow-hidden">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
              >
                <div className={`${pulse} h-4 w-20 flex-shrink-0`} />
                <div className={`${pulse} h-8 flex-1`} />
                <div className={`${pulse} h-4 w-16 flex-shrink-0`} />
              </div>
            ))}
          </div>

          {/* CALL TO ACTION section */}
          <SectionDivider />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className={`${pulse} h-4 w-20`} />
              <div className={`${pulse} h-10 w-full`} />
            </div>
            <div className="space-y-1.5">
              <div className={`${pulse} h-4 w-20`} />
              <div className={`${pulse} h-10 w-full`} />
            </div>
          </div>

          {/* CONTACT section */}
          <SectionDivider />
          <div className="space-y-1.5">
            <div className={`${pulse} h-4 w-28`} />
            <div className={`${pulse} h-10 w-full`} />
            <div className={`${pulse} h-3 w-64`} />
          </div>

          {/* VISIBILITY section */}
          <SectionDivider />
          <div className="flex items-center justify-between py-3.5 px-4 bg-slate-50 border border-slate-100 rounded-lg">
            <div className="space-y-1.5">
              <div className={`${pulse} h-4 w-28`} />
              <div className={`${pulse} h-3 w-48`} />
            </div>
            <div className={`${pulse} h-6 w-10 rounded-full`} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/40 rounded-b-xl">
          <div className={`${pulse} h-8 w-28`} />
          <div className={`${pulse} h-9 w-28`} />
        </div>
      </div>
    </div>
  );
}

// Reusable section divider skeleton matching the real Section component
function SectionDivider() {
  return (
    <div className="flex items-center gap-3 mt-8 mb-5">
      <div className="animate-pulse bg-slate-100 rounded h-3 w-24" />
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}
