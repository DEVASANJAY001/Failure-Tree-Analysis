'use client';

import React, { useState } from 'react';
import { FtaScenario, FtaBranch, WorkOrder, Lesson } from '@/lib/types';
import { FTA_SCENARIOS } from '@/lib/fta-scenarios';
import { CadDiagram } from './CadDiagram';

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
  const [activeFtaTab, setActiveFtaTab] = useState<'workorders' | 'recommendations' | 'evidence' | 'system'>('workorders');
  const [scenarioState, setScenarioState] = useState<FtaScenario>(FTA_SCENARIOS[0]);
  const [activeBranchId, setActiveBranchId] = useState<string>('b3');
  const [isApproved, setIsApproved] = useState(false);

  // Handle Scenario Change
  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    const found = FTA_SCENARIOS.find(s => s.id === id);
    if (found) {
      setScenarioState(JSON.parse(JSON.stringify(found)));
      const rootBranch = found.branches.find(b => b.status === 'root_cause');
      if (rootBranch) setActiveBranchId(rootBranch.id);
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
        name: 'Cowl weir drain overflow',
        slideNo: 51,
        status: 'debunked',
        badgeText: 'Debunked: 42mm measured',
        detail: 'Stopper height measured at 42mm (exceeds min 37mm threshold). Zero moisture behind firewall.'
      },
      {
        id: 'dyn-2',
        name: 'HVAC bulkhead condensate spout',
        slideNo: 34,
        status: 'debunked',
        badgeText: 'Debunked: spout dry',
        detail: 'Endoscope confirmation of dry condensate hose clamp; zero evaporator pan overflow.'
      },
      {
        id: 'dyn-3',
        name: topLesson.concern,
        slideNo: topLesson.slideNo,
        status: 'root_cause',
        badgeText: `ROOT CAUSE: ${topLesson.rootCauses[0] ? topLesson.rootCauses[0].slice(0, 28) + '...' : 'Verified fault'}`,
        detail: topLesson.rootCauses.join('; ') || 'Primary ingress mechanism isolated from historical digital check.'
      },
      {
        id: 'dyn-4',
        name: 'Underbody floor e-coat drain plug',
        slideNo: 35,
        status: 'verified',
        badgeText: 'Verified: OEM torque spec',
        detail: 'Oval floor drainage plug verified flush with 360° PVC underbody seal.'
      },
      {
        id: 'dyn-5',
        name: 'Door weatherstrip aero lip clearance',
        slideNo: 5,
        status: 'checked',
        badgeText: 'Checked: probe + doors',
        detail: 'Ultrasonic acoustic sweep confirmed perimeter weatherstrip seal contact load.'
      }
    ];

    const dynamicScenario: FtaScenario = {
      id: 'dynamic-search',
      title: `Root Cause Analysis: "${queryInput}"`,
      symptom: `${queryInput.toUpperCase()} INGRESS`,
      vehicle: `${topLesson.project} (Commercial Model)`,
      confidence: 96,
      rootCauseSummary: `${topLesson.concern}: ${topLesson.rootCauses[0] || 'Failure mechanism isolated.'}`,
      primarySlide: topLesson.slideNo,
      evidenceSlides: [topLesson.slideNo, ...relatedLessons.map(l => l.slideNo)].slice(0, 4),
      branches,
      chain: [
        { step: 1, title: 'Coupling / Fastener Removal + Inspection', desc: `Diagnostic query "${queryInput}" matched ${matched.length} historical lessons across 17 inspection zones.` },
        { step: 2, title: 'Exclusion of Unrelated Zones', desc: 'Hypotheses outside water ingress boundary tested and ruled out as secondary.' },
        { step: 3, title: 'Root Cause Isolation', desc: `Slide #${topLesson.slideNo} (${topLesson.area}) isolated as the principal root cause failure mode.` },
        { step: 4, title: 'Countermeasure Corroboration', desc: topLesson.countermeasures[0] || 'Standard containment countermeasure validated.' },
        { step: 5, title: 'Recommended Quality Verification', desc: topLesson.checkPoints[0] || 'Mandatory 100% verification on the line.' }
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
        estimatedHours: '1.5'
      }
    };

    setScenarioState(dynamicScenario);
    setActiveBranchId('dyn-3');
  };

  return (
    <div className="space-y-6">

      {/* TOP: Clean Control Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-sky-500 flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Failure Tree Analysis (FTA)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Renault-Nissan Digital Check (LLR)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rapid fault isolation for Service Technicians, Techlines &amp; Quality Analysts.
            </p>
          </div>
        </div>

        {/* Search & Scenario Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRunDiagnosis()}
              placeholder="Query symptom..."
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-slate-400 focus:outline-none placeholder:text-slate-400"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-[16px]">
              search
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedScenarioId}
              onChange={e => handleScenarioChange(e.target.value)}
              className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {FTA_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.symptom}
                </option>
              ))}
            </select>

            <button
              onClick={handleRunDiagnosis}
              className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0 shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>Diagnose</span>
            </button>
          </div>
        </div>

      </div>

      {/* INCIDENT HEADER (Matching UptimeAI Reference Top Pill) */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title + Confidence Pill */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Confidence: High {scenarioState.confidence}%</span>
          </span>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            {scenarioState.title}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenLessonDetail(scenarioState.primarySlide)}
            className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-200/80 dark:border-slate-700/80"
          >
            <span className="material-symbols-outlined text-[15px]">chat_bubble_outline</span>
            <span>Comments</span>
          </button>

          <button
            onClick={() => setIsApproved(!isApproved)}
            className={`h-9 px-3.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
              isApproved
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">check</span>
            <span>{isApproved ? 'Approved ✓' : 'Approve'}</span>
          </button>

          <button
            onClick={() => handleRunDiagnosis()}
            className="h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-200/80 dark:border-slate-700/80"
          >
            <span className="material-symbols-outlined text-[15px]">sync</span>
            <span>Revise</span>
          </button>

          <button
            onClick={() => onOpenWorkOrderModal(scenarioState.rootCauseSummary, scenarioState.primarySlide)}
            className="h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">assignment_add</span>
            <span>+ Create Work Order</span>
          </button>
        </div>

      </div>

      {/* MIDDLE: FAILURE TREE ANALYSIS (FTA) GRAPH (Exact Topology Matching Reference Screenshot) */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
        
        {/* Graph Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Root Cause Failure Tree
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              · Select any node to view evidence
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-orange-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> ROOT CAUSE
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> Debunked
            </span>
            <span className="flex items-center gap-1.5 text-teal-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span> Verified
            </span>
          </div>
        </div>

        {/* Visual 3-Column Fault Tree Canvas */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-none">
          <div className="relative min-w-[900px] h-[340px] flex items-center select-none">
            
            {/* SVG Connecting Curves Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 900 340"
              preserveAspectRatio="none"
            >
              {/* Branch curves from Root (x: 190, y: 170) to Hypotheses (x: 340, y_i) */}
              {scenarioState.branches.slice(0, 5).map((b, idx) => {
                const y_i = 36 + idx * 67;
                const isRc = b.status === 'root_cause';
                return (
                  <g key={`curve-${b.id}`}>
                    {/* Cubic Bezier Branch */}
                    <path
                      d={`M 190 170 C 265 170, 265 ${y_i}, 340 ${y_i}`}
                      fill="none"
                      stroke={isRc ? '#ea580c' : b.status === 'verified' ? '#0d9488' : '#94a3b8'}
                      strokeWidth={isRc ? '2.5' : '1.5'}
                      strokeDasharray={b.status === 'debunked' ? '4 3' : 'none'}
                      strokeOpacity={isRc ? '1' : '0.7'}
                    />
                    {/* Horizontal link between Hypothesis (x: 560) and Status Badge (x: 620) */}
                    <line
                      x1="560"
                      y1={y_i}
                      x2="620"
                      y2={y_i}
                      stroke={isRc ? '#ea580c' : b.status === 'verified' ? '#0d9488' : '#94a3b8'}
                      strokeWidth={isRc ? '2.5' : '1.5'}
                      strokeDasharray={b.status === 'debunked' ? '4 3' : 'none'}
                      strokeOpacity={isRc ? '1' : '0.7'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* COLUMN 1: Root Symptom Node (Left) */}
            <div
              className="absolute left-2 w-48 h-20 rounded-2xl bg-[#09152e] text-white p-3.5 border border-sky-500/70 shadow-md shadow-sky-950/30 flex flex-col justify-center z-10 transition-transform-smooth"
              style={{ top: '130px' }}
            >
              <div className="flex items-center gap-1.5 text-sky-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span>Observed Top Event</span>
              </div>
              <div className="text-xs font-extrabold leading-snug">
                {scenarioState.symptom}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                {scenarioState.vehicle}
              </div>
            </div>

            {/* COLUMN 2: Hypotheses Pills (Center) */}
            <div className="absolute left-[340px] w-56 flex flex-col gap-[15px] z-10">
              {scenarioState.branches.slice(0, 5).map((b, idx) => {
                const isRc = b.status === 'root_cause';
                const isSelected = activeBranchId === b.id;

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setActiveBranchId(b.id);
                      if (b.slideNo) onOpenLessonDetail(b.slideNo);
                    }}
                    className={`h-[48px] px-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 shadow-xs ${
                      isRc
                        ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800 text-slate-900 dark:text-white font-bold'
                        : isSelected
                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white font-semibold'
                        : 'bg-white dark:bg-[#0b101d] border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isRc ? 'bg-orange-500' : b.status === 'verified' ? 'bg-teal-500' : 'bg-slate-400'
                        }`}
                      ></span>
                      <span className="text-xs truncate">{b.name}</span>
                    </div>

                    {b.slideNo && (
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                        #{b.slideNo}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* COLUMN 3: Status & Evidence Badges (Right - Matching UptimeAI Screenshot) */}
            <div className="absolute left-[620px] w-64 flex flex-col gap-[15px] z-10">
              {scenarioState.branches.slice(0, 5).map(b => {
                const isRc = b.status === 'root_cause';
                const isDebunked = b.status === 'debunked';
                const isVerified = b.status === 'verified';

                return (
                  <div
                    key={`status-${b.id}`}
                    onClick={() => {
                      setActiveBranchId(b.id);
                      if (b.slideNo) onOpenLessonDetail(b.slideNo);
                    }}
                    className={`h-[48px] px-3.5 rounded-xl flex flex-col justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                      isRc
                        ? 'bg-orange-600 text-white shadow-sm'
                        : isDebunked
                        ? 'bg-[#1b253b] text-slate-200 border border-slate-700/60'
                        : isVerified
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                          isRc ? 'text-white' : isDebunked ? 'text-cyan-300' : 'text-teal-200'
                        }`}
                      >
                        {isRc ? 'ROOT CAUSE' : isDebunked ? 'Debunked:' : isVerified ? 'Verified:' : 'Checked:'}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-medium truncate ${
                        isRc ? 'text-orange-50 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {isRc
                        ? b.detail || 'Sealing barrier gap <35mm'
                        : b.badgeText.replace(/^(Debunked:|Verified:|Checked:)\s*/, '')}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM: DIAGNOSTIC SPLIT WORKSPACE (Matching Bottom Half of Reference Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT CARD: Incident Narrative & Chain (5 Steps) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-6">
          
          <div className="space-y-4">
            {/* Header: Timestamp + Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[16px]">schedule</span>
                <span className="text-xs font-mono font-medium text-slate-500">2:15 PM · Shift QA Log</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Primary Root Cause
              </span>
            </div>

            {/* Narrative Paragraph */}
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Water barrier misalignment was likely introduced when the sealing screen butyl bead path was disturbed during wire harness clip insertion. Minor clip foam pinch or adhesive necking below 35 mm allowed high-pressure water under shower test to drift across the dry cavity, driving observed floor pan saturation.
              </p>
            </div>

            {/* Vector CAD Cross-Section Diagram */}
            <div className="pt-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                <span>Engineering CAD Cross-Section</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">Tolerance: ≥ 70mm</span>
              </div>
              <CadDiagram area="sealing screen butyl clip" slideNo={scenarioState.primarySlide} />
            </div>

            {/* Chain (5 Steps) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Chain ({scenarioState.chain.length} steps)
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Chronological Isolation
                </span>
              </div>

              <div className="relative pl-6 space-y-2.5 border-l border-slate-200 dark:border-slate-800 ml-2">
                {scenarioState.chain.map(c => (
                  <div key={c.step} className="relative">
                    <span className="absolute -left-[29px] top-0.5 w-4 h-4 rounded-full bg-slate-900 text-white dark:bg-sky-500 text-[9px] font-mono font-bold flex items-center justify-center">
                      {c.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {c.step === 1 ? '#002754: ' : ''}{c.title}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed text-[11px]">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onOpenLessonDetail(scenarioState.primarySlide)}
              className="w-full h-9 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200/80 dark:border-slate-700"
            >
              <span>View Full LLR Slide #{scenarioState.primarySlide} Sheet</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>

        </div>

        {/* RIGHT CARD: Investigation Tabs & Recommendations */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-6">
          
          <div className="space-y-4">
            
            {/* Header: Title + Badges + Action Buttons */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {scenarioState.symptom} (Primary)
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  8 tags, 1 records, 2 docs
                </span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(scenarioState.id);
                }}
                className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Copy ID</span>
              </button>
            </div>

            {/* Sub-navigation Tabs: Work Orders | Recommendations | Evidence | System */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 gap-1">
              {(['workorders', 'recommendations', 'evidence', 'system'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFtaTab(tab)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all capitalize ${
                    activeFtaTab === tab
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'workorders' ? 'Work Orders' : tab === 'recommendations' ? 'Recommendations' : tab === 'evidence' ? 'Evidence' : 'System'}
                </button>
              ))}
            </div>

            {/* Tab: Work Orders (Exact Layout Matching Reference Screenshot) */}
            {activeFtaTab === 'workorders' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        Work Order #002754
                      </span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Draft
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenWorkOrderModal()}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* 3-Column Key-Value Matrix Matching Reference Screenshot */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Created By</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">JMARTIN</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Scheduled At</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">2026-11-03</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Equipment ID</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">IMP5128</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Description</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">Mechanical seal change</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Equipment</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">IMPECO LCKP FEED PUMP</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Maintenance Plant</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">PLT-100</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations (4 steps) Box Directly Below Work Order Card */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Recommendations (4 steps)
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">print</span>
                      <span>Print RCA Log</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-[15px] shrink-0 mt-0.5">check_circle</span>
                      <p className="text-slate-600 dark:text-slate-300 leading-snug">
                        <strong>1. Execute:</strong> Perform laser alignment with hot thermal-growth targets and document as-found/as-left readings.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2">
                      <span className="material-symbols-outlined text-sky-500 text-[15px] shrink-0 mt-0.5">verified</span>
                      <p className="text-slate-600 dark:text-slate-300 leading-snug">
                        <strong>2. Verify:</strong> Conduct soft-foot check and correction to ≤ 0.002 in residual; clean and standardize shim packs.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[15px] shrink-0 mt-0.5">update</span>
                      <p className="text-slate-600 dark:text-slate-300 leading-snug">
                        <strong>3. Update:</strong> Revise PM procedures to make hot alignment mandatory after any coupling disturbance; store in SAP.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Recommendations */}
            {activeFtaTab === 'recommendations' && (
              <div className="space-y-2.5">
                {scenarioState.recommendations.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs space-y-1">
                    <div className="text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px] font-mono">
                      {idx + 1}. {r.type}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Evidence */}
            {activeFtaTab === 'evidence' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">Primary Digital Check Reference</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">
                    Renault-Nissan Digital Check Review LLR Slide #{scenarioState.primarySlide} (Doc: RNTBCI/VQE/WL-0{scenarioState.primarySlide})
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">Engineering Quality Standard</div>
                  <ul className="list-disc pl-4 mt-1 text-slate-600 dark:text-slate-300 space-y-1">
                    <li>STD-WTR-B04: Door Sealing Screen Clearance ≥ 70mm from access hole</li>
                    <li>STD-WTR-C09: Fastener Push-in Clips with Closed-cell EPDM Foam Gasket</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: System Details */}
            {activeFtaTab === 'system' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Subsystem Hierarchy</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    Vehicle BIW &gt; Side Closure &gt; Trim Door Module &gt; Water Ingress Barrier
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Plant &amp; Assembly Line</div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-0.5">
                    Plant 1 · Trim &amp; Final · Station 06 Water Barrier Cell
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="pt-2">
            <button
              onClick={() => onOpenWorkOrderModal(scenarioState.rootCauseSummary, scenarioState.primarySlide)}
              className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">verified</span>
              <span>Dispatch Work Order Notification</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
