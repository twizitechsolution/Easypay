const fs = require('fs');
const content = fs.readFileSync('public/admin.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('modalProduct') || l.includes('openAddProductModal') || l.includes('openEditProductModal') || l.includes('prodImgUrl')) {
    console.log(i + 1, l.trim());
    console.log(lines.slice(i, i + 35).join('\n'));
  }
});
