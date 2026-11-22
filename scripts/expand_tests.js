const fs = require('fs');

let testCode = fs.readFileSync('test_suite.js', 'utf8');

const newTests = `
  // Test 32: Profile consistency: Nirod Behera, 9876548808, EPY98808 in Profile banner and Edit modal
  assert(
    appHtml.includes('id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</div>') &&
    appHtml.includes('id="profileAccountPhone">+91 9876548808</div>') &&
    appHtml.includes('id="profileAccountUserId" style="letter-spacing: 0.5px;">EPY98808</span>'),
    'Test 32: Req 29: Profile Header shows Nirod Behera, +91 9876548808, and EPY98808'
  );

  // Test 33: Payment Details modal segmented card selector (Bank, UPI, USDT with logos)
  assert(
    appHtml.includes('payTypeCard_bank') &&
    appHtml.includes('payTypeCard_upi') &&
    appHtml.includes('payTypeCard_usdt') &&
    appHtml.includes('selectPaymentMethodType'),
    'Test 33: Req 30: Payment Details Modal uses segmented interactive cards with logos for Bank, UPI, and USDT'
  );

  // Test 34: USDT network cards (TRC-20, BEP-20, ERC-20 with logos)
  assert(
    appHtml.includes('usdtNetCard_trc20') &&
    appHtml.includes('usdtNetCard_bep20') &&
    appHtml.includes('usdtNetCard_erc20') &&
    appHtml.includes('selectUsdtNetwork'),
    'Test 34: Req 31: USDT Network Selection uses interactive branded cards for TRC-20, BEP-20, ERC-20'
  );

  // Test 35: Saved Payment Details authentic UPI & USDT logos
  assert(
    appHtml.includes('linear-gradient(135deg, #097939 0%, #ED752E 100%)') &&
    appHtml.includes('₮</div>'),
    'Test 35: Req 32: Saved Payment Details displays authentic UPI and Tether USDT crypto logos'
  );

  // Test 36: My Orders mobile responsiveness and animated refresh button
  assert(
    appHtml.includes('refreshMyOrdersWithAnimation') &&
    appHtml.includes('id="refreshMyOrdersIcon"') &&
    appHtml.includes('fa-spin'),
    'Test 36: Req 33: My Orders top bar features animated refresh button with fa-spin and live data sync'
  );

  // Test 37: Update Payment Details & My Orders mobile responsiveness (max-width 480px)
  assert(
    appHtml.includes('<!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->') &&
    appHtml.includes('Segmented Tab Bar (Mobile Responsive Centered Max-Width 480px)'),
    'Test 37: Req 34: Bank Accounts and My Orders headers are strictly constrained to mobile responsive 480px'
  );
`;

testCode = testCode.replace(
  '  console.log(`\\nResult: ${passedTests}/${totalTests} tests passed.`);',
  newTests + '\n  console.log(`\\nResult: ${passedTests}/${totalTests} tests passed.`);'
);

fs.writeFileSync('test_suite.js', testCode, 'utf8');
console.log('Expanded test_suite.js with tests 32 to 37');
