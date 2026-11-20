const fs = require('fs');

function extractDexStrings(dexPath) {
  const buf = fs.readFileSync(dexPath);
  const stringIdsSize = buf.readUInt32LE(0x38);
  const stringIdsOff = buf.readUInt32LE(0x3c);
  const strings = [];
  for (let i = 0; i < stringIdsSize; i++) {
    const stringDataOff = buf.readUInt32LE(stringIdsOff + i * 4);
    let offset = stringDataOff;
    let byte;
    do { byte = buf[offset++]; } while (byte & 0x80);
    let end = offset;
    while (buf[end] !== 0 && end < buf.length) end++;
    strings.push(buf.toString('utf8', offset, end));
  }
  return strings;
}

const s1 = extractDexStrings('C:\\Users\\nirod\\.gemini\\antigravity\\brain\\f099e81c-34db-4403-9803-f7edcaf203ff\\scratch\\extracted\\classes.dex');
const s2 = extractDexStrings('C:\\Users\\nirod\\.gemini\\antigravity\\brain\\f099e81c-34db-4403-9803-f7edcaf203ff\\scratch\\extracted\\classes2.dex');

const all = [...s1, ...s2];

// Find screens, pages, routes, activities
const screens = all.filter(s => 
  s.endsWith('Screen') || 
  s.endsWith('Page') || 
  s.endsWith('View') || 
  s.endsWith('Dialog') ||
  s.includes('Screen') ||
  s.includes('Page')
);

console.log('Total screen-related strings:', screens.length);
console.log('Sample screen strings:');
console.log([...new Set(screens)].filter(s => !s.startsWith('L') && !s.startsWith('androidx') && !s.startsWith('com/google')).slice(0, 80));
