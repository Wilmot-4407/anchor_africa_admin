import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Search, GripVertical } from "lucide-react";
import { fetchTeamMembers, deleteTeamMember } from "../redux/actions/team";
import { AppDispatch, RootState } from "../redux/store";
import { CardSkeletonLoader } from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { TeamForm } from "../components/forms/TeamForm";
import { TeamMember } from "../redux/types";

// Generate initials + a consistent color from a name
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-slate-800",
  "bg-indigo-700",
  "bg-emerald-700",
  "bg-rose-700",
  "bg-violet-700",
  "bg-amber-700",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// Derive category filter options from members
function getCategories(members: TeamMember[]): string[] {
  const cats = new Set<string>();
  members.forEach((m) => {
    // Support both `category` and `specialty` as category source
    const cat = (m as any).category || m.specialty || "";
    if (cat) cats.add(cat);
  });
  return Array.from(cats);
}

export function TeamEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { members, isLoading, error } = useSelector(
    (state: RootState) => state.team,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const categories = ["All", ...getCategories(members)];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase());
    const memberCategory = (member as any).category || member.specialty || "";
    const matchesCategory =
      activeCategory === "All" || memberCategory === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      await dispatch(deleteTeamMember(id));
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

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMember(null);
    dispatch(fetchTeamMembers());
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
          <h1 className="text-2xl font-bold text-heading">Team</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {members.length} team member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
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
      </div>

      {/* Content */}
      {isLoading ? (
        <CardSkeletonLoader count={3} />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchTeamMembers())}
        />
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          title="No team members found"
          description={
            searchTerm || activeCategory !== "All"
              ? "Try adjusting your search or filter"
              : "Add your first team member to get started"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const initials = member.image ? null : getInitials(member.name);
            const color = avatarColor(member.name);
            const memberCategory =
              (member as any).category || member.specialty || "";

            return (
              <motion.div
                key={member._id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-5 group"
              >
                <div className="flex items-start gap-4">
                  {/* Drag handle */}
                  <GripVertical className="w-4 h-4 text-slate-300 mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />

                  {/* Avatar */}
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${color}`}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-heading text-sm leading-tight">
                      {member.name}
                    </p>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">
                      {member.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {member.specialty}
                    </p>
                    {memberCategory && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200">
                        {memberCategory}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions - show on hover */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenForm(member)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <TeamForm
          member={editingMember}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </motion.div>
  );
}
