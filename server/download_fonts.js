const fs = require('fs');
const path = require('path');

const files = [
  'favicon.png',
  'assets/fa-brands-400-BP5tdqmh.woff2',
  'assets/fa-regular-400-nyy7hhHF.woff2',
  'assets/fa-solid-900-DRAAbZTg.woff2'
];

async function getFiles() {
  for (const f of files) {
    try {
      const url = `https://bachatpay.co/${f}`;
      const res = await fetch(url);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        const dest = path.join('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public', f);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, buf);
        console.log('Saved', f, 'bytes:', buf.length);
      } else {
        console.log('Failed to fetch', f, res.status);
      }
    } catch (e) {
      console.log('Error for', f, e.message);
    }
  }
}

getFiles();
