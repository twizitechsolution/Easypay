const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'db.json');
const appHtmlPath = path.join(__dirname, 'public', 'app.html');
const indexHtmlPath = path.join(__dirname, 'public', 'index.html');

const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
let html = fs.readFileSync(appHtmlPath, 'utf8');

console.log('1. Checking db.json giftCards count:', dbData.giftCards.length);

// 1. Remove any remaining top-tester-bar or LIVE TESTER
html = html.replace(/<div class="top-tester-bar">[\s\S]*?<\/div>\s*<\/div>/g, '');
html = html.replace(/<div class="top-tester-bar">[\s\S]*?<\/div>/g, '');
html = html.replace(/<span class="tester-badge">[\s\S]*?<\/span>/g, '');

// 2. Remove "What's on your mind?" completely
html = html.replace(/<!-- 6\. "What's on your mind\?" Grid[\s\S]*?<div class="whats-on-mind-grid">[\s\S]*?<\/div>\s*<\/div>/g, '');
html = html.replace(/<div class="whats-on-mind-grid">[\s\S]*?<\/div>/g, '');
html = html.replace(/<div[^>]*>What's on your mind\?<\/div>/g, '');

// 3. Inject full dbData directly into initial appData variable
const appDataInjection = `let appData = ${JSON.stringify(dbData, null, 2)};`;
html = html.replace(/let appData = \{[\s\S]*?\};/, appDataInjection);

// 4. Update API base URL to point to https://zafir.us.cc if inside APK / localhost
const apiBaseFix = `
    const API_BASE = (window.location.origin.includes('localhost') || window.location.origin.includes('capacitor') || window.location.protocol === 'file:')
      ? 'https://zafir.us.cc'
      : '';
`;
if (!html.includes('const API_BASE')) {
  html = html.replace(/async function loadData\(\) \{/, apiBaseFix + '\n    async function loadData() {');
  html = html.replace(/fetch\('\/api\/data'\)/g, "fetch(API_BASE + '/api/data')");
  html = html.replace(/fetch\('\/api\/user\/set-pin'/g, "fetch(API_BASE + '/api/user/set-pin'");
  html = html.replace(/fetch\('\/api\/user\/update'/g, "fetch(API_BASE + '/api/user/update'");
  html = html.replace(/fetch\('\/api\/recharge'/g, "fetch(API_BASE + '/api/recharge'");
  html = html.replace(/fetch\('\/api\/bonds\/book'/g, "fetch(API_BASE + '/api/bonds/book'");
  html = html.replace(/fetch\('\/api\/giftcards\/purchase'/g, "fetch(API_BASE + '/api/giftcards/purchase'");
}

// 5. Ensure openBuyGiftCardModal is completely foolproof and matches any brand id/name
const robustGiftCardModal = `
    function openBuyGiftCardModal(cardId) {
      if (!appData.giftCards || appData.giftCards.length === 0) {
        showToast('Loading brand vouchers...');
        return;
      }
      const searchKey = String(cardId || '').toLowerCase().trim();
      let card = appData.giftCards.find(c => 
        c.id.toLowerCase() === searchKey ||
        c.id.toLowerCase().replace(/_/g, '').includes(searchKey.replace(/_/g, '')) ||
        (c.name && c.name.toLowerCase().includes(searchKey)) ||
        (c.subName && c.subName.toLowerCase().includes(searchKey))
      );
      if (!card) card = appData.giftCards[0];
      selectedBrand = card;
      selectedPurchaseValue = (card.denominations && card.denominations.length) ? card.denominations[0] : 100;

      // Update Header
      const headerTitle = document.getElementById('purchasePageBrandTitle');
      if (headerTitle) headerTitle.innerText = card.name + ' Gift Voucher';

      // Update Hero Card
      const heroCard = document.getElementById('purchaseHeroCardGradient');
      if (heroCard) {
        heroCard.style.background = card.bgColor 
          ? \`linear-gradient(135deg, \${card.bgColor} 0%, #0F172A 100%)\`
          : 'linear-gradient(135deg, #025492 0%, #0078D7 100%)';
      }
      const heroBrandName = document.getElementById('purchaseHeroBrandName');
      if (heroBrandName) heroBrandName.innerText = card.name;
      const iconMini = document.getElementById('purchaseHeroIconMini');
      if (iconMini) {
        iconMini.innerHTML = card.logo
          ? \`<img src="\${card.logo}" style="width:28px; height:28px; object-fit:contain; border-radius:6px; background:white; padding:2px;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/879/879757.png'">\`
          : (card.iconClass ? \`<i class="\${card.iconClass}"></i>\` : '');
      }
      const customInput = document.getElementById('purchaseCustomValueInput');
      if (customInput) customInput.value = selectedPurchaseValue;

      // Update Price Point Chips
      const chipsWrap = document.getElementById('purchasePriceChipsWrap');
      if (chipsWrap) {
        const denoms = card.denominations || [50, 100, 250, 500, 1000, 2000];
        chipsWrap.innerHTML = denoms.map(d => {
          const active = d === selectedPurchaseValue ? 'active' : '';
          return \`<button class="price-point-chip \${active}" onclick="selectPurchasePrice(\${d}, this)">₹\${d.toLocaleString('en-IN')}</button>\`;
        }).join('');
      }

      // Update Cashback / Discount strip
      const rate = card.saveRate || card.cashbackRate || 4;
      const stripText = document.getElementById('purchaseCashbackStripText');
      if (stripText) stripText.innerText = \`Get \${rate}% Discount / Instant Bachat\`;

      recalculatePurchaseDiscount(selectedPurchaseValue);

      // Open page
      const page = document.getElementById('viewGiftCardPurchase');
      if (page) page.classList.add('active');
    }
`;
html = html.replace(/function openBuyGiftCardModal\(cardId\) \{[\s\S]*?const page = document\.getElementById\('viewGiftCardPurchase'\);\s*if \(page\) page\.classList\.add\('active'\);\s*\}/, robustGiftCardModal);

// 6. Safe openQrCodeModal that never crashes even without external QR script
const safeQrModal = `
    function openQrCodeModal() {
      const u = appData.user || {};
      const fullName = u.name || 'Nirod behera';
      const payId = u.payId || '9876548808@easypay';
      const last4 = (u.mobile || '8808').slice(-4);

      const nameEl = document.getElementById('qrModalFullName');
      const upiEl = document.getElementById('qrModalUpiId');
      const badgeEl = document.getElementById('qrModalInitials');
      if (nameEl) nameEl.innerText = fullName;
      if (upiEl) upiEl.innerText = payId;
      if (badgeEl) badgeEl.innerText = (u.firstName?.[0] || 'N') + (u.lastName?.[0] || 'B');

      const qrTarget = document.getElementById('myQrCodeContainer');
      if (qrTarget) {
        qrTarget.innerHTML = '';
        const upiUri = \`upi://pay?pa=\${payId}&pn=\${encodeURIComponent(fullName)}&cu=INR\`;
        try {
          if (typeof QRCode !== 'undefined') {
            new QRCode(qrTarget, {
              text: upiUri,
              width: 180,
              height: 180,
              colorDark : "#0F172A",
              colorLight : "#ffffff"
            });
          } else {
            qrTarget.innerHTML = \`<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=\${encodeURIComponent(upiUri)}" style="width:180px;height:180px;border-radius:12px;" alt="QR Code">\`;
          }
        } catch(e) {
          qrTarget.innerHTML = \`<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=\${encodeURIComponent(upiUri)}" style="width:180px;height:180px;border-radius:12px;" alt="QR Code">\`;
        }
      }
      openModal('myQrModal');
    }
`;
html = html.replace(/function openQrCodeModal\(\) \{[\s\S]*?openModal\('myQrModal'\);\s*\}/, safeQrModal);

// 7. Safe openPassbookFromProfile
const safePassbook = `
    function openPassbookFromProfile() {
      switchNavTab('profile');
      const mainH = document.getElementById('homeMainHeader');
      if (mainH) mainH.style.display = 'none';
      const subHeader = document.getElementById('subpageHeader');
      if (subHeader) {
        subHeader.style.display = 'flex';
        const subTitle = document.getElementById('subpageHeaderTitle');
        if (subTitle) subTitle.innerText = 'Passbook & History';
      }
      document.querySelectorAll('.view-panel').forEach(p => p.style.display = 'none');
      const passbookView = document.getElementById('viewPassbook');
      if (passbookView) passbookView.style.display = 'block';
      if (typeof renderTransactions === 'function') renderTransactions();
    }
`;
html = html.replace(/function openPassbookFromProfile\(\) \{[\s\S]*?if \(typeof renderTransactions === 'function'\) renderTransactions\(\);\s*\}/, safePassbook);

// 8. Safe openPaymentSettings
const safePaymentSettings = `
    function openPaymentSettings() {
      const u = appData.user || {};
      const bankName = u.bankName || 'BANK OF INDIA';
      const bankAcc = u.bankAccountMasked || 'xxxx 0975';
      showToast(\`Primary Bank: \${bankName} (\${bankAcc}) - Verified & Active\`);
    }
`;
if (!html.includes('function openPaymentSettings')) {
  html += '\n<script>' + safePaymentSettings + '</script>\n';
}

// Write to public/app.html
fs.writeFileSync(appHtmlPath, html, 'utf8');
console.log('2. Successfully updated public/app.html');

// 9. OVERWRITE public/index.html WITH EXACT MATCH OF app.html
fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('3. Successfully mirrored to public/index.html (so APK and root web match 100%)');
