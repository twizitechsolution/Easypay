const fs = require('fs');
const zlib = require('zlib');

// Read ZIP file to find and extract AssetManifest.json
const buf = fs.readFileSync('C:\\Users\\nirod\\Downloads\\Curie.apk');

let pos = buf.length - 22;
while (pos > 0 && buf.readUInt32LE(pos) !== 0x06054b50) pos--;

if (pos > 0) {
  const cdOffset = buf.readUInt32LE(pos + 16);
  const cdCount = buf.readUInt16LE(pos + 10);
  
  let cdPos = cdOffset;
  for (let i = 0; i < cdCount; i++) {
    if (buf.readUInt32LE(cdPos) !== 0x02014b50) break;
    const method = buf.readUInt16LE(cdPos + 10);
    const compSize = buf.readUInt32LE(cdPos + 20);
    const uncompSize = buf.readUInt32LE(cdPos + 24);
    const nameLen = buf.readUInt16LE(cdPos + 28);
    const extraLen = buf.readUInt16LE(cdPos + 30);
    const commentLen = buf.readUInt16LE(cdPos + 32);
    const localHeaderOffset = buf.readUInt32LE(cdPos + 42);
    const name = buf.toString('utf8', cdPos + 46, cdPos + 46 + nameLen);
    
    if (name === 'assets/flutter_assets/AssetManifest.json') {
      console.log('Found AssetManifest.json, method:', method, 'compSize:', compSize);
      // Local header
      const lhNameLen = buf.readUInt16LE(localHeaderOffset + 26);
      const lhExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
      const dataOffset = localHeaderOffset + 30 + lhNameLen + lhExtraLen;
      const compData = buf.subarray(dataOffset, dataOffset + compSize);
      let data;
      if (method === 0) data = compData;
      else if (method === 8) data = zlib.inflateRawSync(compData);
      
      const manifest = JSON.parse(data.toString('utf8'));
      const keys = Object.keys(manifest);
      console.log('Total asset keys:', keys.length);
      
      // Filter interesting categories
      const bonds = keys.filter(k => k.toLowerCase().includes('bond'));
      console.log('Bonds assets:', bonds);
      
      const fd = keys.filter(k => k.toLowerCase().includes('fd') || k.toLowerCase().includes('bank'));
      console.log('FD/Bank assets:', fd.slice(0, 30));

      const animations = keys.filter(k => k.includes('animations/'));
      console.log('Animation assets:', animations);

      fs.writeFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\server\\curie_assets.json', JSON.stringify(keys, null, 2));
      break;
    }
    
    cdPos += 46 + nameLen + extraLen + commentLen;
  }
}
