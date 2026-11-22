const fs = require('fs');
const content = fs.readFileSync('public/app.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('7013893165')) {
    console.log(i + 1, l.trim());
  }
});
