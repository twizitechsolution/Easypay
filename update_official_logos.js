const fs = require('fs');
const dbPath = 'server/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Curated authentic official logos for top Indian gift card brands
const officialLogos = {
  apple_app_store: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    bgColor: '#0071E3',
    iconClass: null
  },
  dominos: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg',
    bgColor: '#006491',
    iconClass: null
  },
  amazon_shopping: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    bgColor: '#232F3E',
    iconClass: null
  },
  myntra: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Myntra_logo.png',
    bgColor: '#FF3F6C',
    iconClass: null
  },
  amazon_prime: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg',
    bgColor: '#00A8E1',
    iconClass: null
  },
  smart_bazaar: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Reliance_Retail_logo.svg',
    bgColor: '#E11926',
    iconClass: null
  },
  bgmi: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Battlegrounds_Mobile_India_logo.png',
    bgColor: '#1A1A1A',
    iconClass: null
  },
  decathlon: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Decathlon_Logo.png',
    bgColor: '#0082C3',
    iconClass: null
  },
  flipkart: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg',
    bgColor: '#2874F0',
    iconClass: null
  },
  google_play: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg',
    bgColor: '#FFFFFF',
    iconClass: null
  },
  amazon_pay: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Amazon_Pay_logo.svg',
    bgColor: '#232F3E',
    iconClass: null
  },
  zomato: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg',
    bgColor: '#E23744',
    iconClass: null
  },
  swiggy: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg',
    bgColor: '#FC8019',
    iconClass: null
  },
  pvr: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/PVR_Cinemas_logo.svg',
    bgColor: '#FDB813',
    iconClass: null
  },
  starbucks: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg',
    bgColor: '#006241',
    iconClass: null
  },
  uber: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    bgColor: '#000000',
    iconClass: null
  },
  klook: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Klook_Logo.png',
    bgColor: '#FF5722',
    iconClass: null
  },
  urban_company: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Urban_Company_Logo.svg',
    bgColor: '#1A1A1A',
    iconClass: null
  },
  eazydiner: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/EazyDiner_Logo.png',
    bgColor: '#8E24AA',
    iconClass: null
  },
  real_cricket: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e6/Real_Cricket_logo.png',
    bgColor: '#0D47A1',
    iconClass: null
  },
  pronto: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Pronto_Logo.png',
    bgColor: '#00BFA5',
    iconClass: null
  },
  wendys: {
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/32/Wendy%27s_full_logo_2012.svg',
    bgColor: '#D32F2F',
    iconClass: null
  },
  noise: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Noise_Logo.png',
    bgColor: '#1A1A1A',
    iconClass: null
  },
  rare_rabbit: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/The_House_of_Rare_Logo.png',
    bgColor: '#212121',
    iconClass: null
  },
  giva: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/GIVA_Jewellery_Logo.png',
    bgColor: '#E91E63',
    iconClass: null
  },
  jiomart: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/88/JioMart_logo.svg',
    bgColor: '#0066CC',
    iconClass: null
  }
};

(db.giftCards || []).forEach(card => {
  card.iconClass = null; // Remove clipart
  if (officialLogos[card.id]) {
    card.logo = officialLogos[card.id].logo;
    card.bgColor = officialLogos[card.id].bgColor;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Updated db.json with official logos and removed clipart iconClass.');
