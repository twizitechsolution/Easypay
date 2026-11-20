const fs = require('fs');

const js = fs.readFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\index-DJpDsWO0.js', 'utf8');

// Look for .apk or download
const apkMatches = [...js.matchAll(/["']([^"']*\.apk[^"']*)["']/gi)].map(m => m[1]);
console.log('APK links in web bundle:', apkMatches);

const downloadMatches = [...js.matchAll(/["']([^"']*download[^"']*)["']/gi)].map(m => m[1]);
console.log('Download links in web bundle:', [...new Set(downloadMatches)]);
