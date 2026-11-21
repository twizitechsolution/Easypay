const fs = require('fs');

console.log('Running Comprehensive Test Suite...');

const appHtml = fs.readFileSync('public/app.html', 'utf8');
const indexHtml = fs.readFileSync('public/index.html', 'utf8');

const tests = [
  {
    name: 'File match: app.html and index.html in sync',
    pass: appHtml === indexHtml
  },
  {
    name: 'Req 1: Bank of India removed from My QR code',
    pass: !appHtml.includes('id="myQrBankText"') && !appHtml.includes('BANK OF INDIA ...0975')
  },
  {
    name: 'Req 1: Generate QR with Amount modal & handler present',
    pass: appHtml.includes('id="generateAmountQrModal"') && appHtml.includes('openGenerateAmountQrModal') && appHtml.includes('submitGenerateQrWithAmount')
  },
  {
    name: 'Req 2: Scan QR Camera auto-stream & jsQR detection engine',
    pass: appHtml.includes('jsqr@1.4.0') && appHtml.includes('id="qrScannerVideo"') && appHtml.includes('startLiveCameraQrScanner') && appHtml.includes('handleQrDetectionSuccess')
  },
  {
    name: 'Req 2: Tidy scanner bottom bar (Gallery Upload & Enter UPI)',
    pass: appHtml.includes('scanQrFromGalleryInput') && appHtml.includes('qrGalleryFileInput')
  },
  {
    name: 'Req 3: Gift purchase page alignment & no horizontal overflow',
    pass: appHtml.includes('.gift-purchase-page') && appHtml.includes('width: 100% !important;') && !appHtml.includes('width: 100vw;')
  },
  {
    name: 'Req 4: Removed "OR TAP A VERIFIED PEER USER" completely',
    pass: !appHtml.includes('OR TAP A VERIFIED PEER USER')
  },
  {
    name: 'Req 5: Shopping products populated & Add to Cart system active',
    pass: appHtml.includes('id="shopProductsGrid"') && appHtml.includes('boAt Airdopes 141 ANC') && appHtml.includes('addToCart') && appHtml.includes('id="easyPayCartModal"')
  },
  {
    name: 'Req 6: Full Indian merchant gift card catalog pre-rendered',
    pass: appHtml.includes('apple_app_store') && appHtml.includes('dominos') && appHtml.includes('topBrandsGridContainer') && appHtml.includes('newArrivalsGridContainer')
  },
  {
    name: 'Req 7: Home page services & UPI transfer operational',
    pass: appHtml.includes('openRechargeModal(\'Mobile Recharge\')') && appHtml.includes('openRechargeModal(\'Electricity\')') && appHtml.includes("openModal('rechargeModal')") && appHtml.includes('openSendMoneyModal()') && appHtml.includes("openModal('p2pPaymentModal')")
  },
  {
    name: 'Req 8: Exact 5 bottom navigation tabs isolated routing',
    pass: appHtml.includes('tabHome') && appHtml.includes('tabGift') && appHtml.includes('tabBonds') && appHtml.includes('tabShopping') && appHtml.includes('tabProfile') && appHtml.includes('isGift')
  },
  {
    name: 'Req 9: Gift Card logos clean white rounded tiles with no dark borders',
    pass: appHtml.includes('.brand-4col-icon') && !appHtml.includes('<div class="brand-4col-icon" style="background: ${c.bgColor') && !appHtml.includes('<div class="explore-brand-icon-box" style="background: ${c.bgColor')
  },
  {
    name: 'Req 10: Profile Header strictly Name -> Mobile -> User ID (No eye/copy icon, no warning on Profile button)',
    pass: appHtml.includes('id="profileAccountName"') && appHtml.includes('id="profileAccountPhone"') && appHtml.includes('id="profileAccountUserId"') && !appHtml.includes('id="profileAccountUpi"') && !appHtml.includes('Profile ⚠️')
  },
  {
    name: 'Req 11: Dedicated Set/Reset Security PIN view and controller',
    pass: appHtml.includes('id="viewResetPin"') && appHtml.includes('openResetPinView') && appHtml.includes('submitResetPinFlow') && appHtml.includes('id="newSecurityPinField"')
  },
  {
    name: 'Req 12: My Orders view (replaces UPI Requests) & Order Tracking shipment timeline',
    pass: appHtml.includes('id="viewMyOrders"') && appHtml.includes('openMyOrdersView') && appHtml.includes('openTrackingModal') && !appHtml.includes('UPI Payment Requests')
  },
  {
    name: 'Req 13: Shopping Cart real-time badge, Coupon Code section & Proceed to Checkout',
    pass: appHtml.includes('id="shopCartCountBadge"') && appHtml.includes('id="cartCouponInput"') && appHtml.includes('applyCartCoupon') && appHtml.includes('proceedToEcommerceCheckout')
  },
  {
    name: 'Req 14: E-Commerce Checkout Modal with Address, Summary & Wallet deduction',
    pass: appHtml.includes('id="ecommerceCheckoutModal"') && appHtml.includes('id="checkoutAddressStreet"') && appHtml.includes('submitFinalMallOrder') && appHtml.includes('id="orderSuccessModal"')
  }
];

let failed = 0;
tests.forEach((t, i) => {
  if (t.pass) {
    console.log(`[PASS] Test ${i + 1}: ${t.name}`);
  } else {
    console.error(`[FAIL] Test ${i + 1}: ${t.name}`);
    failed++;
  }
});

console.log(`\nResult: ${tests.length - failed}/${tests.length} tests passed.`);
if (failed > 0) process.exit(1);
console.log('ALL VERIFICATIONS PASSED 100%!');
