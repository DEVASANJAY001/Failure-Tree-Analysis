window.DEFAULT_LESSONS_DATA = [
  {
    "sno": 1,
    "slideNo": 1,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/01",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Lamps",
    "concern": "Head lamp water leak",
    "rootCauses": [
      "Glue application stops intermittently when air pressure drops below 3 bar (air pressure & robot interlink not available)."
    ],
    "countermeasures": [
      "Robot interlink on air pressure and robot speed parameter control through control plan."
    ],
    "checkPoints": [
      "Confirm glue thickness min 1.5 mm (point captured in PQE control plan).",
      "Control plan check: Robo interlink (air pressure 4 to 6 bar) & Robo speed parameter adjustment (curing time for each tray 80 to 120 sec) control confirmation."
    ],
    "risk": "Normal"
  },
  {
    "sno": 2,
    "slideNo": 2,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/02",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Door trim / Clips",
    "concern": "Rear door pop-up knob clip water leak",
    "rootCauses": [
      "Water entry restriction structure not available in pop-up knob clip.",
      "Water enters through the relief provided for the snap feature."
    ],
    "countermeasures": [
      "Clip changed to closed condition (material added / wall) to avoid water entry."
    ],
    "checkPoints": [
      "Clip should not be opened on water flow path.",
      "Ensure wall to avoid the water flow."
    ],
    "risk": "Normal"
  },
  {
    "sno": 3,
    "slideNo": 3,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/03",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Door sealing screen",
    "concern": "Sealing screen water leak",
    "rootCauses": [
      "Sealing screen comes off due to harness clip interference with sealing screen (clip to butyl distance was 28.5 mm)."
    ],
    "countermeasures": [
      "Clip position shifted 70 mm away from the butyl line."
    ],
    "checkPoints": [
      "Harness clip to butyl line distance must be 70 mm.",
      "Koren Theme std revised from 30 to 70 min based on LLR from PY1B."
    ],
    "risk": "Normal"
  },
  {
    "sno": 4,
    "slideNo": 4,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/04",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Body welt / Weatherstrip",
    "concern": "Back door body welt water leak",
    "rootCauses": [
      "Water entry through air vent hole.",
      "Back door hem to body welt distance very low (K2 - 103.5 mm, PB1D - 141.2 mm, PY1B - 65.2 mm)."
    ],
    "countermeasures": [
      "Body welt air vent hole shifted towards inner side to avoid water entry."
    ],
    "checkPoints": [
      "Ensure distance between back door hemming and body welt is min 100 mm as per NDS Std."
    ],
    "risk": "Normal"
  },
  {
    "sno": 5,
    "slideNo": 5,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/05",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Glass runner",
    "concern": "Water leakage between FR & RR door glass runner to glass",
    "rootCauses": [
      "Glass not going full up due to flock material.",
      "Glass runner mounting panel deformation.",
      "Less retention force (spec >150 N, actual 120 N @ T=1.8 mm)."
    ],
    "countermeasures": [
      "Flock material removed on glass runner lip (aero lip) to avoid water obscuration and entry."
    ],
    "checkPoints": [
      "Ensure no gap between glass and glass runner at glass fully closed condition (2D drawing confirmation).",
      "Ensure no flock material on Aero lip.",
      "Door inner to outer panel should be maintained within spec. Establish control point in POS & update PQAC."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 6,
    "slideNo": 6,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/06",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Body welt / Weatherstrip",
    "concern": "Both side rear door body welt to door inner panel C pillar corner area water leak",
    "rootCauses": [
      "Door body welt overlap with rear door sash tape.",
      "Body welt overlap with surrounding parts: spec 6 +/-2.4 mm, actual 0 mm."
    ],
    "countermeasures": [
      "Outer profile revised (18.6 mm removed from top edge) to give required overlap."
    ],
    "checkPoints": [
      "Body welt should not overlap with surrounding parts.",
      "Testing criteria: 6 +/-2.4 mm."
    ],
    "risk": "Normal"
  },
  {
    "sno": 7,
    "slideNo": 7,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/07",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Glass runner",
    "concern": "Water leakage between both side RR door glass runner to door inner panel near C pillar lower area",
    "rootCauses": [
      "BIW - paint sealer not available in drawing at panel joining area.",
      "Trim - gap between sash cover and runner; no water restriction material to arrest water entry."
    ],
    "countermeasures": [
      "Paint sealant added at panel joint.",
      "EPT foam added on sash trim / glass runner corner."
    ],
    "checkPoints": [
      "Ensure paint sealant availability on all panel joining areas.",
      "Ensure water resistance foam availability on trim parts & glass runner corner areas in direct water flow area (design recommendation)."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 8,
    "slideNo": 8,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/08",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Door trim / Clips",
    "concern": "FR & RR door harness & trim pad clip to door inner panel water leak",
    "rootCauses": [
      "Water entry restriction foam not available in clips."
    ],
    "countermeasures": [
      "New clip with washer (P/N 15-53 10701).",
      "1 mm EPT foam added (0.5 mm compression ratio)."
    ],
    "checkPoints": [
      "Ensure water entry restriction material availability on all trim parts & harness clips B-surface area."
    ],
    "risk": "Normal"
  },
  {
    "sno": 9,
    "slideNo": 9,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/09",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Body welt / Weatherstrip",
    "concern": "FR door body welt to door inner panel water leak",
    "rootCauses": [
      "Door body welt overlaps with outer door handle hole dummy sticker (seal line over sticker).",
      "Dummy sticker hole dia 25 mm (before condition)."
    ],
    "countermeasures": [
      "Dummy sticker hole changed to oblong 25 x 20 mm so seal line does not overlap."
    ],
    "checkPoints": [
      "Body welt should not overlap with surrounding parts."
    ],
    "risk": "Normal"
  },
  {
    "sno": 10,
    "slideNo": 10,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/10",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Door sealing screen",
    "concern": "Water stagnation between both side rear door sealing screen to door inner panel",
    "rootCauses": [
      "Water drain hole not as per design intent.",
      "Drain hole should be max 1 mm from butyl application path; PY1B actual 5 mm."
    ],
    "countermeasures": [
      "Slot changed to hole of dia 15 mm and moved towards -Z direction by 4 mm."
    ],
    "checkPoints": [
      "Door water drain hole & butyl application path distance should be max 1 mm (as per NDS)."
    ],
    "risk": "Normal"
  },
  {
    "sno": 11,
    "slideNo": 11,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/11",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Door sealing screen",
    "concern": "Water stagnation between FR & RR door W/strip LWR and side sill",
    "rootCauses": [
      "More water entered between front and rear door sash gap because water entry restriction structure was not available."
    ],
    "countermeasures": [
      "Dust seal added to reduce water entry in B pillar area through Y direction (example: PY1B)."
    ],
    "checkPoints": [
      "Ensure water entry restriction structure between front and rear doors (e.g., B pillar dust seal)."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 12,
    "slideNo": 12,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/12",
    "project": "PY1B",
    "preparedBy": "Damodharan (VQE)",
    "area": "Mirror",
    "concern": "Water leakage between both front door mirror locator and door inner panel",
    "rootCauses": [
      "Mirror base gasket shrinkage due to more gap (1.5 mm) between mirror base and door sash runner."
    ],
    "countermeasures": [
      "Clip & rib added to make interference condition and avoid water entry."
    ],
    "checkPoints": [
      "Mirror base and glass runner gap should be maintained at interference fit condition.",
      "Ensure mirror base interference with glass runner."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 13,
    "slideNo": 13,
    "docRef": "RNTBCI/2021/PY1B/VQE/KH/WL/13",
    "project": "PY1B",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Glass runner",
    "concern": "Water leakage between FR & RR door glass runner to glass (jet test)",
    "rootCauses": [
      "Flock material in aero lip retained water; seepage observed during jet test.",
      "Less retention force (spec >150 N, actual 120 N @ T=1.8 mm)."
    ],
    "countermeasures": [
      "Flock material removed on glass runner lip to avoid water obscuration and entry."
    ],
    "checkPoints": [
      "Ensure no gap between glass and glass runner at glass fully closed condition (2D drawing confirmation).",
      "Ensure no flock material on Aero lip."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 14,
    "slideNo": 14,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/14",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "FR seat mounting area water leak (floor)",
    "rootCauses": [
      "No water tightness between dash side and floor joint area - water enters through 6 outrigger holes and travels between floor panel and dash panel into cabin.",
      "Sealer application missed on seat mounting area due to access difficulty."
    ],
    "countermeasures": [
      "BIW sealer (permanent sealer, extrusion) applied between side wall and floor panel to avoid water entry into cabin."
    ],
    "checkPoints": [
      "Ensure sealant application in all panel joining areas."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 15,
    "slideNo": 15,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/15",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Wiper / Washer",
    "concern": "Rear wiper grommet to wiper hose water leak",
    "rootCauses": [
      "Water entered between wiper hose and wiper grommet: gap between grommet and hose.",
      "No control on wiper hose orientation (routing) between two grommets.",
      "Washer hose routing different from RBC due to packaging constraints."
    ],
    "countermeasures": [
      "Wiper washer hose position tilted.",
      "Hose length reduced 140+/-10 to 110+/-10 mm.",
      "Grommet hose insertion overlap increased from 2 to 5 mm."
    ],
    "checkPoints": [
      "Ensure washer hose orientation tangential & grommet overlap (HBC reference 5 mm)."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 16,
    "slideNo": 16,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/16",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Wiper / Washer",
    "concern": "Rear wiper grommet to BIW water leak",
    "rootCauses": [
      "0.3 mm gap between grommet and roof panel.",
      "Grommet has no Z interface with BIW (only X & Y control).",
      "Very little hand space to assemble (back door edge to grommet edge 0 mm vs RBC 10 mm); >50% leaking grommets were not fitted well."
    ],
    "countermeasures": [
      "0.65 mm material added to grommet to give 0.35 mm interference with BIW."
    ],
    "checkPoints": [
      "Ensure grommet interference condition with BIW panel without gap.",
      "Ensure Koran Theme OK (back door edge to grommet edge 10 mm clearance in X direction)."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 17,
    "slideNo": 17,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/17",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door sealing screen",
    "concern": "All door sealing screen water leak (screen peeling)",
    "rootCauses": [
      "Sealing screen peels because screen is flat and does not follow door profile.",
      "Butyl application surface not even."
    ],
    "countermeasures": [
      "Screen thickness 100 to 200 micron.",
      "Screen formed to follow door profile.",
      "Butyl thickness 4 to 6 mm."
    ],
    "checkPoints": [
      "Ensure butyl application surface is flat and even throughout (without many bends).",
      "Ensure sealing screen follows door profile."
    ],
    "risk": "Normal"
  },
  {
    "sno": 18,
    "slideNo": 18,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/18",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door sealing screen",
    "concern": "All door sealing screen water leak (3M tape near pop-up knob)",
    "rootCauses": [
      "3M tape adhesive not enough; it easily comes off near pop-up knob area, leading to water leak."
    ],
    "countermeasures": [
      "Butyl added instead of 3M tape for proper sealing."
    ],
    "checkPoints": [
      "Ensure groove for butyl application till top without any intervals.",
      "Ensure sealing screen covers entire water exposure region."
    ],
    "risk": "Normal"
  },
  {
    "sno": 19,
    "slideNo": 19,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/19",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Glass runner",
    "concern": "'C' pillar trim water leak",
    "rootCauses": [
      "Door metal sash sealer not throughout.",
      "Door sash cover to runner has more gap.",
      "Rat hole between metal sash and runner."
    ],
    "countermeasures": [
      "Sealer added till top of metal sash.",
      "Sash length increased 20 mm.",
      "Foam added to avoid water entry."
    ],
    "checkPoints": [
      "Ensure sealer application throughout the sash (joining).",
      "Ensure glass runner to section molding at interference condition without gap.",
      "Ensure glass runner interference with BIW panel without any gap."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 20,
    "slideNo": 20,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/20",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Roof",
    "concern": "Roof rail water leak",
    "rootCauses": [
      "3 mm foam pad not compressed in locator area because roof rail metal insert is not in contact with roof rail (0.5 mm gap).",
      "Roof rail rib absent at roof rail locking area."
    ],
    "countermeasures": [
      "Foam thickness increased 3 to 4 mm.",
      "DSA tape added for proper bonding & interference with panel."
    ],
    "checkPoints": [
      "Ensure roof rail metal insert proper contact with roof rail without gap to transfer load to tape/foam.",
      "Ensure roller application for bonding process."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 21,
    "slideNo": 21,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/21",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Fasteners",
    "concern": "Spoiler all bolt water leak (only at negative pressure test)",
    "rootCauses": [
      "Spoiler bolt head has serration on flange surface, leading to water entry during negative pressure test."
    ],
    "countermeasures": [
      "Bolt changed to pilot type bolt without serration on bolt head flange."
    ],
    "checkPoints": [
      "Ensure flat flange + pilot type bolts are used."
    ],
    "risk": "Normal"
  },
  {
    "sno": 22,
    "slideNo": 22,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/22",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Body welt / Weatherstrip",
    "concern": "All door body welt leak (due to position change)",
    "rootCauses": [
      "Body welt joining position was on side wall surface on water path (A & B pillar zone), leading to water entry into cabin."
    ],
    "countermeasures": [
      "Body welt joining position shifted to bottom side (sill side)."
    ],
    "checkPoints": [
      "Ensure there is a single mould without any joining (or).",
      "Ensure body welt joining is at bottom side (sill side)."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 23,
    "slideNo": 23,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/23",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door trim / Clips",
    "concern": "FR LH trim pad water leak (outside mirror snap)",
    "rootCauses": [
      "Water entry restriction foam not available in clips."
    ],
    "countermeasures": [
      "Water prevention foam added on harness clip."
    ],
    "checkPoints": [
      "Ensure water restriction foam on harness clip."
    ],
    "risk": "Normal"
  },
  {
    "sno": 24,
    "slideNo": 24,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/24",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Unused holes",
    "concern": "All door trim pad water leak (E1 variant) - dummy sticker missing",
    "rootCauses": [
      "For E1 variant, dummy sticker not provided where harness comes in other variants (front door latch harness clip 1 no., rear door 4 nos.)."
    ],
    "countermeasures": [
      "Dummy stickers required for E1 variant: FR RH/LH door 1 no. each.",
      "RR RH/LH door 4 nos. each."
    ],
    "checkPoints": [
      "Ensure dummy sticker or plug available for unused holes for all variants."
    ],
    "risk": "Normal"
  },
  {
    "sno": 25,
    "slideNo": 25,
    "docRef": "RNTBCI/2021/HBC/VQE/KH/WL/25",
    "project": "HBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door sealing screen",
    "concern": "FR RH door trim pad water leak (harness)",
    "rootCauses": [
      "RH speaker harness shorter than LH (RH 350 mm vs LH 385 mm) - drawing wrongly updated vs CAD.",
      "Short harness pulls & stretches sealing screen."
    ],
    "countermeasures": [
      "RH side harness length corrected to same as LH, as per CAD."
    ],
    "checkPoints": [
      "Ensure both side harness at same length.",
      "Ensure harness CAD & 2D drawing have the same dimension."
    ],
    "risk": "Normal"
  },
  {
    "sno": 26,
    "slideNo": 27,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/27",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Cowl / HVAC",
    "concern": "Water leak in HVAC air intake area due to high pressure jet direct hit",
    "rootCauses": [
      "No sealing prevention.",
      "Design requirement: cowl grid hole 100 mm away from HVAC inlet; actual 50 mm."
    ],
    "countermeasures": [
      "Cowl grid hole location changed to 100 mm away from HVAC inlet."
    ],
    "checkPoints": [
      "Ensure cowl grid hole location 100 mm away from HVAC inlet as per BMIR Std."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 27,
    "slideNo": 28,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/28",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Unused holes",
    "concern": "Water leakage between back door inner panel to door trim",
    "rootCauses": [
      "Unused hole in back door inner panel."
    ],
    "countermeasures": [
      "Plug introduced to avoid water leak."
    ],
    "checkPoints": [
      "Ensure plug or sticker availability for unused holes."
    ],
    "risk": "Normal"
  },
  {
    "sno": 28,
    "slideNo": 29,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/29",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Back door",
    "concern": "Water leakage between back door finisher to camera assembly",
    "rootCauses": [
      "Poor sealing between back door finisher and camera assembly - no sealing prevention."
    ],
    "countermeasures": [
      "Water prevention foam added between camera bracket and embellisher.",
      "Water prevention foam added between camera and camera bracket."
    ],
    "checkPoints": [
      "Ensure water prevention foam between camera bracket and embellisher.",
      "Ensure water prevention foam between camera and camera bracket."
    ],
    "risk": "Normal"
  },
  {
    "sno": 29,
    "slideNo": 30,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/30",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Back door",
    "concern": "Water leakage between back door finisher to door OTR panel",
    "rootCauses": [
      "Poor sealing application between back door finisher and door OTR panel (gap between back door and finisher)."
    ],
    "countermeasures": [
      "Water prevention foam added between back door embellisher and back door panel."
    ],
    "checkPoints": [
      "Ensure water prevention foam around embellisher with interference condition to avoid water leak."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 30,
    "slideNo": 31,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/31",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Back door",
    "concern": "Water leakage between back door inner panel to door trim (OTR/INR joint)",
    "rootCauses": [
      "No paint sealant application in OTR and INR panel joint."
    ],
    "countermeasures": [
      "Body sealant applied between inner & outer panel."
    ],
    "checkPoints": [
      "Ensure body sealer availability between inner and outer panel."
    ],
    "risk": "Normal"
  },
  {
    "sno": 31,
    "slideNo": 32,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/32",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Lamps",
    "concern": "Water leakage between back door OTR panel to HMSL lamp",
    "rootCauses": [
      "Sealing between HMSL lamp and back door OTR panel not sufficient (gap between HMSL and back door panel)."
    ],
    "countermeasures": [
      "Double side tape applied to reduce locking reaction force of ribs."
    ],
    "checkPoints": [
      "Ensure double side tape availability.",
      "Ensure double side tape at interference condition with panel for proper bonding.",
      "Ensure foam at interference condition."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 32,
    "slideNo": 33,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/33",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Grommets / Plugs",
    "concern": "Water leakage between dash panel to dummy grommet",
    "rootCauses": [
      "Dummy grommet was non-waterproof."
    ],
    "countermeasures": [
      "Changed to water prevention grommet."
    ],
    "checkPoints": [
      "Ensure water prevention grommet availability."
    ],
    "risk": "Normal"
  },
  {
    "sno": 33,
    "slideNo": 34,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/34",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leakage between RR wheel arch to fuel pipeline mounting bolt",
    "rootCauses": [
      "No sealing prevention around the stud."
    ],
    "countermeasures": [
      "Sealant applied around the stud."
    ],
    "checkPoints": [
      "Ensure weld type bolt & ensure sealer surrounding the stud."
    ],
    "risk": "Normal"
  },
  {
    "sno": 34,
    "slideNo": 35,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/35",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leakage between RR floor area seat mounting to floor panel near inspection cover (nut)",
    "rootCauses": [
      "No sealant application around nut."
    ],
    "countermeasures": [
      "Sealant applied around the stud."
    ],
    "checkPoints": [
      "Ensure sealant application around the nut."
    ],
    "risk": "Normal"
  },
  {
    "sno": 35,
    "slideNo": 36,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/36",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leakage between RR floor area seat mounting to floor panel near inspection cover (stud bolt)",
    "rootCauses": [
      "No sealant application around stud bolt."
    ],
    "countermeasures": [
      "Sealant applied around the stud."
    ],
    "checkPoints": [
      "Ensure sealant application around the stud bolt."
    ],
    "risk": "Normal"
  },
  {
    "sno": 36,
    "slideNo": 37,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/37",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leakage between RR floor area seat mounting to floor panel (nut)",
    "rootCauses": [
      "No sealant application around nut."
    ],
    "countermeasures": [
      "Sealant applied around the stud."
    ],
    "checkPoints": [
      "Ensure sealant application around the stud."
    ],
    "risk": "Normal"
  },
  {
    "sno": 37,
    "slideNo": 38,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/38",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leakage between RR floor area seat mounting to floor panel (open hole)",
    "rootCauses": [
      "Direct water entry between floor joints - open hole in bracket."
    ],
    "countermeasures": [
      "Sealant applied on the open hole."
    ],
    "checkPoints": [
      "Ensure no open hole (or).",
      "Ensure paint sealant application for open hole."
    ],
    "risk": "Normal"
  },
  {
    "sno": 38,
    "slideNo": 39,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/39",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leakage between RR seat mounting bolt to floor panel",
    "rootCauses": [
      "No sealing prevention."
    ],
    "countermeasures": [
      "Sealant applied around the stud."
    ],
    "checkPoints": [
      "Ensure paint sealant availability around the bolt."
    ],
    "risk": "Normal"
  },
  {
    "sno": 39,
    "slideNo": 40,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/40",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Mirror",
    "concern": "Water leakage between FR door glass runner to door inner panel near A pillar area (mirror mounting)",
    "rootCauses": [
      "No sealing prevention in mirror mounting."
    ],
    "countermeasures": [
      "Gasket seal added between mirror base and door sash panel."
    ],
    "checkPoints": [
      "Ensure sealant application between OVRM panel to reinforcement panel.",
      "Ensure water prevention sealing between mirror base to door sash panel."
    ],
    "risk": "Normal"
  },
  {
    "sno": 40,
    "slideNo": 41,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/41",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Mirror",
    "concern": "Water leakage between FR door glass runner to door inner panel near A pillar area (water behind glass runner)",
    "rootCauses": [
      "No sealing prevention in mirror mounting (without water prevention sealing)."
    ],
    "countermeasures": [
      "Gasket added between mirror base and door sash panel (OVRM)."
    ],
    "checkPoints": [
      "Ensure water prevention sealing between mirror base to door sash panel."
    ],
    "risk": "Normal"
  },
  {
    "sno": 41,
    "slideNo": 42,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/42",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door sealing screen",
    "concern": "Water leakage between FR door sealing screen to harness routing above the speaker",
    "rootCauses": [
      "Harness routing guiding the water route (harness routed from top to bottom)."
    ],
    "countermeasures": [
      "Harness branch position changed.",
      "Harness routing from bottom to top."
    ],
    "checkPoints": [
      "Ensure the harness branch position (harness routing from bottom to top).",
      "Ensure the slit cut position."
    ],
    "risk": "Normal"
  },
  {
    "sno": 42,
    "slideNo": 43,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/43",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door sealing screen",
    "concern": "Water leakage between FR door sealing screen to harness routing near door inner handle",
    "rootCauses": [
      "Harness routing guiding the water route (harness routed from top to bottom)."
    ],
    "countermeasures": [
      "Harness branch position changed.",
      "Harness routing from bottom to top."
    ],
    "checkPoints": [
      "Ensure the harness branch position (harness routing from bottom to top).",
      "Ensure the slit cut position."
    ],
    "risk": "Normal"
  },
  {
    "sno": 43,
    "slideNo": 44,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/44",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Unused holes",
    "concern": "Water / dust entry risk in FR door inner panel to cabin",
    "rootCauses": [
      "Unused hole in FR door inner panel without any plug or sticker."
    ],
    "countermeasures": [
      "Temp: sticker applied.",
      "Perm: hole deleted."
    ],
    "checkPoints": [
      "Ensure no unused holes without dummy plug or tape."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 44,
    "slideNo": 45,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/45",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Unused holes",
    "concern": "Water leakage risk in FR door inner panel to dummy hole",
    "rootCauses": [
      "No sealing prevention from door inner panel side dummy hole."
    ],
    "countermeasures": [
      "Sticker applied."
    ],
    "checkPoints": [
      "Ensure no unused holes without dummy plug or tape."
    ],
    "risk": "Normal"
  },
  {
    "sno": 45,
    "slideNo": 46,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/46",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Speaker",
    "concern": "Water leakage between FR door speaker to door inner panel",
    "rootCauses": [
      "Improper torque application: design 5.6 to 8.4 Nm, actual 1.2 Nm (spinning happened due to high torque)."
    ],
    "countermeasures": [
      "Water leak prevention foam changed same as GO2A.",
      "Tool RPM revised 1500 to 700 RPM.",
      "Torque spec revised from 8 to 2.6 Nm."
    ],
    "checkPoints": [
      "Ensure water prevention foam surrounding the speaker.",
      "Ensure foam at interference condition with panel to avoid water entry.",
      "Ensure torque for speaker mounting 2.6 Nm (reference RBC)."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 46,
    "slideNo": 47,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/47",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door trim / Clips",
    "concern": "Water leakage between FR door harness clip to door inner panel",
    "rootCauses": [
      "No sealing prevention."
    ],
    "countermeasures": [
      "Water preventing foam added on all clips."
    ],
    "checkPoints": [
      "Ensure water preventing foam around the clips to avoid water leak."
    ],
    "risk": "Normal"
  },
  {
    "sno": 47,
    "slideNo": 48,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/48",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Body welt / Weatherstrip",
    "concern": "Water leakage between RR door C pillar area B/OTR panel to body side W/strip",
    "rootCauses": [
      "Less reaction force of body side W/strip seal structure - bulb profile has poor contact with door inner panel."
    ],
    "countermeasures": [
      "Compression load deflection (CLD) of quarter glass seal increased from 2.5 N/100 mm to 9.6 N/100 mm."
    ],
    "checkPoints": [
      "Ensure W/strip seal bulb at interference condition with door inner panel.",
      "Ensure the QTR glass seal CLD value (reference 9.6 N/100 mm)."
    ],
    "risk": "Normal"
  },
  {
    "sno": 48,
    "slideNo": 49,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/49",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Unused holes",
    "concern": "Water leak in RR bumper - hole behind bumper bracket",
    "rootCauses": [
      "No hole cover application (no dummy sticker or plug)."
    ],
    "countermeasures": [
      "Tape / dummy sticker introduced to avoid water entry."
    ],
    "checkPoints": [
      "Ensure no unused holes.",
      "Ensure dummy plug or tape availability for unused holes."
    ],
    "risk": "Normal"
  },
  {
    "sno": 49,
    "slideNo": 50,
    "docRef": "RNTBCI/2021/RBC/VQE/KH/WL/50",
    "project": "RBC",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door trim / Clips",
    "concern": "Water leakage between FR door harness clip to door inner panel (repeat)",
    "rootCauses": [
      "No sealing prevention."
    ],
    "countermeasures": [
      "Water preventing foam added on all clips."
    ],
    "checkPoints": [
      "Ensure water preventing foam around the clips to avoid water leak."
    ],
    "risk": "Normal"
  },
  {
    "sno": 50,
    "slideNo": 51,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/51",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Cowl / HVAC",
    "concern": "Water leak through water box (air intake inlet)",
    "rootCauses": [
      "Current stopper height not sufficient (25 mm in Z direction) and not till end in X direction."
    ],
    "countermeasures": [
      "Stopper height increased from 25 to 37 mm in Z direction and extended till end in X direction."
    ],
    "checkPoints": [
      "Ensure stopper height min 37 mm (reference XBA) in Z direction & till end in X direction."
    ],
    "risk": "Normal"
  },
  {
    "sno": 51,
    "slideNo": 52,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/52",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Cowl / HVAC",
    "concern": "Water leak between HVAC mounting to ENCON inner panel water box area",
    "rootCauses": [
      "Dash insulator overlapping with heater hose foam (HVAC foam is waterproof, dash insulator is not)."
    ],
    "countermeasures": [
      "Dash insulator size modified (reduced 15 mm) to remove overlap condition."
    ],
    "checkPoints": [
      "Ensure there is no overlapping between dash insulator & heater hose foam."
    ],
    "risk": "Normal"
  },
  {
    "sno": 52,
    "slideNo": 53,
    "docRef": "RNTBCI/2021/I2/VQE/KH/WL/53",
    "project": "I2",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Back door",
    "concern": "Back door hinge area water leak",
    "rootCauses": [
      "Washer is 0.4 mm under flush compared to hinge, leading to water entry."
    ],
    "countermeasures": [
      "2 washers added at hinge bottom."
    ],
    "checkPoints": [
      "Ensure hinge surface is on flat surface.",
      "Ensure expandable foam (or) ensure washer over-flush condition compared to hinge."
    ],
    "risk": "Normal"
  },
  {
    "sno": 53,
    "slideNo": 54,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/54",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Luggage room area water leak flange",
    "rootCauses": [
      "No joggle.",
      "Panel gap ~4 mm against requirement of max 2 mm and not even throughout, leading to more gap and sealer bubbles."
    ],
    "countermeasures": [
      "Finishing method changed from spatula to brushing.",
      "Panel gap minimised before spot using jig."
    ],
    "checkPoints": [
      "Ensure panel gap is less than 2 mm & even throughout.",
      "Ensure joggle availability for even sealer application."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 54,
    "slideNo": 55,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/55",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Cowl / HVAC",
    "concern": "Dash panel - cowl plug area water leak",
    "rootCauses": [
      "Stamping emboss flat surface (28 mm dia) smaller than plug (32 mm dia).",
      "Plug seating uneven at edges, leading to water entry."
    ],
    "countermeasures": [
      "Stamping emboss flat surface increased to 43.2 mm (check-point picture shows 42 mm).",
      "Plug dia remains 32 mm."
    ],
    "checkPoints": [
      "Ensure plug seating stamping emboss flat surface is bigger than plug dia for even seating throughout."
    ],
    "risk": "Normal"
  },
  {
    "sno": 55,
    "slideNo": 56,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/56",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Cowl / HVAC",
    "concern": "Dash panel cowl top area water leak",
    "rootCauses": [
      "~8 mm gap between panel joining area.",
      "Body seal has lump after application which stops coverage of paint seal."
    ],
    "countermeasures": [
      "Apply body seal between dash and side member.",
      "Remove body seal and apply paint seal for good application."
    ],
    "checkPoints": [
      "Ensure there is no hole (max 2 mm).",
      "Ensure sealer application at panel joining area."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 56,
    "slideNo": 57,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/57",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leak through fuel inspection cover",
    "rootCauses": [
      "Sealant got disturbed during adjustment - no position mark exists."
    ],
    "countermeasures": [
      "Sealant size changed from 4 mm to 6 mm."
    ],
    "checkPoints": [
      "Ensure there is a position mark to avoid misalignment.",
      "Ensure groove availability for sealant application."
    ],
    "risk": "Normal"
  },
  {
    "sno": 57,
    "slideNo": 58,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/58",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Back door",
    "concern": "Water leak through key cylinder",
    "rootCauses": [
      "Water entry between back door key cylinder and back door panel (through key entry slot)."
    ],
    "countermeasures": [
      "Washer added.",
      "Drain plate / bracket fixed behind key cylinder to re-route water flow to drain hole."
    ],
    "checkPoints": [
      "Confirm water routing bracket availability.",
      "Confirm EPD seal presence."
    ],
    "risk": "Normal"
  },
  {
    "sno": 58,
    "slideNo": 59,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/59",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door sealing screen",
    "concern": "Water leak through FR door sealing screen to inner pop-up rod",
    "rootCauses": [
      "Water enters between body and outside handle gap and comes out through sealing screen pop-up knob routing hole (sealing screen lower than body & outside handle hole)."
    ],
    "countermeasures": [
      "Pop-up knob routed to top of the sealing screen.",
      "Hole eliminated."
    ],
    "checkPoints": [
      "Ensure pop-up knob routing is at top of the sealing screen without any hole to avoid water entry."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 59,
    "slideNo": 60,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/60",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Bumper",
    "concern": "Water leakage from RR bumper mounting bracket locate pin",
    "rootCauses": [
      "No water leak prevention foam surrounding the locate pin."
    ],
    "countermeasures": [
      "Water prevention foam added."
    ],
    "checkPoints": [
      "Ensure water prevention foam around the locating pin."
    ],
    "risk": "Normal"
  },
  {
    "sno": 60,
    "slideNo": 61,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/61",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Door sealing screen",
    "concern": "Water leak through FR / RR door trim sealing screen",
    "rootCauses": [
      "Only 4 to 5 mm of sealing screen remains after butyl.",
      "Screen wrinkles after pasting due to small size, causing workability issue."
    ],
    "countermeasures": [
      "Sealing screen size increased - 10 mm after butyl path."
    ],
    "checkPoints": [
      "Ensure min 10 mm sealing screen remains after the butyl, to avoid butyl application at edge."
    ],
    "risk": "Normal"
  },
  {
    "sno": 61,
    "slideNo": 62,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/62",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leakage between FR seat buckle mounting bolt to floor panel",
    "rootCauses": [
      "Paint sealant is missing."
    ],
    "countermeasures": [
      "Paint sealant added."
    ],
    "checkPoints": [
      "Ensure paint sealant availability on seat buckle mounting bolts."
    ],
    "risk": "Normal"
  },
  {
    "sno": 62,
    "slideNo": 63,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/63",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Bumper",
    "concern": "Water leak between RR bumper mounting pin to body panel near latch lower",
    "rootCauses": [
      "No water-tight seal around the mounting pin."
    ],
    "countermeasures": [
      "Water prevention EPDM seal added around the mounting pin."
    ],
    "checkPoints": [
      "Ensure water prevention seal around the mounting pin."
    ],
    "risk": "Normal"
  },
  {
    "sno": 63,
    "slideNo": 64,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/64",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Unused holes",
    "concern": "Water leak in hole behind rear bumper",
    "rootCauses": [
      "No tape or plug to prevent water entry (unused hole)."
    ],
    "countermeasures": [
      "Temp: tape added on unused hole.",
      "Perm: metal part tool modified to remove the punch."
    ],
    "checkPoints": [
      "Ensure there is no unused hole (or).",
      "Ensure tape availability on unused holes."
    ],
    "risk": "Normal"
  },
  {
    "sno": 64,
    "slideNo": 65,
    "docRef": "RNTBCI/2021/XBA/VQE/KH/WL/65",
    "project": "XBA",
    "preparedBy": "Sree Vishnu (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leak through suspension and body",
    "rootCauses": [
      "Gap between upper and lower panel - thickness mismatch (upper 1 mm, lower 1.8 mm).",
      "Gap created after welding leads to water leak.",
      "No water sealing structure."
    ],
    "countermeasures": [
      "Washer added below lower panel.",
      "Rubber compression preload increased by reducing metal sleeve length (31 to 28.5 mm)."
    ],
    "checkPoints": [
      "Ensure BIW top cup thickness & lower panel thickness are the same.",
      "Ensure cup washer availability, which will increase deflection of water entry."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 65,
    "slideNo": 66,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/66",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Air drafter / Vent",
    "concern": "Water leak between drafter case and flap",
    "rootCauses": [
      "No backflow prevention structure."
    ],
    "countermeasures": [
      "Air drafter case flap angle set to min 10 degree or more (outside tilt, no puddle)."
    ],
    "checkPoints": [
      "Confirm drafter case flap angle >10 degree to avoid water entry."
    ],
    "risk": "Normal"
  },
  {
    "sno": 66,
    "slideNo": 67,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/67",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Floor / Underbody",
    "concern": "Water leak between LH sill and LH floor panel",
    "rootCauses": [
      "6 mm gap between floor and sill.",
      "Difficult to apply paint sealing."
    ],
    "countermeasures": [
      "Panel gap reduced to 2 +/-1 mm."
    ],
    "checkPoints": [
      "Confirm the gap between floor and sill <3 mm.",
      "General design NDS requirement in this area is 2 +/-1 mm."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 67,
    "slideNo": 68,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/68",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Lamps",
    "concern": "LH combi lamp area water leak - parking sensor grommet around leak",
    "rootCauses": [
      "Parking sensor harness mounting clip has no foam seal."
    ],
    "countermeasures": [
      "Water resistance material added on clip to make more interference with body panel."
    ],
    "checkPoints": [
      "Confirm all harness clips water resistance material availability."
    ],
    "risk": "Normal"
  },
  {
    "sno": 68,
    "slideNo": 69,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/69",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Roof",
    "concern": "FR LH roof molding clip leak",
    "rootCauses": [
      "Clip length short, creating gap between roof moulding clip and panel.",
      "Clip sometimes broken."
    ],
    "countermeasures": [
      "Clip locking structure increased 5 mm to avoid play & water entry."
    ],
    "checkPoints": [
      "Ensure no clearance between roof moulding clip and roof panel clip locking hole.",
      "Confirm water resistance foam availability between clip and metal panel (NDS requirement)."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 69,
    "slideNo": 70,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/70",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Back door",
    "concern": "Back door finisher area water leak",
    "rootCauses": [
      "Gap created between body panel and back door finisher - no water tightness seal."
    ],
    "countermeasures": [
      "EPT foam added on back door finisher B surface (12 x 8 x 140 mm)."
    ],
    "checkPoints": [
      "Confirm water resistance foam availability on back door finisher (handle) with interference condition."
    ],
    "risk": "Med Risk"
  },
  {
    "sno": 70,
    "slideNo": 71,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/71",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Wiper / Washer",
    "concern": "Rear wiper washer nozzle O-ring leak",
    "rootCauses": [
      "O-ring details wrongly updated in drawing (1.7 +/-0.5 mm) vs CAD (1.7 +0.05 mm).",
      "O-ring material has uneven cross section & flashes (uneven contact)."
    ],
    "countermeasures": [
      "O-ring spec corrected to 1.7 +0.05 mm to make more interference with HMSL."
    ],
    "checkPoints": [
      "Confirm the O-ring specification as per drawing & CAD."
    ],
    "risk": "Normal"
  },
  {
    "sno": 71,
    "slideNo": 72,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/72",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Door sealing screen",
    "concern": "RR both door sealing screen cup area leak",
    "rootCauses": [
      "Seal lines not robust to provide water tightness.",
      "Water bypasses butyl seal through emboss lip excess flange."
    ],
    "countermeasures": [
      "Weld between sealing screen & cup done to avoid excess flange interference with butyl path (slide text says cabin side; check point says door trim side - verify)."
    ],
    "checkPoints": [
      "Butyl pasting path should be in single PE film - no interference by sealing screen shape & component.",
      "All sealing screen cups should be welded from the door trim side to avoid overlap of cup excess flange interfering with butyl pasting path."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 72,
    "slideNo": 75,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/75",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Bumper",
    "concern": "RR bumper bracket water leak",
    "rootCauses": [
      "Gap between bumper bracket and body panel (missed foam, bracket snap broken/reworked)."
    ],
    "countermeasures": [
      "Foam (3 mm thickness) added to avoid gap between bracket and panel.",
      "New bracket with pre-fixing snap."
    ],
    "checkPoints": [
      "Check bumper bracket to body panel interference condition."
    ],
    "risk": "High Risk"
  },
  {
    "sno": 73,
    "slideNo": 76,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/76",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Back door",
    "concern": "Back door finisher to rear camera water leak - negative pressure",
    "rootCauses": [
      "Not stated explicitly (check points only) - camera datum / foam / harness hole sealing risks at negative pressure."
    ],
    "countermeasures": [
      "Camera seal to have 0.5 mm interference with finisher.",
      "Grommet lock on camera harness body hole.",
      "XYZ datum for camera fixation."
    ],
    "checkPoints": [
      "RR view camera fixing datum should be clearly defined in X, Y and Z.",
      "Camera foam should have full sealing even in worst case assembly variation (min 0.5 mm interference).",
      "Back door camera harness entry hole should have water tightness locking grommet."
    ],
    "risk": "Normal"
  },
  {
    "sno": 74,
    "slideNo": 77,
    "docRef": "RNTBCI/2021/PB1D/VQE/KH/WL/77",
    "project": "PB1D",
    "preparedBy": "Damodharan (VQE)",
    "area": "Lamps",
    "concern": "HMSL to body panel water leak",
    "rootCauses": [
      "Complicated mounting structure of HMSL lamp assembly."
    ],
    "countermeasures": [
      "COD of mating parts validated for worst case interference in design lot.",
      "D-note hole tolerance followed by stamping shop."
    ],
    "checkPoints": [
      "COD confirmation for worst case interference if mating parts disturb water tightness seal.",
      "CAD data and supplier part drawing nominal should match.",
      "Stamping shop should follow the CAD tolerance provided for the hole in D-note."
    ],
    "risk": "Normal"
  },
  {
    "sno": 75,
    "slideNo": 78,
    "docRef": "RNTBCI/2021/HHA/VQE/KH/WL/78",
    "project": "HHA",
    "preparedBy": "Damodharan (VQE)",
    "area": "Speaker",
    "concern": "All doors speaker water leak",
    "rootCauses": [
      "Speaker absorbing paper non-waterproof.",
      "Water resistance foam not available in spacer."
    ],
    "countermeasures": [
      "Water protection spacer (proposed, with protector) and water-resistant speaker material."
    ],
    "checkPoints": [
      "Speaker diaphragm must be made of water resistance material to avoid water entry into cabin.",
      "Check amount of water flow inside door inner panel by confirming distance between door inner to outer panel.",
      "Confirm water flow rate w.r.t. panel gap & water resistance material availability on speaker.",
      "Validate door speaker absorbing paper is water-proof (water test standard 36-10-008; BIMR Rule No 1 # BMIR-V0620-2005-0007 V3.0)."
    ],
    "risk": "Normal"
  },
  {
    "sno": 76,
    "slideNo": 79,
    "docRef": "RNTBCI/2021/HHA/VQE/KH/WL/79",
    "project": "HHA",
    "preparedBy": "Damodharan (VQE)",
    "area": "Glass runner",
    "concern": "Both front door PTN sash water leak",
    "rootCauses": [
      "0.39 mm gap between PTN sash glass runner corner and BIW."
    ],
    "countermeasures": [
      "1 mm rib added on glass runner to avoid water flow towards cabin.",
      "2~3 mm EPT foam added to make 0.39 mm interference with BIW."
    ],
    "checkPoints": [
      "Ensure the gap between PTN sash glass runner corner and BIW (should be interference fit).",
      "Ensure water resistance material availability on glass runner corners (direct water contact areas).",
      "Check the gap between PTN sash to glass runner."
    ],
    "risk": "High Risk"
  }
];
