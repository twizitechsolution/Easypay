const fs = require('fs');
const content = fs.readFileSync('public/app.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function openAddNewPaymentDetailsModal')) {
    console.log(lines.slice(i, i + 35).join('\n'));
  }
});
