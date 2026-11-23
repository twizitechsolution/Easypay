const fs = require('fs');
const app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

const brokenStr = "usdtEq.innerHTML = 'Equivalent Amount: <span style=\"color:#097939;\">~";
console.log('brokenStr index:', app.indexOf(brokenStr));

const startMarker = '// 1. PROFILE PICTURE UPLOAD & SYNC (Screenshot 2 Request)';
const endMarker = 'window.openProductDetails = openProductDetails;';

console.log('startMarker:', app.indexOf(startMarker));
console.log('endMarker:', app.indexOf(endMarker));
