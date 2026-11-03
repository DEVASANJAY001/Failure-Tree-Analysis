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
  const [activeFtaTab, setActiveFtaTab] = useState<'workorders' | 'tags' | 'recommendations' | 'documents' | 'system'>('workorders');
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

  const activeBranch = scenarioState.branches.find(b => b.id === activeBranchId) || scenarioState.branches[0];

  return (
    <div className="space-y-6">

      {/* TOP: Brand Banner & Preset Selector */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0">
            <span className="material-symbols-outlined text-[26px]">account_tree</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                LeakGuard Root Cause Agent
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                UptimeAI / cPacket Topology
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Failure Tree Analysis (FTA) Diagnostic Workspace
            </h1>
          </div>
        </div>

        {/* Search & Scenario Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRunDiagnosis()}
              placeholder="Query symptom (e.g. floor leak)..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedScenarioId}
              onChange={e => handleScenarioChange(e.target.value)}
              className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {FTA_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.symptom}
                </option>
              ))}
            </select>

            <button
              onClick={handleRunDiagnosis}
              className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Diagnose</span>
            </button>
          </div>
        </div>

      </div>

      {/* SCENARIO HEADER BAR (Matching Reference Screenshot Top Bar) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title + Confidence Pill */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Confidence: High {scenarioState.confidence}%</span>
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {scenarioState.title}
          </h2>
        </div>

        {/* Action Controls (Matching Screenshot: Comments, Approve, Revise, Create Work Order) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenLessonDetail(scenarioState.primarySlide)}
            className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
            <span>Comments</span>
          </button>

          <button
            onClick={() => setIsApproved(!isApproved)}
            className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
              isApproved
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>{isApproved ? 'Approved ✓' : 'Approve'}</span>
          </button>

          <button
            onClick={() => handleRunDiagnosis()}
            className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Revise</span>
          </button>

          <button
            onClick={() => onOpenWorkOrderModal(scenarioState.rootCauseSummary, scenarioState.primarySlide)}
            className="h-9 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">assignment_add</span>
            <span>Create Work Order</span>
          </button>
        </div>

      </div>

      {/* MIDDLE: FAILURE TREE ANALYSIS (FTA) GRAPH (Matching Top-Right of Reference Screenshot) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        
        {/* Graph Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500 text-[22px]">account_tree</span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Failure Tree Analysis (FTA) Model
              </span>
              <span className="text-[11px] text-slate-400 font-mono ml-2">
                Click any branch node to inspect evidence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-orange-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> ROOT CAUSE
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Debunked
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Verified
            </span>
          </div>
        </div>

        {/* Visual 3-Column Fault Tree with SVG Bezier Curves */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-none">
          <div className="relative min-w-[920px] h-[360px] flex items-center select-none">
            
            {/* SVG Connecting Curves Layer */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 920 360"
              preserveAspectRatio="none"
            >
              {/* Branch 1 to 5 curves from Root (x: 210, y: 180) to Hypotheses (x: 350, y_i) */}
              {scenarioState.branches.slice(0, 5).map((b, idx) => {
                const y_i = 40 + idx * 70;
                const isRc = b.status === 'root_cause';
                return (
                  <g key={`curve-${b.id}`}>
                    {/* Trunk and S-curve */}
                    <path
                      d={`M 200 180 C 275 180, 275 ${y_i}, 350 ${y_i}`}
                      fill="none"
                      stroke={isRc ? '#ea580c' : b.status === 'verified' ? '#0d9488' : '#64748b'}
                      strokeWidth={isRc ? '3' : '1.75'}
                      strokeDasharray={b.status === 'debunked' ? '4 3' : 'none'}
                      strokeOpacity={isRc ? '1' : '0.6'}
                    />
                    {/* Horizontal link between Hypothesis (x: 580) and Status Badge (x: 640) */}
                    <line
                      x1="580"
                      y1={y_i}
                      x2="640"
                      y2={y_i}
                      stroke={isRc ? '#ea580c' : b.status === 'verified' ? '#0d9488' : '#64748b'}
                      strokeWidth={isRc ? '3' : '1.75'}
                      strokeDasharray={b.status === 'debunked' ? '4 3' : 'none'}
                      strokeOpacity={isRc ? '1' : '0.6'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* COLUMN 1: Root Symptom Node (Left) */}
            <div
              className="absolute left-2 w-48 h-24 rounded-2xl bg-[#09152e] text-white p-4 border-2 border-sky-500 shadow-xl shadow-sky-950/40 flex flex-col justify-center z-10"
              style={{ top: '132px' }}
            >
              <div className="flex items-center gap-1.5 text-sky-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                <span>Top Event (Symptom)</span>
              </div>
              <div className="text-xs font-black leading-snug">
                {scenarioState.symptom}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                {scenarioState.vehicle}
              </div>
            </div>

            {/* COLUMN 2: Hypotheses Pills (Center) */}
            <div className="absolute left-[350px] w-56 flex flex-col gap-[18px] z-10">
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
                    className={`h-[52px] px-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs ${
                      isRc
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-400 text-slate-900 dark:text-white font-extrabold ring-2 ring-orange-500/30'
                        : isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-slate-900 dark:text-white font-bold'
                        : 'bg-white dark:bg-[#0b1329] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isRc ? 'bg-orange-500 animate-pulse' : b.status === 'verified' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      ></span>
                      <span className="text-xs truncate">{b.name}</span>
                    </div>

                    {b.slideNo && (
                      <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800 shrink-0">
                        #{b.slideNo}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* COLUMN 3: Status & Evidence Badges (Right - Matching UptimeAI Screenshot) */}
            <div className="absolute left-[640px] w-64 flex flex-col gap-[18px] z-10">
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
                    className={`h-[52px] px-4 rounded-2xl flex flex-col justify-center transition-all cursor-pointer shadow-xs ${
                      isRc
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 ring-2 ring-orange-400'
                        : isDebunked
                        ? 'bg-[#1b253b] text-slate-200 border border-slate-700/80'
                        : isVerified
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-mono font-black uppercase tracking-wider ${
                          isRc ? 'text-white' : isDebunked ? 'text-cyan-400' : 'text-teal-200'
                        }`}
                      >
                        {isRc ? 'ROOT CAUSE' : isDebunked ? 'Debunked:' : isVerified ? 'Verified:' : 'Checked:'}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-semibold truncate ${
                        isRc ? 'text-orange-100 font-extrabold' : 'text-slate-300'
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

      {/* BOTTOM: DIAGNOSTIC REASONING & TABBED WORKSPACE (Matching Bottom Half of Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT CARD: Incident Narrative & Chain (5 Steps) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-6">
          
          <div className="space-y-4">
            {/* Header: Timestamp + Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">schedule</span>
                <span className="text-xs font-mono font-bold text-slate-500">2:15 PM · Shift QA Log</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Primary Root Cause
              </span>
            </div>

            {/* Narrative Paragraph (Matching UptimeAI Style) */}
            <div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Water barrier misalignment was likely introduced when the sealing screen butyl bead path was disturbed during wire harness clip insertion. Minor clip foam pinch or adhesive necking below 35 mm allowed high-pressure water under shower test to drift across the dry cavity, driving observed floor pan saturation.
              </p>
            </div>

            {/* Vector CAD Cross-Section Diagram */}
            <div className="pt-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>1:1 Engineering Vector CAD Cross-Section</span>
                <span className="text-sky-600 font-bold">Standard: 70mm Clearance</span>
              </div>
              <CadDiagram area="sealing screen butyl clip" slideNo={scenarioState.primarySlide} />
            </div>

            {/* Chain (5 Steps) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Chain ({scenarioState.chain.length} steps)
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  Chronological Isolation
                </span>
              </div>

              <div className="relative pl-6 space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                {scenarioState.chain.map(c => (
                  <div key={c.step} className="relative group">
                    <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-sky-600 text-[10px] font-mono font-bold flex items-center justify-center ring-4 ring-white dark:ring-[#0f172a]">
                      {c.step}
                    </span>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                      <span className="font-extrabold text-slate-900 dark:text-white block">
                        {c.step === 1 ? '#002754: ' : ''}{c.title}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">
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
              className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <span>View Full LLR Slide #{scenarioState.primarySlide} Sheet</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

        </div>

        {/* RIGHT CARD: Investigation Tabs & Recommendations */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-6">
          
          <div className="space-y-4">
            
            {/* Header: Title + Badges + Action Buttons (Matching Screenshot) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {scenarioState.symptom} (Primary)
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    8 tags, 1 records, 2 docs
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(scenarioState.id);
                  }}
                  className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Copy ID</span>
                </button>
              </div>
            </div>

            {/* Sub-navigation Tabs: Tags | Work Orders | Documents | System Details */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-1">
              {(['workorders', 'recommendations', 'documents', 'system'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFtaTab(tab as any)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                    activeFtaTab === tab
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab === 'workorders' ? 'Work Orders' : tab === 'recommendations' ? 'Recommendations' : tab === 'documents' ? 'Documents' : 'System Details'}
                </button>
              ))}
            </div>

            {/* Tab: Work Orders (Exact Layout Matching Reference Screenshot) */}
            {activeFtaTab === 'workorders' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-orange-500 text-sm">build</span>
                      <span className="font-mono font-extrabold text-xs text-slate-900 dark:text-white">
                        Work Order #002754
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Draft
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenWorkOrderModal()}
                      className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* 3-Column Key-Value Matrix Matching Reference Screenshot */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-200 dark:border-slate-800/80">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Created By</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">JMARTIN</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Scheduled At</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">2026-11-03</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Equipment ID</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">IMP5128</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Description</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">Mechanical seal change</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Equipment</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">IMPECO LCKP FEED PUMP</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Maintenance Plant</div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">PLT-100</div>
                    </div>
                  </div>
                </div>

                {/* Recommendations (4 steps) Box Directly Below Work Order Card (Matching Screenshot) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Recommendations (4 steps)
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">print</span>
                      <span>Print RCA Log</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0 mt-0.5">check_circle</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">
                        <strong>1. Execute:</strong> Perform laser alignment with hot thermal-growth targets and document as-found/as-left readings.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                      <span className="material-symbols-outlined text-sky-500 text-[16px] shrink-0 mt-0.5">verified</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">
                        <strong>2. Verify:</strong> Conduct soft-foot check and correction to ≤ 0.002 in residual; clean and standardize shim packs.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[16px] shrink-0 mt-0.5">update</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">
                        <strong>3. Update:</strong> Revise PM procedures to make hot alignment mandatory after any coupling disturbance; store in SAP.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Documents & LLR Citations */}
            {activeFtaTab === 'documents' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Primary Digital Check Reference</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">
                    Renault-Nissan Digital Check Review LLR Slide #{scenarioState.primarySlide} (Doc: RNTBCI/VQE/WL-0{scenarioState.primarySlide})
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Associated Engineering Standards</div>
                  <ul className="list-disc pl-4 mt-1 text-slate-600 dark:text-slate-300 space-y-1">
                    <li>STD-WTR-B04: Door Sealing Screen Clearance ≥ 70mm from access hole</li>
                    <li>STD-WTR-C09: Fastener Push-in Clips with Closed-cell EPDM Foam Gasket</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: System Details */}
            {activeFtaTab === 'system' && (
              <div className="space-y-3 animate-fadeIn text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Subsystem Hierarchy</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">
                    Vehicle BIW &gt; Side Closure &gt; Trim Door Module &gt; Water Ingress Barrier
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Plant &amp; Assembly Line</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">
                    Plant 1 · Trim &amp; Final · Station 06 Water Barrier Cell
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Recommendations (Fallback) */}
            {activeFtaTab === 'recommendations' && (
              <div className="space-y-3 animate-fadeIn">
                {scenarioState.recommendations.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs space-y-1">
                    <div className="text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px] font-mono">
                      {idx + 1}. {r.type}
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="pt-2">
            <button
              onClick={() => onOpenWorkOrderModal(scenarioState.rootCauseSummary, scenarioState.primarySlide)}
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Dispatch Work Order Notification</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
