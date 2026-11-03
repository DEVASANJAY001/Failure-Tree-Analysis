'use client';

import React, { useState } from 'react';
import { FtaScenario, FtaBranch, WorkOrder, Lesson } from '@/lib/types';
import { FTA_SCENARIOS } from '@/lib/fta-scenarios';

interface FtaDiagnosticAgentProps {
  lessons: Lesson[];
  workOrders: WorkOrder[];
  onOpenWorkOrderModal: (presetDesc?: string, slideNo?: number) => void;
  onOpenLessonDetail: (slideNo: number) => void;
  onUpdateWorkOrderStatus: (id: string, status: string) => void;
}

export const FtaDiagnosticAgent: React.FC<FtaDiagnosticAgentProps> = ({
  lessons,
  workOrders,
  onOpenWorkOrderModal,
  onOpenLessonDetail,
  onUpdateWorkOrderStatus,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState('floor-pan-flooding');
  const [queryInput, setQueryInput] = useState('');
  const [activeFtaTab, setActiveFtaTab] = useState<'recommendations' | 'workorders' | 'documents' | 'system'>('recommendations');
  const [scenarioState, setScenarioState] = useState<FtaScenario>(FTA_SCENARIOS[0]);

  // Handle Scenario Change
  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const found = FTA_SCENARIOS.find(s => s.id === id);
    if (found) {
      setScenarioState(JSON.parse(JSON.stringify(found)));
    }
  };

  // Run AI Diagnostic for Free-text Search
  const handleRunDiagnosis = () => {
    const q = queryInput.trim().toLowerCase();
    if (!q) {
      const found = FTA_SCENARIOS.find(s => s.id === selectedScenarioId) || FTA_SCENARIOS[0];
      setScenarioState(JSON.parse(JSON.stringify(found)));
      return;
    }

    const matched = lessons.filter(l => {
      const full = [l.concern, l.area, l.project, ...l.rootCauses, ...l.countermeasures, ...l.checkPoints].join(' ').toLowerCase();
      return full.includes(q);
    });

    const topLesson = matched[0] || lessons[9] || lessons[0];
    const relatedLessons = matched.slice(1, 5);

    const branches: FtaBranch[] = [
      {
        id: 'dyn-1',
        name: topLesson.concern,
        slideNo: topLesson.slideNo,
        status: 'root_cause',
        badgeText: `ROOT CAUSE: ${topLesson.rootCauses[0] ? topLesson.rootCauses[0].slice(0, 32) + '...' : 'Verified fault'} (Slide #${topLesson.slideNo})`,
        detail: topLesson.rootCauses.join('; ') || 'Primary ingress mechanism isolated from historical digital check.',
      },
    ];

    relatedLessons.forEach((l, idx) => {
      branches.push({
        id: `dyn-${idx + 2}`,
        name: l.concern,
        slideNo: l.slideNo,
        status: idx % 2 === 0 ? 'debunked' : 'verified',
        badgeText: idx % 2 === 0 ? `Debunked: Clear on Slide #${l.slideNo}` : `Verified: Contributing on Slide #${l.slideNo}`,
        detail: l.countermeasures[0] || 'Inspection standard verified on line.',
      });
    });

    if (branches.length < 4) {
      branches.push({
        id: 'dyn-filler-1',
        name: 'Floor pan e-coat oval drainage plug seated',
        slideNo: 35,
        status: 'debunked',
        badgeText: 'Debunked: 360° flush fit confirmed',
        detail: 'Underbody inspection confirmed all plugs sealed with intact PVC wax boundary.',
      });
      branches.push({
        id: 'dyn-filler-2',
        name: 'Door weatherstrip aero lip clearance',
        slideNo: 5,
        status: 'debunked',
        badgeText: 'Debunked: Lip retention >150N',
        detail: 'Aero lip contact load meets standard specification.',
      });
    }

    const dynamicScenario: FtaScenario = {
      id: 'dynamic-search',
      title: `AI Root Cause Analysis for: "${queryInput}"`,
      symptom: `${queryInput.toUpperCase()} INGRESS`,
      vehicle: `${topLesson.project} (Commercial Model)`,
      confidence: 91,
      rootCauseSummary: `${topLesson.concern}: ${topLesson.rootCauses[0] || 'Failure mechanism isolated.'}`,
      primarySlide: topLesson.slideNo,
      evidenceSlides: [topLesson.slideNo, ...relatedLessons.map(l => l.slideNo)].slice(0, 4),
      branches,
      chain: [
        { step: 1, title: 'Symptom Query Received', desc: `Diagnostic query "${queryInput}" matched ${matched.length} historical lessons across 17 inspection zones.` },
        { step: 2, title: 'Exclusion of Unrelated Zones', desc: 'Hypotheses outside water ingress boundary tested and ruled out as secondary.' },
        { step: 3, title: 'Root Cause Isolation', desc: `Slide #${topLesson.slideNo} (${topLesson.area}) isolated as the principal root cause failure mode.` },
        { step: 4, title: 'Countermeasure Corroboration', desc: topLesson.countermeasures[0] || 'Standard containment countermeasure validated.' },
        { step: 5, title: 'Recommended Quality Verification', desc: topLesson.checkPoints[0] || 'Mandatory 100% verification on the line.' },
      ],
      recommendations: topLesson.countermeasures.map(c => ({ type: 'Execute', text: c })).concat(
        topLesson.checkPoints.map(cp => ({ type: 'Verify', text: cp }))
      ).slice(0, 3),
      defaultWorkOrder: {
        id: 'WO-' + Date.now().toString().slice(-6),
        status: 'Draft',
        description: `Execute containment for ${topLesson.concern} (Slide #${topLesson.slideNo})`,
        equipment: `${topLesson.project} - LLR #${topLesson.slideNo}`,
        plant: 'Plant 1 · Service Bay',
        priority: 'High',
        assignedTo: 'Nikit (Techline Specialist)',
        dueDate: 'Today',
        estimatedHours: '1.5',
      },
    };

    setScenarioState(dynamicScenario);
  };

  // Toggle Branch Status
  const toggleBranchStatus = (branchId: string, newStatus: 'root_cause' | 'debunked' | 'verified') => {
    setScenarioState(prev => {
      const copy = { ...prev };
      copy.branches = copy.branches.map(b => {
        if (b.id === branchId) {
          return {
            ...b,
            status: newStatus,
            badgeText: newStatus === 'root_cause'
              ? `ROOT CAUSE: ${b.name.slice(0, 28)}`
              : newStatus === 'debunked'
              ? 'Debunked: Negative test'
              : 'Verified: Contributing',
          };
        }
        if (newStatus === 'root_cause' && b.status === 'root_cause') {
          return { ...b, status: 'verified', badgeText: 'Verified: Contributory' };
        }
        return b;
      });
      return copy;
    });
  };

  return (
    <div id="view-fta-agent" className="space-y-6">

      {/* FTA Command & Scenario Selector */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                UptimeAI-Style Root Cause Agent
              </span>
              <span className="text-xs text-slate-400 font-mono">Renault-Nissan LLR Spec</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Failure Tree Analysis (FTA) Diagnostic Workspace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rapid fault isolation for Service Technicians, Techline Specialists &amp; Quality Analysts.
            </p>
          </div>

          {/* Scenario Preset Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex flex-col min-w-[280px]">
              <label htmlFor="fta-scenario-select" className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                Load Diagnostic Case Scenario:
              </label>
              <select
                id="fta-scenario-select"
                value={selectedScenarioId}
                onChange={e => handleScenarioChange(e.target.value)}
                className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-xs"
              >
                <option value="floor-pan-flooding">Case #LK-01: Front Passenger Floor Wet Carpet (PY1B)</option>
                <option value="door-cavity-speaker">Case #LK-02: Door Pocket Ingress &amp; Speaker Drip (HBC)</option>
                <option value="headliner-a-pillar">Case #LK-03: Headliner Soak &amp; A-Pillar Drip (RBC)</option>
                <option value="cowl-bulkhead">Case #LK-04: Cowl Water Box Air Intake Seepage (PB1D)</option>
                <option value="boot-luggage-well">Case #LK-05: Spare Wheel Well Water Pooling (XBA)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Diagnostic Search / Query Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 flex items-center bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-[20px] pl-3.5 pr-2 pointer-events-none">search</span>
            <input
              id="fta-query-input"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRunDiagnosis()}
              className="w-full h-11 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none pr-16"
              placeholder="Search or describe symptom: e.g. carpet wet passenger side, foam missing, butyl 70mm, speaker leak..."
              spellCheck="false"
              type="text"
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 mr-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-mono text-slate-400 select-none">/</kbd>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="fta-run-btn"
              onClick={handleRunDiagnosis}
              className="h-11 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>Run AI Diagnosis</span>
            </button>
            <button
              id="fta-create-wo-btn"
              onClick={() => onOpenWorkOrderModal(scenarioState.recommendations.map(r => r.type + ': ' + r.text).join('\n'), scenarioState.primarySlide)}
              className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">assignment_add</span>
              <span>+ Create Work Order</span>
            </button>
            <button
              id="fta-print-btn"
              onClick={() => window.print()}
              className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors shrink-0"
              title="Print FTA Report"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
            </button>
          </div>
        </div>
      </div>

      {/* MIDDLE: Interactive Failure Tree Analysis (FTA) Canvas */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2 px-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500 text-[20px]">account_tree</span>
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Interactive Fault Tree Model (Click nodes to inspect or toggle state)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Rule-Engine: Renault-Nissan Digital Check (LLR)
          </span>
        </div>

        {/* Visual Tree Canvas */}
        <div id="fta-tree-canvas" className="w-full blueprint-grid rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 p-2 sm:p-4 overflow-hidden">
          <div className="relative w-full py-4 px-2 sm:px-6 overflow-x-auto min-w-[720px] select-none">
            
            {/* Legend */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Active FTA Fault Tree</span>
                <span className="text-slate-400 font-mono text-[11px]">({scenarioState.branches.length} Hypothesis Branches)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-400 border border-orange-200 dark:border-orange-800 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> ROOT CAUSE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Debunked
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-between gap-6 py-2">
              
              {/* LEFT: Root Symptom Node */}
              <div className="shrink-0 z-10 w-44 sm:w-48 p-3.5 rounded-2xl bg-[#0b1326] text-white border-2 border-sky-500/80 shadow-lg shadow-sky-500/10 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-sky-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-[14px]">report_problem</span>
                  <span>Observed Top Event</span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold leading-snug">
                  {scenarioState.symptom}
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 font-mono">
                  {scenarioState.vehicle}
                </div>
              </div>

              {/* CENTER & RIGHT: Branching Container */}
              <div className="flex-1 relative space-y-3.5 pl-6">
                <svg className="absolute inset-0 w-full h-full pointer-events-none -left-6" preserveAspectRatio="none">
                  {scenarioState.branches.map((b, idx) => {
                    const total = scenarioState.branches.length;
                    const startY = 50;
                    const endY = ((idx + 0.5) / total) * 100;
                    return (
                      <path
                        key={b.id}
                        d={`M 0 ${startY}% C 40% ${startY}%, 40% ${endY}%, 100% ${endY}%`}
                        fill="none"
                        stroke={b.status === 'root_cause' ? '#f97316' : b.status === 'verified' ? '#10b981' : '#64748b'}
                        strokeWidth={b.status === 'root_cause' ? '2.5' : '1.5'}
                        strokeOpacity={b.status === 'root_cause' ? '1' : '0.65'}
                        strokeDasharray={b.status === 'debunked' ? '4 3' : 'none'}
                      />
                    );
                  })}
                </svg>

                {/* Branches */}
                {scenarioState.branches.map(b => {
                  const isRootCause = b.status === 'root_cause';
                  const isDebunked = b.status === 'debunked';
                  const isVerified = b.status === 'verified';

                  let statusClass = '';
                  let badgeColor = '';
                  if (isRootCause) {
                    statusClass = 'border-orange-500/80 bg-orange-50/80 dark:bg-orange-950/40 text-slate-900 dark:text-white ring-2 ring-orange-500/40 shadow-md';
                    badgeColor = 'bg-orange-600 text-white font-black tracking-wide shadow-xs';
                  } else if (isDebunked) {
                    statusClass = 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0f172a]/90 text-slate-600 dark:text-slate-400 opacity-90';
                    badgeColor = 'bg-[#1e293b] text-slate-300 font-bold';
                  } else if (isVerified) {
                    statusClass = 'border-emerald-500/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-slate-900 dark:text-white';
                    badgeColor = 'bg-emerald-700 text-white font-bold';
                  } else {
                    statusClass = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                    badgeColor = 'bg-slate-700 text-white font-semibold';
                  }

                  return (
                    <div
                      key={b.id}
                      className={`relative z-10 flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-200 hover:shadow-md ${statusClass} group cursor-pointer`}
                      onClick={() => b.slideNo && onOpenLessonDetail(b.slideNo)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isRootCause ? 'bg-orange-500 animate-ping' : isDebunked ? 'bg-slate-400' : 'bg-emerald-500'}`}></span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xs font-bold truncate ${isRootCause ? 'text-orange-950 dark:text-orange-200 font-extrabold' : ''}`}>
                              {b.name}
                            </span>
                            {b.slideNo && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  onOpenLessonDetail(b.slideNo!);
                                }}
                                className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 hover:bg-sky-200 transition-colors"
                                title={`Open LLR Slide #${b.slideNo} Sheet`}
                              >
                                LLR #{b.slideNo}
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{b.detail}</p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-xl text-[11px] font-mono uppercase tracking-wider ${badgeColor}`}>
                          {b.badgeText}
                        </span>

                        <div className="hidden group-hover:flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 shadow-xs">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              toggleBranchStatus(b.id, 'root_cause');
                            }}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950"
                            title="Mark as Root Cause"
                          >
                            Root
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              toggleBranchStatus(b.id, 'debunked');
                            }}
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                            title="Mark as Debunked"
                          >
                            Debunk
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM: 2-Column Reasoning & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Incident & 5-Step Reasoning Chain */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span id="fta-confidence-badge" className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Confidence: High {scenarioState.confidence}%
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">LLR Precedent Correlated</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" type="button">Approve</button>
                <button className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" type="button">Revise</button>
              </div>
            </div>

            <h2 id="fta-incident-title" className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
              {scenarioState.title}
            </h2>
            <p id="fta-incident-desc" className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {scenarioState.rootCauseSummary}
            </p>
          </div>

          {/* Diagnostic Chain */}
          <div id="fta-chain-container" className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-600 dark:text-sky-400 text-[18px]">account_tree</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Diagnostic Chain ({scenarioState.chain.length} Steps)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Validated by Techline
              </span>
            </div>

            <div className="relative pl-6 space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
              {scenarioState.chain.map(c => (
                <div key={c.step} className="relative group">
                  <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-sky-600 text-[10px] font-mono font-bold flex items-center justify-center ring-4 ring-white dark:ring-[#0f172a]">
                    {c.step}
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white block">{c.title}</span>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Tabbed Management Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          
          {/* Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto no-scrollbar">
            {(['recommendations', 'workorders', 'documents', 'system'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFtaTab(tab)}
                className={`fta-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 capitalize ${
                  activeFtaTab === tab
                    ? 'active bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                type="button"
              >
                {tab === 'documents' ? 'LLR Evidence' : tab === 'system' ? 'System Details' : tab === 'workorders' ? 'Work Orders' : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div id="fta-tab-content" className="min-h-[280px]">
            {activeFtaTab === 'recommendations' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Actionable Recommendations</span>
                  <button
                    onClick={() => onOpenWorkOrderModal(scenarioState.recommendations.map(r => r.type + ': ' + r.text).join('\n'), scenarioState.primarySlide)}
                    className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">post_add</span> Create Work Order
                  </button>
                </div>

                <div className="space-y-2.5">
                  {scenarioState.recommendations.map((r, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                        <span>{idx + 1}. {r.type}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed pl-3 text-[11px]">
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFtaTab === 'workorders' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Assigned Work Orders ({workOrders.length})</span>
                  <button
                    onClick={() => onOpenWorkOrderModal()}
                    className="h-8 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span> New Work Order
                  </button>
                </div>

                <div className="space-y-2.5">
                  {workOrders.map((wo, idx) => (
                    <div key={wo.id || idx} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-xs space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{wo.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          wo.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        }`}>{wo.status}</span>
                      </div>
                      <p className="text-slate-900 dark:text-white font-bold leading-snug">{wo.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div>Assigned: <strong className="text-slate-800 dark:text-slate-200">{wo.assignedTo}</strong></div>
                        <div>Due: <strong className="text-slate-800 dark:text-slate-200">{wo.dueDate || 'Today'}</strong></div>
                        <div>Target: <span className="text-slate-700 dark:text-slate-300">{wo.equipment}</span></div>
                        <div>Est: <span className="text-slate-700 dark:text-slate-300">{wo.estimatedHours} hrs</span></div>
                      </div>
                      <div className="pt-1 flex justify-end gap-1.5">
                        <button
                          onClick={() => onUpdateWorkOrderStatus(wo.id, wo.status === 'Completed' ? 'In Progress' : 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                        >
                          {wo.status === 'Completed' ? 'Re-open' : 'Mark Completed'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFtaTab === 'documents' && (
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">LLR Evidence Sheets ({scenarioState.evidenceSlides.length})</span>
                <div className="space-y-2">
                  {lessons
                    .filter(l => scenarioState.evidenceSlides.includes(l.slideNo))
                    .map(l => (
                      <div
                        key={l.slideNo}
                        onClick={() => onOpenLessonDetail(l.slideNo)}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs flex items-center justify-between gap-2 hover:border-sky-500 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">Slide #{l.slideNo}</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate">{l.concern}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{l.area} • {l.project}</span>
                        </div>
                        <button className="shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                          View
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeFtaTab === 'system' && (
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">Vehicle &amp; Plant System Details</span>
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs space-y-2 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">VIN</span>
                    <span className="font-bold text-slate-900 dark:text-white">8XF-90214</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Model Platform</span>
                    <span className="font-bold text-slate-900 dark:text-white">{scenarioState.vehicle}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Primary LLR Ref</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">Slide #{scenarioState.primarySlide}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Assembly Line</span>
                    <span className="font-bold text-slate-900 dark:text-white">Trim &amp; Final · Line 3</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Shower Test Spec</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">2.5 bar / 20 min</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

