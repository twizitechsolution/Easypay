const fs = require('fs');
const content = fs.readFileSync('public/admin.html', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(770, 800).join('\n'));
