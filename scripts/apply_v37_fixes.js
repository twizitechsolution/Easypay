const fs = require('fs');
const vm = require('vm');

// ------------------------------------------------------------------
// 1. UPDATE public/app.html
// ------------------------------------------------------------------
let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

// A. Remove "Complete KYC for smooth experience: UPDATE KYC" strip
const kycStripBlock = `        <div class="profile-kyc-alert-strip">
          <div style="display:flex; align-items:center; gap:6px;">
            <span>Complete KYC for smooth experience: <strong>UPDATE KYC</strong></span>
          </div>
          <div style="display:flex; gap:4px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#FF5722;"></span>
            <span style="width:6px; height:6px; border-radius:50%; background:#FFE0B2;"></span>
          </div>
        </div>`;
if (!app.includes(kycStripBlock)) throw new Error('kycStripBlock not found');
app = app.replace(kycStripBlock, '');

// B. Remove "Lock App / Secure Access" menu item from Profile
const lockMenuBlock = `          <!-- Lock App / Secure Access -->
          <div class="profile-menu-row" onclick="lockApplicationNow()">
            <div class="profile-menu-left">
              <div class="profile-menu-icon" style="background:#FEF3C7; color:#D97706;">
                <i class="fa-solid fa-lock"></i>
              </div>
              <div class="profile-menu-text-wrap">
                <span class="profile-menu-item-title">Lock App / Secure Access</span>
                <span class="profile-menu-item-sub">Require 4-digit MPIN or Face ID to re-open</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#BDBDBD; font-size:13px;"></i>
          </div>`;
if (!app.includes(lockMenuBlock)) throw new Error('lockMenuBlock not found');
app = app.replace(lockMenuBlock, '');

// C. Rebrand About Bachat Pay -> About EasyPay in Profile menu
app = app.replace('<!-- 1. About Bachat Pay -->', '<!-- 1. About EasyPay -->');
app = app.replace('<span class="profile-menu-item-title">About Bachat Pay</span>', '<span class="profile-menu-item-title">About EasyPay</span>');

// D. Update .keypad-btn CSS for light EasyPay UI theme
const oldKeypadCss = `    .keypad-btn {
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
    }`;
const newKeypadCss = `    .keypad-btn {
      width: 100%;
      height: 50px;
      border-radius: 14px;
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      color: #0F172A;
      font-size: 20px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(15,23,42,0.04);
      transition: all 0.12s;
    }
    .keypad-btn:active {
      background: #FFF3E0;
      border-color: #FF5722;
      color: #FF5722;
      transform: scale(0.96);
    }`;
if (!app.includes(oldKeypadCss)) throw new Error('oldKeypadCss not found');
app = app.replace(oldKeypadCss, newKeypadCss);

// E. Raise #viewResetPin z-index above #viewSecureAccess (999999 -> 1000000)
const oldResetPinDiv = '<div class="view-panel" id="viewResetPin" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">';
const newResetPinDiv = '<div class="view-panel" id="viewResetPin" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000000; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">';
if (!app.includes(oldResetPinDiv)) throw new Error('oldResetPinDiv not found');
app = app.replace(oldResetPinDiv, newResetPinDiv);

// F. Update handleInitialRoute & logoutUser for Splash -> Lock Screen flow
const oldRouteBlock = `    // Direct URL hash / initial tab listener with production Auth Guard
    function handleInitialRoute() {
      const hash = (window.location.hash || '').replace('#', '').toLowerCase();
      const path = (window.location.pathname || '').replace('/', '').toLowerCase();

      // Persistent Session Check (survives app close & APK restarts)
      const isAuthed = localStorage.getItem('easypay_auth_completed') === 'true' || sessionStorage.getItem('easypay_auth_completed') === 'true';

      // If user is not authenticated, start with Splash -> Login sequence
      if (!isAuthed) {
        launchEasyPaySplash();
        return;
      }

      // Hide all auth screens immediately for authenticated user
      document.querySelectorAll('.ep-auth-fullscreen').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
      });

      // Restore cached user profile if present
      try {
        const cachedUserStr = localStorage.getItem('easypay_session_user');
        if (cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          if (cachedUser) {
            currentUser = cachedUser;
            if (typeof renderUserDisplays === 'function') renderUserDisplays(cachedUser);
          }
        }
      } catch(e) {}

      if (hash === 'auth' || hash === 'splash' || path === 'auth' || path === 'splash' || hash === 'login' || path === 'login' || hash === 'otp' || path === 'otp') {
        switchNavTab('home');
        return;
      }
      if (hash === 'help' || path === 'help') {
        openNeedHelpScreen();
        return;
      }

      const validTabs = ['home', 'giftcards', 'bonds', 'shopping', 'passbook', 'profile'];
      const target = validTabs.find(t => t === hash || t === path) || 'home';
      switchNavTab(target);
    }
    window.addEventListener('hashchange', handleInitialRoute);
    window.addEventListener('DOMContentLoaded', handleInitialRoute);

    function logoutUser() {
      localStorage.removeItem('easypay_auth_completed');
      localStorage.removeItem('easypay_logged_mobile');
      localStorage.removeItem('easypay_session_user');
      sessionStorage.removeItem('easypay_auth_completed');
      showToast('Logged out of EasyPay');
      setTimeout(() => {
        launchEasyPaySplash();
      }, 500);
    }`;

const newRouteBlock = `    // Direct URL hash / initial tab listener with production Auth Guard
    let hasRunInitialAppLaunch = false;
    function handleInitialRoute() {
      const hash = (window.location.hash || '').replace('#', '').toLowerCase();
      const path = (window.location.pathname || '').replace('/', '').toLowerCase();

      // Persistent Session Check (survives app close & APK restarts)
      const isAuthed = localStorage.getItem('easypay_auth_completed') === 'true' || sessionStorage.getItem('easypay_auth_completed') === 'true';

      // If user is not authenticated, start with Splash -> Login sequence
      if (!isAuthed) {
        hasRunInitialAppLaunch = true;
        launchEasyPaySplash();
        return;
      }

      // Restore cached user profile if present
      try {
        const cachedUserStr = localStorage.getItem('easypay_session_user');
        if (cachedUserStr) {
          const cachedUser = JSON.parse(cachedUserStr);
          if (cachedUser) {
            currentUser = cachedUser;
            if (typeof renderUserDisplays === 'function') renderUserDisplays(cachedUser);
          }
        }
      } catch(e) {}

      // On fresh app open while already logged in: Splash Screen -> EasyPay Lock Screen
      if (!hasRunInitialAppLaunch) {
        hasRunInitialAppLaunch = true;
        const validTabs = ['home', 'giftcards', 'bonds', 'shopping', 'passbook', 'profile'];
        const target = validTabs.find(t => t === hash || t === path) || 'home';
        switchNavTab(target);
        launchEasyPaySplash();
        return;
      }

      // Hide all auth screens for in-app hash navigation
      document.querySelectorAll('.ep-auth-fullscreen').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
      });

      if (hash === 'auth' || hash === 'splash' || path === 'auth' || path === 'splash' || hash === 'login' || path === 'login' || hash === 'otp' || path === 'otp') {
        switchNavTab('home');
        return;
      }
      if (hash === 'help' || path === 'help') {
        openNeedHelpScreen();
        return;
      }

      const validTabs = ['home', 'giftcards', 'bonds', 'shopping', 'passbook', 'profile'];
      const target = validTabs.find(t => t === hash || t === path) || 'home';
      switchNavTab(target);
    }
    window.addEventListener('hashchange', handleInitialRoute);
    window.addEventListener('DOMContentLoaded', handleInitialRoute);

    function logoutUser() {
      localStorage.removeItem('easypay_auth_completed');
      localStorage.removeItem('easypay_logged_mobile');
      localStorage.removeItem('easypay_session_user');
      sessionStorage.removeItem('easypay_auth_completed');
      const lockScreen = document.getElementById('viewSecureAccess');
      if (lockScreen) lockScreen.style.display = 'none';
      if (typeof isAppLocked !== 'undefined') isAppLocked = false;
      showToast('Logged out of EasyPay');
      setTimeout(() => {
        launchEasyPaySplash();
      }, 400);
    }`;

if (!app.includes(oldRouteBlock)) throw new Error('oldRouteBlock not found');
app = app.replace(oldRouteBlock, () => newRouteBlock);

// G. Update launchEasyPaySplash to call finishEasyPaySplash()
const oldSplashBlock = `            setTimeout(() => {
              const sp = document.getElementById('epSplashScreen');
              if (sp && (sp.classList.contains('active') || sp.style.display === 'flex')) {
                goToEasyPayLogin();
              }
            }, 900);
          }
        }, 120);
      }

      // Safety watchdog: after 2.2 seconds unconditionally advance to login if splash is still displayed
      setTimeout(() => {
        const sp = document.getElementById('epSplashScreen');
        const login = document.getElementById('epLoginScreen');
        if (sp && (sp.classList.contains('active') || sp.style.display === 'flex')) {
          if (login && !login.classList.contains('active')) {
            goToEasyPayLogin();
          }
        }
      }, 2200);
    }`;

const newSplashBlock = `            setTimeout(() => {
              const sp = document.getElementById('epSplashScreen');
              if (sp && (sp.classList.contains('active') || sp.style.display === 'flex')) {
                finishEasyPaySplash();
              }
            }, 700);
          }
        }, 110);
      }

      // Safety watchdog: after 2.0 seconds advance from splash to Lock Screen (if logged in) or Login
      setTimeout(() => {
        const sp = document.getElementById('epSplashScreen');
        const login = document.getElementById('epLoginScreen');
        if (sp && (sp.classList.contains('active') || sp.style.display === 'flex')) {
          if (login && !login.classList.contains('active')) {
            finishEasyPaySplash();
          }
        }
      }, 2000);
    }

    function finishEasyPaySplash() {
      if (typewriterInterval) {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
      }
      const splash = document.getElementById('epSplashScreen');
      if (splash) {
        splash.classList.remove('active');
        splash.style.display = 'none';
      }
      const isAuthed = localStorage.getItem('easypay_auth_completed') === 'true' || sessionStorage.getItem('easypay_auth_completed') === 'true';
      if (isAuthed && typeof lockApplicationNow === 'function') {
        lockApplicationNow();
      } else {
        goToEasyPayLogin();
      }
    }`;

if (!app.includes(oldSplashBlock)) throw new Error('oldSplashBlock not found');
app = app.replace(oldSplashBlock, () => newSplashBlock);

// H. Fix openResetPinView / closeResetPinView to support opening from Lock Screen on top
const oldResetPinJs = `    function openResetPinView() {
      document.querySelectorAll('.view-panel').forEach(v => v.style.display = 'none');
      const v = document.getElementById('viewResetPin');
      if (v) v.style.display = 'block';`;
const newResetPinJs = `    let resetPinFromLockScreen = false;
    function openResetPinView(fromLock) {
      resetPinFromLockScreen = (fromLock === true);
      if (!resetPinFromLockScreen) {
        document.querySelectorAll('.view-panel').forEach(v => v.style.display = 'none');
      }
      const v = document.getElementById('viewResetPin');
      if (v) v.style.display = 'block';`;
if (!app.includes(oldResetPinJs)) throw new Error('oldResetPinJs not found');
app = app.replace(oldResetPinJs, () => newResetPinJs);

const oldCloseResetPinJs = `    function closeResetPinView() {
      const v = document.getElementById('viewResetPin');
      if (v) v.style.display = 'none';
      switchNavTab('profile');
    }`;
const newCloseResetPinJs = `    function closeResetPinView() {
      const v = document.getElementById('viewResetPin');
      if (v) v.style.display = 'none';
      if (resetPinFromLockScreen) {
        resetPinFromLockScreen = false;
        const lockScreen = document.getElementById('viewSecureAccess');
        if (lockScreen) lockScreen.style.display = 'flex';
        return;
      }
      switchNavTab('profile');
    }`;
if (!app.includes(oldCloseResetPinJs)) throw new Error('oldCloseResetPinJs not found');
app = app.replace(oldCloseResetPinJs, () => newCloseResetPinJs);

// I. Update switchLockMethod, updateLockPinBoxes, unlockApplicationSuccess for EasyPay orange/light theme
const oldLockJs = `    function switchLockMethod(method) {
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
    }`;

const newLockJs = `    function switchLockMethod(method) {
      const tabs = ['mpin', 'face', 'pass'];
      tabs.forEach(t => {
        const btn = document.getElementById('lockTab_' + t);
        const mode = document.getElementById('lockMode_' + t);
        if (btn) {
          if (t === method) {
            btn.style.border = '1.5px solid #FF5722';
            btn.style.background = '#FF5722';
            btn.style.color = '#FFFFFF';
            btn.style.fontWeight = '800';
            btn.style.boxShadow = '0 2px 8px rgba(255,87,34,0.25)';
          } else {
            btn.style.border = '1px solid transparent';
            btn.style.background = 'transparent';
            btn.style.color = '#64748B';
            btn.style.fontWeight = '700';
            btn.style.boxShadow = 'none';
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
            box.style.borderColor = '#FF5722';
            box.style.background = '#FFF3E0';
            box.style.color = '#FF5722';
          } else {
            box.innerText = '';
            box.style.borderColor = (i === enteredLockPin.length + 1) ? '#FF5722' : '#E2E8F0';
            box.style.background = '#F8FAFC';
            box.style.color = '#0F172A';
          }
        }
      }
    }`;

if (!app.includes(oldLockJs)) throw new Error('oldLockJs not found');
app = app.replace(oldLockJs, () => newLockJs);

app = app.replace("showToast(msg || 'Welcome back to Bachat Pay!');", "showToast(msg || 'Welcome back to EasyPay!');");

// J. Replace #viewSecureAccess HTML & #modalAboutApp HTML with EasyPay-matched UI
const lockStart = app.indexOf('  <!-- =======================================================\n       BACHAT PAY SECURE ACCESS APP LOCK SCREEN');
const modalTermsStart = app.indexOf('  <!-- Terms & Conditions Modal -->');
if (lockStart === -1 || modalTermsStart === -1) throw new Error('lockStart or modalTermsStart not found');

const newLockAndAboutHtml = `  <!-- =======================================================
       EASYPAY SECURE ACCESS APP LOCK SCREEN (Matched Orange/White App Theme)
       ======================================================= -->
  <div id="viewSecureAccess" style="position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; height: 100%; background: #F8FAFC; z-index: 999999; display: none; flex-direction: column; font-family: var(--font-body); color: #0F172A; box-sizing: border-box; overflow-y: auto;">
    
    <!-- Top Orange Hero Banner (Matches EasyPay Profile Page Theme) -->
    <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 18px 18px 34px; color: #FFFFFF; position: relative; flex-shrink: 0;">
      <!-- Top Bar (No Back Button; Centered Secure Pill + Help Button) -->
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 14px;">
        <div style="width: 34px;"></div>
        <div style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 800; display: flex; align-items: center; gap: 6px; letter-spacing: 0.3px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #00E676; box-shadow: 0 0 8px #00E676;"></span>
          EasyPay Secure Access
        </div>
        <div style="width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer;" onclick="showToast('Secure PIN protects your EasyPay wallet & transactions.')">
          <i class="fa-solid fa-question" style="font-size: 14px;"></i>
        </div>
      </div>

      <!-- Center Profile Section -->
      <div style="text-align: center;">
        <div style="width: 76px; height: 76px; border-radius: 50%; border: 3px solid #FFFFFF; margin: 0 auto 10px; position: relative; display: flex; align-items: center; justify-content: center; background: #E64A19; color: white; font-size: 28px; font-weight: 800; box-shadow: 0 4px 14px rgba(0,0,0,0.18); overflow: visible;">
          <span id="lockScreenAvatarInitials">NB</span>
          <img id="lockScreenAvatarImg" src="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: none;" alt="User Photo">
          <div style="position: absolute; bottom: -2px; right: -2px; width: 22px; height: 22px; border-radius: 50%; background: #00C853; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 19px; font-weight: 800;">
          <span id="lockScreenUserName">Nirod Behera</span>
          <i class="fa-solid fa-circle-check" style="color: #B9F6CA; font-size: 15px;"></i>
        </div>
        <div style="font-size: 13px; color: rgba(255,255,255,0.92); margin-top: 2px;" id="lockScreenUserPhone">+91 9876548808</div>
      </div>
    </div>

    <!-- Clean White Card Body (Matches EasyPay App Cards) -->
    <div style="background: #FFFFFF; border-radius: 24px 24px 0 0; margin-top: -18px; padding: 20px 20px 24px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 -4px 18px rgba(0,0,0,0.06); position: relative; z-index: 2;">
      <div>
        <!-- 3 Access Method Segmented Tabs -->
        <div style="background: #F1F5F9; border-radius: 999px; padding: 4px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 18px;">
          <button type="button" class="lock-tab-btn active" id="lockTab_mpin" onclick="switchLockMethod('mpin')" style="border-radius: 999px; padding: 8px 12px; border: 1.5px solid #FF5722; background: #FF5722; color: #FFFFFF; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fa-solid fa-key"></i> MPIN
          </button>
          <button type="button" class="lock-tab-btn" id="lockTab_face" onclick="switchLockMethod('face')" style="border-radius: 999px; padding: 8px 12px; border: 1px solid transparent; background: transparent; color: #64748B; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fa-regular fa-face-smile"></i> Face ID
          </button>
          <button type="button" class="lock-tab-btn" id="lockTab_pass" onclick="switchLockMethod('pass')" style="border-radius: 999px; padding: 8px 12px; border: 1px solid transparent; background: transparent; color: #64748B; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fa-solid fa-lock"></i> Password
          </button>
        </div>

        <!-- Content Mode 1: 4-Digit MPIN Keypad -->
        <div id="lockMode_mpin">
          <div style="text-align: center; margin-bottom: 14px;">
            <div style="font-size: 16px; font-weight: 800; color: #0F172A;">Enter 4-Digit EasyPay MPIN</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Secure Access to your EasyPay account</div>
          </div>

          <!-- 4 PIN Entry Boxes -->
          <div style="display: flex; justify-content: center; gap: 14px; margin-bottom: 18px;">
            <div class="lock-pin-box active" id="lockPinDigit_1" style="width: 52px; height: 52px; border-radius: 14px; border: 2px solid #FF5722; background: #F8FAFC; color: #0F172A; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
            <div class="lock-pin-box" id="lockPinDigit_2" style="width: 52px; height: 52px; border-radius: 14px; border: 2px solid #E2E8F0; background: #F8FAFC; color: #0F172A; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
            <div class="lock-pin-box" id="lockPinDigit_3" style="width: 52px; height: 52px; border-radius: 14px; border: 2px solid #E2E8F0; background: #F8FAFC; color: #0F172A; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
            <div class="lock-pin-box" id="lockPinDigit_4" style="width: 52px; height: 52px; border-radius: 14px; border: 2px solid #E2E8F0; background: #F8FAFC; color: #0F172A; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900;"></div>
          </div>

          <!-- Numeric Keypad Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 320px; margin: 0 auto 14px;">
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('1')">1</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('2')">2</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('3')">3</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('4')">4</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('5')">5</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('6')">6</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('7')">7</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('8')">8</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('9')">9</button>
            <button type="button" class="keypad-btn" onclick="triggerFaceIdScan()" style="font-size: 20px; color: #FF5722;"><i class="fa-solid fa-fingerprint"></i></button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('0')">0</button>
            <button type="button" class="keypad-btn" onclick="handleLockKeypad('back')" style="font-size: 18px; color: #64748B;"><i class="fa-solid fa-delete-left"></i></button>
          </div>
        </div>

        <!-- Content Mode 2: Face ID Scan -->
        <div id="lockMode_face" style="display: none; text-align: center; padding: 24px 0;">
          <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 6px;">Biometric Verification</div>
          <div style="font-size: 12px; color: #64748B; margin-bottom: 24px;">Scan your face to access EasyPay securely</div>
          <div style="width: 116px; height: 116px; border-radius: 50%; border: 3px dashed #FF5722; background: #FFF3E0; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 46px; color: #FF5722; cursor: pointer;" onclick="triggerFaceIdScan()">
            <i class="fa-regular fa-face-smile"></i>
          </div>
          <button type="button" class="btn-primary-action" style="max-width: 240px; margin: 0 auto; justify-content: center; background: #FF5722; color: #FFFFFF; border-radius: 12px; padding: 12px 20px;" onclick="triggerFaceIdScan()">
            Tap to Scan Face ID
          </button>
        </div>

        <!-- Content Mode 3: Password Unlock -->
        <div id="lockMode_pass" style="display: none; text-align: center; padding: 20px 0;">
          <div style="font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 6px;">Account Password Access</div>
          <div style="font-size: 12px; color: #64748B; margin-bottom: 18px;">Enter the password you created during sign-up</div>
          <div style="position: relative; max-width: 320px; margin: 0 auto 16px;">
            <input type="password" id="lockPasswordInput" placeholder="Enter Account Password" style="width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #CBD5E1; background: #F8FAFC; color: #0F172A; font-size: 14px; outline: none; box-sizing: border-box;">
          </div>
          <button type="button" class="btn-primary-action" style="max-width: 320px; margin: 0 auto; justify-content: center; background: #FF5722; color: #FFFFFF; border-radius: 12px; padding: 12px 20px;" onclick="submitLockPasswordUnlock()">
            Unlock Application
          </button>
        </div>
      </div>

      <!-- Bottom Links -->
      <div style="text-align: center; font-size: 12.5px; color: #64748B; display: flex; justify-content: center; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid #F1F5F9;">
        <span style="cursor: pointer; font-weight: 600;" onclick="logoutUser()">Switch Account</span>
        <span>•</span>
        <span style="color: #FF5722; font-weight: 800; cursor: pointer;" onclick="openResetPinView(true)">Forgot MPIN?</span>
        <span>•</span>
        <span style="cursor: pointer; font-weight: 600;" onclick="showToast('Support Hotline: +91 1800 200 8899')">Get Help</span>
      </div>
    </div>
  </div>


  <!-- About EasyPay Modal -->
  <div class="modal-overlay" id="modalAboutApp" style="z-index: 10006; align-items: flex-end;">
    <div class="modal-sheet" style="border-radius: 24px 24px 0 0; padding: 22px 20px 30px; max-height: 85vh; overflow-y: auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px; font-size:17px; font-weight:800; color:#0F172A;">
          <i class="fa-solid fa-circle-info" style="color:#FF5722;"></i> About EasyPay
        </div>
        <button style="background:none; border:none; font-size:18px; color:#64748B; cursor:pointer;" onclick="closeModal('modalAboutApp')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div style="text-align:center; padding:16px 0; border-bottom:1px solid #F1F5F9; margin-bottom:16px;">
        <div style="width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg, #FF5722, #FF7043); color:white; display:inline-flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; margin-bottom:10px;">EP</div>
        <div style="font-size:18px; font-weight:900; color:#0F172A;">EasyPay Enterprise</div>
        <div style="font-size:12px; color:#64748B; margin-top:2px;">Version 3.4.1 (Stable Release 2026)</div>
        <div style="display:flex; justify-content:center; gap:6px; margin-top:8px;">
          <span class="badge badge-green"><i class="fa-solid fa-shield"></i> ISO 27001 Certified</span>
          <span class="badge badge-blue"><i class="fa-solid fa-building-columns"></i> DICGC Insured</span>
        </div>
      </div>
      <div style="font-size:13px; color:#334155; line-height:1.6;">
        <p style="margin-bottom:10px;">EasyPay is India's premier digital financial ecosystem offering seamless P2P UPI transfers, high-yield digital fixed deposits, verified brand gift vouchers (Woohoo / Hubble), and direct e-commerce shopping with instant wallet settlement.</p>
        <p style="margin-bottom:10px;">All consumer balances are protected under RBI PPI guidelines and insured up to ₹5,00,000 per user by DICGC participating partner rails.</p>
      </div>
    </div>
  </div>

`;

app = app.slice(0, lockStart) + newLockAndAboutHtml + app.slice(modalTermsStart);

// Validate all script blocks in app.html
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let idx = 0;
while ((m = scriptRegex.exec(app)) !== null) {
  idx++;
  new vm.Script(m[1]);
  console.log('App Script ' + idx + ' syntax OK');
}

fs.writeFileSync('public/app.html', app, 'utf8');
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Saved public/app.html and public/index.html (identical)');

// ------------------------------------------------------------------
// 2. UPDATE public/admin.html, server/server.js, server/db.json (Bachat Pay -> EasyPay)
// ------------------------------------------------------------------
let admin = fs.readFileSync('public/admin.html', 'utf8');
admin = admin.replace(/Bachat Pay Hub/g, 'EasyPay Hub');
fs.writeFileSync('public/admin.html', admin, 'utf8');

let srv = fs.readFileSync('server/server.js', 'utf8');
srv = srv.replace(/BACHAT PAY ENTERPRISE PLATFORM/g, 'EASYPAY ENTERPRISE PLATFORM');
fs.writeFileSync('server/server.js', srv, 'utf8');

let db = fs.readFileSync('server/db.json', 'utf8');
db = db.replace(/Bachat Pay Hub/g, 'EasyPay Hub');
fs.writeFileSync('server/db.json', db, 'utf8');

// ------------------------------------------------------------------
// 3. UPDATE test_suite.js
// ------------------------------------------------------------------
let suite = fs.readFileSync('test_suite.js', 'utf8');
suite = suite.replace(
  "name: 'Req 42: Legal modals (About Bachat Pay, Terms & Conditions, Privacy Policy)',",
  "name: 'Req 42: Legal modals (About EasyPay, Terms & Conditions, Privacy Policy)',"
);
suite = suite.replace(
  "name: 'Req 46: Bachat Pay Secure Access lock screen with MPIN keypad, Face ID & Password unlock',\n    pass: appHtml.includes('viewSecureAccess') &&\n          appHtml.includes('Bachat Pay Secure Access') &&",
  "name: 'Req 46: EasyPay Secure Access lock screen with MPIN keypad, Face ID & Password unlock',\n    pass: appHtml.includes('viewSecureAccess') &&\n          appHtml.includes('EasyPay Secure Access') &&"
);
fs.writeFileSync('test_suite.js', suite, 'utf8');
console.log('Updated admin.html, server.js, db.json, and test_suite.js');
