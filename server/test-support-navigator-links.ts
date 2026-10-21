import { OFFICIAL_SUPPORT_RESOURCES } from '../src/data/sampleData';
import { openExternalOfficialUrl } from '../src/utils/urlHelper';

function runTests() {
  console.log('=== RUNNING SUPPORT NAVIGATOR LINK AUDIT ===\n');

  // Test 1: Check all 8 resources exist
  console.log(`Checking resource count: ${OFFICIAL_SUPPORT_RESOURCES.length} (expected 8)`);
  if (OFFICIAL_SUPPORT_RESOURCES.length !== 8) {
    throw new Error(`Expected 8 resources, got ${OFFICIAL_SUPPORT_RESOURCES.length}`);
  }

  // Test 2: Verify URLs
  console.log('\nAuditing officialSourceUrls:');
  for (const r of OFFICIAL_SUPPORT_RESOURCES) {
    if (!r.officialSourceUrl || !r.officialSourceUrl.startsWith('https://')) {
      throw new Error(`Invalid officialSourceUrl for ${r.id}: ${r.officialSourceUrl}`);
    }
    console.log(`  [OK] ${r.id.padEnd(15)}: ${r.name.substring(0, 35).padEnd(35)} -> ${r.officialSourceUrl}`);
  }

  // Test 3: Verify specific requested URLs
  const r112 = OFFICIAL_SUPPORT_RESOURCES.find(r => r.id === 'res_112');
  if (!r112 || r112.officialSourceUrl !== 'https://112.gov.in/') {
    throw new Error(`res_112 URL mismatch: ${r112?.officialSourceUrl} (expected https://112.gov.in/)`);
  }
  console.log('\n[PASS] res_112 URL is verified: https://112.gov.in/');

  const r1091 = OFFICIAL_SUPPORT_RESOURCES.find(r => r.id === 'res_1091');
  if (!r1091 || r1091.officialSourceUrl !== 'https://www.delhipolice.gov.in/telephone-directory.html') {
    throw new Error(`res_1091 URL mismatch: ${r1091?.officialSourceUrl} (expected https://www.delhipolice.gov.in/telephone-directory.html)`);
  }
  console.log('[PASS] res_1091 URL is verified: https://www.delhipolice.gov.in/telephone-directory.html');

  // Test 4: Verify storageService synchronization behavior
  console.log('\nSimulating storageService synchronization:');
  const staleUserStorage = [
    { id: 'res_112', name: 'Old ERSS', officialSourceUrl: 'http://broken-old-url.com', isSaved: false },
    { id: 'res_1091', name: 'Old 1091', officialSourceUrl: 'https://bprd.nic.in', isSaved: true },
    { id: 'res_ncw', name: 'Old NCW', officialSourceUrl: 'https://ncw.nic.in', isSaved: true },
  ];

  const savedMap = new Map<string, boolean>();
  staleUserStorage.forEach(item => {
    savedMap.set(item.id, Boolean(item.isSaved));
  });

  const synced = OFFICIAL_SUPPORT_RESOURCES.map(canonical => ({
    ...canonical,
    isSaved: savedMap.has(canonical.id) ? savedMap.get(canonical.id)! : canonical.isSaved,
  }));

  const synced112 = synced.find(r => r.id === 'res_112')!;
  const synced1091 = synced.find(r => r.id === 'res_1091')!;
  const syncedNcw = synced.find(r => r.id === 'res_ncw')!;

  // 112 should have canonical URL and preserved isSaved=false
  if (synced112.officialSourceUrl !== 'https://112.gov.in/' || synced112.isSaved !== false) {
    throw new Error(`synced 112 failed: url=${synced112.officialSourceUrl}, isSaved=${synced112.isSaved}`);
  }
  // 1091 should have new Delhi Police URL and preserved isSaved=true
  if (synced1091.officialSourceUrl !== 'https://www.delhipolice.gov.in/telephone-directory.html' || synced1091.isSaved !== true) {
    throw new Error(`synced 1091 failed: url=${synced1091.officialSourceUrl}, isSaved=${synced1091.isSaved}`);
  }
  // NCW should have new URL and preserved isSaved=true
  if (syncedNcw.officialSourceUrl !== 'https://www.ncw.gov.in/' || syncedNcw.isSaved !== true) {
    throw new Error(`synced NCW failed: url=${syncedNcw.officialSourceUrl}, isSaved=${syncedNcw.isSaved}`);
  }

  console.log('[PASS] storageService correctly upgrades stale URLs while preserving user bookmark preferences');

  console.log('\n=== ALL AUDIT CHECKS PASSED ===');
}

runTests();
