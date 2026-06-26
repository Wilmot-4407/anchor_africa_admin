import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Users,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { AppDispatch, RootState } from "../redux/store";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../redux/actions/users";
import { clearError } from "../redux/slices/usersSlice";
import { AdminUser } from "../redux/types";
import toast from "../utils/toast";

// ── Animation variants ────────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

// ── Constants ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(user: AdminUser): string {
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

function getAvatarGradient(name: string): string {
  const gradients = [
    "from-teal-500 to-emerald-600",
    "from-indigo-500 to-purple-600",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-blue-600",
    "from-primary to-accent-blue",
  ];
  return gradients[(name.charCodeAt(0) ?? 0) % gradients.length];
}

// ── Shared input styles ────────────────────────────────────────────────────────

const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5";
const inputBase =
  "w-full px-3 py-2.5 text-sm rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-accent-blue/30 bg-[#0f1a2a] text-white placeholder:text-slate-500";

const inputCls = (hasError?: boolean) =>
  `${inputBase} ${
    hasError
      ? "border-red-500/40 bg-red-500/5"
      : "border-white/10 focus:border-accent-blue/50"
  }`;

const selectCls =
  "w-full px-3 py-2.5 text-sm rounded-xl border border-white/10 bg-[#0f1a2a] text-white outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue/50 transition-colors";

// ── Badges ────────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const cfg: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    admin:  { label: "Admin",  cls: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",  icon: <Shield size={9} /> },
    staff:  { label: "Staff",  cls: "bg-teal-500/10 text-teal-400 border-teal-500/20",        icon: <UserCog size={9} /> },
    editor: { label: "Editor", cls: "bg-violet-500/10 text-violet-400 border-violet-500/20",  icon: <Edit2 size={9} /> },
    user:   { label: "User",   cls: "bg-white/5 text-slate-400 border-white/10",              icon: <User size={9} /> },
  };
  const { label, cls, icon } = cfg[role] ?? cfg.user;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      {icon} {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle2 size={9} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
      <XCircle size={9} /> Inactive
    </span>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({
  user,
  onConfirm,
  onCancel,
  isLoading,
}: {
  user: AdminUser;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f1a2a]/80 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#1b2940] rounded-2xl border border-white/10 shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white text-center">Delete User</h3>
        <p className="text-sm text-slate-400 text-center mt-2 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            {user.firstName} {user.lastName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <RefreshCw size={13} className="animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── User Form Modal ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  dob: "",
  role: "user" as "user" | "admin" | "staff" | "editor",
  status: "active" as "active" | "inactive",
  phoneNumber: "",
  address: "",
};

type FormState = typeof EMPTY_FORM;

function UserFormModal({
  editingUser,
  onClose,
  onSubmit,
  isLoading,
}: {
  editingUser: AdminUser | null;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
  isLoading: boolean;
}) {
  const isEdit = !!editingUser;

  const [form, setForm] = useState<FormState>(() => {
    if (editingUser) {
      return {
        firstName:   editingUser.firstName   ?? "",
        lastName:    editingUser.lastName    ?? "",
        userName:    editingUser.userName    ?? "",
        email:       editingUser.email       ?? "",
        password:    "",
        dob:         editingUser.dob ? new Date(editingUser.dob).toISOString().split("T")[0] : "",
        role:        editingUser.role   ?? "user",
        status:      editingUser.status ?? "active",
        phoneNumber: editingUser.phoneNumber ?? "",
        address:     editingUser.address     ?? "",
      };
    }
    return { ...EMPTY_FORM };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const field = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateAll = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.userName.trim())  e.userName  = "Required";
    if (!form.email.trim())     e.email     = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!isEdit && !form.password.trim()) e.password = "Required";
    if (!isEdit && !form.dob)             e.dob      = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) onSubmit(form);
  };

  const sectionLabel = (text: string) => (
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 pb-1.5 border-b border-white/[0.06]">
      {text}
    </p>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f1a2a]/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative bg-[#1b2940] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <UserCog size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEdit ? "Edit User" : "Create New User"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 scrollbar-brand">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Info */}
            <div>
              {sectionLabel("Personal Info")}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Name <span className="text-red-400">*</span></label>
                    <input value={form.firstName} onChange={(e) => field("firstName", e.target.value)} placeholder="e.g. Adebayo" className={inputCls(!!errors.firstName)} />
                    {errors.firstName && <p className="text-[11px] text-red-400 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Last Name <span className="text-red-400">*</span></label>
                    <input value={form.lastName} onChange={(e) => field("lastName", e.target.value)} placeholder="e.g. Adeyemi" className={inputCls(!!errors.lastName)} />
                    {errors.lastName && <p className="text-[11px] text-red-400 mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Username <span className="text-red-400">*</span></label>
                    <input value={form.userName} onChange={(e) => field("userName", e.target.value)} placeholder="e.g. adeyemi_anchor" className={inputCls(!!errors.userName)} />
                    {errors.userName && <p className="text-[11px] text-red-400 mt-1">{errors.userName}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="email" value={form.email} onChange={(e) => field("email", e.target.value)} placeholder="user@anchor.org" className={`${inputCls(!!errors.email)} pl-8`} />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              {sectionLabel("Security")}
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    Password{" "}
                    {isEdit
                      ? <span className="font-normal text-slate-500">(leave blank to keep current)</span>
                      : <span className="text-red-400">*</span>
                    }
                  </label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => field("password", e.target.value)} placeholder={isEdit ? "Enter new password to change" : "Min. 8 characters"} className={`${inputCls(!!errors.password)} pr-10`} />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className={labelCls}>Date of Birth {!isEdit && <span className="text-red-400">*</span>}</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="date" value={form.dob} onChange={(e) => field("dob", e.target.value)} className={`${inputCls(!!errors.dob)} pl-8`} />
                  </div>
                  {errors.dob && <p className="text-[11px] text-red-400 mt-1">{errors.dob}</p>}
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div>
              {sectionLabel("Access Control")}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Role</label>
                  <select value={form.role} onChange={(e) => field("role", e.target.value as "user" | "admin" | "staff" | "editor")} className={selectCls}>
                    <option value="user">User (Default)</option>
                    <option value="editor">Editor</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={form.status} onChange={(e) => field("status", e.target.value as "active" | "inactive")} className={selectCls}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              {sectionLabel("Contact (Optional)")}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={form.phoneNumber} onChange={(e) => field("phoneNumber", e.target.value)} placeholder="+234 800 000 0000" className={`${inputCls()} pl-8`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <div className="relative">
                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={form.address} onChange={(e) => field("address", e.target.value)} placeholder="Lagos, Nigeria" className={`${inputCls()} pl-8`} />
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3 flex-shrink-0 bg-[#0f1a2a]/30">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] text-sm font-bold transition-colors disabled:opacity-60 shadow-lg shadow-accent-blue/20"
          >
            {isLoading && <RefreshCw size={13} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function UsersView() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error, totalCount } = useSelector(
    (state: RootState) => state.users,
  );
  const currentAuthUser = useSelector((state: RootState) => state.auth.user);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "staff" | "editor" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.userName?.toLowerCase().includes(q);
      const matchesRole   = roleFilter   === "all" || u.role   === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const adminCount  = users.filter((u) => u.role   === "admin").length;
  const activeCount = users.filter((u) => u.status === "active").length;

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  const openCreate = () => { setEditingUser(null); setShowForm(true); };
  const openEdit   = (u: AdminUser) => { setEditingUser(u); setShowForm(true); };

  const handleFormSubmit = async (data: FormState) => {
    setIsSaving(true);
    try {
      if (editingUser) {
        const payload: Record<string, unknown> = {
          firstName: data.firstName,  lastName:    data.lastName,
          userName:  data.userName,   email:       data.email,
          role:      data.role,       status:      data.status,
          phoneNumber: data.phoneNumber, address:  data.address,
        };
        if (data.dob)      payload.dob      = data.dob;
        if (data.password) payload.password = data.password;
        const userId = editingUser._id ?? editingUser.id;
        await dispatch(updateUser({ id: userId, data: payload })).unwrap();
        toast.success("User updated successfully");
      } else {
        await dispatch(createUser(data)).unwrap();
        toast.success("User created successfully");
      }
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      const userId = deletingUser._id ?? deletingUser.id;
      await dispatch(deleteUser(userId)).unwrap();
      toast.success("User deleted successfully");
      setDeletingUser(null);
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const filterPillCls = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors border ${
      active
        ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/[0.08] hover:text-white"
    }`;

  const inactiveCount = totalCount - activeCount;

  const statCards = [
    {
      label: "Total Users",
      value: totalCount,
      trend: `+${users.length}`,
      trendLabel: "registered users",
    },
    {
      label: "Admins",
      value: adminCount,
      trend: `+${adminCount}`,
      trendLabel: "admin accounts",
    },
    {
      label: "Active Users",
      value: activeCount,
      trend: `+${activeCount}`,
      trendLabel: "active accounts",
    },
    {
      label: "Inactive Users",
      value: inactiveCount,
      trend: `${inactiveCount}`,
      trendLabel: "inactive accounts",
    },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-6 lg:p-8 max-w-7xl mx-auto"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="mb-7 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Users size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage all admin and user accounts on the ANCHOR platform
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] text-sm font-bold rounded-xl transition-colors shadow-lg shadow-accent-blue/20"
        >
          <Plus size={15} />
          Add User
        </button>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="bg-[#1b2940] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex justify-between items-start mb-5">
              <p className="text-slate-400 text-sm font-medium leading-snug">{card.label}</p>
              <button className="text-slate-500 hover:text-white transition-colors p-0.5">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            {isLoading && users.length === 0 ? (
              <div className="space-y-3">
                <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-36 bg-white/5 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold text-white mb-3 tabular-nums">
                  {card.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {card.trend}
                  </span>
                  <span className="text-slate-500 text-sm">{card.trendLabel}</span>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-[#1b2940] rounded-2xl border border-white/10 px-4 py-3 mb-5 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or username…"
            className="w-full pl-8 pr-8 py-2 text-sm rounded-xl border border-white/10 bg-[#0f1a2a] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Role filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Role:</span>
          {(["all", "admin", "staff", "editor", "user"] as const).map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={filterPillCls(roleFilter === r)}>
              {r}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {(["all", "active", "inactive"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={filterPillCls(statusFilter === s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10 hidden sm:block" />

        {/* Refresh */}
        <button
          onClick={() => dispatch(fetchUsers())}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-colors ml-auto"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && users.length === 0 && (
        <div className="bg-[#1b2940] rounded-2xl border border-white/10 overflow-x-auto">
          <div className="grid grid-cols-[36px_200px_140px_1fr_90px_100px_160px] gap-3 px-5 py-3 border-b border-white/[0.06] min-w-[900px]">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[36px_200px_140px_1fr_90px_100px_160px] gap-3 px-5 py-4 border-b border-white/[0.04] animate-pulse min-w-[900px]"
            >
              <div className="h-3 bg-white/5 rounded" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2.5 bg-white/5 rounded w-1/2" />
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-3 bg-white/5 rounded" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && filtered.length === 0 && (
        <div className="bg-[#1b2940] rounded-2xl border border-white/10 text-center py-20">
          <UserCog size={36} className="mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-400">
            {search ? `No users match "${search}"` : "No users found"}
          </p>
          {!search && (
            <button
              onClick={openCreate}
              className="mt-4 text-sm text-accent-blue font-semibold hover:underline"
            >
              Create the first user →
            </button>
          )}
        </div>
      )}

      {/* ── Users Table ── */}
      {paginated.length > 0 && (
        <div className="bg-[#1b2940] rounded-2xl border border-white/10 overflow-x-auto">
          {/* Table head */}
          <div className="grid grid-cols-[36px_200px_140px_1fr_90px_100px_160px] gap-3 px-5 py-3 border-b border-white/10 min-w-[900px] text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-[#0f1a2a]/30">
            <span>#</span>
            <span>Name</span>
            <span>Username</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {paginated.map((u, idx) => {
              const userId       = u._id ?? u.id;
              const isCurrentUser = currentAuthUser?.id === userId;
              const gradient     = getAvatarGradient(u.firstName ?? "U");

              return (
                <div
                  key={userId}
                  className="grid grid-cols-[36px_200px_140px_1fr_90px_100px_160px] gap-3 items-center px-5 py-3.5 min-w-[900px] hover:bg-white/[0.03] transition-colors group"
                >
                  {/* # */}
                  <span className="text-xs font-medium text-slate-600">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </span>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 text-white font-bold text-xs overflow-hidden`}
                    >
                      {u.profilePicture && u.profilePicture !== "default.png" &&
                       (u.profilePicture.startsWith("http://") || u.profilePicture.startsWith("https://")) ? (
                        <img
                          src={u.profilePicture}
                          alt={u.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(u)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {u.firstName} {u.lastName}
                        {isCurrentUser && (
                          <span className="ml-1.5 text-[10px] font-normal text-slate-500">(you)</span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Joined {formatDate(u.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Username */}
                  <span className="text-xs text-slate-400 truncate font-mono">
                    @{u.userName}
                  </span>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail size={11} className="text-slate-600 flex-shrink-0" />
                    <span className="text-xs text-slate-400 truncate">{u.email}</span>
                  </div>

                  {/* Role */}
                  <RoleBadge role={u.role} />

                  {/* Status */}
                  <StatusBadge status={u.status} />

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-nowrap">
                    <button
                      onClick={() => openEdit(u)}
                      title="Edit user"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 rounded-lg transition-colors border border-accent-blue/20 flex-shrink-0"
                    >
                      <Edit2 size={11} /> Edit
                    </button>
                    {!isCurrentUser && (
                      <button
                        onClick={() => setDeletingUser(u)}
                        title="Delete user"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20 flex-shrink-0"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-[#0f1a2a]/20 rounded-b-2xl">
              <p className="text-xs text-slate-500">
                Page <span className="font-semibold text-slate-300">{page}</span> of{" "}
                <span className="font-semibold text-slate-300">{totalPages}</span>
                &nbsp;·&nbsp;{filtered.length} users
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p =
                    totalPages <= 5
                      ? i + 1
                      : page <= 3
                        ? i + 1
                        : page >= totalPages - 2
                          ? totalPages - 4 + i
                          : page - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[30px] h-[30px] rounded-lg text-xs font-semibold border transition-colors ${
                        p === page
                          ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                          : "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      <AnimatePresence>
        {showForm && (
          <UserFormModal
            editingUser={editingUser}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
            isLoading={isSaving}
          />
        )}
        {deletingUser && (
          <DeleteModal
            user={deletingUser}
            onConfirm={handleDelete}
            onCancel={() => setDeletingUser(null)}
            isLoading={isDeleting}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
