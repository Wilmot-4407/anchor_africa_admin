import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Pencil, Check, ChevronUp, ChevronDown, GripVertical,
  Trash2, Copy, Star, AlertCircle, Columns2, RectangleHorizontal,
} from 'lucide-react';
import { fieldTypeMap, createField, type FormField, type FieldType } from '../../data/formFieldTypes';
import { FieldPalette } from '../forms/FieldPalette';
import { FormPreview } from '../forms/FormPreview';
import { FieldSettingsPanel } from './FieldSettingsPanel';

export interface BuilderSavePayload {
  title: string;
  description: string;
  fields: FormField[];
  status: 'draft' | 'active';
}

interface FormBuilderCoreProps {
  initialTitle?: string;
  initialDescription?: string;
  initialFields?: FormField[];
  onSave?: (payload: BuilderSavePayload) => void;
  saveLabel?: string;
  publishLabel?: string;
  isSaving?: boolean;
}

interface CanvasCardProps {
  field: FormField;
  index: number;
  total: number;
  isActive: boolean;
  onActivate: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (dir: 'up' | 'down') => void;
  onWidthChange: (colSpan: 1 | 2) => void;
}

function FieldActions({ onDelete, onDuplicate }: { onDelete: () => void; onDuplicate: () => void }) {
  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={e => { e.stopPropagation(); onDuplicate(); }}
        title="Duplicate"
        className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        title="Delete"
        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function CanvasFieldCard({
  field, index, total, isActive, onActivate, onDelete, onDuplicate, onMove, onWidthChange,
}: CanvasCardProps) {
  const meta = fieldTypeMap[field.type];
  const [layoutMenu, setLayoutMenu] = useState(false);
  const colSpan = field.colSpan ?? 2;

  return (
    <div
      onClick={onActivate}
      className={`relative bg-[#1b2940] rounded-2xl border transition-all cursor-pointer group ${
        isActive
          ? 'border-accent-blue shadow-lg shadow-accent-blue/10'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {isActive && (
        <div className="absolute -left-px top-0 bottom-0 w-1 bg-accent-blue rounded-l-2xl" />
      )}

      {/* Reorder + layout rail */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); onMove('up'); }}
          disabled={index === 0}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setLayoutMenu(v => !v); }}
            title="Column width"
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <GripVertical className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors" />
          </button>
          <AnimatePresence>
            {layoutMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={e => { e.stopPropagation(); setLayoutMenu(false); }} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute left-9 top-1/2 -translate-y-1/2 bg-[#0f1a2a] border border-white/10 rounded-xl shadow-xl z-20 p-2 w-36"
                  onClick={e => e.stopPropagation()}
                >
                  <p className="text-[10px] text-slate-500 px-1.5 mb-1.5 font-semibold uppercase tracking-wide">Width</p>
                  <button
                    onClick={() => { onWidthChange(2); setLayoutMenu(false); }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      colSpan === 2 ? 'text-accent-blue bg-accent-blue/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <RectangleHorizontal className="w-3.5 h-3.5 shrink-0" /> Full width
                  </button>
                  <button
                    onClick={() => { onWidthChange(1); setLayoutMenu(false); }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      colSpan === 1 ? 'text-accent-blue bg-accent-blue/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Columns2 className="w-3.5 h-3.5 shrink-0" /> Half width
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onMove('down'); }}
          disabled={index === total - 1}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div className="pl-10 pr-4 py-4">
        {field.type === 'heading' ? (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{field.question || 'Section Heading'}</h3>
            <FieldActions onDelete={onDelete} onDuplicate={onDuplicate} />
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <meta.icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white leading-snug">
                    {field.question || 'Untitled field'}
                    {field.required && <span className="text-red-400 ml-0.5">*</span>}
                  </p>
                  {field.helpText && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{field.helpText}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-medium text-slate-500 bg-white/5 border border-white/10 rounded-md px-1.5 py-0.5 whitespace-nowrap">
                  {meta.label}
                </span>
                <FieldActions onDelete={onDelete} onDuplicate={onDuplicate} />
              </div>
            </div>

            {field.options && field.options.length > 0 && (
              <div className="mt-3 pl-9 flex flex-wrap gap-1.5">
                {field.options.slice(0, 3).map((opt, i) => (
                  <span key={i} className="text-[11px] text-slate-500 bg-white/[0.04] border border-white/[0.06] rounded-md px-2 py-0.5">
                    {opt}
                  </span>
                ))}
                {field.options.length > 3 && (
                  <span className="text-[11px] text-slate-600">+{field.options.length - 3} more</span>
                )}
              </div>
            )}

            {field.type === 'rating' && (
              <div className="mt-2.5 pl-9 flex gap-1 text-slate-600">
                {[1, 2, 3, 4, 5].map(n => <Star key={n} className="w-3.5 h-3.5" />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FormBuilderCore({
  initialTitle = 'Untitled Form',
  initialDescription = '',
  initialFields = [],
  onSave,
  saveLabel = 'Save Draft',
  publishLabel = 'Publish',
  isSaving = false,
}: FormBuilderCoreProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [activeId, setActiveId] = useState<string | null>(initialFields[0]?.id ?? null);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const isFirstRender = useRef(true);

  const activeField = fields.find(f => f.id === activeId) ?? null;

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setIsDirty(true);
  }, [title, description, fields]);

  const addField = (type: FieldType) => {
    const field = createField(type);
    setFields(prev => {
      if (!activeId) return [...prev, field];
      const idx = prev.findIndex(f => f.id === activeId);
      const next = [...prev];
      next.splice(idx + 1, 0, field);
      return next;
    });
    setActiveId(field.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) =>
    setFields(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));

  const deleteField = (id: string) =>
    setFields(prev => {
      const next = prev.filter(f => f.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });

  const duplicateField = (field: FormField) =>
    setFields(prev => {
      const idx = prev.findIndex(f => f.id === field.id);
      const copy: FormField = { ...field, id: Math.random().toString(36).slice(2, 9) };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      setActiveId(copy.id);
      return next;
    });

  const moveField = (index: number, direction: 'up' | 'down') =>
    setFields(prev => {
      const swap = direction === 'up' ? index - 1 : index + 1;
      if (swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });

  const handleSave = (status: 'draft' | 'active' = 'draft') => {
    setIsDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    onSave?.({ title, description, fields, status });
  };

  const fieldCount = fields.filter(f => f.type !== 'heading').length;
  const requiredCount = fields.filter(f => f.required).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="bg-[#111d2e] border-b border-white/[0.06] px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-transparent text-base font-bold text-white focus:outline-none focus:border-b focus:border-accent-blue truncate min-w-0"
          />
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-semibold uppercase tracking-wide">
              Draft
            </span>
            {fieldCount > 0 && (
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {fieldCount} field{fieldCount !== 1 ? 's' : ''}
                {requiredCount > 0 && `, ${requiredCount} required`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-[#0f1a2a] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setPreview(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                !preview ? 'bg-accent-blue/15 text-accent-blue' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={() => setPreview(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                preview ? 'bg-accent-blue/15 text-accent-blue' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving || !isDirty}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving
              ? <><span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0"><span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" /><span className="absolute inset-0 rounded-full bg-current" /></span> Saving…</>
              : saved
              ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Saved</>
              : saveLabel}
          </button>
          <button
            onClick={() => handleSave('active')}
            disabled={isSaving || !isDirty}
            className="bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-accent-blue/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isSaving ? <><span className="relative inline-flex w-3.5 h-3.5 flex-shrink-0"><span className="animate-ping absolute inset-0 rounded-full bg-current opacity-75" /><span className="absolute inset-0 rounded-full bg-current" /></span> Saving…</> : publishLabel}
          </button>
        </div>
      </div>

      {/* Body */}
      {preview ? (
        <div className="flex-1 overflow-y-auto scrollbar-brand p-6">
          <FormPreview title={title} description={description} fields={fields} />
        </div>
      ) : (
        <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
          {/* Left palette */}
          <FieldPalette onAdd={addField} />

          {/* Center canvas */}
          <div className="flex-1 overflow-y-auto scrollbar-brand min-w-0">
            <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3 pb-20">
              {/* Form header card — always full width */}
              <div className="col-span-2 bg-[#1b2940] rounded-2xl border-t-[6px] border-t-accent-blue border-x border-b border-white/10 p-6">
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold text-white placeholder:text-slate-600 focus:outline-none border-b-2 border-transparent focus:border-accent-blue pb-1 transition-all mb-2"
                  placeholder="Form Title"
                />
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-transparent text-slate-300 text-sm placeholder:text-slate-600 focus:outline-none border-b-2 border-transparent focus:border-accent-blue pb-1 transition-all resize-none"
                  placeholder="Form description (optional)"
                />
              </div>

              {/* Fields */}
              <AnimatePresence initial={false}>
                {fields.map((field, index) => {
                  const span = field.type === 'heading' ? 2 : (field.colSpan ?? 2);
                  return (
                    <motion.div
                      key={field.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className={span === 1 ? 'col-span-1' : 'col-span-2'}
                    >
                      <CanvasFieldCard
                        field={field}
                        index={index}
                        total={fields.length}
                        isActive={activeId === field.id}
                        onActivate={() => setActiveId(field.id)}
                        onDelete={() => deleteField(field.id)}
                        onDuplicate={() => duplicateField(field)}
                        onMove={dir => moveField(index, dir)}
                        onWidthChange={colSpan => updateField(field.id, { colSpan })}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {fields.length === 0 && (
                <div className="col-span-2 bg-[#1b2940] rounded-2xl border border-dashed border-white/15 p-12 text-center">
                  <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="font-medium text-slate-300 mb-1">No fields yet</p>
                  <p className="text-sm text-slate-500">Pick a field type from the left panel to start building</p>
                </div>
              )}
            </div>
          </div>

          {/* Right settings */}
          <FieldSettingsPanel field={activeField} onUpdate={updateField} />
        </div>
      )}
    </div>
  );
}
