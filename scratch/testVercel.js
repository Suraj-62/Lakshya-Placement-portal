const https = require('https');

https.get('https://lakshya-placement-portal.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find the main app chunk
    const jsFiles = data.match(/_next\/static\/chunks\/pages\/_app-[a-zA-Z0-9]+\.js/g);
    if(jsFiles) {
      console.log("Found App JS: ", jsFiles[0]);
      https.get('https://lakshya-placement-portal.vercel.app/' + jsFiles[0], (res2) => {
        let jsData = '';
        res2.on('data', chunk => jsData += chunk);
        res2.on('end', () => {
          // Look for any http/https URL that is not vercel
          const urls = jsData.match(/https?:\/\/[^\s"',]+\.onrender\.com[^\s"',]*/g);
          console.log('\n--- Vercel API URL Analysis ---');
          if (urls) {
            console.log('Found backend URLs baked into Vercel:');
            console.log([...new Set(urls)]);
          } else {
            console.log('No Render URL found! Did you forget to set NEXT_PUBLIC_API_URL or are you still using localhost?');
            const localhosts = jsData.match(/http:\/\/localhost:5000/g);
            if(localhosts) console.log('WARNING: Still using http://localhost:5000 inside Vercel!');
          }
        });
      });
    } else {
      console.log('Could not find _app JS file.');
    }
  });
}).on('error', console.error);
