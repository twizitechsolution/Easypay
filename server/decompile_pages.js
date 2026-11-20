const fs = require('fs');

const js = fs.readFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\index-DJpDsWO0.js', 'utf8');

const pages = [
  { name: 'Home', symbol: 'cr' },
  { name: 'AboutUs', symbol: 'lr' },
  { name: 'Careers', symbol: 'ur' },
  { name: 'Press', symbol: 'dr' },
  { name: 'Blog', symbol: 'fr' },
  { name: 'PrivacyPolicy', symbol: 'pr' },
  { name: 'Terms', symbol: 'yr' },
  { name: 'Refund', symbol: 'mr' },
  { name: 'RewardsTerms', symbol: 'hr' },
  { name: 'PartnerOffersTerms', symbol: 'gr' },
  { name: 'AccountDataDeletion', symbol: 'vr' },
  { name: 'GrievanceRedressal', symbol: '_r' },
  { name: 'Help', symbol: 'xr' },
  { name: 'Contact', symbol: 'Sr' },
  { name: 'PartnerWithUs', symbol: 'Er' },
  { name: 'ApiDocs', symbol: 'Ar' }
];

for (const p of pages) {
  // Find "function symbol(" or "symbol=()=>" or "const symbol="
  const regex = new RegExp(`(?:function\\s+${p.symbol}\\b|\\b${p.symbol}\\s*=\\s*\\()`);
  const match = js.match(regex);
  if (match) {
    const idx = match.index;
    const snippet = js.substring(idx, idx + 800);
    console.log(`=== PAGE: ${p.name} (${p.symbol}) ===`);
    // Extract any readable text
    const textOnly = snippet.match(/["'`]([^"'`]{5,100})["'`]/g) || [];
    console.log(textOnly.slice(0, 10).join(' | '));
  }
}
