const fs = require('fs');

async function downloadWebAssets() {
  try {
    const cssRes = await fetch('https://bachatpay.co/assets/index-COUFQqDj.css');
    const css = await cssRes.text();
    fs.writeFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\bachatpay\\web_index.css', css);
    console.log('Saved web_index.css, length:', css.length);

    // Find all url(...) in CSS
    const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/['"]/g, ''));
    console.log('URLs in CSS:', [...new Set(urls)]);

    const jsRes = await fetch('https://bachatpay.co/assets/index-DJpDsWO0.js');
    const js = await jsRes.text();
    fs.writeFileSync('c:\\Users\\nirod\\OneDrive\\Desktop\\REA\\public\\assets\\bachatpay\\web_index.js', js);
    console.log('Saved web_index.js, length:', js.length);

    // Find all asset paths in JS like /assets/... or images
    const assetMatches = [...js.matchAll(/["'](\/assets\/[^"']+)["']/g)].map(m => m[1]);
    console.log('Assets in JS:', [...new Set(assetMatches)]);

  } catch (e) {
    console.error('Error downloading:', e);
  }
}

downloadWebAssets();
