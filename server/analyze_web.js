const fs = require('fs');

const text = fs.readFileSync('C:\\Users\\nirod\\.gemini\\antigravity\\brain\\f099e81c-34db-4403-9803-f7edcaf203ff\\scratch\\web_bundle.js', 'utf8');

// Find all routes
const routes = [...text.matchAll(/path:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('ALL ROUTES:', [...new Set(routes)]);

// Find all navigation links
const navLinks = [...text.matchAll(/to:\s*["'`]([^"'`]+)["'`]/g)].map(m => m[1]);
console.log('ALL NAV LINKS:', [...new Set(navLinks)]);

// Find all headings (h1, h2, h3, title)
const headings = [...text.matchAll(/["']([A-Z][a-zA-Z0-9\s,&?!.]{4,40})["']/g)].map(m => m[1]);
const uniqueHeadings = [...new Set(headings)].filter(h => 
  !h.startsWith('Node') && !h.startsWith('React') && !h.startsWith('Failed') && !h.startsWith('Expected')
);
console.log('SAMPLE HEADINGS & TEXT (first 50):', uniqueHeadings.slice(0, 50));
