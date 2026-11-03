'use client';

import React, { useState, useEffect } from 'react';
import { Lesson, WorkOrder } from '@/lib/types';
import defaultLessonsData from '@/lessons-data.json';
import { Navbar } from '@/components/Navbar';
import { FtaDiagnosticAgent } from '@/components/FtaDiagnosticAgent';
import { LessonsBrowser } from '@/components/LessonsBrowser';
import VehicleZones from '@/components/VehicleZones';
import LineChecklist from '@/components/LineChecklist';
import DataSync from '@/components/DataSync';
import { LessonDetailDrawer } from '@/components/LessonDetailDrawer';
import { WorkOrderModal } from '@/components/WorkOrderModal';

export default function Home() {
  const [lessons, setLessons] = useState<Lesson[]>(defaultLessonsData as Lesson[]);
  const [activeTab, setActiveTab] = useState<'fta-agent' | 'lessons-browser' | 'zones' | 'checklist' | 'sync'>('fta-agent');
  const [verifiedSlides, setVerifiedSlides] = useState<Set<number>>(new Set([10, 14, 22]));
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isWorkOrderOpen, setIsWorkOrderOpen] = useState(false);
  const [workOrderPresetDesc, setWorkOrderPresetDesc] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterQueryFromZone, setFilterQueryFromZone] = useState<string>('');

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-2024-001',
      status: 'In Progress',
      description: 'Slide #10: Replace missing harness foam washer with closed-cell EPDM grommet',
      equipment: 'Door Sealing Barrier Cell #06',
      plant: 'Plant 1 - Trim Line',
      priority: 'High',
      assignedTo: 'Nikit (Techline Specialist)',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      estimatedHours: '1.5'
    },
    {
      id: 'WO-2024-002',
      status: 'Draft',
      description: 'Slide #14: Reset automated butyl dispensing head clearance to ≥ 70mm from perimeter hole',
      equipment: 'Robotic Dispenser Bot #4',
      plant: 'Plant 1 - Sealing Cell',
      priority: 'Critical',
      assignedTo: 'Priya (VQE Lead)',
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString().slice(0, 10),
      estimatedHours: '2.0'
    }
  ]);

  // Load saved state from localStorage on client mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('leakguard_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      const savedVerified = localStorage.getItem('leakguard_verified_slides');
      if (savedVerified) {
        const arr = JSON.parse(savedVerified);
        setVerifiedSlides(new Set(arr));
      }

      const savedWOs = localStorage.getItem('leakguard_work_orders');
      if (savedWOs) {
        setWorkOrders(JSON.parse(savedWOs));
      }
    } catch (e) {
      // LocalStorage access failover
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('leakguard_theme', next);
      } catch (e) {}
      return next;
    });
  };

  const handleToggleVerify = (slideNo: number) => {
    setVerifiedSlides(prev => {
      const next = new Set(prev);
      if (next.has(slideNo)) {
        next.delete(slideNo);
        showToast(`Slide #${slideNo} removed from verified records.`);
      } else {
        next.add(slideNo);
        showToast(`Slide #${slideNo} successfully verified!`);
      }
      try {
        localStorage.setItem('leakguard_verified_slides', JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  const handleOpenLessonDetail = (slideNo: number) => {
    const found = lessons.find(l => l.slideNo === slideNo);
    if (found) {
      setSelectedLesson(found);
    } else {
      showToast(`Slide #${slideNo} not found in database.`);
    }
  };

  const handleOpenWorkOrderModal = (presetDesc?: string, slideNo?: number) => {
    if (presetDesc) {
      setWorkOrderPresetDesc(presetDesc);
    } else if (slideNo) {
      const found = lessons.find(l => l.slideNo === slideNo);
      setWorkOrderPresetDesc(`Work order for Slide #${slideNo}: ${found?.concern || 'Water leak countermeasure'}`);
    } else {
      setWorkOrderPresetDesc('Water barrier sealing inspection and countermeasure verification');
    }
    setIsWorkOrderOpen(true);
  };

  const handleConfirmWorkOrder = (woData: Partial<WorkOrder>) => {
    const newWo: WorkOrder = {
      id: `WO-2024-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Draft',
      description: woData.description || 'Inspection and rectification task',
      equipment: woData.equipment || 'Door & Water Barrier Cell',
      plant: woData.plant || 'Plant 1 - Assembly Line',
      priority: woData.priority || 'High',
      assignedTo: woData.assignedTo || 'Nikit (Techline Specialist)',
      dueDate: woData.dueDate || new Date().toISOString().slice(0, 10),
      estimatedHours: woData.estimatedHours || '1.5'
    };

    const updated = [newWo, ...workOrders];
    setWorkOrders(updated);
    try {
      localStorage.setItem('leakguard_work_orders', JSON.stringify(updated));
    } catch (e) {}

    showToast(`Work Order #${newWo.id} created successfully! Dispatched to ${newWo.assignedTo}.`);
  };

  const handleUpdateWorkOrderStatus = (id: string, status: string) => {
    const updated = workOrders.map(wo => (wo.id === id ? { ...wo, status } : wo));
    setWorkOrders(updated);
    try {
      localStorage.setItem('leakguard_work_orders', JSON.stringify(updated));
    } catch (e) {}
    showToast(`Work Order #${id} status updated to: ${status}`);
  };

  const handleSelectZone = (zoneName: string) => {
    setFilterQueryFromZone(zoneName);
    setActiveTab('lessons-browser');
    showToast(`Filtering lessons for zone: ${zoneName}`);
  };

  const handleLessonsImported = (newLessons: Lesson[]) => {
    setLessons(newLessons);
    showToast(`Loaded ${newLessons.length} lessons into database.`);
  };

  const handleRestoreDefaults = () => {
    setLessons(defaultLessonsData as Lesson[]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        lessonsCount={lessons.length}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Lessons Total</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{lessons.length}</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">menu_book</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Critical Zones</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">17</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">hub</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Verified Slides</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{verifiedSlides.size}</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">verified</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Work Orders</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{workOrders.length}</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[19px]">assignment</span>
            </div>
          </div>
        </div>

        {/* View Switcher Container */}
        {activeTab === 'fta-agent' && (
          <FtaDiagnosticAgent
            lessons={lessons}
            workOrders={workOrders}
            onOpenWorkOrderModal={handleOpenWorkOrderModal}
            onOpenLessonDetail={handleOpenLessonDetail}
            onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
          />
        )}

        {activeTab === 'lessons-browser' && (
          <LessonsBrowser
            lessons={lessons}
            verifiedSlides={verifiedSlides}
            onToggleVerify={handleToggleVerify}
            onOpenLessonDetail={handleOpenLessonDetail}
          />
        )}

        {activeTab === 'zones' && (
          <VehicleZones onSelectZone={handleSelectZone} />
        )}

        {activeTab === 'checklist' && (
          <LineChecklist onShowToast={showToast} />
        )}

        {activeTab === 'sync' && (
          <DataSync
            totalLessons={lessons.length}
            onLessonsImported={handleLessonsImported}
            onRestoreDefaults={handleRestoreDefaults}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Slide-over Drawer for Lesson Detail */}
      <LessonDetailDrawer
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
        onVerify={handleToggleVerify}
        isVerified={selectedLesson ? verifiedSlides.has(selectedLesson.slideNo) : false}
        onFlagDefect={(slideNo, concern) => {
          showToast(`Defect flagged for Slide #${slideNo}: ${concern}`);
        }}
      />

      {/* Create Work Order Modal */}
      <WorkOrderModal
        isOpen={isWorkOrderOpen}
        onClose={() => setIsWorkOrderOpen(false)}
        onConfirm={handleConfirmWorkOrder}
        initialDescription={workOrderPresetDesc}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-800/95 text-white shadow-xl backdrop-blur-sm border border-slate-700 animate-slideUp">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          <span className="text-xs font-medium max-w-sm">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">LeakGuard LLR</span>
            <span>·</span>
            <span>Automotive Digital Check Ingress Review &amp; Failure Tree Analysis System</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Authoritative 76-Slide Knowledge Base · Next.js 14 App Router · React 18
          </div>
        </div>
      </footer>
    </div>
  );
}

