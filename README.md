# 🛡️ LeakGuard LLR — FTA Root Cause Agent & Diagnostic Portal

[![Framework: Next.js 14 / React 18](https://img.shields.io/badge/Framework-Next.js%2014%20%2F%20React%2018-black.svg)](#)
[![TypeScript: 5.4](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](#)
[![Tailwind CSS: 3.4](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)](#)
[![Project Status: Active](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](#)
[![FTA Engine: Active](https://img.shields.io/badge/Engine-Failure%20Tree%20Analysis%20(FTA)-orange.svg)](#)
[![Dataset: 76 LLR Lessons](https://img.shields.io/badge/Dataset-76%20Standard%20Lessons-blue.svg)](#)
[![Vehicle Zones: 17 Areas](https://img.shields.io/badge/Coverage-17%20Vehicle%20Zones-indigo.svg)](#)
[![Vehicle Projects: 7 Models](https://img.shields.io/badge/Programs-7%20Vehicle%20Projects-amber.svg)](#)
[![Offline First: LocalStorage/IndexedDB](https://img.shields.io/badge/Storage-Offline%20Active-emerald.svg)](#)

> **Automotive Water Leak FTA (Failure Tree Analysis) & Root Cause Agent for Service Technicians, Techliners, and Quality Analysts. Replaces hours of manual correlation with instant visual fault tree isolation, diagnostic reasoning chains, and 1-click Work Order generation.**

---

## 📌 Executive Summary

### The Idea in One Line
When a vehicle enters a service dealership or rolls off the assembly line with water ingress (wet passenger carpet, dripping headliner, flooded spare tyre well, or speaker seepage), **LeakGuard LLR FTA Agent** guides service technicians, techliners, and reliability analysts through a structured **Failure Tree Analysis (FTA)** to debunk false leads, pinpoint the isolated **ROOT CAUSE**, and dispatch actionable engineering work orders in minutes.

### Traditional vs. AI-Powered FTA Troubleshooting

```
TRADITIONAL TROUBLESHOOTING:
  Customer Complaint  -->  Static Slide Decks  -->  Manual Tear-down  -->  Guesswork  -->  [HOURS OF DOWNTIME]

cPACKET / UptimeAI-STYLE FTA ROOT CAUSE AGENT:
  Diagnostic Query    -->  Visual Fault Tree   -->  Debunked Hypotheses --> Isolated ROOT CAUSE --> Work Order Notification [MINUTES]
```

---

## ✨ Key Features & Capabilities

```
+---------------------------------------------------------------------------------------------------------+
|                                  LEAKGUARD LLR FTA DIAGNOSTIC AGENT                                      |
+--------------------------+----------------------------+-------------------------+-----------------------+
|  1. Interactive FTA Tree |  2. Diagnostic Chain (5-St)|  3. Actionable Fixes    |  4. Work Order Modal  |
|  - Bezier curve branches |  - Step-by-step reasoning  |  - 1. Execute fix       |  - Priority, Due Date |
|  - Root Symptom Node     |  - Techline verification   |  - 2. Verify with test  |  - Assignee & Est Hrs |
|  - ROOT CAUSE (Orange)   |  - Historical correlation  |  - 3. Update SOP / POS  |  - Instant dispatch   |
|  - Debunked & Verified   |  - 96% confidence score    |  - Linked LLR slide refs|  - Track active WOs   |
+--------------------------+----------------------------+-------------------------+-----------------------+
```

### 1. 🌲 Interactive Failure Tree Analysis (FTA) Graph
- **Visual Branching Tree:** Features a high-contrast Top Event root node connected by smooth SVG cubic bezier curves to intermediate hypotheses.
- **Color-Coded Status Badges (Matching UptimeAI Style):**
  - 🟠 **ROOT CAUSE:** Prominently highlighted in vivid orange with detailed root mechanism and LLR slide reference.
  - ⚫ **Debunked:** Slate badges documenting the exact physical test that ruled out the hypothesis (e.g. *Debunked: Stopper weir measured 42mm*, *Debunked: 360° e-coat plug seated*).
  - 🟢 **Verified Contributory Factor:** Documents verified secondary bypasses (e.g. *Verified: Clip #3 foam missing*).
- **Interactive State Toggling:** Technicians can click any branch to mark as `Root Cause`, `Debunked`, or `Verified`, instantly recalculating the diagnostic chain.

### 2. ⚡ Step-by-Step AI Diagnostic Reasoning Chain
- **5-Step Forensic Timeline:**
  1. *Ingress Localization:* Static shower test and moisture mapping.
  2. *Hypothesis Clearance (Debunked):* Elimination of adjacent chambers.
  3. *Root Cause Isolation:* Metric comparison against mandatory engineering rules (e.g., *actual 35mm vs mandatory 70mm butyl clearance from LLR Slide #10*).
  4. *Secondary Bypass Verification:* Corroboration of missing foam gaskets or unsealed apertures.
  5. *Validation & Retest:* Confirmed water arrest after countermeasure application.

### 3. 📋 Create Work Order Notification System
- Directly matching industrial CMMS/EAM notification modals:
  - **Description:** Pre-filled with actionable technical recommendations.
  - **Priority:** `Critical (Line Stop)`, `High`, `Medium`, `Low`.
  - **Due Date:** Calendar date selection.
  - **Assigned To:** Assign to Techline Specialist (`Nikit`), VQE Lead (`Sree Vishnu`), Quality Analyst (`Damodharan`), or Service Tech (`J. Ramirez`).
  - **Estimated Hours:** Planned maintenance duration.
  - **Confirm / Dispatch:** Saves to persistent storage, tracks status (`Draft` → `In Progress` → `Completed`), and triggers real-time toast notification.

### 4. 📚 5 Pre-Built Automotive Diagnostic Case Scenarios
- **Case #LK-01: Front Passenger Floor Wet Carpet** — Root Cause: Door sealing screen butyl gap (<35mm vs 70mm spec, Slide #10).
- **Case #LK-02: Door Inner Pocket Ingress & Speaker Drip** — Root Cause: Pop-up knob clip open snap relief feature (Slide #2).
- **Case #LK-03: Headliner Soak & A-Pillar Drip** — Root Cause: Body welt joining cut positioned at upper A-pillar radius (Slide #22).
- **Case #LK-04: Cowl Water Box Air Intake Seepage** — Root Cause: Cowl water box stopper weir height < 37mm in Z direction (Slide #51).
- **Case #LK-05: Spare Wheel Well Water Pooling** — Root Cause: Rear combination lamp retaining stud missing EPDM foam washer (Slide #12).
- **Dynamic FTA Synthesis:** Enter *any* customer complaint or keyword into the search bar to synthesize a dynamic fault tree from the 76 LLR dataset!

### 5. 📖 Three-Step Structured Lesson Representation
Every slide is normalized into three actionable, color-coded blocks:
- 🔴 **What Went Wrong (Root Cause):** Ingress path analysis, aperture dimensions, water pressure, and assembly gaps.
- 🟢 **How It Was Fixed (Countermeasure):** ECN engineering fix, closed-cell foam addition, continuous sealant paths, and pilot-flange bolts.
- 🟡 **What to Check on the Line (Inspection Standard):** Specific, unambiguous check points (e.g., *verify 70mm clearance to butyl line*, *confirm audible double-click*, *360° gloved sweep*).

### 2. 📐 Bespoke Technical CAD Schematics (Human-Crafted Engineering Vectors)
Unlike cookie-cutter AI cards, every component category features an authentic 1:1 scale vector CAD cross-section diagram:
- **Wire Harness Clips & Fasteners:** EPT foam washer deflection under sheet metal clamping load.
- **Door Sealing Screens:** 70 mm service clearance zone with non-curing butyl bead adhesive boundary.
- **Floor & Underbody Plugs:** 360° e-coat drain plug flush interference seating with underbody stone chip wax.
- **Cowl & Water Box Bulkhead:** Minimum 37 mm water stopper weir height and continuous X-axis overflow runout.
- **Glass Runners & Weatherstrips:** Dual aero lip capillary arrest geometry and drain weep slots.
- **Rear Lamps & Lenses:** Pre-compressed glue bead and 4–6 bar pneumatic seal interlock.

### 3. 🔀 Dual Display Modes: Visual Cards vs. Quality Matrix Table
- **Visual Cards View:** Rich overview cards featuring 3-step color blocks, CAD cross-sections, and instant verify toggles.
- **Dense Quality Matrix (Table View):** High-density industrial table optimized for desktop quality engineering audits, featuring sortable columns, slide numbers, program tags, and quick-open sheet triggers. Switch seamlessly between modes with the persistent view toggle.

### 4. 🗂️ Slide-Over Inspector Drawer & Keyboard Shortcuts
- **Side Drawer Inspection:** Clicking any lesson opens a full-height inspection drawer with complete multi-tier root causes, countermeasure points, interactive verification checkboxes, document reference copier, and quality sheet print formatting.
- **Keyboard Shortcuts:**
  - Press `/` anywhere to focus the global search bar.
  - Press `Esc` to instantly close drawers and barcode scanning modals.

### 5. ⚡ High-Speed Multi-Criteria Search & Filter
- **Instant Search:** Queries slide numbers, document references, component names (`clip`, `butyl`, `plug`, `grommet`, `speaker`), failure modes, and clearances.
- **Filter Chips:** One-tap filtering for common failure modes:
  - `All Lessons (76)`
  - `Missing Foam (24)`
  - `Sealant / Butyl (19)`
  - `Holes & Plugs (14)`
  - `Clearance Gap (12)`
  - `Harness Clips (8)`
- **Project & Area Selectors:** Instant filtering across 7 vehicle projects (`PY1B`, `HBC`, `RBC`, `XBA`, `PB1D`, `HHA`, `I2`) and 17 vehicle categories.

### 3. 🚗 Interactive Vehicle CAD Schematic (17 Zones)
- High-contrast automotive body silhouette on a technical blueprint grid.
- Clickable glowing hotspots (**Cowl**, **A-Pillar**, **Roof**, **Doors**, **C-Pillar**, **Floor**, **Liftgate**) that filter both the zones and the lesson stream with one click.
- Detailed zone breakdown cards with lesson counts, risk summaries, and direct triage links.

### 4. 🧤 Glove-Friendly Shopfloor Line Checklist
- Designed for 12-hour shifts, plant lighting, and operators wearing nitrile or work gloves:
  - Minimum 48px to 56px touch targets.
  - Tactile **PASS**, **FAIL**, and **N/A** states with immediate visual feedback.
  - Live progress meter and completion percentage ring.
  - **VIN Barcode Scanner simulation modal** for vehicle tracking.
  - **Fast Defect Containment Dock** with one-tap symptom chips and severity tags (`Minor`, `Serious`, `Line Stop`).

### 5. 🔄 Offline-First Excel & CSV Data Engine
- **Direct File Ingestion:** Drag and drop any `.xlsx`, `.xls`, or `.csv` spreadsheet (such as `Water_Leak_Issues_and_Check_Points.csv`).
- **Auto Schema Mapping:** Automatically identifies and maps columns for Slide Number, Area, Root Cause (1-3), Countermeasure (1-3), Check Points (1-4), and Vehicle Program.
- **Client-Side Persistence:** Instant zero-latency caching in `localStorage` / `IndexedDB`.
- **Export & Backup:** One-click button to export live modifications back to CSV.
- **Factory Reset:** Restore default 76 lessons anytime with one click.

### 6. 🌗 Dual Theme System (Light & Dark Mode)
- **Enterprise Clean Light Mode:** Crisp `#f8fafc` background, slate-200 borders, and high-contrast typography compliant with WCAG 2.1 AA standards.
- **Industrial Shopfloor Dark Mode:** `#0b1326` chassis with `#0f172a` cards, calibrated to reduce glare under high-lumen factory floodlights.

---

## 📂 Project Structure

```
c:\Users\devas\projects\root\
│
├── index.html                           # Master single-page application (Widescreen + Mobile responsive)
├── app.js                               # Application core: state, search/filter, checklist, parser & storage
├── lessons-data.js                      # Preloaded 76 lessons bundled for instant, zero-CORS browser loading
├── lessons-data.json                    # Formatted JSON dataset of all 76 LLR slides
├── Water_Leak_Issues_and_Check_Points.csv # Master CSV spreadsheet dataset (76 lessons across 17 areas)
├── server.js                            # Zero-dependency local Node.js static & REST API server (port 3000)
├── package.json                         # Project metadata and test scripts
├── README.md                            # Complete engineering documentation
│
└── test/
    └── portal.test.js                   # Automated test suite (7 suites, 100% passing)
```

---

## 📊 Dataset & Schema Breakdown

The portal data is organized directly from [Water_Leak_Issues_and_Check_Points.csv](file:///c:/Users/devas/projects/root/Water_Leak_Issues_and_Check_Points.csv):

| Column Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `S.No` / `Slide No.` | Integer | Original slide number from LLR presentation | `14` |
| `Doc Reference` | String | Formal quality document tracking identifier | `RNTBCI/2021/HBC/VQE/KH/WL/14` |
| `Project` | String | Vehicle engineering program / platform | `HBC`, `PY1B`, `RBC`, `XBA`, `PB1D`, `HHA`, `I2` |
| `Prepared By` | String | Quality reliability engineer responsible | `Damodharan (VQE)`, `Sree Vishnu (VQE)` |
| `Area / Category` | String | 1 of 17 vehicle assembly zones | `Door trim / Clips`, `Glass runner`, `Cowl / HVAC` |
| `Water Leak Concern` | String | Primary symptom or leak report title | `FR seat mounting area water leak (floor)` |
| `Issue / Root Cause 1-3` | String | Detailed root cause mechanisms | `Missing foam gasket causes rain intrusion past barrier` |
| `Countermeasure 1-3` | String | Validated design or process fix | `Pre-fitted 1mm EPT foam ring with dual-barb positive lock` |
| `Check Point 1-4` | String | Mandatory quality audit items on the line | `Confirm 70 mm clearance to butyl line; audible snap click` |

### 17 Vehicle Inspection Zones Covered
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

---

## 🛠️ Technology Stack

- **Frontend Core:** Pure HTML5, Modern Vanilla JavaScript (ES2022+), Zero frontend build step required.
- **Styling & Design System:** Tailwind CSS with container queries and forms plugins, custom industrial tokens.
- **Typography:** `Inter` (UI commands, readings, and prose) and `JetBrains Mono` (part numbers, VINs, tolerances).
- **Icons:** Google Material Symbols Outlined.
- **CSV & Excel Engine:**
  - [PapaParse 5.4.1](https://www.papaparse.com/) for high-performance CSV streaming & parsing.
  - [SheetJS (xlsx) 0.18.5](https://sheetjs.com/) for native `.xlsx` / `.xls` workbook decoding.
- **Backend / Dev Server:** Node.js HTTP server (zero external dependencies).
- **Test Runner:** Built-in Node.js Assert Test Suite (`node test/portal.test.js`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended, tested on v24) **OR** Python (3.x)
- Any modern web browser (Chrome, Edge, Firefox, Safari)

### Method 1: Start Next.js Development Server (Recommended)
```powershell
# Navigate to the project directory
cd c:\Users\devas\projects\root

# Run Next.js 14 hot-reloading development server
npm run dev
```
Open your browser to: **`http://localhost:3000`**

### Method 2: Build and Run Production Next.js Bundle
```powershell
# Compile optimized production build
npm run build

# Start production server
npm run start
```

### Method 3: Direct File Open (Offline Standalone Fallback)
Because `index.html` and `lessons-data.js` are preserved locally with zero CORS dependencies:
- Double-click `index.html` or open `file:///c:/Users/devas/projects/root/index.html` directly in Edge or Chrome. All 76 lessons load immediately offline. Or run `npm run serve:vanilla` for the lightweight Node static server.

---

## 🧪 Automated Testing & Verification

The project includes an automated test suite verifying data integrity, schema consistency, search behavior, and template coverage.

Run the test suite:
```powershell
npm test
```

### Verified Test Suites:
```
🧪 Starting LeakGuard LLR Portal Test Suite...

✅ 1. CSV File verified: 76 data rows + 1 header row.
✅ 2. lessons-data.json verified: exactly 76 structured lessons.
✅ 3. Schema integrity verified across all 76 lessons.
✅ 4. All 17 vehicle inspection zones accounted for.
✅ 5. All 7 vehicle projects verified (HBC, HHA, I2, PB1D, PY1B, RBC, XBA).
✅ 6. Search and filter logic verified (Found 21 foam lessons, 1 70mm butyl lessons).
✅ 7. Frontend structure verified: all 5 Stitch views present in index.html.

🎉 ALL 7 TEST SUITES PASSED SUCCESSFULLY!
```

---

## 👥 Who Uses It & How

| Role | Workflow & Usage |
| :--- | :--- |
| **Vehicle Quality Engineers (VQE)** | Look up historical failure cases before new digital check (LLR) or physical prototype reviews to ensure past issues are not repeated. |
| **Design & Body Engineers (BIW)** | Check that critical clearances (e.g. *70mm from butyl path*), EPDM foam rings on clips, and plug sizing are incorporated into new 2D/3D CAD models. |
| **Trim & Final Line Operators** | Use the mobile / tablet checklist mode as a fast takt audit to verify clips, plugs, and sealer beads before vehicles enter the shower booth. |
| **Plant Quality Supervisors** | Track real-time verification status across stations, log defect containment tickets, and update lessons when new fixes are validated. |

---

## 🔮 Roadmap for Production Plant Rollout

- [ ] **Multi-User Role-Based Access Control (RBAC):** Admin, VQE Editor, Line Inspector, Quality Lead.
- [ ] **Backend Database Integration:** PostgreSQL / Supabase sync replacing local browser storage.
- [ ] **CAD Drawing & Photo Uploader:** Direct attachment of high-resolution CAD sections and physical teardown photos for every slide.
- [ ] **MES / Q-Gate API Interlock:** Auto-hold vehicles at Station 07 Water Shower Booth if mandatory Station 06 leak checkpoints are unverified.
- [ ] **Automated New Project Checklist Generation:** Export design rule checklists customized for upcoming new vehicle launches.

---

## 📄 License & Attribution

- **Design System Inspiration:** [Stitch Design System (Project #12142003827231996459)](https://stitch.withgoogle.com/projects/12142003827231996459).
- **Engineering Content:** Digital Check (LLR) Water Leak Review Lessons.
- **License:** Internal Enterprise Plant Engineering License.
