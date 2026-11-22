const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'assets', 'brands');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const brands = {
  'apple.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#000000"/>
    <path fill="#FFFFFF" d="M118.2 92.5c.2 21.6 19 28.8 19.2 28.9-.2.5-3 10.3-9.9 20.4-6 8.7-12.2 17.4-22 17.6-9.6.2-12.7-5.7-23.7-5.7s-14.4 5.5-23.6 5.8c-9.6.4-16.7-9.5-22.8-18.3C23 123.6 13.5 96.6 13.5 70.8c0-26.6 17.3-40.7 34.3-41 9.4-.2 18.3 6.3 24.1 6.3 5.8 0 16.6-7.8 27.9-6.6 4.7.2 18 1.9 26.5 14.3-.7.4-15.8 9.2-15.6 27.2M101.9 27.2c4.9-5.9 8.2-14.1 7.3-22.4-7 .3-15.6 4.7-20.6 10.6-4.4 5.1-8.2 13.5-7.2 21.5 7.9.6 15.6-3.8 20.5-9.7z"/>
  </svg>`,

  'dominos.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#006491"/>
    <g transform="translate(85,85) rotate(-45) translate(-50,-50)">
      <rect x="5" y="5" width="42" height="90" rx="10" fill="#E31837"/>
      <rect x="53" y="5" width="42" height="90" rx="10" fill="#006491" stroke="#FFFFFF" stroke-width="4"/>
      <circle cx="26" cy="30" r="8" fill="#FFFFFF"/>
      <circle cx="26" cy="70" r="8" fill="#FFFFFF"/>
      <circle cx="74" cy="50" r="8" fill="#FFFFFF"/>
    </g>
  </svg>`,

  'amazon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#131921"/>
    <text x="85" y="92" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="40" font-weight="900" text-anchor="middle">amazon</text>
    <path d="M42 112 Q85 132 128 112" fill="none" stroke="#FF9900" stroke-width="6" stroke-linecap="round"/>
    <polygon points="124,106 134,113 124,120" fill="#FF9900"/>
  </svg>`,

  'myntra.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#FFFFFF" stroke="#FCE7F3" stroke-width="2"/>
    <g transform="translate(25, 30)">
      <path d="M15 75 Q38 15 52 45 Q66 75 76 45 Q90 15 110 75" fill="none" stroke="#FF3F6C" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M38 48 Q52 86 62 68 Q72 48 88 86" fill="none" stroke="#F26A10" stroke-width="14" stroke-linecap="round" opacity="0.95"/>
    </g>
    <text x="85" y="142" fill="#282C3F" font-family="Arial, sans-serif" font-size="19" font-weight="900" letter-spacing="1.5" text-anchor="middle">MYNTRA</text>
  </svg>`,

  'amazon_prime.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#00A8E1"/>
    <text x="85" y="88" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="36" font-weight="900" text-anchor="middle" font-style="italic">prime</text>
    <path d="M48 108 Q85 124 122 108" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>
    <polygon points="118,103 126,108 119,114" fill="#FFFFFF"/>
  </svg>`,

  'smart_bazaar.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#EE2A24"/>
    <circle cx="85" cy="58" r="26" fill="#FFFFFF"/>
    <path d="M72 65 L85 45 L98 65 Z" fill="#EE2A24"/>
    <text x="85" y="112" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="900" text-anchor="middle">SMART</text>
    <text x="85" y="136" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="2" text-anchor="middle">BAZAAR</text>
  </svg>`,

  'bgmi.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#0F1923"/>
    <rect x="28" y="32" width="114" height="74" rx="14" fill="#F59E0B"/>
    <text x="85" y="80" fill="#000000" font-family="Arial Black, Impact, sans-serif" font-size="32" font-weight="900" text-anchor="middle">BGMI</text>
    <text x="85" y="136" fill="#F59E0B" font-family="Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="1.5" text-anchor="middle">KRAFTON</text>
  </svg>`,

  'decathlon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="100%" height="100%">
    <rect width="170" height="170" rx="36" fill="#0082C3"/>
    <text x="85" y="96" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="1" text-anchor="middle">DECATHLON</text>
  </svg>`
};

for (const [name, content] of Object.entries(brands)) {
  fs.writeFileSync(path.join(dir, name), content.trim());
  console.log('Successfully written:', name);
}
