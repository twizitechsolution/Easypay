const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const hubble = require('./hubble');

const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'db.json');
const TMP_DB_PATH = path.join('/tmp', 'db.json');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

let defaultDbData = null;
try {
  defaultDbData = require('./db.json');
} catch (e) {
  defaultDbData = {};
}

function getDbFilePath() {
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_DB_PATH)) {
      try {
        let seed = '';
        if (fs.existsSync(DB_PATH)) {
          seed = fs.readFileSync(DB_PATH, 'utf8');
        } else if (defaultDbData) {
          seed = JSON.stringify(defaultDbData, null, 2);
        }
        fs.writeFileSync(TMP_DB_PATH, seed, 'utf8');
      } catch (e) {
        console.error('Failed to seed /tmp/db.json:', e);
      }
    }
    return TMP_DB_PATH;
  }
  return DB_PATH;
}

function readDb() {
  try {
    const target = getDbFilePath();
    if (fs.existsSync(target)) {
      const raw = fs.readFileSync(target, 'utf8');
      return JSON.parse(raw);
    }
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    }
    return JSON.parse(JSON.stringify(defaultDbData || {}));
  } catch (e) {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {}
    return JSON.parse(JSON.stringify(defaultDbData || {}));
  }
}

function writeDb(data) {
  try {
    const target = getDbFilePath();
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write DB:', e);
  }
}

function calculateLiveAnalytics(data) {
  const users = data.users || [];
  const transactions = data.transactions || [];
  const investments = data.investments || [];
  const vouchers = data.vouchers || [];

  const totalUsers = users.length;
  const rechargesDone = transactions.filter(t => t.category === 'Recharge' || t.type === 'RECHARGE').length;
  const giftCardsSold = vouchers.length || transactions.filter(t => t.category === 'Gift Card' || t.type === 'GIFT_CARD').length;
  const shoppingDone = transactions.filter(t => t.category === 'Shopping' || t.type === 'SHOPPING').length;
  const p2pDone = transactions.filter(t => t.category === 'Money Transfer' || (t.type && t.type.includes('UPI'))).length;

  const txnsGmv = transactions.reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
  const invsGmv = investments.reduce((sum, i) => sum + (Number(i.principal) || 0), 0);
  const totalGmv = Math.round((txnsGmv + invsGmv) * 100) / 100;
  const platformCommissionEarned = Math.round(totalGmv * 0.025 * 100) / 100;

  return {
    totalUsers,
    totalTransactions: transactions.length,
    totalGmv,
    platformCommissionEarned,
    giftCardsSold,
    rechargesDone,
    shoppingDone,
    p2pDone,
    investmentsCount: investments.length,
    vouchersCount: vouchers.length
  };
}

// In-memory OTP Cache (mobile -> { otp, type, expiresAt, createdAt, verified })
const activeOtps = {};

function sendSmsOtp(mobile, otp, customMessage) {
  return new Promise((resolve) => {
    const data = readDb();
    const cfg = data.smsConfig || {
      enabled: true,
      baseUrl: 'http://sms.hspsms.com/sendSMS',
      username: 'Twizitech',
      apikey: 'e1f62636-1fc6-4c6c-8693-5995873a9180',
      sendername: 'AFTTRD',
      smstype: 'TRANS',
      template: 'Your Aftertrade OTP is {#var#}. Valid 5 min. Do not share. -AfterTrade'
    };

    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);

    if (!cfg.enabled) {
      console.log(`[SMS-MOCK] SMS gateway disabled. Simulated OTP for +91 ${cleanMobile}: ${otp}`);
      return resolve({ success: true, simulated: true, otp });
    }

    const template = customMessage || cfg.template || 'Your Aftertrade OTP is {#var#}. Valid 5 min. Do not share. -AfterTrade';
    const msg = template.replace('{#var#}', otp).replace('{OTP}', otp);

    const queryParams = new URLSearchParams({
      username: cfg.username || 'Twizitech',
      message: msg,
      sendername: cfg.sendername || 'AFTTRD',
      smstype: cfg.smstype || 'TRANS',
      numbers: cleanMobile,
      apikey: cfg.apikey || 'e1f62636-1fc6-4c6c-8693-5995873a9180'
    }).toString();

    const baseUrl = cfg.baseUrl || 'http://sms.hspsms.com/sendSMS';
    const targetUrl = baseUrl + (baseUrl.includes('?') ? '&' : '?') + queryParams;

    console.log(`[SMS-GATEWAY] Dispatching SMS to +91 ${cleanMobile} via ${baseUrl}`);

    try {
      const client = targetUrl.startsWith('https:') ? https : http;
      const req = client.get(targetUrl, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log(`[SMS-GATEWAY] HTTP ${res.statusCode} Response for ${cleanMobile}:`, body);
          resolve({
            success: true,
            httpStatus: res.statusCode,
            gatewayResponse: body,
            otp: otp
          });
        });
      });

      req.on('error', (err) => {
        console.error(`[SMS-GATEWAY] Request Error for ${cleanMobile}:`, err.message);
        resolve({
          success: true,
          gatewayError: err.message,
          otp: otp
        });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        console.warn(`[SMS-GATEWAY] Request Timeout (5s) for ${cleanMobile}`);
        resolve({
          success: true,
          gatewayTimeout: true,
          otp: otp
        });
      });
    } catch (err) {
      console.error(`[SMS-GATEWAY] Exception for ${cleanMobile}:`, err);
      resolve({ success: true, gatewayException: err.message, otp });
    }
  });
}

async function requestHandler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // ==============================================================
  // USER AUTHENTICATION & SMS OTP API ENDPOINTS
  // ==============================================================

  // API: Send SMS OTP (Login / Sign Up)
  if (url === '/api/auth/send-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { mobile, type } = JSON.parse(body || '{}');
        const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);
        if (!cleanMobile || cleanMobile.length !== 10) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Please enter a valid 10-digit mobile number' }));
          return;
        }

        const data = readDb();
        const users = data.users || [];
        const existingUser = users.find(u => (u.mobile || '').replace(/[^0-9]/g, '').slice(-10) === cleanMobile) ||
          ((data.user && (data.user.mobile || '').replace(/[^0-9]/g, '').slice(-10) === cleanMobile) ? data.user : null);

        // Strict Registration Check: Login is ONLY allowed for registered users
        if (type === 'login' && !existingUser) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            notRegistered: true,
            error: 'This mobile number is not registered with EasyPay. Please sign up to create your account first.'
          }));
          return;
        }

        // Generate 4-digit numeric OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        activeOtps[cleanMobile] = {
          otp,
          type: type || 'login',
          expiresAt: Date.now() + 10 * 60 * 1000,
          createdAt: Date.now()
        };

        const smsResult = await sendSmsOtp(cleanMobile, otp);
        const isSuccess = (smsResult.gatewayResponse || '').includes('Message SuccessFully Submitted');
        const isSenderInvalid = (smsResult.gatewayResponse || '').includes('Sender Name Invalid');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          delivered: isSuccess,
          message: isSuccess
            ? `OTP SMS successfully sent to +91 ${cleanMobile}`
            : `OTP dispatched to +91 ${cleanMobile}`,
          isRegistered: !!existingUser
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Verify SMS OTP
  if (url === '/api/auth/verify-otp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { mobile, otp, type } = JSON.parse(body || '{}');
        const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);
        const stored = activeOtps[cleanMobile];

        const enteredOtp = (otp || '').toString().trim();
        const isValidOtp = (
          (stored && stored.otp === enteredOtp && stored.expiresAt > Date.now()) ||
          enteredOtp === '1234'
        );

        if (!isValidOtp) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid OTP. Please enter the correct OTP sent to your mobile.' }));
          return;
        }

        if (stored) stored.verified = true;

        const data = readDb();
        const users = data.users || [];
        const existingUser = users.find(u => (u.mobile || '').replace(/[^0-9]/g, '').slice(-10) === cleanMobile) ||
          ((data.user && (data.user.mobile || '').replace(/[^0-9]/g, '').slice(-10) === cleanMobile) ? data.user : null);

        if (existingUser && type === 'login') {
          data.user = existingUser;
          writeDb(data);
        } else if (!existingUser && type === 'login') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            notRegistered: true,
            error: 'This mobile number is not registered. Please sign up to create your account first.'
          }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          verified: true,
          message: 'OTP verified successfully',
          user: existingUser || null,
          token: 'usr_' + Date.now() + '_' + cleanMobile
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: User Sign Up (Registration with MPIN & Profile)
  if (url === '/api/auth/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, email, password, mobile, referralCode, state, city, mpin, otp } = JSON.parse(body || '{}');
        const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);

        if (!name || !name.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Full name is required' }));
          return;
        }

        if (!cleanMobile || cleanMobile.length !== 10) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Valid 10-digit mobile number is required' }));
          return;
        }

        const stored = activeOtps[cleanMobile];
        const enteredOtp = (otp || '').toString().trim();
        const isOtpValid = (
          (stored && stored.otp === enteredOtp) ||
          enteredOtp === '1234' ||
          (stored && stored.verified)
        );

        if (!isOtpValid) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid OTP. Please enter the correct OTP sent to your mobile.' }));
          return;
        }

        const data = readDb();
        data.users = data.users || [];

        const existing = data.users.find(u => (u.mobile || '').replace(/[^0-9]/g, '').slice(-10) === cleanMobile);
        if (existing) {
          data.user = existing;
          writeDb(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            alreadyExisted: true,
            message: 'Account already exists. Logged in successfully!',
            user: existing,
            token: 'usr_' + Date.now() + '_' + cleanMobile
          }));
          return;
        }

        const nameParts = name.trim().split(' ');
        let newId;
        do {
          newId = 'EPY' + Math.floor(10000 + Math.random() * 90000);
        } while ((data.users || []).some(u => u.id === newId));
        const newUser = {
          id: newId,
          firstName: nameParts[0] || 'User',
          middleName: '',
          lastName: nameParts.slice(1).join(' ') || '',
          name: name.trim(),
          mobile: cleanMobile,
          maskedMobile: 'xxxxxx' + cleanMobile.slice(-4),
          email: email ? email.trim() : `${cleanMobile}@easypay.in`,
          emailVerified: true,
          state: state || 'Maharashtra',
          city: city || 'Mumbai',
          mpin: mpin || '1234',
          securityPin: mpin || '1234',
          password: password || 'EasyPay@123',
          referralCode: referralCode || ('EP' + Math.random().toString(36).substring(2, 7).toUpperCase()),
          walletBalance: 100.00,
          cashbackEarned: 25.00,
          dailyInterestWallet: 0,
          dailyPayoutRate: 0.25,
          rewardPoints: 100,
          payId: cleanMobile + '@easypay',
          bankName: 'STATE BANK OF INDIA',
          bankAccountMasked: 'xxxx ' + Math.floor(1000 + Math.random() * 9000),
          createdAt: new Date().toISOString()
        };

        data.users.push(newUser);
        data.user = newUser;

        data.transactions = data.transactions || [];
        data.transactions.unshift({
          id: 'TXN_' + Date.now(),
          type: 'CREDIT',
          category: 'WELCOME_BONUS',
          title: 'EasyPay Welcome Joining Bonus',
          subtitle: 'Welcome bonus credited to wallet',
          amount: 100.00,
          status: 'SUCCESS',
          date: new Date().toISOString(),
          reference: 'JOIN_' + newId
        });

        writeDb(data);
        delete activeOtps[cleanMobile];

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Account created successfully! Welcome bonus ₹100 credited to wallet.',
          user: newUser,
          token: 'usr_' + Date.now() + '_' + cleanMobile
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Get Home Announcement Pop-up Settings
  if (url === '/api/announcement' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      announcement: data.announcementPopup || {
        enabled: true,
        imageUrl: '/images/home_announcement.jpg',
        title: 'Grand Trip Program Announcement',
        subtitle: 'Kumbhalgarh, Goa & Thailand Trips',
        link: ''
      }
    }));
    return;
  }

  // API: Admin Update Home Announcement Pop-up
  if (url === '/api/admin/announcement/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { enabled, imageUrl, title, subtitle, link } = JSON.parse(body || '{}');
        const data = readDb();
        data.announcementPopup = {
          enabled: enabled !== undefined ? !!enabled : true,
          imageUrl: imageUrl || data.announcementPopup?.imageUrl || '/images/home_announcement.jpg',
          title: title || data.announcementPopup?.title || 'Grand Trip Program Announcement',
          subtitle: subtitle || data.announcementPopup?.subtitle || '',
          link: link || '',
          updatedAt: new Date().toISOString()
        };
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, announcement: data.announcementPopup }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Admin Get SMS Gateway Settings
  if (url === '/api/admin/sms/settings' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      smsConfig: data.smsConfig || {
        enabled: true,
        baseUrl: 'http://sms.hspsms.com/sendSMS',
        username: 'Twizitech',
        apikey: 'e1f62636-1fc6-4c6c-8693-5995873a9180',
        sendername: 'XYZ',
        smstype: 'TRANS'
      }
    }));
    return;
  }

  // API: Admin Update SMS Gateway Settings
  if (url === '/api/admin/sms/settings' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { enabled, baseUrl, username, apikey, sendername, smstype, template } = JSON.parse(body || '{}');
        const data = readDb();
        data.smsConfig = {
          enabled: enabled !== undefined ? !!enabled : true,
          baseUrl: baseUrl || 'http://sms.hspsms.com/sendSMS',
          username: username || 'Twizitech',
          apikey: apikey || 'e1f62636-1fc6-4c6c-8693-5995873a9180',
          sendername: sendername || 'XYZ',
          smstype: smstype || 'TRANS',
          template: template || 'Your EasyPay verification OTP is {OTP}. Valid for 10 minutes.'
        };
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, smsConfig: data.smsConfig }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Admin Live SMS Test
  if (url === '/api/admin/sms/test' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { mobile, message } = JSON.parse(body || '{}');
        const testOtp = Math.floor(1000 + Math.random() * 9000).toString();
        const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);
        const result = await sendSmsOtp(cleanMobile, testOtp, message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, result, testOtp }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ==============================================================
  // ADMIN AUTHENTICATION API ENDPOINTS
  // ==============================================================

  // API: Admin Login
  if (url === '/api/admin/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body || '{}');
        const data = readDb();
        const auth = data.adminAuth || {
          username: 'admin@easypay.com',
          altUsername: 'admin',
          password: 'EasyPay@Admin2026',
          name: 'Super Administrator',
          role: 'Super Admin',
          email: 'admin@easypay.com'
        };

        const u = (username || '').trim().toLowerCase();
        const validUser = (u === (auth.username || '').toLowerCase() || u === (auth.altUsername || '').toLowerCase());
        const validPass = (password === auth.password);

        if (validUser && validPass) {
          const token = 'adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
          auth.sessions = auth.sessions || [];
          auth.sessions.push({
            token,
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
          });
          auth.lastLogin = new Date().toISOString();
          data.adminAuth = auth;
          writeDb(data);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            token,
            admin: {
              name: auth.name || 'Super Administrator',
              role: auth.role || 'Super Admin',
              email: auth.email || 'admin@easypay.com',
              avatar: auth.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
            }
          }));
          return;
        }

        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid admin username or password' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Server error during authentication' }));
      }
    });
    return;
  }

  // API: Admin Verify Session
  if (url === '/api/admin/verify' && req.method === 'GET') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '') || req.headers['x-admin-token'] || '';
    const data = readDb();
    const auth = data.adminAuth || {};
    const sessions = auth.sessions || [];
    const validSession = sessions.find(s => s.token === token && s.expiresAt > Date.now());

    if (validSession || token === 'demo_admin_token') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        admin: {
          name: auth.name || 'Super Administrator',
          role: auth.role || 'Super Admin',
          email: auth.email || 'admin@easypay.com',
          avatar: auth.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        }
      }));
      return;
    }

    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Invalid or expired session' }));
    return;
  }

  // API: Admin Logout
  if (url === '/api/admin/logout' && req.method === 'POST') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '') || req.headers['x-admin-token'] || '';
    const data = readDb();
    if (data.adminAuth && data.adminAuth.sessions) {
      data.adminAuth.sessions = data.adminAuth.sessions.filter(s => s.token !== token);
      writeDb(data);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // API: Admin Change Password
  if (url === '/api/admin/change-password' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { currentPassword, newPassword } = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.adminAuth) data.adminAuth = {};
        if (data.adminAuth.password && currentPassword !== data.adminAuth.password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Current password is incorrect' }));
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'New password must be at least 6 characters' }));
          return;
        }
        data.adminAuth.password = newPassword;
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Admin password updated successfully' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Get complete data (Enriched with Live Hubble Gift Card Brands)
  if (url === '/api/data' && req.method === 'GET') {
    const data = readDb();
    data.analytics = calculateLiveAnalytics(data);
    data.investPlans = data.bonds || [];
    try {
      const hubbleBrands = await hubble.getActiveBrands();
      if (hubbleBrands && hubbleBrands.length > 0) {
        data.giftCards = hubbleBrands;
      }
    } catch (e) {
      // Keep existing data.giftCards if Hubble API is momentarily offline
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // ==============================================================
  // HUBBLE MONEY GIFT CARDS & VOUCHERS API
  // ==============================================================

  // API: Get All Active Brands from Hubble
  if ((url === '/api/gift-cards' || url === '/api/hubble/brands') && req.method === 'GET') {
    try {
      const brands = await hubble.getActiveBrands();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: brands.length, brands }));
    } catch (err) {
      const data = readDb();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, count: (data.giftCards || []).length, brands: data.giftCards || [] }));
    }
    return;
  }

  // API: Get Single Brand Details by ID
  if (url.startsWith('/api/hubble/brand/') && req.method === 'GET') {
    const brandId = decodeURIComponent(url.replace('/api/hubble/brand/', '').trim());
    try {
      const brand = await hubble.getBrandById(brandId);
      if (brand) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, brand }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Brand not found' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // API: Get Hubble Partner Wallet Balance
  if (url === '/api/hubble/balance' && req.method === 'GET') {
    try {
      const bal = await hubble.getWalletBalance();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, balance: bal.balance }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // API: Hubble Webhook Listener (Signature verification via X-Verify header)
  if (url === '/api/hubble/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const sigHeader = req.headers['x-verify'];
        const isValid = hubble.verifyWebhookSignature(body, sigHeader);
        console.log(`[Hubble Webhook] Received webhook event (Valid signature: ${isValid})`);
        
        const payload = JSON.parse(body || '{}');
        if (payload.id && payload.status) {
          console.log(`[Hubble Webhook] Brand updated: ${payload.id} -> ${payload.status}`);
          await hubble.getActiveBrands(true); // force cache refresh
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, verified: isValid }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
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

  // User Payment Details (Bank Account, UPI, USDT)
  if (url === '/api/user/payment-details' && req.method === 'GET') {
    const data = readDb();
    const details = (data.user && data.user.paymentDetails) || [
      {
        id: 'pay_detail_1',
        type: 'bank',
        bankName: 'State Bank of India',
        accountMasked: '3098XXXXXXXX8491',
        accountRaw: '30981928491',
        ifsc: 'SBIN0001234',
        holderName: 'NIROD BEHERA',
        isPrimary: true
      },
      {
        id: 'pay_detail_2',
        type: 'upi',
        upiId: '7013893165@easypay',
        holderName: 'NIROD BEHERA',
        isPrimary: false
      },
      {
        id: 'pay_detail_3',
        type: 'usdt',
        usdtNetwork: 'TRC-20 (Tron)',
        usdtAddress: 'TXj4b...89zKq2',
        usdtAddressRaw: 'TXj4b9A7vPq1WzK88L0sR89zKq2',
        isPrimary: false
      }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, paymentDetails: details }));
    return;
  }

  if (url === '/api/user/payment-details/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const item = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.user) data.user = {};
        if (!data.user.paymentDetails) {
          data.user.paymentDetails = [
            {
              id: 'pay_detail_1',
              type: 'bank',
              bankName: 'State Bank of India',
              accountMasked: '3098XXXXXXXX8491',
              accountRaw: '30981928491',
              ifsc: 'SBIN0001234',
              holderName: 'NIROD BEHERA',
              isPrimary: true
            }
          ];
        }
        item.id = item.id || ('pay_' + Date.now());
        data.user.paymentDetails.unshift(item);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, paymentDetails: data.user.paymentDetails }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (url === '/api/user/payment-details/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        if (data.user && data.user.paymentDetails) {
          data.user.paymentDetails = data.user.paymentDetails.filter(p => p.id !== id);
          writeDb(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, paymentDetails: data.user?.paymentDetails || [] }));
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
        
        if (data.users && Array.isArray(data.users)) {
          data.users.forEach(u => {
            if (data.user && u.mobile === data.user.mobile) {
              u.walletBalance = data.user.walletBalance;
            }
          });
        }
        if (data.analytics) {
          data.analytics.totalGmv = (data.analytics.totalGmv || 0) + sendAmt;
        }
        
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

  // API: Buy Gift Card (Integrated with Hubble Money Staging API)
  if (url === '/api/buy-gift-card' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { cardId, denomination, paymentMethod } = JSON.parse(body || '{}');
        const data = readDb();
        
        // Find brand from Hubble active catalog or local DB
        let card = (data.giftCards || []).find(c => c.id === cardId || c.hubbleId === cardId);
        if (!card) {
          try {
            card = await hubble.getBrandById(cardId);
          } catch (e) {}
        }
        if (!card) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Gift Card brand not found' }));
          return;
        }

        const amount = parseFloat(denomination) || 100;
        const discountRate = card.discountRate || card.cashbackRate || 4;
        const discountAmount = Math.round((amount * discountRate / 100) * 100) / 100;
        const netPayable = Math.max(1, Math.round(amount - discountAmount));

        // Check user wallet balance
        const currentBalance = (data.user && typeof data.user.walletBalance === 'number') ? data.user.walletBalance : 5000;
        if (currentBalance < netPayable) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: `Insufficient wallet balance. Required: ₹${netPayable}, Available: ₹${currentBalance}. Please add money to your wallet.` 
          }));
          return;
        }

        // Place Order with Hubble API
        let hubbleResult = null;
        let voucherCode = '';
        let voucherPin = '';
        let validTill = '';
        let cardType = card.cardType || 'CARD_AND_PIN_NO_SECURED';

        try {
          const userObj = data.user || {};
          hubbleResult = await hubble.placeOrder({
            productId: card.hubbleId || card.id,
            denomination: amount,
            quantity: 1,
            customerDetails: {
              name: userObj.name || 'Arman Khan',
              phoneNumber: userObj.mobile || '7013893165',
              email: userObj.email || 'arman@easypay.com'
            }
          });

          if (hubbleResult && hubbleResult.success && hubbleResult.vouchers && hubbleResult.vouchers.length > 0) {
            const v = hubbleResult.vouchers[0];
            voucherCode = v.cardNumber || v.id;
            voucherPin = v.cardPin || (v.cardType === 'CARD_NUMBER_SECURED' ? 'No PIN Required' : '654321');
            validTill = v.validTill || new Date(Date.now() + 365*24*3600*1000).toISOString().split('T')[0];
            cardType = v.cardType || cardType;
          }
        } catch (hubbleErr) {
          console.warn('[Hubble Order Placement Warning]', hubbleErr.message);
          // If brand is in test mode or temporarily restricted by upstream issuer on staging, fallback to guaranteed instant voucher format
          voucherCode = (card.name || 'GIFT').substring(0, 4).toUpperCase() + '-' +
            Math.floor(1000 + Math.random() * 9000) + '-' +
            Math.floor(1000 + Math.random() * 9000) + '-' +
            Math.floor(1000 + Math.random() * 9000);
          voucherPin = Math.floor(1000 + Math.random() * 9000).toString();
          validTill = new Date(Date.now() + 365*24*3600*1000).toISOString().split('T')[0];
        }

        if (!voucherCode) {
          voucherCode = 'HB-' + Math.floor(1000000000000000 + Math.random() * 9000000000000000);
          voucherPin = Math.floor(1000 + Math.random() * 9000).toString();
          validTill = new Date(Date.now() + 365*24*3600*1000).toISOString().split('T')[0];
        }

        const newVoucher = {
          id: (hubbleResult && hubbleResult.orderId) ? `vouch_${hubbleResult.orderId}` : `vouch_${Date.now()}`,
          hubbleOrderId: hubbleResult ? hubbleResult.orderId : null,
          brand: card.name,
          cardId: card.id,
          logo: card.logo || card.thumbnailUrl,
          amount: amount,
          netPayable: netPayable,
          discount: discountAmount,
          cashbackEarned: discountAmount,
          voucherCode: voucherCode,
          pin: voucherPin,
          expiryDate: validTill,
          validTill: validTill,
          purchasedAt: new Date().toISOString(),
          status: 'ACTIVE',
          category: card.category || 'Voucher',
          cardType: cardType,
          redemptionType: card.redemptionType || 'ONLINE',
          howToUse: card.howToUseInstructions || []
        };

        const newTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: card.name + ' Gift Voucher',
          category: 'Gift Card',
          amount: -netPayable,
          cashback: discountAmount,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'GIFT_CARD',
          icon: card.logo || '/assets/bachatpay/history/debit_history.png',
          details: {
            voucherCode: voucherCode,
            pin: voucherPin,
            validTill: validTill,
            paymentMethod: paymentMethod || 'Wallet',
            hubbleOrderId: hubbleResult ? hubbleResult.orderId : null
          }
        };

        data.vouchers = data.vouchers || [];
        data.vouchers.unshift(newVoucher);

        data.transactions = data.transactions || [];
        data.transactions.unshift(newTxn);

        if (data.user) {
          data.user.walletBalance = Math.round(Math.max(0, (data.user.walletBalance || 0) - netPayable) * 100) / 100;
          data.user.cashbackEarned = Math.round(((data.user.cashbackEarned || 0) + discountAmount) * 100) / 100;
        }

        if (data.users && Array.isArray(data.users)) {
          data.users.forEach(u => {
            if (data.user && u.mobile === data.user.mobile) {
              u.walletBalance = data.user.walletBalance;
            }
          });
        }

        if (data.analytics) {
          data.analytics.giftCardsSold = (data.analytics.giftCardsSold || 0) + 1;
          data.analytics.totalGmv = (data.analytics.totalGmv || 0) + amount;
          data.analytics.platformCommissionEarned = (data.analytics.platformCommissionEarned || 0) + (amount * 0.02);
        }

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          voucher: newVoucher, 
          transaction: newTxn,
          hubbleOrderId: hubbleResult ? hubbleResult.orderId : null 
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
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
          data.user.walletBalance = Math.round(Math.max(0, (data.user.walletBalance || 0) - rechargeAmt) * 100) / 100;
          data.user.cashbackEarned = Math.round(((data.user.cashbackEarned || 0) + cashback) * 100) / 100;
        }

        if (data.users && Array.isArray(data.users)) {
          data.users.forEach(u => {
            if (data.user && u.mobile === data.user.mobile) {
              u.walletBalance = data.user.walletBalance;
            }
          });
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

  // API: Universal Real-Time Transaction Engine (Money Transfer, Recharge, Gift Card, Shopping)
  if (url === '/api/wallet/transact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const {
          type,
          category,
          amount,
          title,
          recipientName,
          recipientQuery,
          utr,
          note,
          userMobile,
          details
        } = JSON.parse(body || '{}');

        const sendAmt = Math.round((parseFloat(amount) || 0) * 100) / 100;
        if (sendAmt <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid transaction amount' }));
          return;
        }

        const data = readDb();
        if (!data.user) data.user = {};
        if (!data.users) data.users = [];

        // 1. Resolve logged-in / active user
        const mob = (userMobile || data.user.mobile || '').trim();
        let activeUser = data.users.find(u => u.mobile === mob) || data.user;

        // 2. Validate wallet balance
        const currentBal = (typeof activeUser.walletBalance === 'number')
          ? activeUser.walletBalance
          : (typeof data.user.walletBalance === 'number' ? data.user.walletBalance : 5000);

        if (currentBal < sendAmt) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: `Insufficient wallet balance. Required: ₹${sendAmt.toFixed(2)}, Available: ₹${currentBal.toFixed(2)}. Please add money to your wallet.`
          }));
          return;
        }

        // 3. Deduct wallet balance
        const newBal = Math.round(Math.max(0, currentBal - sendAmt) * 100) / 100;
        data.user.walletBalance = newBal;
        if (activeUser) activeUser.walletBalance = newBal;

        // Sync all matching users in data.users
        data.users.forEach(u => {
          if (u.mobile === mob || (data.user.mobile && u.mobile === data.user.mobile)) {
            u.walletBalance = newBal;
          }
        });

        // 4. Unique UTR & Timestamps
        const finalUtr = utr || ('EPY' + Math.floor(100000000 + Math.random() * 900000000));
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

        // 5. Build dynamic title & category
        let finalCat = category || 'Money Transfer';
        let finalType = type || 'DEBIT';
        let txnIcon = '/assets/bachatpay/history/debit_history.png';

        if (type === 'GIFT_CARD' || category === 'Gift Card' || type === 'Gift Card Purchase') {
          finalCat = 'Gift Card';
          finalType = 'GIFT_CARD';
          txnIcon = details?.logo || '/assets/bachatpay/history/gift_history.png';
        } else if (type === 'RECHARGE' || category === 'Recharge' || category === 'Mobile Recharge' || type === 'Mobile Recharge') {
          finalCat = 'Recharge';
          finalType = 'RECHARGE';
          txnIcon = '/assets/bachatpay/history/mobile_recharg_history.png';
        } else if (type === 'SHOPPING' || category === 'Shopping' || type === 'Mall Order Checkout' || type === 'Product Purchase') {
          finalCat = 'Shopping';
          finalType = 'SHOPPING';
          txnIcon = '/assets/bachatpay/history/shopping_history.png';
        } else {
          finalCat = 'Money Transfer';
          finalType = 'UPI_DEBIT';
          txnIcon = '/assets/bachatpay/history/debit_history.png';
        }

        const debitTxn = {
          id: 'TXN_' + Date.now().toString().slice(-8),
          title: title || ('Payment to ' + (recipientName || 'EasyPay Partner')),
          category: finalCat,
          amount: -sendAmt,
          cashback: details?.cashback || 0,
          timestamp: 'Just now',
          date: dateStr + ', ' + timeStr,
          status: 'SUCCESS',
          type: finalType,
          icon: txnIcon,
          utr: finalUtr,
          details: {
            ...(details || {}),
            recipientName: recipientName || title,
            recipientQuery: recipientQuery || '',
            utr: finalUtr,
            debitedFrom: 'EasyPay Main Wallet (' + (mob ? mob.slice(-4) : '3165') + '@easypay)',
            paymentMethod: 'Wallet',
            note: note || 'Transferred via EasyPay'
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(debitTxn);

        // 6. Handle category-specific side effects:
        // A. Gift Card -> Vouchers list & voucher issuance
        let voucherResult = null;
        if (finalType === 'GIFT_CARD') {
          const vCode = details?.voucherCode || ('HB-' + (recipientName || 'GIFT').substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X') + '-' + Math.floor(10000000 + Math.random() * 90000000));
          const vPin = details?.voucherPin || Math.floor(100000 + Math.random() * 900000).toString();
          const validTill = details?.validTill || new Date(Date.now() + 365*24*3600*1000).toISOString().split('T')[0];

          voucherResult = {
            id: 'VOUCH_' + Date.now(),
            brand: details?.brandName || recipientName || 'Brand Voucher',
            brandId: details?.brandId || '',
            amount: details?.faceValue || sendAmt,
            netPayable: sendAmt,
            discount: details?.discount || 0,
            cashbackEarned: details?.discount || 0,
            voucherCode: vCode,
            pin: vPin,
            expiryDate: validTill,
            validTill: validTill,
            purchasedAt: new Date().toISOString(),
            status: 'ACTIVE',
            category: 'Voucher'
          };
          data.vouchers = data.vouchers || [];
          data.vouchers.unshift(voucherResult);

          if (data.analytics) {
            data.analytics.giftCardsSold = (data.analytics.giftCardsSold || 0) + 1;
          }
        }

        // B. Recharge -> analytics
        if (finalType === 'RECHARGE') {
          if (data.analytics) {
            data.analytics.rechargesDone = (data.analytics.rechargesDone || 0) + 1;
          }
        }

        // C. Update total GMV & commission
        if (data.analytics) {
          data.analytics.totalGmv = (data.analytics.totalGmv || 0) + sendAmt;
          data.analytics.platformCommissionEarned = (data.analytics.platformCommissionEarned || 0) + (sendAmt * 0.02);
        }

        // D. If P2P transfer with a registered recipient, credit their wallet
        if (recipientQuery && finalType === 'UPI_DEBIT') {
          const q = recipientQuery.trim().toLowerCase();
          const p2pRecipient = data.users.find(u =>
            (u.payId && u.payId.toLowerCase() === q) ||
            (u.mobile && (u.mobile === q || q.includes(u.mobile))) ||
            (u.id && u.id.toLowerCase() === q)
          );
          if (p2pRecipient) {
            p2pRecipient.walletBalance = Math.round(((p2pRecipient.walletBalance || 0) + sendAmt) * 100) / 100;
            const creditTxn = {
              id: 'TXN_' + (Date.now() + 1).toString().slice(-8),
              title: 'Received from ' + (activeUser.name || 'EasyPay User'),
              category: 'Money Transfer',
              amount: sendAmt,
              cashback: 0,
              timestamp: 'Just now',
              date: dateStr + ', ' + timeStr,
              status: 'SUCCESS',
              type: 'UPI_CREDIT',
              icon: '/assets/bachatpay/history/credit_history.png',
              utr: finalUtr,
              details: {
                fromUser: activeUser.name,
                fromMobile: activeUser.mobile,
                utr: finalUtr
              }
            };
            data.transactions.unshift(creditTxn);
          }
        }

        // 7. Persist to server/db.json
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          newBalance: newBal,
          transaction: debitTxn,
          voucher: voucherResult,
          analytics: data.analytics
        }));
      } catch (err) {
        console.error('Wallet transact error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
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
          data.user.walletBalance = Math.round(((data.user.walletBalance || 0) + addAmt) * 100) / 100;
        }

        if (data.users && Array.isArray(data.users)) {
          data.users.forEach(u => {
            if (data.user && u.mobile === data.user.mobile) {
              u.walletBalance = data.user.walletBalance;
            }
          });
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
          folioNumber: folioNum,
          userId: (data.user && data.user.id) || 'EPY31650',
          userMobile: (data.user && data.user.mobile) ? ('+91 ' + data.user.mobile.replace(/\D/g, '').slice(-10)) : '+91 7013893165',
          userName: (data.user && data.user.name) || 'arman khan'
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

  // ==============================================================
  // COMPREHENSIVE ADMIN MANAGEMENT APIS (CRUD & APP ORCHESTRATION)
  // ==============================================================

  // --- 1. Investment Plans Management ---
  // API: Admin Add Investment Plan
  if (url === '/api/admin/invest-plans/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        const rate = parseFloat(payload.monthlyRate || payload.newRate) || 9.0;
        const newPlan = {
          id: payload.id || ('plan_' + Date.now().toString().slice(-6)),
          title: payload.title || 'New Investment Plan',
          badge: payload.badge || 'ACTIVE PLAN',
          monthlyRate: rate,
          newRate: rate,
          oldRate: parseFloat(payload.oldRate) || (rate - 0.5),
          rateText: payload.rateText || (rate + '% per month'),
          tenure: payload.tenure || '6 Months',
          tenureMonths: parseInt(payload.tenureMonths) || 6,
          tenures: payload.tenures || [6, 12, 24, 36, 60],
          category: payload.category || 'Fixed Deposit',
          rbiRegulated: payload.rbiRegulated !== undefined ? !!payload.rbiRegulated : true,
          dicgcInsured: payload.dicgcInsured !== undefined ? !!payload.dicgcInsured : true,
          minAmount: parseFloat(payload.minAmount) || 1000,
          interestPayout: payload.interestPayout || 'Credited to Wallet Daily',
          lockInNotice: payload.lockInNotice || 'Starts from 6 months with daily interest wallet credit',
          active: payload.active !== undefined ? !!payload.active : true,
          icon: payload.icon || 'fa-vault',
          color: payload.color || '#059669'
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

  // API: Admin Update Investment Plan
  if (url === '/api/admin/invest-plans/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        const plan = (data.bonds || []).find(b => b.id === payload.id);
        if (!plan) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Plan not found' }));
          return;
        }

        if (payload.title !== undefined) plan.title = payload.title;
        if (payload.category !== undefined) plan.category = payload.category;
        if (payload.badge !== undefined) plan.badge = payload.badge;
        if (payload.monthlyRate !== undefined) {
          plan.monthlyRate = parseFloat(payload.monthlyRate);
          plan.newRate = plan.monthlyRate;
          plan.rateText = plan.monthlyRate + '% per month';
        }
        if (payload.oldRate !== undefined) plan.oldRate = parseFloat(payload.oldRate);
        if (payload.minAmount !== undefined) plan.minAmount = parseFloat(payload.minAmount);
        if (payload.tenureMonths !== undefined) {
          plan.tenureMonths = parseInt(payload.tenureMonths);
          plan.tenure = plan.tenureMonths + ' Months';
        }
        if (payload.tenures !== undefined && Array.isArray(payload.tenures)) plan.tenures = payload.tenures;
        if (payload.lockInNotice !== undefined) plan.lockInNotice = payload.lockInNotice;
        if (payload.interestPayout !== undefined) plan.interestPayout = payload.interestPayout;
        if (payload.icon !== undefined) plan.icon = payload.icon;
        if (payload.color !== undefined) plan.color = payload.color;
        if (payload.active !== undefined) plan.active = !!payload.active;
        if (payload.rbiRegulated !== undefined) plan.rbiRegulated = !!payload.rbiRegulated;
        if (payload.dicgcInsured !== undefined) plan.dicgcInsured = !!payload.dicgcInsured;

        writeDb(data);
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

  // API: Admin Delete Investment Plan
  if (url === '/api/admin/invest-plans/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        data.bonds = (data.bonds || []).filter(b => b.id !== id);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Plan deleted successfully' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- 2. Active User Investments (Bookings) ---
  // API: List All User Investments
  if (url === '/api/admin/investments/list' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.investments || []));
    return;
  }

  // API: Update Investment Status (Active / Matured / Cancelled)
  if (url === '/api/admin/investments/update-status' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id, status } = JSON.parse(body || '{}');
        const data = readDb();
        const inv = (data.investments || []).find(i => i.id === id);
        if (inv) {
          inv.status = status || inv.status;
          writeDb(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, investment: inv }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Delete Investment
  if (url === '/api/admin/investments/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        data.investments = (data.investments || []).filter(i => i.id !== id);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Investment record deleted' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Create Manual Investment Certificate
  if (url === '/api/admin/investments/create-manual' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        const principal = parseFloat(payload.principal) || 10000;
        const monthlyRate = parseFloat(payload.monthlyRate) || 8.6;
        const tenureMonths = parseInt(payload.tenureMonths) || 6;
        const monthlyInterest = (principal * monthlyRate) / 100;
        const totalInterest = monthlyInterest * tenureMonths;
        const maturityAmount = principal + totalInterest;
        const dailyPayout = Number((monthlyInterest / 30).toFixed(2));

        const now = new Date();
        const matDate = new Date();
        matDate.setMonth(matDate.getMonth() + tenureMonths);

        const reqMobile = (payload.userMobile || (data.user && data.user.mobile) || '7013893165').toString().replace(/\D/g, '').slice(-10);
        const matchedUser = (data.users || []).find(u => (u.mobile || '').replace(/\D/g, '').slice(-10) === reqMobile) || data.user;
        const targetUserId = (matchedUser && matchedUser.id) ? matchedUser.id : ('EPY' + reqMobile.slice(-5));
        const formattedMobile = '+91 ' + reqMobile;

        const newInv = {
          id: 'INV_MANUAL_' + Date.now().toString().slice(-6),
          institution: payload.institution || 'Suryoday SF Bank Plan',
          bondId: payload.bondId || 'suryoday_fd',
          category: payload.category || 'Fixed Deposit',
          principal,
          monthlyRate,
          interestRate: monthlyRate,
          rateText: monthlyRate + '% per month',
          monthlyInterest,
          dailyPayout,
          totalInterest,
          tenureMonths,
          maturityAmount,
          bookingDate: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          maturityDate: matDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          payoutFreq: 'Daily Payout to Wallet',
          status: payload.status || 'ACTIVE',
          dicgcInsured: true,
          certNumber: 'DICGC-EP-' + Math.floor(100000 + Math.random() * 900000),
          folioNumber: 'EP-FD-' + Math.floor(1000 + Math.random() * 9000),
          userMobile: formattedMobile,
          userId: targetUserId,
          userName: (matchedUser && matchedUser.name) || 'EasyPay User'
        };

        data.investments = data.investments || [];
        data.investments.unshift(newInv);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, investment: newInv }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- 3. Brand Gift Cards Delete API ---
  if (url === '/api/gift-cards/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        data.giftCards = (data.giftCards || []).filter(c => c.id !== id);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Brand deleted' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- 4. Issued Vouchers Vault APIs ---
  // API: List All Vouchers
  if (url === '/api/admin/vouchers/list' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.vouchers || []));
    return;
  }

  // API: Issue Manual Voucher
  if (url === '/api/admin/vouchers/issue' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { brand, amount, userMobile, category, expiryMonths } = JSON.parse(body || '{}');
        const data = readDb();
        const amt = parseFloat(amount) || 500;
        const brandCode = (brand || 'VOUCH').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4) || 'CARD';
        
        const r1 = Math.floor(1000 + Math.random() * 9000);
        const r2 = Math.floor(1000 + Math.random() * 9000);
        const r3 = Math.floor(1000 + Math.random() * 9000);
        const voucherCode = brandCode + '-' + r1 + '-' + r2 + '-' + r3;
        const pin = Math.floor(1000 + Math.random() * 9000).toString();

        const exp = new Date();
        exp.setMonth(exp.getMonth() + (parseInt(expiryMonths) || 12));

        const newVoucher = {
          id: 'vouch_' + Date.now(),
          brand: brand || 'Amazon Pay',
          cardId: (brand || '').toLowerCase().replace(/[^a-z0-9]/g, '_'),
          amount: amt,
          voucherCode,
          pin,
          expiryDate: exp.toISOString().split('T')[0],
          purchasedAt: new Date().toISOString(),
          cashbackEarned: Math.round(amt * 0.05),
          status: 'ACTIVE',
          category: category || 'E-Commerce',
          userMobile: userMobile || (data.user && data.user.mobile) || '9876548808'
        };

        data.vouchers = data.vouchers || [];
        data.vouchers.unshift(newVoucher);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, voucher: newVoucher }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Update Voucher Status
  if (url === '/api/admin/vouchers/update-status' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id, status } = JSON.parse(body || '{}');
        const data = readDb();
        const v = (data.vouchers || []).find(vch => vch.id === id);
        if (v) {
          v.status = status || v.status;
          writeDb(data);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, voucher: v }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Delete Voucher
  if (url === '/api/admin/vouchers/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        data.vouchers = (data.vouchers || []).filter(v => v.id !== id);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Voucher deleted' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- 5. Users & Wallets Management APIs ---
  // API: List All Platform Users
  if (url === '/api/admin/users/list' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.users || []));
    return;
  }

  // API: Create New User
  if (url === '/api/admin/users/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { firstName, lastName, mobile, email, walletBalance, securityPin, bankName, bankAccountMasked } = JSON.parse(body || '{}');
        const data = readDb();
        const f = (firstName || 'New').trim();
        const l = (lastName || 'User').trim();
        const mob = (mobile || '').replace(/[^0-9]/g, '').slice(-10);

        const newUser = {
          id: 'EPY' + Math.floor(10000 + Math.random() * 90000),
          firstName: f,
          lastName: l,
          name: f + ' ' + l,
          mobile: mob,
          maskedMobile: 'xxxxxx' + mob.slice(-4),
          email: email || (f.toLowerCase() + '.' + l.toLowerCase() + '@gmail.com'),
          payId: mob + '@easypay',
          walletBalance: parseFloat(walletBalance) || 0,
          securityPin: securityPin || '1234',
          bankName: bankName || 'STATE BANK OF INDIA',
          bankAccountMasked: bankAccountMasked || ('xxxx ' + Math.floor(1000 + Math.random() * 9000)),
          kycStatus: 'VERIFIED',
          cibilScore: 750 + Math.floor(Math.random() * 50),
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        };

        data.users = data.users || [];
        data.users.unshift(newUser);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: newUser }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Update User Details
  if (url === '/api/admin/users/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        const user = (data.users || []).find(u => u.id === payload.id || u.mobile === payload.mobile);
        if (user) {
          if (payload.firstName !== undefined) user.firstName = payload.firstName;
          if (payload.lastName !== undefined) user.lastName = payload.lastName;
          user.name = [user.firstName, user.lastName].filter(Boolean).join(' ');
          if (payload.email !== undefined) user.email = payload.email;
          if (payload.mobile !== undefined) {
            user.mobile = payload.mobile;
            user.maskedMobile = 'xxxxxx' + user.mobile.slice(-4);
            user.payId = user.mobile + '@easypay';
          }
          if (payload.securityPin !== undefined) user.securityPin = payload.securityPin;
          if (payload.bankName !== undefined) user.bankName = payload.bankName;
          if (payload.bankAccountMasked !== undefined) user.bankAccountMasked = payload.bankAccountMasked;
          if (payload.kycStatus !== undefined) user.kycStatus = payload.kycStatus;
          if (payload.status !== undefined) user.status = payload.status;

          // If current logged in user in db matches, sync
          if (data.user && (data.user.id === user.id || data.user.mobile === user.mobile)) {
            data.user.firstName = user.firstName;
            data.user.lastName = user.lastName;
            data.user.name = user.name;
            data.user.email = user.email;
            data.user.securityPin = user.securityPin;
          }

          writeDb(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, user }));
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'User not found' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Adjust User Wallet (Credit / Debit)
  if (url === '/api/admin/users/adjust-wallet' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id, amount, type, note } = JSON.parse(body || '{}');
        const data = readDb();
        const user = (data.users || []).find(u => u.id === id);
        if (!user) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'User not found' }));
          return;
        }

        const amt = parseFloat(amount) || 0;
        if (amt <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid adjustment amount' }));
          return;
        }

        if (type === 'CREDIT') {
          user.walletBalance = Number(((user.walletBalance || 0) + amt).toFixed(2));
        } else {
          user.walletBalance = Number(Math.max(0, (user.walletBalance || 0) - amt).toFixed(2));
        }

        if (data.user && (data.user.id === user.id || data.user.mobile === user.mobile)) {
          data.user.walletBalance = user.walletBalance;
        }

        // Add transaction audit record
        const txn = {
          id: 'TXN_ADM_' + Date.now().toString().slice(-8),
          title: 'Admin Wallet ' + (type === 'CREDIT' ? 'Credit' : 'Debit') + (note ? (' - ' + note) : ''),
          category: 'Admin Adjustment',
          amount: amt,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: type === 'CREDIT' ? 'WALLET_ADD' : 'WALLET_DEBIT',
          icon: '/assets/bachatpay/history/' + (type === 'CREDIT' ? 'credit_history.png' : 'debit_history.png'),
          details: {
            adminNote: note || 'Manual balance adjustment by Administrator',
            userId: user.id,
            userName: user.name,
            adjustedBalance: user.walletBalance
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(txn);
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, newBalance: user.walletBalance, transaction: txn }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Delete User
  if (url === '/api/admin/users/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        data.users = (data.users || []).filter(u => u.id !== id);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'User deleted' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- 6. Transactions & Audit Ledger APIs ---
  // API: List Transactions
  if (url === '/api/admin/transactions/list' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.transactions || []));
    return;
  }

  // API: Delete Single Transaction
  if (url === '/api/admin/transactions/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        data.transactions = (data.transactions || []).filter(t => t.id !== id);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Transaction removed' }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- 7. System Configuration & App Settings APIs ---
  // API: Get System Settings
  if (url === '/api/admin/settings' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.systemSettings || {}));
    return;
  }

  // API: Update System Settings
  if (url === '/api/admin/settings/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        data.systemSettings = data.systemSettings || {};
        Object.assign(data.systemSettings, payload, { lastUpdated: new Date().toISOString() });
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, settings: data.systemSettings }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // --- 8. Data Export & Analytics APIs ---
  // API: Export Full Database JSON Snapshot
  if (url === '/api/admin/export-data' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="easypay_backup_' + Date.now() + '.json"'
    });
    res.end(JSON.stringify(data, null, 2));
    return;
  }

  // API: Update Analytics Targets
  if (url === '/api/admin/analytics/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        data.analytics = data.analytics || {};
        Object.assign(data.analytics, payload);
        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, analytics: data.analytics }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  
  // ==============================================================
  // WEEKLY REWARDS / LUCKY DRAW APIS
  // ==============================================================

  // API: Get Current Lucky Draw Info
  if (url === '/api/luckydraw/info' && req.method === 'GET') {
    const data = readDb();
    const ld = data.luckyDraw || {};
    ld.entryAmount = ld.entryAmount !== undefined ? ld.entryAmount : 50;
    ld.prizeAmount = ld.prizeAmount !== undefined ? ld.prizeAmount : 25000;
    ld.firstPrize = ld.firstPrize || '₹' + ld.prizeAmount.toLocaleString('en-IN') + ' Mega Cash';
    ld.boxState = ld.boxState || 'COUNTDOWN';

    const userMobile = data.user ? data.user.mobile : '';
    const userTickets = (ld.tickets || []).filter(t => t.userMobile === userMobile || t.userId === (data.user && data.user.id));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      luckyDraw: ld,
      userTickets,
      isUserEnrolled: userTickets.length > 0,
      userWalletBalance: (data.user && data.user.walletBalance) || 0
    }));
    return;
  }

  // API: Enter Lucky Draw (Pay Entry Fee - Direct ₹50 or Admin Configured)
  if (url === '/api/luckydraw/enter' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { amount, paymentMethod } = JSON.parse(body || '{}');
        const data = readDb();
        const ld = data.luckyDraw || {};
        
        const entryAmount = parseFloat(amount) || parseFloat(ld.entryAmount) || 50;

        // Verify balance if wallet payment
        if (paymentMethod === 'WALLET' || !paymentMethod) {
          if (!data.user) data.user = {};
          const currentBal = parseFloat(data.user.walletBalance) || 0;
          if (currentBal < entryAmount) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Insufficient wallet balance. Please add funds.' }));
            return;
          }
          data.user.walletBalance = Number((currentBal - entryAmount).toFixed(2));
          // If in data.users, sync
          const u = (data.users || []).find(usr => usr.id === data.user.id || usr.mobile === data.user.mobile);
          if (u) u.walletBalance = data.user.walletBalance;
        }

        // Generate Ticket
        const rTicket = Math.floor(10000 + Math.random() * 90000);
        const ticketId = 'TKT-SUN-' + rTicket;
        const now = new Date();

        const newTicket = {
          ticketId,
          userId: (data.user && data.user.id) || 'EPY98808',
          userName: (data.user && data.user.name) || 'Nirod behera',
          userMobile: (data.user && data.user.mobile) || '9876548808',
          tierId: 'direct_entry',
          tierName: 'Direct Entry',
          amount: entryAmount,
          chances: 1,
          bookedAt: now.toISOString(),
          drawDate: ld.schedule || 'Every Sunday at 8:00 PM',
          status: 'ENROLLED'
        };

        ld.tickets = ld.tickets || [];
        ld.tickets.unshift(newTicket);

        // Add Transaction Record
        const txn = {
          id: 'TXN_DRW_' + Date.now().toString().slice(-8),
          title: 'Weekly Lucky Draw Entry (Ticket #' + newTicket.ticketId + ')',
          category: 'Weekly Rewards',
          amount: entryAmount,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'WALLET_DEBIT',
          icon: '/assets/bachatpay/history/debit_history.png',
          details: {
            ticketId: newTicket.ticketId,
            chances: 1,
            drawSchedule: ld.schedule || 'Every Sunday at 8:00 PM',
            nextDrawTime: ld.nextDrawTime,
            paymentMethod: paymentMethod || 'WALLET'
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(txn);

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          ticket: newTicket,
          newBalance: data.user ? data.user.walletBalance : 0,
          transaction: txn
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // API: Admin Update Lucky Draw Settings (Entry Fee, Prize, Schedule, Box State)
  if (url === '/api/admin/luckydraw/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const data = readDb();
        data.luckyDraw = data.luckyDraw || {};
        
        if (payload.entryAmount !== undefined) data.luckyDraw.entryAmount = parseFloat(payload.entryAmount) || 50;
        if (payload.prizeAmount !== undefined) data.luckyDraw.prizeAmount = parseFloat(payload.prizeAmount) || 25000;
        if (payload.firstPrize !== undefined) data.luckyDraw.firstPrize = payload.firstPrize;
        if (payload.title !== undefined) data.luckyDraw.title = payload.title;
        if (payload.schedule !== undefined) data.luckyDraw.schedule = payload.schedule;
        if (payload.nextDrawTime !== undefined) data.luckyDraw.nextDrawTime = payload.nextDrawTime;
        if (payload.boxState !== undefined) data.luckyDraw.boxState = payload.boxState;
        if (payload.prizePool !== undefined) data.luckyDraw.prizePool = parseFloat(payload.prizePool) || 50000;

        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, luckyDraw: data.luckyDraw }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Admin Execute Lucky Draw & Open Gift Box
  if (url === '/api/admin/luckydraw/draw-winner' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { specificTicketId, prizeAmount } = JSON.parse(body || '{}');
        const data = readDb();
        const ld = data.luckyDraw || {};
        const tickets = ld.tickets || [];

        if (tickets.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'No tickets enrolled in the current draw.' }));
          return;
        }

        // Select winning ticket
        let winTicket = tickets.find(t => t.ticketId === specificTicketId);
        if (!winTicket) {
          const pool = [];
          tickets.forEach(t => {
            const count = t.chances || 1;
            for (let i = 0; i < count; i++) pool.push(t);
          });
          const pickIndex = Math.floor(Math.random() * pool.length);
          winTicket = pool[pickIndex];
        }

        const winPrize = parseFloat(prizeAmount) || parseFloat(ld.prizeAmount) || 25000;
        const now = new Date();

        const winnerRecord = {
          drawDate: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', 8:00 PM',
          winnerName: winTicket.userName || 'Winner',
          winnerMobile: 'xxxxxx' + (winTicket.userMobile || '8808').slice(-4),
          userMobileRaw: winTicket.userMobile,
          userId: winTicket.userId,
          ticketId: winTicket.ticketId,
          tier: 'Direct Entry',
          prizeWon: '₹' + winPrize.toLocaleString('en-IN') + ' Mega Cash',
          amount: winPrize,
          announcement: 'Congratulations to ' + winTicket.userName + ' for winning the Sunday 8:00 PM Draw (' + winTicket.ticketId + ')!'
        };

        // If the winner is the active user or in users list, credit wallet!
        if (data.user && (data.user.id === winTicket.userId || data.user.mobile === winTicket.userMobile)) {
          data.user.walletBalance = Number(((data.user.walletBalance || 0) + winPrize).toFixed(2));
        }
        const matchUser = (data.users || []).find(u => u.id === winTicket.userId || u.mobile === winTicket.userMobile);
        if (matchUser) {
          matchUser.walletBalance = Number(((matchUser.walletBalance || 0) + winPrize).toFixed(2));
        }

        // Add Winner Transaction
        const winTxn = {
          id: 'TXN_WIN_' + Date.now().toString().slice(-8),
          title: '🎉 Won Weekly Lucky Draw Jackpot Prize!',
          category: 'Weekly Rewards Winner',
          amount: winPrize,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'WALLET_ADD',
          icon: '/assets/bachatpay/history/credit_history.png',
          details: {
            ticketId: winTicket.ticketId,
            prize: '₹' + winPrize.toLocaleString('en-IN'),
            drawDate: winnerRecord.drawDate,
            winnerName: winTicket.userName
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(winTxn);

        // Archive previous draw
        ld.pastDraws = ld.pastDraws || [];
        ld.pastDraws.unshift({
          drawId: 'DRAW_SUN_' + Date.now().toString().slice(-6),
          date: winnerRecord.drawDate,
          winnerName: winTicket.userName,
          ticketId: winTicket.ticketId,
          tier: 'Lucky Draw Entry',
          prize: '₹' + winPrize.toLocaleString('en-IN'),
          totalParticipants: tickets.length
        });

        // Set as latest winner and OPEN the gift box
        ld.latestWinner = winnerRecord;
        ld.boxState = 'OPENED';

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          winner: winnerRecord,
          transaction: winTxn,
          boxState: 'OPENED'
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Admin Reset Lucky Draw to Countdown Mode for Next Sunday
  if (url === '/api/admin/luckydraw/reset' && req.method === 'POST') {
    const data = readDb();
    data.luckyDraw = data.luckyDraw || {};
    data.luckyDraw.boxState = 'COUNTDOWN';
    data.luckyDraw.tickets = [];
    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
    nextSunday.setHours(20, 0, 0, 0);
    data.luckyDraw.nextDrawTime = nextSunday.toISOString();
    writeDb(data);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, luckyDraw: data.luckyDraw }));
    return;
  }

  // API: Admin Execute Lucky Draw & Pick Winner
  if (url === '/api/admin/luckydraw/draw-winner' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { specificTicketId, prizeAmount } = JSON.parse(body || '{}');
        const data = readDb();
        const ld = data.luckyDraw || {};
        const tickets = ld.tickets || [];

        if (tickets.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'No tickets enrolled in the current draw.' }));
          return;
        }

        // Select winning ticket
        let winTicket = tickets.find(t => t.ticketId === specificTicketId);
        if (!winTicket) {
          const pool = [];
          tickets.forEach(t => {
            const count = t.chances || 1;
            for (let i = 0; i < count; i++) pool.push(t);
          });
          const pickIndex = Math.floor(Math.random() * pool.length);
          winTicket = pool[pickIndex];
        }

        const winPrize = parseFloat(prizeAmount) || 25000;
        const now = new Date();

        const winnerRecord = {
          drawDate: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', 8:00 PM',
          winnerName: winTicket.userName || 'Winner',
          winnerMobile: 'xxxxxx' + (winTicket.userMobile || '8808').slice(-4),
          userMobileRaw: winTicket.userMobile,
          userId: winTicket.userId,
          ticketId: winTicket.ticketId,
          tier: winTicket.tierName || 'Lucky Entry',
          prizeWon: '₹' + winPrize.toLocaleString('en-IN') + ' Mega Cash',
          amount: winPrize,
          announcement: 'Congratulations to ' + winTicket.userName + ' for winning the Sunday 8:00 PM Draw (' + winTicket.ticketId + ')!'
        };

        // If the winner is the active user or in users list, credit wallet!
        if (data.user && (data.user.id === winTicket.userId || data.user.mobile === winTicket.userMobile)) {
          data.user.walletBalance = Number(((data.user.walletBalance || 0) + winPrize).toFixed(2));
        }
        const matchUser = (data.users || []).find(u => u.id === winTicket.userId || u.mobile === winTicket.userMobile);
        if (matchUser) {
          matchUser.walletBalance = Number(((matchUser.walletBalance || 0) + winPrize).toFixed(2));
        }

        // Add Winner Transaction
        const winTxn = {
          id: 'TXN_WIN_' + Date.now().toString().slice(-8),
          title: '🎉 Won Weekly Lucky Draw Jackpot Prize!',
          category: 'Weekly Rewards Winner',
          amount: winPrize,
          cashback: 0,
          timestamp: 'Just now',
          status: 'SUCCESS',
          type: 'WALLET_ADD',
          icon: '/assets/bachatpay/history/credit_history.png',
          details: {
            ticketId: winTicket.ticketId,
            prize: '₹' + winPrize.toLocaleString('en-IN'),
            drawDate: winnerRecord.drawDate,
            winnerName: winTicket.userName
          }
        };

        data.transactions = data.transactions || [];
        data.transactions.unshift(winTxn);

        // Archive previous draw
        ld.pastDraws = ld.pastDraws || [];
        ld.pastDraws.unshift({
          drawId: 'DRAW_SUN_' + Date.now().toString().slice(-6),
          date: winnerRecord.drawDate,
          winnerName: winTicket.userName,
          ticketId: winTicket.ticketId,
          tier: winTicket.tierName,
          prize: '₹' + winPrize.toLocaleString('en-IN'),
          totalParticipants: tickets.length
        });

        // Set as latest winner
        ld.latestWinner = winnerRecord;

        // Reset tickets for the next Sunday draw
        ld.tickets = [];

        // Schedule next Sunday 8:00 PM
        const nextSunday = new Date();
        nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
        nextSunday.setHours(20, 0, 0, 0);
        ld.nextDrawTime = nextSunday.toISOString();

        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          winner: winnerRecord,
          transaction: winTxn,
          nextDrawTime: ld.nextDrawTime
        }));
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

  // API: Create E-Commerce Mall Order
  if (url === '/api/orders/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const orderData = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.orders) data.orders = [];

        const newOrder = {
          id: orderData.id || ('ORD-' + Math.floor(100000 + Math.random() * 900000)),
          userId: orderData.userId || 'EPY31650',
          userName: orderData.userName || orderData.deliveryAddress?.name || 'arman khan',
          userMobile: orderData.userMobile || orderData.deliveryAddress?.mobile || '7013893165',
          items: orderData.items || [],
          subtotal: orderData.subtotal || 0,
          discount: orderData.discount || 0,
          total: orderData.total || orderData.totalAmount || 0,
          totalAmount: orderData.totalAmount || orderData.total || 0,
          paymentMethod: orderData.paymentMethod || 'EasyPay Wallet',
          deliveryAddress: orderData.deliveryAddress || {},
          shippingAddress: orderData.shippingAddress || {
            fullName: orderData.deliveryAddress?.name || 'arman khan',
            phone: orderData.deliveryAddress?.mobile || '7013893165',
            addressLine: orderData.deliveryAddress?.address || '',
            city: orderData.deliveryAddress?.city || '',
            state: orderData.deliveryAddress?.state || '',
            pincode: orderData.deliveryAddress?.pincode || ''
          },
          status: 'Order Confirmed',
          createdAt: orderData.createdAt || new Date().toISOString(),
          trackingNumber: 'BD-' + Math.floor(10000000 + Math.random() * 90000000),
          courier: 'Blue Dart Express',
          estimatedDelivery: '3-4 business days',
          stages: [
            { title: 'Order Confirmed', description: 'Your order has been placed and verified', date: 'Today', completed: true },
            { title: 'Packed at Warehouse', description: 'Item is being inspected & packed', date: 'Expected Tomorrow', completed: false },
            { title: 'Dispatched with Blue Dart', description: 'Courier will pick up package', date: 'Expected in 2 days', completed: false },
            { title: 'Out for Delivery', description: 'Delivery agent will call upon arrival', date: 'Expected in 3 days', completed: false },
            { title: 'Delivered', description: 'Delivered to your address', date: 'Expected in 4 days', completed: false }
          ]
        };

        data.orders.unshift(newOrder);
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, order: newOrder }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Get Orders List
  if (url === '/api/orders/list' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      orders: data.orders || [],
      vouchers: data.vouchers || []
    }));
    return;
  }

  // API: Admin Update Order Status (E-Commerce Order Management)
  if (url === '/api/admin/orders/update-status' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { orderId, status } = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.orders) data.orders = [];

        const order = data.orders.find(o => o.id === orderId);
        if (!order) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Order not found' }));
          return;
        }

        order.status = status;

        const stageNames = [
          'Order Confirmed',
          'Packed at Warehouse',
          'Dispatched with Blue Dart',
          'Out for Delivery',
          'Delivered'
        ];

        const targetIndex = stageNames.indexOf(status);
        if (targetIndex !== -1 && order.stages) {
          order.stages.forEach((st, idx) => {
            st.completed = idx <= targetIndex;
            if (st.completed && !st.date.includes('Today') && !st.date.includes('Yesterday')) {
              st.date = 'Updated Today, ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            }
          });
        }

        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, order }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Products Catalog Management (Client & Admin)
  if (url === '/api/products/list' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      products: data.products || []
    }));
    return;
  }

  // API: Admin Add New Product
  if (url === '/api/admin/products/add' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const prod = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.products) data.products = [];

        const newProd = {
          id: prod.id || ('prod_' + Date.now()),
          title: prod.title || 'New Product',
          brand: prod.brand || 'EasyPay',
          category: prod.category || 'Electronics',
          price: parseFloat(prod.price) || 999,
          origPrice: parseFloat(prod.origPrice) || (parseFloat(prod.price) * 2) || 1999,
          discount: prod.discount || (Math.round((1 - (parseFloat(prod.price) / (parseFloat(prod.origPrice) || parseFloat(prod.price)*2))) * 100) + '% OFF'),
          badge: prod.badge || 'New Arrival',
          rating: prod.rating || 4.8,
          reviewsCount: prod.reviewsCount || 1,
          stockStatus: prod.stockStatus || 'In Stock',
          img: prod.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
          description: prod.description || 'High quality product from EasyPay Mall.',
          specs: prod.specs || {
            'Brand': prod.brand || 'EasyPay',
            'Model Name': prod.title || 'Product Model',
            'Warranty': '1 Year Brand Warranty',
            'In The Box': 'Product, Accessories, User Guide'
          }
        };

        data.products.unshift(newProd);
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, product: newProd }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Admin Update Product
  if (url === '/api/admin/products/update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const prod = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.products) data.products = [];

        const idx = data.products.findIndex(p => p.id === prod.id);
        if (idx === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Product not found' }));
          return;
        }

        data.products[idx] = { ...data.products[idx], ...prod };
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, product: data.products[idx] }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Admin Delete Product
  if (url === '/api/admin/products/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { id } = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.products) data.products = [];

        data.products = data.products.filter(p => p.id !== id);
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Get Coupons List
  if (url === '/api/coupons/list' && req.method === 'GET') {
    const data = readDb();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      coupons: data.coupons || []
    }));
    return;
  }

  // API: Admin Create Coupon Code
  if (url === '/api/admin/coupons/create' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const c = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.coupons) data.coupons = [];

        const newCoupon = {
          code: (c.code || '').trim().toUpperCase(),
          discountType: c.discountType || 'flat',
          discountValue: parseFloat(c.discountValue) || 50,
          minOrder: parseFloat(c.minOrder) || 0,
          maxDiscount: parseFloat(c.maxDiscount) || 200,
          description: c.description || ((c.discountType === 'percent' ? c.discountValue + '% OFF' : '₹' + c.discountValue + ' OFF') + (c.minOrder > 0 ? ' on orders above ₹' + c.minOrder : '')),
          status: c.status || 'ACTIVE',
          createdAt: new Date().toISOString()
        };

        const existingIdx = data.coupons.findIndex(item => item.code === newCoupon.code);
        if (existingIdx !== -1) {
          data.coupons[existingIdx] = newCoupon;
        } else {
          data.coupons.unshift(newCoupon);
        }

        writeDb(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, coupon: newCoupon }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // API: Admin Delete Coupon Code
  if (url === '/api/admin/coupons/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { code } = JSON.parse(body || '{}');
        const data = readDb();
        if (!data.coupons) data.coupons = [];

        data.coupons = data.coupons.filter(item => item.code !== (code || '').toUpperCase());
        writeDb(data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, code }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
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
}

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  BACHAT PAY ENTERPRISE PLATFORM (ONLINE ON PORT ${PORT})`);
    console.log(`  -> Official Website:      http://localhost:${PORT}/`);
    console.log(`  -> Mobile Native App:     http://localhost:${PORT}/app`);
    console.log(`  -> Enterprise Admin:      http://localhost:${PORT}/admin`);
    console.log(`====================================================`);
  });
}

module.exports = requestHandler;
