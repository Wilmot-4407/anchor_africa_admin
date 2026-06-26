import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  BookOpen,
  Users,
  Briefcase,
  HelpCircle,
  Info,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { ConfirmDialog } from '../components/website/ConfirmDialog';
import {
  BackendModal,
  type BackendSectionId,
  type BackendSaveData,
} from '../components/website/BackendModal';
import { ViewModal } from '../components/website/ViewModal';
import type { AppDispatch } from '../redux/store';
import type { RootState } from '../redux/types';
// Blog — GET /blog/admin/all · POST /blog · PUT /blog/:id · DELETE /blog/:id
import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../redux/actions/blog';
// Team — GET /team/admin/all · POST /team · PUT /team/admin/:id · DELETE /team/admin/:id
import { fetchTeamMembersAdmin, createTeamMember, updateTeamMember, deleteTeamMember } from '../redux/actions/team';
// Services — GET /services/admin/all · POST /services · PUT /services/:id · DELETE /services/:id
import { fetchServicesAdmin, createService, updateService, deleteService } from '../redux/actions/services';
// FAQ — GET /faqs · POST /faqs (upserts single document with reasons[])
import { fetchFaq, upsertFaq } from '../redux/actions/faqs';
// About — GET /about · POST /about (upserts single document) · DELETE /about
import { fetchAbout, upsertAbout, deleteAbout } from '../redux/actions/about';
import type { BlogPost, TeamMember, Service, FaqReason, About } from '../redux/types';

// ── Tabs ───────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'blog' as const,     label: 'Blog Posts', noun: 'Post',           Icon: BookOpen  },
  { id: 'team' as const,     label: 'Team',       noun: 'Member',         Icon: Users     },
  { id: 'services' as const, label: 'Services',   noun: 'Service',        Icon: Briefcase },
  { id: 'faq' as const,      label: 'FAQ',        noun: 'Question',       Icon: HelpCircle},
  { id: 'about' as const,    label: 'About',      noun: 'About Section',  Icon: Info      },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function StatusBadge({
  active, activeLabel, inactiveLabel, onClick,
}: {
  active: boolean; activeLabel: string; inactiveLabel: string; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={onClick ? 'Click to toggle' : undefined}
      className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-semibold border transition-all ${
        onClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'
      } ${
        active
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
          : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      {active ? activeLabel : inactiveLabel}
    </button>
  );
}

function RowActions({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onView}
        className="p-1.5 text-slate-400 hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-colors" title="View">
        <Eye className="w-3.5 h-3.5" />
      </button>
      <button onClick={onEdit}
        className="p-1.5 text-slate-400 hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-colors" title="Edit">
        <Edit2 className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete}
        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function EmptyState({ noun, label, query, Icon, onAdd }: {
  noun: string; label: string; query: string; Icon: React.ElementType; onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#0f1a2a] border border-white/10 flex items-center justify-center mb-4">
        {query ? <Search className="w-6 h-6 text-slate-500" /> : <Icon className="w-6 h-6 text-slate-500" />}
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">
        {query ? `No results for "${query}"` : `No ${label} yet`}
      </h3>
      <p className="text-sm text-slate-400 mb-5 max-w-xs">
        {query ? 'Try adjusting your search or clear the filter.' : `Add your first ${noun.toLowerCase()} to get started.`}
      </p>
      {!query && (
        <button onClick={onAdd}
          className="flex items-center gap-2 bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent-blue/20">
          <Plus className="w-4 h-4" /> New {noun}
        </button>
      )}
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

// ── Table class tokens ─────────────────────────────────────────────────────────

const TH = 'px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap';
const TD = 'px-4 py-3.5 text-sm';
const ROW = 'border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors';

// ── Main page ──────────────────────────────────────────────────────────────────

export function WebsiteContent() {
  const dispatch = useDispatch<AppDispatch>();

  // ── Redux selectors ──────────────────────────────────────────────────────────
  const { posts,                isLoading: blogLoading      } = useSelector((s: RootState) => s.blog);
  const { members,              isLoading: teamLoading      } = useSelector((s: RootState) => s.team);
  const { services: apiServices,isLoading: servicesLoading  } = useSelector((s: RootState) => s.services);
  const { content: faqDoc,      isLoading: faqLoading       } = useSelector((s: RootState) => s.faqs);
  const { about: aboutDoc,      isLoading: aboutLoading     } = useSelector((s: RootState) => s.about);

  // ── Local state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]     = useState<BackendSectionId>('blog');
  const [query, setQuery]             = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingRaw, setEditingRaw]   = useState<BlogPost | TeamMember | Service | FaqReason | About | null>(null);
  const [viewOpen, setViewOpen]       = useState(false);
  const [viewingItem, setViewingItem] = useState<BlogPost | TeamMember | Service | FaqReason | About | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const [isSaving, setIsSaving]       = useState(false);
  const [page, setPage]               = useState(1);

  // Reset page whenever tab, search query, or status filter changes
  useEffect(() => { setPage(1); }, [activeTab, query, statusFilter]);

  // ── Fetch all on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchBlogPosts());
    dispatch(fetchTeamMembersAdmin());
    dispatch(fetchServicesAdmin());
    dispatch(fetchFaq());
    dispatch(fetchAbout());
  }, [dispatch]);

  // ── Derived ──────────────────────────────────────────────────────────────────

  const tab = TABS.find((t) => t.id === activeTab)!;

  const isLoading =
    (activeTab === 'blog'     && blogLoading)     ||
    (activeTab === 'team'     && teamLoading)     ||
    (activeTab === 'services' && servicesLoading) ||
    (activeTab === 'faq'      && faqLoading)      ||
    (activeTab === 'about'    && aboutLoading);

  const tabCounts: Record<BackendSectionId, number> = {
    blog:     posts.length,
    team:     members.length,
    services: apiServices.length,
    faq:      faqDoc?.reasons?.length ?? 0,
    about:    aboutDoc ? 1 : 0,
  };

  const stats = useMemo(() => {
    if (activeTab === 'blog') {
      const pub = posts.filter((p) => p.status === 'published').length;
      return { total: posts.length, published: pub, draft: posts.length - pub };
    }
    if (activeTab === 'team') {
      const pub = members.filter((m) => m.isActive !== false).length;
      return { total: members.length, published: pub, draft: members.length - pub };
    }
    if (activeTab === 'services') {
      const pub = apiServices.filter((s) => s.isPublished).length;
      return { total: apiServices.length, published: pub, draft: apiServices.length - pub };
    }
    if (activeTab === 'faq') {
      const total = faqDoc?.reasons?.length ?? 0;
      return { total, published: total, draft: 0 };
    }
    // about
    const visible = aboutDoc?.visible !== false;
    return { total: aboutDoc ? 1 : 0, published: visible && aboutDoc ? 1 : 0, draft: !visible && aboutDoc ? 1 : 0 };
  }, [activeTab, posts, members, apiServices, faqDoc, aboutDoc]);

  const activeItems = useMemo((): (BlogPost | TeamMember | Service | FaqReason | About)[] => {
    const q = query.trim().toLowerCase();

    if (activeTab === 'blog') {
      return posts.filter((p) => {
        const mQ = !q || p.title.toLowerCase().includes(q) || (p.excerpt ?? '').toLowerCase().includes(q) || (p.category ?? '').toLowerCase().includes(q);
        const mS = statusFilter === 'all' || (statusFilter === 'published' && p.status === 'published') || (statusFilter === 'draft' && p.status !== 'published');
        return mQ && mS;
      });
    }
    if (activeTab === 'team') {
      return members.filter((m) => {
        const mQ = !q || m.name.toLowerCase().includes(q) || m.title.toLowerCase().includes(q) || m.specialty.toLowerCase().includes(q);
        const mS = statusFilter === 'all' || (statusFilter === 'published' && m.isActive !== false) || (statusFilter === 'draft' && m.isActive === false);
        return mQ && mS;
      });
    }
    if (activeTab === 'services') {
      return apiServices.filter((s) => {
        const mQ = !q || s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
        const mS = statusFilter === 'all' || (statusFilter === 'published' && s.isPublished) || (statusFilter === 'draft' && !s.isPublished);
        return mQ && mS;
      });
    }
    if (activeTab === 'faq') {
      return (faqDoc?.reasons ?? []).filter((r) => !q || r.question.toLowerCase().includes(q) || r.answer.toLowerCase().includes(q));
    }
    if (activeTab === 'about') {
      const items: About[] = aboutDoc ? [aboutDoc] : [];
      return items.filter((a) => !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return [];
  }, [activeTab, posts, members, apiServices, faqDoc, aboutDoc, query, statusFilter]);

  const totalPages = Math.ceil(activeItems.length / PAGE_SIZE);
  const pagedItems = activeItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  const openCreate = () => { setEditingRaw(null); setModalOpen(true); };
  const openEdit = (raw: BlogPost | TeamMember | Service | FaqReason | About) => { setEditingRaw(raw); setModalOpen(true); };
  const openView  = (item: BlogPost | TeamMember | Service | FaqReason | About) => { setViewingItem(item); setViewOpen(true); };

  const handleToggleStatus = (item: BlogPost | TeamMember | Service | About) => {
    if (activeTab === 'blog') {
      const p = item as BlogPost;
      dispatch(updateBlogPost({ id: p._id, data: { status: p.status === 'published' ? 'draft' : 'published' } }));
    } else if (activeTab === 'team') {
      const m = item as TeamMember;
      dispatch(updateTeamMember({ id: m._id, data: { isActive: m.isActive === false } }));
    } else if (activeTab === 'services') {
      const s = item as Service;
      dispatch(updateService({ id: s._id, data: { isPublished: !s.isPublished } }));
    } else if (activeTab === 'about') {
      const a = item as About;
      dispatch(upsertAbout({ ...a, visible: !a.visible }));
    }
  };

  // Build FormData when a file is attached; otherwise strip _imageFile and send plain object
  function buildPayload(data: BackendSaveData): FormData | Record<string, unknown> {
    const file = data._imageFile as File | undefined | null;
    if (!file) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _imageFile: _f, ...rest } = data;
      return rest;
    }
    const fd = new FormData();
    fd.append('image', file);
    for (const [key, val] of Object.entries(data)) {
      if (key === '_imageFile' || val == null) continue;
      if (typeof val === 'boolean' || typeof val === 'number') {
        fd.append(key, String(val));
      } else if (Array.isArray(val) || (typeof val === 'object' && !(val instanceof File))) {
        fd.append(key, JSON.stringify(val));
      } else {
        fd.append(key, String(val));
      }
    }
    return fd;
  }

  const handleSave = async (data: BackendSaveData) => {
    setIsSaving(true);
    try {
      const payload = buildPayload(data);
      if (activeTab === 'blog') {
        if (editingRaw) await dispatch(updateBlogPost({ id: (editingRaw as BlogPost)._id, data: payload as Partial<BlogPost> }));
        else            await dispatch(createBlogPost(payload as Partial<BlogPost>));
      } else if (activeTab === 'team') {
        if (editingRaw) await dispatch(updateTeamMember({ id: (editingRaw as TeamMember)._id, data: payload as Partial<TeamMember> }));
        else            await dispatch(createTeamMember(payload as Partial<TeamMember>));
      } else if (activeTab === 'services') {
        if (editingRaw) await dispatch(updateService({ id: (editingRaw as Service)._id, data: payload as Partial<Service> }));
        else            await dispatch(createService(payload as Partial<Service>));
      } else if (activeTab === 'faq') {
        const faqData   = data as Partial<FaqReason>; // FAQ has no image
        const existing  = faqDoc?.reasons ?? [];
        const rawReason = editingRaw as FaqReason | null;
        const updated   = rawReason
          ? existing.map((r) => ((r._id && r._id === rawReason._id) || r.question === rawReason.question) ? ({ ...r, ...faqData } as FaqReason) : r)
          : [...existing, faqData as FaqReason];
        await dispatch(upsertFaq({ title: faqDoc?.title ?? 'Frequently Asked Questions', reasons: updated }));
      } else if (activeTab === 'about') {
        await dispatch(upsertAbout(payload as Partial<About>));
      }
    } finally {
      setIsSaving(false);
      setModalOpen(false);
      setEditingRaw(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    if (activeTab === 'blog')     await dispatch(deleteBlogPost(id));
    else if (activeTab === 'team')     await dispatch(deleteTeamMember(id));
    else if (activeTab === 'services') await dispatch(deleteService(id));
    else if (activeTab === 'faq') {
      const updated = (faqDoc?.reasons ?? []).filter((r) => (r._id ?? r.question) !== id);
      await dispatch(upsertFaq({ title: faqDoc?.title ?? 'Frequently Asked Questions', reasons: updated }));
    } else if (activeTab === 'about') {
      await dispatch(deleteAbout());
    }
    setPendingDelete(null);
  };

  // Header button: for About when document already exists, switch to Edit
  const headerAction = activeTab === 'about' && aboutDoc ? () => openEdit(aboutDoc) : openCreate;
  const headerLabel  = activeTab === 'about' && aboutDoc ? 'Edit About' : `New ${tab.noun}`;

  // ── Table: Blog ───────────────────────────────────────────────────────────────

  function BlogTable() {
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-[#111d2e]/70">
            <th className={TH} style={{ width: '34%' }}>Title</th>
            <th className={TH} style={{ width: '14%' }}>Category</th>
            <th className={TH} style={{ width: '13%' }}>Status</th>
            <th className={`${TH} text-center`} style={{ width: '10%' }}>Featured</th>
            <th className={TH} style={{ width: '16%' }}>Updated</th>
            <th className={TH} style={{ width: '13%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(pagedItems as BlogPost[]).map((post) => {
            const isPub = post.status === 'published';
            return (
              <tr key={post._id} className={ROW}>
                <td className={TD}>
                  <p className="font-medium text-white truncate max-w-xs">{post.title}</p>
                  {post.excerpt && <p className="text-xs text-slate-500 truncate mt-0.5 max-w-xs">{post.excerpt}</p>}
                </td>
                <td className={TD}><span className="text-slate-400 text-xs">{post.category || '—'}</span></td>
                <td className={TD}>
                  <StatusBadge active={isPub} activeLabel="Published"
                    inactiveLabel={post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                    onClick={() => handleToggleStatus(post)} />
                </td>
                <td className={`${TD} text-center`}>
                  {post.isFeatured ? <Star className="w-4 h-4 text-secondary inline-block" /> : <span className="text-slate-700">—</span>}
                </td>
                <td className={TD}><span className="text-slate-500 text-xs">{fmtDate(post.updatedAt)}</span></td>
                <td className={TD}>
                  <RowActions onView={() => openView(post)} onEdit={() => openEdit(post)} onDelete={() => setPendingDelete({ id: post._id, title: post.title })} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  // ── Table: Team ───────────────────────────────────────────────────────────────

  function TeamTable() {
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-[#111d2e]/70">
            <th className={TH} style={{ width: '36%' }}>Member</th>
            <th className={TH} style={{ width: '22%' }}>Role / Title</th>
            <th className={TH} style={{ width: '13%' }}>Status</th>
            <th className={TH} style={{ width: '16%' }}>Updated</th>
            <th className={TH} style={{ width: '13%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(pagedItems as TeamMember[]).map((m) => {
            const isActive = m.isActive !== false;
            return (
              <tr key={m._id} className={ROW}>
                <td className={TD}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shrink-0 overflow-hidden">
                      {m.image && m.image !== 'default.png'
                        ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        : <span className="text-white text-[10px] font-bold">{initials(m.name)}</span>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{m.name}</p>
                      <p className="text-xs text-slate-500 truncate">{m.specialty}</p>
                    </div>
                  </div>
                </td>
                <td className={TD}><span className="text-slate-400 text-xs truncate block max-w-[160px]">{m.title}</span></td>
                <td className={TD}>
                  <StatusBadge active={isActive} activeLabel="Active" inactiveLabel="Inactive" onClick={() => handleToggleStatus(m)} />
                </td>
                <td className={TD}><span className="text-slate-500 text-xs">{fmtDate(m.updatedAt)}</span></td>
                <td className={TD}>
                  <RowActions onView={() => openView(m)} onEdit={() => openEdit(m)} onDelete={() => setPendingDelete({ id: m._id, title: m.name })} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  // ── Table: Services ───────────────────────────────────────────────────────────

  function ServicesTable() {
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-[#111d2e]/70">
            <th className={TH} style={{ width: '30%' }}>Title</th>
            <th className={TH} style={{ width: '11%' }}>Type</th>
            <th className={TH} style={{ width: '16%' }}>Category</th>
            <th className={TH} style={{ width: '13%' }}>Status</th>
            <th className={TH} style={{ width: '17%' }}>Updated</th>
            <th className={TH} style={{ width: '13%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(pagedItems as Service[]).map((svc) => (
            <tr key={svc._id} className={ROW}>
              <td className={TD}>
                <p className="font-medium text-white truncate max-w-[220px]">{svc.title}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[220px]">{svc.shortDescription}</p>
              </td>
              <td className={TD}>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 capitalize whitespace-nowrap">
                  {svc.type}
                </span>
              </td>
              <td className={TD}><span className="text-slate-400 text-xs">{svc.category}</span></td>
              <td className={TD}>
                <StatusBadge active={svc.isPublished} activeLabel="Published" inactiveLabel="Unpublished" onClick={() => handleToggleStatus(svc)} />
              </td>
              <td className={TD}><span className="text-slate-500 text-xs">{fmtDate(svc.updatedAt)}</span></td>
              <td className={TD}>
                <RowActions onView={() => openView(svc)} onEdit={() => openEdit(svc)} onDelete={() => setPendingDelete({ id: svc._id, title: svc.title })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // ── Table: FAQ ────────────────────────────────────────────────────────────────

  function FaqTable() {
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-[#111d2e]/70">
            <th className={`${TH} text-center`} style={{ width: '5%' }}>#</th>
            <th className={TH} style={{ width: '30%' }}>Question</th>
            <th className={TH} style={{ width: '13%' }}>Category</th>
            <th className={TH} style={{ width: '39%' }}>Answer</th>
            <th className={TH} style={{ width: '13%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(pagedItems as FaqReason[]).map((r, idx) => {
            const rid = r._id ?? r.question;
            const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
            return (
              <tr key={rid} className={ROW}>
                <td className={`${TD} text-center text-slate-600 tabular-nums text-xs`}>{globalIdx}</td>
                <td className={TD}><p className="font-medium text-white">{r.question}</p></td>
                <td className={TD}>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 whitespace-nowrap">
                    {r.type}
                  </span>
                </td>
                <td className={TD}><p className="text-slate-400 text-xs line-clamp-2">{r.answer}</p></td>
                <td className={TD}>
                  <RowActions onView={() => openView(r)} onEdit={() => openEdit(r)} onDelete={() => setPendingDelete({ id: rid, title: r.question })} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  // ── Table: About ──────────────────────────────────────────────────────────────

  function AboutTable() {
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-[#111d2e]/70">
            <th className={TH} style={{ width: '22%' }}>Title</th>
            <th className={TH} style={{ width: '36%' }}>Description</th>
            <th className={TH} style={{ width: '14%' }}>Phone</th>
            <th className={TH} style={{ width: '15%' }}>Visibility</th>
            <th className={TH} style={{ width: '13%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(pagedItems as About[]).map((a) => (
            <tr key={a._id} className={ROW}>
              <td className={TD}><p className="font-medium text-white truncate max-w-[180px]">{a.title}</p></td>
              <td className={TD}><p className="text-slate-400 text-xs line-clamp-2">{a.description}</p></td>
              <td className={TD}><span className="text-slate-400 text-xs">{a.phone || '—'}</span></td>
              <td className={TD}>
                <StatusBadge active={a.visible !== false} activeLabel="Visible" inactiveLabel="Hidden" onClick={() => handleToggleStatus(a)} />
              </td>
              <td className={TD}>
                <RowActions onView={() => openView(a)} onEdit={() => openEdit(a)} onDelete={() => setPendingDelete({ id: a._id, title: 'the About section' })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // ── Stat label helpers ────────────────────────────────────────────────────────

  const publishedLabel = activeTab === 'team' ? 'active' : activeTab === 'about' ? 'visible' : 'published';
  const draftLabel     = activeTab === 'team' ? 'inactive' : activeTab === 'about' ? 'hidden'  : 'draft';

  // ── Render ─────────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-[#0f1a2a] font-sans text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Page-level scroll — no inner panel scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-brand">
          <div className="p-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Website Content</h1>
                <p className="text-sm text-slate-400">Manage live content sections on your public website</p>
              </div>
              <button onClick={headerAction}
                className="flex items-center gap-2 bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent-blue/20 shrink-0">
                <Plus className="w-4 h-4" />
                {headerLabel}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 border-b border-white/10 pb-px">
              {TABS.map((t) => {
                const active = activeTab === t.id;
                return (
                  <button key={t.id}
                    onClick={() => { setActiveTab(t.id); setQuery(''); setStatusFilter('all'); }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all ${
                      active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}>
                    <t.Icon className="w-4 h-4" />
                    {t.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold tabular-nums ${
                      active ? 'bg-accent-blue text-[#0f1a2a]' : 'bg-white/5 text-slate-500'
                    }`}>
                      {tabCounts[t.id]}
                    </span>
                    {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue rounded-full translate-y-[1px]" />}
                  </button>
                );
              })}
            </div>

            {/* Search + Status filter (hidden for FAQ and About) */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${tab.label.toLowerCase()}…`}
                  className="w-full bg-[#1b2940] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all" />
              </div>

              {activeTab !== 'faq' && activeTab !== 'about' && (
                <div className="flex items-center gap-0.5 bg-[#1b2940] border border-white/10 rounded-xl p-1 shrink-0">
                  {(['all', 'published', 'draft'] as const).map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                        statusFilter === s ? 'bg-accent-blue/15 text-accent-blue' : 'text-slate-400 hover:text-white'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                  <span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0">
                    <span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" />
                    <span className="absolute inset-0 rounded-full bg-current" />
                  </span> Syncing
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mb-5 text-xs text-slate-500">
              <span><span className="text-slate-300 font-medium">{stats.total}</span> total</span>
              {activeTab !== 'faq' && (
                <>
                  <span className="w-px h-3 bg-white/10" />
                  <span><span className="text-emerald-400 font-medium">{stats.published}</span> {publishedLabel}</span>
                  <span className="w-px h-3 bg-white/10" />
                  <span><span className="text-slate-400 font-medium">{stats.draft}</span> {draftLabel}</span>
                </>
              )}
              {activeItems.length !== stats.total && (
                <>
                  <span className="w-px h-3 bg-white/10" />
                  <span>showing <span className="text-accent-blue font-medium">{activeItems.length}</span></span>
                </>
              )}
              {totalPages > 1 && (
                <>
                  <span className="w-px h-3 bg-white/10" />
                  <span>page <span className="text-accent-blue font-medium">{page}</span> of <span className="text-accent-blue font-medium">{totalPages}</span></span>
                </>
              )}
            </div>

            {/* Table or empty state */}
            {activeItems.length === 0 ? (
              <div className="bg-[#1b2940] border border-white/10 rounded-2xl">
                <EmptyState noun={tab.noun} label={tab.label} query={query} Icon={tab.Icon} onAdd={headerAction} />
              </div>
            ) : (
              <div className="bg-[#1b2940] border border-white/10 rounded-2xl overflow-hidden mb-10">
                <div className="overflow-x-auto">
                  {activeTab === 'blog'     && <BlogTable />}
                  {activeTab === 'team'     && <TeamTable />}
                  {activeTab === 'services' && <ServicesTable />}
                  {activeTab === 'faq'      && <FaqTable />}
                  {activeTab === 'about'    && <AboutTable />}
                </div>

                {/* Pagination footer */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 bg-[#0f1a2a]/20">
                    <p className="text-xs text-slate-500">
                      Page{' '}
                      <span className="font-semibold text-slate-300">{page}</span>
                      {' '}of{' '}
                      <span className="font-semibold text-slate-300">{totalPages}</span>
                      &nbsp;·&nbsp;
                      <span className="text-slate-400">{activeItems.length} items</span>
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
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
                                ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'
                                : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
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
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <BackendModal
        open={modalOpen}
        sectionId={activeTab}
        rawItem={editingRaw}
        onClose={() => { setModalOpen(false); setEditingRaw(null); }}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* View modal */}
      <ViewModal
        open={viewOpen}
        sectionId={activeTab}
        item={viewingItem}
        onClose={() => { setViewOpen(false); setViewingItem(null); }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete ${tab.noun.toLowerCase()}?`}
        message={`"${pendingDelete?.title ?? ''}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
