import React, { useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { sectionGroups } from '../../data/websiteSections';

interface SectionNavProps {
  activeSection: string;
  onSelect: (id: string) => void;
  counts: Record<string, number>;
}

export function SectionNav({ activeSection, onSelect, counts }: SectionNavProps) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (id: string) =>
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sectionGroups;
    return sectionGroups
      .map((g) => ({ ...g, sections: g.sections.filter((s) => s.label.toLowerCase().includes(q)) }))
      .filter((g) => g.sections.length > 0);
  }, [query]);

  const totalSections = sectionGroups.reduce((n, g) => n + g.sections.length, 0);

  return (
    <div className="w-72 shrink-0 bg-[#1b2940] rounded-2xl border border-white/10 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sections</h3>
          <span className="text-[10px] font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
            {totalSections}
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a section..."
            className="w-full bg-[#0f1a2a] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-brand p-3" aria-label="Website sections">
        {filteredGroups.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">No sections found.</p>
        )}
        {filteredGroups.map((group) => {
          const isCollapsed = collapsed[group.id] && !query;
          return (
            <div key={group.id} className="mb-2">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
              >
                {group.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5 mt-1">
                  {group.sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => onSelect(section.id)}
                        className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-accent-blue/10 text-accent-blue font-medium'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{section.label}</span>
                        <span
                          className={`ml-2 shrink-0 text-[10px] px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-accent-blue/20 text-accent-blue' : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          {counts[section.id] ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
