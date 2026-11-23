const fs = require('fs');
const admin = fs.readFileSync('public/admin.html', 'utf8');
const lines = admin.split('\n');

lines.forEach((l, i) => {
  if (l.includes("switchTab('transactions')")) {
    console.log('Sidebar transactions button line:', i + 1);
    console.log(lines.slice(i - 2, i + 8).join('\n'));
  }
  if (l.includes('id="tabTransactions"')) {
    console.log('tabTransactions line:', i + 1);
    console.log(lines.slice(i, i + 15).join('\n'));
  }
});
