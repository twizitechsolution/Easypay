const fs = require('fs');

let app = fs.readFileSync('public/app.html', 'utf8');

// Normalize line endings to \n
const isCrlf = app.includes('\r\n');
let norm = app.replace(/\r\n/g, '\n');

norm = norm.replaceAll('>arman khan<', '>Nirod Behera<');
norm = norm.replaceAll("'arman khan'", "'Nirod Behera'");
norm = norm.replaceAll('"arman khan"', '"Nirod Behera"');
norm = norm.replace('>AK<', '>NB<');
norm = norm.replace('>ak<', '>nb<');
norm = norm.replace('AK\n            </div>', 'NB\n            </div>');

if (isCrlf) {
  norm = norm.replace(/\n/g, '\r\n');
}

fs.writeFileSync('public/app.html', norm, 'utf8');
fs.writeFileSync('public/index.html', norm, 'utf8');
console.log('Successfully updated app.html and index.html');
