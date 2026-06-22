import { Trash2, Copy, ChevronUp, ChevronDown, GripVertical, X, Plus } from 'lucide-react';
import { fieldTypeMap, fieldTypes, type FormField, type FieldType } from '../../data/formFieldTypes';

interface FieldCardProps {
  field: FormField;
  index: number;
  total: number;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (direction: 'up' | 'down') => void;
}

export function FieldCard({
  field,
  index,
  total,
  isActive,
  onActivate,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
}: FieldCardProps) {
  const meta = fieldTypeMap[field.type];
  const hasOptions = !!meta.hasOptions;

  if (field.type === 'heading') {
    return (
      <div
        onClick={onActivate}
        className={`bg-[#1b2940] rounded-2xl border transition-all relative ${
          isActive ? 'border-accent-blue/50' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <ReorderRail index={index} total={total} onMove={onMove} active={isActive} />
        <div className="pl-12 pr-6 py-5">
          {isActive ? (
            <input
              type="text"
              value={field.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              className="w-full bg-transparent text-xl font-bold text-white focus:outline-none border-b border-white/10 focus:border-accent-blue pb-1 transition-colors"
              placeholder="Section heading"
            />
          ) : (
            <h3 className="text-xl font-bold text-white">{field.question}</h3>
          )}
          {isActive && (
            <CardActions field={field} onDelete={onDelete} onDuplicate={onDuplicate} onUpdate={onUpdate} hideRequired />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onActivate}
      className={`bg-[#1b2940] rounded-2xl border transition-all relative ${
        isActive ? 'border-accent-blue/50 shadow-lg shadow-accent-blue/5' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <ReorderRail index={index} total={total} onMove={onMove} active={isActive} />
      <div className="pl-12 pr-6 py-6">
        {isActive ? (
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <input
                type="text"
                value={field.question}
                onChange={(e) => onUpdate({ question: e.target.value })}
                className="flex-1 bg-[#0f1a2a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all font-medium"
                placeholder="Question"
              />
              <select
                value={field.type}
                onChange={(e) => {
                  const newType = e.target.value as FieldType;
                  const newMeta = fieldTypeMap[newType];
                  onUpdate({
                    type: newType,
                    options: newMeta.hasOptions ? field.options ?? ['Option 1', 'Option 2'] : undefined,
                  });
                }}
                className="w-44 bg-[#0f1a2a] border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all appearance-none text-sm"
              >
                {fieldTypes.map((ft) => (
                  <option key={ft.type} value={ft.type}>
                    {ft.label}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={field.helpText ?? ''}
              onChange={(e) => onUpdate({ helpText: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 focus:border-accent-blue focus:outline-none py-1.5 text-sm text-slate-400 transition-colors"
              placeholder="Add help text (optional)"
            />

            {hasOptions && <OptionsEditor field={field} onUpdate={onUpdate} />}

            <CardActions field={field} onDelete={onDelete} onDuplicate={onDuplicate} onUpdate={onUpdate} />
          </div>
        ) : (
          <FieldPreviewInline field={field} />
        )}
      </div>
    </div>
  );
}

function ReorderRail({
  index,
  total,
  onMove,
  active,
}: {
  index: number;
  total: number;
  onMove: (d: 'up' | 'down') => void;
  active: boolean;
}) {
  return (
    <>
      {active && <div className="absolute -left-px top-0 bottom-0 w-1.5 bg-accent-blue rounded-l-2xl" />}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center justify-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onMove('up'); }}
          disabled={index === 0}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
          aria-label="Move up"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <GripVertical className="w-4 h-4 text-slate-500" />
        <button
          onClick={(e) => { e.stopPropagation(); onMove('down'); }}
          disabled={index === total - 1}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
          aria-label="Move down"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

function OptionsEditor({ field, onUpdate }: { field: FormField; onUpdate: (u: Partial<FormField>) => void }) {
  const options = field.options ?? [];
  const shape = field.type === 'checkboxes' ? 'rounded' : 'rounded-full';
  return (
    <div className="space-y-2.5">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`w-4 h-4 border border-slate-500 ${shape}`} />
          <input
            type="text"
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              onUpdate({ options: next });
            }}
            className="flex-1 bg-transparent border-b border-transparent hover:border-white/10 focus:border-accent-blue focus:outline-none py-1 text-slate-300 transition-colors"
          />
          {options.length > 1 && (
            <button
              onClick={() => onUpdate({ options: options.filter((_, idx) => idx !== i) })}
              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
              aria-label="Remove option"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={() => onUpdate({ options: [...options, `Option ${options.length + 1}`] })}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-accent-blue transition-colors pt-1"
      >
        <Plus className="w-4 h-4" /> Add option
      </button>
    </div>
  );
}

function CardActions({
  field,
  onDelete,
  onDuplicate,
  onUpdate,
  hideRequired,
}: {
  field: FormField;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (u: Partial<FormField>) => void;
  hideRequired?: boolean;
}) {
  return (
    <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-end gap-3">
      <button
        onClick={onDuplicate}
        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        title="Duplicate"
      >
        <Copy className="w-5 h-5" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        title="Delete"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      {!hideRequired && (
        <>
          <div className="w-px h-6 bg-white/10" />
          <button
            type="button"
            onClick={() => onUpdate({ required: !field.required })}
            className="flex items-center gap-2"
          >
            <span className="text-sm text-slate-300">Required</span>
            <span
              className={`w-10 h-6 rounded-full transition-colors relative ${field.required ? 'bg-accent-blue' : 'bg-slate-600'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${field.required ? 'left-5' : 'left-1'}`}
              />
            </span>
          </button>
        </>
      )}
    </div>
  );
}

function FieldPreviewInline({ field }: { field: FormField }) {
  const shape = field.type === 'checkboxes' ? 'rounded' : 'rounded-full';
  return (
    <div>
      <h3 className="text-base font-medium text-white mb-1">
        {field.question} {field.required && <span className="text-red-400">*</span>}
      </h3>
      {field.helpText && <p className="text-xs text-slate-500 mb-3">{field.helpText}</p>}
      <div className={field.helpText ? '' : 'mt-3'}>
        {['short_text', 'email', 'phone', 'number'].includes(field.type) && (
          <div className="w-1/2 border-b border-slate-600 pb-2 text-slate-500 text-sm">Answer text</div>
        )}
        {field.type === 'long_text' && (
          <div className="w-3/4 border-b border-slate-600 pb-8 text-slate-500 text-sm">Long answer text</div>
        )}
        {['date', 'time'].includes(field.type) && (
          <div className="w-48 border border-slate-600 rounded-lg px-4 py-2 text-slate-500 text-sm">
            {field.type === 'date' ? 'mm / dd / yyyy' : '--:--'}
          </div>
        )}
        {['multiple_choice', 'checkboxes'].includes(field.type) && (
          <div className="space-y-2.5">
            {(field.options ?? []).map((opt, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                <div className={`w-4 h-4 border border-slate-500 ${shape}`} />
                <span>{opt}</span>
              </div>
            ))}
          </div>
        )}
        {field.type === 'dropdown' && (
          <div className="w-64 border border-slate-600 rounded-lg px-4 py-2 text-slate-500 text-sm flex justify-between items-center">
            <span>Choose</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
        {field.type === 'yes_no' && (
          <div className="flex gap-3">
            <span className="px-4 py-1.5 border border-slate-600 rounded-lg text-slate-400 text-sm">Yes</span>
            <span className="px-4 py-1.5 border border-slate-600 rounded-lg text-slate-400 text-sm">No</span>
          </div>
        )}
        {field.type === 'rating' && (
          <div className="flex gap-1.5 text-slate-600">
            {[1, 2, 3, 4, 5].map((n) => <span key={n} className="text-2xl">★</span>)}
          </div>
        )}
        {field.type === 'file' && (
          <div className="w-56 border border-dashed border-slate-600 rounded-lg px-4 py-3 text-slate-500 text-sm text-center">
            Upload a file
          </div>
        )}
      </div>
    </div>
  );
}
