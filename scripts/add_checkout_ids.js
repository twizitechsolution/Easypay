const fs = require('fs');

let html = fs.readFileSync('public/app.html', 'utf8');

html = html.replace(
  '<!-- Top Sticky Bar (Mobile Responsive Max-Width 480px) -->\r\n    <div style="background: #FFFFFF;',
  '<!-- Top Sticky Bar (Mobile Responsive Max-Width 480px) -->\r\n    <div id="checkoutTopBar" style="background: #FFFFFF;'
);

html = html.replace(
  '<!-- Bottom Sticky Bar (Mobile Responsive Centered Max-Width 480px) -->\r\n    <div style="position: fixed; bottom: 0;',
  '<!-- Bottom Sticky Bar (Mobile Responsive Centered Max-Width 480px) -->\r\n    <div id="checkoutBottomBar" style="position: fixed; bottom: 0;'
);

fs.writeFileSync('public/app.html', html, 'utf8');
fs.copyFileSync('public/app.html', 'public/index.html');
console.log('Added checkoutTopBar and checkoutBottomBar IDs and synced index.html');
