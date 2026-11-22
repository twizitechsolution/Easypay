const fs = require('fs');

const db = JSON.parse(fs.readFileSync('server/db.json', 'utf8'));

db.user = {
  id: 'EPY98808',
  firstName: 'Nirod',
  lastName: 'Behera',
  name: 'Nirod Behera',
  mobile: '9876548808',
  maskedMobile: 'xxxxxx8808',
  email: 'nirodbehera220@gmail.com',
  pincode: '400001',
  payId: '9876548808@easypay',
  walletBalance: 14397,
  securityPin: '1234',
  mpin: '1234',
  bankName: 'STATE BANK OF INDIA',
  bankAccountMasked: 'xxxx 8808',
  cashbackEarned: 540,
  paymentDetails: [
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
      upiId: '9876548808@easypay',
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
  ]
};

// Filter out old arman khan from users array and ensure Nirod Behera is present
if (Array.isArray(db.users)) {
  db.users = db.users.filter(u => u.name !== 'arman khan' && u.mobile !== '7013893165');
  const existing = db.users.find(u => u.mobile === '9876548808' || u.id === 'EPY98808');
  if (existing) {
    Object.assign(existing, {
      id: 'EPY98808',
      firstName: 'Nirod',
      lastName: 'Behera',
      name: 'Nirod Behera',
      mobile: '9876548808',
      maskedMobile: 'xxxxxx8808',
      email: 'nirodbehera220@gmail.com',
      pincode: '400001',
      payId: '9876548808@easypay'
    });
  } else {
    db.users.unshift({
      id: 'EPY98808',
      firstName: 'Nirod',
      lastName: 'Behera',
      name: 'Nirod Behera',
      mobile: '9876548808',
      maskedMobile: 'xxxxxx8808',
      email: 'nirodbehera220@gmail.com',
      pincode: '400001',
      payId: '9876548808@easypay'
    });
  }
}

fs.writeFileSync('server/db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated server/db.json with Nirod Behera (EPY98808, 9876548808)');
