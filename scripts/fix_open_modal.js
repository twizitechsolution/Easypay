const fs = require('fs');

let s = fs.readFileSync('public/app.html', 'utf8');

s = s.replace(
  `    function openAddNewPaymentDetailsModal() {
      const sel = document.getElementById('paymentDetailsTypeSelect');
      if (sel) sel.value = 'bank';
      onPaymentDetailsTypeChange();
      openModal('addNewBankModal');
    }`,
  `    function openAddNewPaymentDetailsModal() {
      if (typeof selectPaymentMethodType === 'function') {
        selectPaymentMethodType('bank');
      }
      if (typeof selectUsdtNetwork === 'function') {
        selectUsdtNetwork('TRC-20 (Tron)');
      }
      openModal('addNewBankModal');
    }`
);

fs.writeFileSync('public/app.html', s, 'utf8');
fs.writeFileSync('public/index.html', s, 'utf8');
console.log('Updated openAddNewPaymentDetailsModal in app.html and index.html');
