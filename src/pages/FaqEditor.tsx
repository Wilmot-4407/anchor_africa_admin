import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  MessageCircleQuestion,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { fetchFaq, upsertFaq } from "../redux/actions/faqs";
import { AppDispatch, RootState } from "../redux/store";
import {
  PageSpinner,
  TableSkeletonLoader,
} from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { FaqForm } from "../components/forms/FaqForm";
import { FaqReason, FaqReasonType } from "../redux/types";
import toast from "../utils/toast";

// ── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

const TYPE_STYLES: Record<FaqReasonType, string> = {
  General: "bg-slate-50 text-slate-600 border-slate-200",
  Services: "bg-primary/8 text-primary border-primary/20",
  Treatment: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pricing: "bg-secondary/10 text-secondary border-secondary/20",
  Insurance: "bg-amber-50 text-amber-700 border-amber-200",
  Other: "bg-rose-50 text-rose-700 border-rose-200",
};

function TypeBadge({ type }: { type?: FaqReasonType }) {
  const t = type || "General";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${TYPE_STYLES[t] || TYPE_STYLES.General}`}
    >
      {t}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
      <p className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`min-w-[30px] h-[30px] rounded-lg text-xs font-semibold border transition-colors ${
              n === page
                ? "bg-primary text-white border-primary"
                : "border-slate-200 text-slate-600 hover:bg-white hover:text-primary"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
  question,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center">
          Delete FAQ
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700 line-clamp-2">
            &ldquo;{question}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && (
              <span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" />
                <span className="absolute inset-0 rounded-full bg-current" />
              </span>
            )}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Editor ────────────────────────────────────────────────────────────────────
export function FaqEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    content: faqs,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.faqs);

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);

  const reasons: FaqReason[] = faqs?.reasons ?? [];

  // Stats
  const typeCount = (t: FaqReasonType) =>
    reasons.filter((r) => r.type === t).length;

  // Filtered + paginated
  const filtered = reasons.filter(
    (r) =>
      r.question.toLowerCase().includes(activeSearch.toLowerCase()) ||
      r.answer.toLowerCase().includes(activeSearch.toLowerCase()) ||
      (r.type || "").toLowerCase().includes(activeSearch.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    dispatch(fetchFaq());
  }, [dispatch]);

  const handleSearch = () => {
    setActiveSearch(searchInput);
    setPage(1);
  };
  const handleReset = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const handleOpenForm = (index?: number) => {
    setEditingIndex(index ?? null);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleDelete = async () => {
    if (deletingIndex === null) return;
    const updated = reasons.filter((_, i) => i !== deletingIndex);
    const fd = new FormData();
    fd.append("title", faqs?.title || "Why Choose Us");
    fd.append("reasons", JSON.stringify(updated));
    setIsDeleting(true);
    try {
      await dispatch(upsertFaq(fd)).unwrap();
      toast.success("FAQ deleted successfully");
      setDeletingIndex(null);
    } catch {
      toast.error("Failed to delete FAQ");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8 max-w-7xl mx-auto"
    >
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Why Choose Us / FAQs
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage frequently asked questions &amp; trust reasons
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* ── Stats ── */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard
            icon={<Layers size={18} className="text-primary" />}
            label="Total FAQs"
            value={reasons.length}
            color="bg-primary/8"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-slate-500" />}
            label="General"
            value={typeCount("General")}
            color="bg-slate-100"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-primary" />}
            label="Services"
            value={typeCount("Services")}
            color="bg-primary/8"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-emerald-600" />}
            label="Treatment"
            value={typeCount("Treatment")}
            color="bg-emerald-50"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-secondary" />}
            label="Pricing"
            value={typeCount("Pricing")}
            color="bg-secondary/10"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-amber-600" />}
            label="Insurance"
            value={typeCount("Insurance")}
            color="bg-amber-50"
          />
        </div>
      )}

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions, answers or type…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <Search size={14} />
          Search
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Results summary */}
      {activeSearch && (
        <p className="text-xs text-slate-500 mb-3">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          result
          {filtered.length !== 1 ? "s" : ""} for &ldquo;
          <span className="font-semibold text-primary">{activeSearch}</span>
          &rdquo;
        </p>
      )}

      {/* ── Table ── */}
      {isLoading ? (
        <PageSpinner label="Loading FAQs…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => dispatch(fetchFaq())} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No FAQs found"
          description={
            activeSearch
              ? "Try a different search term or reset filters."
              : "Add your first FAQ to get started."
          }
          action={
            activeSearch ? (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <RotateCcw size={14} /> Reset filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table head */}
          <div className="grid grid-cols-[40px_1fr_110px_300px_180px] gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>#</span>
            <span>Question</span>
            <span>Type</span>
            <span>Answer</span>
            <span className="text-center">Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {paginated.map((reason) => {
              const originalIndex = reasons.indexOf(reason);
              const displayNum =
                (page - 1) * PAGE_SIZE + paginated.indexOf(reason) + 1;
              const truncatedAnswer =
                reason.answer.length > 120
                  ? reason.answer.slice(0, 120).trim() + "…"
                  : reason.answer;
              return (
                <div
                  key={originalIndex}
                  className="grid grid-cols-[40px_1fr_110px_300px_180px] gap-3 items-center px-5 py-4 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Row number */}
                  <span className="text-xs font-medium text-slate-400">
                    {displayNum}
                  </span>

                  {/* Question */}
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <MessageCircleQuestion
                        size={14}
                        className="text-primary flex-shrink-0 mt-0.5"
                      />
                      <p className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">
                        {reason.question}
                      </p>
                    </div>
                  </div>

                  {/* Type */}
                  <TypeBadge type={reason.type} />

                  {/* Answer — truncated with title tooltip for full text */}
                  <p
                    className="text-xs text-slate-500 line-clamp-2"
                    title={reason.answer}
                  >
                    {truncatedAnswer}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenForm(originalIndex)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 rounded-lg transition-colors border border-primary/15"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingIndex(originalIndex)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {/* ── Form Modal ── */}
      {showForm && (
        <FaqForm
          whyChooseUs={faqs}
          editingIndex={editingIndex}
          onClose={handleCloseForm}
          onSuccess={() => {
            dispatch(fetchFaq());
            handleCloseForm();
          }}
        />
      )}

      {deletingIndex !== null && (
        <DeleteModal
          question={reasons[deletingIndex]?.question ?? "this FAQ"}
          onConfirm={handleDelete}
          onCancel={() => setDeletingIndex(null)}
          isDeleting={isDeleting}
        />
      )}
    </motion.div>
  );
}
