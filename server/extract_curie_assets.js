const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const buf = fs.readFileSync('C:\\Users\\nirod\\Downloads\\Curie.apk');

let pos = buf.length - 22;
while (pos > 0 && buf.readUInt32LE(pos) !== 0x06054b50) pos--;

if (pos > 0) {
  const cdOffset = buf.readUInt32LE(pos + 16);
  const cdCount = buf.readUInt16LE(pos + 10);
  
  let cdPos = cdOffset;
  const outBase = 'c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\curie';
  fs.mkdirSync(outBase, { recursive: true });

  let extractedCount = 0;
  for (let i = 0; i < cdCount; i++) {
    if (buf.readUInt32LE(cdPos) !== 0x02014b50) break;
    const method = buf.readUInt16LE(cdPos + 10);
    const compSize = buf.readUInt32LE(cdPos + 20);
    const nameLen = buf.readUInt16LE(cdPos + 28);
    const extraLen = buf.readUInt16LE(cdPos + 30);
    const commentLen = buf.readUInt16LE(cdPos + 32);
    const localHeaderOffset = buf.readUInt32LE(cdPos + 42);
    const name = buf.toString('utf8', cdPos + 46, cdPos + 46 + nameLen);
    
    // Extract animations, svgs, bank icons, and images
    if (
      name.includes('animations/') || 
      name.includes('assets/svg/') || 
      name.includes('assets/banks/') ||
      name.endsWith('.png') && (name.includes('logo') || name.includes('card') || name.includes('banner'))
    ) {
      const lhNameLen = buf.readUInt16LE(localHeaderOffset + 26);
      const lhExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
      const dataOffset = localHeaderOffset + 30 + lhNameLen + lhExtraLen;
      const compData = buf.subarray(dataOffset, dataOffset + compSize);
      let data;
      try {
        if (method === 0) data = compData;
        else if (method === 8) data = zlib.inflateRawSync(compData);
        
        if (data) {
          const fileName = path.basename(name);
          const subDir = path.dirname(name).replace('assets/flutter_assets/', '').replace('assets/', '');
          const targetDir = path.join(outBase, subDir);
          fs.mkdirSync(targetDir, { recursive: true });
          fs.writeFileSync(path.join(targetDir, fileName), data);
          extractedCount++;
        }
      } catch (err) {}
    }
    
    cdPos += 46 + nameLen + extraLen + commentLen;
  }
  console.log('Successfully extracted', extractedCount, 'files into public/assets/curie');
}
