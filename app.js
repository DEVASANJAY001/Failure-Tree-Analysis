/**
 * LeakGuard LLR — Water Leak Knowledge & Shopfloor Portal
 * Human-Crafted Automotive Quality Engineering System
 * Digital Check Review (LLR) Engine for Renault-Nissan RNTBCI Standards
 */

(function () {
  'use strict';

  // Local storage keys
  const STORAGE_KEY = 'LEAKGUARD_LESSONS_DATA_V3';
  const VERIFIED_KEY = 'LEAKGUARD_VERIFIED_SLIDES_V3';
  const CHECKLIST_KEY = 'LEAKGUARD_STATION_CHECKS_V3';
  const DEFECTS_KEY = 'LEAKGUARD_DEFECT_LOGS_V3';
  const THEME_KEY = 'LEAKGUARD_THEME_MODE_V3';
  const VIEW_MODE_KEY = 'LEAKGUARD_VIEW_MODE'; // 'cards' | 'table'

  // Application State
  let lessons = [];
  let currentFilter = 'all';
  let currentProjectFilter = 'all';
  let currentSearchQuery = '';
  let activeTab = 'lessons-browser';
  let activeSubView = localStorage.getItem(VIEW_MODE_KEY) || 'cards';
  let currentDetailSlide = null;
  let verifiedSlides = new Set();
  let stationChecks = {};
  let defectLogs = [];

  // Project Code Mapping with full commercial vehicle names
  const PROJECT_NAMES = {
    'PY1B': 'Kiger (PY1B)',
    'HBC': 'Magnite / Kiger (HBC)',
    'RBC': 'Triber (RBC)',
    'XBA': 'Kwid (XBA)',
    'PB1D': 'Duster (PB1D)',
    'HHA': 'Captur (HHA)',
    'I2': 'Concept (I2)'
  };

  // 17 Inspection Zones Config
  const ZONE_CONFIG = [
    { id: 'doors', name: 'Front & Rear Doors', count: 18, risk: 'Butyl bead gap / Clip foam pinch', group: 'doors high-risk', icon: 'sensor_door', station: 'Station 06 · Trim Line' },
    { id: 'floor', name: 'Floor Pan & Underbody', count: 11, risk: 'Unseated oval e-coat drainage plugs', group: 'underbody', icon: 'layers', station: 'Station 04 · Underbody' },
    { id: 'cowl', name: 'Cowl & Firewall', count: 9, risk: 'Pass-through grommet lip roll-under', group: 'cowl high-risk', icon: 'speed', station: 'Station 02 · Engine Deck' },
    { id: 'tailgate', name: 'Tailgate & Liftgate', count: 8, risk: 'Camera harness conduit unclipped', group: 'tailgate', icon: 'luggage', station: 'Station 08 · Rear Final' },
    { id: 'roof', name: 'Roof & Sunroof', count: 7, risk: 'Rear pillar drain hose pinch', group: 'roof', icon: 'roofing', station: 'Station 05 · Overhead' },
    { id: 'windshield', name: 'A-Pillar & Windshield', count: 6, risk: 'Urethane overlap void at header', group: 'windshield', icon: 'branding_watermark', station: 'Station 03 · Glazing Cell' },
    { id: 'quarter', name: 'Quarter Glass & C-Pillar', count: 5, risk: 'Primer skip on sharp inner radii', group: 'quarter', icon: 'crop_square', station: 'Station 07 · Fixed Glass' },
    { id: 'hvac', name: 'HVAC & Bulkhead', count: 4, risk: 'Condensate spout body misalignment', group: 'cowl', icon: 'mode_fan', station: 'Station 02 · Cockpit' },
    { id: 'wheelhouse', name: 'Wheelhouse & Arch Liners', count: 5, risk: 'Seam sealer skip on panel overlap', group: 'underbody', icon: 'tire_repair', station: 'Station 01 · Body Seal' },
    { id: 'bpillar', name: 'B-Pillar & Rocker Sill', count: 6, risk: 'Rocker drain flap sealed by wax', group: 'doors', icon: 'view_column', station: 'Station 06 · Side Sill' },
    { id: 'fuel', name: 'Fuel / Charge Pocket', count: 3, risk: 'Overspill drain pinched in flange', group: 'quarter', icon: 'local_gas_station', station: 'Station 08 · Fuel Port' },
    { id: 'lamps', name: 'Rear Combination Lamps', count: 4, risk: 'Missing foam washer under stud', group: 'tailgate', icon: 'light_mode', station: 'Station 09 · Lighting' },
    { id: 'ditch', name: 'Roof Ditch Rails & Mounts', count: 3, risk: 'Expansion sealer crack in weld', group: 'roof', icon: 'dehaze', station: 'Station 05 · BIW Roof' },
    { id: 'core', name: 'Front Core & Hood Latch', count: 2, risk: 'Release cable grommet unseated', group: 'cowl', icon: 'view_sidebar', station: 'Station 02 · Front End' },
    { id: 'exhausters', name: 'Cabin Pressure Exhausters', count: 3, risk: 'Rubber flap sticky or missing', group: 'quarter', icon: 'air', station: 'Station 08 · Bumper Area' },
    { id: 'evtray', name: 'EV High-Voltage Tray Gasket', count: 2, risk: 'Continuous perimeter bead skip', group: 'underbody', icon: 'bolt', station: 'Station 04 · EV Battery' },
    { id: 'wiper', name: 'Rear Backlite & Wiper Shaft', count: 2, risk: 'Spindle seal flange deformation', group: 'tailgate', icon: 'aspect_ratio', station: 'Station 08 · Wiper Line' }
  ];

  // DOM Elements cache
  const el = {};

  // Main Initialize
  function init() {
    initTheme();
    loadStoredData();
    cacheDOMElements();
    setupNavigation();
    setupLessonsBrowser();
    setupVehicleZones();
    setupInteractiveChecklist();
    setupDataSync();
    setupDetailDrawer();
    setupHotspots();
    setupKeyboardShortcuts();

    // Render Initial State
    renderLessons();
    renderZones();
    updateChecklistUI();
    updateDataSyncUI();
    updateKPIDashboard();
  }

  // Theme Management
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          localStorage.setItem(THEME_KEY, 'light');
          showToast('Clean Light Mode enabled');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          localStorage.setItem(THEME_KEY, 'dark');
          showToast('Industrial Dark Mode enabled');
        }
      });
    }
  }

  // Load data from localStorage or pre-bundled defaults
  function loadStoredData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        lessons = JSON.parse(stored);
      } else if (window.DEFAULT_LESSONS_DATA && window.DEFAULT_LESSONS_DATA.length > 0) {
        lessons = window.DEFAULT_LESSONS_DATA;
      }
    } catch (e) {
      lessons = window.DEFAULT_LESSONS_DATA || [];
    }

    try {
      const storedVerified = localStorage.getItem(VERIFIED_KEY);
      if (storedVerified) {
        verifiedSlides = new Set(JSON.parse(storedVerified));
      }
    } catch (e) {
      verifiedSlides = new Set();
    }

    try {
      const storedChecks = localStorage.getItem(CHECKLIST_KEY);
      if (storedChecks) {
        stationChecks = JSON.parse(storedChecks);
      } else {
        stationChecks = { 14: 'pass', 22: 'none', 35: 'none', 51: 'none' };
      }
    } catch (e) {
      stationChecks = {};
    }

    try {
      const storedDefects = localStorage.getItem(DEFECTS_KEY);
      if (storedDefects) {
        defectLogs = JSON.parse(storedDefects);
      }
    } catch (e) {
      defectLogs = [];
    }
  }

  function saveLessonsData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
    } catch (e) {}
  }

  function saveVerifiedSlides() {
    try {
      localStorage.setItem(VERIFIED_KEY, JSON.stringify(Array.from(verifiedSlides)));
    } catch (e) {}
  }

  function saveStationChecks() {
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(stationChecks));
    } catch (e) {}
  }

  function saveDefects() {
    try {
      localStorage.setItem(DEFECTS_KEY, JSON.stringify(defectLogs));
    } catch (e) {}
  }

  function cacheDOMElements() {
    // Views
    el.viewLessons = document.getElementById('view-lessons-browser');
    el.viewZones = document.getElementById('view-vehicle-zones');
    el.viewChecklist = document.getElementById('view-interactive-checklist');
    el.viewSync = document.getElementById('view-data-sync');
    el.viewDetail = document.getElementById('view-lesson-detail');

    // Navigation
    el.navTabBtns = document.querySelectorAll('.nav-tab-btn');
    el.mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    el.navCountBadge = document.getElementById('nav-count-badge');

    // KPI Elements
    el.kpiTotalLessons = document.getElementById('kpi-total-lessons');
    el.kpiVerifiedCount = document.getElementById('kpi-verified-count');
    el.kpiVerifiedPct = document.getElementById('kpi-verified-pct');
    el.kpiHighRisk = document.getElementById('kpi-high-risk');

    // Lessons Browser elements
    el.lessonSearch = document.getElementById('lesson-search');
    el.clearSearchBtn = document.getElementById('clear-search-btn');
    el.voiceMicBtn = document.getElementById('voice-mic-btn');
    el.filterChips = document.querySelectorAll('.filter-chip');
    el.lessonsContainer = document.getElementById('lessons-cards-container');
    el.lessonsCountHeader = document.getElementById('lessons-count-header');
    el.projectFilterSelect = document.getElementById('project-filter-select');
    el.areaFilterSelect = document.getElementById('area-filter-select');
    el.viewModeCardsBtn = document.getElementById('view-mode-cards-btn');
    el.viewModeTableBtn = document.getElementById('view-mode-table-btn');
    el.lessonsTableContainer = document.getElementById('lessons-table-container');

    // Vehicle Zones elements
    el.zonePills = document.querySelectorAll('.filter-pill');
    el.zonesContainer = document.getElementById('zones-container');

    // Checklist elements
    el.progBar = document.getElementById('progBar');
    el.completedCount = document.getElementById('completedCount');
    el.percentText = document.getElementById('percentText');
    el.scanBtn = document.getElementById('scanBtn');
    el.scanModal = document.getElementById('scanModal');
    el.closeScanModal = document.getElementById('closeScanModal');
    el.simulateScanBtn = document.getElementById('simulateScanBtn');
    el.completeStationBtn = document.getElementById('completeStationBtn');
    el.submitDefectBtn = document.getElementById('submitDefectBtn');
    el.defectLogsList = document.getElementById('defect-logs-list');

    // Data Sync elements
    el.fileInput = document.getElementById('file-input');
    el.browseBtn = document.getElementById('browse-btn');
    el.dropZone = document.getElementById('drop-zone');
    el.syncNowBtn = document.getElementById('sync-now-btn');
    el.resetCacheBtn = document.getElementById('reset-cache-btn');
    el.downloadTemplateBtn = document.getElementById('download-template-btn');
    el.cachedCountBadge = document.getElementById('cached-count-badge');
    el.cachedFileName = document.getElementById('cached-file-name');

    // Detail Drawer elements
    el.detailBackBtn = document.getElementById('detail-back-btn');
    el.detailSlideNum = document.getElementById('detail-slide-num');
    el.detailDocRef = document.getElementById('detail-doc-ref');
    el.detailProjectArea = document.getElementById('detail-project-area');
    el.detailAuthor = document.getElementById('detail-author');
    el.detailRiskBadge = document.getElementById('detail-risk-badge');
    el.detailTitle = document.getElementById('detail-title');
    el.detailDiagramContainer = document.getElementById('detail-diagram-container');
    el.detailWrongText = document.getElementById('detail-wrong-text');
    el.detailCountermeasureText = document.getElementById('detail-countermeasure-text');
    el.detailChecklistContainer = document.getElementById('detail-checklist-container');
    el.detailCheckCountText = document.getElementById('detail-check-count-text');
    el.detailSignoffBtn = document.getElementById('detail-signoff-btn');
    el.detailDefectBtn = document.getElementById('detail-defect-btn');
    el.detailPrintBtn = document.getElementById('detail-print-btn');
    el.detailCopyRefBtn = document.getElementById('detail-copy-ref-btn');

    // Toast
    el.statusToast = document.getElementById('status-toast');
    el.toastMsg = document.getElementById('toast-msg');
    el.toastClose = document.getElementById('toast-close');
  }

  // Navigation management
  function setupNavigation() {
    window.switchView = function (viewName) {
      activeTab = viewName;

      // Close modal if open
      if (el.viewDetail) el.viewDetail.classList.add('hidden');

      // Hide all views
      [el.viewLessons, el.viewZones, el.viewChecklist, el.viewSync].forEach(v => {
        if (v) v.classList.add('hidden');
      });

      // Show target view
      if (viewName === 'lessons-browser' && el.viewLessons) el.viewLessons.classList.remove('hidden');
      if (viewName === 'vehicle-zones' && el.viewZones) el.viewZones.classList.remove('hidden');
      if (viewName === 'interactive-checklist' && el.viewChecklist) el.viewChecklist.classList.remove('hidden');
      if (viewName === 'data-sync' && el.viewSync) el.viewSync.classList.remove('hidden');

      // Desktop Nav update
      el.navTabBtns.forEach(btn => {
        const path = btn.getAttribute('data-nav-tab');
        if (path === viewName) {
          btn.className = 'nav-tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs';
        } else {
          btn.className = 'nav-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5';
        }
      });

      // Mobile Nav update
      el.mobileNavBtns.forEach(btn => {
        const path = btn.getAttribute('data-path');
        if (path === viewName) {
          btn.className = 'mobile-nav-btn active flex flex-col items-center justify-center flex-1 py-1 text-sky-600 dark:text-sky-400 font-bold';
        } else {
          btn.className = 'mobile-nav-btn flex flex-col items-center justify-center flex-1 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    el.navTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.getAttribute('data-nav-tab');
        window.switchView(path);
      });
    });

    el.mobileNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.getAttribute('data-path');
        window.switchView(path);
      });
    });

    if (el.detailBackBtn) {
      el.detailBackBtn.addEventListener('click', () => {
        if (el.viewDetail) el.viewDetail.classList.add('hidden');
      });
    }
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', e => {
      // '/' to focus search
      if (e.key === '/' && document.activeElement !== el.lessonSearch) {
        e.preventDefault();
        window.switchView('lessons-browser');
        el.lessonSearch?.focus();
      }
      // 'Escape' to close detail drawer / modal
      if (e.key === 'Escape') {
        if (el.viewDetail && !el.viewDetail.classList.contains('hidden')) {
          el.viewDetail.classList.add('hidden');
        }
        if (el.scanModal && !el.scanModal.classList.contains('hidden')) {
          el.scanModal.classList.add('hidden');
        }
      }
    });
  }

  function updateKPIDashboard() {
    if (el.kpiTotalLessons) el.kpiTotalLessons.textContent = lessons.length;
    if (el.navCountBadge) el.navCountBadge.textContent = lessons.length;

    const verifiedCount = verifiedSlides.size;
    if (el.kpiVerifiedCount) el.kpiVerifiedCount.textContent = verifiedCount;
    if (el.kpiVerifiedPct) {
      const pct = lessons.length > 0 ? Math.round((verifiedCount / lessons.length) * 100) : 0;
      el.kpiVerifiedPct.textContent = `(${pct}%)`;
    }

    const highRiskCount = lessons.filter(l => l.risk === 'High Risk').length;
    if (el.kpiHighRisk) el.kpiHighRisk.textContent = highRiskCount;
  }

  // --- TECHNICAL SVG DIAGRAM GENERATOR (HUMAN DESIGNED CAD SCHEMATICS) ---
  function getTechnicalDiagramSVG(area, slideNo) {
    const a = (area || '').toLowerCase();

    // 1. Harness Clips & Fasteners
    if (a.includes('clip') || a.includes('fastener')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Background Blueprint Grid -->
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
          <path d="M 50 0 V 96 M 150 0 V 96 M 250 0 V 96 M 350 0 V 96" stroke="#1e293b" stroke-width="1"></path>
          
          <!-- Sheet Metal Panel -->
          <rect x="30" y="44" width="340" height="8" rx="1" fill="#64748b"></rect>
          <!-- Metal Aperture Hole -->
          <rect x="180" y="44" width="40" height="8" fill="#0f172a"></rect>
          
          <!-- EPT Foam Washer (Black/Dark with Compression Marks) -->
          <rect x="160" y="38" width="80" height="6" rx="2" fill="#10b981" stroke="#34d399" stroke-width="1"></rect>
          <text x="200" y="34" fill="#34d399" font-family="JetBrains Mono" font-size="8" font-weight="700" text-anchor="middle">1.0mm EPT FOAM RING (≥50% DEFLECTION)</text>
          
          <!-- Nylon Clip Body & Retention Barb -->
          <path d="M 175 16 H 225 V 38 H 215 V 74 L 200 82 L 185 74 V 38 H 175 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"></path>
          <path d="M 185 52 L 170 60 L 185 64 Z" fill="#38bdf8"></path>
          <path d="M 215 52 L 230 60 L 215 64 Z" fill="#38bdf8"></path>
          
          <!-- Dimension Arrows -->
          <path d="M 155 38 V 44" stroke="#a7f3d0" stroke-width="1"></path>
          <text x="75" y="24" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">SHEET METAL INNER</text>
          <text x="325" y="78" fill="#38bdf8" font-family="JetBrains Mono" font-size="8" font-weight="700">DUAL BARB LOCK</text>
        </svg>
      `;
    }

    // 2. Door Sealing Screen & Butyl Path
    if (a.includes('sealing screen') || a.includes('butyl')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
          
          <!-- Door Inner Steel Profile -->
          <path d="M 20 70 L 100 70 L 140 40 L 380 40" stroke="#64748b" stroke-width="5" stroke-linecap="round"></path>
          
          <!-- Continuous Polyurethane Butyl Bead -->
          <circle cx="160" cy="40" r="7" fill="#10b981" stroke="#34d399" stroke-width="1.5"></circle>
          
          <!-- PE Sealing Screen Layer (Translucent Blue) -->
          <path d="M 20 66 L 98 66 L 138 34 L 380 34" stroke="#0284c7" stroke-width="2" stroke-dasharray="6 3"></path>
          
          <!-- Clip Position Hole with Dimension Arrow -->
          <circle cx="280" cy="40" r="4" fill="#38bdf8"></circle>
          <line x1="160" y1="20" x2="280" y2="20" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2 2"></line>
          <line x1="160" y1="16" x2="160" y2="24" stroke="#f59e0b" stroke-width="1.5"></line>
          <line x1="280" y1="16" x2="280" y2="24" stroke="#f59e0b" stroke-width="1.5"></line>
          <text x="220" y="14" fill="#fbbf24" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">OFFSET ≥ 70 mm (KOREN THEME)</text>
          
          <text x="60" y="86" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">DOOR INNER HEM</text>
          <text x="310" y="60" fill="#38bdf8" font-family="JetBrains Mono" font-size="8" font-weight="600">HARNESS CLIP LOCATOR</text>
        </svg>
      `;
    }

    // 3. Floor Pan, E-Coat Holes & Body Plugs
    if (a.includes('floor') || a.includes('underbody') || a.includes('holes') || a.includes('plugs') || a.includes('grommets')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 32 H 400 M 0 64 H 400" stroke="#1e293b" stroke-width="1"></path>
          
          <!-- Stamped Floor Recess -->
          <path d="M 30 40 H 140 L 155 58 H 245 L 260 40 H 370" stroke="#64748b" stroke-width="4" fill="none"></path>
          
          <!-- EPDM Rubber Flush Plug -->
          <path d="M 145 54 H 255 V 60 C 255 64 240 68 200 68 C 160 68 145 64 145 60 Z" fill="#10b981" stroke="#34d399" stroke-width="1.5"></path>
          <ellipse cx="200" cy="54" rx="48" ry="4" fill="#059669"></ellipse>
          
          <!-- Splash Vector Arrows (Blocked) -->
          <path d="M 200 88 V 74 M 180 86 L 190 74 M 220 86 L 210 74" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2 2"></path>
          
          <text x="200" y="24" fill="#34d399" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">360° EPDM LIP FLUSH CONTACT (ZERO SPLASH)</text>
          <text x="80" y="32" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">STAMPED FLOOR PAN</text>
          <text x="200" y="80" fill="#f87171" font-family="JetBrains Mono" font-size="7.5" font-weight="600" text-anchor="middle">ROAD SPLASH BARRIER</text>
        </svg>
      `;
    }

    // 4. Cowl, Firewall & HVAC
    if (a.includes('cowl') || a.includes('hvac')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 32 H 400 M 0 64 H 400" stroke="#1e293b" stroke-width="1"></path>
          
          <!-- Water Box Chamber -->
          <path d="M 40 30 H 130 V 70 H 260 V 45 H 360" stroke="#64748b" stroke-width="4" fill="none"></path>
          
          <!-- Stopper Plate Rib (Height >= 37mm) -->
          <rect x="254" y="20" width="8" height="42" fill="#10b981" stroke="#34d399" stroke-width="1"></rect>
          <line x1="268" y1="20" x2="268" y2="62" stroke="#fbbf24" stroke-width="1.5"></line>
          <line x1="264" y1="20" x2="272" y2="20" stroke="#fbbf24" stroke-width="1.5"></line>
          <line x1="264" y1="62" x2="272" y2="62" stroke="#fbbf24" stroke-width="1.5"></line>
          <text x="325" y="44" fill="#fbbf24" font-family="JetBrains Mono" font-size="8" font-weight="700">HEIGHT ≥ 37mm</text>
          
          <!-- Polyurethane Butyl Bead Path -->
          <circle cx="125" cy="70" r="6" fill="#0284c7" stroke="#38bdf8" stroke-width="1"></circle>
          
          <text x="90" y="22" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">HVAC AIR INTAKE</text>
          <text x="140" y="86" fill="#38bdf8" font-family="JetBrains Mono" font-size="8" font-weight="700">CONTINUOUS ROBOT BUTYL</text>
        </svg>
      `;
    }

    // 5. Body Welt, Weatherstrip & Glass Runner
    if (a.includes('welt') || a.includes('weatherstrip') || a.includes('glass')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 32 H 400 M 0 64 H 400" stroke="#1e293b" stroke-width="1"></path>
          
          <!-- Door Sash Metal Flange -->
          <path d="M 40 48 H 150 V 20 H 158 V 80 H 150 V 56 H 40" fill="#64748b"></path>
          
          <!-- EPDM Bulb Profile (Hollow Sealing Bulb) -->
          <ellipse cx="230" cy="50" rx="28" ry="24" fill="#1e293b" stroke="#10b981" stroke-width="3"></ellipse>
          
          <!-- Aero Lip with Zero-Flock Barrier -->
          <path d="M 158 35 Q 185 30 202 50" stroke="#34d399" stroke-width="3" fill="none"></path>
          
          <!-- Door Closing Contact Vector -->
          <path d="M 290 50 L 265 50" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"></path>
          
          <text x="230" y="20" fill="#34d399" font-family="JetBrains Mono" font-size="8" font-weight="700" text-anchor="middle">NO FLOCK ON AERO LIP (CAPILLARY ARREST)</text>
          <text x="95" y="42" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">DOOR SASH</text>
          <text x="325" y="54" fill="#38bdf8" font-family="JetBrains Mono" font-size="8" font-weight="700">COMPRESSION FIT</text>
        </svg>
      `;
    }

    // 6. Lamps & Lighting
    if (a.includes('lamp')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 32 H 400 M 0 64 H 400" stroke="#1e293b" stroke-width="1"></path>
          
          <!-- Lamp Housing Body -->
          <path d="M 40 30 H 160 L 200 68 H 360" stroke="#38bdf8" stroke-width="3" fill="none"></path>
          
          <!-- Continuous Hot-Melt Adhesive Bead (1.5mm) -->
          <path d="M 160 30 H 260" stroke="#10b981" stroke-width="5" stroke-linecap="round"></path>
          
          <!-- Sheet Metal Aperture Flange -->
          <path d="M 150 40 H 270" stroke="#64748b" stroke-width="4"></path>
          
          <text x="210" y="20" fill="#34d399" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">GLUE BEAD ≥ 1.5mm (AIR INTERLINK 4–6 BAR)</text>
          <text x="80" y="50" fill="#38bdf8" font-family="JetBrains Mono" font-size="8" font-weight="600">LAMP LENS HOUSING</text>
          <text x="320" y="80" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">BODY PANEL MATING</text>
        </svg>
      `;
    }

    // Default High-Precision Industrial CAD Cross-Section
    return `
      <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
        <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
        <path d="M 80 0 V 96 M 200 0 V 96 M 320 0 V 96" stroke="#1e293b" stroke-width="1"></path>
        
        <!-- Sheet Metal Joint Lap -->
        <rect x="40" y="38" width="180" height="6" fill="#64748b"></rect>
        <rect x="180" y="44" width="180" height="6" fill="#475569"></rect>
        
        <!-- Extruded Body Sealant Joint -->
        <ellipse cx="180" cy="44" rx="18" ry="9" fill="#10b981" stroke="#34d399" stroke-width="1.5"></ellipse>
        
        <text x="200" y="24" fill="#34d399" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">VALIDATED SEAL BARRIER · 360° CONTINUITY</text>
        <text x="100" y="62" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">BIW OUTER</text>
        <text x="300" y="62" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">BIW INNER REINFORCEMENT</text>
      </svg>
    `;
  }

  // --- 1. LESSONS BROWSER ---
  function setupLessonsBrowser() {
    if (el.lessonSearch) {
      el.lessonSearch.addEventListener('input', e => {
        currentSearchQuery = e.target.value.trim().toLowerCase();
        if (currentSearchQuery.length > 0) {
          el.clearSearchBtn?.classList.remove('hidden');
        } else {
          el.clearSearchBtn?.classList.add('hidden');
        }
        renderLessons();
      });
    }

    if (el.clearSearchBtn) {
      el.clearSearchBtn.addEventListener('click', () => {
        el.lessonSearch.value = '';
        currentSearchQuery = '';
        el.clearSearchBtn.classList.add('hidden');
        el.lessonSearch.focus();
        renderLessons();
      });
    }

    if (el.voiceMicBtn) {
      el.voiceMicBtn.addEventListener('click', () => {
        el.voiceMicBtn.classList.add('bg-red-500', 'text-white');
        setTimeout(() => {
          el.lessonSearch.value = 'butyl 70mm';
          currentSearchQuery = 'butyl 70mm';
          el.clearSearchBtn?.classList.remove('hidden');
          el.voiceMicBtn.classList.remove('bg-red-500', 'text-white');
          renderLessons();
          showToast('Search query: "butyl 70mm" applied');
        }, 400);
      });
    }

    // View Switcher: Cards vs Table
    if (el.viewModeCardsBtn && el.viewModeTableBtn) {
      el.viewModeCardsBtn.addEventListener('click', () => {
        activeSubView = 'cards';
        localStorage.setItem(VIEW_MODE_KEY, 'cards');
        updateViewModeButtons();
        renderLessons();
      });
      el.viewModeTableBtn.addEventListener('click', () => {
        activeSubView = 'table';
        localStorage.setItem(VIEW_MODE_KEY, 'table');
        updateViewModeButtons();
        renderLessons();
      });
      updateViewModeButtons();
    }

    el.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        el.filterChips.forEach(c => {
          c.className = 'filter-chip shrink-0 h-8 px-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all';
          const innerBadge = c.querySelector('span:last-child');
          if (innerBadge) innerBadge.className = 'px-1.5 py-0.2 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-mono';
        });
        chip.className = 'filter-chip active-filter shrink-0 h-8 px-3 rounded-full bg-slate-900 text-white dark:bg-sky-500 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all';
        const activeBadge = chip.querySelector('span:last-child');
        if (activeBadge) activeBadge.className = 'px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono';

        currentFilter = chip.getAttribute('data-filter') || 'all';
        renderLessons();
      });
    });

    populateDropdowns();
  }

  function updateViewModeButtons() {
    if (!el.viewModeCardsBtn || !el.viewModeTableBtn) return;
    if (activeSubView === 'cards') {
      el.viewModeCardsBtn.className = 'p-1.5 rounded-lg bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs';
      el.viewModeTableBtn.className = 'p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white';
      el.lessonsContainer?.classList.remove('hidden');
      el.lessonsTableContainer?.classList.add('hidden');
    } else {
      el.viewModeCardsBtn.className = 'p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white';
      el.viewModeTableBtn.className = 'p-1.5 rounded-lg bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs';
      el.lessonsContainer?.classList.add('hidden');
      el.lessonsTableContainer?.classList.remove('hidden');
    }
  }

  function populateDropdowns() {
    if (el.projectFilterSelect) {
      const projects = Array.from(new Set(lessons.map(l => l.project))).filter(Boolean).sort();
      el.projectFilterSelect.innerHTML = '<option value="all">All Vehicle Programs (' + lessons.length + ')</option>';
      projects.forEach(p => {
        const count = lessons.filter(l => l.project === p).length;
        const displayName = PROJECT_NAMES[p] || p;
        el.projectFilterSelect.innerHTML += `<option value="${p}">${displayName} (${count})</option>`;
      });

      el.projectFilterSelect.addEventListener('change', e => {
        currentProjectFilter = e.target.value;
        renderLessons();
      });
    }

    if (el.areaFilterSelect) {
      const areas = Array.from(new Set(lessons.map(l => l.area))).filter(Boolean).sort();
      el.areaFilterSelect.innerHTML = '<option value="all">All 17 Vehicle Areas</option>';
      areas.forEach(a => {
        const count = lessons.filter(l => l.area === a).length;
        el.areaFilterSelect.innerHTML += `<option value="${a}">${a} (${count})</option>`;
      });

      el.areaFilterSelect.addEventListener('change', e => {
        const val = e.target.value;
        if (val === 'all') {
          currentFilter = 'all';
        } else {
          currentFilter = 'area:' + val;
        }
        renderLessons();
      });
    }
  }

  function getMatchingLessons() {
    return lessons.filter(item => {
      // Project filter
      if (currentProjectFilter !== 'all' && item.project !== currentProjectFilter) {
        return false;
      }

      // Chip or Area filter
      const fullText = (item.concern + ' ' + item.rootCauses.join(' ') + ' ' + item.countermeasures.join(' ') + ' ' + item.checkPoints.join(' ')).toLowerCase();

      if (currentFilter.startsWith('area:')) {
        const areaName = currentFilter.replace('area:', '');
        if (item.area !== areaName) return false;
      } else if (currentFilter === 'foam') {
        if (!fullText.includes('foam')) return false;
      } else if (currentFilter === 'butyl') {
        if (!fullText.includes('butyl') && !fullText.includes('sealant') && !fullText.includes('sealer')) return false;
      } else if (currentFilter === 'plugs') {
        if (!fullText.includes('plug') && !fullText.includes('hole') && !fullText.includes('sticker')) return false;
      } else if (currentFilter === 'clearance') {
        if (!fullText.includes('clearance') && !fullText.includes('gap') && !fullText.includes('distance') && !fullText.includes('overlap')) return false;
      } else if (currentFilter === 'clips') {
        if (!fullText.includes('clip') && !fullText.includes('harness')) return false;
      }

      // Search Query
      if (currentSearchQuery) {
        const hay = [
          'slide ' + item.slideNo,
          '#' + item.slideNo,
          item.docRef,
          item.project,
          item.area,
          item.concern,
          ...item.rootCauses,
          ...item.countermeasures,
          ...item.checkPoints
        ].join(' ').toLowerCase();

        if (!hay.includes(currentSearchQuery)) return false;
      }

      return true;
    });
  }

  function renderLessons() {
    const filtered = getMatchingLessons();

    if (el.lessonsCountHeader) {
      el.lessonsCountHeader.textContent = `Showing ${filtered.length} of ${lessons.length} Standard Lessons`;
    }

    if (activeSubView === 'table') {
      renderTable(filtered);
    } else {
      renderCards(filtered);
    }
  }

  function renderCards(filtered) {
    if (!el.lessonsContainer) return;

    if (filtered.length === 0) {
      el.lessonsContainer.innerHTML = `
        <div class="col-span-full bg-white dark:bg-[#0f172a] rounded-3xl p-12 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h4 class="text-base font-extrabold text-slate-900 dark:text-white">No lessons match your current filters</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Try clearing your search query or reset the category chips.</p>
          <button id="reset-lessons-btn" class="h-10 px-5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors" type="button">
            Reset All Filters
          </button>
        </div>
      `;
      document.getElementById('reset-lessons-btn')?.addEventListener('click', () => {
        currentFilter = 'all';
        currentProjectFilter = 'all';
        currentSearchQuery = '';
        if (el.lessonSearch) el.lessonSearch.value = '';
        if (el.projectFilterSelect) el.projectFilterSelect.value = 'all';
        if (el.areaFilterSelect) el.areaFilterSelect.value = 'all';
        renderLessons();
      });
      return;
    }

    el.lessonsContainer.innerHTML = filtered.map(item => {
      const isVerified = verifiedSlides.has(item.slideNo);
      const wrongText = item.rootCauses.length > 0 ? item.rootCauses.join('; ') : 'Direct moisture ingress along joint interface.';
      const fixText = item.countermeasures.length > 0 ? item.countermeasures.join('; ') : 'Validated containment countermeasure applied.';
      const checkText = item.checkPoints.length > 0 ? item.checkPoints.join('; ') : 'Inspect 100% seating and interference fit.';

      const isHighRisk = item.risk === 'High Risk';
      const isMedRisk = item.risk === 'Med Risk';

      const riskPill = isHighRisk
        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60'
        : isMedRisk
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60'
        : 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200 dark:border-sky-900/60';

      const dotColor = isHighRisk ? 'bg-rose-600' : isMedRisk ? 'bg-amber-500' : 'bg-sky-500';

      // SVG CAD Schematic
      const svgDiagram = getTechnicalDiagramSVG(item.area, item.slideNo);

      return `
        <article class="bg-white dark:bg-[#0f172a] rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4 group" data-slide="${item.slideNo}">
          
          <div class="space-y-3.5">
            <!-- Top Badges Row -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-mono text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-lg">
                  Slide #${item.slideNo}
                </span>
                <span class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  ${escapeHTML(item.area)}
                </span>
                <span class="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                  ${escapeHTML(item.project)}
                </span>
              </div>
              <span class="text-[10px] font-bold ${riskPill} px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 uppercase tracking-wider">
                <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span>
                ${item.risk}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              ${escapeHTML(item.concern)}
            </h3>

            <!-- Human-Designed Technical CAD Schematic -->
            <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0f172a]">
              ${svgDiagram}
            </div>

            <!-- 3 Editorial Colored Blocks -->
            <div class="space-y-2 text-xs">
              <!-- Problem -->
              <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 text-slate-800 dark:text-slate-200">
                <span class="material-symbols-outlined text-rose-600 text-[16px] shrink-0 mt-0.5">error</span>
                <p class="leading-relaxed">
                  <strong class="text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider">Issue:</strong> ${escapeHTML(wrongText)}
                </p>
              </div>
              <!-- Fix -->
              <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200">
                <span class="material-symbols-outlined text-emerald-600 text-[16px] shrink-0 mt-0.5">verified</span>
                <p class="leading-relaxed">
                  <strong class="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Fix:</strong> ${escapeHTML(fixText)}
                </p>
              </div>
              <!-- Line Checkpoint -->
              <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-slate-800 dark:text-slate-200">
                <span class="material-symbols-outlined text-amber-600 text-[16px] shrink-0 mt-0.5">checklist</span>
                <p class="leading-relaxed">
                  <strong class="text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">Check:</strong> ${escapeHTML(checkText)}
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              class="quick-verify-btn h-10 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 ${
                isVerified
                  ? 'bg-emerald-600 text-white border-transparent'
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }"
              data-slide="${item.slideNo}"
              type="button"
            >
              <span class="material-symbols-outlined text-[18px]">
                ${isVerified ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span>${isVerified ? 'Verified' : 'Verify'}</span>
            </button>

            <button
              class="open-detail-btn flex-1 h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              data-slide="${item.slideNo}"
              type="button"
            >
              <span>View Sheet</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

        </article>
      `;
    }).join('');

    attachCardEventListeners();
  }

  function renderTable(filtered) {
    if (!el.lessonsTableContainer) return;

    if (filtered.length === 0) {
      el.lessonsTableContainer.innerHTML = `
        <div class="p-8 text-center text-slate-400">No lessons matched your filter.</div>
      `;
      return;
    }

    el.lessonsTableContainer.innerHTML = `
      <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xs">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th class="py-3 px-3.5">Slide</th>
              <th class="py-3 px-3.5">Program</th>
              <th class="py-3 px-3.5">Category</th>
              <th class="py-3 px-3.5">Concern / Issue</th>
              <th class="py-3 px-3.5">Countermeasure</th>
              <th class="py-3 px-3.5">Verification</th>
              <th class="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${filtered.map(item => {
              const isVerified = verifiedSlides.has(item.slideNo);
              return `
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer row-inspect-trigger" data-slide="${item.slideNo}">
                  <td class="py-3 px-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">#${item.slideNo}</td>
                  <td class="py-3 px-3.5 font-semibold text-slate-900 dark:text-white">${escapeHTML(item.project)}</td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 font-medium">${escapeHTML(item.area)}</td>
                  <td class="py-3 px-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">${escapeHTML(item.concern)}</td>
                  <td class="py-3 px-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">${escapeHTML(item.countermeasures[0] || 'Standard fix applied')}</td>
                  <td class="py-3 px-3.5">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }">
                      <span class="w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
                      ${isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-right">
                    <button class="open-detail-btn px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors" data-slide="${item.slideNo}" type="button">
                      Open Sheet
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    attachCardEventListeners();
  }

  function attachCardEventListeners() {
    document.querySelectorAll('.quick-verify-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const slideNo = parseInt(btn.getAttribute('data-slide'), 10);
        toggleVerification(slideNo);
      });
    });

    document.querySelectorAll('.open-detail-btn, .row-inspect-trigger').forEach(el => {
      el.addEventListener('click', e => {
        const slideNo = parseInt(el.getAttribute('data-slide'), 10);
        openDetailDrawer(slideNo);
      });
    });
  }

  function toggleVerification(slideNo) {
    if (verifiedSlides.has(slideNo)) {
      verifiedSlides.delete(slideNo);
      showToast(`Slide #${slideNo} verification cleared.`);
    } else {
      verifiedSlides.add(slideNo);
      showToast(`Slide #${slideNo} verified on Line!`);
    }
    saveVerifiedSlides();
    renderLessons();
    updateKPIDashboard();
  }

  // --- 2. LESSON DETAIL SLIDE-OVER DRAWER ---
  function setupDetailDrawer() {
    if (el.detailSignoffBtn) {
      el.detailSignoffBtn.addEventListener('click', () => {
        if (!currentDetailSlide) return;
        verifiedSlides.add(currentDetailSlide.slideNo);
        saveVerifiedSlides();
        updateKPIDashboard();
        renderLessons();
        showToast(`Slide #${currentDetailSlide.slideNo} verified and signed off.`);
        if (el.viewDetail) el.viewDetail.classList.add('hidden');
      });
    }

    if (el.detailDefectBtn) {
      el.detailDefectBtn.addEventListener('click', () => {
        if (!currentDetailSlide) return;
        const note = prompt('Describe defect observed for Slide #' + currentDetailSlide.slideNo, 'Water intrusion detected during rain check');
        if (note) {
          const newDefect = {
            id: 'DEF-' + Date.now().toString().slice(-4),
            slideNo: currentDetailSlide.slideNo,
            concern: currentDetailSlide.concern,
            note: note,
            severity: 'Serious',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          defectLogs.unshift(newDefect);
          saveDefects();
          updateDefectsList();
          showToast(`Defect ticket #${newDefect.id} escalated to Shift QA Lead.`);
          if (el.viewDetail) el.viewDetail.classList.add('hidden');
        }
      });
    }

    if (el.detailCopyRefBtn) {
      el.detailCopyRefBtn.addEventListener('click', () => {
        if (!currentDetailSlide) return;
        const ref = currentDetailSlide.docRef || `Slide #${currentDetailSlide.slideNo}`;
        navigator.clipboard?.writeText(ref).then(() => {
          showToast(`Copied document reference: ${ref}`);
        }).catch(() => {
          showToast(ref);
        });
      });
    }

    if (el.detailPrintBtn) {
      el.detailPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function openDetailDrawer(slideNo) {
    const item = lessons.find(l => l.slideNo === slideNo) || lessons[0];
    if (!item) return;

    currentDetailSlide = item;

    if (el.detailSlideNum) el.detailSlideNum.textContent = `Slide ${item.slideNo} of ${lessons.length}`;
    if (el.detailDocRef) el.detailDocRef.textContent = item.docRef || `RNTBCI/LLR/SLIDE-${item.slideNo}`;
    if (el.detailProjectArea) el.detailProjectArea.textContent = `${item.project} • ${item.area}`;
    if (el.detailAuthor) el.detailAuthor.textContent = `Prepared by: ${item.preparedBy || 'Damodharan (VQE)'}`;
    if (el.detailTitle) el.detailTitle.textContent = item.concern;

    if (el.detailRiskBadge) {
      el.detailRiskBadge.textContent = item.risk;
      el.detailRiskBadge.className = item.risk === 'High Risk'
        ? 'px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
        : 'px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    }

    // High-resolution SVG Diagram in Drawer
    if (el.detailDiagramContainer) {
      el.detailDiagramContainer.innerHTML = getTechnicalDiagramSVG(item.area, item.slideNo);
    }

    // Causes 1, 2, 3
    const causes = item.rootCauses.length > 0 ? item.rootCauses : ['Direct water ingress path through unsealed sheet metal aperture.'];
    if (el.detailWrongText) {
      el.detailWrongText.innerHTML = causes.map((c, i) => `
        <div class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
          <span class="text-slate-800 dark:text-slate-200">${escapeHTML(c)}</span>
        </div>
      `).join('');
    }

    // Countermeasures 1, 2, 3
    const fixes = item.countermeasures.length > 0 ? item.countermeasures : ['Design modification and sealing barrier added.'];
    if (el.detailCountermeasureText) {
      el.detailCountermeasureText.innerHTML = fixes.map((f, i) => `
        <div class="flex items-start gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
          <span class="text-slate-800 dark:text-slate-200 font-medium">${escapeHTML(f)}</span>
        </div>
      `).join('');
    }

    // Check Points 1, 2, 3, 4
    const checks = item.checkPoints.length > 0 ? item.checkPoints : [
      'Confirm water restriction barrier intact without damage or deformation.',
      'Verify positive engagement and audible snap click during assembly.',
      'Perform 360° tactile gloved sweep to confirm flush interference condition.',
      'Ensure clearance with adjacent components meets engineering specification.'
    ];

    if (el.detailChecklistContainer) {
      el.detailChecklistContainer.innerHTML = checks.map((chk, i) => `
        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer select-none hover:border-sky-500 transition-colors">
          <input type="checkbox" class="detail-chk w-5 h-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700">
          <div class="flex flex-col min-w-0">
            <span class="text-xs font-bold text-slate-900 dark:text-white">Line Checkpoint ${i + 1}</span>
            <span class="text-xs text-slate-600 dark:text-slate-300">${escapeHTML(chk)}</span>
          </div>
        </label>
      `).join('');

      const detailCheckboxes = el.detailChecklistContainer.querySelectorAll('.detail-chk');
      function updateDetailProgress() {
        const checked = Array.from(detailCheckboxes).filter(c => c.checked).length;
        if (el.detailCheckCountText) {
          el.detailCheckCountText.textContent = `${checked} of ${detailCheckboxes.length} Validated`;
        }
      }
      detailCheckboxes.forEach(cb => cb.addEventListener('change', updateDetailProgress));
      updateDetailProgress();
    }

    if (el.viewDetail) el.viewDetail.classList.remove('hidden');
  }

  // --- 3. VEHICLE ZONES ---
  function setupVehicleZones() {
    el.zonePills.forEach(pill => {
      pill.addEventListener('click', () => {
        el.zonePills.forEach(p => {
          p.className = 'filter-pill shrink-0 h-9 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all';
        });
        pill.className = 'filter-pill active shrink-0 h-9 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold transition-all';
        const filter = pill.getAttribute('data-filter') || 'all';
        filterZones(filter);
      });
    });
  }

  function setupHotspots() {
    document.querySelectorAll('.zone-hotspot').forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        const target = hotspot.getAttribute('data-target');
        const pill = document.querySelector(`.filter-pill[data-filter="${target}"]`);
        if (pill) {
          pill.click();
        } else {
          filterZones(target);
        }
        showToast(`Filtered to ${target.toUpperCase()} Inspection Zone`);
      });
    });
  }

  function filterZones(filter) {
    const cards = document.querySelectorAll('.zone-card-item');
    cards.forEach(card => {
      const group = card.getAttribute('data-group') || '';
      if (filter === 'all' || group.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  function renderZones() {
    if (!el.zonesContainer) return;

    el.zonesContainer.innerHTML = ZONE_CONFIG.map(z => `
      <article class="zone-card-item bg-white dark:bg-[#0f172a] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4" data-group="${z.group}">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900">
              <span class="material-symbols-outlined text-[26px]">${z.icon}</span>
            </div>
            <span class="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
              ${z.count} Lessons
            </span>
          </div>

          <div>
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">${z.name}</h3>
            <span class="text-xs text-slate-400 font-medium">${z.station}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-amber-500 shrink-0">warning</span>
            <span class="truncate font-medium">${z.risk}</span>
          </div>
        </div>

        <button class="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs" onclick="openLessonsForZone('${z.name}')" type="button">
          <span>Open Lessons (${z.count})</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </article>
    `).join('');

    window.openLessonsForZone = function (zoneName) {
      currentFilter = 'all';
      currentSearchQuery = zoneName.split('&')[0].trim().toLowerCase();
      if (el.lessonSearch) el.lessonSearch.value = currentSearchQuery;
      renderLessons();
      window.switchView('lessons-browser');
      showToast(`Showing lessons for ${zoneName}`);
    };
  }

  // --- 4. LINE CHECKLIST ---
  function setupInteractiveChecklist() {
    const checkCards = document.querySelectorAll('#view-interactive-checklist .check-card');

    checkCards.forEach(card => {
      const btnPass = card.querySelector('.btn-pass');
      const btnFail = card.querySelector('.btn-fail');
      const btnNa = card.querySelector('.btn-na');
      const pill = card.querySelector('.status-pill');
      const bar = card.querySelector('.status-indicator-bar');
      const slideNum = card.getAttribute('data-slide-num') || '14';

      function resetBtns() {
        [btnPass, btnFail, btnNa].forEach(b => {
          if (!b) return;
          b.className = 'min-h-[48px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 active:scale-95';
        });
      }

      btnPass?.addEventListener('click', () => {
        resetBtns();
        btnPass.className = 'btn-pass min-h-[48px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all bg-emerald-600 text-white shadow-xs active:scale-95 ring-2 ring-emerald-500';
        card.setAttribute('data-status', 'pass');
        stationChecks[slideNum] = 'pass';
        saveStationChecks();
        if (bar) bar.className = 'status-indicator-bar w-2 absolute left-0 top-0 bottom-0 bg-emerald-500';
        if (pill) {
          pill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold font-mono text-xs flex items-center gap-1';
          pill.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span> PASS';
        }
        updateChecklistUI();
      });

      btnFail?.addEventListener('click', () => {
        resetBtns();
        btnFail.className = 'btn-fail min-h-[48px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all bg-rose-600 text-white shadow-xs active:scale-95 ring-2 ring-rose-500';
        card.setAttribute('data-status', 'fail');
        stationChecks[slideNum] = 'fail';
        saveStationChecks();
        if (bar) bar.className = 'status-indicator-bar w-2 absolute left-0 top-0 bottom-0 bg-rose-500';
        if (pill) {
          pill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 font-bold font-mono text-xs flex items-center gap-1';
          pill.innerHTML = '<span class="material-symbols-outlined text-[14px]">close</span> FAIL';
        }
        updateChecklistUI();
      });

      btnNa?.addEventListener('click', () => {
        resetBtns();
        btnNa.className = 'btn-na min-h-[48px] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all bg-slate-700 text-white shadow-xs active:scale-95';
        card.setAttribute('data-status', 'na');
        stationChecks[slideNum] = 'na';
        saveStationChecks();
        if (bar) bar.className = 'status-indicator-bar w-2 absolute left-0 top-0 bottom-0 bg-slate-400';
        if (pill) {
          pill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold font-mono text-xs flex items-center gap-1';
          pill.innerHTML = '<span class="material-symbols-outlined text-[14px]">remove_done</span> N/A';
        }
        updateChecklistUI();
      });
    });

    // Chips Toggle
    const chips = document.querySelectorAll('.defect-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const dot = chip.querySelector('span:first-child');
        if (chip.classList.contains('bg-sky-50')) {
          chip.classList.remove('bg-sky-50', 'border-sky-300', 'text-sky-800');
          chip.classList.add('bg-slate-50', 'border-slate-200');
          if (dot) dot.className = 'w-2 h-2 rounded-full bg-slate-400';
        } else {
          chip.classList.remove('bg-slate-50', 'border-slate-200');
          chip.classList.add('bg-sky-50', 'border-sky-300', 'text-sky-800');
          if (dot) dot.className = 'w-2 h-2 rounded-full bg-sky-600';
        }
      });
    });

    // Severity Selection
    const sevBtns = document.querySelectorAll('.sev-btn');
    sevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sevBtns.forEach(b => b.classList.remove('ring-2', 'ring-blue-600'));
        btn.classList.add('ring-2', 'ring-blue-600');
      });
    });

    // Barcode Scanner Modal Controls
    if (el.scanBtn && el.scanModal) {
      el.scanBtn.addEventListener('click', () => el.scanModal.classList.remove('hidden'));
    }
    if (el.closeScanModal && el.scanModal) {
      el.closeScanModal.addEventListener('click', () => el.scanModal.classList.add('hidden'));
    }
    if (el.simulateScanBtn && el.scanModal) {
      el.simulateScanBtn.addEventListener('click', () => {
        el.scanModal.classList.add('hidden');
        const vinBadges = document.querySelectorAll('.vin-display-badge');
        vinBadges.forEach(b => b.textContent = '8XF-90215');
        showToast('VIN #8XF-90215 scanned and verified for Station 06');
      });
    }

    // Submit Defect Button
    if (el.submitDefectBtn) {
      el.submitDefectBtn.addEventListener('click', () => {
        const activeChips = Array.from(document.querySelectorAll('.defect-chip.bg-sky-50')).map(c => c.textContent.trim());
        const tag = activeChips.length > 0 ? activeChips.join(', ') : 'Water Barrier Ingress Alert';
        const newDefect = {
          id: 'DEF-' + Date.now().toString().slice(-4),
          concern: 'Station 06 Door Assembly: ' + tag,
          severity: document.querySelector('.sev-btn.ring-2')?.textContent.trim() || 'Serious',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        defectLogs.unshift(newDefect);
        saveDefects();
        updateDefectsList();
        showToast(`Defect #${newDefect.id} logged! Shift QA Lead dispatched.`);
      });
    }

    // Complete Station Inspection
    if (el.completeStationBtn) {
      el.completeStationBtn.addEventListener('click', () => {
        showToast('Station 06 Certified! Vehicle cleared for Station 07 Shower Booth.');
      });
    }

    updateDefectsList();
  }

  function updateChecklistUI() {
    const cards = document.querySelectorAll('#view-interactive-checklist .check-card');
    let passCount = 0;
    let failCount = 0;
    let total = cards.length;

    cards.forEach(card => {
      const st = card.getAttribute('data-status');
      if (st === 'pass') passCount++;
      if (st === 'fail') failCount++;
    });

    const completed = passCount + failCount;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (el.completedCount) el.completedCount.textContent = completed;
    if (el.percentText) el.percentText.textContent = `(${pct}%)`;
    if (el.progBar) el.progBar.style.width = `${pct}%`;
  }

  function updateDefectsList() {
    if (!el.defectLogsList) return;
    if (defectLogs.length === 0) {
      el.defectLogsList.innerHTML = `<span class="text-xs text-slate-400 italic">No active defect tickets logged on this shift.</span>`;
      return;
    }

    el.defectLogsList.innerHTML = defectLogs.slice(0, 3).map(d => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-rose-600"></span>
          <span class="font-bold text-rose-900 dark:text-rose-300 font-mono">${d.id}:</span>
          <span class="text-slate-800 dark:text-slate-200 truncate max-w-[240px]">${escapeHTML(d.concern)}</span>
        </div>
        <span class="font-mono text-[10px] text-slate-500">${d.timestamp}</span>
      </div>
    `).join('');
  }

  // --- 5. DATA SYNC & EXCEL / CSV IMPORT ---
  function setupDataSync() {
    if (el.browseBtn && el.fileInput) {
      el.browseBtn.addEventListener('click', () => el.fileInput.click());
      el.fileInput.addEventListener('change', handleFileUpload);
    }

    if (el.dropZone) {
      el.dropZone.addEventListener('click', () => el.fileInput?.click());
      el.dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        el.dropZone.classList.add('border-sky-500', 'bg-sky-50/50');
      });
      el.dropZone.addEventListener('dragleave', e => {
        e.preventDefault();
        el.dropZone.classList.remove('border-sky-500', 'bg-sky-50/50');
      });
      el.dropZone.addEventListener('drop', e => {
        e.preventDefault();
        el.dropZone.classList.remove('border-sky-500', 'bg-sky-50/50');
        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
          processFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (el.syncNowBtn) {
      el.syncNowBtn.addEventListener('click', () => {
        saveLessonsData();
        showToast(`Synchronized! All ${lessons.length} lessons stored locally.`);
        updateDataSyncUI();
      });
    }

    if (el.resetCacheBtn) {
      el.resetCacheBtn.addEventListener('click', () => {
        if (confirm('Restore the standard 76 LLR Lessons dataset?')) {
          lessons = window.DEFAULT_LESSONS_DATA || [];
          saveLessonsData();
          renderLessons();
          updateDataSyncUI();
          updateKPIDashboard();
          populateDropdowns();
          showToast('Default 76 lessons restored successfully.');
        }
      });
    }

    if (el.downloadTemplateBtn) {
      el.downloadTemplateBtn.addEventListener('click', exportDatasetCSV);
    }

    if (el.toastClose) {
      el.toastClose.addEventListener('click', hideToast);
    }
  }

  function handleFileUpload(e) {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }

  function processFile(file) {
    const fileName = file.name;
    const ext = fileName.split('.').pop().toLowerCase();
    showToast(`Parsing ${fileName}...`);

    if (ext === 'csv') {
      if (window.Papa) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            handleParsedRows(results.data, fileName);
          },
          error: function (err) {
            alert('CSV Parsing error: ' + err.message);
          }
        });
      } else {
        const reader = new FileReader();
        reader.onload = function (e) {
          parseRawCSVText(e.target.result, fileName);
        };
        reader.readAsText(file);
      }
    } else if (ext === 'xlsx' || ext === 'xls') {
      if (window.XLSX) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonRows = XLSX.utils.sheet_to_json(firstSheet);
          handleParsedRows(jsonRows, fileName);
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('Spreadsheet engine loading, please retry in a moment.');
      }
    } else {
      alert('Unsupported file format. Please upload a .csv, .xlsx, or .xls file.');
    }
  }

  function parseRawCSVText(text, fileName) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => obj[h] = vals[idx] || '');
      rows.push(obj);
    }
    handleParsedRows(rows, fileName);
  }

  function handleParsedRows(rows, fileName) {
    if (!rows || rows.length === 0) {
      alert('Spreadsheet contains no data.');
      return;
    }

    const newLessons = [];

    rows.forEach((r, idx) => {
      const getVal = (...keys) => {
        for (const k of keys) {
          if (r[k] !== undefined && r[k] !== null && String(r[k]).trim() !== '') {
            return String(r[k]).trim();
          }
          for (const actualKey of Object.keys(r)) {
            if (actualKey.trim().toLowerCase() === k.trim().toLowerCase() && r[actualKey]) {
              return String(r[actualKey]).trim();
            }
          }
        }
        return '';
      };

      const slideNo = getVal('Slide No.', 'Slide', 'Slide No', 'S.No', 'SNo') || (idx + 1);
      const docRef = getVal('Doc Reference', 'DocRef', 'Reference', 'Doc Ref') || `RNTBCI/LLR/${slideNo}`;
      const project = getVal('Project', 'Vehicle', 'Model') || 'PY1B';
      const preparedBy = getVal('Prepared By', 'PreparedBy', 'Author') || 'Damodharan (VQE)';
      const area = getVal('Area / Category', 'Area', 'Category', 'Zone') || 'Trim & Final';
      const concern = getVal('Water Leak Concern', 'Concern', 'Issue', 'Title') || `Water Leak Issue #${slideNo}`;

      const causes = [
        getVal('Issue / Root Cause 1', 'Root Cause 1', 'Cause 1'),
        getVal('Issue / Root Cause 2', 'Root Cause 2', 'Cause 2'),
        getVal('Issue / Root Cause 3', 'Root Cause 3', 'Cause 3')
      ].filter(Boolean);

      const countermeasures = [
        getVal('Countermeasure 1', 'Countermeasure 1', 'Fix 1'),
        getVal('Countermeasure 2', 'Countermeasure 2', 'Fix 2'),
        getVal('Countermeasure 3', 'Countermeasure 3', 'Fix 3')
      ].filter(Boolean);

      const checkpoints = [
        getVal('Check Point 1', 'Checkpoint 1', 'Check 1'),
        getVal('Check Point 2', 'Checkpoint 2', 'Check 2'),
        getVal('Check Point 3', 'Checkpoint 3', 'Check 3'),
        getVal('Check Point 4', 'Checkpoint 4', 'Check 4')
      ].filter(Boolean);

      let risk = 'Normal';
      const combined = (concern + ' ' + causes.join(' ') + ' ' + countermeasures.join(' ')).toLowerCase();
      if (['cabin', 'seepage', 'intrusion', 'jet direct hit', 'spinning', 'missed'].some(w => combined.includes(w))) {
        risk = 'High Risk';
      } else if (['gap', 'deformation', 'shrinkage', 'insufficient', 'flock'].some(w => combined.includes(w))) {
        risk = 'Med Risk';
      }

      newLessons.push({
        sno: idx + 1,
        slideNo: isNaN(Number(slideNo)) ? slideNo : Number(slideNo),
        docRef,
        project,
        preparedBy,
        area,
        concern,
        rootCauses: causes,
        countermeasures,
        checkPoints: checkpoints,
        risk
      });
    });

    if (newLessons.length > 0) {
      lessons = newLessons;
      saveLessonsData();
      renderLessons();
      updateDataSyncUI(fileName);
      updateKPIDashboard();
      populateDropdowns();
      showToast(`Successfully loaded ${newLessons.length} lessons from ${fileName}!`);
    }
  }

  function exportDatasetCSV() {
    if (!lessons || lessons.length === 0) return;

    const headers = [
      'S.No', 'Slide No.', 'Doc Reference', 'Project', 'Prepared By',
      'Area / Category', 'Water Leak Concern',
      'Issue / Root Cause 1', 'Issue / Root Cause 2', 'Issue / Root Cause 3',
      'Countermeasure 1', 'Countermeasure 2', 'Countermeasure 3',
      'Check Point 1', 'Check Point 2', 'Check Point 3', 'Check Point 4'
    ];

    const csvRows = [headers.join(',')];

    lessons.forEach(item => {
      const row = [
        item.sno || item.slideNo,
        item.slideNo,
        escapeCSV(item.docRef || ''),
        escapeCSV(item.project || ''),
        escapeCSV(item.preparedBy || ''),
        escapeCSV(item.area || ''),
        escapeCSV(item.concern || ''),
        escapeCSV(item.rootCauses[0] || ''),
        escapeCSV(item.rootCauses[1] || ''),
        escapeCSV(item.rootCauses[2] || ''),
        escapeCSV(item.countermeasures[0] || ''),
        escapeCSV(item.countermeasures[1] || ''),
        escapeCSV(item.countermeasures[2] || ''),
        escapeCSV(item.checkPoints[0] || ''),
        escapeCSV(item.checkPoints[1] || ''),
        escapeCSV(item.checkPoints[2] || ''),
        escapeCSV(item.checkPoints[3] || '')
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LeakGuard_LLR_Water_Leak_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Spreadsheet exported successfully.');
  }

  function escapeCSV(str) {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  }

  function updateDataSyncUI(fileName) {
    if (el.cachedCountBadge) el.cachedCountBadge.textContent = `${lessons.length} Slides (17 Zones)`;
    if (el.cachedFileName && fileName) el.cachedFileName.textContent = fileName;
  }

  // --- Utilities ---
  function showToast(msg) {
    if (!el.statusToast || !el.toastMsg) return;
    el.toastMsg.textContent = msg;
    el.statusToast.classList.remove('hidden');
    el.statusToast.classList.add('flex');
    setTimeout(() => {
      hideToast();
    }, 3800);
  }

  function hideToast() {
    if (!el.statusToast) return;
    el.statusToast.classList.add('hidden');
    el.statusToast.classList.remove('flex');
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
