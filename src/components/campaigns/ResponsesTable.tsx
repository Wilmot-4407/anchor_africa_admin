import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ChevronLeft, ChevronRight, Eye,
  InboxIcon, User, Mail, Clock, CheckCircle2, MessageSquare,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../redux/store';
import type { FormResponseRecord, FormResponseStatus } from '../../redux/types';
import { fetchResponses } from '../../redux/actions/formResponses';

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  reviewed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  followed_up: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
  pending: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  under_review: 'bg-sky-400/10 text-sky-400 border-sky-400/20',
  approved: 'bg-teal-400/10 text-teal-400 border-teal-400/20',
  rejected: 'bg-red-400/10 text-red-400 border-red-400/20',
  completed: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  reviewed: 'Reviewed',
  followed_up: 'Followed Up',
  pending: 'Pending',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
};

const PAGE_SIZE = 8;

function ResponseModal({ response, onClose }: { response: FormResponseRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="relative bg-[#1b2940] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col z-10"
      >
        {/* Modal header */}
        <div className="flex items-start justify-between p-5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
              <User className="w-5 h-5 text-accent-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{response.respondentName}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {response.respondentEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meta row */}
        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-4 text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(response.submittedAt).toLocaleString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
          <span className={`border rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[response.status] ?? STATUS_STYLES.new}`}>
            {STATUS_LABELS[response.status] ?? response.status}
          </span>
        </div>

        {/* Answers */}
        <div className="flex-1 overflow-y-auto scrollbar-brand p-5 space-y-4">
          {(response.answers ?? []).length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No answer data available</p>
          ) : (
            (response.answers ?? []).map((ans, i) => (
              <div key={ans.fieldId ?? i}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{ans.question}</p>
                <p className="text-sm text-white bg-[#0f1a2a] rounded-xl px-4 py-3 border border-white/[0.06]">
                  {Array.isArray(ans.answer)
                    ? ans.answer.join(', ')
                    : ans.answer || <span className="text-slate-600 italic">No answer</span>}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

interface ResponsesTableProps {
  formId: string;
}

export function ResponsesTable({ formId }: ResponsesTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, totalCount, totalPages, currentPage } = useSelector(
    (state: RootState) => state.formResponses,
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FormResponseStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<FormResponseRecord | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch when params change
  useEffect(() => {
    dispatch(fetchResponses({
      formId,
      params: {
        page,
        limit: PAGE_SIZE,
        status: statusFilter !== 'all' ? statusFilter : '',
        search: debouncedQuery,
      },
    }));
  }, [dispatch, formId, page, statusFilter, debouncedQuery]);

  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div role="status" className="relative w-8 h-8 mb-3">
          <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-75" />
          <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-50 [animation-delay:200ms]" />
          <div className="absolute inset-0 rounded-full bg-accent-blue/80" />
          <span className="sr-only">Loading…</span>
        </div>
        <p className="text-slate-500 text-sm">Loading responses…</p>
      </div>
    );
  }

  if (!isLoading && totalCount === 0 && !debouncedQuery && statusFilter === 'all') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <InboxIcon className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium text-base">No responses yet</p>
        <p className="text-slate-500 text-sm mt-1.5">Share your form to start collecting responses</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([
          { key: 'total', label: 'Total', icon: MessageSquare, color: 'text-accent-blue', bg: 'bg-accent-blue/10', value: totalCount },
          { key: 'new', label: 'New', icon: InboxIcon, color: 'text-accent-blue', bg: 'bg-accent-blue/10', value: items.filter(r => r.status === 'new').length },
          { key: 'reviewed', label: 'Reviewed', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', value: items.filter(r => r.status === 'reviewed').length },
          { key: 'followed_up', label: 'Followed Up', icon: User, color: 'text-purple-400', bg: 'bg-purple-400/10', value: items.filter(r => r.status === 'followed_up').length },
        ] as const).map(card => (
          <div key={card.key} className="bg-[#111d2e] rounded-xl p-4 border border-white/[0.06]">
            <div className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
              <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
            </div>
            <p className="text-xl font-bold text-white tabular-nums">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name or email…"
            className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-[#0f1a2a] border border-white/10 rounded-xl p-1">
          {(['all', 'new', 'reviewed', 'followed_up'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s as FormResponseStatus | 'all'); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === s ? 'bg-accent-blue/10 text-accent-blue' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111d2e] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Respondent', 'Email', 'Submitted', 'Status', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5 ${
                      i === 0 ? 'text-left pl-6' : i === 4 ? 'text-right pr-6' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {items.map((sub, i) => (
                  <motion.tr
                    key={sub._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: i * 0.03 } }}
                    exit={{ opacity: 0 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-accent-blue/60 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(sub.respondentName ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{sub.respondentName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{sub.respondentEmail}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(sub.submittedAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                      <span className="text-slate-600 ml-1">
                        {new Date(sub.submittedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold border rounded-full px-2.5 py-1 ${STATUS_STYLES[sub.status] ?? STATUS_STYLES.new}`}>
                        {STATUS_LABELS[sub.status] ?? sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setViewing(sub)}
                        className="p-2 text-slate-500 hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-colors"
                        title="View submission"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {items.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No responses match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-[#0f1a2a]/20">
            <p className="text-xs text-slate-500">
              Page <span className="font-semibold text-slate-300">{currentPage}</span> of{' '}
              <span className="font-semibold text-slate-300">{totalPages}</span>
              &nbsp;·&nbsp;{totalCount} responses
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

      <AnimatePresence>
        {viewing && (
          <ResponseModal response={viewing} onClose={() => setViewing(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
