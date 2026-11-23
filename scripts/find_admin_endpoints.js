const fs = require('fs');
const content = fs.readFileSync('server/server.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes("url.startsWith('/api/admin/')") || l.includes("url === '/api/admin/products/add'")) {
    console.log(i + 1, l.trim());
  }
});
