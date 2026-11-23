const fs = require('fs');
const content = fs.readFileSync('public/admin.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="tabProducts"') || l.includes('id="tabOrders"') || l.includes('id="tabCoupons"') || l.includes('id="tabUsers"') || l.includes('id="tabLedger"')) {
    console.log('--- LINE', i + 1, '---');
    console.log(lines.slice(i, i + 30).join('\n'));
  }
});
