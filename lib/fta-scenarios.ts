import { FtaScenario, ZoneItem } from './types';

export const PROJECT_NAMES: Record<string, string> = {
  'PY1B': 'Kiger (PY1B)',
  'HBC': 'Magnite / Kiger (HBC)',
  'RBC': 'Triber (RBC)',
  'XBA': 'Kwid (XBA)',
  'PB1D': 'Duster (PB1D)',
  'HHA': 'Captur (HHA)',
  'I2': 'Concept (I2)'
};

export const ZONE_CONFIG: ZoneItem[] = [
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

export const FTA_SCENARIOS: FtaScenario[] = [
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

