const fs = require('fs');
const content = fs.readFileSync('public/admin.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.panel-card') || l.includes('.tab-view-content')) {
    console.log(i + 1, l.trim());
    console.log(lines.slice(i, i + 15).join('\n'));
  }
});
