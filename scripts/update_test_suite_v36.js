const fs = require('fs');

let s = fs.readFileSync('test_suite.js', 'utf8');

// Update Test 32 to match </span>
s = s.replace(
  "appHtml.includes('id=\"profileAccountName\" onclick=\"openProfileEditModal()\" style=\"cursor:pointer;\">Nirod Behera</div>')",
  "appHtml.includes('id=\"profileAccountName\" onclick=\"openProfileEditModal()\" style=\"cursor:pointer;\">Nirod Behera</span>')"
);

// Now let's append new comprehensive tests for the latest user requirements:
// Req 40: Profile photo upload and sync via camera icon
// Req 41: Account Active / Not Active badge and activation banner
// Req 42: Legal info modals: About Bachat Pay, Terms & Conditions, Privacy Policy
// Req 43: Add Funds modal with ₹1k-₹100k presets, 4 payment options, QR code & UTR proof
// Req 44: Admin Deposit Requests management tab with filter pills and approval workflow
// Req 45: Admin Payment Details configuration for UPI, Bank, Cash, and USDT
// Req 46: Bachat Pay Secure Access lock screen with 4-box MPIN, Face ID, and Password

const newTests = `
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
          appHtml.includes('id="profileActivationWarningBanner"') &&
          appHtml.includes('Your account is not active. KYC cannot be started.') &&
          adminHtml.includes('NOT ACTIVE (Pending First Deposit)')
  },
  {
    name: 'Req 42: Legal modals (About Bachat Pay, Terms & Conditions, Privacy Policy)',
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
          appHtml.includes('depositAmountInput') &&
          appHtml.includes('depMethod_upi') &&
          appHtml.includes('depMethod_bank') &&
          appHtml.includes('depMethod_cash') &&
          appHtml.includes('depMethod_usdt') &&
          appHtml.includes('depositUtrInput') &&
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
          adminHtml.includes('savePaymentDetails') &&
          adminHtml.includes('cfgUpiId') &&
          adminHtml.includes('cfgBankAcc') &&
          adminHtml.includes('cfgUsdtAddress') &&
          adminHtml.includes('api/admin/payment-settings')
  },
  {
    name: 'Req 46: Bachat Pay Secure Access lock screen with MPIN keypad, Face ID & Password unlock',
    pass: appHtml.includes('viewSecureAccess') &&
          appHtml.includes('Bachat Pay Secure Access') &&
          appHtml.includes('handleLockKeypad') &&
          appHtml.includes('switchLockMode') &&
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
          adminHtml.includes('dossierDownlineBody') &&
          adminHtml.includes('dossierTxnBody')
  }
];`;

// Find where tests array ends and insert newTests before the closing bracket
const closingIdx = s.lastIndexOf('];');
if (closingIdx !== -1) {
  s = s.slice(0, closingIdx) + newTests + '\n' + s.slice(closingIdx + 2);
}

fs.writeFileSync('test_suite.js', s, 'utf8');
console.log('Successfully updated test_suite.js with all new requirements!');
