import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import { fetchAbout, upsertAbout } from "../redux/actions/about";
import { AppDispatch, RootState } from "../redux/store";
import { AboutEditorSkeleton } from "../components/common/AboutEditorSkeleton";
import { useNavigation } from "../context/NavigationContext";
import { OpenHour } from "../redux/types";

// ─── defaults ────────────────────────────────────────────────────────────────

const DEFAULT_OPEN_HOURS: OpenHour[] = [
  { day: "Monday", hours: "09:30 - 17:30", closed: false },
  { day: "Tuesday", hours: "09:30 - 17:30", closed: false },
  { day: "Wednesday", hours: "09:30 - 17:30", closed: false },
  { day: "Thursday", hours: "09:30 - 17:30", closed: false },
  { day: "Friday", hours: "09:30 - 17:30", closed: false },
  { day: "Saturday", hours: "09:30 - 17:30", closed: false },
  { day: "Sunday", hours: "", closed: true },
];

interface FormState {
  title: string;
  description: string;
  imagePreview: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  phone: string;
  openHours: OpenHour[];
  visible: boolean;
}

const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  imagePreview: "",
  features: [],
  ctaText: "Appointment",
  ctaLink: "/appointment",
  phone: "",
  openHours: DEFAULT_OPEN_HOURS,
  visible: true,
};

function buildForm(about: NonNullable<RootState["about"]["about"]>): FormState {
  return {
    title: about.title || "",
    description: about.description || "",
    imagePreview:
      about.image && !about.image.startsWith("blob:") ? about.image : "",
    features: about.features?.length ? about.features : [],
    ctaText: about.ctaText || "Appointment",
    ctaLink: about.ctaLink || "/appointment",
    phone: about.phone || "",
    openHours: about.openHours?.length ? about.openHours : DEFAULT_OPEN_HOURS,
    visible: about.visible ?? true,
  };
}

// ─── shared primitives ────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors bg-white disabled:bg-slate-50 disabled:cursor-not-allowed";

function Section({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mt-8 mb-5 first:mt-0">
      <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

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

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-slate-400">{children}</p>;
}

// ── ImageUploadArea ───────────────────────────────────────────────────────────
function ImageUploadArea({
  preview,
  hint,
  onFileChange,
  onRemove,
}: {
  preview: string;
  hint?: string;
  onFileChange: (file: File, previewUrl: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-center gap-2
          ${
            preview
              ? "border-slate-200 p-3"
              : "border-slate-200 hover:border-primary/40 hover:bg-slate-50/60 p-10"
          }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="max-h-36 rounded-lg object-cover"
          />
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-slate-300" />
            <p className="text-sm text-slate-400">
              Click to upload or drag and drop
            </p>
            {hint && <p className="text-xs text-slate-300">{hint}</p>}
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file, URL.createObjectURL(file));
        }}
      />
      {preview && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          Remove image
        </button>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function AboutEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useNavigation();
  const { about, isLoading } = useSelector((state: RootState) => state.about);

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [newFeature, setNewFeature] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      setForm(buildForm(about));
      setImageFile(null);
      setIsDirty(false);
    }
  }, [about]);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => set(e.target.name as keyof FormState, e.target.value);

  const addFeature = () => {
    const v = newFeature.trim();
    if (!v) return;
    set("features", [...form.features, v]);
    setNewFeature("");
  };

  const removeFeature = (i: number) =>
    set(
      "features",
      form.features.filter((_, idx) => idx !== i),
    );

  const updateHour = (
    i: number,
    field: keyof OpenHour,
    val: string | boolean,
  ) =>
    set(
      "openHours",
      form.openHours.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)),
    );

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      addToast({ type: "error", title: "Title and description are required" });
      return;
    }
    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("ctaText", form.ctaText);
      payload.append("ctaLink", form.ctaLink);
      payload.append("phone", form.phone || "");
      payload.append("visible", String(form.visible));
      payload.append("features", JSON.stringify(form.features));
      payload.append("openHours", JSON.stringify(form.openHours));

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await dispatch(upsertAbout(payload)).unwrap();
      setIsDirty(false);
      setImageFile(null);
      addToast({
        type: "success",
        title: "Changes saved",
        message: "About section updated.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Save failed",
        message: "Could not save. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setForm(about ? buildForm(about) : DEFAULT_FORM);
    setImageFile(null);
    setIsDirty(false);
  };

  // ── KEY FIX ───────────────────────────────────────────────────────────────
  // Only show skeleton on the INITIAL page load (no data yet).
  // When saving, isLoading becomes true again BUT about already exists,
  // so we keep the form visible and show "Saving…" on the button instead.
  if (isLoading && !about) {
    return <AboutEditorSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-8 max-w-2xl mx-auto"
    >
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-slate-800">About ANCHOR</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {about
            ? "Manage the About section of your website"
            : "No content yet — fill in the form below and save to create the About section"}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 pt-6 pb-4">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <Label required>Title</Label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                disabled={isSaving}
                className={inputCls}
                placeholder="e.g. World Class Patient Facilities Designed for You"
              />
              {form.title.length > 0 && (
                <HelpText>{form.title.length} characters</HelpText>
              )}
            </div>

            {/* Description */}
            <div>
              <Label required>Description</Label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                disabled={isSaving}
                rows={4}
                className={`${inputCls} resize-none`}
                placeholder="Describe your organisation, mission, and values..."
              />
              {form.description.length > 0 && (
                <HelpText>{form.description.length} characters</HelpText>
              )}
            </div>
          </div>

          {/* ── MAIN IMAGE ── */}
          <Section label="Main Image" />
          <Label>About Photo</Label>
          <ImageUploadArea
            preview={form.imagePreview}
            hint="PNG, JPG up to 10MB · Recommended: 685×720px"
            onFileChange={(file, previewUrl) => {
              setImageFile(file);
              set("imagePreview", previewUrl);
            }}
            onRemove={() => {
              setImageFile(null);
              set("imagePreview", "");
            }}
          />
          {imageFile && (
            <HelpText>New image selected: {imageFile.name}</HelpText>
          )}

          {/* ── FEATURE CHECKLIST ── */}
          <Section label="Feature Checklist" />
          <HelpText>
            Bullet-list items shown on the About page (e.g. "Emergency
            Services").
          </HelpText>

          <div className="mt-3 space-y-1.5">
            {form.features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-lg group"
              >
                <span className="text-sm text-slate-700">{feat}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  disabled={isSaving}
                  className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition ml-3 flex-shrink-0 disabled:opacity-20"
                  aria-label="Remove"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              disabled={isSaving}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              className={inputCls}
              placeholder="Type a feature and press Enter or Add"
            />
            <button
              type="button"
              onClick={addFeature}
              disabled={isSaving}
              className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {/* ── OPEN HOURS ── */}
          <Section label="Open Hours" />
          <HelpText>Displayed in the overlay card on the About image.</HelpText>

          <div className="mt-3 rounded-lg border border-slate-100 overflow-hidden">
            {form.openHours.map((row, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
              >
                <span className="w-24 text-sm font-medium text-slate-600 flex-shrink-0">
                  {row.day}
                </span>
                <input
                  type="text"
                  value={row.hours}
                  disabled={row.closed || isSaving}
                  onChange={(e) => updateHour(i, "hours", e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors bg-white disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed"
                  placeholder="09:30 - 17:30"
                />
                <label className="flex items-center gap-2 cursor-pointer flex-shrink-0 select-none">
                  <input
                    type="checkbox"
                    checked={row.closed}
                    disabled={isSaving}
                    onChange={(e) => updateHour(i, "closed", e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                  />
                  <span
                    className={`text-xs ${row.closed ? "text-slate-500 font-medium" : "text-slate-400"}`}
                  >
                    Closed
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* ── CALL TO ACTION ── */}
          <Section label="Call to Action" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Button Text</Label>
              <input
                type="text"
                name="ctaText"
                value={form.ctaText}
                onChange={handleChange}
                disabled={isSaving}
                className={inputCls}
                placeholder="e.g. Appointment"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <input
                type="text"
                name="ctaLink"
                value={form.ctaLink}
                onChange={handleChange}
                disabled={isSaving}
                className={inputCls}
                placeholder="/appointment"
              />
            </div>
          </div>

          {/* ── CONTACT ── */}
          <Section label="Contact" />
          <div>
            <Label>Phone Number</Label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={isSaving}
              className={inputCls}
              placeholder="+1 123 456 7890"
            />
            <HelpText>
              Displayed next to the CTA button as the "Contact us?" widget.
            </HelpText>
          </div>

          {/* ── VISIBILITY ── */}
          <Section label="Visibility" />
          <div className="flex items-center justify-between py-3.5 px-4 bg-slate-50 border border-slate-100 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Show on website
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Make this section visible to visitors
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.visible}
              disabled={isSaving}
              onClick={() => set("visible", !form.visible)}
              className={`relative inline-flex w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 flex-shrink-0 disabled:opacity-50 ${
                form.visible ? "bg-primary" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${form.visible ? "translate-x-4" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/40 rounded-b-xl">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 disabled:opacity-40 transition-colors"
          >
            Discard Changes
          </button>

          {/* Save button — always visible, shows spinner + "Saving…" during save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-sm min-w-[120px] flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Saving…
              </>
            ) : about ? (
              "Save Changes"
            ) : (
              "Create & Save"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
