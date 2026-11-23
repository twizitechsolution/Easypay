const fs = require('fs');
const content = fs.readFileSync('public/admin.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.admin-table-wrap') || l.includes('.admin-table') || l.includes('.card-head')) {
    console.log(i + 1, l.trim());
  }
});
