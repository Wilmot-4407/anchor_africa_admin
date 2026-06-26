import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Upload, Sparkles, Loader2, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { BlogPost, TeamMember, Service, FaqReason, About } from '../../redux/types';
import api from '../../utils/api';

export type BackendSectionId = 'blog' | 'team' | 'services' | 'faq' | 'about';
export type BackendSaveData = Record<string, unknown>;

// ── AI Icon Suggester ─────────────────────────────────────────────────────────

const LUCIDE_ICON_NAMES: string[] = [
  'Heart','Brain','Stethoscope','Activity','Thermometer','Pill','Syringe','Cross','Eye','Ear',
  'Wind','Smile','Frown','Sun','Moon','Star','Zap','Shield','Lock','Users','User','UserCheck',
  'Baby','PersonStanding','Footprints','Bone','Dna','FlaskConical','Microscope','TestTube',
  'Leaf','Flower','TreePine','Sprout','Apple','Salad','Carrot','Droplets','Waves','Mountain',
  'Bed','Sofa','Home','Building','Hospital','Ambulance','Bandage','HeartPulse','HandHeart',
  'Hands','HandMetal','ClipboardList','ClipboardCheck','BookOpen','GraduationCap','Award',
  'Trophy','Medal','MessageCircle','Phone','Mail','Globe','Clock','Calendar','Timer',
  'AlarmClock','Coffee','Dumbbell','Bicycle','Running','Yoga','Accessibility','Scale',
  'RefreshCw','RotateCcw','Infinity','CircleDot','CircleCheck','CheckCircle','Sparkles',
  'Lightbulb','WandSparkles',
];

interface IconSuggestion { icon: string; reason: string; score: number }

function IconSuggestButton({
  title, shortDescription, currentIcon, onSelect,
}: {
  title: string; shortDescription: string; currentIcon: string; onSelect: (n: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<IconSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!title.trim() && !shortDescription.trim()) {
      setError('Please fill in the title or short description first.');
      setOpen(true);
      return;
    }
    setOpen(true); setLoading(true); setError(null); setSuggestions([]);
    try {
      const { data } = await api.post('/ai/suggest-icon', {
        title: title.trim(), shortDescription: shortDescription.trim(),
        fullDescription: '', icons: LUCIDE_ICON_NAMES,
      });
      if (!data?.success) throw new Error(data?.error || 'No suggestions returned');
      const parsed: IconSuggestion[] = Array.isArray(data.suggestions) ? data.suggestions : [];
      const valid = parsed.filter((s) => typeof (LucideIcons as Record<string, unknown>)[s.icon] === 'function');
      setSuggestions(valid.length > 0 ? valid : parsed.slice(0, 8));
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { error?: string } }; message?: string };
      let msg = 'Could not get icon suggestions';
      if (e.response?.status === 401) msg = 'Session expired — please log in again';
      else if (e.response?.data?.error) msg = e.response.data.error;
      else if (e.message) msg = e.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (iconName: string) => {
    setSelected(iconName); onSelect(iconName); setTimeout(() => setOpen(false), 400);
  };

  return (
    <>
      <button type="button" onClick={fetchSuggestions} disabled={loading}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? (
          <span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0">
            <span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" />
            <span className="absolute inset-0 rounded-full bg-current" />
          </span>
        ) : <Sparkles className="w-3.5 h-3.5" />}
        Suggest Icon
      </button>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="bg-[#1b2940] rounded-xl shadow-2xl border border-white/10 overflow-hidden w-80 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-semibold text-white">AI Icon Suggestions</span>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {(title || shortDescription) && (
              <div className="px-4 py-2 bg-white/5 border-b border-white/[0.06] flex-shrink-0">
                <p className="text-[11px] text-slate-400 truncate">
                  <span className="font-medium text-slate-300">{title || shortDescription}</span>
                </p>
              </div>
            )}
            <div className="p-3 overflow-y-auto">
              {loading && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div role="status" className="relative w-10 h-10">
                    <div className="animate-ping absolute inset-0 rounded-full bg-violet-400 opacity-75" />
                    <div className="animate-ping absolute inset-0 rounded-full bg-violet-400 opacity-50 [animation-delay:200ms]" />
                    <div className="absolute inset-0 rounded-full bg-violet-400/80" />
                  </div>
                  <p className="text-xs text-slate-400">Analysing your service…</p>
                </div>
              )}
              {error && !loading && <div className="py-4 text-center"><p className="text-xs text-red-400">{error}</p></div>}
              {!loading && !error && suggestions.length > 0 && (
                <>
                  <p className="text-xs text-slate-500 mb-3">Click an icon to use it · sorted by relevance</p>
                  <div className="grid grid-cols-4 gap-2">
                    {suggestions.map((s) => {
                      const IconComp = (LucideIcons as Record<string, unknown>)[s.icon] as React.ComponentType<{ className?: string }> | undefined;
                      const isChosen = selected === s.icon || currentIcon === s.icon;
                      return (
                        <button key={s.icon} type="button" onClick={() => handleSelect(s.icon)} title={`${s.icon} — ${s.reason}`}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all group ${isChosen ? 'border-violet-400 bg-violet-500/10 text-violet-300' : 'border-white/10 hover:border-violet-400/50 hover:bg-violet-500/10 text-slate-400 hover:text-violet-300'}`}
                        >
                          <div className="relative">
                            {IconComp ? <IconComp className="w-6 h-6" /> : <span className="text-xs font-mono">{s.icon.slice(0, 3)}</span>}
                            {isChosen && (
                              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-violet-500 rounded-full flex items-center justify-center">
                                <Check className="w-2 h-2 text-white" />
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-medium leading-tight text-center line-clamp-1 w-full">{s.icon}</span>
                          <span className="text-[8px] text-slate-500 leading-tight text-center">{s.score}/10</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-[10px] text-slate-600 text-center">Stored as Lucide icon name</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Shared styling ─────────────────────────────────────────────────────────────

const isRealUrl = (url?: string) =>
  !!url && (url.startsWith('http://') || url.startsWith('https://'));

const inputCls =
  'w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all text-sm';
const textareaCls = `${inputCls} resize-none`;

// ── Base field wrapper ─────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-300 ml-1">{label}</label>
      {children}
    </div>
  );
}

// ── Section divider ────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/[0.06] pb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative ${checked ? 'bg-accent-blue' : 'bg-slate-600'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-5' : 'left-1'}`} />
      </button>
    </div>
  );
}

// ── String array editor ────────────────────────────────────────────────────────

function StringArrayField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className={inputCls}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ''])}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-blue transition-colors mt-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add item
        </button>
      </div>
    </Field>
  );
}

// ── Schedule editor [{day, hours}] ────────────────────────────────────────────

type ScheduleSlot = { day: string; hours: string };

function ScheduleField({ values, onChange }: { values: ScheduleSlot[]; onChange: (v: ScheduleSlot[]) => void }) {
  return (
    <Field label="Weekly Schedule">
      <div className="space-y-2">
        {values.map((slot, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={slot.day}
              onChange={(e) => { const n = [...values]; n[i] = { ...slot, day: e.target.value }; onChange(n); }}
              className={inputCls}
              placeholder="e.g. Monday – Friday"
            />
            <input
              type="text"
              value={slot.hours}
              onChange={(e) => { const n = [...values]; n[i] = { ...slot, hours: e.target.value }; onChange(n); }}
              className={inputCls}
              placeholder="e.g. 09:00 – 17:00"
            />
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, { day: '', hours: '' }])}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-blue transition-colors mt-1">
          <Plus className="w-3.5 h-3.5" /> Add slot
        </button>
      </div>
    </Field>
  );
}

// ── Modules editor [{title, description}] ─────────────────────────────────────

type CourseModule = { title: string; description?: string };

function ModulesField({ values, onChange }: { values: CourseModule[]; onChange: (v: CourseModule[]) => void }) {
  return (
    <Field label="Modules / Course Outline">
      <div className="space-y-3">
        {values.map((mod, i) => (
          <div key={i} className="bg-[#0f1a2a] rounded-xl p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
            <input type="text" value={mod.title}
              onChange={(e) => { const n = [...values]; n[i] = { ...mod, title: e.target.value }; onChange(n); }}
              className={inputCls} placeholder="Module title *" />
            <textarea value={mod.description ?? ''}
              onChange={(e) => { const n = [...values]; n[i] = { ...mod, description: e.target.value }; onChange(n); }}
              rows={2} className={textareaCls} placeholder="Description (optional)" />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, { title: '', description: '' }])}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-blue transition-colors mt-1">
          <Plus className="w-3.5 h-3.5" /> Add module
        </button>
      </div>
    </Field>
  );
}

// ── Pricing editor [{label, price, note}] ─────────────────────────────────────

type PricingTier = { label: string; price: string; note?: string };

function PricingField({ values, onChange }: { values: PricingTier[]; onChange: (v: PricingTier[]) => void }) {
  return (
    <Field label="Pricing Tiers">
      <div className="space-y-3">
        {values.map((tier, i) => (
          <div key={i} className="bg-[#0f1a2a] rounded-xl p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={tier.label}
                onChange={(e) => { const n = [...values]; n[i] = { ...tier, label: e.target.value }; onChange(n); }}
                className={inputCls} placeholder="Label *" />
              <input type="text" value={tier.price}
                onChange={(e) => { const n = [...values]; n[i] = { ...tier, price: e.target.value }; onChange(n); }}
                className={inputCls} placeholder='Price * (e.g. "$50")' />
            </div>
            <input type="text" value={tier.note ?? ''}
              onChange={(e) => { const n = [...values]; n[i] = { ...tier, note: e.target.value }; onChange(n); }}
              className={inputCls} placeholder="Note (optional)" />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, { label: '', price: '', note: '' }])}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-blue transition-colors mt-1">
          <Plus className="w-3.5 h-3.5" /> Add pricing tier
        </button>
      </div>
    </Field>
  );
}

// ── Open hours editor [{day, hours, closed}] ──────────────────────────────────

type OpenHourEntry = { day: string; hours: string; closed: boolean };

function OpenHoursField({ values, onChange }: { values: OpenHourEntry[]; onChange: (v: OpenHourEntry[]) => void }) {
  return (
    <Field label="Opening Hours">
      <div className="space-y-2">
        {values.map((h, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={h.day}
              onChange={(e) => { const n = [...values]; n[i] = { ...h, day: e.target.value }; onChange(n); }}
              className={inputCls} placeholder="Day (e.g. Monday)" />
            <input type="text" value={h.hours} disabled={h.closed}
              onChange={(e) => { const n = [...values]; n[i] = { ...h, hours: e.target.value }; onChange(n); }}
              className={`${inputCls} ${h.closed ? 'opacity-40' : ''}`} placeholder="09:30 – 17:00" />
            <button type="button"
              onClick={() => { const n = [...values]; n[i] = { ...h, closed: !h.closed }; onChange(n); }}
              className={`shrink-0 text-[10px] px-2 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                h.closed ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}>
              {h.closed ? 'Closed' : 'Open'}
            </button>
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, { day: '', hours: '', closed: false }])}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-blue transition-colors mt-1">
          <Plus className="w-3.5 h-3.5" /> Add day
        </button>
      </div>
    </Field>
  );
}

// ── Sub-sections editor [{title, content, icon}] ──────────────────────────────

type SubSection = { title: string; content: string; icon?: string };

function SectionsField({ values, onChange }: { values: SubSection[]; onChange: (v: SubSection[]) => void }) {
  return (
    <Field label="Sub-sections">
      <div className="space-y-3">
        {values.map((sec, i) => (
          <div key={i} className="bg-[#0f1a2a] rounded-xl p-3 space-y-2 relative">
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={sec.title}
                onChange={(e) => { const n = [...values]; n[i] = { ...sec, title: e.target.value }; onChange(n); }}
                className={inputCls} placeholder="Section title" />
              <input type="text" value={sec.icon ?? ''}
                onChange={(e) => { const n = [...values]; n[i] = { ...sec, icon: e.target.value }; onChange(n); }}
                className={inputCls} placeholder="Icon identifier (optional)" />
            </div>
            <textarea value={sec.content}
              onChange={(e) => { const n = [...values]; n[i] = { ...sec, content: e.target.value }; onChange(n); }}
              rows={3} className={textareaCls} placeholder="Content" />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, { title: '', content: '', icon: '' }])}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-blue transition-colors mt-1">
          <Plus className="w-3.5 h-3.5" /> Add section
        </button>
      </div>
    </Field>
  );
}

// ── Image upload field ────────────────────────────────────────────────────────

function ImageUploadField({
  label = 'Image',
  current,
  onChange,
}: {
  label?: string;
  current?: string;
  onChange: (file: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const realCurrent = isRealUrl(current) ? current : null;

  useEffect(() => {
    setPreviewUrl(null);
  }, [current]);

  return (
    <Field label={label}>
      <div className="space-y-2">
        {(previewUrl || realCurrent) && (
          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10">
            <img
              src={previewUrl ?? realCurrent!}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {previewUrl && (
              <button
                type="button"
                onClick={() => { setPreviewUrl(null); onChange(null); }}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        <label className="flex items-center gap-3 w-full cursor-pointer bg-[#0f1a2a] border border-white/10 rounded-xl px-4 py-3 hover:border-accent-blue/50 transition-all">
          <Upload className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm text-slate-400">
            {previewUrl ? 'Change image' : realCurrent ? 'Replace current image' : 'Upload image'}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
                onChange(file);
              } else {
                setPreviewUrl(null);
                onChange(null);
              }
            }}
          />
        </label>
        {realCurrent && !previewUrl && (
          <p className="text-[11px] text-slate-600 ml-1 truncate">Current: {realCurrent.split('/').pop()}</p>
        )}
      </div>
    </Field>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Section forms
// ═══════════════════════════════════════════════════════════════════════════════

// ── Blog form ──────────────────────────────────────────────────────────────────

function BlogForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const str = (k: string) => (data[k] as string) ?? '';
  const bool = (k: string, def = false) => (data[k] as boolean) ?? def;
  const arr = (k: string) => (data[k] as string[]) ?? [];
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <FormSection title="Basic Info">
        <Field label="Title *">
          <input type="text" value={str('title')} onChange={(e) => set('title', e.target.value)}
            className={inputCls} placeholder="Post title" required autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
            <select value={str('status') || 'draft'} onChange={(e) => set('status', e.target.value)} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </Field>
          <Field label="Category">
            <input type="text" value={str('category')} onChange={(e) => set('category', e.target.value)}
              className={inputCls} placeholder="e.g. Mental Health" />
          </Field>
        </div>
        <Toggle checked={bool('isFeatured')} onChange={(v) => set('isFeatured', v)} label="Featured post" />
      </FormSection>

      <FormSection title="Content">
        <Field label="Excerpt">
          <textarea value={str('excerpt')} onChange={(e) => set('excerpt', e.target.value)}
            rows={2} className={textareaCls} placeholder="Short summary shown in listings…" />
        </Field>
        <Field label="Content *">
          <textarea value={str('content')} onChange={(e) => set('content', e.target.value)}
            rows={7} className={textareaCls} placeholder="Full article content…" required />
        </Field>
      </FormSection>

      <FormSection title="Author">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Author Name">
            <input type="text" value={str('author')} onChange={(e) => set('author', e.target.value)}
              className={inputCls} placeholder="Dr. Jane Doe" />
          </Field>
          <Field label="Author Title">
            <input type="text" value={str('authorTitle')} onChange={(e) => set('authorTitle', e.target.value)}
              className={inputCls} placeholder="Clinical Psychologist" />
          </Field>
        </div>
        <Field label="Author Avatar URL">
          <input type="text" value={str('authorAvatar')} onChange={(e) => set('authorAvatar', e.target.value)}
            className={inputCls} placeholder="https://…" />
        </Field>
      </FormSection>

      <FormSection title="Tags">
        <StringArrayField label="Tags" values={arr('tags')} onChange={(v) => set('tags', v)} placeholder="e.g. Mental Health" />
      </FormSection>

      <FormSection title="SEO & Media">
        <ImageUploadField
          label="Cover Image"
          current={str('image')}
          onChange={(file) => set('_imageFile', file)}
        />
        <Field label="Image Alt Text">
          <input type="text" value={str('imageAlt')} onChange={(e) => set('imageAlt', e.target.value)}
            className={inputCls} placeholder="Descriptive alt text for cover image" />
        </Field>
        <Field label="Meta Title">
          <input type="text" value={str('metaTitle')} onChange={(e) => set('metaTitle', e.target.value)}
            className={inputCls} placeholder="SEO page title" />
        </Field>
        <Field label="Meta Description">
          <textarea value={str('metaDescription')} onChange={(e) => set('metaDescription', e.target.value)}
            rows={2} className={textareaCls} placeholder="SEO page description" />
        </Field>
      </FormSection>
    </div>
  );
}

// ── Team form ──────────────────────────────────────────────────────────────────

function TeamForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const str = (k: string) => (data[k] as string) ?? '';
  const bool = (k: string, def = true) => (data[k] === undefined ? def : !!(data[k]));
  const arr = (k: string) => (data[k] as string[]) ?? [];
  const contact = (data.contact as Record<string, string>) ?? {};
  const social = (data.social as Record<string, string>) ?? {};
  const schedule = (data.schedule as ScheduleSlot[]) ?? [];
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <FormSection title="Identity">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name *">
            <input type="text" value={str('name')} onChange={(e) => set('name', e.target.value)}
              className={inputCls} placeholder="Dr. Jane Doe" required autoFocus />
          </Field>
          <Field label="Job Title *">
            <input type="text" value={str('title')} onChange={(e) => set('title', e.target.value)}
              className={inputCls} placeholder="Clinical Psychologist" required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Specialty *">
            <input type="text" value={str('specialty')} onChange={(e) => set('specialty', e.target.value)}
              className={inputCls} placeholder="Anxiety Disorders" required />
          </Field>
          <Field label="Tagline">
            <input type="text" value={str('tagline')} onChange={(e) => set('tagline', e.target.value)}
              className={inputCls} placeholder="Short one-liner…" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Profile Image">
        <ImageUploadField
          current={str('image')}
          onChange={(file) => set('_imageFile', file)}
        />
      </FormSection>

      <FormSection title="Bio">
        <Field label="Biography *">
          <textarea value={str('bio')} onChange={(e) => set('bio', e.target.value)}
            rows={4} className={textareaCls} placeholder="Professional bio…" required />
        </Field>
      </FormSection>

      <FormSection title="Professional">
        <Field label="Experience">
          <input type="text" value={str('experience')} onChange={(e) => set('experience', e.target.value)}
            className={inputCls} placeholder="e.g. 12 years" />
        </Field>
        <StringArrayField label="Education" values={arr('education')} onChange={(v) => set('education', v)} placeholder="e.g. MSc Psychology, UCT" />
        <StringArrayField label="Areas of Expertise" values={arr('specialties')} onChange={(v) => set('specialties', v)} placeholder="e.g. Trauma Therapy" />
        <StringArrayField label="Languages" values={arr('languages')} onChange={(v) => set('languages', v)} placeholder="e.g. English" />
        <StringArrayField label="Awards & Recognitions" values={arr('awards')} onChange={(v) => set('awards', v)} placeholder="e.g. Best Clinician 2023" />
      </FormSection>

      <FormSection title="Contact">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone">
            <input type="text" value={contact.phone ?? ''} onChange={(e) => set('contact', { ...contact, phone: e.target.value })}
              className={inputCls} placeholder="+27 XX XXX XXXX" />
          </Field>
          <Field label="Email">
            <input type="email" value={contact.email ?? ''} onChange={(e) => set('contact', { ...contact, email: e.target.value })}
              className={inputCls} placeholder="dr@example.com" />
          </Field>
        </div>
        <Field label="Address">
          <input type="text" value={contact.address ?? ''} onChange={(e) => set('contact', { ...contact, address: e.target.value })}
            className={inputCls} placeholder="Office address" />
        </Field>
      </FormSection>

      <FormSection title="Social Media">
        <div className="grid grid-cols-2 gap-4">
          <Field label="LinkedIn">
            <input type="text" value={social.linkedin ?? ''} onChange={(e) => set('social', { ...social, linkedin: e.target.value })}
              className={inputCls} placeholder="https://linkedin.com/in/…" />
          </Field>
          <Field label="Instagram">
            <input type="text" value={social.instagram ?? ''} onChange={(e) => set('social', { ...social, instagram: e.target.value })}
              className={inputCls} placeholder="https://instagram.com/…" />
          </Field>
          <Field label="Twitter / X">
            <input type="text" value={social.twitter ?? ''} onChange={(e) => set('social', { ...social, twitter: e.target.value })}
              className={inputCls} placeholder="https://twitter.com/…" />
          </Field>
          <Field label="Facebook">
            <input type="text" value={social.facebook ?? ''} onChange={(e) => set('social', { ...social, facebook: e.target.value })}
              className={inputCls} placeholder="https://facebook.com/…" />
          </Field>
        </div>
        <Field label="YouTube">
          <input type="text" value={social.youtube ?? ''} onChange={(e) => set('social', { ...social, youtube: e.target.value })}
            className={inputCls} placeholder="https://youtube.com/…" />
        </Field>
      </FormSection>

      <FormSection title="Weekly Schedule">
        <ScheduleField values={schedule} onChange={(v) => set('schedule', v)} />
      </FormSection>

      <FormSection title="Settings">
        <Toggle checked={bool('isActive')} onChange={(v) => set('isActive', v)} label="Active (visible on website)" />
      </FormSection>
    </div>
  );
}

// ── Services form ──────────────────────────────────────────────────────────────

function ServiceForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const str = (k: string) => (data[k] as string) ?? '';
  const bool = (k: string, def = false) => (data[k] === undefined ? def : !!(data[k]));
  const arr = (k: string) => (data[k] as string[]) ?? [];
  const modules = (data.modules as CourseModule[]) ?? [];
  const pricing = (data.pricing as PricingTier[]) ?? [];
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <FormSection title="Core">
        <Field label="Title *">
          <input type="text" value={str('title')} onChange={(e) => set('title', e.target.value)}
            className={inputCls} placeholder="Service name" required autoFocus />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type *">
            <select value={str('type') || 'clinic'} onChange={(e) => set('type', e.target.value)} className={inputCls}>
              <option value="clinic">Clinic</option>
              <option value="institute">Institute</option>
              <option value="research">Research</option>
            </select>
          </Field>
          <Field label="Category *">
            <input type="text" value={str('category')} onChange={(e) => set('category', e.target.value)}
              className={inputCls} placeholder="e.g. Outpatient" required />
          </Field>
        </div>
        <Field label="Short Description *">
          <textarea value={str('shortDescription')} onChange={(e) => set('shortDescription', e.target.value)}
            rows={2} className={textareaCls} placeholder="Brief description shown in listings…" required />
        </Field>
        <Field label="Full Description">
          <textarea value={str('fullDescription')} onChange={(e) => set('fullDescription', e.target.value)}
            rows={4} className={textareaCls} placeholder="Detailed description for the service detail page…" />
        </Field>
      </FormSection>

      <FormSection title="Media">
        <ImageUploadField
          current={str('image')}
          onChange={(file) => set('_imageFile', file)}
        />
        <Field label="Icon">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {str('icon') && (() => {
                const IC = (LucideIcons as Record<string, unknown>)[str('icon')] as React.ComponentType<{ className?: string }> | undefined;
                return IC ? (
                  <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    <IC className="w-5 h-5" />
                  </span>
                ) : null;
              })()}
              <input type="text" value={str('icon')} onChange={(e) => set('icon', e.target.value)}
                className={inputCls} placeholder="Heart · Brain · Stethoscope (Lucide name)" />
            </div>
            <IconSuggestButton
              title={str('title')}
              shortDescription={str('shortDescription')}
              currentIcon={str('icon')}
              onSelect={(name) => set('icon', name)}
            />
          </div>
        </Field>
      </FormSection>

      <FormSection title="Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Program Type">
            <input type="text" value={str('programType')} onChange={(e) => set('programType', e.target.value)}
              className={inputCls} placeholder="e.g. Certificate" />
          </Field>
          <Field label="Duration">
            <input type="text" value={str('duration')} onChange={(e) => set('duration', e.target.value)}
              className={inputCls} placeholder="e.g. 5 Months (10 Modules)" />
          </Field>
        </div>
        <Field label="Specialists / Schedule">
          <input type="text" value={str('specialists')} onChange={(e) => set('specialists', e.target.value)}
            className={inputCls} placeholder="e.g. Mon–Thu & Sun, 6–9 PM" />
        </Field>
      </FormSection>

      <FormSection title="Features & Benefits">
        <StringArrayField label="Features" values={arr('features')} onChange={(v) => set('features', v)} placeholder="e.g. Evidence-based approach" />
        <StringArrayField label="Benefits" values={arr('benefits')} onChange={(v) => set('benefits', v)} placeholder="e.g. Personalized care plan" />
      </FormSection>

      <FormSection title="Learning">
        <StringArrayField label="Learning Objectives" values={arr('learningObjectives')} onChange={(v) => set('learningObjectives', v)} placeholder="e.g. Understand CBT principles" />
        <ModulesField values={modules} onChange={(v) => set('modules', v)} />
      </FormSection>

      <FormSection title="Pricing">
        <PricingField values={pricing} onChange={(v) => set('pricing', v)} />
      </FormSection>

      <FormSection title="Settings">
        <Toggle checked={bool('isPublished')} onChange={(v) => set('isPublished', v)} label="Published (visible on website)" />
      </FormSection>
    </div>
  );
}

// ── FAQ form ───────────────────────────────────────────────────────────────────

const FAQ_TYPES = ['General', 'Services', 'Treatment', 'Pricing', 'Insurance', 'Other'] as const;

function FaqForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const str = (k: string) => (data[k] as string) ?? '';
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      <Field label="Question *">
        <input type="text" value={str('question')} onChange={(e) => set('question', e.target.value)}
          className={inputCls} placeholder="e.g. Do you accept insurance?" required autoFocus />
      </Field>
      <Field label="Category">
        <select value={str('type') || 'General'} onChange={(e) => set('type', e.target.value)} className={inputCls}>
          {FAQ_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Answer *">
        <textarea value={str('answer')} onChange={(e) => set('answer', e.target.value)}
          rows={5} className={textareaCls} placeholder="Detailed answer…" required />
      </Field>
    </div>
  );
}

// ── About form ─────────────────────────────────────────────────────────────────

function AboutForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const str = (k: string) => (data[k] as string) ?? '';
  const bool = (k: string, def = true) => (data[k] === undefined ? def : !!(data[k]));
  const arr = (k: string) => (data[k] as string[]) ?? [];
  const openHours = (data.openHours as OpenHourEntry[]) ?? [];
  const sections = (data.sections as SubSection[]) ?? [];
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <FormSection title="Hero">
        <Field label="Title *">
          <input type="text" value={str('title')} onChange={(e) => set('title', e.target.value)}
            className={inputCls} placeholder="About ANCHOR Africa" required autoFocus />
        </Field>
        <Field label="Description *">
          <textarea value={str('description')} onChange={(e) => set('description', e.target.value)}
            rows={4} className={textareaCls} placeholder="Organisation description…" required />
        </Field>
      </FormSection>

      <FormSection title="Media">
        <ImageUploadField
          current={str('image')}
          onChange={(file) => set('_imageFile', file)}
        />
      </FormSection>

      <FormSection title="Contact & CTA">
        <Field label="Phone">
          <input type="text" value={str('phone')} onChange={(e) => set('phone', e.target.value)}
            className={inputCls} placeholder="+27 XX XXX XXXX" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Button Text">
            <input type="text" value={str('ctaText') || 'Appointment'} onChange={(e) => set('ctaText', e.target.value)}
              className={inputCls} placeholder="Appointment" />
          </Field>
          <Field label="CTA Button Link">
            <input type="text" value={str('ctaLink') || '/appointment'} onChange={(e) => set('ctaLink', e.target.value)}
              className={inputCls} placeholder="/appointment" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Features / Bullet List">
        <StringArrayField label="Features" values={arr('features')} onChange={(v) => set('features', v)} placeholder="e.g. Evidence-based care" />
      </FormSection>

      <FormSection title="Opening Hours">
        <OpenHoursField values={openHours} onChange={(v) => set('openHours', v)} />
      </FormSection>

      <FormSection title="Sub-sections">
        <SectionsField values={sections} onChange={(v) => set('sections', v)} />
      </FormSection>

      <FormSection title="Settings">
        <Toggle checked={bool('visible')} onChange={(v) => set('visible', v)} label="Visible on public website" />
      </FormSection>
    </div>
  );
}

// ── Section metadata ───────────────────────────────────────────────────────────

const SECTION_META: Record<BackendSectionId, { label: string; noun: string }> = {
  blog: { label: 'Blog Posts', noun: 'Post' },
  team: { label: 'Team Members', noun: 'Member' },
  services: { label: 'Services', noun: 'Service' },
  faq: { label: 'FAQ', noun: 'Question' },
  about: { label: 'About Section', noun: 'About' },
};

const SECTION_DEFAULTS: Record<BackendSectionId, Record<string, unknown>> = {
  blog: { status: 'draft', isFeatured: false, tags: [] },
  team: {
    isActive: true,
    education: [],
    specialties: [],
    languages: [],
    awards: [],
    schedule: [],
    contact: { phone: '', email: '', address: '' },
    social: { linkedin: '', instagram: '', twitter: '', facebook: '', youtube: '' },
  },
  services: {
    isPublished: false,
    type: 'clinic',
    features: [],
    benefits: [],
    learningObjectives: [],
    modules: [],
    pricing: [],
  },
  faq: { type: 'General' },
  about: {
    visible: true,
    features: [],
    openHours: [],
    sections: [],
    ctaText: 'Appointment',
    ctaLink: '/appointment',
  },
};

// ── Main component ─────────────────────────────────────────────────────────────

interface BackendModalProps {
  open: boolean;
  sectionId: BackendSectionId;
  rawItem?: BlogPost | TeamMember | Service | FaqReason | About | null;
  onClose: () => void;
  onSave: (data: BackendSaveData) => void;
  isSaving?: boolean;
}

export function BackendModal({ open, sectionId, rawItem, onClose, onSave, isSaving }: BackendModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (open) {
      setFormData(
        rawItem
          ? { ...(rawItem as unknown as Record<string, unknown>) }
          : { ...SECTION_DEFAULTS[sectionId] },
      );
    }
  }, [open, rawItem, sectionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Changing the key remounts the form when switching items, resetting file-input state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemKey = rawItem ? `edit-${(rawItem as any)._id ?? (rawItem as any).question ?? 'item'}` : 'create';

  const meta = SECTION_META[sectionId];

  return (
    <AnimatePresence>
      {open && (
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
            {/* Header — stays fixed */}
            <div className="shrink-0 flex items-center justify-between p-6 border-b border-white/10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {rawItem ? `Edit ${meta.noun}` : `New ${meta.noun}`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  {meta.label}
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                    Live API
                  </span>
                </p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form id="backend-modal-form" key={itemKey} onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto scrollbar-brand p-6">
                {sectionId === 'blog'     && <BlogForm    data={formData} onChange={setFormData} />}
                {sectionId === 'team'     && <TeamForm    data={formData} onChange={setFormData} />}
                {sectionId === 'services' && <ServiceForm data={formData} onChange={setFormData} />}
                {sectionId === 'faq'      && <FaqForm     data={formData} onChange={setFormData} />}
                {sectionId === 'about'    && <AboutForm   data={formData} onChange={setFormData} />}
              </div>

              {/* Footer — stays fixed */}
              <div className="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-white/10 rounded-b-2xl">
                <button type="button" onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving}
                  className="bg-accent-blue hover:bg-[#4ab0d6] disabled:opacity-60 disabled:cursor-not-allowed text-[#0f1a2a] px-6 py-2 rounded-xl text-sm font-bold transition-all">
                  {isSaving ? 'Saving…' : rawItem ? 'Save Changes' : `Create ${meta.noun}`}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
