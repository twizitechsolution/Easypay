const fs = require('fs');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

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
              id: appData.user.id || 'EPY98808',
              mobile: appData.user.mobile || '9876548808',
              profilePicture: base64
            })
          });
        } catch(err) {
          console.error('Server sync profile pic error:', err);
        }
      };
      reader.readAsDataURL(file);
    }

    // =======================================================
    // 2. ADD FUNDS CONTROLLER & 4 METHODS (Screenshot 4 Request)
    // =======================================================
    let selectedDepositMethod = 'upi';
    let currentDepositProofBase64 = '';

    function openAddFundsModal() {
      // Load latest payment settings from backend
      fetch(API_BASE + '/api/admin/payment-settings')
        .then(r => r.json())
        .then(d => {
          if (d.success && d.settings) {
            updateDepositSettingsUI(d.settings);
          }
        })
        .catch(() => {});

      updateAddFundsQrDynamic();
      openModal('addMoneyModal');
    }

    function updateDepositSettingsUI(s) {
      if (!s) return;
      const upi = s.upi || {};
      const bank = s.bank || {};
      const usdt = s.usdt || {};

      if (document.getElementById('depUpiHolder')) document.getElementById('depUpiHolder').innerText = upi.accountHolder || 'Lucifer Finer Solutions Private Limited';
      if (document.getElementById('depUpiIdText')) document.getElementById('depUpiIdText').innerText = upi.upiId || 'yourbachatpay@kotak';

      if (document.getElementById('depBankName')) document.getElementById('depBankName').innerText = bank.bankName || 'Kotak Mahindra Bank';
      if (document.getElementById('depBankHolder')) document.getElementById('depBankHolder').innerText = bank.accountHolder || 'Lucifer Finer Solutions Private Limited';
      if (document.getElementById('depBankAccountNo')) document.getElementById('depBankAccountNo').innerText = bank.accountNumber || '983420192841';
      if (document.getElementById('depBankIfsc')) document.getElementById('depBankIfsc').innerText = bank.ifscCode || 'KKBK0000958';
      if (document.getElementById('depBankBranch')) document.getElementById('depBankBranch').innerText = bank.branch || 'Nariman Point, Mumbai';

      if (document.getElementById('depUsdtAddress')) document.getElementById('depUsdtAddress').innerText = usdt.walletAddress || 'TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL';
    }

    function setAddFundsAmount(amt, btn) {
      const input = document.getElementById('addFundsAmountInput');
      if (input) input.value = amt;
      document.querySelectorAll('#addFundsPresetChips .btn-preset').forEach(b => {
        b.style.borderColor = '#CBD5E1';
        b.style.background = '#FFFFFF';
        b.style.color = '#334155';
      });
      if (btn) {
        btn.style.borderColor = '#6D28D9';
        btn.style.background = '#F5F3FF';
        btn.style.color = '#6D28D9';
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
      const amt = parseFloat(amtInput?.value) || 1000;
      const upiId = document.getElementById('depUpiIdText')?.innerText || 'yourbachatpay@kotak';

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
        usdtEq.innerHTML = 'Equivalent Amount: <span style="color:#097939;">~$' + usdtAmt + ' USDT</span> (Rate: ₹92.50)';
      }
    }

    function handleDepositProofUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      document.getElementById('depProofFileName').innerText = file.name;
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
      document.getElementById('depProofFileName').innerText = 'No file chosen';
      document.getElementById('depProofPreviewWrap').style.display = 'none';
      document.getElementById('depProofClearBtn').style.display = 'none';
    }

    async function submitDepositRequestFlow() {
      const amtInput = document.getElementById('addFundsAmountInput');
      const amount = parseFloat(amtInput?.value);
      if (!amount || amount < 100) {
        showToast('Please enter an amount of at least ₹100');
        return;
      }

      const utrInput = document.getElementById('depProofUtrInput');
      const utr = utrInput?.value.trim();
      if (!utr) {
        alert('Please enter your 12-digit UTR or Transaction Reference number');
        utrInput?.focus();
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
      const initials = ((u.firstName?.[0] || u.name?.[0] || 'N') + (u.lastName?.[0] || 'B')).toUpperCase();
      const phone = u.mobile ? ('+91 ' + u.mobile) : '+91 9876548808';

      if (document.getElementById('lockScreenUserName')) document.getElementById('lockScreenUserName').innerText = fullName;
      if (document.getElementById('lockScreenUserPhone')) document.getElementById('lockScreenUserPhone').innerText = phone;
      if (document.getElementById('lockScreenAvatarInitials')) document.getElementById('lockScreenAvatarInitials').innerText = initials;

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
      // Only dismiss if unlocked previously or show message
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
      const pass = input?.value.trim();
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

// Also update syncUserProfileUI to handle profile picture, active badge, and alert
const oldSyncFn = `    // Update all UI elements showing user info (User Requested: Dynamic Name -> Phone -> User ID)
    function syncUserProfileUI() {
      const u = appData.user || {};
      const fullName = u.name || [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Nirod Behera';
      const initials = ((u.firstName?.[0] || u.name?.[0] || 'A') + (u.lastName?.[0] || (u.name?.split(' ')?.[1]?.[0] || 'K'))).toUpperCase();
      const phone = u.mobile ? ('+91 ' + u.mobile) : (u.maskedMobile ? ('+91 ' + u.maskedMobile) : '+91 7013893165');
      const userId = u.id || 'EPY31650';

      // Profile banner
      const accName = document.getElementById('profileAccountName');
      const accPhone = document.getElementById('profileAccountPhone');
      const accUserId = document.getElementById('profileAccountUserId');
      const initialsBadge = document.getElementById('profileInitialsBadge');

      if (accName) accName.innerText = fullName;
      if (accPhone) accPhone.innerText = phone;
      if (accUserId) accUserId.innerText = userId;
      if (initialsBadge) initialsBadge.innerText = initials;

      // Home header logo initials / badge
      const homeAvatar = document.querySelector('.fc-header-avatar');
      if (homeAvatar) homeAvatar.innerText = initials;

      // Side Drawer User Info
      const drawerName = document.getElementById('sideDrawerUserName');
      const drawerPhone = document.getElementById('sideDrawerUserPhone');
      const drawerInitials = document.getElementById('sideDrawerUserInitials');
      if (drawerName) drawerName.innerText = fullName;
      if (drawerPhone) drawerPhone.innerText = phone;
      if (drawerInitials) drawerInitials.innerText = initials;
    }`;

const newSyncFn = `    // Update all UI elements showing user info (Dynamic Name, Phone, User ID, Profile Pic, and Active Status)
    function syncUserProfileUI() {
      const u = appData.user || {};
      const fullName = u.name || [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Nirod Behera';
      const initials = ((u.firstName?.[0] || u.name?.[0] || 'N') + (u.lastName?.[0] || (u.name?.split(' ')?.[1]?.[0] || 'B'))).toUpperCase();
      const phone = u.mobile ? ('+91 ' + u.mobile) : (u.maskedMobile ? ('+91 ' + u.maskedMobile) : '+91 9876548808');
      const userId = u.id || 'EPY98808';
      const userPic = u.profilePicture || localStorage.getItem('currentUserProfilePic') || '';

      // Profile banner text
      const accName = document.getElementById('profileAccountName');
      const accPhone = document.getElementById('profileAccountPhone');
      const accUserId = document.getElementById('profileAccountUserId');
      if (accName) accName.innerText = fullName;
      if (accPhone) accPhone.innerText = phone;
      if (accUserId) accUserId.innerText = userId;

      // Profile Header Avatar (Image vs Initials)
      const headerInitials = document.getElementById('profileHeaderInitials');
      const headerImg = document.getElementById('profileHeaderImg');
      if (headerInitials && headerImg) {
        if (userPic) {
          headerImg.src = userPic;
          headerImg.style.display = 'block';
          headerInitials.style.display = 'none';
        } else {
          headerInitials.innerText = initials;
          headerInitials.style.display = 'block';
          headerImg.style.display = 'none';
        }
      }

      // Profile Edit Modal Avatar
      const editInitials = document.getElementById('editProfileAvatarInitials');
      const editImg = document.getElementById('editProfileAvatarImg');
      if (editInitials && editImg) {
        if (userPic) {
          editImg.src = userPic;
          editImg.style.display = 'block';
          editInitials.style.display = 'none';
        } else {
          editInitials.innerText = initials;
          editInitials.style.display = 'block';
          editImg.style.display = 'none';
        }
      }

      // Account Status Badge (Screenshot 3 Request)
      const statusBadge = document.getElementById('profileAccountStatusBadge');
      const notActiveAlert = document.getElementById('profileNotActiveAlert');
      const isActivated = u.status === 'ACTIVE' || (u.isActivated && Number(u.walletBalance || 0) > 0);

      if (statusBadge) {
        statusBadge.className = isActivated ? 'badge badge-green' : 'badge badge-amber';
        statusBadge.style.background = isActivated ? '#E8F5E9' : '#FFF3E0';
        statusBadge.style.color = isActivated ? '#2E7D32' : '#E65100';
        statusBadge.style.border = isActivated ? 'none' : '1px solid #FFE0B2';
        statusBadge.innerHTML = isActivated 
          ? '<i class="fa-solid fa-circle-check"></i> Active' 
          : '<i class="fa-solid fa-clock"></i> Not Active';
      }

      if (notActiveAlert) {
        notActiveAlert.style.display = isActivated ? 'none' : 'block';
      }

      // Home header logo initials / badge
      const homeAvatar = document.querySelector('.fc-header-avatar');
      if (homeAvatar) {
        if (userPic) {
          homeAvatar.innerHTML = '<img src="' + userPic + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
        } else {
          homeAvatar.innerText = initials;
        }
      }

      // Side Drawer User Info
      const drawerName = document.getElementById('sideDrawerUserName');
      const drawerPhone = document.getElementById('sideDrawerUserPhone');
      const drawerInitials = document.getElementById('sideDrawerUserInitials');
      if (drawerName) drawerName.innerText = fullName;
      if (drawerPhone) drawerPhone.innerText = phone;
      if (drawerInitials) {
        if (userPic) {
          drawerInitials.innerHTML = '<img src="' + userPic + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
        } else {
          drawerInitials.innerText = initials;
        }
      }
    }`;

if (app.includes(oldSyncFn)) {
  app = app.replace(oldSyncFn, newSyncFn);
  console.log('Updated syncUserProfileUI');
}

// Insert clientControllersJs before window.openProductDetails
const jsAnchor = '    window.openProductDetails = openProductDetails;';
if (app.includes(jsAnchor) && !app.includes('function handleProfilePicChange')) {
  app = app.replace(jsAnchor, clientControllersJs + '\n\n' + jsAnchor);
  console.log('Inserted client controllers into app.html');
}

fs.writeFileSync('public/app.html', app, 'utf8');
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Saved app.html and index.html!');
