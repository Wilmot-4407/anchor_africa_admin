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
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { fetchTeamMembersAdmin, deleteTeamMember } from "../redux/actions/team";
import { AppDispatch, RootState } from "../redux/store";
import { PageSpinner } from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { TeamForm } from "../components/forms/TeamForm";
import { TeamMember } from "../redux/types";
import toast from "../utils/toast";

const PAGE_SIZE = 8;

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "#058789",
  "#047071",
  "#5fc4eb",
  "#ba9d20",
  "#b7b065",
  "#9b7b18",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
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
  memberName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  memberName: string;
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
          Delete Team Member
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">{memberName}</span>?
          This action cannot be undone.
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
            {isDeleting && (
              <span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" />
                <span className="absolute inset-0 rounded-full bg-current" />
              </span>
            )}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function TeamEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { members, isLoading, error } = useSelector(
    (state: RootState) => state.team,
  );

  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    name: "",
    phone: "",
    status: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTeamMembersAdmin());
  }, [dispatch]);

  // Stats
  const activeCount = members.filter((m) => m.isActive !== false).length;
  const inactiveCount = members.length - activeCount;

  // Specialty breakdown for a simple count
  const specialties = [
    ...new Set(members.map((m) => m.specialty).filter(Boolean)),
  ];

  // Filter
  const filtered = members.filter((m) => {
    if (activeFilters.name) {
      const q = activeFilters.name.toLowerCase();
      const match =
        m.name.toLowerCase().includes(q) ||
        m.specialty.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        (m.contact?.email || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeFilters.phone) {
      if (!(m.contact?.phone || "").includes(activeFilters.phone)) return false;
    }
    if (activeFilters.status === "active" && m.isActive === false) return false;
    if (activeFilters.status === "inactive" && m.isActive !== false)
      return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters =
    activeFilters.name || activeFilters.phone || activeFilters.status;

  const handleSearch = () => {
    setActiveFilters({
      name: nameSearch,
      phone: phoneSearch,
      status: statusFilter,
    });
    setPage(1);
  };
  const handleReset = () => {
    setNameSearch("");
    setPhoneSearch("");
    setStatusFilter("");
    setActiveFilters({ name: "", phone: "", status: "" });
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteTeamMember(deletingMember._id)).unwrap();
      toast.success("Team member deleted successfully");
      setDeletingMember(null);
    } catch {
      toast.error("Failed to delete team member");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenForm = (member?: TeamMember) => {
    setEditingMember(member || null);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };
  const handleSuccess = () => {
    handleCloseForm();
    dispatch(fetchTeamMembersAdmin());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8 max-w-7xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Team</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage ANCHOR clinicians and staff
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* ── Stats ── */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<Users size={18} className="text-primary" />}
            label="Total Members"
            value={members.length}
            color="bg-primary/8"
          />
          <StatCard
            icon={<UserCheck size={18} className="text-emerald-600" />}
            label="Active"
            value={activeCount}
            color="bg-emerald-50"
          />
          <StatCard
            icon={<UserX size={18} className="text-secondary" />}
            label="Inactive"
            value={inactiveCount}
            color="bg-secondary/10"
          />
          <StatCard
            icon={<Users size={18} className="text-accent" />}
            label="Specialties"
            value={specialties.length}
            color="bg-accent/10"
          />
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Name / title / specialty / email */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, title, specialty…"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white transition-colors"
            />
          </div>
          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by contact number…"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white transition-colors"
            />
          </div>
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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

      {/* ── Table ── */}
      {isLoading ? (
        <PageSpinner label="Loading team members…" />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchTeamMembersAdmin())}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No team members found"
          description={
            hasActiveFilters
              ? "Try a different search term or reset filters."
              : "Add your first team member to get started."
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
          <div className="grid grid-cols-[40px_200px_1fr_1fr_140px_80px_170px] gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>#</span>
            <span>Name</span>
            <span>Title / Role</span>
            <span>Specialty</span>
            <span>Contact</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {paginated.map((member, idx) => {
              const initials = getInitials(member.name);
              const bgColor = avatarColor(member.name);
              const isActive = member.isActive !== false;

              return (
                <div
                  key={member._id}
                  className="grid grid-cols-[40px_200px_1fr_1fr_140px_80px_170px] gap-3 items-center px-5 py-3.5 hover:bg-slate-50/70 transition-colors group"
                >
                  {/* # */}
                  <span className="text-xs font-medium text-slate-400">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </span>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                        style={{ background: bgColor }}
                      >
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-primary font-mono truncate">
                        /{member.slug}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 font-medium truncate">
                      {member.title}
                    </p>
                  </div>

                  {/* Specialty */}
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 truncate max-w-full">
                      {member.specialty || "—"}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-0.5">
                    {member.contact?.email && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                        <Mail
                          size={10}
                          className="text-primary flex-shrink-0"
                        />
                        <span className="truncate">{member.contact.email}</span>
                      </div>
                    )}
                    {member.contact?.phone && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Phone
                          size={10}
                          className="text-primary flex-shrink-0"
                        />
                        <span>{member.contact.phone}</span>
                      </div>
                    )}
                    {!member.contact?.email && !member.contact?.phone && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    {isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenForm(member)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 rounded-lg transition-colors border border-primary/15"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingMember(member)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
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
        <TeamForm
          member={editingMember}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}

      {deletingMember && (
        <DeleteModal
          memberName={deletingMember.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingMember(null)}
          isDeleting={isDeleting}
        />
      )}
    </motion.div>
  );
}
