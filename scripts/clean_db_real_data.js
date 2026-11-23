const fs = require('fs');

const db = JSON.parse(fs.readFileSync('server/db.json', 'utf8'));

// 1. Clean transactions: remove repetitive dummy entries
const cleanTransactions = [];
const seenKeys = new Set();

// Ensure existing genuine transactions
if (Array.isArray(db.transactions)) {
  for (const t of db.transactions) {
    // Skip old fake duplicates
    if (t.title === 'Received from arman khan' || t.title === 'Paid to Rahul Sharma') {
      continue;
    }
    // Update any reference from arman khan to Nirod Behera
    if (t.title && t.title.includes('arman khan')) {
      t.title = t.title.replace(/arman khan/g, 'Nirod Behera');
    }
    if (t.fromUser === 'arman khan') t.fromUser = 'Nirod Behera';
    if (t.toUser === 'arman khan') t.toUser = 'Nirod Behera';
    if (t.userMobile === '7013893165') t.userMobile = '9876548808';

    // Ensure valid timestamp
    if (!t.timestamp || t.timestamp === 'Just now') {
      t.timestamp = new Date(Date.now() - cleanTransactions.length * 3600000).toISOString();
    }

    const key = `${t.title}_${t.amount}_${t.type}`;
    if (!seenKeys.has(key) || t.type === 'SHOPPING') {
      seenKeys.add(key);
      cleanTransactions.push(t);
    }
  }
}

// Add a few authentic diverse transactions for Nirod Behera
cleanTransactions.unshift(
  {
    id: 'TXN_98241029',
    title: 'EasyPay Mall Order Confirmed (ORD-144901)',
    amount: -3697,
    type: 'SHOPPING',
    category: 'Shopping',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    utr: 'EPY_ORD_144901',
    userId: 'EPY98808',
    userName: 'Nirod Behera',
    userMobile: '9876548808'
  },
  {
    id: 'TXN_98152011',
    title: 'Instant Cashback Credited - Hubble Vouchers',
    amount: 120,
    type: 'CREDIT',
    category: 'Cashback',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    utr: 'EPY_CBK_829104',
    userId: 'EPY98808',
    userName: 'Nirod Behera',
    userMobile: '9876548808'
  },
  {
    id: 'TXN_98091823',
    title: 'Money Added via PhonePe UPI',
    amount: 5000,
    type: 'WALLET_ADD',
    category: 'Wallet',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    utr: 'UPI_980918234190',
    userId: 'EPY98808',
    userName: 'Nirod Behera',
    userMobile: '9876548808'
  },
  {
    id: 'TXN_97981244',
    title: 'Amazon Shopping Gift Voucher Issued',
    amount: -96,
    type: 'GIFT_CARD',
    category: 'Gift Card',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    utr: 'EPY_HB_AMZ96',
    userId: 'EPY98808',
    userName: 'Nirod Behera',
    userMobile: '9876548808'
  },
  {
    id: 'TXN_97812903',
    title: 'Reliance Jio 5G Prepaid Recharge',
    amount: -299,
    type: 'RECHARGE',
    category: 'Recharge',
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
    utr: 'EPY_RCG_JIO299',
    userId: 'EPY98808',
    userName: 'Nirod Behera',
    userMobile: '9876548808'
  }
);

db.transactions = cleanTransactions;

// 2. Update orders to belong to Nirod Behera
if (Array.isArray(db.orders)) {
  db.orders.forEach(o => {
    o.userId = 'EPY98808';
    o.userName = 'Nirod Behera';
    o.userMobile = '9876548808';
    if (o.shippingAddress) {
      o.shippingAddress.name = 'Nirod Behera';
      o.shippingAddress.phone = '9876548808';
    }
  });
}

// 3. Ensure users array has full realistic profiles with passwords, PINs, downline/referrals
if (Array.isArray(db.users)) {
  db.users.forEach((u, idx) => {
    u.password = u.password || 'EasyPay@' + (u.mobile ? u.mobile.slice(-4) : '2026');
    u.securityPin = u.securityPin || '1234';
    u.mpin = u.securityPin;
    u.kycStatus = u.kycStatus || 'VERIFIED';
    u.registeredAt = u.registeredAt || new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString();
    u.referralCode = 'REF_' + (u.id || ('EPY' + (idx + 1)));
    u.referredBy = idx === 0 ? 'SYSTEM' : 'EPY98808'; // Linked under Nirod Behera!
  });

  // Nirod Behera has the referrals
  const nirod = db.users.find(u => u.mobile === '9876548808' || u.id === 'EPY98808');
  if (nirod) {
    nirod.downlineCount = db.users.length - 1;
    nirod.totalDeposits = 15000;
    nirod.totalTransfers = 4500;
    nirod.totalShopping = 8893;
    nirod.totalVouchers = 480;
    nirod.totalLottery = 250;
  }
}

// 4. Products: add multiple angles images array
if (Array.isArray(db.products)) {
  db.products.forEach(p => {
    if (!Array.isArray(p.images) || p.images.length === 0) {
      const primary = p.image || p.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
      p.image = primary;
      p.img = primary;
      // Add angle 2 and angle 3
      p.images = [
        primary,
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60'
      ];
    }
  });
}

fs.writeFileSync('server/db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully cleaned server/db.json with real transactions and rich user profiles!');
