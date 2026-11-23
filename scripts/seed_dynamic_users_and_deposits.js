const fs = require('fs');

const db = JSON.parse(fs.readFileSync('server/db.json', 'utf8'));

// 1. Configure Platform Payment Details (Admin Configurable)
db.platformPaymentDetails = db.platformPaymentDetails || {
  upi: {
    accountHolder: 'Lucifer Finer Solutions Private Limited',
    upiId: 'yourbachatpay@kotak',
    merchantTid: 'TID: 68359529',
    qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3Dyourbachatpay%40kotak%26pn%3DLucifer%2520Finer%2520Solutions%2520Private%2520Limited',
    instructions: 'Scan this QR using PhonePe, Google Pay, Paytm or any UPI app. Payment verifies automatically.'
  },
  bank: {
    accountHolder: 'Lucifer Finer Solutions Private Limited',
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '983420192841',
    ifscCode: 'KKBK0000958',
    accountType: 'Current Account',
    branch: 'Nariman Point, Mumbai'
  },
  cash: {
    agentName: 'EasyPay Authorized Cashier & Agent Collection Counter',
    officeAddress: 'Shop 14, Bachat Pay Hub, Andheri Link Road, Mumbai 400053',
    contactNumber: '+91 9876548808',
    instructions: 'Visit the authorized partner counter. Provide your Mobile/PayID and submit cash against receipt.'
  },
  usdt: {
    network: 'TRC-20 (Tron Network)',
    walletAddress: 'TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL',
    qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TYDzsYUEW8kWL65vQ7Q7E18t4G8Z78X8kL',
    exchangeRateInr: 92.50,
    instructions: 'Send only USDT via TRC-20 network to this address. Confirm transaction hash (TxID).'
  }
};

// 2. Configure Sample Deposit Requests (Pending, Approved)
db.depositRequests = [
  {
    id: 'DEP_789101',
    timestamp: '2026-11-23T20:15:00.000Z',
    userId: 'EPY43210',
    userName: 'Rahul Sharma',
    userMobile: '9876543210',
    amount: 2000,
    method: 'UPI',
    utr: 'UPI_983749281726',
    screenshot: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60',
    status: 'PENDING',
    notes: 'PhonePe UPI reference submitted for wallet load'
  },
  {
    id: 'DEP_789102',
    timestamp: '2026-11-23T19:40:00.000Z',
    userId: 'EPY12345',
    userName: 'Priya Patel',
    userMobile: '9812345678',
    amount: 1000,
    method: 'Bank Transfer',
    utr: 'IMPS_982348719283',
    screenshot: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60',
    status: 'PENDING',
    notes: 'ICICI IMPS transfer reference'
  },
  {
    id: 'DEP_789099',
    timestamp: '2026-11-22T14:30:00.000Z',
    userId: 'EPY98808',
    userName: 'Nirod Behera',
    userMobile: '9876548808',
    amount: 5000,
    method: 'Instant UPI',
    utr: 'UPI_980918234190',
    screenshot: '',
    status: 'APPROVED',
    notes: 'Instant UPI wallet load approved'
  }
];

// 3. Configure All 7 Users with distinct, dynamic profiles
const userProfiles = [
  {
    id: 'EPY98808',
    firstName: 'Nirod',
    lastName: 'Behera',
    name: 'Nirod Behera',
    mobile: '9876548808',
    maskedMobile: 'xxxxxx8808',
    email: 'nirodbehera220@gmail.com',
    payId: '9876548808@easypay',
    walletBalance: 30584.13,
    securityPin: '1234',
    mpin: '1234',
    password: 'EasyPay@8808',
    kycStatus: 'VERIFIED',
    bankName: 'BANK OF INDIA',
    bankAccountMasked: 'xxxx 0975',
    pincode: '400001',
    city: 'Mumbai',
    isActivated: true,
    status: 'ACTIVE',
    profilePicture: '',
    referralCode: 'REF_EPY98808',
    referredBy: 'SYSTEM',
    registeredAt: '2026-11-18T18:15:15.374Z'
  },
  {
    id: 'EPY43210',
    firstName: 'Rahul',
    lastName: 'Sharma',
    name: 'Rahul Sharma',
    mobile: '9876543210',
    maskedMobile: 'xxxxxx3210',
    email: 'rahul.sharma@gmail.com',
    payId: '9876543210@easypay',
    walletBalance: 3500.00,
    securityPin: '2580',
    mpin: '2580',
    password: 'Rahul@2026',
    kycStatus: 'VERIFIED',
    bankName: 'HDFC BANK',
    bankAccountMasked: 'xxxx 3210',
    pincode: '110001',
    city: 'New Delhi',
    isActivated: true,
    status: 'ACTIVE',
    profilePicture: '',
    referralCode: 'REF_EPY43210',
    referredBy: 'EPY98808',
    registeredAt: '2026-11-13T10:20:00.000Z'
  },
  {
    id: 'EPY12345',
    firstName: 'Priya',
    lastName: 'Patel',
    name: 'Priya Patel',
    mobile: '9812345678',
    maskedMobile: 'xxxxxx5678',
    email: 'priya.patel@gmail.com',
    payId: '9812345678@easypay',
    walletBalance: 1820.00,
    securityPin: '5678',
    mpin: '5678',
    password: 'Priya@2026',
    kycStatus: 'VERIFIED',
    bankName: 'ICICI BANK',
    bankAccountMasked: 'xxxx 5678',
    pincode: '380001',
    city: 'Ahmedabad',
    isActivated: true,
    status: 'ACTIVE',
    profilePicture: '',
    referralCode: 'REF_EPY12345',
    referredBy: 'EPY98808',
    registeredAt: '2026-11-08T12:00:00.000Z'
  },
  {
    id: 'EPY99887',
    firstName: 'Amit',
    lastName: 'Kumar',
    name: 'Amit Kumar',
    mobile: '9899112233',
    maskedMobile: 'xxxxxx2233',
    email: 'amit.kumar@gmail.com',
    payId: '9899112233@easypay',
    walletBalance: 2100.00,
    securityPin: '1122',
    mpin: '1122',
    password: 'Amit@2026',
    kycStatus: 'VERIFIED',
    bankName: 'STATE BANK OF INDIA',
    bankAccountMasked: 'xxxx 2233',
    pincode: '560001',
    city: 'Bengaluru',
    isActivated: true,
    status: 'ACTIVE',
    profilePicture: '',
    referralCode: 'REF_EPY99887',
    referredBy: 'EPY98808',
    registeredAt: '2026-11-02T15:30:00.000Z'
  },
  {
    id: 'EPY55443',
    firstName: 'Suresh',
    lastName: 'Verma',
    name: 'Suresh Verma',
    mobile: '9845012345',
    maskedMobile: 'xxxxxx2345',
    email: 'suresh.verma@gmail.com',
    payId: '9845012345@easypay',
    walletBalance: 950.00,
    securityPin: '4321',
    mpin: '4321',
    password: 'Suresh@2026',
    kycStatus: 'VERIFIED',
    bankName: 'AXIS BANK',
    bankAccountMasked: 'xxxx 2345',
    pincode: '500001',
    city: 'Hyderabad',
    isActivated: true,
    status: 'ACTIVE',
    profilePicture: '',
    referralCode: 'REF_EPY55443',
    referredBy: 'EPY43210',
    registeredAt: '2026-11-10T16:45:00.000Z'
  },
  {
    id: 'EPY81145',
    firstName: 'Rohan',
    lastName: 'Sharma',
    name: 'Rohan Sharma',
    mobile: '9988776655',
    maskedMobile: 'xxxxxx6655',
    email: 'rohan.sharma@gmail.com',
    payId: '9988776655@easypay',
    walletBalance: 0.00,
    securityPin: '9988',
    mpin: '9988',
    password: 'Rohan@2026',
    kycStatus: 'PENDING',
    bankName: 'STATE BANK OF INDIA',
    bankAccountMasked: 'xxxx 6655',
    pincode: '201301',
    city: 'Noida',
    isActivated: false,
    status: 'NOT_ACTIVE',
    profilePicture: '',
    referralCode: 'REF_EPY81145',
    referredBy: 'EPY12345',
    registeredAt: '2026-11-22T19:00:00.000Z'
  },
  {
    id: 'EPY36297',
    firstName: 'Aarav',
    lastName: 'Patel',
    name: 'Aarav Patel',
    mobile: '9123456789',
    maskedMobile: 'xxxxxx6789',
    email: 'aarav.patel@gmail.com',
    payId: '9123456789@easypay',
    walletBalance: 0.00,
    securityPin: '7890',
    mpin: '7890',
    password: 'Aarav@2026',
    kycStatus: 'PENDING',
    bankName: 'BANK OF BARODA',
    bankAccountMasked: 'xxxx 6789',
    pincode: '395001',
    city: 'Surat',
    isActivated: false,
    status: 'NOT_ACTIVE',
    profilePicture: '',
    referralCode: 'REF_EPY36297',
    referredBy: 'EPY99887',
    registeredAt: '2026-11-23T11:15:00.000Z'
  }
];

db.users = userProfiles;

// Set default active user to Nirod Behera
db.user = userProfiles[0];

// 4. Ensure each user has their specific transactions in db.transactions
const existingTxns = db.transactions || [];
const userSpecificTxns = [
  // Rahul Sharma txns
  {
    id: 'TXN_RAHUL_01',
    userId: 'EPY43210',
    userMobile: '9876543210',
    timestamp: '2026-11-21T11:20:00.000Z',
    title: 'Wallet Topup via PhonePe UPI',
    category: 'Wallet',
    amount: 3500,
    type: 'WALLET_ADD',
    status: 'SUCCESS',
    utr: 'UPI_983471029384'
  },
  {
    id: 'TXN_RAHUL_02',
    userId: 'EPY43210',
    userMobile: '9876543210',
    timestamp: '2026-11-22T16:10:00.000Z',
    title: 'Paid for Milton Insulated Flask',
    category: 'Shopping',
    amount: -449,
    type: 'CHECKOUT',
    status: 'SUCCESS',
    utr: 'ORD_MILTON_449'
  },
  // Priya Patel txns
  {
    id: 'TXN_PRIYA_01',
    userId: 'EPY12345',
    userMobile: '9812345678',
    timestamp: '2026-11-20T14:40:00.000Z',
    title: 'Wallet Added via ICICI NetBanking',
    category: 'Wallet',
    amount: 2000,
    type: 'WALLET_ADD',
    status: 'SUCCESS',
    utr: 'NET_ICICI_2000'
  },
  {
    id: 'TXN_PRIYA_02',
    userId: 'EPY12345',
    userMobile: '9812345678',
    timestamp: '2026-11-21T18:00:00.000Z',
    title: 'Bought Domino\'s Pizza Voucher',
    category: 'Gift Card',
    amount: -180,
    type: 'DEBIT',
    status: 'SUCCESS',
    utr: 'VCH_DOMINOS_180'
  },
  // Amit Kumar txns
  {
    id: 'TXN_AMIT_01',
    userId: 'EPY99887',
    userMobile: '9899112233',
    timestamp: '2026-11-19T09:15:00.000Z',
    title: 'Wallet Load via Paytm UPI',
    category: 'Wallet',
    amount: 2500,
    type: 'WALLET_ADD',
    status: 'SUCCESS',
    utr: 'UPI_PAYTM_2500'
  },
  {
    id: 'TXN_AMIT_02',
    userId: 'EPY99887',
    userMobile: '9899112233',
    timestamp: '2026-11-20T17:30:00.000Z',
    title: 'Jio Mobile Recharge Plan',
    category: 'Recharge',
    amount: -299,
    type: 'RECHARGE',
    status: 'SUCCESS',
    utr: 'REC_JIO_299'
  },
  // Suresh Verma txns
  {
    id: 'TXN_SURESH_01',
    userId: 'EPY55443',
    userMobile: '9845012345',
    timestamp: '2026-11-18T13:00:00.000Z',
    title: 'Wallet Added via Axis Bank UPI',
    category: 'Wallet',
    amount: 1000,
    type: 'WALLET_ADD',
    status: 'SUCCESS',
    utr: 'UPI_AXIS_1000'
  },
  {
    id: 'TXN_SURESH_02',
    userId: 'EPY55443',
    userMobile: '9845012345',
    timestamp: '2026-11-19T11:15:00.000Z',
    title: 'Lucky Draw Ticket Purchase #1',
    category: 'Lucky Draw',
    amount: -50,
    type: 'PURCHASE',
    status: 'SUCCESS',
    utr: 'LUCK_TICKET_50'
  }
];

// Combine without duplicates
const existingIds = new Set(existingTxns.map(t => t.id));
userSpecificTxns.forEach(t => {
  if (!existingIds.has(t.id)) {
    existingTxns.push(t);
  }
});
db.transactions = existingTxns;

fs.writeFileSync('server/db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Seeded database with fully dynamic users, payment details, deposit requests, and transactions!');
