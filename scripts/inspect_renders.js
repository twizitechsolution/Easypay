const fs = require('fs');
const content = fs.readFileSync('public/admin.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function renderMallProducts') || l.includes('function renderCustomerOrders') || l.includes('function renderDiscountCoupons')) {
    console.log(i + 1, l.trim());
    console.log(lines.slice(i, i + 50).join('\n'));
  }
});
