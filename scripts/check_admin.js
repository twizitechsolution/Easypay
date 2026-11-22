const fs = require('fs');
let admin = fs.readFileSync('public/admin.html', 'utf8');

admin = admin.replace(
  '<title>EasyPay Enterprise — Control & Orchestration Center</title>',
  '<title>EasyPay Admin Login — Control Console</title>'
);

fs.writeFileSync('public/admin.html', admin, 'utf8');
console.log('Checked and updated public/admin.html title');
