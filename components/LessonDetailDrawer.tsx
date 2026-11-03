'use client';

import React, { useState } from 'react';
import { Lesson } from '@/lib/types';
import { CadDiagram } from './CadDiagram';

interface LessonDetailDrawerProps {
  lesson: Lesson | null;
  onClose: () => void;
  onVerify: (slideNo: number) => void;
  isVerified: boolean;
  onFlagDefect: (slideNo: number, concern: string) => void;
}

export const LessonDetailDrawer: React.FC<LessonDetailDrawerProps> = ({
  lesson,
  onClose,
  onVerify,
  isVerified,
  onFlagDefect,
}) => {
  const [checkedPoints, setCheckedPoints] = useState<Record<number, boolean>>({});

  if (!lesson) return null;

  const toggleCheck = (idx: number) => {
    setCheckedPoints(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const checks = lesson.checkPoints.length > 0 ? lesson.checkPoints : [
    'Confirm water restriction barrier intact without damage or deformation.',
    'Verify positive engagement and audible snap click during assembly.',
    'Perform 360° tactile gloved sweep to confirm flush interference condition.',
    'Ensure clearance with adjacent components meets engineering specification.'
  ];

  const checkedCount = checks.filter((_, idx) => checkedPoints[idx]).length;

  const copyDocRef = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(lesson.docRef || `Slide #${lesson.slideNo}`);
    }
  };

  return (
    <div
      id="view-lesson-detail"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm overflow-hidden flex justify-end"
    >
      <div className="fixed inset-0 transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 transition-transform duration-300">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              id="detail-slide-num"
              className="font-mono text-xs font-bold text-sky-700 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-lg"
            >
              Slide {lesson.slideNo} of 76
            </span>
            <span id="detail-doc-ref" className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {lesson.docRef}
            </span>
            <button
              id="detail-copy-ref-btn"
              onClick={copyDocRef}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Copy Document Reference"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="detail-print-btn"
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Print Quality Sheet"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
            </button>
            <button
              id="detail-back-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="Close Drawer (Esc)"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                id="detail-risk-badge"
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                  lesson.risk === 'High Risk'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                }`}
              >
                {lesson.risk}
              </span>
              <span id="detail-project-area" className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {lesson.project} • {lesson.area}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span id="detail-author" className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Prepared by: {lesson.preparedBy || 'Damodharan (VQE)'}
              </span>
            </div>
            <h2 id="detail-title" className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {lesson.concern}
            </h2>
          </div>

          {/* Technical CAD Schematic */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                <span className="material-symbols-outlined text-[14px]">architecture</span> CAD Cross-Section Schematic
              </span>
              <span>Scale 1:1 Engineering Vector</span>
            </div>
            <div id="detail-diagram-container" className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0f172a] p-1">
              <CadDiagram area={lesson.area} slideNo={lesson.slideNo} />
            </div>
          </div>

          {/* 3 Structured Cards */}
          <div className="space-y-3.5">
            {/* 1. What Went Wrong */}
            <div className="rounded-2xl p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wide">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>1. What Went Wrong (Root Cause)</span>
              </div>
              <div id="detail-wrong-text" className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed space-y-1.5">
                {lesson.rootCauses.length > 0
                  ? lesson.rootCauses.map((c, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                        <span>{c}</span>
                      </div>
                    ))
                  : 'Direct moisture ingress along joint interface.'}
              </div>
            </div>

            {/* 2. How It Was Fixed */}
            <div className="rounded-2xl p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wide">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>2. How It Was Fixed (Countermeasure)</span>
              </div>
              <div id="detail-countermeasure-text" className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed space-y-1.5">
                {lesson.countermeasures.length > 0
                  ? lesson.countermeasures.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                        <span className="font-medium">{f}</span>
                      </div>
                    ))
                  : 'Validated containment countermeasure applied.'}
              </div>
            </div>

            {/* 3. Line Inspection Standard */}
            <div className="rounded-2xl p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[18px]">checklist</span>
                  <span>3. What to Check on the Line (Inspection Checklist)</span>
                </div>
                <span id="detail-check-count-text" className="text-[11px] font-bold text-amber-900 dark:text-amber-300 font-mono">
                  {checkedCount} of {checks.length} Validated
                </span>
              </div>
              <div id="detail-checklist-container" className="space-y-2">
                {checks.map((chk, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer select-none hover:border-sky-500 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedPoints[i]}
                      onChange={() => toggleCheck(i)}
                      className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Line Checkpoint {i + 1}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">{chk}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="px-6 py-4 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            id="detail-defect-btn"
            onClick={() => onFlagDefect(lesson.slideNo, lesson.concern)}
            className="h-11 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">flag</span> Flag Defect
          </button>
          <button
            id="detail-signoff-btn"
            onClick={() => {
              onVerify(lesson.slideNo);
              onClose();
            }}
            className="flex-1 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {isVerified ? 'Verified OK' : 'Sign Off & Verify Lesson'}
          </button>
        </div>

      </div>
    </div>
  );
};

