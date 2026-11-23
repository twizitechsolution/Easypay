const fs = require('fs');
const content = fs.readFileSync('server/server.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(3130, 3210).join('\n'));
