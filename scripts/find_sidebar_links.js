const fs = require('fs');
const admin = fs.readFileSync('public/admin.html', 'utf8');
const lines = admin.split('\n');
lines.forEach((l, i) => {
  if (l.includes('switchTab(') || l.includes('tabUsers') || l.includes('tabTransactions') || l.includes('tabOrders')) {
    console.log(i + 1, l.trim());
  }
});
