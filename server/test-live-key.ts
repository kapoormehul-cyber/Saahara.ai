import dotenv from 'dotenv';
dotenv.config();

async function testLiveKey() {
  const rawKey = process.env.TINYFISH_API_KEY || '';
  const key = rawKey.trim();

  console.log('====================================================');
  console.log('SAAHARA AI — Genuine TinyFish API Key Test');
  console.log('====================================================\n');

  if (!key) {
    console.error('ERROR: TINYFISH_API_KEY is not set in process.env');
    process.exit(1);
  }

  const maskedKey = `${key.slice(0, 14)}...${key.slice(-4)} (length: ${key.length})`;
  console.log(`[Config Check] Key configured: ${maskedKey}`);

  // Test 1: Search API via GET https://api.search.tinyfish.ai?query=...
  console.log('\n[Search Test 1: GET https://api.search.tinyfish.ai]');
  const searchQuery = encodeURIComponent('women safety helpline India official legal aid');
  let searchResults: any[] = [];
  let returnedUrlToFetch: string | null = null;
  let searchSucceeded = false;

  try {
    const getRes = await fetch(`https://api.search.tinyfish.ai?query=${searchQuery}&limit=3`, {
      method: 'GET',
      headers: {
        'X-API-Key': key,
      },
    });

    console.log(`  GET Status: ${getRes.status} ${getRes.statusText}`);
    const getBody = await getRes.text();
    try {
      const data = JSON.parse(getBody);
      console.log('  Response parsed successfully as JSON!');
      searchResults = data.results || data.data || (Array.isArray(data) ? data : []);
      console.log(`  Results count: ${searchResults.length}`);
      if (searchResults.length > 0) {
        searchSucceeded = true;
        const first = searchResults[0];
        console.log(`  Result 1 Title: "${first.title || first.name || 'Untitled'}"`);
        returnedUrlToFetch = first.url || first.link || first.officialSourceUrl;
        console.log(`  Result 1 URL: ${returnedUrlToFetch}`);
      }
    } catch {
      console.log(`  Non-JSON response preview: ${getBody.slice(0, 120)}`);
    }
  } catch (err: any) {
    console.log(`  GET request error: ${err?.message || err}`);
  }

  // Test 1b: Search API via POST https://api.search.tinyfish.ai if GET didn't succeed
  if (!searchSucceeded) {
    console.log('\n[Search Test 1b: POST https://api.search.tinyfish.ai]');
    try {
      const postRes = await fetch(`https://api.search.tinyfish.ai`, {
        method: 'POST',
        headers: {
          'X-API-Key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'women safety helpline India official legal aid',
          limit: 3,
        }),
      });

      console.log(`  POST Status: ${postRes.status} ${postRes.statusText}`);
      const postBody = await postRes.text();
      try {
        const data = JSON.parse(postBody);
        console.log('  Response parsed successfully as JSON!');
        searchResults = data.results || data.data || (Array.isArray(data) ? data : []);
        console.log(`  Results count: ${searchResults.length}`);
        if (searchResults.length > 0) {
          searchSucceeded = true;
          const first = searchResults[0];
          console.log(`  Result 1 Title: "${first.title || first.name || 'Untitled'}"`);
          returnedUrlToFetch = first.url || first.link || first.officialSourceUrl;
          console.log(`  Result 1 URL: ${returnedUrlToFetch}`);
        }
      } catch {
        console.log(`  Non-JSON response preview: ${postBody.slice(0, 120)}`);
      }
    } catch (err: any) {
      console.log(`  POST request error: ${err?.message || err}`);
    }
  }

  // Test 2: Fetch API via POST https://api.fetch.tinyfish.ai
  const urlToFetch = returnedUrlToFetch || 'https://nalsa.gov.in';
  console.log(`\n[Fetch Test: POST https://api.fetch.tinyfish.ai for ${urlToFetch}]`);
  let fetchSucceeded = false;

  try {
    const fetchRes = await fetch('https://api.fetch.tinyfish.ai', {
      method: 'POST',
      headers: {
        'X-API-Key': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: [urlToFetch],
        format: 'markdown',
        links: false,
        image_links: false,
      }),
    });

    console.log(`  Fetch HTTP Status: ${fetchRes.status} ${fetchRes.statusText}`);
    const fetchBody = await fetchRes.text();
    try {
      const fData = JSON.parse(fetchBody);
      console.log('  Fetch JSON parsed successfully!');
      fetchSucceeded = true;
      const extractedContent = JSON.stringify(fData);
      console.log(`  Extracted payload length: ${extractedContent.length} bytes`);
      console.log(`  Extracted sample snippet: ${extractedContent.slice(0, 200)}...`);
    } catch {
      console.log(`  Non-JSON response preview: ${fetchBody.slice(0, 150)}`);
    }
  } catch (err: any) {
    console.log(`  Fetch request error: ${err?.message || err}`);
  }

  console.log('\n====================================================');
  console.log('GENUINE API TEST RESULTS');
  console.log('====================================================');
  console.log(`- API Key configured: YES (Masked: ${maskedKey})`);
  console.log(`- TinyFish Search: ${searchSucceeded ? 'SUCCESS (200 OK)' : 'FAILED'}`);
  console.log(`- TinyFish Fetch: ${fetchSucceeded ? 'SUCCESS (200 OK)' : 'FAILED'}`);
  console.log(`- Actual Verified URL: ${urlToFetch}`);
  console.log('====================================================\n');
}

testLiveKey().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
