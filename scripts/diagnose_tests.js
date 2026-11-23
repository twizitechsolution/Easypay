const fs = require('fs');
const appHtml = fs.readFileSync('public/app.html', 'utf8');
const adminHtml = fs.readFileSync('public/admin.html', 'utf8');

console.log('--- Test 44 ---');
console.log('profileAccountStatusBadge:', appHtml.includes('id="profileAccountStatusBadge"'));
console.log('profileActivationWarningBanner:', appHtml.includes('id="profileActivationWarningBanner"'));
console.log('Your account is not active...', appHtml.includes('Your account is not active. KYC cannot be started.'));
console.log('admin NOT ACTIVE...', adminHtml.includes('NOT ACTIVE (Pending First Deposit)'));

console.log('--- Test 46 ---');
console.log('openAddFundsModal:', appHtml.includes('openAddFundsModal'));
console.log('setAddFundsAmount:', appHtml.includes('setAddFundsAmount'));
console.log('selectDepositMethod:', appHtml.includes('selectDepositMethod'));
console.log('depositAmountInput:', appHtml.includes('depositAmountInput'));
console.log('depMethod_upi:', appHtml.includes('depMethod_upi'));
console.log('depMethod_bank:', appHtml.includes('depMethod_bank'));
console.log('depMethod_cash:', appHtml.includes('depMethod_cash'));
console.log('depMethod_usdt:', appHtml.includes('depMethod_usdt'));
console.log('depositUtrInput:', appHtml.includes('depositUtrInput'));
console.log('submitDepositRequestFlow:', appHtml.includes('submitDepositRequestFlow'));

console.log('--- Test 48 ---');
console.log('tabPaymentDetails:', adminHtml.includes('tabPaymentDetails'));
console.log('savePaymentDetails:', adminHtml.includes('savePaymentDetails'));
console.log('cfgUpiId:', adminHtml.includes('cfgUpiId'));
console.log('cfgBankAcc:', adminHtml.includes('cfgBankAcc'));
console.log('cfgUsdtAddress:', adminHtml.includes('cfgUsdtAddress'));
console.log('api/admin/payment-settings:', adminHtml.includes('api/admin/payment-settings'));

console.log('--- Test 49 ---');
console.log('viewSecureAccess:', appHtml.includes('viewSecureAccess'));
console.log('Bachat Pay Secure Access:', appHtml.includes('Bachat Pay Secure Access'));
console.log('handleLockKeypad:', appHtml.includes('handleLockKeypad'));
console.log('switchLockMode:', appHtml.includes('switchLockMode'));
console.log('triggerFaceIdScan:', appHtml.includes('triggerFaceIdScan'));
console.log('submitLockPasswordUnlock:', appHtml.includes('submitLockPasswordUnlock'));
console.log('lockApplicationNow:', appHtml.includes('lockApplicationNow'));

console.log('--- Test 50 ---');
console.log('openUserDetailsModal:', adminHtml.includes('openUserDetailsModal'));
console.log('dossierStatWallet:', adminHtml.includes('dossierStatWallet'));
console.log('dossierStatDeposits:', adminHtml.includes('dossierStatDeposits'));
console.log('dossierStatDownline:', adminHtml.includes('dossierStatDownline'));
console.log('dossierDownlineBody:', adminHtml.includes('dossierDownlineBody'));
console.log('dossierTxnBody:', adminHtml.includes('dossierTxnBody'));
