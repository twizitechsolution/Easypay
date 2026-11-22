const fs = require('fs');
const path = require('path');

const appHtmlPath = path.join(__dirname, '..', 'public', 'app.html');
let raw = fs.readFileSync(appHtmlPath, 'utf8');

console.log('Original public/app.html size:', raw.length);
// Normalize to LF for easy matching
let html = raw.replace(/\r\n/g, '\n');

// ==============================================================
// 1. REQ 7: PASSBOOK TOP HEADER & FULL OVERLAY (SCREENSHOT 7)
// ==============================================================
const passbookOldHtml = `      <!-- ==============================================================
           VIEW 4: PASSBOOK (HISTORY & PORTFOLIO) TAB
           ============================================================== -->
      <div id="viewPassbook" style="display: none;">
        
        <!-- Segmented Tab Switcher -->
        <div style="padding: 12px 16px 0; display: flex; gap: 8px;">`;

const passbookNewHtml = `      <!-- ==============================================================
           VIEW 4: PASSBOOK (HISTORY & PORTFOLIO) TAB (SCREENSHOT 7)
           ============================================================== -->
      <div id="viewPassbook" class="view-panel" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        
        <!-- Top Sticky Header with Back Button (Screenshot 7) -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 100;">
          <button onclick="closePassbookView()" style="background: #F1F5F9; border: none; font-size: 16px; color: #0F172A; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;">Passbook & Portfolio</div>
        </div>

        <div style="max-width: 480px; margin: 0 auto; padding-bottom: 30px;">
          <!-- Segmented Tab Switcher -->
          <div style="padding: 12px 16px 0; display: flex; gap: 8px;">`;

if (!html.includes(passbookOldHtml)) {
  console.error('ERROR: Could not find passbookOldHtml in app.html');
  process.exit(1);
}
html = html.replace(passbookOldHtml, passbookNewHtml);

// Also close the wrapping inner div of viewPassbook before its closing </div>
const passbookEndOld = `            <div id="transactionsListContainer"></div>
          </div>
        </div>

      </div>

      <!-- ==============================================================
           VIEW 5: PROFILE TAB`;

const passbookEndNew = `            <div id="transactionsListContainer"></div>
          </div>
        </div>

        </div> <!-- /max-width container -->
      </div>

      <!-- ==============================================================
           VIEW 5: PROFILE TAB`;

if (!html.includes(passbookEndOld)) {
  console.error('ERROR: Could not find passbookEndOld in app.html');
  process.exit(1);
}
html = html.replace(passbookEndOld, passbookEndNew);

// ==============================================================
// 2. REQ 7 JS: openPassbookFromProfile & closePassbookView
// ==============================================================
const passbookJsOld = `    // Passbook opened from Profile
    function openPassbookFromProfile() {
      // Set subpage header
      document.getElementById('homeMainHeader').style.display = 'none';
      const subHeader = document.getElementById('subpageHeader');
      if (subHeader) {
        subHeader.style.display = 'flex';
        document.getElementById('subpageHeaderTitle').innerText = 'Passbook & Portfolio';
      }
      document.querySelectorAll('.view-panel').forEach(p => p.style.display = 'none');
      const passbookView = document.getElementById('viewPassbook');
      if (passbookView) passbookView.style.display = 'block';
      renderBookedBonds();
      renderTransactions();
    }

    function goBackToHome() {
      document.getElementById('homeMainHeader').style.display = 'flex';
      const subHeader = document.getElementById('subpageHeader');
      if (subHeader) subHeader.style.display = 'none';
      switchNavTab('home');
    }`;

const passbookJsNew = `    // Passbook opened from Profile (Screenshot 7: Full dedicated view with Back button, hiding bottom nav)
    function openPassbookFromProfile() {
      document.getElementById('homeMainHeader').style.display = 'none';
      const subHeader = document.getElementById('subpageHeader');
      if (subHeader) subHeader.style.display = 'none';

      // Hide bottom nav bar on sub-pages as requested
      const navEl = document.getElementById('appBottomNav');
      if (navEl) navEl.style.display = 'none';

      document.querySelectorAll('.view-panel').forEach(p => p.style.display = 'none');
      const passbookView = document.getElementById('viewPassbook');
      if (passbookView) {
        passbookView.style.display = 'block';
        passbookView.scrollTop = 0;
      }
      renderBookedBonds();
      renderTransactions();
    }

    function closePassbookView() {
      const passbookView = document.getElementById('viewPassbook');
      if (passbookView) passbookView.style.display = 'none';

      // Restore bottom navigation
      const navEl = document.getElementById('appBottomNav');
      if (navEl) navEl.style.display = 'flex';

      switchNavTab('profile');
    }
    window.openPassbookFromProfile = openPassbookFromProfile;
    window.closePassbookView = closePassbookView;

    function goBackToHome() {
      document.getElementById('homeMainHeader').style.display = 'flex';
      const subHeader = document.getElementById('subpageHeader');
      if (subHeader) subHeader.style.display = 'none';
      switchNavTab('home');
    }`;

if (!html.includes(passbookJsOld)) {
  console.error('ERROR: Could not find passbookJsOld in app.html');
  process.exit(1);
}
html = html.replace(passbookJsOld, passbookJsNew);

// ==============================================================
// 3. REQ 6: TRANSACTIONS LEDGER ICONS (fa-arrow-down & fa-arrow-up)
// ==============================================================
const txnsRenderOld = `      container.innerHTML = txns.map(t => {
        const isCredit = t.type === 'CREDIT' || t.type === 'UPI_CREDIT' || t.type === 'WALLET_ADD';
        const amtStr = (isCredit ? '+₹' : '-₹') + Math.abs(t.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
        let iconClass = 'fa-arrow-up-right';
        if (isCredit) iconClass = 'fa-arrow-down-left';
        else if (t.type === 'INVESTMENT') iconClass = 'fa-chart-line';
        else if (t.type === 'RECHARGE' || t.category === 'Recharge' || t.category === 'Mobile Recharge') iconClass = 'fa-mobile-screen-button';
        else if (t.type === 'GIFT_CARD' || t.category === 'Gift Card') iconClass = 'fa-gift';
        else if (t.type === 'SHOPPING' || t.category === 'Shopping') iconClass = 'fa-bag-shopping';`;

const txnsRenderNew = `      container.innerHTML = txns.map(t => {
        const isCredit = t.type === 'CREDIT' || t.type === 'UPI_CREDIT' || t.type === 'WALLET_ADD';
        const amtStr = (isCredit ? '+₹' : '-₹') + Math.abs(t.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
        let iconClass = isCredit ? 'fa-arrow-down' : 'fa-arrow-up';
        if (t.type === 'INVESTMENT') iconClass = 'fa-chart-line';
        else if (t.type === 'RECHARGE' || t.category === 'Recharge' || t.category === 'Mobile Recharge') iconClass = 'fa-mobile-screen-button';
        else if (t.type === 'GIFT_CARD' || t.category === 'Gift Card') iconClass = 'fa-gift';
        else if (t.type === 'SHOPPING' || t.category === 'Shopping') iconClass = 'fa-bag-shopping';`;

if (!html.includes(txnsRenderOld)) {
  console.error('ERROR: Could not find txnsRenderOld in app.html');
  process.exit(1);
}
html = html.replace(txnsRenderOld, txnsRenderNew);

// ==============================================================
// 4. REQ 2: BULK ORDER DISPLAY IN MY ORDERS (SCREENSHOT 2)
// ==============================================================
const mallOrdersRenderOld = `      wrap.innerHTML = orders.map(ord => {
        const firstItem = (ord.items && ord.items[0]) || { title: 'EasyPay Mall Item', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60' };
        const moreCount = (ord.items ? ord.items.length : 1) - 1;
        const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';

        return \`
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 10px; margin-bottom: 12px;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #64748B;">ORDER ID</span>
                <div style="font-size: 13px; font-weight: 800; color: #0F172A;">\${ord.id}</div>
              </div>
              <span style="background: #DCFCE7; color: #16A34A; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px;">
                ● \${ord.status || 'Order Confirmed'}
              </span>
            </div>

            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
              <img src="\${firstItem.img}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: contain; background: #F8FAFC; border: 1px solid #E2E8F0;">
              <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.3;">\${firstItem.title}</div>
                <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
                  \${moreCount > 0 ? ('+' + moreCount + ' more item' + (moreCount > 1 ? 's' : '') + ' • ') : ''}\${dateStr}
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; font-size: 12px;">
              <div>
                <span style="color: #64748B;">Total:</span> <strong style="color: #0F172A; font-size: 14px;">₹\${(ord.total || 0).toLocaleString('en-IN')}</strong>
              </div>
              <span style="font-size: 11px; color: #64748B;">Paid via \${ord.paymentMethod || 'Wallet'}</span>
            </div>

            <div style="display: flex; gap: 10px;">
              <button onclick="openTrackingModal('\${ord.id}')" style="flex: 1; background: #0F172A; color: white; border: none; padding: 9px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <i class="fa-solid fa-truck-fast"></i> Track Order
              </button>
            </div>
          </div>
        \`;
      }).join('');`;

const mallOrdersRenderNew = `      wrap.innerHTML = orders.map(ord => {
        const items = ord.items && ord.items.length ? ord.items : [{ title: 'EasyPay Mall Item', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60', quantity: 1, price: ord.total || 999 }];
        const firstItem = items[0];
        const moreCount = items.length - 1;
        const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
        const methodDisplay = ord.paymentMethod === 'Wallet' || ord.paymentMethod === 'EasyPay Wallet' ? 'E-Pay Wallet' : (ord.paymentMethod || 'E-Pay Wallet');

        return \`
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 10px; margin-bottom: 12px;">
              <div>
                <span style="font-size: 11px; font-weight: 700; color: #64748B;">ORDER ID</span>
                <div style="font-size: 13px; font-weight: 800; color: #0F172A;">\${ord.id}</div>
              </div>
              <span style="background: #DCFCE7; color: #16A34A; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px;">
                ● \${ord.status || 'Order Confirmed'}
              </span>
            </div>

            <!-- Primary Item Row -->
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
              <img src="\${firstItem.img}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: contain; background: #F8FAFC; border: 1px solid #E2E8F0; flex-shrink: 0;">
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${firstItem.title}</div>
                <div style="font-size: 11px; color: #64748B; margin-top: 4px; display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
                  \${moreCount > 0 ? \`
                    <button type="button" onclick="toggleOrderBulkItems('\${ord.id}')" style="background: #EFF6FF; border: 1px solid #BFDBFE; color: #2563EB; font-size: 11px; font-weight: 800; border-radius: 12px; padding: 2px 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                      <span>+\${moreCount} more item\${moreCount > 1 ? 's' : ''}</span>
                      <i id="bulkItemsChevron_\${ord.id}" class="fa-solid fa-chevron-down" style="font-size: 9px;"></i>
                    </button>
                  \` : ''}
                  <span>\${dateStr}</span>
                </div>
              </div>
            </div>

            <!-- Expandable bulk items container (User Requested: Screenshot 2) -->
            \${moreCount > 0 ? \`
              <div id="bulkItemsWrap_\${ord.id}" style="display: none; flex-direction: column; gap: 8px; margin: 10px 0 12px; padding: 10px; background: #F8FAFC; border-radius: 12px; border: 1px dashed #CBD5E1;">
                <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">All Items in this Order (\${items.length}):</div>
                \${items.map((item, itemIdx) => \`
                  <div style="display: flex; gap: 10px; align-items: center; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 8px 10px;">
                    <img src="\${item.img || firstItem.img}" style="width: 38px; height: 38px; border-radius: 8px; object-fit: contain; background: #F8FAFC; border: 1px solid #F1F5F9; flex-shrink: 0;">
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-size: 12px; font-weight: 700; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${item.title || 'Item ' + (itemIdx + 1)}</div>
                      <div style="font-size: 11px; color: #64748B;">Qty: \${item.quantity || 1} • <strong style="color: #0F172A;">₹\${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</strong></div>
                    </div>
                  </div>
                \`).join('')}
              </div>
            \` : ''}

            <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; font-size: 12px;">
              <div>
                <span style="color: #64748B;">Total:</span> <strong style="color: #0F172A; font-size: 14px;">₹\${(ord.total || 0).toLocaleString('en-IN')}</strong>
              </div>
              <span style="font-size: 11px; color: #64748B;">Paid via \${methodDisplay}</span>
            </div>

            <div style="display: flex; gap: 10px;">
              <button onclick="openTrackingModal('\${ord.id}')" style="flex: 1; background: #0F172A; color: white; border: none; padding: 9px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <i class="fa-solid fa-truck-fast"></i> Track Order
              </button>
            </div>
          </div>
        \`;
      }).join('');`;

if (!html.includes(mallOrdersRenderOld)) {
  console.error('ERROR: Could not find mallOrdersRenderOld in app.html');
  process.exit(1);
}
html = html.replace(mallOrdersRenderOld, mallOrdersRenderNew);

// Add toggleOrderBulkItems helper
const toggleOrderBulkItemsCode = `
    function toggleOrderBulkItems(orderId) {
      const wrap = document.getElementById('bulkItemsWrap_' + orderId);
      const chev = document.getElementById('bulkItemsChevron_' + orderId);
      if (!wrap) return;
      if (wrap.style.display === 'none' || !wrap.style.display) {
        wrap.style.display = 'flex';
        if (chev) {
          chev.classList.remove('fa-chevron-down');
          chev.classList.add('fa-chevron-up');
        }
      } else {
        wrap.style.display = 'none';
        if (chev) {
          chev.classList.remove('fa-chevron-up');
          chev.classList.add('fa-chevron-down');
        }
      }
    }
    window.toggleOrderBulkItems = toggleOrderBulkItems;
`;
html = html.replace('function renderMallOrders() {', toggleOrderBulkItemsCode + '\n    function renderMallOrders() {');

// ==============================================================
// 5. REQ 5: ENTER AMOUNT FIRST MODAL & CONTROLLER (SCREENSHOT 5)
// ==============================================================
const enterAmountModalHtml = `
  <!-- ==============================================================
       ENTER AMOUNT TO PAY MODAL (USER REQUESTED: AMOUNT PROMPT FIRST)
       ============================================================== -->
  <div class="modal-overlay" id="enterAmountToPayModal" style="align-items: flex-end; z-index: 10001;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 22px 18px 26px; max-height: 90vh;">
      <div style="width: 40px; height: 4px; background: #CBD5E1; border-radius: 2px; margin: 0 auto 16px;"></div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 900; color: #0F172A;">
          Enter Amount
        </div>
        <button style="background: none; border: none; font-size: 18px; color: #64748B; cursor: pointer;" onclick="closeModal('enterAmountToPayModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Recipient Header Card -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px 14px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #EFF6FF; border: 2px solid #BFDBFE; color: #2563EB; font-weight: 900; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;" id="enterPayRecipientAvatar">
            TS
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 15px; font-weight: 800; color: #0F172A;" id="enterPayRecipientName">Twizitech Solution</span>
              <i class="fa-solid fa-circle-check" style="color: #10B981; font-size: 13px;"></i>
            </div>
            <div style="font-size: 12px; color: #64748B; margin-top: 2px;" id="enterPayRecipientSubtitle">twizitech.solutions@kotak</div>
          </div>
        </div>
      </div>

      <!-- Large Clean Amount Input with Currency Symbol -->
      <div style="text-align: center; margin-bottom: 18px;">
        <div style="display: inline-flex; align-items: baseline; justify-content: center; border-bottom: 2.5px solid #0052CC; padding: 6px 16px; max-width: 280px; width: 100%;">
          <span style="font-size: 32px; font-weight: 800; color: #0F172A; margin-right: 4px;">₹</span>
          <input type="number" id="enterPayAmountInput" placeholder="0" min="1" step="any" autofocus
            style="border: none; background: transparent; font-size: 36px; font-weight: 900; color: #0F172A; width: 180px; text-align: left; outline: none; font-family: var(--font-heading);">
        </div>
        <div style="font-size: 11.5px; color: #64748B; margin-top: 8px;">
          Available in E-Pay Wallet: <strong style="color: #059669;" id="enterPayAvailableBalance">₹24,500.00</strong>
        </div>
      </div>

      <!-- Quick Amount Chips -->
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px;">
        <button type="button" onclick="addQuickPayAmount(100)" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #334155; cursor: pointer;">+₹100</button>
        <button type="button" onclick="addQuickPayAmount(200)" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #334155; cursor: pointer;">+₹200</button>
        <button type="button" onclick="addQuickPayAmount(500)" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #334155; cursor: pointer;">+₹500</button>
        <button type="button" onclick="addQuickPayAmount(1000)" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #334155; cursor: pointer;">+₹1,000</button>
      </div>

      <!-- Optional Payment Note -->
      <div style="margin-bottom: 22px;">
        <input type="text" id="enterPayNoteInput" placeholder="Add a note (e.g. Dinner, Rent, Groceries)"
          style="width: 100%; box-sizing: border-box; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 12px; padding: 11px 14px; font-size: 13px; font-weight: 600; outline: none;">
      </div>

      <!-- Proceed Button -->
      <button class="btn-primary-action" onclick="proceedFromAmountToPaySource()" style="background: #0052CC; border-radius: 28px; padding: 15px; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>Proceed to Pay</span>
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
`;

// Insert enterAmountModalHtml before payFromSourceModal
const payFromSourceAnchor = '  <!-- ==============================================================\n       PAY FROM SOURCE / WALLET SELECTION MODAL';
if (!html.includes(payFromSourceAnchor)) {
  console.error('ERROR: Could not find payFromSourceAnchor in app.html');
  process.exit(1);
}
html = html.replace(payFromSourceAnchor, enterAmountModalHtml + '\n' + payFromSourceAnchor);

// Update payFromSourceModal label to E-Pay Wallet
html = html.replace(/<span>EasyPay Wallet<\/span>/g, '<span>E-Pay Wallet</span>');
html = html.replace(/EasyPay Main Wallet/g, 'E-Pay Wallet');

// Add JS for enterAmountModal
const enterAmountJs = `
    // ==============================================================
    // ENTER AMOUNT TO PAY CONTROLLER (SCREENSHOT 5)
    // ==============================================================
    let pendingPayRecipient = null;

    function openEnterAmountModal(recipient) {
      pendingPayRecipient = recipient || {
        name: 'Twizitech Solution',
        mobile: '7013893165',
        payId: 'twizitech.solutions@kotak',
        type: 'UPI Transfer'
      };

      const nameEl = document.getElementById('enterPayRecipientName');
      const subEl = document.getElementById('enterPayRecipientSubtitle');
      const avatarEl = document.getElementById('enterPayRecipientAvatar');
      const inputEl = document.getElementById('enterPayAmountInput');
      const noteEl = document.getElementById('enterPayNoteInput');
      const availEl = document.getElementById('enterPayAvailableBalance');

      if (nameEl) nameEl.innerText = pendingPayRecipient.name || 'Recipient';
      if (subEl) subEl.innerText = pendingPayRecipient.subtitle || pendingPayRecipient.payId || ('+91 ' + (pendingPayRecipient.mobile || ''));
      if (avatarEl) {
        const initials = (pendingPayRecipient.name || 'EP').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        avatarEl.innerText = initials;
      }
      if (inputEl) {
        inputEl.value = ''; // Always empty per user requirement!
      }
      if (noteEl) noteEl.value = '';
      if (availEl) {
        const bal = (appData.user && appData.user.walletBalance) || 24500;
        availEl.innerText = '₹' + bal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }

      openModal('enterAmountToPayModal');
      setTimeout(() => {
        if (inputEl) inputEl.focus();
      }, 300);
    }

    function selectQuickPayAmount(amount) {
      const inputEl = document.getElementById('enterPayAmountInput');
      if (inputEl) {
        inputEl.value = amount;
        inputEl.focus();
      }
    }

    function addQuickPayAmount(addAmt) {
      const inputEl = document.getElementById('enterPayAmountInput');
      if (inputEl) {
        const curr = parseFloat(inputEl.value) || 0;
        inputEl.value = curr + addAmt;
        inputEl.focus();
      }
    }

    function proceedFromAmountToPaySource() {
      const inputEl = document.getElementById('enterPayAmountInput');
      const noteEl = document.getElementById('enterPayNoteInput');
      const amt = parseFloat(inputEl?.value || 0);

      if (!amt || isNaN(amt) || amt <= 0) {
        showToast('Please enter an amount to pay');
        if (inputEl) inputEl.focus();
        return;
      }

      const bal = (appData.user && appData.user.walletBalance) || 24500;
      if (amt > bal) {
        showToast('Insufficient wallet balance (Available: ₹' + bal.toLocaleString('en-IN') + ')');
        return;
      }

      closeModal('enterAmountToPayModal');

      const rec = pendingPayRecipient || {};
      openPayFromSourceSheet({
        amount: amt,
        recipientName: rec.name || 'Twizitech Solution',
        recipientSubtitle: (rec.subtitle || rec.payId || ('+91 ' + (rec.mobile || ''))),
        type: rec.type || 'P2P Transfer',
        note: noteEl?.value?.trim() || ''
      });
    }

    window.openEnterAmountModal = openEnterAmountModal;
    window.selectQuickPayAmount = selectQuickPayAmount;
    window.addQuickPayAmount = addQuickPayAmount;
    window.proceedFromAmountToPaySource = proceedFromAmountToPaySource;
`;

// Insert enterAmountJs before openPayFromSourceSheet
html = html.replace('function openPayFromSourceSheet(options) {', enterAmountJs + '\n    function openPayFromSourceSheet(options) {');

// Update initiatePaymentToRecipient to route through openEnterAmountModal
const initiateOld = `    function initiatePaymentToRecipient(name, mobile, payId, defaultAmt) {
      openPayFromSourceSheet({
        amount: defaultAmt || 280,
        recipientName: name,
        recipientSub: payId || ('+91 ' + mobile),
        type: 'UPI Transfer'
      });
    }`;

const initiateNew = `    function initiatePaymentToRecipient(name, mobile, payId) {
      openEnterAmountModal({
        name: name,
        mobile: mobile,
        payId: payId,
        subtitle: payId || ('+91 ' + mobile),
        type: 'UPI Transfer'
      });
    }`;

if (!html.includes(initiateOld)) {
  console.error('ERROR: Could not find initiateOld in app.html');
  process.exit(1);
}
html = html.replace(initiateOld, initiateNew);

// Update openToBankOrSelfTransfer to route through openEnterAmountModal
const bankTransferOld = `    // HOME: To Bank/Self Transfer Flow using Saved Banks
    function openToBankOrSelfTransfer() {
      const banks = (appData && appData.savedBanks) || [];
      const primaryBank = banks.find(b => b.isPrimary) || banks[0] || {
        bankName: 'Bank of India',
        holderName: 'NIRODA BEHERA',
        accountMasked: '5108XXXXXXXX0975'
      };

      openPayFromSourceSheet({
        amount: 500,
        recipientName: primaryBank.bankName + ' (' + primaryBank.holderName + ')',
        recipientSub: primaryBank.accountMasked,
        type: 'Bank Transfer'
      });
    }`;

const bankTransferNew = `    // HOME: To Bank/Self Transfer Flow using Saved Banks (Prompt for Amount First)
    function openToBankOrSelfTransfer() {
      const details = (appData.user && appData.user.paymentDetails) || [];
      const primaryBank = details.find(b => b.type === 'bank' && b.isPrimary) || details.find(b => b.type === 'bank') || {
        bankName: 'Bank of India',
        holderName: 'NIRODA BEHERA',
        accountMasked: '5108XXXXXXXX0975'
      };

      openEnterAmountModal({
        name: (primaryBank.bankName || 'Bank Account') + (primaryBank.holderName ? ' (' + primaryBank.holderName + ')' : ''),
        subtitle: primaryBank.accountMasked || 'Primary Bank Account',
        type: 'Bank Transfer'
      });
    }`;

if (!html.includes(bankTransferOld)) {
  console.error('ERROR: Could not find bankTransferOld in app.html');
  process.exit(1);
}
html = html.replace(bankTransferOld, bankTransferNew);

// ==============================================================
// 6. REQ 8: UPDATE PAYMENT DETAILS VIEW & MODAL (SCREENSHOTS 8 & 9)
// ==============================================================
const viewBankAccountsOld = `           BANK ACCOUNTS MANAGEMENT VIEW (SCREENSHOT 4)
           ============================================================== -->
      <div class="view-panel" id="viewBankAccounts" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar (Screenshot 4) -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeBankAccountsView()" style="background: none; border: none; font-size: 18px; color: #0F172A; cursor: pointer; display: flex; align-items: center;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;">Bank Accounts</div>
          </div>
          <button onclick="openAddNewBankModal()" style="background: none; border: none; font-size: 15px; font-weight: 800; color: #0284C7; cursor: pointer;">
            Add
          </button>
        </div>

        <div style="padding: 16px; max-width: 480px; margin: 0 auto;">
          <!-- Subtitle (Screenshot 4) -->
          <div style="font-size: 13px; font-weight: 700; color: #64748B; margin-bottom: 12px;">
            Your Bank Details
          </div>

          <!-- Saved Bank List Container -->
          <div id="savedBankCardsList" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
            <!-- Populated dynamically via renderSavedBankAccounts() -->
          </div>
        </div>
      </div>`;

const viewBankAccountsNew = `           PAYMENT DETAILS MANAGEMENT VIEW (SCREENSHOTS 8 & 9)
           ============================================================== -->
      <div class="view-panel" id="viewBankAccounts" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar (Screenshot 8) -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeBankAccountsView()" style="background: none; border: none; font-size: 18px; color: #0F172A; cursor: pointer; display: flex; align-items: center;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;">Update Payment Details</div>
          </div>
          <button onclick="openAddNewPaymentDetailsModal()" style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 800; color: #0284C7; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>

        <div style="padding: 16px; max-width: 480px; margin: 0 auto;">
          <!-- Subtitle (Screenshot 8) -->
          <div style="font-size: 13px; font-weight: 700; color: #64748B; margin-bottom: 14px;">
            Your Payment Details
          </div>

          <!-- Saved Payment Details List Container -->
          <div id="savedBankCardsList" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
            <!-- Populated dynamically via fetchAndRenderPaymentDetails() -->
          </div>
        </div>
      </div>`;

if (!html.includes(viewBankAccountsOld)) {
  console.error('ERROR: Could not find viewBankAccountsOld in app.html');
  process.exit(1);
}
html = html.replace(viewBankAccountsOld, viewBankAccountsNew);

// Replace addNewBankModal in HTML
const addNewBankModalOld = `  <!-- Add New Bank Modal -->
  <div class="modal-overlay" id="addNewBankModal" style="align-items: flex-end; z-index: 10005;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-size: 16px; font-weight: 800; color: #0F172A;">Add Bank Account</div>
        <button style="background: none; border: none; font-size: 18px; color: #64748B; cursor: pointer;" onclick="closeModal('addNewBankModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Bank Name</label>
          <input type="text" id="newBankNameInput" placeholder="e.g. State Bank of India" value="State Bank of India" style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Account Number</label>
          <input type="number" id="newBankAccountNumberInput" placeholder="Enter account number" value="30981928491" style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">IFSC Code</label>
          <input type="text" id="newBankIfscInput" placeholder="e.g. SBIN0001234" value="SBIN0001234" style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none; text-transform: uppercase;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Account Holder Name</label>
          <input type="text" id="newBankHolderInput" placeholder="Account holder name" value="NIROD BEHERA" style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
      </div>

      <button class="btn-primary-action" onclick="submitAddNewBankAccount()">
        <i class="fa-solid fa-plus"></i> Save Bank Account
      </button>
    </div>
  </div>`;

const addNewBankModalNew = `  <!-- Add Payment Details Modal (Bank, UPI, USDT - Screenshots 8 & 9) -->
  <div class="modal-overlay" id="addNewBankModal" style="align-items: flex-end; z-index: 10005;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 22px 18px 26px; max-height: 90vh;">
      <div style="width: 40px; height: 4px; background: #CBD5E1; border-radius: 2px; margin: 0 auto 16px;"></div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-family: var(--font-heading); font-size: 17px; font-weight: 800; color: #0F172A;">Add Payment Details</div>
        <button style="background: none; border: none; font-size: 18px; color: #64748B; cursor: pointer;" onclick="closeModal('addNewBankModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Select Payment Type Dropdown -->
      <div style="margin-bottom: 14px;">
        <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 5px;">Select Payment Type</label>
        <select id="paymentDetailsTypeSelect" onchange="onPaymentDetailsTypeChange()" style="width: 100%; padding: 11px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13.5px; font-weight: 700; background: #FFFFFF; outline: none;">
          <option value="bank">Bank Account</option>
          <option value="upi">UPI ID</option>
          <option value="usdt">USDT Crypto Wallet</option>
        </select>
      </div>

      <!-- Dynamic Fields for Bank Account -->
      <div id="paymentFieldsBank" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Bank Name</label>
          <select id="newBankNameSelect" style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; background: #FFFFFF; outline: none;">
            <option value="State Bank of India">State Bank of India</option>
            <option value="HDFC Bank">HDFC Bank</option>
            <option value="ICICI Bank">ICICI Bank</option>
            <option value="Axis Bank">Axis Bank</option>
            <option value="Bank of Baroda">Bank of Baroda</option>
            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
            <option value="Punjab National Bank">Punjab National Bank</option>
            <option value="Bank of India">Bank of India</option>
            <option value="Canara Bank">Canara Bank</option>
            <option value="Union Bank of India">Union Bank of India</option>
            <option value="Other">Other Bank</option>
          </select>
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Account Number</label>
          <input type="number" id="newBankAccountNumberInput" placeholder="Enter bank account number" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">IFSC Code</label>
          <input type="text" id="newBankIfscInput" placeholder="e.g. SBIN0001234" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none; text-transform: uppercase;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Account Holder Name</label>
          <input type="text" id="newBankHolderInput" placeholder="Account holder name" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
      </div>

      <!-- Dynamic Fields for UPI ID -->
      <div id="paymentFieldsUpi" style="display: none; flex-direction: column; gap: 12px; margin-bottom: 18px;">
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">UPI ID / VPA</label>
          <input type="text" id="newUpiIdInput" placeholder="e.g. mobile@paytm or username@okhdfcbank" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Account Holder Name</label>
          <input type="text" id="newUpiHolderInput" placeholder="Name as per UPI" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
      </div>

      <!-- Dynamic Fields for USDT Crypto -->
      <div id="paymentFieldsUsdt" style="display: none; flex-direction: column; gap: 12px; margin-bottom: 18px;">
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">USDT Network</label>
          <select id="newUsdtNetworkSelect" style="width: 100%; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; background: #FFFFFF; outline: none;">
            <option value="TRC-20 (Tron)">TRC-20 (Tron)</option>
            <option value="BEP-20 (BNB Smart Chain)">BEP-20 (BNB Smart Chain)</option>
            <option value="ERC-20 (Ethereum)">ERC-20 (Ethereum)</option>
          </select>
        </div>
        <div>
          <label style="font-size: 11px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">USDT Wallet Address</label>
          <input type="text" id="newUsdtAddressInput" placeholder="Enter USDT recipient address" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 13px; font-weight: 700; outline: none;">
        </div>
      </div>

      <button class="btn-primary-action" onclick="submitAddNewPaymentDetail()">
        <i class="fa-solid fa-plus"></i> Save Payment Detail
      </button>
    </div>
  </div>`;

if (!html.includes(addNewBankModalOld)) {
  console.error('ERROR: Could not find addNewBankModalOld in app.html');
  process.exit(1);
}
html = html.replace(addNewBankModalOld, addNewBankModalNew);

// Replace bank account JS logic with unified payment details logic
const bankJsOld = `    function openBankAccountsView() {
      document.querySelectorAll('.view-panel').forEach(v => v.style.display = 'none');
      const v = document.getElementById('viewBankAccounts');
      if (v) v.style.display = 'block';
      renderSavedBankAccounts();
      window.scrollTo(0, 0);
    }

    function closeBankAccountsView() {
      const v = document.getElementById('viewBankAccounts');
      if (v) v.style.display = 'none';
      switchNavTab('profile');
    }

    function renderSavedBankAccounts() {
      const listEl = document.getElementById('savedBankCardsList');
      if (!listEl) return;
      const banks = (appData && appData.savedBanks) || [];

      listEl.innerHTML = banks.map(b => \`
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; display: flex; align-items: flex-start; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
          <div style="display: flex; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #475569; flex-shrink: 0;">
              <i class="fa-solid fa-building-columns"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 15px; font-weight: 800; color: #0F172A;">\${b.bankName}</span>
                <span style="background: #F1F5F9; color: #64748B; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">\${b.ifsc}</span>
              </div>
              <div style="font-size: 12px; font-weight: 600; color: #64748B; margin-top: 4px; letter-spacing: 0.5px;">
                \${b.accountMasked}-\${b.holderName}
              </div>
            </div>
          </div>
          \${b.isPrimary ? '<span style="background: #DCFCE7; color: #16A34A; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 6px;">Primary</span>' : ''}
        </div>
      \`).join('');
    }

    function openAddNewBankModal() {
      openModal('addNewBankModal');
    }

    function submitAddNewBankAccount() {
      const name = document.getElementById('newBankNameInput')?.value.trim() || 'State Bank of India';
      const num = document.getElementById('newBankAccountNumberInput')?.value.trim() || '30981928491';
      const ifsc = document.getElementById('newBankIfscInput')?.value.trim() || 'SBIN0001234';
      const holder = document.getElementById('newBankHolderInput')?.value.trim() || 'NIROD BEHERA';

      if (!appData.savedBanks) appData.savedBanks = [];
      const masked = num.length > 4 ? num.slice(0, 4) + 'XXXXXXXX' + num.slice(-4) : num;
      appData.savedBanks.push({
        id: 'bank_' + Date.now(),
        bankName: name,
        ifsc: ifsc.toUpperCase(),
        accountMasked: masked,
        accountRaw: num,
        holderName: holder.toUpperCase(),
        isPrimary: false,
        accountType: 'Savings A/c'
      });

      closeModal('addNewBankModal');
      renderSavedBankAccounts();
      showToast('Bank Account ' + name + ' added successfully!');
    }`;

const bankJsNew = `    function openBankAccountsView() {
      document.querySelectorAll('.view-panel').forEach(v => v.style.display = 'none');
      const v = document.getElementById('viewBankAccounts');
      if (v) v.style.display = 'block';
      fetchAndRenderPaymentDetails();
      window.scrollTo(0, 0);
    }

    function closeBankAccountsView() {
      const v = document.getElementById('viewBankAccounts');
      if (v) v.style.display = 'none';
      switchNavTab('profile');
    }

    function onPaymentDetailsTypeChange() {
      const sel = document.getElementById('paymentDetailsTypeSelect')?.value || 'bank';
      const fBank = document.getElementById('paymentFieldsBank');
      const fUpi = document.getElementById('paymentFieldsUpi');
      const fUsdt = document.getElementById('paymentFieldsUsdt');

      if (fBank) fBank.style.display = sel === 'bank' ? 'flex' : 'none';
      if (fUpi) fUpi.style.display = sel === 'upi' ? 'flex' : 'none';
      if (fUsdt) fUsdt.style.display = sel === 'usdt' ? 'flex' : 'none';
    }

    function openAddNewPaymentDetailsModal() {
      const sel = document.getElementById('paymentDetailsTypeSelect');
      if (sel) sel.value = 'bank';
      onPaymentDetailsTypeChange();
      openModal('addNewBankModal');
    }
    const openAddNewBankModal = openAddNewPaymentDetailsModal; // backward-compat

    async function fetchAndRenderPaymentDetails() {
      const listEl = document.getElementById('savedBankCardsList');
      if (!listEl) return;

      try {
        const res = await fetch('/api/user/payment-details');
        const data = await res.json();
        if (data.success && Array.isArray(data.paymentDetails)) {
          if (!appData.user) appData.user = {};
          appData.user.paymentDetails = data.paymentDetails;
        }
      } catch (e) {
        console.warn('Using local payment details:', e);
      }

      const items = (appData.user && appData.user.paymentDetails) || [
        {
          id: 'pay_detail_1',
          type: 'bank',
          bankName: 'State Bank of India',
          accountMasked: '3098XXXXXXXX8491',
          accountRaw: '30981928491',
          ifsc: 'SBIN0001234',
          holderName: 'NIROD BEHERA',
          isPrimary: true
        },
        {
          id: 'pay_detail_2',
          type: 'upi',
          upiId: '7013893165@easypay',
          holderName: 'NIROD BEHERA',
          isPrimary: false
        },
        {
          id: 'pay_detail_3',
          type: 'usdt',
          usdtNetwork: 'TRC-20 (Tron)',
          usdtAddress: 'TXj4b...89zKq2',
          usdtAddressRaw: 'TXj4b9A7vPq1WzK88L0sR89zKq2',
          isPrimary: false
        }
      ];

      if (items.length === 0) {
        listEl.innerHTML = \`
          <div style="text-align: center; padding: 30px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0;">
            <i class="fa-solid fa-credit-card" style="font-size: 32px; color: #CBD5E1; margin-bottom: 8px;"></i>
            <div style="font-size: 14px; font-weight: 700; color: #0F172A;">No Payment Details Added</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Click "+ Add" above to add Bank, UPI, or USDT details</div>
          </div>
        \`;
        return;
      }

      listEl.innerHTML = items.map(item => {
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
        }

        return \`
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; display: flex; align-items: flex-start; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; gap: 14px; flex: 1; min-width: 0;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: \${iconBg}; color: \${iconColor}; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                \${iconHtml}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 15px; font-weight: 800; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${title}</span>
                  <span style="background: #F1F5F9; color: #475569; font-size: 10.5px; font-weight: 700; padding: 2px 6px; border-radius: 4px; flex-shrink: 0;">\${badge}</span>
                </div>
                <div style="font-size: 12px; font-weight: 600; color: #64748B; margin-top: 4px; word-break: break-all;">
                  \${sub}
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; margin-left: 10px; flex-shrink: 0;">
              \${item.isPrimary ? '<span style="background: #DCFCE7; color: #16A34A; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 6px;">Primary</span>' : ''}
              <button onclick="deletePaymentDetail('\${item.id}')" title="Delete" style="background: none; border: none; color: #94A3B8; font-size: 14px; cursor: pointer; padding: 6px; border-radius: 6px;">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }
    const renderSavedBankAccounts = fetchAndRenderPaymentDetails; // backward-compat

    async function submitAddNewPaymentDetail() {
      const selType = document.getElementById('paymentDetailsTypeSelect')?.value || 'bank';
      let newItem = {
        id: 'pay_' + Date.now(),
        type: selType,
        isPrimary: false
      };

      if (selType === 'bank') {
        const name = document.getElementById('newBankNameSelect')?.value || 'State Bank of India';
        const acc = document.getElementById('newBankAccountNumberInput')?.value?.trim() || '';
        const ifsc = document.getElementById('newBankIfscInput')?.value?.trim() || '';
        const holder = document.getElementById('newBankHolderInput')?.value?.trim() || '';

        if (!acc) { showToast('Please enter an account number'); return; }
        const masked = acc.length > 4 ? acc.slice(0, 4) + 'XXXXXXXX' + num.slice(-4) : acc;

        newItem.bankName = name;
        newItem.accountRaw = acc;
        newItem.accountMasked = masked;
        newItem.ifsc = (ifsc || 'SBIN0001234').toUpperCase();
        newItem.holderName = (holder || 'NIROD BEHERA').toUpperCase();
      } else if (selType === 'upi') {
        const upi = document.getElementById('newUpiIdInput')?.value?.trim() || '';
        const holder = document.getElementById('newUpiHolderInput')?.value?.trim() || '';
        if (!upi) { showToast('Please enter a valid UPI ID'); return; }

        newItem.upiId = upi;
        newItem.holderName = holder || 'NIROD BEHERA';
      } else if (selType === 'usdt') {
        const net = document.getElementById('newUsdtNetworkSelect')?.value || 'TRC-20 (Tron)';
        const addr = document.getElementById('newUsdtAddressInput')?.value?.trim() || '';
        if (!addr) { showToast('Please enter a USDT wallet address'); return; }

        const maskedAddr = addr.length > 10 ? addr.slice(0, 6) + '...' + addr.slice(-6) : addr;
        newItem.usdtNetwork = net;
        newItem.usdtAddress = maskedAddr;
        newItem.usdtAddressRaw = addr;
      }

      try {
        const res = await fetch('/api/user/payment-details/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        const d = await res.json();
        if (d.success && d.paymentDetails) {
          if (!appData.user) appData.user = {};
          appData.user.paymentDetails = d.paymentDetails;
        }
      } catch (e) {
        if (!appData.user) appData.user = {};
        if (!appData.user.paymentDetails) appData.user.paymentDetails = [];
        appData.user.paymentDetails.unshift(newItem);
      }

      closeModal('addNewBankModal');
      fetchAndRenderPaymentDetails();
      showToast('Payment detail saved successfully!');
    }
    const submitAddNewBankAccount = submitAddNewPaymentDetail; // backward-compat

    async function deletePaymentDetail(id) {
      if (!confirm('Are you sure you want to delete this payment detail?')) return;
      try {
        const res = await fetch('/api/user/payment-details/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const d = await res.json();
        if (d.success && d.paymentDetails) {
          if (!appData.user) appData.user = {};
          appData.user.paymentDetails = d.paymentDetails;
        }
      } catch (e) {
        if (appData.user && appData.user.paymentDetails) {
          appData.user.paymentDetails = appData.user.paymentDetails.filter(p => p.id !== id);
        }
      }
      fetchAndRenderPaymentDetails();
      showToast('Payment detail removed');
    }

    window.onPaymentDetailsTypeChange = onPaymentDetailsTypeChange;
    window.openAddNewPaymentDetailsModal = openAddNewPaymentDetailsModal;
    window.fetchAndRenderPaymentDetails = fetchAndRenderPaymentDetails;
    window.submitAddNewPaymentDetail = submitAddNewPaymentDetail;
    window.deletePaymentDetail = deletePaymentDetail;`;

if (!html.includes(bankJsOld)) {
  console.error('ERROR: Could not find bankJsOld in app.html');
  process.exit(1);
}
html = html.replace(bankJsOld, bankJsNew);

// ==============================================================
// 7. Ensure 'viewPassbook' is in switchNavTab hidden view list
// ==============================================================
const switchNavViewsOld = `['viewPayAnyone', 'viewBankAccounts', 'viewReferEarn', 'viewProductDetails', 'viewLuckyDrawDedicated', 'viewResetPin', 'viewMyOrders', 'viewEcommerceCheckout'].forEach(id => {`;
const switchNavViewsNew = `['viewPayAnyone', 'viewBankAccounts', 'viewReferEarn', 'viewProductDetails', 'viewLuckyDrawDedicated', 'viewResetPin', 'viewMyOrders', 'viewEcommerceCheckout', 'viewPassbook'].forEach(id => {`;

if (html.includes(switchNavViewsOld)) {
  html = html.replace(switchNavViewsOld, switchNavViewsNew);
}

// Convert back to CRLF
const finalHtml = html.replace(/\n/g, '\r\n');
fs.writeFileSync(appHtmlPath, finalHtml, 'utf8');
console.log('Successfully applied all pending updates to public/app.html! New size:', finalHtml.length);
