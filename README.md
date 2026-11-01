# 🛡️ LeakGuard LLR — Water Leak Knowledge & Line Inspection Portal

[![Project Status: Active](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](#)
[![Dataset: 76 LLR Lessons](https://img.shields.io/badge/Dataset-76%20Standard%20Lessons-blue.svg)](#)
[![Vehicle Zones: 17 Areas](https://img.shields.io/badge/Coverage-17%20Vehicle%20Zones-indigo.svg)](#)
[![Vehicle Projects: 7 Models](https://img.shields.io/badge/Programs-7%20Vehicle%20Projects-amber.svg)](#)
[![Offline First: LocalStorage/IndexedDB](https://img.shields.io/badge/Storage-Offline%20Active-emerald.svg)](#)
[![Design System: Stitch Pro](https://img.shields.io/badge/UI%2FUX-Stitch%20Industrial%20Pro-0284c7.svg)](https://stitch.withgoogle.com/projects/12142003827231996459)

> **Turning 76 slides of plant water-leak lessons into an instant-search portal, interactive vehicle schematic, and touch-friendly shopfloor verification system.**

---

## 📌 Executive Summary

### The Idea in One Line
Plant and vehicle engineering design teams hold years of water-leak lessons learned (LLR) in a 76-slide digital check review. **LeakGuard LLR** turns that static slide deck into a searchable, interactive portal so anyone can find a leak issue, understand why it happened, see how it was engineered out, and execute verified check points on the line.

### The Problem It Solves
Engineering knowledge was previously trapped in static slide decks and scattered spreadsheets:
- **Slide decks cannot be queried quickly** during CAD reviews or filtered by specific vehicle zone.
- **They cannot be used as an interactive line checklist** during manufacturing takt times.
- **Identical issues repeat across vehicle programs** (e.g., missing foam on wire harness clips, unsealed e-coat drain holes, incorrect butyl path offsets <70mm). Teams repeat past mistakes because they cannot access historical lessons quickly.

---

## ✨ Key Features & Capabilities

```
+--------------------------------------------------------------------------------------------------+
|                                    LEAKGUARD LLR PORTAL                                          |
+---------------------+-----------------------+------------------------+---------------------------+
|  1. Lessons Hub     |  2. 17 Vehicle Zones  |  3. Line Checklist     |  4. Excel / CSV Sync      |
|  - Real-time search |  - Interactive CAD    |  - Glove-tap buttons   |  - Drag & drop .xlsx/.csv |
|  - Multi-tag filter |    blueprint hot-spots|  - Live Pass/Fail Takt |  - Auto column mapping    |
|  - 3-step cards     |  - 17 Zone cards      |  - VIN barcode scanner |  - Instant CSV export     |
|  - Quick Verify (OK)|  - Instant deep-links |  - Defect logger dock  |  - Reset to 76 defaults   |
+---------------------+-----------------------+------------------------+---------------------------+
```

### 1. 📖 Three-Step Structured Lesson Representation
Every slide is normalized into three actionable, color-coded blocks:
- 🔴 **What Went Wrong (Root Cause):** Ingress path analysis, aperture dimensions, water pressure, and assembly gaps.
- 🟢 **How It Was Fixed (Countermeasure):** ECN engineering fix, closed-cell foam addition, continuous sealant paths, and pilot-flange bolts.
- 🟡 **What to Check on the Line (Inspection Standard):** Specific, unambiguous check points (e.g., *verify 70mm clearance to butyl line*, *confirm audible double-click*, *360° gloved sweep*).

### 2. ⚡ High-Speed Multi-Criteria Search & Filter
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

### Method 1: Start with Node.js Server (Recommended)
```powershell
# Navigate to the project directory
cd c:\Users\devas\projects\root

# Start the local server
npm start
```
Open your browser to: **`http://localhost:3000`**

### Method 2: Start with Python HTTP Server
```powershell
python -m http.server 3000
```
Open your browser to: **`http://localhost:3000`**

### Method 3: Direct File Open (Offline Standalone)
Because `lessons-data.js` is bundled locally with no CORS dependencies:
- Simply double-click `index.html` or open `file:///c:/Users/devas/projects/root/index.html` directly in Edge or Chrome. All 76 lessons load immediately.

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
