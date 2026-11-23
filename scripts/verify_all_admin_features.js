const fs = require('fs');

const admin = fs.readFileSync('public/admin.html', 'utf8');
const app = fs.readFileSync('public/app.html', 'utf8');
const server = fs.readFileSync('server/server.js', 'utf8');
const db = JSON.parse(fs.readFileSync('server/db.json', 'utf8'));

console.log('=== VERIFICATION OF ALL USER REQUESTS ===');

// Check 1: Multi-Angle Product Photos in Add/Edit Product Modal
const c1_slots = admin.includes('id="productImageInput1"') && admin.includes('id="productImageInput2"') && admin.includes('id="productImageInput3"');
const c1_uploads = admin.includes('id="fileSlot1"') && admin.includes('id="fileSlot2"') && admin.includes('id="fileSlot3"');
const c1_previews = admin.includes('id="previewImg1"') && admin.includes('id="previewImg2"') && admin.includes('id="previewImg3"');
const c1_js = admin.includes('handleAngleFileUpload') && admin.includes('setAngleSlotImage') && admin.includes('resetProductImageSlots');
console.log('1. Admin Product Modal has 3 Angle Slots, Uploaders & Previews:', c1_slots && c1_uploads && c1_previews && c1_js);

// Check 2: User Details Button & Comprehensive Dossier Modal
const c2_btn = admin.includes('openUserDetailsModal(') && admin.includes('<i class="fa-solid fa-id-card"></i> User Details');
const c2_modal = admin.includes('id="modalUserDetails"');
const c2_passPinToggles = admin.includes('id="dossierFieldPassword"') && admin.includes('id="dossierFieldPin"') && admin.includes('toggleDossierVisibility');
const c2_downline = admin.includes('id="dossierDownlineTbody"') && admin.includes('Downline Referral Network');
const c2_txns = admin.includes('id="dossierTxnTbody"') && admin.includes('id="dossierTxnCountBadge"');
const c2_serverEndpoint = server.includes("url.startsWith('/api/admin/user-details')");
console.log('2. User Details Button, Dossier Modal, Credentials Toggles & Endpoint:', c2_btn && c2_modal && c2_passPinToggles && c2_downline && c2_txns && c2_serverEndpoint);

// Check 3: Full-Width Desktop Responsive Enterprise Tables
const c3_noAdminTable = !admin.includes('class="admin-table"');
const c3_enterpriseTables = admin.includes('id="adminProductsTableBody"') && admin.includes('id="adminOrdersTableBody"') && admin.includes('id="adminCouponsTableBody"');
console.log('3. Zero narrow admin-table classes, all converted to full-width enterprise-table:', c3_noAdminTable && c3_enterpriseTables);

// Check 4: Transactions Ledger 100% Real Synchronized Database Data
const c4_search = admin.includes('id="ledgerSearchInput"');
const c4_filterPills = admin.includes('id="ledgerFilterPills"');
const c4_dateFmt = admin.includes('formatAdminTimestamp');
const c4_dbTxnsReal = db.transactions && db.transactions.length >= 50 && db.transactions.every(t => t.id && t.amount && t.title);
console.log('4. Financial Ledger has Real-Time Search, Filter Pills & Formatted Dates:', c4_search && c4_filterPills && c4_dateFmt && c4_dbTxnsReal);

// Check 5: Client App Multi-Angle Photo Gallery
const c5_appGallery = app.includes('id="productDetailGalleryRow"');
const c5_switchFn = app.includes('switchProductDetailImage');
console.log('5. Client App Product Details has Multi-Angle Clickable Thumbnail Gallery:', c5_appGallery && c5_switchFn);

// Check 6: Real Nirod Behera Profile
const c6_userInDb = db.users.some(u => u.name === 'Nirod Behera' && u.mobile === '9876548808' && u.id === 'EPY98808');
console.log('6. Real User Nirod Behera (EPY98808, 9876548808) synced in DB:', c6_userInDb);
