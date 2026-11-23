const fs = require('fs');

let admin = fs.readFileSync('public/admin.html', 'utf8');

// 1. Add Sidebar Buttons for Deposit Requests and Payment Details
const sidebarAnchor = `<button class="nav-btn" onclick="switchTab('transactions')">
            <i class="fa-solid fa-receipt"></i> Transactions Ledger
          </button>`;

const newSidebarButtons = `<button class="nav-btn" onclick="switchTab('transactions')">
            <i class="fa-solid fa-receipt"></i> Transactions Ledger
          </button>
          <button class="nav-btn" onclick="switchTab('deposits')">
            <i class="fa-solid fa-money-bill-transfer"></i> Deposit Requests
            <span class="nav-badge" id="badgeDepositsCount" style="background: #EF4444; color: #FFFFFF; font-weight: 800;">2</span>
          </button>
          <button class="nav-btn" onclick="switchTab('paymentDetails')">
            <i class="fa-solid fa-building-columns"></i> Payment Details
          </button>`;

if (admin.includes(sidebarAnchor) && !admin.includes("switchTab('deposits')")) {
  admin = admin.replace(sidebarAnchor, newSidebarButtons);
  console.log('1. Added Deposit Requests and Payment Details to Admin sidebar');
}

// 2. Add titles mapping in switchTab
const oldTitles = `'transactions': 'Financial Transactions Ledger',`;
const newTitles = `'transactions': 'Financial Transactions Ledger',
        'deposits': 'User Add Funds & Deposit Requests Audit',
        'paymentDetails': 'Platform Payment Details & Accounts Configuration',`;

if (admin.includes(oldTitles) && !admin.includes("'deposits':")) {
  admin = admin.replace(oldTitles, newTitles);
  console.log('2. Updated switchTab titles mapping');
}

// 3. Add Account Status column in Users Table
const oldUserThead = `<tr>
                    <th>User ID & Name</th>
                    <th>Mobile Number</th>
                    <th>PayID Handle</th>
                    <th>Wallet Balance</th>
                    <th>Security PIN</th>
                    <th>KYC Status</th>
                    <th>Linked Bank</th>
                    <th>Actions</th>
                  </tr>`;

const newUserThead = `<tr>
                    <th>User ID & Name</th>
                    <th>Mobile Number</th>
                    <th>PayID Handle</th>
                    <th>Wallet Balance</th>
                    <th>Security PIN</th>
                    <th>KYC Status</th>
                    <th>Account Status</th>
                    <th>Linked Bank</th>
                    <th>Actions</th>
                  </tr>`;

if (admin.includes(oldUserThead)) {
  admin = admin.replace(oldUserThead, newUserThead);
  console.log('3. Added Account Status header to Users table');
}

// 4. Update renderUsersTable to show Account Status
const oldUserRowKyc = `<td><span class="badge badge-green"><i class="fa-solid fa-check"></i> \${u.kycStatus || 'VERIFIED'}</span></td>
          <td><div style="font-size: 12px;">\${u.bankName || 'BANK OF INDIA'}</div></td>`;

const newUserRowKyc = `<td><span class="badge badge-green"><i class="fa-solid fa-check"></i> \${u.kycStatus || 'VERIFIED'}</span></td>
          <td>
            <span class="badge \${u.isActivated !== false && (Number(u.walletBalance || 0) > 0 || u.status === 'ACTIVE') ? 'badge-green' : 'badge-amber'}">
              \${u.isActivated !== false && (Number(u.walletBalance || 0) > 0 || u.status === 'ACTIVE') ? '<i class="fa-solid fa-circle-check"></i> Active' : '<i class="fa-solid fa-clock"></i> Not Active'}
            </span>
          </td>
          <td><div style="font-size: 12px;">\${u.bankName || 'BANK OF INDIA'}</div></td>`;

if (admin.includes(oldUserRowKyc)) {
  admin = admin.replace(oldUserRowKyc, newUserRowKyc);
  console.log('4. Updated renderUsersTable with Account Status badge');
}

// 5. Add Deposit Requests and Payment Details Tab Markup
const tabAnchor = `        <!-- ==========================================
             TAB 8: SYSTEM SETTINGS
             ========================================== -->`;

const newTabsMarkup = `        <!-- ==========================================
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
`;

if (admin.includes(tabAnchor) && !admin.includes('id="tabDeposits"')) {
  admin = admin.replace(tabAnchor, newTabsMarkup + '\n' + tabAnchor);
  console.log('5. Added #tabDeposits and #tabPaymentDetails markup');
}

// 6. Add JavaScript Functions for Deposit Requests and Payment Details
const jsAnchor = '    // Render Badge Counts';
const newJsFunctions = `    // =======================================================
    // DEPOSIT REQUESTS & PAYMENT DETAILS CONTROLLERS
    // =======================================================
    let activeDepositFilter = 'ALL';

    function setDepositFilter(filterStatus, btn) {
      activeDepositFilter = filterStatus;
      document.querySelectorAll('#depositFilterPills .filter-pill').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      filterDepositRequestsTable();
    }

    function filterDepositRequestsTable() {
      const q = (document.getElementById('depositSearchInput') ? document.getElementById('depositSearchInput').value : '').toLowerCase().trim();
      const allReqs = adminData.depositRequests || [];
      const filtered = allReqs.filter(r => {
        if (activeDepositFilter !== 'ALL' && r.status !== activeDepositFilter) return false;
        if (q) {
          const matchUtr = (r.utr || '').toLowerCase().includes(q);
          const matchUser = (r.userName || r.userMobile || r.userId || '').toLowerCase().includes(q);
          const matchId = (r.id || '').toLowerCase().includes(q);
          if (!matchUtr && !matchUser && !matchId) return false;
        }
        return true;
      });
      renderDepositRequestsRows(filtered);
    }

    function renderDepositRequestsTable() {
      filterDepositRequestsTable();
    }

    function renderDepositRequestsRows(reqs) {
      const tbody = document.getElementById('depositRequestsTableBody');
      if (!tbody) return;
      if (reqs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--text-muted); font-size: 13px;">No deposit requests match the selected criteria.</td></tr>';
        return;
      }
      tbody.innerHTML = reqs.map(r => {
        const isPending = r.status === 'PENDING';
        const isApproved = r.status === 'APPROVED';
        const statusBadge = isPending 
          ? '<span class="badge badge-amber"><i class="fa-solid fa-clock"></i> PENDING APPROVAL</span>'
          : (isApproved ? '<span class="badge badge-green"><i class="fa-solid fa-check"></i> APPROVED</span>' : '<span class="badge badge-red"><i class="fa-solid fa-xmark"></i> REJECTED</span>');
        const formattedDate = formatAdminTimestamp(r.timestamp);

        return '<tr>' +
          '<td><code>' + r.id + '</code><div style="font-size:11px; color:#64748B;">' + formattedDate + '</div></td>' +
          '<td><strong>' + (r.userName || 'Customer') + '</strong><div style="font-size:11px; color:#64748B;">+91 ' + r.userMobile + ' • ' + (r.userId || '') + '</div></td>' +
          '<td><strong style="font-size:15px; color:#059669;">₹' + Number(r.amount || 0).toLocaleString('en-IN') + '</strong></td>' +
          '<td><span class="badge badge-purple">' + (r.method || 'UPI') + '</span></td>' +
          '<td><code style="font-weight:700; color:#2563EB;">' + (r.utr || 'N/A') + '</code></td>' +
          '<td>' + (r.screenshot ? '<a href="' + r.screenshot + '" target="_blank" style="display:inline-flex; align-items:center; gap:4px; font-size:12px; color:#2563EB; font-weight:700;"><i class="fa-solid fa-image"></i> View Proof</a>' : '<span style="color:#94A3B8; font-size:11px;">No Proof Attached</span>') + '</td>' +
          '<td>' + statusBadge + '</td>' +
          '<td>' +
            (isPending ? (
              '<div class="btn-group-actions">' +
                '<button class="action-btn success" onclick="approveDepositRequest(\\'' + r.id + '\\')" title="Approve & Credit Wallet"><i class="fa-solid fa-check"></i> Approve</button>' +
                '<button class="action-btn danger" onclick="rejectDepositRequest(\\'' + r.id + '\\')" title="Reject Request"><i class="fa-solid fa-xmark"></i> Reject</button>' +
              '</div>'
            ) : '<span style="font-size:11px; color:#64748B;">' + (isApproved ? 'Funds Credited' : 'Dismissed') + '</span>') +
          '</td>' +
        '</tr>';
      }).join('');
    }

    async function approveDepositRequest(id) {
      if (!confirm('Approve this deposit request and instantly credit funds to the user wallet?')) return;
      try {
        const res = await fetch('/api/admin/deposit-requests/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Deposit approved! User wallet credited and account activated.');
          refreshAdminData();
        } else {
          alert(data.error || 'Failed to approve deposit');
        }
      } catch (err) {
        console.error(err);
        alert('Server error approving deposit');
      }
    }

    async function rejectDepositRequest(id) {
      const reason = prompt('Enter rejection reason (optional):', 'Invalid UTR reference');
      if (reason === null) return;
      try {
        const res = await fetch('/api/admin/deposit-requests/reject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, reason })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Deposit request rejected');
          refreshAdminData();
        } else {
          alert(data.error || 'Failed to reject deposit');
        }
      } catch (err) {
        console.error(err);
        alert('Server error rejecting deposit');
      }
    }

    // Populate Platform Payment Settings Form
    function renderPaymentSettingsForm() {
      const s = adminData.platformPaymentDetails || {};
      const upi = s.upi || {};
      const bank = s.bank || {};
      const cash = s.cash || {};
      const usdt = s.usdt || {};

      if (document.getElementById('cfgUpiHolder')) document.getElementById('cfgUpiHolder').value = upi.accountHolder || 'Lucifer Finer Solutions Private Limited';
      if (document.getElementById('cfgUpiId')) document.getElementById('cfgUpiId').value = upi.upiId || 'yourbachatpay@kotak';
      if (document.getElementById('cfgUpiTid')) document.getElementById('cfgUpiTid').value = upi.merchantTid || 'TID: 68359529';
      if (document.getElementById('cfgUpiQrUrl')) document.getElementById('cfgUpiQrUrl').value = upi.qrCodeImage || '';

      if (document.getElementById('cfgBankName')) document.getElementById('cfgBankName').value = bank.bankName || 'Kotak Mahindra Bank';
      if (document.getElementById('cfgBankHolder')) document.getElementById('cfgBankHolder').value = bank.accountHolder || 'Lucifer Finer Solutions Private Limited';
      if (document.getElementById('cfgBankAccountNo')) document.getElementById('cfgBankAccountNo').value = bank.accountNumber || '983420192841';
      if (document.getElementById('cfgBankIfsc')) document.getElementById('cfgBankIfsc').value = bank.ifscCode || 'KKBK0000958';
      if (document.getElementById('cfgBankBranch')) document.getElementById('cfgBankBranch').value = bank.branch || 'Nariman Point, Mumbai';

      if (document.getElementById('cfgCashAgent')) document.getElementById('cfgCashAgent').value = cash.agentName || 'EasyPay Authorized Cashier & Agent Counter';
      if (document.getElementById('cfgCashAddress')) document.getElementById('cfgCashAddress').value = cash.officeAddress || 'Shop 14, Bachat Pay Hub, Andheri Link Road, Mumbai 400053';
      if (document.getElementById('cfgCashContact')) document.getElementById('cfgCashContact').value = cash.contactNumber || '+91 9876548808';
      if (document.getElementById('cfgCashInstructions')) document.getElementById('cfgCashInstructions').value = cash.instructions || '';

      if (document.getElementById('cfgUsdtNetwork')) document.getElementById('cfgUsdtNetwork').value = usdt.network || 'TRC-20 (Tron Network)';
      if (document.getElementById('cfgUsdtAddress')) document.getElementById('cfgUsdtAddress').value = usdt.walletAddress || 'TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL';
      if (document.getElementById('cfgUsdtRate')) document.getElementById('cfgUsdtRate').value = usdt.exchangeRateInr || 92.50;
      if (document.getElementById('cfgUsdtQrUrl')) document.getElementById('cfgUsdtQrUrl').value = usdt.qrCodeImage || '';
    }

    async function savePlatformPaymentDetails(e) {
      if (e) e.preventDefault();
      const payload = {
        upi: {
          accountHolder: document.getElementById('cfgUpiHolder').value.trim(),
          upiId: document.getElementById('cfgUpiId').value.trim(),
          merchantTid: document.getElementById('cfgUpiTid').value.trim(),
          qrCodeImage: document.getElementById('cfgUpiQrUrl').value.trim()
        },
        bank: {
          bankName: document.getElementById('cfgBankName').value.trim(),
          accountHolder: document.getElementById('cfgBankHolder').value.trim(),
          accountNumber: document.getElementById('cfgBankAccountNo').value.trim(),
          ifscCode: document.getElementById('cfgBankIfsc').value.trim(),
          branch: document.getElementById('cfgBankBranch').value.trim()
        },
        cash: {
          agentName: document.getElementById('cfgCashAgent').value.trim(),
          officeAddress: document.getElementById('cfgCashAddress').value.trim(),
          contactNumber: document.getElementById('cfgCashContact').value.trim(),
          instructions: document.getElementById('cfgCashInstructions').value.trim()
        },
        usdt: {
          network: document.getElementById('cfgUsdtNetwork').value.trim(),
          walletAddress: document.getElementById('cfgUsdtAddress').value.trim(),
          exchangeRateInr: parseFloat(document.getElementById('cfgUsdtRate').value) || 92.50,
          qrCodeImage: document.getElementById('cfgUsdtQrUrl').value.trim()
        }
      };

      try {
        const res = await fetch('/api/admin/payment-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Platform payment details saved successfully!');
          refreshAdminData();
        } else {
          alert(data.error || 'Failed to save payment details');
        }
      } catch (err) {
        console.error(err);
        alert('Server error saving payment settings');
      }
    }
`;

if (admin.includes(jsAnchor) && !admin.includes('function approveDepositRequest')) {
  admin = admin.replace(jsAnchor, newJsFunctions + '\n' + jsAnchor);
  console.log('6. Added deposit and payment controllers to JS');
}

// 7. Update renderEverything and renderBadges to render deposits and payment form
admin = admin.replace(
  'renderLuckyDrawAdmin();',
  'renderLuckyDrawAdmin();\n      renderDepositRequestsTable();\n      renderPaymentSettingsForm();'
);

admin = admin.replace(
  "document.getElementById('badgeUsersCount').innerText = (adminData.users || []).length;",
  "document.getElementById('badgeUsersCount').innerText = (adminData.users || []).length;\n      const pendingDeps = (adminData.depositRequests || []).filter(r => r.status === 'PENDING').length;\n      if (document.getElementById('badgeDepositsCount')) document.getElementById('badgeDepositsCount').innerText = pendingDeps;"
);

fs.writeFileSync('public/admin.html', admin, 'utf8');
console.log('Successfully updated public/admin.html!');
