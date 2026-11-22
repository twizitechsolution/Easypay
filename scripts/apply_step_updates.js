const fs = require('fs');

let content = fs.readFileSync('public/app.html', 'utf8');

// Normalize line endings to \n
const isCrlf = content.includes('\r\n');
let s = content.replace(/\r\n/g, '\n');

// -------------------------------------------------------------
// 1. UPDATE PROFILE HERO BANNER DEFAULTS
// -------------------------------------------------------------
s = s.replace(
  `<div class="profile-avatar-circle-orange" id="profileInitialsBadge" onclick="openProfileEditModal()" style="cursor:pointer;">
              NB
            </div>
            <div>
              <div class="profile-meta-name" id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</div>
              <div class="profile-meta-phone" id="profileAccountPhone">+91 7013893165</div>
              <div class="profile-meta-userid" style="font-size: 13px; color: rgba(255,255,255,0.92); font-weight: 700; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
                <span>User ID:</span>
                <span id="profileAccountUserId" style="letter-spacing: 0.5px;">EPY31650</span>
              </div>
            </div>`,
  `<div class="profile-avatar-circle-orange" id="profileInitialsBadge" onclick="openProfileEditModal()" style="cursor:pointer;">
              Nb
            </div>
            <div>
              <div class="profile-meta-name" id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</div>
              <div class="profile-meta-phone" id="profileAccountPhone">+91 9876548808</div>
              <div class="profile-meta-userid" style="font-size: 13px; color: rgba(255,255,255,0.92); font-weight: 700; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
                <span>User ID:</span>
                <span id="profileAccountUserId" style="letter-spacing: 0.5px;">EPY98808</span>
              </div>
            </div>`
);

// -------------------------------------------------------------
// 2. MOBILE RESPONSIVENESS FOR #viewBankAccounts
// -------------------------------------------------------------
s = s.replace(
  `<div class="view-panel" id="viewBankAccounts" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar (Screenshot 8) -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">`,
  `<div class="view-panel" id="viewBankAccounts" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; max-width: 480px; margin: 0 auto; width: 100%; box-sizing: border-box;">`
);

// -------------------------------------------------------------
// 3. MOBILE RESPONSIVENESS & ANIMATED REFRESH FOR #viewMyOrders
// -------------------------------------------------------------
s = s.replace(
  `<div class="view-panel" id="viewMyOrders" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeMyOrdersView()" style="background: none; border: none; font-size: 18px; color: #0F172A; cursor: pointer; display: flex; align-items: center;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;">My Orders & Vouchers</div>
          </div>
          <button onclick="fetchAndRenderOrders()" style="background: none; border: none; font-size: 16px; color: #FF5722; cursor: pointer;">
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
        </div>

        <!-- Segmented Tab Bar -->
        <div style="background: #FFFFFF; padding: 8px 16px 12px; border-bottom: 1px solid #E2E8F0; display: flex; gap: 8px;">`,
  `<div class="view-panel" id="viewMyOrders" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; max-width: 480px; margin: 0 auto; width: 100%; box-sizing: border-box;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeMyOrdersView()" style="background: none; border: none; font-size: 18px; color: #0F172A; cursor: pointer; display: flex; align-items: center;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;">My Orders & Vouchers</div>
          </div>
          <button id="btnRefreshMyOrders" onclick="refreshMyOrdersWithAnimation()" style="background: #FFF5F1; border: 1px solid #FFCCBC; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #FF5722; cursor: pointer; transition: transform 0.2s;" title="Refresh Orders & Vouchers">
            <i class="fa-solid fa-arrows-rotate" id="refreshMyOrdersIcon"></i>
          </button>
        </div>

        <!-- Segmented Tab Bar (Mobile Responsive Centered Max-Width 480px) -->
        <div style="background: #FFFFFF; padding: 8px 16px 12px; border-bottom: 1px solid #E2E8F0; display: flex; gap: 8px; max-width: 480px; margin: 0 auto; width: 100%; box-sizing: border-box;">`
);

// -------------------------------------------------------------
// 4. REDESIGN ADD PAYMENT DETAILS MODAL (CARDS & LOGOS)
// -------------------------------------------------------------
const oldAddPaymentModal = `      <!-- Select Payment Type Dropdown -->
      <div style="margin-bottom: 14px;">
        <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">Select Payment Type</label>
        <select id="paymentDetailsTypeSelect" onchange="onPaymentDetailsTypeChange()" style="width: 100%; padding: 11px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13.5px; font-weight: 700; background: #FFFFFF; outline: none;">
          <option value="bank">Bank Account</option>
          <option value="upi">UPI ID</option>
          <option value="usdt">USDT Crypto Wallet</option>
        </select>
      </div>`;

const newAddPaymentModal = `      <!-- Select Payment Type (Professional Segmented Cards with Logos) -->
      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: 800; color: #334155; display: block; margin-bottom: 8px;">Select Payment Method</label>
        <input type="hidden" id="paymentDetailsTypeSelect" value="bank">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;" id="paymentTypeCardsGroup">
          <!-- Card 1: Bank Account -->
          <div class="pay-method-select-card active" id="payTypeCard_bank" onclick="selectPaymentMethodType('bank')" style="border: 2px solid #2563EB; background: #EFF6FF; border-radius: 14px; padding: 12px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #DBEAFE; color: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 18px; margin: 0 auto 6px;">
              <i class="fa-solid fa-building-columns"></i>
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #0F172A; line-height: 1.2;">Bank Account</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 2px;">IMPS / NEFT</div>
          </div>

          <!-- Card 2: UPI ID -->
          <div class="pay-method-select-card" id="payTypeCard_upi" onclick="selectPaymentMethodType('upi')" style="border: 1.5px solid #E2E8F0; background: #FFFFFF; border-radius: 14px; padding: 12px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #ECFDF5; border: 1.5px solid #A7F3D0; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px;">
              <span style="background: linear-gradient(135deg, #097939 0%, #ED752E 100%); color: #FFFFFF; font-size: 10px; font-weight: 900; padding: 3px 5px; border-radius: 5px; letter-spacing: 0.5px;">UPI</span>
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #0F172A; line-height: 1.2;">UPI ID</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 2px;">VPA Instant</div>
          </div>

          <!-- Card 3: USDT Crypto -->
          <div class="pay-method-select-card" id="payTypeCard_usdt" onclick="selectPaymentMethodType('usdt')" style="border: 1.5px solid #E2E8F0; background: #FFFFFF; border-radius: 14px; padding: 12px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #F0FDF4; border: 1.5px solid #BBF7D0; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: #26A17B; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 2px 4px rgba(38,161,123,0.3);">₮</div>
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #0F172A; line-height: 1.2;">USDT Crypto</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 2px;">Tether TRC20</div>
          </div>
        </div>
      </div>`;

s = s.replace(oldAddPaymentModal, newAddPaymentModal);

// Replace USDT Network Select with Professional Cards
const oldUsdtNetwork = `        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">USDT Network</label>
          <select id="newUsdtNetworkSelect" style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; background: #FFFFFF; outline: none;">
            <option value="TRC-20 (Tron)">TRC-20 (Tron)</option>
            <option value="BEP-20 (BNB Smart Chain)">BEP-20 (BNB Smart Chain)</option>
            <option value="ERC-20 (Ethereum)">ERC-20 (Ethereum)</option>
          </select>
        </div>`;

const newUsdtNetwork = `        <div>
          <label style="font-size: 12px; font-weight: 800; color: #334155; display: block; margin-bottom: 8px;">Select USDT Network</label>
          <input type="hidden" id="newUsdtNetworkSelect" value="TRC-20 (Tron)">
          <div style="display: flex; flex-direction: column; gap: 8px;" id="usdtNetworkCardsGroup">
            <!-- TRC-20 Card -->
            <div class="usdt-network-card active" id="usdtNetCard_trc20" onclick="selectUsdtNetwork('TRC-20 (Tron)')" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 2px solid #26A17B; background: #F0FDF4; border-radius: 12px; cursor: pointer; transition: all 0.2s;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #26A17B; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px;">₮</div>
                <div>
                  <div style="font-size: 13px; font-weight: 800; color: #0F172A;">TRC-20 (Tron Network)</div>
                  <div style="font-size: 11px; color: #16A34A; font-weight: 700;">Fastest & Lowest Gas Fee (~$1)</div>
                </div>
              </div>
              <i class="fa-solid fa-circle-check" style="color: #26A17B; font-size: 18px;" id="usdtNetCheck_trc20"></i>
            </div>

            <!-- BEP-20 Card -->
            <div class="usdt-network-card" id="usdtNetCard_bep20" onclick="selectUsdtNetwork('BEP-20 (BNB Smart Chain)')" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 1.5px solid #E2E8F0; background: #FFFFFF; border-radius: 12px; cursor: pointer; transition: all 0.2s;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #FCD535; color: #1E2329; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px;">BNB</div>
                <div>
                  <div style="font-size: 13px; font-weight: 800; color: #0F172A;">BEP-20 (BNB Smart Chain)</div>
                  <div style="font-size: 11px; color: #64748B;">Binance Ecosystem Support</div>
                </div>
              </div>
              <i class="fa-regular fa-circle" style="color: #CBD5E1; font-size: 18px;" id="usdtNetCheck_bep20"></i>
            </div>

            <!-- ERC-20 Card -->
            <div class="usdt-network-card" id="usdtNetCard_erc20" onclick="selectUsdtNetwork('ERC-20 (Ethereum)')" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border: 1.5px solid #E2E8F0; background: #FFFFFF; border-radius: 12px; cursor: pointer; transition: all 0.2s;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #627EEA; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px;"><i class="fa-brands fa-ethereum"></i></div>
                <div>
                  <div style="font-size: 13px; font-weight: 800; color: #0F172A;">ERC-20 (Ethereum Network)</div>
                  <div style="font-size: 11px; color: #64748B;">Standard Ethereum Token</div>
                </div>
              </div>
              <i class="fa-regular fa-circle" style="color: #CBD5E1; font-size: 18px;" id="usdtNetCheck_erc20"></i>
            </div>
          </div>
        </div>`;

s = s.replace(oldUsdtNetwork, newUsdtNetwork);

// -------------------------------------------------------------
// 5. UPDATE SAVED PAYMENT DETAILS LIST ICONS (UPI & USDT)
// -------------------------------------------------------------
const oldRenderSavedBankList = `      listEl.innerHTML = items.map(item => {
        let iconHtml = '<i class="fa-solid fa-building-columns"></i>';
        let iconBg = '#EFF6FF';
        let iconColor = '#2563EB';
        let title = item.bankName || 'Bank Account';
        let badge = item.ifsc || 'Bank';
        let sub = (item.accountMasked || item.accountRaw || '') + (item.holderName ? ' • ' + item.holderName : '');

        if (item.type === 'upi') {
          iconHtml = '<i class="fa-solid fa-mobile-screen-button"></i>';
          iconBg = '#ECFDF5';
          iconColor = '#10B981';
          title = item.upiId || 'UPI ID';
          badge = 'UPI';
          sub = item.holderName ? 'Name: ' + item.holderName : 'Verified UPI';
        } else if (item.type === 'usdt') {
          iconHtml = '<i class="fa-solid fa-coins"></i>';
          iconBg = '#FEF3C7';
          iconColor = '#D97706';
          title = 'USDT ' + (item.usdtNetwork || 'TRC-20');
          badge = 'USDT';
          sub = item.usdtAddress || item.usdtAddressRaw || 'Wallet Address';
        }`;

const newRenderSavedBankList = `      listEl.innerHTML = items.map(item => {
        let iconHtml = '<i class="fa-solid fa-building-columns"></i>';
        let iconBg = '#EFF6FF';
        let iconColor = '#2563EB';
        let title = item.bankName || 'Bank Account';
        let badge = item.ifsc || 'Bank';
        const defaultHolder = (appData.user && appData.user.name ? appData.user.name.toUpperCase() : 'NIROD BEHERA');
        let sub = (item.accountMasked || item.accountRaw || '') + ' • ' + (item.holderName || defaultHolder);

        if (item.type === 'upi') {
          iconHtml = '<span style="background: linear-gradient(135deg, #097939 0%, #ED752E 100%); color: #FFFFFF; font-size: 11px; font-weight: 900; padding: 4px 6px; border-radius: 6px; letter-spacing: 0.5px;">UPI</span>';
          iconBg = '#ECFDF5';
          iconColor = '#10B981';
          title = item.upiId || 'UPI ID';
          badge = 'UPI';
          sub = 'Name: ' + (item.holderName || defaultHolder);
        } else if (item.type === 'usdt') {
          iconHtml = '<div style="width: 28px; height: 28px; border-radius: 50%; background: #26A17B; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px; box-shadow: 0 2px 4px rgba(38,161,123,0.3);">₮</div>';
          iconBg = '#F0FDF4';
          iconColor = '#26A17B';
          title = 'USDT ' + (item.usdtNetwork || 'TRC-20');
          badge = 'USDT';
          sub = item.usdtAddress || item.usdtAddressRaw || 'Wallet Address';
        }`;

s = s.replace(oldRenderSavedBankList, newRenderSavedBankList);

// -------------------------------------------------------------
// 6. ADD SELECTOR HELPER FUNCTIONS & ANIMATED REFRESH FUNCTION
// -------------------------------------------------------------
const helperFunctions = `
    // Custom Selector for Payment Details Modal
    function selectPaymentMethodType(type) {
      const typeInput = document.getElementById('paymentDetailsTypeSelect');
      if (typeInput) typeInput.value = type;

      ['bank', 'upi', 'usdt'].forEach(t => {
        const card = document.getElementById('payTypeCard_' + t);
        if (!card) return;
        if (t === type) {
          card.style.borderColor = t === 'bank' ? '#2563EB' : (t === 'upi' ? '#10B981' : '#26A17B');
          card.style.background = t === 'bank' ? '#EFF6FF' : (t === 'upi' ? '#ECFDF5' : '#F0FDF4');
        } else {
          card.style.borderColor = '#E2E8F0';
          card.style.background = '#FFFFFF';
        }
      });

      const bankFields = document.getElementById('paymentFieldsBank');
      const upiFields = document.getElementById('paymentFieldsUpi');
      const usdtFields = document.getElementById('paymentFieldsUsdt');

      if (bankFields) bankFields.style.display = type === 'bank' ? 'flex' : 'none';
      if (upiFields) upiFields.style.display = type === 'upi' ? 'flex' : 'none';
      if (usdtFields) usdtFields.style.display = type === 'usdt' ? 'flex' : 'none';
    }
    window.selectPaymentMethodType = selectPaymentMethodType;

    function selectUsdtNetwork(net) {
      const netInput = document.getElementById('newUsdtNetworkSelect');
      if (netInput) netInput.value = net;

      const isTrc = net.includes('TRC-20');
      const isBep = net.includes('BEP-20');
      const isErc = net.includes('ERC-20');

      const cardTrc = document.getElementById('usdtNetCard_trc20');
      const cardBep = document.getElementById('usdtNetCard_bep20');
      const cardErc = document.getElementById('usdtNetCard_erc20');

      const checkTrc = document.getElementById('usdtNetCheck_trc20');
      const checkBep = document.getElementById('usdtNetCheck_bep20');
      const checkErc = document.getElementById('usdtNetCheck_erc20');

      if (cardTrc) {
        cardTrc.style.borderColor = isTrc ? '#26A17B' : '#E2E8F0';
        cardTrc.style.background = isTrc ? '#F0FDF4' : '#FFFFFF';
        if (checkTrc) {
          checkTrc.className = isTrc ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
          checkTrc.style.color = isTrc ? '#26A17B' : '#CBD5E1';
        }
      }
      if (cardBep) {
        cardBep.style.borderColor = isBep ? '#F59E0B' : '#E2E8F0';
        cardBep.style.background = isBep ? '#FFFBEB' : '#FFFFFF';
        if (checkBep) {
          checkBep.className = isBep ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
          checkBep.style.color = isBep ? '#F59E0B' : '#CBD5E1';
        }
      }
      if (cardErc) {
        cardErc.style.borderColor = isErc ? '#6366F1' : '#E2E8F0';
        cardErc.style.background = isErc ? '#EEF2FF' : '#FFFFFF';
        if (checkErc) {
          checkErc.className = isErc ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
          checkErc.style.color = isErc ? '#6366F1' : '#CBD5E1';
        }
      }
    }
    window.selectUsdtNetwork = selectUsdtNetwork;

    // Animated Refresh for My Orders & Vouchers (User Requested: Screenshot 6)
    async function refreshMyOrdersWithAnimation() {
      const icon = document.getElementById('refreshMyOrdersIcon');
      if (icon) icon.classList.add('fa-spin');
      showToast('Refreshing orders & vouchers...');

      const startTime = Date.now();
      try {
        const [ordRes, vouchRes] = await Promise.all([
          fetch(API_BASE + '/api/mall/orders'),
          fetch(API_BASE + '/api/vouchers')
        ]);
        if (ordRes.ok) {
          const ords = await ordRes.json();
          appData.mallOrders = ords;
        }
        if (vouchRes.ok) {
          const vouchers = await vouchRes.json();
          appData.vouchers = vouchers;
        }
      } catch (e) {
        console.error('Failed to refresh orders', e);
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 600 - elapsed);
      setTimeout(() => {
        if (icon) icon.classList.remove('fa-spin');
        renderMallOrders();
        renderVouchersOrders();
        showToast('Orders & vouchers up to date');
      }, remaining);
    }
    window.refreshMyOrdersWithAnimation = refreshMyOrdersWithAnimation;
`;

// Insert helperFunctions right before window.openAddNewPaymentDetailsModal
s = s.replace(
  'window.openAddNewPaymentDetailsModal = openAddNewPaymentDetailsModal;',
  helperFunctions + '\n    window.openAddNewPaymentDetailsModal = openAddNewPaymentDetailsModal;'
);

// -------------------------------------------------------------
// 7. ENSURE syncUserProfileUI() RUNS IN loadData() & switchNavTab('profile')
// -------------------------------------------------------------
s = s.replace(
  `        if (res.ok) {
          appData = await res.json();
          renderWallet();
          renderGiftCards();
          renderBookedBonds();
          renderTransactions();
        }`,
  `        if (res.ok) {
          appData = await res.json();
          renderWallet();
          renderGiftCards();
          renderBookedBonds();
          renderTransactions();
          syncUserProfileUI();
          if (appData.user) {
            localStorage.setItem('currentUser', JSON.stringify(appData.user));
            if (appData.user.mobile) localStorage.setItem('easypay_logged_mobile', appData.user.mobile);
          }
        }`
);

// Remove duplicate openProfileEditModal definition around line 14034
const duplicateModalFunc = `    function openProfileEditModal() {
      const u = appData.user || {};
      const nameInp = document.getElementById('editFullNameInput');
      const phoneInp = document.getElementById('editPhoneInput');
      const pinInp = document.getElementById('editPinCodeInput');
      if (nameInp) nameInp.value = u.name || 'Nirod Behera';
      if (phoneInp) phoneInp.value = u.mobile || '9876548808';
      if (pinInp) pinInp.value = u.pincode || '400001';
      openModal('profileEditModal');
    }`;

s = s.replace(duplicateModalFunc, '// (Duplicate openProfileEditModal removed - using primary definition)');

// Restore CRLF if needed
if (isCrlf) {
  s = s.replace(/\n/g, '\r\n');
}

fs.writeFileSync('public/app.html', s, 'utf8');
fs.writeFileSync('public/index.html', s, 'utf8');
console.log('Successfully updated public/app.html and public/index.html');
