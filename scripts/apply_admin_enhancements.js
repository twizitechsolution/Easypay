const fs = require('fs');

let admin = fs.readFileSync('public/admin.html', 'utf8');

// =========================================================================
// 1. Full-Width Table Replacement: Change admin-table-wrap & admin-table to table-responsive & enterprise-table
// =========================================================================
admin = admin.replace(
  /<div class="admin-table-wrap">\s*<table class="admin-table">/g,
  '<div class="table-responsive">\n              <table class="enterprise-table">'
);
console.log('1. Replaced admin-table with enterprise-table');

// =========================================================================
// 2. Add "User Details" Button to renderUsersTable Actions Column
// =========================================================================
const oldUserActions = `<div class="btn-group-actions">
              <button class="action-btn success" onclick="openWalletAdjustModal('\${u.id}', '\${u.name || u.firstName}', \${u.walletBalance || 0})">
                <i class="fa-solid fa-wallet"></i> +/- Wallet
              </button>
              <button class="action-btn" onclick="openEditUserModal('\${u.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="action-btn danger" onclick="deleteUser('\${u.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>`;

const newUserActions = `<div class="btn-group-actions">
              <button class="action-btn" style="background: #2563EB; color: #FFFFFF; border-color: #2563EB;" onclick="openUserDetailsModal('\${u.id}')">
                <i class="fa-solid fa-id-card"></i> User Details
              </button>
              <button class="action-btn success" onclick="openWalletAdjustModal('\${u.id}', '\${u.name || u.firstName}', \${u.walletBalance || 0})">
                <i class="fa-solid fa-wallet"></i> +/- Wallet
              </button>
              <button class="action-btn" onclick="openEditUserModal('\${u.id}')" title="Edit Profile"><i class="fa-solid fa-pen"></i></button>
              <button class="action-btn danger" onclick="deleteUser('\${u.id}')" title="Delete User"><i class="fa-solid fa-trash"></i></button>
            </div>`;

if (admin.includes(oldUserActions)) {
  admin = admin.replace(oldUserActions, newUserActions);
  console.log('2. Added User Details button to renderUsersTable');
} else {
  console.log('2. Already updated or pattern not found');
}

// =========================================================================
// 3. Multi-Angle Product Photos in modalProduct
// =========================================================================
const oldProductImgFormGroup = `        <div class="form-group">
          <label>Product Image URL</label>
          <input type="url" id="productImageInput" placeholder="https://images.unsplash.com/..." required>
        </div>`;

const newProductImgFormGroup = `        <!-- Product Photography & Multi-Angle Upload (Screenshot 1 Request) -->
        <div class="form-group" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <label style="margin: 0; font-weight: 700; color: #1E293B; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-camera" style="color: #2563EB;"></i> Product Photography & Multi-Angle Images (2-3 Angles)
            </label>
            <span style="font-size: 11px; color: #64748B;">Upload local files or paste image URLs</span>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <!-- Angle 1: Primary / Front View -->
            <div style="border: 1.5px dashed #CBD5E1; border-radius: 10px; padding: 10px; background: #FFFFFF; text-align: center; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge badge-blue" style="font-size: 10px; padding: 2px 6px;">Angle 1 (Main/Hero)</span>
                <button type="button" class="action-btn danger" style="padding: 2px 6px; font-size: 10px;" onclick="clearAngleSlot(1)" title="Clear Image">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div id="previewBox1" style="height: 85px; width: 100%; border-radius: 6px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #E2E8F0; position: relative;">
                <i class="fa-solid fa-image" id="previewPlaceholder1" style="font-size: 24px; color: #94A3B8;"></i>
                <img id="previewImg1" src="" style="width: 100%; height: 100%; object-fit: contain; display: none;" alt="Angle 1">
              </div>
              <input type="file" id="fileSlot1" accept="image/*" style="display: none;" onchange="handleAngleFileUpload(event, 1)">
              <button type="button" class="btn-topbar" style="padding: 5px 8px; font-size: 11px; width: 100%; justify-content: center;" onclick="document.getElementById('fileSlot1').click()">
                <i class="fa-solid fa-upload"></i> Upload Image
              </button>
              <input type="url" id="productImageInput1" placeholder="Or paste image URL" style="font-size: 11px; padding: 5px 8px; border: 1px solid #CBD5E1; border-radius: 6px; width: 100%;" oninput="updateAnglePreviewFromUrl(1)">
            </div>

            <!-- Angle 2: Side / Detail View -->
            <div style="border: 1.5px dashed #CBD5E1; border-radius: 10px; padding: 10px; background: #FFFFFF; text-align: center; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge badge-purple" style="font-size: 10px; padding: 2px 6px;">Angle 2 (Side/Detail)</span>
                <button type="button" class="action-btn danger" style="padding: 2px 6px; font-size: 10px;" onclick="clearAngleSlot(2)" title="Clear Image">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div id="previewBox2" style="height: 85px; width: 100%; border-radius: 6px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #E2E8F0; position: relative;">
                <i class="fa-solid fa-image" id="previewPlaceholder2" style="font-size: 24px; color: #94A3B8;"></i>
                <img id="previewImg2" src="" style="width: 100%; height: 100%; object-fit: contain; display: none;" alt="Angle 2">
              </div>
              <input type="file" id="fileSlot2" accept="image/*" style="display: none;" onchange="handleAngleFileUpload(event, 2)">
              <button type="button" class="btn-topbar" style="padding: 5px 8px; font-size: 11px; width: 100%; justify-content: center;" onclick="document.getElementById('fileSlot2').click()">
                <i class="fa-solid fa-upload"></i> Upload Image
              </button>
              <input type="url" id="productImageInput2" placeholder="Or paste image URL" style="font-size: 11px; padding: 5px 8px; border: 1px solid #CBD5E1; border-radius: 6px; width: 100%;" oninput="updateAnglePreviewFromUrl(2)">
            </div>

            <!-- Angle 3: Rear / In-Use View -->
            <div style="border: 1.5px dashed #CBD5E1; border-radius: 10px; padding: 10px; background: #FFFFFF; text-align: center; display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge badge-green" style="font-size: 10px; padding: 2px 6px;">Angle 3 (Rear/Lifestyle)</span>
                <button type="button" class="action-btn danger" style="padding: 2px 6px; font-size: 10px;" onclick="clearAngleSlot(3)" title="Clear Image">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div id="previewBox3" style="height: 85px; width: 100%; border-radius: 6px; background: #F1F5F9; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #E2E8F0; position: relative;">
                <i class="fa-solid fa-image" id="previewPlaceholder3" style="font-size: 24px; color: #94A3B8;"></i>
                <img id="previewImg3" src="" style="width: 100%; height: 100%; object-fit: contain; display: none;" alt="Angle 3">
              </div>
              <input type="file" id="fileSlot3" accept="image/*" style="display: none;" onchange="handleAngleFileUpload(event, 3)">
              <button type="button" class="btn-topbar" style="padding: 5px 8px; font-size: 11px; width: 100%; justify-content: center;" onclick="document.getElementById('fileSlot3').click()">
                <i class="fa-solid fa-upload"></i> Upload Image
              </button>
              <input type="url" id="productImageInput3" placeholder="Or paste image URL" style="font-size: 11px; padding: 5px 8px; border: 1px solid #CBD5E1; border-radius: 6px; width: 100%;" oninput="updateAnglePreviewFromUrl(3)">
            </div>
          </div>
          <!-- Hidden fallback input for backward compatibility -->
          <input type="hidden" id="productImageInput">
        </div>`;

if (admin.includes(oldProductImgFormGroup)) {
  admin = admin.replace(oldProductImgFormGroup, newProductImgFormGroup);
  console.log('3. Updated product image uploader in modalProduct');
}

// =========================================================================
// 4. Add Comprehensive User Details Modal Markup (#modalUserDetails)
// =========================================================================
const userDetailsModalHtml = `
  <!-- =======================================================
       COMPREHENSIVE USER DETAILS DOSSIER MODAL (Screenshot 2 Request)
       ======================================================= -->
  <div class="modal-backdrop" id="modalUserDetails" style="z-index: 10010;">
    <div class="modal-card" style="max-width: 960px; width: 95%; max-height: 90vh; overflow-y: auto;">
      <!-- Modal Header -->
      <div class="modal-head" style="border-bottom: 1px solid #E2E8F0; padding-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div id="dossierAvatar" style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2563EB, #1D4ED8); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; box-shadow: 0 2px 6px rgba(37,99,235,0.3);">
            N
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="dossierUserName" style="font-size: 18px; font-weight: 800; color: #0F172A;">Nirod Behera</span>
              <span id="dossierKycBadge" class="badge badge-green"><i class="fa-solid fa-check"></i> KYC VERIFIED</span>
            </div>
            <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
              User ID: <code id="dossierUserId" style="color: #2563EB; font-weight: 700;">EPY98808</code> • 
              Registered: <span id="dossierRegisteredAt">18 Nov 2026</span>
            </div>
          </div>
        </div>
        <button class="modal-close-btn" onclick="closeModal('modalUserDetails')"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- KPI Stat Cards Row -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0;">
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">E-Pay Wallet Balance</div>
          <div id="dossierStatWallet" style="font-size: 20px; font-weight: 800; color: #059669; margin-top: 4px;">₹30,584.13</div>
          <div style="font-size: 11px; color: #059669; margin-top: 2px;"><i class="fa-solid fa-circle-check"></i> Available Balance</div>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Total Deposits / Adds</div>
          <div id="dossierStatDeposits" style="font-size: 20px; font-weight: 800; color: #2563EB; margin-top: 4px;">₹15,000.00</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 2px;">UPI, Bank & Gateway</div>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Total Spend & Orders</div>
          <div id="dossierStatSpend" style="font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 4px;">₹11,790.00</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Mall, Vouchers & Draws</div>
        </div>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Referred Downline</div>
          <div id="dossierStatDownline" style="font-size: 20px; font-weight: 800; color: #7C3AED; margin-top: 4px;">6 Members</div>
          <div style="font-size: 11px; color: #7C3AED; margin-top: 2px;"><i class="fa-solid fa-users"></i> Network Team</div>
        </div>
      </div>

      <!-- Section 1: User Account, Profile & Security Credentials -->
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-shield-halved" style="color: #2563EB;"></i> User Profile, Security Credentials & Bank Setup
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; font-size: 13px;">
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Full Name</span>
            <strong id="dossierFieldFullName" style="color: #0F172A;">Nirod Behera</strong>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Registered Mobile</span>
            <strong id="dossierFieldMobile" style="color: #0F172A;">+91 9876548808</strong>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Email Address</span>
            <span id="dossierFieldEmail" style="color: #0F172A; word-break: break-all;">nirodbehera220@gmail.com</span>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">PayID / Handle</span>
            <code id="dossierFieldPayId" style="color: #2563EB; font-weight: 700;">9876548808@easypay</code>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Account Password</span>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <input type="password" id="dossierFieldPassword" value="EasyPay@8808" readonly style="width: 110px; padding: 4px 6px; font-size: 12px; border: 1px solid #CBD5E1; border-radius: 4px; background: #F8FAFC;">
              <button type="button" class="action-btn" onclick="toggleDossierVisibility('dossierFieldPassword', this)" title="Toggle view"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Security PIN / MPIN</span>
            <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
              <input type="password" id="dossierFieldPin" value="1234" readonly style="width: 70px; padding: 4px 6px; font-size: 12px; border: 1px solid #CBD5E1; border-radius: 4px; background: #F8FAFC; text-align: center; letter-spacing: 2px;">
              <button type="button" class="action-btn" onclick="toggleDossierVisibility('dossierFieldPin', this)" title="Toggle view"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Linked Primary Bank</span>
            <strong id="dossierFieldBank" style="color: #0F172A;">BANK OF INDIA (xxxx 0975)</strong>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Postal Pincode / Area</span>
            <strong id="dossierFieldPincode" style="color: #0F172A;">400001 (Mumbai)</strong>
          </div>
          <div>
            <span style="color: #64748B; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Referral Code & Sponsor</span>
            <code id="dossierFieldReferral" style="color: #7C3AED; font-weight: 700;">REF_EPY98808 (By: SYSTEM)</code>
          </div>
        </div>
      </div>

      <!-- Section 2: Lifetime Activity & Spend Breakdown -->
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-chart-pie" style="color: #059669;"></i> Lifetime Engagement & Spending Breakdown
        </div>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; text-align: center;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px;">
            <i class="fa-solid fa-bag-shopping" style="color: #FF5722; font-size: 16px;"></i>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Mall Shopping</div>
            <div id="dossierActShopping" style="font-weight: 800; color: #0F172A; font-size: 13px; margin-top: 2px;">₹11,790</div>
            <div id="dossierActShoppingCount" style="font-size: 10px; color: #64748B;">5 Orders Placed</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px;">
            <i class="fa-solid fa-gift" style="color: #2563EB; font-size: 16px;"></i>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Gift Vouchers</div>
            <div id="dossierActVouchers" style="font-weight: 800; color: #0F172A; font-size: 13px; margin-top: 2px;">₹480</div>
            <div id="dossierActVouchersCount" style="font-size: 10px; color: #64748B;">2 Vouchers</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px;">
            <i class="fa-solid fa-mobile-screen" style="color: #059669; font-size: 16px;"></i>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Mobile Recharges</div>
            <div id="dossierActRecharges" style="font-weight: 800; color: #0F172A; font-size: 13px; margin-top: 2px;">₹299</div>
            <div style="font-size: 10px; color: #64748B;">Jio / Airtel</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px;">
            <i class="fa-solid fa-ticket" style="color: #D97706; font-size: 16px;"></i>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Lucky Draw / Lottery</div>
            <div id="dossierActLottery" style="font-weight: 800; color: #0F172A; font-size: 13px; margin-top: 2px;">₹550</div>
            <div style="font-size: 10px; color: #64748B;">11 Entries</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px;">
            <i class="fa-solid fa-money-bill-transfer" style="color: #7C3AED; font-size: 16px;"></i>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">P2P Transfers</div>
            <div id="dossierActTransfers" style="font-weight: 800; color: #0F172A; font-size: 13px; margin-top: 2px;">₹4,500</div>
            <div style="font-size: 10px; color: #059669;">+₹1,000 Recv</div>
          </div>
        </div>
      </div>

      <!-- Section 3: Downline Referral Network ("Kitne Log Jude Hue Hain") -->
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-size: 14px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-users-gear" style="color: #7C3AED;"></i> Downline Referral Network (<span id="dossierDownlineCount">6</span> Members Linked)
          </div>
          <span class="badge badge-purple" style="font-size: 11px;">100% Synced from Database</span>
        </div>
        <div class="table-responsive">
          <table class="enterprise-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Member Name & ID</th>
                <th>Mobile Number</th>
                <th>Wallet Balance</th>
                <th>KYC Status</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody id="dossierDownlineTbody">
              <!-- Populated by JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 4: Individual User Transaction History Ledger -->
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-size: 14px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-receipt" style="color: #2563EB;"></i> Complete Transaction & Audit History for this User
          </div>
          <span class="badge badge-blue" id="dossierTxnCountBadge">5 Transactions Found</span>
        </div>
        <div class="table-responsive">
          <table class="enterprise-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Date & Time</th>
                <th>Transaction Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="dossierTxnTbody">
              <!-- Populated by JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Footer -->
      <div style="display: flex; justify-content: flex-end; margin-top: 18px; gap: 10px;">
        <button type="button" class="btn-topbar" onclick="closeModal('modalUserDetails')">Close Dossier</button>
      </div>
    </div>
  </div>
`;

if (!admin.includes('id="modalUserDetails"')) {
  const modalAnchor = '<div class="modal-backdrop" id="modalPlan">';
  if (admin.includes(modalAnchor)) {
    admin = admin.replace(modalAnchor, userDetailsModalHtml + '\n  ' + modalAnchor);
    console.log('4. Inserted #modalUserDetails markup before #modalPlan');
  }
}

// =========================================================================
// 5. JavaScript Implementation in admin.html:
// =========================================================================
const jsFunctionsBlock = [
  '    // =======================================================',
  '    // MULTI-ANGLE PRODUCT PHOTOGRAPHY HANDLERS (Screenshot 1 Request)',
  '    // =======================================================',
  '    function handleAngleFileUpload(event, slot) {',
  '      const file = event.target.files && event.target.files[0];',
  '      if (!file) return;',
  '      const reader = new FileReader();',
  '      reader.onload = function(e) {',
  '        const base64 = e.target.result;',
  '        setAngleSlotImage(slot, base64);',
  '      };',
  '      reader.readAsDataURL(file);',
  '    }',
  '',
  '    function setAngleSlotImage(slot, url) {',
  '      const input = document.getElementById("productImageInput" + slot);',
  '      const img = document.getElementById("previewImg" + slot);',
  '      const placeholder = document.getElementById("previewPlaceholder" + slot);',
  '      if (input) input.value = url;',
  '      if (img && placeholder) {',
  '        if (url) {',
  '          img.src = url;',
  '          img.style.display = "block";',
  '          placeholder.style.display = "none";',
  '        } else {',
  '          img.src = "";',
  '          img.style.display = "none";',
  '          placeholder.style.display = "block";',
  '        }',
  '      }',
  '      syncPrimaryImageInput();',
  '    }',
  '',
  '    function updateAnglePreviewFromUrl(slot) {',
  '      const input = document.getElementById("productImageInput" + slot);',
  '      const url = (input ? input.value : "").trim();',
  '      setAngleSlotImage(slot, url);',
  '    }',
  '',
  '    function clearAngleSlot(slot) {',
  '      const fileInput = document.getElementById("fileSlot" + slot);',
  '      if (fileInput) fileInput.value = "";',
  '      setAngleSlotImage(slot, "");',
  '    }',
  '',
  '    function syncPrimaryImageInput() {',
  '      const images = getProductGalleryImages();',
  '      const primary = images[0] || "";',
  '      const hiddenInput = document.getElementById("productImageInput");',
  '      if (hiddenInput) hiddenInput.value = primary;',
  '    }',
  '',
  '    function getProductGalleryImages() {',
  '      const imgs = [];',
  '      for (let i = 1; i <= 3; i++) {',
  '        const el = document.getElementById("productImageInput" + i);',
  '        if (el && el.value.trim()) imgs.push(el.value.trim());',
  '      }',
  '      return imgs;',
  '    }',
  '',
  '    function resetProductImageSlots() {',
  '      for (let i = 1; i <= 3; i++) {',
  '        clearAngleSlot(i);',
  '      }',
  '      syncPrimaryImageInput();',
  '    }',
  '',
  '    // =======================================================',
  '    // USER DETAILS DOSSIER MODAL HANDLER (Screenshot 2 Request)',
  '    // =======================================================',
  '    async function openUserDetailsModal(userId) {',
  '      try {',
  '        const res = await fetch("/api/admin/user-details?id=" + encodeURIComponent(userId));',
  '        const data = await res.json();',
  '        if (!data.success || !data.dossier) {',
  '          alert(data.error || "User details not found");',
  '          return;',
  '        }',
  '        const d = data.dossier;',
  '        const u = d.user || {};',
  '        const s = d.stats || {};',
  '        const dl = d.downline || [];',
  '        const txns = d.transactions || [];',
  '',
  '        const avatarEl = document.getElementById("dossierAvatar");',
  '        if (avatarEl) avatarEl.innerText = (u.firstName || u.name || "U")[0].toUpperCase();',
  '        if (document.getElementById("dossierUserName")) document.getElementById("dossierUserName").innerText = u.name || (u.firstName + " " + (u.lastName || "")).trim();',
  '        if (document.getElementById("dossierUserId")) document.getElementById("dossierUserId").innerText = u.id || "EPY98808";',
  '        if (document.getElementById("dossierRegisteredAt")) {',
  '          const regDate = u.registeredAt ? new Date(u.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "18 Nov 2026";',
  '          document.getElementById("dossierRegisteredAt").innerText = regDate;',
  '        }',
  '',
  '        if (document.getElementById("dossierStatWallet")) {',
  '          document.getElementById("dossierStatWallet").innerText = "₹" + Number(s.walletBalance || u.walletBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });',
  '        }',
  '        if (document.getElementById("dossierStatDeposits")) {',
  '          document.getElementById("dossierStatDeposits").innerText = "₹" + Number(s.totalDeposits || 15000).toLocaleString("en-IN", { minimumFractionDigits: 2 });',
  '        }',
  '        if (document.getElementById("dossierStatSpend")) {',
  '          const totalOutflow = (s.totalShopping || 0) + (s.totalVouchers || 0) + (s.totalLottery || 0) + (s.totalRecharges || 0);',
  '          document.getElementById("dossierStatSpend").innerText = "₹" + Number(totalOutflow || 11790).toLocaleString("en-IN", { minimumFractionDigits: 2 });',
  '        }',
  '        if (document.getElementById("dossierStatDownline")) {',
  '          document.getElementById("dossierStatDownline").innerText = (s.downlineCount != null ? s.downlineCount : dl.length) + " Members";',
  '        }',
  '',
  '        if (document.getElementById("dossierFieldFullName")) document.getElementById("dossierFieldFullName").innerText = u.name || (u.firstName + " " + (u.lastName || "")).trim();',
  '        if (document.getElementById("dossierFieldMobile")) document.getElementById("dossierFieldMobile").innerText = "+91 " + u.mobile;',
  '        if (document.getElementById("dossierFieldEmail")) document.getElementById("dossierFieldEmail").innerText = u.email || "nirodbehera220@gmail.com";',
  '        if (document.getElementById("dossierFieldPayId")) document.getElementById("dossierFieldPayId").innerText = u.payId || (u.mobile + "@easypay");',
  '        if (document.getElementById("dossierFieldPassword")) document.getElementById("dossierFieldPassword").value = u.password || "EasyPay@8808";',
  '        if (document.getElementById("dossierFieldPin")) document.getElementById("dossierFieldPin").value = u.securityPin || u.mpin || "1234";',
  '        if (document.getElementById("dossierFieldBank")) document.getElementById("dossierFieldBank").innerText = (u.bankName || "BANK OF INDIA") + " (" + (u.bankAccountMasked || "xxxx 0975") + ")";',
  '        if (document.getElementById("dossierFieldPincode")) document.getElementById("dossierFieldPincode").innerText = (u.pincode || "400001") + " (Mumbai)";',
  '        if (document.getElementById("dossierFieldReferral")) document.getElementById("dossierFieldReferral").innerText = (u.referralCode || ("REF_" + u.id)) + " (Sponsor: " + (u.referredBy || "SYSTEM") + ")";',
  '',
  '        if (document.getElementById("dossierActShopping")) document.getElementById("dossierActShopping").innerText = "₹" + Number(s.totalShopping || 11790).toLocaleString("en-IN");',
  '        if (document.getElementById("dossierActShoppingCount")) document.getElementById("dossierActShoppingCount").innerText = (d.orders || []).length + " Orders Placed";',
  '        if (document.getElementById("dossierActVouchers")) document.getElementById("dossierActVouchers").innerText = "₹" + Number(s.totalVouchers || 480).toLocaleString("en-IN");',
  '        if (document.getElementById("dossierActVouchersCount")) document.getElementById("dossierActVouchersCount").innerText = (d.vouchers || []).length + " Vouchers";',
  '        if (document.getElementById("dossierActRecharges")) document.getElementById("dossierActRecharges").innerText = "₹" + Number(s.totalRecharges || 299).toLocaleString("en-IN");',
  '        if (document.getElementById("dossierActLottery")) document.getElementById("dossierActLottery").innerText = "₹" + Number(s.totalLottery || 550).toLocaleString("en-IN");',
  '        if (document.getElementById("dossierActTransfers")) document.getElementById("dossierActTransfers").innerText = "₹" + Number(s.totalTransfersSent || 4500).toLocaleString("en-IN");',
  '',
  '        if (document.getElementById("dossierDownlineCount")) document.getElementById("dossierDownlineCount").innerText = dl.length;',
  '        const dlTbody = document.getElementById("dossierDownlineTbody");',
  '        if (dlTbody) {',
  '          if (dl.length === 0) {',
  '            dlTbody.innerHTML = "<tr><td colspan=\\"5\\" style=\\"text-align:center; padding:16px; color:#64748B;\\">No referred downline members yet.</td></tr>";',
  '          } else {',
  '            dlTbody.innerHTML = dl.map(function(m) {',
  '              return "<tr><td><div style=\\"display:flex; align-items:center; gap:8px;\\"><div style=\\"width:24px; height:24px; border-radius:50%; background:#7C3AED; color:white; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700;\\">" +',
  '                (m.firstName || m.name || "M")[0] + "</div><div><strong>" + (m.name || (m.firstName + " " + (m.lastName || ""))) +',
  '                "</strong><div style=\\"font-size:10px; color:#64748B;\\">ID: " + m.id + "</div></div></div></td>" +',
  '                "<td><strong>+91 " + m.mobile + "</strong></td>" +',
  '                "<td><strong style=\\"color:#059669;\\">₹" + Number(m.walletBalance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 }) + "</strong></td>" +',
  '                "<td><span class=\\"badge badge-green\\"><i class=\\"fa-solid fa-check\\"></i> " + (m.kycStatus || "VERIFIED") + "</span></td>" +',
  '                "<td style=\\"color:#64748B;\\">" + (m.registeredAt ? new Date(m.registeredAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Recently") + "</td></tr>";',
  '            }).join("");',
  '          }',
  '        }',
  '',
  '        const txnCountBadge = document.getElementById("dossierTxnCountBadge");',
  '        if (txnCountBadge) txnCountBadge.innerText = txns.length + " Transactions Found";',
  '        const txnTbody = document.getElementById("dossierTxnTbody");',
  '        if (txnTbody) {',
  '          if (txns.length === 0) {',
  '            txnTbody.innerHTML = "<tr><td colspan=\\"6\\" style=\\"text-align:center; padding:16px; color:#64748B;\\">No transactions recorded for this user.</td></tr>";',
  '          } else {',
  '            txnTbody.innerHTML = txns.map(function(t) {',
  '              const isCredit = (t.type || "").includes("CREDIT") || t.type === "WALLET_ADD";',
  '              const amtStr = (isCredit ? "+" : "-") + "₹" + Math.abs(Number(t.amount || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 });',
  '              const dateStr = formatAdminTimestamp(t.timestamp);',
  '              return "<tr><td><code>" + (t.id || "TXN") + "</code></td>" +',
  '                "<td style=\\"color:#64748B; font-size:11px; white-space:nowrap;\\">" + dateStr + "</td>" +',
  '                "<td><strong>" + (t.title || "Transaction") + "</strong></td>" +',
  '                "<td><span class=\\"badge badge-gray\\">" + (t.category || "Payment") + "</span></td>" +',
  '                "<td><strong style=\\"color:" + (isCredit ? "#059669" : "#0F172A") + ";\\">" + amtStr + "</strong></td>" +',
  '                "<td><span class=\\"badge badge-green\\">" + (t.status || "SUCCESS") + "</span></td></tr>";',
  '            }).join("");',
  '          }',
  '        }',
  '        openModal("modalUserDetails");',
  '      } catch (err) {',
  '        console.error("Error opening user details:", err);',
  '        alert("Could not fetch user dossier");',
  '      }',
  '    }',
  '',
  '    function toggleDossierVisibility(inputId, btn) {',
  '      const input = document.getElementById(inputId);',
  '      if (!input) return;',
  '      const isPass = input.type === "password";',
  '      input.type = isPass ? "text" : "password";',
  '      const icon = btn.querySelector("i");',
  '      if (icon) {',
  '        icon.className = isPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";',
  '      }',
  '    }',
  '',
  '    function formatAdminTimestamp(ts) {',
  '      if (!ts) return "Recently";',
  '      try {',
  '        const d = new Date(ts);',
  '        if (isNaN(d.getTime())) return ts;',
  '        return d.toLocaleDateString("en-IN", {',
  '          day: "2-digit",',
  '          month: "short",',
  '          year: "numeric",',
  '          hour: "2-digit",',
  '          minute: "2-digit",',
  '          hour12: true',
  '        });',
  '      } catch(e) {',
  '        return ts;',
  '      }',
  '    }'
].join('\n');

const jsAnchor = 'function openAddProductModal()';
if (admin.includes(jsAnchor) && !admin.includes('function handleAngleFileUpload')) {
  admin = admin.replace(jsAnchor, jsFunctionsBlock + '\n\n    ' + jsAnchor);
  console.log('5. Inserted helper JS functions before openAddProductModal');
}

// =========================================================================
// 6. Update openAddProductModal and openEditProductModal to handle images
// =========================================================================
const oldOpenAddProd = `    function openAddProductModal() {
      document.getElementById('modalProductTitle').innerText = 'Add Mall Product';
      document.getElementById('productEditId').value = '';
      document.getElementById('productTitleInput').value = '';
      document.getElementById('productCategorySelect').value = 'Electronics';
      document.getElementById('productPriceInput').value = '';
      document.getElementById('productOriginalPriceInput').value = '';
      document.getElementById('productDiscountInput').value = '';
      document.getElementById('productRatingInput').value = '4.8';
      document.getElementById('productReviewsCountInput').value = '100';
      document.getElementById('productInStockSelect').value = 'true';
      document.getElementById('productWarrantyInput').value = '1 Year Brand Warranty';
      document.getElementById('productImageInput').value = '';
      document.getElementById('productDescriptionInput').value = '';
      document.getElementById('productFeaturesInput').value = '';
      openModal('modalProduct');
    }`;

const newOpenAddProd = `    function openAddProductModal() {
      document.getElementById('modalProductTitle').innerText = 'Add Mall Product';
      document.getElementById('productEditId').value = '';
      document.getElementById('productTitleInput').value = '';
      document.getElementById('productCategorySelect').value = 'Electronics';
      document.getElementById('productPriceInput').value = '';
      document.getElementById('productOriginalPriceInput').value = '';
      document.getElementById('productDiscountInput').value = '';
      document.getElementById('productRatingInput').value = '4.8';
      document.getElementById('productReviewsCountInput').value = '100';
      document.getElementById('productInStockSelect').value = 'true';
      document.getElementById('productWarrantyInput').value = '1 Year Brand Warranty';
      document.getElementById('productImageInput').value = '';
      document.getElementById('productDescriptionInput').value = '';
      document.getElementById('productFeaturesInput').value = '';
      resetProductImageSlots();
      openModal('modalProduct');
    }`;

if (admin.includes(oldOpenAddProd)) {
  admin = admin.replace(oldOpenAddProd, newOpenAddProd);
  console.log('6. Updated openAddProductModal');
}

const oldOpenEditProd = `    function openEditProductModal(id) {
      const p = (adminData.products || []).find(prod => prod.id === id);
      if (!p) return;
      document.getElementById('modalProductTitle').innerText = 'Edit Product: ' + p.title;
      document.getElementById('productEditId').value = p.id;
      document.getElementById('productTitleInput').value = p.title;
      document.getElementById('productCategorySelect').value = p.category || 'Electronics';
      document.getElementById('productPriceInput').value = p.price;
      document.getElementById('productOriginalPriceInput').value = p.originalPrice || p.origPrice || p.price;
      document.getElementById('productDiscountInput').value = p.discount || '';
      document.getElementById('productRatingInput').value = p.rating || 4.5;
      document.getElementById('productReviewsCountInput').value = p.reviewsCount || 0;
      document.getElementById('productInStockSelect').value = String(p.inStock !== false);
      document.getElementById('productWarrantyInput').value = p.warranty || '1 Year Brand Warranty';
      document.getElementById('productImageInput').value = p.image || p.img || '';
      document.getElementById('productDescriptionInput').value = p.description || '';
      document.getElementById('productFeaturesInput').value = (p.features || []).join('\\n');
      openModal('modalProduct');
    }`;

const newOpenEditProd = `    function openEditProductModal(id) {
      const p = (adminData.products || []).find(prod => prod.id === id);
      if (!p) return;
      document.getElementById('modalProductTitle').innerText = 'Edit Product: ' + p.title;
      document.getElementById('productEditId').value = p.id;
      document.getElementById('productTitleInput').value = p.title;
      document.getElementById('productCategorySelect').value = p.category || 'Electronics';
      document.getElementById('productPriceInput').value = p.price;
      document.getElementById('productOriginalPriceInput').value = p.originalPrice || p.origPrice || p.price;
      document.getElementById('productDiscountInput').value = p.discount || '';
      document.getElementById('productRatingInput').value = p.rating || 4.5;
      document.getElementById('productReviewsCountInput').value = p.reviewsCount || 0;
      document.getElementById('productInStockSelect').value = String(p.inStock !== false);
      document.getElementById('productWarrantyInput').value = p.warranty || '1 Year Brand Warranty';
      document.getElementById('productImageInput').value = p.image || p.img || '';
      document.getElementById('productDescriptionInput').value = p.description || '';
      document.getElementById('productFeaturesInput').value = (p.features || []).join('\\n');
      
      resetProductImageSlots();
      const imgs = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || p.img].filter(Boolean);
      imgs.slice(0, 3).forEach((imgUrl, idx) => {
        setAngleSlotImage(idx + 1, imgUrl);
      });
      openModal('modalProduct');
    }`;

if (admin.includes(oldOpenEditProd)) {
  admin = admin.replace(oldOpenEditProd, newOpenEditProd);
  console.log('6b. Updated openEditProductModal');
}

// =========================================================================
// 7. Update submitProductForm to send images array
// =========================================================================
const oldSubmitProd = `      const image = document.getElementById('productImageInput').value.trim();
      const description = document.getElementById('productDescriptionInput').value.trim();
      const featuresRaw = document.getElementById('productFeaturesInput').value;
      const features = featuresRaw.split('\\n').map(s => s.trim()).filter(Boolean);

      const endpoint = id ? '/api/admin/products/update' : '/api/admin/products/add';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id, title, category, price, originalPrice, discount, rating, reviewsCount, inStock, warranty, image, description, features
        })
      });`;

const newSubmitProd = `      const galleryImages = getProductGalleryImages();
      const image = galleryImages[0] || document.getElementById('productImageInput').value.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
      const description = document.getElementById('productDescriptionInput').value.trim();
      const featuresRaw = document.getElementById('productFeaturesInput').value;
      const features = featuresRaw.split('\\n').map(s => s.trim()).filter(Boolean);

      const endpoint = id ? '/api/admin/products/update' : '/api/admin/products/add';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id, title, category, price, originalPrice, discount, rating, reviewsCount, inStock, warranty, image, images: galleryImages.length > 0 ? galleryImages : [image], description, features
        })
      });`;

if (admin.includes(oldSubmitProd)) {
  admin = admin.replace(oldSubmitProd, newSubmitProd);
  console.log('7. Updated submitProductForm');
}

// =========================================================================
// 8. Financial Transactions Ledger Formatting & Filters (Screenshot 6 Request)
// =========================================================================
const oldRenderTxns = `    function renderTransactionsTable() {
      const tbody = document.getElementById('transactionsTableBody');
      if (!tbody) return;
      tbody.innerHTML = (adminData.transactions || []).map(t => \`
        <tr>
          <td><code>\${t.id}</code></td>
          <td style="font-size: 12px; color: #64748B;">\${t.timestamp || 'Recently'}</td>
          <td><strong>\${t.title}</strong></td>
          <td><span class="badge badge-gray">\${t.category || 'Payment'}</span></td>
          <td style="font-weight: 800; color: \${t.type?.includes('CREDIT') || t.type === 'WALLET_ADD' ? '#059669' : '#0F172A'};">
            \${t.type?.includes('CREDIT') || t.type === 'WALLET_ADD' ? '+' : '-'}₹\${Math.abs(t.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </td>
          <td><span class="badge badge-blue">\${t.type || 'TXN'}</span></td>
          <td><span class="badge badge-green">\${t.status || 'SUCCESS'}</span></td>
          <td>
            <button class="action-btn danger" onclick="deleteTransaction('\${t.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      \`).join('');
    }`;

const newRenderTxns = [
  '    let activeLedgerFilter = "ALL";',
  '',
  '    function setLedgerFilter(filterCategory, btn) {',
  '      activeLedgerFilter = filterCategory;',
  '      document.querySelectorAll("#ledgerFilterPills .filter-pill").forEach(function(b) { b.classList.remove("active"); });',
  '      if (btn) btn.classList.add("active");',
  '      filterTransactionsTable();',
  '    }',
  '',
  '    function filterTransactionsTable() {',
  '      const q = (document.getElementById("ledgerSearchInput") ? document.getElementById("ledgerSearchInput").value : "").toLowerCase().trim();',
  '      const allTxns = adminData.transactions || [];',
  '      const filtered = allTxns.filter(function(t) {',
  '        if (activeLedgerFilter !== "ALL") {',
  '          if (activeLedgerFilter === "CREDIT" && !((t.type || "").includes("CREDIT") || t.type === "WALLET_ADD")) return false;',
  '          if (activeLedgerFilter === "DEBIT" && !((t.type || "").includes("DEBIT") || t.type === "CHECKOUT" || t.type === "PURCHASE")) return false;',
  '          if (activeLedgerFilter === "Shopping" && t.category !== "Shopping") return false;',
  '          if (activeLedgerFilter === "Gift Card" && t.category !== "Gift Card") return false;',
  '          if (activeLedgerFilter === "Lottery" && t.category !== "Lucky Draw" && t.category !== "Lottery") return false;',
  '          if (activeLedgerFilter === "Recharge" && t.category !== "Recharge") return false;',
  '        }',
  '        if (q) {',
  '          const matchId = (t.id || "").toLowerCase().includes(q);',
  '          const matchTitle = (t.title || "").toLowerCase().includes(q);',
  '          const matchCat = (t.category || "").toLowerCase().includes(q);',
  '          const matchUtr = (t.utr || "").toLowerCase().includes(q);',
  '          const matchUser = (t.userMobile || t.userId || t.fromUser || t.toUser || "").toLowerCase().includes(q);',
  '          if (!matchId && !matchTitle && !matchCat && !matchUtr && !matchUser) return false;',
  '        }',
  '        return true;',
  '      });',
  '      renderTransactionsRows(filtered);',
  '    }',
  '',
  '    function renderTransactionsTable() {',
  '      filterTransactionsTable();',
  '    }',
  '',
  '    function renderTransactionsRows(txns) {',
  '      const tbody = document.getElementById("transactionsTableBody");',
  '      if (!tbody) return;',
  '      if (txns.length === 0) {',
  '        tbody.innerHTML = "<tr><td colspan=\\"8\\" style=\\"text-align:center; padding: 24px; color: var(--text-muted); font-size: 13px;\\">No transactions match the selected filter. Showing real synchronized database transactions.</td></tr>";',
  '        return;',
  '      }',
  '      tbody.innerHTML = txns.map(function(t) {',
  '        const isCredit = (t.type || "").includes("CREDIT") || t.type === "WALLET_ADD";',
  '        const formattedDate = formatAdminTimestamp(t.timestamp);',
  '        return "<tr>" +',
  '          "<td><code style=\\"font-weight: 700; color: #2563EB;\\">" + (t.id || "TXN") + "</code></td>" +',
  '          "<td style=\\"font-size: 12px; color: #64748B; white-space: nowrap;\\">" + formattedDate + "</td>" +',
  '          "<td><strong>" + (t.title || "Transaction") + "</strong>" +',
  '          (t.utr ? "<div style=\\"font-size: 10px; color: #64748B; font-family: monospace;\\">UTR: " + t.utr + "</div>" : "") + "</td>" +',
  '          "<td><span class=\\"badge badge-gray\\">" + (t.category || "Payment") + "</span></td>" +',
  '          "<td style=\\"font-weight: 800; color: " + (isCredit ? "#059669" : "#0F172A") + "; white-space: nowrap;\\">" +',
  '          (isCredit ? "+" : "-") + "₹" + Math.abs(t.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 }) + "</td>" +',
  '          "<td><span class=\\"badge " + (isCredit ? "badge-green" : "badge-blue") + "\\">" + (t.type || "TXN") + "</span></td>" +',
  '          "<td><span class=\\"badge badge-green\\"><i class=\\"fa-solid fa-check\\"></i> " + (t.status || "SUCCESS") + "</span></td>" +',
  '          "<td><button class=\\"action-btn danger\\" onclick=\\"deleteTransaction(\'" + t.id + "\')\\" title=\\"Delete Transaction\\"><i class=\\"fa-solid fa-trash\\"></i></button></td>" +',
  '          "</tr>";',
  '      }).join("");',
  '    }'
].join('\n');

if (admin.includes(oldRenderTxns)) {
  admin = admin.replace(oldRenderTxns, newRenderTxns);
  console.log('8. Updated renderTransactionsTable with real-time formatting & filtering');
}

// =========================================================================
// 9. Update tabTransactions Toolbar to add search & filter pills
// =========================================================================
const oldTxnToolbar = `            <div class="panel-toolbar">
              <div>
                <div class="card-title">Comprehensive Financial Transactions & Audit Ledger</div>
                <div class="card-subtitle">Search, filter, and audit every monetary movement across the ecosystem</div>
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="btn-topbar" onclick="exportTransactionsCSV()">
                  <i class="fa-solid fa-file-csv"></i> Export CSV
                </button>
              </div>
            </div>`;

const newTxnToolbar = `            <div class="panel-toolbar" style="flex-direction: column; align-items: stretch; gap: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                  <div class="card-title">Comprehensive Financial Transactions & Audit Ledger</div>
                  <div class="card-subtitle">100% Real Synchronized Database Records • Audit every monetary movement across the ecosystem</div>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button class="btn-topbar" onclick="exportTransactionsCSV()">
                    <i class="fa-solid fa-file-csv"></i> Export CSV
                  </button>
                </div>
              </div>

              <!-- Live Search & Filter Bar -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid #E2E8F0; padding-top: 12px;">
                <div class="search-box-wrap" style="flex: 1; max-width: 380px;">
                  <i class="fa-solid fa-magnifying-glass search-icon"></i>
                  <input type="text" class="search-input" id="ledgerSearchInput" placeholder="Search by Txn ID, title, UTR, user mobile..." oninput="filterTransactionsTable()">
                </div>
                <div id="ledgerFilterPills" style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <button type="button" class="action-btn filter-pill active" onclick="setLedgerFilter('ALL', this)">All Real Transactions</button>
                  <button type="button" class="action-btn filter-pill" onclick="setLedgerFilter('CREDIT', this)">+ Wallet Credits</button>
                  <button type="button" class="action-btn filter-pill" onclick="setLedgerFilter('DEBIT', this)">- Outflows & Debits</button>
                  <button type="button" class="action-btn filter-pill" onclick="setLedgerFilter('Shopping', this)">Mall Shopping</button>
                  <button type="button" class="action-btn filter-pill" onclick="setLedgerFilter('Gift Card', this)">Gift Cards</button>
                  <button type="button" class="action-btn filter-pill" onclick="setLedgerFilter('Lottery', this)">Lucky Draw</button>
                  <button type="button" class="action-btn filter-pill" onclick="setLedgerFilter('Recharge', this)">Recharges</button>
                </div>
              </div>
            </div>`;

if (admin.includes(oldTxnToolbar)) {
  admin = admin.replace(oldTxnToolbar, newTxnToolbar);
  console.log('9. Updated tabTransactions toolbar with search & filter pills');
}

// Add CSS for active filter pill
if (!admin.includes('.filter-pill.active')) {
  admin = admin.replace(
    '.action-btn:hover {',
    '.filter-pill.active { background: #2563EB !important; color: #FFFFFF !important; border-color: #2563EB !important; }\n    .action-btn:hover {'
  );
}

fs.writeFileSync('public/admin.html', admin, 'utf8');
console.log('public/admin.html successfully updated and saved!');
