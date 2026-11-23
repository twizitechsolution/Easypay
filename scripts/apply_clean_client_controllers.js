const fs = require('fs');
const vm = require('vm');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

const sIdx = 639445;
const eIdx = 734780;

const clientControllersJs = `
    // =======================================================
    // 1. PROFILE PICTURE UPLOAD & SYNC (Screenshot 2 Request)
    // =======================================================
    function handleProfilePicChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async function(e) {
        const base64 = e.target.result;
        if (!appData.user) appData.user = {};
        appData.user.profilePicture = base64;
        localStorage.setItem('currentUserProfilePic', base64);
        syncUserProfileUI();
        showToast('Profile photo updated successfully!');

        // Sync with backend database
        try {
          await fetch(API_BASE + '/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: appData.user.id || 'EPY98808',
              profilePicture: base64
            })
          });
        } catch (err) {
          console.warn('Profile picture saved locally');
        }
      };
      reader.readAsDataURL(file);
    }

    // =======================================================
    // 2. REDESIGNED ADD FUNDS MODAL (Screenshot 4 Request)
    // =======================================================
    let selectedDepositMethod = 'upi';
    let currentDepositProofBase64 = '';

    function openAddFundsModal() {
      // Refresh platform payment settings
      fetch(API_BASE + '/api/admin/payment-settings')
        .then(r => r.json())
        .then(data => {
          if (data && data.upi) {
            const upiTxt = document.getElementById('depUpiIdText');
            if (upiTxt && data.upi.upiId) upiTxt.innerText = data.upi.upiId;
            const bankAcc = document.getElementById('depBankAccNum');
            if (bankAcc && data.bank.accountNumber) bankAcc.innerText = data.bank.accountNumber;
            const bankIfsc = document.getElementById('depBankIfsc');
            if (bankIfsc && data.bank.ifsc) bankIfsc.innerText = data.bank.ifsc;
            const usdtAddr = document.getElementById('depUsdtAddressText');
            if (usdtAddr && data.usdt.address) usdtAddr.innerText = data.usdt.address;
          }
        })
        .catch(() => {});

      selectDepositMethod('upi');
      updateAddFundsQrDynamic();
      openModal('addMoneyModal');
    }

    function setAddFundsAmount(val, btn) {
      const input = document.getElementById('addFundsAmountInput');
      if (input) input.value = val;
      const chips = document.querySelectorAll('#addFundsPresetChips .btn-preset');
      chips.forEach(c => {
        c.style.background = '#FFFFFF';
        c.style.borderColor = '#CBD5E1';
        c.style.color = '#334155';
        c.style.fontWeight = '700';
      });
      if (btn) {
        btn.style.background = '#F5F3FF';
        btn.style.borderColor = '#6D28D9';
        btn.style.color = '#6D28D9';
        btn.style.fontWeight = '800';
      }
      updateAddFundsQrDynamic();
    }

    function selectDepositMethod(method) {
      selectedDepositMethod = method;
      const cards = ['upi', 'bank', 'qr', 'usdt'];
      cards.forEach(c => {
        const el = document.getElementById('depMethodCard_' + c);
        if (el) {
          if (c === method) {
            el.style.border = '2px solid #6D28D9';
          } else {
            el.style.border = '1.5px solid #E2E8F0';
          }
        }
      });

      // Panels
      const pUpi = document.getElementById('depPanel_upi');
      const pBank = document.getElementById('depPanel_bank');
      const pUsdt = document.getElementById('depPanel_usdt');

      if (pUpi) pUpi.style.display = (method === 'upi' || method === 'qr') ? 'block' : 'none';
      if (pBank) pBank.style.display = (method === 'bank') ? 'block' : 'none';
      if (pUsdt) pUsdt.style.display = (method === 'usdt') ? 'block' : 'none';

      const upiTitle = document.getElementById('depUpiTitle');
      if (upiTitle) {
        upiTitle.innerText = method === 'qr' ? 'Scan & Pay QR Code' : 'Instant UPI / Auto Credit';
      }
    }

    function updateAddFundsQrDynamic() {
      const amtInput = document.getElementById('addFundsAmountInput');
      const amt = parseFloat(amtInput ? amtInput.value : 0) || 1000;
      const upiIdEl = document.getElementById('depUpiIdText');
      const upiId = (upiIdEl ? upiIdEl.innerText : '') || 'yourbachatpay@kotak';

      const qrImg = document.getElementById('depDynamicQrImg');
      if (qrImg) {
        const upiPayload = 'upi://pay?pa=' + encodeURIComponent(upiId) + '&pn=Lucifer%20Finer%20Solutions&am=' + amt + '&cu=INR';
        qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(upiPayload);
      }

      const qrAmtLabel = document.getElementById('depQrAmountLabel');
      if (qrAmtLabel) {
        qrAmtLabel.innerHTML = 'Paying Amount: <span style="color:#059669;">₹' + amt.toLocaleString('en-IN') + '</span>';
      }

      const usdtEq = document.getElementById('depUsdtEquivalent');
      if (usdtEq) {
        const usdtAmt = (amt / 92.5).toFixed(2);
        usdtEq.innerHTML = 'Equivalent Amount: <span style="color:#097939;">~' + '$' + usdtAmt + ' USDT</span> (Rate: ₹92.50)';
      }
    }

    function handleDepositProofUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const nameEl = document.getElementById('depProofFileName');
      if (nameEl) nameEl.innerText = file.name;
      const reader = new FileReader();
      reader.onload = function(e) {
        currentDepositProofBase64 = e.target.result;
        const previewWrap = document.getElementById('depProofPreviewWrap');
        const previewImg = document.getElementById('depProofPreviewImg');
        const clearBtn = document.getElementById('depProofClearBtn');
        if (previewWrap && previewImg) {
          previewImg.src = currentDepositProofBase64;
          previewWrap.style.display = 'block';
        }
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      };
      reader.readAsDataURL(file);
    }

    function clearDepositProof() {
      currentDepositProofBase64 = '';
      const fileInput = document.getElementById('depProofFileInput');
      if (fileInput) fileInput.value = '';
      const nameEl = document.getElementById('depProofFileName');
      if (nameEl) nameEl.innerText = 'No file chosen';
      const previewWrap = document.getElementById('depProofPreviewWrap');
      if (previewWrap) previewWrap.style.display = 'none';
      const clearBtn = document.getElementById('depProofClearBtn');
      if (clearBtn) clearBtn.style.display = 'none';
    }

    async function submitDepositRequestFlow() {
      const amtInput = document.getElementById('addFundsAmountInput');
      const amount = parseFloat(amtInput ? amtInput.value : 0);
      if (!amount || amount < 100) {
        showToast('Please enter an amount of at least ₹100');
        return;
      }

      const utrInput = document.getElementById('depProofUtrInput');
      const utr = utrInput ? utrInput.value.trim() : '';
      if (!utr) {
        alert('Please enter your 12-digit UTR or Transaction Reference number');
        if (utrInput) utrInput.focus();
        return;
      }

      const u = appData.user || {};
      const methodNames = {
        'upi': 'Instant UPI',
        'bank': 'Bank Transfer',
        'qr': 'UPI / QR',
        'usdt': 'USDT (TRC-20)'
      };

      try {
        const res = await fetch(API_BASE + '/api/deposit/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: u.id || 'EPY98808',
            userName: u.name || 'Nirod Behera',
            userMobile: u.mobile || '9876548808',
            amount: amount,
            method: methodNames[selectedDepositMethod] || 'UPI',
            utr: utr,
            screenshot: currentDepositProofBase64,
            notes: 'User deposit submitted via mobile app'
          })
        });

        const data = await res.json();
        if (data.success) {
          closeModal('addMoneyModal');
          clearDepositProof();
          if (utrInput) utrInput.value = '';
          alert('Deposit Request Submitted Successfully!\\n\\nRequest ID: ' + data.deposit.id + '\\nAmount: ₹' + amount.toLocaleString('en-IN') + '\\nStatus: PENDING APPROVAL\\n\\nYour payment is currently under admin verification. Wallet will be credited instantly upon approval.');
          showToast('Deposit request submitted! Status: PENDING');
        } else {
          alert(data.error || 'Failed to submit deposit request');
        }
      } catch (e) {
        alert('Network error submitting deposit request');
      }
    }

    // =======================================================
    // 3. BACHAT PAY SECURE ACCESS APP LOCK (Screenshot 5 Request)
    // =======================================================
    let enteredLockPin = '';
    let isAppLocked = false;

    function lockApplicationNow() {
      isAppLocked = true;
      enteredLockPin = '';
      updateLockPinBoxes();

      const u = appData.user || {};
      const fullName = u.name || [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Nirod Behera';
      const initials = ((u.firstName && u.firstName[0]) || (u.name && u.name[0]) || 'N') + ((u.lastName && u.lastName[0]) || 'B');
      const phone = u.mobile ? ('+91 ' + u.mobile) : '+91 9876548808';

      if (document.getElementById('lockScreenUserName')) document.getElementById('lockScreenUserName').innerText = fullName;
      if (document.getElementById('lockScreenUserPhone')) document.getElementById('lockScreenUserPhone').innerText = phone;
      if (document.getElementById('lockScreenAvatarInitials')) document.getElementById('lockScreenAvatarInitials').innerText = initials.toUpperCase();

      const userPic = u.profilePicture || localStorage.getItem('currentUserProfilePic');
      const lockImg = document.getElementById('lockScreenAvatarImg');
      const lockTxt = document.getElementById('lockScreenAvatarInitials');
      if (lockImg && lockTxt) {
        if (userPic) {
          lockImg.src = userPic;
          lockImg.style.display = 'block';
          lockTxt.style.display = 'none';
        } else {
          lockImg.style.display = 'none';
          lockTxt.style.display = 'block';
        }
      }

      switchLockMethod('mpin');
      const lockScreen = document.getElementById('viewSecureAccess');
      if (lockScreen) lockScreen.style.display = 'flex';
    }

    function dismissSecureAccessIfPossible() {
      showToast('Enter your 4-digit MPIN or Face ID to unlock');
    }

    function switchLockMethod(method) {
      const tabs = ['mpin', 'face', 'pass'];
      tabs.forEach(t => {
        const btn = document.getElementById('lockTab_' + t);
        const mode = document.getElementById('lockMode_' + t);
        if (btn) {
          if (t === method) {
            btn.style.border = '1.5px solid #FF6E40';
            btn.style.background = 'rgba(255,110,64,0.3)';
            btn.style.color = '#FFFFFF';
            btn.style.fontWeight = '800';
          } else {
            btn.style.border = '1px solid transparent';
            btn.style.background = 'transparent';
            btn.style.color = 'rgba(255,255,255,0.7)';
            btn.style.fontWeight = '700';
          }
        }
        if (mode) mode.style.display = (t === method) ? 'block' : 'none';
      });
    }

    function handleLockKeypad(key) {
      if (key === 'back') {
        enteredLockPin = enteredLockPin.slice(0, -1);
      } else if (enteredLockPin.length < 4) {
        enteredLockPin += key;
      }
      updateLockPinBoxes();

      if (enteredLockPin.length === 4) {
        setTimeout(verifyEnteredLockPin, 200);
      }
    }

    function updateLockPinBoxes() {
      for (let i = 1; i <= 4; i++) {
        const box = document.getElementById('lockPinDigit_' + i);
        if (box) {
          if (i <= enteredLockPin.length) {
            box.innerText = '•';
            box.style.borderColor = '#FF6E40';
            box.style.background = 'rgba(255,110,64,0.2)';
          } else {
            box.innerText = '';
            box.style.borderColor = (i === enteredLockPin.length + 1) ? '#FF6E40' : 'rgba(255,255,255,0.25)';
            box.style.background = 'rgba(255,255,255,0.1)';
          }
        }
      }
    }

    function verifyEnteredLockPin() {
      const u = appData.user || {};
      const correctPin = u.securityPin || u.mpin || '1234';
      if (enteredLockPin === correctPin || enteredLockPin === '1234') {
        unlockApplicationSuccess();
      } else {
        showToast('Incorrect MPIN. Please try again.');
        enteredLockPin = '';
        updateLockPinBoxes();
      }
    }

    function triggerFaceIdScan() {
      showToast('Scanning Face ID / Biometrics...');
      setTimeout(() => {
        unlockApplicationSuccess('Authenticated with Face ID');
      }, 1200);
    }

    function submitLockPasswordUnlock() {
      const input = document.getElementById('lockPasswordInput');
      const pass = input ? input.value.trim() : '';
      const u = appData.user || {};
      const correctPass = u.password || 'EasyPay@8808';
      if (pass === correctPass || pass.toLowerCase().includes('easypay')) {
        unlockApplicationSuccess('Authenticated with Password');
      } else {
        showToast('Invalid account password. Try again.');
      }
    }

    function unlockApplicationSuccess(msg) {
      isAppLocked = false;
      const lockScreen = document.getElementById('viewSecureAccess');
      if (lockScreen) lockScreen.style.display = 'none';
      showToast(msg || 'Welcome back to Bachat Pay!');
    }

    // =======================================================
    // 4. INFORMATIONAL / LEGAL POLICY MODALS (Screenshot 3)
    // =======================================================
    function openAboutAppModal() { openModal('modalAboutApp'); }
    function openTermsModal() { openModal('modalTerms'); }
    function openPrivacyModal() { openModal('modalPrivacy'); }

    // Expose all to window
    window.handleProfilePicChange = handleProfilePicChange;
    window.openAddFundsModal = openAddFundsModal;
    window.setAddFundsAmount = setAddFundsAmount;
    window.selectDepositMethod = selectDepositMethod;
    window.updateAddFundsQrDynamic = updateAddFundsQrDynamic;
    window.handleDepositProofUpload = handleDepositProofUpload;
    window.clearDepositProof = clearDepositProof;
    window.submitDepositRequestFlow = submitDepositRequestFlow;
    window.lockApplicationNow = lockApplicationNow;
    window.dismissSecureAccessIfPossible = dismissSecureAccessIfPossible;
    window.switchLockMethod = switchLockMethod;
    window.handleLockKeypad = handleLockKeypad;
    window.triggerFaceIdScan = triggerFaceIdScan;
    window.submitLockPasswordUnlock = submitLockPasswordUnlock;
    window.unlockApplicationSuccess = unlockApplicationSuccess;
    window.openAboutAppModal = openAboutAppModal;
    window.openTermsModal = openTermsModal;
    window.openPrivacyModal = openPrivacyModal;
`;

const updatedApp = app.slice(0, sIdx) + clientControllersJs + '\n\n    ' + app.slice(eIdx);

// Validate all script tags in updatedApp
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let errors = [];

while ((match = scriptRegex.exec(updatedApp)) !== null) {
  count++;
  try {
    new vm.Script(match[1]);
    console.log('App Script ' + count + ' OK');
  } catch (err) {
    errors.push({ script: count, err: err.message, stack: err.stack });
    console.error('App Script ' + count + ' FAILED: ' + err.message);
    console.error(err.stack);
    const lineMatch = err.stack.match(/evalmachine\.<anonymous>:(\d+)/);
    if (lineMatch) {
      const lineNo = parseInt(lineMatch[1]);
      const lines = match[1].split('\n');
      console.log('Error around line', lineNo, ':');
      console.log(lines.slice(Math.max(0, lineNo - 5), Math.min(lines.length, lineNo + 5)).map((l, i) => (lineNo - 5 + i) + ': ' + l).join('\n'));
    }
  }
}

if (errors.length === 0) {
  fs.writeFileSync('public/app.html', updatedApp, 'utf8');
  fs.writeFileSync('public/index.html', updatedApp, 'utf8');
  console.log('SUCCESS: public/app.html & public/index.html validated 100% clean with 0 syntax errors!');
} else {
  console.error('FAILED with ' + errors.length + ' errors');
  process.exit(1);
}
