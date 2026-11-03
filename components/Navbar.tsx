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

  const navItems = [
    { id: 'fta-agent', label: 'FTA Agent', icon: 'account_tree', badge: 'RCA' },
    { id: 'lessons-browser', label: 'Lessons Hub', icon: 'menu_book', count: lessonsCount },
    { id: 'zones', label: '17 Zones', icon: 'directions_car' },
    { id: 'checklist', label: 'Line Checklist', icon: 'checklist' },
    { id: 'sync', label: 'Excel / CSV', icon: 'cloud_sync' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0b101d]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setActiveTab('fta-agent')}
          >
            {/* Elegant Brand Icon */}
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
              <span className="material-symbols-outlined text-[20px]">account_tree</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  LeakGuard
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200/80 dark:border-orange-900/60">
                  FTA AGENT
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight hidden sm:block">
                Root Cause Failure Tree &amp; Diagnostic Portal
              </span>
            </div>
          </div>

          {/* Center: Linear-style Segmented Navigation */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60">
            {navItems.map(item => {
              const active = isTabActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold bg-orange-500 text-white ml-0.5">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 ml-0.5">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle & Techline Specialist Pill */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              type="button"
            >
              <span className="material-symbols-outlined text-[19px] dark:hidden">dark_mode</span>
              <span className="material-symbols-outlined text-[19px] hidden dark:inline">light_mode</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
                NK
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                  Nikit
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Techline Specialist
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Horizontal Tab Strip */}
      <div className="md:hidden px-4 py-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {navItems.map(item => {
          const active = isTabActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                active
                  ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
