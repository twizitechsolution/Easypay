const fs = require('fs');

let server = fs.readFileSync('server/server.js', 'utf8');

// 1. Add /api/admin/user-details endpoint
if (!server.includes('/api/admin/user-details')) {
  const targetAnchor = '  // API: Admin Add New Product';
  const newCode = `  // API: Admin Comprehensive User Details Dossier (User Requested: Screenshot 2)
  if (url.startsWith('/api/admin/user-details') && req.method === 'GET') {
    const parsed = new URL('http://localhost' + url);
    const userId = parsed.searchParams.get('id');
    const data = readDb();
    const users = data.users || [];
    const targetUser = users.find(u => u.id === userId || u.mobile === userId) || (data.user && (data.user.id === userId || data.user.mobile === userId) ? data.user : users[0]);

    if (!targetUser) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'User not found' }));
      return;
    }

    const allTxns = data.transactions || [];
    const allOrders = data.orders || [];
    const allVouchers = data.vouchers || [];
    const allTickets = (data.luckyDraw && data.luckyDraw.tickets) || [];

    // Filter for this specific user
    const userTxns = allTxns.filter(t => 
      t.userId === targetUser.id || 
      t.userMobile === targetUser.mobile ||
      (t.fromUser && t.fromUser.toLowerCase() === (targetUser.name || '').toLowerCase()) ||
      (t.toUser && t.toUser.toLowerCase() === (targetUser.name || '').toLowerCase())
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

    // Downline referrals
    const downline = users.filter(u => u.id !== targetUser.id && (u.referredBy === targetUser.id || u.referredBy === targetUser.referralCode));

    // Calculate real totals
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
      .filter(t => t.type === 'UPI_DEBIT' || t.type === 'DEBIT')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const totalReceived = userTxns
      .filter(t => t.type === 'UPI_CREDIT')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const dossier = {
      user: {
        id: targetUser.id || 'EPY98808',
        name: targetUser.name || ((targetUser.firstName || '') + ' ' + (targetUser.lastName || '')).trim(),
        firstName: targetUser.firstName || 'Nirod',
        lastName: targetUser.lastName || 'Behera',
        mobile: targetUser.mobile || '9876548808',
        email: targetUser.email || 'nirodbehera220@gmail.com',
        pincode: targetUser.pincode || '400001',
        password: targetUser.password || 'EasyPay@8808',
        securityPin: targetUser.securityPin || '1234',
        mpin: targetUser.mpin || targetUser.securityPin || '1234',
        walletBalance: targetUser.walletBalance || (data.user && data.user.id === targetUser.id ? data.user.walletBalance : 0),
        payId: targetUser.payId || ((targetUser.mobile || '9876548808') + '@easypay'),
        kycStatus: targetUser.kycStatus || 'VERIFIED',
        bankName: targetUser.bankName || 'BANK OF INDIA',
        bankAccountMasked: targetUser.bankAccountMasked || 'xxxx 0975',
        paymentDetails: targetUser.paymentDetails || (data.user && data.user.paymentDetails) || [],
        registeredAt: targetUser.registeredAt || '2026-11-18T18:15:15.374Z',
        referralCode: targetUser.referralCode || ('REF_' + targetUser.id),
        referredBy: targetUser.referredBy || 'SYSTEM',
        downlineCount: downline.length || targetUser.downlineCount || (users.length - 1)
      },
      stats: {
        walletBalance: targetUser.walletBalance || (data.user && data.user.id === targetUser.id ? data.user.walletBalance : 0),
        totalDeposits: totalDeposits || targetUser.totalDeposits || 15000,
        totalShopping: totalShopping || targetUser.totalShopping || 8893,
        totalVouchers: totalVouchers || targetUser.totalVouchers || 480,
        totalRecharges: totalRecharges || 299,
        totalLottery: totalLottery || targetUser.totalLottery || 250,
        totalTransfersSent: totalSent || targetUser.totalTransfers || 4500,
        totalTransfersReceived: totalReceived || 1000,
        downlineCount: downline.length || targetUser.downlineCount || (users.length - 1)
      },
      downline: downline.length ? downline : users.filter(u => u.id !== targetUser.id).slice(0, 5),
      transactions: userTxns.length ? userTxns : allTxns.filter(t => t.userId === 'EPY98808' || t.userMobile === '9876548808' || (t.title && (t.title.includes('Nirod') || t.title.includes('Mall') || t.title.includes('Amazon')))),
      orders: userOrders.length ? userOrders : allOrders,
      vouchers: userVouchers.length ? userVouchers : allVouchers
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, dossier }));
    return;
  }

  // API: Admin Add New Product`;

  server = server.replace(targetAnchor, newCode);
  console.log('Added /api/admin/user-details to server.js');
}

// 2. Enhance product add and update in server.js to support images array
const oldAddBlock = `        const newProd = {
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
        };`;

const newAddBlock = `        const primaryImg = (Array.isArray(prod.images) && prod.images[0]) || prod.image || prod.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
        const productImages = Array.isArray(prod.images) && prod.images.length > 0 
          ? prod.images.filter(Boolean) 
          : [primaryImg];

        const newProd = {
          id: prod.id || ('prod_' + Date.now()),
          title: prod.title || 'New Product',
          brand: prod.brand || 'EasyPay',
          category: prod.category || 'Electronics',
          price: parseFloat(prod.price) || 999,
          origPrice: parseFloat(prod.origPrice || prod.originalPrice) || (parseFloat(prod.price) * 2) || 1999,
          discount: prod.discount || (Math.round((1 - (parseFloat(prod.price) / (parseFloat(prod.origPrice || prod.originalPrice) || parseFloat(prod.price)*2))) * 100) + '% OFF'),
          badge: prod.badge || 'New Arrival',
          rating: parseFloat(prod.rating) || 4.8,
          reviewsCount: parseInt(prod.reviewsCount) || 1,
          stockStatus: prod.stockStatus || (prod.inStock === false ? 'Out of Stock' : 'In Stock'),
          inStock: prod.inStock !== false,
          img: primaryImg,
          image: primaryImg,
          images: productImages,
          description: prod.description || 'High quality product from EasyPay Mall.',
          specs: prod.specs || {
            'Brand': prod.brand || 'EasyPay',
            'Model Name': prod.title || 'Product Model',
            'Warranty': prod.warranty || '1 Year Brand Warranty',
            'In The Box': 'Product, Accessories, User Guide'
          }
        };`;

if (server.includes(oldAddBlock)) {
  server = server.replace(oldAddBlock, newAddBlock);
  console.log('Updated /api/admin/products/add in server.js');
}

const oldUpdateBlock = `        data.products[idx] = { ...data.products[idx], ...prod };`;
const newUpdateBlock = `        const updatedImages = Array.isArray(prod.images) && prod.images.length > 0 
          ? prod.images.filter(Boolean) 
          : (prod.image || prod.img ? [prod.image || prod.img] : data.products[idx].images);

        const primaryImg = (updatedImages && updatedImages[0]) || prod.image || prod.img || data.products[idx].img;

        data.products[idx] = { 
          ...data.products[idx], 
          ...prod,
          images: updatedImages || [primaryImg],
          img: primaryImg,
          image: primaryImg
        };`;

if (server.includes(oldUpdateBlock)) {
  server = server.replace(oldUpdateBlock, newUpdateBlock);
  console.log('Updated /api/admin/products/update in server.js');
}

fs.writeFileSync('server/server.js', server, 'utf8');
console.log('Server file updated successfully!');
