const fs = require('fs');
const content = fs.readFileSync('server/server.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('/api/admin/products/add') || l.includes('/api/admin/products/update')) {
    console.log(i + 1, l.trim());
    console.log(lines.slice(i, i + 35).join('\n'));
  }
});
