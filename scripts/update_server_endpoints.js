const fs = require('fs');

let server = fs.readFileSync('server/server.js', 'utf8');

// Target the /api/admin/user-details block and replace with 100% dynamic calculations
const oldUserDetailsStart = "  if (url.startsWith('/api/admin/user-details') && req.method === 'GET') {";
const nextEndpoint = "  // API: Admin Add New Product";

const startIndex = server.indexOf(oldUserDetailsStart);
const endIndex = server.indexOf(nextEndpoint);

if (startIndex !== -1 && endIndex !== -1) {
  const newEndpointsCode = `  // API: Admin Comprehensive User Details Dossier (100% Dynamic per individual user)
  if (url.startsWith('/api/admin/user-details') && req.method === 'GET') {
    const parsed = new URL('http://localhost' + url);
    const userId = parsed.searchParams.get('id');
    const data = readDb();
    const users = data.users || [];
    const targetUser = users.find(u => u.id === userId || u.mobile === userId) || (data.user && (data.user.id === userId || data.user.mobile === userId) ? data.user : null);

    if (!targetUser) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'User not found' }));
      return;
    }

    const allTxns = data.transactions || [];
    const allOrders = data.orders || [];
    const allVouchers = data.vouchers || [];
    const allTickets = (data.luckyDraw && data.luckyDraw.tickets) || [];

    // Filter strictly for this specific individual user
    const userTxns = allTxns.filter(t => 
      t.userId === targetUser.id || 
      t.userMobile === targetUser.mobile
    );

    const userOrders = allOrders.filter(o => 
      o.userId === targetUser.id || 
      o.userMobile === targetUser.mobile ||
      (o.shippingAddress && o.shippingAddress.phone === targetUser.mobile)
    );

    const userVouchers = allVouchers.filter(v => 
      v.userId === targetUser.id || 
      v.userMobile === targetUser.mobile
    );

    const userTickets = allTickets.filter(tk => 
      tk.userId === targetUser.id || 
      tk.userMobile === targetUser.mobile
    );

    // Downline referrals: strictly users referred by this specific user
    const downline = users.filter(u => u.id !== targetUser.id && (u.referredBy === targetUser.id || u.referredBy === targetUser.referralCode));

    // Dynamic totals calculation
    const totalDeposits = userTxns
      .filter(t => t.type === 'WALLET_ADD' || t.type === 'CREDIT' || t.category === 'Wallet')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const totalShopping = userOrders
      .reduce((sum, o) => sum + (Number(o.total || o.totalAmount || o.amount) || 0), 0);

    const totalVouchers = userVouchers
      .reduce((sum, v) => sum + (Number(v.value || v.amount || v.price) || 0), 0);

    const totalRecharges = userTxns
      .filter(t => t.category === 'Recharge' || t.type === 'RECHARGE')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const totalLottery = userTickets
      .reduce((sum, tk) => sum + (Number(tk.price || tk.ticketPrice) || 50), 0);

    const totalSent = userTxns
      .filter(t => t.type === 'UPI_DEBIT' || t.type === 'DEBIT' || t.type === 'CHECKOUT')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const totalReceived = userTxns
      .filter(t => t.type === 'UPI_CREDIT')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const isActivated = targetUser.isActivated !== false && (totalDeposits > 0 || (targetUser.walletBalance || 0) > 0);
    const userStatus = targetUser.status || (isActivated ? 'ACTIVE' : 'NOT_ACTIVE');

    const dossier = {
      user: {
        id: targetUser.id,
        name: targetUser.name || ((targetUser.firstName || '') + ' ' + (targetUser.lastName || '')).trim(),
        firstName: targetUser.firstName || targetUser.name.split(' ')[0],
        lastName: targetUser.lastName || targetUser.name.split(' ').slice(1).join(' '),
        mobile: targetUser.mobile,
        email: targetUser.email || (targetUser.mobile + '@easypay.in'),
        pincode: targetUser.pincode || '400001',
        city: targetUser.city || 'Mumbai',
        password: targetUser.password || 'EasyPay@' + targetUser.mobile.slice(-4),
        securityPin: targetUser.securityPin || targetUser.mpin || '1234',
        mpin: targetUser.mpin || targetUser.securityPin || '1234',
        walletBalance: targetUser.walletBalance || 0,
        payId: targetUser.payId || (targetUser.mobile + '@easypay'),
        kycStatus: targetUser.kycStatus || 'PENDING',
        isActivated: isActivated,
        status: userStatus,
        profilePicture: targetUser.profilePicture || '',
        bankName: targetUser.bankName || 'Not Linked',
        bankAccountMasked: targetUser.bankAccountMasked || 'None',
        registeredAt: targetUser.registeredAt || '2026-11-20T10:00:00.000Z',
        referralCode: targetUser.referralCode || ('REF_' + targetUser.id),
        referredBy: targetUser.referredBy || 'SYSTEM'
      },
      stats: {
        walletBalance: targetUser.walletBalance || 0,
        totalDeposits: totalDeposits,
        totalShopping: totalShopping,
        totalVouchers: totalVouchers,
        totalRecharges: totalRecharges,
        totalLottery: totalLottery,
        totalTransfersSent: totalSent,
        totalTransfersReceived: totalReceived,
        downlineCount: downline.length,
        isActivated: isActivated,
        status: userStatus
      },
      downline: downline,
      transactions: userTxns,
      orders: userOrders,
      vouchers: userVouchers
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, dossier }));
    return;
  }

  // API: Get Platform Payment Settings (Admin Configured UPI, Bank, Cash, USDT)
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
  }

  // API: User Add Funds / Submit Deposit Request
  if (url === '/api/deposit/request' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.depositRequests) data.depositRequests = [];

        const newDep = {
          id: 'DEP_' + Date.now().toString().slice(-6),
          timestamp: new Date().toISOString(),
          userId: payload.userId || 'EPY98808',
          userName: payload.userName || 'Nirod Behera',
          userMobile: payload.userMobile || '9876548808',
          amount: parseFloat(payload.amount) || 1000,
          method: payload.method || 'Instant UPI',
          utr: payload.utr || ('UTR_' + Math.floor(1000000000 + Math.random() * 9000000000)),
          screenshot: payload.screenshot || '',
          status: 'PENDING',
          notes: payload.notes || 'Wallet deposit request submitted by user'
        };

        data.depositRequests.unshift(newDep);
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, deposit: newDep }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Get All Deposit Requests (Admin)
  if (url === '/api/admin/deposit-requests' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      requests: data.depositRequests || []
    }));
    return;
  }

  // API: Admin Approve Deposit Request
  if (url === '/api/admin/deposit-requests/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        const reqList = data.depositRequests || [];
        const dep = reqList.find(r => r.id === id);

        if (!dep) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Deposit request not found' }));
          return;
        }

        dep.status = 'APPROVED';
        dep.approvedAt = new Date().toISOString();

        // Credit to target user wallet and activate account
        const users = data.users || [];
        const u = users.find(usr => usr.id === dep.userId || usr.mobile === dep.userMobile);
        if (u) {
          u.walletBalance = (Number(u.walletBalance) || 0) + Number(dep.amount);
          u.isActivated = true;
          u.status = 'ACTIVE';
        }
        if (data.user && (data.user.id === dep.userId || data.user.mobile === dep.userMobile)) {
          data.user.walletBalance = (Number(data.user.walletBalance) || 0) + Number(dep.amount);
          data.user.isActivated = true;
          data.user.status = 'ACTIVE';
        }

        // Add real transaction to ledger
        if (!data.transactions) data.transactions = [];
        const newTxn = {
          id: 'TXN_' + Date.now().toString().slice(-6),
          userId: dep.userId,
          userMobile: dep.userMobile,
          timestamp: new Date().toISOString(),
          title: 'Wallet Deposit Approved (' + dep.method + ')',
          category: 'Wallet',
          amount: Number(dep.amount),
          type: 'WALLET_ADD',
          status: 'SUCCESS',
          utr: dep.utr || ('UTR_' + Date.now().toString().slice(-8))
        };
        data.transactions.unshift(newTxn);

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          deposit: dep,
          updatedWallet: u ? u.walletBalance : (data.user ? data.user.walletBalance : dep.amount)
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Admin Reject Deposit Request
  if (url === '/api/admin/deposit-requests/reject' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id, reason } = JSON.parse(body || '{}');
        const data = readDb();
        const reqList = data.depositRequests || [];
        const dep = reqList.find(r => r.id === id);

        if (!dep) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Deposit request not found' }));
          return;
        }

        dep.status = 'REJECTED';
        dep.rejectedAt = new Date().toISOString();
        dep.rejectReason = reason || 'Invalid transaction reference or proof';
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, deposit: dep }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: User Profile Update (Profile Picture, Name, etc.)
  if (url === '/api/user/profile' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        const userId = payload.id || (data.user ? data.user.id : 'EPY98808');
        const users = data.users || [];
        const u = users.find(usr => usr.id === userId || usr.mobile === payload.mobile);

        if (u) {
          Object.assign(u, payload);
        }
        if (data.user && (data.user.id === userId || data.user.mobile === payload.mobile)) {
          Object.assign(data.user, payload);
        }
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: u || data.user }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

`;

  server = server.slice(0, startIndex) + newEndpointsCode + server.slice(endIndex);
  fs.writeFileSync('server/server.js', server, 'utf8');
  console.log('Successfully updated server/server.js with dynamic user dossier and deposit endpoints!');
} else {
  console.log('Could not find anchor indexes in server/server.js');
}
