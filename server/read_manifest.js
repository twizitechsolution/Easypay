const fs = require('fs');

const buf = fs.readFileSync('C:\\Users\\nirod\\.gemini\\antigravity\\brain\\f099e81c-34db-4403-9803-f7edcaf203ff\\scratch\\extracted\\AndroidManifest.xml');

// Find all printable strings in AndroidManifest.xml
const str = buf.toString('latin1');
const matches = str.match(/[\x20-\x7E]{4,}/g);
console.log('Manifest strings:');
console.log(matches.filter(s => 
  s.includes('android.') || 
  s.includes('lucifer') || 
  s.includes('bachat') || 
  s.includes('Activity') ||
  s.includes('Service')
));
