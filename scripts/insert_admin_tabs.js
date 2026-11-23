const fs = require('fs');

let admin = fs.readFileSync('public/admin.html', 'utf8');

// 1. Insert Deposit Requests and Payment Details in sidebar
const sidebarTarget = `        <li>
          <button class="nav-btn" onclick="switchTab('transactions')">
            <i class="fa-solid fa-receipt"></i>
            <span>Transactions Ledger</span>
          </button>
        </li>`;

const sidebarReplacement = `        <li>
          <button class="nav-btn" onclick="switchTab('transactions')">
            <i class="fa-solid fa-receipt"></i>
            <span>Transactions Ledger</span>
          </button>
        </li>
        <li>
          <button class="nav-btn" onclick="switchTab('deposits')">
            <i class="fa-solid fa-money-bill-transfer"></i>
            <span>Deposit Requests</span>
            <span class="nav-badge" id="badgeDepositsCount" style="background: #EF4444; color: #FFFFFF; font-weight: 800;">2</span>
          </button>
        </li>
        <li>
          <button class="nav-btn" onclick="switchTab('paymentDetails')">
            <i class="fa-solid fa-building-columns"></i>
            <span>Payment Details</span>
          </button>
        </li>`;

if (admin.includes(sidebarTarget) && !admin.includes("switchTab('deposits')")) {
  admin = admin.replace(sidebarTarget, sidebarReplacement);
  console.log('Successfully inserted Deposit Requests and Payment Details sidebar nav buttons!');
}

// 2. Insert #tabDeposits and #tabPaymentDetails right after #tabTransactions closing div
const tabTxnEndTarget = `              </table>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 8: SYSTEM SETTINGS`;

const newTabsMarkup = `              </table>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB: USER DEPOSIT REQUESTS & WALLET ADD AUDIT
             ========================================== -->
        <div id="tabDeposits" class="tab-view-content">
          <div class="panel-card">
            <div class="panel-toolbar" style="flex-direction: column; align-items: stretch; gap: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div class="card-title">User Deposit Requests & Add Funds Verification</div>
                  <div class="card-subtitle">Verify user payment screenshots, UTRs, and approve wallet balance credits in real-time</div>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button class="btn-topbar primary" onclick="refreshAdminData()">
                    <i class="fa-solid fa-arrows-rotate"></i> Sync Requests
                  </button>
                </div>
              </div>

              <!-- Filter Pills & Search -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;">
                <div class="search-box-wrap" style="flex: 1; max-width: 380px;">
                  <i class="fa-solid fa-magnifying-glass search-icon"></i>
                  <input type="text" class="search-input" id="depositSearchInput" placeholder="Search by UTR, User Mobile, Request ID..." oninput="filterDepositRequestsTable()">
                </div>
                <div id="depositFilterPills" style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="action-btn filter-pill active" onclick="setDepositFilter('ALL', this)">All Requests</button>
                  <button type="button" class="action-btn filter-pill" onclick="setDepositFilter('PENDING', this)">Pending Approval</button>
                  <button type="button" class="action-btn filter-pill" onclick="setDepositFilter('APPROVED', this)">Approved</button>
                  <button type="button" class="action-btn filter-pill" onclick="setDepositFilter('REJECTED', this)">Rejected</button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <table class="enterprise-table">
                <thead>
                  <tr>
                    <th>Request ID & Date</th>
                    <th>Customer Details</th>
                    <th>Deposit Amount</th>
                    <th>Method</th>
                    <th>UTR / Reference No</th>
                    <th>Proof Screenshot</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="depositRequestsTableBody">
                  <!-- Populated by JS -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB: PLATFORM PAYMENT DETAILS CONFIGURATION
             ========================================== -->
        <div id="tabPaymentDetails" class="tab-view-content">
          <div class="panel-card">
            <div class="card-head">
              <div>
                <div class="card-title">Platform Payment Details & Receiving Accounts</div>
                <div class="card-subtitle">Configure company UPI, Bank, Cash counter, and USDT crypto details displayed to users on the Add Funds page</div>
              </div>
              <button class="btn-topbar primary" onclick="savePlatformPaymentDetails(event)">
                <i class="fa-solid fa-floppy-disk"></i> Save Payment Details
              </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <!-- Card 1: UPI Details -->
              <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 18px;">
                <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-qrcode" style="color: #FF5722;"></i> Company UPI & QR Configuration
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Account Holder Name</label>
                  <input type="text" id="cfgUpiHolder" value="Lucifer Finer Solutions Private Limited" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Company UPI ID</label>
                  <input type="text" id="cfgUpiId" value="yourbachatpay@kotak" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Merchant Terminal ID (TID)</label>
                  <input type="text" id="cfgUpiTid" value="TID: 68359529" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group">
                  <label>QR Code Image URL</label>
                  <input type="text" id="cfgUpiQrUrl" value="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3Dyourbachatpay%40kotak" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
              </div>

              <!-- Card 2: Bank Transfer Details -->
              <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 18px;">
                <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-building-columns" style="color: #2563EB;"></i> Company Bank Account Configuration
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Bank Name</label>
                  <input type="text" id="cfgBankName" value="Kotak Mahindra Bank" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Account Holder Name</label>
                  <input type="text" id="cfgBankHolder" value="Lucifer Finer Solutions Private Limited" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Account Number</label>
                  <input type="text" id="cfgBankAccountNo" value="983420192841" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label>IFSC Code</label>
                    <input type="text" id="cfgBankIfsc" value="KKBK0000958" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                  </div>
                  <div class="form-group">
                    <label>Branch / City</label>
                    <input type="text" id="cfgBankBranch" value="Nariman Point, Mumbai" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                  </div>
                </div>
              </div>

              <!-- Card 3: Cash Deposit Details -->
              <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 18px;">
                <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-money-bill-wave" style="color: #059669;"></i> Cash Deposit / Agent Collection Counter
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Authorized Counter Name</label>
                  <input type="text" id="cfgCashAgent" value="EasyPay Authorized Cashier & Agent Counter" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Center / Office Address</label>
                  <input type="text" id="cfgCashAddress" value="Shop 14, Bachat Pay Hub, Andheri Link Road, Mumbai 400053" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Authorized Phone Number</label>
                  <input type="text" id="cfgCashContact" value="+91 9876548808" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group">
                  <label>Instructions to User</label>
                  <input type="text" id="cfgCashInstructions" value="Visit authorized agent counter, submit cash and retain official receipt." style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
              </div>

              <!-- Card 4: USDT Crypto Details -->
              <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 18px;">
                <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-brands fa-ethereum" style="color: #097939;"></i> USDT Crypto Deposit Configuration
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>USDT Network</label>
                  <input type="text" id="cfgUsdtNetwork" value="TRC-20 (Tron Network)" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>USDT Receiving Wallet Address</label>
                  <input type="text" id="cfgUsdtAddress" value="TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1; font-family:monospace;">
                </div>
                <div class="form-group" style="margin-bottom: 12px;">
                  <label>Exchange Rate (₹ per USDT)</label>
                  <input type="number" step="0.1" id="cfgUsdtRate" value="92.50" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
                <div class="form-group">
                  <label>USDT QR Code URL</label>
                  <input type="text" id="cfgUsdtQrUrl" value="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==========================================
             TAB 8: SYSTEM SETTINGS`;

// Handle CRLF vs LF
const normalizedAdmin = admin.replace(/\r\n/g, '\n');
const normalizedTarget = tabTxnEndTarget.replace(/\r\n/g, '\n');

if (normalizedAdmin.includes(normalizedTarget) && !normalizedAdmin.includes('id="tabDeposits"')) {
  admin = normalizedAdmin.replace(normalizedTarget, newTabsMarkup);
  console.log('Successfully inserted #tabDeposits and #tabPaymentDetails markup!');
}

fs.writeFileSync('public/admin.html', admin, 'utf8');
