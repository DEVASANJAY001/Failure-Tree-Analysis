'use client';

import React, { useState, useEffect } from 'react';
import { WorkOrder } from '@/lib/types';

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (wo: Partial<WorkOrder>) => void;
  initialDescription?: string;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialDescription = '',
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState('High');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('Nikit');
  const [hours, setHours] = useState('1.5');

  useEffect(() => {
    if (initialDescription) {
      setDescription(initialDescription);
    }
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    setDueDate(tomorrow);
  }, [initialDescription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      description: description || 'Laser align pump / verify butyl barrier integrity',
      priority,
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      assignedTo,
      estimatedHours: hours || '1.5',
    });
    onClose();
  };

  return (
    <div
      id="workOrderModal"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm overflow-y-auto p-4 flex items-center justify-center animate-fadeIn"
    >
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col transform transition-all">
        
        {/* Header (Matching User's Reference Screenshot) */}
        <div className="px-7 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Create a Work Order Notification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create a work order notification for this recommendations
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-7 pb-7 pt-2 space-y-5 text-xs">
          
          {/* Description */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-400"
              placeholder="Laser align pump"
              required
            ></textarea>
          </div>

          {/* Row 1: Priority & Due Date (Equal Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
                >
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-3 text-slate-400 text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Assigned To & Estimated Hours (Equal Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Assigned To
              </label>
              <div className="relative">
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none appearance-none"
                >
                  <option value="Nikit">Nikit</option>
                  <option value="Priya (VQE Lead)">Priya (VQE Lead)</option>
                  <option value="Damodharan (Analyst)">Damodharan (Analyst)</option>
                  <option value="J. Ramirez (Trim Line 06)">J. Ramirez (Trim Line 06)</option>
                  <option value="Shift Quality Lead">Shift Quality Lead</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-3 text-slate-400 text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 text-xs">
                Estimated Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={hours}
                onChange={e => setHours(e.target.value)}
                placeholder="Enter hours"
                className="w-full h-11 px-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Footer (Matching Screenshot: Cancel plain text + Green Confirm Pill) */}
          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              type="button"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-colors px-2 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Confirm</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
