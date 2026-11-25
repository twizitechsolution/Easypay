const fs = require('fs');

let srv = fs.readFileSync('server/server.js', 'utf8');

// 1. Add Automatic 12:00 AM Midnight Daily Interest Engine helper + catch-up
const dailyInterestEngineCode = `
// ==============================================================
// AUTOMATIC 12:00 AM MIDNIGHT DAILY INTEREST CREDITOR
// ==============================================================
function getLocalDateStr(d) {
  const dt = d ? new Date(d) : new Date();
  // Format in IST (+05:30) as YYYY-MM-DD
  const ist = new Date(dt.getTime() + (5.5 * 60 * 60 * 1000));
  return ist.toISOString().slice(0, 10);
}

function creditDailyInvestmentInterest(forceTest) {
  try {
    const data = readDb();
    const todayStr = getLocalDateStr(new Date());
    const investments = data.investments || [];
    const users = data.users || [];
    let changed = false;

    investments.forEach(inv => {
      if (inv.status !== 'ACTIVE') return;
      const principal = Number(inv.principal || 0);
      const rate = Number(inv.monthlyRate || inv.interestRate || 8.6);
      const dailyPayout = Number(inv.dailyPayout || Math.round(((principal * rate / 100) / 30) * 100) / 100);
      if (dailyPayout <= 0) return;

      if (!inv.lastInterestDate) {
        inv.lastInterestDate = todayStr;
        changed = true;
        if (!forceTest) return;
      }

      const lastMs = new Date(inv.lastInterestDate + 'T00:00:00Z').getTime();
      const todayMs = new Date(todayStr + 'T00:00:00Z').getTime();
      let daysElapsed = Math.floor((todayMs - lastMs) / (24 * 60 * 60 * 1000));
      if (forceTest && daysElapsed < 1) daysElapsed = 1;

      if (daysElapsed >= 1) {
        const creditAmt = Math.round((dailyPayout * daysElapsed) * 100) / 100;
        const cleanInvMob = (inv.userMobile || '').replace(/\\D/g, '').slice(-10);
        const owner = users.find(u => u.id === inv.userId || (cleanInvMob && u.mobile === cleanInvMob));
        if (owner) {
          owner.walletBalance = Math.round(((Number(owner.walletBalance) || 0) + creditAmt) * 100) / 100;
        }
        if (data.user && (!owner || data.user.id === owner.id || data.user.mobile === (owner && owner.mobile))) {
          data.user.walletBalance = Math.round(((Number(data.user.walletBalance) || 0) + creditAmt) * 100) / 100;
        }

        if (!data.transactions) data.transactions = [];
        data.transactions.unshift({
          id: 'TXN_INT_' + Date.now().toString().slice(-7) + '_' + Math.floor(Math.random() * 100),
          userId: owner ? owner.id : (inv.userId || 'EPY98808'),
          userMobile: owner ? owner.mobile : (cleanInvMob || '9876548808'),
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          title: 'Daily Interest Credit - ' + (inv.institution || 'FD Plan'),
          category: 'Interest Credit',
          amount: creditAmt,
          type: 'CREDIT',
          status: 'SUCCESS',
          utr: 'INT_' + todayStr.replace(/-/g, ''),
          icon: '/assets/bachatpay/history/credit_history.png'
        });

        inv.lastInterestDate = todayStr;
        inv.totalInterestCredited = Math.round(((Number(inv.totalInterestCredited) || 0) + creditAmt) * 100) / 100;
        changed = true;
      }
    });

    if (changed) writeDb(data);
    return changed;
  } catch (e) {
    console.warn('Daily interest cron error:', e.message);
    return false;
  }
}

// Run at startup and every 60 seconds to catch 12:00 AM midnight rollover automatically
setTimeout(() => creditDailyInvestmentInterest(false), 1500);
setInterval(() => creditDailyInvestmentInterest(false), 60000);
`;

const serverCreateAnchor = 'const server = http.createServer(requestHandler);';
if (!srv.includes(serverCreateAnchor)) throw new Error('serverCreateAnchor not found');
srv = srv.replace(serverCreateAnchor, () => dailyInterestEngineCode + '\n' + serverCreateAnchor);

// Also run creditDailyInvestmentInterest(false) when /api/data is fetched
const apiDataAnchor = "  if (url === '/api/data' && req.method === 'GET') {";
if (srv.includes(apiDataAnchor)) {
  srv = srv.replace(apiDataAnchor, () => apiDataAnchor + '\n    creditDailyInvestmentInterest(false);');
}

// 2. Replace /api/invest/book (and add /api/bonds/book alias) with real wallet deduction & validation
const oldInvestStart = "  // API: Book Bond / FD Investment (Monthly Frame with Daily Payouts)\n  if (url === '/api/invest/book' && req.method === 'POST') {";
const oldInvestEnd = "  // ==============================================================\n  // COMPREHENSIVE ADMIN MANAGEMENT APIS (CRUD & APP ORCHESTRATION)";
const invS = srv.indexOf(oldInvestStart);
const invE = srv.indexOf(oldInvestEnd);
if (invS === -1 || invE === -1) throw new Error('invest block markers not found');

const newInvestBlock = `  // API: Book Bond / FD / RD Investment (Real Wallet Deduction + Daily 12:00 AM Interest)
  if ((url === '/api/invest/book' || url === '/api/bonds/book') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { bondId, planId, title, rate, amount, tenureMonths, userId, userMobile } = JSON.parse(body || '{}');
        const data = readDb();
        const targetId = bondId || planId || 'suryoday_fd';
        const bond = (data.bonds || []).find(b => b.id === targetId) || {
          id: targetId,
          title: title || 'Suryoday SF Bank FD',
          monthlyRate: parseFloat(rate) || 8.60,
          category: targetId.includes('rd') ? 'Recurring Deposit' : (targetId.includes('bond') ? 'Senior Secured Bond' : 'Fixed Deposit')
        };

        const principal = parseFloat(amount) || 0;
        if (principal < 1000) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Minimum investment amount is ₹1,000' }));
          return;
        }

        const users = data.users || [];
        const cleanMob = (userMobile || '').replace(/\\D/g, '').slice(-10);
        const u = users.find(usr => (userId && usr.id === userId) || (cleanMob && usr.mobile === cleanMob)) || data.user;
        const currentBal = u ? Number(u.walletBalance || 0) : Number((data.user && data.user.walletBalance) || 0);

        if (currentBal < principal) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Insufficient E-Pay Wallet balance (Available: ₹' + currentBal.toLocaleString('en-IN') + ')' }));
          return;
        }

        const newBal = Math.round((currentBal - principal) * 100) / 100;
        if (u) u.walletBalance = newBal;
        if (data.user && (!u || data.user.id === u.id || data.user.mobile === u.mobile)) {
          data.user.walletBalance = newBal;
        }

        const monthlyRate = parseFloat(rate) || parseFloat(bond.monthlyRate || bond.newRate || 8.60);
        const months = parseInt(tenureMonths) || 6;
        const monthlyInterest = Math.round(((principal * monthlyRate) / 100) * 100) / 100;
        const dailyPayout = Math.round((monthlyInterest / 30) * 100) / 100;
        const totalInterest = Math.round(monthlyInterest * months);
        const maturityAmount = Math.round(principal + totalInterest);

        const todayStr = getLocalDateStr(new Date());
        const bookingDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const matDateObj = new Date();
        matDateObj.setMonth(matDateObj.getMonth() + months);
        const maturityDate = matDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const certNum = 'DICGC-EP-' + Math.floor(100000 + Math.random() * 900000);
        const folioNum = 'EP-FD-' + Math.floor(1000 + Math.random() * 9000);
        const planTitle = title || bond.title || 'Suryoday SF Bank FD';

        const newInvestment = {
          id: 'INV_BOND_' + Date.now().toString().slice(-6),
          institution: planTitle,
          bondId: bond.id,
          category: bond.category || 'Fixed Deposit',
          principal: principal,
          monthlyRate: monthlyRate,
          interestRate: monthlyRate,
          rateText: monthlyRate + '% per month',
          monthlyInterest: monthlyInterest,
          dailyPayout: dailyPayout,
          totalInterest: totalInterest,
          tenureMonths: months,
          maturityAmount: maturityAmount,
          bookingDate: bookingDate,
          maturityDate: maturityDate,
          lastInterestDate: todayStr,
          totalInterestCredited: 0,
          payoutFreq: 'Daily Auto-Credit at 12:00 AM',
          status: 'ACTIVE',
          dicgcInsured: true,
          certNumber: certNum,
          folioNumber: folioNum,
          userId: u ? u.id : 'EPY98808',
          userMobile: u ? u.mobile : '9876548808',
          userName: u ? u.name : 'Nirod Behera'
        };

        data.investments = data.investments || [];
        data.investments.unshift(newInvestment);

        const newTxn = {
          id: 'TXN_INV_' + Date.now().toString().slice(-7),
          userId: newInvestment.userId,
          userMobile: newInvestment.userMobile,
          title: planTitle + ' Investment',
          category: 'Investment',
          amount: principal,
          cashback: 0,
          timestamp: new Date().toISOString(),
          date: bookingDate,
          status: 'SUCCESS',
          type: 'INVESTMENT',
          utr: certNum,
          icon: '/assets/bachatpay/history/debit_history.png',
          details: {
            folioNumber: folioNum,
            certNumber: certNum,
            institution: planTitle,
            monthlyRate: monthlyRate + '% per month',
            dailyPayout: '₹' + dailyPayout + '/day',
            maturityAmount: maturityAmount,
            maturityDate: maturityDate,
            paymentMethod: 'E-Pay Wallet'
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(newTxn);

        if (u) u.dailyPayoutRate = Math.round(((Number(u.dailyPayoutRate) || 0) + dailyPayout) * 100) / 100;
        if (data.user) data.user.dailyPayoutRate = Math.round(((Number(data.user.dailyPayoutRate) || 0) + dailyPayout) * 100) / 100;
        if (data.analytics) data.analytics.totalGmv = (data.analytics.totalGmv || 0) + principal;

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          investment: newInvestment,
          transaction: newTxn,
          newBalance: newBal,
          dailyPayout: dailyPayout,
          monthlyInterest: monthlyInterest
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Trigger / Verify Midnight Daily Interest Payout
  if (url === '/api/investments/credit-daily-interest' && req.method === 'POST') {
    const credited = creditDailyInvestmentInterest(true);
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      credited,
      newBalance: data.user ? data.user.walletBalance : 0
    }));
    return;
  }

`;

srv = srv.slice(0, invS) + newInvestBlock + srv.slice(invE);

// 3. Include userWinningBalance in /api/luckydraw/info
const oldLdInfoResp = `      isUserEnrolled: userTickets.length > 0,
      userWalletBalance: (data.user && data.user.walletBalance) || 0
    }));`;
const newLdInfoResp = `      isUserEnrolled: userTickets.length > 0,
      userWalletBalance: (data.user && data.user.walletBalance) || 0,
      userWinningBalance: (() => {
        const winTxns = (data.transactions || []).filter(t => (t.category === 'Weekly Rewards' || (t.title || '').includes('Winner')) && (t.type === 'CREDIT' || t.type === 'WALLET_ADD'));
        return winTxns.reduce((s, t) => s + Number(t.amount || 0), 0) || ((ld.lastWinner && data.user && ld.lastWinner.userId === data.user.id) ? Number(ld.prizeAmount || 25000) : 0);
      })()
    }));`;
if (!srv.includes(oldLdInfoResp)) throw new Error('oldLdInfoResp not found');
srv = srv.replace(oldLdInfoResp, () => newLdInfoResp);

fs.writeFileSync('server/server.js', srv, 'utf8');
console.log('Successfully updated server/server.js!');
