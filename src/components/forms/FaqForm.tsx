import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { upsertFaq } from "../../redux/actions/faqs";
import { AppDispatch, RootState } from "../../redux/store";
import { Faq, FaqReason, FaqReasonType } from "../../redux/types";
import { BrandSpinner } from "../common/SkeletonLoader";
// import toast from "../../utils/toast";

interface FaqFormProps {
  whyChooseUs: Faq | null;
  editingIndex?: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const REASON_TYPES: FaqReasonType[] = [
  "General",
  "Services",
  "Treatment",
  "Pricing",
  "Insurance",
  "Other",
];

const inputCls =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors bg-white disabled:bg-slate-50 disabled:cursor-not-allowed";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

export function FaqForm({
  whyChooseUs,
  editingIndex,
  onClose,
  onSuccess,
}: FaqFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.faqs);

  const existingReason =
    editingIndex != null ? whyChooseUs?.reasons[editingIndex] : null;

  const [formData, setFormData] = useState({
    question: existingReason?.question || "",
    answer: existingReason?.answer || "",
    type: (existingReason?.type || "General") as FaqReasonType,
  });

  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.question.trim()) {
      setFormError("Question is required");
      return;
    }
    if (!formData.answer.trim()) {
      setFormError("Answer is required");
      return;
    }

    try {
      const currentReasons: FaqReason[] = whyChooseUs?.reasons
        ? [...whyChooseUs.reasons]
        : [];
      const updatedReason: FaqReason = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        type: formData.type,
      };

      if (editingIndex != null) {
        currentReasons[editingIndex] = updatedReason;
      } else {
        currentReasons.push(updatedReason);
      }

      const fd = new FormData();
      fd.append("title", whyChooseUs?.title || "Frequently Asked Questions");
      fd.append("reasons", JSON.stringify(currentReasons));

      await dispatch(upsertFaq(fd)).unwrap();
      // toast.success(
      //   editingIndex != null
      //     ? "FAQ updated successfully!"
      //     : "FAQ added successfully!",
      // );
      onSuccess?.();
      onClose();
    } catch (err) {
      // const msg = typeof err === "string" ? err : "Failed to save FAQ";
      // setFormError(msg);
      // toast.error(msg);
      console.log("Faq create failed", err);
    }
  };

  const isEditing = editingIndex != null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col border border-slate-200/60">
        {/* Top accent strip */}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditing ? "Edit FAQ" : "Add New FAQ"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? "Update the question and answer below"
                : "Fill in the details to add a new FAQ entry"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="faq-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{formError}</p>
            </div>
          )}

          {/* Type selector */}
          <div>
            <Label required>Category Type</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {REASON_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setFormData((prev) => ({ ...prev, type: t }))}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    formData.type === t
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-slate-500 border-slate-200 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div>
            <Label required>Question</Label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              disabled={isLoading}
              className={inputCls}
              placeholder="e.g. What makes ANCHOR different from other clinics?"
            />
          </div>

          {/* Answer */}
          <div>
            <Label required>Answer</Label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              disabled={isLoading}
              rows={6}
              className={`${inputCls} resize-none`}
              placeholder="Write a clear and concise answer…"
            />
            {formData.answer.length > 0 && (
              <p className="mt-1 text-xs text-slate-400 text-right">
                {formData.answer.length} characters
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="faq-form"
            disabled={isLoading}
            className="ml-auto flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition disabled:opacity-50 shadow-sm"
          >
            {isLoading && <BrandSpinner size="sm" />}
            {isLoading ? "Saving…" : isEditing ? "Save Changes" : "Add FAQ"}
          </button>
        </div>
      </div>
    </div>
  );
}
