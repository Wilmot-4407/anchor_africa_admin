import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Trash2 } from "lucide-react";
import { upsertWhyChooseUs } from "../../redux/actions/whyChooseUs";
import { AppDispatch, RootState } from "../../redux/store";
import { WhyChooseUs, WhyChooseUsReason } from "../../redux/types";

interface WhyChooseUsFormProps {
  whyChooseUs?: WhyChooseUs | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WhyChooseUsForm({
  whyChooseUs,
  onClose,
  onSuccess,
}: WhyChooseUsFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.whyChooseUs,
  );

  const [formData, setFormData] = useState({
    title: whyChooseUs?.title || "",
    backgroundImage: whyChooseUs?.backgroundImage || "",
    reasons: whyChooseUs?.reasons || ([] as WhyChooseUsReason[]),
  });

  const [newReason, setNewReason] = useState({
    icon: "",
    title: "",
    description: "",
  });
  const [formError, setFormError] = useState("");

  const handleAddReason = () => {
    if (
      !newReason.icon.trim() ||
      !newReason.title.trim() ||
      !newReason.description.trim()
    ) {
      setFormError("Icon, title, and description are required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      reasons: [...prev.reasons, newReason],
    }));
    setNewReason({ icon: "", title: "", description: "" });
  };

  const handleRemoveReason = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reasons: prev.reasons.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }

    if (formData.reasons.length === 0) {
      setFormError("Add at least one reason");
      return;
    }

    try {
      await dispatch(upsertWhyChooseUs(formData)).unwrap();
      onSuccess?.();
      onClose();
    } catch (err) {
      setFormError(
        typeof err === "string" ? err : "Failed to save why choose us",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-heading">
            Edit Why Choose Us
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(formError || error) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{formError || error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="Why Choose Us"
            />
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Background Image URL
            </label>
            <input
              type="url"
              value={formData.backgroundImage}
              onChange={(e) =>
                setFormData({ ...formData, backgroundImage: e.target.value })
              }
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="https://example.com/background.jpg"
            />
          </div>

          {/* Reasons */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-heading mb-4">Reasons</h3>

            {/* Add New Reason */}
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-heading mb-3">Add New Reason</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newReason.icon}
                  onChange={(e) =>
                    setNewReason({ ...newReason, icon: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 text-sm"
                  placeholder="Icon URL"
                />
                <input
                  type="text"
                  value={newReason.title}
                  onChange={(e) =>
                    setNewReason({ ...newReason, title: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 text-sm"
                  placeholder="Reason title"
                />
                <textarea
                  value={newReason.description}
                  onChange={(e) =>
                    setNewReason({ ...newReason, description: e.target.value })
                  }
                  disabled={isLoading}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 text-sm"
                  placeholder="Reason description"
                />
                <button
                  type="button"
                  onClick={handleAddReason}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Reason
                </button>
              </div>
            </div>

            {/* Display Reasons */}
            {formData.reasons.length > 0 && (
              <div className="space-y-2">
                {formData.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-100 rounded-lg border border-slate-300 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-heading text-sm">
                        {reason.title}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {reason.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveReason(idx)}
                      disabled={isLoading}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-heading hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
