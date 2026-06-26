import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { fetchServicesAdmin, deleteService } from "../redux/actions/services";
import { AppDispatch, RootState } from "../redux/store";
import { PageSpinner } from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { ServiceForm } from "../components/forms/ServiceForm";
import { Service } from "../redux/types";
import toast from "../utils/toast";

const PAGE_SIZE = 8;

// ── Type badge ────────────────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, string> = {
  clinic: "bg-primary/8 text-primary border-primary/20",
  institute: "bg-secondary/10 text-secondary border-secondary/20",
  research: "bg-purple-50 text-purple-700 border-purple-200",
};

function TypeBadge({ type }: { type: string }) {
  const cls =
    TYPE_STYLES[type] || "bg-slate-50 text-slate-600 border-slate-200";
  const label =
    type === "clinic"
      ? "Clinic"
      : type === "institute"
        ? "Institute"
        : "Research";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
}

function PublishedBadge({ published }: { published?: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 size={10} /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
      <XCircle size={10} /> Draft
    </span>
  );
}

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
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
  itemName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  itemName: string;
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
          Delete Service
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">{itemName}</span>? This
          action cannot be undone.
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

export function ServicesEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { services, isLoading, error } = useSelector(
    (state: RootState) => state.services,
  );

  const [titleSearch, setTitleSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    title: "",
    type: "",
    category: "",
    status: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchServicesAdmin());
  }, [dispatch]);

  // Stats
  const publishedCount = services.filter((s) => s.isPublished).length;
  const clinicCount = services.filter((s) => s.type === "clinic").length;
  const insCount = services.filter((s) => s.type === "institute").length;
  const resCount = services.filter((s) => s.type === "research").length;

  const allCategories = [
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  const filtered = services.filter((s) => {
    if (
      activeFilters.title &&
      !s.title.toLowerCase().includes(activeFilters.title.toLowerCase())
    )
      return false;
    if (activeFilters.type && s.type !== activeFilters.type) return false;
    if (
      activeFilters.category &&
      !s.category.toLowerCase().includes(activeFilters.category.toLowerCase())
    )
      return false;
    if (activeFilters.status === "published" && !s.isPublished) return false;
    if (activeFilters.status === "draft" && s.isPublished) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters =
    activeFilters.title ||
    activeFilters.type ||
    activeFilters.category ||
    activeFilters.status;

  const handleSearch = () => {
    setActiveFilters({
      title: titleSearch,
      type: typeFilter,
      category: categorySearch,
      status: statusFilter,
    });
    setPage(1);
  };
  const handleReset = () => {
    setTitleSearch("");
    setTypeFilter("");
    setCategorySearch("");
    setStatusFilter("");
    setActiveFilters({ title: "", type: "", category: "", status: "" });
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteService(deletingService._id)).unwrap();
      toast.success("Service deleted successfully");
      setDeletingService(null);
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenForm = (service?: Service) => {
    setEditingService(service || null);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
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
          <h1 className="text-2xl font-bold text-primary">Services</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your healthcare and clinical service offerings
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Service
        </button>
      </div>

      {/* Stats */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            icon={<Layers size={18} className="text-primary" />}
            label="Total Services"
            value={services.length}
            color="bg-primary/8"
          />
          <StatCard
            icon={<CheckCircle2 size={18} className="text-emerald-600" />}
            label="Published"
            value={publishedCount}
            color="bg-emerald-50"
          />
          <StatCard
            icon={<Briefcase size={18} className="text-primary" />}
            label="Clinic"
            value={clinicCount}
            color="bg-primary/8"
          />
          <StatCard
            icon={<Briefcase size={18} className="text-secondary" />}
            label="Institute"
            value={insCount}
            color="bg-secondary/10"
          />
          <StatCard
            icon={<Briefcase size={18} className="text-purple-600" />}
            label="Research"
            value={resCount}
            color="bg-purple-50"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-slate-700"
          >
            <option value="">All Types</option>
            <option value="clinic">Clinic</option>
            <option value="institute">Institute</option>
            <option value="research">Research</option>
          </select>
          {/* Category */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by category…"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              list="service-categories-list"
              className="w-full px-3.5 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white transition-colors"
            />
            <datalist id="service-categories-list">
              {allCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Unpublished</option>
          </select>
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
        <PageSpinner label="Loading services…" />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchServicesAdmin())}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No services found"
          description={
            hasActiveFilters
              ? "Try a different search term or reset filters."
              : "Create your first service to get started."
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
          {/* Table head */}
          <div className="grid grid-cols-[40px_1fr_130px_140px_160px_100px_170px] gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>#</span>
            <span>Title</span>
            <span>Type</span>
            <span>Category</span>
            <span>Description</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {paginated.map((service, idx) => (
              <div
                key={service._id}
                className="grid grid-cols-[40px_1fr_130px_140px_160px_100px_170px] gap-3 items-center px-5 py-4 hover:bg-slate-50/70 transition-colors group"
              >
                <span className="text-xs font-medium text-slate-400">
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </span>

                {/* Title + Icon */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {service.icon && (() => {
                      const IC = (LucideIcons as any)[service.icon];
                      return IC ? (
                        <span className="flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <IC className="w-3.5 h-3.5" />
                        </span>
                      ) : null;
                    })()}
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {service.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    /{service.slug}
                  </p>
                </div>

                <TypeBadge type={service.type} />

                <span className="text-sm text-slate-600 truncate">
                  {service.category}
                </span>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {service.shortDescription}
                </p>

                <PublishedBadge published={service.isPublished} />

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenForm(service)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 rounded-lg transition-colors border border-primary/15"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingService(service)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                  >
                    <Trash2 size={12} /> Delete
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
        <ServiceForm
          service={editingService}
          onClose={handleCloseForm}
          onSuccess={() => {
            dispatch(fetchServicesAdmin());
            handleCloseForm();
          }}
        />
      )}

      {deletingService && (
        <DeleteModal
          itemName={deletingService.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingService(null)}
          isDeleting={isDeleting}
        />
      )}
    </motion.div>
  );
}
