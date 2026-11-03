/**
 * LeakGuard LLR — Failure Tree Analysis (FTA) & Root Cause Agent
 * AI-Assisted Water Leak Diagnostic System for Service Technicians, Techliners & Quality Analysts
 * Powered by Renault-Nissan Digital Check Review (LLR) Knowledge Base
 */

(function () {
  'use strict';

  // Local storage keys
  const STORAGE_KEY = 'LEAKGUARD_LESSONS_DATA_V3';
  const VERIFIED_KEY = 'LEAKGUARD_VERIFIED_SLIDES_V3';
  const CHECKLIST_KEY = 'LEAKGUARD_STATION_CHECKS_V3';
  const DEFECTS_KEY = 'LEAKGUARD_DEFECT_LOGS_V3';
  const WORK_ORDERS_KEY = 'LEAKGUARD_WORK_ORDERS_V1';
  const THEME_KEY = 'LEAKGUARD_THEME_MODE_V3';
  const VIEW_MODE_KEY = 'LEAKGUARD_VIEW_MODE'; // 'cards' | 'table'

  // Application State
  let lessons = [];
  let currentFilter = 'all';
  let currentProjectFilter = 'all';
  let currentSearchQuery = '';
  let activeTab = 'fta-agent'; // DEFAULT LANDING VIEW
  let activeSubView = localStorage.getItem(VIEW_MODE_KEY) || 'cards';
  let currentDetailSlide = null;
  let verifiedSlides = new Set();
  let stationChecks = {};
  let defectLogs = [];
  let workOrders = [];

  // FTA Agent State
  let activeScenarioId = 'floor-pan-flooding';
  let activeFtaTab = 'recommendations'; // 'recommendations' | 'workorders' | 'documents' | 'system'
  let customFtaQuery = '';

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

  // Pre-configured Automotive Leak FTA Scenarios
  const FTA_SCENARIOS = [
    {
      id: 'floor-pan-flooding',
      title: 'Front Passenger Floor Pan Wetness & Carpet Saturation',
      symptom: 'Floor Wetness + High Ingress Flow',
      vehicle: 'Kiger (PY1B) / Magnite (HBC)',
      confidence: 96,
      rootCauseSummary: 'Sealing screen service hole butyl adhesive gap (<35mm vs 70mm spec) combined with unsealed wire harness clip penetration into inner door dry cavity.',
      primarySlide: 10,
      evidenceSlides: [10, 14, 22, 35],
      branches: [
        {
          id: 'b1',
          name: 'Cowl drain weir overflow (<37mm height)',
          slideNo: 51,
          status: 'debunked',
          badgeText: 'Debunked: Stopper measured 42mm',
          detail: 'Measured cowl water box stopper height at 42mm (exceeds min 37mm threshold). Zero moisture behind firewall sound deadener.'
        },
        {
          id: 'b2',
          name: 'Floor pan oval e-coat drainage plug unseated',
          slideNo: 35,
          status: 'debunked',
          badgeText: 'Debunked: 360° flush fit confirmed',
          detail: 'Underbody inspection confirmed all 6 under-carpet drainage plugs sealed with intact PVC wax boundary.'
        },
        {
          id: 'b3',
          name: 'Door sealing screen butyl line offset <70mm',
          slideNo: 10,
          status: 'root_cause',
          badgeText: 'ROOT CAUSE: Butyl offset 35mm (Slide #10)',
          detail: 'Butyl bead measured 35mm from harness clip aperture (spec requires min 70mm). Water pooled in outer cavity flows past peeled adhesive.'
        },
        {
          id: 'b4',
          name: 'HVAC evaporator condensate drain tube kinked',
          slideNo: 50,
          status: 'debunked',
          badgeText: 'Debunked: Condensate flow clear',
          detail: 'HVAC cabin core drainage tube clear and draining freely into engine compartment; zero reservoir backup.'
        },
        {
          id: 'b5',
          name: 'Door harness retention clip missing EPT foam gasket',
          slideNo: 14,
          status: 'verified',
          badgeText: 'Verified: Clip #3 bare (Slide #14)',
          detail: 'Lower door harness attachment clip #3 missing 1mm EPT closed-cell foam ring, enabling capillary seep into cabin cavity.'
        },
        {
          id: 'b6',
          name: 'Front seat mounting stud bolt sealer skip',
          slideNo: 35,
          status: 'checked',
          badgeText: 'Checked: 360° sealer bead ok',
          detail: 'Checked with borescope: 360° continuous paint sealer bead present on stud weld flange.'
        }
      ],
      chain: [
        { step: 1, title: 'Rain Booth Static Test', desc: 'Simulated 10-minute shower test (2.5 bar, 20 L/min). Water accumulation localized to lower right A-pillar sill and passenger carpet.' },
        { step: 2, title: 'Underbody & Cowl Exclusion', desc: 'Borescope inspection of cowl water box and underbody e-coat plugs: Debunked (zero water traces found in firewall cavity).' },
        { step: 3, title: 'Door Trim Disassembly & Butyl Audit', desc: 'Removed passenger front door trim card. Measured distance between sealing screen butyl bead and lower harness clip aperture: actual 35mm vs mandatory 70mm minimum standard (LLR Slide #10).' },
        { step: 4, title: 'Harness Clip Foam Inspection', desc: 'Extracted harness clip #3 from door inner panel: clip is raw nylon with missing 1mm EPT closed-cell foam gasket (LLR Slide #14), creating direct entry hole.' },
        { step: 5, title: 'Containment & Retest Validation', desc: 'Re-routed butyl bead to maintain 75mm clearance and installed pre-gasketed clip (Part #24220-4EA0A). 20-minute re-spray test confirms 100% dry.' }
      ],
      recommendations: [
        { type: 'Execute', text: 'Re-route door sealing screen butyl adhesive line maintaining strictly ≥ 70mm clearance from inner trim fastener apertures (NDS Rule 4.2 / LLR Slide #10).' },
        { type: 'Verify', text: 'Replace bare harness clip #3 with pre-fitted 1mm EPT closed-cell foam ring clip (Part #24220-4EA0A / LLR Slide #14).' },
        { type: 'Update', text: 'Update Trim & Final Station 06 SOP and Quality Control Plan to enforce 360° tactile verification of butyl continuity.' }
      ],
      defaultWorkOrder: {
        id: 'WO-890214',
        status: 'Draft',
        description: 'Re-route sealing screen butyl to ≥ 70mm & install 1mm EPT foam clip',
        equipment: 'Kiger (PY1B) - VIN 8XF-90214',
        plant: 'Plant 1 · Service Bay 4',
        priority: 'High',
        assignedTo: 'Nikit (Techline Specialist)',
        dueDate: 'Today',
        estimatedHours: '1.5'
      }
    },
    {
      id: 'door-cavity-speaker',
      title: 'Water Dripping from Door Inner Pocket & Speaker Grille',
      symptom: 'Door Cavity Wetness + Speaker Seepage',
      vehicle: 'Magnite / Kiger (HBC)',
      confidence: 94,
      rootCauseSummary: 'Rear door pop-up knob clip open snap relief feature combined with speaker mounting gasket compression loss under dynamic spray.',
      primarySlide: 2,
      evidenceSlides: [2, 57, 3, 5],
      branches: [
        {
          id: 'b1',
          name: 'Outer waist weatherstrip lip deformation',
          slideNo: 5,
          status: 'debunked',
          badgeText: 'Debunked: Lip contact >150N',
          detail: 'Tested glass runner and outer waist seal retention force: 165N (exceeds 150N minimum specification).'
        },
        {
          id: 'b2',
          name: 'Pop-up knob clip open snap relief slot',
          slideNo: 2,
          status: 'root_cause',
          badgeText: 'ROOT CAUSE: Open snap relief (Slide #2)',
          detail: 'Water entry restriction structure not available in pop-up knob clip; water directly penetrates through snap relief hole into dry trim.'
        },
        {
          id: 'b3',
          name: 'Speaker mounting collar foam gasket missing',
          slideNo: 57,
          status: 'verified',
          badgeText: 'Verified: Foam omitted (Slide #57)',
          detail: 'Speaker basket mounted metal-to-metal without pre-cut closed-cell foam gasket ring, permitting water seep past rivet holes.'
        },
        {
          id: 'b4',
          name: 'Door bottom hem drain slot blockage',
          slideNo: 6,
          status: 'debunked',
          badgeText: 'Debunked: 3 weep slots clear',
          detail: 'Checked door bottom hem flange: all three gravity weep slots unobstructed with correct downward pitch.'
        },
        {
          id: 'b5',
          name: 'Rear door glass runner flock material capillary feed',
          slideNo: 5,
          status: 'checked',
          badgeText: 'Checked: Aero lip clean',
          detail: 'Flock material verified removed on aero lip as per LLR Slide #5 revision.'
        }
      ],
      chain: [
        { step: 1, title: 'Complaint Verification', desc: 'Customer reported water dripping on passenger speaker grille after car wash.' },
        { step: 2, title: 'Waist Seal & Drain Check', desc: 'Inspected outer glass waist seal retention: Debunked (165N normal load). Bottom drain slots free of wax obstruction.' },
        { step: 3, title: 'Pop-up Knob Clip Inspection', desc: 'Borescope inspection through glass opening revealed water entering directly through the snap relief slot of the pop-up knob clip (LLR Slide #2).' },
        { step: 4, title: 'Speaker Basket Gasket Audit', desc: 'Removed front speaker: speaker ring installed without 1.5mm closed-cell EPDM foam gasket, allowing runoff into cabin.' },
        { step: 5, title: 'Fix & Retest', desc: 'Fitted closed-type pop-up knob clip with continuous restriction wall and replaced speaker gasket. Water leak eliminated.' }
      ],
      recommendations: [
        { type: 'Execute', text: 'Replace open snap pop-up knob clips with modified closed-wall clip design (LLR Slide #2).' },
        { type: 'Verify', text: 'Ensure pre-cut 1.5mm EPDM foam gasket fitted on door speaker housing before rivet fastening.' },
        { type: 'Update', text: 'Update Techline bulletin with Part #80960-xxxx closed clip part number cross-reference.' }
      ],
      defaultWorkOrder: {
        id: 'WO-890215',
        status: 'Draft',
        description: 'Replace pop-up knob clip with closed-wall variant & renew speaker foam seal',
        equipment: 'Magnite (HBC) - VIN 8XF-90215',
        plant: 'Plant 1 · Service Bay 2',
        priority: 'Medium',
        assignedTo: 'Damodharan (Analyst)',
        dueDate: 'Tomorrow',
        estimatedHours: '1.0'
      }
    },
    {
      id: 'headliner-a-pillar',
      title: 'Headliner Dampness & A-Pillar / Windshield Header Drip',
      symptom: 'A-Pillar Water Drip + Header Soak',
      vehicle: 'Triber (RBC) / Kiger (PY1B)',
      confidence: 95,
      rootCauseSummary: 'Roof ditch expander sealer skip at windshield header corner combined with body welt joining cut at A-pillar upper radius.',
      primarySlide: 4,
      evidenceSlides: [4, 6, 22, 55],
      branches: [
        {
          id: 'b1',
          name: 'Windshield polyurethane adhesive bead void',
          slideNo: 48,
          status: 'debunked',
          badgeText: 'Debunked: PU bead continuous',
          detail: 'Tested windshield bond line with ultrasonic air probe: continuous adhesive bead, zero air transmission.'
        },
        {
          id: 'b2',
          name: 'Body welt joining cut placed at upper A-pillar',
          slideNo: 22,
          status: 'root_cause',
          badgeText: 'ROOT CAUSE: Cut at pillar (Slide #22)',
          detail: 'Body welt joining seam positioned at upper A-pillar radius instead of bottom sill, allowing gravity water track into headliner.'
        },
        {
          id: 'b3',
          name: 'Roof ditch molding weld seam sealer skip',
          slideNo: 55,
          status: 'verified',
          badgeText: 'Verified: Sealer void in ditch',
          detail: 'Laser braze / resistance spot weld seam under ditch molding has 4mm sealer skip, enabling rainwater migration.'
        },
        {
          id: 'b4',
          name: 'Sunroof cassette drain tube disconnect',
          slideNo: 47,
          status: 'debunked',
          badgeText: 'Debunked: Tube clamped tight',
          detail: 'Front left sunroof drain tube securely engaged with spring clamp to A-pillar pass-through spout.'
        }
      ],
      chain: [
        { step: 1, title: 'Localizing Ingress Point', desc: 'Moisture detected along driver upper A-pillar trim and sun visor mounting point.' },
        { step: 2, title: 'Windshield PU Bead Inspection', desc: 'Ultrasonic inspection of fixed windshield perimeter: Debunked (100% bonded).' },
        { step: 3, title: 'Door Body Welt Joint Analysis', desc: 'Body welt seam was cut and joined at upper A-pillar curved profile. Water flowing down ditch enters through the joint cut (LLR Slide #22).' },
        { step: 4, title: 'Roof Ditch Joint Inspection', desc: 'Removed roof ditch molding: found pinhole void in structural mastic seam.' },
        { step: 5, title: 'Verification', desc: 'Applied single-piece continuous body welt joined strictly at bottom sill and resealed roof ditch weld.' }
      ],
      recommendations: [
        { type: 'Execute', text: 'Reposition body welt joining seam strictly to bottom sill (100mm from B-pillar) per NDS Std.' },
        { type: 'Verify', text: 'Reseal roof ditch joint with automotive 1K MS polymer seam sealer.' },
        { type: 'Update', text: 'Mandate single continuous body welt extrusion in upcoming model year design review.' }
      ],
      defaultWorkOrder: {
        id: 'WO-890216',
        status: 'Draft',
        description: 'Reinstall body welt with bottom sill joint & reseal roof ditch void',
        equipment: 'Triber (RBC) - VIN 8XF-90216',
        plant: 'Plant 1 · Service Bay 1',
        priority: 'High',
        assignedTo: 'Sree Vishnu (VQE)',
        dueDate: 'Today',
        estimatedHours: '2.0'
      }
    },
    {
      id: 'cowl-bulkhead',
      title: 'Cowl Water Box Ingress into Cabin Air Intake & Blower Cavity',
      symptom: 'Blower Motor Wet + Musty Smell',
      vehicle: 'Duster (PB1D) / Captur (HHA)',
      confidence: 93,
      rootCauseSummary: 'Cowl water box stopper weir height insufficient (<37mm in Z direction), causing cascade over HVAC intake during car wash.',
      primarySlide: 51,
      evidenceSlides: [51, 50, 56, 45],
      branches: [
        {
          id: 'b1',
          name: 'Cowl water box stopper height < 37mm in Z axis',
          slideNo: 51,
          status: 'root_cause',
          badgeText: 'ROOT CAUSE: Height 24mm (Slide #51)',
          detail: 'Measured stopper weir height: 24mm (fails NDS standard min 37mm). Dynamic car wash cascade spills directly over weir into HVAC fresh air duct.'
        },
        {
          id: 'b2',
          name: 'Wiper pivot spindle rubber grommet pinched',
          slideNo: 56,
          status: 'debunked',
          badgeText: 'Debunked: Grommet fully seated',
          detail: 'Wiper spindle grommet seated flat with 360° flange overlap; zero bypass water.'
        },
        {
          id: 'b3',
          name: 'Hood release cable bulkhead pass-through unsealed',
          slideNo: 56,
          status: 'debunked',
          badgeText: 'Debunked: E-coat plug intact',
          detail: 'Hood release cable rubber cone seated flush with positive audible latch click.'
        },
        {
          id: 'b4',
          name: 'Cowl chamber leaves / debris accumulation',
          slideNo: 50,
          status: 'verified',
          badgeText: 'Verified: Left drain clogged',
          detail: 'Left-side duckbill drain valve partially restricted by organic debris, aggravating water pooling.'
        }
      ],
      chain: [
        { step: 1, title: 'Customer Symptom Check', desc: 'Blower fan vibrating with sloshing water noise and musty odor after drive through thunderstorm.' },
        { step: 2, title: 'Bulkhead Pass-Through Check', desc: 'Inspected hood release cable and harness grommets: Debunked (both tightly seated).' },
        { step: 3, title: 'Cowl Box Weir Gauge Audit', desc: 'Gauge measurement of cowl water box intake weir: 24mm Z-height (fails mandatory 37mm threshold from LLR Slide #51).' },
        { step: 4, title: 'Drain Valve Cleanout', desc: 'Found duckbill rubber drain restricted, causing water head to rise 30mm during heavy volume.' },
        { step: 5, title: 'Countermeasure Extension', desc: 'Installed 37mm weir riser collar and cleared duckbill drain valve. High-pressure jet test passed.' }
      ],
      recommendations: [
        { type: 'Execute', text: 'Fit 37mm cowl water stopper extension collar and ensure continuous overlap in X direction (LLR Slide #51).' },
        { type: 'Verify', text: 'Flush cowl drain duckbill valves with 5L water; confirm instantaneous drainage.' },
        { type: 'Update', text: 'Incorporate cowl stopper Z-height gauge check into Pre-Delivery Inspection (PDI) checklist.' }
      ],
      defaultWorkOrder: {
        id: 'WO-890217',
        status: 'Draft',
        description: 'Fit 37mm cowl stopper extension collar & flush duckbill valves',
        equipment: 'Duster (PB1D) - VIN 8XF-90217',
        plant: 'Plant 1 · Service Bay 3',
        priority: 'High',
        assignedTo: 'Nikit (Techline Specialist)',
        dueDate: 'In 2 days',
        estimatedHours: '1.5'
      }
    },
    {
      id: 'boot-luggage-well',
      title: 'Spare Wheel Well Water Pooling & Rear Floor Dampness',
      symptom: 'Luggage Well Flooded + Damp Mat',
      vehicle: 'Kwid (XBA) / Triber (RBC)',
      confidence: 97,
      rootCauseSummary: 'Rear combination lamp mounting stud missing closed-cell foam washer combined with cabin pressure exhauster flap seal skip.',
      primarySlide: 1,
      evidenceSlides: [1, 12, 4, 57],
      branches: [
        {
          id: 'b1',
          name: 'Tailgate body welt air vent hole facing outward',
          slideNo: 4,
          status: 'debunked',
          badgeText: 'Debunked: Vent faces inward',
          detail: 'Air vent hole verified facing towards inner cabin side per LLR Slide #4 countermeasure.'
        },
        {
          id: 'b2',
          name: 'Rear combination lamp stud missing foam washer',
          slideNo: 12,
          status: 'root_cause',
          badgeText: 'ROOT CAUSE: Missing washer (Slide #12)',
          detail: 'Upper right combination lamp retaining stud installed without closed-cell foam washer; runoff from rear quarter flows directly into quarter panel cavity and spare tyre tub.'
        },
        {
          id: 'b3',
          name: 'Cabin pressure exhauster vent rubber flap stuck',
          slideNo: 57,
          status: 'verified',
          badgeText: 'Verified: Flap pinched open',
          detail: 'Exhauster vent rubber flap distorted by bumper wire harness routing, staying partially open.'
        },
        {
          id: 'b4',
          name: 'Rear backlite glass polyurethane void',
          slideNo: 6,
          status: 'debunked',
          badgeText: 'Debunked: No glass void',
          detail: 'No water passage across fixed glass perimeter seal during focused jet spray.'
        }
      ],
      chain: [
        { step: 1, title: 'Water Pool Identification', desc: 'Customer found 1.5 cm of standing water in spare wheel tub after driving in rain.' },
        { step: 2, title: 'Tailgate Perimeter Test', desc: 'Tested tailgate welt and backlite glass: Debunked (no ingress across upper hatch).' },
        { step: 3, title: 'Rear Quarter Teardown', desc: 'Removed right rear lamp assembly: upper stud hole lacked the mandatory closed-cell foam washer (LLR Slide #12).' },
        { step: 4, title: 'Exhauster Vent Check', desc: 'Inspected cabin air exhauster behind rear bumper: lower flap caught on harness clip.' },
        { step: 5, title: 'Resolution', desc: 'Fitted OEM EPDM stud washer, rerouted bumper harness, and dried cabin carpet.' }
      ],
      recommendations: [
        { type: 'Execute', text: 'Fit closed-cell EPDM foam washers under all rear lamp mounting studs (LLR Slide #12).' },
        { type: 'Verify', text: 'Verify cabin pressure exhauster flaps close gravitationally without harness interference.' },
        { type: 'Update', text: 'Add Poka-Yoke fixture at lamp supplier to prevent stud insertion without foam washer.' }
      ],
      defaultWorkOrder: {
        id: 'WO-890218',
        status: 'Draft',
        description: 'Fit rear lamp stud EPDM washers & free cabin exhauster flap',
        equipment: 'Kwid (XBA) - VIN 8XF-90218',
        plant: 'Plant 1 · Service Bay 5',
        priority: 'Medium',
        assignedTo: 'Damodharan (Analyst)',
        dueDate: 'Today',
        estimatedHours: '1.0'
      }
    }
  ];

  // DOM Elements cache
  const el = {};

  // Main Initialize
  function init() {
    initTheme();
    loadStoredData();
    cacheDOMElements();
    setupNavigation();
    setupFTAAgent();
    setupWorkOrderModal();
    setupLessonsBrowser();
    setupVehicleZones();
    setupInteractiveChecklist();
    setupDataSync();
    setupDetailDrawer();
    setupHotspots();
    setupKeyboardShortcuts();

    // Render Initial State
    renderFTAAgent();
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
      } else if (window.DEFAULT_LESSONS_DATA) {
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

    try {
      const storedWorkOrders = localStorage.getItem(WORK_ORDERS_KEY);
      if (storedWorkOrders) {
        workOrders = JSON.parse(storedWorkOrders);
      } else {
        workOrders = FTA_SCENARIOS.map(s => s.defaultWorkOrder);
        saveWorkOrders();
      }
    } catch (e) {
      workOrders = FTA_SCENARIOS.map(s => s.defaultWorkOrder);
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

  function saveWorkOrders() {
    try {
      localStorage.setItem(WORK_ORDERS_KEY, JSON.stringify(workOrders));
    } catch (e) {}
  }

  function cacheDOMElements() {
    // Views
    el.viewFta = document.getElementById('view-fta-agent');
    el.viewLessons = document.getElementById('view-lessons-browser');
    el.viewZones = document.getElementById('view-vehicle-zones');
    el.viewChecklist = document.getElementById('view-interactive-checklist');
    el.viewSync = document.getElementById('view-data-sync');
    el.viewDetail = document.getElementById('view-lesson-detail');

    // Navigation
    el.navTabBtns = document.querySelectorAll('.nav-tab-btn');
    el.mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
    el.navCountBadge = document.getElementById('nav-count-badge');

    // FTA Agent Elements
    el.ftaScenarioSelect = document.getElementById('fta-scenario-select');
    el.ftaQueryInput = document.getElementById('fta-query-input');
    el.ftaRunBtn = document.getElementById('fta-run-btn');
    el.ftaCreateWoBtn = document.getElementById('fta-create-wo-btn');
    el.ftaTreeContainer = document.getElementById('fta-tree-canvas');
    el.ftaChainContainer = document.getElementById('fta-chain-container');
    el.ftaIncidentTitle = document.getElementById('fta-incident-title');
    el.ftaConfidenceBadge = document.getElementById('fta-confidence-badge');
    el.ftaIncidentDesc = document.getElementById('fta-incident-desc');
    el.ftaRightTabs = document.querySelectorAll('.fta-tab-btn');
    el.ftaTabContent = document.getElementById('fta-tab-content');
    el.ftaPrintBtn = document.getElementById('fta-print-btn');

    // Work Order Modal
    el.workOrderModal = document.getElementById('workOrderModal');
    el.closeWoModal = document.getElementById('closeWoModal');
    el.cancelWoBtn = document.getElementById('cancelWoBtn');
    el.confirmWoBtn = document.getElementById('confirmWoBtn');
    el.woDesc = document.getElementById('wo-desc');
    el.woPriority = document.getElementById('wo-priority');
    el.woDueDate = document.getElementById('wo-due-date');
    el.woAssignee = document.getElementById('wo-assignee');
    el.woHours = document.getElementById('wo-hours');

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
    el.syncNowBtn = document.getElementById('sync-now-btn') || document.getElementById('syncNowBtn');
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

      // Close modals
      if (el.viewDetail) el.viewDetail.classList.add('hidden');
      if (el.workOrderModal) el.workOrderModal.classList.add('hidden');

      // Hide all views
      [el.viewFta, el.viewLessons, el.viewZones, el.viewChecklist, el.viewSync].forEach(v => {
        if (v) v.classList.add('hidden');
      });

      // Show target view
      const target = {
        'fta-agent': el.viewFta,
        'lessons-browser': el.viewLessons,
        'vehicle-zones': el.viewZones,
        'interactive-checklist': el.viewChecklist,
        'data-sync': el.viewSync
      }[viewName];

      if (target) target.classList.remove('hidden');

      // Update Desktop Tabs
      el.navTabBtns.forEach(btn => {
        const tab = btn.getAttribute('data-nav-tab');
        if (tab === viewName) {
          btn.className = 'nav-tab-btn active px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs';
        } else {
          btn.className = 'nav-tab-btn px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5';
        }
      });

      // Update Mobile Nav
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
      if (e.key === '/' && document.activeElement !== el.lessonSearch && document.activeElement !== el.ftaQueryInput) {
        e.preventDefault();
        if (activeTab === 'fta-agent') {
          el.ftaQueryInput?.focus();
        } else {
          window.switchView('lessons-browser');
          el.lessonSearch?.focus();
        }
      }
      // 'Escape' to close modals
      if (e.key === 'Escape') {
        if (el.viewDetail && !el.viewDetail.classList.contains('hidden')) {
          el.viewDetail.classList.add('hidden');
        }
        if (el.workOrderModal && !el.workOrderModal.classList.contains('hidden')) {
          el.workOrderModal.classList.add('hidden');
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
    if (el.kpiVerifiedCount) el.kpiVerifiedCount.textContent = verifiedSlides.size;
    if (el.kpiVerifiedPct) {
      const pct = lessons.length > 0 ? Math.round((verifiedSlides.size / lessons.length) * 100) : 0;
      el.kpiVerifiedPct.textContent = `(${pct}%)`;
    }
    if (el.kpiHighRisk) {
      const highRiskCount = lessons.filter(l => l.risk === 'High Risk').length;
      el.kpiHighRisk.textContent = highRiskCount;
    }
  }

  // =========================================================================
  // 1. FTA (FAILURE TREE ANALYSIS) ROOT CAUSE AGENT ENGINE
  // =========================================================================

  function setupFTAAgent() {
    if (el.ftaScenarioSelect) {
      el.ftaScenarioSelect.addEventListener('change', e => {
        activeScenarioId = e.target.value;
        customFtaQuery = '';
        if (el.ftaQueryInput) el.ftaQueryInput.value = '';
        renderFTAAgent();
        showToast('Loaded diagnostic scenario: ' + e.target.options[e.target.selectedIndex].text.split('(')[0]);
      });
    }

    if (el.ftaRunBtn) {
      el.ftaRunBtn.addEventListener('click', runFtaDiagnostic);
    }

    if (el.ftaQueryInput) {
      el.ftaQueryInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          runFtaDiagnostic();
        }
      });
    }

    if (el.ftaCreateWoBtn) {
      el.ftaCreateWoBtn.addEventListener('click', () => {
        const scenario = getActiveScenario();
        openWorkOrderModal(scenario.recommendations.map(r => r.type + ': ' + r.text).join('\n'), scenario.primarySlide);
      });
    }

    if (el.ftaPrintBtn) {
      el.ftaPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }

    el.ftaRightTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-fta-tab');
        activeFtaTab = tab;
        el.ftaRightTabs.forEach(b => {
          b.className = 'fta-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all';
        });
        btn.className = 'fta-tab-btn active px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs transition-all';
        renderFtaTabContent();
      });
    });
  }

  function getActiveScenario() {
    if (customFtaQuery) {
      return generateDynamicFtaScenario(customFtaQuery);
    }
    return FTA_SCENARIOS.find(s => s.id === activeScenarioId) || FTA_SCENARIOS[0];
  }

  function generateDynamicFtaScenario(query) {
    const q = query.toLowerCase();
    const matched = lessons.filter(l => {
      const fullText = [l.concern, l.area, l.project, ...l.rootCauses, ...l.countermeasures, ...l.checkPoints].join(' ').toLowerCase();
      return fullText.includes(q);
    });

    const topLesson = matched[0] || lessons[9] || lessons[0];
    const relatedLessons = matched.slice(1, 5);

    const branches = [
      {
        id: 'dyn-1',
        name: topLesson.concern,
        slideNo: topLesson.slideNo,
        status: 'root_cause',
        badgeText: `ROOT CAUSE: ${topLesson.rootCauses[0] ? topLesson.rootCauses[0].slice(0, 32) + '...' : 'Verified fault'} (Slide #${topLesson.slideNo})`,
        detail: topLesson.rootCauses.join('; ') || 'Primary ingress mechanism identified from historical digital check.'
      }
    ];

    relatedLessons.forEach((l, idx) => {
      branches.push({
        id: `dyn-${idx + 2}`,
        name: l.concern,
        slideNo: l.slideNo,
        status: idx % 2 === 0 ? 'debunked' : 'verified',
        badgeText: idx % 2 === 0 ? `Debunked: Clear on Slide #${l.slideNo}` : `Verified: Contributing on Slide #${l.slideNo}`,
        detail: l.countermeasures[0] || 'Inspection standard verified on line.'
      });
    });

    if (branches.length < 4) {
      branches.push({
        id: 'dyn-filler-1',
        name: 'Floor pan e-coat oval drainage plug seated',
        slideNo: 35,
        status: 'debunked',
        badgeText: 'Debunked: 360° flush fit confirmed',
        detail: 'Underbody inspection confirmed all plugs sealed with intact PVC wax boundary.'
      });
      branches.push({
        id: 'dyn-filler-2',
        name: 'Door weatherstrip aero lip clearance',
        slideNo: 5,
        status: 'debunked',
        badgeText: 'Debunked: Lip retention >150N',
        detail: 'Aero lip contact load meets standard specification.'
      });
    }

    return {
      id: 'dynamic-search',
      title: `AI Root Cause Analysis for: "${query}"`,
      symptom: `${query.toUpperCase()} INGRESS`,
      vehicle: `${topLesson.project} (Commercial Model)`,
      confidence: 91,
      rootCauseSummary: `${topLesson.concern}: ${topLesson.rootCauses[0] || 'Failure mechanism isolated.'}`,
      primarySlide: topLesson.slideNo,
      evidenceSlides: [topLesson.slideNo, ...relatedLessons.map(l => l.slideNo)].slice(0, 4),
      branches: branches,
      chain: [
        { step: 1, title: 'Symptom Query Received', desc: `Diagnostic query "${query}" matched ${matched.length} historical lessons across 17 inspection zones.` },
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
  }

  function runFtaDiagnostic() {
    const query = el.ftaQueryInput?.value.trim();
    if (query) {
      customFtaQuery = query;
      showToast(`AI FTA Agent analyzing 76 lessons for: "${query}"...`);
    } else {
      customFtaQuery = '';
      showToast('Evaluating active fault tree scenario...');
    }

    // Animation feedback
    if (el.ftaTreeContainer) {
      el.ftaTreeContainer.classList.add('opacity-50');
      setTimeout(() => {
        el.ftaTreeContainer.classList.remove('opacity-50');
        renderFTAAgent();
        showToast('Fault Tree Analysis (FTA) diagnostic complete.');
      }, 350);
    } else {
      renderFTAAgent();
    }
  }

  function renderFTAAgent() {
    const scenario = getActiveScenario();

    // Set Header Info
    if (el.ftaIncidentTitle) {
      el.ftaIncidentTitle.textContent = scenario.title;
    }
    if (el.ftaConfidenceBadge) {
      el.ftaConfidenceBadge.textContent = `Confidence: High ${scenario.confidence}%`;
    }
    if (el.ftaIncidentDesc) {
      el.ftaIncidentDesc.textContent = scenario.rootCauseSummary;
    }

    // Render 1: Interactive FTA Tree (Visual Graph matching UptimeAI style)
    renderFTATree(scenario);

    // Render 2: Diagnostic Reasoning Chain (5 steps)
    renderFTAChain(scenario);

    // Render 3: Tabbed Panel (Recommendations, Work Orders, Documents, System Details)
    renderFtaTabContent(scenario);
  }

  function renderFTATree(scenario) {
    if (!el.ftaTreeContainer) return;

    const branches = scenario.branches || [];
    const totalBranches = branches.length;

    // Build the visual SVG + HTML Tree matching Image 1 (UptimeAI Root Cause Agent)
    // Left: Root symptom pill; Center: Branching lines & hypotheses; Right: Status Badges (Debunked / Root Cause)
    
    let html = `
      <div class="relative w-full py-4 px-2 sm:px-6 overflow-x-auto min-w-[720px] select-none">
        
        <!-- Legend bar -->
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
            <span class="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Active FTA Fault Tree</span>
            <span class="text-slate-400 font-mono text-[11px]">(${totalBranches} Hypothesis Branches)</span>
          </div>
          <div class="flex items-center gap-2 text-[11px] font-mono">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-400 border border-orange-200 dark:border-orange-800 font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> ROOT CAUSE
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Debunked
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
            </span>
          </div>
        </div>

        <div class="relative flex items-center justify-between gap-6 py-2">
          
          <!-- LEFT: Root Symptom Node (Dark Pill matching UptimeAI screenshot) -->
          <div class="shrink-0 z-10 w-44 sm:w-48 p-3.5 rounded-2xl bg-[#0b1326] text-white border-2 border-sky-500/80 shadow-lg shadow-sky-500/10 flex flex-col justify-center">
            <div class="flex items-center gap-1.5 text-sky-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <span class="material-symbols-outlined text-[14px]">report_problem</span>
              <span>Observed Top Event</span>
            </div>
            <div class="text-xs sm:text-sm font-extrabold leading-snug">
              ${escapeHTML(scenario.symptom)}
            </div>
            <div class="text-[10px] text-slate-400 mt-1.5 font-mono">
              ${escapeHTML(scenario.vehicle)}
            </div>
          </div>

          <!-- CENTER & RIGHT: Branching Container with SVG connector lines and nodes -->
          <div class="flex-1 relative space-y-3.5 pl-6">
            <!-- SVG connector curves rendered behind -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none -left-6" preserveAspectRatio="none">
              ${branches.map((b, idx) => {
                const total = branches.length;
                const startY = 50; // percentage height from root node center
                const endY = ((idx + 0.5) / total) * 100;
                return `
                  <path
                    d="M 0 ${startY}% C 40% ${startY}%, 40% ${endY}%, 100% ${endY}%"
                    fill="none"
                    stroke="${b.status === 'root_cause' ? '#f97316' : b.status === 'verified' ? '#10b981' : '#64748b'}"
                    stroke-width="${b.status === 'root_cause' ? '2.5' : '1.5'}"
                    stroke-opacity="${b.status === 'root_cause' ? '1' : '0.65'}"
                    stroke-dasharray="${b.status === 'debunked' ? '4 3' : 'none'}"
                  />
                `;
              }).join('')}
            </svg>

            <!-- Hypothesis & Terminal Status Nodes -->
            ${branches.map(b => {
              const isRootCause = b.status === 'root_cause';
              const isDebunked = b.status === 'debunked';
              const isVerified = b.status === 'verified';

              // Visual styling matching UptimeAI screenshot
              let statusClass = '';
              let badgeColor = '';
              if (isRootCause) {
                statusClass = 'border-orange-500/80 bg-orange-50/80 dark:bg-orange-950/40 text-slate-900 dark:text-white ring-2 ring-orange-500/40 shadow-md';
                badgeColor = 'bg-orange-600 text-white font-black tracking-wide shadow-xs';
              } else if (isDebunked) {
                statusClass = 'border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0f172a]/90 text-slate-600 dark:text-slate-400 opacity-90';
                badgeColor = 'bg-[#1e293b] text-slate-300 font-bold';
              } else if (isVerified) {
                statusClass = 'border-emerald-500/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-slate-900 dark:text-white';
                badgeColor = 'bg-emerald-700 text-white font-bold';
              } else {
                statusClass = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                badgeColor = 'bg-slate-700 text-white font-semibold';
              }

              return `
                <div class="relative z-10 flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-200 hover:shadow-md ${statusClass} group cursor-pointer fta-branch-node" data-branch-id="${b.id}" data-slide="${b.slideNo}">
                  
                  <!-- Hypothesis Name & Slide Link -->
                  <div class="flex items-center gap-2.5 min-w-0 flex-1">
                    <span class="w-2 h-2 rounded-full shrink-0 ${isRootCause ? 'bg-orange-500 animate-ping' : isDebunked ? 'bg-slate-400' : 'bg-emerald-500'}"></span>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-xs font-bold truncate ${isRootCause ? 'text-orange-950 dark:text-orange-200 font-extrabold' : ''}">${escapeHTML(b.name)}</span>
                        ${b.slideNo ? `<button class="inspect-slide-btn px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 hover:bg-sky-200 transition-colors" data-slide="${b.slideNo}" title="Open LLR Slide #${b.slideNo} Sheet">LLR #${b.slideNo}</button>` : ''}
                      </div>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${escapeHTML(b.detail)}</p>
                    </div>
                  </div>

                  <!-- Terminal Status Badge (matching UptimeAI screenshot top right) -->
                  <div class="shrink-0 flex items-center gap-1.5">
                    <span class="px-2.5 py-1 rounded-xl text-[11px] font-mono uppercase tracking-wider ${badgeColor}">
                      ${escapeHTML(b.badgeText)}
                    </span>
                    
                    <!-- Quick Toggle Status Button -->
                    <div class="hidden group-hover:flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <button class="toggle-status-btn px-1.5 py-0.5 rounded text-[10px] font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950" data-branch-id="${b.id}" data-set-status="root_cause" title="Mark as Root Cause">Root</button>
                      <button class="toggle-status-btn px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700" data-branch-id="${b.id}" data-set-status="debunked" title="Mark as Debunked">Debunk</button>
                    </div>
                  </div>

                </div>
              `;
            }).join('')}
          </div>

        </div>

      </div>
    `;

    el.ftaTreeContainer.innerHTML = html;
    attachFtaTreeListeners(scenario);
  }

  function attachFtaTreeListeners(scenario) {
    // Inspect Slide
    document.querySelectorAll('.inspect-slide-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const slideNo = parseInt(btn.getAttribute('data-slide'), 10);
        openDetailDrawer(slideNo);
      });
    });

    // Toggle Status
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const branchId = btn.getAttribute('data-branch-id');
        const newStatus = btn.getAttribute('data-set-status');
        const branch = scenario.branches.find(b => b.id === branchId);
        if (branch) {
          branch.status = newStatus;
          if (newStatus === 'root_cause') {
            branch.badgeText = `ROOT CAUSE: ${branch.name.slice(0, 28)}`;
            scenario.branches.forEach(b => {
              if (b.id !== branchId && b.status === 'root_cause') {
                b.status = 'verified';
                b.badgeText = `Verified: Contributory`;
              }
            });
            showToast(`Hypothesis "${branch.name}" marked as isolated ROOT CAUSE.`);
          } else if (newStatus === 'debunked') {
            branch.badgeText = `Debunked: Test verified negative`;
            showToast(`Hypothesis "${branch.name}" marked as DEBUNKED.`);
          }
          renderFTAAgent();
        }
      });
    });

    // Click branch node to preview slide
    document.querySelectorAll('.fta-branch-node').forEach(node => {
      node.addEventListener('click', () => {
        const slideNo = parseInt(node.getAttribute('data-slide'), 10);
        if (slideNo) openDetailDrawer(slideNo);
      });
    });
  }

  function renderFTAChain(scenario) {
    if (!el.ftaChainContainer) return;

    const chain = scenario.chain || [];

    el.ftaChainContainer.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-sky-600 dark:text-sky-400 text-[18px]">account_tree</span>
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Diagnostic Chain (${chain.length} Steps)</span>
          </div>
          <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Validated by Techline
          </span>
        </div>

        <div class="relative pl-6 space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
          ${chain.map((c, i) => `
            <div class="relative group">
              <span class="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-sky-600 text-[10px] font-mono font-bold flex items-center justify-center ring-4 ring-white dark:ring-[#0f172a]">
                ${c.step}
              </span>
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                <span class="font-extrabold text-slate-900 dark:text-white block">${escapeHTML(c.title)}</span>
                <p class="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">${escapeHTML(c.desc)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderFtaTabContent(scenarioParam) {
    if (!el.ftaTabContent) return;
    const scenario = scenarioParam || getActiveScenario();

    if (activeFtaTab === 'recommendations') {
      const recs = scenario.recommendations || [];
      el.ftaTabContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Actionable Recommendations</span>
            <button id="convert-wo-btn" class="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs" type="button">
              <span class="material-symbols-outlined text-[15px]">post_add</span> Create Work Order
            </button>
          </div>

          <div class="space-y-2.5">
            ${recs.map((r, idx) => `
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs space-y-1">
                <div class="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px] font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  <span>${idx + 1}. ${escapeHTML(r.type)}</span>
                </div>
                <p class="text-slate-800 dark:text-slate-200 font-medium leading-relaxed pl-3 text-[11px]">
                  ${escapeHTML(r.text)}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.getElementById('convert-wo-btn')?.addEventListener('click', () => {
        openWorkOrderModal(recs.map(r => r.type + ': ' + r.text).join('\n'), scenario.primarySlide);
      });

    } else if (activeFtaTab === 'workorders') {
      el.ftaTabContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Assigned Work Orders (${workOrders.length})</span>
            <button id="wo-create-new-btn" class="h-8 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs" type="button">
              <span class="material-symbols-outlined text-[15px]">add</span> New Work Order
            </button>
          </div>

          <div class="space-y-2.5">
            ${workOrders.map((wo, idx) => `
              <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-xs space-y-2 shadow-xs">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-sky-600 dark:text-sky-400">${wo.id}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    wo.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                  }">${wo.status}</span>
                </div>
                <p class="text-slate-900 dark:text-white font-bold leading-snug">${escapeHTML(wo.description)}</p>
                <div class="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div>Assigned: <strong class="text-slate-800 dark:text-slate-200">${escapeHTML(wo.assignedTo)}</strong></div>
                  <div>Due: <strong class="text-slate-800 dark:text-slate-200">${escapeHTML(wo.dueDate || 'Today')}</strong></div>
                  <div>Target: <span class="text-slate-700 dark:text-slate-300">${escapeHTML(wo.equipment || 'Vehicle')}</span></div>
                  <div>Est: <span class="text-slate-700 dark:text-slate-300">${escapeHTML(wo.estimatedHours || '1.0')} hrs</span></div>
                </div>
                <div class="pt-1 flex justify-end gap-1.5">
                  <button class="dispatch-wo-btn px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-100" data-wo-idx="${idx}">
                    ${wo.status === 'Completed' ? 'Re-open' : 'Mark Completed'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.getElementById('wo-create-new-btn')?.addEventListener('click', () => {
        openWorkOrderModal();
      });

      document.querySelectorAll('.dispatch-wo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-wo-idx'), 10);
          if (workOrders[idx]) {
            workOrders[idx].status = workOrders[idx].status === 'Completed' ? 'In Progress' : 'Completed';
            saveWorkOrders();
            renderFtaTabContent(scenario);
            showToast(`Work Order #${workOrders[idx].id} status updated to ${workOrders[idx].status}.`);
          }
        });
      });

    } else if (activeFtaTab === 'documents') {
      const slides = scenario.evidenceSlides || [scenario.primarySlide];
      const matchedLessons = lessons.filter(l => slides.includes(l.slideNo));

      el.ftaTabContent.innerHTML = `
        <div class="space-y-3">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">LLR Evidence Sheets (${matchedLessons.length})</span>
          <div class="space-y-2">
            ${matchedLessons.map(l => `
              <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs flex items-center justify-between gap-2 hover:border-sky-500 transition-colors cursor-pointer" onclick="openDetailDrawer(${l.slideNo})">
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono font-bold text-sky-600 dark:text-sky-400">Slide #${l.slideNo}</span>
                    <span class="font-semibold text-slate-900 dark:text-white truncate">${escapeHTML(l.concern)}</span>
                  </div>
                  <span class="text-[10px] text-slate-400 font-mono">${escapeHTML(l.area)} • ${escapeHTML(l.project)}</span>
                </div>
                <button class="shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                  View
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (activeFtaTab === 'system') {
      el.ftaTabContent.innerHTML = `
        <div class="space-y-3">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">Vehicle & Plant System Details</span>
          <div class="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs space-y-2 font-mono">
            <div class="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400">VIN</span>
              <span class="font-bold text-slate-900 dark:text-white">8XF-90214</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400">Model Platform</span>
              <span class="font-bold text-slate-900 dark:text-white">${scenario.vehicle}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400">Primary LLR Ref</span>
              <span class="font-bold text-sky-600 dark:text-sky-400">Slide #${scenario.primarySlide}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span class="text-slate-400">Assembly Line</span>
              <span class="font-bold text-slate-900 dark:text-white">Trim & Final · Line 3</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-slate-400">Shower Test Spec</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">2.5 bar / 20 min</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  // =========================================================================
  // 2. WORK ORDER NOTIFICATION MODAL ENGINE (Matching Screenshot)
  // =========================================================================

  function setupWorkOrderModal() {
    if (el.closeWoModal) el.closeWoModal.addEventListener('click', closeWorkOrderModal);
    if (el.cancelWoBtn) el.cancelWoBtn.addEventListener('click', closeWorkOrderModal);

    if (el.confirmWoBtn) {
      el.confirmWoBtn.addEventListener('click', () => {
        const desc = el.woDesc?.value.trim() || 'Laser align and re-route butyl bead';
        const priority = el.woPriority?.value || 'High';
        const dueDate = el.woDueDate?.value || new Date().toISOString().slice(0, 10);
        const assignedTo = el.woAssignee?.value || 'Nikit (Techline Specialist)';
        const hours = el.woHours?.value || '1.5';

        const newWo = {
          id: 'WO-' + Date.now().toString().slice(-6),
          status: 'Draft',
          description: desc,
          equipment: `Vehicle #${Math.floor(100000 + Math.random() * 900000)}`,
          plant: 'Plant 1 · Service Bay',
          priority: priority,
          assignedTo: assignedTo,
          dueDate: dueDate,
          estimatedHours: hours
        };

        workOrders.unshift(newWo);
        saveWorkOrders();
        closeWorkOrderModal();
        renderFtaTabContent();
        showToast(`Work Order #${newWo.id} created & assigned to ${assignedTo}!`);
      });
    }
  }

  function openWorkOrderModal(presetDesc, slideNo) {
    if (!el.workOrderModal) return;
    if (el.woDesc && presetDesc) el.woDesc.value = presetDesc;
    if (el.woDueDate) el.woDueDate.value = new Date().toISOString().slice(0, 10);
    el.workOrderModal.classList.remove('hidden');
    el.woDesc?.focus();
  }

  function closeWorkOrderModal() {
    if (el.workOrderModal) el.workOrderModal.classList.add('hidden');
  }

  // =========================================================================
  // 3. TECHNICAL CAD VECTOR SCHEMATICS (Human-Crafted 1:1 Scale SVG)
  // =========================================================================

  function getTechnicalDiagramSVG(area, slideNo) {
    const a = (area || '').toLowerCase();

    // 1. Clips / Fasteners
    if (a.includes('clip') || a.includes('fastener')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
          <path d="M 100 0 V 96 M 200 0 V 96 M 300 0 V 96" stroke="#1e293b" stroke-width="1"></path>
          <line x1="30" y1="48" x2="370" y2="48" stroke="#475569" stroke-width="5" stroke-linecap="round"></line>
          <line x1="180" y1="48" x2="220" y2="48" stroke="#0f172a" stroke-width="7"></line>
          <rect x="172" y="42" width="56" height="12" rx="3" fill="#10b981" stroke="#34d399" stroke-width="1.5"></rect>
          <path d="M 195 24 V 46 L 190 56 L 200 70 L 210 56 L 205 46 V 24 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"></path>
          <circle cx="200" cy="24" r="14" fill="#0284c7" opacity="0.3"></circle>
          <text x="200" y="16" fill="#38bdf8" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">CLOSED-CELL EPT FOAM GASKET (T=1.0mm)</text>
          <text x="50" y="44" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">DOOR INNER PANEL</text>
          <text x="245" y="65" fill="#34d399" font-family="JetBrains Mono" font-size="8" font-weight="700">COMPRESSION SEAL &gt; 40%</text>
        </svg>
      `;
    }

    // 2. Sealing Screen & Butyl Path
    if (a.includes('sealing screen') || a.includes('screen')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
          <path d="M 120 0 V 96 M 240 0 V 96" stroke="#1e293b" stroke-width="1"></path>
          <rect x="40" y="46" width="320" height="4" fill="#64748b"></rect>
          <path d="M 40 40 C 100 40 180 32 360 32" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4 2"></path>
          <ellipse cx="260" cy="46" rx="8" ry="5" fill="#f59e0b" stroke="#fbbf24" stroke-width="1.5"></ellipse>
          <circle cx="100" cy="46" r="6" fill="#ef4444"></circle>
          <line x1="100" y1="24" x2="260" y2="24" stroke="#34d399" stroke-width="1.5"></line>
          <path d="M 100 21 L 96 24 L 100 27 M 260 21 L 264 24 L 260 27" stroke="#34d399" stroke-width="1.5"></path>
          <text x="180" y="19" fill="#34d399" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">CLEARANCE ≥ 70mm (NDS RULE)</text>
          <text x="100" y="65" fill="#f87171" font-family="JetBrains Mono" font-size="8" font-weight="600" text-anchor="middle">HARNESS CLIP HOLE</text>
          <text x="260" y="65" fill="#fbbf24" font-family="JetBrains Mono" font-size="8" font-weight="600" text-anchor="middle">BUTYL ADHESIVE BEAD</text>
        </svg>
      `;
    }

    // 3. Floor & Plugs
    if (a.includes('floor') || a.includes('plug') || a.includes('grommet') || a.includes('hole')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
          <path d="M 140 0 V 96 M 260 0 V 96" stroke="#1e293b" stroke-width="1"></path>
          <line x1="30" y1="46" x2="160" y2="46" stroke="#64748b" stroke-width="6"></line>
          <line x1="240" y1="46" x2="370" y2="46" stroke="#64748b" stroke-width="6"></line>
          <path d="M 155 42 H 245 V 48 H 230 C 230 62 215 68 200 68 C 185 68 170 62 170 48 H 155 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"></path>
          <ellipse cx="200" cy="46" rx="42" ry="3" fill="#10b981" opacity="0.6"></ellipse>
          <text x="200" y="20" fill="#38bdf8" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">E-COAT DRAIN HOLE (360° CONTACT FLANGE)</text>
          <text x="70" y="60" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">FLOOR SHEET METAL</text>
          <text x="325" y="60" fill="#34d399" font-family="JetBrains Mono" font-size="8" font-weight="700">FLUSH SEAL</text>
        </svg>
      `;
    }

    // 4. Cowl & HVAC
    if (a.includes('cowl') || a.includes('hvac')) {
      return `
        <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
          <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
          <path d="M 100 0 V 96 M 220 0 V 96 M 320 0 V 96" stroke="#1e293b" stroke-width="1"></path>
          <path d="M 40 70 H 160 V 32 H 180 V 70 H 360" stroke="#64748b" stroke-width="4" fill="none"></path>
          <rect x="156" y="30" width="28" height="40" fill="#f59e0b" fill-opacity="0.3" stroke="#f59e0b" stroke-width="1.5"></rect>
          <line x1="140" y1="32" x2="140" y2="70" stroke="#34d399" stroke-width="1.5"></line>
          <text x="120" y="52" fill="#34d399" font-family="JetBrains Mono" font-size="8" font-weight="700" text-anchor="end">≥ 37mm</text>
          <text x="210" y="20" fill="#fbbf24" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">WATER BOX STOPPER WEIR (Z-HEIGHT ≥ 37mm)</text>
          <text x="80" y="84" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">WATER TROUGH</text>
          <text x="270" y="84" fill="#38bdf8" font-family="JetBrains Mono" font-size="8" font-weight="600">HVAC AIR INTAKE</text>
        </svg>
      `;
    }

    // Default High-Precision Industrial CAD Cross-Section
    return `
      <svg class="w-full h-24 select-none" viewBox="0 0 400 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="96" fill="#0f172a" rx="12"></rect>
        <path d="M 0 24 H 400 M 0 48 H 400 M 0 72 H 400" stroke="#1e293b" stroke-width="1"></path>
        <path d="M 80 0 V 96 M 200 0 V 96 M 320 0 V 96" stroke="#1e293b" stroke-width="1"></path>
        <rect x="40" y="38" width="180" height="6" fill="#64748b"></rect>
        <rect x="180" y="44" width="180" height="6" fill="#475569"></rect>
        <ellipse cx="180" cy="44" rx="18" ry="9" fill="#10b981" stroke="#34d399" stroke-width="1.5"></ellipse>
        <text x="200" y="24" fill="#34d399" font-family="JetBrains Mono" font-size="8.5" font-weight="700" text-anchor="middle">VALIDATED SEAL BARRIER · 360° CONTINUITY</text>
        <text x="100" y="62" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">BIW OUTER</text>
        <text x="300" y="62" fill="#94a3b8" font-family="JetBrains Mono" font-size="8" font-weight="600">BIW INNER REINFORCEMENT</text>
      </svg>
    `;
  }

  // =========================================================================
  // 4. LESSONS BROWSER ENGINE (Cards & Matrix Table View)
  // =========================================================================

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

  // =========================================================================
  // 5. LESSON DETAIL SLIDE-OVER DRAWER
  // =========================================================================

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

  // =========================================================================
  // 6. VEHICLE ZONES ENGINE (17 Hotspots)
  // =========================================================================

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

  // =========================================================================
  // 7. LINE CHECKLIST ENGINE
  // =========================================================================

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

    // Barcode scanner simulation modal
    if (el.scanBtn && el.scanModal) {
      el.scanBtn.addEventListener('click', () => el.scanModal.classList.remove('hidden'));
    }
    if (el.closeScanModal && el.scanModal) {
      el.closeScanModal.addEventListener('click', () => el.scanModal.classList.add('hidden'));
    }
    if (el.simulateScanBtn && el.scanModal) {
      el.simulateScanBtn.addEventListener('click', () => {
        el.scanModal.classList.add('hidden');
        showToast('VIN #8XF-90215 Scanned successfully.');
        document.querySelectorAll('.vin-display-badge').forEach(b => b.textContent = '8XF-90215');
      });
    }

    if (el.completeStationBtn) {
      el.completeStationBtn.addEventListener('click', () => {
        showToast('Station 06 Takt Certified: Passed to Water Shower Booth.');
      });
    }

    if (el.submitDefectBtn) {
      el.submitDefectBtn.addEventListener('click', () => {
        const activeChips = Array.from(document.querySelectorAll('.defect-chip.bg-sky-50')).map(c => c.textContent.trim());
        const defectName = activeChips.length > 0 ? activeChips.join(' + ') : 'Sealant line discontinuity detected';
        const newDefect = {
          id: 'DEF-' + Date.now().toString().slice(-4),
          concern: defectName,
          severity: 'Serious',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        defectLogs.unshift(newDefect);
        saveDefects();
        updateDefectsList();
        showToast(`Defect #${newDefect.id} logged to Shift QA Lead.`);
      });
    }

    updateDefectsList();
  }

  function updateChecklistUI() {
    const cards = document.querySelectorAll('#view-interactive-checklist .check-card');
    let completed = 0;
    cards.forEach(card => {
      const status = card.getAttribute('data-status');
      if (status && status !== 'none') completed++;
    });

    const total = cards.length || 4;
    const pct = Math.round((completed / total) * 100);

    if (el.completedCount) el.completedCount.textContent = completed;
    if (el.percentText) el.percentText.textContent = `(${pct}%)`;
    if (el.progBar) el.progBar.style.width = `${pct}%`;
  }

  function updateDefectsList() {
    if (!el.defectLogsList) return;
    if (defectLogs.length === 0) {
      el.defectLogsList.innerHTML = '<span class="text-xs text-slate-400 italic">No open defect tickets for this shift.</span>';
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

  // =========================================================================
  // 8. DATA SYNC & EXCEL / CSV IMPORT ENGINE
  // =========================================================================

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
