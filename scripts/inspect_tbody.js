const fs = require('fs');
const content = fs.readFileSync('public/admin.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('adminProductsTableBody') || l.includes('adminOrdersTableBody') || l.includes('adminCouponsTableBody')) {
    console.log(i + 1, l.trim());
    console.log(lines.slice(i, i + 30).join('\n'));
  }
});
