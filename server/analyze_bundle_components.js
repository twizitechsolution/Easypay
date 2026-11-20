const fs = require('fs');

const js = fs.readFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\bachatpay\\web_index.js', 'utf8');

// Find all JSX text strings and headings
const strings = [...js.matchAll(/"([^"\\]{4,80})"/g)].map(m => m[1]);

// Let's search specifically for terms like "Home", "Products", "Gift Cards", "Recharge", "Partners", "Bachat"
const interesting = strings.filter(s => 
  s.toLowerCase().includes('bachat') ||
  s.toLowerCase().includes('recharge') ||
  s.toLowerCase().includes('gift') ||
  s.toLowerCase().includes('card') ||
  s.toLowerCase().includes('partner') ||
  s.toLowerCase().includes('cashback') ||
  s.toLowerCase().includes('save') ||
  s.toLowerCase().includes('upi') ||
  s.toLowerCase().includes('wallet') ||
  s.toLowerCase().includes('bbps') ||
  s.toLowerCase().includes('cibil') ||
  s.toLowerCase().includes('policy') ||
  s.toLowerCase().includes('term') ||
  s.toLowerCase().includes('contact') ||
  s.toLowerCase().includes('faq') ||
  s.toLowerCase().includes('about')
);

console.log('Total interesting strings:', interesting.length);
console.log('Sample interesting strings:');
console.log([...new Set(interesting)].slice(0, 80));
