const fs = require('fs');
const app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

const sIdx = 639445;
console.log('--- 500 chars before sIdx ---');
console.log(app.slice(sIdx - 500, sIdx));
