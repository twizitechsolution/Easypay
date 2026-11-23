const fs = require('fs');

let app = fs.readFileSync('public/app.html', 'utf8');

// 1. Add #productDetailGalleryRow right under #productDetailImg hero div
const oldImgHero = `        <!-- Product Image Hero -->
        <div style="position: relative; background: #F8FAFC; text-align: center; padding: 24px 16px; border-bottom: 1px solid #E2E8F0;">
          <img id="productDetailImg" src="" style="max-height: 260px; max-width: 100%; object-fit: contain; border-radius: 16px;" alt="Product">
          <span id="productDetailBadge" style="position: absolute; top: 16px; left: 16px; background: #059669; color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px;">Best Seller</span>
        </div>`;

const newImgHero = `        <!-- Product Image Hero -->
        <div style="position: relative; background: #F8FAFC; text-align: center; padding: 24px 16px 12px; border-bottom: none;">
          <img id="productDetailImg" src="" style="max-height: 260px; max-width: 100%; object-fit: contain; border-radius: 16px;" alt="Product">
          <span id="productDetailBadge" style="position: absolute; top: 16px; left: 16px; background: #059669; color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 8px;">Best Seller</span>
        </div>

        <!-- Multi-Angle Photography Thumbnail Carousel (Screenshot 1 Request) -->
        <div id="productDetailGalleryRow" style="display: flex; gap: 10px; justify-content: center; align-items: center; padding: 8px 16px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0;">
          <!-- Dynamically populated by JS: angle thumbnails -->
        </div>`;

if (app.includes(oldImgHero)) {
  app = app.replace(oldImgHero, newImgHero);
  console.log('Added productDetailGalleryRow to app.html');
}

// 2. Add switchProductDetailImage and gallery rendering in openProductDetails
const oldOpenProdDetails = `      if (imgEl) imgEl.src = p.img || p.image;
      if (badgeEl) badgeEl.innerText = p.badge || (p.discount || 'Special Offer');`;

const newOpenProdDetails = `      if (imgEl) imgEl.src = p.img || p.image;
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

if (app.includes(oldOpenProdDetails)) {
  app = app.replace(oldOpenProdDetails, newOpenProdDetails);
  console.log('Added gallery population in openProductDetails');
}

// 3. Add switchProductDetailImage function definition
const switchFnCode = `
    function switchProductDetailImage(src, el) {
      const img = document.getElementById('productDetailImg');
      if (img) img.src = src;
      document.querySelectorAll('#productDetailGalleryRow .prod-thumb-slot').forEach(slot => {
        slot.style.borderColor = '#CBD5E1';
      });
      if (el) el.style.borderColor = '#2563EB';
    }
    window.switchProductDetailImage = switchProductDetailImage;
`;

if (!app.includes('function switchProductDetailImage')) {
  app = app.replace('window.openProductDetails = openProductDetails;', switchFnCode + '\n    window.openProductDetails = openProductDetails;');
  console.log('Added switchProductDetailImage function to app.html');
}

fs.writeFileSync('public/app.html', app, 'utf8');

// Also keep public/index.html 100% byte-for-byte identical
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Copied public/app.html byte-for-byte to public/index.html!');
