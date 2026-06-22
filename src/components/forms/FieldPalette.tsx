import React from 'react';
import { fieldTypes, type FieldType } from '../../data/formFieldTypes';

interface FieldPaletteProps {
  onAdd: (type: FieldType) => void;
}

export function FieldPalette({ onAdd }: FieldPaletteProps) {
  return (
    <div className="w-64 shrink-0 bg-[#1b2940] rounded-2xl border border-white/10 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Add a Field</h3>
        <p className="text-[11px] text-slate-500 mt-1">Click to add to your form</p>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-brand p-3 grid grid-cols-1 gap-1.5">
        {fieldTypes.map((ft) => (
          <button
            key={ft.type}
            onClick={() => onAdd(ft.type)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-accent-blue/10 hover:text-accent-blue transition-colors text-left group"
          >
            <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-accent-blue/15 flex items-center justify-center transition-colors">
              <ft.icon className="w-4 h-4" />
            </span>
            {ft.label}
          </button>
        ))}
      </div>
    </div>
  );
}
