import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterIcon,
  FileTextIcon,
  CalendarIcon,
  UserPlusIcon,
  SettingsIcon,
  EditIcon,
  ImageIcon,
  ClockIcon,
  ShieldIcon,
  UsersIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "../redux/store";
import { fetchLogs, fetchLogTypes } from "../redux/actions/logs";
import { setCurrentPage } from "../redux/slices/logsSlice";
import { Log } from "../redux/types";

// ─── Type → display config ────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  auth:    { icon: <ShieldIcon size={14} />,   color: "text-indigo-400",  bg: "bg-indigo-500/10",  label: "Auth" },
  user:    { icon: <UsersIcon size={14} />,    color: "text-amber-400",   bg: "bg-amber-500/10",   label: "Users" },
  team:    { icon: <UserPlusIcon size={14} />, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Team" },
  blog:    { icon: <FileTextIcon size={14} />, color: "text-purple-400",  bg: "bg-purple-500/10",  label: "Blog" },
  service: { icon: <EditIcon size={14} />,     color: "text-blue-400",    bg: "bg-blue-500/10",    label: "Services" },
  about:   { icon: <ImageIcon size={14} />,    color: "text-rose-400",    bg: "bg-rose-500/10",    label: "About" },
  faq:     { icon: <SettingsIcon size={14} />, color: "text-slate-300",   bg: "bg-white/10",       label: "FAQ" },
};

const DEFAULT_CONFIG = {
  icon: <CalendarIcon size={14} />,
  color: "text-slate-300",
  bg: "bg-white/5",
  label: "Other",
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? DEFAULT_CONFIG;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1)
    return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function getActorName(log: Log): string {
  if (typeof log.createdBy === "object" && log.createdBy !== null) {
    const u = log.createdBy as { firstName: string; lastName: string; userName: string };
    return u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.userName;
  }
  return log.userName || "Unknown";
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Animation variants ───────────────────────────────────────────────────────

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const fadeUp  = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.22 } } };

// ─── Component ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 20;

export function ActivityLogView() {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, isLoading, error, totalCount, currentPage, totalPages, availableTypes } =
    useSelector((state: RootState) => state.logs);

  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => { dispatch(fetchLogTypes()); }, [dispatch]);

  const loadLogs = useCallback(
    (page = 1) => {
      dispatch(fetchLogs({ page, limit: PAGE_LIMIT, type: typeFilter !== "all" ? typeFilter : undefined }));
    },
    [dispatch, typeFilter],
  );

  useEffect(() => { loadLogs(1); }, [loadLogs]);

  const goToPage = (page: number) => {
    dispatch(setCurrentPage(page));
    loadLogs(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterTypes = ["all", ...availableTypes].filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Log</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track all changes and actions across the platform
            {totalCount > 0 && (
              <span className="ml-2 text-slate-500">— {totalCount.toLocaleString()} total entries</span>
            )}
          </p>
        </div>
        <button
          onClick={() => loadLogs(currentPage)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          title="Refresh"
        >
          {isLoading ? (
            <span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0">
              <span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" />
              <span className="absolute inset-0 rounded-full bg-current" />
            </span>
          ) : <RefreshCwIcon size={13} />}
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs text-slate-500 font-medium">Type:</span>
        {filterTypes.map((type) => {
          const cfg = type === "all" ? null : getTypeConfig(type);
          const isActive = typeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize transition-colors border ${
                isActive
                  ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                  : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              {cfg?.label ?? "All"}
            </button>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <AlertCircleIcon size={16} />
          <span>{error}</span>
          <button onClick={() => loadLogs(currentPage)} className="ml-auto text-xs underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && logs.length === 0 && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 py-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
              <div className="flex-1 bg-white/5 rounded-xl h-16" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && logs.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <FilterIcon size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No activity found for the selected filters.</p>
        </div>
      )}

      {/* Timeline */}
      {logs.length > 0 && (
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-1">
            <AnimatePresence mode="wait">
              {logs.map((entry) => {
                const typeConfig = getTypeConfig(entry.type);
                const actorName = getActorName(entry);
                const initials = getInitials(actorName);

                return (
                  <motion.div
                    key={entry._id}
                    variants={fadeUp}
                    className="flex items-start gap-4 py-3 relative"
                  >
                    {/* Type icon */}
                    <div
                      className={`w-10 h-10 rounded-full ${typeConfig.bg} flex items-center justify-center ${typeConfig.color} flex-shrink-0 z-10 border-4 border-[#0f1a2a]`}
                    >
                      {typeConfig.icon}
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-[#1b2940] rounded-xl border border-white/10 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {/* Actor + action badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-[10px] font-semibold text-slate-300 flex-shrink-0">
                              {initials}
                            </span>
                            <p className="text-sm text-white font-semibold truncate">{actorName}</p>
                            {entry.action && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${typeConfig.bg} ${typeConfig.color}`}
                              >
                                {entry.action}
                              </span>
                            )}
                          </div>

                          {/* Message */}
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {entry.message}
                          </p>

                          {/* Meta */}
                          {(entry.ip || entry.browserName) && (
                            <p className="text-[10px] text-slate-600 mt-1.5 truncate">
                              {entry.ip && <span>IP: {entry.ip}</span>}
                              {entry.ip && entry.browserName && <span className="mx-1">·</span>}
                              {entry.browserName && (
                                <span className="truncate">{entry.browserName.split(" ")[0]}</span>
                              )}
                            </p>
                          )}
                        </div>

                        {/* Timestamp */}
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 flex-shrink-0 whitespace-nowrap mt-0.5">
                          <ClockIcon size={10} />
                          {formatTimestamp(entry.createdAt)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages} &nbsp;·&nbsp; {totalCount.toLocaleString()} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                  className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon size={14} />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page =
                    totalPages <= 5
                      ? i + 1
                      : currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-7 h-7 text-xs rounded-lg border transition-colors ${
                        page === currentPage
                          ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                          : "border-white/10 text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                  className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
