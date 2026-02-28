import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, UploadCloud, Plus, Trash2 } from "lucide-react";
import { createTeamMember, updateTeamMember } from "../../redux/actions/team";
import { AppDispatch, RootState } from "../../redux/store";
import { TeamMember } from "../../redux/types";
import { BrandSpinner } from "../common/SkeletonLoader";
// import toast from "../../utils/toast";

interface TeamFormProps {
  member?: TeamMember | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputCls =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-colors bg-white disabled:bg-slate-50 disabled:cursor-not-allowed";

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pt-1">
      {children}
    </h3>
  );
}

interface ScheduleSlot {
  day: string;
  hours: string;
}

const DEFAULT_SCHEDULE: ScheduleSlot[] = [
  { day: "Monday – Friday", hours: "09:30 – 17:30" },
  { day: "Saturday", hours: "09:30 – 13:00" },
  { day: "Sunday", hours: "Closed" },
];

export function TeamForm({ member, onClose, onSuccess }: TeamFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.team);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: member?.name || "",
    slug: member?.slug || "",
    title: member?.title || "",
    specialty: member?.specialty || "",
    tagline: member?.tagline || "",
    bio: member?.bio || "",
    education: member?.education?.join(", ") || "",
    specialties: member?.specialties?.join(", ") || "",
    experience: member?.experience || "",
    languages: member?.languages?.join(", ") || "",
    awards: member?.awards?.join(", ") || "",
    order: String(member?.order ?? 0),
    isActive: member?.isActive !== false,
    phone: member?.contact?.phone || "",
    email: member?.contact?.email || "",
    address: member?.contact?.address || "",
    linkedin: member?.social?.linkedin || "",
    instagram: member?.social?.instagram || "",
    twitter: member?.social?.twitter || "",
    facebook: member?.social?.facebook || "",
    youtube: member?.social?.youtube || "",
  });

  const [schedule, setSchedule] = useState<ScheduleSlot[]>(() => {
    const raw = member?.schedule;
    if (!raw) return DEFAULT_SCHEDULE;
    if (Array.isArray(raw))
      return raw.length > 0 ? (raw as ScheduleSlot[]) : DEFAULT_SCHEDULE;
    const slots = Object.entries(raw as Record<string, string>).map(
      ([day, hours]) => ({ day, hours }),
    );
    return slots.length > 0 ? slots : DEFAULT_SCHEDULE;
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    member?.image && member.image !== "default.png" ? member.image : "",
  );
  const [formError, setFormError] = useState("");

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // Auto-generate slug from name when creating (not editing) and slug hasn't been manually set
      if (name === "name" && !member) {
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

  const addScheduleRow = () =>
    setSchedule((prev) => [...prev, { day: "", hours: "" }]);

  const removeScheduleRow = (idx: number) =>
    setSchedule((prev) => prev.filter((_, i) => i !== idx));

  const updateScheduleRow = (
    idx: number,
    field: keyof ScheduleSlot,
    value: string,
  ) =>
    setSchedule((prev) =>
      prev.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!formData.specialty.trim()) {
      setFormError("Specialty is required");
      return;
    }
    if (!formData.bio.trim()) {
      setFormError("Bio is required");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append(
        "slug",
        formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      );
      fd.append("title", formData.title);
      fd.append("specialty", formData.specialty);
      fd.append("tagline", formData.tagline);
      fd.append("bio", formData.bio);
      fd.append("experience", formData.experience);
      fd.append("order", formData.order);
      fd.append("isActive", String(formData.isActive));

      fd.append(
        "education",
        formData.education
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean)
          .join(","),
      );
      fd.append(
        "specialties",
        formData.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .join(","),
      );
      fd.append(
        "languages",
        formData.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean)
          .join(","),
      );
      fd.append(
        "awards",
        formData.awards
          .split(",")
          .map((a: string) => a.trim())
          .filter(Boolean)
          .join(","),
      );

      fd.append(
        "schedule",
        JSON.stringify(schedule.filter((s) => s.day.trim() && s.hours.trim())),
      );
      fd.append(
        "contact",
        JSON.stringify({
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
        }),
      );
      fd.append(
        "social",
        JSON.stringify({
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          twitter: formData.twitter,
          facebook: formData.facebook,
          youtube: formData.youtube,
        }),
      );

      if (imageFile) fd.append("image", imageFile);

      if (member?._id) {
        await dispatch(updateTeamMember({ id: member._id, data: fd })).unwrap();
        // toast.success("Team member updated successfully!");
      } else {
        await dispatch(createTeamMember(fd)).unwrap();
        // toast.success("Team member added successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      // const msg =
      //   typeof err === "string"
      //     ? err
      //     : err instanceof Error
      //       ? err.message
      //       : "Failed to save";
      // setFormError(msg);
      // toast.error(msg);
      console.log("Team member creation failed", err);
    }
  };

  const isEditing = !!member;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col border border-slate-200/60">
        {/* Top accent strip */}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditing ? "Edit Team Member" : "Add Team Member"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? `Editing "${member.name}"`
                : "Fill in all required fields"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="team-member-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
        >
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{formError}</p>
            </div>
          )}

          {/* ── Basic Information ── */}
          <section>
            <SectionHeading>Basic Information</SectionHeading>
            <div className="space-y-4">
              {/* Image upload — preview inside the zone */}
              <div>
                <Label>Profile Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="team-image-input"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <label
                  htmlFor="team-image-input"
                  className="block w-full cursor-pointer"
                >
                  <div className="relative w-full h-44 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <UploadCloud className="w-6 h-6 text-white mb-1" />
                          <span className="text-white text-xs font-semibold">
                            Click to change image
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                        <UploadCloud className="w-7 h-7" />
                        <span className="text-sm">
                          Click to upload profile image
                        </span>
                        <span className="text-xs text-slate-300">
                          JPG, PNG, WEBP up to 10MB
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Name */}
              <div>
                <Label required>Full Name</Label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="Dr. Jane Smith"
                />
              </div>

              {/* Title + Specialty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>Title</Label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="Clinical Psychologist"
                  />
                </div>
                <div>
                  <Label required>Specialty</Label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="e.g. Addiction Counselling"
                  />
                </div>
              </div>

              {/* Slug + Tagline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`${inputCls} font-mono text-xs`}
                    placeholder="auto-generated"
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="One-line description"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label required>Bio</Label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder="Full biography..."
                />
                {formData.bio.length > 0 && (
                  <p className="mt-1 text-xs text-slate-400 text-right">
                    {formData.bio.length} characters
                  </p>
                )}
              </div>

              {/* isActive toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-4 h-4 accent-primary"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Active (visible on site)
                </label>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* ── Professional Info ── */}
          <section>
            <SectionHeading>Professional Information</SectionHeading>
            <div className="space-y-4">
              <div>
                <Label>Education (comma-separated)</Label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="PhD Psychology, MSc Counselling"
                />
              </div>
              <div>
                <Label>
                  Areas of Expertise / Specialties (comma-separated)
                </Label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="CBT, DBT, Trauma-Focused Therapy"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Experience</Label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="12 years in mental health"
                  />
                </div>
                <div>
                  <Label>Languages (comma-separated)</Label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="English, French"
                  />
                </div>
              </div>
              <div>
                <Label>Awards / Recognitions (comma-separated)</Label>
                <input
                  type="text"
                  name="awards"
                  value={formData.awards}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="2022 Excellence Award, APA Member"
                />
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* ── Schedule ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeading>Time Schedule</SectionHeading>
              <button
                type="button"
                onClick={addScheduleRow}
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:text-primary/70 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {schedule.map((slot, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={slot.day}
                    onChange={(e) =>
                      updateScheduleRow(idx, "day", e.target.value)
                    }
                    className={`${inputCls} flex-1`}
                    placeholder="Monday – Friday"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={slot.hours}
                    onChange={(e) =>
                      updateScheduleRow(idx, "hours", e.target.value)
                    }
                    className={`${inputCls} flex-1`}
                    placeholder="09:30 – 17:30"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => removeScheduleRow(idx)}
                    className="p-2 text-red-400 hover:text-red-600 transition flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* ── Contact Info ── */}
          <section>
            <SectionHeading>Contact Information</SectionHeading>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={inputCls}
                    placeholder="doctor@clinic.com"
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="123 Clinic Street, City"
                />
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* ── Social Media ── */}
          <section>
            <SectionHeading>Social Media</SectionHeading>
            <div className="space-y-3">
              {[
                {
                  name: "linkedin",
                  placeholder: "https://linkedin.com/in/...",
                },
                { name: "instagram", placeholder: "https://instagram.com/..." },
                { name: "twitter", placeholder: "https://x.com/..." },
                { name: "facebook", placeholder: "https://facebook.com/..." },
                { name: "youtube", placeholder: "https://youtube.com/..." },
              ].map(({ name, placeholder }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-slate-500 capitalize font-semibold flex-shrink-0">
                    {name}
                  </span>
                  <input
                    type="url"
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`${inputCls} flex-1`}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-white transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="team-member-form"
            disabled={isLoading}
            className="ml-auto flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition disabled:opacity-50 shadow-sm"
          >
            {isLoading && <BrandSpinner size="sm" />}
            {isLoading ? "Saving…" : isEditing ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
