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
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Portal Title */}
          <div
            className="flex items-center gap-3.5 cursor-pointer"
            onClick={() => setActiveTab('fta-agent')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
              <span className="material-symbols-outlined text-[24px]">account_tree</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-extrabold text-sky-600 dark:text-sky-400 tracking-wider">
                  LeakGuard LLR
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> FTA AGENT
                </span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Root Cause Failure Tree &amp; Diagnostic Portal
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              data-nav-tab="fta-agent"
              onClick={() => setActiveTab('fta-agent')}
              className={`nav-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'fta-agent'
                  ? 'active bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              <span>FTA Root Cause Agent</span>
              <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 text-[10px] font-mono font-bold">
                AI
              </span>
            </button>

            <button
              data-nav-tab="lessons-browser"
              onClick={() => setActiveTab('lessons-browser')}
              className={`nav-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'lessons-browser'
                  ? 'active bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Lessons Hub</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950 text-[10px] font-mono">
                {lessonsCount}
              </span>
            </button>

            <button
              data-nav-tab="vehicle-zones"
              onClick={() => setActiveTab('vehicle-zones')}
              className={`nav-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'vehicle-zones'
                  ? 'active bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
              <span>17 Zones</span>
            </button>

            <button
              data-nav-tab="interactive-checklist"
              onClick={() => setActiveTab('interactive-checklist')}
              className={`nav-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'interactive-checklist'
                  ? 'active bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              <span>Line Checklist</span>
            </button>

            <button
              data-nav-tab="data-sync"
              onClick={() => setActiveTab('data-sync')}
              className={`nav-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'data-sync'
                  ? 'active bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
              <span>Excel Import</span>
            </button>
          </nav>

          {/* Right Utility Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] dark:hidden">dark_mode</span>
              <span className="material-symbols-outlined text-[20px] hidden dark:inline">light_mode</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <span className="material-symbols-outlined text-[20px]">engineering</span>
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Techline / VQE Lead
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Diagnosis &amp; Root Cause</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

