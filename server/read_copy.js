const fs = require('fs');

const js = fs.readFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\index-DJpDsWO0.js', 'utf8');

// Find where `cr=` is defined and find its return statement
const crMatch = js.match(/function\s+cr\(\)|const\s+cr\s*=\s*\(\)|let\s+cr\s*=\s*\(\)|cr\s*=\s*\(\)\s*=>/);
console.log('cr match:', crMatch);

// Let's find all text strings in the file that look like marketing copy or app copy
const copyStrings = [...js.matchAll(/children:\s*(?:\[|\()?["'`]([A-Z0-9][^"'`]{8,120})["'`]/g)].map(m => m[1]);
console.log('Copy strings found (first 50):');
console.log([...new Set(copyStrings)].slice(0, 50));
