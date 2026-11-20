const fs = require('fs');

const js = fs.readFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\index-DJpDsWO0.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('path:', pos)) !== -1) {
  console.log('--- MATCH AT', pos, '---');
  console.log(js.substring(pos - 40, pos + 120));
  pos += 10;
}
