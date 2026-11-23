const fs = require('fs');
const app = fs.readFileSync('public/app.html', 'utf8');
const lines = app.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function saveProfileDetails') || l.includes('function syncUserProfileUI')) {
    console.log(i + 1, lines.slice(i, i + 50).join('\n'));
  }
});
