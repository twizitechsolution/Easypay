const fs = require('fs');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

// =========================================================================
// 1. Redesigned Add Funds Modal (Screenshot 4 Request)
// =========================================================================
const oldAddMoneyModal = `  <!-- Add Money Modal -->
  <div class="modal-overlay" id="addMoneyModal">
    <div class="modal-sheet">
      <div class="modal-header">
        <div class="modal-title">Add Money to Wallet</div>
        <button class="btn-close-modal" onclick="closeModal('addMoneyModal')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="form-group">
        <label class="form-label">Amount (₹)</label>
        <input type="number" class="form-input" id="addMoneyAmountInput" value="1000">
      </div>
      <button class="btn-primary-action" style="max-width: 100%;" onclick="submitAddMoney()">
        Add Money via UPI
      </button>
    </div>
  </div>`;

const newAddFundsModal = `  <!-- =======================================================
       REDESIGNED ADD FUNDS MODAL (Screenshot 4 Request)
       Presets, 4 Payment Methods (UPI, Bank, Cash, USDT) & Proof Submission
       ======================================================= -->
  <div class="modal-overlay" id="addMoneyModal" style="z-index: 10005; align-items: flex-end;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 20px 18px 30px; max-height: 92vh; overflow-y: auto; background: #FAF9FE;">
      <!-- Top Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="closeModal('addMoneyModal')">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #EDE9FE; color: #6D28D9; display: flex; align-items: center; justify-content: center; font-size: 16px;">
            <i class="fa-solid fa-angle-left"></i>
          </div>
          <span style="font-size: 18px; font-weight: 800; color: #1E1B4B;">Add Funds</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #EDE9FE; color: #6D28D9; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Instant Auto-Credit Rail">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <div style="width: 36px; height: 36px; border-radius: 50%; background: #EDE9FE; color: #6D28D9; display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="openPassbookFromProfile()" title="Transaction History">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </div>
        </div>
      </div>

      <!-- Amount Input Card -->
      <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 18px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <label style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Enter Deposit Amount</label>
        <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0 14px;">
          <span style="font-size: 28px; font-weight: 900; color: #6D28D9;">₹</span>
          <input type="number" id="addFundsAmountInput" value="1000" min="100" step="100" style="font-size: 28px; font-weight: 900; color: #1E1B4B; border: none; outline: none; width: 100%; background: transparent;" oninput="updateAddFundsQrDynamic()">
        </div>

        <!-- Quick Presets Row (Screenshot 4) -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;" id="addFundsPresetChips">
          <button type="button" class="btn-preset active" onclick="setAddFundsAmount(1000, this)" style="padding: 8px; border-radius: 10px; border: 1.5px solid #6D28D9; background: #F5F3FF; font-weight: 800; font-size: 12px; color: #6D28D9; cursor: pointer;">₹1,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(2000, this)" style="padding: 8px; border-radius: 10px; border: 1.5px solid #CBD5E1; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹2,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(5000, this)" style="padding: 8px; border-radius: 10px; border: 1.5px solid #CBD5E1; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹5,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(10000, this)" style="padding: 8px; border-radius: 10px; border: 1.5px solid #CBD5E1; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹10,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(50000, this)" style="padding: 8px; border-radius: 10px; border: 1.5px solid #CBD5E1; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹50,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(100000, this)" style="padding: 8px; border-radius: 10px; border: 1.5px solid #CBD5E1; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹1,00,000</button>
        </div>
      </div>

      <!-- SELECT PAYMENT METHOD Title -->
      <div style="font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        <span style="width: 18px; height: 18px; border-radius: 50%; background: #FF5722; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900;">1</span>
        SELECT PAYMENT METHOD
      </div>

      <!-- 4 Payment Method Cards Grid (Screenshot 4) -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px;">
        <!-- Card 1: Instant UPI -->
        <div class="deposit-method-card active" id="depMethodCard_upi" onclick="selectDepositMethod('upi')" style="background: #FFFFFF; border: 2px solid #6D28D9; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; position: relative; transition: all 0.2s;">
          <div style="position: absolute; top: -7px; left: 50%; transform: translateX(-50%); background: #FF5722; color: white; font-size: 8px; font-weight: 900; padding: 1px 6px; border-radius: 999px; letter-spacing: 0.5px;">POPULAR</div>
          <div style="font-size: 20px; color: #6D28D9; margin: 4px 0 2px;"><i class="fa-solid fa-bolt"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #1E1B4B; line-height: 1.2;">Instant UPI</div>
          <div style="font-size: 9px; color: #059669; font-weight: 700;">Auto Credit ⚡</div>
        </div>

        <!-- Card 2: Bank Transfer -->
        <div class="deposit-method-card" id="depMethodCard_bank" onclick="selectDepositMethod('bank')" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
          <div style="font-size: 20px; color: #2563EB; margin: 4px 0 2px;"><i class="fa-solid fa-building-columns"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #1E1B4B; line-height: 1.2;">Bank</div>
          <div style="font-size: 9px; color: #64748B;">IMPS / NEFT</div>
        </div>

        <!-- Card 3: UPI / QR Details -->
        <div class="deposit-method-card" id="depMethodCard_qr" onclick="selectDepositMethod('qr')" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
          <div style="font-size: 20px; color: #FF5722; margin: 4px 0 2px;"><i class="fa-solid fa-qrcode"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #1E1B4B; line-height: 1.2;">UPI / QR</div>
          <div style="font-size: 9px; color: #64748B;">Scan & Pay</div>
        </div>

        <!-- Card 4: USDT Crypto -->
        <div class="deposit-method-card" id="depMethodCard_usdt" onclick="selectDepositMethod('usdt')" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
          <div style="font-size: 20px; color: #097939; margin: 4px 0 2px;"><i class="fa-brands fa-ethereum"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #1E1B4B; line-height: 1.2;">USDT</div>
          <div style="font-size: 9px; color: #097939; font-weight: 700;">TRC-20</div>
        </div>
      </div>

      <!-- Dynamic Payment Details Box (Screenshot 4) -->
      <div id="depositMethodContentWrap" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 18px; margin-bottom: 16px;">
        <!-- UPI Details Panel -->
        <div id="depPanel_upi">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <div style="font-size: 14px; font-weight: 800; color: #1E1B4B;" id="depUpiTitle">UPI / QR Details</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
                Account Holder: <strong id="depUpiHolder" style="color: #1E1B4B;">Lucifer Finer Solutions Private Limited</strong>
              </div>
            </div>
            <span class="badge badge-purple" style="font-size: 10px;">Admin Verified</span>
          </div>

          <div style="background: #F8FAFC; border: 1px dashed #CBD5E1; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <div>
              <span style="font-size: 10px; color: #64748B; text-transform: uppercase; font-weight: 700; display: block;">UPI ID</span>
              <code id="depUpiIdText" style="font-size: 14px; font-weight: 800; color: #6D28D9;">yourbachatpay@kotak</code>
            </div>
            <button type="button" class="action-btn" onclick="copyTextToClipboard(document.getElementById('depUpiIdText').innerText)" style="padding: 6px 12px; font-size: 11px;">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>

          <!-- Dynamic QR Code Card -->
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 16px; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 10px;">
              <i class="fa-solid fa-qrcode"></i> Scan this QR with GPay, PhonePe or Paytm to pay
            </div>
            <div style="display: inline-block; background: white; padding: 10px; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              <img id="depDynamicQrImg" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi%3A%2F%2Fpay%3Fpa%3Dyourbachatpay%40kotak%26pn%3DLucifer%2520Finer%2520Solutions%26am%3D1000%26cu%3DINR" style="width: 170px; height: 170px; object-fit: contain; display: block;" alt="UPI QR">
            </div>
            <div style="margin-top: 8px; font-size: 12px; font-weight: 800; color: #0F172A;" id="depQrAmountLabel">
              Paying Amount: <span style="color:#059669;">₹1,000</span>
            </div>
            <div style="font-size: 10px; color: #64748B; font-family: monospace; margin-top: 2px;">TID: 68359529</div>
          </div>
        </div>

        <!-- Bank Transfer Details Panel -->
        <div id="depPanel_bank" style="display: none;">
          <div style="font-size: 14px; font-weight: 800; color: #1E1B4B; margin-bottom: 10px;">Bank Account Transfer Details</div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">Bank Name:</span>
              <strong id="depBankName">Kotak Mahindra Bank</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">Account Holder:</span>
              <strong id="depBankHolder">Lucifer Finer Solutions Private Limited</strong>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">Account Number:</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <code id="depBankAccountNo" style="font-size:14px; font-weight:800; color:#2563EB;">983420192841</code>
                <button type="button" class="action-btn" onclick="copyTextToClipboard(document.getElementById('depBankAccountNo').innerText)"><i class="fa-regular fa-copy"></i></button>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">IFSC Code:</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <code id="depBankIfsc" style="font-size:14px; font-weight:800; color:#2563EB;">KKBK0000958</code>
                <button type="button" class="action-btn" onclick="copyTextToClipboard(document.getElementById('depBankIfsc').innerText)"><i class="fa-regular fa-copy"></i></button>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; padding:8px 0;">
              <span style="color:#64748B;">Branch:</span>
              <span id="depBankBranch">Nariman Point, Mumbai</span>
            </div>
          </div>
        </div>

        <!-- USDT Crypto Details Panel -->
        <div id="depPanel_usdt" style="display: none;">
          <div style="font-size: 14px; font-weight: 800; color: #1E1B4B; margin-bottom: 10px;">USDT (Tether) Deposit</div>
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 11px; color: #64748B; font-weight: 700;">USDT TRC-20 Address (Tron Network)</div>
            <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin: 8px 0;">
              <code id="depUsdtAddress" style="font-size: 12px; font-weight: 800; color: #097939; word-break: break-all;">TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL</code>
              <button type="button" class="action-btn" onclick="copyTextToClipboard(document.getElementById('depUsdtAddress').innerText)"><i class="fa-regular fa-copy"></i></button>
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #0F172A;" id="depUsdtEquivalent">
              Equivalent Amount: <span style="color:#097939;">~$10.81 USDT</span> (Rate: ₹92.50)
            </div>
          </div>
        </div>

        <!-- Settlement Note -->
        <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 10px 12px; display: flex; align-items: flex-start; gap: 8px; font-size: 11px; color: #92400E;">
          <i class="fa-solid fa-circle-info" style="color: #D97706; font-size: 14px; margin-top: 1px;"></i>
          <span><strong>Note:</strong> Payment verification & wallet settlement takes 5-30 minutes upon admin verification. Submit transaction UTR below.</span>
        </div>
      </div>

      <!-- Transaction Verification & Proof Submission (Mandatory) -->
      <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 18px; margin-bottom: 18px;">
        <div style="font-size: 13px; font-weight: 800; color: #1E1B4B; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
          <span style="width: 18px; height: 18px; border-radius: 50%; background: #6D28D9; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900;">2</span>
          SUBMIT PAYMENT PROOF
        </div>

        <!-- UTR / Ref Number -->
        <div style="margin-bottom: 14px;">
          <label style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 4px;">
            12-Digit UTR / Transaction Reference Number <span style="color:#DC2626;">*</span>
          </label>
          <input type="text" id="depProofUtrInput" placeholder="e.g. 983749281726 or TxID" style="width: 100%; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 10px 12px; font-size: 14px; font-weight: 700; color: #0F172A; outline: none; font-family: monospace;">
        </div>

        <!-- Upload Screenshot Proof -->
        <div style="margin-bottom: 14px;">
          <label style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 4px;">
            Upload Payment Receipt / Screenshot
          </label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="file" id="depProofFileInput" accept="image/*" style="display: none;" onchange="handleDepositProofUpload(event)">
            <button type="button" class="btn-topbar" onclick="document.getElementById('depProofFileInput').click()" style="padding: 8px 12px; font-size: 12px;">
              <i class="fa-solid fa-cloud-arrow-up"></i> Choose Screenshot
            </button>
            <span id="depProofFileName" style="font-size: 11px; color: #64748B; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">No file chosen</span>
            <button type="button" class="action-btn danger" id="depProofClearBtn" style="display: none;" onclick="clearDepositProof()">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div id="depProofPreviewWrap" style="display: none; margin-top: 10px; width: 100%; height: 120px; border-radius: 10px; border: 1px solid #CBD5E1; overflow: hidden; background: #F8FAFC;">
            <img id="depProofPreviewImg" src="" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
        </div>

        <!-- Submit Button -->
        <button type="button" class="btn-primary-action" style="max-width: 100%; width: 100%; justify-content: center; background: linear-gradient(135deg, #6D28D9, #4F46E5); box-shadow: 0 4px 14px rgba(109,40,217,0.35);" onclick="submitDepositRequestFlow()">
          <i class="fa-solid fa-circle-check"></i> Submit Deposit Request
        </button>
      </div>
    </div>
  </div>`;

if (app.includes(oldAddMoneyModal)) {
  app = app.replace(oldAddMoneyModal, newAddFundsModal);
  console.log('1. Successfully replaced addMoneyModal with full Add Funds view matching Screenshot 4');
}

// =========================================================================
// 2. Add "Bachat Pay Secure Access" App Lock Screen (Screenshot 5)
// =========================================================================
const secureAccessScreenHtml = `
  <!-- =======================================================
       BACHAT PAY SECURE ACCESS APP LOCK SCREEN (Screenshot 5 Request)
       ======================================================= -->
  <div id="viewSecureAccess" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(180deg, #3A0C6B 0%, #681FA8 60%, #4A0E80 100%); z-index: 999999; display: none; flex-direction: column; justify-content: space-between; padding: 24px 20px 28px; font-family: var(--font-body); color: #FFFFFF; max-width: 480px; left: 50%; transform: translateX(-50%); box-sizing: border-box; overflow-y: auto;">
    
    <!-- Top Header Bar -->
    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
      <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="dismissSecureAccessIfPossible()">
        <i class="fa-solid fa-angle-left" style="font-size: 18px;"></i>
      </div>
      <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; letter-spacing: 0.3px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #00E676; box-shadow: 0 0 8px #00E676;"></span>
        Bachat Pay Secure Access
      </div>
      <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="showToast('Secure PIN protects your Bachat Pay wallet & transactions.')">
        <i class="fa-solid fa-question" style="font-size: 16px;"></i>
      </div>
    </div>

    <!-- Center Profile Section (Screenshot 5) -->
    <div style="text-align: center; margin-top: 10px;">
      <!-- Avatar with Orange Ring & Green Checkmark -->
      <div style="width: 84px; height: 84px; border-radius: 50%; border: 3px solid #FF6E40; margin: 0 auto 12px; position: relative; display: flex; align-items: center; justify-content: center; background: #FF6E40; color: white; font-size: 32px; font-weight: 800; box-shadow: 0 4px 18px rgba(0,0,0,0.25); overflow: visible;">
        <span id="lockScreenAvatarInitials">NB</span>
        <img id="lockScreenAvatarImg" src="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: none;" alt="User Photo">
        <div style="position: absolute; bottom: 0; right: 0; width: 24px; height: 24px; border-radius: 50%; background: #00E676; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">
          <i class="fa-solid fa-check"></i>
        </div>
      </div>

      <!-- User Name & Verified Icon -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 20px; font-weight: 800;">
        <span id="lockScreenUserName">Nirod Behera</span>
        <i class="fa-solid fa-circle-check" style="color: #00E676; font-size: 16px;"></i>
      </div>
      <div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 2px;" id="lockScreenUserPhone">+91 9876548808</div>
    </div>

    <!-- 3 Access Method Segmented Tabs (Screenshot 5) -->
    <div style="background: rgba(255,255,255,0.12); border-radius: 999px; padding: 4px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin: 18px 0;">
      <button type="button" class="lock-tab-btn active" id="lockTab_mpin" onclick="switchLockMethod('mpin')" style="border-radius: 999px; padding: 8px 12px; border: 1.5px solid #FF6E40; background: rgba(255,110,64,0.3); color: white; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
        <i class="fa-solid fa-key"></i> MPIN
      </button>
      <button type="button" class="lock-tab-btn" id="lockTab_face" onclick="switchLockMethod('face')" style="border-radius: 999px; padding: 8px 12px; border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
        <i class="fa-regular fa-face-smile"></i> Face ID
      </button>
      <button type="button" class="lock-tab-btn" id="lockTab_pass" onclick="switchLockMethod('pass')" style="border-radius: 999px; padding: 8px 12px; border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
        <i class="fa-solid fa-lock"></i> Password
      </button>
    </div>

    <!-- Content Mode 1: 4-Digit MPIN Keypad (Screenshot 5) -->
    <div id="lockMode_mpin">
      <div style="text-align: center; margin-bottom: 14px;">
        <div style="font-size: 16px; font-weight: 800;">Enter 4-Digit Bachat MPIN</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 2px;">Secure Access to your Bachat Pay account</div>
      </div>

      <!-- 4 PIN Entry Boxes -->
      <div style="display: flex; justify-content: center; gap: 14px; margin-bottom: 20px;">
        <div class="lock-pin-box active" id="lockPinDigit_1" style="width: 52px; height: 52px; border-radius: 12px; border: 2px solid #FF6E40; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
        <div class="lock-pin-box" id="lockPinDigit_2" style="width: 52px; height: 52px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
        <div class="lock-pin-box" id="lockPinDigit_3" style="width: 52px; height: 52px; border-radius: 2px; border: 2px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
        <div class="lock-pin-box" id="lockPinDigit_4" style="width: 52px; height: 52px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
      </div>

      <!-- Numeric Keypad Grid (Screenshot 5) -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 320px; margin: 0 auto 16px;">
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('1')">1</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('2')">2</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('3')">3</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('4')">4</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('5')">5</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('6')">6</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('7')">7</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('8')">8</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('9')">9</button>
        <button type="button" class="keypad-btn" onclick="triggerFaceIdScan()" style="font-size: 20px;"><i class="fa-solid fa-fingerprint"></i></button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('0')">0</button>
        <button type="button" class="keypad-btn" onclick="handleLockKeypad('back')" style="font-size: 18px;"><i class="fa-solid fa-delete-left"></i></button>
      </div>
    </div>

    <!-- Content Mode 2: Face ID Scan -->
    <div id="lockMode_face" style="display: none; text-align: center; padding: 24px 0;">
      <div style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Biometric Verification</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 24px;">Scan your face to access Bachat Pay securely</div>
      <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px dashed #00E676; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: #00E676; cursor: pointer; animation: pulse 2s infinite;" onclick="triggerFaceIdScan()">
        <i class="fa-regular fa-face-smile"></i>
      </div>
      <button type="button" class="btn-topbar primary" style="padding: 10px 24px; font-size: 13px;" onclick="triggerFaceIdScan()">
        Tap to Scan Face ID
      </button>
    </div>

    <!-- Content Mode 3: Password Unlock -->
    <div id="lockMode_pass" style="display: none; text-align: center; padding: 20px 0;">
      <div style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Account Password Access</div>
      <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 18px;">Enter the password you created during sign-up</div>
      <div style="position: relative; max-width: 320px; margin: 0 auto 16px;">
        <input type="password" id="lockPasswordInput" placeholder="Enter Account Password" style="width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.15); color: white; font-size: 14px; outline: none;">
      </div>
      <button type="button" class="btn-primary-action" style="max-width: 320px; margin: 0 auto; justify-content: center; background: #FF6E40;" onclick="submitLockPasswordUnlock()">
        Unlock Application
      </button>
    </div>

    <!-- Bottom Links (Screenshot 5) -->
    <div style="text-align: center; font-size: 12px; color: rgba(255,255,255,0.75); display: flex; justify-content: center; align-items: center; gap: 8px;">
      <span style="cursor: pointer;" onclick="replayCurieFlow()">Switch Account</span>
      <span>•</span>
      <span style="color: #FF8A65; font-weight: 700; cursor: pointer;" onclick="openResetPinView()">Forgot MPIN?</span>
      <span>•</span>
      <span style="cursor: pointer;" onclick="showToast('Support Hotline: +91 1800 200 8899')">Get Help</span>
    </div>
  </div>
`;

if (!app.includes('id="viewSecureAccess"')) {
  app = app.replace('</body>', secureAccessScreenHtml + '\n</body>');
  console.log('2. Inserted viewSecureAccess lock screen markup');
}

// Add keypad styling in CSS
if (!app.includes('.keypad-btn')) {
  const keypadCss = `
    .keypad-btn {
      width: 100%;
      height: 52px;
      border-radius: 12px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s;
    }
    .keypad-btn:active {
      background: rgba(255,255,255,0.35);
      transform: scale(0.96);
    }
`;
  app = app.replace('</style>', keypadCss + '\n</style>');
}

// =========================================================================
// 3. Add 3 Information / Legal Policy Modals (Screenshot 3)
// =========================================================================
const legalModalsHtml = `
  <!-- About Bachat Pay Modal -->
  <div class="modal-overlay" id="modalAboutApp" style="z-index: 10006; align-items: flex-end;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 22px 20px 30px; max-height: 85vh; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:17px; font-weight:800; color:#0F172A;">
          <i class="fa-solid fa-circle-info" style="color:#2563EB;"></i> About Bachat Pay
        </div>
        <button style="background:none; border:none; font-size:18px; color:#64748B; cursor:pointer;" onclick="closeModal('modalAboutApp')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="text-align:center; padding:16px 0; border-bottom:1px solid #F1F5F9; margin-bottom:16px;">
        <div style="width:64px; height:64px; border-radius:16px; background:#FF5722; color:white; display:inline-flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; margin-bottom:10px;">BP</div>
        <div style="font-size:18px; font-weight:900; color:#0F172A;">Bachat Pay Enterprise</div>
        <div style="font-size:12px; color:#64748B; margin-top:2px;">Version 3.4.1 (Stable Release 2026)</div>
        <div style="display:flex; justify-content:center; gap:6px; margin-top:8px;">
          <span class="badge badge-green"><i class="fa-solid fa-shield"></i> ISO 27001 Certified</span>
          <span class="badge badge-blue"><i class="fa-solid fa-building-columns"></i> DICGC Insured</span>
        </div>
      </div>
      <div style="font-size:13px; color:#334155; line-height:1.6;">
        <p style="margin-bottom:10px;">Bachat Pay is India's premier digital financial ecosystem offering seamless P2P UPI transfers, high-yield digital fixed deposits, verified brand gift vouchers (Woohoo / Hubble), and direct e-commerce shopping with instant wallet settlement.</p>
        <p style="margin-bottom:10px;">All consumer balances are protected under RBI PPI guidelines and insured up to ₹5,00,000 per user by DICGC participating partner rails.</p>
      </div>
    </div>
  </div>

  <!-- Terms & Conditions Modal -->
  <div class="modal-overlay" id="modalTerms" style="z-index: 10006; align-items: flex-end;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 22px 20px 30px; max-height: 85vh; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:17px; font-weight:800; color:#0F172A;">
          <i class="fa-solid fa-file-contract" style="color:#7C3AED;"></i> Terms & Conditions
        </div>
        <button style="background:none; border:none; font-size:18px; color:#64748B; cursor:pointer;" onclick="closeModal('modalTerms')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="font-size:13px; color:#334155; line-height:1.6;">
        <h4 style="margin:12px 0 4px; color:#0F172A;">1. Account Registration & KYC</h4>
        <p style="margin-bottom:10px;">By creating an account, you confirm that you are at least 18 years of age. All users must maintain valid KYC information. Accounts remain in 'Not Active' status until the first successful wallet deposit is completed.</p>
        <h4 style="margin:12px 0 4px; color:#0F172A;">2. Wallet Balances & Deposits</h4>
        <p style="margin-bottom:10px;">Deposits via UPI, Bank Transfer, or USDT are subject to admin UTR confirmation. Approved funds are instantly credited to the user's primary wallet.</p>
        <h4 style="margin:12px 0 4px; color:#0F172A;">3. E-Commerce Purchases & Vouchers</h4>
        <p style="margin-bottom:10px;">Products purchased on EasyPay Mall include standard brand warranty. Digital gift vouchers are delivered instantly upon purchase.</p>
      </div>
    </div>
  </div>

  <!-- Privacy Policy Modal -->
  <div class="modal-overlay" id="modalPrivacy" style="z-index: 10006; align-items: flex-end;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 22px 20px 30px; max-height: 85vh; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:17px; font-weight:800; color:#0F172A;">
          <i class="fa-solid fa-shield-halved" style="color:#15803D;"></i> Privacy & Data Security Policy
        </div>
        <button style="background:none; border:none; font-size:18px; color:#64748B; cursor:pointer;" onclick="closeModal('modalPrivacy')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="font-size:13px; color:#334155; line-height:1.6;">
        <h4 style="margin:12px 0 4px; color:#0F172A;">1. Bank-Grade Encryption</h4>
        <p style="margin-bottom:10px;">All monetary transactions and credentials are encrypted using AES-256 and TLS 1.3 standards. Security PINs are hashed and never stored in plain text.</p>
        <h4 style="margin:12px 0 4px; color:#0F172A;">2. Zero Data Selling</h4>
        <p style="margin-bottom:10px;">We strictly adhere to RBI digital payment directives and never monetize, sell, or disclose personal customer data to uncertified third parties.</p>
      </div>
    </div>
  </div>
`;

if (!app.includes('id="modalAboutApp"')) {
  app = app.replace('</body>', legalModalsHtml + '\n</body>');
  console.log('3. Inserted legal modals (About, Terms, Privacy)');
}

fs.writeFileSync('public/app.html', app, 'utf8');
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Successfully written app.html and index.html!');
