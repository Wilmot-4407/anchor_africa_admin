import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { createBlogPost, updateBlogPost } from "../../redux/actions/blog";
import { AppDispatch, RootState } from "../../redux/store";
import { BlogPost } from "../../redux/types";

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogForm({ post, onClose, onSuccess }: BlogFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.blog);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    content: string;
    author: string;
    category: string;
    status: BlogPost["status"];
    tags: string;
  }>({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    author: post?.author || "",
    category: post?.category || "",
    status: post?.status || "draft",
    tags: post?.tags?.join(", ") || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    post?.image && post.image !== "default-blog.png" ? post.image : "",
  );
  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && !post) {
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!formData.content.trim()) {
      setFormError("Content is required");
      return;
    }

    const toastId = toast.loading(post ? "Saving changes…" : "Creating post…");

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("slug", formData.slug || slugify(formData.title));
      fd.append("content", formData.content);
      fd.append("author", formData.author);
      fd.append("category", formData.category);
      fd.append("status", formData.status);

      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      fd.append("tags", tagsArray.join(","));

      if (imageFile) {
        fd.append("image", imageFile);
      }

      if (post?._id) {
        await dispatch(updateBlogPost({ id: post._id, data: fd })).unwrap();
        toast.success("Post updated successfully!", { id: toastId });
      } else {
        await dispatch(createBlogPost(fd)).unwrap();
        toast.success(
          formData.status === "published"
            ? "Post published successfully!"
            : "Post created successfully!",
          { id: toastId },
        );
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        typeof err === "string" ? err : "Failed to save blog post";
      setFormError(message);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {post ? "Edit Post" : "New Blog Post"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {post
                ? `Editing "${post.title}"`
                : "Fill in the details below to create a new post"}
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

        {/* ── Scrollable body ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

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
              placeholder="e.g. The Art of Managing Patient Care"
            />
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
              className={inputCls}
              placeholder="auto-generated from title"
            />
            <p className="mt-1 text-xs text-slate-400">
              Used in the URL: /blog/<strong>{formData.slug || "slug"}</strong>
            </p>
          </div>

          {/* Author + Category — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Author</Label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                disabled={isLoading}
                className={inputCls}
                placeholder="e.g. Dr. Jane Smith"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading}
                className={inputCls}
              >
                <option value="">— Select category —</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="flex gap-2">
              {(["draft", "published", "scheduled"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setFormData((p) => ({ ...p, status: s }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    formData.status === s
                      ? s === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : s === "scheduled"
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                      : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            <div
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                imagePreview
                  ? "border-slate-200 p-2"
                  : "border-slate-200 hover:border-primary/40 hover:bg-slate-50/50 p-8 flex flex-col items-center gap-2"
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full max-h-44 object-cover rounded-lg"
                />
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-slate-300" />
                  <p className="text-sm text-slate-400">
                    Click to upload cover image
                  </p>
                  <p className="text-xs text-slate-300">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Content */}
          <div>
            <Label required>Content</Label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              disabled={isLoading}
              rows={9}
              className={`${inputCls} resize-none font-mono text-xs leading-relaxed`}
              placeholder="Write your article content here..."
            />
            {formData.content.length > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                {formData.content.split(/\s+/).filter(Boolean).length} words · ~
                {Math.max(
                  1,
                  Math.round(formData.content.split(/\s+/).length / 200),
                )}{" "}
                min read
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={isLoading}
              className={inputCls}
              placeholder="healthcare, clinic, tips  (comma-separated)"
            />
          </div>
        </form>

        {/* ── Footer actions ── */}
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
            form=""
            disabled={isLoading}
            onClick={handleSubmit}
            className="ml-auto px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 shadow-sm"
          >
            {isLoading
              ? "Saving…"
              : post
                ? "Save Changes"
                : formData.status === "published"
                  ? "Publish Post"
                  : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
