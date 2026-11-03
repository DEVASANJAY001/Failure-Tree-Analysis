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
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span className="text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              Chassis Ingress Topology
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            17 Critical Vehicle Ingress Zones
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Click on any chassis target or zone card below to inspect the 76 historical digital check lessons and engineering standards.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-mono">
          <div className="text-center px-3 py-1 border-r border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white text-sm">17</div>
            <div className="text-[10px] text-slate-400 uppercase">Zones</div>
          </div>
          <div className="text-center px-3 py-1 border-r border-slate-200 dark:border-slate-800">
            <div className="font-bold text-rose-600 dark:text-rose-400 text-sm">7</div>
            <div className="text-[10px] text-slate-400 uppercase">High Risk</div>
          </div>
          <div className="text-center px-3 py-1">
            <div className="font-bold text-sky-600 dark:text-sky-400 text-sm">76</div>
            <div className="text-[10px] text-slate-400 uppercase">Lessons</div>
          </div>
        </div>
      </div>

      {/* Interactive Chassis Blueprint */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/80 shadow-md relative overflow-hidden text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400 text-lg">directions_car</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              BIW Water Ingress Hotspots
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
            Click hotspot to view lessons
          </span>
        </div>

        {/* Vector SVG Silhouette & Hotspots */}
        <div className="w-full h-52 md:h-60 flex items-center justify-center relative">
          <svg
            viewBox="0 0 740 220"
            className="w-full h-full max-w-3xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="chassisGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#172033" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="740" height="220" fill="url(#chassisGrid)" rx="14" />

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
              fill="#0b1329"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Windows / Greenhouse Area */}
            <path
              d="M 235 98 L 315 63 L 530 63 L 610 72 L 640 98 Z"
              fill="#0284c7"
              fillOpacity="0.12"
              stroke="#0284c7"
              strokeWidth="1.25"
            />
            {/* A/B/C Pillars */}
            <line x1="320" y1="63" x2="310" y2="98" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="430" y1="63" x2="430" y2="155" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="535" y1="63" x2="550" y2="98" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Wheels */}
            <circle cx="190" cy="160" r="28" fill="#111827" stroke="#475569" strokeWidth="2.5" />
            <circle cx="190" cy="160" r="12" fill="#070d1e" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="530" cy="160" r="28" fill="#111827" stroke="#475569" strokeWidth="2.5" />
            <circle cx="530" cy="160" r="12" fill="#070d1e" stroke="#64748b" strokeWidth="1.5" />

            {/* Ground line */}
            <line x1="80" y1="190" x2="680" y2="190" stroke="#1e293b" strokeWidth="1" strokeDasharray="6 4" />

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
                  <circle
                    cx={h.cx}
                    cy={h.cy}
                    r={isHovered ? 14 : 9}
                    className="transition-all duration-200 fill-sky-400 stroke-white stroke-2"
                  />
                  <text
                    x={h.cx}
                    y={h.cy - 14}
                    textAnchor="middle"
                    fill={isHovered ? '#38bdf8' : '#cbd5e1'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="600"
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs font-bold'
                : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
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
            className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60">
                  <span className="material-symbols-outlined text-[22px]">{z.icon}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {z.count} Lessons
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {z.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">{z.station}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-[15px] text-amber-500 shrink-0">warning</span>
                <span className="truncate text-[11px] font-medium">{z.risk}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectZone(z.name)}
              className="w-full h-9 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
              type="button"
            >
              <span>Open Lessons ({z.count})</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
