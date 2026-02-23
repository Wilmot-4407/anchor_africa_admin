import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  LayoutGrid,
  List,
  Clock,
  Eye,
  X,
  Calendar,
  User,
  Tag,
  BookOpen,
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
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-white rounded-t-2xl">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={post.status} />
              <CategoryBadge category={post.category} />
            </div>
            <h2 className="text-lg font-bold text-heading leading-snug">
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

        {/* Cover image */}
        {post.image && (
          <div className="h-56 bg-slate-100 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta info */}
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

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Content */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"
                  >
                    # {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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

export function BlogEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, isLoading, error } = useSelector(
    (state: RootState) => state.blog,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);

  const publishedCount = posts.filter((p) => p.status === "published").length;

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, [dispatch]);

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
        {/* <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          />
        </div> */}

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
            searchTerm
              ? "Try adjusting your search or filter"
              : "Create your first blog post to get started"
          }
        />
      ) : viewMode === "list" ? (
        /* ── List / Table View ── */
        <div className="bg-white rounded-xl border border-slate-200">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_120px_100px_100px_220px] gap-4 px-5 py-3 border-b border-slate-100 rounded-t-xl bg-white text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <span>Title</span>
            <span>Author</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="grid grid-cols-[1fr_120px_120px_100px_100px_220px] gap-4 items-center px-5 py-4 hover:bg-slate-50 transition-colors group"
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
                  {post.author || "—"}
                </span>

                {/* Category */}
                <div>
                  <CategoryBadge category={post.category} />
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={post.status} />
                </div>

                {/* Date */}
                <span className="text-sm text-slate-500">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>

                {/* Inline Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingPost(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <Eye size={12} />
                    View
                  </button>
                  <button
                    onClick={() => handleOpenForm(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
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
                  <CategoryBadge category={post.category} />
                  <StatusBadge status={post.status} />
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
                    onClick={() => setViewingPost(post)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <Eye size={12} /> View
                  </button>
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

      {/* View Modal */}
      {viewingPost && (
        <BlogViewModal
          post={viewingPost}
          onClose={() => setViewingPost(null)}
        />
      )}
    </motion.div>
  );
}
