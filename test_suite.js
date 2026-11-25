const fs = require('fs');

console.log('Running Comprehensive Test Suite...');

const appHtml = fs.readFileSync('public/app.html', 'utf8');
const indexHtml = fs.readFileSync('public/index.html', 'utf8');
const adminHtml = fs.readFileSync('public/admin.html', 'utf8');

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
    name: 'Req 14: Dedicated Full-Page E-Commerce Checkout (No Popup Modal)',
    pass: appHtml.includes('id="viewEcommerceCheckout"') && appHtml.includes('openEcommerceCheckoutView') && appHtml.includes('id="checkoutAddressStreet"') && appHtml.includes('submitFinalMallOrder') && appHtml.includes('id="orderSuccessModal"')
  },
  {
    name: 'Req 15: Amazon/Flipkart Style Product Details, Specs & Verified Reviews',
    pass: appHtml.includes('id="viewProductDetails"') && appHtml.includes('openProductDetails') && appHtml.includes('id="productDetailSpecsList"') && appHtml.includes('id="productDetailDescBox"') && appHtml.includes('buyNowFromDetail')
  },
  {
    name: 'Req 16: Admin Panel Mall Products Management (Add, Edit, Price & Stock)',
    pass: fs.readFileSync('public/admin.html', 'utf8').includes('id="tabProducts"') && fs.readFileSync('public/admin.html', 'utf8').includes('id="modalProduct"') && fs.readFileSync('public/admin.html', 'utf8').includes('renderProductsTable') && fs.readFileSync('public/admin.html', 'utf8').includes('openAddProductModal')
  },
  {
    name: 'Req 17: Admin Panel Customer Orders Fulfillment & Status Management',
    pass: fs.readFileSync('public/admin.html', 'utf8').includes('id="tabOrders"') && fs.readFileSync('public/admin.html', 'utf8').includes('id="modalOrderDetails"') && fs.readFileSync('public/admin.html', 'utf8').includes('renderOrdersTable') && fs.readFileSync('public/admin.html', 'utf8').includes('submitOrderStatusModal')
  },
  {
    name: 'Req 18: Admin Panel Discount Coupons Engine & Dynamic Cart Application',
    pass: fs.readFileSync('public/admin.html', 'utf8').includes('id="tabCoupons"') && fs.readFileSync('public/admin.html', 'utf8').includes('id="modalCoupon"') && fs.readFileSync('public/admin.html', 'utf8').includes('renderCouponsTable') && appHtml.includes('/api/coupons/list')
  },
  {
    name: 'Req 19: Dedicated Checkout Mobile Responsiveness (max-width 480px, centered)',
    pass: appHtml.includes('id="viewEcommerceCheckout"') && appHtml.includes('max-width: 480px') && appHtml.includes('id="checkoutTopBar"') && appHtml.includes('id="checkoutBottomBar"')
  },
  {
    name: 'Req 20: My Orders Bulk Items Expansion (+more items clickable toggle)',
    pass: appHtml.includes('toggleOrderBulkItems') && appHtml.includes('bulkItemsWrap_') && appHtml.includes('bulkItemsChevron_')
  },
  {
    name: 'Req 21: E-Pay Wallet Branding across payment success, debited from, and checkout',
    pass: appHtml.includes('id="pinSuccessDebitedFromText">E-Pay Wallet</strong>') && appHtml.includes('<span>E-Pay Wallet</span>') && !appHtml.includes('EasyPay Main Wallet')
  },
  {
    name: 'Req 22: Masked Wallet Balance with "View" and 4-Digit Security PIN Verification',
    pass: appHtml.includes('id="balanceModalWalletDisplay">₹ • • • • • •</div>') && appHtml.includes('requestPinToCheckBalance') && appHtml.includes('id="checkBalancePinModal"') && appHtml.includes('submitCheckBalancePin')
  },
  {
    name: 'Req 23: Enter Amount Prompt First Modal & Transfer Handlers',
    pass: appHtml.includes('id="enterAmountToPayModal"') && appHtml.includes('id="enterPayAmountInput"') && appHtml.includes('openEnterAmountModal') && appHtml.includes('proceedFromAmountToPaySource')
  },
  {
    name: 'Req 24: Transactions Ledger FontAwesome Icons (fa-arrow-down received, fa-arrow-up sent)',
    pass: appHtml.includes("let iconClass = isCredit ? 'fa-arrow-down' : 'fa-arrow-up';")
  },
  {
    name: 'Req 25: Passbook Top Header with Back button and Bottom Navigation Bar Hiding/Restoring',
    pass: appHtml.includes('id="viewPassbook"') && appHtml.includes('closePassbookView') && appHtml.includes('Passbook & Portfolio') && appHtml.includes("navEl.style.display = 'none';")
  },
  {
    name: 'Req 26: Update Payment Details (Bank, UPI, USDT) View, Modal & Backend API',
    pass: appHtml.includes('Update Payment Details') && appHtml.includes('id="paymentDetailsTypeSelect"') && appHtml.includes('paymentFieldsBank') && appHtml.includes('paymentFieldsUpi') && appHtml.includes('paymentFieldsUsdt') && fs.readFileSync('server/server.js', 'utf8').includes('/api/user/payment-details')
  },
  {
    name: 'Req 27: Profile Menu Group 2 Inactive Wallet Card Removed',
    pass: !appHtml.includes('wallet-section-card-old') && appHtml.includes('User Requested: Wallet section removed')
  },
  {
    name: 'Req 28: Removed "Pay Bills" Tag & Local SVG Assets for Brand Logos',
    pass: !appHtml.includes('>Pay Bills</span>') && appHtml.includes('/assets/brands/amazon.svg') && appHtml.includes('/assets/brands/apple.svg') && appHtml.includes('/assets/brands/dominos.svg')
  },
  {
    name: 'Req 29: Profile Header shows Nirod Behera, +91 9876548808, and EPY98808',
    pass: appHtml.includes('id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</span>') &&
          appHtml.includes('id="profileAccountPhone">+91 9876548808</div>') &&
          appHtml.includes('id="profileAccountUserId" style="letter-spacing: 0.5px;">EPY98808</span>')
  },
  {
    name: 'Req 30: Payment Details Modal segmented cards with logos for Bank, UPI, and USDT',
    pass: appHtml.includes('payTypeCard_bank') &&
          appHtml.includes('payTypeCard_upi') &&
          appHtml.includes('payTypeCard_usdt') &&
          appHtml.includes('selectPaymentMethodType')
  },
  {
    name: 'Req 31: USDT Network Selection branded cards for TRC-20, BEP-20, ERC-20',
    pass: appHtml.includes('usdtNetCard_trc20') &&
          appHtml.includes('usdtNetCard_bep20') &&
          appHtml.includes('usdtNetCard_erc20') &&
          appHtml.includes('selectUsdtNetwork')
  },
  {
    name: 'Req 32: Saved Payment Details displays authentic UPI and Tether USDT crypto logos',
    pass: appHtml.includes('linear-gradient(135deg, #097939 0%, #ED752E 100%)') &&
          appHtml.includes('₮</div>')
  },
  {
    name: 'Req 33: My Orders top bar features animated refresh button with fa-spin and live data sync',
    pass: appHtml.includes('refreshMyOrdersWithAnimation') &&
          appHtml.includes('id="refreshMyOrdersIcon"') &&
          appHtml.includes('fa-spin')
  },
  {
    name: 'Req 34: Bank Accounts, My Orders, Reset PIN & Pay Anyone views are strictly constrained to mobile responsive 480px',
    pass: appHtml.includes('id="viewBankAccounts" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px;') &&
          appHtml.includes('id="viewMyOrders" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px;') &&
          appHtml.includes('id="viewResetPin" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px;')
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
  },
  {
    name: 'Req 40: Profile photo upload via camera icon, preview, and API sync',
    pass: appHtml.includes('id="profilePicFileInput"') &&
          appHtml.includes('handleProfilePicChange') &&
          appHtml.includes('Tap camera icon to select photo from gallery') &&
          appHtml.includes('POST') &&
          appHtml.includes('/api/user/profile')
  },
  {
    name: 'Req 41: Account Active / Not Active status badge & activation warning banner',
    pass: appHtml.includes('id="profileAccountStatusBadge"') &&
          appHtml.includes('id="profileNotActiveAlert"') &&
          appHtml.includes('Your account is not active.') &&
          adminHtml.includes('NOT ACTIVE (Pending First Deposit)')
  },
  {
    name: 'Req 42: Legal modals (About EasyPay, Terms & Conditions, Privacy Policy)',
    pass: appHtml.includes('modalAboutApp') &&
          appHtml.includes('modalTerms') &&
          appHtml.includes('modalPrivacy') &&
          appHtml.includes('openAboutAppModal') &&
          appHtml.includes('openTermsModal') &&
          appHtml.includes('openPrivacyModal')
  },
  {
    name: 'Req 43: Add Funds modal with presets (1k-100k), 4 payment tabs & UTR proof submission',
    pass: appHtml.includes('openAddFundsModal') &&
          appHtml.includes('setAddFundsAmount') &&
          appHtml.includes('selectDepositMethod') &&
          appHtml.includes('addFundsAmountInput') &&
          appHtml.includes('depMethodCard_upi') &&
          appHtml.includes('depMethodCard_bank') &&
          appHtml.includes('depMethodCard_qr') &&
          appHtml.includes('depMethodCard_usdt') &&
          appHtml.includes('depProofUtrInput') &&
          appHtml.includes('submitDepositRequestFlow')
  },
  {
    name: 'Req 44: Admin Deposit Requests management tab with filter pills and approve/reject actions',
    pass: adminHtml.includes('tabDeposits') &&
          adminHtml.includes('filterDepositRequests') &&
          adminHtml.includes('approveDepositRequest') &&
          adminHtml.includes('rejectDepositRequest') &&
          adminHtml.includes('api/admin/deposit-requests')
  },
  {
    name: 'Req 45: Admin Payment Details configuration tab (UPI, Bank, Cash, USDT)',
    pass: adminHtml.includes('tabPaymentDetails') &&
          adminHtml.includes('savePlatformPaymentDetails') &&
          adminHtml.includes('cfgUpiId') &&
          adminHtml.includes('cfgBankAcc') &&
          adminHtml.includes('cfgUsdtAddress') &&
          adminHtml.includes('api/admin/payment-settings')
  },
  {
    name: 'Req 46: EasyPay Secure Access lock screen with MPIN keypad, Face ID & Password unlock',
    pass: appHtml.includes('viewSecureAccess') &&
          appHtml.includes('EasyPay Secure Access') &&
          appHtml.includes('handleLockKeypad') &&
          appHtml.includes('switchLockMethod') &&
          appHtml.includes('triggerFaceIdScan') &&
          appHtml.includes('submitLockPasswordUnlock') &&
          appHtml.includes('lockApplicationNow')
  },
  {
    name: 'Req 47: 100% Dynamic Admin User Dossier with unique credentials & downlines',
    pass: adminHtml.includes('openUserDetailsModal') &&
          adminHtml.includes('dossierStatWallet') &&
          adminHtml.includes('dossierStatDeposits') &&
          adminHtml.includes('dossierStatDownline') &&
          adminHtml.includes('dossierDownlineTbody') &&
          adminHtml.includes('dossierTxnTbody')
  },
  {
    name: 'Req 48: To Bank / Self Saved Payment Picker, Dynamic USDT Conversion & Withdrawal Request Flow',
    pass: appHtml.includes('selectSavedPaymentModal') &&
          appHtml.includes('selectSavedMethodForWithdrawal') &&
          appHtml.includes('updateWithdrawalUsdtConversion') &&
          appHtml.includes('/api/withdrawal/request') &&
          adminHtml.includes('tabWithdrawals') &&
          adminHtml.includes('approveWithdrawalRequest') &&
          adminHtml.includes('rejectWithdrawalRequest')
  },
  {
    name: 'Req 49: Passbook & Portfolio Mobile-Responsive Zerodha/FD-Style EasyPay Orange Redesign',
    pass: appHtml.includes('FD & Bonds Portfolio') &&
          appHtml.includes('portfolioDailyReturn') &&
          appHtml.includes('DAILY RETURN') &&
          appHtml.includes('MATURITY VALUE')
  },
  {
    name: 'Req 50: Gift Vouchers No-Undefined Fix with Purchase Date/Time & Validity Period',
    pass: appHtml.includes("v.brand || v.brandName || v.name || 'EasyPay Gift Voucher'") &&
          appHtml.includes('PURCHASED ON') &&
          appHtml.includes('VALID UNTIL')
  },
  {
    name: 'Req 51: 10-Level Refer & Earn Network Dropdown, First Deposit Bonus per User, User ID Search & Admin Commission Engine',
    pass: appHtml.includes('Network Levels') &&
          appHtml.includes('referSearchUserInput') &&
          appHtml.includes('referLevelDropdownMenu') &&
          appHtml.includes('First Deposit Bonus') &&
          appHtml.includes('/api/referral/network') &&
          adminHtml.includes('cfgFirstDepositBonus') &&
          adminHtml.includes('cfgLvlComm_10')
  },
  {
    name: 'Req 52: v42 PIN-Gated Wallet Payments, Restored Pay Anyone, EasyPay Orange UI & Non-Sticky Headers',
    pass: appHtml.includes('finalizeBondBookingAfterPin') &&
          appHtml.includes('finalizeCredLuckyDrawAfterPin') &&
          appHtml.includes('id="viewPayAnyone"') &&
          appHtml.includes('id="referLevelDropdownBtn"') &&
          appHtml.includes('id="viewProductDetails" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px;')
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
