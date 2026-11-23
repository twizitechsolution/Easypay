const fs = require('fs');

let admin = fs.readFileSync('public/admin.html', 'utf8');

// Update openAddProductModal to call resetProductImageSlots()
admin = admin.replace(
  `      document.getElementById('productFeaturesInput').value = '';\n      openModal('modalProduct');`,
  `      document.getElementById('productFeaturesInput').value = '';\n      resetProductImageSlots();\n      openModal('modalProduct');`
);

// Update openEditProductModal to populate slots from p.images
const editTarget = `      document.getElementById('productFeaturesInput').value = (p.features || []).join('\\n');\n      openModal('modalProduct');`;
const editReplacement = `      document.getElementById('productFeaturesInput').value = (p.features || []).join('\\n');
      resetProductImageSlots();
      const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || p.img].filter(Boolean);
      imgs.slice(0, 3).forEach((imgUrl, idx) => {
        setAngleSlotImage(idx + 1, imgUrl);
      });
      openModal('modalProduct');`;

if (admin.includes(editTarget)) {
  admin = admin.replace(editTarget, editReplacement);
  console.log('Successfully updated openEditProductModal to load multi-angle gallery images');
} else {
  console.log('Target for openEditProductModal not found');
}

fs.writeFileSync('public/admin.html', admin, 'utf8');
console.log('Done updating openAddProductModal and openEditProductModal!');
