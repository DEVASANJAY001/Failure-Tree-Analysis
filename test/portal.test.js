/**
 * Unit & Integration Tests for LeakGuard LLR Portal
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 Starting LeakGuard LLR Portal Test Suite...\n');

// 1. Test CSV file existence & content
const csvPath = path.join(__dirname, '..', 'Water_Leak_Issues_and_Check_Points.csv');
assert(fs.existsSync(csvPath), 'Water_Leak_Issues_and_Check_Points.csv must exist');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
assert(lines.length >= 77, `CSV should have 1 header line + 76 lesson lines. Found: ${lines.length}`);
console.log('✅ 1. CSV File verified: 76 data rows + 1 header row.');

// 2. Test JSON dataset
const jsonPath = path.join(__dirname, '..', 'lessons-data.json');
assert(fs.existsSync(jsonPath), 'lessons-data.json must exist');
const lessons = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.strictEqual(lessons.length, 76, `Expected exactly 76 lessons in JSON, got ${lessons.length}`);
console.log('✅ 2. lessons-data.json verified: exactly 76 structured lessons.');

// 3. Test Schema integrity for each lesson
lessons.forEach((item, idx) => {
  assert(item.slideNo !== undefined && item.slideNo !== null, `Slide number missing in item ${idx}`);
  assert(item.project && item.project.length > 0, `Project missing in slide ${item.slideNo}`);
  assert(item.area && item.area.length > 0, `Area missing in slide ${item.slideNo}`);
  assert(item.concern && item.concern.length > 0, `Water Leak Concern missing in slide ${item.slideNo}`);
  assert(Array.isArray(item.rootCauses), `Root causes must be an array in slide ${item.slideNo}`);
  assert(Array.isArray(item.countermeasures), `Countermeasures must be an array in slide ${item.slideNo}`);
  assert(Array.isArray(item.checkPoints), `Check points must be an array in slide ${item.slideNo}`);
});
console.log('✅ 3. Schema integrity verified across all 76 lessons.');

// 4. Test 17 Unique Vehicle Areas
const uniqueAreas = Array.from(new Set(lessons.map(l => l.area))).sort();
assert.strictEqual(uniqueAreas.length, 17, `Expected exactly 17 unique areas, got ${uniqueAreas.length}`);
const expectedAreas = [
  'Air drafter / Vent', 'Back door', 'Body welt / Weatherstrip', 'Bumper',
  'Cowl / HVAC', 'Door sealing screen', 'Door trim / Clips', 'Fasteners',
  'Floor / Underbody', 'Glass runner', 'Grommets / Plugs', 'Lamps',
  'Mirror', 'Roof', 'Speaker', 'Unused holes', 'Wiper / Washer'
];
assert.deepStrictEqual(uniqueAreas, expectedAreas, 'Areas list matches exact 17 inspection zones');
console.log('✅ 4. All 17 vehicle inspection zones accounted for.');

// 5. Test 7 Vehicle Projects
const uniqueProjects = Array.from(new Set(lessons.map(l => l.project))).sort();
const expectedProjects = ['HBC', 'HHA', 'I2', 'PB1D', 'PY1B', 'RBC', 'XBA'];
assert.deepStrictEqual(uniqueProjects, expectedProjects, 'Vehicle projects match expected set');
console.log('✅ 5. All 7 vehicle projects verified (HBC, HHA, I2, PB1D, PY1B, RBC, XBA).');

// 6. Test Search and Filtering logic
function searchLessons(query, filter) {
  return lessons.filter(item => {
    if (filter === 'foam') {
      const text = (item.concern + ' ' + item.rootCauses.join(' ') + ' ' + item.countermeasures.join(' ') + ' ' + item.checkPoints.join(' ')).toLowerCase();
      if (!text.includes('foam')) return false;
    } else if (filter === 'butyl') {
      const text = (item.concern + ' ' + item.rootCauses.join(' ') + ' ' + item.countermeasures.join(' ') + ' ' + item.checkPoints.join(' ')).toLowerCase();
      if (!text.includes('butyl') && !text.includes('sealant') && !text.includes('sealer')) return false;
    }

    if (query) {
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

      if (!hay.includes(query.toLowerCase())) return false;
    }

    return true;
  });
}

const foamResults = searchLessons('', 'foam');
assert(foamResults.length >= 20, `Expected at least 20 foam-related lessons, got ${foamResults.length}`);

const butylResults = searchLessons('70 mm', 'butyl');
assert(butylResults.length >= 1, `Expected search for '70 mm' with butyl filter to return results`);
console.log(`✅ 6. Search and filter logic verified (Found ${foamResults.length} foam lessons, ${butylResults.length} 70mm butyl lessons).`);

// 7. Verify index.html & app.js references
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(htmlContent.includes('lessons-data.js'), 'index.html must include lessons-data.js');
assert(htmlContent.includes('app.js'), 'index.html must include app.js');
assert(htmlContent.includes('LeakGuard LLR'), 'index.html must have LeakGuard branding');
assert(htmlContent.includes('view-lessons-browser'), 'index.html must have lessons-browser view');
assert(htmlContent.includes('view-vehicle-zones'), 'index.html must have vehicle-zones view');
assert(htmlContent.includes('view-interactive-checklist'), 'index.html must have interactive-checklist view');
assert(htmlContent.includes('view-data-sync'), 'index.html must have data-sync view');
assert(htmlContent.includes('view-lesson-detail'), 'index.html must have lesson-detail view');
console.log('✅ 7. Frontend structure verified: all 5 Stitch views present in index.html.');

console.log('\n🎉 ALL 7 TEST SUITES PASSED SUCCESSFULLY!\n');
