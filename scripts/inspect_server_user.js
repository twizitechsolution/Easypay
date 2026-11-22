const fs = require('fs');
const content = fs.readFileSync('server/server.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes("url === '/api/data'") || l.includes("url === '/api/user/profile'")) {
    console.log(i + 1, lines.slice(i, i + 20).join('\n'));
  }
});
