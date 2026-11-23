const fs = require('fs');

let suite = fs.readFileSync('test_suite.js', 'utf8');

const anchor = `  {
    name: 'Req 34: Bank Accounts and My Orders headers are strictly constrained to mobile responsive 480px',
    pass: appHtml.includes('<!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->') &&
          appHtml.includes('Segmented Tab Bar (Mobile Responsive Centered Max-Width 480px)')
  }`;

const additions = `  {
    name: 'Req 34: Bank Accounts and My Orders headers are strictly constrained to mobile responsive 480px',
    pass: appHtml.includes('<!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->') &&
          appHtml.includes('Segmented Tab Bar (Mobile Responsive Centered Max-Width 480px)')
  },
  {
    name: 'Req 35: Admin Product Modal multi-angle photography upload slots and previews',
    pass: fs.readFileSync('public/admin.html', 'utf8').includes('id="productImageInput1"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="fileSlot1"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="previewImg1"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('handleAngleFileUpload')
  },
  {
    name: 'Req 36: Admin User Details button and comprehensive dossier modal with credentials & downline',
    pass: fs.readFileSync('public/admin.html', 'utf8').includes('openUserDetailsModal(') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="modalUserDetails"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="dossierFieldPassword"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="dossierDownlineTbody"')
  },
  {
    name: 'Req 37: Admin full-width enterprise-table across products, orders, and coupons',
    pass: !fs.readFileSync('public/admin.html', 'utf8').includes('class="admin-table"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="adminProductsTableBody"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="adminOrdersTableBody"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="adminCouponsTableBody"')
  },
  {
    name: 'Req 38: Admin financial ledger search, category filter pills, and formatted timestamps',
    pass: fs.readFileSync('public/admin.html', 'utf8').includes('id="ledgerSearchInput"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('id="ledgerFilterPills"') &&
          fs.readFileSync('public/admin.html', 'utf8').includes('formatAdminTimestamp')
  },
  {
    name: 'Req 39: Client App multi-angle product thumbnail gallery',
    pass: appHtml.includes('id="productDetailGalleryRow"') &&
          appHtml.includes('switchProductDetailImage')
  }`;

if (suite.includes(anchor) && !suite.includes('Req 35:')) {
  suite = suite.replace(anchor, additions);
  fs.writeFileSync('test_suite.js', suite, 'utf8');
  console.log('Successfully updated tests array in test_suite.js');
}
