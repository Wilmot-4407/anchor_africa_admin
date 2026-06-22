import React from "react";
import { Bell, MessageSquare, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export function Topbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="h-16 px-6 flex items-center justify-end border-b border-white/10 bg-[#111d2e] flex-shrink-0">
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-blue rounded-full border-2 border-[#111d2e]" />
        </button>

        {/* Messages */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          title="Messages"
        >
          <MessageSquare className="w-[18px] h-[18px]" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Theme toggle — single button, icon reflects active mode */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-medium"
        >
          {isDark
            ? <Sun  className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4 text-accent-blue" />
          }
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </div>
  );
}
