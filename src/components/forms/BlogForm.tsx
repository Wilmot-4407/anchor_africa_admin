import { useState, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, UploadCloud, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { createBlogPost, updateBlogPost } from "../../redux/actions/blog";
import { AppDispatch, RootState } from "../../redux/store";
import { BlogPost } from "../../redux/types";
import { BrandSpinner } from "../common/SkeletonLoader";

interface BlogFormProps {
  post?: BlogPost | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  "Acupressure",
  "Blood",
  "Food",
  "Health",
  "Mental Health",
  "Therapy",
  "Walking",
  "Leadership",
  "Research",
  "Other",
];

const STEPS = ["Article Details", "Settings", "Content", "SEO"];

const inputCls =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors bg-white disabled:bg-slate-50 disabled:cursor-not-allowed";

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
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

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
            <span
              className={`text-[10px] font-semibold whitespace-nowrap ${
                i <= current ? "text-primary" : "text-slate-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 mt-3.5 transition-all ${
                i < current ? "bg-primary" : "bg-slate-200"
              }`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export function BlogForm({ post, onClose, onSuccess }: BlogFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.blog);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title:           post?.title        || "",
    slug:            post?.slug         || "",
    excerpt:         post?.excerpt      || "",
    content:         post?.content      || "",
    author:          post?.author       || "",
    authorTitle:     post?.authorTitle  || "",
    category:        post?.category     || "",
    status:          post?.status       || ("draft" as BlogPost["status"]),
    tags:            Array.isArray(post?.tags) ? post.tags.join(", ") : "",
    isFeatured:      post?.isFeatured   || false,
    metaTitle:       post?.metaTitle    || "",
    metaDescription: post?.metaDescription || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(post?.image || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(post?.authorAvatar || "");
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    if (name === "title" && !post?.slug) {
      setFormData((prev) => ({ ...prev, title: value as string, slug: slugify(value as string) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validateStep = (s: number): boolean => {
    if (s === 0 && !formData.title.trim()) {
      setFormError("Title is required");
      return false;
    }
    if (s === 1 && !formData.category) {
      setFormError("Category is required");
      return false;
    }
    if (s === 2 && !formData.content.trim()) {
      setFormError("Content is required");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleNext = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const handleBack = () => { setFormError(""); setStep((s) => s - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "tags") {
        const tagsArr = (val as string).split(",").map((t) => t.trim()).filter(Boolean);
        fd.append("tags", JSON.stringify(tagsArr));
      } else {
        fd.append(key, String(val));
      }
    });
    if (imageFile) fd.append("image", imageFile);
    if (avatarFile) fd.append("authorAvatar", avatarFile);

    try {
      if (post?._id) {
        await dispatch(updateBlogPost({ id: post._id, data: fd })).unwrap();
      } else {
        await dispatch(createBlogPost(fd)).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Blog creation failed", err);
    }
  };

  const isEditing = !!post;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[94vh] flex flex-col border border-slate-200/60">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditing ? "Edit Blog Post" : "New Blog Post"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
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

        {/* Step bar */}
        <div className="flex-shrink-0">
          <StepBar steps={STEPS} current={step} />
        </div>

        {/* Body */}
        <form id="blog-post-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{formError}</p>
            </div>
          )}

          {/* ── Step 0: Article Details ── */}
          {step === 0 && (
            <>
              <SectionHeading>Article Details</SectionHeading>

              {/* Cover image */}
              <div>
                <Label>Cover Image</Label>
                <input ref={fileInputRef} id="blog-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <label htmlFor="blog-image" className="block w-full cursor-pointer">
                  <div className="relative w-full h-44 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <UploadCloud className="w-6 h-6 text-white mb-1" />
                          <span className="text-white text-xs font-semibold">Click to change image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <UploadCloud className="w-7 h-7" />
                        <span className="text-sm">Click to upload cover image</span>
                        <span className="text-xs text-slate-300">JPG, PNG, WEBP up to 10MB</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div>
                <Label required>Title</Label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="Article title…" />
              </div>

              <div>
                <Label>Slug</Label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} disabled={isLoading} className={`${inputCls} font-mono text-xs`} placeholder="auto-generated-from-title" />
              </div>

              <div>
                <Label>Excerpt</Label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} disabled={isLoading} rows={2} className={`${inputCls} resize-none`} placeholder="Short summary shown in listing views…" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Author</Label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="Dr. Adeyemi" />
                </div>
                <div>
                  <Label>Author Title</Label>
                  <input type="text" name="authorTitle" value={formData.authorTitle} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="Chief Psychiatrist" />
                </div>
              </div>

              {/* Author avatar */}
              <div>
                <Label>Author Avatar</Label>
                <input id="blog-avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                <label htmlFor="blog-avatar" className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 group-hover:border-primary/50 transition-colors shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Author avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UploadCloud className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">
                      {avatarPreview ? "Click to change avatar" : "Click to upload author photo"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WEBP — shown next to author name</p>
                  </div>
                </label>
              </div>
            </>
          )}

          {/* ── Step 1: Settings ── */}
          {step === 1 && (
            <>
              <SectionHeading>Publication Settings</SectionHeading>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Category</Label>
                  <select name="category" value={formData.category} onChange={handleChange} disabled={isLoading} className={inputCls}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label required>Status</Label>
                  <select name="status" value={formData.status} onChange={handleChange} disabled={isLoading} className={inputCls}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="mental health, therapy, recovery" />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} disabled={isLoading} className="w-4 h-4 accent-primary" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Feature this post on the homepage
                </label>
              </div>
            </>
          )}

          {/* ── Step 2: Content ── */}
          {step === 2 && (
            <>
              <SectionHeading>Article Content</SectionHeading>
              <div>
                <Label required>Content</Label>
                <textarea name="content" value={formData.content} onChange={handleChange} disabled={isLoading} rows={14} className={`${inputCls} resize-y font-mono text-xs`} placeholder="Write your article content…" />
                {formData.content && (
                  <p className="mt-1 text-xs text-slate-400 text-right">
                    {formData.content.split(/\s+/).filter(Boolean).length} words
                  </p>
                )}
              </div>
            </>
          )}

          {/* ── Step 3: SEO ── */}
          {step === 3 && (
            <>
              <SectionHeading>SEO &amp; Meta</SectionHeading>

              <div>
                <Label>Meta Title</Label>
                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="SEO page title…" />
              </div>

              <div>
                <Label>Meta Description</Label>
                <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} disabled={isLoading} rows={4} className={`${inputCls} resize-none`} placeholder="SEO description (150–160 chars recommended)…" />
                <p className="mt-1 text-xs text-slate-400 text-right">
                  {formData.metaDescription.length} / 160
                </p>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex-shrink-0">
          {step > 0 ? (
            <button type="button" onClick={handleBack} disabled={isLoading} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-white transition disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-white transition disabled:opacity-50">
              Cancel
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={handleNext} disabled={isLoading} className="ml-auto flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition disabled:opacity-50 shadow-sm">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" form="blog-post-form" disabled={isLoading} className="ml-auto flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition disabled:opacity-50 shadow-sm">
              {isLoading && <BrandSpinner size="sm" />}
              {isLoading ? "Saving…" : isEditing ? "Save Changes" : "Publish Post"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
