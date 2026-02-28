// StateComponents.tsx — ANCHOR brand-styled empty/error states
import { AlertTriangle, FolderOpen, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Get started by creating your first entry.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center">
        <FolderOpen size={28} className="text-primary/60" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-700">
          Failed to load data
        </p>
        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
