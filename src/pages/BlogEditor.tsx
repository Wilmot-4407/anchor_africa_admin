import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  FileText,
  CheckCircle2,
  BookOpen,
  Calendar,
  User,
  Tag,
  Layers,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { fetchBlogPosts, deleteBlogPost } from "../redux/actions/blog";
import { AppDispatch, RootState } from "../redux/store";
import { PageSpinner } from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { BlogForm } from "../components/forms/BlogForm";
import { BlogPost } from "../redux/types";
import toast from "../utils/toast";

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────
function readingTime(content?: string | null) {
  if (!content) return 1;
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Badges ────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  const s = status || "draft";
  const map: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-slate-50 text-slate-600 border-slate-200",
    scheduled: "bg-primary/8 text-primary border-primary/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[s] || map.draft}`}
    >
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return <span className="text-slate-400 text-xs">—</span>;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
      {category}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
      <p className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-700">{page}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`min-w-[30px] h-[30px] rounded-lg text-xs font-semibold border transition-colors ${n === page ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-600 hover:bg-white hover:text-primary"}`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────
function BlogViewModal({
  post,
  onClose,
}: {
  post: BlogPost;
  onClose: () => void;
}) {
  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-white rounded-t-2xl">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={post.status} />
              <CategoryBadge category={post.category} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 leading-snug">
              {post.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {post.image && (
          <div className="h-56 bg-slate-100 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50">
          {post.author && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <User size={13} className="text-slate-400" />
              <span>{post.author}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <Calendar size={13} className="text-slate-400" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <BookOpen size={13} className="text-slate-400" />
            <span>{readingTime(post.content)} min read</span>
          </div>
          {post.slug && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Tag size={13} className="text-slate-400" />
              <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                /{post.slug}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
          {tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
  postTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  postTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center">
          Delete Post
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700 line-clamp-2">
            &ldquo;{postTitle}&rdquo;
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && <RefreshCw size={13} className="animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────────────────────
export function BlogEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading, error } = useSelector(
    (state: RootState) => state.blog,
  );

  // Filter state
  const [titleSearch, setTitleSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [dateMode, setDateMode] = useState<
    "none" | "monthYear" | "range" | "exact"
  >("none");
  const [dateMonthYear, setDateMonthYear] = useState(""); // "YYYY-MM"
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dateExact, setDateExact] = useState("");
  // Active (applied) filters
  const [activeFilters, setActiveFilters] = useState({
    title: "",
    author: "",
    category: "",
    dateMode: "none" as "none" | "monthYear" | "range" | "exact",
    dateMonthYear: "",
    dateFrom: "",
    dateTo: "",
    dateExact: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  // Stats
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;

  // Unique categories & authors for dropdown hints
  const allCategories = [
    ...new Set(posts.map((p) => p.category).filter(Boolean)),
  ];
  const allAuthors = [...new Set(posts.map((p) => p.author).filter(Boolean))];

  const filtered = posts.filter((p) => {
    if (
      activeFilters.title &&
      !p.title.toLowerCase().includes(activeFilters.title.toLowerCase())
    )
      return false;
    if (
      activeFilters.author &&
      !(p.author || "")
        .toLowerCase()
        .includes(activeFilters.author.toLowerCase())
    )
      return false;
    if (
      activeFilters.category &&
      !(p.category || "")
        .toLowerCase()
        .includes(activeFilters.category.toLowerCase())
    )
      return false;

    const postDate = new Date(p.publishedAt || p.createdAt || "");
    if (activeFilters.dateMode === "monthYear" && activeFilters.dateMonthYear) {
      const [y, m] = activeFilters.dateMonthYear.split("-").map(Number);
      if (postDate.getFullYear() !== y || postDate.getMonth() + 1 !== m)
        return false;
    } else if (activeFilters.dateMode === "range") {
      if (activeFilters.dateFrom && postDate < new Date(activeFilters.dateFrom))
        return false;
      if (
        activeFilters.dateTo &&
        postDate > new Date(activeFilters.dateTo + "T23:59:59")
      )
        return false;
    } else if (activeFilters.dateMode === "exact" && activeFilters.dateExact) {
      const d = new Date(activeFilters.dateExact);
      if (postDate.toDateString() !== d.toDateString()) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters =
    activeFilters.title ||
    activeFilters.author ||
    activeFilters.category ||
    activeFilters.dateMode !== "none";

  const handleSearch = () => {
    setActiveFilters({
      title: titleSearch,
      author: authorSearch,
      category: categorySearch,
      dateMode,
      dateMonthYear,
      dateFrom,
      dateTo,
      dateExact,
    });
    setPage(1);
  };
  const handleReset = () => {
    setTitleSearch("");
    setAuthorSearch("");
    setCategorySearch("");
    setDateMode("none");
    setDateMonthYear("");
    setDateFrom("");
    setDateTo("");
    setDateExact("");
    setActiveFilters({
      title: "",
      author: "",
      category: "",
      dateMode: "none",
      dateMonthYear: "",
      dateFrom: "",
      dateTo: "",
      dateExact: "",
    });
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBlogPost(deletingPost._id)).unwrap();
      toast.success("Blog post deleted");
      setDeletingPost(null);
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenForm = (post?: BlogPost) => {
    setEditingPost(post || null);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPost(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Blog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage articles, news &amp; research posts
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Stats */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<Layers size={18} className="text-primary" />}
            label="Total Posts"
            value={posts.length}
            color="bg-primary/8"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-emerald-600" />}
            label="Published"
            value={publishedCount}
            color="bg-emerald-50"
          />
          <StatCard
            icon={<FileText size={18} className="text-slate-500" />}
            label="Drafts"
            value={draftCount}
            color="bg-slate-100"
          />
          <StatCard
            icon={<Clock size={18} className="text-primary" />}
            label="Scheduled"
            value={scheduledCount}
            color="bg-primary/8"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Title */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by title…"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white transition-colors"
            />
          </div>
          {/* Author */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by author…"
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              list="blog-authors-list"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white transition-colors"
            />
            <datalist id="blog-authors-list">
              {allAuthors.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>
          {/* Category */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by category…"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              list="blog-categories-list"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white transition-colors"
            />
            <datalist id="blog-categories-list">
              {allCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Date filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mr-1">
            <Calendar size={13} /> Date:
          </span>
          {(["none", "monthYear", "range", "exact"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setDateMode(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${dateMode === mode ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-200 hover:border-primary/40"}`}
            >
              {mode === "none"
                ? "Any"
                : mode === "monthYear"
                  ? "Month / Year"
                  : mode === "range"
                    ? "Date Range"
                    : "Exact Date"}
            </button>
          ))}
          {dateMode === "monthYear" && (
            <input
              type="month"
              value={dateMonthYear}
              onChange={(e) => setDateMonthYear(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            />
          )}
          {dateMode === "range" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              />
            </div>
          )}
          {dateMode === "exact" && (
            <input
              type="date"
              value={dateExact}
              onChange={(e) => setDateExact(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            />
          )}
        </div>

        <div className="flex items-center gap-2 pt-1 justify-end">
          {hasActiveFilters && (
            <span className="text-xs text-slate-500 mr-auto">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filtered.length}
              </span>{" "}
              result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <Search size={14} /> Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <PageSpinner label="Loading blog posts…" />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchBlogPosts())}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No posts found"
          description={
            hasActiveFilters
              ? "Try a different search term or reset filters."
              : "Create your first blog post to get started."
          }
          action={
            hasActiveFilters ? (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <RotateCcw size={14} /> Reset filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-[40px_1fr_130px_130px_100px_100px_210px] gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>#</span>
            <span>Title</span>
            <span>Author</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {paginated.map((post, idx) => (
              <div
                key={post._id}
                className="grid grid-cols-[40px_1fr_130px_130px_100px_100px_210px] gap-3 items-center px-5 py-4 hover:bg-slate-50/70 transition-colors"
              >
                <span className="text-xs font-medium text-slate-400">
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </span>

                {/* Title */}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm line-clamp-1">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400">
                    <Clock size={10} /> {readingTime(post.content)} min read
                  </div>
                </div>

                <span className="text-sm text-slate-600 truncate">
                  {post.author || "—"}
                </span>

                <CategoryBadge category={post.category} />

                <StatusBadge status={post.status} />

                <span className="text-xs text-slate-500">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingPost(post)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
                  >
                    <Eye size={11} /> View
                  </button>
                  <button
                    onClick={() => handleOpenForm(post)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 rounded-lg transition-colors border border-primary/15"
                  >
                    <Edit2 size={11} /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingPost(post)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {showForm && (
        <BlogForm
          post={editingPost}
          onClose={handleCloseForm}
          onSuccess={() => {
            dispatch(fetchBlogPosts());
            handleCloseForm();
          }}
        />
      )}

      {viewingPost && (
        <BlogViewModal
          post={viewingPost}
          onClose={() => setViewingPost(null)}
        />
      )}

      {deletingPost && (
        <DeleteModal
          postTitle={deletingPost.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPost(null)}
          isDeleting={isDeleting}
        />
      )}
    </motion.div>
  );
}
