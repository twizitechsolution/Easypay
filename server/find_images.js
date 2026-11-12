const fs = require('fs');

const js = fs.readFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\index-DJpDsWO0.js', 'utf8');

// Find all image URLs (.png, .jpg, .svg, .webp)
const imgRegex = /["']([^"']+\.(?:png|jpg|jpeg|svg|webp|gif))["']/g;
const images = [];
let m;
while ((m = imgRegex.exec(js)) !== null) {
  images.push(m[1]);
}
console.log('Images in index-DJpDsWO0.js:');
console.log([...new Set(images)]);

// Find all fetch or axios or api calls
const fetchRegex = /fetch\s*\(\s*["'`]([^"'`]+)["'`]/g;
const fetches = [];
while ((m = fetchRegex.exec(js)) !== null) {
  fetches.push(m[1]);
}
console.log('\nFetches in index-DJpDsWO0.js:', [...new Set(fetches)]);
