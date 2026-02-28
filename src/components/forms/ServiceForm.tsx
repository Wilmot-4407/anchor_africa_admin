import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, UploadCloud, Sparkles, Loader2, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { createService, updateService } from "../../redux/actions/services";
import { AppDispatch, RootState } from "../../redux/store";
import { Service } from "../../redux/types";
import { BrandSpinner } from "../common/SkeletonLoader";
import api from "../../utils/api";

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputCls =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors bg-white disabled:bg-slate-50 disabled:cursor-not-allowed";

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pt-1">
      {children}
    </h3>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Icon Suggester (unchanged logic, only style aligned)
// ─────────────────────────────────────────────────────────────────────────────

const LUCIDE_ICON_NAMES: string[] = [
  "Heart",
  "Brain",
  "Stethoscope",
  "Activity",
  "Thermometer",
  "Pill",
  "Syringe",
  "Cross",
  "Eye",
  "Ear",
  "Wind",
  "Smile",
  "Frown",
  "Sun",
  "Moon",
  "Star",
  "Zap",
  "Shield",
  "Lock",
  "Users",
  "User",
  "UserCheck",
  "Baby",
  "PersonStanding",
  "Footprints",
  "Bone",
  "Dna",
  "FlaskConical",
  "Microscope",
  "TestTube",
  "Leaf",
  "Flower",
  "TreePine",
  "Sprout",
  "Apple",
  "Salad",
  "Carrot",
  "Droplets",
  "Waves",
  "Mountain",
  "Bed",
  "Sofa",
  "Home",
  "Building",
  "Hospital",
  "Ambulance",
  "Bandage",
  "HeartPulse",
  "HandHeart",
  "Hands",
  "HandMetal",
  "ClipboardList",
  "ClipboardCheck",
  "BookOpen",
  "GraduationCap",
  "Award",
  "Trophy",
  "Medal",
  "MessageCircle",
  "Phone",
  "Mail",
  "Globe",
  "Clock",
  "Calendar",
  "Timer",
  "AlarmClock",
  "Coffee",
  "Dumbbell",
  "Bicycle",
  "Running",
  "Yoga",
  "Accessibility",
  "Scale",
  "RefreshCw",
  "RotateCcw",
  "Infinity",
  "CircleDot",
  "CircleCheck",
  "CheckCircle",
  "Sparkles",
  "Lightbulb",
  "WandSparkles",
];

interface IconSuggestion {
  icon: string;
  reason: string;
  score: number;
}

function IconSuggestButton({
  title,
  shortDescription,
  fullDescription,
  currentIcon,
  onSelect,
  compact = false,
}: {
  title: string;
  shortDescription: string;
  fullDescription: string;
  currentIcon: string;
  onSelect: (n: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<IconSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!title.trim() && !shortDescription.trim()) {
      setError("Please provide a title or short description first.");
      setOpen(true);
      return;
    }
    setOpen(true);
    setLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const { data } = await api.post("/ai/suggest-icon", {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription?.trim() || "",
        icons: LUCIDE_ICON_NAMES,
      });
      if (!data?.success)
        throw new Error(data?.error || "No suggestions returned");
      const parsed: IconSuggestion[] = Array.isArray(data.suggestions)
        ? data.suggestions
        : [];
      const valid = parsed.filter(
        (s) =>
          typeof (LucideIcons as Record<string, unknown>)[s.icon] ===
          "function",
      );
      setSuggestions(valid.length > 0 ? valid : parsed.slice(0, 8));
    } catch (err: any) {
      let msg = "Could not get icon suggestions";
      if (err.response?.status === 401)
        msg = "Please log in again (session expired)";
      else if (err.response?.data?.error) msg = err.response.data.error;
      else if (err.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (iconName: string) => {
    setSelected(iconName);
    onSelect(iconName);
    setTimeout(() => setOpen(false), 400);
  };

  return (
    <>
      <button
        type="button"
        onClick={fetchSuggestions}
        disabled={loading}
        title="AI icon suggestions"
        className={
          compact
            ? "flex items-center gap-1 text-xs text-violet-600 font-medium hover:text-violet-800 transition-colors disabled:opacity-50"
            : "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors disabled:opacity-50 whitespace-nowrap"
        }
      >
        {loading ? (
          <Loader2
            className={
              compact ? "w-3 h-3 animate-spin" : "w-3.5 h-3.5 animate-spin"
            }
          />
        ) : (
          <Sparkles className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
        )}
        {compact ? "AI" : "Suggest Icon"}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-80 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-semibold text-slate-700">
                  AI Icon Suggestions
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {(title || shortDescription) && (
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex-shrink-0">
                <p className="text-[11px] text-slate-400 truncate">
                  <span className="font-medium text-slate-500">
                    {title || shortDescription}
                  </span>
                </p>
              </div>
            )}
            <div className="p-3 overflow-y-auto">
              {loading && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-violet-200 border-t-violet-500 animate-spin" />
                    <Sparkles className="w-4 h-4 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Analysing your service…
                  </p>
                </div>
              )}
              {error && !loading && (
                <div className="py-4 text-center">
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              )}
              {!loading && !error && suggestions.length > 0 && (
                <>
                  <p className="text-xs text-slate-400 mb-3">
                    Click an icon to use it · sorted by relevance
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {suggestions.map((s) => {
                      const IconComp = (LucideIcons as any)[s.icon];
                      const isChosen =
                        selected === s.icon || currentIcon === s.icon;
                      return (
                        <button
                          key={s.icon}
                          type="button"
                          onClick={() => handleSelect(s.icon)}
                          title={`${s.icon} — ${s.reason}`}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all group ${isChosen ? "border-violet-400 bg-violet-50 text-violet-600" : "border-slate-100 hover:border-violet-300 hover:bg-violet-50 text-slate-500 hover:text-violet-600"}`}
                        >
                          <div className="relative">
                            {IconComp ? (
                              <IconComp className="w-6 h-6" />
                            ) : (
                              <span className="text-xs font-mono">
                                {s.icon.slice(0, 3)}
                              </span>
                            )}
                            {isChosen && (
                              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-violet-500 rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-medium leading-tight text-center line-clamp-1 w-full">
                            {s.icon}
                          </span>
                          <span className="text-[8px] text-slate-400 leading-tight text-center group-hover:text-violet-400 transition-colors">
                            {s.score}/10
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-[10px] text-slate-300 text-center">
                    Stored as Lucide icon name
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ServiceForm
// ─────────────────────────────────────────────────────────────────────────────

export function ServiceForm({ service, onClose, onSuccess }: ServiceFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.services,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: service?.title || "",
    slug: service?.slug || "",
    type: (service?.type || "clinic") as "clinic" | "institute" | "research",
    category: service?.category || "",
    shortDescription: service?.shortDescription || "",
    fullDescription: service?.fullDescription || "",
    icon: service?.icon || "",
    features: service?.features?.join(", ") || "",
    benefits: service?.benefits?.join(", ") || "",
    order: String(service?.order ?? 0),
    isPublished: service?.isPublished !== false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    service?.image || "",
  );
  const [formError, setFormError] = useState("");

  const slugify = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (
        name === "title" &&
        (!prev.slug || prev.slug === slugify(prev.title))
      ) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formData.title.trim()) return setFormError("Title is required");
    if (!formData.type) return setFormError("Type is required");
    if (!formData.category.trim()) return setFormError("Category is required");
    if (!formData.shortDescription.trim())
      return setFormError("Short description is required");

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("slug", formData.slug || slugify(formData.title));
      fd.append("type", formData.type);
      fd.append("category", formData.category);
      fd.append("shortDescription", formData.shortDescription);
      fd.append("fullDescription", formData.fullDescription);
      fd.append("icon", formData.icon);
      fd.append(
        "features",
        formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
          .join(","),
      );
      fd.append(
        "benefits",
        formData.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean)
          .join(","),
      );
      fd.append("order", formData.order);
      fd.append("isPublished", String(formData.isPublished));
      if (imageFile) fd.append("image", imageFile);

      if (service?._id) {
        await dispatch(updateService({ id: service._id, data: fd })).unwrap();
      } else {
        await dispatch(createService(fd)).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save service");
    }
  };

  const isEditing = !!service;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col border border-slate-200/60">
        {/* Top accent strip */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-t-2xl flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditing ? "Edit Service" : "Create Service"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? `Editing "${service.title}"`
                : "Define the service category"}
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
          id="service-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
        >
          {(formError || error) && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">
                {formError || error}
              </p>
            </div>
          )}

          <section>
            <SectionHeading>Service Category</SectionHeading>
            <div className="space-y-4">
              {/* Image — preview inside the upload zone */}
              <div>
                <Label>Category Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="service-image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <label
                  htmlFor="service-image-input"
                  className="block w-full cursor-pointer"
                >
                  <div className="relative w-full h-44 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Service preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <UploadCloud className="w-6 h-6 text-white mb-1" />
                          <span className="text-white text-xs font-semibold">
                            Click to change image
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <UploadCloud className="w-7 h-7" />
                        <span className="text-sm">
                          Click to upload category image
                        </span>
                        <span className="text-xs text-slate-300">
                          JPG, PNG, WEBP up to 10MB
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Title */}
              <div>
                <Label required>Title</Label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="Clinical Services"
                />
              </div>

              {/* Type + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Type</Label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                  >
                    <option value="clinic">Anchor Clinic</option>
                    <option value="institute">Anchor Institute</option>
                    <option value="research">
                      Research &amp; Publications
                    </option>
                  </select>
                </div>
                <div>
                  <Label required>Category Label</Label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="Mental Health"
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <Label>Slug</Label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`${inputCls} font-mono text-xs`}
                  placeholder="auto-generated from title"
                />
              </div>

              {/* Short Description */}
              <div>
                <Label required>Short Description (card text)</Label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="Brief overview shown on cards..."
                />
              </div>

              {/* Full Description */}
              <div>
                <Label>Full Description (detail page)</Label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={5}
                  className={`${inputCls} resize-y font-mono text-xs`}
                  placeholder="Rich HTML or plain-text content..."
                />
              </div>

              {/* Icon with AI Suggester */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Icon</Label>
                  <IconSuggestButton
                    title={formData.title}
                    shortDescription={formData.shortDescription}
                    fullDescription={formData.fullDescription}
                    currentIcon={formData.icon}
                    onSelect={(name) =>
                      setFormData((prev) => ({ ...prev, icon: name }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  {formData.icon &&
                    (() => {
                      const IC = (LucideIcons as any)[formData.icon];
                      return IC ? (
                        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-50 border border-violet-200 text-violet-600 flex-shrink-0">
                          <IC className="w-5 h-5" />
                        </span>
                      ) : null;
                    })()}
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="Heart · Brain · Stethoscope (Lucide name)"
                  />
                </div>
              </div>

              {/* Features + Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Features (comma-separated)</Label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="Feature 1, Feature 2"
                  />
                </div>
                <div>
                  <Label>Benefits (comma-separated)</Label>
                  <input
                    type="text"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="Benefit 1, Benefit 2"
                  />
                </div>
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-4 h-4 accent-primary"
                />
                <label
                  htmlFor="isPublished"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Published (visible on site)
                </label>
              </div>
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex-shrink-0">
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
            form="service-form"
            disabled={isLoading}
            className="ml-auto flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition disabled:opacity-50 shadow-sm"
          >
            {isLoading && <BrandSpinner size="sm" />}
            {isLoading
              ? "Saving…"
              : isEditing
                ? "Save Changes"
                : "Create Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
