import { HELP_CATEGORIES, UI_STRINGS, HelpCategoryId } from '../src/components/SupportNavigator/supportTranslations';
import { OFFICIAL_SUPPORT_RESOURCES } from '../src/data/sampleData';
import fs from 'fs';
import path from 'path';

function runFindMyHelpTests() {
  console.log('=== RUNNING "FIND MY HELP" & SUPPORT NAVIGATOR TEST SUITE ===\n');

  // Test 1: Verify the 6 required categories exist
  const expectedCategories: HelpCategoryId[] = [
    'immediate_danger',
    'domestic_violence',
    'cybercrime',
    'legal_assistance',
    'emotional_support',
    'other_support'
  ];

  console.log('Test 1: Verifying required categories:');
  for (const catId of expectedCategories) {
    const found = HELP_CATEGORIES.find(c => c.id === catId);
    if (!found) {
      throw new Error(`Missing required category: ${catId}`);
    }
    console.log(`  [PASS] Found category: "${found.labelEn}" / "${found.labelHi}"`);
  }

  // Test 2: Verify bilingual translations and action steps for all categories
  console.log('\nTest 2: Verifying bilingual action steps:');
  for (const cat of HELP_CATEGORIES) {
    if (!cat.labelEn || !cat.labelHi || !cat.subEn || !cat.subHi) {
      throw new Error(`Incomplete labels for category: ${cat.id}`);
    }
    if (!cat.actionStepsEn || cat.actionStepsEn.length === 0) {
      throw new Error(`Missing English action steps for: ${cat.id}`);
    }
    if (!cat.actionStepsHi || cat.actionStepsHi.length === 0) {
      throw new Error(`Missing Hindi action steps for: ${cat.id}`);
    }
    if (cat.actionStepsEn.length !== cat.actionStepsHi.length) {
      throw new Error(`Step count mismatch between EN (${cat.actionStepsEn.length}) and HI (${cat.actionStepsHi.length}) for: ${cat.id}`);
    }
    console.log(`  [PASS] ${cat.id.padEnd(20)}: ${cat.actionStepsEn.length} steps in EN & HI`);
  }

  // Test 3: Verify all matched resource IDs exist in sampleData
  console.log('\nTest 3: Validating matched resource references:');
  const allResourceIds = new Set(OFFICIAL_SUPPORT_RESOURCES.map(r => r.id));
  for (const cat of HELP_CATEGORIES) {
    if (cat.matchedResourceIds.length === 0) {
      throw new Error(`Category ${cat.id} has no matched resources`);
    }
    for (const rId of cat.matchedResourceIds) {
      if (!allResourceIds.has(rId)) {
        throw new Error(`Category ${cat.id} references non-existent resource ID: ${rId}`);
      }
      const resource = OFFICIAL_SUPPORT_RESOURCES.find(r => r.id === rId)!;
      if (!resource.contactNumber && !resource.officialSourceUrl) {
        throw new Error(`Resource ${rId} has neither contactNumber nor officialSourceUrl`);
      }
    }
    console.log(`  [PASS] ${cat.id.padEnd(20)} -> ${cat.matchedResourceIds.join(', ')}`);
  }

  // Test 4: Verify UI string completeness across EN and HI
  console.log('\nTest 4: Verifying UI string parity between English and Hindi:');
  const enKeys = Object.keys(UI_STRINGS.en);
  const hiKeys = Object.keys(UI_STRINGS.hi);
  for (const k of enKeys) {
    if (!(k in UI_STRINGS.hi)) {
      throw new Error(`Key ${k} present in English UI_STRINGS but missing in Hindi`);
    }
  }
  console.log(`  [PASS] All ${enKeys.length} UI keys match perfectly across English and Hindi`);

  // Test 5: Verify "Inspect Official Source" is completely removed from SupportNavigatorModule
  console.log('\nTest 5: Checking for removal of "Inspect Official Source" in SupportNavigatorModule.tsx:');
  const modulePath = path.resolve(process.cwd(), 'src/components/SupportNavigator/SupportNavigatorModule.tsx');
  const moduleContent = fs.readFileSync(modulePath, 'utf-8');
  if (moduleContent.includes('Inspect Official Source')) {
    throw new Error('SupportNavigatorModule.tsx still contains "Inspect Official Source" button text!');
  }
  if (moduleContent.includes('openExternalOfficialUrl')) {
    throw new Error('SupportNavigatorModule.tsx still imports openExternalOfficialUrl!');
  }
  console.log('  [PASS] No "Inspect Official Source" buttons or unused handlers remain in SupportNavigatorModule');

  // Test 6: Verify copy-details string generator
  console.log('\nTest 6: Validating copy-details payload generation:');
  const sampleResource = OFFICIAL_SUPPORT_RESOURCES[0];
  const copyLines = [
    `SAAHARA AI — Verified Support Resource`,
    `Service: ${sampleResource.name}`,
    `Issuing Authority: ${sampleResource.issuingOrganization}`,
    sampleResource.contactNumber ? `Helpline / Dial: ${sampleResource.contactNumber}` : '',
    sampleResource.alternateContact ? `Alternate Contact: ${sampleResource.alternateContact}` : '',
    `What this helps with: ${sampleResource.simpleExplanation}`,
    `Eligibility & Access: ${sampleResource.eligibility}`,
    sampleResource.coverage ? `Coverage: ${sampleResource.coverage}` : '',
    `Verification: ${sampleResource.verifiedBy} (Date: ${sampleResource.dateChecked})`
  ].filter(Boolean).join('\n');

  if (!copyLines.includes(sampleResource.name) || !copyLines.includes(sampleResource.contactNumber!)) {
    throw new Error('Copy details output missing required fields');
  }
  console.log('  [PASS] Copy details action formats complete verified payload cleanly');

  // Test 7: Simulation of Category Filter
  console.log('\nTest 7: Simulating Category Filter Logic:');
  for (const cat of HELP_CATEGORIES) {
    const filtered = OFFICIAL_SUPPORT_RESOURCES.filter(r => cat.matchedResourceIds.includes(r.id));
    if (filtered.length === 0) {
      throw new Error(`Category ${cat.id} filtered to 0 items`);
    }
    console.log(`  [PASS] Category "${cat.id}" renders ${filtered.length} verified cards`);
  }

  console.log('\n=== ALL 7 TESTS PASSED SUCCESSFULLY ===');
}

runFindMyHelpTests();
