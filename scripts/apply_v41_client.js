const fs = require('fs');
const vm = require('vm');

let app = fs.readFileSync('public/app.html', 'utf8').replace(/\r\n/g, '\n');

// ------------------------------------------------------------------
// 1. UPDATE #viewBonds (Remove 8 dots, Reorder FD->RD->Bonds, Highlight Why Invest, Orange Lucky Draw Banner)
// ------------------------------------------------------------------
const bondsSliderDots = `          <!-- 8-Dot Carousel Indicators -->
          <div class="slider-dots-row">
            <span class="slider-dot active"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
            <span class="slider-dot"></span>
          </div>`;
if (!app.includes(bondsSliderDots)) throw new Error('bondsSliderDots not found');
app = app.replace(bondsSliderDots, '');

// Reorder Invest with EasyPay cards: FD -> RD -> Bonds
const oldInvestCards = `        <div class="bonds-category-row">
          <!-- Card 1: Bonds 12.00% -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('Senior Secured Corporate Bonds', '12.00%', 'senior_secured_bonds')">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">Bonds</span>
                <span class="cat-badge-pill purple">Senior secured</span>
              </div>
              <span class="cat-reg-text">SEBI-registered</span>
              <div class="cat-rate-text">12.00% <span style="font-size: 11px; font-weight: 700; color: #10B981;">/mo</span></div>
            </div>
            <div class="cat-illustration-box">
              <i class="fa-solid fa-scroll"></i>
            </div>
          </div>

          <!-- Card 2: RD -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('RBI Regulated Recurring Deposit', '9.10%', 'rbi_rd')">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">RD</span>
              </div>
              <span class="cat-reg-text">RBI-regulated</span>
              <div class="cat-rate-text" style="color: #2563EB;">9.10% <span style="font-size: 11px; font-weight: 700; color: #2563EB;">/mo</span></div>
            </div>
            <div class="cat-illustration-box" style="background: #EFF6FF; color: #2563EB;">
              <i class="fa-solid fa-calendar-days"></i>
            </div>
          </div>

          <!-- Card 3: FD Card -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('EasyPay FD Credit Card', '8.75%', 'fd_card')">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">FD card</span>
              </div>
              <span class="cat-reg-text">0.5% cashback</span>
              <div class="cat-rate-text" style="color: #9333EA;">8.75% <span style="font-size: 11px; font-weight: 700; color: #9333EA;">/mo</span></div>
            </div>
            <div class="cat-illustration-box" style="background: #FAF5FF; color: #9333EA;">
              <i class="fa-solid fa-credit-card"></i>
            </div>
          </div>
        </div>

                <!-- 3. WEEKLY LUCKY DRAW ADVERTISEMENT / PROMO BANNER (CLICK OPENS DEDICATED PAGE) -->
        <div class="lucky-draw-promo-banner" onclick="openLuckyDrawDedicatedPage()">
          <div class="ld-promo-content">
            <div class="ld-promo-badge">
              <span class="ld-promo-pulse"></span>
              <span>Weekly Lucky Draw</span>
              <span class="ld-promo-time"><i class="fa-solid fa-clock"></i> Sunday 8 PM</span>
            </div>
            <div class="ld-promo-title">Win ₹25,000 Mega Jackpot</div>
            <div class="ld-promo-sub">Direct wallet prize • Enter from ₹50 • Provably fair draw</div>
          </div>
          <div class="ld-promo-action">
            <div class="ld-promo-gift-icon">
              <i class="fa-solid fa-gift"></i>
            </div>
            <button class="ld-promo-enter-btn" onclick="event.stopPropagation(); openLuckyDrawDedicatedPage();">
              <span>Enter</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- 4. "Why invest with EasyPay" Cards (Screenshot 1) -->
        <div style="padding: 10px 18px 0;">
          <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: #0F172A;">Why invest with EasyPay</div>
        </div>

        <div class="why-invest-row">
          <div class="why-card">
            <div>
              <div class="why-card-title">All in one place</div>
              <div class="why-card-desc">FDs, Recurring Deposits, Senior Bonds, and track portfolio.</div>
            </div>
            <div class="why-card-icon-box">
              <i class="fa-solid fa-circle-check"></i>
            </div>
          </div>

          <div class="why-card">
            <div>
              <div class="why-card-title">No hidden fees. Complete transparency</div>
              <div class="why-card-desc">No annual charges or hidden platform fees, just transparent investing.</div>
            </div>
            <div class="why-card-icon-box" style="background: #ECFDF5; color: #059669;">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
          </div>
        </div>`;

const newInvestCards = `        <div class="bonds-category-row">
          <!-- Card 1: Fixed Deposit (FD) -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('Suryoday SF Bank FD', '8.60%', 'suryoday_fd')" style="border: 1.5px solid #FFE0B2;">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">Fixed Deposit</span>
                <span class="cat-badge-pill" style="background: #FFF3E0; color: #FF5722;">DICGC</span>
              </div>
              <span class="cat-reg-text">RBI-insured FD</span>
              <div class="cat-rate-text" style="color: #FF5722;">8.60% <span style="font-size: 11px; font-weight: 700; color: #059669;">/mo</span></div>
            </div>
            <div class="cat-illustration-box" style="background: #FFF3E0; color: #FF5722;">
              <i class="fa-solid fa-landmark"></i>
            </div>
          </div>

          <!-- Card 2: Recurring Deposit (RD) -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('RBI Regulated Recurring Deposit', '9.10%', 'rbi_rd')" style="border: 1.5px solid #E2E8F0;">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">Recurring RD</span>
              </div>
              <span class="cat-reg-text">RBI-regulated</span>
              <div class="cat-rate-text" style="color: #059669;">9.10% <span style="font-size: 11px; font-weight: 700; color: #059669;">/mo</span></div>
            </div>
            <div class="cat-illustration-box" style="background: #ECFDF5; color: #059669;">
              <i class="fa-solid fa-calendar-days"></i>
            </div>
          </div>

          <!-- Card 3: Senior Secured Bonds -->
          <div class="bonds-cat-card" onclick="triggerRadarConnecting('Senior Secured Corporate Bonds', '12.00%', 'senior_secured_bonds')" style="border: 1.5px solid #E2E8F0;">
            <div class="cat-card-header">
              <div class="cat-title-row">
                <span class="cat-name">Senior Bonds</span>
              </div>
              <span class="cat-reg-text">SEBI-registered</span>
              <div class="cat-rate-text" style="color: #FF5722;">12.00% <span style="font-size: 11px; font-weight: 700; color: #059669;">/mo</span></div>
            </div>
            <div class="cat-illustration-box" style="background: #FFF8F5; color: #FF5722;">
              <i class="fa-solid fa-scroll"></i>
            </div>
          </div>
        </div>

        <!-- 3. WEEKLY LUCKY DRAW PROMO BANNER (Unified EasyPay Orange Theme) -->
        <div onclick="openLuckyDrawDedicatedPage()" style="margin: 14px 16px; background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); border-radius: 18px; padding: 16px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 6px 18px rgba(255,87,34,0.22);">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); border-radius: 999px; padding: 3px 10px; font-size: 10px; font-weight: 800; margin-bottom: 6px;">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: #B9F6CA;"></span>
              WEEKLY LUCKY DRAW • SUNDAY 8 PM
            </div>
            <div style="font-family: var(--font-heading); font-size: 17px; font-weight: 900;">Win ₹25,000 Mega Jackpot</div>
            <div style="font-size: 11.5px; color: rgba(255,255,255,0.9); margin-top: 2px;">Direct wallet prize • Enter from ₹50</div>
          </div>
          <button type="button" onclick="event.stopPropagation(); openLuckyDrawDedicatedPage();" style="background: #FFFFFF; color: #FF5722; border: none; border-radius: 12px; padding: 9px 14px; font-size: 12.5px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
            <span>Enter</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <!-- 4. Highlighted "Why invest with EasyPay" Cards -->
        <div style="margin: 14px 16px; background: #FFF8F5; border: 1.5px solid #FFE0B2; border-radius: 18px; padding: 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 900; color: #0F172A;">Why invest with EasyPay</div>
            <span style="background: #FF5722; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 999px;">100% Safe</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: #FFFFFF; border: 1px solid #FFEDD5; border-radius: 14px; padding: 12px;">
              <div style="width: 32px; height: 32px; border-radius: 9px; background: #FFF3E0; color: #FF5722; display: flex; align-items: center; justify-content: center; font-size: 15px; margin-bottom: 8px;"><i class="fa-solid fa-clock"></i></div>
              <div style="font-size: 13px; font-weight: 800; color: #0F172A;">12:00 AM Daily Payout</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 3px;">Interest credits automatically to your E-Pay Wallet every midnight.</div>
            </div>
            <div style="background: #FFFFFF; border: 1px solid #FFEDD5; border-radius: 14px; padding: 12px;">
              <div style="width: 32px; height: 32px; border-radius: 9px; background: #ECFDF5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 15px; margin-bottom: 8px;"><i class="fa-solid fa-shield-halved"></i></div>
              <div style="font-size: 13px; font-weight: 800; color: #0F172A;">DICGC Insured ₹5L</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 3px;">Zero hidden fees. RBI-regulated partner banks & instant tracking.</div>
            </div>
          </div>
        </div>`;

if (!app.includes(oldInvestCards)) throw new Error('oldInvestCards not found');
app = app.replace(oldInvestCards, () => newInvestCards);

// ------------------------------------------------------------------
// 2. REDESIGN #viewLuckyDrawDedicated (Screenshot 4 -> EasyPay Orange/White Paytm-Style)
// ------------------------------------------------------------------
const ldStart = app.indexOf('  <div class="view-panel" id="viewLuckyDrawDedicated"');
const ldEnd = app.indexOf('      <!-- ==============================================================\n           REFER & EARN');
if (ldStart === -1 || ldEnd === -1) throw new Error('viewLuckyDrawDedicated markers not found');

const newLuckyDrawHtml = `  <div class="view-panel" id="viewLuckyDrawDedicated" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 9999; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch; color: #0F172A;">
    <!-- Unified EasyPay Orange Hero Header -->
    <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 28px; color: #FFFFFF; position: sticky; top: 0; z-index: 100;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button onclick="closeLuckyDrawDedicatedPage()" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">Weekly Lucky Draw</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.9);">Win ₹25,000 Every Sunday at 8:00 PM</div>
          </div>
        </div>
        <button onclick="scrollToMyContests()" style="background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; padding: 5px 12px; color: #FFFFFF; font-size: 11.5px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-ticket"></i> Contests <span id="credMyContestsBadge" style="background: #FFFFFF; color: #FF5722; padding: 1px 6px; border-radius: 999px; font-size: 10px;">0</span>
        </button>
      </div>
    </div>

    <div style="padding: 0 14px 40px; margin-top: -16px; position: relative; z-index: 101;">
      <!-- Wallet & Winning Balance Strip -->
      <div style="background: #FFFFFF; border: 1.5px solid #FFE0B2; border-radius: 16px; padding: 12px 14px; margin-bottom: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; box-shadow: 0 4px 14px rgba(255,87,34,0.08);">
        <div style="background: #FFF8F5; border-radius: 12px; padding: 10px;">
          <div style="font-size: 10px; font-weight: 700; color: #64748B;">E-PAY WALLET</div>
          <div style="font-size: 16px; font-weight: 900; color: #0F172A; margin-top: 2px;" id="credWalletBalanceDisplay">₹0.00</div>
        </div>
        <div style="background: #ECFDF5; border-radius: 12px; padding: 10px;">
          <div style="font-size: 10px; font-weight: 700; color: #047857;">WINNING BALANCE</div>
          <div style="font-size: 16px; font-weight: 900; color: #059669; margin-top: 2px;" id="ldWinningBalanceDisplay">₹0.00</div>
        </div>
      </div>

      <!-- Main Jackpot & Live Countdown Card -->
      <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 20px; padding: 18px; margin-bottom: 14px; text-align: center; box-shadow: 0 3px 12px rgba(15,23,42,0.04);">
        <span style="display: inline-flex; align-items: center; gap: 6px; background: #FFF3E0; color: #FF5722; font-size: 10.5px; font-weight: 800; padding: 4px 12px; border-radius: 999px; margin-bottom: 10px;">
          <i class="fa-solid fa-crown"></i> MEGA SUNDAY JACKPOT • 100% FAIR RNG
        </span>
        <div style="font-family: var(--font-heading); font-size: 36px; font-weight: 900; color: #FF5722; line-height: 1.1;" id="giftboxFrontAmount">₹25,000</div>
        <div style="display: none;" id="credHeroPrizeAmountDisplay">₹25,000</div>
        <div style="font-size: 12px; color: #64748B; font-weight: 600; margin-top: 4px;">Direct Instant Cash Credit to E-Pay Wallet</div>

        <!-- Countdown Boxes -->
        <div id="giftboxCountdownCapsule" style="margin: 16px 0; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 12px;">
          <div style="font-size: 10px; font-weight: 800; color: #64748B; letter-spacing: 0.6px; margin-bottom: 8px;" id="giftboxCountdownHeadline">NEXT DRAW COUNTDOWN</div>
          <div style="display: flex; justify-content: center; align-items: center; gap: 8px;" id="giftboxTimerString">
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 6px 10px; min-width: 48px;"><strong id="cdDays" style="display:block; font-size:18px; color:#0F172A;">02</strong><small style="font-size:9px; color:#64748B;">DAYS</small></div>
            <span style="font-weight:900; color:#FF5722;">:</span>
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 6px 10px; min-width: 48px;"><strong id="cdHours" style="display:block; font-size:18px; color:#0F172A;">10</strong><small style="font-size:9px; color:#64748B;">HRS</small></div>
            <span style="font-weight:900; color:#FF5722;">:</span>
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 6px 10px; min-width: 48px;"><strong id="cdMins" style="display:block; font-size:18px; color:#0F172A;">24</strong><small style="font-size:9px; color:#64748B;">MINS</small></div>
            <span style="font-weight:900; color:#FF5722;">:</span>
            <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 6px 10px; min-width: 48px;"><strong id="cdSecs" style="display:block; font-size:18px; color:#0F172A;">15</strong><small style="font-size:9px; color:#64748B;">SECS</small></div>
          </div>
          <div style="font-size: 11px; color: #64748B; margin-top: 8px;" id="giftboxHumanReadable">Every Sunday at 8:00 PM</div>
        </div>

        <!-- Ticket Selector & Enter Draw CTA -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
          <button type="button" onclick="selectLdEntryTier(50, this)" class="ld-tier-chip active" style="padding: 8px; border-radius: 10px; border: 1.5px solid #FF5722; background: #FFF3E0; color: #FF5722; font-size: 12px; font-weight: 800; cursor: pointer;">1 Ticket • ₹50</button>
          <button type="button" onclick="selectLdEntryTier(100, this)" class="ld-tier-chip" style="padding: 8px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #FFFFFF; color: #334155; font-size: 12px; font-weight: 700; cursor: pointer;">2 Tickets • ₹100</button>
          <button type="button" onclick="selectLdEntryTier(200, this)" class="ld-tier-chip" style="padding: 8px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #FFFFFF; color: #334155; font-size: 12px; font-weight: 700; cursor: pointer;">4 Tickets • ₹200</button>
        </div>

        <button type="button" id="btnCredEnter" onclick="executeCredLuckyDrawEntry()" style="width: 100%; padding: 14px; border-radius: 14px; border: none; background: linear-gradient(135deg, #FF5722, #FF7043); color: #FFFFFF; font-size: 15px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(255,87,34,0.28);">
          <i class="fa-solid fa-ticket"></i>
          <span id="btnCredEnterText">Enter Draw (<span id="credPodiumCostSpan">₹50</span>)</span>
        </button>
      </div>

      <!-- Latest Winner Spotlight (Clean Non-Overlapping Card) -->
      <div id="giftboxRevealedPrize" style="background: #ECFDF5; border: 1.5px solid #A7F3D0; border-radius: 16px; padding: 14px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: #059669; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
            <i class="fa-solid fa-trophy"></i>
          </div>
          <div>
            <div style="font-size: 10px; font-weight: 800; color: #047857;">LAST SUNDAY WINNER</div>
            <div style="font-size: 14px; font-weight: 800; color: #0F172A;" id="giftboxWinnerName">Nirod Behera</div>
            <div style="font-size: 11px; color: #065F46;" id="giftboxWinnerTicket">Ticket #TKT-SUN-42569</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 13px; font-weight: 900; color: #059669;" id="giftboxWinnerPrize">₹25,000</div>
          <div style="font-size: 10px; color: #047857; font-weight: 700;">Credited</div>
        </div>
      </div>

      <!-- My Contests & Tickets -->
      <div id="sectionMyContests" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 16px; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 14px; font-weight: 800; color: #0F172A;">My Contests & Tickets</span>
          <span id="credMyTicketCountBadge" style="background: #FFF3E0; color: #FF5722; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 999px;">0 Active</span>
        </div>
        <div id="credMyContestsList" style="display: flex; flex-direction: column; gap: 8px;"></div>
      </div>

      <!-- Live Participants Feed -->
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 14px; font-weight: 800; color: #0F172A;">Participants Who Entered</span>
          <span id="credLiveCount" style="background: #ECFDF5; color: #059669; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 999px;"><i class="fa-solid fa-users"></i> Live</span>
        </div>
        <div id="credParticipantsContainer" style="display: flex; flex-direction: column; gap: 8px;"></div>
      </div>
    </div>
  </div>

`;

app = app.slice(0, ldStart) + newLuckyDrawHtml + app.slice(ldEnd);

// Add selectLdEntryTier & update Winning Balance in renderLuckyDrawUI
const ldTierJs = `    function selectLdEntryTier(amt, btn) {
      currentLdEntryAmount = amt;
      document.querySelectorAll('.ld-tier-chip').forEach(b => {
        b.style.borderColor = '#E2E8F0';
        b.style.background = '#FFFFFF';
        b.style.color = '#334155';
        b.style.fontWeight = '700';
      });
      if (btn) {
        btn.style.borderColor = '#FF5722';
        btn.style.background = '#FFF3E0';
        btn.style.color = '#FF5722';
        btn.style.fontWeight = '800';
      }
      const span = document.getElementById('credPodiumCostSpan');
      if (span) span.innerText = '₹' + amt;
      const btnText = document.getElementById('btnCredEnterText');
      if (btnText) btnText.innerHTML = 'Enter Draw (<span id="credPodiumCostSpan">₹' + amt + '</span>)';
    }
    window.selectLdEntryTier = selectLdEntryTier;

`;
app = app.replace('    async function executeCredLuckyDrawEntry() {', ldTierJs + '    async function executeCredLuckyDrawEntry() {');

app = app.replace(
  "if (btnText) btnText.innerText = 'ENTER';",
  "if (btnText) btnText.innerHTML = 'Enter Draw (<span id=\"credPodiumCostSpan\">₹' + currentLdEntryAmount + '</span>)';"
);

app = app.replace(
  'currentLdNextDrawTime = ld.nextDrawTime ? new Date(ld.nextDrawTime) : getNextSunday8PM();',
  `currentLdNextDrawTime = ld.nextDrawTime ? new Date(ld.nextDrawTime) : getNextSunday8PM();
      const winBalEl = document.getElementById('ldWinningBalanceDisplay');
      if (winBalEl) winBalEl.innerText = '₹' + Number(data.userWinningBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });`
);

// ------------------------------------------------------------------
// 3. CONVERT #bondBookingModal -> FULL DEDICATED INVESTMENT PAGE (Screenshot 2)
// ------------------------------------------------------------------
const bondModalStart = app.indexOf('  <div class="modal-overlay" id="bondBookingModal">');
const bondModalEnd = app.indexOf('  <!-- ==============================================================\n       BOND SUCCESS CERTIFICATE MODAL');
if (bondModalStart === -1 || bondModalEnd === -1) throw new Error('bondBookingModal markers not found');

const newDedicatedInvestPage = `  <div class="view-panel" id="bondBookingModal" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 10005; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
    <!-- Unified EasyPay Orange Hero Header -->
    <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 26px; color: #FFFFFF; position: sticky; top: 0; z-index: 100;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button onclick="closeModal('bondBookingModal')" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;" id="bookBondTitle">Suryoday SF Bank FD</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.92);" id="bookBondRateTag">8.60% Guaranteed Return per month</div>
          </div>
        </div>
        <span style="background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); padding: 4px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 800;">
          <i class="fa-solid fa-shield-halved"></i> DICGC
        </span>
      </div>
    </div>

    <div style="padding: 0 16px 36px; margin-top: -14px; position: relative; z-index: 101;">
      <!-- Wallet Balance & Plan Summary Strip -->
      <div style="background: #FFFFFF; border: 1.5px solid #FFE0B2; border-radius: 16px; padding: 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 14px rgba(255,87,34,0.08);">
        <div>
          <div style="font-size: 10.5px; font-weight: 700; color: #64748B;">AVAILABLE E-PAY WALLET</div>
          <div style="font-size: 18px; font-weight: 900; color: #059669;" id="investPageWalletDisplay">₹0.00</div>
        </div>
        <button type="button" onclick="openAddFundsModal()" style="background: #FFF3E0; border: 1px solid #FFCC80; color: #FF5722; border-radius: 999px; padding: 6px 12px; font-size: 11.5px; font-weight: 800; cursor: pointer;">
          + Add Funds
        </button>
      </div>

      <!-- Amount & Quick Chips Card -->
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 16px; margin-bottom: 14px;">
        <label style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 8px;">Investment Amount (₹) • Min ₹1,000</label>
        <div style="display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #FF5722; padding-bottom: 6px; margin-bottom: 14px;">
          <span style="font-size: 26px; font-weight: 900; color: #FF5722;">₹</span>
          <input type="number" id="bondAmountInput" value="1000" min="1000" step="500" oninput="calculateBondMaturity()" style="font-size: 28px; font-weight: 900; color: #0F172A; border: none; outline: none; width: 100%; background: transparent;">
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          <button type="button" class="denom-chip active" onclick="setBondAmount(1000, this)">₹1,000</button>
          <button type="button" class="denom-chip" onclick="setBondAmount(5000, this)">₹5,000</button>
          <button type="button" class="denom-chip" onclick="setBondAmount(10000, this)">₹10,000</button>
          <button type="button" class="denom-chip" onclick="setBondAmount(25000, this)">₹25,000</button>
          <button type="button" class="denom-chip" onclick="setBondAmount(50000, this)">₹50,000</button>
          <button type="button" class="denom-chip" onclick="setBondAmount(100000, this)">₹1,00,000</button>
        </div>
      </div>

      <!-- Lock-in Tenure Selector Card -->
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 16px; margin-bottom: 14px;">
        <label style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 8px;">Select Lock-in Tenure</label>
        <select id="bondTenureSelect" onchange="calculateBondMaturity()" style="width: 100%; padding: 12px; border-radius: 12px; border: 1.5px solid #CBD5E1; background: #F8FAFC; font-size: 14px; font-weight: 700; color: #0F172A; outline: none;">
          <option value="6" selected>6 Months (Starts from 6 Months)</option>
          <option value="12">12 Months (1 Year)</option>
          <option value="24">24 Months (2 Years)</option>
          <option value="36">36 Months (3 Years)</option>
          <option value="60">60 Months (5 Years - Highest Return)</option>
        </select>
      </div>

      <!-- Real-Time Yield & Maturity Calculator -->
      <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 16px; margin-bottom: 16px;">
        <div style="font-size: 12px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">Live Return Breakdown</div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
          <span style="color: #64748B;">Principal Invested:</span>
          <strong id="calcPrincipalDisplay">₹1,000.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
          <span style="color: #64748B;">Monthly Return Rate:</span>
          <strong style="color: #FF5722;" id="calcMonthlyRateDisplay">8.60% / mo (₹86.00/mo)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; background: #ECFDF5; padding: 8px 10px; border-radius: 10px; border: 1px solid #A7F3D0;">
          <span style="color: #047857; font-weight: 700;"><i class="fa-solid fa-clock"></i> Daily 12:00 AM Interest:</span>
          <strong style="color: #059669;" id="calcDailyCreditDisplay">+₹2.87 / day</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
          <span style="color: #64748B;">Total Tenure Interest:</span>
          <strong style="color: #059669;" id="calcInterestDisplay">+₹516.00</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; border-top: 1px dashed #CBD5E1; padding-top: 10px;">
          <span style="font-weight: 800;">Guaranteed Maturity Value:</span>
          <strong style="color: #0F172A; font-size: 18px;" id="calcMaturityDisplay">₹1,516.00</strong>
        </div>
      </div>

      <button type="button" id="btnConfirmInvestBooking" onclick="executeBondBooking()" style="width: 100%; padding: 15px; border-radius: 14px; border: none; background: linear-gradient(135deg, #FF5722, #FF7043); color: #FFFFFF; font-size: 15px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(255,87,34,0.28);">
        <i class="fa-solid fa-lock"></i> Confirm & Book Investment
      </button>
    </div>
  </div>

`;

app = app.slice(0, bondModalStart) + newDedicatedInvestPage + app.slice(bondModalEnd);

// Update openBondBookingModal, calculateBondMaturity, executeBondBooking to use dynamic plan/rate & real wallet deduction
const oldBondJs = `    function openBondBookingModal(title, rate, planId) {
      const modal = document.getElementById('bondBookingModal');
      if (title && document.getElementById('bookBondTitle')) {
        document.getElementById('bookBondTitle').innerText = title;
      }
      if (rate && document.getElementById('bookBondRateTag')) {
        document.getElementById('bookBondRateTag').innerText = rate + ' Guaranteed Return per month';
      }
      calculateBondMaturity();
      if (modal) modal.classList.add('active');
    }

    function calculateBondMaturity() {
      const amtInput = document.getElementById('bondAmountInput');
      const tenureSelect = document.getElementById('bondTenureSelect');
      const principal = parseFloat(amtInput ? amtInput.value : 1000) || 1000;
      const months = parseInt(tenureSelect ? tenureSelect.value : 6) || 6;
      const rate = 8.60;

      const monthlyYield = (principal * rate) / 100;
      const dailyCredit = monthlyYield / 30;
      const totalInterest = monthlyYield * months;
      const maturity = principal + totalInterest;

      if (document.getElementById('calcPrincipalDisplay')) {
        document.getElementById('calcPrincipalDisplay').innerText = '₹' + principal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
      if (document.getElementById('calcMonthlyRateDisplay')) {
        document.getElementById('calcMonthlyRateDisplay').innerText = rate.toFixed(2) + '% / mo (₹' + monthlyYield.toFixed(2) + '/mo)';
      }
      if (document.getElementById('calcDailyCreditDisplay')) {
        document.getElementById('calcDailyCreditDisplay').innerText = '+₹' + dailyCredit.toFixed(2) + ' / day';
      }
      if (document.getElementById('calcInterestDisplay')) {
        document.getElementById('calcInterestDisplay').innerText = '+₹' + totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
      if (document.getElementById('calcMaturityDisplay')) {
        document.getElementById('calcMaturityDisplay').innerText = '₹' + maturity.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
    }

    function setBondAmount(amt, el) {
      const input = document.getElementById('bondAmountInput');
      if (input) input.value = amt;
      document.querySelectorAll('#bondBookingModal .denom-chip').forEach(c => c.classList.remove('active'));
      if (el) el.classList.add('active');
      calculateBondMaturity();
    }

    async function executeBondBooking() {
      const amt = parseFloat(document.getElementById('bondAmountInput').value) || 1000;
      const tenure = parseInt(document.getElementById('bondTenureSelect').value) || 6;
      const title = document.getElementById('bookBondTitle').innerText;

      try {
        const res = await fetch(API_BASE + '/api/bonds/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: 'suryoday_fd', amount: amt, tenureMonths: tenure })
        });
        const data = await res.json();
        if (data.success) {
          closeModal('bondBookingModal');
          openModal('bondSuccessModal');
          loadData();
    renderGiftCards();
      loadLuckyDrawData();
    renderShoppingProducts(); // INITIAL AUTO-LOAD
    startGiftCardTopDealsCarousel();
          showToast('🎉 Investment of ₹' + amt + ' confirmed successfully!');
        } else {
          showToast(data.error || 'Failed to book bond');
        }
      } catch (e) {
        showToast('Investment confirmed!');
        closeModal('bondBookingModal');
      }
    }`;

const newBondJs = `    let activeBondPlan = { id: 'suryoday_fd', title: 'Suryoday SF Bank FD', rate: 8.60 };

    function openBondBookingModal(title, rate, planId) {
      pushAppNavState('bondBookingModal');
      const parsedRate = parseFloat(String(rate || '8.60').replace(/[^0-9.]/g, '')) || 8.60;
      activeBondPlan = {
        id: planId || 'suryoday_fd',
        title: title || 'Suryoday SF Bank FD',
        rate: parsedRate
      };
      if (document.getElementById('bookBondTitle')) {
        document.getElementById('bookBondTitle').innerText = activeBondPlan.title;
      }
      if (document.getElementById('bookBondRateTag')) {
        document.getElementById('bookBondRateTag').innerText = parsedRate.toFixed(2) + '% Guaranteed Return per month';
      }
      const wEl = document.getElementById('investPageWalletDisplay');
      if (wEl) {
        const bal = (appData.user && appData.user.walletBalance) || 0;
        wEl.innerText = '₹' + bal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
      calculateBondMaturity();
      const modal = document.getElementById('bondBookingModal');
      if (modal) modal.style.display = 'block';
      window.scrollTo(0, 0);
    }

    function calculateBondMaturity() {
      const amtInput = document.getElementById('bondAmountInput');
      const tenureSelect = document.getElementById('bondTenureSelect');
      const principal = parseFloat(amtInput ? amtInput.value : 1000) || 1000;
      const months = parseInt(tenureSelect ? tenureSelect.value : 6) || 6;
      const rate = activeBondPlan.rate || 8.60;

      const monthlyYield = (principal * rate) / 100;
      const dailyCredit = monthlyYield / 30;
      const totalInterest = monthlyYield * months;
      const maturity = principal + totalInterest;

      if (document.getElementById('calcPrincipalDisplay')) {
        document.getElementById('calcPrincipalDisplay').innerText = '₹' + principal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
      if (document.getElementById('calcMonthlyRateDisplay')) {
        document.getElementById('calcMonthlyRateDisplay').innerText = rate.toFixed(2) + '% / mo (₹' + monthlyYield.toFixed(2) + '/mo)';
      }
      if (document.getElementById('calcDailyCreditDisplay')) {
        document.getElementById('calcDailyCreditDisplay').innerText = '+₹' + dailyCredit.toFixed(2) + ' / day';
      }
      if (document.getElementById('calcInterestDisplay')) {
        document.getElementById('calcInterestDisplay').innerText = '+₹' + totalInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
      if (document.getElementById('calcMaturityDisplay')) {
        document.getElementById('calcMaturityDisplay').innerText = '₹' + maturity.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      }
    }

    function setBondAmount(amt, el) {
      const input = document.getElementById('bondAmountInput');
      if (input) input.value = amt;
      document.querySelectorAll('#bondBookingModal .denom-chip').forEach(c => c.classList.remove('active'));
      if (el) el.classList.add('active');
      calculateBondMaturity();
    }

    async function executeBondBooking() {
      const amt = parseFloat(document.getElementById('bondAmountInput').value) || 0;
      const tenure = parseInt(document.getElementById('bondTenureSelect').value) || 6;
      if (amt < 1000) {
        showToast('Minimum investment amount is ₹1,000');
        return;
      }

      const u = appData.user || {};
      const currentBal = Number(u.walletBalance || 0);
      if (amt > currentBal) {
        showToast('Insufficient E-Pay Wallet balance (Available: ₹' + currentBal.toLocaleString('en-IN') + ')');
        return;
      }

      const btn = document.getElementById('btnConfirmInvestBooking');
      if (btn) btn.disabled = true;

      try {
        const res = await fetch(API_BASE + '/api/invest/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bondId: activeBondPlan.id,
            planId: activeBondPlan.id,
            title: activeBondPlan.title,
            rate: activeBondPlan.rate,
            amount: amt,
            tenureMonths: tenure,
            userId: u.id || 'EPY98808',
            userMobile: u.mobile || '9876548808'
          })
        });
        const data = await res.json();
        if (data.success) {
          if (appData.user) {
            appData.user.walletBalance = data.newBalance;
            localStorage.setItem('easypay_session_user', JSON.stringify(appData.user));
          }
          if (!appData.investments) appData.investments = [];
          if (data.investment) appData.investments.unshift(data.investment);
          if (!appData.transactions) appData.transactions = [];
          if (data.transaction) appData.transactions.unshift(data.transaction);

          if (typeof updateWalletDisplay === 'function') updateWalletDisplay();
          if (typeof renderWallet === 'function') renderWallet();
          if (typeof renderBookedBonds === 'function') renderBookedBonds();
          if (typeof renderTransactions === 'function') renderTransactions();

          if (document.getElementById('successCertNum') && data.investment) {
            document.getElementById('successCertNum').innerText = data.investment.certNumber;
          }
          if (document.getElementById('successInstName')) {
            document.getElementById('successInstName').innerText = activeBondPlan.title;
          }
          if (document.getElementById('successPrincipal')) {
            document.getElementById('successPrincipal').innerText = '₹' + amt.toLocaleString('en-IN', { minimumFractionDigits: 2 });
          }

          closeModal('bondBookingModal');
          openModal('bondSuccessModal');
          showToast('Investment of ₹' + amt.toLocaleString('en-IN') + ' booked! Wallet updated.');
        } else {
          showToast(data.error || 'Failed to book investment');
        }
      } catch (e) {
        showToast('Network error booking investment');
      } finally {
        if (btn) btn.disabled = false;
      }
    }`;

if (!app.includes(oldBondJs)) throw new Error('oldBondJs not found');
app = app.replace(oldBondJs, () => newBondJs);

// ------------------------------------------------------------------
// 4. CONVERT #addMoneyModal -> FULL DEDICATED PAGE (Screenshot 1 -> EasyPay Orange/White)
// ------------------------------------------------------------------
const addStart = app.indexOf('  <!-- =======================================================\n       REDESIGNED ADD FUNDS MODAL');
const addEnd = app.indexOf('  <!-- Mini QR Modal -->');
if (addStart === -1 || addEnd === -1) throw new Error('addMoneyModal markers not found');

const newDedicatedAddFundsHtml = `  <!-- =======================================================
       DEDICATED ADD FUNDS PAGE (Full-Page EasyPay Orange/White UI)
       ======================================================= -->
  <div class="view-panel" id="addMoneyModal" style="display: none; position: fixed; top: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; bottom: 0; z-index: 10005; background: #F8FAFC; overflow-y: auto; -webkit-overflow-scrolling: touch;">
    <!-- Unified EasyPay Orange Hero Header -->
    <div style="background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%); padding: 14px 16px 26px; color: #FFFFFF; position: sticky; top: 0; z-index: 100;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button onclick="closeModal('addMoneyModal')" style="background: rgba(255,255,255,0.2); border: none; font-size: 16px; color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%;">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: #FFFFFF;">Add Funds</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.9);">Deposit to E-Pay Wallet via UPI, Bank & USDT</div>
          </div>
        </div>
        <button onclick="closeModal('addMoneyModal'); openPassbookFromProfile(); switchPassbookSegment('txns');" style="background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.35); border-radius: 999px; padding: 6px 12px; color: #FFFFFF; font-size: 11.5px; font-weight: 800; cursor: pointer;">
          <i class="fa-solid fa-clock-rotate-left"></i> History
        </button>
      </div>
    </div>

    <div style="padding: 0 16px 40px; margin-top: -14px; position: relative; z-index: 101;">
      <!-- Amount Input Card -->
      <div style="background: #FFFFFF; border: 1.5px solid #FFE0B2; border-radius: 18px; padding: 18px; margin-bottom: 16px; box-shadow: 0 4px 14px rgba(255,87,34,0.08);">
        <label style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">Enter Deposit Amount</label>
        <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0 14px; border-bottom: 2px solid #FF5722; padding-bottom: 6px;">
          <span style="font-size: 28px; font-weight: 900; color: #FF5722;">₹</span>
          <input type="number" id="addFundsAmountInput" value="1000" min="100" step="100" style="font-size: 28px; font-weight: 900; color: #0F172A; border: none; outline: none; width: 100%; background: transparent;" oninput="updateAddFundsQrDynamic()">
        </div>

        <!-- Quick Presets Row -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;" id="addFundsPresetChips">
          <button type="button" class="btn-preset active" onclick="setAddFundsAmount(1000, this)" style="padding: 9px; border-radius: 10px; border: 1.5px solid #FF5722; background: #FFF3E0; font-weight: 800; font-size: 12px; color: #FF5722; cursor: pointer;">₹1,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(2000, this)" style="padding: 9px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹2,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(5000, this)" style="padding: 9px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹5,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(10000, this)" style="padding: 9px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹10,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(50000, this)" style="padding: 9px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹50,000</button>
          <button type="button" class="btn-preset" onclick="setAddFundsAmount(100000, this)" style="padding: 9px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: #FFFFFF; font-weight: 700; font-size: 12px; color: #334155; cursor: pointer;">₹1,00,000</button>
        </div>
      </div>

      <!-- SELECT PAYMENT METHOD Title -->
      <div style="font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        <span style="width: 20px; height: 20px; border-radius: 50%; background: #FF5722; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900;">1</span>
        SELECT PAYMENT METHOD
      </div>

      <!-- 4 Payment Method Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px;">
        <div class="deposit-method-card active" id="depMethodCard_upi" onclick="selectDepositMethod('upi')" style="background: #FFFFFF; border: 2px solid #FF5722; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; position: relative; transition: all 0.2s;">
          <div style="position: absolute; top: -7px; left: 50%; transform: translateX(-50%); background: #FF5722; color: white; font-size: 8px; font-weight: 900; padding: 1px 6px; border-radius: 999px;">POPULAR</div>
          <div style="font-size: 20px; color: #FF5722; margin: 4px 0 2px;"><i class="fa-solid fa-bolt"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #0F172A; line-height: 1.2;">Instant UPI</div>
          <div style="font-size: 9px; color: #059669; font-weight: 700;">Auto Credit</div>
        </div>
        <div class="deposit-method-card" id="depMethodCard_bank" onclick="selectDepositMethod('bank')" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
          <div style="font-size: 20px; color: #0F172A; margin: 4px 0 2px;"><i class="fa-solid fa-building-columns"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #0F172A; line-height: 1.2;">Bank</div>
          <div style="font-size: 9px; color: #64748B;">IMPS / NEFT</div>
        </div>
        <div class="deposit-method-card" id="depMethodCard_qr" onclick="selectDepositMethod('qr')" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
          <div style="font-size: 20px; color: #FF5722; margin: 4px 0 2px;"><i class="fa-solid fa-qrcode"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #0F172A; line-height: 1.2;">UPI / QR</div>
          <div style="font-size: 9px; color: #64748B;">Scan & Pay</div>
        </div>
        <div class="deposit-method-card" id="depMethodCard_usdt" onclick="selectDepositMethod('usdt')" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
          <div style="font-size: 20px; color: #059669; margin: 4px 0 2px;"><i class="fa-brands fa-ethereum"></i></div>
          <div style="font-size: 11px; font-weight: 800; color: #0F172A; line-height: 1.2;">USDT</div>
          <div style="font-size: 9px; color: #059669; font-weight: 700;">TRC-20</div>
        </div>
      </div>

      <!-- Dynamic Payment Details Box -->
      <div id="depositMethodContentWrap" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 18px; margin-bottom: 16px;">
        <!-- UPI Details Panel -->
        <div id="depPanel_upi">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div>
              <div style="font-size: 14px; font-weight: 800; color: #0F172A;" id="depUpiTitle">UPI / QR Details</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
                Account Holder: <strong id="depUpiHolder" style="color: #0F172A;">Lucifer Finer Solutions Private Limited</strong>
              </div>
            </div>
            <span style="background: #ECFDF5; color: #059669; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 999px;">Verified</span>
          </div>

          <div style="background: #FFF8F5; border: 1.5px dashed #FDBA74; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <div>
              <span style="font-size: 10px; color: #9A3412; text-transform: uppercase; font-weight: 800; display: block;">UPI ID</span>
              <code id="depUpiIdText" style="font-size: 14px; font-weight: 800; color: #FF5722;">yourbachatpay@kotak</code>
            </div>
            <button type="button" onclick="copyTextToClipboard(document.getElementById('depUpiIdText').innerText)" style="background: #FF5722; color: #FFFFFF; border: none; border-radius: 8px; padding: 7px 14px; font-size: 11.5px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>

          <!-- Dynamic QR Code Card -->
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 16px; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 10px;">
              <i class="fa-solid fa-qrcode" style="color: #FF5722;"></i> Scan this QR with GPay, PhonePe or Paytm
            </div>
            <div style="display: inline-block; background: white; padding: 10px; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              <img id="depDynamicQrImg" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi%3A%2F%2Fpay%3Fpa%3Dyourbachatpay%40kotak%26pn%3DLucifer%2520Finer%2520Solutions%26am%3D1000%26cu%3DINR" style="width: 170px; height: 170px; object-fit: contain; display: block;" alt="UPI QR">
            </div>
            <div style="margin-top: 8px; font-size: 12.5px; font-weight: 800; color: #0F172A;" id="depQrAmountLabel">
              Paying Amount: <span style="color:#059669;">₹1,000</span>
            </div>
            <div style="font-size: 10px; color: #64748B; font-family: monospace; margin-top: 2px;">TID: 68359529</div>
          </div>
        </div>

        <!-- Bank Transfer Details Panel -->
        <div id="depPanel_bank" style="display: none;">
          <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">Bank Account Transfer Details</div>
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
                <code id="depBankAccountNo" style="font-size:14px; font-weight:800; color:#FF5722;">983420192841</code>
                <button type="button" onclick="copyTextToClipboard(document.getElementById('depBankAccountNo').innerText)" style="background:#FFF3E0; border:1px solid #FFCC80; color:#FF5722; border-radius:6px; padding:4px 8px; font-size:11px; font-weight:800; cursor:pointer;"><i class="fa-regular fa-copy"></i> Copy</button>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #F1F5F9;">
              <span style="color:#64748B;">IFSC Code:</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <code id="depBankIfsc" style="font-size:14px; font-weight:800; color:#FF5722;">KKBK0000958</code>
                <button type="button" onclick="copyTextToClipboard(document.getElementById('depBankIfsc').innerText)" style="background:#FFF3E0; border:1px solid #FFCC80; color:#FF5722; border-radius:6px; padding:4px 8px; font-size:11px; font-weight:800; cursor:pointer;"><i class="fa-regular fa-copy"></i> Copy</button>
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
          <div style="font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 10px;">USDT (Tether) Deposit</div>
          <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 14px; text-align: center; margin-bottom: 12px;">
            <div style="font-size: 11px; color: #64748B; font-weight: 700;">USDT TRC-20 Address (Tron Network)</div>
            <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin: 8px 0; flex-wrap: wrap;">
              <code id="depUsdtAddress" style="font-size: 12px; font-weight: 800; color: #059669; word-break: break-all;">TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL</code>
              <button type="button" onclick="copyTextToClipboard(document.getElementById('depUsdtAddress').innerText)" style="background:#ECFDF5; border:1px solid #A7F3D0; color:#059669; border-radius:6px; padding:4px 10px; font-size:11px; font-weight:800; cursor:pointer;"><i class="fa-regular fa-copy"></i> Copy</button>
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #0F172A;" id="depUsdtEquivalent">
              Equivalent Amount: <span style="color:#059669;">~$10.81 USDT</span> (Rate: ₹92.50)
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
        <div style="font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
          <span style="width: 20px; height: 20px; border-radius: 50%; background: #FF5722; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900;">2</span>
          SUBMIT PAYMENT PROOF
        </div>

        <!-- UTR / Ref Number -->
        <div style="margin-bottom: 14px;">
          <label style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 4px;">
            12-Digit UTR / Transaction Reference Number <span style="color:#DC2626;">*</span>
          </label>
          <input type="text" id="depProofUtrInput" placeholder="e.g. 983749281726 or TxID" style="width: 100%; box-sizing: border-box; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 11px 12px; font-size: 14px; font-weight: 700; color: #0F172A; outline: none; font-family: monospace; background: #F8FAFC;">
        </div>

        <!-- Upload Screenshot Proof (Polished EasyPay Dropzone) -->
        <div style="margin-bottom: 16px;">
          <label style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; display: block; margin-bottom: 6px;">
            Upload Payment Receipt / Screenshot
          </label>
          <input type="file" id="depProofFileInput" accept="image/*" style="display: none;" onchange="handleDepositProofUpload(event)">
          <div onclick="document.getElementById('depProofFileInput').click()" style="border: 1.5px dashed #FDBA74; background: #FFF8F5; border-radius: 12px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #FF5722; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0;">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div style="min-width: 0;">
                <div style="font-size: 12.5px; font-weight: 800; color: #0F172A;">Tap to Choose Screenshot</div>
                <div id="depProofFileName" style="font-size: 11px; color: #64748B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">No file chosen (PNG / JPG)</div>
              </div>
            </div>
            <button type="button" id="depProofClearBtn" style="display: none; background: #FEE2E2; color: #DC2626; border: none; border-radius: 8px; padding: 6px 10px; font-size: 12px; font-weight: 800; cursor: pointer;" onclick="event.stopPropagation(); clearDepositProof();">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div id="depProofPreviewWrap" style="display: none; margin-top: 10px; width: 100%; height: 130px; border-radius: 12px; border: 1.5px solid #E2E8F0; overflow: hidden; background: #FFFFFF;">
            <img id="depProofPreviewImg" src="" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
        </div>

        <!-- Submit Button -->
        <button type="button" style="width: 100%; padding: 14px; border-radius: 14px; border: none; background: linear-gradient(135deg, #FF5722, #FF7043); color: #FFFFFF; font-size: 15px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(255,87,34,0.28);" onclick="submitDepositRequestFlow()">
          <i class="fa-solid fa-circle-check"></i> Submit Deposit Request
        </button>
      </div>
    </div>
  </div>

`;

app = app.slice(0, addStart) + newDedicatedAddFundsHtml + app.slice(addEnd);

// Update openModal / closeModal to support full-page view-panels (addMoneyModal, bondBookingModal) seamlessly
const oldOpenModal = `    function openModal(id) {
      if (id === 'ecommerceCheckoutModal') {
        if (typeof openEcommerceCheckoutView === 'function') {
          openEcommerceCheckoutView();
        }
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.add('active');
      el.style.display = 'flex';
    }
    function closeModal(id) {
      if (id === 'ecommerceCheckoutModal') {
        if (typeof closeEcommerceCheckoutView === 'function') {
          closeEcommerceCheckoutView();
        }
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active');
      el.style.display = 'none';
    }`;
const newOpenModal = `    function openModal(id) {
      if (id === 'ecommerceCheckoutModal') {
        if (typeof openEcommerceCheckoutView === 'function') {
          openEcommerceCheckoutView();
        }
        return;
      }
      if (id === 'addMoneyModal') {
        if (typeof openAddFundsModal === 'function') {
          openAddFundsModal();
          return;
        }
      }
      const el = document.getElementById(id);
      if (!el) return;
      if (el.classList.contains('view-panel')) {
        pushAppNavState(id);
        el.style.display = 'block';
        window.scrollTo(0, 0);
      } else {
        el.classList.add('active');
        el.style.display = 'flex';
      }
    }
    function closeModal(id) {
      if (id === 'ecommerceCheckoutModal') {
        if (typeof closeEcommerceCheckoutView === 'function') {
          closeEcommerceCheckoutView();
        }
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active');
      el.style.display = 'none';
    }`;
const omStart = app.indexOf('function openModal(id) {');
const cmIdx = app.indexOf('function closeModal(id) {');
const omEnd = app.indexOf('}', app.indexOf("el.classList.remove('active');", cmIdx)) + 1;
if (omStart === -1 || cmIdx === -1 || omEnd <= omStart) throw new Error('openModal/closeModal markers not found: ' + omStart + ',' + cmIdx + ',' + omEnd);
app = app.slice(0, omStart) + newOpenModal.trimStart() + app.slice(omEnd);

// Update openAddFundsModal + setAddFundsAmount + selectDepositMethod + submitDepositRequestFlow colors & history sync
app = app.replace(
  `      selectDepositMethod('upi');
      updateAddFundsQrDynamic();
      openModal('addMoneyModal');`,
  `      pushAppNavState('addMoneyModal');
      selectDepositMethod('upi');
      updateAddFundsQrDynamic();
      const addPage = document.getElementById('addMoneyModal');
      if (addPage) addPage.style.display = 'block';
      window.scrollTo(0, 0);`
);

app = app.replace(
  `        btn.style.background = '#F5F3FF';
        btn.style.borderColor = '#6D28D9';
        btn.style.color = '#6D28D9';`,
  `        btn.style.background = '#FFF3E0';
        btn.style.borderColor = '#FF5722';
        btn.style.color = '#FF5722';`
);

app = app.replace(
  "el.style.border = '2px solid #6D28D9';",
  "el.style.border = '2px solid #FF5722';"
);

// Add pending deposit transaction to appData.transactions immediately on submitDepositRequestFlow
app = app.replace(
  `          closeModal('addMoneyModal');
          clearDepositProof();
          if (utrInput) utrInput.value = '';`,
  `          if (!appData.transactions) appData.transactions = [];
          appData.transactions.unshift({
            id: data.deposit.id,
            title: 'Wallet Deposit Request (' + (methodNames[selectedDepositMethod] || 'UPI') + ')',
            category: 'Wallet',
            amount: amount,
            type: 'WALLET_ADD',
            status: 'PENDING',
            utr: utr,
            timestamp: new Date().toISOString()
          });
          if (typeof renderTransactions === 'function') renderTransactions();
          closeModal('addMoneyModal');
          clearDepositProof();
          if (utrInput) utrInput.value = '';`
);

// Update popstate handler to also close addMoneyModal & bondBookingModal when open as view-panel
app = app.replace(
  `if (isVis('viewLuckyDrawDedicated')) { closeLuckyDrawDedicatedPage(); return; }`,
  `if (isVis('addMoneyModal')) { closeModal('addMoneyModal'); return; }
        if (isVis('bondBookingModal')) { closeModal('bondBookingModal'); return; }
        if (isVis('viewLuckyDrawDedicated')) { closeLuckyDrawDedicatedPage(); return; }`
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
console.log('Successfully updated public/app.html and public/index.html!');
