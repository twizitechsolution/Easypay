const fs = require('fs');
const vm = require('vm');

let admin = fs.readFileSync('public/admin.html', 'utf8');

// 1. Add Withdrawal Requests sidebar nav item right after Deposit Requests
const depNavAnchor = `        <li>
          <button class="nav-btn" onclick="switchTab('deposits')">
            <i class="fa-solid fa-money-bill-transfer"></i>
            <span>Deposit Requests</span>
            <span class="nav-badge" id="badgeDepositsCount" style="background: #EF4444; color: #FFFFFF; font-weight: 800;">2</span>
          </button>
        </li>`;
const wdrNavItem = `        <li>
          <button class="nav-btn" onclick="switchTab('withdrawals')">
            <i class="fa-solid fa-building-columns"></i>
            <span>Withdrawal Requests</span>
            <span class="nav-badge" id="badgeWithdrawalsCount" style="background: #F59E0B; color: #FFFFFF; font-weight: 800;">0</span>
          </button>
        </li>`;

if (!admin.includes(depNavAnchor)) throw new Error('depNavAnchor not found');
admin = admin.replace(depNavAnchor, () => depNavAnchor + '\n' + wdrNavItem);

// 2. Add #tabWithdrawals view right before #tabPaymentDetails
const payDetailsAnchor = '        <div id="tabPaymentDetails" class="tab-view-content">';
const tabWithdrawalsHtml = `        <!-- ==========================================
             TAB: USER WITHDRAWAL REQUESTS (BANK / UPI / USDT)
             ========================================== -->
        <div id="tabWithdrawals" class="tab-view-content">
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
              <div class="filter-pills-row" id="withdrawalFilterPills">
                <button class="filter-pill active" onclick="filterWithdrawalRequests('ALL', this)">All Requests</button>
                <button class="filter-pill" onclick="filterWithdrawalRequests('PENDING', this)">Pending Approval</button>
                <button class="filter-pill" onclick="filterWithdrawalRequests('APPROVED', this)">Approved</button>
                <button class="filter-pill" onclick="filterWithdrawalRequests('REJECTED', this)">Rejected (Refunded)</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="enterprise-table">
                <thead>
                  <tr>
                    <th>Request ID & Time</th>
                    <th>User Details</th>
                    <th>Method</th>
                    <th>Destination Account / Address</th>
                    <th>Withdrawal Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="withdrawalRequestsTableBody">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

`;
if (!admin.includes(payDetailsAnchor)) throw new Error('payDetailsAnchor not found');
admin = admin.replace(payDetailsAnchor, () => tabWithdrawalsHtml + payDetailsAnchor);

// 3. Add 10-Level Referral & First Deposit Bonus Settings card inside #tabPaymentDetails
const payDetailsEndAnchor = `                <div class="form-group">
                  <label>USDT QR Code URL</label>
                  <input type="text" id="cfgUsdtQrUrl" value="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL" style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid #CBD5E1;">
                </div>
              </div>
            </div>`;

const referralSettingsCardHtml = `
            <!-- Card 5: 10-Level Referral Commission & First Deposit Bonus -->
            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 18px; margin-top: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
                <div style="font-size: 15px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 8px;">
                  <i class="fa-solid fa-sitemap" style="color: #7C3AED;"></i> Referral Program: First Deposit Bonus & 10-Level Commission (%)
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: #FFF3E0; border: 1px solid #FFCC80; padding: 6px 12px; border-radius: 10px;">
                  <label style="font-size: 12px; font-weight: 800; color: #E65100; margin: 0;">First Deposit Bonus (%):</label>
                  <input type="number" step="0.1" min="0" max="100" id="cfgFirstDepositBonus" value="5" style="width: 72px; padding: 5px 8px; border-radius: 6px; border: 1px solid #FB8C00; font-weight: 800; text-align: center;">
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 1 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_1" value="5" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 2 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_2" value="3" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 3 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_3" value="2" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 4 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_4" value="1.5" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 5 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_5" value="1" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 6 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_6" value="0.75" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 7 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_7" value="0.5" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 8 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_8" value="0.5" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 9 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_9" value="0.25" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
                <div><label style="font-size: 11px; font-weight: 700; color: #475569;">Level 10 (%)</label><input type="number" step="0.05" min="0" id="cfgLvlComm_10" value="0.25" style="width:100%; padding:7px 10px; border-radius:8px; border:1px solid #CBD5E1; font-weight:700;"></div>
              </div>
            </div>`;

if (!admin.includes(payDetailsEndAnchor)) throw new Error('payDetailsEndAnchor not found');
admin = admin.replace(payDetailsEndAnchor, () => payDetailsEndAnchor + '\n' + referralSettingsCardHtml);

// 4. Update renderPaymentSettingsForm & savePlatformPaymentDetails to handle referralSettings
const oldRenderPayEnd = `      if (document.getElementById('cfgUsdtQrUrl')) document.getElementById('cfgUsdtQrUrl').value = usdt.qrCodeImage || '';
    }`;
const newRenderPayEnd = `      if (document.getElementById('cfgUsdtQrUrl')) document.getElementById('cfgUsdtQrUrl').value = usdt.qrCodeImage || '';

      const refCfg = adminData.referralSettings || { firstDepositBonusPercent: 5, levelCommissions: [5, 3, 2, 1.5, 1, 0.75, 0.5, 0.5, 0.25, 0.25] };
      if (document.getElementById('cfgFirstDepositBonus')) document.getElementById('cfgFirstDepositBonus').value = refCfg.firstDepositBonusPercent != null ? refCfg.firstDepositBonusPercent : 5;
      for (let i = 1; i <= 10; i++) {
        const el = document.getElementById('cfgLvlComm_' + i);
        if (el && refCfg.levelCommissions && refCfg.levelCommissions[i - 1] != null) {
          el.value = refCfg.levelCommissions[i - 1];
        }
      }
    }`;
if (!admin.includes(oldRenderPayEnd)) throw new Error('oldRenderPayEnd not found');
admin = admin.replace(oldRenderPayEnd, () => newRenderPayEnd);

const oldSavePayloadEnd = `        usdt: {
          network: document.getElementById('cfgUsdtNetwork').value.trim(),
          walletAddress: document.getElementById('cfgUsdtAddress').value.trim(),
          exchangeRateInr: parseFloat(document.getElementById('cfgUsdtRate').value) || 92.50,
          qrCodeImage: document.getElementById('cfgUsdtQrUrl').value.trim()
        }
      };`;
const newSavePayloadEnd = `        usdt: {
          network: document.getElementById('cfgUsdtNetwork').value.trim(),
          walletAddress: document.getElementById('cfgUsdtAddress').value.trim(),
          exchangeRateInr: parseFloat(document.getElementById('cfgUsdtRate').value) || 92.50,
          qrCodeImage: document.getElementById('cfgUsdtQrUrl').value.trim()
        },
        referralSettings: {
          firstDepositBonusPercent: parseFloat(document.getElementById('cfgFirstDepositBonus')?.value) || 5,
          levelCommissions: Array.from({ length: 10 }, (_, idx) => parseFloat(document.getElementById('cfgLvlComm_' + (idx + 1))?.value) || 0)
        }
      };`;
if (!admin.includes(oldSavePayloadEnd)) throw new Error('oldSavePayloadEnd not found');
admin = admin.replace(oldSavePayloadEnd, () => newSavePayloadEnd);

// 5. Update renderBadges & add renderWithdrawalRequestsTable / approve / reject JS
const oldBadgesEnd = `      const pendingDeps = (adminData.depositRequests || []).filter(r => r.status === 'PENDING').length;
      if (document.getElementById('badgeDepositsCount')) document.getElementById('badgeDepositsCount').innerText = pendingDeps;
    }`;
const newBadgesEnd = `      const pendingDeps = (adminData.depositRequests || []).filter(r => r.status === 'PENDING').length;
      if (document.getElementById('badgeDepositsCount')) document.getElementById('badgeDepositsCount').innerText = pendingDeps;
      const pendingWdrs = (adminData.withdrawalRequests || []).filter(r => r.status === 'PENDING').length;
      if (document.getElementById('badgeWithdrawalsCount')) document.getElementById('badgeWithdrawalsCount').innerText = pendingWdrs;
    }`;
if (!admin.includes(oldBadgesEnd)) throw new Error('oldBadgesEnd not found');
admin = admin.replace(oldBadgesEnd, () => newBadgesEnd);

// Call renderWithdrawalRequestsTable() right where renderDepositRequestsTable() is called
const renderDepCallAnchor = 'renderDepositRequestsTable();';
if (!admin.includes(renderDepCallAnchor)) throw new Error('renderDepCallAnchor not found');
admin = admin.replace(renderDepCallAnchor, () => 'renderDepositRequestsTable();\n      renderWithdrawalRequestsTable();');

// Add JS functions for Withdrawals right before renderBadges()
const withdrawalAdminJs = `
    let currentWdrFilter = 'ALL';
    function filterWithdrawalRequests(status, btn) {
      currentWdrFilter = status;
      if (btn) {
        document.querySelectorAll('#withdrawalFilterPills .filter-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
      }
      renderWithdrawalRequestsTable();
    }

    function renderWithdrawalRequestsTable() {
      const tbody = document.getElementById('withdrawalRequestsTableBody');
      if (!tbody) return;
      const q = (document.getElementById('withdrawalSearchInput')?.value || '').trim().toLowerCase();
      let list = adminData.withdrawalRequests || [];
      if (currentWdrFilter !== 'ALL') {
        list = list.filter(r => r.status === currentWdrFilter);
      }
      if (q) {
        list = list.filter(r =>
          (r.id || '').toLowerCase().includes(q) ||
          (r.userId || '').toLowerCase().includes(q) ||
          (r.userName || '').toLowerCase().includes(q) ||
          (r.userMobile || '').toLowerCase().includes(q)
        );
      }

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748B;">No withdrawal requests found for this filter.</td></tr>';
        return;
      }

      tbody.innerHTML = list.map(r => {
        const dest = r.destinationDetails || {};
        let destHtml = '';
        if (r.methodType === 'bank') {
          destHtml = '<strong>' + (dest.bankName || 'Bank') + '</strong><div style="font-size:11px; color:#64748B;">A/C: ' + (dest.accountRaw || dest.accountMasked || 'N/A') + ' • IFSC: ' + (dest.ifsc || 'N/A') + '</div>';
        } else if (r.methodType === 'upi') {
          destHtml = '<strong>' + (dest.upiId || 'UPI ID') + '</strong><div style="font-size:11px; color:#64748B;">Holder: ' + (dest.holderName || r.userName) + '</div>';
        } else {
          destHtml = '<strong style="font-family:monospace;">' + (dest.usdtAddressRaw || dest.usdtAddress || 'USDT') + '</strong><div style="font-size:11px; color:#64748B;">Network: ' + (dest.usdtNetwork || 'TRC-20') + '</div>';
        }

        const badgeClass = r.status === 'APPROVED' ? 'badge-green' : (r.status === 'REJECTED' ? 'badge-red' : 'badge-amber');
        const amtHtml = r.amountUsdt
          ? '<strong style="color:#0F172A; font-size:14px;">₹' + Number(r.amountInr || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</strong><div style="font-size:11px; color:#097939; font-weight:700;">' + r.amountUsdt + ' USDT @ ₹' + (r.usdtRate || 92.5) + '</div>'
          : '<strong style="color:#0F172A; font-size:14px;">₹' + Number(r.amountInr || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }) + '</strong>';

        const actionHtml = r.status === 'PENDING'
          ? '<div class="btn-group-actions">' +
              '<button class="action-btn success" onclick="approveWithdrawalRequest(\\'' + r.id + '\\')"><i class="fa-solid fa-check"></i> Approve</button>' +
              '<button class="action-btn danger" onclick="rejectWithdrawalRequest(\\'' + r.id + '\\')"><i class="fa-solid fa-xmark"></i> Reject</button>' +
            '</div>'
          : '<span style="font-size:11px; color:#64748B; font-weight:600;">Processed</span>';

        return '<tr>' +
          '<td><code>' + r.id + '</code><div style="font-size:11px; color:#64748B; margin-top:2px;">' + formatAdminTimestamp(r.createdAt) + '</div></td>' +
          '<td><strong>' + (r.userName || 'User') + '</strong><div style="font-size:11px; color:#64748B;">' + (r.userId || '') + ' • +91 ' + (r.userMobile || '') + '</div></td>' +
          '<td><span class="badge badge-blue">' + (r.methodLabel || r.methodType || 'BANK').toUpperCase() + '</span></td>' +
          '<td>' + destHtml + '</td>' +
          '<td>' + amtHtml + '</td>' +
          '<td><span class="badge ' + badgeClass + '">' + r.status + '</span></td>' +
          '<td>' + actionHtml + '</td>' +
        '</tr>';
      }).join('');
    }

    async function approveWithdrawalRequest(id) {
      if (!confirm('Approve withdrawal request ' + id + ' and mark transaction as SUCCESS?')) return;
      const res = await fetch('/api/admin/withdrawal-requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Withdrawal ' + id + ' approved!');
        refreshAdminData();
      } else {
        alert(data.error || 'Failed to approve withdrawal');
      }
    }

    async function rejectWithdrawalRequest(id) {
      const reason = prompt('Enter rejection reason (Amount will be refunded to user wallet):', 'Invalid destination details');
      if (reason === null) return;
      const res = await fetch('/api/admin/withdrawal-requests/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reason })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Withdrawal ' + id + ' rejected & amount refunded!');
        refreshAdminData();
      } else {
        alert(data.error || 'Failed to reject withdrawal');
      }
    }

`;

const badgesAnchor = '    // Render Badge Counts';
if (!admin.includes(badgesAnchor)) throw new Error('badgesAnchor not found');
admin = admin.replace(badgesAnchor, () => withdrawalAdminJs + '\n' + badgesAnchor);

// Validate all script blocks in admin.html
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let idx = 0;
while ((m = scriptRegex.exec(admin)) !== null) {
  idx++;
  new vm.Script(m[1]);
  console.log('Admin Script ' + idx + ' syntax OK');
}

fs.writeFileSync('public/admin.html', admin, 'utf8');
console.log('Successfully updated public/admin.html!');
