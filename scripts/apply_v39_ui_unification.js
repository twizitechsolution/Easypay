const fs = require('fs');
const vm = require('vm');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

// ------------------------------------------------------------------
// 1. #viewResetPin (Screenshot 1) -> Centered 480px + EasyPay Orange Hero
// ------------------------------------------------------------------
const resetPinOldStart = '      <div class="view-panel" id="viewResetPin" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000000; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">';
const resetPinOldEnd = '          <!-- Step 1: Mobile OTP Verification -->';
const rpStart = app.indexOf(resetPinOldStart);
const rpEnd = app.indexOf(resetPinOldEnd);
if (rpStart === -1 || rpEnd === -1) throw new Error('viewResetPin markers not found');

const newResetPinTop = `      <div class="view-panel" id="viewResetPin" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 1000000; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Unified EasyPay Orange Hero Header -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 26px; color: #FFFFFF; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <button onclick="closeResetPinView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">Set / Reset Security PIN</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.88);">Protect wallet debits & UPI transfers</div>
              </div>
            </div>
            <span style="font-size: 10.5px; font-weight: 800; color: #FFFFFF; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); padding: 4px 10px; border-radius: 999px;">
              <i class="fa-solid fa-shield-halved"></i> 256-bit
            </span>
          </div>
        </div>

        <div style="padding: 0 16px 32px; margin-top: -14px; position: relative; z-index: 101;">
          <!-- EasyPay Warm Security Card -->
          <div style="background: #FFFFFF; border: 1.5px solid #FFE0B2; border-radius: 18px; padding: 18px; margin-bottom: 14px; box-shadow: 0 4px 16px rgba(255,87,34,0.08); text-align: center;">
            <div style="width: 52px; height: 52px; border-radius: 16px; background: #FFF3E0; border: 1px solid #FFCC80; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #FF5722; margin: 0 auto 10px;">
              <i class="fa-solid fa-lock"></i>
            </div>
            <div style="font-family: var(--font-heading); font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">EasyPay Security PIN</div>
            <div style="font-size: 12px; color: #64748B; line-height: 1.4;">
              Your 4-digit PIN secures wallet debits, gift card purchases, withdrawals, and UPI transfers.
            </div>
          </div>

`;
app = app.slice(0, rpStart) + newResetPinTop + app.slice(rpEnd);

// ------------------------------------------------------------------
// 2. #viewBonds (Screenshot 2) -> EasyPay Orange Header + Cohesive Colors + Bottom Nav Padding
// ------------------------------------------------------------------
const bondsStartMarker = '      <div id="viewBonds" style="display: none;">';
const newBondsStart = `      <div id="viewBonds" style="display: none; padding-bottom: 105px; background: #F8FAFC;">
        <!-- Unified EasyPay Orange Hero Header -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 24px; color: #FFFFFF; border-radius: 0 0 22px 22px; margin-bottom: 14px; box-shadow: 0 4px 14px rgba(255,87,34,0.18);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-family: var(--font-heading); font-size: 19px; font-weight: 800; color: #FFFFFF;">EasyPay Wealth & FDs</div>
              <div style="font-size: 11.5px; color: rgba(255,255,255,0.9);">DICGC Insured • Daily Payouts • Up to 12% p.m.</div>
            </div>
            <button onclick="openPassbookFromProfile()" style="background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; padding: 6px 12px; color: #FFFFFF; font-size: 11.5px; font-weight: 800; cursor: pointer;">
              <i class="fa-solid fa-chart-pie"></i> Portfolio
            </button>
          </div>
        </div>`;
if (!app.includes(bondsStartMarker)) throw new Error('bondsStartMarker not found');
app = app.replace(bondsStartMarker, () => newBondsStart);

// Restyle dark Invest Now button on Bonds slider to EasyPay Orange
app = app.replace(
  '.btn-invest-slider {\n      background: #0F172A;',
  '.btn-invest-slider {\n      background: linear-gradient(135deg, #FF5722, #FF7043); box-shadow: 0 4px 12px rgba(255,87,34,0.25);'
);

// ------------------------------------------------------------------
// 3. #viewGiftCards (Screenshot 3) -> EasyPay Orange Hero Header + Bottom Padding
// ------------------------------------------------------------------
const giftHeaderOld = `      <div id="viewGiftCards" style="display: none;" class="gift-vouchers-container">
        
        <!-- 1. Top App Navigation Bar (Screenshot 2) -->
        <div class="gift-top-nav-bar">
          <!-- Back arrow removed as requested -->
          <div class="gift-nav-title">
            <span class="gift-icon-badge"><i class="fa-solid fa-gift"></i></span>
            <span>Gift Vouchers</span>
          </div>
          <button class="gift-history-link" onclick="openGiftHistoryView()">History</button>
        </div>`;
const giftHeaderNew = `      <div id="viewGiftCards" style="display: none; padding-bottom: 105px; background: #F8FAFC;" class="gift-vouchers-container">
        
        <!-- Unified EasyPay Orange Hero Header -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 22px; color: #FFFFFF; border-radius: 0 0 22px 22px; margin-bottom: 14px; box-shadow: 0 4px 14px rgba(255,87,34,0.18); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.22); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px;">
              <i class="fa-solid fa-gift"></i>
            </span>
            <div>
              <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">Gift Vouchers</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.9);">Instant Cashback on 50+ Top Brands</div>
            </div>
          </div>
          <button onclick="openGiftHistoryView()" style="background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; padding: 6px 14px; color: #FFFFFF; font-size: 12px; font-weight: 800; cursor: pointer;">
            <i class="fa-solid fa-clock-rotate-left"></i> History
          </button>
        </div>`;
if (!app.includes(giftHeaderOld)) throw new Error('giftHeaderOld not found');
app = app.replace(giftHeaderOld, () => giftHeaderNew);

// ------------------------------------------------------------------
// 4. #viewBankAccounts (Screenshot 4) -> Centered 480px + EasyPay Orange Hero Header
// ------------------------------------------------------------------
const bankAccOld = `      <div class="view-panel" id="viewBankAccounts" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar (Mobile Responsive Centered Max-Width 480px) -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; max-width: 480px; margin: 0 auto; width: 100%; box-sizing: border-box;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeBankAccountsView()" style="background: none; border: none; font-size: 18px; color: #0F172A; cursor: pointer; display: flex; align-items: center;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;">Update Payment Details</div>
          </div>
          <button onclick="openAddNewPaymentDetailsModal()" style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 800; color: #0284C7; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>`;
const bankAccNew = `      <div class="view-panel" id="viewBankAccounts" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Unified EasyPay Orange Hero Header (Max-Width 480px) -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 22px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; width: 100%; box-sizing: border-box;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeBankAccountsView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">Update Payment Details</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.88);">Bank Accounts, UPI IDs & USDT Addresses</div>
            </div>
          </div>
          <button onclick="openAddNewPaymentDetailsModal()" style="background: #FFFFFF; border: none; border-radius: 999px; padding: 7px 14px; font-size: 12.5px; font-weight: 800; color: #FF5722; cursor: pointer; display: flex; align-items: center; gap: 5px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>`;
if (!app.includes(bankAccOld)) throw new Error('bankAccOld not found');
app = app.replace(bankAccOld, () => bankAccNew);

// ------------------------------------------------------------------
// 5. #viewMyOrders (Screenshot 5) -> Centered 480px + EasyPay Orange Hero + Orange Active Tab
// ------------------------------------------------------------------
const myOrdersOld = `      <div class="view-panel" id="viewMyOrders" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
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
        <div style="background: #FFFFFF; padding: 8px 16px 12px; border-bottom: 1px solid #E2E8F0; display: flex; gap: 8px; max-width: 480px; margin: 0 auto; width: 100%; box-sizing: border-box;">
          <button id="tabBtnMallOrders" class="orders-tab-btn active" onclick="switchOrdersTab('mall')" style="flex: 1; padding: 8px 12px; border-radius: 10px; font-size: 13px; font-weight: 800; border: none; cursor: pointer; background: #0F172A; color: white;">
            <i class="fa-solid fa-bag-shopping"></i> Mall Orders (<span id="mallOrdersBadgeCount">1</span>)
          </button>
          <button id="tabBtnGiftVouchers" class="orders-tab-btn" onclick="switchOrdersTab('vouchers')" style="flex: 1; padding: 8px 12px; border-radius: 10px; font-size: 13px; font-weight: 800; border: 1px solid #E2E8F0; cursor: pointer; background: #F8FAFC; color: #64748B;">
            <i class="fa-solid fa-gift"></i> Gift Vouchers
          </button>
        </div>`;

const myOrdersNew = `      <div class="view-panel" id="viewMyOrders" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Unified EasyPay Orange Hero Header -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 24px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; width: 100%; box-sizing: border-box;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closeMyOrdersView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">My Orders & Vouchers</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.88);">Mall Shipments & Digital Gift Cards</div>
            </div>
          </div>
          <button id="btnRefreshMyOrders" onclick="refreshMyOrdersWithAnimation()" style="background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #FFFFFF; cursor: pointer; transition: transform 0.2s;" title="Refresh Orders & Vouchers">
            <i class="fa-solid fa-arrows-rotate" id="refreshMyOrdersIcon"></i>
          </button>
        </div>

        <!-- Unified Floating Segmented Tab Bar (EasyPay Orange Active) -->
        <div style="padding: 0 16px; margin-top: -14px; position: relative; z-index: 101;">
          <div style="background: #FFFFFF; padding: 5px; border-radius: 14px; border: 1px solid #F1F5F9; box-shadow: 0 4px 14px rgba(15,23,42,0.06); display: flex; gap: 6px;">
            <button id="tabBtnMallOrders" class="orders-tab-btn active" onclick="switchOrdersTab('mall')" style="flex: 1; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 800; border: none; cursor: pointer; background: #FF5722; color: white;">
              <i class="fa-solid fa-bag-shopping"></i> Mall Orders (<span id="mallOrdersBadgeCount">1</span>)
            </button>
            <button id="tabBtnGiftVouchers" class="orders-tab-btn" onclick="switchOrdersTab('vouchers')" style="flex: 1; padding: 10px 12px; border-radius: 10px; font-size: 13px; font-weight: 800; border: none; cursor: pointer; background: transparent; color: #64748B;">
              <i class="fa-solid fa-gift"></i> Gift Vouchers
            </button>
          </div>
        </div>`;

if (!app.includes(myOrdersOld)) throw new Error('myOrdersOld not found');
app = app.replace(myOrdersOld, () => myOrdersNew);

// Update switchOrdersTab JS so active tab uses EasyPay Orange #FF5722
app = app.replace(/mallBtn\.style\.background = '#0F172A';/g, "mallBtn.style.background = '#FF5722';");
app = app.replace(/vouchersBtn\.style\.background = '#0F172A';/g, "vouchersBtn.style.background = '#FF5722';");

// ------------------------------------------------------------------
// 6. #viewPayAnyone -> Centered 480px + EasyPay Orange Hero Header + Orange Search/Pay
// ------------------------------------------------------------------
const payAnyoneOld = `<div class="view-panel" id="viewPayAnyone" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Top App Bar -->
        <div style="background: #FFFFFF; padding: 14px 16px; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closePayAnyoneView()" style="background: none; border: none; font-size: 18px; color: #0F172A; cursor: pointer; display: flex; align-items: center;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #0F172A;">Pay Anyone</div>
          </div>
        </div>

        <div style="padding: 16px; max-width: 480px; margin: 0 auto;">
          <!-- Search Input Box (Screenshot 2) -->
          <div style="display: flex; align-items: center; background: #FFFFFF; border: 1.5px solid #2563EB; border-radius: 14px; padding: 12px 14px; gap: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(37,99,235,0.08);">
            <input type="text" id="payAnyoneSearchInput" placeholder="Enter mobile number or UPI ID" value="7013893165" oninput="filterPayAnyoneContacts(this.value)" style="border: none; background: transparent; outline: none; font-size: 16px; font-weight: 700; width: 100%; color: #0F172A;">
            <div style="border-left: 1px solid #CBD5E1; padding-left: 10px; display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="showToast('Accessing Phone Contacts...')">
              <i class="fa-regular fa-address-book" style="color: #2563EB; font-size: 18px;"></i>
              <span style="font-size: 9px; font-weight: 700; color: #64748B; margin-top: 2px;">Contacts</span>
            </div>
          </div>`;

const payAnyoneNew = `<div class="view-panel" id="viewPayAnyone" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
        <!-- Unified EasyPay Orange Hero Header -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 24px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button onclick="closePayAnyoneView()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">Pay Anyone</div>
              <div style="font-size: 11px; color: rgba(255,255,255,0.88);">Instant UPI & Mobile Wallet Transfers</div>
            </div>
          </div>
        </div>

        <div style="padding: 0 16px 32px; margin-top: -12px; position: relative; z-index: 101;">
          <!-- Search Input Box -->
          <div style="display: flex; align-items: center; background: #FFFFFF; border: 1.5px solid #FF5722; border-radius: 14px; padding: 12px 14px; gap: 10px; margin-bottom: 20px; box-shadow: 0 4px 14px rgba(255,87,34,0.1);">
            <input type="text" id="payAnyoneSearchInput" placeholder="Enter mobile number or UPI ID" value="7013893165" oninput="filterPayAnyoneContacts(this.value)" style="border: none; background: transparent; outline: none; font-size: 16px; font-weight: 700; width: 100%; color: #0F172A;">
            <div style="border-left: 1px solid #CBD5E1; padding-left: 10px; display: flex; flex-direction: column; align-items: center; cursor: pointer;" onclick="showToast('Accessing Phone Contacts...')">
              <i class="fa-regular fa-address-book" style="color: #FF5722; font-size: 18px;"></i>
              <span style="font-size: 9px; font-weight: 700; color: #64748B; margin-top: 2px;">Contacts</span>
            </div>
          </div>`;
if (!app.includes(payAnyoneOld)) throw new Error('payAnyoneOld not found');
app = app.replace(payAnyoneOld, () => payAnyoneNew);

// ------------------------------------------------------------------
// 7. #viewShopping -> EasyPay Orange Hero Header + Bottom Padding
// ------------------------------------------------------------------
const shoppingOld = `      <div class="view-panel" id="viewShopping" style="display: none;">
        
        <!-- Shopping Top Bar -->
        <div style="background:#FFFFFF; padding:14px 16px; border-bottom:1px solid #EEEEEE; position:sticky; top:0; z-index:100;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="font-family:var(--font-heading); font-size:19px; font-weight:800; color:#1A1A1A; display:flex; align-items:center; gap:8px;">
              <span style="color:#FF5722;"><i class="fa-solid fa-bag-shopping"></i></span> EasyPay Mall
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <button onclick="openCartModal()" style="background:none; border:none; font-size:18px; color:#1A1A1A; cursor:pointer; position:relative;">
                <i class="fa-solid fa-cart-shopping"></i>
                <span id="shopCartCountBadge" style="position:absolute; top:-4px; right:-6px; width:16px; height:16px; background:#FF5722; color:white; border-radius:50%; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center;">0</span>
              </button>
            </div>
          </div>

          <!-- Product Search Input -->
          <div style="display:flex; align-items:center; background:#F5F5F5; border-radius:12px; padding:8px 14px; gap:8px;">
            <i class="fa-solid fa-magnifying-glass" style="color:#9E9E9E; font-size:14px;"></i>
            <input type="text" id="shopSearchInput" placeholder="Search 50,000+ products, electronics, fashion..." oninput="handleShopSearch(this.value)" style="border:none; background:transparent; outline:none; font-size:13px; width:100%; color:#212121;">
          </div>
        </div>`;

const shoppingNew = `      <div class="view-panel" id="viewShopping" style="display: none; padding-bottom: 100px; background: #F8FAFC;">
        
        <!-- Unified EasyPay Orange Hero Header -->
        <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 16px; color: #FFFFFF; position: sticky; top: 0; z-index: 100; border-radius: 0 0 20px 20px; box-shadow: 0 4px 14px rgba(255,87,34,0.18);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div style="font-family:var(--font-heading); font-size:19px; font-weight:800; color:#FFFFFF; display:flex; align-items:center; gap:8px;">
              <span style="width:32px; height:32px; border-radius:9px; background:rgba(255,255,255,0.22); display:inline-flex; align-items:center; justify-content:center; font-size:15px;"><i class="fa-solid fa-bag-shopping"></i></span>
              EasyPay Mall
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <button onclick="openCartModal()" style="background:rgba(255,255,255,0.22); border:1px solid rgba(255,255,255,0.35); border-radius:50%; width:36px; height:36px; font-size:16px; color:#FFFFFF; cursor:pointer; position:relative; display:flex; align-items:center; justify-content:center;">
                <i class="fa-solid fa-cart-shopping"></i>
                <span id="shopCartCountBadge" style="position:absolute; top:-4px; right:-4px; width:18px; height:18px; background:#0F172A; color:white; border-radius:50%; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; border:2px solid #FF5722;">0</span>
              </button>
            </div>
          </div>

          <!-- Product Search Input -->
          <div style="display:flex; align-items:center; background:#FFFFFF; border-radius:12px; padding:9px 14px; gap:8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <i class="fa-solid fa-magnifying-glass" style="color:#FF5722; font-size:14px;"></i>
            <input type="text" id="shopSearchInput" placeholder="Search 50,000+ products, electronics, fashion..." oninput="handleShopSearch(this.value)" style="border:none; background:transparent; outline:none; font-size:13px; width:100%; color:#0F172A;">
          </div>
        </div>`;

if (!app.includes(shoppingOld)) throw new Error('shoppingOld not found');
app = app.replace(shoppingOld, () => shoppingNew);

// ------------------------------------------------------------------
// 8. #enterAmountToPayModal Proceed Button -> EasyPay Orange Gradient
// ------------------------------------------------------------------
app = app.replace(
  `<button class="btn-primary-action" onclick="proceedFromAmountToPaySource()" style="background: #0052CC; border-radius: 28px; padding: 15px; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">`,
  `<button class="btn-primary-action" onclick="proceedFromAmountToPaySource()" style="background: linear-gradient(135deg, #FF5722, #FF7043); border-radius: 28px; padding: 15px; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(255,87,34,0.28);">`
);

// Validate all script blocks
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
console.log('Successfully unified UI across all EasyPay pages in app.html & index.html!');
