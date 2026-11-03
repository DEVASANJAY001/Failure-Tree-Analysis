# 🛡️ LeakGuard LLR — Automotive Water Leak FTA & Diagnostic Portal

[![Framework: Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014%20(App%20Router)-black.svg?logo=next.js)](#)
[![React: 18.3](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](#)
[![TypeScript: 5.4](https://img.shields.io/badge/TypeScript-5.4-3178c6.svg?logo=typescript)](#)
[![Tailwind CSS: 3.4](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg?logo=tailwind-css)](#)
[![Engine: Failure Tree Analysis](https://img.shields.io/badge/Engine-Failure%20Tree%20Analysis%20(FTA)-ea580c.svg)](#)
[![Dataset: 76 LLR Lessons](https://img.shields.io/badge/Dataset-76%20Standard%20Lessons-2563eb.svg)](#)
[![Coverage: 17 Vehicle Zones](https://img.shields.io/badge/Coverage-17%20Critical%20Zones-059669.svg)](#)
[![Programs: 7 Vehicle Platforms](https://img.shields.io/badge/Programs-7%20Platforms-amber.svg)](#)
[![Tests: 8 Passed](https://img.shields.io/badge/Tests-8%20Passing%20(100%25)-emerald.svg)](#)

> **Enterprise Automotive Water Leak Failure Tree Analysis (FTA) & Root Cause Reasoning Portal for Service Technicians, Techlines, and Vehicle Quality Engineers (VQE). Replaces hours of manual teardown and static slide searching with mathematical fault tree isolation, chronological diagnostic chains, and 1-click Work Order notification dispatch.**

---

## 📌 Executive Summary

### The Idea in One Line
When a vehicle enters a service dealership or rolls off the final assembly line with water ingress (wet floor carpet, dripping headliner, speaker compartment seepage, or flooded spare wheel well), **LeakGuard LLR FTA Agent** guides technicians through a structured **Failure Tree Analysis (FTA)** to systematically debunk false leads, isolate the verified **ROOT CAUSE**, and dispatch CMMS work order notifications in minutes.

### Traditional vs. AI-Powered FTA Troubleshooting

```
TRADITIONAL METHOD (Slide Decks & Manual Tear-down):
  Customer Complaint ──▶ 76-Slide PDF Deck ──▶ Manual Teardown ──▶ Guesswork ──▶ [HOURS OF DOWNTIME]

LEAKGUARD FTA REASONING AGENT (UptimeAI / cPACKET Topology):
  Symptom Query      ──▶ Visual Fault Tree ──▶ Debunked Leads  ──▶ Isolated ROOT CAUSE ──▶ Work Order Notification [MINUTES]
```

---

## 🏛️ System Architecture & Full-Stack Next.js Layout

The portal is built as a production-grade full-stack **Next.js 14 App Router** application with zero external runtime friction, static prerendering, and dynamic server-side API routes:

```
c:\Users\devas\projects\root\
├── app/
│   ├── layout.tsx                # Next.js Root Layout (Inter, JetBrains Mono, Material Symbols)
│   ├── globals.css               # Design tokens, Apple/Linear cubic-bezier curves, blueprint grid
│   ├── page.tsx                  # Main reactive orchestration hub & global state manager
│   └── api/
│       ├── lessons/route.ts      # REST API: GET lessons with ?q=, ?area=, ?project= filtering
│       └── work-orders/route.ts  # REST API: GET, POST, PATCH work order lifecycle
├── components/
│   ├── FtaDiagnosticAgent.tsx    # Failure Tree Analysis (FTA) with SVG bezier tree & diagnostic chain
│   ├── LessonsBrowser.tsx        # 76 LLR lessons search engine, filter chips, cards & matrix view
│   ├── VehicleZones.tsx          # 17 vehicle ingress hotspots with interactive SVG chassis blueprint
│   ├── LineChecklist.tsx         # Station 06 Takt bar, glove-friendly checks, defect dock, VIN scanner
│   ├── DataSync.tsx              # Drag-and-drop CSV/Excel ETL pipeline & schema mapping table
│   ├── LessonDetailDrawer.tsx    # Slide-over drawer with CAD cross-sections & step checklist
│   ├── WorkOrderModal.tsx        # "Create a Work Order Notification" modal (matching reference screenshot)
│   ├── CadDiagram.tsx            # 1:1 scale engineering vector CAD cross-section diagrams
│   └── Navbar.tsx                # Navigation header with dark/light mode toggle & KPI badges
├── lib/
│   ├── types.ts                  # TypeScript models (Lesson, FtaScenario, FtaBranch, WorkOrder, etc.)
│   └── fta-scenarios.ts          # 5 automotive ingress FTA cases + 17 zone configurations
├── lessons-data.json             # Canonical JSON database of all 76 LLR lessons
├── Water_Leak_Issues_and_Check_Points.csv # Master CSV spreadsheet dataset
├── next.config.mjs               # Webpack configuration and SWC compiler optimizations
├── tailwind.config.js            # Design tokens and responsive container styling
├── tsconfig.json                 # TypeScript 5 bundler configuration
└── test/
    └── portal.test.js            # Automated verification test suite (8 suites, 100% pass)
```

---

## 🎨 UI/UX Design System: Handcrafted & Fluid

The application interface has been designed according to high-end enterprise ergonomics (inspired by **Linear**, **Vercel**, and **UptimeAI**):

1. **Restrained Color Palette:**
   - **Backgrounds:** Clean `#f8fafc` (Slate-50) in light mode, `#0b101d` in dark mode.
   - **Surfaces:** Floating white / slate-900 cards with delicate borders (`border-slate-200/80 dark:border-slate-800/80`).
   - **Single Meaningful Accent:** Vibrant international orange (`#ea580c`) is reserved exclusively for the isolated **ROOT CAUSE**.
   - **Confidence & Verification:** Calming emerald (`#059669`) and slate-cyan capsules.
2. **Fluid Physics & Transitions:**
   - Smooth cubic-bezier easing across all interactive elements:
     ```css
     --ease-out-cubic: cubic-bezier(0.16, 1, 0.3, 1);
     --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
     ```
   - Micro-interactions for tab switching, button clicks, and drawer slide-overs.
3. **Zero Visual Noise:**
   - Stripped away artificial neon glows, oversized drop-shadows, and erratic animations. Clean, legible typography with proper baseline alignment.

---

## ✨ Core Features & Workflows

### 1. 🌲 Interactive Failure Tree Analysis (FTA) Canvas
A 3-column fault tree topology directly mirroring industrial diagnostic systems:

```
[Column 1: Observed Top Event]  ───(Smooth Bezier S-curves)───▶  [Column 2: Hypotheses]  ───(Parallel Links)───▶  [Column 3: Evidence Badges]
```

- **Top Event Node:** Centered dark navy capsule (`#09152e`) displaying observed symptom (e.g., `Floor Pan Flooding + Carpet Ingress`) and vehicle program.
- **Mathematical Bezier Curves:** SVG cubic bezier paths (`M 190 170 C 265 170, 265 y_i, 340 y_i`) fanning out to hypotheses.
- **Hypotheses Column:** Stack of 5 uniformly sized pill cards ($48\text{px}$ height, $15\text{px}$ vertical spacing) with slide numbers.
- **Status & Evidence Badges (2-Line Capsules):**
  - 🟠 **ROOT CAUSE:** Bold orange pill with root failure mechanism (*e.g., "Sealing screen butyl gap <35mm vs 70mm spec"*).
  - ⚫ **Debunked:** Slate capsule with exact physical clearance test (*e.g., "Debunked: 42mm weir measured"*, *"Debunked: spout dry"*).
  - 🟢 **Verified:** Teal capsule for secondary contributing factors (*e.g., "Verified: OEM torque spec"*).

---

### 2. 📑 Split Diagnostic Workspace & Reasoning Chain
Laid out as two balanced side-by-side cards below the FTA canvas:

#### Left Card: Incident Narrative & Forensic Chain
- **Timestamp:** `2:15 PM · Shift QA Log` with status badge.
- **Narrative Explanation:** Comprehensive forensic breakdown of how water penetrated the boundary.
- **Embedded CAD Cross-Section:** 1:1 engineering drawing displaying mandatory clearances ($\ge 70\text{mm}$).
- **Chain (5 Steps):** Chronological timeline tracing the fault:
  1. *#002754:* Fastener / seal disturbed during prior operation.
  2. *Ingress Drift:* Water path across dry cavity during high-pressure rain test.
  3. *Root Cause Isolation:* LLR Slide rule violation.
  4. *Countermeasure Corroboration:* Validated design containment.
  5. *Line Verification:* Takt audit check point.

#### Right Card: Tabbed Investigation Workspace
- **Work Orders Tab:** Complete 3-column key-value matrix matching enterprise CMMS/SAP work orders:
  - `Created By: JMARTIN` | `Scheduled At: 2026-11-03` | `Equipment ID: IMP5128`
  - `Description: Mechanical seal change` | `Equipment: IMPECO LCKP FEED PUMP` | `Maintenance Plant: PLT-100`
- **Recommendations (4 Steps) Section:** Actionable containment instructions:
  - `1. Execute:` Laser alignment and butyl bead dispensing adjustment.
  - `2. Verify:` Tactile 360° gloved sweep and pin gauge check.
  - `3. Update:` Revise PM procedures and store records in SAP.
- **Evidence Tab:** LLR slide numbers, engineering document codes, and technical standards.
- **System Details Tab:** Chassis subsystem breakdown (BIW $\rightarrow$ Side Closure $\rightarrow$ Trim Door $\rightarrow$ Water Barrier).

---

### 3. 🪟 Work Order Notification Dispatch Modal (`WorkOrderModal.tsx`)
Replicated to 1:1 precision from the user's reference screenshot:
- **Description:** Pre-populated with technical countermeasure or custom free-text.
- **Priority:** High / Critical / Medium / Low.
- **Due Date:** Native calendar picker.
- **Assigned To:** Assignee picker (e.g., `Nikit`, `Priya`, `Damodharan`).
- **Estimated Hours:** Input field with decimal step support.
- **Footer Controls:** Clean text `Cancel` button on the right + green pill `✓ Confirm` button.
- **Persistence:** Created work orders update the global queue, save to `localStorage`, and dispatch real-time toast alerts.

---

### 4. 🚗 17 Critical Vehicle Ingress Zones (`VehicleZones.tsx`)
- **Interactive Vector Chassis:** High-contrast BIW car silhouette on a blueprint grid.
- **Clickable Hotspots:** Click on `Cowl`, `Windshield`, `Roof`, `Doors`, `Floor Pan`, `Quarter Glass`, or `Tailgate` to instantly filter lessons.
- **17 Zone Cards:** Uniform cards displaying assembly station, lesson count, risk alert, and direct navigation buttons.

---

### 5. 🧤 Glove-Friendly Shopfloor Line Checklist (`LineChecklist.tsx`)
- **Station 06 Door & Water Barrier Assembly:** Designed for operators in nitrile/work gloves on 12-hour shifts.
- **Large Tactile Targets:** Minimum $48\text{px}$ touch targets for **PASS**, **FAIL**, and **N/A** states with immediate visual feedback.
- **Takt Progress Meter:** Real-time completion percentage bar.
- **Simulated VIN Barcode Scanner:** Quick modal simulating laser scan for vehicle `8XF-90215`.
- **Fast Defect Containment Dock:** Tap anomaly chips (*"Butyl Path Gap (<70mm)"*, *"Harness Clip Foam Missing"*) to log immediate tickets to the Shift QA Lead.

---

### 6. 🔄 Offline-First Excel & CSV Data Pipeline (`DataSync.tsx`)
- **Drag-and-Drop Ingestion:** Supports `Water_Leak_Issues_and_Check_Points.csv` or plant review spreadsheets.
- **Automatic Column Mapping:** Validates 100% schema alignment across Slide Number, Project, Area, Root Cause 1-3, Countermeasure 1-3, and Check Points 1-3.
- **Actions:** Export authoritative CSV template, force local cache resync, or restore the verified 76 lessons anytime.

---

## 📊 Dataset & Schema Breakdown

The portal's data layer is derived from [Water_Leak_Issues_and_Check_Points.csv](file:///c:/Users/devas/projects/root/Water_Leak_Issues_and_Check_Points.csv):

| Column Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `Slide No.` | Integer | Slide number from LLR presentation | `14` |
| `Doc Reference` | String | Quality document tracking code | `RNTBCI/2021/HBC/VQE/KH/WL/14` |
| `Project` | String | Vehicle program code | `HBC`, `PY1B`, `RBC`, `XBA`, `PB1D`, `HHA`, `I2` |
| `Prepared By` | String | Authoring reliability engineer | `Damodharan (VQE)`, `Sree Vishnu (VQE)` |
| `Area / Zone` | String | 1 of 17 vehicle assembly zones | `Door sealing screen`, `Floor / Underbody` |
| `Concern` | String | Water leak symptom / issue | `FR seat mounting area water leak (floor)` |
| `Root Cause 1-3` | Array | Failure mechanisms | `Butyl bead path necking down <35mm from hole` |
| `Countermeasure 1-3`| Array | Validated engineering countermeasures | `Re-route butyl adhesive bead ≥ 70mm from hole` |
| `Check Points 1-3` | Array | Mandatory shopfloor audit items | `Verify minimum 70mm clearance to service hole` |
| `Risk` | String | Ingress severity level | `High Risk` / `Normal` |

### 17 Vehicle Inspection Zones
1. Air drafter / Vent
2. Back door
3. Body welt / Weatherstrip
4. Bumper
5. Cowl / HVAC
6. Door sealing screen
7. Door trim / Clips
8. Fasteners
9. Floor / Underbody
10. Glass runner
11. Grommets / Plugs
12. Lamps
13. Mirror
14. Roof
15. Speaker
16. Unused holes
17. Wiper / Washer

### 7 Vehicle Programs Supported
- **PY1B:** Kiger
- **HBC:** Magnite / Kiger
- **RBC:** Triber
- **XBA:** Kwid
- **PB1D:** Duster
- **HHA:** Captur
- **I2:** Future Concept Platform

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18+ (tested on Node.js v24.19.0)
- **Package Manager:** npm (v11.17.0)

### 1. Installation
```powershell
# Clone or navigate to the repository
cd c:\Users\devas\projects\root

# Install dependencies
npm install
```

### 2. Start Next.js Development Server (Hot-Reloading)
```powershell
npm run dev
```
Open **`http://localhost:3000`** in any web browser.

### 3. Production Build & Execution
```powershell
# Compile optimized Next.js 14 production bundle
npm run build

# Start production server
npm run start
```

### 4. Standalone Fallback Server
```powershell
# Runs zero-dependency Node static server for offline environments
npm run serve:vanilla
```

---

## 🧪 Automated Testing & Quality Verification

The test suite validates data consistency, schema conformity, search accuracy, and component integrity.

```powershell
npm test
```

### Verified Test Output
```
🧪 Starting LeakGuard LLR Portal Test Suite...

✅ 1. CSV File verified: 76 data rows + 1 header row.
✅ 2. lessons-data.json verified: exactly 76 structured lessons.
✅ 3. Schema integrity verified across all 76 lessons.
✅ 4. All 17 vehicle inspection zones accounted for.
✅ 5. All 7 vehicle projects verified (HBC, HHA, I2, PB1D, PY1B, RBC, XBA).
✅ 6. Search and filter logic verified (Found 21 foam lessons, 1 70mm butyl lessons).
✅ 7. Frontend structure verified: FTA Agent, Work Order Modal, and all 5 Views present in index.html.
✅ 8. FTA Failure Tree Analysis Engine and Work Order dispatch system verified in app.js.

🎉 ALL 8 TEST SUITES PASSED SUCCESSFULLY!
```

---

## 👥 Roles & Workflows

| Persona | Workflow & Usage |
| :--- | :--- |
| **Techline Specialists** | Run symptom queries through the FTA diagnostic engine to debunk false leads, isolate root causes, and dispatch work orders to shopfloor bays. |
| **Vehicle Quality Engineers (VQE)** | Review historical LLR lessons before digital check reviews or physical prototype runs to eliminate repeated ingress defects. |
| **BIW & Design Engineers** | Verify that critical design tolerances (e.g. *70mm clearance to butyl bead*, *EPDM foam rings on clips*) are incorporated into CAD models. |
| **Line & Inspection Teams** | Use the Station 06 glove-friendly checklist for rapid tactile audits before vehicles enter the high-pressure water shower booth. |
| **Plant Quality Supervisors** | Monitor takt completion progress, track defect containment logs, and ingest updated Excel/CSV reviews. |

---

## 📄 License & Attribution

- **Engineering Knowledge Base:** Automotive Digital Check (LLR) Water Leak Review Lessons (76 Slides).
- **Topology & Diagnostics Inspiration:** [UptimeAI Root Cause Agent](https://uptimeai.com/) & cPACKET Systems.
- **License:** Internal Enterprise Plant Engineering License.
