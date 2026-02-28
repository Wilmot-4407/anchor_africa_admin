import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
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
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "from-teal-500 to-emerald-600",
    "from-indigo-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-sky-500 to-blue-600",
    "from-primary to-accent",
  ];
  const i = name.charCodeAt(0) % colors.length;
  return colors[i];
}

// ── Animation Variants ────────────────────────────────────────────────────────

// ── Form initial state ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  dob: "",
  role: "user" as "user" | "admin",
  status: "active" as "active" | "inactive",
  phoneNumber: "",
  address: "",
};

type FormState = typeof EMPTY_FORM;

// ── Badges ────────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
      <Shield size={9} />
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
      <User size={9} />
      User
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 size={9} />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
      <XCircle size={9} />
      Inactive
    </span>
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center">
          Delete User
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">
            {user.firstName} {user.lastName}
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
        firstName: editingUser.firstName ?? "",
        lastName: editingUser.lastName ?? "",
        userName: editingUser.userName ?? "",
        email: editingUser.email ?? "",
        password: "",
        dob: editingUser.dob
          ? new Date(editingUser.dob).toISOString().split("T")[0]
          : "",
        role: editingUser.role ?? "user",
        status: editingUser.status ?? "active",
        phoneNumber: editingUser.phoneNumber ?? "",
        address: editingUser.address ?? "",
      };
    }
    return { ...EMPTY_FORM };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.userName.trim()) e.userName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!isEdit && !form.password.trim()) e.password = "Required";
    if (!isEdit && !form.dob) e.dob = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const field = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const inputCls = (key: keyof FormState) =>
    `w-full px-3 py-2.5 text-sm rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-primary/20 ${
      errors[key]
        ? "border-red-300 bg-red-50"
        : "border-slate-200 bg-white focus:border-primary"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEdit ? "Edit User" : "Create New User"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit
                ? "Update user account details"
                : "Fill in the details to create a new user account"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) => field("firstName", e.target.value)}
                  placeholder="e.g. Adebayo"
                  className={inputCls("firstName")}
                />
                {errors.firstName && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) => field("lastName", e.target.value)}
                  placeholder="e.g. Adeyemi"
                  className={inputCls("lastName")}
                />
                {errors.lastName && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Username + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.userName}
                  onChange={(e) => field("userName", e.target.value)}
                  placeholder="e.g. adeyemi_anchor"
                  className={inputCls("userName")}
                />
                {errors.userName && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.userName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => field("email", e.target.value)}
                    placeholder="user@anchor.org"
                    className={`${inputCls("email")} pl-8`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Password{" "}
                {isEdit ? (
                  <span className="font-normal text-slate-400">
                    (leave blank to keep current)
                  </span>
                ) : (
                  <span className="text-red-400">*</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => field("password", e.target.value)}
                  placeholder={
                    isEdit
                      ? "Enter new password to change"
                      : "Min. 8 characters"
                  }
                  className={`${inputCls("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Date of Birth{" "}
                {!isEdit && <span className="text-red-400">*</span>}
              </label>
              <div className="relative">
                <Calendar
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => field("dob", e.target.value)}
                  className={`${inputCls("dob")} pl-8`}
                />
              </div>
              {errors.dob && (
                <p className="text-[11px] text-red-500 mt-1">{errors.dob}</p>
              )}
            </div>

            {/* Role + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    field("role", e.target.value as "user" | "admin")
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    field("status", e.target.value as "active" | "inactive")
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Phone + Address */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={form.phoneNumber}
                    onChange={(e) => field("phoneNumber", e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full pl-8 px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <MapPin
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={form.address}
                    onChange={(e) => field("address", e.target.value)}
                    placeholder="Lagos, Nigeria"
                    className="w-full pl-8 px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center gap-2"
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

  // ── UI state ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ── Filtered + paginated ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.userName?.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const activeCount = users.filter((u) => u.status === "active").length;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditingUser(u);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: FormState) => {
    setIsSaving(true);
    try {
      if (editingUser) {
        const payload: {
          firstName: string;
          lastName: string;
          userName: string;
          email: string;
          role: "user" | "admin";
          status: "active" | "inactive";
          phoneNumber: string;
          address: string;
          dob?: string;
          password?: string;
        } = {
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
          email: data.email,
          role: data.role,
          status: data.status,
          phoneNumber: data.phoneNumber,
          address: data.address,
        };
        if (data.dob) payload.dob = data.dob;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-7xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserCog size={16} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              User Management
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Manage all admin and user accounts on the ANCHOR platform
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add User
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: totalCount, color: "text-slate-800" },
          { label: "Admins", value: adminCount, color: "text-indigo-700" },
          { label: "Active", value: activeCount, color: "text-emerald-700" },
          {
            label: "Inactive",
            value: totalCount - activeCount,
            color: "text-red-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-7 w-12 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 mb-5 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or username…"
            className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">Role:</span>
          {(["all", "admin", "user"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                roleFilter === r
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          {(["all", "active", "inactive"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                statusFilter === s
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={() => dispatch(fetchUsers())}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors ml-auto"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && users.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <div className="grid grid-cols-[36px_180px_130px_1fr_80px_90px_160px] gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50 min-w-[860px]">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[36px_180px_130px_1fr_80px_90px_160px] gap-3 px-5 py-4 border-b border-slate-100 animate-pulse min-w-[860px]"
            >
              <div className="h-3 bg-slate-100 rounded" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-3 bg-slate-100 rounded" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-20 text-slate-400">
          <UserCog size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-slate-500">
            {search ? `No users match "${search}"` : "No users found"}
          </p>
          {!search && (
            <button
              onClick={openCreate}
              className="mt-4 text-sm text-primary font-semibold hover:underline"
            >
              Create the first user →
            </button>
          )}
        </div>
      )}

      {/* ── Users Table ── */}
      {paginated.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          {/* Table head */}
          <div className="grid grid-cols-[36px_180px_130px_1fr_80px_90px_160px] gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50 min-w-[860px] text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>#</span>
            <span>Name</span>
            <span>Username</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="divide-y divide-slate-100">
            {paginated.map((u, idx) => {
              const userId = u._id ?? u.id;
              const isCurrentUser = currentAuthUser?.id === userId;
              const avatarColor = getAvatarColor(u.firstName ?? "U");

              return (
                <div
                  key={userId}
                  className="grid grid-cols-[36px_180px_130px_1fr_80px_90px_160px] gap-3 items-center px-5 py-3.5 min-w-[860px] hover:bg-slate-50/70 transition-colors group"
                >
                  {/* # */}
                  <span className="text-xs font-medium text-slate-400">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </span>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center flex-shrink-0 text-white font-bold text-xs`}
                    >
                      {u.profilePicture &&
                      u.profilePicture !== "default.png" ? (
                        <img
                          src={u.profilePicture}
                          alt={u.firstName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        getInitials(u)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {u.firstName} {u.lastName}
                        {isCurrentUser && (
                          <span className="ml-1 text-[10px] font-normal text-slate-400">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        Joined {formatDate(u.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Username */}
                  <span className="text-sm text-slate-500 truncate font-mono">
                    @{u.userName}
                  </span>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail size={11} className="text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-500 truncate">
                      {u.email}
                    </span>
                  </div>

                  {/* Role */}
                  <RoleBadge role={u.role} />

                  {/* Status */}
                  <StatusBadge status={u.status} />

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-nowrap">
                    <button
                      onClick={() => openEdit(u)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 rounded-lg transition-colors border border-primary/15 flex-shrink-0"
                      title="Edit user"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    {!isCurrentUser && (
                      <button
                        onClick={() => setDeletingUser(u)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex-shrink-0"
                        title="Delete user"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
              <p className="text-xs text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-700">{page}</span> of{" "}
                <span className="font-semibold text-slate-700">
                  {totalPages}
                </span>
                &nbsp;·&nbsp;{filtered.length} users
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} />
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
                          ? "bg-primary text-white border-primary"
                          : "border-slate-200 text-slate-600 hover:bg-white hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      <>
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
      </>
    </motion.div>
  );
}
