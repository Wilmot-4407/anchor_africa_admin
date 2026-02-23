import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Trash2, Upload } from "lucide-react";
import { upsertAbout } from "../../redux/actions/about";
import { AppDispatch, RootState } from "../../redux/store";
import { About, AboutSection, OpenHour } from "../../redux/types";

interface AboutFormProps {
  about?: About | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEFAULT_OPEN_HOURS: OpenHour[] = [
  { day: "Monday", hours: "09:30 - 19:30", closed: false },
  { day: "Tuesday", hours: "09:30 - 19:30", closed: false },
  { day: "Wednesday", hours: "09:30 - 19:30", closed: false },
  { day: "Thursday", hours: "09:30 - 19:30", closed: false },
  { day: "Friday", hours: "09:30 - 19:30", closed: false },
  { day: "Saturday", hours: "09:30 - 18:30", closed: false },
  { day: "Sunday", hours: "", closed: true },
];

export function AboutFormModal({ about, onClose, onSuccess }: AboutFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.about);

  const isEditing = !!about;

  // Pre-populate ALL fields from existing about data
  const [formData, setFormData] = useState({
    title: about?.title || "",
    description: about?.description || "",
    phone: about?.phone || "",
    ctaText: about?.ctaText || "Appointment",
    ctaLink: about?.ctaLink || "/appointment",
    visible: about?.visible ?? true,
    features: about?.features || ([] as string[]),
    openHours: about?.openHours?.length ? about.openHours : DEFAULT_OPEN_HOURS,
    sections: about?.sections || ([] as AboutSection[]),
  });

  // Image state — don't show blob URLs from previous broken saves
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(() => {
    if (about?.image && !about.image.startsWith("blob:")) return about.image;
    return "";
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newFeature, setNewFeature] = useState("");
  const [newSection, setNewSection] = useState({
    title: "",
    content: "",
    icon: "",
  });
  const [formError, setFormError] = useState("");

  // ── Image ────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Features ─────────────────────────────────────────────────────
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  // ── Open Hours ───────────────────────────────────────────────────
  const handleOpenHourChange = (
    index: number,
    field: keyof OpenHour,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.openHours];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, openHours: updated };
    });
  };

  // ── Sections ─────────────────────────────────────────────────────
  const handleAddSection = () => {
    if (!newSection.title.trim() || !newSection.content.trim()) {
      setFormError("Section title and content are required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setNewSection({ title: "", content: "", icon: "" });
    setFormError("");
  };

  const handleRemoveSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError("Title and description are required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("phone", formData.phone);
      payload.append("ctaText", formData.ctaText);
      payload.append("ctaLink", formData.ctaLink);
      payload.append("visible", String(formData.visible));
      payload.append("features", JSON.stringify(formData.features));
      payload.append("openHours", JSON.stringify(formData.openHours));
      payload.append("sections", JSON.stringify(formData.sections));

      // Only send a new image if the user picked one
      if (imageFile) {
        payload.append("image", imageFile);
      }

      await dispatch(upsertAbout(payload)).unwrap();
      onSuccess?.();
      onClose();
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save about");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-heading">
            {isEditing ? "Edit About Section" : "Create About Section"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              placeholder="World Class Patient Facilities"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50 text-sm"
              placeholder="Main description of your organization"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-heading mb-2">
              Image
            </label>
            {imagePreview && (
              <div className="mb-3 relative w-full h-40 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
            >
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">
                {imageFile
                  ? imageFile.name
                  : isEditing && imagePreview
                    ? "Click to replace image"
                    : "Click to upload an image"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPG, PNG, WEBP up to 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Phone & CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50 text-sm"
                placeholder="(+231) 775 608020"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) =>
                  setFormData({ ...formData, ctaText: e.target.value })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50 text-sm"
                placeholder="Appointment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                CTA Link
              </label>
              <input
                type="text"
                value={formData.ctaLink}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50 text-sm"
                placeholder="/appointment"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="visible"
                checked={formData.visible}
                onChange={(e) =>
                  setFormData({ ...formData, visible: e.target.checked })
                }
                disabled={isLoading}
                className="w-4 h-4 accent-primary"
              />
              <label
                htmlFor="visible"
                className="text-sm font-medium text-heading"
              >
                Visible on website
              </label>
            </div>
          </div>

          {/* Features */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-heading mb-3">
              Features / Checklist
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddFeature())
                }
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:bg-slate-50"
                placeholder="e.g. Emergency Services"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={isLoading}
                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm text-heading border border-slate-200"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      disabled={isLoading}
                      className="ml-1 text-red-400 hover:text-red-600 disabled:opacity-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Open Hours */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-heading mb-3">
              Open Hours
            </h3>
            <div className="space-y-2">
              {formData.openHours.map((hour, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium text-heading shrink-0">
                    {hour.day}
                  </span>
                  <input
                    type="text"
                    value={hour.hours}
                    onChange={(e) =>
                      handleOpenHourChange(idx, "hours", e.target.value)
                    }
                    disabled={isLoading || hour.closed}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                    placeholder="09:30 - 19:30"
                  />
                  <label className="flex items-center gap-1.5 text-sm text-slate-600 shrink-0">
                    <input
                      type="checkbox"
                      checked={hour.closed}
                      onChange={(e) =>
                        handleOpenHourChange(idx, "closed", e.target.checked)
                      }
                      disabled={isLoading}
                      className="accent-primary"
                    />
                    Closed
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-heading mb-4">
              Sections (Optional)
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-heading mb-3">Add New Section</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) =>
                    setNewSection({ ...newSection, title: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 text-sm"
                  placeholder="Section title"
                />
                <textarea
                  value={newSection.content}
                  onChange={(e) =>
                    setNewSection({ ...newSection, content: e.target.value })
                  }
                  disabled={isLoading}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 text-sm"
                  placeholder="Section content"
                />
                <input
                  type="text"
                  value={newSection.icon}
                  onChange={(e) =>
                    setNewSection({ ...newSection, icon: e.target.value })
                  }
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 text-sm"
                  placeholder="Icon URL (optional)"
                />
                <button
                  type="button"
                  onClick={handleAddSection}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>
            </div>

            {formData.sections.length > 0 && (
              <div className="space-y-2">
                {formData.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-100 rounded-lg border border-slate-300 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-heading text-sm">
                        {section.title}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {section.content}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
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
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
