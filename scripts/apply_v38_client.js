const fs = require('fs');
const vm = require('vm');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

// ------------------------------------------------------------------
// 1. REDESIGN #viewPassbook (Part 2: Mobile-Responsive Zerodha/FD + EasyPay Theme)
// ------------------------------------------------------------------
const passbookStart = app.indexOf('      <div id="viewPassbook" class="view-panel"');
const passbookEnd = app.indexOf('      <!-- ==============================================================\n           VIEW 5: PROFILE TAB');
if (passbookStart === -1 || passbookEnd === -1) throw new Error('viewPassbook markers not found');

const newPassbookHtml = `      <div id="viewPassbook" class="view-panel" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        
        <!-- EasyPay Orange Hero Header (Matches Home & Profile) -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 26px; color: #FFFFFF; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <button onclick="closePassbookView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">Passbook & Portfolio</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.88);">DICGC Insured FDs & Transaction Ledger</div>
              </div>
            </div>
            <span style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); padding: 4px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 800;">
              <i class="fa-solid fa-shield-halved"></i> Verified
            </span>
          </div>
        </div>

        <div style="padding: 0 14px 36px; margin-top: -14px; position: relative; z-index: 101;">
          <!-- Segmented Tab Switcher -->
          <div style="background: #FFFFFF; border-radius: 14px; padding: 5px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; box-shadow: 0 4px 14px rgba(15,23,42,0.06); margin-bottom: 14px; border: 1px solid #F1F5F9;">
            <button id="btnPassbookPortfolio" onclick="switchPassbookSegment('portfolio')" style="padding: 10px 12px; border-radius: 10px; border: none; background: #FF5722; color: #FFFFFF; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <i class="fa-solid fa-chart-pie"></i> FD & Bonds Portfolio
            </button>
            <button id="btnPassbookTxns" onclick="switchPassbookSegment('txns')" style="padding: 10px 12px; border-radius: 10px; border: none; background: transparent; color: #64748B; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <i class="fa-solid fa-list-check"></i> All Transactions
            </button>
          </div>

          <!-- Portfolio Segment (Zerodha / Modern FD Style) -->
          <div id="passbookPortfolioSegment">
            <!-- Portfolio Summary Card -->
            <div style="background: #FFFFFF; border: 1.5px solid #FFE0B2; border-radius: 18px; padding: 16px; margin-bottom: 14px; box-shadow: 0 4px 16px rgba(255,87,34,0.08);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Total Invested Portfolio</span>
                <span style="background: #ECFDF5; color: #059669; font-size: 10.5px; font-weight: 800; padding: 3px 8px; border-radius: 999px;">
                  <i class="fa-solid fa-shield-check"></i> DICGC Protected
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
                <span style="font-family: var(--font-heading); font-size: 28px; font-weight: 900; color: #0F172A;" id="portfolioTotalPrincipal">₹0.00</span>
                <span style="font-size: 13px; color: #059669; font-weight: 800; background: #ECFDF5; padding: 3px 8px; border-radius: 8px;" id="portfolioTotalReturnsBadge">+₹0 Returns</span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #FFF8F5; border: 1px solid #FFEDD5; border-radius: 12px; padding: 10px;">
                <div>
                  <div style="font-size: 10px; color: #64748B; font-weight: 700;">MATURITY VALUE</div>
                  <div style="font-size: 13.5px; font-weight: 900; color: #0F172A; margin-top: 2px;" id="portfolioMaturityValue">₹0</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: #64748B; font-weight: 700;">DAILY PAYOUT</div>
                  <div style="font-size: 13.5px; font-weight: 900; color: #FF5722; margin-top: 2px;" id="portfolioDailyReturn">+₹0/day</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 10px; color: #64748B; font-weight: 700;">ACTIVE FDs</div>
                  <div style="font-size: 13.5px; font-weight: 900; color: #059669; margin-top: 2px;" id="activeBondsCountBadge">0 Active</div>
                </div>
              </div>
            </div>

            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="font-size: 15px; font-weight: 800; color: #0F172A;">My Booked Bonds & FDs</div>
                <span style="font-size: 11px; color: #FF5722; font-weight: 700; cursor: pointer;" onclick="closePassbookView(); switchNavTab('bonds');">+ Book New FD</span>
              </div>
              <div id="bookedBondsListContainer" style="display: flex; flex-direction: column; gap: 12px;"></div>
            </div>
          </div>

          <!-- Transactions Ledger Segment -->
          <div id="passbookTxnsSegment" style="display: none;">
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="font-size: 15px; font-weight: 800; color: #0F172A;">Transactions Ledger</div>
                <span style="font-size: 10.5px; font-weight: 800; color: #059669; background: #ECFDF5; padding: 3px 8px; border-radius: 999px;">Real-Time Synced</span>
              </div>
              <div id="transactionsListContainer"></div>
            </div>
          </div>
        </div>
      </div>

`;
app = app.slice(0, passbookStart) + newPassbookHtml + app.slice(passbookEnd);

// Update switchPassbookSegment button styling for EasyPay orange tabs
const oldSwitchPassbook = `      if (seg === 'portfolio') {
        if (btnPort) btnPort.classList.add('active');
        if (btnTxns) btnTxns.classList.remove('active');
        if (segPort) segPort.style.display = 'block';
        if (segTxns) segTxns.style.display = 'none';
        if (typeof renderBookedBondsList === 'function') renderBookedBondsList();
      } else {
        if (btnTxns) btnTxns.classList.add('active');
        if (btnPort) btnPort.classList.remove('active');
        if (segPort) segPort.style.display = 'none';
        if (segTxns) segTxns.style.display = 'block';
        renderPassbookTransactionsLedger();
      }`;
const newSwitchPassbook = `      if (seg === 'portfolio') {
        if (btnPort) { btnPort.style.background = '#FF5722'; btnPort.style.color = '#FFFFFF'; btnPort.style.fontWeight = '800'; }
        if (btnTxns) { btnTxns.style.background = 'transparent'; btnTxns.style.color = '#64748B'; btnTxns.style.fontWeight = '700'; }
        if (segPort) segPort.style.display = 'block';
        if (segTxns) segTxns.style.display = 'none';
        if (typeof renderBookedBonds === 'function') renderBookedBonds();
      } else {
        if (btnTxns) { btnTxns.style.background = '#FF5722'; btnTxns.style.color = '#FFFFFF'; btnTxns.style.fontWeight = '800'; }
        if (btnPort) { btnPort.style.background = 'transparent'; btnPort.style.color = '#64748B'; btnPort.style.fontWeight = '700'; }
        if (segPort) segPort.style.display = 'none';
        if (segTxns) segTxns.style.display = 'block';
        renderPassbookTransactionsLedger();
      }`;
if (!app.includes(oldSwitchPassbook)) throw new Error('oldSwitchPassbook not found');
app = app.replace(oldSwitchPassbook, () => newSwitchPassbook);

// Update renderBookedBonds() and renderTransactions()
const oldRenderBonds = `    function renderBookedBonds() {
      const list = appData.investments || [];
      const container = document.getElementById('bookedBondsListContainer');
      const countBadge = document.getElementById('activeBondsCountBadge');
      if (countBadge) countBadge.innerText = list.length + ' Active';

      if (!container) return;
      if (list.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #94A3B8; padding: 20px;">No active investments yet. Start investing today!</div>';
        return;
      }

      container.innerHTML = list.map(b => {
        const principal = (b.principal || 50000).toLocaleString('en-IN');
        const maturity = (b.maturityAmount || 76850).toLocaleString('en-IN');
        return '<div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 14px;">' +
          '<div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
            '<div>' +
              '<div style="font-family: var(--font-heading); font-size: 15px; font-weight: 800; color: #0F172A;">' + b.institution + '</div>' +
              '<div style="font-size: 11px; color: #64748B;">' + b.category + ' • Rate: ' + (b.monthlyRate || b.interestRate) + '% per month (Daily Payout)</div>' +
            '</div>' +
            '<span class="section-badge" style="background: #ECFDF5; color: #059669;">DICGC Insured</span>' +
          '</div>' +
          '<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #CBD5E1;">' +
            '<div>' +
              '<div style="font-size: 10px; color: #64748B;">INVESTED VALUE</div>' +
              '<div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800;">₹' + principal + '</div>' +
            '</div>' +
            '<div style="text-align: right;">' +
              '<div style="font-size: 10px; color: #64748B;">MATURITY AMOUNT</div>' +
              '<div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: #059669;">₹' + maturity + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="font-size: 10px; color: #94A3B8; margin-top: 8px;">Cert: ' + (b.certNumber || 'DICGC-EP-982172') + ' • Maturity: ' + (b.maturityDate || '11 Nov 2031') + '</div>' +
        '</div>';
      }).join('');
    }`;

const newRenderBonds = `    function renderBookedBonds() {
      const list = appData.investments || [];
      const container = document.getElementById('bookedBondsListContainer');
      const countBadge = document.getElementById('activeBondsCountBadge');
      if (countBadge) countBadge.innerText = list.length + ' Active';

      let totalPrincipal = 0;
      let totalMaturity = 0;
      let totalDaily = 0;
      list.forEach(b => {
        const p = Number(b.principal || 0);
        const m = Number(b.maturityAmount || p);
        const rate = Number(b.monthlyRate || b.interestRate || 8.6);
        const daily = Number(b.dailyPayout || ((p * (rate / 100)) / 30));
        totalPrincipal += p;
        totalMaturity += m;
        totalDaily += daily;
      });
      const totalReturns = Math.max(0, totalMaturity - totalPrincipal);

      const elPrin = document.getElementById('portfolioTotalPrincipal');
      const elMat = document.getElementById('portfolioMaturityValue');
      const elRet = document.getElementById('portfolioTotalReturnsBadge');
      const elDaily = document.getElementById('portfolioDailyReturn');
      if (elPrin) elPrin.innerText = '₹' + totalPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      if (elMat) elMat.innerText = '₹' + totalMaturity.toLocaleString('en-IN');
      if (elRet) elRet.innerText = '+₹' + totalReturns.toLocaleString('en-IN') + ' Returns';
      if (elDaily) elDaily.innerText = '+₹' + totalDaily.toFixed(2) + '/day';

      if (!container) return;
      if (list.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #94A3B8; padding: 20px;">No active investments yet. Start investing today!</div>';
        return;
      }

      container.innerHTML = list.map(b => {
        const p = Number(b.principal || 0);
        const m = Number(b.maturityAmount || p);
        const rate = Number(b.monthlyRate || b.interestRate || 8.6);
        const daily = Number(b.dailyPayout || ((p * (rate / 100)) / 30));
        return '<div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 14px; box-shadow: 0 2px 8px rgba(15,23,42,0.03);">' +
          '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">' +
            '<div style="display: flex; align-items: center; gap: 10px;">' +
              '<div style="width: 38px; height: 38px; border-radius: 10px; background: #FFF3E0; color: #FF5722; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;">' +
                '<i class="fa-solid fa-landmark"></i>' +
              '</div>' +
              '<div>' +
                '<div style="font-family: var(--font-heading); font-size: 14.5px; font-weight: 800; color: #0F172A;">' + (b.institution || 'Fixed Deposit') + '</div>' +
                '<div style="font-size: 11px; color: #64748B;">' + (b.category || 'FD') + ' • ' + rate + '% p.m. (Daily Payout)</div>' +
              '</div>' +
            '</div>' +
            '<span style="background: #ECFDF5; color: #059669; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 999px; white-space: nowrap;">DICGC Insured</span>' +
          '</div>' +
          '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed #E2E8F0;">' +
            '<div>' +
              '<div style="font-size: 10px; color: #64748B; font-weight: 700;">INVESTED</div>' +
              '<div style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; color: #0F172A;">₹' + p.toLocaleString('en-IN') + '</div>' +
            '</div>' +
            '<div>' +
              '<div style="font-size: 10px; color: #64748B; font-weight: 700;">DAILY RETURN</div>' +
              '<div style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; color: #FF5722;">+₹' + daily.toFixed(2) + '</div>' +
            '</div>' +
            '<div style="text-align: right;">' +
              '<div style="font-size: 10px; color: #64748B; font-weight: 700;">MATURITY</div>' +
              '<div style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; color: #059669;">₹' + m.toLocaleString('en-IN') + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; color: #64748B; margin-top: 10px; background: #F8FAFC; padding: 6px 10px; border-radius: 8px;">' +
            '<span>Cert: <strong>' + (b.certNumber || 'DICGC-EP-982172') + '</strong></span>' +
            '<span>Maturity: <strong>' + (b.maturityDate || '11 Nov 2031') + '</strong></span>' +
          '</div>' +
        '</div>';
      }).join('');
    }`;
if (!app.includes(oldRenderBonds)) throw new Error('oldRenderBonds not found');
app = app.replace(oldRenderBonds, () => newRenderBonds);

// Update renderTransactions() status badge colors for PENDING, FAILED, SUCCESS
const oldTxnStatusLine = `            (t.cashback ? '<div style="font-size: 10px; font-weight: 700; color: #059669;">+₹' + t.cashback.toFixed(1) + ' Bachat</div>' : '<span style="font-size: 10px; font-weight: 700; color: #059669; background: #ECFDF5; padding: 2px 6px; border-radius: 4px;">' + (t.status || 'SUCCESS') + '</span>') +`;
const newTxnStatusLine = `            (t.cashback ? '<div style="font-size: 10px; font-weight: 700; color: #059669;">+₹' + t.cashback.toFixed(1) + ' Cashback</div>' : (() => { const st = (t.status || 'SUCCESS').toUpperCase(); const stBg = st === 'PENDING' ? '#FFFBEB' : (st === 'FAILED' ? '#FEF2F2' : '#ECFDF5'); const stClr = st === 'PENDING' ? '#D97706' : (st === 'FAILED' ? '#DC2626' : '#059669'); return '<span style="font-size: 10px; font-weight: 800; color: ' + stClr + '; background: ' + stBg + '; padding: 2px 7px; border-radius: 999px;">' + st + '</span>'; })()) +`;
if (!app.includes(oldTxnStatusLine)) throw new Error('oldTxnStatusLine not found');
app = app.replace(oldTxnStatusLine, () => newTxnStatusLine);

// ------------------------------------------------------------------
// 2. FIX GIFT VOUCHERS & COHESIVE UI (Part 3: No undefined, Date/Time, Validity, EasyPay Orange Theme)
// ------------------------------------------------------------------
const oldVouchersFnStart = '    function renderVouchersOrders() {';
const oldVouchersFnEnd = '    function openTrackingModal(orderId) {';
const vStart = app.indexOf(oldVouchersFnStart);
const vEnd = app.indexOf(oldVouchersFnEnd);
if (vStart === -1 || vEnd === -1) throw new Error('renderVouchersOrders bounds not found');

const newRenderVouchersFn = `    function renderVouchersOrders() {
      const wrap = document.getElementById('vouchersOrdersContainer');
      if (!wrap) return;

      const vouchers = appData.vouchers || [];
      if (vouchers.length === 0) {
        wrap.innerHTML = \`
          <div style="text-align: center; padding: 40px 10px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0;">
            <i class="fa-solid fa-ticket" style="font-size: 36px; color: #CBD5E1; margin-bottom: 10px;"></i>
            <div style="font-size: 15px; font-weight: 700; color: #0F172A;">No Gift Vouchers Purchased Yet</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Explore brands in the Gift tab and get instant cashback</div>
          </div>
        \`;
        return;
      }

      wrap.innerHTML = vouchers.map(v => {
        const brandTitle = v.brand || v.brandName || v.name || 'EasyPay Gift Voucher';
        const codeStr = v.voucherCode || v.code || 'EPY-VCH-84920';
        const valAmt = v.amount || v.faceValue || 100;
        const pDate = v.purchasedAt ? new Date(v.purchasedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Recently Purchased';
        const validStr = v.validTill || v.expiryDate || '2027-11-25';
        const logoUrl = v.logo || '/assets/bachatpay/home/gift_card_icon.png';

        return \`
        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 16px; box-shadow: 0 3px 10px rgba(15,23,42,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="\${logoUrl}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/879/879757.png'" style="width: 42px; height: 42px; border-radius: 10px; object-fit: contain; background: #FFF8F5; border: 1px solid #FFEDD5; padding: 4px;">
              <div>
                <div style="font-size: 15px; font-weight: 800; color: #0F172A;">\${brandTitle}</div>
                <div style="font-size: 12px; color: #FF5722; font-weight: 800;">Face Value: ₹\${Number(valAmt).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <span style="background: #DCFCE7; color: #16A34A; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 999px;">\${v.status || 'ACTIVE'}</span>
          </div>

          <div style="background: #FFF8F5; border: 1.5px dashed #FDBA74; border-radius: 12px; padding: 10px 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 10px; font-weight: 800; color: #9A3412;">VOUCHER CODE</div>
              <div style="font-family: monospace; font-size: 13.5px; font-weight: 800; color: #0F172A; letter-spacing: 0.8px;">\${codeStr}</div>
            </div>
            <button onclick="copyToClipboard('\${codeStr}'); showToast('Voucher code copied!')" style="background: #FF5722; color: #FFFFFF; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer;">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #475569; background: #F8FAFC; padding: 8px 10px; border-radius: 10px;">
            <div><span style="color: #94A3B8; display: block; font-size: 9.5px; font-weight: 700;">PURCHASED ON</span><strong>\${pDate}</strong></div>
            <div style="text-align: right;"><span style="color: #94A3B8; display: block; font-size: 9.5px; font-weight: 700;">VALID UNTIL</span><strong style="color: #059669;">\${validStr}</strong></div>
          </div>
          \${v.pin ? \`<div style="font-size: 11.5px; color: #475569; margin-top: 8px; display: flex; justify-content: space-between;"><span>Security PIN: <strong style="color: #0F172A; font-family: monospace;">\${v.pin}</strong></span><span style="color: #059669; font-weight: 700;">Saved ₹\${v.discount || 0}</span></div>\` : ''}
        </div>
      \`;
      }).join('');
    }

`;
app = app.slice(0, vStart) + newRenderVouchersFn + app.slice(vEnd);

// Also align My Orders Track Order button with EasyPay orange
app = app.replace(
  `<button onclick="openTrackingModal('\${ord.id}')" style="flex: 1; background: #0F172A; color: white; border: none; padding: 9px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">`,
  `<button onclick="openTrackingModal('\${ord.id}')" style="flex: 1; background: linear-gradient(135deg, #FF5722, #FF7043); color: white; border: none; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 3px 10px rgba(255,87,34,0.2);">`
);

// ------------------------------------------------------------------
// 3. REDESIGN #viewReferEarn (Part 4: 10-Level Tree, Search by ID, Referral Link, First Deposit Bonus)
// ------------------------------------------------------------------
const referStart = app.indexOf('      <!-- ==============================================================\n           REFER & EARN / WIN REWARDS');
const referEnd = app.indexOf('      <!-- ==============================================================\n           PAYMENT DETAILS MANAGEMENT VIEW');
if (referStart === -1 || referEnd === -1) throw new Error('viewReferEarn markers not found');

const newReferHtml = `      <!-- ==============================================================
           REFER & EARN — 10-LEVEL NETWORK & COMMISSION ENGINE
           ============================================================== -->
      <div class="view-panel" id="viewReferEarn" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- EasyPay Orange Hero Header -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 28px; color: #FFFFFF; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <button onclick="closeReferEarnView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800;">Refer & Earn (10 Levels)</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.9);">Earn First Deposit Bonus & Multi-Level Income</div>
              </div>
            </div>
            <button onclick="showToast('Earn 5% First Deposit Bonus + 10-Level Commissions!')" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 800; color: #FFFFFF; cursor: pointer;">
              Rules
            </button>
          </div>
        </div>

        <div style="padding: 0 14px 70px; margin-top: -16px; position: relative; z-index: 101;">
          <!-- Referral Earnings & Stats Summary Card -->
          <div style="background: #FFFFFF; border: 1.5px solid #FFE0B2; border-radius: 18px; padding: 16px; margin-bottom: 14px; box-shadow: 0 4px 16px rgba(255,87,34,0.08);">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
              <div style="background: #FFF8F5; border-radius: 12px; padding: 10px 6px;">
                <div style="font-size: 10px; font-weight: 700; color: #64748B;">REFERRAL EARNINGS</div>
                <div style="font-size: 18px; font-weight: 900; color: #059669; margin-top: 2px;" id="referTotalEarningsText">₹0.00</div>
              </div>
              <div style="background: #FFF8F5; border-radius: 12px; padding: 10px 6px;">
                <div style="font-size: 10px; font-weight: 700; color: #64748B;">1ST DEPOSIT BONUS</div>
                <div style="font-size: 18px; font-weight: 900; color: #FF5722; margin-top: 2px;" id="referFirstBonusPctText">5%</div>
              </div>
              <div style="background: #FFF8F5; border-radius: 12px; padding: 10px 6px;">
                <div style="font-size: 10px; font-weight: 700; color: #64748B;">TOTAL TEAM</div>
                <div style="font-size: 18px; font-weight: 900; color: #0F172A; margin-top: 2px;" id="referTotalTeamText">0</div>
              </div>
            </div>

            <!-- Unique Referral Link & Code -->
            <div style="margin-top: 14px; background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px; padding: 10px 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-size: 10.5px; font-weight: 800; color: #64748B;">YOUR UNIQUE REFERRAL LINK</span>
                <span style="font-size: 11px; font-weight: 800; color: #FF5722;" id="referMyCodeBadge">ID: EPY98808</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="text" id="referUniqueLinkInput" readonly value="https://easypay.app/app?ref=EPY98808" style="flex: 1; font-size: 11.5px; font-weight: 700; color: #0F172A; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 7px 10px; outline: none;">
                <button onclick="shareReferralLink()" style="background: #0F172A; color: #FFFFFF; border: none; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; white-space: nowrap;">
                  <i class="fa-regular fa-copy"></i> Copy
                </button>
              </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 12px;">
              <button onclick="shareReferralViaWhatsApp()" style="flex: 1; height: 44px; background: linear-gradient(135deg, #FF5722, #FF7043); color: #FFFFFF; border: none; border-radius: 12px; font-size: 13.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(255,87,34,0.25);">
                <i class="fa-brands fa-whatsapp" style="font-size: 18px;"></i> Invite Friends via WhatsApp
              </button>
            </div>
          </div>

          <!-- Search Member by User ID across 10 Levels -->
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 14px; margin-bottom: 14px;">
            <div style="font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">
              <i class="fa-solid fa-magnifying-glass" style="color: #FF5722;"></i> Search Downline by User ID
            </div>
            <input type="text" id="referSearchUserInput" placeholder="Enter User ID (e.g. EPY43210) or Name..." oninput="renderReferralLevelView()" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 10px; border: 1.5px solid #CBD5E1; font-size: 13px; outline: none; background: #F8FAFC;">
          </div>

          <!-- 10-Level Commission & Network Explorer -->
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 800; color: #0F172A;">10-Level Referral Structure</div>
              <span style="font-size: 11px; font-weight: 700; color: #FF5722;" id="referSelectedLevelMeta">Level 1 • 5%</span>
            </div>

            <!-- Level 1 to 10 Horizontal Scroll Pills -->
            <div id="referLevelPills" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 14px;">
              <!-- Populated dynamically L1-L10 -->
            </div>

            <!-- Members List for Selected Level / Search -->
            <div id="referLevelMembersList" style="display: flex; flex-direction: column; gap: 8px;">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>
      </div>

`;
app = app.slice(0, referStart) + newReferHtml + app.slice(referEnd);

// Update Refer & Earn JS Controller
const oldReferJs = `    function openReferEarnView() {
      document.querySelectorAll('.view-panel').forEach(v => v.style.display = 'none');
      const v = document.getElementById('viewReferEarn');
      if (v) v.style.display = 'block';
      window.scrollTo(0, 0);
    }

    function closeReferEarnView() {
      const v = document.getElementById('viewReferEarn');
      if (v) v.style.display = 'none';
      switchNavTab('profile');
    }

    function shareReferralViaWhatsApp() {
      const msg = encodeURIComponent("Hey! Join EasyPay using my referral link and win assured ₹400 cashback on your first recharge or money transfer: https://easypay.app/ref/EPY98808");
      window.open('whatsapp://send?text=' + msg, '_system');
    }

    function shareReferralLink() {
      const link = 'https://easypay.app/ref/EPY98808';
      copyToClipboard(link);
      showToast('Referral link copied to clipboard!');
    }`;

const newReferJs = `    let currentReferralData = null;
    let activeReferralLevel = 1;

    async function openReferEarnView() {
      document.querySelectorAll('.view-panel').forEach(v => v.style.display = 'none');
      const v = document.getElementById('viewReferEarn');
      if (v) v.style.display = 'block';
      window.scrollTo(0, 0);

      const u = appData.user || {};
      const myId = u.id || 'EPY98808';
      const refLink = window.location.origin + '/app?ref=' + myId;
      if (document.getElementById('referMyCodeBadge')) document.getElementById('referMyCodeBadge').innerText = 'ID: ' + myId;
      if (document.getElementById('referUniqueLinkInput')) document.getElementById('referUniqueLinkInput').value = refLink;

      try {
        const res = await fetch(API_BASE + '/api/referral/network?userId=' + encodeURIComponent(myId));
        if (res.ok) {
          currentReferralData = await res.json();
          if (document.getElementById('referTotalEarningsText')) {
            document.getElementById('referTotalEarningsText').innerText = '₹' + Number(currentReferralData.totalEarnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
          }
          if (document.getElementById('referFirstBonusPctText')) {
            document.getElementById('referFirstBonusPctText').innerText = (currentReferralData.firstDepositBonusPercent || 5) + '%';
          }
          if (document.getElementById('referTotalTeamText')) {
            document.getElementById('referTotalTeamText').innerText = currentReferralData.totalMembers || 0;
          }
          renderReferralLevelView();
        }
      } catch (e) {
        console.warn('Could not load 10-level referral network', e);
      }
    }

    function selectReferralLevel(lvl) {
      activeReferralLevel = lvl;
      renderReferralLevelView();
    }

    function renderReferralLevelView() {
      const data = currentReferralData;
      const pillsWrap = document.getElementById('referLevelPills');
      const listWrap = document.getElementById('referLevelMembersList');
      const metaEl = document.getElementById('referSelectedLevelMeta');
      const searchQ = (document.getElementById('referSearchUserInput')?.value || '').trim().toLowerCase();

      if (!data || !data.levels) return;

      if (pillsWrap) {
        pillsWrap.innerHTML = data.levels.map(l => {
          const isAct = l.level === activeReferralLevel;
          return '<button type="button" onclick="selectReferralLevel(' + l.level + ')" style="padding: 7px 4px; border-radius: 10px; border: 1.5px solid ' + (isAct ? '#FF5722' : '#E2E8F0') + '; background: ' + (isAct ? '#FFF3E0' : '#F8FAFC') + '; color: ' + (isAct ? '#FF5722' : '#334155') + '; cursor: pointer; text-align: center;">' +
            '<div style="font-size: 11px; font-weight: 800;">L' + l.level + ' (' + l.count + ')</div>' +
            '<div style="font-size: 9.5px; font-weight: 700; color: ' + (isAct ? '#E65100' : '#64748B') + ';">' + l.commissionPercent + '%</div>' +
          '</button>';
        }).join('');
      }

      let membersToShow = [];
      if (searchQ) {
        data.levels.forEach(l => {
          l.members.forEach(m => {
            if ((m.id || '').toLowerCase().includes(searchQ) || (m.name || '').toLowerCase().includes(searchQ) || (m.mobile || '').includes(searchQ)) {
              membersToShow.push({ ...m, level: l.level });
            }
          });
        });
        if (metaEl) metaEl.innerText = 'Search Results (' + membersToShow.length + ')';
      } else {
        const lvlObj = data.levels.find(l => l.level === activeReferralLevel) || data.levels[0];
        membersToShow = (lvlObj.members || []).map(m => ({ ...m, level: lvlObj.level }));
        if (metaEl) metaEl.innerText = 'Level ' + lvlObj.level + ' • ' + lvlObj.commissionPercent + '% Commission';
      }

      if (listWrap) {
        if (membersToShow.length === 0) {
          listWrap.innerHTML = '<div style="text-align: center; padding: 20px; color: #94A3B8; font-size: 12px;">No members found at this level. Share your referral link to grow your team!</div>';
        } else {
          listWrap.innerHTML = membersToShow.map(m => {
            const isAct = m.status === 'ACTIVE';
            const jDate = m.registeredAt ? new Date(m.registeredAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Joined';
            return '<div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 12px;">' +
              '<div style="display: flex; align-items: center; gap: 10px;">' +
                '<div style="width: 34px; height: 34px; border-radius: 50%; background: #FF5722; color: #FFFFFF; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center;">' + (m.name || 'U')[0].toUpperCase() + '</div>' +
                '<div>' +
                  '<div style="font-size: 13px; font-weight: 800; color: #0F172A;">' + m.name + ' <span style="font-size: 10px; color: #7C3AED; font-weight: 800;">(L' + m.level + ')</span></div>' +
                  '<div style="font-size: 11px; color: #64748B;">ID: <strong>' + m.id + '</strong> • ' + jDate + '</div>' +
                '</div>' +
              '</div>' +
              '<span style="font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 999px; background: ' + (isAct ? '#DCFCE7' : '#FEF3C7') + '; color: ' + (isAct ? '#15803D' : '#B45309') + ';">' + (isAct ? 'ACTIVE' : 'NOT ACTIVE') + '</span>' +
            '</div>';
          }).join('');
        }
      }
    }

    function closeReferEarnView() {
      const v = document.getElementById('viewReferEarn');
      if (v) v.style.display = 'none';
      switchNavTab('profile');
    }

    function shareReferralViaWhatsApp() {
      const u = appData.user || {};
      const myId = u.id || 'EPY98808';
      const link = window.location.origin + '/app?ref=' + myId;
      const msg = encodeURIComponent("Hey! Join EasyPay using my referral link & earn cashback on your first deposit: " + link);
      window.open('whatsapp://send?text=' + msg, '_system');
    }

    function shareReferralLink() {
      const u = appData.user || {};
      const myId = u.id || 'EPY98808';
      const link = window.location.origin + '/app?ref=' + myId;
      copyToClipboard(link);
      showToast('Referral link copied to clipboard!');
    }`;
if (!app.includes(oldReferJs)) throw new Error('oldReferJs not found');
app = app.replace(oldReferJs, () => newReferJs);

// Capture ?ref= query param on load & auto-fill #epSignupReferral
const refCaptureJs = `    // Capture ?ref= referral code on page load
    (function captureUrlReferral() {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref && ref.trim()) {
          localStorage.setItem('easypay_pending_ref', ref.trim());
        }
      } catch (e) {}
    })();`;
app = app.replace('    let hasRunInitialAppLaunch = false;', refCaptureJs + '\n    let hasRunInitialAppLaunch = false;');

const oldSignupFocus = `        const nameInput = document.getElementById('epSignupName');
        if (nameInput) nameInput.focus();`;
const newSignupFocus = `        const refInput = document.getElementById('epSignupReferral');
        const pendingRef = localStorage.getItem('easypay_pending_ref');
        if (refInput && pendingRef && !refInput.value) refInput.value = pendingRef;
        const nameInput = document.getElementById('epSignupName');
        if (nameInput) nameInput.focus();`;
if (!app.includes(oldSignupFocus)) throw new Error('oldSignupFocus not found');
app = app.replace(oldSignupFocus, () => newSignupFocus);

// ------------------------------------------------------------------
// 4. TO BANK / SELF -> SAVED PAYMENT PICKER -> DYNAMIC ENTER AMOUNT / USDT -> WITHDRAWAL REQUEST
// ------------------------------------------------------------------
const enterAmountModalAnchor = '  <div class="modal-overlay" id="enterAmountToPayModal" style="align-items: flex-end; z-index: 10001;">';
const selectSavedPaymentModalHtml = `  <!-- Saved Payment Methods Picker Modal (To Bank / Self Withdrawal) -->
  <div class="modal-overlay" id="selectSavedPaymentModal" style="align-items: flex-end; z-index: 10000;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 20px 18px 28px; max-height: 85vh; overflow-y: auto;">
      <div style="width: 40px; height: 4px; background: #CBD5E1; border-radius: 2px; margin: 0 auto 14px;"></div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <div>
          <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 900; color: #0F172A;">Select Saved Payment Method</div>
          <div style="font-size: 12px; color: #64748B;">Choose your Bank Account, UPI ID, or USDT Address to withdraw</div>
        </div>
        <button style="background: none; border: none; font-size: 18px; color: #64748B; cursor: pointer;" onclick="closeModal('selectSavedPaymentModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div id="savedPaymentPickerList" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
        <!-- Populated dynamically -->
      </div>
      <button type="button" onclick="closeModal('selectSavedPaymentModal'); openBankAccountsView();" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px dashed #FF5722; background: #FFF8F5; color: #FF5722; font-size: 13px; font-weight: 800; cursor: pointer;">
        <i class="fa-solid fa-plus"></i> Add or Manage Payment Details in Profile
      </button>
    </div>
  </div>

`;
if (!app.includes(enterAmountModalAnchor)) throw new Error('enterAmountModalAnchor not found');
app = app.replace(enterAmountModalAnchor, () => selectSavedPaymentModalHtml + enterAmountModalAnchor);

// Add dynamic USDT symbol & conversion preview inside #enterAmountToPayModal
const oldAmountInputHtml = `      <!-- Large Clean Amount Input with Currency Symbol -->
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
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px;">`;

const newAmountInputHtml = `      <!-- Large Clean Amount Input with Dynamic Currency Symbol (INR / USDT) -->
      <div style="text-align: center; margin-bottom: 18px;">
        <div style="display: inline-flex; align-items: baseline; justify-content: center; border-bottom: 2.5px solid #FF5722; padding: 6px 16px; max-width: 300px; width: 100%;">
          <span id="enterPayCurrencySymbol" style="font-size: 26px; font-weight: 800; color: #0F172A; margin-right: 6px;">₹</span>
          <input type="number" id="enterPayAmountInput" placeholder="0" min="1" step="any" autofocus oninput="updateWithdrawalUsdtConversion()"
            style="border: none; background: transparent; font-size: 36px; font-weight: 900; color: #0F172A; width: 170px; text-align: left; outline: none; font-family: var(--font-heading);">
        </div>
        <div id="enterPayUsdtConversionBox" style="display: none; margin-top: 8px; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 7px 12px; font-size: 12px; font-weight: 700; color: #065F46;">
          Deducted from Wallet: <strong id="enterPayUsdtInrText">₹0.00</strong> <span style="font-weight: 600; color: #047857;">(Rate: ₹<span id="enterPayUsdtRateText">92.50</span>/USDT)</span>
        </div>
        <div style="font-size: 11.5px; color: #64748B; margin-top: 8px;">
          Available in E-Pay Wallet: <strong style="color: #059669;" id="enterPayAvailableBalance">₹24,500.00</strong>
        </div>
      </div>

      <!-- Quick Amount Chips -->
      <div id="enterPayQuickChips" style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px;">`;

if (!app.includes(oldAmountInputHtml)) throw new Error('oldAmountInputHtml not found');
app = app.replace(oldAmountInputHtml, () => newAmountInputHtml);

// Update openToBankOrSelfTransfer() + openEnterAmountModal() + proceedFromAmountToPaySource()
const oldToBankFn = `    // HOME: To Bank/Self Transfer Flow using Saved Banks (Prompt for Amount First)
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

const newToBankFn = `    let savedPaymentMethodsCache = [];
    let currentUsdtExchangeRate = 92.5;

    // HOME: To Bank/Self Transfer Flow -> Show Saved Payment Methods First
    async function openToBankOrSelfTransfer() {
      try {
        const [pdRes, cfgRes] = await Promise.all([
          fetch(API_BASE + '/api/user/payment-details'),
          fetch(API_BASE + '/api/settings/public')
        ]);
        if (pdRes.ok) {
          const pdData = await pdRes.json();
          if (pdData.success && Array.isArray(pdData.paymentDetails)) {
            savedPaymentMethodsCache = pdData.paymentDetails;
          }
        }
        if (cfgRes.ok) {
          const cfgData = await cfgRes.json();
          if (cfgData.success && cfgData.usdtRate) {
            currentUsdtExchangeRate = Number(cfgData.usdtRate) || 92.5;
          }
        }
      } catch (e) {
        console.warn('Error fetching saved payment methods', e);
      }

      if (!savedPaymentMethodsCache.length && appData.user && Array.isArray(appData.user.paymentDetails)) {
        savedPaymentMethodsCache = appData.user.paymentDetails;
      }

      const listEl = document.getElementById('savedPaymentPickerList');
      if (listEl) {
        if (!savedPaymentMethodsCache.length) {
          listEl.innerHTML = '<div style="text-align: center; padding: 24px 12px; background: #F8FAFC; border-radius: 14px; border: 1px solid #E2E8F0; color: #64748B; font-size: 13px;">No saved Bank, UPI, or USDT methods found in your Profile. Please add one first.</div>';
        } else {
          listEl.innerHTML = savedPaymentMethodsCache.map((item, idx) => {
            const isBank = item.type === 'bank';
            const isUpi = item.type === 'upi';
            const title = isBank
              ? (item.bankName || 'Bank Account') + (item.holderName ? ' (' + item.holderName + ')' : '')
              : (isUpi ? ('UPI: ' + (item.upiId || '')) : ('USDT (' + (item.usdtNetwork || 'TRC-20') + ')'));
            const sub = isBank
              ? ((item.accountMasked || item.accountRaw || '') + (item.ifsc ? ' • IFSC: ' + item.ifsc : ''))
              : (isUpi ? (item.holderName || 'Instant UPI Withdrawal') : (item.usdtAddressRaw || item.usdtAddress || ''));
            const iconHtml = isBank
              ? '<div style="width:42px; height:42px; border-radius:12px; background:#EFF6FF; color:#2563EB; display:flex; align-items:center; justify-content:center; font-size:18px;"><i class="fa-solid fa-building-columns"></i></div>'
              : (isUpi
                ? '<div style="width:42px; height:42px; border-radius:12px; background:#FFF3E0; color:#FF5722; display:flex; align-items:center; justify-content:center; font-size:18px;"><i class="fa-solid fa-bolt"></i></div>'
                : '<div style="width:42px; height:42px; border-radius:12px; background:#ECFDF5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:18px;"><i class="fa-solid fa-coins"></i></div>');

            return '<div onclick="selectSavedMethodForWithdrawal(' + idx + ')" style="display: flex; align-items: center; justify-content: space-between; background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 12px 14px; cursor: pointer;">' +
              '<div style="display: flex; align-items: center; gap: 12px; min-width: 0;">' +
                iconHtml +
                '<div style="min-width: 0;">' +
                  '<div style="font-size: 14px; font-weight: 800; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + title + '</div>' +
                  '<div style="font-size: 11.5px; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + sub + '</div>' +
                '</div>' +
              '</div>' +
              '<i class="fa-solid fa-chevron-right" style="color: #94A3B8; font-size: 13px;"></i>' +
            '</div>';
          }).join('');
        }
      }

      openModal('selectSavedPaymentModal');
    }

    function selectSavedMethodForWithdrawal(idx) {
      const item = savedPaymentMethodsCache[idx];
      if (!item) return;
      closeModal('selectSavedPaymentModal');

      const isBank = item.type === 'bank';
      const isUpi = item.type === 'upi';
      const label = isBank
        ? ((item.bankName || 'Bank Account') + (item.holderName ? ' (' + item.holderName + ')' : ''))
        : (isUpi ? (item.upiId || 'UPI ID') : ('USDT (' + (item.usdtNetwork || 'TRC-20') + ')'));
      const sub = isBank
        ? ((item.accountMasked || item.accountRaw || '') + (item.ifsc ? ' • ' + item.ifsc : ''))
        : (isUpi ? (item.holderName || 'UPI Transfer') : (item.usdtAddressRaw || item.usdtAddress || ''));

      openEnterAmountModal({
        name: label,
        subtitle: sub,
        type: isBank ? 'Bank Withdrawal' : (isUpi ? 'UPI Withdrawal' : 'USDT Withdrawal'),
        isWithdrawal: true,
        methodType: item.type,
        destinationDetails: item,
        usdtRate: currentUsdtExchangeRate
      });
    }

    function updateWithdrawalUsdtConversion() {
      const rec = pendingPayRecipient || {};
      if (!rec.isWithdrawal || rec.methodType !== 'usdt') return;
      const usdtVal = parseFloat(document.getElementById('enterPayAmountInput')?.value || 0) || 0;
      const rate = Number(rec.usdtRate || currentUsdtExchangeRate || 92.5);
      const inrEq = usdtVal * rate;
      const inrText = document.getElementById('enterPayUsdtInrText');
      if (inrText) inrText.innerText = '₹' + inrEq.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }`;

if (!app.includes(oldToBankFn)) throw new Error('oldToBankFn not found');
app = app.replace(oldToBankFn, () => newToBankFn);

// Update openEnterAmountModal & proceedFromAmountToPaySource for USDT & INR dynamically
const oldOpenEnterEnd = `      if (availEl) {
        const bal = (appData.user && appData.user.walletBalance) || 24500;
        availEl.innerText = '₹' + bal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }`;
const newOpenEnterEnd = `      const currSym = document.getElementById('enterPayCurrencySymbol');
      const convBox = document.getElementById('enterPayUsdtConversionBox');
      const chipsWrap = document.getElementById('enterPayQuickChips');
      const rateEl = document.getElementById('enterPayUsdtRateText');

      if (pendingPayRecipient && pendingPayRecipient.isWithdrawal && pendingPayRecipient.methodType === 'usdt') {
        if (currSym) currSym.innerText = 'USDT';
        if (convBox) convBox.style.display = 'block';
        if (rateEl) rateEl.innerText = Number(pendingPayRecipient.usdtRate || currentUsdtExchangeRate || 92.5).toFixed(2);
        const inrText = document.getElementById('enterPayUsdtInrText');
        if (inrText) inrText.innerText = '₹0.00';
        if (chipsWrap) {
          chipsWrap.innerHTML = [10, 20, 30, 50].map(q => '<button type="button" onclick="addQuickPayAmount(' + q + ')" style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #065F46; cursor: pointer;">+' + q + ' USDT</button>').join('');
        }
      } else {
        if (currSym) currSym.innerText = '₹';
        if (convBox) convBox.style.display = 'none';
        if (chipsWrap) {
          chipsWrap.innerHTML = [100, 200, 500, 1000].map(q => '<button type="button" onclick="addQuickPayAmount(' + q + ')" style="background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #334155; cursor: pointer;">+₹' + q.toLocaleString('en-IN') + '</button>').join('');
        }
      }

      if (availEl) {
        const bal = (appData.user && appData.user.walletBalance) || 0;
        availEl.innerText = '₹' + bal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }`;
if (!app.includes(oldOpenEnterEnd)) throw new Error('oldOpenEnterEnd not found');
app = app.replace(oldOpenEnterEnd, () => newOpenEnterEnd);

const oldProceedFn = `    function proceedFromAmountToPaySource() {
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
    }`;

const newProceedFn = `    function proceedFromAmountToPaySource() {
      const inputEl = document.getElementById('enterPayAmountInput');
      const noteEl = document.getElementById('enterPayNoteInput');
      const rawAmt = parseFloat(inputEl?.value || 0);

      if (!rawAmt || isNaN(rawAmt) || rawAmt <= 0) {
        showToast('Please enter a valid amount');
        if (inputEl) inputEl.focus();
        return;
      }

      const rec = pendingPayRecipient || {};
      const isUsdt = rec.isWithdrawal && rec.methodType === 'usdt';
      const rate = Number(rec.usdtRate || currentUsdtExchangeRate || 92.5);
      const amtInr = isUsdt ? Math.round((rawAmt * rate) * 100) / 100 : rawAmt;

      const bal = (appData.user && appData.user.walletBalance) || 0;
      if (amtInr > bal) {
        showToast('Insufficient wallet balance (Available: ₹' + bal.toLocaleString('en-IN') + ')');
        return;
      }

      closeModal('enterAmountToPayModal');

      openPayFromSourceSheet({
        amount: amtInr,
        amountUsdt: isUsdt ? rawAmt : null,
        usdtRate: isUsdt ? rate : null,
        isWithdrawal: !!rec.isWithdrawal,
        methodType: rec.methodType || null,
        destinationDetails: rec.destinationDetails || null,
        recipientName: rec.name || 'Twizitech Solution',
        recipientSubtitle: (rec.subtitle || rec.payId || ('+91 ' + (rec.mobile || ''))),
        type: rec.type || 'P2P Transfer',
        note: noteEl?.value?.trim() || ''
      });
    }`;
if (!app.includes(oldProceedFn)) throw new Error('oldProceedFn not found');
app = app.replace(oldProceedFn, () => newProceedFn);

// Update addQuickPayAmount to also trigger USDT conversion calculation
app = app.replace(
  `        inputEl.value = curr + addAmt;\n        inputEl.focus();`,
  `        inputEl.value = curr + addAmt;\n        updateWithdrawalUsdtConversion();\n        inputEl.focus();`
);

// Update showInlinePinPaymentSuccess to dispatch Withdrawal Request when p.isWithdrawal is true!
const oldSyncBlockStart = `        // REAL-TIME DATABASE SYNC: Post transaction to server and update server/db.json
        try {`;
const oldSyncBlockEnd = `              if (result.voucher) {`;

const syncStartIdx = app.indexOf(oldSyncBlockStart);
const syncEndIdx = app.indexOf(oldSyncBlockEnd);
if (syncStartIdx === -1 || syncEndIdx === -1) throw new Error('showInlinePinPaymentSuccess sync markers not found');

const newWithdrawalOrTransactSync = `        // REAL-TIME DATABASE SYNC: Withdrawal Request vs Standard Transaction
        try {
          if (p.isWithdrawal) {
            const u = appData.user || {};
            const wRes = await fetch((typeof API_BASE !== 'undefined' ? API_BASE : '') + '/api/withdrawal/request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: u.id || 'EPY98808',
                userName: u.name || 'Nirod Behera',
                userMobile: loggedMobile,
                methodType: p.methodType || 'bank',
                methodLabel: p.recipientName || 'Bank Withdrawal',
                destinationDetails: p.destinationDetails || {},
                amountInr: amt,
                amountUsdt: p.amountUsdt || null,
                usdtRate: p.usdtRate || null,
                note: p.note || ''
              })
            });
            if (wRes.ok) {
              const wData = await wRes.json();
              if (wData.success) {
                if (appData && appData.user) {
                  appData.user.walletBalance = wData.newBalance;
                  localStorage.setItem('easypay_session_user', JSON.stringify(appData.user));
                  updateWalletDisplay();
                  renderWallet();
                }
                if (!appData.transactions) appData.transactions = [];
                appData.transactions.unshift(wData.transaction);
                renderTransactions();
                if (typeof renderPassbookTransactionsLedger === 'function') renderPassbookTransactionsLedger();
                if (utrText && wData.withdrawal) utrText.innerText = wData.withdrawal.id;
                if (recText) recText.innerText = 'Withdrawal Requested (Pending Admin Approval)';
              }
            }
          } else {
            const reqType = isGiftCard ? 'GIFT_CARD' : (
              (p.type === 'Mobile Recharge' || p.type === 'Recharge' || p.type === 'Electricity' || p.type === 'DTH' || p.type === 'FASTag') ? 'RECHARGE' : (
                (p.type === 'Mall Order Checkout' || p.type === 'Product Purchase' || p.type === 'Shopping') ? 'SHOPPING' : 'UPI_TRANSFER'
              )
            );

            const txPayload = {
              type: reqType,
              category: isGiftCard ? 'Gift Card' : (reqType === 'RECHARGE' ? 'Recharge' : (reqType === 'SHOPPING' ? 'Shopping' : 'Money Transfer')),
              amount: amt,
              title: recName,
              recipientName: p.recipientName || recName,
              recipientQuery: p.recipientSubtitle || '',
              utr: utr,
              userMobile: loggedMobile,
              details: {
                brand: p.brand ? p.brand.name : '',
                brandName: p.brand ? p.brand.name : '',
                brandId: p.brand ? p.brand.id : '',
                faceValue: p.faceValue || amt,
                discount: p.discount || 0,
                voucherCode: voucherCode,
                voucherPin: voucherPin,
                validTill: validTill,
                items: p.items || null,
                operator: p.operator || null,
                rechargeNumber: p.rechargeNumber || null
              }
            };

            const res = await fetch((typeof API_BASE !== 'undefined' ? API_BASE : '') + '/api/wallet/transact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(txPayload)
            });

            if (res.ok) {
              const result = await res.json();
              if (result.success) {
                if (appData && appData.user) {
                  appData.user.walletBalance = result.newBalance;
                  localStorage.setItem('easypay_session_user', JSON.stringify(appData.user));
                  updateWalletDisplay();
                  renderWallet();
                }

                if (!appData.transactions) appData.transactions = [];
                appData.transactions.unshift(result.transaction);
                renderTransactions();
                if (typeof renderPassbookTransactionsLedger === 'function') {
                  renderPassbookTransactionsLedger();
                }

`;

// Also close the `else {` after `if (result.voucher)`! Let's check exact lines after `if (result.voucher)`
const afterVoucherIdx = app.indexOf('            }\n          }', syncEndIdx);
if (afterVoucherIdx === -1) throw new Error('afterVoucherIdx not found');

const voucherBlock = app.slice(syncEndIdx, afterVoucherIdx + '            }\n          }'.length);
const closedBlock = newWithdrawalOrTransactSync + '  ' + voucherBlock.replace(/\n/g, '\n  ') + '\n          }';
app = app.slice(0, syncStartIdx) + closedBlock + app.slice(afterVoucherIdx + '            }\n          }'.length);

// Expose new functions to window
app = app.replace(
  'window.openToBankOrSelfTransfer = openToBankOrSelfTransfer;',
  'window.openToBankOrSelfTransfer = openToBankOrSelfTransfer;\n    window.selectSavedMethodForWithdrawal = selectSavedMethodForWithdrawal;\n    window.updateWithdrawalUsdtConversion = updateWithdrawalUsdtConversion;\n    window.selectReferralLevel = selectReferralLevel;\n    window.renderReferralLevelView = renderReferralLevelView;'
);

// Validate all script blocks in app.html
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let count = 0;
while ((m = scriptRegex.exec(app)) !== null) {
  count++;
  new vm.Script(m[1]);
  console.log('App Script ' + count + ' syntax OK');
}

fs.writeFileSync('public/app.html', app, 'utf8');
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Successfully updated public/app.html and public/index.html!');
