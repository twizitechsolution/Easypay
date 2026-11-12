const fs = require('fs');

function parseAxml(buffer) {
  let pos = 8;
  const chunkType = buffer.readUInt32LE(pos);
  const chunkSize = buffer.readUInt32LE(pos + 4);
  const stringCount = buffer.readUInt32LE(pos + 8);
  const styleCount = buffer.readUInt32LE(pos + 12);
  const flags = buffer.readUInt32LE(pos + 16);
  const stringsStart = pos + buffer.readUInt32LE(pos + 20);
  const isUtf8 = (flags & (1 << 8)) !== 0;
  
  const strings = [];
  const indicesOffset = pos + 28;
  for (let i = 0; i < stringCount; i++) {
    const strOffset = stringsStart + buffer.readUInt32LE(indicesOffset + i * 4);
    if (isUtf8) {
      let p = strOffset;
      let len1 = buffer[p++];
      if (len1 & 0x80) p++;
      let len2 = buffer[p++];
      if (len2 & 0x80) p++;
      let end = p;
      while (buffer[end] !== 0 && end < buffer.length) end++;
      strings.push(buffer.toString('utf8', p, end));
    } else {
      let len = buffer.readUInt16LE(strOffset);
      let p = strOffset + 2;
      let str = buffer.toString('utf16le', p, p + len * 2);
      strings.push(str);
    }
  }
  return strings;
}

// Find AndroidManifest.xml in Curie.apk
const buf = fs.readFileSync('C:\\Users\\nirod\\Downloads\\Curie.apk');
let pos = buf.length - 22;
while (pos > 0 && buf.readUInt32LE(pos) !== 0x06054b50) pos--;
const cdOffset = buf.readUInt32LE(pos + 16);
const cdCount = buf.readUInt16LE(pos + 10);
let cdPos = cdOffset;
const zlib = require('zlib');

for (let i = 0; i < cdCount; i++) {
  if (buf.readUInt32LE(cdPos) !== 0x02014b50) break;
  const method = buf.readUInt16LE(cdPos + 10);
  const compSize = buf.readUInt32LE(cdPos + 20);
  const nameLen = buf.readUInt16LE(cdPos + 28);
  const extraLen = buf.readUInt16LE(cdPos + 30);
  const commentLen = buf.readUInt16LE(cdPos + 32);
  const localHeaderOffset = buf.readUInt32LE(cdPos + 42);
  const name = buf.toString('utf8', cdPos + 46, cdPos + 46 + nameLen);
  
  if (name === 'AndroidManifest.xml') {
    const lhNameLen = buf.readUInt16LE(localHeaderOffset + 26);
    const lhExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
    const dataOffset = localHeaderOffset + 30 + lhNameLen + lhExtraLen;
    const compData = buf.subarray(dataOffset, dataOffset + compSize);
    let data = method === 0 ? compData : zlib.inflateRawSync(compData);
    const strings = parseAxml(data);
    console.log('Package and activities in Curie.apk:');
    console.log(strings.filter(s => s.includes('curie') || s.includes('stablemoney') || s.includes('Activity')));
    break;
  }
  cdPos += 46 + nameLen + extraLen + commentLen;
}
