import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { createService, updateService } from "../../redux/actions/services";
import { AppDispatch, RootState } from "../../redux/store";
import { Service } from "../../redux/types";

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.services,
  );

  const [formData, setFormData] = useState({
    title: service?.title || "",
    slug: service?.slug || "",
    type: service?.type || ("clinic" as "clinic" | "institute"),
    category: service?.category || "",
    shortDescription: service?.shortDescription || "",
    fullDescription: service?.fullDescription || "",
    icon: service?.icon || "",
    features: service?.features?.join(", ") || "",
    duration: service?.duration || "",
    specialists: service?.specialists || "",
    benefits: service?.benefits?.join(", ") || "",
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

    if (!formData.title.trim() || !formData.category.trim()) {
      setFormError("Title and category are required");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        slug:
          formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        type: formData.type,
        category: formData.category,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        icon: formData.icon,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        duration: formData.duration,
        specialists: formData.specialists,
        benefits: formData.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
      };

      if (service?._id) {
        await dispatch(
          updateService({ id: service._id, data: payload }),
        ).unwrap();
      } else {
        await dispatch(createService(payload)).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save service");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-heading">
            {service ? "Edit Service" : "Create Service"}
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
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="Enter service title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="auto-generated from title"
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              >
                <option value="clinic">Clinic</option>
                <option value="institute">Institute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                placeholder="e.g., Consultation, Treatment"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              disabled={isLoading}
              rows={2}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="Brief overview of the service"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Full Description
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50 font-mono text-sm"
              placeholder="Detailed description of the service"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Icon URL
            </label>
            <input
              type="url"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="https://example.com/icon.svg"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>

          {/* Duration & Specialists */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                placeholder="e.g., 30 minutes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Specialists
              </label>
              <input
                type="text"
                name="specialists"
                value={formData.specialists}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                placeholder="Specialist names"
              />
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Benefits (comma-separated)
            </label>
            <input
              type="text"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
              placeholder="Benefit 1, Benefit 2, Benefit 3"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
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
              {isLoading ? "Saving..." : service ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
