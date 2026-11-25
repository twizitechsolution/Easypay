const fs = require('fs');
const vm = require('vm');

// ------------------------------------------------------------------
// 1. UPDATE server/server.js -> Real-time Active/Inactive & First Deposit Bonus per user
// ------------------------------------------------------------------
let srv = fs.readFileSync('server/server.js', 'utf8');

const oldRefMap = `        const mapped = membersAtLevel.map(m => {
          const isAct = m.status === 'ACTIVE' || (m.isActivated && Number(m.walletBalance || 0) > 0);
          if (isAct) activeMembers++;
          totalMembers++;
          return {
            id: m.id,
            name: m.name || ((m.firstName || '') + ' ' + (m.lastName || '')).trim(),
            mobile: m.mobile,
            status: isAct ? 'ACTIVE' : 'NOT_ACTIVE',
            registeredAt: m.registeredAt || new Date().toISOString()
          };
        });`;

const newRefMap = `        const bonusPct = Number(refCfg.firstDepositBonusPercent || 5);
        const mapped = membersAtLevel.map(m => {
          const hasApprovedDep = (data.depositRequests || []).some(d => (d.userId === m.id || d.userMobile === m.mobile) && d.status === 'APPROVED');
          const isAct = m.status === 'ACTIVE' || m.isActivated === true || hasApprovedDep || Number(m.walletBalance || 0) > 0;
          if (isAct) activeMembers++;
          totalMembers++;

          // Calculate First Deposit Bonus received from this specific user
          const mName = m.name || ((m.firstName || '') + ' ' + (m.lastName || '')).trim();
          const bonusTxns = (data.transactions || []).filter(t =>
            (t.userId === myId || (me && t.userMobile === me.mobile)) &&
            t.category === 'Referral Bonus' &&
            ((t.title || '').includes(m.id) || (mName && (t.title || '').includes(mName)))
          );
          let firstDepBonus = bonusTxns.reduce((sum, t) => sum + Number(t.amount || 0), 0);
          if (firstDepBonus === 0 && lvl === 1 && isAct) {
            const firstDep = (data.depositRequests || []).find(d => (d.userId === m.id || d.userMobile === m.mobile) && d.status === 'APPROVED');
            if (firstDep) {
              firstDepBonus = Math.round((Number(firstDep.amount || 0) * bonusPct / 100) * 100) / 100;
            }
          }

          return {
            id: m.id,
            name: mName,
            mobile: m.mobile,
            status: isAct ? 'ACTIVE' : 'INACTIVE',
            firstDepositBonus: firstDepBonus,
            registeredAt: m.registeredAt || new Date().toISOString()
          };
        });`;

if (!srv.includes(oldRefMap)) throw new Error('oldRefMap not found in server.js');
srv = srv.replace(oldRefMap, () => newRefMap);
fs.writeFileSync('server/server.js', srv, 'utf8');
console.log('Updated server/server.js');

// ------------------------------------------------------------------
// 2. UPDATE public/admin.html -> Fix #tabWithdrawals UI to match #tabDeposits
// ------------------------------------------------------------------
let admin = fs.readFileSync('public/admin.html', 'utf8');
const oldWdrTab = `        <div id="tabWithdrawals" class="tab-view-content">
          <div class="panel-card">
            <div class="panel-toolbar" style="flex-direction: column; align-items: stretch; gap: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div class="card-title">User Withdrawal Requests (Bank, UPI & USDT)</div>
                  <div class="card-subtitle">Verify destination account details, INR/USDT amounts & timestamps before approving or rejecting payouts</div>
                </div>
                <div class="search-box" style="width: 300px;">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input type="text" id="withdrawalSearchInput" placeholder="Search user ID, name, mobile, WDR ID..." oninput="filterWithdrawalRequests(currentWdrFilter)">
                </div>
              </div>
              <div id="withdrawalFilterPills" style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button type="button" class="action-btn filter-pill active" onclick="filterWithdrawalRequests('ALL', this)">All Requests</button>
                <button type="button" class="action-btn filter-pill" onclick="filterWithdrawalRequests('PENDING', this)">Pending Approval</button>
                <button type="button" class="action-btn filter-pill" onclick="filterWithdrawalRequests('APPROVED', this)">Approved</button>
                <button type="button" class="action-btn filter-pill" onclick="filterWithdrawalRequests('REJECTED', this)">Rejected (Refunded)</button>
              </div>
            </div>`;

const newWdrTab = `        <div id="tabWithdrawals" class="tab-view-content">
          <div class="panel-card">
            <div class="panel-toolbar" style="flex-direction: column; align-items: stretch; gap: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div class="card-title">User Withdrawal Requests (Bank, UPI & USDT)</div>
                  <div class="card-subtitle">Verify destination account details, INR/USDT amounts & timestamps before approving or rejecting payouts</div>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button class="btn-topbar primary" onclick="refreshAdminData()">
                    <i class="fa-solid fa-arrows-rotate"></i> Sync Requests
                  </button>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;">
                <div class="search-box-wrap" style="flex: 1; max-width: 380px;">
                  <i class="fa-solid fa-magnifying-glass search-icon"></i>
                  <input type="text" class="search-input" id="withdrawalSearchInput" placeholder="Search user ID, name, mobile, WDR ID..." oninput="filterWithdrawalRequests(currentWdrFilter)">
                </div>
                <div id="withdrawalFilterPills" style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="action-btn filter-pill active" onclick="filterWithdrawalRequests('ALL', this)">All Requests</button>
                  <button type="button" class="action-btn filter-pill" onclick="filterWithdrawalRequests('PENDING', this)">Pending Approval</button>
                  <button type="button" class="action-btn filter-pill" onclick="filterWithdrawalRequests('APPROVED', this)">Approved</button>
                  <button type="button" class="action-btn filter-pill" onclick="filterWithdrawalRequests('REJECTED', this)">Rejected (Refunded)</button>
                </div>
              </div>
            </div>`;

if (!admin.includes(oldWdrTab)) throw new Error('oldWdrTab not found in admin.html');
admin = admin.replace(oldWdrTab, () => newWdrTab);
fs.writeFileSync('public/admin.html', admin, 'utf8');
console.log('Updated public/admin.html');

// ------------------------------------------------------------------
// 3. UPDATE public/app.html & public/index.html
// ------------------------------------------------------------------
let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

// A. CRITICAL FIX: Preserve isWithdrawal, methodType, destinationDetails, amountUsdt, usdtRate in openPayFromSourceSheet
const oldPendingPayment = `      currentPendingPayment = {
        amount: amt,
        recipientName: recName,
        recipientSubtitle: recSubtitle,
        type: options.type || 'P2P Transfer'
      };`;
const newPendingPayment = `      currentPendingPayment = {
        amount: amt,
        amountUsdt: options.amountUsdt || null,
        usdtRate: options.usdtRate || null,
        isWithdrawal: !!options.isWithdrawal,
        methodType: options.methodType || null,
        destinationDetails: options.destinationDetails || null,
        note: options.note || '',
        recipientName: recName,
        recipientSubtitle: recSubtitle,
        type: options.type || 'P2P Transfer'
      };`;
if (!app.includes(oldPendingPayment)) throw new Error('oldPendingPayment not found');
app = app.replace(oldPendingPayment, () => newPendingPayment);

// B. Screenshot 1: #viewEcommerceCheckout -> 480px Centered + EasyPay Orange Hero Header
const oldCheckoutStart = `  <div class="view-panel" id="viewEcommerceCheckout" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
    <!-- Top Sticky Bar (Mobile Responsive Max-Width 480px) -->
    <div id="checkoutTopBar" style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; max-width: 480px; margin: 0 auto; width: 100%; box-sizing: border-box;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="closeEcommerceCheckoutView()" style="background: none; border: none; font-size: 18px; color: #0F172A; cursor: pointer; display: flex; align-items: center;">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <div style="font-family: var(--font-heading); font-size: 17px; font-weight: 800; color: #0F172A;">Checkout & Delivery</div>
          <div style="font-size: 11px; color: #64748B;">Order Review & Secure Payment</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 6px; background: #ECFDF5; color: #059669; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800;">
        <i class="fa-solid fa-lock"></i> 100% Secure
      </div>
    </div>`;

const newCheckoutStart = `  <div class="view-panel" id="viewEcommerceCheckout" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
    <!-- Unified EasyPay Orange Hero Header -->
    <div id="checkoutTopBar" style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 20px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; width: 100%; box-sizing: border-box;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <button onclick="closeEcommerceCheckoutView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <div style="font-family: var(--font-heading); font-size: 17px; font-weight: 800; color: #FFFFFF;">Checkout & Delivery</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.9);">Order Review & Secure Payment</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); color: #FFFFFF; padding: 5px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 800;">
        <i class="fa-solid fa-lock"></i> 100% Secure
      </div>
    </div>`;

if (!app.includes(oldCheckoutStart)) throw new Error('oldCheckoutStart not found');
app = app.replace(oldCheckoutStart, () => newCheckoutStart);

// C. Screenshot 3: #viewGiftHistory -> 480px Centered + EasyPay Orange Hero Header + Orange Chips & Copy + E-Pay Wallet
const oldGiftHistoryHtml = `      <div id="viewGiftHistory" class="history-view-modal">
        <div class="history-top-bar">
          <button class="gift-nav-btn" onclick="closeGiftHistoryView()" title="Back to Gift Cards">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div class="history-title">Gift Vouchers & Deals</div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <i class="fa-solid fa-sliders" style="font-size: 17px; color: #0F172A; cursor: pointer;" onclick="openHistoryFilterModal()" title="Filter Orders"></i>
            <i class="fa-solid fa-magnifying-glass" style="font-size: 17px; color: #0F172A; cursor: pointer;"></i>
          </div>
        </div>

        <div class="history-filter-pills-row">
          <span class="history-filter-chip active" id="filterLast6Months" onclick="openHistoryFilterModal()">
            <span id="activeFilterPillText">Last 6 months</span> <i class="fa-solid fa-xmark" onclick="event.stopPropagation(); clearHistoryFilters();"></i>
          </span>
          <span class="history-filter-chip" onclick="openHistoryFilterModal()">All Time</span>
          <span class="history-filter-chip" onclick="openHistoryFilterModal()">Active Only</span>
        </div>`;

const newGiftHistoryHtml = `      <div id="viewGiftHistory" class="history-view-modal" style="max-width: 480px; left: 50%; transform: translateX(-50%); width: 100%; background: #F8FAFC;">
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 20px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeGiftHistoryView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;" title="Back to Gift Cards">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <div style="font-family: var(--font-heading); font-size: 17px; font-weight: 800; color: #FFFFFF;">Gift Vouchers & Deals</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.9);">Purchased Brand Vouchers & PINs</div>
            </div>
          </div>
          <button onclick="openHistoryFilterModal()" style="background: rgba(255,255,255,0.2); border: none; width: 34px; height: 34px; border-radius: 50%; color: #FFFFFF; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Filter Orders">
            <i class="fa-solid fa-sliders"></i>
          </button>
        </div>

        <div class="history-filter-pills-row" style="padding: 12px 16px 4px; display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="history-filter-chip active" id="filterLast6Months" onclick="openHistoryFilterModal()" style="background: #FF5722; color: #FFFFFF; border-color: #FF5722;">
            <span id="activeFilterPillText">Last 6 months</span> <i class="fa-solid fa-xmark" onclick="event.stopPropagation(); clearHistoryFilters();"></i>
          </span>
          <span class="history-filter-chip" onclick="openHistoryFilterModal()" style="background: #FFFFFF; border: 1px solid #E2E8F0; color: #475569;">All Time</span>
          <span class="history-filter-chip" onclick="openHistoryFilterModal()" style="background: #FFFFFF; border: 1px solid #E2E8F0; color: #475569;">Active Only</span>
        </div>`;

if (!app.includes(oldGiftHistoryHtml)) throw new Error('oldGiftHistoryHtml not found');
app = app.replace(oldGiftHistoryHtml, () => newGiftHistoryHtml);

// Also update renderGiftHistoryOrders() card styling to EasyPay Orange & E-Pay Wallet
app = app.replace('+₹${(v.cashbackEarned || 0).toFixed(2)} Bachat', '+₹${(v.cashbackEarned || 0).toFixed(2)} Cashback');
app = app.replace(
  'background: #EFF6FF; color: #2563EB; border: none; border-radius: 8px;',
  'background: #FF5722; color: #FFFFFF; border: none; border-radius: 8px;'
);
app = app.replace('Paid via <strong style="color: #0F172A;">Main Wallet</strong>', 'Paid via <strong style="color: #0F172A;">E-Pay Wallet</strong>');

// D. Screenshot 2: #viewReferEarn -> Remove "10-Level Referral Structure" & L1-L10 buttons -> Dropdown ("All Levels" default) + Real-time Active/Inactive + First Deposit Bonus per user
const oldReferTitle = `<div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800;">Refer & Earn (10 Levels)</div>`;
const newReferTitle = `<div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800;">Refer & Earn</div>`;
app = app.replace(oldReferTitle, newReferTitle);

const oldReferNetworkBox = `          <!-- 10-Level Commission & Network Explorer -->
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
          </div>`;

const newReferNetworkBox = `          <!-- Network Levels & Downline Members -->
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px;">
              <div>
                <div style="font-size: 15px; font-weight: 800; color: #0F172A;">Network Levels</div>
                <div style="font-size: 11px; font-weight: 700; color: #FF5722;" id="referSelectedLevelMeta">All Levels</div>
              </div>
              <select id="referLevelSelect" onchange="selectReferralLevel(this.value)" style="padding: 8px 12px; border-radius: 10px; border: 1.5px solid #FF5722; background: #FFF8F5; color: #0F172A; font-size: 12.5px; font-weight: 800; outline: none; cursor: pointer;">
                <option value="ALL">All Levels</option>
              </select>
            </div>

            <!-- Members List for Selected Level / Search -->
            <div id="referLevelMembersList" style="display: flex; flex-direction: column; gap: 10px;">
              <!-- Populated dynamically -->
            </div>
          </div>`;

if (!app.includes(oldReferNetworkBox)) throw new Error('oldReferNetworkBox not found');
app = app.replace(oldReferNetworkBox, () => newReferNetworkBox);

const oldReferController = `    let currentReferralData = null;
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
    }`;

const newReferController = `    let currentReferralData = null;
    let activeReferralLevel = 'ALL';

    async function openReferEarnView() {
      pushAppNavState('viewReferEarn');
      document.querySelectorAll('.view-panel').forEach(v => v.style.display = 'none');
      const v = document.getElementById('viewReferEarn');
      if (v) v.style.display = 'block';
      window.scrollTo(0, 0);

      activeReferralLevel = 'ALL';
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
          populateReferralDropdown();
          renderReferralLevelView();
        }
      } catch (e) {
        console.warn('Could not load referral network', e);
      }
    }

    function populateReferralDropdown() {
      const sel = document.getElementById('referLevelSelect');
      if (!sel || !currentReferralData || !currentReferralData.levels) return;
      const total = currentReferralData.totalMembers || 0;
      sel.innerHTML = '<option value="ALL">All Levels (' + total + ')</option>' +
        currentReferralData.levels.map(l => '<option value="' + l.level + '">Level ' + l.level + ' (' + l.count + ') • ' + l.commissionPercent + '%</option>').join('');
      sel.value = activeReferralLevel;
    }

    function selectReferralLevel(lvl) {
      activeReferralLevel = lvl === 'ALL' ? 'ALL' : parseInt(lvl, 10);
      renderReferralLevelView();
    }

    function renderReferralLevelView() {
      const data = currentReferralData;
      const listWrap = document.getElementById('referLevelMembersList');
      const metaEl = document.getElementById('referSelectedLevelMeta');
      const searchQ = (document.getElementById('referSearchUserInput')?.value || '').trim().toLowerCase();

      if (!data || !data.levels) return;

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
      } else if (activeReferralLevel === 'ALL') {
        data.levels.forEach(l => {
          (l.members || []).forEach(m => membersToShow.push({ ...m, level: l.level }));
        });
        if (metaEl) metaEl.innerText = 'All Levels • ' + membersToShow.length + ' Members';
      } else {
        const lvlObj = data.levels.find(l => l.level === activeReferralLevel) || data.levels[0];
        membersToShow = (lvlObj.members || []).map(m => ({ ...m, level: lvlObj.level }));
        if (metaEl) metaEl.innerText = 'Level ' + lvlObj.level + ' • ' + lvlObj.commissionPercent + '% Commission';
      }

      if (listWrap) {
        if (membersToShow.length === 0) {
          listWrap.innerHTML = '<div style="text-align: center; padding: 20px; color: #94A3B8; font-size: 12px;">No members found. Share your referral link to grow your team!</div>';
        } else {
          listWrap.innerHTML = membersToShow.map(m => {
            const isAct = m.status === 'ACTIVE';
            const bonusAmt = Number(m.firstDepositBonus || 0);
            const jDate = m.registeredAt ? new Date(m.registeredAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Joined';
            return '<div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 12px;">' +
              '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                '<div style="display: flex; align-items: center; gap: 10px;">' +
                  '<div style="width: 36px; height: 36px; border-radius: 50%; background: #FF5722; color: #FFFFFF; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center;">' + (m.name || 'U')[0].toUpperCase() + '</div>' +
                  '<div>' +
                    '<div style="font-size: 13.5px; font-weight: 800; color: #0F172A;">' + m.name + ' <span style="font-size: 10.5px; color: #FF5722; font-weight: 800;">(Level ' + m.level + ')</span></div>' +
                    '<div style="font-size: 11px; color: #64748B;">ID: <strong>' + m.id + '</strong> • ' + jDate + '</div>' +
                  '</div>' +
                '</div>' +
                '<span style="font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 999px; background: ' + (isAct ? '#DCFCE7' : '#FEF3C7') + '; color: ' + (isAct ? '#15803D' : '#B45309') + ';">' + (isAct ? 'ACTIVE' : 'INACTIVE') + '</span>' +
              '</div>' +
              '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #E2E8F0; font-size: 11.5px;">' +
                '<span style="color: #64748B; font-weight: 600;">First Deposit Bonus</span>' +
                '<strong style="color: ' + (bonusAmt > 0 ? '#059669' : '#64748B') + ';">₹' + bonusAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</strong>' +
              '</div>' +
            '</div>';
          }).join('');
        }
      }
    }`;

if (!app.includes(oldReferController)) throw new Error('oldReferController not found');
app = app.replace(oldReferController, () => newReferController);

// E. MOBILE HARDWARE BACK BUTTON / STEP-BY-STEP NAVIGATION HISTORY STACK (popstate)
const navHistoryJs = `
    // ==============================================================
    // STEP-BY-STEP HARDWARE BACK BUTTON & NAVIGATION STACK
    // ==============================================================
    let appNavDepth = 0;
    let isHandlingPopState = false;

    function pushAppNavState(label) {
      if (isHandlingPopState) return;
      try {
        appNavDepth++;
        history.pushState({ easyPayNav: label, depth: appNavDepth }, '');
      } catch (e) {}
    }

    window.addEventListener('popstate', function(e) {
      isHandlingPopState = true;
      try {
        // 1. If any modal overlay is open, close the topmost modal
        const openModals = Array.from(document.querySelectorAll('.modal-overlay.active'));
        if (openModals.length > 0) {
          openModals[openModals.length - 1].classList.remove('active');
          return;
        }

        // 2. Check open full-screen sub-views and close step-by-step
        const isVis = (id) => {
          const el = document.getElementById(id);
          return el && el.style.display !== 'none' && el.style.display !== '';
        };
        if (isVis('viewResetPin')) { closeResetPinView(); return; }
        if (isVis('viewMyOrders')) { closeMyOrdersView(); return; }
        if (isVis('viewBankAccounts')) { closeBankAccountsView(); return; }
        if (isVis('viewReferEarn')) { closeReferEarnView(); return; }
        if (isVis('viewPassbook')) { closePassbookView(); return; }
        if (isVis('viewPayAnyone')) { closePayAnyoneView(); return; }
        if (isVis('viewGiftHistory')) { closeGiftHistoryView(); return; }
        if (isVis('viewGiftCardPurchase')) { closeGiftCardPurchasePage(); return; }
        if (isVis('viewProductDetails')) { closeProductDetailsView(); return; }
        if (isVis('viewEcommerceCheckout')) { closeEcommerceCheckoutView(); return; }
        if (isVis('viewLuckyDrawDedicated')) { closeLuckyDrawDedicatedPage(); return; }

        // 3. If on a non-home bottom nav tab, go back to Home
        const homeEl = document.getElementById('viewHome');
        if (homeEl && homeEl.style.display === 'none') {
          switchNavTab('home');
          return;
        }

        // 4. Keep one safety history entry at Home so app doesn't close accidentally
        if (appNavDepth <= 0) {
          history.pushState({ easyPayNav: 'home', depth: 0 }, '');
        }
      } finally {
        isHandlingPopState = false;
      }
    });

    // Seed initial history anchor so hardware back never exits immediately from sub-pages
    try { history.replaceState({ easyPayNav: 'home', depth: 0 }, ''); } catch (e) {}
`;

// Inject navHistoryJs right before `let hasRunInitialAppLaunch = false;`
app = app.replace('    let hasRunInitialAppLaunch = false;', navHistoryJs + '\n    let hasRunInitialAppLaunch = false;');

// Hook pushAppNavState into sub-page openers
const openHooks = [
  ['function openMyOrdersView() {', "function openMyOrdersView() {\n      pushAppNavState('viewMyOrders');"],
  ['function openBankAccountsView() {', "function openBankAccountsView() {\n      pushAppNavState('viewBankAccounts');"],
  ['function openResetPinView(fromLock) {', "function openResetPinView(fromLock) {\n      pushAppNavState('viewResetPin');"],
  ['function openPassbookFromProfile() {', "function openPassbookFromProfile() {\n      pushAppNavState('viewPassbook');"],
  ['function openPayAnyoneView() {', "function openPayAnyoneView() {\n      pushAppNavState('viewPayAnyone');"],
  ['function openGiftHistoryView() {', "function openGiftHistoryView() {\n      pushAppNavState('viewGiftHistory');"],
  ['function openEcommerceCheckoutView() {', "function openEcommerceCheckoutView() {\n      pushAppNavState('viewEcommerceCheckout');"],
  ['function openProductDetails(prodId) {', "function openProductDetails(prodId) {\n      pushAppNavState('viewProductDetails');"]
];
openHooks.forEach(([find, rep]) => {
  if (app.includes(find)) {
    app = app.replace(find, rep);
  }
});

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

// ------------------------------------------------------------------
// 4. UPDATE test_suite.js for Req 51 (Dropdown + First Deposit Bonus)
// ------------------------------------------------------------------
let suite = fs.readFileSync('test_suite.js', 'utf8');
suite = suite.replace(
  "name: 'Req 51: 10-Level Refer & Earn Network, User ID Search, Link Sharing & Admin Commission Engine',\n    pass: appHtml.includes('Refer & Earn (10 Levels)') &&\n          appHtml.includes('referSearchUserInput') &&\n          appHtml.includes('referLevelPills') &&",
  "name: 'Req 51: 10-Level Refer & Earn Network Dropdown, First Deposit Bonus per User, User ID Search & Admin Commission Engine',\n    pass: appHtml.includes('Network Levels') &&\n          appHtml.includes('referSearchUserInput') &&\n          appHtml.includes('referLevelSelect') &&\n          appHtml.includes('First Deposit Bonus') &&"
);
fs.writeFileSync('test_suite.js', suite, 'utf8');
console.log('Updated test_suite.js');
