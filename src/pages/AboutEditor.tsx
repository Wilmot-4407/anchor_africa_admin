import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Type, Zap, Image as ImageIcon, Eye, UploadCloud } from "lucide-react";
import { fetchAbout } from "../redux/actions/about";
import { AppDispatch, RootState } from "../redux/store";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { ErrorState } from "../components/common/StateComponents";
import { useNavigation } from "../context/NavigationContext";

interface FormData {
  // Section content
  headline: string;
  subheadline: string;
  bodyContent: string;
  // CTA
  ctaText: string;
  ctaLink: string;
  // Media
  featuredImage: string | null;
  imageAltText: string;
  backgroundImage: string | null;
  overlayOpacity: number;
  // Visibility & SEO
  sectionVisibility: boolean;
  metaTitle: string;
  metaDescription: string;
}

type TabId = "content" | "seo";

const CHAR_LIMIT_SUBHEADLINE = 160;

function SectionDivider({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-5 mt-8 first:mt-0">
      <span className="text-amber-500 flex-shrink-0">{icon}</span>
      <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100 ml-1" />
    </div>
  );
}

function ImageUploadArea({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="block text-sm font-medium text-heading mb-2">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors min-h-[120px]"
      >
        {value ? (
          <img
            src={value}
            alt="preview"
            className="max-h-32 rounded object-cover"
          />
        ) : (
          <>
            <UploadCloud className="w-7 h-7 text-slate-300" />
            <p className="text-sm text-slate-500">
              Click to upload or drag and drop
            </p>
            {hint && <p className="text-xs text-slate-400">{hint}</p>}
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
          if (file) {
            const url = URL.createObjectURL(file);
            onChange(url);
          }
        }}
      />
      {value && (
        <button
          onClick={() => onChange(null)}
          className="mt-1 text-xs text-red-500 hover:underline"
        >
          Remove image
        </button>
      )}
    </div>
  );
}

export function AboutEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useNavigation();
  const { about, isLoading, error } = useSelector(
    (state: RootState) => state.about,
  );

  const [activeTab, setActiveTab] = useState<TabId>("content");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    headline: "Transforming Mental Healthcare Across Africa",
    subheadline:
      "ANCHOR provides world-class neuropsychological assessment, counseling, and research services to communities across the continent.",
    bodyContent: "",
    ctaText: "Book a Consultation",
    ctaLink: "/appointments",
    featuredImage: null,
    imageAltText: "",
    backgroundImage: null,
    overlayOpacity: 40,
    sectionVisibility: true,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    dispatch(fetchAbout());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      setFormData((prev) => ({
        ...prev,
        headline: about.title || prev.headline,
        subheadline: about.description || prev.subheadline,
        bodyContent: about.description || "",
      }));
    }
  }, [about]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Wire up your actual save/API call here
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    setIsDirty(false);
    addToast({
      type: "success",
      title: "Changes saved",
      message: "About section has been updated.",
    });
  };

  const handleDiscard = () => {
    if (about) {
      setFormData((prev) => ({
        ...prev,
        headline: about.title || prev.headline,
        subheadline: about.description || prev.subheadline,
        bodyContent: about.description || "",
      }));
    }
    setIsDirty(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <ErrorState message={error} onRetry={() => dispatch(fetchAbout())} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8 max-w-3xl mx-auto"
    >
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">About ANCHOR</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage the About section of your website
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {(["content", "seo"] as TabId[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3.5 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary bg-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "seo" ? "SEO" : "Content"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-0">
          {activeTab === "content" ? (
            <>
              {/* ── HEADING & COPY ── */}
              <SectionDivider
                icon={<Type size={14} />}
                label="Heading & Copy"
              />
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter page headline"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    {formData.headline.length} characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Subheadline
                  </label>
                  <textarea
                    name="subheadline"
                    value={formData.subheadline}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Enter a supporting subheadline..."
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {formData.subheadline.length} characters · Recommended:{" "}
                    under {CHAR_LIMIT_SUBHEADLINE}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Body Content
                  </label>
                  <textarea
                    name="bodyContent"
                    value={formData.bodyContent}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono"
                    placeholder="Enter section content..."
                  />
                </div>
              </div>

              {/* ── CALL TO ACTION ── */}
              <SectionDivider icon={<Zap size={14} />} label="Call to Action" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Book a Consultation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="ctaLink"
                    value={formData.ctaLink}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="/appointments"
                  />
                </div>
              </div>

              {/* ── MEDIA ── */}
              <SectionDivider
                icon={<ImageIcon size={14} />}
                label="Background & Styling"
              />
              <div className="space-y-5">
                <ImageUploadArea
                  label="Background Image"
                  hint="PNG, JPG up to 5MB · Recommended: 1920×1080"
                  value={formData.backgroundImage}
                  onChange={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      backgroundImage: url,
                    }));
                    setIsDirty(true);
                  }}
                />

                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Overlay Opacity
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formData.overlayOpacity}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          overlayOpacity: Number(e.target.value),
                        }));
                        setIsDirty(true);
                      }}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="text-sm font-medium text-slate-600 w-10 text-right">
                      {formData.overlayOpacity}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Transparent</span>
                    <span>Fully opaque</span>
                  </div>
                </div>

                <ImageUploadArea
                  label="Featured Image"
                  hint="PNG, JPG up to 5MB"
                  value={formData.featuredImage}
                  onChange={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      featuredImage: url,
                    }));
                    setIsDirty(true);
                  }}
                />

                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    name="imageAltText"
                    value={formData.imageAltText}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe the image for accessibility..."
                  />
                </div>
              </div>

              {/* ── VISIBILITY & SEO ── */}
              <SectionDivider
                icon={<Eye size={14} />}
                label="Visibility & SEO"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-heading">
                      Section Visibility
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Show this section on the live website
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        sectionVisibility: !prev.sectionVisibility,
                      }));
                      setIsDirty(true);
                    }}
                    className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${
                      formData.sectionVisibility
                        ? "bg-amber-500"
                        : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        formData.sectionVisibility ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ── SEO TAB ── */
            <div className="space-y-5 pt-2">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Meta Title Override
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Leave blank to use default template"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Meta Description Override
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Leave blank to use default description"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Recommended: under 160 characters
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleDiscard}
            disabled={!isDirty}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-40 transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
