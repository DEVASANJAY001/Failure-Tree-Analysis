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
  const [assignedTo, setAssignedTo] = useState('Nikit (Techline Specialist)');
  const [hours, setHours] = useState('1.5');

  useEffect(() => {
    if (initialDescription) {
      setDescription(initialDescription);
    }
    setDueDate(new Date().toISOString().slice(0, 10));
  }, [initialDescription, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      description,
      priority,
      dueDate,
      assignedTo,
      estimatedHours: hours,
    });
    onClose();
  };

  return (
    <div
      id="workOrderModal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto p-4 flex items-center justify-center"
    >
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Create a Work Order Notification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create a work order notification for this recommendations
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              placeholder="Laser align pump / re-route butyl bead to 70mm..."
              required
            ></textarea>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-sky-500"
              >
                <option value="High">High</option>
                <option value="Critical">Critical (Line Stop)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Assigned To & Estimated Hours Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Assigned To</label>
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-sky-500"
              >
                <option value="Nikit (Techline Specialist)">Nikit (Techline Specialist)</option>
                <option value="Sree Vishnu (VQE Lead)">Sree Vishnu (VQE Lead)</option>
                <option value="Damodharan (Analyst)">Damodharan (Analyst)</option>
                <option value="J. Ramirez (Trim Station 06)">J. Ramirez (Trim Station 06)</option>
                <option value="A. Patel (Quality Lead)">A. Patel (Quality Lead)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                value={hours}
                onChange={e => setHours(e.target.value)}
                placeholder="Enter hours"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Modal Footer (Matching Screenshot) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="h-10 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">check</span> Confirm
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

