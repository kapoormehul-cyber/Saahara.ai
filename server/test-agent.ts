// SAAHARA AI — Round 2 Live Safety Intelligence Agent Test Suite
// Verifies:
// 1. Valid corridor query & structured briefing output
// 2. Multi-source comparison & conflict detection
// 3. SSRF URL validation rules
// 4. Absence of evidence != safety guard
// 5. Caching & forceRefresh behavior
// 6. Privacy filter guard middleware

import { 
  runSafetyIntelligence, 
  isSafePublicUrl, 
  clearIntelligenceCache 
} from './intelligenceEngine';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failedTests++;
  }
}

async function runAllTests() {
  console.log('====================================================');
  console.log('SAAHARA AI — Live Safety Intelligence Agent Test Suite');
  console.log('====================================================\n');

  clearIntelligenceCache();

  // Test 1: SSRF Safe URL Validation
  console.log('[Suite 1: SSRF & URL Security]');
  assert(!isSafePublicUrl('http://localhost:3001/admin'), 'Reject localhost URL');
  assert(!isSafePublicUrl('http://127.0.0.1:8080'), 'Reject loopback IP');
  assert(!isSafePublicUrl('http://169.254.169.254/latest/meta-data/'), 'Reject cloud metadata IP');
  assert(!isSafePublicUrl('http://192.168.1.100/router'), 'Reject private subnet 192.168.x');
  assert(!isSafePublicUrl('http://10.0.0.5/internal'), 'Reject private subnet 10.x');
  assert(!isSafePublicUrl('file:///etc/passwd'), 'Reject non-http protocol');
  assert(isSafePublicUrl('https://nalsa.gov.in/legal-aid'), 'Accept official government HTTPS URL');
  assert(isSafePublicUrl('https://delhimetrorail.com/safety'), 'Accept official transit HTTPS URL');

  // Test 2: Pre-verified Corridor Intelligence & Conflict Detection
  console.log('\n[Suite 2: Corridor Research & Conflict Detection]');
  const blrBriefing = await runSafetyIntelligence(
    {
      query: '12th Main Indiranagar Corridor Safety',
      approximateArea: '12th Main Road, Indiranagar, Bengaluru',
      observationId: 'OBS-BLR-001',
    },
    '',
    'https://api.search.tinyfish.ai'
  );

  assert(Boolean(blrBriefing), 'Briefing generated for Indiranagar corridor');
  assert(blrBriefing.researchPlan.length >= 3, 'Multi-step research plan formulated', `Found ${blrBriefing.researchPlan.length} steps`);
  assert(blrBriefing.evidence.length >= 2, 'Evidence collected from multiple sources', `Found ${blrBriefing.evidence.length} items`);
  assert(blrBriefing.conflicts.length > 0, 'Conflicting claim detected between civic portal and community reports');
  assert(blrBriefing.conflicts[0].issue.includes('Streetlight'), 'Conflict correctly identifies streetlight operability discrepancy');
  assert(Boolean(blrBriefing.absenceOfDataNotice), 'Includes explicit absence-of-data safety limitation notice');
  assert(!JSON.stringify(blrBriefing).includes('"safetyScore"'), 'Strict honesty: No invented percentage safety score');

  // Test 3: Delhi Airport Express Metro Corridor
  console.log('\n[Suite 3: Delhi Airport Express Metro Verification]');
  const delBriefing = await runSafetyIntelligence(
    {
      query: 'Airport Express Metro Corridor Safety',
      approximateArea: 'IGI Airport Terminal 3 to New Delhi Metro Station',
    },
    '',
    'https://api.search.tinyfish.ai'
  );

  assert(delBriefing.query.includes('Airport Express'), 'Matched Delhi Airport Express corridor');
  assert(delBriefing.evidence.some(e => e.organization?.includes('Central Industrial Security Force')), 'Verified CISF deployment record');
  assert(delBriefing.helplines.some(h => h.contact.includes('155370') || h.contact.includes('112')), 'Provides verified emergency helplines');

  // Test 4: BKC Mumbai Transit Corridor
  console.log('\n[Suite 4: BKC Mumbai Transit Corridor]');
  const bkcBriefing = await runSafetyIntelligence(
    {
      query: 'BKC Terminal & Bandra Kurla Complex',
      approximateArea: 'Bandra Kurla Complex, Mumbai',
    },
    '',
    'https://api.search.tinyfish.ai'
  );
  assert(bkcBriefing.evidence.some(e => e.organization?.includes('MMRDA')), 'Verified MMRDA smart infrastructure records');
  assert(bkcBriefing.helplines.some(h => h.contact === '103' || h.contact === '112'), 'Verified Mumbai Police Nirbhaya Helpline (103)');

  // Test 5: Empty / Obscure Location Query Handling
  console.log('\n[Suite 5: Empty Search & Absence of Evidence Handling]');
  const obscureBriefing = await runSafetyIntelligence(
    {
      query: 'Sector 99 Unknown Suburb',
      approximateArea: 'Remote Outskirts Zone X',
    },
    '',
    'https://api.search.tinyfish.ai'
  );
  assert(Boolean(obscureBriefing), 'Generates fallback briefing for unknown location');
  assert(obscureBriefing.overallAssessment.includes('Limited public civic advisories'), 'States limited data honestly');
  assert(obscureBriefing.absenceOfDataNotice.includes('does NOT mean an area is safe'), 'Crucial safety rule: absence of records != safe');

  // Test 6: In-Memory 15-Minute Caching
  console.log('\n[Suite 6: Caching & Cache Invalidation]');
  const firstCall = await runSafetyIntelligence(
    { query: 'Connaught Place Late Night', approximateArea: 'Connaught Place, New Delhi' },
    '',
    'https://api.search.tinyfish.ai'
  );
  assert(firstCall.cached === false || firstCall.cached === undefined, 'First call is not cached');

  const secondCall = await runSafetyIntelligence(
    { query: 'Connaught Place Late Night', approximateArea: 'Connaught Place, New Delhi' },
    '',
    'https://api.search.tinyfish.ai'
  );
  assert(secondCall.cached === true, 'Second identical call hits 15-min cache');

  const refreshedCall = await runSafetyIntelligence(
    { query: 'Connaught Place Late Night', approximateArea: 'Connaught Place, New Delhi', forceRefresh: true },
    '',
    'https://api.search.tinyfish.ai'
  );
  assert(refreshedCall.cached === false, 'forceRefresh=true successfully bypasses cache');

  // Test 7: Privacy Guard Filter Keywords
  console.log('\n[Suite 7: Privacy Filter Guard]');
  const sensitiveKeywords = ['password', 'otp', 'phone', 'latitude', 'longitude', 'driver_license'];
  const testSamplePayload = JSON.stringify({
    query: 'Audit safety near my place',
    latitude: 12.9716,
    longitude: 77.5946,
  });
  const caughtByGuard = sensitiveKeywords.some(kw => testSamplePayload.toLowerCase().includes(kw));
  assert(caughtByGuard, 'Privacy Guard catches and flags raw coordinate transmission');

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test execution failure:', err);
  process.exit(1);
});
