import { useState, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Trash2, Upload, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { upsertAbout } from "../../redux/actions/about";
import { AppDispatch, RootState } from "../../redux/store";
import { About, AboutSection, OpenHour } from "../../redux/types";

interface AboutFormProps {
  about?: About | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const STEPS = ["Basic Info", "Contact & CTA", "Features", "Hours & Sections"];

const DEFAULT_OPEN_HOURS: OpenHour[] = [
  { day: "Monday",    hours: "09:30 - 19:30", closed: false },
  { day: "Tuesday",   hours: "09:30 - 19:30", closed: false },
  { day: "Wednesday", hours: "09:30 - 19:30", closed: false },
  { day: "Thursday",  hours: "09:30 - 19:30", closed: false },
  { day: "Friday",    hours: "09:30 - 19:30", closed: false },
  { day: "Saturday",  hours: "09:30 - 18:30", closed: false },
  { day: "Sunday",    hours: "",               closed: true  },
];

const inputCls =
  "w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors bg-white disabled:bg-slate-50 disabled:cursor-not-allowed";

function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-start px-6 py-4 border-b border-slate-100">
      {steps.map((label, i) => (
        <Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < current
                  ? "bg-primary text-white"
                  : i === current
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold whitespace-nowrap ${i <= current ? "text-primary" : "text-slate-400"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 mt-3.5 transition-all ${i < current ? "bg-primary" : "bg-slate-200"}`} />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function AboutFormModal({ about, onClose, onSuccess }: AboutFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.about);

  const isEditing = !!about;

  const [formData, setFormData] = useState({
    title:       about?.title       || "",
    description: about?.description || "",
    phone:       about?.phone       || "",
    ctaText:     about?.ctaText     || "Appointment",
    ctaLink:     about?.ctaLink     || "/appointment",
    visible:     about?.visible ?? true,
    features:    about?.features    || ([] as string[]),
    openHours:   about?.openHours?.length ? about.openHours : DEFAULT_OPEN_HOURS,
    sections:    about?.sections    || ([] as AboutSection[]),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(() => {
    if (about?.image && !about.image.startsWith("blob:")) return about.image;
    return "";
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newFeature, setNewFeature] = useState("");
  const [newSection, setNewSection] = useState({ title: "", content: "", icon: "" });
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState("");

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

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleOpenHourChange = (index: number, field: keyof OpenHour, value: string | boolean) => {
    setFormData((prev) => {
      const updated = [...prev.openHours];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, openHours: updated };
    });
  };

  const handleAddSection = () => {
    if (!newSection.title.trim() || !newSection.content.trim()) {
      setFormError("Section title and content are required");
      return;
    }
    setFormData((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
    setNewSection({ title: "", content: "", icon: "" });
    setFormError("");
  };

  const handleRemoveSection = (index: number) => {
    setFormData((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));
  };

  const validateStep = (s: number): boolean => {
    if (s === 0) {
      if (!formData.title.trim())       { setFormError("Title is required");       return false; }
      if (!formData.description.trim()) { setFormError("Description is required"); return false; }
    }
    setFormError("");
    return true;
  };

  const handleNext = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const handleBack = () => { setFormError(""); setStep((s) => s - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    try {
      const payload = new FormData();
      payload.append("title",       formData.title);
      payload.append("description", formData.description);
      payload.append("phone",       formData.phone);
      payload.append("ctaText",     formData.ctaText);
      payload.append("ctaLink",     formData.ctaLink);
      payload.append("visible",     String(formData.visible));
      payload.append("features",    JSON.stringify(formData.features));
      payload.append("openHours",   JSON.stringify(formData.openHours));
      payload.append("sections",    JSON.stringify(formData.sections));
      if (imageFile) payload.append("image", imageFile);

      await dispatch(upsertAbout(payload)).unwrap();
      onSuccess?.();
      onClose();
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save about");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200/60">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditing ? "Edit About Section" : "Create About Section"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step bar */}
        <div className="flex-shrink-0">
          <StepBar steps={STEPS} current={step} />
        </div>

        <form id="about-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {(formError || error) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{formError || error}</p>
            </div>
          )}

          {/* ── Step 0: Basic Info ── */}
          {step === 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title <span className="text-red-400">*</span></label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} disabled={isLoading} className={inputCls} placeholder="World Class Patient Facilities" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description <span className="text-red-400">*</span></label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={isLoading} rows={4} className={`${inputCls} resize-none`} placeholder="Main description of your organization" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image</label>
                {imagePreview && (
                  <div className="mb-3 relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition">
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                )}
                <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">{imageFile ? imageFile.name : isEditing && imagePreview ? "Click to replace image" : "Click to upload an image"}</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </>
          )}

          {/* ── Step 1: Contact & CTA ── */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={isLoading} className={inputCls} placeholder="(+231) 775 608020" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">CTA Button Text</label>
                  <input type="text" value={formData.ctaText} onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })} disabled={isLoading} className={inputCls} placeholder="Appointment" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">CTA Link</label>
                  <input type="text" value={formData.ctaLink} onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })} disabled={isLoading} className={inputCls} placeholder="/appointment" />
                </div>
                <div className="flex items-center gap-3 pt-7">
                  <input type="checkbox" id="visible" checked={formData.visible} onChange={(e) => setFormData({ ...formData, visible: e.target.checked })} disabled={isLoading} className="w-4 h-4 accent-primary" />
                  <label htmlFor="visible" className="text-sm font-medium text-slate-700">Visible on website</label>
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Features ── */}
          {step === 2 && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Features / Checklist</h3>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())} disabled={isLoading} className={`flex-1 ${inputCls}`} placeholder="e.g. Emergency Services" />
                  <button type="button" onClick={handleAddFeature} disabled={isLoading} className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formData.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-primary/5 rounded-full text-sm text-slate-700 border border-primary/20">
                        {feature}
                        <button type="button" onClick={() => handleRemoveFeature(idx)} disabled={isLoading} className="ml-1 text-red-400 hover:text-red-600 disabled:opacity-50">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No features added yet. Type above and press Enter or click +.</p>
                )}
              </div>
            </>
          )}

          {/* ── Step 3: Hours & Sections ── */}
          {step === 3 && (
            <>
              {/* Open Hours */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Open Hours</h3>
                <div className="space-y-2">
                  {formData.openHours.map((hour, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium text-slate-700 shrink-0">{hour.day}</span>
                      <input type="text" value={hour.hours} onChange={(e) => handleOpenHourChange(idx, "hours", e.target.value)} disabled={isLoading || hour.closed} className={`flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${hour.closed ? "bg-slate-50" : "bg-white"}`} placeholder="09:30 - 19:30" />
                      <label className="flex items-center gap-1.5 text-sm text-slate-600 shrink-0">
                        <input type="checkbox" checked={hour.closed} onChange={(e) => handleOpenHourChange(idx, "closed", e.target.checked)} disabled={isLoading} className="accent-primary" />
                        Closed
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Sections <span className="font-normal text-slate-400">(Optional)</span></h3>
                <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Add New Section</h4>
                  <input type="text" value={newSection.title} onChange={(e) => setNewSection({ ...newSection, title: e.target.value })} disabled={isLoading} className={`${inputCls} bg-white`} placeholder="Section title" />
                  <textarea value={newSection.content} onChange={(e) => setNewSection({ ...newSection, content: e.target.value })} disabled={isLoading} rows={2} className={`${inputCls} resize-none bg-white`} placeholder="Section content" />
                  <input type="text" value={newSection.icon} onChange={(e) => setNewSection({ ...newSection, icon: e.target.value })} disabled={isLoading} className={`${inputCls} bg-white`} placeholder="Icon URL (optional)" />
                  <button type="button" onClick={handleAddSection} disabled={isLoading} className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                    <Plus className="w-4 h-4" /> Add Section
                  </button>
                </div>

                {formData.sections.length > 0 && (
                  <div className="space-y-2">
                    {formData.sections.map((section, idx) => (
                      <div key={idx} className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 text-sm">{section.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{section.content}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveSection(idx)} disabled={isLoading} className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex-shrink-0">
          {step > 0 ? (
            <button type="button" onClick={handleBack} disabled={isLoading} className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-white transition disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-white transition disabled:opacity-50">
              Cancel
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={handleNext} disabled={isLoading} className="ml-auto flex items-center gap-1.5 px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition disabled:opacity-50 shadow-sm">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" form="about-form" disabled={isLoading} className="ml-auto px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition disabled:opacity-50 shadow-sm">
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
