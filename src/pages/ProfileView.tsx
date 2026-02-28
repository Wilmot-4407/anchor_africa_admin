/**
 * ProfileView.tsx
 * Replaces SettingsView — shows the logged-in admin's profile with
 * editable info, a change-password form, and a (disabled) reset section.
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  CheckIcon,
  UserCog,
  Clock,
  Pencil,
  X,
} from "lucide-react";
import { AppDispatch, RootState } from "../redux/store";
import { updatePassword, getMe } from "../redux/actions/auth";
import { updateUser } from "../redux/actions/users";
import toast from "../utils/toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 bg-white text-slate-800 placeholder:text-slate-400 transition-colors ${
    hasError ? "border-red-300 bg-red-50" : "border-slate-200"
  }`;

const readOnlyCls =
  "w-full px-3.5 py-2.5 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-600 cursor-default select-none";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-primary">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-800 truncate">
          {value || <span className="text-slate-400 font-normal">Not set</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  subtitle,
  icon,
  children,
  disabled,
  disabledNote,
  headerAction,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  disabledNote?: string;
  headerAction?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${disabled ? "opacity-60" : ""}`}
    >
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
          <span className="text-primary">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {disabled && disabledNote && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-400 border border-slate-200 flex-shrink-0">
            <Clock size={10} /> {disabledNote}
          </span>
        )}
        {headerAction}
      </div>
      {children !== null && (
        <div
          className={`px-6 py-5 ${disabled ? "pointer-events-none select-none" : ""}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfileView() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  // ── Profile edit state ────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    dob: "",
  });
  const [profileErrors, setProfileErrors] = useState<
    Partial<typeof profileForm>
  >({});

  // Sync form whenever user loads or edit mode opens
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        address: user.address ?? "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      });
    }
  }, [user, isEditing]);

  const profileField = (key: keyof typeof profileForm, value: string) => {
    setProfileForm((f) => ({ ...f, [key]: value }));
    if (profileErrors[key])
      setProfileErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateProfile = (): boolean => {
    const e: Partial<typeof profileForm> = {};
    if (!profileForm.firstName.trim()) e.firstName = "Required";
    if (!profileForm.lastName.trim()) e.lastName = "Required";
    setProfileErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    const userId = (user as { _id?: string } & typeof user)?._id ?? user?.id;
    if (!userId) return;
    setProfileSaving(true);
    try {
      await dispatch(
        updateUser({
          id: userId,
          data: {
            firstName: profileForm.firstName.trim(),
            lastName: profileForm.lastName.trim(),
            phoneNumber: profileForm.phoneNumber.trim() || undefined,
            address: profileForm.address.trim() || undefined,
            dob: profileForm.dob || undefined,
          },
        }),
      ).unwrap();
      // Refresh the auth user so header/sidebar update too
      await dispatch(getMe());
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileErrors({});
  };

  // ── Change password state ─────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwErrors, setPwErrors] = useState<Partial<typeof pwForm>>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const pwField = (key: keyof typeof pwForm, value: string) => {
    setPwForm((f) => ({ ...f, [key]: value }));
    if (pwErrors[key]) setPwErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validatePw = (): boolean => {
    const e: Partial<typeof pwForm> = {};
    if (!pwForm.currentPassword.trim()) e.currentPassword = "Required";
    if (!pwForm.newPassword.trim()) e.newPassword = "Required";
    else if (pwForm.newPassword.length < 8)
      e.newPassword = "Must be at least 8 characters";
    if (!pwForm.confirmPassword.trim()) e.confirmPassword = "Required";
    else if (pwForm.confirmPassword !== pwForm.newPassword)
      e.confirmPassword = "Passwords do not match";
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePw()) return;
    setPwSaving(true);
    try {
      await dispatch(
        updatePassword({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      ).unwrap();
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwErrors({});
    } catch {
      // toast already fired inside the thunk
    } finally {
      setPwSaving(false);
    }
  };

  // ── Avatar ────────────────────────────────────────────────────────────────
  const hasAvatar =
    user?.profilePicture && user.profilePicture !== "default.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-5xl mx-auto"
    >
      {/* ── Page header ── */}
      <div className="mb-7 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <UserCog size={16} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View and manage your account details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* ── LEFT: Identity card ───────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Avatar + name */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div
              className="h-20 w-full"
              style={{
                background: "linear-gradient(135deg, #058789 0%, #5fc4eb 100%)",
              }}
            />
            <div className="px-6 pb-6 -mt-10">
              <div className="mb-4">
                {hasAvatar ? (
                  <img
                    src={user?.profilePicture}
                    alt={user?.firstName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #058789, #5fc4eb)",
                    }}
                  >
                    {getInitials(user?.firstName, user?.lastName)}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-800 leading-tight">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">@{user?.userName}</p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    user?.role === "admin"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  <Shield size={9} />
                  {user?.role === "admin" ? "Admin" : "User"}
                </span>

                {user?.status === "active" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={9} /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                    <XCircle size={9} /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick info rows */}
          <div className="bg-white rounded-xl border border-slate-200 px-5 py-2">
            <InfoRow
              icon={<Mail size={14} />}
              label="Email"
              value={user?.email}
            />
            <InfoRow
              icon={<Phone size={14} />}
              label="Phone"
              value={user?.phoneNumber}
            />
            <InfoRow
              icon={<MapPin size={14} />}
              label="Address"
              value={user?.address}
            />
            <InfoRow
              icon={<Calendar size={14} />}
              label="Date of Birth"
              value={user?.dob ? formatDate(user.dob) : null}
            />
            <InfoRow
              icon={<Clock size={14} />}
              label="Member Since"
              value={formatDate(user?.createdAt)}
            />
          </div>
        </div>

        {/* ── RIGHT: Action panels ──────────────────────────────────────── */}
        <div className="space-y-5">
          {/* ── Profile Information ── */}
          <SectionCard
            title="Profile Information"
            subtitle={
              isEditing
                ? "Edit your personal details below"
                : "Click 'Edit Profile' to update your personal details"
            }
            icon={<User size={15} />}
            headerAction={
              !isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 rounded-lg border border-primary/15 transition-colors flex-shrink-0"
                >
                  <Pencil size={12} /> Edit Profile
                </button>
              ) : undefined
            }
          >
            {isEditing ? (
              /* ── EDIT MODE ── */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First name */}
                  <div>
                    <Label required>First Name</Label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        profileField("firstName", e.target.value)
                      }
                      placeholder="e.g. John"
                      className={inputCls(!!profileErrors.firstName)}
                    />
                    {profileErrors.firstName && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {profileErrors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last name */}
                  <div>
                    <Label required>Last Name</Label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => profileField("lastName", e.target.value)}
                      placeholder="e.g. Doe"
                      className={inputCls(!!profileErrors.lastName)}
                    />
                    {profileErrors.lastName && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {profileErrors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Username — read-only */}
                  <div>
                    <Label>Username</Label>
                    <div className={readOnlyCls}>@{user?.userName || "—"}</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cannot be changed by user
                    </p>
                  </div>

                  {/* Email — read-only */}
                  <div>
                    <Label>Email Address</Label>
                    <div className={readOnlyCls}>{user?.email || "—"}</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Cannot be changed by user
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label>Phone Number</Label>
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) =>
                        profileField("phoneNumber", e.target.value)
                      }
                      placeholder="+234 800 000 0000"
                      className={inputCls()}
                    />
                  </div>

                  {/* Date of birth */}
                  <div>
                    <Label>Date of Birth</Label>
                    <input
                      type="date"
                      value={profileForm.dob}
                      onChange={(e) => profileField("dob", e.target.value)}
                      className={inputCls()}
                    />
                  </div>

                  {/* Address — full width */}
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => profileField("address", e.target.value)}
                      placeholder="e.g. Lagos, Nigeria"
                      className={inputCls()}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={profileSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={profileSaving || isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #058789, #5fc4eb)",
                    }}
                  >
                    {profileSaving ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <CheckIcon size={13} />
                    )}
                    {profileSaving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : null}
          </SectionCard>

          {/* ── Change Password ── */}
          <SectionCard
            title="Change Password"
            subtitle="Update your account password"
            icon={<Lock size={15} />}
          >
            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={pwForm.currentPassword}
                    onChange={(e) => pwField("currentPassword", e.target.value)}
                    placeholder="Enter your current password"
                    className={`${inputCls(!!pwErrors.currentPassword)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {pwErrors.currentPassword && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {pwErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>New Password</Label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={pwForm.newPassword}
                      onChange={(e) => pwField("newPassword", e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`${inputCls(!!pwErrors.newPassword)} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {pwErrors.newPassword && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {pwErrors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Confirm New Password</Label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={pwForm.confirmPassword}
                      onChange={(e) =>
                        pwField("confirmPassword", e.target.value)
                      }
                      placeholder="Repeat new password"
                      className={`${inputCls(!!pwErrors.confirmPassword)} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {pwErrors.confirmPassword && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {pwErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Strength bar */}
              {pwForm.newPassword && (
                <div className="flex items-center gap-2">
                  {[8, 12, 16].map((len) => (
                    <div
                      key={len}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        pwForm.newPassword.length >= len
                          ? len === 8
                            ? "bg-red-400"
                            : len === 12
                              ? "bg-yellow-400"
                              : "bg-emerald-500"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-slate-400 ml-1 w-12 text-right">
                    {pwForm.newPassword.length < 8
                      ? "Weak"
                      : pwForm.newPassword.length < 12
                        ? "Fair"
                        : pwForm.newPassword.length < 16
                          ? "Good"
                          : "Strong"}
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={pwSaving || isLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #058789, #5fc4eb)",
                  }}
                >
                  {pwSaving ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <CheckIcon size={14} />
                  )}
                  {pwSaving ? "Saving…" : "Update Password"}
                </button>
              </div>
            </div>
          </SectionCard>

          {/* ── Reset Password via Email (disabled) ── */}
          <SectionCard
            title="Reset Password via Email"
            subtitle="Send a password reset link to your registered email address"
            icon={<KeyRound size={15} />}
            disabled
            disabledNote="Coming Soon"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    Reset link destination
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {user?.email || "your registered email"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                A secure reset link will be sent to your registered email. The
                link expires after 10 minutes.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl cursor-not-allowed opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #058789, #5fc4eb)",
                  }}
                >
                  <Mail size={14} /> Send Reset Link
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </motion.div>
  );
}
