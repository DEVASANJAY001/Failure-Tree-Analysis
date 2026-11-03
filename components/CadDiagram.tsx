'use client';

import React from 'react';

interface CadDiagramProps {
  area?: string;
  slideNo?: number;
}

export const CadDiagram: React.FC<CadDiagramProps> = ({ area = '' }) => {
  const a = area.toLowerCase();

  // 1. Clips / Fasteners
  if (a.includes('clip') || a.includes('fastener')) {
    return (
      <svg className="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
        <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" strokeWidth="1"></path>
        <path d="M 100 0 V 96 M 200 0 V 96 M 300 0 V 96" stroke="#1e293b" strokeWidth="1"></path>
        <line x1="30" y1="48" x2="370" y2="48" stroke="#475569" strokeWidth="5" strokeLinecap="round"></line>
        <line x1="180" y1="48" x2="220" y2="48" stroke="#0f172a" strokeWidth="7"></line>
        <rect x="172" y="42" width="56" height="12" rx="3" fill="#10b981" stroke="#34d399" strokeWidth="1.5"></rect>
        <path d="M 195 24 V 46 L 190 56 L 200 70 L 210 56 L 205 46 V 24 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5"></path>
        <circle cx="200" cy="24" r="14" fill="#0284c7" opacity="0.3"></circle>
        <text x="200" y="16" fill="#38bdf8" fontFamily="JetBrains Mono" fontSize="8.5" fontWeight="700" textAnchor="middle">CLOSED-CELL EPT FOAM GASKET (T=1.0mm)</text>
        <text x="50" y="44" fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">DOOR INNER PANEL</text>
        <text x="245" y="65" fill="#34d399" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700">COMPRESSION SEAL &gt; 40%</text>
      </svg>
    );
  }

  // 2. Sealing Screen & Butyl Path
  if (a.includes('sealing screen') || a.includes('screen')) {
    return (
      <svg className="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
        <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" strokeWidth="1"></path>
        <path d="M 120 0 V 96 M 240 0 V 96" stroke="#1e293b" strokeWidth="1"></path>
        <rect x="40" y="46" width="320" height="4" fill="#64748b"></rect>
        <path d="M 40 40 C 100 40 180 32 360 32" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 2"></path>
        <ellipse cx="260" cy="46" rx="8" ry="5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5"></ellipse>
        <circle cx="100" cy="46" r="6" fill="#ef4444"></circle>
        <line x1="100" y1="24" x2="260" y2="24" stroke="#34d399" strokeWidth="1.5"></line>
        <path d="M 100 21 L 96 24 L 100 27 M 260 21 L 264 24 L 260 27" stroke="#34d399" strokeWidth="1.5"></path>
        <text x="180" y="19" fill="#34d399" fontFamily="JetBrains Mono" fontSize="8.5" fontWeight="700" textAnchor="middle">CLEARANCE ≥ 70mm (NDS RULE)</text>
        <text x="100" y="65" fill="#f87171" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600" textAnchor="middle">HARNESS CLIP HOLE</text>
        <text x="260" y="65" fill="#fbbf24" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600" textAnchor="middle">BUTYL ADHESIVE BEAD</text>
      </svg>
    );
  }

  // 3. Floor & Plugs
  if (a.includes('floor') || a.includes('plug') || a.includes('grommet') || a.includes('hole')) {
    return (
      <svg className="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
        <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" strokeWidth="1"></path>
        <path d="M 140 0 V 96 M 260 0 V 96" stroke="#1e293b" strokeWidth="1"></path>
        <line x1="30" y1="46" x2="160" y2="46" stroke="#64748b" strokeWidth="6"></line>
        <line x1="240" y1="46" x2="370" y2="46" stroke="#64748b" strokeWidth="6"></line>
        <path d="M 155 42 H 245 V 48 H 230 C 230 62 215 68 200 68 C 185 68 170 62 170 48 H 155 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5"></path>
        <ellipse cx="200" cy="46" rx="42" ry="3" fill="#10b981" opacity="0.6"></ellipse>
        <text x="200" y="20" fill="#38bdf8" fontFamily="JetBrains Mono" fontSize="8.5" fontWeight="700" textAnchor="middle">E-COAT DRAIN HOLE (360° CONTACT FLANGE)</text>
        <text x="70" y="60" fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">FLOOR SHEET METAL</text>
        <text x="325" y="60" fill="#34d399" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700">FLUSH SEAL</text>
      </svg>
    );
  }

  // 4. Cowl & HVAC
  if (a.includes('cowl') || a.includes('hvac')) {
    return (
      <svg className="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
        <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" strokeWidth="1"></path>
        <path d="M 100 0 V 96 M 220 0 V 96 M 320 0 V 96" stroke="#1e293b" strokeWidth="1"></path>
        <path d="M 40 70 H 160 V 32 H 180 V 70 H 360" stroke="#64748b" strokeWidth="4" fill="none"></path>
        <rect x="156" y="30" width="28" height="40" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5"></rect>
        <line x1="140" y1="32" x2="140" y2="70" stroke="#34d399" strokeWidth="1.5"></line>
        <text x="120" y="52" fill="#34d399" fontFamily="JetBrains Mono" fontSize="8" fontWeight="700" textAnchor="end">≥ 37mm</text>
        <text x="210" y="20" fill="#fbbf24" fontFamily="JetBrains Mono" fontSize="8.5" fontWeight="700" textAnchor="middle">WATER BOX STOPPER WEIR (Z-HEIGHT ≥ 37mm)</text>
        <text x="80" y="84" fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">WATER TROUGH</text>
        <text x="270" y="84" fill="#38bdf8" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">HVAC AIR INTAKE</text>
      </svg>
    );
  }

  // Default High-Precision Industrial CAD Cross-Section
  return (
    <svg className="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
      <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" strokeWidth="1"></path>
      <path d="M 80 0 V 96 M 200 0 V 96 M 320 0 V 96" stroke="#1e293b" strokeWidth="1"></path>
      <rect x="40" y="38" width="180" height="6" fill="#64748b"></rect>
      <rect x="180" y="44" width="180" height="6" fill="#475569"></rect>
      <ellipse cx="180" cy="44" rx="18" ry="9" fill="#10b981" stroke="#34d399" strokeWidth="1.5"></ellipse>
      <text x="200" y="24" fill="#34d399" fontFamily="JetBrains Mono" fontSize="8.5" fontWeight="700" textAnchor="middle">VALIDATED SEAL BARRIER · 360° CONTINUITY</text>
      <text x="100" y="62" fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">BIW OUTER</text>
      <text x="300" y="62" fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="8" fontWeight="600">BIW INNER REINFORCEMENT</text>
    </svg>
  );
};

