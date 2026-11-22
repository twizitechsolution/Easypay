const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const initialProducts = [
  {
    id: 'prod_1',
    title: 'boAt Airdopes 141 ANC TWS Earbuds 42H Playtime',
    brand: 'boAt',
    category: 'Audio',
    price: 899,
    origPrice: 2499,
    discount: '64% OFF',
    badge: 'Best Seller',
    rating: 4.8,
    reviewsCount: 1420,
    stockStatus: 'In Stock',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
    description: 'boAt Airdopes 141 ANC comes with 32 dB Active Noise Cancellation, 42 hours massive playback, ENx technology for crystal-clear calls, ASAP fast charge (10 mins = 150 mins playtime), and IPX5 water resistance.',
    specs: {
      'Brand': 'boAt',
      'Model Name': 'Airdopes 141 ANC',
      'Color': 'Gunmetal Black',
      'Form Factor': 'True Wireless In-Ear',
      'Connectivity': 'Bluetooth v5.3',
      'Noise Cancellation': '32dB Active Noise Cancellation (ANC)',
      'Battery Life': 'Up to 42 Hours Total Playback',
      'Charging Time': '1 Hour (ASAP Fast Charge)',
      'Water Resistance': 'IPX5 Sweat & Water Resistant',
      'Warranty': '1 Year Brand Replacement Warranty',
      'In The Box': 'Earbuds, Charging Case, Type-C Cable, Extra Ear Tips, User Manual'
    }
  },
  {
    id: 'prod_2',
    title: 'Fire-Boltt Ultra AMOLED HD Bluetooth Calling Smartwatch',
    brand: 'Fire-Boltt',
    category: 'Smartwatches',
    price: 1499,
    origPrice: 4999,
    discount: '70% OFF',
    badge: 'Top Rated',
    rating: 4.9,
    reviewsCount: 2310,
    stockStatus: 'In Stock',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    description: 'Fire-Boltt Ultra features a 1.96-inch Always-on AMOLED display with 410x502 resolution, Bluetooth calling with high-fidelity speaker & microphone, 120+ sports modes, 24/7 SpO2 & heart rate tracking, and 7-day battery life.',
    specs: {
      'Brand': 'Fire-Boltt',
      'Model Name': 'Ultra AMOLED',
      'Color': 'Starlight Silver',
      'Display': '1.96" AMOLED (410x502 px, 600 nits)',
      'Battery Life': 'Up to 7 Days (2 Days with Calling)',
      'Sensors': 'Optical Heart Rate, SpO2, Sleep Monitor',
      'Water Resistance': 'IP68 Dust & Water Proof',
      'Warranty': '1 Year Manufacturer Warranty',
      'In The Box': 'Smartwatch, Magnetic Charging Cable, User Manual, Warranty Card'
    }
  },
  {
    id: 'prod_3',
    title: 'Mi 20000mAh Ultra-Fast Two-Way 22.5W Power Bank',
    brand: 'Mi',
    category: 'Electronics',
    price: 999,
    origPrice: 1999,
    discount: '50% OFF',
    badge: 'Hot Deal',
    rating: 4.7,
    reviewsCount: 890,
    stockStatus: 'In Stock',
    img: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&auto=format&fit=crop&q=60',
    description: 'High capacity 20000mAh lithium-polymer battery powerbank supporting 22.5W two-way fast charging. Triple output ports (2x USB-A + 1x Type-C) to charge 3 devices simultaneously with 12-layer advanced circuit chip protection.',
    specs: {
      'Brand': 'Mi',
      'Capacity': '20000 mAh',
      'Output Power': '22.5W Two-Way Fast Charge',
      'Ports': '2x USB-A Output, 1x Type-C Input/Output, 1x Micro-USB Input',
      'Battery Type': 'Lithium-Polymer',
      'Protection': '12-Layer Advanced Short Circuit & Overheat Protection',
      'Warranty': '6 Months Brand Warranty',
      'In The Box': 'Power Bank, Type-C Charging Cable, User Guide'
    }
  },
  {
    id: 'prod_4',
    title: 'Sparx Casual Breathable Lightweight Running Shoes',
    brand: 'Sparx',
    category: 'Fashion',
    price: 799,
    origPrice: 1999,
    discount: '60% OFF',
    badge: 'Popular',
    rating: 4.6,
    reviewsCount: 650,
    stockStatus: 'In Stock',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    description: 'Engineered mesh upper for superior breathability and comfort. Memory foam insole provides responsive cushioning for daily running, gym workouts, and casual streetwear with anti-skid rubber sole.',
    specs: {
      'Brand': 'Sparx',
      'Outer Material': 'Breathable Mesh',
      'Sole Material': 'EVA Anti-Skid Rubber',
      'Closure': 'Lace-Up',
      'Weight': '280g per shoe',
      'Warranty': '30 Days Quality Replacement',
      'In The Box': '1 Pair of Running Shoes'
    }
  },
  {
    id: 'prod_5',
    title: 'JBL RGB Portable Wireless Bluetooth Party Speaker 20W',
    brand: 'JBL',
    category: 'Audio',
    price: 1199,
    origPrice: 2999,
    discount: '60% OFF',
    badge: 'Mega Deal',
    rating: 4.8,
    reviewsCount: 1120,
    stockStatus: 'In Stock',
    img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
    description: 'Immersive deep bass signature sound with customizable 360-degree dynamic RGB light show. 12-hour continuous battery life, built-in noise-cancelling speakerphone, and IPX7 waterproof rating.',
    specs: {
      'Brand': 'JBL',
      'Audio Output': '20W RMS Pro Sound',
      'Battery Life': 'Up to 12 Hours Playtime',
      'Connectivity': 'Bluetooth 5.1, AUX, TF Card, USB',
      'Waterproof': 'IPX7 Waterproof',
      'Warranty': '1 Year Brand Warranty',
      'In The Box': 'Bluetooth Speaker, USB-C Cable, AUX Cable, Quick Start Guide'
    }
  },
  {
    id: 'prod_6',
    title: 'Milton Insulated Double Wall Stainless Steel Flask 1000ml',
    brand: 'Milton',
    category: 'Home',
    price: 449,
    origPrice: 999,
    discount: '55% OFF',
    badge: 'Essential',
    rating: 4.7,
    reviewsCount: 780,
    stockStatus: 'In Stock',
    img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60',
    description: 'Vacuum insulated double-walled 304 food-grade stainless steel bottle. Keeps beverages piping hot for 24 hours or ice cold for 24 hours. Leak-proof, sweat-proof, and BPA-free.',
    specs: {
      'Brand': 'Milton',
      'Capacity': '1000 ml',
      'Material': 'Grade 304 Stainless Steel',
      'Insulation': 'Double Wall Vacuum Insulated (24H Hot / 24H Cold)',
      'Leak Proof': 'Yes, 100% Spill Proof Lid',
      'Warranty': '1 Year Manufacturing Warranty',
      'In The Box': '1 Insulated Steel Flask'
    }
  }
];

const initialCoupons = [
  {
    code: 'EASYPAY50',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 0,
    description: 'Flat ₹50 Instant Discount on Any Order',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    code: 'WELCOME100',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 500,
    description: 'Flat ₹100 Discount on Orders Above ₹500',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    code: 'BACHAT20',
    discountType: 'percent',
    discountValue: 20,
    maxDiscount: 200,
    minOrder: 300,
    description: '20% Mega Cashback/Discount up to ₹200',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
];

db.products = initialProducts;
db.coupons = initialCoupons;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully seeded db.products (' + db.products.length + ') and db.coupons (' + db.coupons.length + ') in ' + dbPath);
