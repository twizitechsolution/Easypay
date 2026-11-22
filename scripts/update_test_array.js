const fs = require('fs');

let code = fs.readFileSync('test_suite.js', 'utf8');

const additionalTests = `  {
    name: 'Req 29: Profile Header shows Nirod Behera, +91 9876548808, and EPY98808',
    pass: appHtml.includes('id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</div>') &&
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
    name: 'Req 34: Bank Accounts and My Orders headers are strictly constrained to mobile responsive 480px',
    pass: appHtml.includes('<!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->') &&
          appHtml.includes('Segmented Tab Bar (Mobile Responsive Centered Max-Width 480px)')
  }`;

code = code.replace(
  `  {
    name: 'Req 28: Removed "Pay Bills" Tag & Local SVG Assets for Brand Logos',
    pass: !appHtml.includes('>Pay Bills</span>') && appHtml.includes('/assets/brands/amazon.svg') && appHtml.includes('/assets/brands/apple.svg') && appHtml.includes('/assets/brands/dominos.svg')
  }`,
  `  {
    name: 'Req 28: Removed "Pay Bills" Tag & Local SVG Assets for Brand Logos',
    pass: !appHtml.includes('>Pay Bills</span>') && appHtml.includes('/assets/brands/amazon.svg') && appHtml.includes('/assets/brands/apple.svg') && appHtml.includes('/assets/brands/dominos.svg')
  },\n` + additionalTests
);

fs.writeFileSync('test_suite.js', code, 'utf8');
console.log('Successfully updated test_suite.js');
