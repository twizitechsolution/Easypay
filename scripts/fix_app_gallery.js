const fs = require('fs');

let app = fs.readFileSync('public/app.html', 'utf8');

// 1. Add #productDetailGalleryRow right under #productDetailImg hero div
const targetHero = '<img id="productDetailImg" src="" style="max-height: 260px; max-width: 100%; object-fit: contain; border-radius: 16px;" alt="Product">\r\n          <span id="productDetailBadge" style="position: absolute; top: 16px; left: 16px; background: #059669; color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px;">Best Seller</span>\r\n        </div>';

const targetHeroLF = '<img id="productDetailImg" src="" style="max-height: 260px; max-width: 100%; object-fit: contain; border-radius: 16px;" alt="Product">\n          <span id="productDetailBadge" style="position: absolute; top: 16px; left: 16px; background: #059669; color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px;">Best Seller</span>\n        </div>';

const replacementHero = `<img id="productDetailImg" src="" style="max-height: 260px; max-width: 100%; object-fit: contain; border-radius: 16px;" alt="Product">
          <span id="productDetailBadge" style="position: absolute; top: 16px; left: 16px; background: #059669; color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px;">Best Seller</span>
        </div>

        <!-- Multi-Angle Photography Thumbnail Carousel (Screenshot 1 Request) -->
        <div id="productDetailGalleryRow" style="display: flex; gap: 10px; justify-content: center; align-items: center; padding: 8px 16px 14px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <!-- Dynamically populated by JS: angle thumbnails -->
        </div>`;

if (app.includes(targetHero)) {
  app = app.replace(targetHero, replacementHero);
  console.log('Added productDetailGalleryRow (CRLF matched)');
} else if (app.includes(targetHeroLF)) {
  app = app.replace(targetHeroLF, replacementHero);
  console.log('Added productDetailGalleryRow (LF matched)');
} else {
  console.log('Could not find targetHero');
}

// 2. Add gallery population in openProductDetails
const targetPopCRLF = `      if (imgEl) imgEl.src = p.img || p.image;\r\n      if (badgeEl) badgeEl.innerText = p.badge || (p.discount || 'Special Offer');`;
const targetPopLF = `      if (imgEl) imgEl.src = p.img || p.image;\n      if (badgeEl) badgeEl.innerText = p.badge || (p.discount || 'Special Offer');`;

const replacementPop = `      if (imgEl) imgEl.src = p.img || p.image;
      if (badgeEl) badgeEl.innerText = p.badge || (p.discount || 'Special Offer');

      // Populate Multi-Angle Photography Thumbnails (Screenshot 1 Request)
      const galleryRow = document.getElementById('productDetailGalleryRow');
      if (galleryRow) {
        const prodImages = Array.isArray(p.images) && p.images.length > 0 
          ? p.images.filter(Boolean) 
          : [p.img || p.image].filter(Boolean);
        
        if (prodImages.length > 1) {
          galleryRow.style.display = 'flex';
          galleryRow.innerHTML = prodImages.map((imgSrc, idx) => \`
            <div class="prod-thumb-slot \${idx === 0 ? 'active' : ''}" onclick="switchProductDetailImage('\${imgSrc}', this)" style="width: 52px; height: 52px; border-radius: 10px; border: 2.5px solid \${idx === 0 ? '#2563EB' : '#CBD5E1'}; overflow: hidden; background: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
              <img src="\${imgSrc}" style="width: 100%; height: 100%; object-fit: contain;" alt="Angle \${idx + 1}">
            </div>
          \`).join('');
        } else {
          galleryRow.style.display = 'none';
        }
      }`;

if (app.includes(targetPopCRLF)) {
  app = app.replace(targetPopCRLF, replacementPop);
  console.log('Added gallery population (CRLF matched)');
} else if (app.includes(targetPopLF)) {
  app = app.replace(targetPopLF, replacementPop);
  console.log('Added gallery population (LF matched)');
} else {
  console.log('Could not find targetPop');
}

fs.writeFileSync('public/app.html', app, 'utf8');
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Saved app.html and synced byte-for-byte to index.html!');
