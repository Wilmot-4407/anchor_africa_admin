import React, { useState } from 'react';
import { Eye, Pencil, ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { createField, type FormField, type FieldType } from '../data/formFieldTypes';
import { formTemplates, instantiateTemplate, type FormTemplate } from '../data/formTemplates';
import { FieldPalette } from '../components/forms/FieldPalette';
import { FieldCard } from '../components/forms/FieldCard';
import { FormPreview } from '../components/forms/FormPreview';

export function FormBuilder() {
  const [started, setStarted] = useState(false);
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  const startWithTemplate = (template: FormTemplate) => {
    setTitle(template.title);
    setDescription(template.formDescription);
    const f = instantiateTemplate(template);
    setFields(f);
    setActiveId(f[0]?.id ?? null);
    setStarted(true);
  };

  const addField = (type: FieldType) => {
    const field = createField(type);
    setFields((prev) => {
      if (!activeId) return [...prev, field];
      const idx = prev.findIndex((f) => f.id === activeId);
      const next = [...prev];
      next.splice(idx + 1, 0, field);
      return next;
    });
    setActiveId(field.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) =>
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));

  const deleteField = (id: string) =>
    setFields((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (activeId === id) setActiveId(next[0]?.id ?? null);
      return next;
    });

  const duplicateField = (field: FormField) =>
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === field.id);
      const copy = { ...field, id: Math.random().toString(36).slice(2, 9) };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      setActiveId(copy.id);
      return next;
    });

  const moveField = (index: number, direction: 'up' | 'down') =>
    setFields((prev) => {
      const swap = direction === 'up' ? index - 1 : index + 1;
      if (swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  // Template picker
  if (!started) {
    return (
      <div className="flex h-screen bg-[#0f1a2a] font-sans text-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Topbar />
          <div className="flex-1 overflow-y-auto p-8 scrollbar-brand">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Create a Form</h1>
                <p className="text-slate-300 text-sm">
                  Start from a ready-made template or build any form from scratch.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {formTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => startWithTemplate(tpl)}
                    className="group text-left bg-[#1b2940] rounded-2xl border border-white/10 p-6 hover:border-accent-blue/50 hover:bg-[#1f2e48] transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center mb-4 group-hover:bg-accent-blue group-hover:text-[#0f1a2a] transition-colors">
                      <tpl.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{tpl.name}</h3>
                    <p className="text-sm text-slate-400">{tpl.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Builder
  return (
    <div className="flex h-screen bg-[#0f1a2a] font-sans text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* Form builder top bar */}
        <div className="bg-[#1b2940] border-b border-white/10 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setStarted(false)}
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Back to templates"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-lg font-bold text-white focus:outline-none focus:border-b focus:border-accent-blue truncate"
            />
            <span className="px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-slate-400 shrink-0">
              Draft
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center bg-[#0f1a2a] border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setPreview(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  !preview ? 'bg-accent-blue/15 text-accent-blue' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setPreview(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  preview ? 'bg-accent-blue/15 text-accent-blue' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-primary-light" /> Saved
                </>
              ) : (
                'Save'
              )}
            </button>
            <button className="bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent-blue/20">
              Publish
            </button>
          </div>
        </div>

        {preview ? (
          <div className="flex-1 overflow-y-auto p-8 scrollbar-brand">
            <FormPreview title={title} description={description} fields={fields} />
          </div>
        ) : (
          <div className="flex-1 flex gap-6 p-6 overflow-hidden">
            <FieldPalette onAdd={addField} />

            <div className="flex-1 overflow-y-auto scrollbar-brand min-w-0">
              <div className="max-w-2xl mx-auto space-y-5 pb-24">
                <div className="bg-[#1b2940] rounded-2xl border-t-8 border-t-accent-blue border-x border-b border-white/10 p-8">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-3xl font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-b-2 focus:border-accent-blue pb-2 transition-all mb-3"
                    placeholder="Form Title"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-transparent text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-b-2 focus:border-accent-blue pb-2 transition-all resize-none"
                    placeholder="Form description (optional)"
                  />
                </div>

                <AnimatePresence initial={false}>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                    >
                      <FieldCard
                        field={field}
                        index={index}
                        total={fields.length}
                        isActive={activeId === field.id}
                        onActivate={() => setActiveId(field.id)}
                        onUpdate={(u) => updateField(field.id, u)}
                        onDelete={() => deleteField(field.id)}
                        onDuplicate={() => duplicateField(field)}
                        onMove={(d) => moveField(index, d)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {fields.length === 0 && (
                  <div className="bg-[#1b2940] rounded-2xl border border-dashed border-white/15 p-12 text-center text-slate-400">
                    <p className="font-medium text-slate-300 mb-1">No fields yet</p>
                    <p className="text-sm">Pick a field type from the left panel to start building.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
