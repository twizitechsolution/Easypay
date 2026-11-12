const fs = require('fs');
const html = fs.readFileSync('public/app.html', 'utf8');

// 1. switchNavTab implementation
const sIdx = html.indexOf('function switchNavTab');
console.log('--- switchNavTab ---');
console.log(html.substring(sIdx, sIdx + 1200));

// 2. Bottom nav buttons
const navIdx = html.indexOf('<nav class="app-bottom-nav"');
console.log('--- app-bottom-nav ---');
console.log(html.substring(navIdx, navIdx + 1000));
