import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  MoreHorizontal,
  LayoutGrid,
  List,
  Clock,
  Eye,
} from "lucide-react";
import { fetchBlogPosts, deleteBlogPost } from "../redux/actions/blog";
import { AppDispatch, RootState } from "../redux/store";
import { CardSkeletonLoader } from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { BlogForm } from "../components/forms/BlogForm";
import { BlogPost } from "../redux/types";

type ViewMode = "list" | "grid";

function StatusBadge({ status }: { status?: string }) {
  const s = status || "draft";
  const map: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-slate-50 text-slate-600 border-slate-200",
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
        map[s] || map.draft
      }`}
    >
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      {category}
    </span>
  );
}

function readingTime(content: string) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Derive categories from posts
function getCategories(posts: BlogPost[]) {
  const cats = new Set<string>();
  posts.forEach((p) => {
    if ((p as any).category) cats.add((p as any).category);
  });
  return Array.from(cats);
}

export function BlogEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading, error } = useSelector(
    (state: RootState) => state.blog,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const categories = ["All", ...getCategories(posts)];
  const publishedCount = posts.filter(
    (p) => (p as any).status === "published",
  ).length;

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const postCategory = (post as any).category || "";
    const matchesCategory =
      activeCategory === "All" || postCategory === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

  // Close menu on outside click
  useEffect(() => {
    const handler = () => setOpenMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await dispatch(deleteBlogPost(id));
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
      className="p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Blog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {posts.length} post{posts.length !== 1 ? "s" : ""} ·{" "}
            {publishedCount} published
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-navy-950 text-white border-navy-950"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View mode toggles */}
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${
              viewMode === "grid"
                ? "bg-slate-100 text-slate-700"
                : "bg-white text-slate-400 hover:text-slate-600"
            }`}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${
              viewMode === "list"
                ? "bg-slate-100 text-slate-700"
                : "bg-white text-slate-400 hover:text-slate-600"
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <CardSkeletonLoader count={3} />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchBlogPosts())}
        />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          title="No blog posts found"
          description={
            searchTerm || activeCategory !== "All"
              ? "Try adjusting your search or filter"
              : "Create your first blog post to get started"
          }
        />
      ) : viewMode === "list" ? (
        /* ── List / Table View ── */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_130px_130px_110px_110px_80px_40px] gap-4 px-5 py-3 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <span>Title</span>
            <span>Author</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span>Views</span>
            <span />
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="grid grid-cols-[1fr_130px_130px_110px_110px_80px_40px] gap-4 items-center px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                {/* Title */}
                <div className="min-w-0">
                  <p className="font-medium text-heading text-sm leading-snug line-clamp-2">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <Clock size={11} />
                    {readingTime(post.content)} min read
                  </div>
                </div>

                {/* Author */}
                <span className="text-sm text-slate-600 truncate">
                  {(post as any).author || "—"}
                </span>

                {/* Category */}
                <div>
                  <CategoryBadge category={(post as any).category} />
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={(post as any).status} />
                </div>

                {/* Date */}
                <span className="text-sm text-slate-500">
                  {formatDate(
                    (post as any).publishedAt || (post as any).createdAt,
                  )}
                </span>

                {/* Views */}
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  {(post as any).views ? (
                    <>
                      <Eye size={13} className="text-slate-400" />
                      {((post as any).views as number).toLocaleString()}
                    </>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </div>

                {/* Actions menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === post._id ? null : post._id);
                    }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {openMenu === post._id && (
                    <div
                      className="absolute right-0 top-8 z-10 bg-white rounded-lg border border-slate-200 shadow-lg py-1 min-w-[120px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          handleOpenForm(post);
                          setOpenMenu(null);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(post._id);
                          setOpenMenu(null);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Grid View ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden group"
            >
              {post.image && (
                <div className="h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CategoryBadge category={(post as any).category} />
                  <StatusBadge status={(post as any).status} />
                </div>
                <h3 className="font-semibold text-heading text-sm line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                  <Clock size={11} />
                  {readingTime(post.content)} min read
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenForm(post)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
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
    </motion.div>
  );
}
