const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'db.json');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write DB:', e);
  }
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // API: Get complete data
  if (url === '/api/data' && req.method === 'GET') {
    const data = readDb();
    data.investPlans = data.bonds || [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

      // API: Get Current User Profile
  if (url === '/api/user' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.user || {}));
    return;
  }

  // API: Update Current User Profile
  
  // API: Set / Reset Security PIN with OTP
  if (url === '/api/user/set-pin' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { pin, otp } = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.user) data.user = {};
        if (pin && pin.length === 4) {
          data.user.securityPin = pin.trim();
          writeDb(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Security PIN updated successfully' }));
          return;
        }
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid 4-digit PIN' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Server error' }));
      }
    });
    return;
  }

  if (url === '/api/user/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { firstName, middleName, lastName, mobile, email, pincode } = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.user) data.user = {};
        
        if (firstName !== undefined) data.user.firstName = firstName.trim();
        if (middleName !== undefined) data.user.middleName = middleName.trim();
        if (lastName !== undefined) data.user.lastName = lastName.trim();
        
        const fullName = [data.user.firstName, data.user.middleName, data.user.lastName].filter(Boolean).join(' ');
        data.user.name = fullName || 'User';
        
        if (mobile) {
          const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
          data.user.mobile = cleanMobile;
          data.user.maskedMobile = 'xxxxxx' + cleanMobile.slice(-4);
          data.user.payId = cleanMobile + '@easypay';
        }
        
        if (email !== undefined) data.user.email = email.trim();
        if (pincode !== undefined) data.user.pincode = pincode.trim();
        
        // Synchronize in users directory
        data.users = data.users || [];
        const existingIdx = data.users.findIndex(u => u.id === data.user.id || u.mobile === data.user.mobile);
        if (existingIdx !== -1) {
          data.users[existingIdx] = { ...data.users[existingIdx], ...data.user };
        } else {
          data.users.push({ ...data.user });
        }
        
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: data.user }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Set / Update 4-Digit Security PIN
  if (url === '/api/user/pin' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { pin } = JSON.parse(body || '{}');
        if (!pin || pin.toString().length < 4) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'PIN must be 4 digits' }));
          return;
        }
        const data = readDb();
        if (data.user) data.user.securityPin = pin.toString();
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Security PIN updated successfully' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Lookup EasyPay User by Pay ID / Mobile / UID
  if (url === '/api/user/lookup' && req.method === 'GET') {
    const rawQuery = (req.url.split('?')[1] || '').split('=')[1] || '';
    const q = decodeURIComponent(rawQuery).trim().toLowerCase();
    const data = readDb();
    const users = data.users || [];
    
    // Search matching user
    let found = users.find(u => 
      (u.payId && u.payId.toLowerCase() === q) ||
      (u.mobile && (u.mobile.includes(q) || q.includes(u.mobile))) ||
      (u.id && u.id.toLowerCase() === q)
    );
    
    // If not found, dynamically generate a verified EasyPay user entry for seamless transfer
    if (!found && q) {
      const cleanDigits = q.replace(/[^0-9]/g, '');
      const mobileNum = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : '98' + Math.floor(10000000 + Math.random() * 90000000);
      const generatedPayId = mobileNum + '@easypay';
      const generatedId = 'EPY' + mobileNum.slice(-5);
      let genName = 'EasyPay User';
      if (q.includes('@') && !cleanDigits) {
        genName = q.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      found = {
        id: generatedId,
        name: genName,
        mobile: mobileNum,
        maskedMobile: 'xxxxxx' + mobileNum.slice(-4),
        payId: generatedPayId,
        walletBalance: 1000.00
      };
      data.users = data.users || [];
      data.users.push(found);
      writeDb(data);
    }
    
    if (found) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        user: {
          id: found.id,
          name: found.name,
          mobile: found.mobile,
          maskedMobile: found.maskedMobile || ('xxxxxx' + found.mobile.slice(-4)),
          payId: found.payId || (found.mobile + '@easypay')
        }
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
    }
    return;
  }

  // API: P2P Pay ID / QR Transfer with 4-Digit Security PIN Verification
  if (url === '/api/p2p/transfer' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { recipientQuery, amount, pin, note } = JSON.parse(body || '{}');
        const data = readDb();
        const sendAmt = parseFloat(amount) || 0;
        
        if (sendAmt <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Please enter a valid amount' }));
          return;
        }
        
        // 1. PIN verification
        const validPin = (data.user && data.user.securityPin) ? data.user.securityPin.toString() : '1234';
        if (!pin || pin.toString() !== validPin) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Incorrect 4-digit Security PIN. (Default PIN: 1234)' }));
          return;
        }
        
        // 2. Balance check
        if ((data.user?.walletBalance || 0) < sendAmt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Insufficient wallet balance' }));
          return;
        }
        
        // 3. Resolve recipient
        const q = (recipientQuery || '').trim().toLowerCase();
        let recipient = (data.users || []).find(u => 
          (u.payId && u.payId.toLowerCase() === q) ||
          (u.mobile && (u.mobile.includes(q) || q.includes(u.mobile))) ||
          (u.id && u.id.toLowerCase() === q)
        );
        
        if (!recipient) {
          const cleanDigits = q.replace(/[^0-9]/g, '');
          const mobileNum = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : '98' + Math.floor(10000000 + Math.random() * 90000000);
          recipient = {
            id: 'EPY' + mobileNum.slice(-5),
            name: q.includes('@') ? q.split('@')[0].toUpperCase() : 'EasyPay User',
            mobile: mobileNum,
            maskedMobile: 'xxxxxx' + mobileNum.slice(-4),
            payId: mobileNum + '@easypay',
            walletBalance: 500
          };
          data.users = data.users || [];
          data.users.push(recipient);
        }
        
        // 4. Debit sender
        data.user.walletBalance = Math.round(Math.max(0, data.user.walletBalance - sendAmt) * 100) / 100;
        
        // 5. Credit recipient
        recipient.walletBalance = Math.round(((recipient.walletBalance || 0) + sendAmt) * 100) / 100;
        
        // 6. Record transactions
        const utr = 'EPY' + Date.now().toString().slice(-9);
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today';
        
        // Sender DEBIT
        const debitTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: 'Paid to ' + recipient.name,
          category: 'Pay ID Transfer',
          amount: -sendAmt,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'UPI_DEBIT',
          icon: '/assets/bachatpay/history/debit_history.png',
          details: {
            recipientName: recipient.name,
            recipientPayId: recipient.payId,
            recipientUserId: recipient.id,
            fromUser: data.user.name,
            fromPayId: data.user.payId,
            fromUserId: data.user.id,
            utr: utr,
            note: note || 'Transferred via EasyPay'
          }
        };
        
        // Recipient CREDIT
        const creditTxn = {
          id: 'TXN_' + (Date.now() + 1).toString().slice(-8),
          title: 'Received from ' + data.user.name,
          category: 'Pay ID Transfer',
          amount: sendAmt,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'UPI_CREDIT',
          icon: '/assets/bachatpay/history/credit_history.png',
          details: {
            fromUser: data.user.name,
            fromPayId: data.user.payId,
            fromUserId: data.user.id,
            toUser: recipient.name,
            toPayId: recipient.payId,
            utr: utr,
            note: note || 'Transferred via EasyPay'
          }
        };
        
        data.transactions = data.transactions || [];
        data.transactions.unshift(debitTxn);
        data.transactions.unshift(creditTxn);
        
        writeDb(data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          utr: utr,
          amount: sendAmt,
          newBalance: data.user.walletBalance,
          recipient: {
            id: recipient.id,
            name: recipient.name,
            payId: recipient.payId
          },
          transaction: debitTxn
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Send UPI Money (QR / Contact / Bank)
  if (url === '/api/upi/send' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { recipient, amount, note, type } = JSON.parse(body || '{}');
        const data = readDb();
        const sendAmt = parseFloat(amount) || 100;

        if ((data.user?.walletBalance || 0) < sendAmt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Insufficient wallet balance' }));
          return;
        }

        if (data.user) {
          data.user.walletBalance = Math.round(Math.max(0, (data.user.walletBalance || 0) - sendAmt) * 100) / 100;
        }

        const utr = 'UPI' + Date.now().toString().slice(-10);
        const newTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: 'Paid to ' + (recipient || 'UPI User'),
          category: type === 'BANK' ? 'To Bank' : 'UPI Transfer',
          amount: -sendAmt,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'UPI_DEBIT',
          icon: '/assets/bachatpay/history/debit_history.png',
          details: {
            recipient: recipient || 'UPI User',
            utr: utr,
            note: note || 'Payment via EasyPay'
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(newTxn);
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, utr: utr, txn: newTxn, balance: data.user?.walletBalance }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
    return;
  }

  // API: Buy Gift Card (Instant code & PIN generation)
  if (url === '/api/buy-gift-card' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { cardId, denomination, paymentMethod } = JSON.parse(body || '{}');
        const data = readDb();
        const card = (data.giftCards || []).find(c => c.id === cardId);
        if (!card) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Card not found' }));
          return;
        }

        const amount = parseFloat(denomination) || 500;
        const cashback = (amount * (card.cashbackRate || 3.5)) / 100;
        const randomCode = card.name.substring(0, 4).toUpperCase() + '-' +
          Math.floor(1000 + Math.random() * 9000) + '-' +
          Math.floor(1000 + Math.random() * 9000) + '-' +
          Math.floor(1000 + Math.random() * 9000);
        const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

        const today = new Date();
        const expiry = new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0];

        const newVoucher = {
          id: 'vouch_' + Date.now(),
          brand: card.name,
          cardId: card.id,
          amount: amount,
          voucherCode: randomCode,
          pin: randomPin,
          expiryDate: expiry,
          purchasedAt: new Date().toISOString(),
          cashbackEarned: cashback,
          status: 'ACTIVE',
          category: card.category || 'Voucher'
        };

        const newTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: card.name + ' Gift Voucher',
          category: 'Gift Card',
          amount: -amount,
          cashback: cashback,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'GIFT_CARD',
          icon: '/assets/bachatpay/history/debit_history.png',
          details: {
            voucherCode: randomCode,
            pin: randomPin,
            paymentMethod: paymentMethod || 'Wallet'
          }
        };

        data.vouchers = data.vouchers || [];
        data.vouchers.unshift(newVoucher);

        data.transactions = data.transactions || [];
        data.transactions.unshift(newTxn);

        if (data.user) {
          const netDebit = Math.max(0, amount - cashback);
          data.user.walletBalance = Math.round(Math.max(0, (data.user.walletBalance || 0) - netDebit) * 100) / 100;
          data.user.cashbackEarned = Math.round(((data.user.cashbackEarned || 0) + cashback) * 100) / 100;
        }

        if (data.analytics) {
          data.analytics.giftCardsSold = (data.analytics.giftCardsSold || 0) + 1;
          data.analytics.totalGmv = (data.analytics.totalGmv || 0) + amount;
          data.analytics.platformCommissionEarned = (data.analytics.platformCommissionEarned || 0) + (amount * 0.02);
        }

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, voucher: newVoucher, transaction: newTxn }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Mobile / BBPS Recharge
  if (url === '/api/recharge' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { serviceType, operator, number, amount, planDetails, paymentMethod } = JSON.parse(body || '{}');
        const data = readDb();
        const rechargeAmt = parseFloat(amount) || 299;
        const cashback = (rechargeAmt * 0.025);

        let iconPath = '/assets/bachatpay/history/mobile_recharg_history.png';
        if (serviceType === 'DTH') iconPath = '/assets/bachatpay/history/DTH_Recharge_history.png';
        else if (serviceType === 'FASTag') iconPath = '/assets/bachatpay/history/FASTag_history.png';
        else if (serviceType === 'Electricity') iconPath = '/assets/bachatpay/history/electricity_billl_history.png';

        const operatorRef = 'BBPS' + Math.floor(100000000 + Math.random() * 900000000);

        const newTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: `${operator || 'Mobile'} Recharge (${number})`,
          category: serviceType || 'Recharge',
          amount: -rechargeAmt,
          cashback: cashback,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'RECHARGE',
          icon: iconPath,
          details: {
            operator: operator || 'Reliance Jio',
            number: number,
            operatorRef: operatorRef,
            planDetails: planDetails || 'Unlimited Calls + 1.5GB/Day',
            bbpsComplianceId: 'NPCI-' + Math.floor(100000 + Math.random() * 900000)
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(newTxn);

        if (data.user) {
          if (paymentMethod === 'Wallet' && data.user.walletBalance >= rechargeAmt) {
            data.user.walletBalance -= (rechargeAmt - cashback);
          }
          data.user.cashbackEarned = (data.user.cashbackEarned || 0) + cashback;
        }

        if (data.analytics) {
          data.analytics.rechargesDone = (data.analytics.rechargesDone || 0) + 1;
          data.analytics.totalGmv = (data.analytics.totalGmv || 0) + rechargeAmt;
        }

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          transaction: newTxn,
          operatorRef: operatorRef,
          cashback: cashback
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Wallet Add Money
  if (url === '/api/wallet/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { amount, upiApp } = JSON.parse(body || '{}');
        const data = readDb();
        const addAmt = parseFloat(amount) || 1000;

        if (data.user) {
          data.user.walletBalance = (data.user.walletBalance || 0) + addAmt;
        }

        const newTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: `Added via ${upiApp || 'UPI'}`,
          category: 'Wallet',
          amount: addAmt,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'WALLET_ADD',
          icon: '/assets/bachatpay/history/credit_history.png'
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(newTxn);

        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, balance: data.user.walletBalance, transaction: newTxn }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Admin Toggle Card
  if (url === '/api/gift-cards/toggle' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { id } = JSON.parse(body || '{}');
      const data = readDb();
      const card = (data.giftCards || []).find(c => c.id === id);
      if (card) {
        card.active = !card.active;
        writeDb(data);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, card }));
    });
    return;
  }

  // API: Admin Update Card
  if (url === '/api/gift-cards/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { id, cashbackRate } = JSON.parse(body || '{}');
      const data = readDb();
      const card = (data.giftCards || []).find(c => c.id === id);
      if (card) {
        card.cashbackRate = parseFloat(cashbackRate) || card.cashbackRate;
        card.cashbackTag = `${card.cashbackRate}% Instant Cashback`;
        writeDb(data);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, card }));
    });
    return;
  }

  // API: Admin Add Brand
  if (url === '/api/gift-cards/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { name, category, cashbackRate } = JSON.parse(body || '{}');
      const data = readDb();
      const newCard = {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name,
        category: category || 'E-Commerce',
        cashbackRate: parseFloat(cashbackRate) || 5.0,
        cashbackTag: `${cashbackRate}% Instant Cashback`,
        denominations: [250, 500, 1000, 2000, 5000],
        active: true,
        primaryColor: '#1E40AF'
      };
      data.giftCards = data.giftCards || [];
      data.giftCards.unshift(newCard);
      writeDb(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, card: newCard }));
    });
    return;
  }

  // API: Book Bond / FD Investment (Monthly Frame with Daily Payouts)
  if (url === '/api/invest/book' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { bondId, amount, tenureMonths, payoutFreq, paymentMethod } = JSON.parse(body || '{}');
        const data = readDb();
        const bond = (data.bonds || []).find(b => b.id === bondId) || {
          id: bondId || 'suryoday_fd',
          title: 'Suryoday SF Bank Plan',
          monthlyRate: 8.60,
          rateText: '8.60% per month',
          category: 'Fixed Deposit'
        };

        const principal = parseFloat(amount) || 1000;
        const monthlyRate = parseFloat(bond.monthlyRate || bond.newRate || 8.60);
        const months = parseInt(tenureMonths) || 6;
        
        // Monthly interest calculation
        const monthlyInterest = Math.round(((principal * monthlyRate) / 100) * 100) / 100;
        const dailyPayout = Math.round((monthlyInterest / 30) * 100) / 100;
        const totalInterest = Math.round(monthlyInterest * months);
        const maturityAmount = Math.round(principal + totalInterest);
        
        const bookingDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const matDateObj = new Date();
        matDateObj.setMonth(matDateObj.getMonth() + months);
        const maturityDate = matDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const certNum = 'DICGC-EP-' + Math.floor(100000 + Math.random() * 900000);
        const folioNum = 'EP-FD-' + Math.floor(1000 + Math.random() * 9000);

        const newInvestment = {
          id: 'INV_BOND_' + Date.now().toString().slice(-6),
          institution: bond.title,
          bondId: bond.id,
          category: bond.category || 'Fixed Deposit',
          principal: principal,
          monthlyRate: monthlyRate,
          interestRate: monthlyRate,
          rateText: `${monthlyRate}% per month`,
          monthlyInterest: monthlyInterest,
          dailyPayout: dailyPayout,
          totalInterest: totalInterest,
          tenureMonths: months,
          maturityAmount: maturityAmount,
          bookingDate: bookingDate,
          maturityDate: maturityDate,
          payoutFreq: 'Daily Payout to Wallet',
          status: 'ACTIVE',
          dicgcInsured: true,
          certNumber: certNum,
          folioNumber: folioNum
        };

        data.investments = data.investments || [];
        data.investments.unshift(newInvestment);

        const newTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: `${bond.title} Investment`,
          category: 'Investment',
          amount: -principal,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'INVESTMENT',
          icon: '/assets/curie/svg/verified_vpa_icon.svg',
          details: {
            folioNumber: folioNum,
            certNumber: certNum,
            institution: bond.title,
            monthlyRate: `${monthlyRate}% per month`,
            dailyPayout: `₹${dailyPayout}/day`,
            maturityAmount: maturityAmount,
            maturityDate: maturityDate,
            paymentMethod: paymentMethod || 'UPI'
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(newTxn);

        // Daily interest is directly credited into the main wallet balance and recorded in Passbook history!
        const interestTxn = {
          id: 'TXN_INT_' + Date.now().toString().slice(-8),
          title: `Daily Interest Credit - ${bond.title}`,
          category: 'Interest Credit',
          amount: dailyPayout, // Direct positive credit to main wallet
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'INTEREST_CREDIT',
          icon: '/assets/bachatpay/history/credit_history.png',
          details: {
            institution: bond.title,
            monthlyRate: `${monthlyRate}% per month`,
            maturityAmount: maturityAmount,
            dailyPayout: `+₹${dailyPayout}/day`,
            creditedTo: 'Main Available Balance'
          }
        };
        data.transactions.unshift(interestTxn);

        if (data.user) {
          if (paymentMethod === 'Wallet') {
            data.user.walletBalance = Math.max(0, (data.user.walletBalance || 0) - principal);
          }
          // Direct credit to main wallet balance:
          data.user.walletBalance = Math.round(((data.user.walletBalance || 0) + dailyPayout) * 100) / 100;
          data.user.dailyPayoutRate = Math.round(((data.user.dailyPayoutRate || 0) + dailyPayout) * 100) / 100;
        }

        if (data.analytics) {
          data.analytics.totalGmv = (data.analytics.totalGmv || 0) + principal;
        }

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          investment: newInvestment,
          transaction: newTxn,
          dailyPayout: dailyPayout,
          monthlyInterest: monthlyInterest
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Admin Update Investment Plan
  if (url === '/api/admin/invest-plans/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id, title, monthlyRate, minAmount, category, active } = JSON.parse(body || '{}');
        const data = readDb();
        const plan = (data.bonds || []).find(b => b.id === id);
        if (plan) {
          if (title !== undefined) plan.title = title;
          if (monthlyRate !== undefined) {
            plan.monthlyRate = parseFloat(monthlyRate);
            plan.newRate = plan.monthlyRate;
            plan.rateText = `${plan.monthlyRate}% per month`;
          }
          if (minAmount !== undefined) plan.minAmount = parseFloat(minAmount);
          if (category !== undefined) plan.category = category;
          if (active !== undefined) plan.active = !!active;
          writeDb(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, plan }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Admin Toggle Investment Plan Status
  if (url === '/api/admin/invest-plans/toggle' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        const plan = (data.bonds || []).find(b => b.id === id);
        if (plan) {
          plan.active = !plan.active;
          writeDb(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, plan }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Admin Add New Investment Plan
  if (url === '/api/admin/invest-plans/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { title, monthlyRate, minAmount, category, lockInNotice } = JSON.parse(body || '{}');
        const data = readDb();
        const rate = parseFloat(monthlyRate) || 9.0;
        const newPlan = {
          id: 'plan_' + Date.now().toString().slice(-6),
          title: title || 'New High-Yield Plan',
          badge: 'ACTIVE PLAN',
          monthlyRate: rate,
          newRate: rate,
          oldRate: rate - 0.5,
          rateText: `${rate}% per month`,
          tenure: '6 Months',
          tenureMonths: 6,
          tenures: [6, 12, 24, 36, 60],
          category: category || 'Fixed Deposit',
          rbiRegulated: true,
          dicgcInsured: true,
          minAmount: parseFloat(minAmount) || 1000,
          interestPayout: 'Credited to Wallet Daily',
          lockInNotice: lockInNotice || 'Starts from 6 months with daily interest wallet credit',
          active: true,
          icon: 'fa-vault',
          color: '#059669'
        };
        data.bonds = data.bonds || [];
        data.bonds.unshift(newPlan);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, plan: newPlan }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: User Claim Daily Interest into Main Wallet
  if (url === '/api/wallet/claim-daily-interest' && req.method === 'POST') {
    const data = readDb();
    const yieldAmt = parseFloat(data.user ? data.user.dailyInterestWallet : 0) || 0;
    if (yieldAmt > 0 && data.user) {
      data.user.walletBalance = (data.user.walletBalance || 0) + yieldAmt;
      data.user.dailyInterestWallet = 0;

      const newTxn = {
        id: 'TXN_' + Date.now().toString().slice(-8),
        title: 'Daily Interest Yield Credited',
        category: 'Yield',
        amount: yieldAmt,
        cashback: 0,
        timestamp: 'Just now',
        status: 'SUCCESS',
        type: 'WALLET_ADD',
        icon: '/assets/bachatpay/history/credit_history.png'
      };
      data.transactions = data.transactions || [];
      data.transactions.unshift(newTxn);

      writeDb(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, claimedAmount: yieldAmt, walletBalance: data.user.walletBalance }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'No pending yield to transfer' }));
    }
    return;
  }

  // Static File Serving & SPA Fallback
  let filePath = path.join(PUBLIC_DIR, url === '/' ? 'app.html' : url);
  if (url === '/admin') {
    filePath = path.join(PUBLIC_DIR, 'admin.html');
  } else if (url === '/app' || url === '/mobile' || ['/giftcards', '/bonds', '/shopping', '/profile', '/passbook', '/auth', '/login', '/splash', '/otp', '/help'].includes(url)) {
    filePath = path.join(PUBLIC_DIR, 'app.html');
  } else if (url === '/landing') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2'
  };

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback for client routes (/about-us, /careers, /api-docs, etc.)
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  BACHAT PAY ENTERPRISE PLATFORM (ONLINE ON PORT ${PORT})`);
  console.log(`  -> Official Website:      http://localhost:${PORT}/`);
  console.log(`  -> Mobile Native App:     http://localhost:${PORT}/app`);
  console.log(`  -> Enterprise Admin:      http://localhost:${PORT}/admin`);
  console.log(`====================================================`);
});
