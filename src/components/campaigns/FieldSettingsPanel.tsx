import { Plus, X, Settings } from 'lucide-react';
import { fieldTypes, fieldTypeMap, type FormField, type FieldType } from '../../data/formFieldTypes';

interface FieldSettingsPanelProps {
  field: FormField | null;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
}

export function FieldSettingsPanel({ field, onUpdate }: FieldSettingsPanelProps) {
  if (!field) {
    return (
      <div className="w-72 shrink-0 bg-[#1b2940] rounded-2xl border border-white/10 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Settings className="w-6 h-6 text-slate-600" />
        </div>
        <p className="text-sm font-medium text-slate-400">No field selected</p>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Click a field on the canvas to edit its settings here
        </p>
      </div>
    );
  }

  const meta = fieldTypeMap[field.type];
  const hasOptions = !!meta.hasOptions;
  const isLayout = !!meta.layoutOnly;
  const options = field.options ?? [];

  const update = (updates: Partial<FormField>) => onUpdate(field.id, updates);

  return (
    <div className="w-72 shrink-0 bg-[#1b2940] rounded-2xl border border-white/10 flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0">
          <meta.icon className="w-4 h-4 text-accent-blue" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white truncate">Field Settings</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{meta.label}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-brand p-4 space-y-5">
        {/* Label / Question */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {isLayout ? 'Heading Text' : 'Question Label'}
          </label>
          <input
            type="text"
            value={field.question}
            onChange={e => update({ question: e.target.value })}
            className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
            placeholder={isLayout ? 'Section heading…' : 'Enter question…'}
          />
        </div>

        {/* Field Type */}
        {!isLayout && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Field Type
            </label>
            <select
              value={field.type}
              onChange={e => {
                const newType = e.target.value as FieldType;
                const newMeta = fieldTypeMap[newType];
                update({
                  type: newType,
                  options: newMeta.hasOptions ? (field.options?.length ? field.options : ['Option 1', 'Option 2']) : undefined,
                });
              }}
              className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all appearance-none cursor-pointer"
            >
              {fieldTypes.filter(ft => !ft.layoutOnly).map(ft => (
                <option key={ft.type} value={ft.type}>{ft.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Placeholder — text-based fields */}
        {!isLayout && ['short_text', 'long_text', 'email', 'phone', 'number'].includes(field.type) && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Placeholder Text
            </label>
            <input
              type="text"
              value={field.placeholder ?? ''}
              onChange={e => update({ placeholder: e.target.value })}
              className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
              placeholder="e.g. Enter your answer…"
            />
          </div>
        )}

        {/* Help Text */}
        {!isLayout && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Help Text
            </label>
            <textarea
              rows={2}
              value={field.helpText ?? ''}
              onChange={e => update({ helpText: e.target.value || undefined })}
              className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all resize-none"
              placeholder="Hint shown below the question…"
            />
          </div>
        )}

        {/* Options editor */}
        {hasOptions && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Options
            </label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 border border-slate-600 shrink-0 ${field.type === 'checkboxes' ? 'rounded' : 'rounded-full'}`} />
                  <input
                    type="text"
                    value={opt}
                    onChange={e => {
                      const next = [...options];
                      next[i] = e.target.value;
                      update({ options: next });
                    }}
                    className="flex-1 bg-[#0f1a2a] border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                    placeholder={`Option ${i + 1}`}
                  />
                  {options.length > 1 && (
                    <button
                      onClick={() => update({ options: options.filter((_, idx) => idx !== i) })}
                      className="p-1 text-slate-600 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => update({ options: [...options, `Option ${options.length + 1}`] })}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-blue transition-colors pt-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add option
              </button>
            </div>
          </div>
        )}

        {/* Required toggle */}
        {!isLayout && (
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div>
              <p className="text-sm font-medium text-white">Required</p>
              <p className="text-xs text-slate-500 mt-0.5">Respondents must answer</p>
            </div>
            <button
              type="button"
              onClick={() => update({ required: !field.required })}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${field.required ? 'bg-accent-blue' : 'bg-white/10'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${
                  field.required ? 'left-[26px]' : 'left-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
