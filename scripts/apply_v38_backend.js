const fs = require('fs');

// 1. Update server/db.json
const db = JSON.parse(fs.readFileSync('server/db.json', 'utf8'));

if (!Array.isArray(db.withdrawalRequests)) {
  db.withdrawalRequests = [];
}

if (!db.referralSettings) {
  db.referralSettings = {
    firstDepositBonusPercent: 5,
    levelCommissions: [5, 3, 2, 1.5, 1, 0.75, 0.5, 0.5, 0.25, 0.25]
  };
}

if (db.platformPaymentDetails && db.platformPaymentDetails.usdt) {
  if (!db.platformPaymentDetails.usdt.exchangeRateInr) {
    db.platformPaymentDetails.usdt.exchangeRateInr = 92.5;
  }
}

// Ensure db.user.paymentDetails exists for Nirod
const defaultSavedDetails = [
  {
    id: 'pay_detail_1',
    type: 'bank',
    bankName: 'Bank of India',
    accountMasked: '5108XXXXXXXX0975',
    accountRaw: '510810110000975',
    ifsc: 'BKID0005108',
    holderName: 'NIROD BEHERA',
    isPrimary: true
  },
  {
    id: 'pay_detail_2',
    type: 'upi',
    upiId: '9876548808@easypay',
    holderName: 'NIROD BEHERA',
    isPrimary: false
  },
  {
    id: 'pay_detail_3',
    type: 'usdt',
    usdtNetwork: 'TRC-20 (Tron)',
    usdtAddress: 'TXj4b9...89zKq2',
    usdtAddressRaw: 'TXj4b9A7vPq1WzK88L0sR89zKq2',
    isPrimary: false
  }
];

if (db.user && (!db.user.paymentDetails || db.user.paymentDetails.length === 0)) {
  db.user.paymentDetails = defaultSavedDetails;
}
if (Array.isArray(db.users)) {
  db.users.forEach(u => {
    if (u.id === 'EPY98808' && (!u.paymentDetails || u.paymentDetails.length === 0)) {
      u.paymentDetails = defaultSavedDetails;
    }
    if (u.referralEarnings === undefined) u.referralEarnings = 0;
    if (u.firstDepositBonusPaid === undefined) u.firstDepositBonusPaid = (u.status === 'ACTIVE');
  });
}

// Normalize vouchers so brand & purchasedAt & validTill are always populated
if (Array.isArray(db.vouchers)) {
  db.vouchers = db.vouchers.map(v => ({
    ...v,
    brand: v.brand || v.brandName || v.name || 'Amazon Pay',
    brandName: v.brandName || v.brand || v.name || 'Amazon Pay',
    voucherCode: v.voucherCode || v.code || ('EPY-VCH-' + Math.floor(10000 + Math.random() * 90000)),
    purchasedAt: v.purchasedAt || new Date().toISOString(),
    validTill: v.validTill || v.expiryDate || '2027-11-25'
  }));
}

fs.writeFileSync('server/db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Updated server/db.json');

// 2. Update server/server.js
let srv = fs.readFileSync('server/server.js', 'utf8');

// A. Update signup to resolve referralCode / sponsor ID cleanly
const oldSignupSponsor = `          referralCode: referralCode || ('EP' + Math.random().toString(36).substring(2, 7).toUpperCase()),`;
const newSignupSponsor = `          referralCode: 'REF_' + newId,
          referredBy: (() => {
            const ref = (referralCode || '').trim();
            if (!ref) return 'SYSTEM';
            const cleanRef = ref.replace(/^REF_/i, '');
            const sp = (data.users || []).find(usr => usr.id === cleanRef || usr.id === ref || usr.referralCode === ref);
            return sp ? sp.id : 'SYSTEM';
          })(),
          referralEarnings: 0,
          firstDepositBonusPaid: false,`;
if (!srv.includes(oldSignupSponsor)) throw new Error('oldSignupSponsor not found');
srv = srv.replace(oldSignupSponsor, () => newSignupSponsor);

// B. Update /api/admin/payment-settings GET & POST to include referralSettings and exchangeRateInr
const oldPaySettings = `  // API: Get Platform Payment Settings (Admin Configured UPI, Bank, Cash, USDT)
  if (url === '/api/admin/payment-settings' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      settings: data.platformPaymentDetails || {}
    }));
    return;
  }

  // API: Update Platform Payment Settings
  if (url === '/api/admin/payment-settings' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        data.platformPaymentDetails = {
          ...(data.platformPaymentDetails || {}),
          ...payload
        };
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, settings: data.platformPaymentDetails }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }`;

const newPaySettings = `  // API: Public Settings (USDT Exchange Rate & Referral Commission Rules)
  if (url === '/api/settings/public' && req.method === 'GET') {
    const data = readDb();
    const usdtRate = Number((data.platformPaymentDetails && data.platformPaymentDetails.usdt && data.platformPaymentDetails.usdt.exchangeRateInr) || 92.5);
    const referralSettings = data.referralSettings || {
      firstDepositBonusPercent: 5,
      levelCommissions: [5, 3, 2, 1.5, 1, 0.75, 0.5, 0.5, 0.25, 0.25]
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, usdtRate, referralSettings }));
    return;
  }

  // API: Get Platform Payment Settings (Admin Configured UPI, Bank, Cash, USDT)
  if (url === '/api/admin/payment-settings' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      settings: data.platformPaymentDetails || {},
      referralSettings: data.referralSettings || {
        firstDepositBonusPercent: 5,
        levelCommissions: [5, 3, 2, 1.5, 1, 0.75, 0.5, 0.5, 0.25, 0.25]
      }
    }));
    return;
  }

  // API: Update Platform Payment Settings (UPI, Bank, Cash, USDT Rate, Referral Commissions)
  if (url === '/api/admin/payment-settings' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        if (payload.referralSettings) {
          data.referralSettings = payload.referralSettings;
          delete payload.referralSettings;
        }
        data.platformPaymentDetails = {
          ...(data.platformPaymentDetails || {}),
          ...payload
        };
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          settings: data.platformPaymentDetails,
          referralSettings: data.referralSettings
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }`;

if (!srv.includes(oldPaySettings)) throw new Error('oldPaySettings not found');
srv = srv.replace(oldPaySettings, () => newPaySettings);

// C. Update /api/admin/deposit-requests/approve to trigger First Deposit Bonus (5% default) & 10-level commissions
const oldApproveDep = `        if (data.user && (data.user.id === dep.userId || data.user.mobile === dep.userMobile)) {
          data.user.walletBalance = (Number(data.user.walletBalance) || 0) + Number(dep.amount);
          data.user.isActivated = true;
          data.user.status = 'ACTIVE';
        }`;

const newApproveDep = `        const isFirstDeposit = u ? !u.firstDepositBonusPaid : false;
        if (u) u.firstDepositBonusPaid = true;

        if (data.user && (data.user.id === dep.userId || data.user.mobile === dep.userMobile)) {
          data.user.walletBalance = (Number(data.user.walletBalance) || 0) + Number(dep.amount);
          data.user.isActivated = true;
          data.user.status = 'ACTIVE';
          data.user.firstDepositBonusPaid = true;
        }

        // First Deposit Bonus & 10-Level Referral Commission Engine
        const refCfg = data.referralSettings || { firstDepositBonusPercent: 5, levelCommissions: [5, 3, 2, 1.5, 1, 0.75, 0.5, 0.5, 0.25, 0.25] };
        const depositAmt = Number(dep.amount) || 0;
        let currentSponsorId = u ? u.referredBy : null;
        let lvl = 1;
        while (currentSponsorId && currentSponsorId !== 'SYSTEM' && lvl <= 10) {
          const sponsor = users.find(usr => usr.id === currentSponsorId);
          if (!sponsor) break;

          // Level 1 gets First Deposit Bonus (default 5%) on user's first deposit
          if (lvl === 1 && isFirstDeposit) {
            const bonusPct = Number(refCfg.firstDepositBonusPercent || 5);
            const bonusAmt = Math.round((depositAmt * bonusPct / 100) * 100) / 100;
            if (bonusAmt > 0) {
              sponsor.walletBalance = (Number(sponsor.walletBalance) || 0) + bonusAmt;
              sponsor.referralEarnings = (Number(sponsor.referralEarnings) || 0) + bonusAmt;
              if (data.user && data.user.id === sponsor.id) {
                data.user.walletBalance = sponsor.walletBalance;
                data.user.referralEarnings = sponsor.referralEarnings;
              }
              if (!data.transactions) data.transactions = [];
              data.transactions.unshift({
                id: 'TXN_FDB_' + Date.now().toString().slice(-6) + '_' + lvl,
                userId: sponsor.id,
                userMobile: sponsor.mobile,
                timestamp: new Date().toISOString(),
                title: 'First Deposit Referral Bonus (' + bonusPct + '% from ' + (u.name || u.id) + ')',
                category: 'Referral Bonus',
                amount: bonusAmt,
                type: 'CREDIT',
                status: 'SUCCESS',
                utr: 'REF_' + Date.now().toString().slice(-8)
              });
            }
          }

          // 10-Level Commission distribution
          const lvlPct = Number((refCfg.levelCommissions && refCfg.levelCommissions[lvl - 1]) || 0);
          const commAmt = Math.round((depositAmt * lvlPct / 100) * 100) / 100;
          if (commAmt > 0 && !(lvl === 1 && isFirstDeposit)) {
            sponsor.walletBalance = (Number(sponsor.walletBalance) || 0) + commAmt;
            sponsor.referralEarnings = (Number(sponsor.referralEarnings) || 0) + commAmt;
            if (data.user && data.user.id === sponsor.id) {
              data.user.walletBalance = sponsor.walletBalance;
              data.user.referralEarnings = sponsor.referralEarnings;
            }
            if (!data.transactions) data.transactions = [];
            data.transactions.unshift({
              id: 'TXN_LVL_' + Date.now().toString().slice(-6) + '_' + lvl,
              userId: sponsor.id,
              userMobile: sponsor.mobile,
              timestamp: new Date().toISOString(),
              title: 'Level ' + lvl + ' Commission (' + lvlPct + '% from ' + (u.name || u.id) + ')',
              category: 'Level Income',
              amount: commAmt,
              type: 'CREDIT',
              status: 'SUCCESS',
              utr: 'LVL' + lvl + '_' + Date.now().toString().slice(-6)
            });
          }

          currentSponsorId = sponsor.referredBy;
          lvl++;
        }`;

if (!srv.includes(oldApproveDep)) throw new Error('oldApproveDep not found');
srv = srv.replace(oldApproveDep, () => newApproveDep);

// D. Add Withdrawal Request & 10-Level Referral Network APIs before the server listen block
const withdrawalAndReferralRoutes = `
  // ==============================================================
  // WITHDRAWAL REQUESTS API (To Bank / Self -> Admin Approval Flow)
  // ==============================================================
  if (url === '/api/withdrawal/request' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        const users = data.users || [];
        const u = users.find(usr => usr.id === payload.userId || usr.mobile === payload.userMobile);
        const amountInr = Number(payload.amountInr || 0);

        if (!amountInr || amountInr <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid withdrawal amount' }));
          return;
        }

        const currentBal = u ? Number(u.walletBalance || 0) : Number((data.user && data.user.walletBalance) || 0);
        if (amountInr > currentBal) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Insufficient E-Pay Wallet balance' }));
          return;
        }

        const newBal = Math.round((currentBal - amountInr) * 100) / 100;
        if (u) u.walletBalance = newBal;
        if (data.user && (!u || data.user.id === u.id || data.user.mobile === u.mobile)) {
          data.user.walletBalance = newBal;
        }

        if (!data.withdrawalRequests) data.withdrawalRequests = [];
        const wdrId = 'WDR_' + Date.now().toString().slice(-7);
        const txnId = 'TXN_WDR_' + Date.now().toString().slice(-6);
        const nowIso = new Date().toISOString();

        const withdrawal = {
          id: wdrId,
          transactionId: txnId,
          userId: u ? u.id : (payload.userId || 'EPY98808'),
          userName: u ? u.name : (payload.userName || 'Nirod Behera'),
          userMobile: u ? u.mobile : (payload.userMobile || '9876548808'),
          methodType: payload.methodType || 'bank',
          methodLabel: payload.methodLabel || 'Bank Transfer',
          destinationDetails: payload.destinationDetails || {},
          amountInr: amountInr,
          amountUsdt: payload.amountUsdt ? Number(payload.amountUsdt) : null,
          usdtRate: payload.usdtRate ? Number(payload.usdtRate) : null,
          note: payload.note || '',
          status: 'PENDING',
          createdAt: nowIso
        };
        data.withdrawalRequests.unshift(withdrawal);

        if (!data.transactions) data.transactions = [];
        const txn = {
          id: txnId,
          withdrawalId: wdrId,
          userId: withdrawal.userId,
          userMobile: withdrawal.userMobile,
          timestamp: nowIso,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          title: 'Withdrawal to ' + withdrawal.methodLabel,
          category: 'Withdrawal',
          amount: amountInr,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          utr: wdrId,
          icon: '/assets/bachatpay/history/debit_history.png'
        };
        data.transactions.unshift(txn);

        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, withdrawal, transaction: txn, newBalance: newBal }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (url === '/api/admin/withdrawal-requests' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, requests: data.withdrawalRequests || [] }));
    return;
  }

  if (url === '/api/admin/withdrawal-requests/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        const wdr = (data.withdrawalRequests || []).find(r => r.id === id);
        if (!wdr) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Withdrawal request not found' }));
          return;
        }
        wdr.status = 'APPROVED';
        wdr.approvedAt = new Date().toISOString();

        const txn = (data.transactions || []).find(t => t.withdrawalId === id || t.id === wdr.transactionId);
        if (txn) txn.status = 'SUCCESS';

        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, withdrawal: wdr }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (url === '/api/admin/withdrawal-requests/reject' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id, reason } = JSON.parse(body || '{}');
        const data = readDb();
        const wdr = (data.withdrawalRequests || []).find(r => r.id === id);
        if (!wdr) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Withdrawal request not found' }));
          return;
        }

        if (wdr.status !== 'REJECTED') {
          wdr.status = 'REJECTED';
          wdr.rejectedAt = new Date().toISOString();
          wdr.rejectionReason = reason || 'Rejected by Admin';

          // Mark user's transaction as FAILED and refund deducted amount
          const txn = (data.transactions || []).find(t => t.withdrawalId === id || t.id === wdr.transactionId);
          if (txn) txn.status = 'FAILED';

          const users = data.users || [];
          const u = users.find(usr => usr.id === wdr.userId || usr.mobile === wdr.userMobile);
          if (u) u.walletBalance = Math.round(((Number(u.walletBalance) || 0) + Number(wdr.amountInr)) * 100) / 100;
          if (data.user && (data.user.id === wdr.userId || data.user.mobile === wdr.userMobile)) {
            data.user.walletBalance = Math.round(((Number(data.user.walletBalance) || 0) + Number(wdr.amountInr)) * 100) / 100;
          }
        }

        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, withdrawal: wdr }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==============================================================
  // 10-LEVEL REFERRAL NETWORK API
  // ==============================================================
  if (url.startsWith('/api/referral/network') && req.method === 'GET') {
    try {
      const fullUrl = new URL('http://localhost' + req.url);
      const userIdParam = fullUrl.searchParams.get('userId');
      const mobileParam = fullUrl.searchParams.get('mobile');
      const data = readDb();
      const users = data.users || [];
      const me = users.find(u => (userIdParam && u.id === userIdParam) || (mobileParam && u.mobile === mobileParam)) || data.user || users[0];
      const myId = me ? me.id : 'EPY98808';

      const refCfg = data.referralSettings || {
        firstDepositBonusPercent: 5,
        levelCommissions: [5, 3, 2, 1.5, 1, 0.75, 0.5, 0.5, 0.25, 0.25]
      };

      const levels = [];
      let currentParentIds = [myId];
      let totalMembers = 0;
      let activeMembers = 0;

      for (let lvl = 1; lvl <= 10; lvl++) {
        const membersAtLevel = users.filter(u => currentParentIds.includes(u.referredBy));
        const mapped = membersAtLevel.map(m => {
          const isAct = m.status === 'ACTIVE' || (m.isActivated && Number(m.walletBalance || 0) > 0);
          if (isAct) activeMembers++;
          totalMembers++;
          return {
            id: m.id,
            name: m.name || ((m.firstName || '') + ' ' + (m.lastName || '')).trim(),
            mobile: m.mobile,
            status: isAct ? 'ACTIVE' : 'NOT_ACTIVE',
            registeredAt: m.registeredAt || new Date().toISOString()
          };
        });
        levels.push({
          level: lvl,
          commissionPercent: Number((refCfg.levelCommissions && refCfg.levelCommissions[lvl - 1]) || 0),
          count: mapped.length,
          members: mapped
        });
        currentParentIds = membersAtLevel.map(m => m.id);
      }

      const myRefTxns = (data.transactions || []).filter(t =>
        (t.userId === myId || (me && t.userMobile === me.mobile)) &&
        (t.category === 'Referral Bonus' || t.category === 'Level Income')
      );
      const computedEarnings = myRefTxns.reduce((acc, t) => acc + Number(t.amount || 0), 0);
      const totalEarnings = Math.max(Number((me && me.referralEarnings) || 0), computedEarnings);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        userId: myId,
        referralCode: (me && me.referralCode) || ('REF_' + myId),
        firstDepositBonusPercent: Number(refCfg.firstDepositBonusPercent || 5),
        levelCommissions: refCfg.levelCommissions || [5, 3, 2, 1.5, 1, 0.75, 0.5, 0.5, 0.25, 0.25],
        totalEarnings,
        totalMembers,
        activeMembers,
        levels
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }
`;

const staticAnchor = '  // Static File Serving & SPA Fallback';
if (!srv.includes(staticAnchor)) throw new Error('staticAnchor not found');
srv = srv.replace(staticAnchor, () => withdrawalAndReferralRoutes + '\n' + staticAnchor);

fs.writeFileSync('server/server.js', srv, 'utf8');
console.log('Successfully updated server/server.js!');
