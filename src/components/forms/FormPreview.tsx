import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { FormField } from '../../data/formFieldTypes';

interface FormPreviewProps {
  title: string;
  description: string;
  fields: FormField[];
}

export function FormPreview({ title, description, fields }: FormPreviewProps) {
  const inputClass =
    'w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all';

  return (
    <div className="max-w-2xl mx-auto pb-32">
      <div className="bg-[#1b2940] rounded-2xl border-t-8 border-t-accent-blue border-x border-b border-white/10 p-8 mb-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">{title || 'Untitled Form'}</h1>
        {description && <p className="text-slate-300">{description}</p>}
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => {
          if (field.type === 'heading') {
            return (
              <h2 key={field.id} className="text-xl font-bold text-white pt-4 border-b border-white/10 pb-2">
                {field.question}
              </h2>
            );
          }
          return (
            <div key={field.id} className="bg-[#1b2940] rounded-2xl border border-white/10 p-6">
              <label className="block text-base font-medium text-white mb-1">
                {field.question} {field.required && <span className="text-red-400">*</span>}
              </label>
              {field.helpText && <p className="text-xs text-slate-500 mb-3">{field.helpText}</p>}
              <div className={field.helpText ? '' : 'mt-3'}>
                {field.type === 'short_text' && (
                  <input className={inputClass} placeholder={field.placeholder} />
                )}
                {field.type === 'email' && (
                  <input type="email" className={inputClass} placeholder="name@example.com" />
                )}
                {field.type === 'phone' && (
                  <input type="tel" className={inputClass} placeholder="(000) 000-0000" />
                )}
                {field.type === 'number' && <input type="number" className={inputClass} />}
                {field.type === 'long_text' && (
                  <textarea rows={4} className={`${inputClass} resize-none`} />
                )}
                {field.type === 'date' && <input type="date" className={inputClass} />}
                {field.type === 'time' && <input type="time" className={inputClass} />}
                {field.type === 'dropdown' && (
                  <div className="relative">
                    <select className={`${inputClass} appearance-none`}>
                      <option value="">Choose…</option>
                      {(field.options ?? []).map((o, i) => (
                        <option key={i} value={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                )}
                {field.type === 'multiple_choice' && (
                  <div className="space-y-2.5">
                    {(field.options ?? []).map((o, i) => (
                      <label key={i} className="flex items-center gap-3 text-slate-200 cursor-pointer">
                        <input type="radio" name={field.id} className="accent-accent-blue w-4 h-4" />
                        {o}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'checkboxes' && (
                  <div className="space-y-2.5">
                    {(field.options ?? []).map((o, i) => (
                      <label key={i} className="flex items-center gap-3 text-slate-200 cursor-pointer">
                        <input type="checkbox" className="accent-accent-blue w-4 h-4 rounded" />
                        {o}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'yes_no' && (
                  <div className="flex gap-3">
                    {['Yes', 'No'].map((o) => (
                      <label
                        key={o}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-slate-200 cursor-pointer hover:border-accent-blue/50"
                      >
                        <input type="radio" name={field.id} className="accent-accent-blue" />
                        {o}
                      </label>
                    ))}
                  </div>
                )}
                {field.type === 'rating' && (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" className="text-3xl text-slate-600 hover:text-secondary transition-colors">
                        ★
                      </button>
                    ))}
                  </div>
                )}
                {field.type === 'file' && (
                  <div className="w-full border border-dashed border-white/15 rounded-xl px-4 py-6 text-slate-400 text-sm text-center hover:border-accent-blue/50 transition-colors cursor-pointer">
                    Click to upload a file
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="submit"
          className="bg-accent-blue hover:bg-[#4ab0d6] text-[#0f1a2a] px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent-blue/20"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
