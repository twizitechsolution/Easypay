const fs = require('fs');
const admin = fs.readFileSync('public/admin.html', 'utf8');
const lines = admin.split('\n');
console.log(lines.slice(3050, 3100).join('\n'));
