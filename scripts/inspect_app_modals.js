const fs = require('fs');
const app = fs.readFileSync('public/app.html', 'utf8');

console.log('App length:', app.length);
console.log('Contains profileEditModal:', app.includes('id="profileEditModal"'));
console.log('Contains addMoneyModal:', app.includes('id="addMoneyModal"'));
console.log('Contains saveProfileDetails:', app.includes('function saveProfileDetails'));
