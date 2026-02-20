import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import { createTeamMember, updateTeamMember } from "../../redux/actions/team";
import { AppDispatch, RootState } from "../../redux/store";
import { TeamMember } from "../../redux/types";

interface TeamFormProps {
  member?: TeamMember | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TeamForm({ member, onClose, onSuccess }: TeamFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.team);

  const [formData, setFormData] = useState({
    name: member?.name || "",
    slug: member?.slug || "",
    title: member?.title || "",
    specialty: member?.specialty || "",
    image: member?.image || "",
    bio: member?.bio || "",
    education: member?.education?.join(", ") || "",
    specialties: member?.specialties?.join(", ") || "",
    experience: member?.experience || "",
    languages: member?.languages?.join(", ") || "",
    phone: member?.contact?.phone || "",
    email: member?.contact?.email || "",
    address: member?.contact?.address || "",
    linkedin: member?.social?.linkedin || "",
    instagram: member?.social?.instagram || "",
    twitter: member?.social?.twitter || "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.title.trim()) {
      setFormError("Name and title are required");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        title: formData.title,
        specialty: formData.specialty,
        image: formData.image,
        bio: formData.bio,
        education: formData.education
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
        specialties: formData.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: formData.experience,
        languages: formData.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        contact: {
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
        },
        social: {
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          twitter: formData.twitter,
        },
      };

      if (member?._id) {
        await dispatch(
          updateTeamMember({ id: member._id, data: payload }),
        ).unwrap();
      } else {
        await dispatch(createTeamMember(payload)).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Failed to save team member";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-heading">
            {member ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(formError || error) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{formError || error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-heading mb-4">
              Basic Information
            </h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="Enter full name"
                />
              </div>

              {/* Title & Specialty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                    placeholder="e.g., Doctor, Therapist"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Specialty
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                    placeholder="e.g., Cardiology"
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="auto-generated from name"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="Short biography"
                />
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 className="text-lg font-semibold text-heading mb-4">
              Professional Information
            </h3>
            <div className="space-y-4">
              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Education (comma-separated)
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="MD, Degree from University"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Specialties (comma-separated)
                </label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="Specialty 1, Specialty 2"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="e.g., 10 years in healthcare"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="English, French, Spanish"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-heading mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-heading mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                  placeholder="Street address"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-heading mb-4">
              Social Media
            </h3>
            <div className="space-y-4">
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                placeholder="LinkedIn URL"
              />
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                placeholder="Instagram URL"
              />
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-50"
                placeholder="Twitter/X URL"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-heading hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : member ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
