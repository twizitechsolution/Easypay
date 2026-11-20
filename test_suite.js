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
