import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Type, Eye } from "lucide-react";
import { fetchWhyChooseUs } from "../redux/actions/whyChooseUs";
import { AppDispatch, RootState } from "../redux/store";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { ErrorState } from "../components/common/StateComponents";
import { WhyChooseUsForm } from "../components/forms/WhyChooseUsForm";
import { useNavigation } from "../context/NavigationContext";

function SectionDivider({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-5 mt-8 first:mt-0">
      <span className="text-amber-500 flex-shrink-0">{icon}</span>
      <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100 ml-1" />
    </div>
  );
}

export function WhyChooseUsEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useNavigation();
  const {
    content: whyChooseUs,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.whyChooseUs);

  const [showForm, setShowForm] = useState(false);

  // Inline edit state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchWhyChooseUs());
  }, [dispatch]);

  useEffect(() => {
    if (whyChooseUs) {
      setTitle(whyChooseUs.title || "");
      setDescription((whyChooseUs as any).description || "");
    }
  }, [whyChooseUs]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    setIsDirty(false);
    addToast({ type: "success", title: "Changes saved" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8 max-w-3xl mx-auto"
    >
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Why Choose Us</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage the Why Choose Us section of your website
        </p>
      </div>

      {isLoading ? (
        <SkeletonLoader />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchWhyChooseUs())}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Content tab header (single tab for simplicity) */}
          <div className="flex border-b border-slate-200">
            <button className="px-6 py-3.5 text-sm font-medium text-primary border-b-2 border-primary">
              Content
            </button>
          </div>

          <div className="p-6">
            {/* ── SECTION COPY ── */}
            <SectionDivider icon={<Type size={14} />} label="Section Content" />
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Why Choose ANCHOR?"
                />
                <p className="text-xs text-amber-600 mt-1">
                  {title.length} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Describe why patients choose ANCHOR..."
                />
              </div>
            </div>

            {/* ── ITEMS ── */}
            {(whyChooseUs as any)?.items &&
              (whyChooseUs as any).items.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-5 mt-8">
                    <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                      Items
                    </span>
                    <div className="flex-1 h-px bg-slate-100 ml-1" />
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      <Edit2 size={12} /> Edit Items
                    </button>
                  </div>
                  <div className="space-y-3">
                    {((whyChooseUs as any).items as any[]).map(
                      (item, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100"
                        >
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-heading">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}

            {!whyChooseUs && (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm mb-4">
                  No Why Choose Us section created yet
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold mx-auto transition-colors"
                >
                  <Plus size={16} />
                  Create Section
                </button>
              </div>
            )}

            {/* ── VISIBILITY ── */}
            {whyChooseUs && (
              <>
                <SectionDivider
                  icon={<Eye size={14} />}
                  label="Visibility & SEO"
                />
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-heading">
                      Section Visibility
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Show this section on the live website
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setVisibility((v) => !v);
                      setIsDirty(true);
                    }}
                    className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${visibility ? "bg-amber-500" : "bg-slate-200"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${visibility ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer actions */}
          {whyChooseUs && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                disabled={!isDirty}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 disabled:opacity-40 transition-colors"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full form modal for items */}
      {showForm && (
        <WhyChooseUsForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            dispatch(fetchWhyChooseUs());
          }}
        />
      )}
    </motion.div>
  );
}
