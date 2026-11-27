const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const HUBBLE_DISK_CACHE = path.join(__dirname, 'hubble_cache.json');

/**
 * Hubble Money API Integration Service
 * Staging Client ID: mobi-pay-dev-api-mpbap8gu
 * Staging Client Secret: tyxdqL3XYa8SiRjFocqkpNPudD4xkJxaTPglSHtIK6YZ7tf9mQpo4hAlDmkSDmIi
 * Docs: https://docs.myhubble.money
 */

const HUBBLE_CONFIG = {
  clientId: process.env.HUBBLE_CLIENT_ID || 'mobi-pay-dev-api-mpbap8gu',
  clientSecret: process.env.HUBBLE_CLIENT_SECRET || 'tyxdqL3XYa8SiRjFocqkpNPudD4xkJxaTPglSHtIK6YZ7tf9mQpo4hAlDmkSDmIi',
  baseUrl: process.env.HUBBLE_BASE_URL || 'https://api.dev.myhubble.money',
  timeoutMs: 15000
};

// In-memory token cache
let cachedToken = null;
let tokenExpiresAt = 0;

// In-memory brand cache
let cachedBrands = [];
let lastBrandsFetchTime = 0;
const BRANDS_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Generic HTTPS request helper
 */
function apiRequest(path, method = 'GET', data = null, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, HUBBLE_CONFIG.baseUrl);
    const headers = {
      'Accept': 'application/json',
      'X-REQUEST-ID': crypto.randomUUID(),
      ...customHeaders
    };

    let payload = null;
    if (data) {
      payload = typeof data === 'string' ? data : JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = https.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: headers,
      timeout: HUBBLE_CONFIG.timeoutMs
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, headers: res.headers, data: json, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: null, raw: body, error: e.message });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error(`Hubble API timeout after ${HUBBLE_CONFIG.timeoutMs}ms`));
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

/**
 * Exchange client credentials for a Bearer token
 */
async function getAuthToken(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const res = await apiRequest('/v1/partners/auth/login', 'POST', {
    clientId: HUBBLE_CONFIG.clientId,
    clientSecret: HUBBLE_CONFIG.clientSecret
  });

  if (res.status === 200 && res.data && res.data.token) {
    cachedToken = res.data.token;
    const expiresInSecs = res.data.expiresInSecs || 86400;
    tokenExpiresAt = now + (expiresInSecs * 1000);
    return cachedToken;
  }

  throw new Error(`Hubble Auth Failed (HTTP ${res.status}): ${res.raw || 'No token returned'}`);
}

/**
 * Fetch partner wallet balance from Hubble
 */
async function getWalletBalance() {
  const token = await getAuthToken();
  const res = await apiRequest('/v1/partners/wallet/balance', 'GET', null, {
    'Authorization': `Bearer ${token}`
  });
  if (res.status === 200 && res.data) {
    return res.data;
  }
  throw new Error(`Failed to fetch Hubble wallet balance: ${res.raw}`);
}

/**
 * Map raw Hubble category string to clean user-friendly category name
 */
const EXTRA_ESSENTIAL_BRANDS = [
  ['Rapido', 'rapido.bike', 'Travel & Stays', 5],
  ['Porter', 'porter.in', 'Travel & Stays', 5],
  ['IndianOil XTRAREWARDS', 'iocl.com', 'Travel & Stays', 2],
  ['HPCL HP Pay', 'hindustanpetroleum.com', 'Travel & Stays', 2],
  ['BPCL SmartFleet', 'bharatpetroleum.in', 'Travel & Stays', 2],
  ['Shell India Fuel', 'shell.in', 'Travel & Stays', 2.5],
  ['Jio-bp Pulse & Fuel', 'jiobp.com', 'Travel & Stays', 2.5],
  ['Uber India', 'uber.com', 'Travel & Stays', 4],
  ['Ola Cabs', 'olacabs.com', 'Travel & Stays', 4.5],
  ['BluSmart', 'blu-smart.com', 'Travel & Stays', 6],
  ['Google Play', 'play.google.com', 'Gaming', 3],
  ['Netflix India', 'netflix.com', 'OTT & Entertainment', 3],
  ['Spotify India', 'open.spotify.com', 'OTT & Entertainment', 6],
  ['Steam Wallet', 'store.steampowered.com', 'Gaming', 4],
  ['PlayStation Store', 'playstation.com', 'Gaming', 4],
  ['MakeMyTrip', 'makemytrip.com', 'Travel & Stays', 5],
  ['RedBus', 'redbus.in', 'Travel & Stays', 5],
  ['IndiGo Airlines', 'goindigo.in', 'Travel & Stays', 2.5]
];

function mergeWithEssentialBrands(list) {
  const existingNames = new Set((list || []).map(x => (x.name || '').toLowerCase().trim()));
  const merged = [...(list || [])];
  EXTRA_ESSENTIAL_BRANDS.forEach(([name, domain, category, rate], i) => {
    const key = name.toLowerCase();
    const alreadyHas = Array.from(existingNames).some(en => en.includes(key.split(' ')[0]));
    if (!alreadyHas) {
      const id = 'ep_brand_' + key.replace(/[^a-z0-9]+/g, '_') + '_' + (i + 1);
      merged.push({
        id,
        hubbleId: id,
        name,
        subName: name,
        title: name,
        brandDescription: `Instant ${name} e-gift voucher redeemable across India.`,
        category,
        rawCategories: [category.toUpperCase()],
        tags: [category, name],
        denominationType: 'FIXED',
        denominations: [100, 250, 500, 1000, 2000, 5000],
        minOrderAmount: 100,
        maxOrderAmount: 10000,
        cardType: 'CARD_AND_PIN_NO_SECURED',
        redemptionType: 'ONLINE_AND_OFFLINE',
        logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        thumbnailUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        logoUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        cashbackRate: rate,
        discountRate: rate,
        saveRate: rate,
        saveText: `Save ${rate}%`,
        isTop: false,
        isNew: true,
        termsAndConditions: ['Instant digital delivery', 'Valid for 12 months from issue date'],
        howToUseInstructions: [{ instructions: [`Open ${name} app or outlet`, 'Enter voucher code & PIN at checkout'] }],
        status: 'ACTIVE'
      });
    }
  });
  return merged;
}

function normalizeCategory(cats = []) {
  if (!cats || cats.length === 0) return 'Shopping';
  const c = cats[0].toUpperCase();
  if (c.includes('FOOD') || c.includes('RESTAURANT')) return 'Food & Dining';
  if (c.includes('FASHION') || c.includes('FOOTWARE') || c.includes('HAND_BAGS')) return 'Fashion';
  if (c.includes('ELECTRONIC') || c.includes('APPLIANCE')) return 'Electronics';
  if (c.includes('GROCERY') || c.includes('SUPERMARKET')) return 'Grocery';
  if (c.includes('GAMING')) return 'Gaming';
  if (c.includes('PHARMACY') || c.includes('HEALTH') || c.includes('FITNESS')) return 'Health & Pharmacy';
  if (c.includes('OTT') || c.includes('ENTERTAINMENT') || c.includes('MUSIC')) return 'OTT & Entertainment';
  if (c.includes('TRAVEL') || c.includes('HOTEL')) return 'Travel & Stays';
  if (c.includes('JEWELLERY') || c.includes('LUXURY')) return 'Jewellery & Luxury';
  if (c.includes('HOT_DEALS') || c.includes('TOP_BRANDS')) return 'Hot Deals';
  return 'Shopping';
}

/**
 * Standardize a Hubble brand object for EasyPay application
 */
function mapHubbleBrand(b) {
  const categories = b.category || [];
  const primaryCat = normalizeCategory(categories);
  
  // Clean allowed denominations
  let denominations = [];
  if (b.amountRestrictions && Array.isArray(b.amountRestrictions.denominations) && b.amountRestrictions.denominations.length > 0) {
    denominations = b.amountRestrictions.denominations.sort((x, y) => x - y);
  } else {
    // Flexible default denominations
    denominations = [100, 250, 500, 1000, 2000, 5000];
  }

  // Subvention / instant discount percentage (preserve exact API percentage)
  const rawPct = [b.discountPercentage, b.cashbackPercentage, b.discountRate, b.subvention, b.cashbackRate]
    .find(v => typeof v === 'number' && !isNaN(v) && v >= 0);
  const discountRate = (typeof rawPct === 'number') ? rawPct : 4;

  const isTopBrand = [
    'Flipkart', 'Amazon shopping', 'Zomato', 'Swiggy', 'Reliance Digital',
    'IKEA', 'Zepto', 'Apollo', 'Myntra', 'Lifestyle', 'Senco Gold', 'Firstcry'
  ].some(t => (b.title || '').toLowerCase().includes(t.toLowerCase()));

  const isNewArrival = categories.includes('NEW_BRANDS') || categories.includes('EMERGING_BRANDS');

  return {
    id: b.id,
    hubbleId: b.id,
    name: b.title || 'Brand Voucher',
    subName: b.title || 'Gift Voucher',
    title: b.title,
    brandDescription: b.brandDescription || `Instant e-gift card voucher redeemable across all ${b.title} platforms.`,
    category: primaryCat,
    rawCategories: categories,
    tags: b.tags || [],
    denominationType: b.denominationType || 'FIXED',
    denominations: denominations,
    minOrderAmount: (b.amountRestrictions && (b.amountRestrictions.minOrderAmount || b.amountRestrictions.minVoucherAmount)) || denominations[0] || 50,
    maxOrderAmount: (b.amountRestrictions && (b.amountRestrictions.maxOrderAmount || b.amountRestrictions.maxVoucherAmount)) || denominations[denominations.length - 1] || 10000,
    cardType: b.cardType || 'CARD_AND_PIN_NO_SECURED',
    redemptionType: b.redemptionType || 'ONLINE',
    logo: b.logoUrl || b.thumbnailUrl || b.iconImageUrl || 'https://cdn-icons-png.flaticon.com/512/879/879757.png',
    thumbnailUrl: b.thumbnailUrl || b.logoUrl,
    logoUrl: b.logoUrl,
    cashbackRate: discountRate,
    discountRate: discountRate,
    saveRate: discountRate,
    saveText: `Save ${discountRate}%`,
    isTop: isTopBrand,
    isNew: isNewArrival,
    termsAndConditions: b.termsAndConditions || ['Instant delivery', 'Valid for 1 year from issue date'],
    tncDetailed: b.tncDetailed || null,
    howToUseInstructions: b.howToUseInstructions || [],
    storeLocatorUrl: b.storeLocatorUrl || null,
    status: b.status
  };
}

/**
 * Fetch all active brands from Hubble (with in-memory cache)
 */
async function getActiveBrands(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedBrands.length > 0 && (now - lastBrandsFetchTime < BRANDS_CACHE_TTL)) {
    return cachedBrands;
  }

  try {
    const token = await getAuthToken();
    const res = await apiRequest('/v1/partners/products', 'GET', null, {
      'Authorization': `Bearer ${token}`
    });

    if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
      const activeRaw = res.data.data.filter(b => b.status === 'ACTIVE');
      const mapped = activeRaw.map(mapHubbleBrand);

      mapped.sort((a, b) => {
        if (a.isTop && !b.isTop) return -1;
        if (!a.isTop && b.isTop) return 1;
        return a.name.localeCompare(b.name);
      });

      cachedBrands = mergeWithEssentialBrands(mapped);
      lastBrandsFetchTime = now;
      try { fs.writeFileSync(HUBBLE_DISK_CACHE, JSON.stringify(cachedBrands, null, 2), 'utf8'); } catch (e) {}
      return cachedBrands;
    }
  } catch (err) {
    // Fall back to disk-cached 300+ brand catalog when Hubble staging is unavailable
  }

  if (fs.existsSync(HUBBLE_DISK_CACHE)) {
    try {
      const diskBrands = JSON.parse(fs.readFileSync(HUBBLE_DISK_CACHE, 'utf8'));
      if (Array.isArray(diskBrands) && diskBrands.length > 0) {
        cachedBrands = mergeWithEssentialBrands(diskBrands);
        lastBrandsFetchTime = now;
        return cachedBrands;
      }
    } catch (e) {}
  }

  throw new Error('Failed to fetch Hubble brands and no disk cache found');
}

/**
 * Fetch a single brand by ID
 */
async function getBrandById(productId) {
  const brands = await getActiveBrands();
  const existing = brands.find(b => b.id === productId || b.hubbleId === productId);
  if (existing) return existing;

  const token = await getAuthToken();
  const res = await apiRequest(`/v1/partners/products/${productId}`, 'GET', null, {
    'Authorization': `Bearer ${token}`
  });

  if (res.status === 200 && res.data) {
    return mapHubbleBrand(res.data);
  }
  return null;
}

/**
 * Place a Gift Card order with Hubble Money API
 */
async function placeOrder({ productId, denomination, quantity = 1, customerDetails, referenceId }) {
  const token = await getAuthToken();
  const refId = referenceId || `ORD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const totalAmount = parseFloat(denomination) * parseInt(quantity, 10);

  // Clean customer details
  const cleanPhone = (customerDetails && customerDetails.phoneNumber) 
    ? String(customerDetails.phoneNumber).replace(/[^0-9]/g, '').slice(-10) 
    : '9876543210';

  const orderPayload = {
    productId: productId,
    referenceId: refId,
    amount: totalAmount,
    denominationDetails: [
      {
        denomination: parseFloat(denomination),
        quantity: parseInt(quantity, 10)
      }
    ],
    customerDetails: {
      name: (customerDetails && customerDetails.name) ? customerDetails.name.replace(/[^a-zA-Z\s]/g, '').trim() : 'EasyPay User',
      phoneNumber: cleanPhone,
      email: (customerDetails && customerDetails.email) ? customerDetails.email.trim() : 'support@easypay.com'
    }
  };

  const res = await apiRequest('/v1/partners/orders', 'POST', orderPayload, {
    'Authorization': `Bearer ${token}`
  });

  if ((res.status === 200 || res.status === 201) && res.data) {
    return {
      success: res.data.status === 'SUCCESS',
      orderStatus: res.data.status,
      orderId: res.data.id,
      referenceId: res.data.referenceId,
      vouchers: res.data.vouchers || [],
      failureReason: res.data.failureReason || null,
      raw: res.data
    };
  }

  // Non-200 error
  const errMsg = (res.data && (res.data.message || res.data.error || res.data.code)) || res.raw || `HTTP ${res.status}`;
  throw new Error(`Hubble Order Failed: ${errMsg}`);
}

/**
 * Verify Webhook Signature (X-Verify header)
 */
function verifyWebhookSignature(rawPayload, signatureHeader) {
  if (!signatureHeader) return false;
  try {
    const hmac = crypto.createHmac('sha256', HUBBLE_CONFIG.clientSecret);
    hmac.update(rawPayload);
    const expected = hmac.digest('base64');
    return expected === signatureHeader;
  } catch (e) {
    return false;
  }
}

module.exports = {
  HUBBLE_CONFIG,
  getAuthToken,
  getWalletBalance,
  getActiveBrands,
  getBrandById,
  placeOrder,
  verifyWebhookSignature
};
