import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ExternalLink } from 'lucide-react';
import type { BackendSectionId } from './BackendModal';
import type {
  BlogPost,
  TeamMember,
  Service,
  FaqReason,
  About,
  ScheduleSlot,
  OpenHour,
  AboutSection,
} from '../../redux/types';

type ViewItem = BlogPost | TeamMember | Service | FaqReason | About;

export interface ViewModalProps {
  open: boolean;
  sectionId: BackendSectionId;
  item: ViewItem | null;
  onClose: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const isRealImage = (url?: string | null) =>
  !!url && (url.startsWith('http://') || url.startsWith('https://'));

function VSection({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mt-6 mb-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
        {title}
      </span>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function VField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function VBadge({
  children,
  variant = 'slate',
}: {
  children: React.ReactNode;
  variant?: 'emerald' | 'slate' | 'blue' | 'amber';
}) {
  const cls = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    slate:   'bg-slate-500/10  text-slate-400  border-slate-500/20',
    blue:    'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
    amber:   'bg-amber-500/10  text-amber-400  border-amber-500/20',
  }[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-semibold border ${cls}`}>
      {children}
    </span>
  );
}

function VList({ items }: { items?: string[] | null }) {
  if (!items?.length) return <span className="text-slate-600 text-xs">—</span>;
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function VText({ value }: { value?: string | number | null }) {
  if (value === undefined || value === null || value === '') {
    return <span className="text-slate-600">—</span>;
  }
  return <span className="text-slate-200">{String(value)}</span>;
}

function fmtDate(iso?: string) {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Blog view ──────────────────────────────────────────────────────────────────

function BlogView({ post }: { post: BlogPost }) {
  const isPub = post.status === 'published';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extra = post as any;

  return (
    <div>
      {isRealImage(post.image) && (
        <img
          src={post.image}
          alt={post.imageAlt || post.title}
          className="w-full h-44 object-cover rounded-xl border border-white/10 mb-5"
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-xl font-bold text-white leading-snug">{post.title}</h2>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <VBadge variant={isPub ? 'emerald' : 'slate'}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPub ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            {isPub ? 'Published' : post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
          </VBadge>
          {post.isFeatured && (
            <VBadge variant="amber"><Star className="w-3 h-3" /> Featured</VBadge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        {post.category && <span>{post.category}</span>}
        {post.readingTime && <span>{post.readingTime} min read</span>}
        {post.views !== undefined && <span>{post.views} views</span>}
      </div>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      )}

      {post.excerpt && (
        <>
          <VSection title="Excerpt" />
          <p className="text-sm text-slate-300 leading-relaxed">{post.excerpt}</p>
        </>
      )}

      <VSection title="Content" />
      <div className="bg-[#0f1a2a] rounded-xl border border-white/10 p-4 max-h-52 overflow-y-auto scrollbar-brand">
        <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{post.content || '—'}</p>
      </div>

      <VSection title="Author" />
      <div className="flex items-center gap-3">
        {isRealImage(extra.authorAvatar) && (
          <img src={extra.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" />
        )}
        <div>
          <p className="text-sm font-medium text-white">{post.author || '—'}</p>
          {extra.authorTitle && <p className="text-xs text-slate-400">{extra.authorTitle}</p>}
        </div>
      </div>

      <VSection title="SEO" />
      <div className="space-y-3">
        <VField label="Meta Title"><VText value={post.metaTitle} /></VField>
        <VField label="Meta Description"><VText value={post.metaDescription} /></VField>
        <VField label="Image Alt"><VText value={post.imageAlt} /></VField>
      </div>

      <VSection title="Timestamps" />
      <div className="grid grid-cols-3 gap-3">
        <VField label="Created"><VText value={fmtDate(post.createdAt)} /></VField>
        <VField label="Updated"><VText value={fmtDate(post.updatedAt)} /></VField>
        <VField label="Published"><VText value={fmtDate(post.publishedAt)} /></VField>
      </div>
    </div>
  );
}

// ── Team view ──────────────────────────────────────────────────────────────────

function TeamView({ member }: { member: TeamMember }) {
  const schedule = Array.isArray(member.schedule)
    ? (member.schedule as ScheduleSlot[])
    : Object.entries(member.schedule as Record<string, string>).map(([day, hours]) => ({ day, hours }));

  return (
    <div>
      <div className="flex items-start gap-4 mb-2">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
          {isRealImage(member.image)
            ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            : <span className="text-white text-xl font-bold">
                {member.name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase()}
              </span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white">{member.name}</h2>
          <p className="text-sm text-accent-blue">{member.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{member.specialty}</p>
          {member.tagline && <p className="text-xs text-slate-500 italic mt-1">"{member.tagline}"</p>}
          <div className="mt-2">
            <VBadge variant={member.isActive !== false ? 'emerald' : 'slate'}>
              <span className={`w-1.5 h-1.5 rounded-full ${member.isActive !== false ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              {member.isActive !== false ? 'Active' : 'Inactive'}
            </VBadge>
          </div>
        </div>
      </div>

      <VSection title="Biography" />
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{member.bio || '—'}</p>

      <VSection title="Professional" />
      <div className="space-y-4">
        <VField label="Experience"><VText value={member.experience} /></VField>
        {member.education?.length > 0 && <VField label="Education"><VList items={member.education} /></VField>}
        {member.specialties?.length > 0 && <VField label="Areas of Expertise"><VList items={member.specialties} /></VField>}
        {member.languages?.length > 0 && <VField label="Languages"><VList items={member.languages} /></VField>}
        {member.awards && member.awards.length > 0 && <VField label="Awards"><VList items={member.awards} /></VField>}
      </div>

      <VSection title="Contact" />
      <div className="grid grid-cols-2 gap-3">
        <VField label="Phone"><VText value={member.contact?.phone} /></VField>
        <VField label="Email"><VText value={member.contact?.email} /></VField>
        {member.contact?.address && (
          <div className="col-span-2">
            <VField label="Address"><VText value={member.contact.address} /></VField>
          </div>
        )}
      </div>

      {Object.values(member.social ?? {}).some(Boolean) && (
        <>
          <VSection title="Social Media" />
          <div className="grid grid-cols-2 gap-2">
            {(['linkedin', 'instagram', 'twitter', 'facebook', 'youtube'] as const).map((key) => {
              const url = member.social?.[key];
              if (!url) return null;
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-accent-blue hover:underline truncate">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="capitalize">{key}</span>
                </a>
              );
            })}
          </div>
        </>
      )}

      {schedule.length > 0 && (
        <>
          <VSection title="Weekly Schedule" />
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#111d2e]">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Day</th>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Hours</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((slot, i) => (
                  <tr key={i} className="border-t border-white/[0.04]">
                    <td className="px-3 py-2 text-white">{slot.day}</td>
                    <td className="px-3 py-2 text-slate-300">{slot.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <VSection title="Timestamps" />
      <div className="grid grid-cols-2 gap-3">
        <VField label="Created"><VText value={fmtDate(member.createdAt)} /></VField>
        <VField label="Updated"><VText value={fmtDate(member.updatedAt)} /></VField>
      </div>
    </div>
  );
}

// ── Service view ───────────────────────────────────────────────────────────────

function ServiceView({ svc }: { svc: Service }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extra = svc as any;

  return (
    <div>
      {isRealImage(svc.image) && (
        <img src={svc.image} alt={svc.title} className="w-full h-44 object-cover rounded-xl border border-white/10 mb-5" />
      )}

      <div className="flex items-start justify-between gap-3 mb-1">
        <h2 className="text-xl font-bold text-white">{svc.title}</h2>
        <div className="flex items-center gap-2 shrink-0">
          <VBadge variant="blue"><span className="capitalize">{svc.type}</span></VBadge>
          <VBadge variant={svc.isPublished ? 'emerald' : 'slate'}>
            <span className={`w-1.5 h-1.5 rounded-full ${svc.isPublished ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            {svc.isPublished ? 'Published' : 'Unpublished'}
          </VBadge>
        </div>
      </div>
      <p className="text-xs text-slate-500">{svc.category}</p>

      <VSection title="Description" />
      <div className="space-y-3">
        <VField label="Short Description">
          <p className="text-sm text-slate-300">{svc.shortDescription}</p>
        </VField>
        {svc.fullDescription && (
          <VField label="Full Description">
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{svc.fullDescription}</p>
          </VField>
        )}
      </div>

      <VSection title="Details" />
      <div className="grid grid-cols-2 gap-3">
        {extra.programType && <VField label="Program Type"><VText value={extra.programType} /></VField>}
        {svc.duration && <VField label="Duration"><VText value={svc.duration} /></VField>}
        {svc.specialists && <div className="col-span-2"><VField label="Specialists / Schedule"><VText value={svc.specialists} /></VField></div>}
        {svc.icon && <VField label="Icon"><VText value={svc.icon} /></VField>}
      </div>

      {(svc.features?.length > 0 || svc.benefits?.length > 0) && (
        <>
          <VSection title="Features & Benefits" />
          <div className="grid grid-cols-2 gap-4">
            {svc.features?.length > 0 && <VField label="Features"><VList items={svc.features} /></VField>}
            {svc.benefits?.length > 0 && <VField label="Benefits"><VList items={svc.benefits} /></VField>}
          </div>
        </>
      )}

      {extra.learningObjectives?.length > 0 && (
        <>
          <VSection title="Learning Objectives" />
          <VList items={extra.learningObjectives} />
        </>
      )}

      {extra.modules?.length > 0 && (
        <>
          <VSection title="Modules" />
          <div className="space-y-2">
            {extra.modules.map((mod: { title: string; description?: string }, i: number) => (
              <div key={i} className="bg-[#0f1a2a] rounded-xl border border-white/10 p-3">
                <p className="text-sm font-medium text-white">{mod.title}</p>
                {mod.description && <p className="text-xs text-slate-400 mt-1">{mod.description}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {extra.pricing?.length > 0 && (
        <>
          <VSection title="Pricing" />
          <div className="space-y-2">
            {extra.pricing.map((p: { label: string; price: string; note?: string }, i: number) => (
              <div key={i} className="flex items-center justify-between bg-[#0f1a2a] rounded-xl border border-white/10 px-4 py-3">
                <span className="text-sm text-white font-medium">{p.label}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent-blue">{p.price}</p>
                  {p.note && <p className="text-[10px] text-slate-500">{p.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <VSection title="Timestamps" />
      <div className="grid grid-cols-2 gap-3">
        <VField label="Created"><VText value={fmtDate(svc.createdAt)} /></VField>
        <VField label="Updated"><VText value={fmtDate(svc.updatedAt)} /></VField>
      </div>
    </div>
  );
}

// ── FAQ view ───────────────────────────────────────────────────────────────────

function FaqView({ reason }: { reason: FaqReason }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <VBadge variant="blue">{reason.type}</VBadge>
      </div>
      <h2 className="text-lg font-semibold text-white leading-snug mb-2">{reason.question}</h2>
      <VSection title="Answer" />
      <div className="bg-[#0f1a2a] rounded-xl border border-white/10 p-4">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{reason.answer}</p>
      </div>
    </div>
  );
}

// ── About view ─────────────────────────────────────────────────────────────────

function AboutView({ about }: { about: About }) {
  return (
    <div>
      {isRealImage(about.image) && (
        <img src={about.image} alt={about.title} className="w-full h-44 object-cover rounded-xl border border-white/10 mb-5" />
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-xl font-bold text-white">{about.title}</h2>
        <VBadge variant={about.visible !== false ? 'emerald' : 'slate'}>
          <span className={`w-1.5 h-1.5 rounded-full ${about.visible !== false ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          {about.visible !== false ? 'Visible' : 'Hidden'}
        </VBadge>
      </div>

      <VSection title="Description" />
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{about.description}</p>

      <VSection title="Contact & CTA" />
      <div className="grid grid-cols-2 gap-3">
        <VField label="Phone"><VText value={about.phone} /></VField>
        <VField label="CTA Text"><VText value={about.ctaText} /></VField>
        <div className="col-span-2">
          <VField label="CTA Link"><VText value={about.ctaLink} /></VField>
        </div>
      </div>

      {about.features?.length > 0 && (
        <>
          <VSection title="Features" />
          <VList items={about.features} />
        </>
      )}

      {about.openHours?.length > 0 && (
        <>
          <VSection title="Opening Hours" />
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-[#111d2e]">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Day</th>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Hours</th>
                  <th className="px-3 py-2 text-left text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(about.openHours as OpenHour[]).map((h, i) => (
                  <tr key={i} className="border-t border-white/[0.04]">
                    <td className="px-3 py-2 text-white">{h.day}</td>
                    <td className="px-3 py-2 text-slate-300">{h.closed ? '—' : h.hours}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        h.closed
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {h.closed ? 'Closed' : 'Open'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {about.sections?.length > 0 && (
        <>
          <VSection title="Sub-sections" />
          <div className="space-y-2">
            {(about.sections as AboutSection[]).map((sec, i) => (
              <div key={i} className="bg-[#0f1a2a] rounded-xl border border-white/10 p-3">
                <p className="text-sm font-medium text-white">{sec.title}</p>
                {sec.icon && <p className="text-[10px] text-slate-500 mt-0.5">Icon: {sec.icon}</p>}
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <VSection title="Timestamps" />
      <div className="grid grid-cols-2 gap-3">
        <VField label="Created"><VText value={fmtDate(about.createdAt)} /></VField>
        <VField label="Updated"><VText value={fmtDate(about.updatedAt)} /></VField>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const SECTION_TITLES: Record<BackendSectionId, string> = {
  blog:     'Blog Post',
  team:     'Team Member',
  services: 'Service',
  faq:      'FAQ Entry',
  about:    'About Section',
};

export function ViewModal({ open, sectionId, item, onClose }: ViewModalProps) {
  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1a2a]/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1b2940] rounded-2xl border border-white/10 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Fixed header */}
            <div className="shrink-0 flex items-center justify-between p-6 border-b border-white/10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-semibold text-white">{SECTION_TITLES[sectionId]}</h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  Read-only view
                  <span className="px-1.5 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-[10px] font-medium">
                    View Only
                  </span>
                </p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto scrollbar-brand p-6">
              {sectionId === 'blog'     && <BlogView    post={item as BlogPost}     />}
              {sectionId === 'team'     && <TeamView    member={item as TeamMember} />}
              {sectionId === 'services' && <ServiceView svc={item as Service}       />}
              {sectionId === 'faq'      && <FaqView     reason={item as FaqReason}  />}
              {sectionId === 'about'    && <AboutView   about={item as About}       />}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex justify-end px-6 py-4 border-t border-white/10 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
