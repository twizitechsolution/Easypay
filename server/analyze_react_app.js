const fs = require('fs');

const js = fs.readFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\index-DJpDsWO0.js', 'utf8');

// Look for createBrowserRouter or RouterProvider or Routes
const routerMatch = js.match(/createBrowserRouter\(\[.*?\]\)/s);
if (routerMatch) {
  console.log('Found createBrowserRouter:', routerMatch[0].substring(0, 500));
} else {
  console.log('No createBrowserRouter found');
}

// Find all routes in format {path: "...", element: ...}
const routeRegex = /\{path:"([^"]+)",(?:element:([a-zA-Z0-9$_]+)|children:\[(.*?)\])/g;
let m;
console.log('Routes in bundle:');
while ((m = routeRegex.exec(js)) !== null) {
  console.log('Route path:', m[1]);
}

// Let's also look for text content in JSX
const textSamples = [...js.matchAll(/children:"([^"]{10,80})"/g)].map(m => m[1]);
console.log('\nSample JSX children (30):');
console.log([...new Set(textSamples)].slice(0, 30));
