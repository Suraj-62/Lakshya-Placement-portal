const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const mainPage = await checkUrl('https://lakshya-placement-portal.vercel.app/');
  
  // Find all JS chunks
  const jsFiles = mainPage.match(/_next\/static\/chunks\/[^\"]+\.js/g);
  if(!jsFiles) return console.log("No JS files found");

  console.log(`Checking ${jsFiles.length} JS files...`);
  
  for (const file of jsFiles) {
    const content = await checkUrl('https://lakshya-placement-portal.vercel.app/' + file);
    if(content.includes('http://localhost:5000')) {
      console.log(`\n❌ FOUND LOCALHOST IN: ${file}`);
      // find context
      const idx = content.indexOf('http://localhost:5000');
      console.log('Context:', content.substring(idx - 20, idx + 50));
    }
    if(content.includes('onrender.com')) {
       const urls = content.match(/https?:\/\/[^\s"',]+\.onrender\.com[^\s"',]*/g);
       if(urls) console.log(`\n✅ Found Render URL in ${file}:`, [...new Set(urls)]);
    }
  }
}

run();
