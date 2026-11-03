'use client';

import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lessonsCount: number;
  theme: string;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lessonsCount,
  theme,
  toggleTheme,
}) => {
  const isTabActive = (tabId: string) => {
    if (activeTab === tabId) return true;
    if (tabId === 'fta-agent' && activeTab === 'fta-agent') return true;
    if (tabId === 'lessons-browser' && activeTab === 'lessons-browser') return true;
    if ((tabId === 'zones' || tabId === 'vehicle-zones') && (activeTab === 'zones' || activeTab === 'vehicle-zones')) return true;
    if ((tabId === 'checklist' || tabId === 'interactive-checklist') && (activeTab === 'checklist' || activeTab === 'interactive-checklist')) return true;
    if ((tabId === 'sync' || tabId === 'data-sync') && (activeTab === 'sync' || activeTab === 'data-sync')) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setActiveTab('fta-agent')}
          >
            {/* Starburst AI Logo (Matching UptimeAI brand style) */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-black text-sky-600 dark:text-sky-400 tracking-wider">
                  LeakGuard
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> ROOT CAUSE AGENT
                </span>
              </div>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                Failure Tree Analysis &amp; Diagnostic Portal
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs (Perfect Pill Segment) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('fta-agent')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isTabActive('fta-agent')
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">account_tree</span>
              <span>FTA Agent</span>
              <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[9px] font-mono font-black">
                RCA
              </span>
            </button>

            <button
              onClick={() => setActiveTab('lessons-browser')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isTabActive('lessons-browser')
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">menu_book</span>
              <span>Lessons Hub</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold">
                {lessonsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('zones')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isTabActive('zones')
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">directions_car</span>
              <span>17 Zones</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isTabActive('checklist')
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">checklist</span>
              <span>Line Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('sync')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isTabActive('sync')
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">cloud_sync</span>
              <span>Excel / CSV</span>
            </button>
          </nav>

          {/* Right Controls: Theme Toggle & Techline Specialist Badge */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] dark:hidden">dark_mode</span>
              <span className="material-symbols-outlined text-[20px] hidden dark:inline">light_mode</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <span className="material-symbols-outlined text-[20px]">engineering</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                  Nikit (Techline)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Shift
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="lg:hidden px-4 py-2 bg-slate-50 dark:bg-[#070c1a] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('fta-agent')}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
            isTabActive('fta-agent')
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          FTA Agent
        </button>
        <button
          onClick={() => setActiveTab('lessons-browser')}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
            isTabActive('lessons-browser')
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Lessons ({lessonsCount})
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
            isTabActive('zones')
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          17 Zones
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
            isTabActive('checklist')
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Checklist
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap ${
            isTabActive('sync')
              ? 'bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Excel / CSV
        </button>
      </div>
    </header>
  );
};
