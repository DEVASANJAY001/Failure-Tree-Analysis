'use client';

import React, { useState } from 'react';
import { Lesson } from '@/lib/types';
import { CadDiagram } from './CadDiagram';
import { PROJECT_NAMES } from '@/lib/fta-scenarios';

interface LessonsBrowserProps {
  lessons: Lesson[];
  verifiedSlides: Set<number>;
  onToggleVerify: (slideNo: number) => void;
  onOpenLessonDetail: (slideNo: number) => void;
}

export const LessonsBrowser: React.FC<LessonsBrowserProps> = ({
  lessons,
  verifiedSlides,
  onToggleVerify,
  onOpenLessonDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Extract unique projects & areas
  const projects = Array.from(new Set(lessons.map(l => l.project))).filter(Boolean).sort();
  const areas = Array.from(new Set(lessons.map(l => l.area))).filter(Boolean).sort();

  const filteredLessons = lessons.filter(l => {
    if (selectedProject !== 'all' && l.project !== selectedProject) return false;
    if (selectedArea !== 'all' && l.area !== selectedArea) return false;

    const full = [l.concern, l.area, l.project, ...l.rootCauses, ...l.countermeasures, ...l.checkPoints].join(' ').toLowerCase();

    if (activeFilter === 'foam' && !full.includes('foam')) return false;
    if (activeFilter === 'butyl' && !full.includes('butyl') && !full.includes('sealant') && !full.includes('sealer')) return false;
    if (activeFilter === 'plugs' && !full.includes('plug') && !full.includes('hole') && !full.includes('sticker')) return false;
    if (activeFilter === 'clearance' && !full.includes('clearance') && !full.includes('gap') && !full.includes('distance')) return false;
    if (activeFilter === 'clips' && !full.includes('clip') && !full.includes('harness')) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = [
        'slide ' + l.slideNo,
        '#' + l.slideNo,
        l.docRef,
        l.project,
        l.area,
        l.concern,
        ...l.rootCauses,
        ...l.countermeasures,
        ...l.checkPoints,
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  return (
    <div id="view-lessons-browser" className="space-y-6">

      {/* Search, Filters, and View Control Toolbar */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 flex items-center bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-[22px] pl-3.5 pr-2 pointer-events-none">search</span>
            <input
              id="lesson-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none pr-12"
              placeholder="Search by keyword, clip, butyl 70mm, plug, grommet, speaker, sealant..."
              spellCheck="false"
              type="text"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mr-2 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Project & Category Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              id="project-filter-select"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">All Vehicle Programs ({lessons.length})</option>
              {projects.map(p => (
                <option key={p} value={p}>{PROJECT_NAMES[p] || p}</option>
              ))}
            </select>
            <select
              id="area-filter-select"
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">All 17 Vehicle Areas</option>
              {areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Chips & View Mode Toggle Strip */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Lessons', count: lessons.length },
              { id: 'foam', label: 'Missing Foam', count: 24 },
              { id: 'butyl', label: 'Sealant / Butyl', count: 19 },
              { id: 'plugs', label: 'Holes & Plugs', count: 14 },
              { id: 'clearance', label: 'Clearance Gap', count: 12 },
              { id: 'clips', label: 'Harness Clips', count: 8 },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`filter-chip shrink-0 h-8 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeFilter === chip.id
                    ? 'active-filter bg-slate-900 text-white dark:bg-sky-500 dark:text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                type="button"
              >
                <span>{chip.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeFilter === chip.id ? 'bg-white/20' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}>
                  {chip.count}
                </span>
              </button>
            ))}
          </div>

          {/* Matching count & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <span id="lessons-count-header" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
              Showing {filteredLessons.length} of {lessons.length} Standard Lessons
            </span>
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                id="view-mode-cards-btn"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Visual Cards View"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                id="view-mode-table-btn"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Dense Quality Matrix Table"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">table_rows</span>
                <span className="hidden sm:inline">Matrix</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div id="lessons-cards-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLessons.map(item => {
            const isVerified = verifiedSlides.has(item.slideNo);
            const wrongText = item.rootCauses.length > 0 ? item.rootCauses.join('; ') : 'Direct moisture ingress along joint interface.';
            const fixText = item.countermeasures.length > 0 ? item.countermeasures.join('; ') : 'Validated containment countermeasure applied.';
            const checkText = item.checkPoints.length > 0 ? item.checkPoints.join('; ') : 'Inspect 100% seating and interference fit.';

            const isHighRisk = item.risk === 'High Risk';
            const isMedRisk = item.risk === 'Med Risk';

            return (
              <article
                key={item.slideNo}
                className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-lg">
                        Slide #{item.slideNo}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {item.area}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                        {item.project}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 uppercase tracking-wider border ${
                      isHighRisk
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900/60'
                        : isMedRisk
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
                        : 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-900/60'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-rose-600' : isMedRisk ? 'bg-amber-500' : 'bg-sky-500'}`}></span>
                      {item.risk}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.concern}
                  </h3>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0f172a]">
                    <CadDiagram area={item.area} slideNo={item.slideNo} />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 text-slate-800 dark:text-slate-200">
                      <span className="material-symbols-outlined text-rose-600 text-[16px] shrink-0 mt-0.5">error</span>
                      <p className="leading-relaxed">
                        <strong className="text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider">Issue:</strong> {wrongText}
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200">
                      <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">verified</span>
                      <p className="leading-relaxed">
                        <strong className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Fix:</strong> {fixText}
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-slate-800 dark:text-slate-200">
                      <span className="material-symbols-outlined text-amber-600 text-[16px] shrink-0 mt-0.5">checklist</span>
                      <p className="leading-relaxed">
                        <strong className="text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">Check:</strong> {checkText}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => onToggleVerify(item.slideNo)}
                    className={`h-10 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 ${
                      isVerified
                        ? 'bg-emerald-600 text-white border-transparent'
                        : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isVerified ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isVerified ? 'Verified' : 'Verify'}</span>
                  </button>

                  <button
                    onClick={() => onOpenLessonDetail(item.slideNo)}
                    className="flex-1 h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                    type="button"
                  >
                    <span>View Sheet</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Table Matrix View */}
      {viewMode === 'table' && (
        <div id="lessons-table-container" className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5">Slide</th>
                <th className="py-3 px-3.5">Program</th>
                <th className="py-3 px-3.5">Category</th>
                <th className="py-3 px-3.5">Concern / Issue</th>
                <th className="py-3 px-3.5">Countermeasure</th>
                <th className="py-3 px-3.5">Verification</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLessons.map(item => {
                const isVerified = verifiedSlides.has(item.slideNo);
                return (
                  <tr
                    key={item.slideNo}
                    onClick={() => onOpenLessonDetail(item.slideNo)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">#{item.slideNo}</td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900 dark:text-white">{item.project}</td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 font-medium">{item.area}</td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">{item.concern}</td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">{item.countermeasures[0] || 'Standard fix applied'}</td>
                    <td className="py-3 px-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenLessonDetail(item.slideNo);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors"
                        type="button"
                      >
                        Open Sheet
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

