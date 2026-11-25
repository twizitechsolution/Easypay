const fs = require('fs');
const vm = require('vm');

let app = fs.readFileSync('public/app.html', 'utf8');

// 1. Fix Lucky Draw My Contests & Participants white text -> dark slate #0F172A
const ldListStart = app.indexOf('function renderLuckyDrawUI(data)');
const ldListEnd = app.indexOf('function startLuckyDrawTimer', ldListStart);
if (ldListStart !== -1 && ldListEnd !== -1) {
  let ldBlock = app.slice(ldListStart, ldListEnd);
  ldBlock = ldBlock.replace(/color:\s*#FFFFFF/gi, 'color: #0F172A');
  ldBlock = ldBlock.replace(/color:\s*#E2E8F0/gi, 'color: #0F172A');
  ldBlock = ldBlock.replace(/background:\s*rgba\(255,255,255,0\.0[3-9]\)/gi, 'background: #F8FAFC');
  ldBlock = ldBlock.replace(/border:\s*1px solid rgba\(255,255,255,0\.[0-9]+\)/gi, 'border: 1px solid #E2E8F0');
  app = app.slice(0, ldListStart) + ldBlock + app.slice(ldListEnd);
}

// 2. Fix successMaturity in executeBondBooking
app = app.replace(
  "if (document.getElementById('successPrincipal')) {\n            document.getElementById('successPrincipal').innerText = '₹' + amt.toLocaleString('en-IN', { minimumFractionDigits: 2 });\n          }",
  "if (document.getElementById('successPrincipal')) {\n            document.getElementById('successPrincipal').innerText = '₹' + amt.toLocaleString('en-IN', { minimumFractionDigits: 2 });\n          }\n          if (document.getElementById('successMaturity') && data.investment) {\n            document.getElementById('successMaturity').innerText = '₹' + Number(data.investment.maturityAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });\n          }"
);

// Validate scripts
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = scriptRegex.exec(app)) !== null) {
  new vm.Script(m[1]);
}

fs.writeFileSync('public/app.html', app, 'utf8');
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Polished Lucky Draw contrast & Bond Success Maturity');
