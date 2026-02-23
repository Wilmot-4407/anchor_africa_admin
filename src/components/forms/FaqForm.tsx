import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { upsertFaq } from "../../redux/actions/faqs";
import { AppDispatch, RootState } from "../../redux/store";
import { Faq, FaqReason, FaqReasonType } from "../../redux/types";

interface FaqFormProps {
  /** The full parent document — needed to send updated reasons array */
  whyChooseUs: Faq | null;
  /** When editing an existing reason, pass its index in reasons[] */
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
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
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

  const [formData, setFormData] = useState<{
    question: string;
    answer: string;
    type: FaqReasonType;
  }>({
    question: existingReason?.question || "",
    answer: existingReason?.answer || "",
    type: existingReason?.type || "General",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
      // Build updated reasons array
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
      onSuccess?.();
      onClose();
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save reason");
    }
  };

  const isEditing = editingIndex != null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {isEditing ? "Edit Reason" : "New Reason"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? "Update the question and answer below"
                : "Fill in the details to add a new reason"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="reason-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          {/* Type */}
          <div>
            <Label required>Type</Label>
            <div className="flex flex-wrap gap-2">
              {REASON_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setFormData((prev) => ({ ...prev, type: t }))}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    formData.type === t
                      ? "bg-amber-50 text-amber-700 border-amber-300"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
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
              rows={5}
              className={`${inputCls} resize-none`}
              placeholder="Write a clear and concise answer..."
            />
            {formData.answer.length > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                {formData.answer.length} characters
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/40 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="reason-form"
            disabled={isLoading}
            className="ml-auto px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 shadow-sm"
          >
            {isLoading ? "Saving…" : isEditing ? "Save Changes" : "Add Reason"}
          </button>
        </div>
      </div>
    </div>
  );
}
