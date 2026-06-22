import React, { useState, useEffect } from "react";
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

function isRealAvatar(url?: string | null) {
  return (
    !!url &&
    url !== "default.png" &&
    (url.startsWith("http://") || url.startsWith("https://"))
  );
}

// ─── Shared field styles ───────────────────────────────────────────────────────

const inputCls = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue/60 bg-[#0f1a2a] text-white placeholder:text-slate-500 transition-colors ${
    hasError ? "border-red-400/40 bg-red-500/5" : "border-white/10"
  }`;

const readOnlyCls =
  "w-full px-3.5 py-2.5 text-sm border border-white/[0.07] rounded-xl bg-[#0f1a2a]/60 text-slate-500 cursor-default select-none";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

// ─── Info row (read-only display) ─────────────────────────────────────────────

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
    <div className="flex items-start gap-3 py-3 border-b border-white/[0.05] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-primary">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-white truncate">
          {value || (
            <span className="text-slate-600 font-normal italic">Not set</span>
          )}
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
  children?: React.ReactNode;
  disabled?: boolean;
  disabledNote?: string;
  headerAction?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-[#1b2940] rounded-2xl border border-white/10 overflow-hidden ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {disabled && disabledNote && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-slate-400 border border-white/10 flex-shrink-0">
            <Clock size={10} /> {disabledNote}
          </span>
        )}
        {headerAction}
      </div>
      {children && (
        <div
          className={`px-6 py-5 ${
            disabled ? "pointer-events-none select-none" : ""
          }`}
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
  const isAdmin = user?.role === "admin";

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
      toast.success("Password updated successfully");
    } catch {
      // toast fires inside the thunk
    } finally {
      setPwSaving(false);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const hasAvatar = isRealAvatar(user?.profilePicture);

  const pwStrength =
    pwForm.newPassword.length === 0
      ? 0
      : pwForm.newPassword.length < 8
        ? 1
        : pwForm.newPassword.length < 12
          ? 2
          : pwForm.newPassword.length < 16
            ? 3
            : 4;

  const pwStrengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const pwStrengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-yellow-300",
    "bg-emerald-500",
  ][pwStrength];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 max-w-5xl mx-auto"
    >
      {/* ── Page header ── */}
      <div className="mb-7 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <UserCog size={18} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            View and manage your account details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6">

        {/* ── LEFT: Identity card ───────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Avatar card */}
          <div className="bg-[#1b2940] rounded-2xl border border-white/10 overflow-hidden">
            {/* Gradient banner */}
            <div
              className="h-24 w-full"
              style={{ background: "linear-gradient(135deg, #058789 0%, #5fc4eb 100%)" }}
            />

            {/* Avatar + identity */}
            <div className="px-6 pb-6 -mt-12">
              <div className="mb-4">
                {hasAvatar ? (
                  <img
                    src={user?.profilePicture}
                    alt={user?.firstName}
                    className="w-20 h-20 rounded-full object-cover border-[3px] border-[#1b2940] shadow-xl ring-2 ring-white/10"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-[3px] border-[#1b2940] shadow-xl ring-2 ring-white/10"
                    style={{ background: "linear-gradient(135deg, #058789, #5fc4eb)" }}
                  >
                    {getInitials(user?.firstName, user?.lastName)}
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">@{user?.userName}</p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    isAdmin
                      ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                      : "bg-white/5 text-slate-400 border-white/10"
                  }`}
                >
                  <Shield size={9} />
                  {isAdmin ? "Admin" : "User"}
                </span>

                {user?.status === "active" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={9} /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    <XCircle size={9} /> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick info rows */}
          <div className="bg-[#1b2940] rounded-2xl border border-white/10 px-5 py-2">
            <InfoRow icon={<Mail size={14} />} label="Email"         value={user?.email} />
            <InfoRow icon={<Phone size={14} />} label="Phone"        value={user?.phoneNumber} />
            <InfoRow icon={<MapPin size={14} />} label="Address"     value={user?.address} />
            <InfoRow icon={<Calendar size={14} />} label="Date of Birth"
              value={user?.dob ? formatDate(user.dob) : null} />
            <InfoRow icon={<Clock size={14} />} label="Member Since" value={formatDate(user?.createdAt)} />
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
                : isAdmin
                  ? "Click 'Edit Profile' to update your details"
                  : "Contact an administrator to update your profile"
            }
            icon={<User size={15} />}
            headerAction={
              isAdmin && !isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 rounded-lg border border-accent-blue/20 transition-colors flex-shrink-0"
                >
                  <Pencil size={12} /> Edit Profile
                </button>
              ) : undefined
            }
          >
            {isEditing && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First name */}
                  <div>
                    <Label required>First Name</Label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => profileField("firstName", e.target.value)}
                      placeholder="e.g. John"
                      className={inputCls(!!profileErrors.firstName)}
                    />
                    {profileErrors.firstName && (
                      <p className="text-[11px] text-red-400 mt-1">{profileErrors.firstName}</p>
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
                      <p className="text-[11px] text-red-400 mt-1">{profileErrors.lastName}</p>
                    )}
                  </div>

                  {/* Username — read-only */}
                  <div>
                    <Label>Username</Label>
                    <div className={readOnlyCls}>@{user?.userName || "—"}</div>
                    <p className="text-[11px] text-slate-600 mt-1">Cannot be changed</p>
                  </div>

                  {/* Email — read-only */}
                  <div>
                    <Label>Email Address</Label>
                    <div className={readOnlyCls}>{user?.email || "—"}</div>
                    <p className="text-[11px] text-slate-600 mt-1">Cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label>Phone Number</Label>
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) => profileField("phoneNumber", e.target.value)}
                      placeholder="+27 XX XXX XXXX"
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
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={profileSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-xl border border-white/10 transition-colors disabled:opacity-50"
                  >
                    <X size={13} /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={profileSaving || isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-[#0f1a2a] bg-accent-blue hover:bg-[#4ab0d6] rounded-xl transition-all shadow-lg shadow-accent-blue/20 disabled:opacity-60 disabled:cursor-not-allowed"
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
            )}
          </SectionCard>

          {/* ── Change Password ── */}
          <SectionCard
            title="Change Password"
            subtitle="Update your account password"
            icon={<Lock size={15} />}
          >
            <div className="space-y-4">
              {/* Current password */}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {pwErrors.currentPassword && (
                  <p className="text-[11px] text-red-400 mt-1">{pwErrors.currentPassword}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New password */}
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {pwErrors.newPassword && (
                    <p className="text-[11px] text-red-400 mt-1">{pwErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <Label>Confirm New Password</Label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={pwForm.confirmPassword}
                      onChange={(e) => pwField("confirmPassword", e.target.value)}
                      placeholder="Repeat new password"
                      className={`${inputCls(!!pwErrors.confirmPassword)} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {pwErrors.confirmPassword && (
                    <p className="text-[11px] text-red-400 mt-1">{pwErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Strength indicator */}
              {pwForm.newPassword && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        pwStrength >= step ? pwStrengthColor : "bg-white/10"
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-slate-500 ml-1 w-14 text-right shrink-0">
                    {pwStrengthLabel}
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={pwSaving || isLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#0f1a2a] bg-accent-blue hover:bg-[#4ab0d6] rounded-xl transition-all shadow-lg shadow-accent-blue/20 disabled:opacity-60 disabled:cursor-not-allowed"
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

          {/* ── Reset via Email (coming soon) ── */}
          <SectionCard
            title="Reset Password via Email"
            subtitle="Send a password reset link to your registered email address"
            icon={<KeyRound size={15} />}
            disabled
            disabledNote="Coming Soon"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">
                    Reset link destination
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {user?.email || "your registered email"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                A secure reset link will be sent to your registered email. The
                link expires after 10 minutes.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#0f1a2a] bg-accent-blue rounded-xl cursor-not-allowed opacity-40"
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
