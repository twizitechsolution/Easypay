const fs = require('fs');
const path = require('path');

const buf = fs.readFileSync('C:\\Users\\nirod\\Downloads\\Curie.apk');

// Read Central Directory
let pos = buf.length - 22;
while (pos > 0 && buf.readUInt32LE(pos) !== 0x06054b50) pos--;

if (pos > 0) {
  const cdOffset = buf.readUInt32LE(pos + 16);
  const cdCount = buf.readUInt16LE(pos + 10);
  console.log('Central Directory entries:', cdCount);
  
  let cdPos = cdOffset;
  const entries = [];
  for (let i = 0; i < cdCount; i++) {
    if (buf.readUInt32LE(cdPos) !== 0x02014b50) break;
    const nameLen = buf.readUInt16LE(cdPos + 28);
    const extraLen = buf.readUInt16LE(cdPos + 30);
    const commentLen = buf.readUInt16LE(cdPos + 32);
    const name = buf.toString('utf8', cdPos + 46, cdPos + 46 + nameLen);
    entries.push(name);
    cdPos += 46 + nameLen + extraLen + commentLen;
  }
  
  const assets = entries.filter(e => e.startsWith('assets/'));
  const res = entries.filter(e => e.startsWith('res/'));
  console.log('Total assets:', assets.length);
  console.log('Sample assets (first 40):', assets.slice(0, 40));
  
  // Find lottie / json / png in assets
  const lottie = entries.filter(e => e.endsWith('.json') && !e.includes('meta'));
  console.log('JSON / Lottie files in APK:', lottie.slice(0, 30));
  
  // Find flutter or react-native or native
  const isFlutter = entries.some(e => e.includes('flutter'));
  const isReactNative = entries.some(e => e.includes('react') || e.includes('index.android.bundle'));
  console.log('Framework detection: isFlutter =', isFlutter, ', isReactNative =', isReactNative);
}
