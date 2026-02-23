import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, MessageCircleQuestion } from "lucide-react";
import { fetchFaq, upsertFaq } from "../redux/actions/faqs";
import { AppDispatch, RootState } from "../redux/store";
import { CardSkeletonLoader } from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { FaqForm } from "../components/forms/FaqForm";
import { FaqReason, FaqReasonType } from "../redux/types";

// ── Type badge ──────────────────────────────────────────────────────────────
const TYPE_STYLES: Record<FaqReasonType, string> = {
  General: "bg-slate-50 text-slate-600 border-slate-200",
  Services: "bg-blue-50 text-blue-700 border-blue-200",
  Treatment: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pricing: "bg-violet-50 text-violet-700 border-violet-200",
  Insurance: "bg-amber-50 text-amber-700 border-amber-200",
  Other: "bg-rose-50 text-rose-700 border-rose-200",
};

function TypeBadge({ type }: { type?: FaqReasonType }) {
  const t = type || "General";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
        TYPE_STYLES[t] || TYPE_STYLES.General
      }`}
    >
      {t}
    </span>
  );
}

// ── Editor ───────────────────────────────────────────────────────────────────
export function FaqEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    content: faqs,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.faqs);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const reasons: FaqReason[] = faqs?.reasons ?? [];

  const filteredReasons = reasons.filter((r) => {
    const matchesSearch =
      r.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    dispatch(fetchFaq());
  }, [dispatch]);

  const handleOpenForm = (index?: number) => {
    setEditingIndex(index ?? null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIndex(null);
  };

  const handleDelete = async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this reason?")) return;

    const updated = reasons.filter((_, i) => i !== index);
    const fd = new FormData();
    fd.append("title", faqs?.title || "Why Choose Us");
    fd.append("reasons", JSON.stringify(updated));
    await dispatch(upsertFaq(fd));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Why Choose Us</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {reasons.length} reason{reasons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Reason
        </button>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <CardSkeletonLoader count={3} />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchFaq())}
        />
      ) : filteredReasons.length === 0 ? (
        <EmptyState
          title="No reasons found"
          description={
            searchTerm
              ? "Try adjusting your search or filter"
              : "Add your first reason to get started"
          }
        />
      ) : (
        /* ── List / Table View ── */
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_100px_180px] gap-4 px-5 py-3 border-b border-slate-100 rounded-t-xl bg-white text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <span>Question</span>
            <span>Type</span>
            <span>Answer</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredReasons.map((reason) => {
              const originalIndex = reasons.indexOf(reason);
              return (
                <div
                  key={originalIndex}
                  className="grid grid-cols-[1fr_120px_100px_180px] gap-4 items-center px-5 py-4 hover:bg-slate-50 transition-colors group"
                >
                  {/* Question */}
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <MessageCircleQuestion
                        size={14}
                        className="text-amber-500 flex-shrink-0 mt-0.5"
                      />
                      <p className="font-medium text-heading text-sm leading-snug line-clamp-2">
                        {reason.question}
                      </p>
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <TypeBadge type={reason.type} />
                  </div>

                  {/* Answer preview */}
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {reason.answer}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenForm(originalIndex)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(originalIndex)}
                      disabled={isLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
    </motion.div>
  );
}