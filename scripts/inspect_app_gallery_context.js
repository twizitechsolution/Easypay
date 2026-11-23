const fs = require('fs');
const app = fs.readFileSync('public/app.html', 'utf8');
const idx = app.indexOf('id="productDetailImg"');
console.log('Index:', idx);
if (idx !== -1) {
  console.log(app.slice(idx - 150, idx + 250));
}

const fnIdx = app.indexOf('function openProductDetails(');
console.log('fnIdx:', fnIdx);
if (fnIdx !== -1) {
  console.log(app.slice(fnIdx, fnIdx + 500));
}
