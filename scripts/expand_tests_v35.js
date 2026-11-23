const fs = require('fs');

let suite = fs.readFileSync('test_suite.js', 'utf8');

const additionalTests = `
// --- Req 35: Admin Product Multi-Angle Photography Upload & Previews ---
const adminContent = fs.readFileSync('public/admin.html', 'utf8');
const hasMultiAngleAdmin = adminContent.includes('id="productImageInput1"') && 
                           adminContent.includes('id="fileSlot1"') && 
                           adminContent.includes('id="previewImg1"') && 
                           adminContent.includes('handleAngleFileUpload');
assert(hasMultiAngleAdmin, 'Req 35: Admin Product Modal multi-angle photography upload slots and previews');

// --- Req 36: Admin User Details Button & Comprehensive Dossier Modal ---
const hasUserDetailsBtnAndModal = adminContent.includes('openUserDetailsModal(') && 
                                  adminContent.includes('id="modalUserDetails"') && 
                                  adminContent.includes('id="dossierFieldPassword"') && 
                                  adminContent.includes('id="dossierDownlineTbody"');
assert(hasUserDetailsBtnAndModal, 'Req 36: Admin User Details button and comprehensive dossier modal with credentials & downline');

// --- Req 37: Admin Full-Width Enterprise Tables ---
const hasEnterpriseTables = !adminContent.includes('class="admin-table"') && 
                            adminContent.includes('id="adminProductsTableBody"') && 
                            adminContent.includes('id="adminOrdersTableBody"') && 
                            adminContent.includes('id="adminCouponsTableBody"');
assert(hasEnterpriseTables, 'Req 37: Admin full-width enterprise-table across products, orders, and coupons');

// --- Req 38: Admin Real-Time Transactions Ledger ---
const hasLedgerSearchFilter = adminContent.includes('id="ledgerSearchInput"') && 
                              adminContent.includes('id="ledgerFilterPills"') && 
                              adminContent.includes('formatAdminTimestamp');
assert(hasLedgerSearchFilter, 'Req 38: Admin financial ledger search, category filter pills, and formatted timestamps');

// --- Req 39: Client App Multi-Angle Product Gallery ---
const appContent = fs.readFileSync('public/app.html', 'utf8');
const hasAppGallery = appContent.includes('id="productDetailGalleryRow"') && 
                      appContent.includes('switchProductDetailImage');
assert(hasAppGallery, 'Req 39: Client App multi-angle product thumbnail gallery');
`;

if (!suite.includes('Req 35')) {
  suite = suite.replace(
    `console.log('\\nResult: ' + passedCount + '/' + totalCount + ' tests passed.');`,
    additionalTests + `\nconsole.log('\\nResult: ' + passedCount + '/' + totalCount + ' tests passed.');`
  );
  fs.writeFileSync('test_suite.js', suite, 'utf8');
  console.log('Appended Req 35-39 tests to test_suite.js');
}
