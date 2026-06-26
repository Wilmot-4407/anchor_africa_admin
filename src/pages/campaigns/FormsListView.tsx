import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Eye, Edit2, Copy, Archive, Trash2, MoreHorizontal,
  FileText, TrendingUp, CheckCircle, Clock, ChevronLeft, ChevronRight,
  Users, AlertTriangle, ArchiveRestore,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../redux/store';
import type { CampaignFormRecord, CampaignFormStatus, CampaignFormCategory } from '../../redux/types';
import {
  fetchForms, fetchFormsOverview, deleteForm, archiveForm, unarchiveForm, duplicateForm,
} from '../../redux/actions/forms';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

const STATUS_STYLES: Record<CampaignFormStatus, string> = {
  active: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  draft: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  archived: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
};

const PAGE_SIZE = 8;
const CATEGORIES: (CampaignFormCategory | 'all')[] = ['all', 'Intake', 'Feedback', 'Registration', 'Contact', 'Survey', 'Custom'];

function DeleteModal({ form, onConfirm, onCancel }: { form: CampaignFormRecord; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative bg-[#1b2940] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Delete Form</h3>
        <p className="text-sm text-slate-400 mt-2">
          Are you sure you want to delete{' '}
          <span className="text-white font-medium">"{form.title}"</span>?{' '}
          {form.responseCount > 0 && (
            <>This will permanently remove all <span className="text-white font-medium">{form.responseCount}</span> responses.</>
          )}
          {form.responseCount === 0 && 'This action cannot be undone.'}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function FormsListView() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, overview, totalPages, totalCount } = useSelector(
    (state: RootState) => state.forms,
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignFormStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<CampaignFormCategory | 'all'>('all');
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [deleteTarget, setDeleteTarget] = useState<CampaignFormRecord | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch forms whenever params change
  useEffect(() => {
    dispatch(fetchForms({
      page,
      limit: PAGE_SIZE,
      status: statusFilter !== 'all' ? statusFilter : '',
      category: categoryFilter !== 'all' ? categoryFilter : '',
      search: debouncedQuery,
    }));
  }, [dispatch, page, statusFilter, categoryFilter, debouncedQuery]);

  // Fetch overview stats once
  useEffect(() => {
    dispatch(fetchFormsOverview());
  }, [dispatch]);

  const resetPage = () => setPage(1);

  const handleDelete = (form: CampaignFormRecord) => { setDeleteTarget(form); setMenuOpen(null); };
  const confirmDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteForm(deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  const handleDuplicate = (form: CampaignFormRecord) => {
    dispatch(duplicateForm(form._id));
    setMenuOpen(null);
  };

  const handleArchiveToggle = (form: CampaignFormRecord) => {
    if (form.status === 'archived') {
      dispatch(unarchiveForm(form._id));
    } else {
      dispatch(archiveForm(form._id));
    }
    setMenuOpen(null);
  };

  const statCards = [
    {
      label: 'Total Forms',
      value: overview?.totalForms ?? 0,
      icon: FileText,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
      trend: 'all forms',
    },
    {
      label: 'Active Forms',
      value: overview?.formsByStatus.active ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      trend: 'published',
    },
    {
      label: 'Total Responses',
      value: overview?.totalSubmissions ?? 0,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: 'all time',
    },
    {
      label: 'Drafts',
      value: overview?.formsByStatus.draft ?? 0,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      trend: 'pending publish',
    },
  ];

  return (
    <div className="min-h-full p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaign Forms</h1>
          <p className="text-slate-400 text-sm mt-1">Build and manage forms for your campaigns</p>
        </div>
        <button
          onClick={() => navigate('/forms/new')}
          className="flex items-center gap-2 bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent-blue/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> New Form
        </button>
      </div>

      {/* Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map(card => (
          <motion.div
            key={card.label}
            variants={fadeUp}
            className="bg-[#1b2940] rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white tabular-nums">{card.value.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">{card.label}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{card.trend}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Table card */}
      <div className="bg-[#1b2940] rounded-2xl border border-white/10 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/[0.06] flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); resetPage(); }}
              placeholder="Search forms…"
              className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-[#0f1a2a] border border-white/10 rounded-xl p-1">
            {(['all', 'active', 'draft', 'archived'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); resetPage(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  statusFilter === s
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value as CampaignFormCategory | 'all'); resetPage(); }}
            className="bg-[#0f1a2a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-blue/40 transition-all appearance-none cursor-pointer"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Form Name', 'Category', 'Status', 'Responses', 'Created', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 ${
                      i === 0 ? 'text-left pl-6' : i === 3 ? 'text-right' : i === 5 ? 'text-right pr-6' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div role="status" className="relative w-8 h-8 mb-3 mx-auto">
                      <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-75" />
                      <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-50 [animation-delay:200ms]" />
                      <div className="absolute inset-0 rounded-full bg-accent-blue/80" />
                      <span className="sr-only">Loading…</span>
                    </div>
                    <p className="text-slate-500 text-sm">Loading forms…</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((form, i) => (
                    <motion.tr
                      key={form._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: i * 0.04 } }}
                      exit={{ opacity: 0 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] group"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-accent-blue" />
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => navigate(`/forms/${form._id}`)}
                              className="text-white font-medium hover:text-accent-blue transition-colors text-left block truncate max-w-[200px]"
                            >
                              {form.title}
                            </button>
                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{form.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-400 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">
                          {form.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold border rounded-full px-2.5 py-1 capitalize ${STATUS_STYLES[form.status]}`}>
                          {form.status}
                        </span>
                      </td>

                      {/* Responses */}
                      <td className="px-5 py-4 text-right">
                        <span className="text-white font-semibold tabular-nums">{form.responseCount.toLocaleString()}</span>
                        <span className="text-slate-500 text-xs ml-1">resp.</span>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(form.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => navigate(`/forms/${form._id}`)}
                            title="View"
                            className="p-2 text-slate-500 hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/forms/${form._id}?tab=builder`)}
                            title="Edit"
                            className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                if (menuOpen === form._id) {
                                  setMenuOpen(null);
                                } else {
                                  const MENU_HEIGHT = 138;
                                  const spaceBelow = window.innerHeight - rect.bottom;
                                  const top = spaceBelow < MENU_HEIGHT + 10
                                    ? rect.top - MENU_HEIGHT - 6
                                    : rect.bottom + 6;
                                  setMenuPos({ top, right: window.innerWidth - rect.right });
                                  setMenuOpen(form._id);
                                }
                              }}
                              className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}

              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No forms found</p>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or create a new form</p>
                    <button
                      onClick={() => navigate('/forms/new')}
                      className="mt-4 inline-flex items-center gap-2 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent-blue/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> New Form
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-[#0f1a2a]/20">
            <p className="text-xs text-slate-500">
              Page <span className="font-semibold text-slate-300">{page}</span> of{' '}
              <span className="font-semibold text-slate-300">{totalPages}</span>
              &nbsp;·&nbsp;<span className="text-slate-400">{totalCount} forms</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[30px] h-[30px] rounded-lg text-xs font-semibold border transition-colors ${
                      p === page
                        ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                        : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal form={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
        )}
      </AnimatePresence>

      {/* Context menu — fixed so it escapes overflow-x-auto clipping */}
      <AnimatePresence>
        {menuOpen && (() => {
          const form = items.find(f => f._id === menuOpen);
          if (!form) return null;
          return (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="fixed w-44 bg-[#0f1a2a] border border-white/10 rounded-xl shadow-2xl z-50 py-1"
                style={{ top: menuPos.top, right: menuPos.right }}
              >
                <button
                  onClick={() => handleDuplicate(form)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <button
                  onClick={() => handleArchiveToggle(form)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {form.status === 'archived'
                    ? <><ArchiveRestore className="w-4 h-4" /> Unarchive</>
                    : <><Archive className="w-4 h-4" /> Archive</>
                  }
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => handleDelete(form)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
