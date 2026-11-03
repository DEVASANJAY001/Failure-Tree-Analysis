'use client';

import React, { useState } from 'react';
import { DefectLog } from '@/lib/types';

interface LineChecklistProps {
  onShowToast: (msg: string) => void;
}

interface StationCheckItem {
  id: string;
  slideNo: number;
  specCode: string;
  station: string;
  title: string;
  requirement: string;
  tolerance: string;
  status: 'none' | 'pass' | 'fail' | 'na';
}

const INITIAL_CHECKS: StationCheckItem[] = [
  {
    id: 'chk-14',
    slideNo: 14,
    specCode: 'STD-WTR-B04',
    station: 'Station 06 · Trim Line',
    title: 'Butyl Bead Path & Service Clearance',
    requirement: 'Maintain minimum 70 mm clearance between the continuous butyl adhesive line and any door inner panel access/service holes. Zero butyl necking down or gap.',
    tolerance: 'Spec: ≥ 70 mm · Dispense Bead Ø 6.0 ± 0.5 mm',
    status: 'none'
  },
  {
    id: 'chk-10',
    slideNo: 10,
    specCode: 'STD-WTR-C09',
    station: 'Station 06 · Door Wiring Cell',
    title: 'Harness Fastener Foam Washer Integrity',
    requirement: 'Harness push-in clips penetrating into door dry cavity must feature dual-lip closed-cell EPDM foam washers. Inspect for missing, folded, or pinched foam rings.',
    tolerance: '100% Closed-cell EPDM Foam · 30% Compression',
    status: 'none'
  },
  {
    id: 'chk-22',
    slideNo: 22,
    specCode: 'STD-WTR-D02',
    station: 'Station 06 · Lower Door Hem',
    title: 'Bottom Rocker Drain Flap Clearance',
    requirement: 'Inspect bottom outer hem water drain flaps. Confirm acoustic cavity wax or electrocoat paint sludge has not clogged or adhered drain lips together.',
    tolerance: 'Clear Flap Opening ≥ 4.0 mm · Zero Wax Sealing',
    status: 'none'
  },
  {
    id: 'chk-35',
    slideNo: 35,
    specCode: 'STD-WTR-S01',
    station: 'Station 06 · Audio Integration',
    title: 'Speaker Flange Foam Compression Seal',
    requirement: 'Speaker basket perimeter closed-cell foam gasket must compress against painted metal flange with zero wire harness crossover underneath gasket.',
    tolerance: 'Gasket Compression: 30% - 45% · Zero Gap',
    status: 'none'
  }
];

export default function LineChecklist({ onShowToast }: LineChecklistProps) {
  const [checks, setChecks] = useState<StationCheckItem[]>(INITIAL_CHECKS);
  const [vinNumber, setVinNumber] = useState('8XF-90215');
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [defectLogs, setDefectLogs] = useState<DefectLog[]>([
    {
      id: 'DEF-8812',
      concern: 'Butyl Path Discontinuity (<35mm)',
      severity: 'Critical',
      timestamp: '10:14 AM'
    },
    {
      id: 'DEF-8811',
      concern: 'Clip Foam Missing on RH Mirror Loom',
      severity: 'Serious',
      timestamp: '09:42 AM'
    }
  ]);

  const defectOptions = [
    'Butyl Path Gap (<70mm)',
    'Harness Clip Foam Missing',
    'Drain Flap Wax Clog',
    'Speaker Gasket Pinched',
    'Grommet Lip Rolled Under',
    'Unseated Drainage Plug'
  ];

  const handleStatusChange = (id: string, status: 'pass' | 'fail' | 'na') => {
    setChecks(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
    const item = checks.find(c => c.id === id);
    if (status === 'pass') onShowToast(`Slide #${item?.slideNo} check PASSED.`);
    if (status === 'fail') onShowToast(`Slide #${item?.slideNo} check FAILED. Immediate review required!`);
  };

  const completedCount = checks.filter(c => c.status !== 'none').length;
  const progressPct = Math.round((completedCount / checks.length) * 100);

  const toggleChip = (chip: string) => {
    setSelectedChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const handleSimulateScan = () => {
    const newVin = '8XF-' + Math.floor(10000 + Math.random() * 90000);
    setVinNumber(newVin);
    setShowScanModal(false);
    onShowToast(`VIN #${newVin} Scanned and calibrated for Station 06.`);
  };

  const handleLogDefect = () => {
    const defectText = selectedChips.length > 0 ? selectedChips.join(' + ') : 'Inspection anomaly detected';
    const newDefect: DefectLog = {
      id: 'DEF-' + Math.floor(1000 + Math.random() * 9000),
      concern: defectText,
      severity: 'Serious',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDefectLogs([newDefect, ...defectLogs]);
    setSelectedChips([]);
    onShowToast(`Defect ticket #${newDefect.id} logged to Shift QA Lead.`);
  };

  const handleCertifyTakt = () => {
    if (completedCount < checks.length) {
      onShowToast('Please complete all 4 station safety checks before certifying takt.');
      return;
    }
    const hasFail = checks.some(c => c.status === 'fail');
    if (hasFail) {
      onShowToast('Warning: Takt contains FAILED items! Vehicle routed to Rectification Bay 02.');
    } else {
      onShowToast('Station 06 Takt Certified: Passed to Water Shower Booth.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Station Banner */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              Production Takt Certification
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Station 06 · Door &amp; Water Barrier Assembly
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            Pre-shower booth tactile verification. Verify sealing screen butyl clearance, harness grommet foam, and rocker drainage lips before vehicle enters high-pressure rain test.
          </p>
        </div>

        {/* VIN and Certification Control */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setShowScanModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-base">qr_code_scanner</span>
            <span>VIN: <span className="text-sky-600 dark:text-sky-400 font-extrabold">{vinNumber}</span></span>
          </button>

          <button
            onClick={handleCertifyTakt}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>Certify Takt</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-sm font-mono border border-sky-100 dark:border-sky-900">
            {completedCount}/{checks.length}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Takt Check Progress: <span className="font-mono text-sky-600 dark:text-sky-400">{progressPct}%</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {completedCount === checks.length ? 'All checkpoints verified' : `${checks.length - completedCount} pending check(s)`}
            </div>
          </div>
        </div>

        <div className="w-48 sm:w-64 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPct === 100 ? 'bg-emerald-500' : 'bg-sky-500'
            }`}
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* Check Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map(chk => {
          const isPass = chk.status === 'pass';
          const isFail = chk.status === 'fail';
          const isNa = chk.status === 'na';

          return (
            <div
              key={chk.id}
              className={`bg-white dark:bg-[#0f172a] rounded-3xl p-6 border relative overflow-hidden flex flex-col justify-between gap-4 transition-all shadow-xs ${
                isPass
                  ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/20'
                  : isFail
                  ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20'
                  : isNa
                  ? 'border-slate-300 dark:border-slate-700 bg-slate-50/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Left Colored Stripe */}
              <div
                className={`w-2 absolute left-0 top-0 bottom-0 ${
                  isPass
                    ? 'bg-emerald-500'
                    : isFail
                    ? 'bg-rose-500'
                    : isNa
                    ? 'bg-slate-400'
                    : 'bg-transparent'
                }`}
              ></div>

              <div className="space-y-3 pl-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                      Slide #{chk.slideNo}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {chk.specCode}
                    </span>
                  </div>

                  {/* Status Pill */}
                  {isPass && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span> PASS
                    </span>
                  )}
                  {isFail && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 font-bold font-mono text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">close</span> FAIL
                    </span>
                  )}
                  {isNa && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">remove_done</span> N/A
                    </span>
                  )}
                  {chk.status === 'none' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 font-mono text-[11px]">
                      Pending Verification
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {chk.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {chk.requirement}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {chk.tolerance}
                </div>
              </div>

              {/* Glove-friendly Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleStatusChange(chk.id, 'pass')}
                  className={`min-h-[46px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isPass
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Pass</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(chk.id, 'fail')}
                  className={`min-h-[46px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isFail
                      ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>Fail</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(chk.id, 'na')}
                  className={`min-h-[46px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all active:scale-95 ${
                    isNa
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">remove_done</span>
                  <span>N/A</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Defect Fast Dock & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast Defect Ingestion */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500 text-xl">report_problem</span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Fast Defect Dock (Shift QA Lead)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Tap anomaly chips below</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {defectOptions.map(chip => {
              const isSelected = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    isSelected
                      ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-600' : 'bg-slate-400'}`}></span>
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleLogDefect}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add_alert</span>
              <span>Log Defect Ticket</span>
            </button>
          </div>
        </div>

        {/* Defect Logs History */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Shift Defect Queue
            </h3>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
              {defectLogs.length} Active
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {defectLogs.map(def => (
              <div
                key={def.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
                  <span className="font-bold text-rose-900 dark:text-rose-300 font-mono shrink-0">{def.id}:</span>
                  <span className="text-slate-800 dark:text-slate-200 truncate">{def.concern}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 shrink-0 ml-2">{def.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulated Scanner Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-500">barcode_scanner</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Chassis VIN Scanner
                </h3>
              </div>
              <button
                onClick={() => setShowScanModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Viewfinder Graphics */}
            <div className="h-48 rounded-2xl bg-slate-900 relative flex items-center justify-center border-2 border-dashed border-sky-500/50 overflow-hidden">
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,1)] animate-bounce"></div>
              <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
                Align Barcode / QR Code
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowScanModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateScan}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
                <span>Simulate Scan VIN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

