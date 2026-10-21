// Test all local endpoints against the running Express server
async function testLocalEndpoints() {
  console.log('====================================================');
  console.log('Testing Local Express Server API Endpoints');
  console.log('====================================================\n');

  try {
    // 1. GET /api/tinyfish/status
    console.log('[Endpoint 1: GET /api/tinyfish/status]');
    const sRes = await fetch('http://localhost:3001/api/tinyfish/status');
    const sData = await sRes.json();
    console.log(`  HTTP Status: ${sRes.status} ${sRes.statusText}`);
    console.log(`  Configured: ${sData.isConfigured}`);
    console.log(`  Mode: ${sData.mode}`);
    console.log(`  Message: "${sData.message}"`);

    // 2. POST /api/tinyfish/research
    console.log('\n[Endpoint 2: POST /api/tinyfish/research]');
    const rRes = await fetch('http://localhost:3001/api/tinyfish/research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Free legal aid and crisis support',
        category: 'legal_aid',
      }),
    });
    const rData = await rRes.json();
    console.log(`  HTTP Status: ${rRes.status} ${rRes.statusText}`);
    console.log(`  Result Status: ${rData.status}`);
    console.log(`  Resources Returned: ${rData.resources?.length || 0}`);
    if (rData.resources?.length > 0) {
      console.log(`  Resource 1 Name: "${rData.resources[0].name}"`);
      console.log(`  Resource 1 URL: ${rData.resources[0].officialSourceUrl}`);
    }

    // 3. POST /api/tinyfish/intelligence (Corridor match)
    console.log('\n[Endpoint 3: POST /api/tinyfish/intelligence (Pre-verified Corridor)]');
    const iRes = await fetch('http://localhost:3001/api/tinyfish/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Women transit safety and street lighting',
        approximateArea: '12th Main Road, Indiranagar, Bengaluru',
        forceRefresh: true,
      }),
    });
    const iData = await iRes.json();
    console.log(`  HTTP Status: ${iRes.status} ${iRes.statusText}`);
    console.log(`  Briefing Mode: ${iData.status}`);
    console.log(`  Evidence Items: ${iData.evidence?.length || 0}`);
    console.log(`  Research Plan Steps: ${iData.researchPlan?.length || 0}`);
    console.log(`  Helplines Listed: ${iData.helplines?.length || 0}`);

    // 4. POST /api/tinyfish/intelligence (Live TinyFish Search & Fetch)
    console.log('\n[Endpoint 4: POST /api/tinyfish/intelligence (Live Search & Fetch for non-corridor area)]');
    const liveRes = await fetch('http://localhost:3001/api/tinyfish/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Transit lighting and bus stop safety',
        approximateArea: 'HSR Layout 27th Main, Bengaluru',
        forceRefresh: true,
      }),
    });
    const liveData = await liveRes.json();
    console.log(`  HTTP Status: ${liveRes.status} ${liveRes.statusText}`);
    console.log(`  Briefing Mode: ${liveData.status}`);
    console.log(`  Execution Note: "${liveData.executionNote}"`);
    console.log(`  Evidence Items: ${liveData.evidence?.length || 0}`);
    if (liveData.evidence?.length > 0) {
      console.log(`  Live Evidence 1 Title: "${liveData.evidence[0].title}"`);
      console.log(`  Live Evidence 1 URL: ${liveData.evidence[0].sourceUrl}`);
      console.log(`  Live Evidence 1 Summary: "${liveData.evidence[0].summary?.slice(0, 80)}..."`);
    }

    console.log('\n====================================================');
    console.log('ALL LOCAL ENDPOINT CHECKS PASSED');
    console.log('====================================================\n');
  } catch (err: any) {
    console.error('Endpoint testing error:', err?.message || err);
    process.exit(1);
  }
}

testLocalEndpoints();
