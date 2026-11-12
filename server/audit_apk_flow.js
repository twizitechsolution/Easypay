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

// Find any URL starting with http
const urls = all.filter(s => s.startsWith('http://') || s.startsWith('https://'));
console.log('URLs in dex:');
console.log([...new Set(urls)].filter(u => !u.includes('google') && !u.includes('android') && !u.includes('schema') && !u.includes('w3.org') && !u.includes('kotlin')));

// Search for any string containing 'bachat' or 'lucifer'
console.log('\nBachat/Lucifer references:');
console.log([...new Set(all.filter(s => s.toLowerCase().includes('bachat') || s.toLowerCase().includes('lucifer')))].slice(0, 50));
