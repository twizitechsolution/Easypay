const fs = require('fs');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

// 1. Profile Avatar with Camera Icon Upload (Screenshot 2)
const oldProfileAvatarBlock = `      <!-- Avatar with Camera Badge (Screenshot 2) -->
      <div style="text-align: center; margin-bottom: 24px; position: relative;">
        <div style="width: 76px; height: 76px; border-radius: 50%; background: #FF6E40; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; position: relative; box-shadow: 0 4px 14px rgba(255,110,64,0.35);" id="editProfileAvatarInitials">
          Nb
          <div style="position: absolute; bottom: 0; right: 0; width: 24px; height: 24px; border-radius: 50%; background: white; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.15); cursor: pointer;" onclick="showToast('Profile photo upload ready')">
            <i class="fa-solid fa-camera" style="font-size: 11px; color: #475569;"></i>
          </div>
        </div>
      </div>`;

const newProfileAvatarBlock = `      <!-- Avatar with Camera Badge (Screenshot 2 - Direct Gallery Upload) -->
      <div style="text-align: center; margin-bottom: 24px; position: relative;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: #FF6E40; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; position: relative; box-shadow: 0 4px 14px rgba(255,110,64,0.35); cursor: pointer; overflow: visible; margin: 0 auto;" id="editProfileAvatarWrap" onclick="document.getElementById('profilePicFileInput').click()">
          <span id="editProfileAvatarInitials">NB</span>
          <img id="editProfileAvatarImg" src="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: none;" alt="Profile Picture">
          <div style="position: absolute; bottom: -2px; right: -2px; width: 28px; height: 28px; border-radius: 50%; background: #FFFFFF; border: 2px solid #E2E8F0; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2); cursor: pointer;" title="Upload Profile Photo">
            <i class="fa-solid fa-camera" style="font-size: 12px; color: #1E293B;"></i>
          </div>
        </div>
        <input type="file" id="profilePicFileInput" accept="image/*" style="display: none;" onchange="handleProfilePicChange(event)">
        <div style="font-size: 11px; color: #64748B; margin-top: 8px;">Tap camera icon to select photo from gallery</div>
      </div>`;

if (app.includes(oldProfileAvatarBlock)) {
  app = app.replace(oldProfileAvatarBlock, newProfileAvatarBlock);
  console.log('1. Updated Profile modal avatar with direct file picker');
}

// 2. Profile Screen Header: Add Active/Not Active Badge & Profile Image (Screenshot 3)
const oldProfileHeroRow = `<div class="profile-user-info-row">
            <div class="profile-avatar-circle-orange" id="profileInitialsBadge" onclick="openProfileEditModal()" style="cursor:pointer;">
              Nb
            </div>
            <div>
              <div class="profile-meta-name" id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</div>
              <div class="profile-meta-phone" id="profileAccountPhone">+91 9876548808</div>
              <div class="profile-meta-userid" style="font-size: 13px; color: rgba(255,255,255,0.92); font-weight: 700; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
                <span>User ID:</span>
                <span id="profileAccountUserId" style="letter-spacing: 0.5px;">EPY98808</span>
              </div>
            </div>
          </div>`;

const newProfileHeroRow = `<div class="profile-user-info-row">
            <div class="profile-avatar-circle-orange" id="profileInitialsBadge" onclick="openProfileEditModal()" style="cursor:pointer; overflow: hidden; position: relative;">
              <span id="profileHeaderInitials">NB</span>
              <img id="profileHeaderImg" src="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: none;" alt="Avatar">
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="profile-meta-name" id="profileAccountName" onclick="openProfileEditModal()" style="cursor:pointer;">Nirod Behera</span>
                <span id="profileAccountStatusBadge" class="badge badge-green" style="font-size: 10px; padding: 2px 8px; font-weight: 800; border-radius: 999px;">
                  <i class="fa-solid fa-circle-check"></i> Active
                </span>
              </div>
              <div class="profile-meta-phone" id="profileAccountPhone">+91 9876548808</div>
              <div class="profile-meta-userid" style="font-size: 13px; color: rgba(255,255,255,0.92); font-weight: 700; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
                <span>User ID:</span>
                <span id="profileAccountUserId" style="letter-spacing: 0.5px;">EPY98808</span>
              </div>
            </div>
          </div>`;

if (app.includes(oldProfileHeroRow)) {
  app = app.replace(oldProfileHeroRow, newProfileHeroRow);
  console.log('2. Updated Profile Screen hero row with Active/Not Active badge and photo');
}

// 3. Add 3 Information / Legal Policy Menu Options (Screenshot 3)
const oldMenuGroup3 = `        <!-- Menu Group 3: App Info & Log Out -->
        <div class="profile-menu-group" style="margin-bottom:40px;">
          <div class="profile-menu-row" onclick="showToast('EasyPay v3.4.1 (Encrypted & DICGC Insured)')">
            <div class="profile-menu-left">
              <div class="profile-menu-icon" style="background:#E3F2FD; color:#1976D2;">
                <i class="fa-solid fa-circle-info"></i>
              </div>
              <div class="profile-menu-text-wrap">
                <span class="profile-menu-item-title">About EasyPay</span>
                <span class="profile-menu-item-sub">Version 3.4.1 • ISO 27001 Certified</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#BDBDBD; font-size:13px;"></i>
          </div>

          <div class="profile-menu-row" onclick="replayCurieFlow()">
            <div class="profile-menu-left">
              <div class="profile-menu-icon" style="background:#FFEBEE; color:#D32F2F;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
              </div>
              <div class="profile-menu-text-wrap">
                <span class="profile-menu-item-title" style="color:#D32F2F;">Log Out & Switch User</span>
                <span class="profile-menu-item-sub">Return to Splash & Login Screen</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#BDBDBD; font-size:13px;"></i>
          </div>
        </div>`;

const newMenuGroup3 = `        <!-- Menu Group 3: App Information & Legal Policies (Screenshot 3 Request) -->
        <div class="profile-menu-group" style="margin-bottom:40px;">
          <!-- 1. About Bachat Pay -->
          <div class="profile-menu-row" onclick="openAboutAppModal()">
            <div class="profile-menu-left">
              <div class="profile-menu-icon" style="background:#E0F2FE; color:#0284C7;">
                <i class="fa-solid fa-circle-info"></i>
              </div>
              <div class="profile-menu-text-wrap">
                <span class="profile-menu-item-title">About Bachat Pay</span>
                <span class="profile-menu-item-sub">Application overview & security credentials</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#BDBDBD; font-size:13px;"></i>
          </div>

          <!-- 2. Terms and Conditions -->
          <div class="profile-menu-row" onclick="openTermsModal()">
            <div class="profile-menu-left">
              <div class="profile-menu-icon" style="background:#F3E8FF; color:#7C3AED;">
                <i class="fa-solid fa-file-contract"></i>
              </div>
              <div class="profile-menu-text-wrap">
                <span class="profile-menu-item-title">Terms & Conditions</span>
                <span class="profile-menu-item-sub">User terms of service, limits & policy</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#BDBDBD; font-size:13px;"></i>
          </div>

          <!-- 3. Privacy Policy -->
          <div class="profile-menu-row" onclick="openPrivacyModal()">
            <div class="profile-menu-left">
              <div class="profile-menu-icon" style="background:#DCFCE7; color:#15803D;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div class="profile-menu-text-wrap">
                <span class="profile-menu-item-title">Privacy Policy</span>
                <span class="profile-menu-item-sub">Data protection, ISO encryption & RBI standards</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#BDBDBD; font-size:13px;"></i>
          </div>

          <!-- Lock App / Secure Access -->
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
          </div>

          <!-- Log Out & Switch User -->
          <div class="profile-menu-row" onclick="replayCurieFlow()">
            <div class="profile-menu-left">
              <div class="profile-menu-icon" style="background:#FFEBEE; color:#D32F2F;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
              </div>
              <div class="profile-menu-text-wrap">
                <span class="profile-menu-item-title" style="color:#D32F2F;">Log Out & Switch User</span>
                <span class="profile-menu-item-sub">Return to Splash & Login Screen</span>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:#BDBDBD; font-size:13px;"></i>
          </div>
        </div>`;

if (app.includes(oldMenuGroup3)) {
  app = app.replace(oldMenuGroup3, newMenuGroup3);
  console.log('3. Updated Profile menu with About Bachat Pay, Terms, Privacy Policy & Lock App');
}

fs.writeFileSync('public/app.html', app, 'utf8');
fs.writeFileSync('public/index.html', app, 'utf8');
console.log('Saved app.html and index.html!');
