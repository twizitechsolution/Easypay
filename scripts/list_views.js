const fs = require('fs');
const app = fs.readFileSync('public/app.html', 'utf8');
const lines = app.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="view')) {
    console.log((i+1) + ': ' + l.trim().slice(0, 120));
  }
});
