const fs = require('fs');

// We can read zip file headers
const buf = fs.readFileSync('C:\\Users\\nirod\\Downloads\\Bachat Pay.apk');

// Find all filenames in ZIP central directory
let pos = buf.length - 22;
while (pos > 0 && buf.readUInt32LE(pos) !== 0x06054b50) pos--;

if (pos > 0) {
  const cdOffset = buf.readUInt32LE(pos + 16);
  const cdCount = buf.readUInt16LE(pos + 10);
  console.log('Central directory found, count:', cdCount);
  
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
  
  console.log('Total entries:', entries.length);
  const interesting = entries.filter(e => 
    e.startsWith('assets/') || 
    e.startsWith('lib/') ||
    e.endsWith('.json') ||
    e.endsWith('.xml')
  );
  console.log('Interesting entries:');
  console.log(interesting);
}
