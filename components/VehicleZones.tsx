'use client';

import React, { useState } from 'react';
import { ZONE_CONFIG } from '@/lib/fta-scenarios';
import { ZoneItem } from '@/lib/types';

interface VehicleZonesProps {
  onSelectZone: (zoneName: string) => void;
}

export default function VehicleZones({ onSelectZone }: VehicleZonesProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'doors' | 'cowl' | 'underbody' | 'roof' | 'quarter' | 'tailgate'>('all');
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All 17 Zones', count: 17 },
    { id: 'doors', label: 'Doors & Sills', count: 4 },
    { id: 'cowl', label: 'Cowl & Bulkhead', count: 3 },
    { id: 'underbody', label: 'Floor & Battery', count: 3 },
    { id: 'roof', label: 'Roof & Ditch', count: 2 },
    { id: 'quarter', label: 'Quarter Glass', count: 2 },
    { id: 'tailgate', label: 'Tailgate / Lamps', count: 3 },
  ];

  const filteredZones = ZONE_CONFIG.filter(z => {
    if (activeFilter === 'all') return true;
    return z.group.toLowerCase().includes(activeFilter);
  });

  const hotspots = [
    { id: 'cowl', label: 'Cowl & Firewall (9)', cx: 210, cy: 110, zoneName: 'Cowl & Firewall' },
    { id: 'windshield', label: 'A-Pillar & Glazing (6)', cx: 275, cy: 75, zoneName: 'A-Pillar & Windshield' },
    { id: 'roof', label: 'Roof Ditch & Drain (7)', cx: 410, cy: 55, zoneName: 'Roof & Sunroof' },
    { id: 'doors', label: 'Doors & Seal Beads (18)', cx: 360, cy: 125, zoneName: 'Front & Rear Doors' },
    { id: 'floor', label: 'Floor Pan & Plugs (11)', cx: 400, cy: 165, zoneName: 'Floor Pan & Underbody' },
    { id: 'quarter', label: 'Quarter Glass (5)', cx: 520, cy: 80, zoneName: 'Quarter Glass & C-Pillar' },
    { id: 'tailgate', label: 'Tailgate & Backlite (8)', cx: 620, cy: 100, zoneName: 'Tailgate & Liftgate' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              Chassis Hotspot Topology
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            17 Vehicle Ingress Critical Zones
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            Click on any chassis target or zone card below to filter the 76 LLR engineering lessons, check points, and standard countermeasures.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div className="text-center px-3 py-1.5 border-r border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white text-base">17</div>
            <div className="text-[10px] text-slate-500 uppercase">Total Zones</div>
          </div>
          <div className="text-center px-3 py-1.5 border-r border-slate-200 dark:border-slate-800">
            <div className="font-bold text-rose-600 dark:text-rose-400 text-base">7</div>
            <div className="text-[10px] text-slate-500 uppercase">High Risk</div>
          </div>
          <div className="text-center px-3 py-1.5">
            <div className="font-bold text-sky-600 dark:text-sky-400 text-base">76</div>
            <div className="text-[10px] text-slate-500 uppercase">Total Lessons</div>
          </div>
        </div>
      </div>

      {/* Interactive Chassis Blueprint */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-md relative overflow-hidden text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400 text-lg">directions_car</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Interactive BIW Water Ingress Hotspots
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
            Click hotspot to view lessons
          </span>
        </div>

        {/* Vector SVG Silhouette & Hotspots */}
        <div className="w-full h-56 md:h-64 flex items-center justify-center relative">
          <svg
            viewBox="0 0 740 220"
            className="w-full h-full max-w-3xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="chassisGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="740" height="220" fill="url(#chassisGrid)" rx="16" />

            {/* Vehicle Silhouette Outline */}
            <path
              d="M 120 160 
                 L 155 160 
                 A 35 35 0 0 1 225 160 
                 L 495 160 
                 A 35 35 0 0 1 565 160 
                 L 645 160 
                 C 655 160 660 150 660 135 
                 L 655 95 
                 C 650 80 640 70 615 65 
                 L 535 55 
                 L 310 55 
                 L 220 95 
                 L 140 105 
                 C 120 108 115 120 115 140 
                 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Windows / Greenhouse Area */}
            <path
              d="M 235 98 L 315 63 L 530 63 L 610 72 L 640 98 Z"
              fill="#0284c7"
              fillOpacity="0.15"
              stroke="#0ea5e9"
              strokeWidth="1.5"
            />
            {/* A/B/C Pillars */}
            <line x1="320" y1="63" x2="310" y2="98" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="430" y1="63" x2="430" y2="155" stroke="#38bdf8" strokeWidth="2" />
            <line x1="535" y1="63" x2="550" y2="98" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

            {/* Wheels */}
            <circle cx="190" cy="160" r="30" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            <circle cx="190" cy="160" r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="530" cy="160" r="30" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
            <circle cx="530" cy="160" r="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="2" />

            {/* Ground line */}
            <line x1="80" y1="190" x2="680" y2="190" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 4" />

            {/* Hotspots */}
            {hotspots.map(h => {
              const isHovered = hoveredHotspot === h.id;
              return (
                <g
                  key={h.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectZone(h.zoneName)}
                  onMouseEnter={() => setHoveredHotspot(h.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  {/* Outer pulse */}
                  <circle
                    cx={h.cx}
                    cy={h.cy}
                    r={isHovered ? 18 : 12}
                    className="transition-all duration-200 fill-sky-500/30 group-hover:fill-sky-400/40 animate-ping"
                  />
                  {/* Mid circle */}
                  <circle
                    cx={h.cx}
                    cy={h.cy}
                    r={isHovered ? 12 : 8}
                    className="transition-all duration-200 fill-sky-500 stroke-white stroke-2 group-hover:scale-125"
                  />
                  {/* Tooltip Label */}
                  <text
                    x={h.cx}
                    y={h.cy - 16}
                    textAnchor="middle"
                    fill={isHovered ? '#38bdf8' : '#e2e8f0'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow"
                  >
                    {h.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              activeFilter === tab.id
                ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Zone Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredZones.map((z: ZoneItem) => (
          <article
            key={z.id}
            className="bg-white dark:bg-[#0f172a] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group hover:border-sky-300 dark:hover:border-sky-800"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">{z.icon}</span>
                </div>
                <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  {z.count} Lessons
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {z.name}
                </h3>
                <span className="text-xs text-slate-400 font-medium">{z.station}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-500 shrink-0">warning</span>
                <span className="truncate font-medium">{z.risk}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectZone(z.name)}
              className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
              type="button"
            >
              <span>Open Lessons ({z.count})</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

